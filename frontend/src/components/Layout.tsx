import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <Link to="/" className="logo">
            Book Manager
          </Link>
          <nav className="nav">
            <span className="user-name">{user?.name}</span>
            <button onClick={handleLogout} className="btn btn-outline">
              Logout
            </button>
          </nav>
        </div>
      </header>
      <main className="main">{children}</main>
    </div>
  );
}
