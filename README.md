# Reactive Event Bus

Reactive Event Bus is a javascript library event bus.

## Motivation
Imagine having a large scale application containing a lot of components interacting with each other, and we want a way to make your components communicate while maintaining loose coupling and separation of concerns principles. The Event Bus pattern can be a good solution for our problem.

Implementing an Event Bus pattern can be beneficial for our code base as it helps loose coupling your classes and promotes a publish-subscribe pattern. It also help components interact without being aware of each other. Whichever implementation we choose to follow is a matter of taste and requirements. The main idea behind it is that we can connect two objects/two classes that have different lifecycles or a very different hierarchy or items dependency in the simplest way possible. That’s all.



## Installation

```bash
npm install
```

## Usage

In order to be able to use the methods in our components you should import them from 'reactive-event-bus';

```python
import { on, emit, Subscribe } from 'reactive-event-bus';

### Register to events

1st option

on('GetSomethingMessage').subscribe(() => {})

Note: on() returns an observable so you pipe any operator on top of the returned observable.
on('GetSomethingMessage').pipe(debounceTime(2000))subscribe(() => {})

2nd option
### Developers forget to unsubscribe messages
Naturally we are not machines. So why not create a subscribe decorator that internally automagically unsubscribes
the all messages in the destroy lifecycle (disconnectedCallback, ngOnDestroy, componentWillUnmount) ?

@Subscribe('GetSomethingMessage')
 onGetSomething(config) {
  // do something
}

### Additional options when registering to events

In case the developer just want to receive the first data of the subscription,should pass the option: {once: true}. 
So after the first subscription, is automatically unsubscribed.

on('GetSomethingMessage', {once: true})).subscribe(() => {})

or

@Subscribe('GetSomethingMessage', {once: true})
  onGetConfigsDetails(config: any) {
   // do something
}

In case the developer want to preserve the state of the messages,so even if you emit before of the subscribe and you want to get the data, should pass the option: { state: true }.
Therefore, it will save the state of the message for the futures subscribers.


on('GetSomethingMessage', {state: true})).subscribe(() => {})

or 

@Subscribe('GetSomethingMessage', {state: true})
  onGetSomething(config) {
   // do something
}
```

## Tests
```python
npm run test
```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[MIT](https://choosealicense.com/licenses/mit/)
