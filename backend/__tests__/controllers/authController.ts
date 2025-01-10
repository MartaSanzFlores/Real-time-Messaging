import authController from '../../src/controllers/authController';

const { validationResult } = require('express-validator');
import AppDataSource from '../../src/config/typeorm';
const bcrypt = require('bcryptjs');

jest.mock('express-validator');

interface MockRequest {
    body: {
        name: string;
        email: string;
        password: string;
        role: string;
    }
}

describe('Auth Controller', () => {

    it('should throw an error if validation fails', async () => {
        const req = {
            body: {
            }
        };

        const res = {};
        const next = jest.fn();

        // Mocking the validationResult method
        validationResult.mockImplementation(() => {
            return {
                isEmpty: () => false,
                array: () => [{ msg: 'Validation failed' }]
            }
        });

        await authController.signup(req, res, next);

        expect(next).toHaveBeenCalledWith(expect.any(Error));
        expect(next).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 422 }));
    });

    it('should create a user if validation passes', async () => {
        const req: MockRequest = {
            body: {
                name: 'John Doe',
                email: 'john@doe.com',
                password: 'password',
                role: 'user'
            }
        };

        const res = {
            status: jest.fn(() => res),
            json: jest.fn()
        } as any;

        const next = jest.fn();

        // Mocking the validationResult method
        validationResult.mockImplementation(() => {
            return {
                isEmpty: () => true
            }
        });

        // Mocking the bcrypt.hash method
        bcrypt.hash = jest.fn(() => 'hashedPW');

        // Mocking the AppDataSource.getRepository method
        const mockRepository = {
            findAndCount: jest.fn(() => [[], 0]),
            create: jest.fn(() => req.body),
            save: jest.fn(() => ({ id: 'abc' }))
        };

        // Mock AppDataSource.getRepository to return our mocked repository
        jest.spyOn(AppDataSource, 'getRepository').mockReturnValue(mockRepository as any);

        await authController.signup(req, res, next);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({ message: 'User created!', userId: 'abc' });
    });

    it('should throw an error if user creation fails', async () => {
        const req: MockRequest = {
            body: {
                name: 'John Doe',
                email: 'john@doe.com',
                password: 'password',
                role: 'user'
            }
        };

        const res = {};
        const next = jest.fn();

        // Mocking the validationResult method
        validationResult.mockImplementation(() => {
            return {
                isEmpty: () => true
            }
        });

        // Mocking the bcrypt.hash method
        bcrypt.hash = jest.fn(() => 'hashedPW');

        // Mocking the AppDataSource.getRepository method
        const mockRepository = {
            findAndCount: jest.fn(() => [[], 0]),
            create: jest.fn(() => req.body),
            save: jest.fn(() => { throw new Error('User creation failed') })
        };

        // Mock AppDataSource.getRepository to return our mocked repository
        jest.spyOn(AppDataSource, 'getRepository').mockReturnValue(mockRepository as any);

        await authController.signup(req, res, next);

        expect(next).toHaveBeenCalledWith(expect.any(Error));
        expect(next).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 500 }));

    });

    it('should throw an error if login fails', async () => {
        const req = {
            body: {
                email: 'john@doe.com',
                password: 'password'
            }
        };

        const res = {};
        const next = jest.fn();

        // Mocking the AppDataSource.getRepository method
        const mockRepository = {
            findOne: jest.fn(() => { throw new Error('User not found') })
        };

        // Mock AppDataSource.getRepository to return our mocked repository
        jest.spyOn(AppDataSource, 'getRepository').mockReturnValue(mockRepository as any);

        await authController.login(req, res, next);

        expect(next).toHaveBeenCalledWith(expect.any(Error));

    });

    it('should throw an error if user is not found', async () => {
        const req = {
            body: {
                email: 'john@doe.com',
                password: 'password'
            }
        };

        const res = {};
        const next = jest.fn();

        // Mocking the AppDataSource.getRepository method
        const mockRepository = {
            findOneBy: jest.fn(() => null)
        };

        // Mock AppDataSource.getRepository to return our mocked repository
        jest.spyOn(AppDataSource, 'getRepository').mockReturnValue(mockRepository as any);

        await authController.login(req, res, next);

        expect(next).toHaveBeenCalledWith(expect.any(Error));
        expect(next).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 401 }));

    });

    it('should throw an error if password is incorrect', async () => {
        const req = {
            body: {
                email: 'john@doe.com',
                password: 'password'
            }
        };

        const res = {};
        const next = jest.fn();

        // Mocking the AppDataSource.getRepository method
        const mockRepository = {
            findOneBy: jest.fn(() => req.body),
        };

        // Mocking the bcrypt.compare method
        bcrypt.compare = jest.fn(() => false);

        // Mock AppDataSource.getRepository to return our mocked repository
        jest.spyOn(AppDataSource, 'getRepository').mockReturnValue(mockRepository as any);

        await authController.login(req, res, next);

        expect(next).toHaveBeenCalledWith(expect.any(Error));
        expect(next).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 401 }));

    });

    it('should return a token if login is successful', async () => {
        const req = {
            body: {
                email: 'john@doe.com',
                password: 'password'
            }
        };

        const res = {
            status: jest.fn(() => res),
            json: jest.fn()
        } as any;

        const next = jest.fn();

        // Mocking the AppDataSource.getRepository method
        const mockRepository = {
            findOneBy: jest.fn(() => req.body),
        };

        // Mocking the bcrypt.compare method
        bcrypt.compare = jest.fn(() => true);

        // Mock AppDataSource.getRepository to return our mocked repository
        jest.spyOn(AppDataSource, 'getRepository').mockReturnValue(mockRepository as any);

        await authController.login(req, res, next);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: "User logged in!", token: expect.any(String) });
    });


});