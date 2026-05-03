pipeline {
    agent any

    stages {
        stage('Clone Repo') {
            steps {
                checkout scm
            }
        }

        stage('Stop Old Containers') {
            steps {
                bat 'docker compose down'
            }
        }

        stage('Build & Run') {
            steps {
                bat 'docker compose up -d --build'
            }
        }
    }
}
