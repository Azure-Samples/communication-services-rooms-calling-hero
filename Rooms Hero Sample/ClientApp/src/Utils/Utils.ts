// © Microsoft Corporation. All rights reserved.
import { AudioDeviceInfo, VideoDeviceInfo, RemoteVideoStream } from '@azure/communication-calling';
import { CommunicationIdentifierKind } from '@azure/communication-common';
import { CommunicationUserToken } from '@azure/communication-identity';
import { Role } from '@azure/communication-react';
import preval from 'preval.macro';
import { v4 as uuid } from 'uuid';

export type Room = {
    roomId: string;
    createdAt: Date;
    validFrom: Date;
    validUntil: Date;
    pstnDialOutEnabled: boolean;
    participants: RoomParticipant[];
}

export type RoomParticipant = {
    userToken: string;
    identity: string;
    role: Role;
    displayName: string;
}


export type UpdateParticipant = {
    identity: string;
    role: Role;
    add: boolean;
}

export const utils = {

    getAppServiceUrl: (): string => {
        return window.location.origin;
    },

    getNewMri: (currentMri: string): string => {
        const splitString = currentMri.split("_", 2);
        const newMri = splitString[0] + "_" + uuid();

        return newMri;
    },
    getTokenForUser: async (): Promise<CommunicationUserToken> => {
        const response = await fetch('/token');
        if (response.ok) {
            return response.json();
        }
        throw new Error('Invalid token response');
    },
    getRefreshedTokenForUser: async (identity: string): Promise<string> => {
        const response = await fetch(`/refreshToken/${identity}`);
        if (response.ok) {
            const content = await response.json();
            return content.token;
        }
        throw new Error('Invalid token response');
    },
    createRoom: async (identity: string, pstnDialOutEnabled: boolean): Promise<string> => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
            })
        };
        const response = await fetch(`/createRoom/${identity}?pstnDialOutEnabled=${pstnDialOutEnabled}`, requestOptions);
        if (response.ok) {
            const content = await response.json();
            return content.roomId;
        }
        throw new Error('Could not create room');
    },
    getRoom: async (roomId: string): Promise<Room> => {
        const response = await fetch(`/getRoom/${roomId}`);
        if (response.ok) {
            const content = await response.json();
            return content;
        }
        throw 'ERROR';
    },
    updateRoom: async (roomId: string, participants: Array<UpdateParticipant>): Promise<string> => {
        if (participants.length == 0) {
            return roomId;
        }

        const requestOptions = {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                updateParticipants: participants
            })
        };
        const response = await fetch(`/updateRoom/${roomId}`, requestOptions);
        if (response.ok) {
            return roomId;
        }
        throw new Error(`Could not update the users of room ${roomId}`);
    },
    isSelectedAudioDeviceInList(selected: AudioDeviceInfo, list: AudioDeviceInfo[]): boolean {
        return list.filter((item) => item.name === selected.name).length > 0;
    },
    isSelectedVideoDeviceInList(selected: VideoDeviceInfo, list: VideoDeviceInfo[]): boolean {
        return list.filter((item) => item.name === selected.name).length > 0;
    },
    isMobileSession(): boolean {
        return window.navigator.userAgent.match(/(iPad|iPhone|iPod|Android|webOS|BlackBerry|Windows Phone)/g)
            ? true
            : false;
    },
    isSmallScreen(): boolean {
        return window.innerWidth < 700 || window.innerHeight < 400;
    },
    isUnsupportedBrowser(): boolean {
        return window.navigator.userAgent.match(/(Firefox)/g) ? true : false;
    },
    getId: (identifier: CommunicationIdentifierKind): string => {
        switch (identifier.kind) {
            case 'communicationUser':
                return identifier.communicationUserId;
            case 'phoneNumber':
                return identifier.phoneNumber;
            case 'microsoftTeamsUser':
                return identifier.microsoftTeamsUserId;
            case 'unknown':
                return identifier.id;
        }
    },
    getStreamId: (userId: string, stream: RemoteVideoStream): string => {
        return `${userId}-${stream.id}-${stream.mediaStreamType}`;
    },
    /*
     * TODO:
     *  Remove this method once the SDK improves error handling for unsupported browser.
     */
    isOnIphoneAndNotSafari(): boolean {
        const userAgent = navigator.userAgent;
        // Chrome uses 'CriOS' in user agent string and Firefox uses 'FxiOS' in user agent string.
        if (userAgent.includes('iPhone') && (userAgent.includes('FxiOS') || userAgent.includes('CriOS'))) {
            return true;
        }
        return false;
    },
    isSafari(): boolean {
        // https://stackoverflow.com/questions/7944460/detect-safari-browser
        const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
        return isSafari;
    },
    getBuildTime: (): string => {
        const dateTimeStamp = preval`module.exports = new Date().toLocaleString();`;
        return dateTimeStamp;
    }
};