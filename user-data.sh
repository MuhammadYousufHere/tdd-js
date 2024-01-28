#!/bin/bash

yes | sudo apt update
yes | sudo apt upgrade

# Install docker
sudo apt-get update
apt-get install -y apt-transport-https ca-certificates curl software-properties-common
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
add-apt-repository \
   "deb [arch=amd64] https://download.docker.com/linux/ubuntu \
   $(lsb_release -cs) \
   stable"
apt-get update
apt-get install -y docker-ce
usermod -aG docker ubuntu

# Install docker-compose
sudo curl -L https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m) -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

apt-get install -y awscli

export AWS_ACCESS_KEY_ID=your_access_key_id_here
export AWS_SECRET_ACCESS_KEY=your_secret_access_key_here


git clone -b my-branch git@github.com:user/myproject.git
cd repo
#login ecr
# start compose

