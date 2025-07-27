import { db } from '../firebaseConfig';
import { collection, addDoc, getDocs, query, orderBy, doc, getDoc, Timestamp } from 'firebase/firestore';
import type { Course } from '../types'; // Removida a importação de LocalizedString


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
    const coursesQuery = query(
        collection(db, 'courses'),
        orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(coursesQuery);

    const coursesData: Course[] = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
            id: doc.id,
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
            modules: data.modules || [],
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

/**
 * Busca um único curso do Firestore pelo seu ID.
 * @param courseId - O ID do curso a ser buscado.
 * @returns Um objeto Course ou undefined se não for encontrado.
 * @throws Erro se a busca falhar.
 */
export const getCourse = async (courseId: string): Promise<Course | undefined> => {
  try {
    const courseDocRef = doc(db, 'courses', courseId);
    const courseDocSnap = await getDoc(courseDocRef);

    if (courseDocSnap.exists()) {
      const data = courseDocSnap.data();
      console.log("Dados do curso buscado:", data);
      return {
          id: courseDocSnap.id,
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
          modules: data.modules || [],
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
      } as Course;
    } else {
      console.log("Curso não encontrado com ID:", courseId);
      return undefined;
    }

  } catch (error) {
    console.error(`Erro ao buscar curso com ID ${courseId}:`, error);
    throw new Error(`Falha ao carregar os detalhes do curso ${courseId}.`);
  }
};
