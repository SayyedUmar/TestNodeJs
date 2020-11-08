FROM node:10

WORKDIR /var/www
ADD . .
# COPY ./../.env ./.env
RUN npm install
EXPOSE 4001
CMD ["npm", "run", "start:dev"]


# FROM node:10

# WORKDIR /var/www
# ADD ./induction_ms .
# COPY ./.env ./.env
# RUN npm install
# CMD ["npm", "run", "start:dev"]

# docker run -p 8001:4001 -d 9f56dd0124a4 tail -f /dev/null