FROM openjdk:17-oracle
COPY ./target/service-registry-0.0.1-SNAPSHOT.jar service-registry-0.0.1-SNAPSHOT.jar
EXPOSE 8761
CMD ["java", "-jar", "service-registry-0.0.1-SNAPSHOT.jar"]