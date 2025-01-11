import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AdminUsers from './AdminUsers';

describe('AdminUsers', () => {

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

    test('renders a table of users', async () => {
        // mock fetch to return a successful response
        global.fetch = jest.fn().mockResolvedValueOnce({
            ok: true,
            json: () => ({
                users: [
                    { id: "1", name: "Alice", email: "alice@test.com", role: "user" },
                    { id: "2", name: "Bob", email: "bob@test.com", role: "admin" }
                ],
            }),
        });

        render(<AdminUsers />);

        const users = await screen.findAllByTestId("user");

        expect(users).toHaveLength(2);
        expect(screen.getByText("Alice")).toBeInTheDocument();
        expect(screen.getByText("Bob")).toBeInTheDocument();
    });

    test('renders an error message if request is unsuccessful', async () => {
        // mock fetch to return an unsuccessful response
        global.fetch.mockResolvedValueOnce({
            ok: false,
            json: () => ({ message: "Error" }),
        });

        render(<AdminUsers />);

        const errorMessage = await screen.findByTestId("error");

        expect(errorMessage).toBeInTheDocument();
    });

    test('renders a form to add a user', async () => {
        // mock fetch to return a successful response
        global.fetch = jest.fn().mockResolvedValueOnce({
            ok: true,
            json: () => ({
                users: [
                    { id: "1", name: "Alice", email: "alice@test.com", role: "user" },
                    { id: "2", name: "Bob", email: "bob@test.com", role: "admin" }
                ],
            }),
        });

        render(<AdminUsers />);

        const addButton = await screen.findByText("Create new user");

        fireEvent.click(addButton);

        const addForm = await screen.findByText("Create user");
        expect(addForm).toBeInTheDocument();
    });

    test('renders a form to edit a user', async () => {
        // mock fetch to return a successful response
        global.fetch = jest.fn()
            .mockResolvedValueOnce({ // users list
                ok: true,
                json: () => ({
                    users: [
                        { id: "1", name: "Alice", email: "alice@test.com", role: "user" },
                    ],
                }),
            })
            .mockResolvedValueOnce({ // user to edit
                ok: true,
                json: () => ({
                    user: { id: "1", name: "Alice", email: "alice@test.com", role: "user" }
                }),
            });

        render(<AdminUsers />);

        const editButton = await screen.findByTestId("editButton");
        fireEvent.click(editButton);

        const editForm = await screen.findByText("Edit user");
        expect(editForm).toBeInTheDocument();

    });

    test('renders an error message if request is unsuccessful', async () => {
        // mock fetch to return an unsuccessful response
        global.fetch.mockResolvedValueOnce({
            ok: false,
            json: () => ({ message: "Error" }),
        });

        render(<AdminUsers />);

        const errorMessage = await screen.findByTestId("error");

        expect(errorMessage).toBeInTheDocument();
    });

    test('render the new user when a user is created', async () => {
        // mock fetch to return a successful response
        global.fetch = jest.fn()
            .mockResolvedValueOnce({ // users list
                ok: true,
                json: () => ({
                    users: [
                        { id: "1", name: "Alice", email: "alice@test.com", role: "user" },
                    ],
                }),
            })
            .mockResolvedValueOnce({ // user to create
                ok: true,
                json: () => ({
                    user: { id: "2", name: "Bob", email: "bob@test.com", role: "user" }
                }),
            })
            .mockResolvedValueOnce({ // new users list
                ok: true,
                json: () => ({
                    users: [
                        { id: "1", name: "Alice", email: "alice@test.com", role: "user" },
                        { id: "2", name: "Bob", email: "bob@test.com", role: "user" }
                    ],
                }),
            });

        render(<AdminUsers />);

        const addButton = await screen.findByText("Create new user");
        fireEvent.click(addButton);

        const nameInput = await screen.findByLabelText("Name");
        fireEvent.change(nameInput, { target: { value: "Bob" } });
        const emailInput = await screen.findByLabelText("Email");
        fireEvent.change(emailInput, { target: { value: "bob@test.com" } });
        const passwordInput = await screen.findByLabelText("Password");
        fireEvent.change(passwordInput, { target: { value: "password" } });
        const repeatPasswordInput = await screen.findByLabelText("Repeat password");
        fireEvent.change(repeatPasswordInput, { target: { value: "password" } });

        const createButton = await screen.findByText("Create user");
        fireEvent.click(createButton);

        const newUser = await screen.findByText("Bob");
        expect(newUser).toBeInTheDocument();
    });

    test('render the updated user when a user is edited', async () => {
        // mock fetch to return a successful response
        global.fetch = jest.fn()
            .mockResolvedValueOnce({ // users list
                ok: true,
                json: () => ({
                    users: [
                        { id: "1", name: "Alice", email: "alice@test.com", role: "user" },
                    ],
                }),
            })
            .mockResolvedValueOnce({ // user to edit
                ok: true,
                json: () => ({
                    user: { id: "1", name: "Alice", email: "alice@test.com", role: "user" },
                }),
            })
            .mockResolvedValueOnce({ // user edition
                ok: true,
                json: () => ({
                    user: { id: "1", name: "Alice", email: "alice@test2.com", role: "user" }
                }),
            })
            .mockResolvedValueOnce({ // new users list
                ok: true,
                json: () => ({
                    users: [
                        { id: "1", name: "Alice", email: "alice@test2.com", role: "user" },
                    ],
                }),
            });

        render(<AdminUsers />);

        const editButton = await screen.findByTestId("editButton");
        fireEvent.click(editButton);

        const emailInput = await screen.findByLabelText("Email");
        fireEvent.change(emailInput, { target: { value: "alice@test2.com" } });

        const updateButton = await screen.findByText("Edit user");
        fireEvent.click(updateButton);

        const updatedUser = await screen.findByText("alice@test2.com");
        expect(updatedUser).toBeInTheDocument();
    });

    test('delete a user', async () => {
        global.fetch = jest.fn()
            .mockResolvedValueOnce({ // users list
                ok: true,
                json: () => ({
                    users: [
                        { id: "1", name: "Alice", email: "alice@test.com", role: "user" },
                        { id: "2", name: "Bob", email: "bob@test.com", role: "admin" }
                    ],
                }),
            })
            .mockResolvedValueOnce({ // user to delete
                ok: true,
                json: () => ({
                    message: "User deleted!",  // success message
                    userId: "1",  // id of the deleted user
                }),
            })
            .mockResolvedValueOnce({ // new users list
                ok: true,
                json: () => ({
                    users: [
                        { id: "2", name: "Bob", email: "bob@test.com", role: "admin" }
                    ],
                }),
            });
    
        render(<AdminUsers />);
    
        // verify that there are 2 users
        let users = await screen.findAllByTestId("user");
        expect(users).toHaveLength(2);
    
        const deleteButtons = await screen.findAllByTestId("deleteButton");
        fireEvent.click(deleteButtons[0]);
    
        // verify that there is only 1 user left after deleting
        // waitFor is used to wait for the DOM to update
        await waitFor(() => {
            users = screen.queryAllByTestId("user"); 
            expect(users).toHaveLength(1);
        });
    });
    
});
