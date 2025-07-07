import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { auth, db } from './firebaseConfig';
import type { User } from 'firebase/auth';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useTranslation } from 'react-i18next';

import AuthForm from './components/AuthForm';
import HomePage from './components/HomePage';
import SubscriptionPlansPage from './components/SubscriptionPlansPage';
import LanguageSelector from './components/LanguageSelector';

// Importar os novos componentes placeholder
import MyLibraryPage from './components/MyLibraryPage';
import CoursesPage from './components/CoursesPage';
import RegenPediaPage from './components/RegenPediaPage';
import RegenMarketPage from './components/RegenMarketPage';


function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const { i18n } = useTranslation();

  // useEffect para lidar com o estado de autenticação do Firebase
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoadingAuth(false);
    });
    return () => unsubscribe();
  }, []); // Este useEffect só roda na montagem e desmontagem

  // useEffect para carregar e definir o idioma do usuário
  useEffect(() => {
    const loadUserLanguage = async () => {
      if (user) {
        // Usuário está logado, tentar carregar a preferência do Firestore
        console.log("Usuário logado, tentando carregar idioma do Firestore...");
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const userDocSnap = await getDoc(userDocRef);

          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            const userPreferredLanguage = userData.preferredLanguage as string | undefined;

            if (userPreferredLanguage && userPreferredLanguage !== i18n.language) {
              console.log("Carregando idioma preferido do Firestore:", userPreferredLanguage);
              i18n.changeLanguage(userPreferredLanguage);
              sessionStorage.setItem('userPreferredLanguage', userPreferredLanguage);
            } else if (!userPreferredLanguage) {
                 const sessionLang = sessionStorage.getItem('userPreferredLanguage') as string;
                 if (sessionLang && sessionLang !== i18n.language) {
                    console.log("Idioma não encontrado no Firestore, carregando do SessionStorage:", sessionLang);
                    i18n.changeLanguage(sessionLang);
                 } else if (!sessionLang && i18n.language !== 'pt_BR') {
                      console.log("Idioma não encontrado em nenhum lugar, definindo para padrão (pt_BR)");
                      i18n.changeLanguage('pt_BR');
                 }
            }
          } else {
             console.log("Documento do usuário não encontrado no Firestore, usando idioma padrão ou sessionStorage.");
             const sessionLang = sessionStorage.getItem('userPreferredLanguage') as string;
              if (sessionLang && sessionLang !== i18n.language) {
                 console.log("Carregando idioma do SessionStorage:", sessionLang);
                 i18n.changeLanguage(sessionLang);
              } else if (!sessionLang && i18n.language !== 'pt_BR') {
                   console.log("Idioma não encontrado em nenhum lugar, definindo para padrão (pt_BR)");
                   i18n.changeLanguage('pt_BR');
              }
          }
        } catch (error) {
          console.error("Erro ao carregar idioma do usuário do Firestore:", error);
        }
      } else {
         console.log("Usuário deslogado, tentando carregar idioma do SessionStorage ou padrão.");
          const sessionLang = sessionStorage.getItem('userPreferredLanguage') as string;
           if (sessionLang && sessionLang !== i18n.language) {
              console.log("Carregando idioma do SessionStorage:", sessionLang);
              i18n.changeLanguage(sessionLang);
           } else if (!sessionLang && i18n.language !== 'pt_BR') {
                console.log("Idioma não encontrado em SessionStorage, definindo para padrão (pt_BR)");
                i18n.changeLanguage('pt_BR');
           }
      }
    };

    loadUserLanguage();

  }, [user, db, i18n]);


  if (loadingAuth) {
    return <div>Carregando...</div>;
  }

  return (
    <Router>
      {/* O LanguageSelector pode ficar aqui para ser visível em todas as rotas */}
      <LanguageSelector />
      <Routes>
        <Route path="/login" element={<AuthForm />} />
        <Route path="/cadastro" element={<AuthForm />} />
        {/* Rota para a landing page (pode ser o AuthForm ou uma página estática) */}
        <Route path="/" element={user ? <Navigate to="/home" replace /> : <AuthForm />} />

        {/* Rotas Protegidas (exigem login) */}
        <Route
          path="/home"
          element={user ? <HomePage /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/planos"
          element={user ? <SubscriptionPlansPage /> : <Navigate to="/login" replace />}
        />
        {/* Novas Rotas para as páginas de recurso */}
        <Route
          path="/my-library"
          element={user ? <MyLibraryPage /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/courses"
          element={user ? <CoursesPage /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/regenpedia"
          element={user ? <RegenPediaPage /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/regenmarket"
          element={user ? <RegenMarketPage /> : <Navigate to="/login" replace />}
        />
        {/* Adicionar mais rotas protegidas aqui conforme criarmos as páginas */}
      </Routes>
    </Router>
  );
}
export default App;
