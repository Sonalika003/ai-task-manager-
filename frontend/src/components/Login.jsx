import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, LogIn } from 'lucide-react';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulation of Login Logic
    setTimeout(() => {
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userEmail', formData.email);
      setLoading(false);
      navigate('/');
      window.location.reload(); 
    }, 1500);
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Welcome Back</h2>
          <p>Login to manage your intelligent tasks</p>
        </div>
        
        <form className="auth-form" onSubmit={handleLogin}>
          <div className="form-group">
            <label>Email Access</label>
            <div className="input-icon-wrapper">
              <Mail className="input-icon" size={16} />
              <input 
                type="email" 
                className="premium-input"
                style={{ paddingLeft: '2.5rem' }}
                placeholder="name@company.com" 
                required
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
          </div>
          <div className="form-group">
            <label>Secure Password</label>
            <div className="input-icon-wrapper">
              <Lock className="input-icon" size={16} />
              <input 
                type="password" 
                className="premium-input"
                style={{ paddingLeft: '2.5rem' }}
                placeholder="••••••••" 
                required
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>
          </div>
          <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '1rem', display: 'flex', gap: '8px', justifyContent: 'center' }} disabled={loading}>
            {loading ? <div className="spinner"></div> : <><LogIn size={16} /> SIGN IN</>}
          </button>
        </form>

        <div className="auth-footer">
          Don't have an account? 
          <Link to="/signup" className="auth-link">Create Account</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
