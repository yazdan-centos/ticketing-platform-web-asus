import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import './Layout.css'; // See structural CSS below

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="layout-container">
      {/* Top Navbar */}
      <header className="navbar">
        <button className="menu-toggle" onClick={toggleSidebar}>
          ☰
        </button>
        <div className="navbar-logo">MyApp</div>
        <div className="navbar-actions">User Profile</div>
      </header>

      <div className="layout-body">
        {/* Sidebar Navigation */}
        <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
          <nav className="sidebar-nav">
            <NavLink to="/" end className="sidebar-link" onClick={closeSidebar}>
              📊 Dashboard
            </NavLink>
            <NavLink to="/customers" className="sidebar-link" onClick={closeSidebar}>
              📈 Analytics
            </NavLink>
            <NavLink to="/settings" className="sidebar-link" onClick={closeSidebar}>
              ⚙️ Settings
            </NavLink>
            <NavLink to="/help" className="sidebar-link" onClick={closeSidebar}>
              ❓ Help Support
            </NavLink>
          </nav>
        </aside>

        {/* Mobile Sidebar Overlay */}
        {isSidebarOpen && <div className="sidebar-overlay" onClick={closeSidebar}></div>}

        {/* Dynamic Content Area */}
        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
