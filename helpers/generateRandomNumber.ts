import { gcd } from 'mathjs';

export const generateRandomNumber = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

export const modPow = (
  base: number,
  exponent: number,
  modulus: number,
): number => {
  if (modulus === 1) return 0;

  let result = 1;
  base = base % modulus;

  while (exponent > 0) {
    if (exponent % 2 === 1) {
      result = (result * base) % modulus;
    }
    exponent = Math.floor(exponent / 2);
    base = (base * base) % modulus;
  }

  return result;
};

export const isProbablePrimeFermat = (
  k: number,
  p: number,
): { isPrime: boolean; reason?: string } => {
  if (p % 2 === 0) {
    return { isPrime: false, reason: 'Парне число' };
  }

  for (let i = 0; i < k; i++) {
    const x = generateRandomNumber(2, p - 2);
    const d = gcd(x, p);

    if (d > 1) {
      return {
        isPrime: false,
        reason: `НСД(${x}, ${p}) = ${d} > 1`,
      };
    }

    const testFerme: number = modPow(x, p - 1, p);

    if (testFerme !== 1) {
      return {
        isPrime: false,
        reason: `${x}^${p - 1} mod ${p} = ${testFerme} ≠ 1 (тест Ферма)`,
      };
    }
  }

  return { isPrime: true };
};

export const getPrimeNumber = () => {
  let attempts = 0;
  const failedNumbers: Array<{ number: number; reason: string }> = [];

  while (true) {
    ++attempts;
    const randomNumber = generateRandomNumber(5000, 10000);
    const result = isProbablePrimeFermat(4, randomNumber);

    if (result.isPrime) {
      return {
        primeNumber: randomNumber,
        attempts,
        failedNumbers,
      };
    } else {
      // Зберігаємо перші 5 невдалих спроб для логування
      if (failedNumbers.length < 5) {
        failedNumbers.push({
          number: randomNumber,
          reason: result.reason || 'Невідома причина',
        });
      }
    }
  }
};

const getPrimeFactors = (n: number): number[] => {
  const factors: Set<number> = new Set();
  let temp = n;

  if (temp % 2 === 0) {
    factors.add(2);
    while (temp % 2 === 0) temp /= 2;
  }

  for (let i = 3; i * i <= temp; i += 2) {
    if (temp % i === 0) {
      factors.add(i);
      while (temp % i === 0) temp /= i;
    }
  }

  if (temp > 2) factors.add(temp);

  return Array.from(factors);
};

export const isPrimitiveRoot = (alpha: number, p: number): boolean => {
  const phi = p - 1;
  const primeFactors = getPrimeFactors(phi);

  for (const q of primeFactors) {
    if (modPow(alpha, phi / q, p) === 1) {
      return false;
    }
  }
  return true;
};

export const findPrimitiveRoot = (p: number): number => {
  for (let alpha = 2; alpha < p; alpha++) {
    if (isPrimitiveRoot(alpha, p)) {
      return alpha;
    }
  }
  throw new Error(`No primitive root found for p=${p}`);
};

export const generateMultiplePrimes = (count: number = 10) => {
  const primes: number[] = [];
  const attemptsArray: number[] = [];
  const allFailedNumbers: Array<{
    primeIndex: number;
    failures: Array<{ number: number; reason: string }>;
  }> = [];
  let totalAttempts = 0;

  for (let i = 0; i < count; i++) {
    const { primeNumber, attempts, failedNumbers } = getPrimeNumber();
    primes.push(primeNumber);
    attemptsArray.push(attempts);
    totalAttempts += attempts;

    if (failedNumbers.length > 0) {
      allFailedNumbers.push({
        primeIndex: i + 1,
        failures: failedNumbers,
      });
    }
  }

  return {
    primes,
    attempts: attemptsArray,
    averageAttempts: totalAttempts / count,
    totalAttempts,
    failedNumbers: allFailedNumbers,
  };
};
