import makeServiceWorkerEnv from 'service-worker-mock';

describe('helloworker', () => {

  beforeEach(() => {
    // Merge the Service Worker Environment in to the global scope.
    Object.assign(global, makeServiceWorkerEnv());
    // Clear all module imports.
    jest.resetModules();
    // Import and init the Worker.
    jest.requireActual('../src/helloworker');
  });

  it('should add listeners', async () => {
    expect(self.listeners.fetch).toBeDefined();
  });

  it('should return Hello US!', async () => {
    fetchMock.mockResponseOnce('Hello');

    const request = new Request('/path');
    request.cf = {
      tlsVersion: "1.3",
      tlsCipher: "AES GCM",
      country: "US",
      colo: "SFO",
    };
    const response = await self.trigger('fetch', request);

    expect(fetchMock).toBeCalledTimes(1);
    expect(response.status).toBe(200);
    expect(await response.text()).toBe('Hello US!');
  });
});
