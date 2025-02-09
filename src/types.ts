interface TestSubscriber<T> {
    emittedValues: T[];
    encounteredErrors: any[];
    completionCount: number;
    subscriptionCount: number;
    unsubscribeAll: () => void;
  
    // Error handling strategy
    setErrorHandlingStrategy(
      strategy: 'log' | 'rethrow' | 'replace',
      replacementValue?: T
    ): void;
  }
  