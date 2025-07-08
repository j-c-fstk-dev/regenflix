import { db } from '../firebaseConfig';
import { collection, addDoc, getDocs, query, orderBy, Timestamp } from 'firebase/firestore'; // Importar getDocs, query, orderBy
import type { Course } from '../types';

/**
 * Cria um novo curso no Firestore.
 * @param courseData - Os dados do novo curso a ser criado.
 * @returns O ID do documento do curso criado.
 * @throws Erro se a criação falhar.
 */
export const createCourse = async (courseData: Omit<Course, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  try {
    const now = Timestamp.now();
    const courseDataWithTimestamps = {
      ...courseData,
      createdAt: now,
      updatedAt: now,
    };

    const docRef = await addDoc(collection(db, 'courses'), courseDataWithTimestamps);

    console.log("Novo curso criado com ID:", docRef.id);
    return docRef.id;

  } catch (error) {
    console.error("Erro ao criar curso:", error);
    throw new Error("Falha ao criar o curso.");
  }
};

/**
 * Busca uma lista de cursos do Firestore.
 * Pode incluir filtros (ex: apenas publicados, em destaque).
 * @returns Um array de objetos Course.
 * @throws Erro se a busca falhar.
 */
export const getCourses = async (): Promise<Course[]> => {
  try {
    // Consulta para buscar cursos (ordenados por data de criação)
    const coursesQuery = query(
        collection(db, 'courses'),
        // Alterado de orderBy('publishedAt', 'desc') para orderBy('createdAt', 'desc')
        orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(coursesQuery);

    const coursesData: Course[] = querySnapshot.docs.map(doc => {
        const data = doc.data();
        // Mapeamento explícito para garantir a tipagem e consistência
        return {
            id: doc.id, // O ID do documento
            title: data.title,
            shortDescription: data.shortDescription,
            longDescription: data.longDescription,
            instructor: data.instructor,
            coverImageUrl: data.coverImageUrl,
            trailerVideoId: data.trailerVideoId || undefined,
            categories: data.categories || [],
            targetAudience: data.targetAudience,
            prerequisites: data.prerequisites,
            price: data.price || undefined,
            isPublished: data.isPublished || false,
            isFeatured: data.isFeatured || false,
            modules: data.modules || [], // Assumindo que módulos são salvos como array
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
        } as Course;
    });

    console.log("Cursos buscados:", coursesData);
    return coursesData;

  } catch (error) {
    console.error("Erro ao buscar cursos:", error);
    throw new Error("Falha ao carregar os cursos.");
  }
};

// Podemos adicionar outras funções aqui futuramente: getCourseDetails, updateCourse, deleteCourse
