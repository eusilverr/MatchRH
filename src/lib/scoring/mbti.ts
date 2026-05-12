export type IpipNeoAnswer = {
  questionId: number;
  domain: 'O' | 'C' | 'E' | 'A' | 'N';
  key: '+' | '-'; // + for positive correlation, - for negative correlation
  score: number; // usually 1 to 5
};

export type MbtiResult = {
  bigFiveScores: {
    O: number;
    C: number;
    E: number;
    A: number;
    N: number;
  };
  mbtiType: string;
  variant: 'A' | 'T'; // Assertive or Turbulent (based on Neuroticism)
  percentages: {
    E: number; I: number;
    S: number; N: number;
    T: number; F: number;
    J: number; P: number;
    Assertive: number; Turbulent: number;
  };
};

export function calculate16Personalities(answers: IpipNeoAnswer[]): MbtiResult {
  const totals = { O: 0, C: 0, E: 0, A: 0, N: 0 };
  const counts = { O: 0, C: 0, E: 0, A: 0, N: 0 };

  for (const answer of answers) {
    counts[answer.domain] += 1;
    // Scoring logic for 1-5 scale: 
    // If positive key, score is the value.
    // If negative key, score is reversed: 6 - value.
    const adjustedScore = answer.key === '+' ? answer.score : (6 - answer.score);
    totals[answer.domain] += adjustedScore;
  }

  // Calculate averages (1 to 5)
  const averages = {
    O: counts.O > 0 ? totals.O / counts.O : 3,
    C: counts.C > 0 ? totals.C / counts.C : 3,
    E: counts.E > 0 ? totals.E / counts.E : 3,
    A: counts.A > 0 ? totals.A / counts.A : 3,
    N: counts.N > 0 ? totals.N / counts.N : 3,
  };

  // Convert to percentages (0 to 100 based on 1-5 scale)
  const toPercentage = (val: number) => Math.round(((val - 1) / 4) * 100);

  const pO = toPercentage(averages.O);
  const pC = toPercentage(averages.C);
  const pE = toPercentage(averages.E);
  const pA = toPercentage(averages.A);
  const pN = toPercentage(averages.N);

  // Map to MBTI dimensions
  // Extraversion -> E vs I (High E = Extravert)
  const isE = pE >= 50;
  // Openness -> N vs S (High O = iNtuitive, Low O = Sensing)
  const isN = pO >= 50;
  // Agreeableness -> F vs T (High A = Feeling, Low A = Thinking)
  const isF = pA >= 50;
  // Conscientiousness -> J vs P (High C = Judging, Low C = Perceiving)
  const isJ = pC >= 50;
  // Neuroticism -> T vs A (High N = Turbulent, Low N = Assertive)
  const isTurbulent = pN >= 50;

  let mbtiType = '';
  mbtiType += isE ? 'E' : 'I';
  mbtiType += isN ? 'N' : 'S';
  mbtiType += isF ? 'F' : 'T';
  mbtiType += isJ ? 'J' : 'P';

  const variant = isTurbulent ? 'T' : 'A';

  return {
    bigFiveScores: {
      O: pO,
      C: pC,
      E: pE,
      A: pA,
      N: pN
    },
    mbtiType,
    variant,
    percentages: {
      E: pE, I: 100 - pE,
      N: pO, S: 100 - pO,
      F: pA, T: 100 - pA,
      J: pC, P: 100 - pC,
      Turbulent: pN, Assertive: 100 - pN
    }
  };
}
