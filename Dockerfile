############################################################
# Dockerfile to build bitsoko container for enterprise businesses
# Based on Ubuntu 18.04
############################################################

# Set the base image to Ubuntu
FROM ubuntu:18.04

# File Author / Maintainer
MAINTAINER bitsoko@bitsoko.org

RUN apt-get update && apt-get install -y gnupg2 curl git iptables --fix-missing

RUN curl -sL https://deb.nodesource.com/setup_8.x | bash -

RUN apt-get update && apt-get install -y nodejs --force-yes

RUN npm install debug write forever express node-cmd image-downloader download-file node-gcm promised-io compression socket.io pug mysql express-force-ssl html2jade newline-remove

RUN iptables -t nat -I PREROUTING -p tcp --dport 80 -j REDIRECT --to-port 8081
RUN iptables -t nat -I PREROUTING -p tcp --dport 443 -j REDIRECT --to-port 8080

ENTRYPOINT node business/index.js start
