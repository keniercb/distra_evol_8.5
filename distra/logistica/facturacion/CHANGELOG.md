# Registro de cambios 
Todos los cambios notables de este proyecto se documentarán en este archivo. 

El formato se basa en [Mantenga un registro de cambios](https://configuracion-ge.prod.xetid.cu/doku.php?id=div:gest_conf:desarrollo:desarrollo:git:git_tags_registro_cambios),
 y este proyecto se adhiere a [Versionado Semántico](https://configuracion-ge.prod.xetid.cu/doku.php?id=div:gest_conf:desarrollo:desarrollo:git:git_tags_nomenclatura).

## [Nuevo]
## [1.0.10] - 2022-03-30
### Reparado

- Se quita la seleccion de las estructuras como entidad transportadora.

## [1.0.9] - 2022-03-03
### Reparado

- Se quita obligatorio la condicion de pago en la factura

## [1.0.8] - 2022-02-24
### Reparado

- Se arregla envio de parametros de la busqueda avanzada al reporte

### Agregado

- Se adiciona el centro de costo en la busqueda avanzada
- Se adiciona el centro de costo como otro criterio de busqueda en el reporte de facturas emitidas en las recuperaciones de facturacion
- Se permite modificar la condicion de pago en la factura mientras esta no tenga comprobante registrado

## [1.0.7] - 2022-02-21
### Reparado

- Actualizacion de los documentos despues de contabilizarlos y generar cmprobante automatico

## [1.0.6] - 2022-02-11
### Reparado

- Funcionalidad para desbloquear facturas

## [1.0.5] - 2022-02-08
### Reparado

- Paginado de la ventana que carga las distribuciones para generar factura

### Agregado
- Se adiciona en la configuracion de las series la activacion y desactivacion de las series y vida de las series dado un rango de fecha
- Se reinicia el numero de factura asociado a una serie al iniciar el año
- Busqueda de facturas por centro de costo

## [1.0.4] - 2022-01-31
### Reparado

- Se admite parametro tipo objeto en el servicio que adiciona una factura

## [1.0.3] - 2022-01-28
### Agregado

- Se adiciona servicio SOAP para adicionar factura

## [1.0.3] - 2022-01-28
### Agregado

-Se adiciona servicio SOAP para adicionar facturas

## [1.0.2] - 2021-11-25
### Reparado

- Arreglo de bug al generar el pedido de una oferta que se quedaba la mascara cargando
- Arreglo al mostrar el numero del pedido generado de una oferta que mostraba null
- Arreglo en el comportamiento de los conceptos de tipo capacidad liquida que no suman ni restan al total de la factura

### Agregado

- Se adiciona en la configuracion de facturacion nuevo modo de calculo de precio centralizado tomando como referencia menor costo, mayor costo o precio promedio

## [1.0.1] - 2021-11-16
### Reparado

- Arreglo de bug en el cancelar factura

## [1.0.0] - 2021-10-29
### Agregado

- Codigo fuente del proyecto para comenzar las entregas por tags. 

[Nuevo]: http://gitlab-distra.xutil.net/distra/logistica/distra/facturacion_apps/-/tree/master
[1.0.10]: https://gitlab-distra.xutil.net/distra/logistica/distra/facturacion/-/tags/1.0.10
[1.0.9]: http://gitlab-distra.xutil.net/distra/logistica/distra/facturacion/-/tags/1.0.9
[1.0.8]: http://gitlab-distra.xutil.net/distra/logistica/distra/facturacion/-/tags/1.0.8
[1.0.7]: http://gitlab-distra.xutil.net/distra/logistica/distra/facturacion/-/tags/1.0.7
[1.0.6]: http://gitlab-distra.xutil.net/distra/logistica/distra/facturacion/-/tags/1.0.6
[1.0.5]: http://gitlab-distra.xutil.net/distra/logistica/distra/facturacion/-/tags/1.0.5
[1.0.4]: http://gitlab-distra.xutil.net/distra/logistica/distra/facturacion/-/tags/1.0.4
[1.0.3]: http://gitlab-distra.xutil.net/distra/logistica/distra/facturacion/-/tags/1.0.3
[1.0.1]: http://gitlab-distra.xutil.net/distra/logistica/distra/facturacion_apps/-/tags/1.0.1
[1.0.0]: http://gitlab-distra.xutil.net/distra/logistica/distra/facturacion_apps/-/tags/1.0.0
