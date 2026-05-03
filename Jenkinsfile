/**
 * Jenkinsfile — CI/CD Pipeline for Cipher Converter
 * 
 * Workflow: GitHub Push → Clone → Install → Test → Docker Build → Deploy
 * 
 * Prerequisites:
 *   - Docker & Docker Compose installed on Jenkins agent
 *   - Node.js 18+ available (or use Docker agent)
 *   - GitHub webhook configured to trigger this pipeline
 */

pipeline {
    agent any

    environment {
        DOCKER_COMPOSE_FILE = 'docker-compose.yml'
        AES_SECRET_KEY = credentials('aes-secret-key') // Jenkins credential ID
    }

    stages {
        // ─── Stage 1: Clone Repository ─────────────────────
        stage('Clone Repository') {
            steps {
                echo '📥 Cloning repository...'
                checkout scm
            }
        }

        // ─── Stage 2: Install Dependencies ─────────────────
        stage('Install Dependencies') {
            parallel {
                stage('Server Dependencies') {
                    steps {
                        echo '📦 Installing server dependencies...'
                        dir('server') {
                            sh 'npm ci'
                        }
                    }
                }
                stage('Client Dependencies') {
                    steps {
                        echo '📦 Installing client dependencies...'
                        dir('client') {
                            sh 'npm ci'
                        }
                    }
                }
            }
        }

        // ─── Stage 3: Run Tests ────────────────────────────
        stage('Run Tests') {
            steps {
                echo '🧪 Running server tests...'
                dir('server') {
                    sh 'npm test'
                }
            }
        }

        // ─── Stage 4: Build Docker Images ──────────────────
        stage('Build Docker Images') {
            steps {
                echo '🐳 Building Docker images...'
                sh "docker-compose -f ${DOCKER_COMPOSE_FILE} build --no-cache"
            }
        }

        // ─── Stage 5: Deploy Containers ────────────────────
        stage('Deploy Containers') {
            steps {
                echo '🚀 Deploying containers...'
                sh "docker-compose -f ${DOCKER_COMPOSE_FILE} down || true"
                sh "docker-compose -f ${DOCKER_COMPOSE_FILE} up -d"
            }
        }
    }

    post {
        success {
            echo '✅ Pipeline completed successfully! Application is deployed.'
        }
        failure {
            echo '❌ Pipeline failed. Check the logs for details.'
            // Cleanup on failure
            sh "docker-compose -f ${DOCKER_COMPOSE_FILE} down || true"
        }
        always {
            // Clean workspace
            cleanWs()
        }
    }
}
