import org.junit.Test;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertThrows;

public class BinaryToDecimalConverterTest {

    BinaryToDecimalConverter converter = new BinaryToDecimalConverter();

    @Test
    public void testValidBinaryStrings() throws FormatException {
        assertEquals(0, converter.BinToDec("0"));
        assertEquals(1, converter.BinToDec("1"));
        assertEquals(10, converter.BinToDec("1010"));
        assertEquals(15, converter.BinToDec("1111"));
        assertEquals(1, converter.BinToDec("00000001"));
    }

    @Test
    public void testInvalidBinaryStrings() {
        assertThrows(FormatException.class, () -> converter.BinToDec("2"));
        assertThrows(FormatException.class, () -> converter.BinToDec("10a01"));
        assertThrows(FormatException.class, () -> converter.BinToDec("1234"));
        assertThrows(FormatException.class, () -> converter.BinToDec(""));
        assertThrows(FormatException.class, () -> converter.BinToDec("10 01"));
        assertThrows(FormatException.class, () -> converter.BinToDec("10@01"));
    }

    @Test
    public void testNullBinaryString() {
        assertThrows(FormatException.class, () -> converter.BinToDec(null));
    }
}
