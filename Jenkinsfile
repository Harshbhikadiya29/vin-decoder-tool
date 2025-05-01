pipeline {
    agent any

    environment {
        AWS_REGION = 'us-east-1'
        AWS_ACCOUNT_ID = '533267365758' // <-- your AWS Account ID
        FRONTEND_REPO = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/vin-frontend"
        BACKEND_REPO = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/vin-backend"
        AWS_ACCESS_KEY_ID = credentials('AWS_ACCESS_KEY_ID')
        AWS_SECRET_ACCESS_KEY = credentials('AWS_SECRET_ACCESS_KEY')
        IMAGE_TAG = "${env.BUILD_NUMBER}"
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/endevii/vin-decoder-tool.git'
            }
        }

        stage('Install Dependencies') {
          steps {
              sh '''
              curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
              sudo apt-get install -y nodejs
              node -v
              npm -v
              '''

              dir('frontend') {
                  sh 'npm ci'
              }
              dir('backend') {
                  sh 'npm ci'
              }
          }
        }

        stage('Run Tests') {
            steps {
                dir('frontend') {
                    sh 'npm test'
                }
                dir('backend') {
                    sh 'npm test'
                }
            }
        }

        stage('Run Security Checks') {
            steps {
                sh '''
                sudo apt-get update && sudo apt-get install -y wget
                wget -q https://github.com/aquasecurity/trivy/releases/latest/download/trivy_0.62.0_Linux-64bit.deb
                sudo dpkg -i trivy_0.51.1_Linux-64bit.deb
                '''

                sh 'docker build -t frontend ./frontend'
                sh 'docker build -t backend ./backend'

                sh 'trivy image --exit-code 1 --severity HIGH,CRITICAL frontend'
                sh 'trivy image --exit-code 1 --severity HIGH,CRITICAL backend'
            }
        }

        stage('Login to ECR') {
            steps {
                sh """
                aws ecr get-login-password --region "$AWS_REGION" | \
                docker login --username AWS --password-stdin "$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com"
                """
            }
        }

        stage('Tag & Push Images') {
            steps {
                sh """
                docker tag frontend:latest $FRONTEND_REPO:$IMAGE_TAG
                docker tag frontend:latest $FRONTEND_REPO:latest
                docker push $FRONTEND_REPO:$IMAGE_TAG
                docker push $FRONTEND_REPO:latest

                docker tag backend:latest $BACKEND_REPO:$IMAGE_TAG
                docker tag backend:latest $BACKEND_REPO:latest
                docker push $BACKEND_REPO:$IMAGE_TAG
                docker push $BACKEND_REPO:latest
                """
            }
        }

        stage('Deploy to ECS') {
            steps {
                sh """
                aws ecs update-service --cluster vin-app-cluster \
                --service frontend --force-new-deployment --region "$AWS_REGION"

                aws ecs update-service --cluster vin-app-cluster\
                --service backend --force-new-deployment --region "$AWS_REGION"
                """
            }
        }

        stage('Cleanup') {
            steps {
                sh 'docker rmi frontend backend || true'
            }
        }
    }


    post {
        failure {
            echo 'Build or security check failed. Deployment aborted.'
        }
        success {
            echo 'All checks passed and deployment successful.'
        }
    }
}
