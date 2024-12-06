# Usa una imagen base de JDK para construir la aplicación
FROM eclipse-temurin:22-jdk AS build

# Establece el directorio de trabajo en el contenedor
WORKDIR /app

# Instala Maven
RUN apt-get update && apt-get install -y maven

# Copia los archivos necesarios para construir el proyecto
COPY pom.xml .
COPY src ./src

# Ejecuta Maven para compilar el proyecto
RUN mvn clean package -DskipTests

# Usa una imagen base más ligera para correr la aplicación
FROM eclipse-temurin:22-jre

# Establece el directorio de trabajo en el contenedor
WORKDIR /app

# Copia el archivo JAR construido desde la etapa de build
COPY --from=build /app/target/gateway-0.0.1-SNAPSHOT.jar app.jar

# Exponer el puerto del gateway
EXPOSE 8090

# Comando para ejecutar la aplicación
ENTRYPOINT ["java", "-jar", "app.jar"]
