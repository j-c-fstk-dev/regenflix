import { auth } from '../firebaseConfig';
import ContentList from './ContentList';
import { Link } from 'react-router-dom'; // Importar Link para navegação

function HomePage() {
  const handleLogout = async () => {
    try {
      await auth.signOut();
      // Redirecionar para a página de login após o logout - o App.tsx cuidará disso
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Bem-vindo à Home Page (Logado)</h1>
      <p>Este é o conteúdo da página inicial após o login.</p>

      {/* Links de Navegação para as Novas Páginas */}
      <nav>
        <ul style={{ listStyle: 'none', padding: 0, display: 'flex', gap: '20px' }}>
          <li><Link to="/my-library">Minha Biblioteca</Link></li>
          <li><Link to="/courses">Cursos</Link></li>
          <li><Link to="/regenpedia">RegenPedia</Link></li>
          <li><Link to="/regenmarket">RegenMarket</Link></li>
          {/* Adicionar mais links de navegação aqui conforme criarmos mais páginas */}
        </ul>
      </nav>

      <button onClick={handleLogout} style={{ marginTop: '20px' }}>Sair</button> {/* Adicionado um pouco de margem */}

      {/* Incluindo o ContentList (removido o h2 duplicado aqui, pois o ContentList já tem o seu) */}
      <ContentList />
    </div>
  );
}
export default HomePage;
