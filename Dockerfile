FROM node:20.9.0

RUN mkdir -p /subs

WORKDIR /subs

COPY . /subs/

RUN npm install

ENV MONGODB_URI="mongodb+srv://KGH1113:robinroy4072@subs.ojojnsk.mongodb.net/subs"

RUN npm run build

EXPOSE 3000

CMD npm run start

# build docker image
## docker build -t subs-img .

# run docker container
## docker run --name subs-container -v $(pwd):/subs -p 3000:3000 subs-img

# stop docker container
## docker stop $(docker ps -aq)

# delete container
## docker rm subs-container

# delete docker image
## docker system prune -a