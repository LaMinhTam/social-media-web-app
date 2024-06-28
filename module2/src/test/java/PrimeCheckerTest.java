import org.junit.Test;

import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

public class PrimeCheckerTest {

    PrimeChecker checker = new PrimeChecker();

    @Test
    public void testValidPrimeNumbers() throws Exception {
        assertTrue(checker.primeCheck(2));
        assertTrue(checker.primeCheck(997));
    }

    @Test
    public void testValidNonPrimeNumbers() throws Exception {
        assertFalse(checker.primeCheck(0));
        assertFalse(checker.primeCheck(1));
        assertFalse(checker.primeCheck(4));
        assertFalse(checker.primeCheck(999));
        assertFalse(checker.primeCheck(1000));
    }

}
