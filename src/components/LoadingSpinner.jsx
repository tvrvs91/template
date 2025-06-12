import React from 'react';

// Компонент индикатора загрузки
// Принимает сообщение message (по умолчанию "Loading...")
function LoadingSpinner({ message = 'Loading...' }) {
  return (
    <div className="loading">
      <div className="loading-spinner"></div> {/* Визуальный индикатор */}
      <p>{message}</p> {/* Текстовое сообщение */}
    </div>
  );
}

export default LoadingSpinner;
