import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles/index.css';
import './styles/App.css';

// 1. Находим корневой элемент
const container = document.getElementById('root');

// 2. Проверяем, что элемент существует
if (!container) {
  throw new Error('Failed to find the root element');
}

// 3. Создаем корень React
const root = createRoot(container);

// 4. Рендерим приложение
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);