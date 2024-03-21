import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [resetLinkSent, setResetLinkSent] = useState(false); // State to track whether the reset link is sent

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Make a POST request to your backend API to initiate the password reset process
            const response = await axios.post('http://localhost:5500/forgotPassword', { email });
            console.log("my email",response.data,email);
            
          
            toast.success(response.data.message);
            // Set resetLinkSent to true to display the message
            setResetLinkSent(true);
        } catch (error) {
            
            toast.error('Failed to send password reset link. Please try again later.');
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
                            <h2 className="text-center mb-4">Forgot Password</h2>
                            {/* Display reset link sent message if resetLinkSent is true */}
                            {resetLinkSent && (
                                <div className="alert alert-success" role="alert">
                                    Password reset link has been sent to your email.
                                </div>
                            )}
                            <form onSubmit={handleResetPassword}>
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">Email:</label>
                                    <input 
                                        type="email"
                                        className="form-control"
                                        id="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                                <button type="submit" className="btn btn-primary" disabled={loading}>
                                    {loading ? 'Sending...' : 'Send Reset Link'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
