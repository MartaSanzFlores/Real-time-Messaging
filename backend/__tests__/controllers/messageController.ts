import messageController from '../../src/controllers/messageController';
import Message from '../../src/models/Message';
import AppDataSource from '../../src/config/typeorm';
import { getIO } from '../../socket';
import { send } from 'process';

const { validationResult } = require('express-validator');

jest.mock('express-validator');
jest.mock('../../src/models/Message');

jest.mock('../../socket', () => ({
    getIO: jest.fn()
}));

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

    it('should create a message and emit through WebSocket', async () => {
        const req: MockRequest = {
            body: {
                content: 'Hello World'
            },
            user: {
                userId: '1',
                role: 'user'
            }
        };

        const res = {
            status: jest.fn(() => res),
            json: jest.fn()
        } as any;

        const next = jest.fn();

        // Mocking validationResult
        validationResult.mockImplementation(() => {
            return {
                isEmpty: () => true
            };
        });

        // Mock User repository to return a user
        const mockUser = { id: '1', name: 'John Doe' };
        jest.spyOn(AppDataSource, 'getRepository').mockReturnValue({
            findOne: jest.fn(() => mockUser)
        } as any);

        // Mock the save method of Message
        const mockSave = jest.fn().mockResolvedValue({
            id: '1',
            content: 'Hello World',
            status: 'sent',
            senderId: '1',
            senderName: 'John Doe',
            _doc: { // Mock the _doc property
                id: '1',
                content: 'Hello World',
                status: 'sent',
                senderId: '1',
                senderName: 'John Doe'
            }
        });

        // Mock the save method of Message
        Message.prototype.save = mockSave;

        // Mock getIO to return a mock socket object with an emit method
        const mockEmit = jest.fn();
        const mockSocket = {
            emit: mockEmit
        };

        // Ensure that getIO() returns the mock socket
        (getIO as jest.Mock).mockReturnValue(mockSocket);

        // Call the controller method
        await messageController.createMessage(req, res, next);

        // Ensure status(201) is called
        expect(res.status).toHaveBeenCalledWith(201);

        // Ensure the correct message is returned in the response
        expect(res.json).toHaveBeenCalledWith({
            message: 'Message created!',
            savedMessage: {
                id: '1',
                content: 'Hello World',
                senderId: '1',
                senderName: 'John Doe',
                status: 'sent',
                _doc: { // Mock the _doc property
                    id: '1',
                    content: 'Hello World',
                    status: 'sent',
                    senderId: '1',
                    senderName: 'John Doe'
                }
            }
        });

        // Vérifie que mockEmit a bien été appelé une fois
        expect(mockEmit).toHaveBeenCalledTimes(1);

        // Vérifie que getIO().emit a bien été appelé avec les bons paramètres
        expect(mockEmit).toHaveBeenCalledWith('messages', {
            action: 'create',
            message: expect.objectContaining({
                id: '1',
                content: 'Hello World',
                senderId: '1',
                senderName: 'John Doe',
                status: 'sent'
            })
        });

    });

});