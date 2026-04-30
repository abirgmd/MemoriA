FROM nginx:alpine

# Copier directement les fichiers statiques
COPY dist/memoria-frontend /usr/share/nginx/html

# Copier la configuration nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
