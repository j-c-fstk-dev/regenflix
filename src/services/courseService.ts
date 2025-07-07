// src/services/courseService.ts

import { db } from '../firebaseConfig';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import type { Course } from '../types'; // Importar a interface Course

/**
 * Cria um novo curso no Firestore.
 * @param courseData - Os dados do novo curso a ser criado.
 * @returns O ID do documento do curso criado.
 * @throws Erro se a criação falhar.
 */
export const createCourse = async (courseData: Omit<Course, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  try {
    // Adicionar timestamps de criação e atualização
    const now = Timestamp.now();
    const courseDataWithTimestamps = {
      ...courseData,
      createdAt: now,
      updatedAt: now,
    };

    // Adicionar o documento à coleção 'courses'
    const docRef = await addDoc(collection(db, 'courses'), courseDataWithTimestamps);

    console.log("Novo curso criado com ID:", docRef.id);
    return docRef.id; // Retornar o ID do novo documento

  } catch (error) {
    console.error("Erro ao criar curso:", error);
    throw new Error("Falha ao criar o curso."); // Lançar um erro para ser tratado na UI
  }
};

// Podemos adicionar outras funções aqui futuramente: getCourse, updateCourse, deleteCourse