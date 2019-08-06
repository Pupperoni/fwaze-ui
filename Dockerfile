# base image
FROM node:12.2.0

# set environment variables
# ENV ENVIRONMENT=development
# ENV HOST=fwaze_node
# ENV PORT=3000

# set working directory
WORKDIR /app

# install and cache app dependencies
COPY package*.json ./
RUN npm install
RUN npm install -g @angular/cli

# add app
COPY . .

# start app
CMD ng serve --host 0.0.0.0