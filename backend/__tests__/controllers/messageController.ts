import messageController from '../../src/controllers/messageController';
import Message from '../../src/models/Message';
import AppDataSource from '../../src/config/typeorm';
import { getIO } from '../../socket';

const { validationResult } = require('express-validator');

jest.mock('express-validator');

interface MockRequest {
    body: {
        content: string;
    },
    user: {
        userId: string;
        role: string;
    };
}

describe('Message Controller', () => {

    it('should return an error if the database query fails', async () => {

        const req = {};
        const res = {};
        const next = jest.fn();

        // Mocking the find method
        jest.spyOn(Message, 'find').mockRejectedValue(new Error('Database query failed'));

        await messageController.getMessages(req, res, next);

        expect(next).toHaveBeenCalledWith(expect.any(Error));
        expect(next).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 500 }));

    });

    it('should returns a list of messages', async () => {

        const req = {};
        const res = {
            status: jest.fn(() => res),
            json: jest.fn()
        } as any;
        const next = jest.fn();

        // Mocking the find method
        jest.spyOn(Message, 'find').mockResolvedValue([{ content: 'Hello World' }]);

        await messageController.getMessages(req, res, next);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ messages: [{ content: 'Hello World' }] });

    });

    it('should return an error if validation fails', async () => {

        const req = {
            body: {
                content: ''
            },
            user: {
                userId: '1',
                role: 'user'
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

        await messageController.createMessage(req, res, next);

        expect(next).toHaveBeenCalledWith(expect.any(Error));
        expect(next).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 422 }));

    });

    it('should return an error if the user is not found', async () => {

        const req = {
            body: {
                content: 'Hello World'
            },
            user: {
                userId: '1',
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

        const mockRepository = {
            findOne: jest.fn(() => null)
        };

        // Mock AppDataSource.getRepository to return our mocked repository
        jest.spyOn(AppDataSource, 'getRepository').mockReturnValue(mockRepository as any);

        await messageController.createMessage(req, res, next);

        expect(next).toHaveBeenCalledWith(expect.any(Error));
        expect(next).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 404 }));

    });

    // Mocking getIO
    const mockEmit = jest.fn();
    jest.mock('../../socket', () => {
        return {
            getIO: jest.fn(() => ({
                emit: mockEmit
            }))
        };
    });


    jest.setTimeout(10000);

    // it('should create a message', async () => {
    //     const req: MockRequest = {
    //         body: {
    //             content: 'Hello World'
    //         },
    //         user: {
    //             userId: '1',
    //             role: 'user'
    //         }
    //     };

    //     const res = {
    //         status: jest.fn(() => res),
    //         json: jest.fn()
    //     } as any;

    //     const next = jest.fn();

    //     // Mocking validationResult
    //     validationResult.mockImplementation(() => {
    //         return {
    //             isEmpty: () => true
    //         };
    //     });

    //     // Mocking AppDataSource.getRepository
    //     jest.spyOn(AppDataSource, 'getRepository').mockReturnValue({
    //         findOne: jest.fn(() => ({ id: '1', name: 'John Doe' })),
    //     } as any);


    //     // Mocking MongoDB Message model
    //     jest.mock('../../src/models/Message', () => {
    //         return jest.fn().mockImplementation(() => {
    //             return {
    //                 save: jest.fn(() => ({
    //                     _doc: { content: 'Hello World', senderName: 'John Doe', senderId: '1', status: 'sent' }
    //                 }))
    //             };
    //         });
    //     });

    //     // Mocking getIO for WebSocket
    //     const mockEmit = jest.fn();
    //     jest.mock('../../socket', () => {
    //         return {
    //             getIO: jest.fn(() => ({
    //                 emit: mockEmit
    //             }))
    //         };
    //     });

    //     await messageController.createMessage(req, res, next);

    //     expect(res.status).toHaveBeenCalledWith(201);

    //     expect(res.json).toHaveBeenCalledWith({
    //         message: 'Message created!',
    //         savedMessage: { content: 'Hello World', senderName: 'John Doe', senderId: '1', status: 'sent' }
    //     });

    // });

});