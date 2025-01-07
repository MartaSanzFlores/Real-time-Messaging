import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import AuthForm from "./AuthForm";

function AdminUsers() {

    const [isFetching, setIsFetching] = useState(false);
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);

    const [isCreating, setIsCreating] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [user, setUser] = useState({});

    // Fetch users
    const fetchUsers = async () => {

        try {

            setIsFetching(true);

            // GET users
            const response = await fetch("http://localhost:3000/admin/getUsers/", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + localStorage.getItem("token"),
                },
            });

            const data = await response.json();

            // check error response (400 or 500)
            if (!response.ok) {
                throw new Error(data.message || "Something went wrong!");
            }

            setUsers(data.users);

        } catch (err) {

            setError(err.message);

        }

        setIsFetching(false);

    };

    // get users on component mount
    useEffect(() => {

        fetchUsers();

    }, []);

    // Create user
    const onCreateUserClick = () => {
        setIsCreating(true);
    }

    // Create user submit
    async function handleCreateUserSubmit() {
        setIsCreating(false);
        fetchUsers();
    }

    // Edit user
    async function onEditUserClick(userId) {

        // Get user
        try {

            const response = await fetch("http://localhost:3000/admin/getUser/" + userId, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + localStorage.getItem("token"),
                },
            });

            const data = await response.json();

            // check error response (400 or 500)
            if (!response.ok) {
                throw new Error(data.message || "Something went wrong!");
            }

            setUser(data.user);

        } catch (err) {

            setError(err.message);

        }

        setIsEditing(true);
    }

    // Edit user submit
    async function handleEditUser() {
        setIsEditing(false);
        fetchUsers();
    }

    // Delete user
    async function handleDeleteUser(userId) {

        try {

            // DELETE user
            const response = await fetch("http://localhost:3000/admin/deleteUser/" + userId, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + localStorage.getItem("token"),
                },
            });

            const data = await response.json();

            // check error response (400 or 500)
            if (!response.ok) {
                throw new Error(data.message || "Something went wrong!");
            }

            fetchUsers();

        } catch (err) {

            setError(err.message);

        }

    }


    // Is error 
    if (error) {
        return <p className="text-center mt-32">{error}</p>;
    }

    // Is fetching
    if (isFetching) {
        return <p className="text-center mt-32">Loading...</p>;
    }

    return (

        <>
            <div className="min-h-screen flex flex-col items-start justify-center max-w-screen-lg mx-auto">

                <button
                    onClick={onCreateUserClick}
                    type="button"
                    className="mb-10 text-white bg-gray-600 hover:bg-[#fbb03b] focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-start dark:bg-[#633bfb] dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >Create new user
                </button>

                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">
                                Name
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Email
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Role
                            </th>
                            <th scope="col" className="px-6 py-3">
                                <span className="sr-only">Edit</span>
                            </th>
                            <th scope="col" className="px-6 py-3">
                                <span className="sr-only">Delete</span>
                            </th>
                        </tr>
                    </thead>
                    {users.length === 0 ? (

                        <tbody>
                            <tr>
                                <td className="px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white">
                                    No users found.
                                </td>
                            </tr>
                        </tbody>

                    ) : (

                        users.map((user) => (
                            <tbody key={user.id}>
                                <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                        {user.name}
                                    </th>
                                    <td className="px-6 py-4">
                                        {user.email}
                                    </td>
                                    <td className="px-6 py-4">
                                        {user.role}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <a
                                            onClick={() => onEditUserClick(user.id)}
                                            href="#"
                                            className="font-medium text-[#633bfb] dark:text-blue-500 hover:underline">
                                            Edit
                                        </a>
                                    </td>

                                    <td className="px-6 py-4 text-right">
                                        {user.id !== jwtDecode(localStorage.getItem("token")).userId && (
                                            <a
                                                onClick={() => handleDeleteUser(user.id)}
                                                href="#"
                                                className="font-medium text-red-600 dark:text-red-500 hover:underline">
                                                Delete
                                            </a>
                                        )}
                                    </td>

                                </tr>
                            </tbody>
                        ))
                    )}

                </table>
            </div>

            {isCreating && (
                <>
                    <div className="fixed top-0 left-0 w-full h-full bg-gray-300 bg-opacity-80 flex items-center justify-center">
                        <button
                            onClick={() => setIsCreating(false)}
                            className="absolute top-20 right-auto text-white bg-gray-400 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-3 py-1.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                            aria-label="Close modal"
                        >Close
                        </button>
                        <AuthForm
                            show={'signin'}
                            btnInput={'Crate user'}
                            onCreateUserSubmit={true}
                            onCreateUserSuccess={handleCreateUserSubmit}
                        />
                    </div>
                </>
            )}

            {isEditing && (

                <>
                    <div className="fixed top-0 left-0 w-full h-full bg-gray-300 bg-opacity-80 flex items-center justify-center">
                        <button
                            onClick={() => setIsEditing(false)}
                            className="absolute top-20 right-auto text-white bg-gray-400 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-3 py-1.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                            aria-label="Close modal"
                        >Close
                        </button>
                        <AuthForm
                            show={'signin'}
                            btnInput={'Edit user'}
                            onEditUserSubmit={true}
                            user={user}
                            onEditUserSuccess={handleEditUser}
                        />
                    </div>
                </>
            )}

        </>

    );
}

export default AdminUsers;