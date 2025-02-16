# Use an official OpenJDK runtime as a parent image
FROM openjdk:17 AS build

# Set the working directory
WORKDIR /app

# Copy Maven wrapper and pom.xml files first to leverage Docker cache
COPY pom.xml mvnw ./
COPY .mvn .mvn

# Run Maven to download dependencies
RUN ./mvnw dependency:go-offline

# Copy the remaining source code
COPY src ./src

# Build the application
RUN ./mvnw clean package -DskipTests

# Use a smaller runtime image for the final container
FROM openjdk:17
WORKDIR /app

# Copy the built JAR file from the previous stage
COPY --from=build /app/target/*.jar app.jar

# Expose the application's port
EXPOSE 8080

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
