# build process
FROM node:18 as build

WORKDIR /client-web

COPY package*.json .

RUN npm install

COPY . .

RUN yarn run build

# production environment
FROM nginx:1.24

COPY ./nginx/nginx.conf /etc/nginx/nginx.conf

COPY --from=build /client-web/build /usr/share/nginx/html
