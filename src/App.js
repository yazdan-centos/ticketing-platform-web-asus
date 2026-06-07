import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth, AuthProvider } from './context/AuthProvider';
import Layout from './layout/Layout';
import Login from './pages/Login';
import CustomerList from './pages/CustomerList';
import CreateCustomer from './pages/CreateCustomer';
import UpdateCustomer from './pages/UpdateCustomer';


// Mock Page Components for demonstration
const Dashboard = () => <h2>Dashboard Content</h2>;
const Analytics = () => <h2>Analytics Content</h2>;
const Settings = () => <h2>Settings Content</h2>;
const Help = () => <h2>Help Content</h2>;

// Route Guard Component to protect pages from unauthenticated users
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect them to the /login page, but save the current location they were trying to go to
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Route: Login does not use Layout */}
          <Route path="/login" element={<Login />} />
          <Route path="/analytics" element={<CustomerList />} />

          {/* Protected Routes: Layout and children are wrapped by ProtectedRoute */}
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            {/* index renders at the base path "/" */}
            <Route index element={<Dashboard />} />
            <Route path="customers" element={<CustomerList />} />
            <Route path="customers/create" element={<CreateCustomer />} />
            <Route path="customers/:id/edit" element={<UpdateCustomer />} />
            
            <Route path="settings" element={<Settings />} />
            <Route path="help" element={<Help />} />
          </Route>

          {/* Optional Catch-all Route: Redirect unknown routes to root */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
