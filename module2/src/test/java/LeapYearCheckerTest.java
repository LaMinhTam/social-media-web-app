import org.junit.Test;

import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

public class LeapYearCheckerTest {

    LeapYearChecker checker = new LeapYearChecker();

    @Test
    public void testValidLeapYears() throws Exception {
        assertTrue(checker.IsLeapYear(1600));
        assertTrue(checker.IsLeapYear(2000));
        assertTrue(checker.IsLeapYear(1996));
        assertTrue(checker.IsLeapYear(2004));
    }

    @Test
    public void testValidNonLeapYears() throws Exception {
        assertFalse(checker.IsLeapYear(1700));
        assertFalse(checker.IsLeapYear(1800));
        assertFalse(checker.IsLeapYear(1900));
        assertFalse(checker.IsLeapYear(2001));
    }

}
