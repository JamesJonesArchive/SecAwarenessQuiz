node('master') {
  env.NODEJS_HOME = tool 'nodejs'
  env.PATH = "${env.JENKINS_HOME}/bin:${env.NODEJS_HOME}/bin:${env.PATH}"
  checkout scm

  stage('Build Security Awareness Quiz') {  
    sh "vagrant halt --force || true"
    sh "vagrant global-status --prune || true"
    sh "vagrant destroy saqvm --force || true"
    sh "VBoxManage controlvm saqvm poweroff || true"
    sh "VBoxManage unregistervm saqvm --delete || true"
    sh "rm -Rf '${env.JENKINS_HOME}/VirtualBox VMs/saqvm/'"
    env.ANSIBLE_TAGS = 'build'
    sh "vagrant up --provision --provider virtualbox"
    sh "vagrant halt --force || true"
    sh "vagrant global-status --prune || true"
    sh "vagrant destroy saqvm --force || true"
    sh "VBoxManage controlvm saqvm poweroff || true"
    sh "VBoxManage unregistervm saqvm --delete || true"
    sh "rm -Rf '${env.JENKINS_HOME}/VirtualBox VMs/saqvm/'"
    dir('public') {
      // archiveArtifacts artifacts: '*.rpm'
      stash name: "secawarenessquizrpm", includes: "SecAwarenessQuiz*.rpm"
    }
  }
  stage('Stash Deploy Related') {
    sh 'rm -rf rpms'
    sh "ansible-playbook -i 'localhost,' -c local --vault-password-file=${env.USF_ANSIBLE_VAULT_KEY} ansible/playbook.yml --extra-vars 'keystash=${env.USF_ANSIBLE_VAULT_KEY} targetgroup=all' -t keystash"
    dir('rpms') {
      stash name: 'keystash', includes: "ansible-vault-usf*.rpm"
    }
    stash name: 'ansible', includes: "ansible/**/*"
  }
}
node('imageservice') {
  stage('Unstash resources on target') {
    sh 'rm -rf rpms'
    dir('rpms') {
      unstash 'secawarenessquizrpm'
      unstash 'keystash'
    }
    unstash 'ansible'
  }
  stage('Prepare target node') {
    def distVer = sh script: 'python -c "import platform;print(platform.linux_distribution()[1])"', returnStdout: true
    def missingEpel = sh script: 'rpm -q --quiet epel-release', returnStatus: true
    def missingAnsible = sh script: 'rpm -q --quiet ansible', returnStatus: true
    if (missingEpel) {
      echo "Epel to be installed"
      if(distVer.toFloat().trunc() == 7) {
        echo "Detected version 7"
        sh "rpm -iUvh https://dl.fedoraproject.org/pub/epel/epel-release-latest-7.noarch.rpm || exit 0"
      }
      if(distVer.toFloat().trunc() == 6) {
        echo "Detected version 6"
        sh "rpm -iUvh https://dl.fedoraproject.org/pub/epel/epel-release-latest-6.noarch.rpm || exit 0"
      }
      if(distVer.toFloat().trunc() == 5) {
        echo "Detected version 5"
        sh "rpm -iUvh https://dl.fedoraproject.org/pub/epel/epel-release-latest-5.noarch.rpm || exit 0"
      }
      sh "yum -y update || exit 0"
    } else {
      echo "Already installed"
    }
    if(missingAnsible) {
      sh "yum -y install ansible || exit 0"
    }
    sh 'yum -y install rpms/ansible-vault-usf*.rpm || exit 0'
    unstash 'ansible'
  }
  stage('Deploy Security Awareness Quiz') {
    sh "ansible-playbook -i 'localhost,' -c local --vault-password-file=${env.USF_ANSIBLE_VAULT_KEY} ansible/playbook.yml --extra-vars 'java_home=${env.JAVA_HOME} deploy_env=${env.DEPLOY_ENV} package_revision=${env.PACKAGE_REVISION}' -t deploy"
  }
}

