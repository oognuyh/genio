FROM gradle:8.12-jdk21-alpine AS build

WORKDIR /app

COPY build.gradle settings.gradle gradle.properties lombok.config ./
COPY gradle ./gradle

RUN gradle dependencies --no-daemon

COPY src ./src
RUN gradle build -x test --no-daemon

FROM eclipse-temurin:21-jdk-alpine

WORKDIR /app

COPY --from=build /app/build/libs/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "/app/app.jar"]