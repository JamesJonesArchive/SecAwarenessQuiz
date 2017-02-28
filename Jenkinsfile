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
  stage('Deploy Security Awareness Quiz') {
    dir('ansible') {
      sh "ansible-pull -d inventory -U git@github.com:USF-IT/cims-ansible-inventory.git -i inventory/${env.DEPLOY_ENV.toLowerCase()}/hosts"
    }
  }
}
node('imageservice') {
  unstash 'secawarenessquizrpm'
}

