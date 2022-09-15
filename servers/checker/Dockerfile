FROM ubuntu:20.04

ARG DEBIAN_FRONTEND=noninteractive

# install nodejs
RUN apt-get -qq update
RUN apt-get -qq upgrade --yes 

RUN apt-get -qq install curl --yes
RUN curl -sL https://deb.nodesource.com/setup_16.x | bash -
RUN apt-get -qq install nodejs --yes
RUN apt-get -qq install -y g++ cmake wget unzip python3 build-essential git
RUN apt-get clean

RUN mkdir /opt/app
RUN git clone -b checker --single-branch https://github.com/Oein/Dioh.git /opt/app

WORKDIR /opt/app

RUN npm install -g npm
RUN npm install -g yarn

WORKDIR /opt/app/servers/checker

RUN yarn install
RUN npx prisma generate

EXPOSE 5690
ENTRYPOINT ["/bin/bash"]