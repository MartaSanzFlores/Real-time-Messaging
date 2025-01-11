import { render, screen } from '@testing-library/react';
import Message from './Message';

describe('Message', () => {

    beforeEach(() => {
        // Mock le localStorage pour retourner un token valide
        const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'; // Remplace ceci par un token valide simulé
        jest.spyOn(Storage.prototype, 'getItem').mockImplementation((key) => {
            if (key === 'token') {
                return mockToken; // Simule un token dans localStorage
            }
            return null;
        });
    });

    afterEach(() => {
        // Restaurer les mocks après chaque test
        jest.restoreAllMocks();
    });

    test('renders a message', () => {
        render(<Message senderName="Alice" date="2022-01-01" content="Hello, World!" status="sent" senderId="1" />);
        const senderName = screen.getByText("Alice");
        const date = screen.getByText("2022-01-01");
        const content = screen.getByText("Hello, World!");
        expect(senderName).toBeInTheDocument();
        expect(date).toBeInTheDocument();
        expect(content).toBeInTheDocument();
    });

});