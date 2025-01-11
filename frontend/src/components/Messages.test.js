import { render, screen } from '@testing-library/react';
import Messages from './Messages';

describe('Messages', () => {

    beforeEach(() => {
        // mock localStorage to return a valid token
        const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'; // Remplace ceci par un token valide simulé
        jest.spyOn(Storage.prototype, 'getItem').mockImplementation((key) => {
            if (key === 'token') {
                return mockToken; // simulate a token in localStorage
            }
            return null;
        });

    });

    afterEach(() => {
        // restore mocks after each test
        jest.restoreAllMocks();
    });

    test('renders messages if request is successful', async () => {

        // mock fetch to return a successful response
        global.fetch = jest.fn().mockResolvedValueOnce({
            ok: true,
            json: () => ({
                messages: [
                    { _id: "1", senderName: "Alice", senderId: "1", content: "Hello", status: "sent", createdAt: "2025-01-01T00:00:00Z" },
                    { _id: "2", senderName: "Bob", senderId: "2", content: "Hi", status: "sent", createdAt: "2025-01-01T01:00:00Z" }
                ],
            }),
        });

        render(<Messages />);

        const messages = await screen.findAllByTestId("message");

        expect(messages).toHaveLength(2);
        expect(screen.getByText("Alice")).toBeInTheDocument();
        expect(screen.getByText("Bob")).toBeInTheDocument();
    });

    test('renders an error message if request is unsuccessful', async () => {
        // mock fetch to return an unsuccessful response
        global.fetch.mockResolvedValueOnce({
            ok: false,
            json: () => ({ message: "Error" }),
        });

        render(<Messages />);

        const errorMessage = await screen.findByTestId("error");
        
        expect(errorMessage).toBeInTheDocument();
    });

});