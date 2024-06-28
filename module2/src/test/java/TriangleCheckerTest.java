import org.junit.Test;

import static org.junit.Assert.assertEquals;

public class TriangleCheckerTest {

    TriangleChecker checker = new TriangleChecker();

    @Test
    public void testEquilateralTriangle() {
        assertEquals("Equilateral", checker.Triangle(3, 3, 3));
        assertEquals("Equilateral", checker.Triangle(1, 1, 1));
    }

    @Test
    public void testIsoscelesTriangle() {
        assertEquals("Isosceles", checker.Triangle(2, 2, 3));
        assertEquals("Isosceles", checker.Triangle(3, 2, 2));
        assertEquals("Isosceles", checker.Triangle(2, 3, 2));
    }

    @Test
    public void testScaleneTriangle() {
        assertEquals("Scalene", checker.Triangle(3, 4, 5));
        assertEquals("Scalene", checker.Triangle(5, 6, 7));
    }

    @Test
    public void testInvalidTriangles() {
        assertEquals("", checker.Triangle(1, 1, 2));
        assertEquals("", checker.Triangle(1, 2, 3));
        assertEquals("", checker.Triangle(2, 2, 4));
        assertEquals("", checker.Triangle(0, 1, 2));
        assertEquals("", checker.Triangle(-1, 1, 2));
        assertEquals("", checker.Triangle(1, -1, 2));
        assertEquals("", checker.Triangle(1, 1, -2));
    }
}
