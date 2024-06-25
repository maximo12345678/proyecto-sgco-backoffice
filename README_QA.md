# Pipeline de Despliegue y Pruebas de Microfront con Node.js y Angular

Este repositorio contiene un Jenkins Pipeline diseñado para automatizar el proceso de despliegue, construcción, análisis y pruebas de un proyecto de Microfront utilizando Node.js y Angular. El pipeline se compone de los siguientes pasos:

## Pasos del Pipeline

### 1. Preparation

En esta etapa se realizan las siguientes tareas:

- Se limpia el espacio de trabajo actual.
- Se clona el repositorio [mcf-bo-sgc-contracargos](https://bitbucket.org/multicaja-cloud/mcf-bo-sgc-contracargos.git) desde Bitbucket, rama: master.

### 2. Backup

En esta etapa se realiza un respaldo del proyecto:

- [Agrega aquí cualquier comando o script específico para el respaldo del proyecto.]

### 3. Build

En esta etapa se construye el proyecto de Microfront:

- Se utiliza Node.js versión 18.16.0.
- Se ejecuta `npm install` para instalar las dependencias.
- Se ejecuta `npm run build` para construir el proyecto.

### 4. Analysis SonarQube

En esta etapa se realiza el análisis del código utilizando SonarQube:

- Se utiliza SonarQube Scanner versión 4.8.0.2856.
- Se define el proyecto en SonarQube utilizando el nombre del pipeline.
- Se ejecuta el análisis utilizando las fuentes en `src/` y excluyendo `src/assets/vendor/**`.

### 5. Quality Gate

En esta etapa se valida la calidad del código:

- [Agrega aquí cualquier comando o script específico para la validación de calidad del código.]

### 6. Testing

En esta etapa se ejecutan pruebas funcionales definidas por QA:

- [Agrega aquí cualquier comando o script específico para las pruebas funcionales.]

### 7. Deploy Infra

En esta etapa se despliega la infraestructura utilizando AWS CloudFormation:

- Se utiliza el archivo `template.yaml` del espacio de trabajo.
- Se crea un stack de CloudFormation llamado `mcf-bo-sgc-stack`.
- Se utiliza la capacidad `CAPABILITY_NAMED_IAM` para permitir la creación de recursos con políticas de IAM.

### 8. Deploy Microfront

En esta etapa se despliega el proyecto en el entorno de desarrollo utilizando AWS S3:

- Se elimina el contenido existente en `s3://comercio.sgco.cl` y se copia el contenido de `${WORKSPACE}/dist/proyecto2`.
- Se elimina el contenido existente en `s3://backoffice.sgco.cl` y se copia el contenido de `${WORKSPACE}/dist/proyecto2`.

## Notificaciones

El pipeline envía notificaciones a Microsoft Teams en caso de éxito o fallo:

### Éxito

- Proyecto: KLAP: Sistema Gestión Contracargo
- Pipeline: [Nombre del pipeline]
- Infraestructura: Microfront - NodeJs + Angular
- Nro. de Ejecución: [Número de ejecución]
- Estado: Success

### Fallo

- Proyecto: KLAP: Sistema Gestión Contracargo
- Pipeline: [Nombre del pipeline]
- Infraestructura: Microfront - NodeJs + Angular
- Nro. de Ejecución: [Número de ejecución]
- Estado: Failure

## Configuración de Credenciales

El pipeline utiliza las siguientes credenciales almacenadas en Jenkins:

- `jenkins-gitbb` para acceder al repositorio en Bitbucket.
- `aws-creds-dev-evolution` para acceder a AWS para desplegar CloudFormation y copiar archivos a S3.

## Uso

1. Clona este repositorio en tu instancia de Jenkins.
2. Crea las credenciales necesarias en Jenkins para `jenkins-gitbb` y `aws-creds-dev-evolution`.
3. Ajusta las rutas de archivos, nombres de recursos, comandos y herramientas según tu configuración.
4. Ejecuta el pipeline y sigue el progreso en la consola de Jenkins.

Este pipeline automatizado simplifica el proceso de despliegue, construcción, análisis y pruebas de tu proyecto de Microfront utilizando Node.js y Angular.

---

Asegúrate de reemplazar `[Nombre del pipeline]` y `[Número de ejecución]` con los valores reales en las notificaciones. Además, ajusta cualquier otra información específica que necesites agregar.
