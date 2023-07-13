FROM node:18 as dev 

COPY ./ /app

WORKDIR /app
RUN npm install
RUN npm run build
CMD ["npm", "run", "start"]