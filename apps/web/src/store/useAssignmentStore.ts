// apps/web/src/store/useAssignmentStore.ts
import { create } from 'zustand';
import { CreateAssignmentDTO, QuestionPaper } from '@veda/shared-types';

interface AssignmentState extends CreateAssignmentDTO {
  // --- UI View State ---
  currentView: 'list' | 'create' | 'paper';
  
  // --- App Execution State ---
  isGenerating: boolean;
  assignmentId: string | null;
  generatedPaper: QuestionPaper | null;
  pastAssignments: any[]; // Mocking past assignments for the list view

  // --- Actions ---
  setView: (view: 'list' | 'create' | 'paper') => void;
  updateForm: (field: keyof CreateAssignmentDTO, value: any) => void;
  toggleQuestionType: (type: string) => void;
  setGenerating: (isGenerating: boolean, assignmentId?: string | null) => void;
  setGeneratedPaper: (paper: QuestionPaper) => void;
  resetForm: () => void;
}

const initialState = {
  currentView: 'list' as const, // Default to the list view
  dueDate: '',
  questionTypes: [],
  numQuestions: 10,
  totalMarks: 50,
  additionalInstructions: '',
  isGenerating: false,
  assignmentId: null,
  generatedPaper: null,
  pastAssignments: [], // Empty array to trigger the "No assignments yet" screen
};

export const useAssignmentStore = create<AssignmentState>((set) => ({
  ...initialState,

  setView: (view) => set({ currentView: view }),

  updateForm: (field, value) => set((state) => ({ ...state, [field]: value })),

  toggleQuestionType: (type) =>
    set((state) => {
      const exists = state.questionTypes.includes(type);
      return {
        questionTypes: exists
          ? state.questionTypes.filter((t) => t !== type)
          : [...state.questionTypes, type],
      };
    }),

  setGenerating: (isGenerating, assignmentId = null) =>
    set({ isGenerating, assignmentId: assignmentId || null, currentView: 'create' }),

  setGeneratedPaper: (paper) =>
    set({ generatedPaper: paper, isGenerating: false, currentView: 'paper' }),

  resetForm: () => set({ ...initialState, currentView: 'create' }),

  fetchAssignments: async () => {
    try {
      const response = await fetch('api-production-45794.up.railway.app/api/assignments');
      const data = await response.json();
      set({ pastAssignments: data });
    } catch (error) {
      console.error('Error fetching assignments:', error);
    }
  },
}));