
pipeline {
    agent any

    options {
        timestamps()
        disableConcurrentBuilds()
        timeout(time: 60, unit: 'MINUTES')
    }

    environment {
        CI = 'true'
    }

    stages {
        stage('Environment Check') {
            steps {
                bat 'node --version'
                bat 'npm --version'
                bat 'git --version'
            }
        }

        stage('Install Dependencies') {
            steps {
                bat 'npm ci'
            }
        }

        stage('Install Playwright Browser') {
            steps {
                bat 'npx playwright install chromium'
            }
        }

        stage('Run Playwright Tests') {
            steps {
                bat 'npx playwright test --project=chromium --workers=1'
            }
        }
    }

    post {
        always {
            archiveArtifacts artifacts: 'playwright-report/**,test-results/**,allure-results/**',
                             allowEmptyArchive: true
        }
    }
}
