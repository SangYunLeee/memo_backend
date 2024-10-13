pipeline {
  agent any

  environment {
    DOCKERHUB_CRED = credentials('DockerHub-sororiri')
    GIT_CRED = credentials('GitHub-sororiri')
    ARGOCD_CRED = credentials('ArgoCD-admin')
  }

  stages {
    stage('Clone Backend Repository') {
      steps {
        // Backend repository에서 코드 가져오기
        git branch: 'main', credentialsId: 'github-sororiri', url: 'https://github.com/SangYunLeee/memo_backend.git'
      }
    }

    stage('Build and Push Docker Image') {
      steps {
        // Docker 이미지 빌드 및 DockerHub에 푸시
        sh '''
          echo $DOCKERHUB_CRED_PSW | docker login -u $DOCKERHUB_CRED_USR --password-stdin
          docker build -t sororiri/memo-backend:$BUILD_NUMBER .
          docker push sororiri/memo-backend:$BUILD_NUMBER
          rm -rf ./*
        '''
      }
    }

    stage('Clone K8S YAML Repository and Update Image Tag') {
      steps {
        // Frontend repository 클론 후, 새로운 Docker 이미지 태그로 업데이트
        git branch: 'main', credentialsId: 'github-sororiri', url: 'https://github.com/SangYunLeee/memoBlog_cd.git'
        sh '''
          yq e ".backend.image.tag = \"$BUILD_NUMBER\"" -i values.yaml
          git config user.email "jenkins@example.com"
          git config user.name "Jenkins"
          git add .
          git commit -m "fix: IMAGE TAG 수정.  TAG 명: $BUILD_NUMBER"
          git push https://${GIT_CRED_USR}:${GIT_CRED_PSW}@github.com/SangYunLeee/memoBlog_cd.git main
        '''
      }
    }

    stage('ArgoCD Sync and Wait') {
      steps {
        // ArgoCD를 통해 배포 동기화 및 파드 준비 상태 대기
        sh '''
          argocd login argocd.entto.shop --username ${ARGOCD_CRED_USR} --password ${ARGOCD_CRED_PSW} --grpc-web
          argocd app sync memo-application
          argocd app wait memo-application --timeout 600
        '''
      }
    }
  }
}
