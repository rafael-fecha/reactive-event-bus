import { RxEventBus } from './rx-event-bus.class';

describe('Rx Event Bus Class', () => {
  it('get rx event bus instance', () => {
    expect(RxEventBus.getInstance()).toBeDefined();
  });
  it('basic emit subscribe', () => {
    const spy = jest.fn();
    RxEventBus.getInstance()
      .on('GetSomethingMessage')
      .subscribe(spy);
    RxEventBus.getInstance().emit({ type: 'GetSomethingMessage', data: { error: 1 }});
    RxEventBus.getInstance().emit({ type: 'GetSomethingMessage', data: { error: 2 }});
    RxEventBus.getInstance().emit({ type: 'GetSomethingMessage', data: { error: 3 }});
    expect(spy.mock.calls.length).toBe(3);
  });
  it('subscribe with once option', () => {
    const spy = jest.fn();
    RxEventBus.getInstance()
      .on('GetSomethingMessage', { once: true })
      .subscribe(spy);
      RxEventBus.getInstance().emit({ type: 'GetSomethingMessage', data: { error: 1 }});
      RxEventBus.getInstance().emit({ type: 'GetSomethingMessage', data: { error: 2 }});
      RxEventBus.getInstance().emit({ type: 'GetSomethingMessage', data: { error: 3 }});
    expect(spy.mock.calls.length).toBe(1);
  });
  it('subscribe with state option', () => {
    const spy = jest.fn();
    RxEventBus.getInstance().emit({ type: 'GetSomethingMessage', data: { error: 1 }});
    RxEventBus.getInstance()
      .on('GetSomethingMessage', { state: true })
      .subscribe(spy);
      RxEventBus.getInstance().emit({ type: 'GetSomethingMessage', data: { error: 2 }});
    expect(spy.mock.calls.length).toBe(2);
  });
  it('get message latest value', () => {
    expect(RxEventBus.getInstance().getMessageValues('GetSomethingMessage')).toEqual({ error: 2 });
  });
});
