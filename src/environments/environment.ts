export const environment = {
    production: false,
    useEmulators: true,
    get cloudFunctionsBaseUrl() {
      return this.useEmulators
        ? 'http://localhost:'
        : 'https://us-centralxxxxx.cloudfunctions.net/api';
    },
    buildDate: new Date(),
  };