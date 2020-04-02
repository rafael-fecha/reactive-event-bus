import 'symbol-observable';

import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { first, throttleTime } from 'rxjs/operators';

import { MessagesDataState } from '../interfaces/message-data-state.interface';
import { IDecoratorSubscribeOptions } from '../interfaces/decorator-subscribe-options.interface';

import {
  filterDesiredMessage,
  hasAlreadyMessageDataStored,
  updateMessageData
} from '../utils/message-utils';
import { statefullObservable, statelessObservable } from '../utils/observable-utils';

/**
 * Central event bus based on subjects intended for messaging between the various components of the application.
 */
export class RxEventBus {
  private static behaviorSubject$ = new BehaviorSubject<MessagesDataState[]>([]);
  private static instance: RxEventBus | undefined;
  private static subject$ = new Subject<MessagesDataState>();

  private constructor() {}

  /**
   * Ensure that this class is singleton in the application (only one instance of this class).
   *
   * @returns {RxEventBus} - The instance of this class.
   */
  public static getInstance(): RxEventBus | undefined {
    RxEventBus.instance = (window as any)['rxEventBus'];

    if (!RxEventBus.instance) {
      RxEventBus.instance = new RxEventBus();
      (window as any)['rxEventBus'] = RxEventBus.instance;
    }

    return RxEventBus.instance;
  }

  /**
   * Creates a new entry { message: data } for the given emitted message in the messages map or updates if already existing.
   *
   * Furthermore, not only populates the behaviorSubject$ (for the use cases we want to get the state of the message)
   * but also populates the subject$ (which will be used in use cases where we want stateless messages).
   *
   * @param {MessageInstance} message - message that the user want to populate a new value for the subscribers.
   */
  emit(message: { type: string; data: unknown }): void {
    const messageType: string = message.type;
    RxEventBus.subject$.next({ type: messageType, data: message.data });

    if (hasAlreadyMessageDataStored(RxEventBus.behaviorSubject$.value, messageType)) {
      const updatedMessagesData = updateMessageData(message.data, messageType, RxEventBus.behaviorSubject$.value);
      RxEventBus.behaviorSubject$.next(updatedMessagesData);
    } else {
      RxEventBus.behaviorSubject$.next(
        RxEventBus.behaviorSubject$.value.concat([{ type: messageType, data: message.data }])
      );
    }
  }

  /**
   * Listen to a specific message value.
   * By default when we subscribe for a message it will behave as a custom event
   *
   * we don't get the latest state automatically when we subscribe, we just get the subscribe handler triggered when a message
   * is emitted after the subscribe implementation.
   *
   * @param {string} messageType - message that the user to subscribe, to get the emitted values.
   * @param {IDecoratorSubscribeOptions} options - options.
   */
  on(messageType: string, options?: IDecoratorSubscribeOptions): Observable<any> {
    const $obs = options?.state
      ? statefullObservable(RxEventBus.behaviorSubject$, messageType)
      : statelessObservable(RxEventBus.subject$, messageType);

    if (options?.once && options?.throttleTime) {
      return $obs.pipe(first(), throttleTime(options?.throttleTime));
    } else if (options?.once) {
      return $obs.pipe(first());
    } else if (options?.throttleTime) {
      return $obs.pipe(throttleTime(options?.throttleTime));
    } else {
      return $obs;
    }
  }

  /**
   * By default, with no params, gets the list of all latest message values already populated.
   * In the other hand if we pass a specific message gets only the latest message value passed by param.
   *
   * @param {string} messageType - message that the user want get the latest value.
   * @returns {MessagesDataState | MessagesDataState[]} - The message value or list of messages values.
   */
  getMessageValues(messageType?: string): MessagesDataState[] | undefined {
    if (messageType) {
      const messageData: MessagesDataState = filterDesiredMessage(messageType, RxEventBus.behaviorSubject$.value);
      if (messageData) {
        return messageData.data;
      }
    } else {
      return RxEventBus.behaviorSubject$.value;
    }
  }
}

export const emit = RxEventBus.getInstance().emit;
export const getMessageValues = RxEventBus.getInstance().getMessageValues;
export const on = RxEventBus.getInstance().on;
