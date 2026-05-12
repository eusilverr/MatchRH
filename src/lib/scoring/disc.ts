export type DiscAnswer = {
  questionId: number;
  most: 'D' | 'I' | 'S' | 'C' | 'N'; // N for neutral/none
  least: 'D' | 'I' | 'S' | 'C' | 'N';
};

export type DiscResult = {
  scores: {
    D: number;
    I: number;
    S: number;
    C: number;
  };
  percentages: {
    D: number;
    I: number;
    S: number;
    C: number;
  };
  profile: string; // The combined profile string, e.g., "DI"
};

export function calculateDisc(answers: DiscAnswer[]): DiscResult {
  let D = 0;
  let I = 0;
  let S = 0;
  let C = 0;

  for (const answer of answers) {
    if (answer.most === 'D') D += 1;
    if (answer.most === 'I') I += 1;
    if (answer.most === 'S') S += 1;
    if (answer.most === 'C') C += 1;

    // Least answers typically subtract, or they are scored on a separate graph. 
    // For a simplified unified score, we'll do +1 for most, -1 for least (basic approach),
    // or standard classical scoring which builds 3 graphs:
    // Graph I: MOST
    // Graph II: LEAST
    // Graph III: Difference (MOST - LEAST)
    // We will use the Difference approach for the final percentage.
    
    if (answer.least === 'D') D -= 1;
    if (answer.least === 'I') I -= 1;
    if (answer.least === 'S') S -= 1;
    if (answer.least === 'C') C -= 1;
  }

  // Normalize to positive base and percentages
  // Since difference can be negative (e.g. -24 to +24), we shift by 24 and divide by total range (48).
  // This is a simplified fallback if exact graph normalization tables aren't provided.
  const numQuestions = answers.length > 0 ? answers.length : 24; 
  
  const normalize = (score: number) => {
    const rawPercentage = ((score + numQuestions) / (numQuestions * 2)) * 100;
    return Math.max(0, Math.min(100, rawPercentage));
  };

  const pD = normalize(D);
  const pI = normalize(I);
  const pS = normalize(S);
  const pC = normalize(C);

  // Define profile based on highest scores (above 50%)
  let profile = '';
  if (pD > 50) profile += 'D';
  if (pI > 50) profile += 'I';
  if (pS > 50) profile += 'S';
  if (pC > 50) profile += 'C';

  if (!profile) {
    // Fallback to the highest single trait if none above 50%
    const max = Math.max(pD, pI, pS, pC);
    if (max === pD) profile = 'D';
    else if (max === pI) profile = 'I';
    else if (max === pS) profile = 'S';
    else profile = 'C';
  }

  return {
    scores: { D, I, S, C },
    percentages: {
      D: Math.round(pD),
      I: Math.round(pI),
      S: Math.round(pS),
      C: Math.round(pC),
    },
    profile,
  };
}
