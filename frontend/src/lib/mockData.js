// Mock data used during Days 3-4 shell build.
// Replace with real api.js calls in Days 5-6.

export const MOCK_HISTORY = [
    {
        id: "1",
        language: "python",
        first_line: "def fibonacci(n):",
        created_at: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 min ago
    },
    {
        id: "2",
        language: "javascript",
        first_line: "const debounce = (fn, delay) => {",
        created_at: new Date(Date.now() - 1000 * 60 * 60).toISOString(), // 1 hr ago
    },
    {
        id: "3",
        language: "typescript",
        first_line: "interface ApiResponse<T> {",
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    },
    {
        id: "4",
        language: "go",
        first_line: "func mergeSort(arr []int) []int {",
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // yesterday
    },
    {
        id: "5",
        language: "rust",
        first_line: "fn binary_search<T: Ord>(arr: &[T], target: &T)",
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    },
];

export const MOCK_ANALYSIS = {
    explanation: `This function computes the nth Fibonacci number using dynamic programming (bottom-up memoization).

It initializes a dp array of size n+1, sets base cases dp[0] = 0 and dp[1] = 1, then fills each subsequent entry as the sum of the previous two. The final value dp[n] is returned.

This avoids the exponential stack depth of the naive recursive solution and instead solves the problem in a single linear pass over the array.`,

    complexity: {
        time: "O(n)",
        space: "O(n)",
        notes: `**Time — O(n):** The loop runs exactly n−1 iterations, one per subproblem.

**Space — O(n):** The dp array stores one value per index from 0 to n. This can be reduced to O(1) by tracking only the last two values instead of the full array.`,
    },

    refactor: `def fibonacci(n: int) -> int:
    """Return the nth Fibonacci number in O(n) time, O(1) space."""
    if n < 2:
        return n
    prev, curr = 0, 1
    for _ in range(2, n + 1):
        prev, curr = curr, prev + curr
    return curr`,
};

export const LANGUAGES = [
    "python",
    "javascript",
    "typescript",
    "go",
    "rust",
    "java",
    "c",
    "cpp",
    "csharp",
    "ruby",
];

export const LANGUAGE_LABELS = {
    python: "Python",
    javascript: "JavaScript",
    typescript: "TypeScript",
    go: "Go",
    rust: "Rust",
    java: "Java",
    c: "C",
    cpp: "C++",
    csharp: "C#",
    ruby: "Ruby",
};

export const DEFAULT_CODE = `def fibonacci(n):
    if n < 2:
        return n
    dp = [0] * (n + 1)
    dp[1] = 1
    for i in range(2, n + 1):
        dp[i] = dp[i - 1] + dp[i - 2]
    return dp[n]`;