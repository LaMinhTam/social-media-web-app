# 🚀 ChatApp

Real-time social media web app with WebSocket, Microservices, RabbitMQ, Redis, and WebFlux for scalable and interactive communication. 🌐💬

## Introduction

ChatApp is a real-time social media web application built with a microservices architecture to enable interactive communication at scale. Utilizing WebSocket for real-time messaging, RabbitMQ for message brokering, and Redis for data caching, the app ensures responsive and efficient communication between users. It is developed using Java, Spring Boot, and various modern technologies to provide a robust and scalable solution.

## Prerequisites

Before setting up and running the application, ensure you have the following installed and configured:

- Java Development Kit (JDK) 17 or higher installed.
- Build tool (e.g., Maven or Gradle) installed.
- A database system (MySQL, MongoDB, Neo4j) set up and configured.
- Redis server for caching.
- RabbitMQ server for message brokering.

## Features

- **Real-time Messaging:** Interactive communication with WebSocket for instant messaging between users.
- **Microservices Architecture:** Built to scale with separate services managing distinct features.
- **Message Brokering with RabbitMQ:** Ensures reliable communication between services.
- **Data Caching with Redis:** Boosts performance and reduces load on the database.
- **Scalability:** Built with scalability in mind, leveraging Spring WebFlux for asynchronous, non-blocking web applications.
- **Database Flexibility:** Support for various databases such as MySQL, MongoDB, and Neo4j.

## Getting Started

Follow these steps to set up and run the ChatApp on your local machine.

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/social-media-web-app.git
cd social-media-web-app/SocialMediaBE
```

### 2. Build the Project

```bash
mvn clean install
```

### 3. Configure the Database

- Update the application.properties or application.yml file with your database connection details:

### 4. Run the Application

You can run the application using Maven:

```bash
mvn spring-boot:run
```

Alternatively, you can use Docker Compose for containerized deployment:

```bash
docker-compose up
```

## Technologies Used

- `Java`: The primary programming language for the application.
- `Spring Boot`: Framework for building Java-based enterprise applications.
- `Maven`: Build tool for managing dependencies and building the project.
- `Database`: Choose and specify the database system used (e.g., MySQL, MongoDB, Neo4J).
- `Redis`: Caching layer to improve performance and efficiency.
- `RabbitMQ`: Message broker for reliable communication between microservices.
- `WebSocket`: Real-time communication protocol for interactive messaging.
- `Spring WebFlux`: Framework for building asynchronous, non-blocking web applications.
