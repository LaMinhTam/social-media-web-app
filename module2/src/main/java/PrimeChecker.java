public class PrimeChecker {
    static System.Logger logger = System.getLogger(PrimeChecker.class.getName());
    public Boolean primeCheck(int num) throws Exception {
        if (num < 0 || num > 1000) {
            throw new Exception("Invalid input");
        }
        if (num <= 1) {
            return false;
        }
        for (int i = 2; i <= Math.sqrt(num); i++) {
            if (num % i == 0) {
                return false;
            }
        }
        return true;
    }

    public static void main(String[] args) {
        PrimeChecker checker = new PrimeChecker();

        int[] testCases = {0, 1, 2, 999, 1000, -1, 1001, 4, 997};

        for (int testCase : testCases) {
            try {
                logger.log(System.Logger.Level.INFO, "Input: " + testCase + " -> Prime: " + checker.primeCheck(testCase));
            } catch (Exception e) {
                logger.log(System.Logger.Level.ERROR, "Input: " + testCase + " -> Exception: " + e.getMessage());
            }
        }
    }
}
