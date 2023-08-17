// © Microsoft Corporation. All rights reserved.
import React, { useState, useEffect } from 'react';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import { reducer } from './core/reducers';
import thunk from 'redux-thunk';
import HomeScreen from './components/HomeScreen';
import JoinRoom from './components/JoinRoom';
import ConfigurationScreen from './components/Configuration';
import { loadTheme, initializeIcons } from '@fluentui/react';
import { utils } from './Utils/Utils';
import { CommunicationUserToken } from '@azure/communication-identity';
import EditRoom from './components/EditRoom';
import { Role } from '@azure/communication-react';
/* eslint-disable */
const sdkVersion = require('../package.json').dependencies['@azure/communication-calling'];
const lastUpdated = `Last Updated ${utils.getBuildTime()} with @azure/communication-calling:${sdkVersion}`;

loadTheme({});
initializeIcons();

const store = createStore(reducer, applyMiddleware(thunk));
const App = (): JSX.Element => {
    const [page, setPage] = useState('home');
    const [roomId, setRoomId] = useState('');
    const [userId, setUserId] = useState('');
    const [userToken, setUserToken] = useState('');
    const [userDisplayName, setUserDisplayName] = useState('');
    const [userRole, setUserRole] = useState<Role>("Attendee");
    useEffect(() => {
        const setWindowWidth = (): void => {
        };
        const getToken = async () => {

            const params = new URLSearchParams(window.location.search); // id=123
            const roomIdParam: string = params.get('roomId') as string; // 123

            if (roomIdParam) {
                setRoomId(roomIdParam);
                const accessToken: string = params.get('token') as string;
                const participantMri: string = params.get('identity') as string;
                const participantDisplayName: string = params.get('displayname') as string;
                const participantRole: Role = params.get('role') as Role;

                setUserToken(accessToken);
                setUserId(participantMri);
                setUserDisplayName(participantDisplayName);
                setUserRole(participantRole)
                //window.location.href = window.location.origin;
                setPage("joinRoom");
            }
            else {
                const tokenResponse: CommunicationUserToken = await utils.getTokenForUser();
                const userToken = tokenResponse.token;
                const userId = tokenResponse.user.communicationUserId;
                const displayName = "Presenter1";

                setUserToken(userToken);
                setUserId(userId);
                setUserDisplayName(displayName);
                setUserRole("Presenter");
            }
        };
        getToken();

        setWindowWidth();
        window.addEventListener('resize', setWindowWidth);
        return (): void => window.removeEventListener('resize', setWindowWidth);
    }, []);

    const getContent = (): JSX.Element => {
        if (page === 'home') {
            return (
                <HomeScreen
                    setPage={setPage}
                    setRoomId={setRoomId}
                    userId={userId}
                    setUserId={setUserId}
                    setUserRole={setUserRole}
                    setUserDisplayName={setUserDisplayName}
                />
            );
        } else if (page === 'joinRoom') {
            return (
                <JoinRoom
                    setPage={setPage}
                    setRoomId={setRoomId}
                    roomId={roomId}
                    userId={userId}
                    userRole={userRole}
                    userDisplayName={userDisplayName}
                    setUserId={setUserId}
                />
            );
        } else if (page === 'configuration') {
            return (
                <ConfigurationScreen
                    userId={userId}
                    userToken={userToken}
                    setUserToken={setUserToken}
                    roomId={roomId}
                    participantRole={userRole}
                    displayName={userDisplayName}
                    setPage={setPage}
                />
            );
        } else if (page === 'edit') {
            return (
                <EditRoom
                    roomId={roomId}
                    userId={userId}
                    userToken={userToken}
                    userRole={userRole}
                    userDisplayName={userDisplayName}
                    setUserId={setUserId}
                    setUserRole={setUserRole}
                    setUserDisplayName={setUserDisplayName}
                    setRoomId={setRoomId}
                    setPage={setPage}
                />
            );
        } else if (page === 'unsupported') {
            window.document.title = 'Unsupported browser';
            return (
                <>
                    <a href="https://docs.microsoft.com/en-us/azure/communication-services/concepts/voice-video-calling/calling-sdk-features#calling-client-library-browser-support">
                        Learn more
                    </a>
                    &nbsp;about browsers and platforms supported by the web calling sdk
                </>
            );
        } else if (page === 'error') {
            window.document.title = 'Call Ended';
            return (
                <div>
                    <div>{`The call has ended with with an error`}</div>

                    <div>
                        <a href="https://docs.microsoft.com/en-us/azure/communication-services/concepts/troubleshooting-info?tabs=csharp%2Cjavascript%2Cdotnet">
                            Learn more
                        </a>
                        &nbsp;about why this Azure Communication Services call has ended.
                    </div>
                </div>
            );
        } else {
            return <></>;
        }
    };

    return <Provider store={store}>{getContent()}</Provider>;
};

window.setTimeout(() => {
    try {
        console.log(`Azure Communication Services Rooms sample app: ${lastUpdated}`);
    } catch (e) { }
}, 0);

export default App;
