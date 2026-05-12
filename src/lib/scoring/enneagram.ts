export type EnneagramAnswer = {
  questionId: number;
  selectedType: number; // The Enneagram type (1-9) that the selected statement corresponds to
};

export type EnneagramResult = {
  scores: Record<number, number>; // Maps type (1-9) to its score
  primaryType: number;
  wing: number;
  percentages: Record<number, number>;
};

export function calculateEnneagram(answers: EnneagramAnswer[]): EnneagramResult {
  const scores: Record<number, number> = {
    1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0
  };

  // Tally the scores
  for (const answer of answers) {
    if (scores[answer.selectedType] !== undefined) {
      scores[answer.selectedType] += 1;
    }
  }

  // Find primary type
  let primaryType = 1;
  let maxScore = -1;

  for (let i = 1; i <= 9; i++) {
    if (scores[i] > maxScore) {
      maxScore = scores[i];
      primaryType = i;
    }
  }

  // Find wing (the adjacent type with the highest score)
  // Adjacent types:
  // 1 -> 9, 2
  // 2 -> 1, 3
  // ...
  // 9 -> 8, 1
  const adjacent1 = primaryType === 1 ? 9 : primaryType - 1;
  const adjacent2 = primaryType === 9 ? 1 : primaryType + 1;

  const wing = scores[adjacent1] > scores[adjacent2] ? adjacent1 : adjacent2;

  // Calculate percentages based on the total possible score per type.
  // In RHETI (144 questions), each type is compared to the other 8 types 4 times? 
  // Wait, there are 36 possible pairs for 9 types. 36 * 4 = 144.
  // So maximum score for a single type is 8 * 4 = 32.
  const maxPossibleTypeScore = 32;

  const percentages: Record<number, number> = {};
  for (let i = 1; i <= 9; i++) {
    percentages[i] = Math.round((scores[i] / maxPossibleTypeScore) * 100);
  }

  return {
    scores,
    primaryType,
    wing,
    percentages
  };
}
