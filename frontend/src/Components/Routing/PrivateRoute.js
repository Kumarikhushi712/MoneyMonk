import React from 'react';
import { Navigate } from 'react-router-dom';
import { useGlobalContext } from '../../context/globalContext';

const PrivateRoute = ({ children }) => {
    const { isAuthenticated, isAuthLoading } = useGlobalContext();

    if (isAuthLoading) {
        // You can return a spinner or loading indicator here
        return <div>Loading...</div>;
    }

    return isAuthenticated ? children : <Navigate to="/login" />;
};

export default PrivateRoute;