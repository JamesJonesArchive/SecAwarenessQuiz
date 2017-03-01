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
  // stage('Deploy Security Awareness Quiz') {
  //   dir('ansible') {
  //     sh "ansible-pull -d inventory -U git@github.com:USF-IT/cims-ansible-inventory.git -i ${env.DEPLOY_ENV.toLowerCase()}/hosts"
  //   }
  // }
  stage('Stash Deploy Related') {
    sh "ansible-playbook -i 'localhost,' -c local --vault-password-file=${env.USF_ANSIBLE_VAULT_KEY} ansible/playbook.yml --extra-vars 'keystash=${env.USF_ANSIBLE_VAULT_KEY}' -t keystash"
    stash name: 'keystash', includes: "rpms/ansible-vault-usf*.rpm"
    stash name: 'ansible', includes: "ansible/**/*"
  }
}
node('imageservice') {
  stage('Prepare CI on target') {
    dir('rpms') {
      sh 'rm -Rf .'
      unstash 'secawarenessquizrpm'
      unstash 'keystash'
    }
    unstash 'ansible'
  }
  
}

