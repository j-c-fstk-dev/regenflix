// src/types.ts

import { Timestamp } from 'firebase/firestore';

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
  // purchasedContent?: string[]; // Adicionaremos isso na Fase 5
}

// Interfaces para conteúdo

export interface LocalizedString {
  pt_BR?: string;
  en_US?: string;
  es?: string;
  // Adicionar outros idiomas conforme necessário
}

// Interfaces para a Fase 2: Conteúdo
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
