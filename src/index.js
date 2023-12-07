import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import Login from './pages/Login';
import { BrowserRouter as Router, Route, Routes, Outlet } from 'react-router-dom';
import User from './pages/User';
import PrivateRoute from './components/PrivateRoute';
import News from './pages/News.js'
import Home from './components/Home.js';
import UserNews from './pages/UserNews';
import NewsFollowing from './pages/NewsFollowing.js';

const root = createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route exact path="/" element={<PrivateRoute Component={NewsFollowing} />} />
        <Route exact path="/login" Component={Login} />
        <Route path="/user/:username" element={<PrivateRoute Component={User} />} />
        <Route exact path="/news" element={<PrivateRoute Component={News} />} />
        <Route exact path="/usersNews" element={<PrivateRoute Component={UserNews} />} />
        <Route path="*" element={<PrivateRoute Component={NewsFollowing} />} />
      </Routes>
    </Router>
  </React.StrictMode>
);

reportWebVitals();