import React, { useState } from "react";
import axios from "axios";
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/Login.scss';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Login() {
    const navigate = useNavigate();
    const [data, setData] = useState({
        email: '',
        password: '',
    });

    const [errors, setErrors] = useState({});

    const loginUser = async (e) => {
        e.preventDefault();

        // Validation logic
        const validationErrors = validateForm(data);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            const { data: responseData } = await axios.post('http://localhost:5500/login', data);

            if (responseData.error) {
                // Clear previous errors
                setErrors({});

                // Handle different server-side errors
                if (responseData.error === 'No user found') {
                    setErrors({ email: 'User not found', password: '' });
                } else if (responseData.error === 'Password does not match') {
                    setErrors({ email: '', password: 'Password does not match' });
                } else {
                    // Display other server-side errors using toast
                    toast.error(responseData.error);
                }
            } else {
                // Clear form data and errors on successful login
                setData({});
                setErrors({});
                navigate('/disasterCard');
            }
        } catch (error) {
            console.log(error);
        }
    };
    const isValidEmail = (email) => {
        // Simple email validation regex, you might want to use a more robust solution
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };
    const validateForm = (formData) => {
        const errors = {};

        // Validate email
        if (!formData.email) {
            errors.email = 'Email is required';
        } else if (!isValidEmail(formData.email)) {
            errors.email = 'Invalid email format';
        }

        // Validate password
        if (!formData.password) {
            errors.password = 'Password is required';
        }

        return errors;
    };

    const resetForm = () => {
        setData({
            email: '',
            password: '',
        });
        setErrors({});
    };

    return (
        <div>
            <Header />
            <div id="login-container" className="mt-5">
                <div className="form-container">
                    <h2 className="text-center mb-4">Login</h2>
                    <form onSubmit={loginUser} noValidate>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Email</label>
                            <input
                                type='email'
                                className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                id="email"
                                placeholder='Enter email...'
                                value={data.email}
                                onChange={(e) => setData({ ...data, email: e.target.value })}
                            />
                            {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                        </div>
                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">Password</label>
                            <input
                                type='password'
                                className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                                id="password"
                                placeholder='Enter password...'
                                value={data.password}
                                onChange={(e) => setData({ ...data, password: e.target.value })}
                            />
                            {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                        </div>
                        <div className="d-grid gap-2 d-md-flex justify-content-md-center">
                            <button type='submit' className="btn btn-primary me-md-2">Login</button>
                            <button type='button' className="btn btn-secondary ms-md-2" onClick={resetForm}>Reset</button>
                        </div>
                    </form>
                </div>
            </div>
            <Footer className="login-footer" />
        </div>
    );
}
