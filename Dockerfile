# Étape 1: Build avec Maven
FROM maven:3.9-eclipse-temurin-21 AS build

WORKDIR /app

# Copier le fichier pom.xml et télécharger les dépendances
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copier le code source
COPY src ./src

# Build du jar
RUN mvn clean package -DskipTests

# Étape 2: Runtime avec JRE
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

# Créer un utilisateur non-root
RUN addgroup -S spring && adduser -S spring -G spring
USER spring:spring

# Copier le jar depuis l'étape de build
COPY --from=build /app/target/*.jar app.jar

# Exposer le port 8080
EXPOSE 8080

# Variables d'environnement
ENV JAVA_OPTS="-Xmx512m -Xms256m"
ENV SPRING_PROFILES_ACTIVE=production

# Démarrer l'application
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
