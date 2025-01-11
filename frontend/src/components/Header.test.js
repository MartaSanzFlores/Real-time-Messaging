import Header from "./Header";
import { render, screen, fireEvent } from "@testing-library/react";
import { jwtDecode } from 'jwt-decode';

jest.mock('jwt-decode', () => ({
    jwtDecode: jest.fn(),
  }));

describe("Header", () => {

    test("renders the header", () => {
        render(<Header />);
        const logo = screen.getByAltText("Logo");
        expect(logo).toBeInTheDocument();
    });

    test("renders the login button", () => {
        render(<Header />);
        const loginButton = screen.getByText("Login");
        expect(loginButton).toBeInTheDocument();
    });

    test("renders the sign up button", () => {
        render(<Header />);
        const signInButton = screen.getByText("Sign up");
        expect(signInButton).toBeInTheDocument();
    });

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

    jwtDecode.mockReturnValue({ 
        sub: '123456789',
        userName: 'John Doe',
        role: 'user'
    });

    afterEach(() => {
        // Restaurer les mocks après chaque test
        jest.restoreAllMocks();
    });

    test("renders the logout button", () => {
        render(<Header isAuthenticated={true} />);
        const logoutButton = screen.getByText("Logout");
        expect(logoutButton).toBeInTheDocument();
    });

    test("renders the welcome message", () => {
        render(<Header isAuthenticated={true} />);
        const welcomeMessage = screen.getByText("Welcome John Doe !");
        expect(welcomeMessage).toBeInTheDocument();
    });

    test("does not render the admin users button is the role is not admin", () => {
        render(<Header isAuthenticated={true} />);
        const adminUsersButton = screen.queryByText("Admin Users");
        expect(adminUsersButton).not.toBeInTheDocument();
    });

    test("renders the admin users button is the role is admin", () => {
        jwtDecode.mockReturnValue({ 
            sub: '123456789',
            name: 'John Doe',
            role: 'admin'
        });
        render(<Header isAuthenticated={true} />);
        const adminUsersButton = screen.getByText("Admin Users");
        expect(adminUsersButton).toBeInTheDocument();
    });

    test("calls onLogoutClick when the logout button is clicked", () => {
        const onLogoutClick = jest.fn();
        render(<Header isAuthenticated={true} onLogoutClick={onLogoutClick} />);
        const logoutButton = screen.getByText("Logout");
        fireEvent.click(logoutButton);
        expect(onLogoutClick).toHaveBeenCalled();
    });

    test("calls onAdminUsersClick when the admin users button is clicked", () => {
        const onAdminUsersClick = jest.fn();
        jwtDecode.mockReturnValue({ 
            sub: '123456789',
            name: 'John Doe',
            role: 'admin'
        });
        render(<Header isAuthenticated={true} onAdminUsersClick={onAdminUsersClick} />);
        const adminUsersButton = screen.getByText("Admin Users");
        fireEvent.click(adminUsersButton);
        expect(onAdminUsersClick).toHaveBeenCalled();
    });

    test("calls onLoginClick when the login button is clicked", () => {
        const onLoginClick = jest.fn();
        render(<Header onLoginClick={onLoginClick} />);
        const loginButton = screen.getByText("Login");
        fireEvent.click(loginButton);
        expect(onLoginClick).toHaveBeenCalled();
    });

    test("calls onSignInClick when the sign up button is clicked", () => {
        const onSignInClick = jest.fn();
        render(<Header onSignInClick={onSignInClick} />);
        const signInButton = screen.getByText("Sign up");
        fireEvent.click(signInButton);
        expect(onSignInClick).toHaveBeenCalled();
    });

    test("calls onLogoClick when the logo is clicked", () => {
        const onLogoClick = jest.fn();
        render(<Header onLogoClick={onLogoClick} />);
        const logo = screen.getByAltText("Logo");
        fireEvent.click(logo);
        expect(onLogoClick).toHaveBeenCalled();
    });

});