// © Microsoft Corporation. All rights reserved.

using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace Calling
{
    public interface IRoomServiceClientController
    {
        Task<IActionResult> CreateRoom(string userId);
        Task<IActionResult> GetRoom(string roomId);
        Task<IActionResult> UpdateRoom([FromRoute] string roomId, [FromBody] RoomServiceClientController.UpdateRoomData updateRoomData);
        Task<IActionResult> DeleteUser(string roomId, string userId);
        Task<IActionResult> GetAsync();
        Task<IActionResult> GetAsync(string identity);
    }
}