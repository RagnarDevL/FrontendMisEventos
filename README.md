# frontend

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

PASOS PARA INSTALAR FRONTEND:

Luego de tener en tu editor vas a la consola y ejecutas npm i para instalar las dependencias necesarias para la ejecución del proyecto.

si no ejecutamos desde el backend todos los contenedores juntos para ejecutar el del front vamos a  ejecutar docker-compose up -d para subir el contenedor de Frontend

Cuando se instale todo correctamente vas a ejecutar npm run serve y se levanta tu servicio con las rutas como en este ejemplo: 
  App running at:
  - Local:   http://localhost:8081/
  - Network: http://192.168.1.6:8081/
y en cualquiera de las dos rutas puedes ver tu front, pero el backen tiene allow_origins=["http://localhost:8081"], asi que mejor revisas en ese puerto el front para su correcta conexión con el backend.

