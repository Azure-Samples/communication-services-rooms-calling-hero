// © Microsoft Corporation. All rights reserved.

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Azure;
using Azure.Communication;
using Azure.Communication.Identity;
using Azure.Communication.Rooms;
using Azure.Core;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;

namespace Calling
{
    public class RoomServiceClientController : Controller, IRoomServiceClientController
    {
        private readonly CommunicationIdentityClient _client;
        private readonly RoomsClient _roomsClient;

        public RoomServiceClientController(IConfiguration configuration)
        {
            _client = new CommunicationIdentityClient(configuration["ResourceConnectionString"]);
            _roomsClient = new RoomsClient(configuration["ResourceConnectionString"]);
        }

        public class UpdateRoomData
        {
            // true adds participant while false deletes participant
            public UpdateParticipant[] updateParticipants { get; set; }
        }

        /// <summary>
        /// Gets a token to be used to initalize the call client
        /// </summary>
        /// <returns></returns>
        [Route("/token")]
        [HttpGet]
        public async Task<IActionResult> GetAsync()
        {
            try
            {
                Response<CommunicationUserIdentifierAndToken> response = await _client.CreateUserAndTokenAsync(scopes: new[] { CommunicationTokenScope.VoIP });

                var responseValue = response.Value;

                var jsonFormattedUser = new
                {
                    communicationUserId = responseValue.User.Id
                };

                var clientResponse = new
                {
                    user = jsonFormattedUser,
                    token = responseValue.AccessToken.Token,
                    expiresOn = responseValue.AccessToken.ExpiresOn
                };

                return this.Ok(clientResponse);
            }
            catch (RequestFailedException ex)
            {
                Console.WriteLine($"Error occured while Generating Token: {ex}");
                return this.Ok(this.Json(ex));
            }
        }

        /// <summary>
        /// Gets a token to be used to initalize the call client
        /// </summary>
        /// <returns></returns>
        [Route("/refreshToken/{identity}")]
        [HttpGet]
        public async Task<IActionResult> GetAsync(string identity)
        {
            try
            {
                CommunicationUserIdentifier identifier = new CommunicationUserIdentifier(identity);
                Response<AccessToken> response = await _client.GetTokenAsync(identifier, scopes: new[] { CommunicationTokenScope.VoIP });

                var responseValue = response.Value;
                var clientResponse = new
                {
                    token = responseValue.Token,
                    expiresOn = responseValue.ExpiresOn
                };

                return this.Ok(clientResponse);
            }
            catch (RequestFailedException ex)
            {
                Console.WriteLine($"Error occured while Generating Token: {ex}");
                return this.Ok(this.Json(ex));
            }
        }

        [Route("/getRoom/{roomId}")]
        [HttpGet]
        public async Task<IActionResult> GetRoom(string roomId)
        {
            try
            {
                CommunicationRoom roomInfo = await _roomsClient.GetRoomAsync(roomId);
                AsyncPageable<RoomParticipant> roomParticipants = _roomsClient.GetParticipantsAsync(roomId);
                IList<ResponseParticipantDto> participants = new List<ResponseParticipantDto>();

                await foreach (Page<RoomParticipant> participantPage in roomParticipants.AsPages())
                {
                    foreach (RoomParticipant participant in participantPage.Values)
                    {
                        participants.Add(new ResponseParticipantDto { Identity = participant.CommunicationIdentifier.RawId, Role = GetParticipantRoleString(participant.Role) });
                    }
                }

                return this.Ok(new
                {
                    RoomId = roomId,
                    CreatedAt = roomInfo.CreatedAt,
                    ValidFrom = roomInfo.ValidFrom,
                    ValidUntil = roomInfo.ValidUntil,
                    Participants = participants
                });
            }
            catch (RequestFailedException ex)
            {
                Console.WriteLine($"Error occured while creating Room: {ex}");
                return this.Ok(this.Json(ex));
            }
        }

        [Route("/createRoom/{userId}")]
        [HttpPost]
        public async Task<IActionResult> CreateRoom(string userId)
        {
            try
            {
                DateTimeOffset validFrom = DateTimeOffset.UtcNow;
                DateTimeOffset validUntil = validFrom.AddDays(30);
                CommunicationUserIdentifier identifier = new CommunicationUserIdentifier(userId);
                RoomParticipant participant1 = new RoomParticipant(identifier);
                List<RoomParticipant> invitedParticipants = new List<RoomParticipant> { participant1 };

                Response<CommunicationRoom> createRoomResponse = await _roomsClient.CreateRoomAsync(validFrom, validUntil, invitedParticipants);

                return this.Ok(new
                {
                    roomId = createRoomResponse.Value.Id
                });
            }
            catch (RequestFailedException ex)
            {
                Console.WriteLine($"Error occured while retrieving Room: {ex}");
                return this.Ok(this.Json(ex));
            }
        }

        [Route("/updateRoom/{roomId}")]
        [HttpPatch]
        public async Task<IActionResult> UpdateRoom([FromRoute] string roomId, [FromBody] UpdateRoomData updateRoomData)
        {
            try
            {
                if (updateRoomData == null)
                {
                    return this.Ok();
                }

                IList<RoomParticipant> updateParticipants = new List<RoomParticipant>();
                IList<CommunicationIdentifier> removeParticipants = new List<CommunicationIdentifier>();
                foreach (UpdateParticipant participant in updateRoomData.updateParticipants)
                {
                    if (participant.add)
                    {
                        updateParticipants.Add(new RoomParticipant(new CommunicationUserIdentifier(participant.identity)) { Role = GetParticipantRole(participant.role) });
                    }
                    else
                    {
                        removeParticipants.Add(new CommunicationUserIdentifier(participant.identity));
                    }
                }

                if (updateParticipants.Any())
                {
                    Response updateParticipantResponse = await _roomsClient.AddOrUpdateParticipantsAsync(roomId, updateParticipants);
                }

                if (removeParticipants.Any())
                {
                    Response removeParticipantResponse = await _roomsClient.RemoveParticipantsAsync(roomId, removeParticipants);
                }

                return this.Ok();
            }
            catch (RequestFailedException ex)
            {
                Console.WriteLine($"Error occured while adding user: {ex}");
                return this.Ok(this.Json(ex));
            }
        }

        private ParticipantRole GetParticipantRole(string role)
        {
            if (string.Equals(role, "Presenter", StringComparison.OrdinalIgnoreCase))
            {
                return ParticipantRole.Presenter;
            }
            else if (string.Equals(role, "Attendee", StringComparison.OrdinalIgnoreCase))
            {
                return ParticipantRole.Attendee;
            }
            else if (string.Equals(role, "Consumer", StringComparison.OrdinalIgnoreCase))
            {
                return ParticipantRole.Consumer;
            }
            else
            {
                throw new ArgumentException($"Invalid Participant Role {role}");
            }
        }

        private string GetParticipantRoleString(ParticipantRole role)
        {
            if (role == ParticipantRole.Presenter)
            {
                return "Presenter";
            }
            else if (role == ParticipantRole.Attendee)
            {
                return "Attendee";
            }
            else if (role == ParticipantRole.Consumer)
            {
                return "Consumer";
            }
            else
            {
                throw new ArgumentException($"Invalid Participant Role {role}");
            }
        }

        [Route("/deleteUser/{roomId}/{userId}")]
        [HttpPatch]
        public async Task<IActionResult> DeleteUser(string roomId, string userId)
        {
            try
            {
                List<CommunicationUserIdentifier> removedParticipants = new List<CommunicationUserIdentifier>() { new CommunicationUserIdentifier(userId) };

                Response updateRoomResponse = await _roomsClient.RemoveParticipantsAsync(roomId, removedParticipants);
                return this.Ok();
            }
            catch (RequestFailedException ex)
            {
                Console.WriteLine($"Error occured while deleting user: {ex}");
                return this.Ok(this.Json(ex));
            }
        }
    }

    public class UpdateParticipant
    {
        public string identity { get; set; }

        public bool add { get; set; }

        public string role { get; set; } = "Attendee";
    }

    public class ResponseParticipantDto
    {
        public string Identity { get; set; }
        public string Role { get; set; }
    }
}
