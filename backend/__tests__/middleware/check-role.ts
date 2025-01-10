import checkRoleMiddleware from '../../src/middleware/checkRoleMiddleware';

interface MockRequest {
  user?: { userId: string, role: string };
}

describe('Check Role middleware', () => {

  it('should throw an error if the role is not admin', () => {
    const req: MockRequest = {
      user: { userId: 'abc', role: 'user' }
    };
    expect(() => {
      checkRoleMiddleware(req, {}, () => { });
    }).toThrow('Not Authorized');
  });

  it('should not throw an error if the role is admin', () => {
    const req: MockRequest = {
        user: { userId: 'abc', role: 'admin' }
    };
    expect(() => {
      checkRoleMiddleware(req, {}, () => { });
    }).not.toThrow();
  });

});