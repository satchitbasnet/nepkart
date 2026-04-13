# Use Java 17 to match your tech stack
FROM eclipse-temurin:17-jdk-jammy
WORKDIR /app

# Copy your backend files
COPY . .

# Make the Maven wrapper executable and build the app
RUN chmod +x mvnw
RUN ./mvnw clean package -DskipTests

# Expose the port your Spring app uses
EXPOSE 8081

# Run the jar (server.port honors Render's PORT via application.properties)
ENTRYPOINT ["java", "-jar", "target/nepkart-backend-1.0.0.jar"]
