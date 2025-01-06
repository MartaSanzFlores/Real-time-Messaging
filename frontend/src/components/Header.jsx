import logo from '../assets/logo.svg'

function Header({ onLoginClick, onSignInClick, onAdminUsersClick, show, isAuthenticated, onLogoClick, onLogoutClick }) {

    return (
        <header className="w-full fixed top-0 bg-gray-100">
            <nav className="container mx-auto flex justify-between items-center">
                <button onClick={onLogoClick}>
                    <img className="w-28 object-cover" src={logo} alt="Logo" />
                </button>
                <div className="flex space-x-8">
                    {isAuthenticated && (
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
                                aria-label="Sign in"
                            >
                                Sign in
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