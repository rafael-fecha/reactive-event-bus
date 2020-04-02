import { Subscription } from 'rxjs';

import { on } from '../classes/rx-event-bus.class';

import { IDecoratorSubscribeOptions } from '../interfaces/decorator-subscribe-options.interface';

/**
 * Wraps the on().subscribe() method into a decorator.
 *
 * By default, automatically unsubscribe the subscribed messages in the component removal from dom lifecycle method
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
 * param strong messageType - message that the user to subscribe, to get the emitted values.
 * param { IDecoratorSubscribeOptions } options=null - optional param to inform the subscriber if we want additional behaviors
 * e.g: {state: true} e/or {once:true}.
 */
export function Subscribe(messageType: string, options?: IDecoratorSubscribeOptions) {
  return (target: any, _: string, descriptor: PropertyDescriptor) => {
    const isCustomElement = !!target.connectedCallback && !!target.disconnectedCallback;
    const isAngular = !!target.ngOnInit && !!target.ngOnDestroy;
    const isReact = !!target.componentDidMount && !!target.componentWillUnmount;

    let subscription: Subscription;

    if (isCustomElement) {
      const originalConnectedCallback = target.connectedCallback;
      const originalDisconnectCallback = target.disconnectedCallback;

      target.connectedCallback = function() {
        originalConnectedCallback && originalConnectedCallback.call(this);
        subscription = on(messageType, options).subscribe(descriptor.value.bind(this));
      };

      target.disconnectedCallback = function() {
        originalDisconnectCallback && originalDisconnectCallback.call(this);
        subscription.unsubscribe();
      };
    } else if (isAngular) {
      const originalOnNgInit = target.ngOnInit;
      const originalNgOnDestroy = target.ngOnDestroy;

      target.ngOnInit = function() {
        originalOnNgInit && originalOnNgInit.call(this);
        subscription = on(messageType, options).subscribe(descriptor.value.bind(this));
      };

      target.ngOnDestroy = function() {
        originalNgOnDestroy && originalNgOnDestroy.call(this);
        subscription.unsubscribe();
      };
    } else if (isReact) {
      const originalOnDidMount = target.componentDidMount;
      const originalWillUnmount = target.componentWillUnmount;

      target.componentDidMount = function() {
        originalOnDidMount && originalOnDidMount.call(this);
        subscription = on(messageType, options).subscribe(descriptor.value.bind(this));
      };

      target.componentWillUnmount = function() {
        originalWillUnmount && originalWillUnmount.call(this);
        subscription.unsubscribe();
      };
    } else {
      console.warn(`[Reactive Event Bus] No Lifecycle Methods Supported Detected in '${target.constructor.name}'`);
    }
  };
}
