import { useState } from 'react';
import { jwtDecode } from 'jwt-decode';

function AuthForm({ btnInput, show, onLoginSuccess, onSignInSuccess, onCreateUserSubmit, onCreateUserSuccess, onEditUserSubmit, onEditUserSuccess, user }) {

    const token = localStorage.getItem('token');
    const userId = token ? jwtDecode(token).userId : null;

    const [errors, setErrors] = useState({});

    async function handleSubmit(e) {
        e.preventDefault();

        // create a new FormData object (from the browser)
        const fd = new FormData(e.target);

        // convert FormData object to object
        const data = Object.fromEntries(fd);

        // validate form
        const validationErrors = validateForm(data);
        setErrors(validationErrors);

        // check if there are errors and stop the function
        if (Object.keys(validationErrors).length > 0) {
            return;
        }

        // make the API request

        let url = 'http://localhost:3000/auth/login';
        let method = 'POST';

        if (show === 'signin') {
            url = 'http://localhost:3000/auth/signup';
        }

        let headers = {
            'Content-Type': 'application/json',
        };

        if (onCreateUserSubmit) {

            url = 'http://localhost:3000/admin/createUser';
            headers = {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
            }
        }

        if (onEditUserSubmit) {

            url = 'http://localhost:3000/admin/updateUser/' + user.id;
            method = 'PUT';
            headers = {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
            }

        }

        try {
            const response = await fetch(url, {
                method: method,
                headers: headers,
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (!response.ok) {
                // handle server-side validation errors
                setErrors({ apiError: result.message || 'Something went wrong' });
                return;
            }

            // save the token in local storage if it exists
            if (result.token) {
                localStorage.setItem('token', result.token);
            }

            // call the onLoginSuccess function if it exists
            if (onLoginSuccess) {
                onLoginSuccess();
            }

            // call the onSignInSuccess function if it exists
            if (onSignInSuccess) {
                onSignInSuccess();
            }

            // call the onCreateUserSuccess function if it exists
            if (onCreateUserSuccess) {
                onCreateUserSuccess();
            }

            // call the onEditUserSuccess function if it exists
            if (onEditUserSuccess) {
                onEditUserSuccess();
            }

        } catch (error) {
            console.error('Error:', error);
            setErrors({ apiError: 'An error occurred. Please try again later.' });
        }
    }


    function validateForm(data) {
        const errors = {};

        if (!data.email) {
            errors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(data.email)) {
            errors.email = 'Invalid email format';
        }

        if (!user) {
            if (!data.password) {
                errors.password = 'Password is required';
            } else if (data.password.length < 5) {
                errors.password = 'Password must be at least 5 characters';
            }
        }

        if (show === 'signin' && !user) {
            if (!data.name) {
                errors.name = 'Name is required';
            }

            if (!data['repeat-password']) {
                errors['repeat-password'] = 'Repeat password is required';
            }

            if (data.password !== data['repeat-password']) {
                errors['repeat-password'] = 'Passwords do not match';
            }
        }

        return errors
    }

    return (

        <div className="min-h-screen flex items-center justify-center">
            <form className="w-96 mx-auto" onSubmit={handleSubmit} noValidate>
                {show === 'signin' && (
                    <div className="mb-5">
                        <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Name</label>
                        <input
                            defaultValue={user ? user.name : ''}
                            type="text"
                            id="name"
                            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                            placeholder="Ex: Marta Sanz"
                            name="name"
                            required
                        />
                        {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
                    </div>
                )}
                <div className="mb-5">
                    <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
                    <input
                        defaultValue={user ? user.email : ''}
                        type="email"
                        id="email"
                        className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:[#fbb03b] focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:[#fbb03b] dark:focus:border-blue-500 dark:shadow-sm-light"
                        placeholder="Ex: marta@exemple.com"
                        name="email"
                        required
                    />
                    {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
                    {errors.apiError && errors.apiError === 'E-Mail address already exists!' ? <p className="text-red-600 text-sm mt-1">A user with this email already exists.</p> : null}
                </div>
                <div className="mb-5">
                    <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{user ? 'New password' : 'Password'}</label>
                    <input
                        type="password"
                        id="password"
                        className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:[#fbb03b] focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:[#fbb03b] dark:focus:border-blue-500 dark:shadow-sm-light"
                        name="password"
                        required
                    />
                    {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password}</p>}
                    {errors.apiError && errors.apiError === 'Wrong password!' || errors.apiError === 'A user with this email could not be found.' ? <p className="text-red-600 text-sm mt-1">Incorrect email or password</p> : null}
                    {errors.apiError && errors.apiError === 'Password must be at least 5 characters long.' ? <p className="text-red-600 text-sm mt-1">Password must be at least 5 characters long</p> : null}

                </div>
                {show === 'signin' && !user && (
                    <div className="mb-5">
                        <label htmlFor="repeat-password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Repeat password</label>
                        <input
                            type="password"
                            id="repeat-password"
                            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                            name="repeat-password"
                            required />
                        {errors['repeat-password'] && <p className="text-red-600 text-sm mt-1">{errors['repeat-password']}</p>}
                    </div>
                )}
                {onCreateUserSubmit || user && (user.id !== userId) && (
                    <div className="mb-5 flex gap-5">
                        <div className="flex items-center">
                            <input
                                {...user && user.role === 'user' ? { defaultChecked: true } : {}}
                                id="roleUser"
                                type="radio"
                                value="user"
                                name="role"
                                className="w-4 h-4 text-blue-700 bg-gray-100 border-gray-300"
                            />
                            <label htmlFor="roleUser" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">User</label>
                        </div>
                        <div className="flex items-center">
                            <input
                                {...user && user.role === 'admin' ? { defaultChecked: true } : {}}
                                id="roleAdmin"
                                type="radio"
                                value="admin"
                                name="role"
                                className="w-4 h-4 text-blue-700 bg-gray-100 border-gray-300"
                            />
                            <label htmlFor="roleAdmin" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Admin</label>
                        </div>
                        {errors.apiError && errors.apiError === 'You cannot change your own role.' ? <p className="text-red-600 text-sm mt-1">You cannot change your own role</p> : null}
                    </div>

                )}
                <button
                    type="submit"
                    className="text-white bg-gray-600 hover:bg-[#fbb03b] focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >{btnInput}</button>
            </form>
        </div>
    )
}

export default AuthForm;