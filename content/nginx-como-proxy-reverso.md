# NGINX como proxy reverso

## Que es un proxy reverso

Un proxi reverso o inverso, es un tipo de servidor proxy que toma las peticion enviada por el cliente y la reenvia a uno o mas servidores, y reenvia la respuesta al cliente sin que este note todo este flujo, lo que nos permite hacer cosas como distribuir la carga de peticiones a los servidores, realizar pruebas A/B, otorgarnos un nivel mas de seguridad, entre otras cosas, si deseas saber mas sobre lo que puedes hacer con un proxi reverso visita el sitio web de [NGINX](https://www.nginx.com/resources/glossary/reverse-proxy-server/)

## Instalando NGINX

Para distribuciones basadas en debian

```sudo apt install nginx```

Con esto tendremos instalado ya en nuestro sistema nuestro servidor NGINX

## 