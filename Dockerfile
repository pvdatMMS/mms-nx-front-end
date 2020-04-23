FROM ubuntu:18.04

RUN apt-get update -y && apt-get install -y \
	supervisor \
	nginx \
	curl \
	make \
	gnupg


RUN ln -sf /dev/stdout /var/log/nginx/access.log && \
	ln -sf /dev/stdout /var/log/nginx/error.log

RUN curl -sL https://deb.nodesource.com/setup_8.x | bash
RUN apt-get install nodejs -y
RUN npm install -g yarn

COPY ./docker/nginx.conf /etc/nginx/sites-enabled/default
COPY ./docker/supervisord.conf /etc/supervisor/conf.d/supervisord.conf

WORKDIR /code
COPY package.json /code
RUN yarn install
COPY . /code

ENV ENV=production

CMD ["/usr/bin/supervisord"]