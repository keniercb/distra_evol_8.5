# Registro de cambios 
Todos los cambios notables de este proyecto se documentarán en este archivo. 

El formato se basa en [Mantenga un registro de cambios](https://configuracion-ge.prod.xetid.cu/doku.php?id=div:gest_conf:desarrollo:desarrollo:git:git_tags_registro_cambios),
 y este proyecto se adhiere a [Versionado Semántico](https://configuracion-ge.prod.xetid.cu/doku.php?id=div:gest_conf:desarrollo:desarrollo:git:git_tags_nomenclatura).

## [Nuevo]

## [1.1.9] - 2022-12-18
### Reparado
- Modificando los parametros del reporte modelo de movimientos en activos fijos 

## [1.1.8] - 2022-12-07
### Reparado
- Solucionando error al imprimir submayor de activos al filtrar por fechas

## [1.1.7] - 2022-12-1
### Reparado
- Solucionando error con el valor contable al realizar traslado entre entidades

## [1.1.6] - 2022-11-11
### Reparado
- Solucionando error interno en el analizador de activos_fijos

## [1.1.5] - 2022-09-20
### Reparado
- Solucionando problemas con la depreciacion de los carros de transgaviota

## [1.1.4] - 2021-07-14
### Reparado
- Corrigiendo que no se borre el reponsable cuando se haga traslado interno

## [1.1.2] - 2021-06-04
### Reparado
- Quitando la validacion de la fecha de inicio de explotacion al confirmar el documento de traslado externo
- Corrigiendo error en variable no definida en la exception

## [1.1.1] - 2021-06-02
### Reparado
(Depreciacion) Se adicionan metodos de validacion al realizar la depreciacion.
(Depreciacion) Se arregla bug en la funcionalidad de lectura de recursos consumidos para que reconozca valores con ceros

## [Nuevo]
## [1.1.0] - 2021-03-22

### Cambiado

- (Documento) Los activos al ser recpcionados por traslado externo olvidan el centro de costo anterior.
- (Submayor) Excluyendo columnas innecesarias.
- (Submayor) Se muestra el valor real del activos en la columna valor contable del submayor.
- (Submayor) La configuración de las columnas es permanente por usuario y nunca se pierde.
- (Documentos) Se muestra el valor contable real del medio en los registros numericos que se abren en los documentos.
- (Configuracion) Ordenando por nombre las operaciones en tab "Codigos por operacion".
- (Cierre) Mostrando el boton cierre de apertura incluso cuando no esta integrado a contabilidad.

### Agregado

- (Recuperaciones) Analizador de activos fijos en las recuperaciones de activos.
- (Depreciacion) Agregando validaciones.
- (Submayor) Se muestra nueva columna con el valor residual del activos en el submayor.
- (Documentos) Se muestra la fecha del documento origen en la ventana de Recibido de gestion de documentos.
- (Depreciacion) Nueva funcionalidad Documentos de depreciacion.
- (Configuracion) Configuracion de reportes de Trangaviota.
- (Documento) Reportes de la gestion de documentos de Transgaviota.
- (Submayor V2) Creada funcionalidad de medios por cantidades con reportes especificos para Transgaviota.

### Reparado

- (Documento) Errores en la gestión de documentos de activos fijos y útiles.
- (Depreciacion) Error interno en el cargar de la funcionalidad depreciación para el método mixto.
- (Submayor) Filtros de Naturaleza, Estado y Grupo en el submayor de activos.
- (Documentos) Creando validaciones para evitar eliminar registros numericos permanentemente.
- (Documentos) Duplicación del último documento en la gestion de documentos de activos fijos.
- (Recuperaciones) Arreglo en reporte de activos fijos por responsable.

### Mejorado

- (Depreciacion) Funcionalidad Depreciar todos de la depreciación de activos.


## [Nuevo]
## [1.0.10] - 2021-03-01

### Agregado

- Servicio de medios de transporte

### Reparado

- Agregando validaciones para evitar la eliminación imprevista de activos y utiles.
- Funcionalidad depreciación.
- Funcionalidad revertir depreciación.
- Reporte de activos por responsable.
- Conteos parciales mensuales.
- Recepcion de traslado.



## [1.0.9] - 2021-02-20
### Agregado

- Funcionalidad para revertir la última depreciación.


## [1.0.8] - 2021-12-21
### Mejorado

- Mejorado tiempos de respuesta del cargar activos en el método de depreciacion linea recta.

### Reparado

- Permite modificar le tamaño de los paneles en las recuperaciones de activos.

### Agregado

- Funcionalidad para la depreciación por método mixto (kilometros).
- Filtros por columnas en la funcionalidad de depreciación.

## [1.0.5] - 2021-12-09
### Reparado

- Funcionalidad cargar útiles en los tipos de documentos para **Utiles y Herramientas**.


## [1.0.4] - 2021-11-19
### Reparado

- Error introducido en la versión 1.0.3

## [1.0.3] - 2021-11-18
### Reparado

- Cargar vales de salida.

### Cambiado

- Operaciones de AFT/UH sin modelo de contabilizacion no aparecen en el Registro de Comprobantes.

## [1.0.2] - 2021-11-16
### Reparado

- Adicionar registros del conteo parcial.

## [1.0.1] - 2021-11-05
### Reparado

- Agregando validacion en el cierre de apertura si esta o no intergrado a la contabilidad.
- Ya se pueden modificar los campos en la funcionalidad de Alta por ajuste.
- Arreglando hablitar/desabilitar botones en movimiento de activos.

## [1.0.0] - 2021-10-29
### Agregado

- Codigo fuente del proyecto para comenzar las entregas por tags. 

[1.1.8]: https://gitlab-distra.xutil.net/distra/logistica/distra/activos_fijos/-/tags/1.1.8
[1.1.7]: https://gitlab-distra.xutil.net/distra/logistica/distra/activos_fijos/-/tags/1.1.7
[1.1.6]: http://gitlab-distra.xutil.net/distra/logistica/distra/activos_fijos/-/tags/1.1.6
[1.1.4]: http://gitlab-distra.xutil.net/distra/logistica/distra/activos_fijos/-/tags/1.1.4
[1.1.5]: http://gitlab-distra.xutil.net/distra/logistica/distra/activos_fijos/-/tags/1.1.5
[1.1.2]: http://gitlab-distra.xutil.net/distra/logistica/distra/activos_fijos/-/tags/1.1.2
[1.1.1]: http://gitlab-distra.xutil.net/distra/logistica/distra/activos_fijos/-/tags/1.1.1
[1.1.0]: http://gitlab-distra.xutil.net/distra/logistica/distra/activos_fijos/-/tags/1.1.0
[1.0.10]: http://gitlab-distra.xutil.net/distra/logistica/distra/activos_fijos/-/tags/1.0.10
[1.0.9]: http://gitlab-distra.xutil.net/distra/logistica/distra/activos_fijos/-/tags/1.0.9
[1.0.8]: http://gitlab-distra.xutil.net/distra/logistica/distra/activos_fijos/-/tags/1.0.8
[1.0.5]: http://gitlab-distra.xutil.net/distra/logistica/distra/activos_fijos/-/tags/1.0.5
[1.0.4]: http://gitlab-distra.xutil.net/distra/logistica/distra/activos_fijos/-/tags/1.0.4
[1.0.3]: http://gitlab-distra.xutil.net/distra/logistica/distra/activos_fijos/-/tags/1.0.3
[1.0.2]: http://gitlab-distra.xutil.net/distra/logistica/distra/activos_fijos/-/tags/1.0.2
[1.0.1]: http://gitlab-distra.xutil.net/distra/logistica/distra/activos_fijos/-/tags/1.0.1
[1.0.0]: http://gitlab-distra.xutil.net/distra/logistica/distra/activos_fijos/-/tags/1.0.0
