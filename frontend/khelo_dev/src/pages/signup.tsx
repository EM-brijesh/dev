
import { Lock, MapPin, User } from 'lucide-react';
import { useState } from 'react';

export const Signup = () => {
    const [formdata, setFormdata] = useState({
        username: '',
        password: '',
        location: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormdata((prev: any) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log("Form Submitted:", formdata);
    };

    return (
        // Main container with centering
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            {/* Form container */}
            <div className="max-w-md w-full space-y-8">
                {/* Header section */}
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-900">
                        Sign up to your account
                    </h2>
                </div>

                {/* Form */}
                <form className="mt-8 space-y-6 " onSubmit={handleSubmit}>
                    {/* Input fields container */}
                    <div className="space-y-4">
                        {/* username_feild*/}
                        <div>
                            <label htmlFor="username" className="sr-only">
                                Username
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                                    <User className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="username"
                                    name="username"
                                    type="username"
                                    value={formdata.username}
                                    onChange={handleChange}
                                    className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="username"
                                />
                            </div>
                        </div>

                        {/* Password field */}
                        <div>
                            <label htmlFor="password" className="sr-only">
                                Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    value={formdata.password}
                                    onChange={handleChange}
                                    className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Password"
                                />
                            </div>
                        </div>
                        {/* location field */}
                        <div>
                            <label htmlFor="location" className="sr-only">
                                location
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                                    <MapPin className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="location"
                                    name="location"
                                    type="location"
                                    value={formdata.location}
                                    onChange={handleChange}
                                    className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="location"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Submit button */}
                    <button
                        type="submit"
                        className="w-full py-2 px-4 text-white bg-blue-600 hover:bg-blue-700 rounded-md"
                    >
                        Sign in
                    </button>
                    <div className='flex  justify-center'>
                        Already have an account? <a href="/login" className="text-blue-600">Sign In</a>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Signup;