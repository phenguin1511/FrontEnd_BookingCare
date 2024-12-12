import React from 'react';
import './Unauthorized.scss';

const Unauthorized = () => {
    return (
        <div className="unauthorized-container">
            <h1 className="unauthorized-title">Access Denied</h1>
            <p className="unauthorized-message">You do not have permission to access this page. Please contact the administrator if you believe this is an error.</p>
        </div>
    );
};

export default Unauthorized;
