import { Subscription } from 'rxjs';

import { on } from '../classes/rx-event-bus.class';

import { IDecoratorSubscribeOptions } from '../interfaces/decorator-subscribe-options.interface';

/**
 * Wraps the on().subscribe() method into a decorator.
 *
 * By default, automatically unsubscribe the subscribed messages in the disconnectedCallback() lifecycle method
 * of the given component.
 *
 * Furthermore, allows to pass optional parameters as: once and stateless:
 *
 * Once - means that we just want to subscribe for a given class just one time, so after the first subscribe handler
 * is fired, the subscription will be automatically unsubscribed.
 *
 * State - means we want to get automatically the latest message value when we subscribe.
 *
 * ThrottleTime - means we want to emit the first value and then ignore emitted values for a specified duration.
 *
 * param stromg messageType - message that the user to subscribe, to get the emitted values.
 * param { IDecoratorSubscribeOptions } options=null - optional param to inform the subscriber if we want additional behaviors
 * e.g: {stateless: true} e/or {once:true}.
 */
export function Subscribe(messageType: string, options?: IDecoratorSubscribeOptions) {
  return (target: any, _: string, descriptor: PropertyDescriptor) => {
    let subscription: Subscription;
    const originalDisconnectCallback = target.disconnectedCallback;
    const originalConnectedCallback = target.connectedCallback;

    if (options) {
      target.connectedCallback = function() {
        originalConnectedCallback && originalConnectedCallback.call(this);
        subscription = on(messageType, options).subscribe(descriptor.value.bind(this));
      };

      target.disconnectedCallback = function() {
        originalDisconnectCallback && originalDisconnectCallback.call(this);
        subscription.unsubscribe();
      };
    } else {
      target.connectedCallback = function() {
        originalConnectedCallback && originalConnectedCallback.call(this);
        subscription = on(messageType).subscribe(descriptor.value.bind(this));
      };

      target.disconnectedCallback = function() {
        originalDisconnectCallback && originalDisconnectCallback.call(this);
        subscription.unsubscribe();
      };
    }
  };
}
