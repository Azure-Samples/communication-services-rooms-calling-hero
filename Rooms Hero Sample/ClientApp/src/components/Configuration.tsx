// © Microsoft Corporation. All rights reserved.

import React, { useMemo } from 'react';
import {
    CallComposite,
    fromFlatCommunicationIdentifier,
    useAzureCommunicationCallAdapter,
    Role,
    CustomCallControlButtonCallback,
    CustomCallControlButtonCallbackArgs,
    CustomCallControlButtonProps
} from '@azure/communication-react';
import { AzureCommunicationTokenCredential, CommunicationUserIdentifier } from '@azure/communication-common';
export interface ConfigurationScreenProps {
    userId: string;
    participantRole: Role
    displayName: string;
    roomId: string;
    userToken: string;
    setUserToken(setUserToken: string): void;
    setPage(page: string): void;
}

export default (props: ConfigurationScreenProps): JSX.Element => {

    const { userId, userToken, displayName, roomId, participantRole } = props;

    const onFetchCustomButtonProps: CustomCallControlButtonCallback[] = [
        (args: CustomCallControlButtonCallbackArgs): CustomCallControlButtonProps => {
            return {
                iconName: "Home",
                text: "Home",
                placement: "primary",
                onItemClick: () => { props.setPage("home") }
            };
        }


    ];

    // A well-formed token is required to initialize the chat and calling adapters.
    const credential = useMemo(() => {
        try {
            return new AzureCommunicationTokenCredential(userToken);
        } catch {
            console.error('Failed to construct token credential');
            return undefined;
        }
    }, [userToken]);

    // Memoize arguments to `useAzureCommunicationCallAdapter` so that
    // a new adapter is only created when an argument changes.
    const callAdapterArgs = useMemo(
        () => ({
            userId: fromFlatCommunicationIdentifier(userId) as CommunicationUserIdentifier,
            displayName,
            credential,
            locator: { roomId },
            options: { roleHint: participantRole }
        }),
        [userId, credential, displayName, roomId]
    );
    const callAdapter = useAzureCommunicationCallAdapter(callAdapterArgs);

    if (!!callAdapter) {
        return (
            <div>
                <div style={{ height: '100vh', display: 'flex', width:'200vh' }}>
                    <CallComposite adapter={callAdapter} options={{ callControls: { onFetchCustomButtonProps } }} />
                </div>
            </div>
        );
    }
    if (credential === undefined) {
        return <h3>Failed to construct credential. Provided token is malformed.</h3>;
    }
    return <h3>Initializing...</h3>;
};
