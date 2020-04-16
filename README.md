<p align="center">
  <img width="300" height="300" src="https://i.ibb.co/QMSFRHY/pinterest-profile-image.png">
</p>

## What is it ?

Reactive Event Bus is a typescript publish/subscribe event bus powered with RXJS. **Allows to get events data from the past (subscribing after emitting !) and provides options for automatic events unsubscriptions :star:**


## Motivation
Imagine having a large scale application containing a lot of components interacting with each other, and we want a way to make your components communicate while maintaining loose coupling and separation of concerns principles. The Event Bus pattern can be a good solution for our problem.

Implementing an Event Bus pattern can be beneficial for our code base as it helps loose coupling your classes and promotes a publish-subscribe pattern. It also help components interact without being aware of each other. Whichever implementation we choose to follow is a matter of taste and requirements. The main idea behind it is that we can connect two objects/two classes that have different lifecycles or a very different hierarchy or items dependency in the simplest way possible. That’s all.



## Installation

```bash
npm install reactive-event-bus
yarn add reactive-event-bus
```

## :computer:  CodeSandbox Example
https://codesandbox.io/s/nervous-moon-79gh2?file=/src/App.tsx

## :rocket:  Usage

In order to be able to use the methods in our components you should import them from 'reactive-event-bus';

```ts
import { on, emit, Subscribe } from 'reactive-event-bus';
```

**Registering events**

Option 1

```ts
on('GetSomethingMessage').subscribe(() => {})
```
**Note:** on() returns an observable so you pipe any operator on top of the returned observable.
on('GetSomethingMessage').pipe(debounceTime(2000))subscribe(() => {})

-----------------------------------------------------------------------------------------------------------------------------

Option 2

**Automagically events unsubscription :pray:** - the good thing about this option is that the developer does not need to handle the unsubscription of the event as it happens with the on().

**NOTE:** To use this option you must have declared on your component file the lifecycles which will be overriden by the decorator: (React - componentDidMount/componentWillUnmount, Angular - ngOnInit/ngOnDestroy, VanillaCustomElement/StencilJS - connectedCallback/disconnectedCallback).

```ts
@Subscribe('GetSomethingMessage')
 onGetSomething(config) {
  // do something
}
```

**Additional options**

If we want to just receive the first data of the subscription, there is the option: {once: true}. 
So after the first subscription, is automatically unsubscribed.

```ts
on('GetSomethingMessage', {once: true})).subscribe(() => {})

# or

@Subscribe('GetSomethingMessage', {once: true})
  onGetSomething(config) {
   // do something
}

```

If we want to subscribe and receive passed events data (emits that happened before subscribe), there is the option: { state: true }.

```ts
on('GetSomethingMessage', {state: true})).subscribe(() => {})

# or 

@Subscribe('GetSomethingMessage', {state: true})
  onGetSomething(config) {
   // do something
}
```

If we want to emit the first value and then ignore emitted values for a specified duration, there is the option: { throttleTime: durationTime }.

```ts
on('GetSomethingMessage', { throttleTime: 1000 })).subscribe(() => {})

# or 

@Subscribe('GetSomethingMessage', { throttleTime: 1000 })
  onGetSomething(config) {
   // do something
}
```

**Dispatching events**
```ts
emit({ type: 'GetSomethingMessage', data: { something: 'someValue'} })
```

## Tests
```bash
npm run test
yarn test
```

## :metal:  Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.
