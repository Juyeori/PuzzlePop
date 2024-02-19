# 목차
- [0. 서버 환경 설정](#0-서버-환경-설정)
    - [0.1 패키지 업데이트](#0-1-패키지-업데이트)
    - [0.2 서버 시간 변경](#0-2-서버-시간-변경)
    - [0.3 미러 서버 변경](#0-3-미러-서버-변경)
    - [0.4 가상 메모리 할당](#0-4-가상-메모리-할당)
- [1. Docker 설치](#1-docker-설치)
- [2. OpenVidu On-Premises 설치](#2-openvidu-on-premises-설치)
    - [2.1 방화벽 설정](#2-1-방화벽-설정)
    - [2.2 OpenVidu 설치](#2-2-openvidu-설치)
    - [2.3 .env 설정](#2-3-env-설정)
    - [2.4 OpenVidu 실행](#2-4-openvidu-실행)
- [3. NginX 설치](#3-nginx-설치)
    - [3.1 방화벽 설정](#3-1-방화벽-설정)
    - [3.2 NginX 설치](#3-2-nginx-설치)
    - [3.3 letsencrypt & Certbot 설치](#3-3-letsencrypt--certbot-설치)
    - [3.4 Certbot NginX 연결](#3-4-certbot-nginx-연결)
    - [3.5 NginX 설정](#3-5-nginx-설정)
- [4. MySQL 설치](#4-mysql-설치)
    - [4.1 방화벽 설정](#4-1-방화벽-설정)
    - [4.2 MySQL Server 설치](#4-2-mysql-server-설치)
    - [4.3 root 계정 비밀번호 설정](#4-3-mysql-root-계정-비밀번호-설정)
    - [4.4 root 계정 접속권한 변경](#4-4-mysql-root-계정-접속-권한-변경)
    - [4.5 MySQL 외부접속 허용](#4-5-mysql-외부-접속-허용)
    - [4.6 MySQL 새 계정 생성](#4-6-mysql-새-계정-생성)
- [5. Jenkins 설치](#5-jenkins-설치)
    - [5.1 Java 설치](#5-1-java-설치)
    - [5.2 Jenkins 설치](#5-2-jenkins-설치)
    - [5.3 Jenkins 포트번호 변경](#5-3-jenkins-포트번호-변경)
    - [5.4 Jenkins 접속](#5-4-jenkins-접속)
    - [5.5 Jenkins Plugin 설치](#5-5-jenkins-plugin-설치)
    - [5.6 Jenkins Pipeline Script](#5-6-jenkins-pipeline-scripts)

- [백엔드 포팅 메뉴얼](#백엔드-포팅-메뉴얼)
    - [1. 백엔드 설치](#1-백엔드-설치)
    - [2. 시작하기](#2-시작하기)
    - [3. 빌드하기](#3-빌드하기)
    - [4. 트러블슈팅](#4-트러블슈팅)
- [프론트엔드 포팅 메뉴얼](#프론트엔드-포팅-메뉴얼)
    - [1. IDE 설치](#1-ide-설치-vscode)
        - [VSCode 추천 익스텐션](#1-1-vscode-추천-익스텐션)
    - [2. 시작하기](#2-ec8b9cec9e91ed9598eab8b0-1)
        - [.env 파일 생성](#2-1-env-파일-생성)
        - [개발모드로 시작하기](#2-2-개발-모드로-시작하기)
        - [빌드하기](#2-3-빌드하기)
    - [3. 실행환경](#3-실행-환경)
    - [4. 주요 의존성](#4-주요-의존성-소개-및-버전)
        - [리액트](#리액트-관련)
        - [스타일](#스타일-관련)
        - [네트워크 통신](#외부-네트워크-통신-관련)
        - [퍼즐 이미지](#퍼즐-이미지-관련)
    - [5. 기타 스크립트](#5-그-외-스크립트)
    - [6. 트러블 슈팅](#6-트러블슈팅)

---

# EC2 서버 포팅 메뉴얼

## 0. 서버 환경 설정

### 0-1. 패키지 업데이트
```bash
$ sudo apt update
$ sudo add-apt-repository --remove ppa:certbot/certbot
```

### 0-2. 서버 시간 변경
```bash
$ sudo timedatectl set-timezone Asia/Seoul
$ date
```

### 0-3. 미러 서버 변경
- 서버 속도 증가
```bash
$ sudo vi/etc/apt/sources.list
$ :%s/kr.archive.ubuntu.com/mirror.kakao.com/
```

### 0-4. 가상 메모리 할당
- 메모리가 부족한 경우가 많음
- 보통 RAM의 절반정도 크기를 할당
```bash
$ free -h

$ sudo swapoff -v /swapfile        # swap 비활성
$ sudo fallocate -l 8G /swapfile    # swap 을 8GB 로 조정한 경우
$ sudo chmod 600 /swapfile        #권한 설정
$ sudo mkswap /swapfile        #swap file 만들기
$ sudo swapon /swapfile        #swap file 활성화 : 리부티하지 않아도 swap file이 활성화 된다.

$ sudo vi /etc/fstab        # /etc/fstab 을 열어서 내용 추가
swapfile none swap sw 0 0        # 내용 추가
$ free -h
```
[[맨 위로](#)]

## 1. Docker 설치

```linux
$ sudo apt-get update
$ sudo apt-get install apt-transport-https ca-certificates curl gnupg-agent software-properties-common
$ curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
$ sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
$ sudo apt-get update
$ sudo apt-get install docker-ce docker-ce-cli containerd.io
$ sudo systemctl status docker
```
[[맨 위로](#)]

## 2. OpenVidu On-Premises 설치

[[Reference](https://docs.openvidu.io/en/stable/deployment/ce/on-premises/)]: [OpenVidu Documents for On-Premises Install](https://docs.openvidu.io/en/stable/deployment/ce/on-premises/)

### 2-1. 방화벽 설정

```bash
$ sudo ufw allow 80/tcp
$ sudo ufw allow 443/tcp
$ sudo ufw allow 3478/tcp
$ sudo ufw allow 3478/udp
$ sudo ufw allow 40000:57000/tcp
$ sudo ufw allow 40000:57000/udp
$ sudo ufw allow 57001:65535/tcp
$ sudo ufw allow 57001:65535/udp
```

### 2-2. OpenVidu 설치

```bash
$ sudo mkdir opt
$ cd opt
$ sudo curl https://s3-eu-west-1.amazonaws.com/aws.openvidu.io/install_openvidu_latest.sh | bash
```
```bash
=======================================
Openvidu Platform successfully installed.
=======================================

1. Go to openvidu folder:
$ cd openvidu

2. Configure DOMAIN_OR_PUBLIC_IP and OPENVIDU_SECRET in .env file:
$ nano .env

3. Start OpenVidu
$ ./openvidu start

For more information, check:
https://docs.openvidu.io/en/stable/deployment/ce/on-premises/
```

### 2-3. `.env` 설정

```bash
$ cd openvidu
$ sudo nano .env
```
```bash
# OpenVidu configuration
# ----------------------
# Documentation: https://docs.openvidu.io/en/stable/reference-docs/openvidu-config/

# NOTE: This file doesn't need to quote assignment values, like most shells do.
# All values are stored as-is, even if they contain spaces, so don't quote them.

# Domain name. If you do not have one, the public IP of the machine.
# For example: 198.51.100.1, or openvidu.example.com
DOMAIN_OR_PUBLIC_IP=your_domain

# OpenVidu SECRET used for apps to connect to OpenVidu server and users to access to OpenVidu Dashboard
OPENVIDU_SECRET=YOUR_SECRET

# Certificate type:
# - selfsigned:  Self signed certificate. Not recommended for production use.
#                Users will see an ERROR when connected to web page.
# - owncert:     Valid certificate purchased in a Internet services company.
#                Please put the certificates files inside folder ./owncert
#                with names certificate.key and certificate.cert
# - letsencrypt: Generate a new certificate using letsencrypt. Please set the
#                required contact email for Let's Encrypt in LETSENCRYPT_EMAIL
#                variable.
CERTIFICATE_TYPE=letsencrypt

# If CERTIFICATE_TYPE=letsencrypt, you need to configure a valid email for notifications
LETSENCRYPT_EMAIL=youremail@example.com

# Proxy configuration
# If you want to change the ports on which openvidu listens, uncomment the following lines

# Allows any request to http://DOMAIN_OR_PUBLIC_IP:HTTP_PORT/ to be automatically
# redirected to https://DOMAIN_OR_PUBLIC_IP:HTTPS_PORT/.
# WARNING: the default port 80 cannot be changed during the first boot
# if you have chosen to deploy with the option CERTIFICATE_TYPE=letsencrypt
# HTTP_PORT=80 기본 접속 포트
HTTP_PORT=8082

# Changes the port of all services exposed by OpenVidu.
# SDKs, REST clients and browsers will have to connect to this port
# HTTPS_PORT=443 SSL 접속 포트
HTTPS_PORT=4443
```

### 2-4. OpenVidu 실행

```bash
$ ./openvidu start
```
```bash
Creating openvidu-docker-compose_coturn_1          ... done
Creating openvidu-docker-compose_app_1             ... done
Creating openvidu-docker-compose_kms_1             ... done
Creating openvidu-docker-compose_nginx_1           ... done
Creating openvidu-docker-compose_redis_1           ... done
Creating openvidu-docker-compose_openvidu-server_1 ... done
```
```bash
----------------------------------------------------

   OpenVidu Platform is ready!
   ---------------------------

   * OpenVidu Server: https://DOMAIN_OR_PUBLIC_IP:4443/

   * OpenVidu Dashboard: https://DOMAIN_OR_PUBLIC_IP:4443/dashboard/

----------------------------------------------------
```
[[맨 위로](#)]

## 3. NginX 설치

### 3-1. 방화벽 설정

```bash
$ sudo ufw enable
$ sudo ufw allow 80
$ sudo ufw allow 443
```

### 3-2. NginX 설치

```bash
$ sudo apt update
$ sudo apt install nginx -y
$ sudo vi /etc/nginx/sites-available/default
```
```bash
server {
    listen 80 default_server;
    listen [::]:80 default_server;

    server_name example.com www.example.com;

    location / {
        root /home/ubuntu/puzzlepop/deploy/dist;
        index index.html index.htm index.nginx-debian.html;
        try_files $uri $uri/ /index.html =404;
    }
}
```
```bash
$ sudo systemctl start nginx
```

### 3-3. letsencrypt & Certbot 설치
```bash
$ sudo apt-get install letsencrypt
$ sudo apt-get install certbot python3-certbot-nginx
```

### 3-4. Certbot NginX 연결
```bash
$ sudo certbot --nginx -d 도메인 이름 -d www.도메인 이름
$ sudo certbot --nginx
$ 이메일 입력
$ 약관 동의 - Y
$ 이메일 수신동의
$ 도메인 입력 - i10{팀코드}.p.ssafy.io
$ http 입력시 리다이렉트 여부 - 2
```

### 3-5. NginX 설정
```bash
$ sudo vi /etc/nginx/sites-available/default
```
```bash
    server_name i10a304.p.ssafy.io; # managed by Certbot

    location / {
        root /home/ubuntu/puzzlepop/deploy/dist;
        index index.html index.htm index.nginx-debian.html;
        try_files $uri $uri/ /index.html =404;
    }

    location /api/ {
    rewrite ^/api(.*)$ $1?$args break;
    proxy_pass http://localhost:8080/;
    proxy_redirect off;
    charset utf-8;

    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_set_header X-NginX-Proxy true;

    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    }
```
[[맨 위로](#)]

## 4. MySQL 설치

### 4-1. 방화벽 설정

```bash
$ sudo ufw enable
$ sudo ufw allow 3306
$ sudo ufw allow mysql
```

### 4-2. MySQL Server 설치

```bash
$ sudo apt update
$ sudo apt install mysql-server
$ sudo systemctl start mysql
```

### 4-3. MySQL root 계정 비밀번호 설정

```bash
$ sudo mysql -u root
$ mysql> ALTER USER 'root'@'localhost' IDENTIFIED BY '비밀번호';
$ mysql> FLUSH PRIVILEGES;
```

### 4-4 MySQL root 계정 접속 권한 변경
```bash
$ mysql> UPDATE user SET host='%' WHERE user='root' and host='localhost';
$ mysql> exit
```

### 4-5 MySQL 외부 접속 허용
```bash
$ sudo vi /etc/mysql/mysql.conf.d/mysqld.cnf
```
```bash
# bind-address            = 127.0.0.1 
bind-address            = 0.0.0.0
```
```bash
$ sudo systemctl restart mysql
```

### 4-6 MySQL 새 계정 생성
```bash
$ mysql -u root -p
$ mysql> CREATE USER 'new_user'@'localhost' IDENTIFIED BY 'user_password';
$ mysql> GRANT ALL PRIVILEGES ON *.* TO 'new_user'@'localhost' WITH GRANT OPTION;
$ mysql> exit
```
[[맨 위로](#)]

## 5. Jenkins 설치
[[Reference](https://www.jenkins.io/doc/book/installing/linux/#debianubuntu)]: [Jenkins Official Documents](https://www.jenkins.io/doc/book/installing/linux/#debianubuntu)  
[[Reference](https://gksdudrb922.tistory.com/195)]: https://gksdudrb922.tistory.com/195  

### 5-1. Java 설치

```bash
$ sudo apt-get update
$ sudo apt-get install openjdk-17-jdk
$ java --version
openjdk 17.0.9 2023-10-17
OpenJDK Runtime Environment (build 17.0.9+9-Ubuntu-120.04)
OpenJDK 64-Bit Server VM (build 17.0.9+9-Ubuntu-120.04, mixed mode, sharing)
```

### 5-2. Jenkins 설치

```bash
$ sudo wget -O /usr/share/keyrings/jenkins-keyring.asc \
  https://pkg.jenkins.io/debian-stable/jenkins.io-2023.key
$ echo deb [signed-by=/usr/share/keyrings/jenkins-keyring.asc] \
  https://pkg.jenkins.io/debian-stable binary/ | sudo tee \
  /etc/apt/sources.list.d/jenkins.list > /dev/null
$ sudo apt-get update
$ sudo apt-get install jenkins
$ sudo systemctl status jenkins
```

### 5-3. Jenkins 포트번호 변경
```bash
$ sudo ufw enable
$ sudo ufw allow 8081
$ sudo systemctl edit jenkins
[Service]
Environment="JENKINS_PORT=8081"
$ sudo systemctl restart jenkins
```

### 5-4. Jenkins 접속

- 비밀번호 확인
- Jenkins 접속
- 초기설정

```bash
$ sudo vi /var/lib/jenkins/secrets/initialAdminPassword
```
![alt text](https://www.jenkins.io/doc/book/resources/tutorials/setup-jenkins-02-copying-initial-admin-password.png)
![alt text](https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FbNYKks%2Fbtrp8ianI74%2FTrsqnNskUOvjcNQapC82J0%2Fimg.png)
![alt text](https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FbA3nVp%2Fbtrp7ivxnR2%2FfBrRqqmkru61Dmf8UwYaMk%2Fimg.png)
![alt text](https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FT1K4y%2Fbtrp7jOLekN%2F1fqJ15ttEiOyL0iYvkVFy1%2Fimg.png)


### 5-5. Jenkins Plugin 설치

- NodeJS
- GitLab
- GitLab API
- GitLab Authentication
- Generic WebhookTrigger

### 5-6. Jenkins Pipeline Scripts
```bash
// PuzzlePop-Pipeline-Backend
pipeline {
    agent any
    
    tools {
        gradle 'gradle'
    }
    
    stages {
        stage('Clone') {
            steps {
                echo 'Clone Start Gitlab Repository'
                
                git branch: 'develop',
                credentialsId: 'BACKEND_CREDENTIALS',
                url: 'https://lab.ssafy.com/s10-webmobile1-sub2/S10P12A304'
                
                echo 'Clone Success Gitlab Repository'
            }
        }
        
        stage('Build') {
            steps {
                echo 'Build Start Backend'
                
                dir('backend') {
                    sh 'chmod +x ./gradlew'
                    sh './gradlew clean build'
                }
                
                echo 'Build Success Backend'
            }
        }
        
        stage('Deploy') {
            steps {
                echo 'Deploy Start Backend'
                sh 'sudo chmod +w /home/ubuntu/puzzlepop/script/init_server.sh'
                sh 'sudo /home/ubuntu/puzzlepop/script/init_server.sh'
                
                // dir('backend') {
                    // sh 'sudo cp ./build/lib/puzzlepop-0.0.1-SNAPSHOT.jar /home/ubuntu/puzzlepop/deploy'
                    // sh 'sudo /home/ubuntu/puzzlepop/script/init_server.sh'
                // }
                
                echo 'Deploy Success Backend'
            }
        }   
    }
    post {
        success {
        	script {
                def Author_ID = sh(script: "git show -s --pretty=%an", returnStdout: true).trim()
                def Author_Name = sh(script: "git show -s --pretty=%ae", returnStdout: true).trim()
                mattermostSend (color: 'good', 
                message: "BE 빌드 성공: ${env.JOB_NAME} #${env.BUILD_NUMBER} by ${Author_ID}(${Author_Name})\n(<${env.BUILD_URL}|Details>)", 
                endpoint: 'https://meeting.ssafy.com/hooks/oa9dqd9jefrs9bgeum7e1ur5ka', 
                channel: 'a304-jenkins-notice'
                )
            }
        }
        failure {
        	script {
                def Author_ID = sh(script: "git show -s --pretty=%an", returnStdout: true).trim()
                def Author_Name = sh(script: "git show -s --pretty=%ae", returnStdout: true).trim()
                mattermostSend (color: 'danger', 
                message: "BE 빌드 실패: ${env.JOB_NAME} #${env.BUILD_NUMBER} by ${Author_ID}(${Author_Name})\n(<${env.BUILD_URL}|Details>)", 
                endpoint: 'https://meeting.ssafy.com/hooks/oa9dqd9jefrs9bgeum7e1ur5ka', 
                channel: 'a304-jenkins-notice'
                )
            }
        }
    }
}
```
```bash
// PuzzlePop-Pipeline-Frontend
pipeline {
    agent any
    
    tools {
        gradle 'gradle'
        nodejs 'nodejs'
    }
    
    stages {
        stage('Git Clone') {
            steps {
                echo 'Start Gitlab Repository Clone'
                
                git branch: 'develop',
                credentialsId: 'FRONTEND_CREDENTIALS',
                url: 'https://lab.ssafy.com/s10-webmobile1-sub2/S10P12A304'
                
                echo 'Success Gitlab Repository Clone'
            }
        }
        
        stage('Build Frontend') {
            steps {
                echo 'Build Start Frontend'
                
                dir('frontend') {
                    sh 'npm install'
                    sh 'npm run build'
                }
                
                echo 'Build Success Frontend'
            }
        }
        
        stage('Deploy Frontend') {
            steps {
                echo 'Deploy Start Frontend'
                
                dir('frontend') {
                    sh 'sudo cp -r dist /home/ubuntu/puzzlepop/deploy'
                    // sh 'sudo cp -r dist /home/ubuntu/temp'
                    // sh 'cp -r ./dist/* /var/www/html/'
                }
                
                echo 'Deploy Success Frontend'
            }
        }
    }
    post {
        success {
        	script {
                def Author_ID = sh(script: "git show -s --pretty=%an", returnStdout: true).trim()
                def Author_Name = sh(script: "git show -s --pretty=%ae", returnStdout: true).trim()
                mattermostSend (color: 'good', 
                message: "FE 빌드 성공: ${env.JOB_NAME} #${env.BUILD_NUMBER} by ${Author_ID}(${Author_Name})\n(<${env.BUILD_URL}|Details>)", 
                endpoint: 'https://meeting.ssafy.com/hooks/oa9dqd9jefrs9bgeum7e1ur5ka', 
                channel: 'a304-jenkins-notice'
                )
            }
        }
        failure {
        	script {
                def Author_ID = sh(script: "git show -s --pretty=%an", returnStdout: true).trim()
                def Author_Name = sh(script: "git show -s --pretty=%ae", returnStdout: true).trim()
                mattermostSend (color: 'danger', 
                message: "FE 빌드 실패: ${env.JOB_NAME} #${env.BUILD_NUMBER} by ${Author_ID}(${Author_Name})\n(<${env.BUILD_URL}|Details>)", 
                endpoint: 'https://meeting.ssafy.com/hooks/oa9dqd9jefrs9bgeum7e1ur5ka', 
                channel: 'a304-jenkins-notice'
                )
            }
        }
    }
}
```
[[맨 위로](#)]





# 백엔드 포팅 메뉴얼

## 1. 백엔드 설치

- SpringBoot 3.2.1
- Java Zulu 17.48.15
- IntelliJ IDE 2023.3.2
- MySQL workbench 8.0.20 (Windows 10)
- MySQL 8.0.30 (Ubuntu 20.04.2 LTS)

```bash
$ git clone https://lab.ssafy.com/s10-webmobile1-sub2/S10P12A304.git
$ cd S10P12A304/backend
```

## 2. 시작하기
- IntelliJ Open File or Project `/S10P12A304/backend`
- IntelliJ - Gradle - project - Tasks - application - bootRun

## 3. 빌드하기
- IntelliJ - Gradle - project - Tasks - build - bootJar

## 4. 트러블슈팅
- Dependency import 오류 발생 시
- IntelliJ - Gradle - Reload All Gradle Projects

[[맨 위로](#)]





# 프론트엔드 포팅 메뉴얼

---

## 1. IDE 설치 (vscode)

- 최신 버전의 [vscode를 설치](https://code.visualstudio.com/)해주세요.
- 사용하고 있는 OS 사양에 맞는 버전을 확인하고 설치해주세요.

### 1-1. vscode 추천 익스텐션

- ESLint (extension id : `dbaeumer.vscode-eslint`)
- Prettier - Code formatter (extension id : `esbenp.prettier-vscode`)

## 2. 시작하기

### 2-1. `.env` 파일 생성

1. `frontend` 폴더 바로 아래에 `.env` 파일을 생성해주세요.

2. 생성한 `.env` 파일을 다음과 같이 작성해주세요.

```
VITE_SERVER_END_POINT=https://i10a304.p.ssafy.io:8080/api
VITE_SOCKET_SERVER_END_POINT=wss://i10a304.p.ssafy.io:8080/api
VITE_DEV_SERVER_END_POINT=http://localhost:8080
VITE_DEV_SOCKET_SERVER_END_POINT=ws://localhost:8080
```

### 2-2. 개발 모드로 시작하기

1. `frontend` 폴더 아래 경로에서 `npm install` 을 통해 필요한 의존성을 설치해주세요. 이 명령어를 통해 `frontend` 폴더 아래에 `node_modules` 라는 폴더가 생성될 거에요.

2. `npm run dev` 명령어를 입력해주세요.

3. `http://localhost:5173`에 접속해서 개발을 진행해주세요.

> ❗️ 서버를 실행시키지 않은 상태라면 네트워크 에러가 발생할 수 있어요.

> ❗️ 2-1 과정의 `.env` 파일을 반드시 생성해주세요.

### 2-3. 빌드하기

1. `frontend` 폴더 아래 경로에서 `npm run build` 명령어를 통해 빌드를 진행해주세요.

2. 빌드가 정상적으로 완료되면 `frontend` 폴더 아래 경로에 번들링된 파일이 존재하는 `dist` 폴더가 생성될 거에요.

## 3. 실행 환경

- `node` : v18 이상
- `npm` : v9 이상
- `vite` : v5.1.2

## 4. 주요 의존성 소개 및 버전

> package.json의 dependencies에 대한 내용이에요.

### 리액트 관련

```
"react": "^18.2.0",
"react-dom": "^18.2.0",
"react-router-dom": "^6.21.3",
"react-uid": "^2.3.3",
"recoil": "^0.7.7",
```

### 스타일 관련

```
"@emotion/react": "^11.11.3",
"@emotion/styled": "^11.11.0",
"@mui/icons-material": "^5.15.7",
"@mui/material": "^5.15.7",
"@mui/styled-engine-sc": "^6.0.0-alpha.13",
"styled-components": "^6.1.8",
```

### 외부 네트워크 통신 관련

```
"@stomp/stompjs": "^7.0.0",
"axios": "^1.6.7",
"openvidu-browser": "^2.29.1"
"stompjs": "^2.3.3",
```

### 퍼즐 이미지 관련

```
"paper": "^0.12.17",
"react-draggable": "^4.4.6",
```

## 5. 그 외 스크립트

> 아래 스크립트는 package.json의 scripts에 명시 되어있어요.

- `npm run prettier` : 모든 파일에 `frontend/.prettierrc` 에 설정된 코드 포맷팅이 적용돼요.
- `npm run lint` : 모든 파일에 `frontend/.eslintrc.cjs` 에 설정된 린트 설정이 적용돼요.
- `npm run test` : `frontend` 폴더 아래에 테스트코드가 실행돼요.

## 6. 트러블슈팅

### Uncaught TypeError: styled_default is not a function, etc...

**Why?**

빌드가 정상적으로 됐지만 런타임 에러가 발생할 수 있어요. `@mui` 의 `<Grid2 />` 컴포넌트를 사용했을 때 발생하는 에러에요.

**Solution**

1. `node_modules`와 `package-lock.json`을 삭제해주세요.

2. `npm install` 명령어를 실행해주세요.

3. `npm run dev` 다시 실행해주세요.
[[맨 위로](#)]