def get_branch() {
    def branch = sh (
            returnStdout: true,
            script: '''
            br=`git name-rev --name-only HEAD |awk -F '/' '{print $3}'`
            if [[ $br =~ dev ]] || [[ $br =~ bugfix ]] || [[ $br =~ feature ]];then
                 BRANCH="dev"
             elif [[ $br =~ release ]]  ||  [[ $br =~ hotfix ]];then
                 BRANCH="test"
             elif [[ $br = master ]];then
                 BRANCH="prod"
             fi
             echo -n $BRANCH
          ''')
    return branch      
}

pipeline {
    agent any
    environment {
         COMMIT_DATE = sh(returnStdout: true, script: "git log --pretty=format:%ad --date=format:'%Y%m%d%H%M' ${GIT_COMMIT} -1")
         MAVEN_HOME = "/usr/local/apache-maven-3.5.2/bin"
		 NODE_HOME = "/usr/local/node-v14.15.1/bin"
         //定义模块名，要根据项目进行修改、只需要修改app_id 名称
         APP_ID = "jvtd-callcenter-user-front"
         conf_host = "ops.jvtdtest.top"
         //分支名称 开发环境是dev  测试环境是release   生产环境是prod         
         BRANCH = get_branch()
         //sh "echo brach: $BRANCH"
    }

    stages {
     
        stage('Build') {
            steps {
                echo 'Building..'
				//java构建
				// sh """
				//   source /usr/local/change_jdk.sh jdk11
				//   ${MAVEN_HOME}/mvn clean package -Dmaven.${BRANCH}.skip=true -U -P${BRANCH}
				// """
				//前端npm/yarn 构建(将java构建注释、修改下面npm 构建参数)
				npm run build:${BRANCH}
				
				//前端npm/yarn 构建(将java构建注释、修改下面yarn 构建参数)
				// yarn build:${BRANCH}
            }
        }
		
        // 打包镜像
        stage('打包镜像') {
            steps {
                echo "********************************************=打包镜像"
                // sh "docker build -f dockerfile -t ${DOCKER_IMAGE_NAME}:${DOCKER_TAG} --build-arg JAR_FILE_PATH=target ."
                script {
                    build_tag = sh(returnStdout: true, script: 'git rev-parse --short HEAD').trim()
                }
                
                sh "echo $build_tag "
                sh "docker login ${docker_repo_url_ali} --username=${docker_build_aliyun_user} -p ${docker_build_aliyun_user_pwd}"
                sh "docker build -f dockerfile -t ${docker_repo_url_ali}/jvtd/${APP_ID}-${BRANCH}:${COMMIT_DATE}.${build_tag} ."
            }
            post {
                failure {
                    sendIntegrationResult("false", "打包镜像失败")
                    error("打包镜像失败")
                }
            }
        }

        stage('推送镜像') {
    
            steps {
                  // 推送镜像到腾讯
                  //sh "docker login ${docker_repo_url_tc} --username=${docker_builder_tc} -p ${docker_builder_pwd_tc}"
                  //sh "docker tag ${BUILD_TAG}-${BRANCH}:${COMMIT_DATE}-${build_tag} ccr.ccs.tencentyun.com/jvtd/${BUILD_TAG}-${BRANCH}:${COMMIT_DATE}-${build_tag}"
                  //sh "docker push ${docker_repo_url_tc}/jvtd/${APP_ID}-${BRANCH}:${COMMIT_DATE}.${build_tag}"
                  // 推送镜像到阿里
                  sh "docker login ${docker_repo_url_ali} --username=${docker_build_aliyun_user} -p ${docker_build_aliyun_user_pwd}"
                  sh "docker push ${docker_repo_url_ali}/jvtd/${APP_ID}-${BRANCH}:${COMMIT_DATE}.${build_tag}" 
                      
            }
            
            post {
                failure {
                    sendIntegrationResult("false", "推送镜像失败")
                    error("推送镜像失败")
                }
            }
        }

        stage('Test') {
            steps {
                echo 'Testing...'
            }
        }
        stage('Deploy') {
            steps {
                echo 'Deploying....'
            }
        }
    }
}