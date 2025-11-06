# 🔐 Diffie-Hellman Key Exchange: Complete Explanation

## 📚 Table of Contents
1. [Overview](#overview)
2. [The Problem We're Solving](#the-problem-were-solving)
3. [Mathematical Foundation](#mathematical-foundation)
4. [Step-by-Step Protocol](#step-by-step-protocol)
5. [Implementation Components](#implementation-components)
6. [Security Analysis](#security-analysis)
7. [Code Walkthrough](#code-walkthrough)

---

## 🎯 Overview

**Diffie-Hellman Key Exchange** is a cryptographic protocol that allows two parties to establish a shared secret key over an insecure communication channel. This shared key can then be used for encrypted communication using symmetric encryption algorithms.

### Key Characteristics:
- **Invented in 1976** by Whitfield Diffie and Martin Hellman
- **First practical public-key algorithm**
- **Solves the key distribution problem**
- **Security based on the discrete logarithm problem**

### Real-World Analogy: The Paint Mixing Analogy

Imagine Alice and Bob want to create the same paint color without anyone else being able to recreate it:

1. **Public Starting Point**: They both start with yellow paint (publicly known)
2. **Secret Colors**: Alice secretly adds red, Bob secretly adds blue
3. **First Mix**: Alice has orange (yellow + red), Bob has green (yellow + blue)
4. **Exchange Mixed Colors**: They exchange their mixed colors publicly
5. **Final Mix**:
   - Alice adds her secret red to Bob's green → gets brown
   - Bob adds his secret blue to Alice's orange → gets the same brown!
6. **Result**: They both have the same brown color, but an eavesdropper only saw yellow, orange, and green!

---

## 🔍 The Problem We're Solving

### The Key Distribution Problem

**Scenario**: Alice and Bob want to communicate securely using encryption.

**Traditional Symmetric Encryption Problem**:
```
Alice wants to send: "Hello Bob" (encrypted)
Bob needs the same key to decrypt it

Question: How do Alice and Bob share the key securely?
```

**The Catch-22**:
- To send the key securely, they need encryption
- To have encryption, they need to share a key first
- 🔄 Circular dependency!

**Diffie-Hellman Solution**:
- They can create a shared secret without ever transmitting it
- An eavesdropper sees all public data but cannot compute the secret
- No pre-shared secret key is needed

---

## 🧮 Mathematical Foundation

### 1. Modular Arithmetic

**Definition**: Modular arithmetic is "clock arithmetic" where numbers wrap around.

```
Examples with mod 12 (like a clock):
- 15 mod 12 = 3  (15 hours = 3 o'clock)
- 25 mod 12 = 1  (25 hours = 1 o'clock)
```

**Key Property**:
```
(a × b) mod p = ((a mod p) × (b mod p)) mod p
```

This allows us to keep numbers manageable during calculations.

### 2. Modular Exponentiation

**Definition**: Computing a^b mod p efficiently.

```
Example: Calculate 2^10 mod 7

Direct way: 2^10 = 1024, then 1024 mod 7 = 2
Smart way (used in code):
  2^1 mod 7 = 2
  2^2 mod 7 = 4
  2^4 mod 7 = (4 × 4) mod 7 = 2
  2^8 mod 7 = (2 × 2) mod 7 = 4
  2^10 = 2^8 × 2^2 = 4 × 4 mod 7 = 2
```

**Why This Matters**: We can compute huge exponentiations without overflow.

### 3. Prime Numbers

**Definition**: A number greater than 1 that has no divisors except 1 and itself.

```
Primes: 2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31...
Not Prime: 4 (2×2), 6 (2×3), 8 (2×4), 9 (3×3)...
```

**Why Use Primes?**: They have special mathematical properties that make the discrete logarithm problem hard.

### 4. Primitive Root (Generator)

**Definition**: A number α is a primitive root modulo p if its powers generate all numbers from 1 to p-1.

```
Example: α = 2 is a primitive root of p = 5

2^1 mod 5 = 2
2^2 mod 5 = 4
2^3 mod 5 = 3
2^4 mod 5 = 1

All numbers {1, 2, 3, 4} are generated! ✓
```

**Why We Need This**: Ensures maximum security by allowing all possible shared secrets.

### 5. The Discrete Logarithm Problem (DLP)

**The Hard Problem**:
```
Given: p (prime), α (base), and β = α^x mod p
Find: x

Easy Direction (→): Given x, compute β = α^x mod p (fast)
Hard Direction (←): Given β, find x (exponentially hard for large numbers)
```

**Example**:
```
Easy: Given x = 7, compute 2^7 mod 13 = 11 (quick!)
Hard: Given 11, find x where 2^x mod 13 = 11 (try all values!)
```

**Security Foundation**: Diffie-Hellman's security relies on the DLP being computationally infeasible for large primes.

---

## 🔄 Step-by-Step Protocol

### Complete Protocol Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                    DIFFIE-HELLMAN KEY EXCHANGE                      │
└─────────────────────────────────────────────────────────────────────┘

PARTICIPANTS:
  - Alice (User A / Server)
  - Bob (User B / Client)
  - Eve (Eavesdropper - can see all public communications)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PHASE 1: SETUP (PUBLIC PARAMETER GENERATION)
─────────────────────────────────────────────────────────────────────

┌─────────────┐
│    Alice    │
└─────────────┘
      │
      ├─► Generate prime p using Fermat Test
      │   Example: p = 6779
      │
      ├─► Find primitive root α of p
      │   Example: α = 2
      │
      └─► These are PUBLIC parameters
          Eve can see them!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PHASE 2: SECRET KEY GENERATION (PRIVATE)
─────────────────────────────────────────────────────────────────────

┌─────────────┐                                      ┌─────────────┐
│    Alice    │                                      │     Bob     │
└─────────────┘                                      └─────────────┘
      │                                                      │
      ├─► Generate secret key K_A                           │
      │   Range: 2 ≤ K_A ≤ p-2                              │
      │   Example: K_A = 1234                               │
      │   🔒 NEVER transmitted!                             │
      │                                                      │
      │                                                      ├─► Generate secret key K_B
      │                                                      │   Range: 2 ≤ K_B ≤ p-2
      │                                                      │   Example: K_B = 5678
      │                                                      │   🔒 NEVER transmitted!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PHASE 3: PUBLIC KEY COMPUTATION
─────────────────────────────────────────────────────────────────────

┌─────────────┐                                      ┌─────────────┐
│    Alice    │                                      │     Bob     │
└─────────────┘                                      └─────────────┘
      │                                                      │
      ├─► Compute public key Y_A                            │
      │   Y_A = α^K_A mod p                                 │
      │   Y_A = 2^1234 mod 6779                             │
      │   Y_A = 5333                                        │
      │                                                      │
      │                                                      ├─► Compute public key Y_B
      │                                                      │   Y_B = α^K_B mod p
      │                                                      │   Y_B = 2^5678 mod 6779
      │                                                      │   Y_B = 4521

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PHASE 4: PUBLIC KEY EXCHANGE (TRANSMITTED OVER INSECURE CHANNEL)
─────────────────────────────────────────────────────────────────────

┌─────────────┐                                      ┌─────────────┐
│    Alice    │                                      │     Bob     │
└─────────────┘                                      └─────────────┘
      │                                                      │
      │  📨 Send: p, α, Y_A                                 │
      ├──────────────────────────────────────────────────►  │
      │  (6779, 2, 5333)                                    │
      │                                                      │
      │                     📨 Send: Y_B                     │
      │  ◄─────────────────────────────────────────────────┤
      │                      (4521)                          │

🔓 Eve can intercept: p = 6779, α = 2, Y_A = 5333, Y_B = 4521
   But she CANNOT determine K_A or K_B! (Discrete Log Problem)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PHASE 5: SHARED SECRET COMPUTATION
─────────────────────────────────────────────────────────────────────

┌─────────────┐                                      ┌─────────────┐
│    Alice    │                                      │     Bob     │
└─────────────┘                                      └─────────────┘
      │                                                      │
      ├─► Compute shared secret K_AB                        │
      │   K_AB = Y_B^K_A mod p                              │
      │   K_AB = 4521^1234 mod 6779                         │
      │   K_AB = 3456                                       │
      │                                                      │
      │                                                      ├─► Compute shared secret K_AB
      │                                                      │   K_AB = Y_A^K_B mod p
      │                                                      │   K_AB = 5333^5678 mod 6779
      │                                                      │   K_AB = 3456

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

RESULT: SHARED SECRET ESTABLISHED! 🎉
─────────────────────────────────────────────────────────────────────

✓ Alice computed: K_AB = 3456
✓ Bob computed:   K_AB = 3456
✓ They match! Both can now use K_AB for symmetric encryption
✗ Eve cannot compute K_AB without knowing K_A or K_B

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Why It Works: The Mathematical Magic

**The Beautiful Symmetry**:

```
Alice computes:
  K_AB = Y_B^K_A mod p
       = (α^K_B)^K_A mod p
       = α^(K_B × K_A) mod p

Bob computes:
  K_AB = Y_A^K_B mod p
       = (α^K_A)^K_B mod p
       = α^(K_A × K_B) mod p

Since K_A × K_B = K_B × K_A (multiplication is commutative):
  Alice's K_AB = Bob's K_AB ✓
```

**Why Eve Cannot Compute It**:

Eve knows: p, α, Y_A, Y_B

To compute K_AB, Eve would need to:
1. **Option A**: Solve Y_A = α^K_A mod p for K_A (Discrete Log Problem - HARD!)
2. **Option B**: Solve Y_B = α^K_B mod p for K_B (Discrete Log Problem - HARD!)
3. **Option C**: Directly compute α^(K_A × K_B) from Y_A and Y_B (Diffie-Hellman Problem - HARD!)

All three options are computationally infeasible for large primes!

---

## 🔧 Implementation Components

### 1. Prime Number Generation (Fermat Primality Test)

**Purpose**: Generate a large prime number p.

**Fermat's Little Theorem**:
```
If p is prime and gcd(a, p) = 1, then:
  a^(p-1) ≡ 1 (mod p)
```

**How the Test Works**:

```javascript
function isProbablePrimeFermat(k, p) {
  // Quick check: is p even?
  if (p % 2 === 0) {
    return false; // Not prime (except 2)
  }

  // Repeat test k times with different random bases
  for (let i = 0; i < k; i++) {
    // Pick random witness a in range [2, p-2]
    let a = randomNumber(2, p - 2);

    // Check if gcd(a, p) = 1
    if (gcd(a, p) > 1) {
      return false; // p is composite
    }

    // Check Fermat's condition: a^(p-1) mod p = 1
    if (modPow(a, p - 1, p) !== 1) {
      return false; // p is definitely composite
    }
  }

  // Probably prime (probability ≥ 1 - (1/2)^k)
  return true;
}
```

**Example Execution**:
```
Testing p = 6779 with k = 4 iterations:

Iteration 1:
  a = 1032
  gcd(1032, 6779) = 1 ✓
  1032^6778 mod 6779 = 1 ✓

Iteration 2:
  a = 5421
  gcd(5421, 6779) = 1 ✓
  5421^6778 mod 6779 = 1 ✓

Iteration 3:
  a = 892
  gcd(892, 6779) = 1 ✓
  892^6778 mod 6779 = 1 ✓

Iteration 4:
  a = 3456
  gcd(3456, 6779) = 1 ✓
  3456^6778 mod 6779 = 1 ✓

Result: 6779 is PROBABLY PRIME
Confidence: 1 - (1/2)^4 = 93.75%
```

**Why We Test Multiple Times**:
- Each test with probability ≥ 1/2 of detecting a composite
- k = 4 tests → error probability ≤ (1/2)^4 = 6.25%
- More tests = higher confidence

**Numbers That Fail**:
```
7125 → gcd(1218, 7125) = 3 > 1 ✗ (Has factor 3)
7818 → Even number ✗ (Divisible by 2)
5713 → 1032^5712 mod 5713 = 4525 ≠ 1 ✗ (Fermat test fails)
```

### 2. Modular Exponentiation (Fast Power Algorithm)

**Purpose**: Compute a^b mod m efficiently.

**Naive Approach Problem**:
```
2^1000 mod 13 = ?

Naive: 2^1000 = 1.07 × 10^301 (TOO BIG - overflow!)
```

**Binary Exponentiation (Square-and-Multiply)**:

```javascript
function modPow(base, exponent, modulus) {
  let result = 1;
  base = base % modulus;

  while (exponent > 0) {
    // If exponent is odd, multiply result by base
    if (exponent % 2 === 1) {
      result = (result * base) % modulus;
    }

    // Square the base and halve the exponent
    exponent = Math.floor(exponent / 2);
    base = (base * base) % modulus;
  }

  return result;
}
```

**Example: Calculate 5^13 mod 7**

```
Step-by-step breakdown:

Initial: result = 1, base = 5, exp = 13 (binary: 1101)

Iteration 1: exp = 13 (1101 in binary, last bit = 1)
  ├─ Odd exponent → result = (1 × 5) mod 7 = 5
  ├─ exp = 13 ÷ 2 = 6
  └─ base = (5 × 5) mod 7 = 4

Iteration 2: exp = 6 (110 in binary, last bit = 0)
  ├─ Even exponent → skip result update
  ├─ exp = 6 ÷ 2 = 3
  └─ base = (4 × 4) mod 7 = 2

Iteration 3: exp = 3 (11 in binary, last bit = 1)
  ├─ Odd exponent → result = (5 × 2) mod 7 = 3
  ├─ exp = 3 ÷ 2 = 1
  └─ base = (2 × 2) mod 7 = 4

Iteration 4: exp = 1 (1 in binary, last bit = 1)
  ├─ Odd exponent → result = (3 × 4) mod 7 = 5
  ├─ exp = 1 ÷ 2 = 0
  └─ DONE

Result: 5^13 mod 7 = 5

Verification: 5^13 = 1,220,703,125 → 1,220,703,125 mod 7 = 5 ✓
```

**Complexity**:
- Naive: O(b) multiplications
- Fast: O(log b) multiplications
- For b = 1,000,000: Naive = 1M ops, Fast = 20 ops! 🚀

### 3. Primitive Root Finding

**Purpose**: Find α that generates all elements of Z*_p.

**Definition**:
```
α is a primitive root mod p if:
  {α^1 mod p, α^2 mod p, ..., α^(p-1) mod p} = {1, 2, ..., p-1}
```

**Test Algorithm**:
```javascript
function isPrimitiveRoot(alpha, p) {
  // Get prime factors of φ(p) = p - 1
  let primeFactors = getPrimeFactors(p - 1);

  // Check: α^((p-1)/q) mod p ≠ 1 for each prime factor q
  for (let q of primeFactors) {
    if (modPow(alpha, (p - 1) / q, p) === 1) {
      return false; // α is NOT a primitive root
    }
  }

  return true; // α IS a primitive root
}
```

**Example: Check if α = 2 is primitive root of p = 7**

```
Step 1: Calculate φ(7) = 7 - 1 = 6

Step 2: Factor 6 = 2 × 3
  Prime factors: {2, 3}

Step 3: Test each prime factor

  Test q = 2:
    α^(φ/q) = 2^(6/2) = 2^3 mod 7 = 8 mod 7 = 1 ✗

  Since 2^3 mod 7 = 1, α = 2 is NOT a primitive root of 7

Let's try α = 3:

  Test q = 2:
    3^(6/2) = 3^3 mod 7 = 27 mod 7 = 6 ≠ 1 ✓

  Test q = 3:
    3^(6/3) = 3^2 mod 7 = 9 mod 7 = 2 ≠ 1 ✓

  Result: α = 3 IS a primitive root of 7!

Verification:
  3^1 mod 7 = 3
  3^2 mod 7 = 2
  3^3 mod 7 = 6
  3^4 mod 7 = 4
  3^5 mod 7 = 5
  3^6 mod 7 = 1

  {3, 2, 6, 4, 5, 1} = {1, 2, 3, 4, 5, 6} ✓
```

**Why This Matters**:
- Using non-primitive roots reduces the possible shared secret space
- Reduces security by limiting possible keys
- Primitive root ensures maximum entropy

### 4. Random Number Generation

**Current Implementation**:
```javascript
function generateRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
```

**What's Happening**:
1. `Math.random()` generates pseudo-random float in [0, 1)
2. Multiply by range size: (max - min + 1)
3. Add min to shift to desired range
4. `Math.floor()` rounds down to integer

**Example**:
```
generateRandomNumber(5, 10)

Math.random() = 0.7234
0.7234 × (10 - 5 + 1) = 0.7234 × 6 = 4.3404
4.3404 + 5 = 9.3404
Math.floor(9.3404) = 9

Result: 9 (in range [5, 10]) ✓
```

**⚠️ SECURITY WARNING**:
- `Math.random()` is NOT cryptographically secure
- Predictable with knowledge of internal state
- **Must use `crypto.randomBytes()` in production!**

---

## 🛡️ Security Analysis

### What's Secure?

✅ **Protected Information**:
- Secret keys (K_A, K_B) - Never transmitted
- Shared secret (K_AB) - Computed independently by both parties
- Future encrypted messages using K_AB

✅ **Security Properties**:
- **Confidentiality**: Eavesdropper cannot determine K_AB
- **Forward Secrecy**: New session keys for each exchange
- **Computational Security**: Breaking requires solving discrete log

### What Can Eve See?

🔓 **Public Information**:
```
Eve intercepts:
  - Prime p = 6779
  - Generator α = 2
  - Public key Y_A = 5333
  - Public key Y_B = 4521
```

🔒 **What Eve Cannot Determine**:
```
Eve needs but cannot find:
  - Secret key K_A
  - Secret key K_B
  - Shared secret K_AB
```

### Attack Scenarios

#### 1. Brute Force Attack

**Attack**: Try all possible secret keys.

```
For p = 6779:
  Possible keys: 2 to 6777 = 6,776 keys

For small primes (like 6779):
  Time: milliseconds ⚠️

For 2048-bit primes:
  Possible keys: ~2^2048 ≈ 3.2 × 10^616
  Time: longer than age of universe ✓
```

**Defense**: Use large primes (≥ 2048 bits in production)

#### 2. Man-in-the-Middle (MITM) Attack

**Attack**: Eve impersonates both parties.

```
Scenario:
  Alice          Eve          Bob
    │             │             │
    ├─ Y_A ──────►│             │  Eve intercepts Y_A
    │             ├─ Y_E1 ─────►│  Eve sends her own Y_E1
    │             │             │
    │             │◄── Y_E2 ────┤  Eve sends her own Y_E2
    │◄────── Y_B ─┤             │  Eve intercepts Y_B

Result:
  - Alice shares key with Eve
  - Bob shares key with Eve
  - Eve can decrypt, modify, and re-encrypt all messages!
```

**Defense**:
- Use authentication (digital signatures)
- Use certificates (PKI)
- Implement authenticated Diffie-Hellman (e.g., TLS)

#### 3. Small Subgroup Attack

**Attack**: Send malicious public key that generates small subgroup.

```
Example: Send Y_B = 1

Alice computes: K_AB = Y_B^K_A mod p = 1^K_A mod p = 1

Eve knows K_AB = 1 without breaking anything!
```

**Defense**:
- Validate received public keys
- Check: 2 ≤ Y ≤ p-1
- Check: Y^((p-1)/2) mod p ≠ 1
- Use safe primes (p where (p-1)/2 is also prime)

#### 4. Timing Attacks

**Attack**: Measure computation time to learn secret key bits.

```
Observation: modPow time varies based on exponent bits

If K_A has more 1-bits → More multiplications → Longer time
```

**Defense**:
- Constant-time implementations
- Blinding techniques
- Use hardware crypto when available

### Current Implementation Vulnerabilities

🔴 **Critical Issues**:
1. **Math.random()** - Not cryptographically secure
2. **Small key size** (5000-10000) - Can be brute forced
3. **No public key validation** - Vulnerable to invalid curve attacks
4. **No authentication** - Vulnerable to MITM attacks

🟡 **Medium Issues**:
5. **Fermat test** - Can be fooled by Carmichael numbers
6. **No session management** - Keys don't expire
7. **JavaScript number limits** - Max safe integer is 2^53

🟢 **Minor Issues**:
8. **No rate limiting** - DoS possible
9. **No error handling** - Can crash on invalid input
10. **Logging sensitive data** - Should not log keys

---

## 📝 Code Walkthrough

### Complete Flow with Code

```typescript
// ═══════════════════════════════════════════════════════════════
// STEP 1: USER B CLICKS "START PROTOCOL"
// ═══════════════════════════════════════════════════════════════

// Frontend (index.html)
function initiateProtocol() {
  addLog('🚀 Ініціація протоколу Діффі-Хелмана...');
  socket.emit('initiateDH', { message: 'Користувач B готовий' });
  document.getElementById('btn-init').disabled = true;
}

// What happens:
// - User clicks button
// - WebSocket message sent to server
// - Button disabled to prevent double-click

// ═══════════════════════════════════════════════════════════════
// STEP 2: SERVER GENERATES PRIME NUMBER
// ═══════════════════════════════════════════════════════════════

// Backend (gateaway.ts)
@SubscribeMessage('initiateDH')
initiateDiffieHellman(@ConnectedSocket() client: Socket) {
  // Generate prime using Fermat test
  const result = getPrimeNumber();
  const { primeNumber, attempts, failedNumbers } = result;

  // Example output:
  // primeNumber = 6779
  // attempts = 32
  // failedNumbers = [
  //   { number: 7125, reason: 'НСД(1218, 7125) = 3 > 1' },
  //   { number: 7818, reason: 'Парне число' },
  //   ...
  // ]
}

// Helper (generateRandomNumber.ts)
export const getPrimeNumber = () => {
  let attempts = 0;
  const failedNumbers = [];

  while (true) {
    ++attempts;

    // Generate random candidate
    const randomNumber = generateRandomNumber(5000, 10000);
    // Example: randomNumber = 7125

    // Test with Fermat (k=4 rounds)
    const result = isProbablePrimeFermat(4, randomNumber);

    if (result.isPrime) {
      // Found prime! Return it
      return { primeNumber: randomNumber, attempts, failedNumbers };
    } else {
      // Not prime, record failure and try again
      failedNumbers.push({
        number: randomNumber,
        reason: result.reason
      });
    }
  }
};

// ═══════════════════════════════════════════════════════════════
// STEP 3: FERMAT PRIMALITY TEST
// ═══════════════════════════════════════════════════════════════

export const isProbablePrimeFermat = (k, p) => {
  // Quick check: reject even numbers
  if (p % 2 === 0) {
    return { isPrime: false, reason: 'Парне число' };
  }

  // Run k independent tests
  for (let i = 0; i < k; i++) {
    // Choose random witness
    const x = generateRandomNumber(2, p - 2);
    // Example: x = 1032

    // Test 1: Check if gcd(x, p) = 1
    const d = gcd(x, p);
    if (d > 1) {
      return {
        isPrime: false,
        reason: `НСД(${x}, ${p}) = ${d} > 1`
      };
    }

    // Test 2: Fermat's Little Theorem
    // If p is prime: x^(p-1) mod p should equal 1
    const testFerme = modPow(x, p - 1, p);
    if (testFerme !== 1) {
      return {
        isPrime: false,
        reason: `${x}^${p-1} mod ${p} = ${testFerme} ≠ 1`
      };
    }
  }

  // Passed all tests - probably prime!
  return { isPrime: true };
};

// Example execution for p = 6779:
// Round 1: x = 1032, gcd(1032,6779) = 1 ✓, 1032^6778 mod 6779 = 1 ✓
// Round 2: x = 5421, gcd(5421,6779) = 1 ✓, 5421^6778 mod 6779 = 1 ✓
// Round 3: x = 892, gcd(892,6779) = 1 ✓, 892^6778 mod 6779 = 1 ✓
// Round 4: x = 3456, gcd(3456,6779) = 1 ✓, 3456^6778 mod 6779 = 1 ✓
// Result: PROBABLY PRIME (confidence: 93.75%)

// ═══════════════════════════════════════════════════════════════
// STEP 4: FIND PRIMITIVE ROOT
// ═══════════════════════════════════════════════════════════════

// Backend (gateaway.ts) - continued
const alpha = findPrimitiveRoot(primeNumber);
// For p = 6779, alpha = 2

// Helper (generateRandomNumber.ts)
export const findPrimitiveRoot = (p) => {
  // Try each candidate starting from 2
  for (let alpha = 2; alpha < p; alpha++) {
    if (isPrimitiveRoot(alpha, p)) {
      return alpha;
    }
  }
  throw new Error(`No primitive root found for p=${p}`);
};

export const isPrimitiveRoot = (alpha, p) => {
  const phi = p - 1; // Euler's totient for prime p
  // For p = 6779: phi = 6778

  // Get prime factors of φ(p)
  const primeFactors = getPrimeFactors(phi);
  // 6778 = 2 × 3389
  // primeFactors = [2, 3389]

  // Test: α^(φ/q) mod p ≠ 1 for all prime factors q
  for (const q of primeFactors) {
    if (modPow(alpha, phi / q, p) === 1) {
      return false; // Not a primitive root
    }
  }

  return true; // Is a primitive root!
};

// Example for alpha = 2, p = 6779:
// Test q = 2: 2^(6778/2) = 2^3389 mod 6779 ≠ 1 ✓
// Test q = 3389: 2^(6778/3389) = 2^2 mod 6779 = 4 ≠ 1 ✓
// Result: 2 IS a primitive root of 6779

// ═══════════════════════════════════════════════════════════════
// STEP 5: SERVER GENERATES SECRET KEY AND PUBLIC KEY
// ═══════════════════════════════════════════════════════════════

// Backend (gateaway.ts) - continued
const secretKey = generateRandomNumber(2, primeNumber - 2);
// Example: secretKey (K_A) = 1234

const publicKey = modPow(alpha, secretKey, primeNumber);
// Y_A = 2^1234 mod 6779 = 5333

// Store in session
this.sessions.set(client.id, {
  primeNumber: 6779,
  alpha: 2,
  secretKey: 1234,  // 🔒 Never sent to client!
  publicKey: 5333   // 📨 Will be sent to client
});

// ═══════════════════════════════════════════════════════════════
// STEP 6: SERVER SENDS PUBLIC PARAMETERS TO CLIENT
// ═══════════════════════════════════════════════════════════════

client.emit('dhParameters', {
  primeNumber: 6779,
  alpha: 2,
  publicKey: 5333,
  attempts: 32,
  failedNumbers: [...],
  message: 'Public params were sent'
});

// Transmitted data:
// {
//   primeNumber: 6779,     // Prime modulus
//   alpha: 2,              // Generator/primitive root
//   publicKey: 5333,       // Y_A = α^K_A mod p
//   attempts: 32,          // How many tries to find prime
//   failedNumbers: [...]   // Numbers that failed Fermat test
// }

// 🔓 This data is sent over network - Eve can see it!

// ═══════════════════════════════════════════════════════════════
// STEP 7: CLIENT RECEIVES PARAMETERS
// ═══════════════════════════════════════════════════════════════

// Frontend (index.html)
socket.on('dhParameters', (data) => {
  addLog('📨 Отримано відкриті параметри від користувача A');
  addLog(`   p = ${data.primeNumber} (знайдено за ${data.attempts} спроб)`);
  addLog(`   α = ${data.alpha} (примітивний корінь mod p)`);
  addLog(`   Y_A = ${data.publicKey}`);

  // Log all failed numbers
  if (data.failedNumbers && data.failedNumbers.length > 0) {
    addLog(`❌ Усього чисел, що НЕ пройшли тест Ферма: ${data.failedNumbers.length}`);
    data.failedNumbers.forEach((failed, index) => {
      addLog(`   ${index + 1}. ${failed.number} - ${failed.reason}`);
    });
  }

  // Store parameters
  serverParams = {
    primeNumber: data.primeNumber,
    alpha: data.alpha,
    publicKeyA: data.publicKey,
    attempts: data.attempts
  };

  // Move to next step
  generateClientKeys(serverParams);
});

// User sees in log:
// 📨 Отримано відкриті параметри від користувача A
//    p = 6779 (знайдено за 32 спроб)
//    α = 2 (примітивний корінь mod p)
//    Y_A = 5333
// ❌ Усього чисел, що НЕ пройшли тест Ферма: 31
//    1. 7125 — НСД(1218, 7125) = 3 > 1
//    2. 7818 — Парне число
//    ...

// ═══════════════════════════════════════════════════════════════
// STEP 8: CLIENT GENERATES SECRET KEY
// ═══════════════════════════════════════════════════════════════

function generateClientKeys(data) {
  const { primeNumber, alpha, publicKeyA } = data;
  // primeNumber = 6779, alpha = 2, publicKeyA = 5333

  setStep(3);
  addLog('🔧 Генерація параметрів користувача B...');

  // Generate random secret key
  clientSecretKey = Math.floor(Math.random() * (primeNumber - 3)) + 2;
  // Example: clientSecretKey (K_B) = 5678

  addLog(`🔐 Згенеровано секретний ключ k_B = ${clientSecretKey}`);

  // 🔒 This key NEVER leaves the browser!
  // It's stored only in JavaScript memory

  // Display in UI (yellow box - marked as SECRET)
  document.getElementById('param-kb').textContent = clientSecretKey;
}

// User sees:
// 🔧 Генерація параметрів користувача B...
// 🔐 Згенеровано секретний ключ k_B = 5678

// ═══════════════════════════════════════════════════════════════
// STEP 9: CLIENT COMPUTES PUBLIC KEY
// ═══════════════════════════════════════════════════════════════

setTimeout(() => {
  setStep(4);

  // Compute public key: Y_B = α^K_B mod p
  clientPublicKey = modPow(alpha, clientSecretKey, primeNumber);
  // Y_B = 2^5678 mod 6779 = 4521

  addLog(`🔑 Обчислено публічний ключ Y_B = α^k_B mod p`);
  addLog(`   Y_B = ${alpha}^${clientSecretKey} mod ${primeNumber} = ${clientPublicKey}`);

  // Display in UI
  document.getElementById('param-yb').textContent = clientPublicKey;
}, 500);

// Modular exponentiation breakdown (simplified):
// 2^5678 mod 6779
// = 2^(4096 + 1024 + 512 + 32 + 8 + 4 + 2) mod 6779
// = (2^4096 × 2^1024 × 2^512 × 2^32 × 2^8 × 2^4 × 2^2) mod 6779
// = 4521 (computed via repeated squaring)

// User sees:
// 🔑 Обчислено публічний ключ Y_B = α^k_B mod p
//    Y_B = 2^5678 mod 6779 = 4521

// ═══════════════════════════════════════════════════════════════
// STEP 10: CLIENT COMPUTES SHARED SECRET
// ═══════════════════════════════════════════════════════════════

setTimeout(() => {
  setStep(5);

  // Compute shared secret: K_AB = Y_A^K_B mod p
  const sharedSecret = modPow(publicKeyA, clientSecretKey, primeNumber);
  // K_AB = 5333^5678 mod 6779 = 3456

  addLog(`💎 Обчислено спільний секрет K_AB = Y_A^k_B mod p`);
  addLog(`   K_AB = ${publicKeyA}^${clientSecretKey} mod ${primeNumber} = ${sharedSecret}`);

  // Display in UI (green box - SHARED SECRET)
  document.getElementById('shared-secret').textContent = sharedSecret;

  // Automatically send public key to server
  setTimeout(() => {
    sendPublicKey();
  }, 500);
}, 500);

// Mathematical verification:
// K_AB = Y_A^K_B mod p
//      = (α^K_A)^K_B mod p
//      = (2^1234)^5678 mod 6779
//      = 2^(1234 × 5678) mod 6779
//      = 2^7006652 mod 6779
//      = 3456

// User sees:
// 💎 Обчислено спільний секрет K_AB = Y_A^k_B mod p
//    K_AB = 5333^5678 mod 6779 = 3456

// ═══════════════════════════════════════════════════════════════
// STEP 11: CLIENT SENDS PUBLIC KEY TO SERVER
// ═══════════════════════════════════════════════════════════════

function sendPublicKey() {
  setStep(6);

  addLog('📤 Відправка публічного ключа Y_B користувачу A...');
  addLog(`   Y_B = ${clientPublicKey}`);

  // Send via WebSocket
  socket.emit('sendPublicKeyB', {
    publicKeyB: 4521
  });
}

// Transmitted data:
// { publicKeyB: 4521 }

// 🔓 This is sent over network - Eve can see it!
// But Eve still cannot compute K_AB without K_A or K_B

// ═══════════════════════════════════════════════════════════════
// STEP 12: SERVER RECEIVES PUBLIC KEY AND COMPUTES SHARED SECRET
// ═══════════════════════════════════════════════════════════════

// Backend (gateaway.ts)
@SubscribeMessage('sendPublicKeyB')
receivePublicKeyB(
  @MessageBody() data: { publicKeyB: number },
  @ConnectedSocket() client: Socket
) {
  // Retrieve session data
  const session = this.sessions.get(client.id);
  // session = {
  //   primeNumber: 6779,
  //   alpha: 2,
  //   secretKey: 1234,
  //   publicKey: 5333
  // }

  const { publicKeyB } = data;
  // publicKeyB = 4521

  // Compute shared secret: K_AB = Y_B^K_A mod p
  const sharedSecretA = modPow(
    publicKeyB,
    session.secretKey,
    session.primeNumber
  );
  // K_AB = 4521^1234 mod 6779 = 3456

  this.logger.log(
    `Computed shared secret A: K_AB = ${sharedSecretA} from Y_B=${publicKeyB}`
  );

  // Mathematical verification:
  // K_AB = Y_B^K_A mod p
  //      = (α^K_B)^K_A mod p
  //      = (2^5678)^1234 mod 6779
  //      = 2^(5678 × 1234) mod 6779
  //      = 2^7006652 mod 6779
  //      = 3456
  //
  // Same result as client! ✓

  // Send confirmation to client
  client.emit('sharedSecretComputed', {
    message: 'Shared key successfully sent!',
    sharedSecret: 3456,
    details: {
      primeNumber: 6779,
      alpha: 2,
      publicKeyA: 5333,
      publicKeyB: 4521
    }
  });
}

// ═══════════════════════════════════════════════════════════════
// STEP 13: CLIENT RECEIVES CONFIRMATION AND VERIFIES
// ═══════════════════════════════════════════════════════════════

socket.on('sharedSecretComputed', (data) => {
  addLog('🎉 Отримано підтвердження від користувача A');
  addLog(`💎 Спільний секрет (від A): ${data.sharedSecret}`);

  setStep(7);

  // Get locally computed secret
  const localSecret = parseInt(
    document.getElementById('shared-secret').textContent
  );
  // localSecret = 3456

  const serverSecret = data.sharedSecret;
  // serverSecret = 3456

  // Compare!
  if (localSecret === serverSecret) {
    addLog('✅ УСПІХ! Спільні секрети співпадають!');
    addLog(`   K_AB = ${localSecret}`);

    // Show success message
    document.getElementById('verification-result').innerHTML =
      '<div class="alert alert-success">' +
      '✅ УСПІХ! Спільні секрети співпадають! ' +
      'Протокол Діффі-Хелмана виконано успішно.' +
      '</div>';
  } else {
    addLog('❌ ПОМИЛКА! Спільні секрети НЕ співпадають!');
    addLog(`   K_AB (B) = ${localSecret}`);
    addLog(`   K_AB (A) = ${serverSecret}`);

    // Show error message
    document.getElementById('verification-result').innerHTML =
      '<div class="alert alert-error">' +
      '❌ ПОМИЛКА! Спільні секрети НЕ співпадають!' +
      '</div>';
  }
});

// ═══════════════════════════════════════════════════════════════
// FINAL STATE
// ═══════════════════════════════════════════════════════════════

// Server knows:
//   - K_AB = 3456 (computed from Y_B^K_A mod p)
//   - K_A = 1234 (secret, never transmitted)
//   - Y_A = 5333 (public, transmitted)
//   - Y_B = 4521 (received from client)

// Client knows:
//   - K_AB = 3456 (computed from Y_A^K_B mod p)
//   - K_B = 5678 (secret, never transmitted)
//   - Y_B = 4521 (public, transmitted)
//   - Y_A = 5333 (received from server)

// Eve (eavesdropper) knows:
//   - p = 6779
//   - α = 2
//   - Y_A = 5333
//   - Y_B = 4521
//
//   But CANNOT determine:
//   - K_A (would need to solve: 5333 = 2^K_A mod 6779)
//   - K_B (would need to solve: 4521 = 2^K_B mod 6779)
//   - K_AB (would need K_A or K_B)

// ✅ Protocol complete!
// ✅ Shared secret established: K_AB = 3456
// ✅ Can now use K_AB for symmetric encryption (AES, ChaCha20, etc.)
```

---

## 🎓 Educational Summary

### Key Takeaways

1. **The Magic**: Two parties can agree on a secret without ever transmitting it

2. **The Math**: Based on the hardness of discrete logarithm problem
   - Easy: α^x mod p (compute power)
   - Hard: Given α^x mod p, find x (reverse power)

3. **The Process**:
   - Agree on public parameters (p, α)
   - Each generates secret key (K_A, K_B)
   - Each computes public key (Y_A, Y_B)
   - Exchange public keys
   - Each computes shared secret (K_AB)

4. **The Security**:
   - Eavesdropper sees: p, α, Y_A, Y_B
   - Eavesdropper needs: K_A or K_B
   - Computing K_A from Y_A is computationally infeasible

5. **The Applications**:
   - TLS/SSL (HTTPS websites)
   - VPNs (secure tunnels)
   - SSH (secure shell)
   - Signal Protocol (end-to-end encryption)
   - Bitcoin (ECDH variant)

### What You Learned

✅ **Cryptography Concepts**:
- Public-key cryptography
- Discrete logarithm problem
- Modular arithmetic
- Prime number generation
- Primitive roots

✅ **Security Principles**:
- Computational security
- Forward secrecy
- Man-in-the-middle attacks
- Key validation

✅ **Implementation Skills**:
- Modular exponentiation
- Primality testing
- WebSocket communication
- Full-stack cryptographic protocol

---

## 🚀 Next Steps

### To Improve This Implementation:

1. **Security Hardening**:
   - Use `crypto.randomBytes()` instead of `Math.random()`
   - Implement Miller-Rabin primality test
   - Add public key validation
   - Use larger primes (2048+ bits)

2. **Add Authentication**:
   - Implement digital signatures
   - Use certificates (X.509)
   - Authenticated Diffie-Hellman

3. **Modern Alternatives**:
   - Elliptic Curve Diffie-Hellman (ECDH)
   - X25519 (modern, fast, secure)
   - Post-quantum key exchange (Kyber, NTRU)

4. **Use in Production**:
   - Never implement crypto yourself in production!
   - Use established libraries: libsodium, OpenSSL, Web Crypto API
   - This code is for EDUCATION ONLY

---

## 📚 Further Reading

### Books:
- "Understanding Cryptography" by Christof Paar
- "Cryptography Engineering" by Niels Ferguson
- "Applied Cryptography" by Bruce Schneier

### Papers:
- Original Diffie-Hellman paper (1976)
- "The Discrete Logarithm Problem" surveys
- NIST SP 800-56A (Key Establishment Schemes)

### Online Resources:
- Computerphile YouTube videos on Diffie-Hellman
- Coursera Cryptography course
- Khan Academy Modular Arithmetic

---

## ✨ Conclusion

Diffie-Hellman Key Exchange is a beautiful example of how mathematics can solve real-world security problems. It transforms the impossible task of securely sharing a secret over an insecure channel into a practical reality used billions of times per day across the internet.

The elegance lies in its simplicity: using basic arithmetic operations (exponentiation and modulo) combined with the computational hardness of the discrete logarithm problem, two parties can compute a shared secret that an eavesdropper—even with full visibility of the exchange—cannot determine.

**Remember**: This implementation is educational. For production use, always rely on well-tested, peer-reviewed cryptographic libraries maintained by security experts.

---

*"In cryptography, we trust math, not magic."* 🔐
