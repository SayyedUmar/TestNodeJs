FROM node:10

WORKDIR /var/www
ADD . .
RUN npm install
EXPOSE 4001
CMD ["npm", "run", "start:dev"]
