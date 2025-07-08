import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { Course, LocalizedString } from '../types';
import { getCourses } from '../services/courseService'; // Importar a função de buscar cursos
import { Link } from 'react-router-dom'; // Importar Link para navegar para os detalhes do curso


function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]); // Estado para armazenar os cursos
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { i18n } = useTranslation();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        console.log("Buscando cursos..."); // Log de depuração
        const coursesData = await getCourses();
        setCourses(coursesData);
        setLoading(false);
      } catch (err: any) {
        console.error("Erro ao buscar cursos:", err);
        setError("Não foi possível carregar a lista de cursos.");
        setLoading(false);
      }
    };
    fetchCourses();
  }, []); // O array vazio garante que a busca só acontece na montagem do componente

  // Função para obter o texto localizado (reutilizada do ContentList)
  const getLocalizedText = (localizedString: LocalizedString | undefined): string => {
    if (!localizedString) return '';
    const currentLang = i18n.language as keyof LocalizedString;
    return localizedString[currentLang] || localizedString.pt_BR || '';
  };


  if (loading) return <div>Carregando cursos...</div>;
  if (error) return <div>Erro: {error}</div>;
  if (courses.length === 0) return <div>Nenhum curso disponível no momento.</div>;

  return (
    <div style={{ padding: '20px' }}>
      <h1>Cursos Disponíveis</h1> {/* Título da página */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))\', gap: \'20px' }}> {/* Ajustado o minmax para cards de curso */}
        {courses.map(course => (
          // Link para a página de detalhes do curso, usando o ID do curso na URL
          <Link key={course.id} to={`/courses/${course.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div style={{
              backgroundColor: '#FFFFFF', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              padding: '15px', cursor: 'pointer' // Adicionado cursor pointer para indicar clicável
            }}>
              <img src={course.coverImageUrl} alt={getLocalizedText(course.title)} style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '4px' }} /> {/* Ajustado altura da imagem */}
              <h3>{getLocalizedText(course.title)}</h3>
              <p>{getLocalizedText(course.shortDescription)}</p> {/* Exibir descrição curta */}
              {/* Adicionar outras informações relevantes do curso (instrutor, preço, etc.) */}
              {course.instructor && <p>Instrutor: {getLocalizedText(course.instructor)}</p>}
              {course.price !== undefined && <p>Preço: {course.price.toFixed(2)}</p>} {/* Exibir preço se existir */}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
export default CoursesPage;
