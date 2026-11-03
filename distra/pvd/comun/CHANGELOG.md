# Registro de cambios 
Todos los cambios notables de este proyecto se documentarán en este archivo. 

El formato se basa en [Mantenga un registro de cambios](https://configuracion-ge.prod.xetid.cu/doku.php?id=div:gest_conf:desarrollo:desarrollo:git:git_tags_registro_cambios),
 y este proyecto se adhiere a [Versionado Semántico](https://configuracion-ge.prod.xetid.cu/doku.php?id=div:gest_conf:desarrollo:desarrollo:git:git_tags_nomenclatura).

## [1.2.14] - 2024-08-15
### Agregado
- Quitando nivel de replica por parametro para que replica segun el nivel de la estructura.

## [1.2.1] - 2023-03-30
### Agregado
- Incluido en el ioc un servicio que devuelve los datos principales de la persona (Incluido Organizaciones, Nacionalidades y Contactos).

## [Nuevo]
## [1.2.0] - 2022-07-14
### Agregado
- Ahora el SNC tiene varios comportamientos:
   Si "mod_rrhhmaestro.dat_modulo.sncsigerh = 1" entonces el SNC lista a las Personas desde Fuerza de Trabajo compartimentadas por entidades. Sistema SIGERH.
   Si "mod_rrhhmaestro.dat_modulo.sncsigerh != 1" entonces el SNC lista a las Personas que esten de Alta en Asociar Personas a Cantros de Costo compartimentadas por entidades. Sistema DISTRA.


## [1.1.1] - 2022-02-09
### Agregado
- Correcciones en la búsqueda en la Ficha Única del Ciudadano.
- Optimización en la búsqueda en la Ficha Única del Ciudadano.


## [1.1.0] - 2021-10-31
### Agregado
-  Nuevo servicio para que en el Submayor de Retenciones se liquiden cuentas por cobrar de trabajadores liquidadas en efectivo y por la caja.
-  Nuevo para cancelar las cuentas por cobrar en el Submayor de Retenciones automaticamente desde Caja.

## [1.0.0] - 2021-10-29
### Agregado

- Codigo fuente del proyecto para comenzar las entregas por tags. 

[Nuevo]: http://gitlab-distra.xutil.net/distra/zeolides/zeolides/-/tree/master
[1.2.14]: http://gitlab-distra.xutil.net/distra/pvd/distra/comun/-/tags/1.2.14
[1.2.1]: http://gitlab-distra.xutil.net/distra/pvd/distra/comun/-/tags/1.2.1
[1.2.0]: http://gitlab-distra.xutil.net/distra/pvd/distra/comun_apps/-/tags/1.2.0
[1.1.1]: http://gitlab-distra.xutil.net/distra/pvd/distra/comun_apps/-/tags/1.1.1
[1.1.0]: http://gitlab-distra.xutil.net/distra/pvd/distra/comun_apps/-/tags/1.1.0
[1.0.0]: http://gitlab-distra.xutil.net/distra/pvd/distra/comun_apps/-/tags/1.0.0
