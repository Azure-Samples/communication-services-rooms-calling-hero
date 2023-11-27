// © Microsoft Corporation. All rights reserved.
import React, { useState } from 'react';
import { Stack, PrimaryButton, Image, IImageStyles } from '@fluentui/react';
import { buttonStyle, containerTokens, imgStyle, upperStackStyle, upperStackTokens } from './styles/JoinRoom.styles';
import { Input } from 'reactstrap';
import heroSVG from '../assets/hero.svg';
import { utils, Role } from '../Utils/Utils';
import { editRoomStyle } from './styles/HomeScreen.styles';

const imageStyleProps: IImageStyles = {
    image: {
        height: '100%',
        width: '100%'
    },
    root: {}
};

export interface JoinRoomProps {
    setPage(page: string): void;
    setRoomId(roomId: string): void;
    roomId: string
    userId: string;
    userRole: Role;
    userDisplayName: string;
    setUserId(setUserId: string): void;
}

export default (props: JoinRoomProps): JSX.Element => {
    const imageProps = { src: heroSVG.toString() };
    const [errorMessage, setErrorMessage] = useState('');
    const invalidRoomText = 'The Room could not be found.';
    const timeoutText = 'The Room you are trying to connect to has expired';
    const joinRoomButtonText = 'Join Room Call';
    return (
        <Stack>
            <h3>Welcome! You are about to join a room call as {props.userRole} role</h3>
            <Stack horizontal horizontalAlign="center" verticalAlign="center" tokens={containerTokens}>
                <Stack className={upperStackStyle} tokens={upperStackTokens}>
                    <div style={editRoomStyle}>
                        <div style={editRoomStyle}><span style={editRoomStyle}><b>Display Name:</b></span><span style={editRoomStyle}> <Input type='text' value={props.userDisplayName} disabled={true} /></span></div>
                        <div style={editRoomStyle}><span style={editRoomStyle}><b>User ID:</b></span><span style={editRoomStyle}> <Input type='text' value={props.userId} style={{ width: "35rem" }} disabled={true} /></span></div>
                        <div style={editRoomStyle}><span style={editRoomStyle}><b>Room ID:</b></span><span style={editRoomStyle}><Input type='text' value={props.roomId} onChange={e => props.setRoomId(e.target.value)} disabled={true} /></span></div>
                    </div>
                    <div style={editRoomStyle}>
                        <PrimaryButton className={buttonStyle} onClick={async () => {
                            props.setRoomId('');
                            props.setPage("home");
                        }}>Home</PrimaryButton>   <PrimaryButton className={buttonStyle} onClick={async () => {
                            setErrorMessage('');
                            try {
                                if (!props.roomId) {
                                    setErrorMessage(invalidRoomText);
                                    return;
                                }

                                const getRoom = await utils.getRoom(props.roomId);
                                props.setRoomId(getRoom.roomId);
                                props.setPage('configuration');
                            }
                            catch (err) {
                                if (err === 'ERROR') {
                                    setErrorMessage(invalidRoomText);
                                }
                                else if (err === 'TIMEOUT') {
                                    setErrorMessage(timeoutText);
                                }
                            }
                        }}>{joinRoomButtonText}</PrimaryButton>
                    </div>
                    <div style={editRoomStyle}>
                        <li style={{ listStyleType: 'none', color: 'red', fontSize: '0.8rem' }}>{errorMessage}</li>
                    </div>
                </Stack>
                <Image
                    alt="Welcome to the Azure Communication Services Rooms sample app"
                    className={imgStyle}
                    styles={imageStyleProps}
                    {...imageProps}
                />
            </Stack>
        </Stack>
    );
}