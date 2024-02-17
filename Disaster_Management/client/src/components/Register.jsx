
// Register.jsx

import React, { useState } from "react";
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useNavigate } from "react-router-dom";
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/Register.scss';

import 'bootstrap/dist/css/bootstrap.min.css';

export default function Register() {
    const navigate = useNavigate();
    const [data, setData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        address: '',
        city: '',
        postalCode: '',
        country: '',
    });

    const [errors, setErrors] = useState({});

    const registerUser = async (e) => {
        e.preventDefault();

        // Validation logic
        const validationErrors = validateForm(data);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            const { data: responseData } = await axios.post('http://localhost:5500/register', data);

            if (responseData.error) {
                toast.error(responseData.error);
            } else {
                setData({});
                setErrors({});
                toast.success('Registration Successful. Welcome!');
                navigate('/login');
            }
        } catch (error) {
            console.log(error);
        }
    }

    // Validation function
    const validateForm = (formData) => {
        const errors = {};

        // Validate name
        if (!formData.name) {
            errors.name = 'Name is required';
        }

        // Validate email
        if (!formData.email) {
            errors.email = 'Email is required';
        } else if (!isValidEmail(formData.email)) {
            errors.email = 'Invalid email format';
        }

        // Validate password
        if (!formData.password) {
            errors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            errors.password = 'Password should be at least 6 characters long';
        }

        // Validate confirmPassword
        if (!formData.confirmPassword) {
            errors.confirmPassword = 'Confirm Password is required';
        } else if (formData.password !== formData.confirmPassword) {
            errors.confirmPassword = 'Passwords do not match';
        }
        //Validate address
        if (!data.address.trim()) {
            errors.address = 'Address is required';
           
        }

        // Validate city
        if (!data.city.trim()) {
            errors.city = 'City is required';
            
        }

        // Validate postal code
        if (!data.postalCode.trim()) {
            errors.postalCode = 'Postal Code is required';
           
        }

        // Validate country
        if (!data.country.trim()) {
            errors.country = 'Country is required';
            
        }

        return errors;
    }

    // Helper function to validate email format
    const isValidEmail = (email) => {
        // Simple email validation regex, you might want to use a more robust solution
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
     // Clear form function
     const clearForm = () => {
        setData({
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
            address: '',
            city: '',
            postalCode: '',
            country: '',
        });
        setErrors({});
    }

    return (
        <div>
            <Header />
            <div id="custom-container" className="mt-5">
                <h2 className="text-center mb-4">Registration Form</h2>
                <form onSubmit={registerUser}>
                    <div className="mb-3">
                        <label htmlFor="name" className="form-label">Name</label>
                        <input
                            type='text'
                            className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                            id="name"
                            placeholder='Enter name...'
                            value={data.name}
                            onChange={(e) => setData({ ...data, name: e.target.value })}
                        />
                        {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                    </div>
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
                    <div className="mb-3">
                        <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                        <input
                            type='password'
                            className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                            id="confirmPassword"
                            placeholder='Confirm password...'
                            value={data.confirmPassword}
                            onChange={(e) => setData({ ...data, confirmPassword: e.target.value })}
                        />
                        {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword}</div>}
                    </div>
                    <div className="mb-3">
                        <label htmlFor="address" className="form-label">Address</label>
                        <input
                            type='text'
                            className={`form-control ${errors.address ? 'is-invalid' : ''}`}
                            id="address"
                            placeholder='Enter address...'
                            value={data.address}
                            onChange={(e) => setData({ ...data, address: e.target.value })}
                        />
                        {errors.address && <div className="invalid-feedback">{errors.address}</div>}
                    </div>
                    <div className="mb-3">
                        <label htmlFor="city" className="form-label">City</label>
                        <input
                            type='text'
                            className={`form-control ${errors.city ? 'is-invalid' : ''}`}
                            id="city"
                            placeholder='Enter city...'
                            value={data.city}
                            onChange={(e) => setData({ ...data, city: e.target.value })}
                        />
                        {errors.city && <div className="invalid-feedback">{errors.city}</div>}
                    </div>
                    <div className="mb-3">
                        <label htmlFor="postalCode" className="form-label">Postal Code</label>
                        <input
                            type='text'
                            className={`form-control ${errors.postalCode ? 'is-invalid' : ''}`}
                            id="postalCode"
                            placeholder='Enter postal code...'
                            value={data.postalCode}
                            onChange={(e) => setData({ ...data, postalCode: e.target.value })}
                        />
                        {errors.postalCode && <div className="invalid-feedback">{errors.postalCode}</div>}
                    </div>
                    <div className="mb-3">
                        <label htmlFor="country" className="form-label">Country</label>
                        <input
                            type='text'
                            className={`form-control ${errors.country ? 'is-invalid' : ''}`}
                            id="country"
                            placeholder='Enter country...'
                            value={data.country}
                            onChange={(e) => setData({ ...data, country: e.target.value })}
                        />
                        {errors.country && <div className="invalid-feedback">{errors.country}</div>}
                    </div>
                    <div className="d-grid gap-2 d-md-flex justify-content-md-center">
                            <button type='submit' className="btn btn-primary me-md-2">Register</button>
                            <button type='button' className="btn btn-secondary ms-md-2" onClick={clearForm}>Clear Form</button>
                        </div>
                </form>
            </div>
            <Footer />
        </div>
    );
}
