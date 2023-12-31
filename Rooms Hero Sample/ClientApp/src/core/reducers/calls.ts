import { Call, CallEndReason, RemoteParticipant, CallAgent } from '@azure/communication-calling';
import { SelectionState } from 'core/RemoteStreamSelector';
import { Reducer } from 'redux';
import {
  CALL_ADDED,
  CALL_REMOVED,
  SET_CALL_STATE,
  SET_DOMINANT_PARTICIPANTS,
  SET_PARTICIPANTS,
  CallTypes,
  SET_CALL_AGENT
} from '../actions/calls';

export interface CallsState {
  callAgent?: CallAgent;
  room: string;
  call?: Call;
  callState: string;
  incomingCallEndReason: CallEndReason | undefined;
  roomCallEndReason: CallEndReason | undefined;
  remoteParticipants: RemoteParticipant[];
  attempts: number;
  dominantParticipants: SelectionState[];
}

const initialState: CallsState = {
  callAgent: undefined,
  call: undefined,
  callState: 'None',
  incomingCallEndReason: undefined,
  roomCallEndReason: undefined,
  remoteParticipants: [],
  dominantParticipants: [],
  room: '',
  attempts: 0
};

export const callsReducer: Reducer<CallsState, CallTypes> = (state = initialState, action: CallTypes): CallsState => {
  switch (action.type) {
    case SET_CALL_AGENT:
      return { ...state, callAgent: action.callAgent };
    case CALL_ADDED:
      return { ...state, call: action.call };
    case CALL_REMOVED:
      return {
        ...state,
        call: undefined,
        remoteParticipants: [],
        incomingCallEndReason: action.incomingCallEndReason,
        roomCallEndReason: action.roomCallEndReason
      };
    case SET_CALL_STATE:
      return { ...state, callState: action.callState };
    case SET_DOMINANT_PARTICIPANTS:
      return { ...state, dominantParticipants: action.dominantParticipants };
    case SET_PARTICIPANTS:
      return { ...state, remoteParticipants: action.remoteParticipants };
    default:
      return state;
  }
};
