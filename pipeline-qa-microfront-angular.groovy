pipeline {
  agent any
  
  tools {
        nodejs "node"
  }

  environment {
    app = ""
   // WEBHOOK_TEAMS = "${HOOK_TEAMS_WPR}"
    REGISTRY = "registry.gitlab.com/multicaja-verticales"
    PROYECTO = "mcf-sop-af-ayc-ecommerce"
    URL_REPO_K8S = "https://bitbucket.org/multicaja-cloud/ms-multicaja-k8s-deploy-qa.git"
    NOMBRE_REPO_K8S = "ms-multicaja-k8s-deploy-qa"
    GRUPO_K8S = "-af"
    GIT_BRANCH = "qa"
    YAML_TEMPLATE = "ms-multicaja-pwa-generic.yaml"
    PREFIX = "mcf-sop-af-ayc-ecommerce"
    DIRECTORIO = "afiliacion-ecommerce"
    NAMESPACE = "ms-multicaja"
  }
  
  stages {
     stage('Preparation') {
      steps {
        cleanWs()
        git branch: 'qa', credentialsId: '2b9d008f-6c44-4353-9eba-cae07af15b7c', url: 'https://bitbucket.org/multicaja-cloud/mcf-sop-af-ayc-ecommerce.git'
        
        sh "cp ${config_file_manager}/config/k8s/${GIT_BRANCH}/${YAML_TEMPLATE} ${WORKSPACE}"
        sh "envsubst < ${YAML_TEMPLATE} > ${JOB_NAME}.yaml"
        
        script{
            GIT_URL = sh(returnStdout: true, script: 'git config --get remote.origin.url').trim().substring(8)
            GIT_HASH = sh(returnStdout: true, script: 'git rev-parse --short HEAD').trim()
        }          
      }
    }

    stage('Backup'){
        steps{
            script{
                int BUILD_ANTERIOR = env.BUILD_NUMBER.toInteger()-1;
                VERSION_BACKUP = BUILD_ANTERIOR;
                sh "git clone $URL_REPO_K8S"
                sh "mkdir -p ${JENKINS_HOME}/rollback_k8s/${JOB_NAME}/version-${VERSION_BACKUP}"
                sh "cp $NOMBRE_REPO_K8S/workloads$GRUPO_K8S/${JOB_NAME}.yaml ${JENKINS_HOME}/rollback_k8s/${JOB_NAME}/version-${VERSION_BACKUP} | true"
            }
        }
    }
    
    stage('Build'){
       steps{
            sh 'npm install && ng build -c qa --base-href /${PREFIX}/ --output-hashing none'
       }
    }
    
    stage('Sonar Analisis') {
        steps{
            script {
              scannerHome = tool 'sonar-scanner'
            }
            withSonarQubeEnv('sonar') {
                sh "${scannerHome}/bin/sonar-scanner -Dsonar.projectKey=${JOB_NAME} -Dsonar.sources=src/ -Dsonar.exclusions=src/assets/vendor/**"
            }
        }
    }
    
    stage("Quality Gate") {
        steps{
            timeout(time: 1, unit: 'HOURS') {
                    waitForQualityGate abortPipeline: true
            }
        }
    }
    
    stage('Docker image'){
       steps{
         sh "cp ${config_file_manager}/config/docker/Dockerfile-pwa-path ${WORKSPACE}"
         sh "cp ${config_file_manager}/config/docker/Dockerfile-pwa-path-nginx.conf ${WORKSPACE}"
         sh "envsubst < Dockerfile-pwa-path > Dockerfile"
         sh "envsubst < Dockerfile-pwa-path-nginx.conf > default.conf"
         script{  
            app = docker.build("$REGISTRY/$PROYECTO:v$BUILD_NUMBER-$GIT_BRANCH")
         }
       }
    }

    stage('Push image') {
      steps{
          script{
            docker.withRegistry('https://registry.gitlab.com/multicaja-verticales', '0520c99c-66fa-4218-9fea-c9f5627aa118') {
                app.push("v$BUILD_NUMBER-$GIT_BRANCH")
            }
          }
      }
    }
    
    stage('Remove image') {
      steps{
        sh "docker rmi $REGISTRY/$PROYECTO:v$BUILD_NUMBER-$GIT_BRANCH"
      }
    }
    
    stage('Update YAML'){
        steps{
            script{
                sh "cp ${JOB_NAME}.yaml $NOMBRE_REPO_K8S/workloads$GRUPO_K8S"
                    dir("$NOMBRE_REPO_K8S"){
                        sh "git config --global url.'git@bitbucket.org:'.insteadOf 'https://bitbucket.org/'"
                        sh "git add workloads$GRUPO_K8S/${JOB_NAME}.yaml"
                        sh "git commit -am '$PROYECTO:v$BUILD_NUMBER-$GIT_BRANCH'"
                        sh "git push"
                    }
            }
        }
    }

}

/*post {
    success {
      office365ConnectorSend webhookUrl: "${WEBHOOK_TEAMS}",
            color: '#00FF00',
            factDefinitions: [[name: "Pipeline", template: "${env.JOB_NAME}"],
            [name: "Nro. de Ejecución", template: "${env.BUILD_NUMBER}"]],
            status: "Success"  
    }

    failure {
       office365ConnectorSend webhookUrl: "${WEBHOOK_TEAMS}",
            color: '#FF0000',
            factDefinitions: [[name: "Pipeline", template: "${env.JOB_NAME}"],
            [name: "Nro. de Ejecución", template: "${env.BUILD_NUMBER}"]],
            status: "Failure"   
    }
}*/
}
