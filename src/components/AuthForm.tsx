import { useState } from 'react';
import { auth, db } from '../firebaseConfig';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  sendEmailVerification,
  signInWithRedirect // Keeping signInWithRedirect for temporary test
} from 'firebase/auth';
// Removed unused: import type { User } from 'firebase/auth';
import { doc, setDoc, Timestamp } from 'firebase/firestore';
// Removed unused: import { getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
// Removed unused: import i18n from '../i18n';


function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [receivesNewsletter, setReceivesNewsletter] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate(); // useNavigate is used below
  const { t } = useTranslation(); // useTranslation is used for 't'


  const handleEmailAuth = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage('');
    setIsLoading(true);

    try {
      if (!isLogin) {
         if (!acceptTerms) {
              setMessage(t('Você deve aceitar os Termos de Uso e a Política de Privacidade.')); // Using t
              setIsLoading(false);
              return;
         }

        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        await sendEmailVerification(user);

        const userDocRef = doc(db, 'users', user.uid);
        await setDoc(userDocRef, {
          fullName: fullName,
          username: username,
          email: user.email,
          createdAt: Timestamp.now(),
          lastLoginAt: Timestamp.now(),
          preferredLanguage: navigator.language || 'pt-BR',
          receivesNewsletter: receivesNewsletter,
          subscriptionStatus: 'none',
          isAdmin: false,
        });

        setMessage(t('Conta criada! Um e-mail de verificação foi enviado. Por favor, verifique sua caixa de entrada e tente fazer login.')); // Using t
        setIsLogin(true);

      } else {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

         const userDocRef = doc(db, 'users', user.uid);
         await setDoc(userDocRef, { lastLoginAt: Timestamp.now() }, { merge: true });

        setMessage(t('Login realizado com sucesso!')); // Using t
        navigate('/home');
      }
    } catch (error: any) {
      console.error("Erro na autenticação:", error.code, error.message);
      setMessage(`${t('Erro na autenticação')}: ${error.message}`); // Using t
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setMessage('');
    setIsLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithRedirect(auth, provider.setCustomParameters({ prompt: 'select_account' }));

    } catch (error: any) {
      console.error("Erro ao fazer login com Google:", error.code, error.message);
      setMessage(`${t('Erro ao fazer login com Google')}: ${error.message}`); // Using t
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>{isLogin ? t('Entrar no RegenFlix') : t('Crie Sua Conta RegenFlix')}</h2> {/* Using t */}
        <form onSubmit={handleEmailAuth} style={styles.form}>
          <input type="email" placeholder={t('Seu e-mail')} value={email} onChange={(e) => setEmail(e.target.value)} required style={styles.input} /> {/* Using t */}
          <input type="password" placeholder={t('Sua senha')} value={password} onChange={(e) => setPassword(e.target.value)} required style={styles.input} /> {/* Using t */}

          {!isLogin && (
            <>
              <input type="text" placeholder={t('Nome Completo')} value={fullName} onChange={(e) => setFullName(e.target.value)} required style={styles.input} /> {/* Using t */}
              <input type="text" placeholder={t('Nome de Usuário (opcional)')} value={username} onChange={(e) => setUsername(e.target.value)} style={styles.input} /> {/* Using t */}

              <label style={styles.checkboxLabel}>
                <input type="checkbox" checked={receivesNewsletter} onChange={(e) => setReceivesNewsletter(e.target.checked)} style={styles.checkbox} />
                {t('Desejo receber novidades e atualizações.')} {/* Using t */}
              </label>

              <label style={styles.checkboxLabel}>
                <input type="checkbox" checked={acceptTerms} onChange={(e) => setAcceptTerms(e.target.checked)} required style={styles.checkbox} />
                {t('Li e aceito os')}{' '} <a href="/termos-de-uso" target="_blank" style={styles.link}>{t('Termos de Uso')}</a> {' '} {t('e a')} {' '} <a href="/politica-de-privacidade" target="_blank" style={styles.link}>{t('Política de Privacidade')}</a>. {/* Using t */}
              </label>
            </>
          )}

          <button type="submit" disabled={isLoading} style={styles.buttonPrimary}>
            {isLoading ? (isLogin ? t('Entrando...') : t('Cadastrando...')) : (isLogin ? t('Entrar') : t('Cadastrar'))} {/* Using t and loading */}
          </button>
        </form>

        <p style={styles.separator}>{t('ou')}</p> {/* Using t */}

        <button onClick={handleGoogleSignIn} disabled={isLoading} style={styles.buttonSecondary}>
          {isLoading ? t('Entrando com Google...') : (isLogin ? t('Entrar com Google') : t('Cadastrar com Google'))} {/* Using t and loading */}
        </button>

        <p style={styles.switchMode}>
          {isLogin ? t('Não tem uma conta?') : t('Já tem uma conta?')}{' '}
          <span onClick={() => setIsLogin(!isLogin)} style={styles.switchModeLink}>
            {isLogin ? t('Cadastre-se') : t('Entrar')} {/* Using t */}
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
    backgroundColor: '#F5F5DC',
    padding: '20px',
  },
  card: {
    backgroundColor: '#FFFFFF',
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
    border: '1px solid #D6E3DD',
    fontSize: '16px',
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '14px',
    color: '#2C3E50',
    cursor: 'pointer',
    textAlign: 'left', // Added for better alignment
  },
  checkbox: {
    marginRight: '8px',
  },
  link: {
    color: '#5BC0EB',
    textDecoration: 'none',
    fontWeight: 'bold', // Added for better visibility
  },
  buttonPrimary: {
    padding: '12px 20px',
    borderRadius: '8px',
    backgroundColor: '#4A7C59',
    color: '#FFFFFF',
    fontSize: '16px',
    border: 'none',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
    marginTop: '10px', // Added some space
  },
  buttonSecondary: {
    padding: '12px 20px',
    borderRadius: '8px',
    backgroundColor: '#ECF0F1',
    color: '#2C3E50',
    fontSize: '16px',
    border: '1px solid #D6E3DD',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease, border-color 0.3s ease',
  },
  separator: {
    margin: '20px 0',
    color: '#7F8C8D',
    fontSize: '14px',
  },
  switchMode: {
    marginTop: '20px',
    fontSize: '14px',
    color: '#2C3E50',
  },
  switchModeLink: {
    color: '#5BC0EB',
    textDecoration: 'none',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  message: {
    marginTop: '15px',
    fontSize: '14px',
    // Color is handled inline for success/error
  },
};

export default AuthForm;
