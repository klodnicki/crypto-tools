def remote = [:]
remote.name = 'gizmo'
remote.host = '127.0.0.1'
remote.allowAnyHosts = true

pipeline {
    agent any
    environment {
        CREDENTIALS = credentials('gizmo-ci-com-klodnicki-crypto-tools')
    }
    stages {
        stage('Setup') { steps { script {
            remote.user = env.CREDENTIALS_USR
            remote.identityFile = env.CREDENTIALS
            sh 'git clean -fd'
        } } }

        stage('Install dependencies') {
            steps {
                sh 'npm i';
            }
        }
        stage('Build') {
            environment {
                NODE_ENV = 'PRODUCTION'
            }
            steps { script {
                sh 'npm run pack';
            } }
        }

        stage('Prepare Deployment') {
            steps { script {
                sshCommand remote: remote, command: 'rm -rf app.new app.old'
                sshCommand remote: remote, command: 'mkdir app.new'
                sshPut remote: remote, from: 'crypto-tools.tgz', into: 'app.new'
                sshPut remote: remote, from: 'com-klodnicki-crypto-tools.service', into: 'app.new'
                sshCommand remote: remote, command: '''
                    cd app.new &&
                    npm i crypto-tools.tgz &&
                    rm crypto-tools.tgz &&
                    mkdir -p ~/.config/systemd/user/ &&
                    mv com-klodnicki-crypto-tools.service ~/.config/systemd/user/com-klodnicki-crypto-tools.service
                '''
            } }
        }

        stage('Deploy') {
            steps { script {
                sshCommand remote: remote, command: '''
                    mkdir -p app &&
                    mv app app.old &&
                    mv app.new app &&
                    systemctl --user daemon-reload &&
                    systemctl --user restart com-klodnicki-crypto-tools
                '''
            } }
        }

        stage('Clean Up') {
            steps { script {
                sshCommand remote: remote, command: '''
                    rm -rf app.old
                '''
            } }
        }
    }
    post {
        unsuccessful {
            emailext attachLog: false, to: '6098701141@msg.fi.google.com', subject: "", body: "Jenkins: ${env.JOB_NAME}:${env.BUILD_DISPLAY_NAME} unsuccessful!"
        }
    }
}
