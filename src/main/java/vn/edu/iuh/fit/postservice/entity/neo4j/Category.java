package vn.edu.iuh.fit.postservice.entity.neo4j;

public enum Category {
    FOOD("Food category"),
    TRAVEL("Travel category"),
    TECHNOLOGY("Technology category"),
    FASHION("Fashion category"),
    SPORT("Sport category"),
    HEALTH("Health category"),
    EDUCATION("Education category"),
    ENTERTAINMENT("Entertainment category"),
    ANIMAL("Animal category"),
    CONTROVERSIAL("Controversial category"),
    OTHER("Other category");

    private final String description;

    Category(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }
}
