import { useState } from 'react';

function AuthForm({ btnInput, show, onLoginSuccess, onSignInSuccess }) {

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
        try {
            const response = await fetch(show === 'signin' ? 'http://localhost:3000/auth/signup' : 'http://localhost:3000/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (!response.ok) {
                // handle server-side validation errors
                setErrors({ apiError: result.message || 'Something went wrong' });
                return;
            }

            // save the token in local storage
            if(result.token) {
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

        if (!data.password) {
            errors.password = 'Password is required';
        } else if (data.password.length < 5) {
            errors.password = 'Password must be at least 5 characters';
        }

        if (show === 'signin') {
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
                            type="text"
                            id="name"
                            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                            placeholder="Ex: Marta Sanz"
                            name="name"
                            required />
                    </div>
                )}
                <div className="mb-5">
                    <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
                    <input
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
                    <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                    <input
                        type="password"
                        id="password"
                        className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:[#fbb03b] focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:[#fbb03b] dark:focus:border-blue-500 dark:shadow-sm-light"
                        name="password"
                        required
                    />
                    {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password}</p>}
                    {errors.apiError && errors.apiError === 'Wrong password!' ||  errors.apiError === 'A user with this email could not be found.' ? <p className="text-red-600 text-sm mt-1">Incorrect email or password</p> : null}
                </div>
                {show === 'signin' && (
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
                <button
                    type="submit"
                    className="text-white bg-gray-600 hover:bg-[#fbb03b] focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >{btnInput}</button>
            </form>
        </div>
    )
}

export default AuthForm;