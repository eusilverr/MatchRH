import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type TestStep = 'intro' | 'disc' | 'enneagram' | '16p' | 'completed';

interface TestState {
  step: TestStep;
  discAnswers: Record<number, { most: string; least: string }>;
  enneagramAnswers: Record<number, number>;
  mbtiAnswers: Record<number, number>;
  
  setStep: (step: TestStep) => void;
  setDiscAnswer: (questionId: number, most: string, least: string) => void;
  setEnneagramAnswer: (questionId: number, selectedType: number) => void;
  setMbtiAnswer: (questionId: number, score: number) => void;
  resetTest: () => void;
}

export const useTestStore = create<TestState>()(
  persist(
    (set) => ({
      step: 'intro',
      discAnswers: {},
      enneagramAnswers: {},
      mbtiAnswers: {},

      setStep: (step) => set({ step }),
      setDiscAnswer: (questionId, most, least) =>
        set((state) => ({
          discAnswers: { ...state.discAnswers, [questionId]: { most, least } },
        })),
      setEnneagramAnswer: (questionId, selectedType) =>
        set((state) => ({
          enneagramAnswers: { ...state.enneagramAnswers, [questionId]: selectedType },
        })),
      setMbtiAnswer: (questionId, score) =>
        set((state) => ({
          mbtiAnswers: { ...state.mbtiAnswers, [questionId]: score },
        })),
      resetTest: () =>
        set({
          step: 'intro',
          discAnswers: {},
          enneagramAnswers: {},
          mbtiAnswers: {},
        }),
    }),
    {
      name: 'b2b-rh-test-storage', // name of the item in the storage (must be unique)
    }
  )
);
