# ==============================================================================
# Build Stage
# ==============================================================================
FROM eclipse-temurin:21-jdk-jammy AS builder

WORKDIR /build

# Copy Maven wrapper and pom.xml first to take advantage of Docker layer caching
COPY .mvn/ .mvn/
COPY mvnw pom.xml ./

# Make wrapper executable
RUN chmod +x mvnw

# Download dependencies offline
RUN ./mvnw dependency:go-offline -B

# Copy source code and build production jar
COPY src/ ./src/
RUN ./mvnw clean package -DskipTests -B

# ==============================================================================
# Production Runtime Stage
# ==============================================================================
FROM eclipse-temurin:21-jre-jammy

LABEL maintainer="MeraMahan Platform Engineering <dev@meramahan.in>"
LABEL description="MeraMahan - Citizen Reporting & Community Awareness Platform Backend"

# Create a non-privileged application user and group
RUN addgroup --system meramahan && adduser --system --ingroup meramahan meramahan

WORKDIR /app

# Create upload directory and set ownership
RUN mkdir -p /app/uploads && chown -R meramahan:meramahan /app

# Copy built artifact from builder stage
COPY --from=builder --chown=meramahan:meramahan /build/target/meramahan-backend-1.0.0.jar /app/app.jar

USER meramahan

EXPOSE 8080

# Configure JVM tuning and execute jar
ENTRYPOINT ["java", \
    "-XX:+UseContainerSupport", \
    "-XX:MaxRAMPercentage=75.0", \
    "-Djava.security.egd=file:/dev/./urandom", \
    "-jar", "/app/app.jar"]
