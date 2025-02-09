import { Observable, Subscription } from "rxjs";


export class MyTestSubscriber<T> implements TestSubscriber<T> {
    private subscriptions: Set<Subscription> = new Set();
    private values: T[] = [];
    private errors: any[] = [];
    private completions = 0;
  
    private errorStrategy: 'log' | 'rethrow' | 'replace' = 'log';
    private replacementValue?: T;
  
    constructor(private source: Observable<T>) {}
  
    subscribe(): Subscription {
      const subscription = this.source.subscribe({
        next: (value) => this.values.push(value),
        error: (err) => this.handleError(err),
        complete: () => this.completions++,
      });
      this.subscriptions.add(subscription);
  
      const originalUnsubscribe = subscription.unsubscribe.bind(subscription);
      subscription.unsubscribe = () => {
        originalUnsubscribe();
        this.subscriptions.delete(subscription);
      };
  
      return subscription;
    }
  
    private handleError(err: any) {
      switch (this.errorStrategy) {
        case 'log':
          console.error('Error encountered:', err);
          break;
        case 'rethrow':
          throw err;
        case 'replace':
          if (this.replacementValue !== undefined) {
            this.values.push(this.replacementValue);
          }
          break;
      }
      this.errors.push(err);
    }
  
    setErrorHandlingStrategy(strategy: 'log' | 'rethrow' | 'replace', replacementValue?: T): void {
      this.errorStrategy = strategy;
      this.replacementValue = replacementValue;
    }
  
    get emittedValues(): T[] {
      return this.values;
    }
  
    get encounteredErrors(): any[] {
      return this.errors;
    }
  
    get completionCount(): number {
      return this.completions;
    }
  
    get subscriptionCount(): number {
      return this.subscriptions.size;
    }
  
    unsubscribeAll() {
      this.subscriptions.forEach((sub) => sub.unsubscribe());
      this.subscriptions.clear();
    }
  }
  