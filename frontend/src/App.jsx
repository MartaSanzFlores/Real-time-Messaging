import { useState } from 'react';
import Header from './components/Header';
import Messages from './components/Messages';
import AuthForm from './components/AuthForm';
import AdminUsers from './components/AdminUsers';

function App() {

  const [currentPage, setcurrentPage] = useState("");

  const handleLoginClick = () => {
    setcurrentPage("login");
  };

  const handleSigninClick = () => {
    setcurrentPage("signin");
  };

  const handleAdminUsersClick = () => {
    setcurrentPage("users");
  }

  return (

    <>
      <Header onLoginClick={handleLoginClick} onSignInClick={handleSigninClick} onAdminUsersClick={handleAdminUsersClick} show={currentPage} />
      {currentPage === "login" && (
        <AuthForm show={currentPage} btnInput={'Login'} />
      )}
      {currentPage === "signin" && (
        <AuthForm show={currentPage} btnInput={'Sign in'} />
      )}
      {currentPage === "users" && (
        <AdminUsers />
      )}
      {!currentPage && (
        <main className="my-28 overflow-y-auto">
          <Messages />
        </main>
      )}
    </>
  );
}

export default App;

