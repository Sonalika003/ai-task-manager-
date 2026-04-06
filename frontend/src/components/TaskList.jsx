import React, { useState } from 'react';
import api from '../services/api';
import { Calendar, Layers, Clock, AlertCircle, ArrowUpCircle, CheckCircle } from 'lucide-react';

const TaskList = ({ tasks, loading, error, refreshTasks }) => {
  const [filter, setFilter] = useState('all');

  const getIsOverdue = (deadline) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); 
    const taskDate = new Date(deadline);
    return taskDate < today;
  };

  const handleComplete = async (taskId) => {
    try {
      await api.patch(`/tasks/${taskId}/status`, { status: 'completed' });
      refreshTasks();
    } catch (err) {
      console.error("Task completion failed", err);
    }
  };

  const priorityWeight = { 'high': 1, 'medium': 2, 'low': 3 };

  // Advanced Filtering & Sorting
  const processedTasks = [...tasks]
    .filter(task => {
      const taskStatus = (task.status || 'pending').toLowerCase();
      const taskPriority = (task.priority || '').toLowerCase();
      
      // If user clicks "Completed" filter, ONLY show completed tasks
      if (filter === 'completed') {
        return taskStatus === 'completed';
      }
      
      // Otherwise, ONLY show pending tasks
      if (taskStatus !== 'pending') return false;

      if (filter === 'all') return true;
      return taskPriority === filter.toLowerCase();
    })
    .sort((a, b) => {
      const aOverdue = getIsOverdue(a.deadline);
      const bOverdue = getIsOverdue(b.deadline);
      if (aOverdue !== bOverdue) return aOverdue ? 1 : -1;
      const aWeight = priorityWeight[a.priority?.toLowerCase()] || 99;
      const bWeight = priorityWeight[b.priority?.toLowerCase()] || 99;
      if (aWeight !== bWeight) return aWeight - bWeight;
      return new Date(a.deadline) - new Date(b.deadline);
    });

  const filterOptions = [
    { label: 'Pending Roadmap', value: 'all' },
    { label: 'High Priority', value: 'high' },
    { label: 'Medium Priority', value: 'medium' },
    { label: 'Low priority', value: 'low' },
    { label: 'Completed Archived', value: 'completed' }
  ];

  if (loading && tasks.length === 0) {
    return (
      <div className="task-grid">
        {[1, 2, 3].map(i => (
          <div key={i} className="card saas-task-card" style={{ opacity: 0.1, height: '180px' }}></div>
        ))}
      </div>
    );
  }

  return (
    <div style={{ marginTop: '0' }}>
      <header style={{ 
        marginBottom: '2rem', 
        padding: '4rem', 
        background: 'linear-gradient(135deg, #1e1b4b 0%, #0c0a09 100%)', 
        borderRadius: 'var(--radius-lg)', 
        border: '1px solid rgba(255,255,255,0.08)',
        boxShadow: 'var(--sh-card)',
        color: 'white',
        minHeight: '250px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h3 style={{ fontSize: '0.8rem', fontWeight: 800, color: 'rgba(255, 255, 255, 0.6)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Global Filters</h3>
          {processedTasks.length > 0 && filter !== 'completed' && (
            <div className="date-badge active" style={{ fontSize: '0.7rem', padding: '4px 10px', background: 'rgba(94, 92, 230, 0.3)', color: 'white', border: 'none' }}>
              <Clock size={12} />
              <span>Priority Milestone: {new Date(processedTasks[0].deadline).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}</span>
            </div>
          )}
        </div>
        <div className="filter-bar" style={{ background: 'rgba(255,255,255,0.05)', padding: '6px' }}>
          {filterOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setFilter(opt.value)}
              className={`pill-filter ${filter === opt.value ? 'active' : ''}`}
              data-priority={opt.value}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {opt.value !== 'all' && opt.value !== 'completed' && (
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: opt.value === 'high' ? 'var(--danger)' : opt.value === 'medium' ? 'var(--warning)' : 'var(--success)' }}></span>
                )}
                {opt.value === 'completed' && <CheckCircle size={12} style={{ color: 'var(--success)' }} />}
                {opt.label}
              </div>
            </button>
          ))}
        </div>
      </header>

      <div className="task-grid">
        {processedTasks.length > 0 ? (
          processedTasks.map((task) => {
            const p = (task.priority || '').toLowerCase();
            const s = (task.status || 'pending').toLowerCase();
            const isOverdue = getIsOverdue(task.deadline);
            return (
              <div key={task._id || task.id} className={`saas-task-card ${p}`} style={{ opacity: s === 'completed' ? 0.7 : 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className={`status-badge ${s === 'completed' ? 'status-pending' : (isOverdue ? 'status-overdue' : 'status-pending')}`}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {s === 'completed' ? <CheckCircle size={12} /> : (isOverdue ? <AlertCircle size={12} /> : <Clock size={12} />)}
                      {s === 'completed' ? 'Archived' : (isOverdue ? 'Overdue' : 'Scheduled')}
                    </div>
                  </span>
                  {s === 'pending' && (
                    <button 
                      onClick={() => handleComplete(task._id || task.id)}
                      className="status-badge"
                      style={{ 
                        background: 'transparent', 
                        border: '1px solid var(--border-subtle)', 
                        color: 'var(--text-dim)', 
                        cursor: 'pointer', 
                        transition: 'var(--transition)'
                      }}
                      onMouseEnter={(e) => { e.target.style.background = 'var(--success)'; e.target.style.color = 'white'; e.target.style.borderColor = 'var(--success)'; }}
                      onMouseLeave={(e) => { e.target.style.background = 'transparent'; e.target.style.color = 'var(--text-dim)'; e.target.style.borderColor = 'var(--border-subtle)'; }}
                      title="Mark as Completed"
                    >
                      RESOLVE
                      <CheckCircle size={14} />
                    </button>
                  )}
                </div>

                <div style={{ flexGrow: 1 }}>
                  <h3 style={{ textDecoration: s === 'completed' ? 'line-through' : 'none', opacity: s === 'completed' ? 0.5 : 1 }}>{task.title}</h3>
                  <p className="task-desc">{task.description || 'Deliverable context is being synthesized.'}</p>
                </div>
                
                <div className="task-footer">
                  <div className={`date-badge ${isOverdue && s === 'pending' ? 'overdue' : ''}`}>
                    <Calendar size={14} />
                    <span>
                      {new Date(task.deadline).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                  
                  <div className={`priority-badge ${p || 'low'}`}>
                    <Layers size={10} />
                    {p || 'OPT'}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="empty-state" style={{ gridColumn: '1 / -1', padding: '5rem', border: '2px dashed var(--border-subtle)', borderRadius: '16px', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem', opacity: 0.1 }}>🍱</div>
            <p style={{ fontWeight: 600 }}>Zero segments detected in this view.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskList;
