import { Lock, MapPin, User } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';


export const Signup = () => {
    const [formdata, setformdata] = useState({
        username: '',
        password: '',
        location: ''
    });

    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setformdata((prev: any) => ({
            ...prev,
            [name]: value
        }));
    };

    // Add async here
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log("Form Submitted:", formdata);

        try {
            const response = await fetch("http://localhost:3000/signup", {
                method: "POST",  // Request method
                headers: {
                    "Content-Type": "application/json",  // Sending data as JSON
                },
                body: JSON.stringify(formdata),  // Convert form data to JSON string
            });

            // Check if the request was successful
            if (!response.ok) {
                throw new Error("Error: " + response.statusText);
            }

            // Handle the response from the API
            const data = await response.json();
            console.log("Response from API:", data);
            alert('User Created Please Signin')
            navigate('/login')

            // Optionally, you can clear the form or show success message
            setformdata({
                username: "",
                password: "",
                location: ""
            });
        } catch (error) {
            console.error("Error occurred:", error);
        }
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
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {/* Input fields container */}
                    <div className="space-y-4">
                        {/* username_field*/}
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
                                    type="text" // Fixed type to text
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

                        {/* Location field */}
                        <div>
                            <label htmlFor="location" className="sr-only">
                                Location
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                                    <MapPin className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="location"
                                    name="location"
                                    type="text" // Fixed type to text
                                    value={formdata.location}
                                    onChange={handleChange}
                                    className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Location"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Submit button */}
                    <button
                        type="submit"
                        className="w-full py-2 px-4 text-white bg-blue-600 hover:bg-blue-700 rounded-md"
                    >
                        Sign Up
                    </button>
                    <div className="flex justify-center">
                        Already have an account?{" "}
                        <a href="/login" className="text-blue-600">
                            Sign In
                        </a>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Signup;
