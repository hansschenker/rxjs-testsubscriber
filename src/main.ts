import { Observable } from "rxjs";
import { MyTestSubscriber } from "./testsubscriber";


const source$ = new Observable<number>((observer) => {
  observer.next(1);
  observer.error(new Error('Test error'));
});

const testSubscriber = new MyTestSubscriber(source$);

// Example 1: Log the error and continue
testSubscriber.setErrorHandlingStrategy('log');
testSubscriber.subscribe();
console.log('Logged errors:', testSubscriber.encounteredErrors);

// Example 2: Rethrow the error (this will stop execution)
try {
  testSubscriber.setErrorHandlingStrategy('rethrow');
  testSubscriber.subscribe();
} catch (err) {
  console.error('Rethrown error caught:', err);
}

// Example 3: Replace the error with a fallback value
testSubscriber.setErrorHandlingStrategy('replace', 99);
testSubscriber.subscribe();
console.log('Values after replacement:', testSubscriber.emittedValues);
