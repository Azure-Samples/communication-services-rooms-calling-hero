// © Microsoft Corporation. All rights reserved.
import React from 'react';
import { Stack, PrimaryButton, Icon, Image, IImageStyles } from '@fluentui/react';
import { VideoCameraEmphasisIcon } from '@fluentui/react-icons-northstar';
import heroSVG from '../assets/hero.svg';
import { utils } from '../Utils/Utils';
import {
    imgStyle,
    containerTokens,
    listStyle,
    iconStyle,
    headerStyle,
    upperStackTokens,
    videoCameraIconStyle,
    buttonStyle,
    nestedStackTokens,
    upperStackStyle,
    listItemStyle
} from './styles/HomeScreen.styles';
import { Role } from '@azure/communication-react';

export interface HomeScreenProps {
    setPage(page: string): void;
    setRoomId(roomId: string): void;
    setUserId(userId: string): void;
    setUserRole(userRole: Role): void;
    setUserDisplayName(userDisplayName: string): void;
    userId: string;
}

const imageStyleProps: IImageStyles = {
    image: {
        height: '100%',
        width: '100%'
    },
    root: {}
};

export default (props: HomeScreenProps): JSX.Element => {
    const iconName = 'SkypeCircleCheck';
    const imageProps = { src: heroSVG.toString() };
    const headerTitle = 'Secure and simple video calling with Azure Communications Service - Rooms';
    const createRoomButtonText = 'Create a new Room and Add users';
    const threeStepText = "3 steps to join a secure video call.";
    const listItems = [
        'Create a “Room” where only the invited users can join a call.',
        'Create users with specific roles and add them to the Room.',
        'Generate a “Join link” for the users and join the Video call'
    ];

    return (
        <Stack horizontal horizontalAlign="center" verticalAlign="center" tokens={containerTokens}>
            <Stack className={upperStackStyle} tokens={upperStackTokens}>
                <div className={headerStyle}>{headerTitle}</div>
                <Stack tokens={nestedStackTokens}>
                    <div><b>{threeStepText}</b></div>
                    <ul className={listStyle}>
                        <li className={listItemStyle}>
                            <Icon className={iconStyle} iconName={iconName} /> {listItems[0]}
                        </li>
                        <li className={listItemStyle}>
                            <Icon className={iconStyle} iconName={iconName} /> {listItems[1]}
                        </li>
                        <li className={listItemStyle}>
                            <Icon className={iconStyle} iconName={iconName} /> {listItems[2]}
                        </li>
                    </ul>
                </Stack>
                <div>Learn more about <a href="https://docs.microsoft.com/en-us/azure/communication-services/concepts/rooms/room-concept">
                    Rooms concept
                </a></div>
                <Stack horizontal className={upperStackStyle} tokens={upperStackTokens}>
                    <PrimaryButton className={buttonStyle} onClick={async () => {
                        const createRoomId = await utils.createRoom(props.userId);
                        props.setRoomId(createRoomId);
                        props.setPage('edit');
                    }}>
                        <VideoCameraEmphasisIcon className={videoCameraIconStyle} size="medium" />
                        {createRoomButtonText}
                    </PrimaryButton>
                </Stack>
            </Stack>
            <Image
                alt="Welcome to the Azure Communication Services Rooms sample app"
                className={imgStyle}
                styles={imageStyleProps}
                {...imageProps}
            />
        </Stack>
    );
};
