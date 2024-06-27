public class TriangleChecker {
    static System.Logger logger = System.getLogger(TriangleChecker.class.getName());

    public String Triangle(int a, int b, int c) {
        if (a <= 0 || b <= 0 || c <= 0) {
            logger.log(System.Logger.Level.ERROR, "Invalid input: Sides must be positive. Input: " + a + ", " + b + ", " + c);
            return "";
        }
        if (a + b <= c || a + c <= b || b + c <= a) {
            logger.log(System.Logger.Level.ERROR, "Invalid input: Not a triangle. Input: " + a + ", " + b + ", " + c);
            return "";
        }
        if (a == b && b == c) {
            return "Equilateral";
        }
        if (a == b || b == c || a == c) {
            return "Isosceles";
        }
        return "Scalene";
    }

    public static void main(String[] args) {
        TriangleChecker checker = new TriangleChecker();

        int[][] testCases = {{1, 1, 1}, {2, 2, 3}, {3, 4, 5}, {1, 1, 2}, {1, 2, 3}, {2, 2, 4}, {0, 1, 2}, {-1, 1, 2}, {1, -1, 2}, {1, 1, -2},};

        for (int[] testCase : testCases) {
            String result = checker.Triangle(testCase[0], testCase[1], testCase[2]);
            if (!result.isEmpty()) {
                logger.log(System.Logger.Level.INFO, "Input: " + testCase[0] + ", " + testCase[1] + ", " + testCase[2] + " -> " + result);
            }
        }
    }
}
