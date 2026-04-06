import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import api from './services/api';
import { Sun, Moon, LayoutDashboard, BrainCircuit, Search, Bell } from 'lucide-react';
import './App.css';

// Components
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import Suggestion from './components/Suggestion';
import Login from './components/Login';
import Signup from './components/Signup';

const NotificationBadge = ({ count }) => (
  <div style={{ position: 'relative', display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
    <Bell size={18} style={{ color: 'var(--text-dim)' }} />
    {count > 0 && (
      <span style={{ position: 'absolute', top: '-4px', right: '-4px', width: '8px', height: '8px', background: 'var(--danger)', borderRadius: '50%', border: '2px solid var(--bg-app)' }}></span>
    )}
  </div>
);

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const isAuth = localStorage.getItem('isAuthenticated') === 'true';
  return isAuth ? children : <Navigate to="/login" />;
};

const Dashboard = ({ tasks, loading, error, refreshTasks, theme, toggleTheme }) => {
  const userEmail = localStorage.getItem('userEmail') || 'User';
  const userInitial = userEmail.charAt(0).toUpperCase();

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userEmail');
    window.location.reload();
  };

  const showNotification = () => {
    alert("System Insight: You have 3 pending high-priority tasks and 1 overdue item.");
  };

  return (
    <div className="app-wrapper">
      <nav className="sticky-navbar">
        <div className="nav-container">
          <div className="brand-logo">
            <div style={{ background: 'var(--primary)', color: 'white', padding: '6px', borderRadius: '8px' }}>
              <LayoutDashboard size={18} />
            </div>
            <span>Task Manager</span>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div className="nav-search" style={{ position: 'relative', display: 'none', sm: 'block' }}>
              <Search size={14} style={{ position: 'absolute', left: '10px', top: '10px', color: 'var(--text-muted)' }} />
              <input 
                type="text" 
                placeholder="Search tasks..." 
                className="premium-input" 
                style={{ paddingLeft: '32px', height: '34px', width: '220px', fontSize: '0.8rem' }} 
              />
            </div>
            
            <button className="theme-toggle" onClick={toggleTheme}>
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>
            <div onClick={showNotification}>
              <NotificationBadge count={4} />
            </div>
            
            <div className="user-profile" style={{ display: 'flex', gap: '12px', alignItems: 'center', cursor: 'pointer' }} onClick={handleLogout}>
              <div style={{ width: '32px', height: '32px', borderRadius: '6px', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.8rem' }}>
                {userInitial}
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="dashboard-container">
        <Suggestion />
        <TaskForm onTaskAdded={refreshTasks} />
        <TaskList 
          tasks={tasks} 
          loading={loading} 
          error={error} 
          refreshTasks={refreshTasks} 
        />
      </main>
      
      <footer style={{ padding: '4rem 0', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
        &copy; 2026 Task Manager | Standard Operating Environment
      </footer>
    </div>
  );
};

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const fetchTasks = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get('/tasks');
      setTasks(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      setError('System Error: Backend unreachable.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const isAuth = localStorage.getItem('isAuthenticated') === 'true';
    if (isAuth) {
      fetchTasks();
    }
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <Dashboard 
                tasks={tasks} 
                loading={loading} 
                error={error} 
                refreshTasks={fetchTasks} 
                theme={theme}
                toggleTheme={toggleTheme}
              />
            </ProtectedRoute>
          } 
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;
