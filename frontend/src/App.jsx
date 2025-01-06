import { useState, useEffect } from 'react';
import Header from './components/Header';
import Messages from './components/Messages';
import AuthForm from './components/AuthForm';
import AdminUsers from './components/AdminUsers';

function App() {

  const [currentPage, setCurrentPage] = useState("login");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
      setCurrentPage("messages");
    }
  }, []);

  const handleLoginClick = () => {
    setCurrentPage("login");
  };

  const handleSigninClick = () => {
    setCurrentPage("signin");
  };

  const handleSignInSuccess = () => {
    setCurrentPage("login");
  };

  const handleAdminUsersClick = () => {
    setCurrentPage("users");
  }

  const handleLogoClick = () => {
    setCurrentPage("messages");
  }

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    setCurrentPage("messages");
  }

  const handleLogout = () => {
    setIsAuthenticated(false);

    // Clear token from local storage
    localStorage.removeItem('token');

    setCurrentPage("login");
  }

  return (

    console.log(isAuthenticated),

    <>
      <Header onLoginClick={handleLoginClick} onSignInClick={handleSigninClick} onAdminUsersClick={handleAdminUsersClick} onLogoClick={handleLogoClick} onLogoutClick={handleLogout} show={currentPage} isAuthenticated={isAuthenticated} />
      {currentPage === "login" && (
        <AuthForm 
        show={currentPage} 
        btnInput={'Login'} 
        onLoginSuccess={handleLoginSuccess}
        />
      )}
      {currentPage === "signin" && (
        <AuthForm 
        show={currentPage} 
        btnInput={'Sign in'} 
        onSignInSuccess={handleSignInSuccess} 
        />
      )}
      {currentPage === "users" && (
        <AdminUsers />
      )}
      {currentPage === "messages" && isAuthenticated && (
        <main className="my-28 overflow-y-auto">
          <Messages />
        </main>
      )}
    </>
  );
}

export default App;

