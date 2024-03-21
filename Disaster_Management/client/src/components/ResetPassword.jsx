import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useLocation } from 'react-router-dom';

const ResetPassword = () => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const token = searchParams.get('token');
    
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        console.log(token);
    }, [token]);

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Check if passwords match
            if (password !== confirmPassword) {
                toast.error("Passwords don't match");
                setLoading(false);
                return;
            }

            // Make a POST request to your backend API to reset the password
            const response = await axios.post('http://localhost:5500/resetPassword', { token, password });
            console.log(response);
            
            // Display success message if password reset successfully
            setSuccessMessage(response.data.message);
        } catch (error) {
            // Display error message if something goes wrong
            toast.error('Failed to reset password. Please try again later.');
            console.error(error);
        }

        setLoading(false);
    };

    return (
        <div className="container mt-5">
       
            
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-body">
                            <h2 className="text-center mb-4">Reset Password</h2>
                            {successMessage && (
                                <div className="alert alert-success" role="alert">
                                    {successMessage}
                                </div>
                            )}
                            {!successMessage && (
                                <form onSubmit={handleResetPassword}>
                                    <div className="mb-3">
                                        <label htmlFor="password" className="form-label">New Password:</label>
                                        <input 
                                            type="password"
                                            className="form-control"
                                            id="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="confirmPassword" className="form-label">Confirm Password:</label>
                                        <input 
                                            type="password"
                                            className="form-control"
                                            id="confirmPassword"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <button type="submit" className="btn btn-primary" disabled={loading}>
                                        {loading ? 'Resetting...' : 'Reset Password'}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
