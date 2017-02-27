VAGRANTFILE_API_VERSION = "2"
vault_key = ENV['USF_ANSIBLE_VAULT_KEY']
oauth_key = ENV['USF_GIT_OAUTH_KEY']

Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|

    config.vm.box = "puppetlabs/centos-7.2-64-nocm"

    config.vm.provider :virtualbox do |v|
      v.name = "saqvm"
      v.memory = 512
      v.cpus = 1
      v.customize ["modifyvm", :id, "--natdnshostresolver1", "on"]
      v.customize ["modifyvm", :id, "--ioapic", "on"]
    end

    config.vm.hostname = "saq.vagrant.dev"
    config.vm.network :private_network, type: "dhcp"
    # Timed out so I set this JPJ
    config.vm.boot_timeout = 600
    
    # Set the name of the VM. See: http://stackoverflow.com/a/17864388/100134
    config.vm.define :saqvm do |saqvm|
    end

    # Configure cached packages to be shared between instances of the same base box.
    # See: https://github.com/fgrehm/vagrant-cachier
    # if Vagrant.has_plugin?("vagrant-cachier")
    #   config.cache.scope = :box
    #   config.cache.synced_folder_opts = {
    #     type: :nfs,
    #     mount_options: ['rw', 'vers=3', 'tcp', 'nolock']
    #   }
    # end

    #Disable the default share
    # config.vm.synced_folder ".", "/vagrant", disabled: true

    #Share ~/vagrant_shares/visor on the host to /opt/site on the guest
    #See: https://github.com/gael-ian/vagrant-bindfs
    # if Vagrant.has_plugin?("vagrant-bindfs")
    #   config.vm.synced_folder "~/vagrant_shares/visor", "/opt_share_nfs", create: true, :nfs => { :mount_options => ['rw', 'vers=3', 'tcp', 'nolock'] }
    #   config.bindfs.bind_folder "/opt_share_nfs", "/opt/site", :owner => "1000", :group => "1000", :'create-as-user' => true, :perms => "u=rwx:g=rwx:o=rwx", :'create-with-perms' => "u=rwx:g=rwx:o=rwx", :'chown-ignore' => true, :'chgrp-ignore' => true, :'chmod-ignore' => true
    # end
    
    # Added to forward current key
    config.ssh.forward_agent = true

    config.vm.provision :ansible do |ansible|
       ansible.playbook = "ansible/playbook.yml"
       ansible.groups = {
          "saq" => ["saqvm"]
       }
       ansible.vault_password_file = "#{ENV['USF_ANSIBLE_VAULT_KEY']}"
       ansible.sudo = true
       ansible.extra_vars = {
           vagrant_vm: true,
           remote_user: "vagrant",
           saq_web_fqdn: "saq.vagrant.dev",
           web_server_group: "vagrant",
           web_server_user: "vagrant",
           composer_github_oauth: "#{ENV['USF_GIT_OAUTH_KEY']}",
           package_revision: "#{ENV['BUILD_NUMBER']}",
           app_name: "#{ENV['APP_NAME']}",
           app_version: "#{ENV['APP_VERSION']}",
           app_description: "#{ENV['APP_DESCRIPTION']}",
           provided_java: "#{ENV['JAVA_HOME']}"
       }
       # ansible.verbose = "vvv"
       ansible.tags = "glassfish"
       ansible.galaxy_role_file = "ansible/requirements.yml"
       ansible.galaxy_roles_path = "ansible/roles/"
    end

    # Make sure PHP-FPM and nginx startup after mounting NFS shares
    # Commented this junk out
    # config.vm.provision :shell, :inline => "sudo /bin/systemctl restart php-fpm.service && /bin/systemctl restart nginx.service", run: "always"
end

