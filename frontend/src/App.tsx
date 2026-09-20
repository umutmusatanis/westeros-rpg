import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import Layout from './components/Layout/Layout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CharacterSelectPage from './pages/CharacterSelectPage';
import CharacterCreatePage from './pages/CharacterCreatePage';
import GamePage from './pages/GamePage';
import GameInfoPage from './pages/GameInfoPage';
import ProtectedRoute from './components/Auth/ProtectedRoute';

function App() {
  const { isAuthenticated } = useAuthStore();

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Public routes */}
        <Route index element={<HomePage />} />
        <Route path="info" element={<GameInfoPage />} />
        <Route 
          path="login" 
          element={isAuthenticated ? <Navigate to="/characters" /> : <LoginPage />} 
        />
        <Route 
          path="register" 
          element={isAuthenticated ? <Navigate to="/characters" /> : <RegisterPage />} 
        />

        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="characters" element={<CharacterSelectPage />} />
          <Route path="characters/create" element={<CharacterCreatePage />} />
          <Route path="game/:characterId" element={<GamePage />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<Navigate to="/" />} />
      </Route>
    </Routes>
  );
}

export default App;
