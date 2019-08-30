FROM node:10.7

ENV APP_ROOT /src

RUN mkdir ${APP_ROOT}
WORKDIR ${APP_ROOT}
ADD . ${APP_ROOT}

RUN npm install

EXPOSE 8080

ENV HOST 0.0.0.0
ENV PORT 8080

CMD [ "npm", "start" ]
