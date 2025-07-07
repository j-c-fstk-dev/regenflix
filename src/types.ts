// src/types.ts
import { Timestamp } from 'firebase/firestore';

// --- Tipos Base para Internacionalização ---
export interface LocalizedString {
  pt_BR?: string;
  en_US?: string;
  es?: string;
  // Adicionar outros idiomas conforme necessário
}

// --- Tipos Comuns de Conteúdo ---
export type ContentType = 'text' | 'video' | 'pdf' | 'image';

// --- Interfaces para Blocos de Conteúdo de uma Aula ---
// Bloco de Texto Rico
export interface TextBlock {
  type: 'text';
  content: LocalizedString; // Conteúdo HTML ou Markdown para o texto rico
  order: number; // Ordem do bloco dentro da aula
}

// Bloco de Vídeo (referencia um vídeo já existente na coleção 'videos')
export interface VideoBlock {
  type: 'video';
  videoId: string; // ID do documento na coleção 'videos'
  order: number; // Ordem do bloco dentro da aula
}

// Bloco de PDF (referencia um PDF já existente na coleção 'pdfs')
export interface PdfBlock {
  type: 'pdf';
  pdfId: string; // ID do documento na coleção 'pdfs'
  order: number; // Ordem do bloco dentro da aula
}

// Bloco de Imagem (pode ser para diagramas, ilustrações, etc.)
export interface ImageBlock {
  type: 'image';
  imageUrl: string; // URL da imagem no Firebase Storage
  altText: LocalizedString; // Texto alternativo para acessibilidade
  order: number; // Ordem do bloco dentro da aula
}

// Union Type para todos os blocos de conteúdo de curso
export type CourseContentBlock = TextBlock | VideoBlock | PdfBlock | ImageBlock;

// --- Interfaces para Aulas ---
export interface Lesson {
  id?: string; // Opcional, será o ID do documento Firestore
  title: LocalizedString; // Título da aula (ex: "Introdução à Permacultura")
  description?: LocalizedString; // Breve descrição da aula (opcional)
  durationMinutes: number; // Duração estimada da aula em minutos
  order: number; // Ordem da aula dentro do módulo
  contentBlocks: CourseContentBlock[]; // Array de blocos de conteúdo da aula
  isPublished: boolean; // Indica se a aula está visível para os alunos
  createdAt: Timestamp; // Usar Timestamp
  updatedAt: Timestamp; // Usar Timestamp
}

// --- Interfaces para Módulos ---
export interface Module {
  id?: string; // Opcional, será o ID do documento Firestore
  title: LocalizedString; // Título do módulo (ex: "Fundamentos da Agricultura Regenerativa")
  description?: LocalizedString; // Breve descrição do módulo (opcional)
  order: number; // Ordem do módulo dentro do curso
  lessons: Lesson[]; // Array de aulas dentro do módulo (aninhado para simplicidade inicial)
  isPublished: boolean; // Indica se o módulo está visível
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// --- Interfaces para Cursos ---
export interface Course {
  id?: string; // Opcional, será o ID do documento Firestore
  title: LocalizedString; // Título principal do curso
  shortDescription: LocalizedString; // Descrição curta para listagens
  longDescription: LocalizedString; // Descrição detalhada na página do curso
  instructor: LocalizedString; // Nome do instrutor
  coverImageUrl: string; // URL da imagem de capa do curso
  trailerVideoId?: string; // Opcional: ID de vídeo do YouTube para trailer
  categories: string[]; // Ex: ["agroecologia", "sustentabilidade", "bem-estar"]
  targetAudience?: LocalizedString; // Público-alvo (opcional)
  prerequisites?: LocalizedString; // Pré-requisitos (opcional)
  price?: number; // Preço do curso (se for vendido avulso ou para referência - opcional)
  isPublished: boolean; // Se o curso está disponível publicamente
  isFeatured: boolean; // Se deve aparecer em destaques
  modules: Module[]; // Array de módulos do curso (aninhado para simplicidade inicial)
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// --- Interfaces para Conteúdos Individuais (já existentes, para referência) ---
export interface Video {
  id: string; // ID do documento no Firestore
  youtubeId: string;
  type: "video";
  duration: number; // em segundos
  coverImageUrl: string; // URL para Firebase Storage
  tags: string[];
  isVisible: boolean;
  isAvailableForPurchase: boolean;
  createdAt: Timestamp;
  publishedAt: Timestamp | null;
  title: LocalizedString;
  description: LocalizedString;
}

export interface Pdf {
  id: string; // ID do documento no Firestore
  pdfUrl: string; // URL para Firebase Storage
  type: "pdf";
  coverImageUrl: string; // URL para Firebase Storage
  tags: string[];
  isVisible: boolean;
  isAvailableForPurchase: boolean;
  createdAt: Timestamp;
  publishedAt: Timestamp | null;
  title: LocalizedString;
  author: LocalizedString; // Autor também multilíngue
  description: LocalizedString;
}

// --- Interfaces para Usuários (já existente) ---
export interface UserProfile {
  fullName: string;
  username?: string; // Opcional
  email: string;
  createdAt: Timestamp;
  lastLoginAt: Timestamp;
  receivesNewsletter: boolean;
  preferredLanguage: string;
  subscriptionStatus: 'none' | 'active' | 'cancelled' | 'past_due'; // Exemplos de status
  isAdmin: boolean;
  purchasedContent?: string[]; // Adicionaremos isso na Fase 5
}
