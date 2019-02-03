############################################################
# Dockerfile to build bitsoko container
# Based on Ubuntu 14.04
############################################################

# Set the base image to Ubuntu
FROM ubuntu:14.04

# File Author / Maintainer
MAINTAINER bitsoko@bitsoko.io

RUN apt-get update

RUN apt-get install -y curl nodejs npm git iptables

RUN curl -sL https://deb.nodesource.com/setup_8.x | bash -

RUN apt-get update && apt-get install -y nodejs --force-yes

RUN npm install debug write forever express node-cmd image-downloader download-file node-gcm promised-io compression socket.io pug mysql express-force-ssl html2jade newline-remove

RUN iptables -t nat -I PREROUTING -p tcp --dport 80 -j REDIRECT --to-port 8081
RUN iptables -t nat -I PREROUTING -p tcp --dport 443 -j REDIRECT --to-port 8080

ENTRYPOINT node business/index.js start
