// src/components/AuthForm.tsx
import React, { useState } from 'react';
import { auth, db } from '../firebaseConfig';
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { doc, setDoc, getDoc, Timestamp } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [receivesNewsletter, setReceivesNewsletter] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [message, setMessage] = useState('');

  const navigate = useNavigate();

  const handleEmailAuth = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage('');
    try {
      if (!isLogin) { // Cadastro
        if (!acceptTerms) {
          setMessage('Você deve aceitar os Termos de Uso e a Política de Privacidade.');
          return;
        }
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        await sendEmailVerification(user);

        await setDoc(doc(db, 'users', user.uid), {
          fullName: fullName,
          username: username,
          email: user.email,
          createdAt: Timestamp.now(),
          lastLoginAt: Timestamp.now(),
          receivesNewsletter: receivesNewsletter,
          preferredLanguage: navigator.language || 'pt-BR',
          subscriptionStatus: 'none',
          isAdmin: false,
        });
        setMessage('Conta criada! Um e-mail de verificação foi enviado. Por favor, verifique sua caixa de entrada e tente fazer login.');
        setIsLogin(true);
      } else { // Login
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        await setDoc(doc(db, 'users', user.uid), { lastLoginAt: Timestamp.now() }, { merge: true });

        setMessage('Login realizado com sucesso!');
        // TODO: Redirecionar para a tela de planos se não for assinante, ou para home se for.
        navigate('/home');
      }
    } catch (error: any) {
      console.error("Erro na autenticação:", error.code, error.message);
      setMessage(`Erro na autenticação: ${error.message}`);
    }
  };

  const handleGoogleSignIn = async () => {
    setMessage('');
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;

      const userDocRef = doc(db, 'users', user.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (!userDocSnap.exists()) {
        await setDoc(userDocRef, {
          fullName: user.displayName || '',
          email: user.email,
          createdAt: Timestamp.now(),
          lastLoginAt: Timestamp.now(),
          preferredLanguage: navigator.language || 'pt-BR',
          receivesNewsletter: false,
          subscriptionStatus: 'none',
          isAdmin: false,
        });
      } else {
        await setDoc(userDocRef, { lastLoginAt: Timestamp.now() }, { merge: true });
      }

      setMessage('Login com Google realizado com sucesso!');
       // TODO: Redirecionar para a tela de planos se não for assinante, ou para home se for.
      navigate('/home');
    } catch (error: any) {
      console.error("Erro ao fazer login com Google:", error.code, error.message);
      setMessage(`Erro ao fazer login com Google: ${error.message}`);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>{isLogin ? 'Entrar no RegenFlix' : 'Crie Sua Conta RegenFlix'}</h2>
        <form onSubmit={handleEmailAuth} style={styles.form}>
          <input type="email" placeholder="Seu e-mail" value={email} onChange={(e) => setEmail(e.target.value)} required style={styles.input} />
          <input type="password" placeholder="Sua senha" value={password} onChange={(e) => setPassword(e.target.value)} required style={styles.input} />
          {!isLogin && (
            <>
              <input type="text" placeholder="Nome Completo" value={fullName} onChange={(e) => setFullName(e.target.value)} required style={styles.input} />
              <input type="text" placeholder="Nome de Usuário (opcional)" value={username} onChange={(e) => setUsername(e.target.value)} style={styles.input} />
              <label style={styles.checkboxLabel}>
                <input type="checkbox" checked={receivesNewsletter} onChange={(e) => setReceivesNewsletter(e.target.checked)} style={styles.checkbox} />
                Desejo receber novidades e atualizações.
              </label>
              <label style={styles.checkboxLabel}>
                <input type="checkbox" checked={acceptTerms} onChange={(e) => setAcceptTerms(e.target.checked)} required style={styles.checkbox} />
                Li e aceito os <a href="/termos-de-uso" target="_blank" style={styles.link}>Termos de Uso</a> e a <a href="/politica-de-privacidade" target="_blank" style={styles.link}>Política de Privacidade</a>.
              </label>
            </>
          )}
          <button type="submit" style={styles.buttonPrimary}>{isLogin ? 'Entrar' : 'Cadastrar'}</button>
        </form>
        <p style={styles.separator}>ou</p>
        <button onClick={handleGoogleSignIn} style={styles.buttonSecondary}>
          {isLogin ? 'Entrar com Google' : 'Cadastrar com Google'}
        </button>
        <p style={styles.switchMode}>
          {isLogin ? "Não tem uma conta?" : "Já tem uma conta?"}{' '}
          <span onClick={() => setIsLogin(!isLogin)} style={styles.switchModeLink}>
            {isLogin ? 'Cadastre-se' : 'Entrar'}
          </span>
        </p>
        {message && <p style={styles.message}>{message}</p>}
      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#F5F5DC', // Beige Creme Suave (Modo Light)
    padding: '20px',
  },
  card: {
    backgroundColor: '#FFFFFF', // Branco Puro
    borderRadius: '12px',
    padding: '40px',
    boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
    maxWidth: '400px',
    width: '100%',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  input: {
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid #D6E3DD', // Verde Água Translúcido
    fontSize: '16px',
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '14px',
    color: '#2C3E50', // Azul Marinho Escuro
    cursor: 'pointer',
  },
  checkbox: {
    marginRight: '8px',
  },
  link: {
    color: '#5BC0EB', // Azul Celeste Claro
    textDecoration: 'none',
  },
  buttonPrimary: {
    padding: '12px 20px',
    borderRadius: '8px',
    backgroundColor: '#4A7C59', // Verde Floresta Suave
    color: '#FFFFFF',
    fontSize: '16px',
    border: 'none',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  buttonPrimaryHover: {
    backgroundColor: '#3A6B4B', // Tom mais escuro para hover
  },
  buttonSecondary: {
    padding: '12px 20px',
    borderRadius: '8px',
    backgroundColor: '#ECF0F1', // Cinza Claro Quase Branco
    color: '#2C3E50', // Azul Marinho Escuro
    fontSize: '16px',
    border: '1px solid #D6E3DD', // Verde Água Translúcido
    cursor: 'pointer',
    transition: 'background-color 0.3s ease, border-color 0.3s ease',
  },
  buttonSecondaryHover: {
    backgroundColor: '#D6E3DD', // Tom mais escuro para hover
  },
  separator: {
    margin: '20px 0',
    color: '#7F8C8D', // Cinza Médio
  },
  switchMode: {
    marginTop: '20px',
    fontSize: '14px',
    color: '#2C3E50', // Azul Marinho Escuro
  },
  switchModeLink: {
    color: '#5BC0EB', // Azul Celeste Claro
    textDecoration: 'none',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  message: {
    marginTop: '15px',
    fontSize: '14px',
    color: '#FF6B6B', // Coral Suave para mensagens de erro
  },
};

export default AuthForm;