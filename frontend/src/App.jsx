import { useState } from 'react';
import Header from './components/Header';
import Message from './components/Message';
import MessageInput from './components/MessageInput';
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
        <AuthForm show={currentPage} btnInput={'Login'}  />
      )}
      {currentPage === "signin" && (
        <AuthForm show={currentPage} btnInput={'Sign in'} />
      )}
      {currentPage === "users" && (
        <AdminUsers />
      )}
      {!currentPage && (
        <div>
          <main className="m-28 overflow-y-auto">
            <Message />
          </main>
          <MessageInput />
        </div>
      )}
    </>
  );
}

export default App;

