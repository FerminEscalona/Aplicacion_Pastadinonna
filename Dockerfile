FROM richarvey/nginx-php-fpm:latest

# Establecer el directorio de trabajo
WORKDIR /var/www/html

# Copiar todos los archivos del proyecto al contenedor
COPY . /var/www/html

# Configuración de la imagen
ENV SKIP_COMPOSER 1
ENV WEBROOT /var/www/html/public
ENV PHP_ERRORS_STDERR 1
ENV RUN_SCRIPTS 1
ENV REAL_IP_HEADER 1

# Configuración de Laravel
ENV APP_ENV production
ENV APP_DEBUG false
ENV LOG_CHANNEL stderr

# Permitir que Composer se ejecute como root (si es necesario)
ENV COMPOSER_ALLOW_SUPERUSER 1

# Instalar dependencias de Composer
RUN composer install --optimize-autoloader --no-dev

# Establecer permisos para el almacenamiento y el caché
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

# Exponer el puerto 80
EXPOSE 80

# Usar el comando por defecto de la imagen base (Nginx y PHP-FPM)
# Removemos la línea CMD ["/start.sh"] ya que no tenemos ese script


