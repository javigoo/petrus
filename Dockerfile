# Selecciona la imagen base
FROM node:latest

# Crea una carpeta de trabajo
WORKDIR /app

# Copia el archivo package.json a la carpeta de trabajo
COPY ./server/package.json .

# Instala las dependencias
RUN npm install

# Copia el resto de archivos a la carpeta de trabajo
COPY . .

# Expone el puerto 3000
EXPOSE 3000

# Ejecuta el servidor
CMD ["npm", "start", "--prefix", "/app/server"]
