FROM node:12-alpine

# Without this variable, you will see a 503 error when attempting 
# to access https://ticketing.dev/api/users/currentuser in the browser.
ENV CI=true

WORKDIR /the/workdir/path
COPY package.json ./

# --only=prod: To exclude NPMs of devDependencies
RUN npm install --only=prod    
COPY ./ ./
CMD ["npm","start"]