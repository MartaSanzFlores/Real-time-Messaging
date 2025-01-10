import adminController from '../../src/controllers/adminController';
import AppDataSource from '../../src/config/typeorm';

const { validationResult } = require('express-validator');

jest.mock('express-validator');

interface MockRequest {
    params: { id: string },
    body: {
        name: string;
        email: string;
        password: string;
        role: string;
        userId: string;
    },
    user: {
        userId: string;
        role: string;
    };
}

describe('Admin Controller', () => {

    it('should return a list of users', async () => {

        const req = {};
        const res = {
            status: jest.fn(() => res),
            json: jest.fn()
        } as any;

        const next = jest.fn();

        // Mock repository
        const mockRepository = {
            find: jest.fn(() => [{ name: 'John Doe', email: 'jonh@doe.com', password: 'password', role: 'user' }]),
        };

        // Mock getRepository
        jest.spyOn(AppDataSource, 'getRepository').mockReturnValue(mockRepository as any);

        await adminController.getUsers(req, res, next);

        expect(res.status).toHaveBeenCalledWith(200);

    });

    it('should return an error if the database query fails', async () => {

        const req = {};
        const res = {};
        const next = jest.fn();

        const mockRepository = {
            find: jest.fn(() => { throw new Error('Database query failed') }),
        };

        jest.spyOn(AppDataSource, 'getRepository').mockReturnValue(mockRepository as any);

        await adminController.getUsers(req, res, next);

        expect(next).toHaveBeenCalledWith(expect.any(Error));
        expect(next).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 500 }));

    });

    it('should return a single user', async () => {

        const req = {
            params: {
                id: '1'
            }
        };
        const res = {
            status: jest.fn(() => res),
            json: jest.fn()
        } as any;

        const next = jest.fn();

        const mockRepository = {
            findOne: jest.fn(() => ({ name: 'John Doe', email: 'john@doe.com', password: 'password', role: 'user' })),
        };

        jest.spyOn(AppDataSource, 'getRepository').mockReturnValue(mockRepository as any);

        await adminController.getUser(req, res, next);

        expect(res.status).toHaveBeenCalledWith(200);

    });

    it('should return an error if the user is not found', async () => {

        const req = {
            params: {
                id: '1'
            }
        };
        const res = {};
        const next = jest.fn();

        const mockRepository = {
            findOne: jest.fn(() => null),
        };

        jest.spyOn(AppDataSource, 'getRepository').mockReturnValue(mockRepository as any);

        await adminController.getUser(req, res, next);

        expect(next).toHaveBeenCalledWith(expect.any(Error));
        expect(next).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 404 }));

    });

    it('should return an error if the database query fails', async () => {

        const req = {
            params: {
                id: '1'
            }
        };
        const res = {};
        const next = jest.fn();

        const mockRepository = {
            findOne: jest.fn(() => { throw new Error('Database query failed') }),
        };

        jest.spyOn(AppDataSource, 'getRepository').mockReturnValue(mockRepository as any);

        await adminController.getUser(req, res, next);

        expect(next).toHaveBeenCalledWith(expect.any(Error));
        expect(next).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 500 }));

    });

    it('should create a user', async () => {

        const req: MockRequest = {
            params: { id: '' },
            body: {
                name: 'John Doe',
                email: 'john@doe.com',  
                password: 'password',
                role: 'user',
                userId: '1'
            },
            user: {
                userId: '1',
                role: 'admin'
            }
        };

        const res = {
            status: jest.fn(() => res),
            json: jest.fn()
        } as any;

        const next = jest.fn();

        //mocking validationResult
        validationResult.mockImplementation(() => {
            return {
                isEmpty: () => true
            }
        });

        const mockRepository = {
            findAndCount: jest.fn(() => [[], 0]),
            create: jest.fn(() => req.body),
            save: jest.fn(() => ({ id: 'abc' }))
        };

        jest.spyOn(AppDataSource, 'getRepository').mockReturnValue(mockRepository as any);

        await adminController.createUser(req, res, next);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({ message: 'User created by admin!', userId: 'abc' });

    });

    it('should update a user', async () => {
        
        const req: MockRequest = {
            params: { id: '1' },
            body: {
                name: 'John Doe',
                email: 'john@doe.com',
                password: 'password',
                role: 'user',
                userId: '1'
            },
            user: {
                userId: '1',
                role: 'admin'
            }
        };

        const res = {
            status: jest.fn(() => res),
            json: jest.fn()
        } as any;

        const next = jest.fn();

        //mocking validationResult
        validationResult.mockImplementation(() => {
            return {
                isEmpty: () => true
            }
        });

        const mockRepository = {
            findOne: jest.fn(() => ({ name: 'John Doe', email: 'john@doe.com', password: 'password', role: 'user' })),
            save: jest.fn(() => ({ id: '1' }))  
        };

        jest.spyOn(AppDataSource, 'getRepository').mockReturnValue(mockRepository as any);

        await adminController.updateUser(req, res, next);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: 'User updated!', userId: '1' });

    });

    it('should return an error if the user is not found', async () => {

        const req: MockRequest = {
            params: { id: '1' },
            body: {
                name: 'John Doe',
                email: 'john@doe.com',
                password: 'password',
                role: 'user',
                userId: '1'
            },
            user: {
                userId: '1',
                role: 'admin'
            }
        };

        const res = {};
        const next = jest.fn();

        //mocking validationResult
        validationResult.mockImplementation(() => {
            return {
                isEmpty: () => true
            }
        });

        const mockRepository = {
            findOne: jest.fn(() => null)
        };

        jest.spyOn(AppDataSource, 'getRepository').mockReturnValue(mockRepository as any);

        await adminController.updateUser(req, res, next);

        expect(next).toHaveBeenCalledWith(expect.any(Error));
        expect(next).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 404 }));

    });

    it('should return an error if the database query fails', async () => {

        const req: MockRequest = {
            params: { id: '1' },
            body: {
                name: 'John Doe',
                email: 'john@doe.com',
                password: 'password',
                role: 'user',
                userId: '1'
            },
            user: {
                userId: '1',
                role: 'admin'
            }
        };

        const res = {};
        const next = jest.fn();

        //mocking validationResult
        validationResult.mockImplementation(() => {
            return {
                isEmpty: () => true
            }
        });

        const mockRepository = {
            findOne: jest.fn(() => { throw new Error('Database query failed') })
        };

        jest.spyOn(AppDataSource, 'getRepository').mockReturnValue(mockRepository as any);

        await adminController.updateUser(req, res, next);

        expect(next).toHaveBeenCalledWith(expect.any(Error));
        expect(next).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 500 }));

    });

    it('should delete a user', async () => {

        const req: MockRequest = {
            params: { id: '1' },
            body: { 
                name: 'John Doe', 
                email: 'john@doe.com',
                password: 'password',
                role: 'user',
                userId: '1'
            },
            user: {
                userId: '2',
                role: 'admin'
            }
        };
    
        const res = {
            status: jest.fn(() => res),
            json: jest.fn()
        } as any;
    
        const next = jest.fn();
    
        // Mock repository
        const mockRepository = {
            findOne: jest.fn(() => ({ id: '1', name: 'John Doe', email: 'john@doe.com' })), 
            remove: jest.fn(() => ({ id: '1', name: 'John Doe', email: 'john@doe.com' })) 
        };
    
        jest.spyOn(AppDataSource, 'getRepository').mockReturnValue(mockRepository as any);
    
        await adminController.deleteUser(req, res, next);
    
        expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: '1' } });
        expect(mockRepository.remove).toHaveBeenCalledWith({ id: '1', name: 'John Doe', email: 'john@doe.com' });
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: 'User deleted!', userId: '1' });
    });

    it('should return an error if the user is not found', async () => {

        const req: MockRequest = {
            params: { id: '1' },
            body: { 
                name: 'John Doe', 
                email: 'john@doe.com',
                password: 'password',
                role: 'user',
                userId: '1'
            },
            user: {
                userId: '2',
                role: 'admin'
            }
        };

        const res = {};
        const next = jest.fn();

        // Mock repository
        const mockRepository = {
            findOne: jest.fn(() => null)
        };

        jest.spyOn(AppDataSource, 'getRepository').mockReturnValue(mockRepository as any);

        await adminController.deleteUser(req, res, next);

        expect(next).toHaveBeenCalledWith(expect.any(Error));

    });

    it('should return an error if the user tries to delete their own user', async () => {

        const req: MockRequest = {
            params: { id: '1' },
            body: { 
                name: 'John Doe', 
                email: 'john@doe.com',
                password: 'password',
                role: 'user',
                userId: '1'
            },
            user: {
                userId: '1',
                role: 'admin'
            }
        };
    
        const res = {};
        const next = jest.fn();

        // Mock repository
        const mockRepository = {
            findOne: jest.fn(() => ({ id: '1', name: 'John Doe', email: 'john@doe.com' })),
            remove: jest.fn(() => ({ id: '1', name: 'John Doe', email: 'john@doe.com' }))
        };

        jest.spyOn(AppDataSource, 'getRepository').mockReturnValue(mockRepository as any);

        await adminController.deleteUser(req, res, next);

        expect(next).toHaveBeenCalledWith(expect.any(Error));
        expect(next).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 403 }));

    });

    it('should return an error if the database query fails', async () => {

        const req: MockRequest = {
            params: { id: '1' },
            body: { 
                name: 'John Doe', 
                email: 'john@doe.com',  
                password: 'password',
                role: 'user',
                userId: '1'
            },
            user: {
                userId: '2',
                role: 'admin'
            }
        };

        const res = {};
        const next = jest.fn();

        // Mock repository
        const mockRepository = {
            findOne: jest.fn(() => { throw new Error('Database query failed') })
        };

        jest.spyOn(AppDataSource, 'getRepository').mockReturnValue(mockRepository as any);

        await adminController.deleteUser(req, res, next);

        expect(next).toHaveBeenCalledWith(expect.any(Error));
        expect(next).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 500 }));

    });

});