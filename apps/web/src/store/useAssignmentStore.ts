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

  fetchAssignments: () => Promise<void>;
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
      // 1. MUST include https://
      const response = await fetch('https://api-production-45794.up.railway.app/api/assignments');
      
      // 2. Safeguard: Check if the response is HTML instead of JSON
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") === -1) {
        const text = await response.text();
        console.error("❌ Expected JSON, but received HTML. The backend might be down.");
        console.error("HTML Preview:", text.substring(0, 200));
        return;
      }

      // 3. Safely parse the JSON
      if (response.ok) {
        const data = await response.json();
        set({ pastAssignments: data });
      } else {
        console.error("❌ Backend returned an error status:", response.status);
      }
    } catch (error) {
      console.error('Error fetching assignments:', error);
    }
  },
}));