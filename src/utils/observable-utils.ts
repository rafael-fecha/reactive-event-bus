import { BehaviorSubject, Subject } from 'rxjs';
import { map, filter, distinctUntilChanged } from 'rxjs/operators';

import { getDesiredMessageData } from './message-utils';
import { MessagesDataState } from '../interfaces/message-data-state.interface';

export const statefullObservable = (
  behaviorSubject$: BehaviorSubject<MessagesDataState[]>,
  messageType: string
) => {
  return behaviorSubject$.pipe(
    map((messages) => getDesiredMessageData(messages, messageType)),
    filter((message) => message),
    distinctUntilChanged()
  );
};

export const statelessObservable = (subject$: Subject<MessagesDataState>, messageType: string) => {
  return subject$.pipe(
    filter((messageData: MessagesDataState) => messageData.type === messageType),
    map((messageData: MessagesDataState) => messageData.data)
  );
};
