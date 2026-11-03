# Registro de cambios 
Todos los cambios notables de este proyecto se documentarán en este archivo. 

El formato se basa en [Mantenga un registro de cambios](https://configuracion-ge.prod.xetid.cu/doku.php?id=div:gest_conf:desarrollo:desarrollo:git:git_tags_registro_cambios),
 y este proyecto se adhiere a [Versionado Semántico](https://configuracion-ge.prod.xetid.cu/doku.php?id=div:gest_conf:desarrollo:desarrollo:git:git_tags_nomenclatura).


## [1.2.20] - 2024-10-16
### Reparado
- Permite realizar el cambio de cargo automáticamente en Asociar persona a centro de costo, una vez realizado el movimiento de cargo en Gestionar movimientos laborales
- Mostrar los trabajadores con problemas de la estructura que está accediendo en Problemas detectados de fuerza de trabajo.
- Se optimiza el listar persona del componente Gestión de movimientos laborales. 

## [1.2.19] - 2024-09-23
### Reparado
- Se corrige el paginado a la hora de filtrar en la pestaña Histórico de Gestión de movimientos laborales
- Se ponen por recursos los botones: Traslado, Exportar e Importar en Gestión de movimientos laborales.
- Se elimina el botón Eliminar en Gestión de movimientos laborales

## [1.2.18] - 2024-08-15
### Reparado
- Corrección del reporte Anexo 14B inc b).
- Corrección del reporte Fluctuación.
- En el reporte Deficit de la FT se incorpora un resumen de la información.


## [1.2.16] - 2024-06-17
### Reparado
- Implementacion de la funcion f_cantidad_por_niveleducacional para reemplazar la consulta que devuelve los niveles educacionales de las personas en el reporte Resumen de la Fuerza de Trabajo

## [1.2.13] - 2024-04-16
### Reparado
- Ocultar los reportes de la ONEI No.5201-06 y No.5202-05.

## [1.2.12] - 2024-01-12
### Reparado
Corrección de los botones Exportar y Buscar en Deficit.

## [1.2.11] - 2024-01-29
### Reparado
Error interno en la secuencia al dar alta a una persona en Movimientos laborales.

## [1.2.9] - 2023-12-20
### Reparado
Error de transaccion al dar alta a una persona en Movimientos laborales.

## [1.2.8] - 2023-11-30
### Reparado
 NC soporte 23258. Nivel de preparación
En la gestión de la estructura se define el nivel de preparación de los cargos, sin embargo, esta información no tributa a la Gestión de movimientos laborales donde, al emitir el modelo Anexo 14B inc a. no se muestra la información definida en la estructura.

## [1.2.7] - 2023-11-27
### Reparado
- NC soporte 56013. órgano interno no esté relacionado a cargos o personas nombradas en cargos.

## [1.2.6] - 2023-11-24
### Reparado
- Cuando se filtra por fecha, el sistema debe de mostrar altas y/o bajas del período filtrado, si hay efectuadas. Esta mostrando todas las altas y/o bajas efectuadas.

## [1.2.5] - 2023-11-21
### Reparado
- El gráfico de trabajadores por genero y rango de edades obtenga la información del nomenclador de maestro Configurar rango de edades.
- En el reporte Análisis gráfico de fuerza de trabajo, el gráfico de trabajadores por rango de edades hale la información de maestro Configurar rango de edades

## [1.2.4] - 2023-10-18
### Reparado
- El promedio de trabajadores. El promedio de deducciones, adicciones y promedio total no muestra datos.

## [1.2.3] - 2023-07-18
### Reparado
- Resuelto error en el documento Información de plazas vacantes.


## [1.2.2] - 2023-05-04
### Reparado
- Corrección de un error 500 en Gestión de movimientos laborales a la hora de dar alta que estaba haciendo referencia a un método que no existia.

## [1.2.1] - 2023-05-03
### Reparado
 - Resuelta la NC: 25 840 No salen en el movimiento de nomina los segundos nombres.

## [1.2.0] - 2023-02-16
### Agregado
 - Funcionalidad para modificar el motivo de movimiento o baja desde el histórico de Gestión de movimientos laborales.
 - Control de la última fecha de modificación del registro de la situación laboral modificada desde el hitórico.

## [1.1.7] - 2023-02-11
### Reparado
 - Corrección del orden de visualización de las personas contratadas.
 - Optimización de la función getSituacionByIdCargo.

## [1.1.6] - 2022-12-20
### Reparado
 - Resuelto error interno en Fuerza de Trabajo/Analisis en los reportes Altas, Bajas y Movimientos.

## [1.1.4] - 2022-10-18
### Reparado
 - Corrección del campo motivobaja en el módulo mod_personaext en la tabla his_trayectorialaboral.

## [1.1.3] - 2022-10-18
### Reparado
 - Resuelto error interno en Movimientos laborales en el modelo 5205-01 de la ONEI.

## [1.1.2] - 2022-07-14
### Reparado
- Resuelta la NC 12240: No se muestran los datos de Nombre, Apellidos, CI y Sexo del personal nombrado en cargo en el exportar

## [1.1.1] - 2022-04-07
### Reparado
- Correcciones al movimiento de nóminas para la generación a partir de los cambios salariales efectuados en la configuración de elementos salariales del cargo en el módulo de retribución salarial.
- Exclusión de los contratos eventuales de los principales reportes y análisis.

## [1.1.0] - 2022-03-10
### Agregado
- Se agrega el tipo de contrato Eventual.
- Se permite generar varios movimientos de nóminas en un mismo archivo.

### Reparado
- Se elimina el campo de motivo de movimiento que estaba por error al dar alta.
- Corrección del motivo de movimiento al dar alta.

## [1.0.0] - 2021-10-29
### Agregado

- Codigo fuente del proyecto para comenzar las entregas por tags. 

[Nuevo]: http://gitlab-distra.xutil.net/distra/pvd/distra/movimientoslaborales_apps/-/tree/master
[1.2.20]: http://gitlab-distra.xutil.net/distra/pvd/distra/movimientoslaborales/-/tags/1.2.20
[1.2.19]: http://gitlab-distra.xutil.net/distra/pvd/distra/movimientoslaborales/-/tags/1.2.19
[1.2.18]: http://gitlab-distra.xutil.net/distra/pvd/distra/movimientoslaborales/-/tags/1.2.18
[1.2.16]: http://gitlab-distra.xutil.net/distra/pvd/distra/movimientoslaborales/-/tags/1.2.16
[1.2.13]: http://gitlab-distra.xutil.net/distra/pvd/distra/movimientoslaborales/-/tags/1.2.13
[1.2.12]: http://gitlab-distra.xutil.net/distra/pvd/distra/movimientoslaborales/-/tags/1.2.12
[1.2.11]: http://gitlab-distra.xutil.net/distra/pvd/distra/movimientoslaborales/-/tags/1.2.11
[1.2.9]: http://gitlab-distra.xutil.net/distra/pvd/distra/movimientoslaborales/-/tags/1.2.9
[1.2.8]: http://gitlab-distra.xutil.net/distra/pvd/distra/movimientoslaborales/-/tags/1.2.8
[1.2.7]: http://gitlab-distra.xutil.net/distra/pvd/distra/movimientoslaborales/-/tags/1.2.7
[1.2.6]: http://gitlab-distra.xutil.net/distra/pvd/distra/movimientoslaborales/-/tags/1.2.6
[1.2.5]: http://gitlab-distra.xutil.net/distra/pvd/distra/movimientoslaborales/-/tags/1.2.5
[1.2.4]: http://gitlab-distra.xutil.net/distra/pvd/distra/movimientoslaborales/-/tags/1.2.4
[1.2.3]: http://gitlab-distra.xutil.net/distra/pvd/distra/movimientoslaborales/-/tags/1.2.3
[1.2.2]: http://gitlab-distra.xutil.net/distra/pvd/distra/movimientoslaborales/-/tags/1.2.2
[1.2.1]: http://gitlab-distra.xutil.net/distra/pvd/distra/movimientoslaborales/-/tags/1.2.1
[1.2.0]: http://gitlab-distra.xutil.net/distra/pvd/distra/movimientoslaborales/-/tags/1.2.0
[1.1.7]: http://gitlab-distra.xutil.net/distra/pvd/distra/movimientoslaborales/-/tags/1.1.7
[1.1.6]: http://gitlab-distra.xutil.net/distra/pvd/distra/movimientoslaborales/-/tags/1.1.6
[1.1.4]: http://gitlab-distra.xutil.net/distra/pvd/distra/movimientoslaborales_apps/-/tags/1.1.4
[1.1.3]: http://gitlab-distra.xutil.net/distra/pvd/distra/movimientoslaborales_apps/-/tags/1.1.3
[1.1.2]: http://gitlab-distra.xutil.net/distra/pvd/distra/movimientoslaborales_apps/-/tags/1.1.2
[1.1.1]: http://gitlab-distra.xutil.net/distra/pvd/distra/movimientoslaborales_apps/-/tags/1.1.1
[1.1.0]: http://gitlab-distra.xutil.net/distra/pvd/distra/movimientoslaborales_apps/-/tags/1.1.0
[1.0.0]: http://gitlab-distra.xutil.net/distra/pvd/distra/movimientoslaborales_apps/-/tags/1.0.0
