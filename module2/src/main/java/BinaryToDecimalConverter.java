public class BinaryToDecimalConverter {
    static System.Logger logger = System.getLogger(BinaryToDecimalConverter.class.getName());

    public long BinToDec(String sbin) throws FormatException {
        if (sbin == null || sbin.isEmpty()) {
            throw new FormatException("Input string is empty or null");
        }
        for (char c : sbin.toCharArray()) {
            if (c != '0' && c != '1') {
                throw new FormatException("Invalid character in binary string");
            }
        }
        return Long.parseLong(sbin, 2);
    }

    public static void main(String[] args) {
        BinaryToDecimalConverter converter = new BinaryToDecimalConverter();

        // Test cases
        String[] testCases = {"0", "1", "1010", "1111", "00000001", "2", "10a01", "1234", "", "10 01", "10@01"
        };

        for (String testCase : testCases) {
            try {
                long result = converter.BinToDec(testCase);
                logger.log(System.Logger.Level.INFO, "Binary: " + testCase + " -> Decimal: " + result);
            } catch (FormatException e) {
                logger.log(System.Logger.Level.ERROR, "Binary: " + testCase + " -> Exception: " + e.getMessage());
            }
        }
    }
}

class FormatException extends Exception {
    public FormatException(String message) {
        super(message);
    }
}
