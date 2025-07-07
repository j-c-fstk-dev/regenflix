import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { auth, db } from './firebaseConfig'; // Importar db
import type { User } from 'firebase/auth';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore'; // Importar doc e getDoc
import { useTranslation } from 'react-i18next'; // Importar useTranslation

import AuthForm from './components/AuthForm';
import HomePage from './components/HomePage';
import SubscriptionPlansPage from './components/SubscriptionPlansPage';
import LanguageSelector from './components/LanguageSelector';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const { i18n } = useTranslation(); // Obter a instância do i18n

  // useEffect para lidar com o estado de autenticação do Firebase
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoadingAuth(false);
    });
    return () => unsubscribe();
  }, []); // Este useEffect só roda na montagem e desmontagem

  // NOVO useEffect para carregar e definir o idioma do usuário
  useEffect(() => {
    const loadUserLanguage = async () => {
      if (user) {
        // Usuário está logado, tentar carregar a preferência do Firestore
        console.log("Usuário logado, tentando carregar idioma do Firestore..."); // Log de depuração
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const userDocSnap = await getDoc(userDocRef);

          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            const userPreferredLanguage = userData.preferredLanguage as string | undefined;

            if (userPreferredLanguage && userPreferredLanguage !== i18n.language) {
              // Se houver uma preferência salva no Firestore e for diferente do idioma atual do i18n
              console.log("Carregando idioma preferido do Firestore:", userPreferredLanguage); // Log de depuração
              i18n.changeLanguage(userPreferredLanguage);
              // Opcional: Salvar no sessionStorage também para a sessão atual
               sessionStorage.setItem('userPreferredLanguage', userPreferredLanguage);
            } else if (!userPreferredLanguage) {
                 // Se não houver preferência no Firestore, verificar sessionStorage
                 const sessionLang = sessionStorage.getItem('userPreferredLanguage') as string;
                 if (sessionLang && sessionLang !== i18n.language) {
                    console.log("Idioma não encontrado no Firestore, carregando do SessionStorage:", sessionLang); // Log de depuração
                    i18n.changeLanguage(sessionLang);
                 } else if (!sessionLang && i18n.language !== 'pt_BR') {
                      // Se não houver preferência em nenhum lugar, usar o padrão configurado no i18n.ts (pt_BR)
                      console.log("Idioma não encontrado em nenhum lugar, definindo para padrão (pt_BR)"); // Log de depuração
                      i18n.changeLanguage('pt_BR');
                 }
            }
          } else {
             // Documento do usuário não encontrado (pode acontecer no primeiro login antes do doc ser criado)
             console.log("Documento do usuário não encontrado no Firestore, usando idioma padrão ou sessionStorage.");
             const sessionLang = sessionStorage.getItem('userPreferredLanguage') as string;
              if (sessionLang && sessionLang !== i18n.language) {
                 console.log("Carregando idioma do SessionStorage:", sessionLang); // Log de depuração
                 i18n.changeLanguage(sessionLang);
              } else if (!sessionLang && i18n.language !== 'pt_BR') {
                   console.log("Idioma não encontrado em nenhum lugar, definindo para padrão (pt_BR)"); // Log de depuração
                   i18n.changeLanguage('pt_BR');
              }
          }
        } catch (error) {
          console.error("Erro ao carregar idioma do usuário do Firestore:", error);
        }
      } else {
        // Usuário deslogado, tentar carregar do sessionStorage ou usar padrão
         console.log("Usuário deslogado, tentando carregar idioma do SessionStorage ou padrão.");
          const sessionLang = sessionStorage.getItem('userPreferredLanguage') as string;
           if (sessionLang && sessionLang !== i18n.language) {
              console.log("Carregando idioma do SessionStorage:", sessionLang); // Log de depuração
              i18n.changeLanguage(sessionLang);
           } else if (!sessionLang && i18n.language !== 'pt_BR') {
                console.log("Idioma não encontrado em SessionStorage, definindo para padrão (pt_BR)"); // Log de depuração
                i18n.changeLanguage('pt_BR');
           }
      }
    };

    // Chamar a função de carregamento do idioma
    loadUserLanguage();

    // Dependências: rodar este useEffect quando 'user' mudar
    // Adicionar i18n como dependência para garantir que o useEffect roda depois que o i18n é inicializado
    // Adicionar db como dependência (embora seja estático) é boa prática
  }, [user, db, i18n]);


  if (loadingAuth) {
    return <div>Carregando...</div>; // Substitua por um componente de loading real
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
  );
}
export default App;
