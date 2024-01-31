import { NativeModules, NativeEventEmitter } from 'react-native';
import type { EventSubscription } from 'react-native';

// Note that this is a singleton in ES6 module
const emitter = new NativeEventEmitter(NativeModules.ShopliveModule);

const subscriptions: Record<string, EventSubscription> = {};



export type EventData = {
    data: string;
  }
export type eventHandler = (payload: EventData) => void;

export const addEventListener = (event: string, handler: eventHandler) => {
    console.log(`${event} added`)
    const subscription: EventSubscription = emitter.addListener(event, handler);
    const existingSubscription = subscriptions[event];
    if (existingSubscription) {
        existingSubscription.remove();
    }
    subscriptions[event] = subscription;
};



export const removeEventListener = (event: string) => {
    const existingSubscription = subscriptions[event];
    if (existingSubscription) {
        existingSubscription.remove();
        delete subscriptions[event];
    }
};
