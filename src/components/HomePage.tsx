import { auth } from '../firebaseConfig';
import ContentList from './ContentList';
import { Link } from 'react-router-dom'; // Importar Link para navegação

// Importar a função createCourse
import { createCourse } from '../services/courseService';

function HomePage() {
  const handleLogout = async () => {
    try {
      await auth.signOut();
      // Redirecionar para a página de login após o logout - o App.tsx cuidará disso
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  // Função assíncrona para criar um curso de teste
  async function handleCreateTestCourse() {
    try {
      // Dados de teste para um novo curso (simplificado para o teste)
      const testCourseData = {
        title: { pt_BR: "Curso de Teste 1", en_US: "Test Course 1", es: "Curso de Prueba 1" },
        shortDescription: { pt_BR: "Descrição curta", en_US: "Short description", es: "Descripción corta" },
        longDescription: { pt_BR: "Descrição longa...", en_US: "Long description...", es: "Descripción larga..." },
        instructor: { pt_BR: "Instrutor Teste", en_US: "Test Instructor", es: "Instructor de Prueba" },
        coverImageUrl: "https://via.placeholder.com/150", // URL de imagem de teste
        categories: ["teste", "desenvolvimento"],
        isPublished: false, // Começa como rascunho
        isFeatured: false,
        modules: [], // Começa sem módulos

        // Campos opcionais definidos na interface Course (adicionar se necessário para teste)
        // targetAudience: { pt_BR: "Público", en_US: "Audience", es: "Audiencia" },
        // prerequisites: { pt_BR: "Pré-reqs", en_US: "Prereqs", es: "Prerequisitos" },
        // price: 0, // Preço de teste
      };
      // Chamar a função createCourse para salvar no Firestore
      const newCourseId = await createCourse(testCourseData);
      console.log("Curso de teste criado com ID:", newCourseId);
      alert("Curso de teste criado com sucesso! ID: " + newCourseId);
    } catch (error) {
      console.error("Erro ao criar curso de teste:", error);
      alert("Erro ao criar curso de teste. Verifique o console e as regras do Firestore.");
    }
  }


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

      {/* Botão para testar a criação de curso */}
      <button onClick={handleCreateTestCourse} style={{ marginTop: '20px', marginRight: '20px' }}>Criar Curso de Teste</button>

      <button onClick={handleLogout} style={{ marginTop: '20px' }}>Sair</button>

      {/* Incluindo o ContentList */}
      <ContentList />
    </div>
  );
}
export default HomePage;
