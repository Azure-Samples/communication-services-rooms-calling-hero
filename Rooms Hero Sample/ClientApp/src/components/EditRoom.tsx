// © Microsoft Corporation. All rights reserved.
import React, { useEffect, useState } from 'react';
import { Stack, PrimaryButton, Icon } from '@fluentui/react';
import { cellStyle, inputTokens, tableStyle, buttonStyle, gridBbuttonStyle } from './styles/EditRoom.styles';
import { Input } from 'reactstrap';
import { utils, UpdateParticipant, RoomParticipant, Role } from '../Utils/Utils';
import { iconStyle, listItemStyle, nestedStackTokens, editRoomStyle } from './styles/HomeScreen.styles';
export interface EditRoomProps {
    roomId: string;
    userId: string;
    userToken: string;
    userRole: Role;
    userDisplayName: string;
    setUserId(userid: string): void;
    setUserRole(userRole: Role): void;
    setUserDisplayName(userDisplayName: string): void;
    setRoomId(roomId: string): void;
    setPage(page: string): void;
}

export default (props: EditRoomProps): JSX.Element => {
    const [updateRoomId, setUpdateRoomId] = useState('');
    const [updateValidFrom, setUpdateValidFrom] = useState(new Date());
    const [updateValidUntil, setUpdateValidUntil] = useState(new Date());
    const [updatePstnDialOutEnabled, setPstnDialOutEnabled] = useState(false);
    const [foundRoom, setFoundRoom] = useState(false);
    const [updateMode, setUpdateMode] = useState(false);
    const [participantList, setParticipantList] = useState(new Array<RoomParticipant>());
    const [addParticipants, setAddParticipants] = useState(new Array<RoomParticipant>());
    const [deleteParticipants, setDeleteParticipants] = useState(new Array<RoomParticipant>());
    const [participantInputToken, setParticipantInputToken] = useState('');
    const [participantInputMri, setParticipantInputMri] = useState('');
    const [participantInputName, setParticipantInputName] = useState('');
    const [participantInputRole, setParticipantInputRole] = useState<Role>('Attendee');

    const [updateRoomErrorMessage, setUpdateRoomErrorMessage] = useState('');
    const [participantErrorMessage, setParticipantErrorMessage] = useState('');
    const PageTitleText = "Create and Manage Room";
    const RoomCreationText = "Room Successfully Created";
    const ParticpantCreationText = "Two users have already been created for your convenience with a Presenter and an Attendee Role. You can add more users as needed.";
    const AddButtonText = "Add User"
    const SaveButtonText = "Update User";
    const joinRoomButtonText = 'Join video call as selected user';
    const updateRoomFailure = `Could not update the users of room`;
    const iconName = 'SkypeCircleCheck';
    const ButtonText = updateMode ? SaveButtonText : AddButtonText;

    const addParticipantToCollection = async (role: Role, displayName: string) => {
        const tokenResponse = await utils.getTokenForUser();
        const participant: RoomParticipant = { userToken: tokenResponse.token, identity: tokenResponse.user.communicationUserId, displayName: displayName, role: role };
        if (participantList.indexOf(participant) === -1) {
            setParticipantList((arr) => [...arr, participant]);
            setAddParticipants(arr => [...arr, participant]);

            // Persist particpants to room
            await persistRoomParticipants();
        }
    }

    const updateParticipantCollection = async (currentParticipant: RoomParticipant) => {
        const filteredList = addParticipants.filter((item) => item.identity != currentParticipant.identity);
        setAddParticipants(Array<RoomParticipant>());
        setParticipantList(Array<RoomParticipant>());
        setAddParticipants(filteredList);
        setParticipantList(filteredList);
        setAddParticipants(arr => [...arr, currentParticipant]);
        setParticipantList(arr => [...arr, currentParticipant]);

        // Persist particpants to room
        await persistRoomParticipants();
    }

    const persistRoomParticipants = async () => {
        const updateParticipants = new Array<UpdateParticipant>();
        try {
            addParticipants.forEach(participant => {
                updateParticipants.push({ identity: participant.identity, role: participant.role, add: true })
            });
            deleteParticipants.forEach(participant => {
                updateParticipants.push({ identity: participant.identity, role: participant.role, add: false })
            });

            setUpdateRoomErrorMessage('');
            const updateRoom = await utils.updateRoom(updateRoomId, updateParticipants);
            props.setRoomId(updateRoom);
            console.log("App UserId:" + props.userId);
        }
        catch {
            setUpdateRoomErrorMessage(updateRoomFailure);
        }
    }

    useEffect(() => {
     

        if (!foundRoom) {
            if (props.roomId !== '') {
                try {
                    const getRoom = async () => {
                        const currentRoom = await utils.getRoom(props.roomId);
                        setUpdateRoomId(currentRoom.roomId);
                        setUpdateValidFrom(currentRoom.validFrom);
                        setUpdateValidUntil(currentRoom.validUntil);
                        setPstnDialOutEnabled(currentRoom.pstnDialOutEnabled);
                    }

                    getRoom();

                    // Add current user as presenter
                    const participant: RoomParticipant = { userToken: props.userToken, identity: props.userId, displayName: "Presenter1", role: props.userRole };
                    if (participantList.indexOf(participant) === -1) {
                        setParticipantList(arr => [...arr, participant]);
                        setAddParticipants(arr => [...arr, participant]);
                    }

                    // Add another participant as attendee
                    addParticipantToCollection("Attendee", "Attendee1");

                    setFoundRoom(true);
                    setParticipantInputMri('');
                }
                catch {
                    setFoundRoom(false);
                    setUpdateRoomId('');
                }
            }
            else {
                setFoundRoom(false);
                setUpdateRoomId('');
            }
        }
    }, []);

    return (
        <Stack>
            <Stack>
                <h1>{PageTitleText}</h1>
            </Stack>
            <Stack horizontal horizontalAlign='start' verticalAlign='center' tokens={inputTokens}>
                <Stack tokens={nestedStackTokens}>
                    <ul style={{ listStyleType: 'none', padding: 10 }}>
                        <li style={{ listStyleType: 'none', paddingLeft: 0 }}>
                            <Icon className={iconStyle} iconName={iconName} /><b>{RoomCreationText}</b>
                            <div style={editRoomStyle}>
                                <span style={editRoomStyle}>Room ID:</span><span style={editRoomStyle}><Input type='text' value={updateRoomId} disabled={foundRoom} onChange={e => setUpdateRoomId(e.target.value)} /></span>
                                <span style={editRoomStyle}>Valid From:</span><span style={editRoomStyle}> <input type="text" value={updateValidFrom.toString()} disabled={foundRoom} /></span>
                                <span style={editRoomStyle}>Valid Until:</span><span style={editRoomStyle}><input type="text" value={updateValidUntil.toString()} disabled={foundRoom} /></span>
                                <span style={editRoomStyle}>PSTN Dial Out Enabled:</span><span style={editRoomStyle}><input type="text" value={updatePstnDialOutEnabled.toString()} disabled={foundRoom} /></span>
                            </div>
                        </li>
                        <li className={listItemStyle}>
                            <Icon className={iconStyle} iconName={iconName} /><b>{ParticpantCreationText}</b>
                        </li>
                    </ul>
                </Stack>
            </Stack>
            <Stack horizontalAlign='start'>
                <div style={editRoomStyle}>
                    <span style={editRoomStyle}><b>Add/Update Users</b></span>
                    <span style={editRoomStyle}><Input type='text' style={{ width:"30rem" }} value={participantInputName} onChange={e => setParticipantInputName(e.target.value)} /></span>
                    <span style={editRoomStyle}>
                        <select
                            value={participantInputRole}
                            onChange={(e) => {
                                setParticipantInputRole(e.target.value as unknown as Role);
                            }}>
                            {(["Presenter", "Attendee", "Consumer"]).map((key) => (
                                <option value={key} key={key}>{key}
                                </option>
                            ))}
                        </select></span>
                    <span style={editRoomStyle}><PrimaryButton className={buttonStyle} onClick={() => {
                        setParticipantErrorMessage('');
                        const newUserToken: string = participantInputToken;
                        const newUserId: string = participantInputMri;
                        const newName: string = participantInputName;
                        const newRole = participantInputRole;
                        const currentParticipant = { userToken: newUserToken, identity: newUserId, displayName: newName, role: newRole };
                        if (!newName) {
                            setParticipantErrorMessage(`Please provide participant name.`);
                            return;
                        }

                        if (!newUserId) {
                            // Add new participant
                            addParticipantToCollection(newRole, newName)
                            const indexOfParticipant = deleteParticipants.filter(item => item.identity === currentParticipant.identity);
                            if (indexOfParticipant.length > 0) {
                                const filteredList = deleteParticipants.filter((item) => item.identity !== currentParticipant.identity);
                                setDeleteParticipants(filteredList);
                            }
                        }
                        else if (participantList.filter(item => item.identity === newUserId && item.displayName == newName && item.role === newRole).length > 0) {
                            // Existing participant with same role, no need to add
                            setParticipantErrorMessage(`The user ${participantInputName} already exists in the room`);
                        }
                        else if (participantList.filter(item => item.identity === newUserId && (item.displayName !== newName || item.role !== newRole)).length > 0) {
                            // Existing participant with different role, update
                            updateParticipantCollection(currentParticipant);
                        }

                        // Clear out input fields
                        setParticipantInputMri('');
                        setParticipantInputName('');
                        setParticipantInputRole("Attendee");

                        setUpdateMode(false);
                    }}>{ButtonText}</PrimaryButton></span>
                </div>
                <div style={editRoomStyle}><span style={{ color: 'red', fontSize: '0.8rem' }}>{participantErrorMessage}</span></div>
                <div style={editRoomStyle}>
                    {participantList.length > 0 ?
                        <table className={tableStyle}>
                            <thead>
                                <tr className={cellStyle}>
                                    <th className={cellStyle}>Select</th>
                                    <th className={cellStyle}>Display Name</th>
                                    <th className={cellStyle}>Identity</th>
                                    <th className={cellStyle}>Role</th>
                                    <th className={cellStyle}>Invite Link</th>
                                    <th className={cellStyle}>Update User</th>
                                </tr>
                            </thead>
                            <tbody>
                                {participantList.map((participant) => (
                                    <tr className={cellStyle} key={participant.identity}>
                                        <td className={cellStyle}>
                                            <input
                                                type="radio"
                                                value={participant.identity} // this is te value which will be picked up after radio button change
                                                checked={props.userId == participant.identity} // when this is true it show the male radio button in checked 
                                                onChange={() => {
                                                    props.setUserId(participant.identity);
                                                    props.setUserRole(participant.role);
                                                    props.setUserDisplayName(participant.displayName);
                                                    console.log(props.userId);
                                                }} // whenever it changes from checked to uncheck or via-versa it goes to the handleRadioChange function
                                            />
                                        </td>
                                        <td className={cellStyle}>{participant.displayName}</td>
                                        <td className={cellStyle}>{participant.identity}</td>
                                        <td className={cellStyle}>{participant.role}</td>
                                        <td className={cellStyle}>
                                            <PrimaryButton className={gridBbuttonStyle} onClick={() => {
                                                setParticipantErrorMessage('');
                                                // Persist particpants to room
                                                persistRoomParticipants();

                                                const baseUrl = window.location.href;
                                                const searchParams = new URLSearchParams();
                                                searchParams.append("roomId", updateRoomId);
                                                searchParams.append("token", participant.userToken);
                                                searchParams.append("identity", participant.identity);
                                                searchParams.append("role", participant.role);
                                                searchParams.append("displayname", participant.displayName);
                                                const url = baseUrl + "?" + searchParams.toString();
                                                navigator.clipboard.writeText(url);
                                                alert("Invited link has been copied to clipboard.");
                                            }}>Copy Invite Link</PrimaryButton>
                                        </td>
                                        <td className={cellStyle}>
                                            <PrimaryButton className={gridBbuttonStyle} onClick={() => {
                                                setParticipantErrorMessage('');
                                                setParticipantInputToken(participant.userToken);
                                                setParticipantInputMri(participant.identity);
                                                setParticipantInputName(participant.displayName);
                                                setParticipantInputRole(participant.role);
                                                setUpdateMode(true);
                                            }}>Update</PrimaryButton>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        :
                        <h3>No participants are currently allowed in the room.</h3>
                    }
                </div>
                <div style={editRoomStyle}>
                    <PrimaryButton className={buttonStyle} onClick={async () => {
                        props.setRoomId('');
                        props.setPage("home");
                    }}>Home</PrimaryButton>
                    <PrimaryButton className={buttonStyle} onClick={async () => {
                        await persistRoomParticipants();
                        props.setPage('configuration');
                    }}>{joinRoomButtonText}</PrimaryButton>
               </div>
            </Stack>
            <div style={editRoomStyle}>
                <li style={{ listStyleType: 'none', color: 'red', fontSize: '0.8rem' }}>{updateRoomErrorMessage}</li>
            </div>
        </Stack>
    );
}