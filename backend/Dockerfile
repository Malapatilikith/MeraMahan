
# Build Stage
FROM maven:3.9-eclipse-temurin-21 AS builder

WORKDIR /build

# Copy Maven project configuration
COPY pom.xml .

# Download dependencies
RUN mvn dependency:go-offline -B

# Copy source code and build the application
COPY src/ ./src/
RUN mvn clean package -DskipTests -B

# Production Runtime Stage
FROM eclipse-temurin:21-jre-jammy

WORKDIR /app

# Create a non-root user
RUN addgroup --system meramahan && adduser --system --ingroup meramahan meramahan

# Create upload directory
RUN mkdir -p /app/uploads && chown -R meramahan:meramahan /app

# Copy the packaged JAR
COPY --from=builder --chown=meramahan:meramahan /build/target/meramahan-backend-1.0.0.jar /app/app.jar

USER meramahan

EXPOSE 8080

ENTRYPOINT ["java", "-XX:+UseContainerSupport", "-XX:MaxRAMPercentage=75.0", "-Djava.security.egd=file:/dev/./urandom", "-jar", "/app/app.jar"]
