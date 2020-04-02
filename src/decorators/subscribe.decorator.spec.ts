import { Subscribe } from './subscribe.decorator';
import { RxEventBus } from '../classes/rx-event-bus.class';

interface MessageData {
  message: string;
  error: number;
}

const mockMessageData = { message: 'test', error: 1 };

let messageValue: MessageData | null = null;

class TestClass {
  handleSomethingMessage(data: MessageData) {
    messageValue = data;
  }

  connectedCallback() {}
  disconnectedCallback() {}
}

describe('Subscribe decorator', () => {
  it('subscription in connectedCallback', () => {
    Subscribe('GetSomethingMessage')(
      TestClass.prototype,
      'handleSomethingMessage',
      // @ts-ignore
      Object.getOwnPropertyDescriptor(TestClass.prototype, 'handleSomethingMessage')
    );
    TestClass.prototype.connectedCallback();
    RxEventBus.getInstance().emit({ type: 'GetSomethingMessage', data: mockMessageData});
    TestClass.prototype.disconnectedCallback();
    expect(messageValue).toEqual(mockMessageData);
  });
  it('unsubscription in disconnectedCallback', () => {
    messageValue = null;
    Subscribe('GetSomethingMessage')(
      TestClass.prototype,
      'handleSomethingMessage',
      Object.getOwnPropertyDescriptor(TestClass.prototype, 'handleSomethingMessage')
    );
    TestClass.prototype.connectedCallback();
    TestClass.prototype.disconnectedCallback();
    RxEventBus.getInstance().emit({ type: 'GetSomethingMessage', data: mockMessageData});
    expect(messageValue).toBeNull();
  });
});
