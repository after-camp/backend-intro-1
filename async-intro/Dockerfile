FROM node:14

# Set the working directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Bundle the app source
COPY . .

EXPOSE 3000
CMD ["npm", "start"]
