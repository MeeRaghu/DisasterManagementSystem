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
        confirmpassword: '',
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
                if (responseData.error === 'Email is taken already') {
                    setErrors({ email: responseData.error });
                } else {
                    toast.error(responseData.error);
                }
            } else {
                setData({});
                setErrors({});
                toast.success('Registration Successful. Welcome!');
                navigate('/login');
            }
        } catch (error) {
            console.error(error);
        }
    }
    

    
    // Validation function
const validateForm = (formData) => {
    const errors = {};

    // Validate name
    if (!formData.name.trim()) {
        errors.name = 'Name is required';
    } else if (/\d/.test(formData.name)) {
        errors.name = 'Name should not contain digits';
    } else if (formData.name.length > 20) {
        errors.name = 'Name should not exceed 20 characters';
    }

    // Validate email
    if (!formData.email.trim()) {
        errors.email = 'Email is required';
    } else if (!isValidEmail(formData.email)) {
        errors.email = 'Invalid email format';
    }

    // Validate password
    if (!formData.password.trim()) {
        errors.password = 'Password is required';
    } else if (formData.password.length > 20) {
        errors.password = 'Password should not exceed 20 characters';
    } else if (formData.password.length < 6) {
        errors.password = 'Password should be at least 6 characters long';
    }

    // Validate confirmPassword
    if (!formData.confirmpassword.trim()) {
        errors.confirmpassword = 'Confirm Password is required';
    } else if (formData.password !== formData.confirmpassword) {
        errors.confirmpassword = 'Passwords do not match';
    }

    // Validate address
    if (!formData.address.trim()) {
        errors.address = 'Address is required';
    } else if (formData.address.length > 20) {
        errors.address = 'Address should not exceed 20 characters';
    }

    // Validate city
    if (!formData.city.trim()) {
        errors.city = 'City is required';
    } else if (/\d/.test(formData.city)) {
        errors.city = 'City should not contain digits';
    } else if (formData.city.length > 20) {
        errors.city = 'City should not exceed 20 characters';
    }

    // Validate postal code
    if (!formData.postalCode.trim()) {
        errors.postalCode = 'Postal Code is required';
    } else if (!isValidPostalCode(formData.postalCode)) {
        errors.postalCode = 'Invalid postal code format';
    }

    // Validate country
    if (!formData.country.trim()) {
        errors.country = 'Country is required';
    } else if (/\d/.test(formData.country)) {
        errors.country = 'Country should not contain digits';
    } else if (formData.country.length > 20) {
        errors.country = 'Country should not exceed 20 characters';
    }

    return errors;
}


    // Helper function to validate email format
    const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Helper function to validate postal code format (Canadian standard)
    const isValidPostalCode = (postalCode) => {
        // Canadian postal code regex pattern: A1A 1A1 or A1A1A1
        const postalCodeRegex = /^[A-Za-z]\d[A-Za-z] ?\d[A-Za-z]\d$/;
        return postalCodeRegex.test(postalCode);
    }

    // Clear form function
    const clearForm = () => {
        setData({
            name: '',
            email: '',
            password: '',
            confirmpassword: '',
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
                    {/* Form fields and error messages for each field */}
                    {['name', 'email', 'password', 'confirmpassword', 'address', 'city', 'postalCode', 'country'].map(field => (
                        <div className="mb-3" key={field}>
                            <label htmlFor={field} className="form-label">{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                            <input
                                type={field.includes('password') ? 'password' : 'text'}
                                className={`form-control ${errors[field] ? 'is-invalid' : ''}`}
                                id={field}
                                placeholder={`Enter ${field.toLowerCase()}...`}
                                value={data[field]}
                                onChange={(e) => setData({ ...data, [field]: e.target.value })}
                            />
                            {errors[field] && <div className="invalid-feedback">{errors[field]}</div>}
                        </div>
                    ))}
                    {/* Form buttons */}
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
