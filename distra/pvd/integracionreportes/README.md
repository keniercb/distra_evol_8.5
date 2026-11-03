# Integracion ReportServer

Para que funcione correctamente el componente hay que configurar el servidor Apache donde se encuentra montado el ReporServer para que permita mostrar paginas embedidas (<iframe>) o instalar el plugins  Ignore X-Frame-Options Header.

## Opcion #1
- Instalar en el navegador el plugins Ignore X-Frame-Options Header
- Firefox:https://addons.mozilla.org/es/firefox/addon/ignore-x-frame-options-header/
- Chrome:https://chrome.google.com/webstore/detail/ignore-x-frame-headers/gleekbfjekiniecknbkamfmkohkpodhe

## Opcion #2 Configurar Apache

- Habilitar el modulo mod_headers de Apache
- Adicionar en la configuracion del virtual host del sitio ReportServer una de las siguientes configuraciones:

- Header append X-Frame-Options "ALLOW-FROM https://URL_DISTRA"

- Header always set X-Frame-Options "ALLOW-FROM https://URL_DISTRA"

## Configuracion para usar el parametro tipo fecha

- Para que funcione el parametro tipo fecha hay que editar el siguiente archivo en el ReportServer

Archivo: etc/datasources/parameter.cf

- Editar la etiqueta date y debe quedar asi:

`<configuration>`

`<parameter>`

`<!-- ... -->`

`<date>`

`<urlpattern>yyyy-MM-dd</urlpattern>`

`</date>`

`</parameter>`

`</configuration>`

 - Reiniciar el ReportServer o el fichero config:

config reload
