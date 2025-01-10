import authMiddleware from '../../src/middleware/authMiddleware';
const jwt = require('jsonwebtoken');

interface MockRequest {
  get: (key: string) => string;
  user?: { userId: string, role: string };
}

jest.mock('jsonwebtoken');

describe('Auth middleware', () => {

  it('should throw an error if no authorization header is present', () => {
    const req = {
      get: () => null
    };
    expect(() => {
      authMiddleware(req, {}, () => { });
    }).toThrow('No Authenticated');
  });

  it('should throw an error if the authorization header is only one string', () => {
    const req = {
      get: () => 'xyz'
    };
    expect(() => {
      authMiddleware(req, {}, () => { });
    }).toThrow();
  });

  it('should yield a userId after decoding the token', () => {

    const req: MockRequest = {
      get: () => 'Bearer xyz'
    };

    // Mocking the verify method
    jwt.verify.mockImplementation(() => {
      return { userId: 'abc', role: undefined };
    });
      
    authMiddleware(req, {}, () => { });

    // We expect the user property to be an object
    expect(req).toHaveProperty('user');
    // We expect the user property to have a userId property
    expect(req.user).toEqual({ userId: 'abc', role: undefined });
  });
  
});