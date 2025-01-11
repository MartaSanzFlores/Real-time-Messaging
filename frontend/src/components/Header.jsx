import { jwtDecode } from 'jwt-decode';
import logo from '../assets/logo.svg';

function Header({ onLoginClick, onSignInClick, onAdminUsersClick, show, isAuthenticated, onLogoClick, onLogoutClick }) {

    const token = localStorage.getItem('token');
    let role = 'user';

    if (token) {
        role = jwtDecode(token).role;
    }

    return (
        <header className="w-full fixed top-0 bg-gray-100">
            <nav className="container mx-auto px-10 flex justify-between items-center">
                <button onClick={onLogoClick}>
                    <img className="w-28 object-cover" src={logo} alt="Logo" />
                </button>
                {isAuthenticated && (
                    <p className="font-semibold">Welcome {jwtDecode(token).userName} !</p>
                )}
                <div className="flex space-x-8">

                    {isAuthenticated && token && role === 'admin' && (
                        <button
                            onClick={onAdminUsersClick}
                            className={`text-gray-500 font-semibold hover:text-[#fbb03b] ${show === 'users' ? "text-[#fbb03b]" : ""
                                }`}
                            aria-label="Users"
                        >
                            Admin Users
                        </button>
                    )}
                    {!isAuthenticated && (
                        <>
                            <button
                                onClick={onLoginClick}
                                className={`text-gray-500 font-semibold hover:text-[#fbb03b] ${show === 'login' ? "text-[#fbb03b]" : ""
                                    }`}
                                aria-label="Login"
                            >
                                Login
                            </button>
                            <button
                                onClick={onSignInClick}
                                className={`text-gray-500 font-semibold hover:text-[#fbb03b] ${show === 'signin' ? "text-[#fbb03b]" : ""
                                    }`}
                                aria-label="Sign up"
                            >
                                Sign up
                            </button>
                        </>
                    )}

                    {isAuthenticated && (
                        <button
                            onClick={onLogoutClick}
                            className="text-gray-500 font-semibold hover:text-[#fbb03b]"
                            aria-label="Logout"
                        >
                            Logout
                        </button>
                    )}
                </div>
            </nav>
        </header >

    );
}

export default Header;