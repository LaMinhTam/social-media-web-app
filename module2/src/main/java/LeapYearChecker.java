public class LeapYearChecker {
    static System.Logger logger = System.getLogger(LeapYearChecker.class.getName());
    public boolean IsLeapYear(int n) throws Exception {
        if (n < 1582) {
            throw new Exception("Invalid year, must be ≥ 1582");
        }
        if ((n % 4 == 0 && n % 100 != 0) || (n % 400 == 0)) {
            return true;
        }
        return false;
    }

    public static void main(String[] args) {
        LeapYearChecker checker = new LeapYearChecker();

        // Test cases
        int[] testCases = {1581, 1582, 1600, 1700, 1800, 1900, 2000, 2001, 1996, 2004};

        for (int testCase : testCases) {
            try {
                logger.log(System.Logger.Level.INFO, "Year: " + testCase + " -> Leap Year: " + checker.IsLeapYear(testCase));
            } catch (Exception e) {
                logger.log(System.Logger.Level.ERROR, "Year: " + testCase + " -> Exception: " + e.getMessage());
            }
        }
    }
}
