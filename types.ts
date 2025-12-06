export enum Language {
  ENGLISH = 'en',
  HINDI = 'hi',
  MARATHI = 'mr'
}

export enum Persona {
  CHILD = 'child',
  WOMAN = 'woman',
  MAN = 'man',
  ELDER = 'elder'
}

export interface UserProfile {
  name: string;
  language: Language;
  persona: Persona;
  age?: number;
}

export interface QuizQuestion {
  question: Record<Language, string>;
  options: Record<Language, string[]>;
  correctIndex: number;
}

export interface Module {
  id: string;
  title: Record<Language, string>;
  description: Record<Language, string>;
  category: 'health' | 'finance' | 'legal' | 'skills' | 'mindset';
  icon: string; // Emoji or icon name
  videoUrl?: string; // Placeholder for prototype
  type: 'lesson' | 'quiz';
  content?: Record<Language, string>; // For lessons
  quizData?: QuizQuestion[]; // For quizzes
  isCompleted: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  audioData?: string; // Base64 audio
}