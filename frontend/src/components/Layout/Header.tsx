import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { Crown, LogOut, User, BookOpen } from 'lucide-react';

const Header = () => {
  const { isAuthenticated, user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-targaryen-black border-b-2 border-westeros-gold shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition">
            <Crown className="w-8 h-8 text-westeros-gold" />
            <div>
              <h1 className="text-2xl font-bold text-westeros-gold text-shadow">
                WESTEROS RPG
              </h1>
              <p className="text-xs text-gray-400">Taht Oyunları</p>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-4">
            <Link
              to="/info"
              className="text-gray-300 hover:text-westeros-gold transition flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4" />
              Oyun Rehberi
            </Link>
            {isAuthenticated ? (
              <>
                <Link
                  to="/characters"
                  className="text-gray-300 hover:text-westeros-gold transition flex items-center gap-2"
                >
                  <User className="w-4 h-4" />
                  Karakterlerim
                </Link>
                <div className="text-gray-400 text-sm">
                  {user?.username}
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-gray-300 hover:text-red-400 transition"
                >
                  <LogOut className="w-4 h-4" />
                  Çıkış
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-300 hover:text-westeros-gold transition"
                >
                  Giriş Yap
                </Link>
                <Link
                  to="/register"
                  className="btn-primary"
                >
                  Kayıt Ol
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
