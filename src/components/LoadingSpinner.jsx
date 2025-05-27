import React from 'react';

function LoadingSpinner({ message = 'Loading...' }) {
  return (
    <div className="loading">
      <div className="loading-spinner"></div>
      <p>{message}</p>
    </div>
  );
}

export default LoadingSpinner;