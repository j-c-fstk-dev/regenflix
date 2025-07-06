import { auth } from '../firebaseConfig'; // Importar auth para logout de exemplo
import ContentList from './ContentList'; // Importar ContentList

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
    <div style={{ padding: '20px' }}> {/* Adicionado um pouco de padding para visualização */}
      <h1>Bem-vindo à Home Page (Logado)</h1>
      <p>Este é o conteúdo da página inicial após o login.</p>
      <button onClick={handleLogout}>Sair</button>
      {/* TODO: Adicionar links para outras seções (Minha Biblioteca, Cursos, etc.) */}

      {/* Incluindo o ContentList */}
      <ContentList />
    </div>
  );
}
export default HomePage;
