import { Navigate, Outlet } from 'react-router-dom';

export default function ProtectedRoute() {
  const token = localStorage.getItem('token'); // ou useAuth() de um contexto
      return token ? <Outlet /> : <Navigate to="/login" />;
}
