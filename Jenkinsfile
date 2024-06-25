pipeline {
    agent any

    tools {
        nodejs 'node16'        
    }

    environment {       
        BUCKET_NAME=" "
        API_GATEWAY=" "
        API_KEY=" "
        API_GATEWAY_AUTH=" "
        API_KEY_AUTH=" "

    }

    options {
        buildDiscarder(logRotator(numToKeepStr: '5'))
    }

    stages {
        stage('Preparation') {
            steps {
                echo 'Proceso de Preparación..............'
                cleanWs()
                 git branch: '${BRANCH_SGCO}', credentialsId: 'jenkins-gitbb', url: 'https://Ingenieria_Klap@bitbucket.org/multicaja-cloud/mcf-bo-sgc-contracargos.git'
                 //git branch: 'master', credentialsId: 'jenkins-gitbb', url: 'https://bitbucket.org/multicaja-cloud/mcf-bo-sgc-contracargos.git'
                
               
            }
        }

        stage('Backup') {
           steps {
                echo 'Respaldo del proyecto......'                          
                 withCredentials([aws(accessKeyVariable: 'AWS_ACCESS_KEY_ID', credentialsId: 'DESPLIEGUES-AWS-SGCO', secretKeyVariable: 'AWS_SECRET_ACCESS_KEY')]) {
                        sh '''
                            SECRET_VALUE=$(aws secretsmanager get-secret-value --secret-id ${SECRET_MANAGER} --region $AWS_DEFAULT_REGION --query SecretString --output text)                        
                                API_GATEWAY=$(echo $SECRET_VALUE | jq -r '.apigateway')
                                API_KEY=$(echo $SECRET_VALUE | jq -r '.apikey')
                                API_GATEWAY_AUTH=$(echo $SECRET_VALUE | jq -r '.apigatewayauth')
                                API_KEY_AUTH=$(echo $SECRET_VALUE | jq -r '.apikeyauth')

                            envsubst < src/environments/ApisUrls-dev.ts > src/environments/ApisUrls.ts                            
                        '''           
                    }                     
            }
        }

        stage('Build'){
            steps{
                echo 'Construcción del Proyecto Microfront......'
                    sh 'npm install && npm run build'                    
                    
            }
        }

        stage('Analysis SonarQube') {           
            steps{
                    echo 'SonarQube......'
//                    script {
//                        scannerHome = tool 'sonar-scanner'
//                        }
//                        withSonarQubeEnv('sonar') {
//                            sh "${scannerHome}/bin/sonar-scanner -Dsonar.projectKey=${JOB_NAME} -Dsonar.sources=src/ -Dsonar.exclusions=src/assets/vendor/**"
//                   }
                }
        }   
        
        stage("Quality Gate") {
            steps{
                echo 'Validación de Calidad del Código'
                // timeout(time: 1, unit: 'HOURS') {
                //     waitForQualityGate abortPipeline: true
                // }
            }
        }

        stage('Testing') {
           steps {
                echo 'Pruebas Funcionales definidas por QA'
            }
        }

        stage('Deploy Infra') {
            steps {
                echo 'Despliegue Infra CloudFormation......'
                    withCredentials([aws(accessKeyVariable: 'AWS_ACCESS_KEY_ID', credentialsId: 'DESPLIEGUES-AWS-SGCO', secretKeyVariable: 'AWS_SECRET_ACCESS_KEY')]) {
                        // sh '''
                        //     SECRET_VALUE=$(aws secretsmanager get-secret-value --secret-id ${SECRET_MANAGER} --region $AWS_DEFAULT_REGION --query SecretString --output text)                        
                        //         BUCKET_NAME=$(echo $SECRET_VALUE | jq -r '.bucket_mcf_backoffice')
                            
                        //     aws cloudformation deploy \
                        //     --template-file ${WORKSPACE}/template.yaml \
                        //     --stack-name mcf-bo-sgc-backoffice \
                        //     --region $AWS_DEFAULT_REGION \
                        //     --capabilities CAPABILITY_NAMED_IAM \
                        //     --parameter-overrides \
                        //         BucketBackoffice=$BUCKET_NAME \
                        // '''           
                    }
            }
        }

        stage('Deploy Microfront') {
           steps {
                echo 'Despliegue del proyecto en Ambiente Desarrollo......'
                    withCredentials([aws(accessKeyVariable: 'AWS_ACCESS_KEY_ID', credentialsId: 'DESPLIEGUES-AWS-SGCO', secretKeyVariable: 'AWS_SECRET_ACCESS_KEY')]) {
                        sh '''       
                            SECRET_VALUE=$(aws secretsmanager get-secret-value --secret-id ${SECRET_MANAGER} --region $AWS_DEFAULT_REGION --query SecretString --output text)                        
                                BUCKET_NAME=$(echo $SECRET_VALUE | jq -r '.bucket_mcf_backoffice')

                            aws s3 rm s3://$BUCKET_NAME --recursive
                            aws s3 cp ${WORKSPACE}/dist/proyecto2 s3://$BUCKET_NAME --recursive
                        '''                       
                }
            }
        }        
    }
}   
