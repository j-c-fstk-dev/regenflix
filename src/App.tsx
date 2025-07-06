import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { auth } from '/home/user/regenflix/src/firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import type { User } from 'firebase/auth';
import AuthForm from '/home/user/regenflix/src/components/AuthForm';
import HomePage from '/home/user/regenflix/src/components/HomePage';
import SubscriptionPlansPage from '/home/user/regenflix/src/components/SubscriptionPlansPage';
import LanguageSelector from '/home/user/regenflix/src/components/LanguageSelector';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoadingAuth(false);
    });
    return () => unsubscribe();
  }, []);


  if (loadingAuth) {
    return <div>Carregando...</div>; // Substitua por um componente de loading real
  }

  return (
    <>
    <Router>
      <Routes>
        <Route path="/login" element={<AuthForm />} />
        <Route path="/cadastro" element={<AuthForm />} />
        {/* Rota para a landing page (pode ser o AuthForm ou uma página estática) */}
        <Route path="/" element={user ? <Navigate to="/home" replace /> : <AuthForm />} />

        {/* Rotas Protegidas */}
        <Route
          path="/home"
          element={user ? <HomePage /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/planos"
          element={user ? <SubscriptionPlansPage /> : <Navigate to="/login" replace />}
        />
        {/* Adicionar mais rotas protegidas aqui (Minha Biblioteca, Cursos, etc.) */}
      </Routes>

    </Router>
    <LanguageSelector />
    </>
  );
}
export default App;

