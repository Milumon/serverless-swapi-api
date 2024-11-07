
# Serverless SWAPI API

Este proyecto proporciona una API REST que interactúa con los datos de vehículos de la API SWAPI y los almacena en una base de datos DynamoDB utilizando el framework Serverless.

## Requisitos previos

- Node.js v14 o superior
- AWS CLI configurado con un perfil de IAM con los permisos detallados a continuación
- Serverless Framework instalado (`npm install -g serverless`)

## Instalación

1. Clona este repositorio:

   ```bash
   git clone https://github.com/Milumon/serverless-swapi-api.git
   cd serverless-swapi-api
   ```

2. Instala las dependencias:

   ```bash
   npm install
   ```

## Configuración de entorno

Crea archivos `.env` para cada entorno (dev, staging, prod) en el directorio raíz del proyecto:

- `.env.dev`
- `.env.staging`
- `.env.prod`

Los archivos `.env` deben contener las siguientes variables:

```
SWAPI_BASE_URL=https://swapi.py4e.com/api
DB_TABLE=VehiclesTable
AWS_REGION=us-east-1
```

## Despliegue y ejecución en modo desarrollo

Antes de ejecutar en modo desarrollo, debes realizar un despliegue inicial para crear los recursos en AWS:

```bash
npm run deploy:dev
```

Luego, inicia el modo desarrollo:

```bash
npm run start:dev
```

## Pruebas

Para ejecutar las pruebas, utiliza:

```bash
npm run test
```

Para ejecutar las pruebas en modo watch:

```bash
npm run test:watch
```

## Despliegue

Despliegue a entornos específicos:

- Desarrollo: `npm run deploy:dev`
- Staging: `npm run deploy:staging`
- Producción: `npm run deploy:prod`

Eliminar los recursos:

- Desarrollo: `npm run remove:dev`
- Producción: `npm run remove:prod`
 
## Endpoints

| Method | Endpoint                | Description                         |
|--------|--------------------------|------------------------------------|
| GET    | `/dev/vehicles`         | Obtiene todos los vehículos.        |
| GET    | `/dev/vehicles/{id}`    | Obtiene un vehículo por ID.         |
| POST   | `/dev/vehicles`         |  Crea un nuevo vehículo.            |

 

### Ejemplo de cuerpo para POST

```json
{
    "id": "11",
    "nombre": "Sand Crawsar",
    "modelo": "Digger Crawler",
    "clase_vehiculo": "wheeled",
    "fabricante": "Corellia Mining Corporation",
    "longitud": "36.8",
    "costo_en_creditos": "150000",
    "tripulacion": "46",
    "pasajeros": "30",
    "velocidad_maxima": "30",
    "capacidad_carga": "50000",
    "consumibles": "2 months",
    "peliculas": [
        "https://swapi.py4e.com/api/films/1/",
        "https://swapi.py4e.com/api/films/5/"
    ],
    "pilotos": []
}
```

## Permisos IAM requeridos

El rol de IAM debe tener permisos para:

- Acceder y manipular tablas de DynamoDB.
- Ejecutar funciones Lambda.
- Utilizar CloudFormation para desplegar los recursos.

### Ejemplo de política de permisos

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "dynamodb:PutItem",
        "dynamodb:GetItem",
        "dynamodb:Scan"
      ],
      "Resource": "arn:aws:dynamodb:us-east-1:<YOUR_ACCOUNT_ID>:table/VehiclesTable"
    },
    {
      "Effect": "Allow",
      "Action": "lambda:*",
      "Resource": "*"
    },
    {
      "Effect": "Allow",
      "Action": "cloudformation:*",
      "Resource": "*"
    }
  ]
}
```

## Notas adicionales

- Asegúrate de tener las credenciales de AWS configuradas y con permisos adecuados para realizar las operaciones en los entornos especificados. 

