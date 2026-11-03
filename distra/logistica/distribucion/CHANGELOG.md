# Registro de cambios 
Todos los cambios notables de este proyecto se documentarán en este archivo. 

El formato se basa en [Mantenga un registro de cambios](https://configuracion-ge.prod.xetid.cu/doku.php?id=div:gest_conf:desarrollo:desarrollo:git:git_tags_registro_cambios),
 y este proyecto se adhiere a [Versionado Semántico](https://configuracion-ge.prod.xetid.cu/doku.php?id=div:gest_conf:desarrollo:desarrollo:git:git_tags_nomenclatura).

 ## [1.0.30] - 2024-05-17
### Modificado
- Trazabilidad del pedido.

 ## [1.0.24] - 2023-05-02
### Modificado
- Fue corregido el adicionar y el eliminar observaciones en el balanceo de pedidos

 ## [1.0.21] - 2023-02-21
### Modificado
- Realizar balanceo por el producto sustituto.
- En el pedido dejar la trazabilidad de que el producto se cambió por otro.
- En el botón Sustito adicionar los sustitutos de un producto.
- Crear botón Sustituir.
- En el exportar en excel del Balanceo de pedidos incluir las observaciones.

## [1.0.19] - 2023-01-23
### Modificado
- Permitir confirmar un pedido aunque el cliente tenga pendiente a realizar alguna distribución.

## [1.0.18] - 2023-01-20
### Modificado
- Se cambió donde se guardaban las observaciones del balanceo de pedidos para la tabla dat_docobservaciones

## [1.0.16] - 2022-12-13
### Modificado
- Corregido error interno en gestionar pedido cuando el pedido es generado desde Cita.

## [1.0.15] - 2022-12-08
### Agregado
- Corregida la busqueda avanzada en Balanceo de Pedidos

## [1.0.14] - 2022-12-08
### Agregado
- Corregido error interno al adicionar un pedido en gestionar pedidos.
- Modificado script de la tabla dat_documentocl

## [1.0.13] - 2022-12-07
### Agregado
- Corregido el nomenclador de concepto en el campo tipo de documento.

## [Nuevo]
## [1.0.12] - 2022-12-07
### Agregado
  Fueron resueltas las siguentes incidencias:
- Arreglar nomenclador de concepto en el campo tipo de documento.
- Cuando se adicione un pedido a partir de un documento mostrar el estado que le corresponde.
- Implementar funcionalidad Búsqueda avanzada del Balanceo de pedido.
- Script de la tabla dat_documentocl modificado


## [Nuevo]
## [1.0.11] - 2022-12-1
### Agregado
- Funcionalidad Búsqueda avanzada del Balanceo de pedido.

## [Nuevo]
## [1.0.10] - 2022-11-29
### Agregado
- En la ventana de Adicionar pedido, la capacidad líquida es por producto no por documento
- Actualizado el ícono de la columna Capacidad líquida en el Gestionar pedidos si hay al menos un producto que tiene dicho elemento señalado
- En la búsqueda avanzada de pedido incluido el combo de Tipo de pedido, ademas filtro de fechas para poder filtrar los pedidos en un periodo determinado
- En la búsqueda avanzada de pedido incluido en el combo de tipo de documento de origen, "Cita" y "ABC"
- En la funcionalidad adicionar pedido poner el combo de Tipo de pedido.
- Script del campo idnomconcepto en la tabla dat_pedido que guarda el id del tipo de pedido.
- Script de la tabla dat_documentocl que guarda los productos del pedido con capacidad liquida.

## [Nuevo]
## [1.0.6] - 2022-05-16

### Modificado

- (Balanceo) Se muestra para cada producto el número del documento de la distribucion generada al aprobar el balanceo.

## [Nuevo]
## [1.0.3] - 2022-03-22

### Agregado

- Agregando el reporte de imprimir orden de compra.
- Se habilita generar la solicitud de compra al aprobar el documento de balanceo.

### Reparado

- Cargar almacenes en la configuracion de balanceo.

## [Nuevo]
## [1.0.2] - 2021-12-09
### Reparado

- Mejorar el tiempo y rendimiento en el que se cargan los documentos de distribución

## [1.0.1] - 2021-11-15
### Reparado

- Arreglo de bug

## [1.0.0] - 2021-10-29
### Agregado

- Codigo fuente del proyecto para comenzar las entregas por tags. 

[Nuevo]: http://gitlab-distra.xutil.net/distra/logistica/distra/distribucion/-/tree/master
[1.0.30]: http://gitlab-distra.xutil.net/distra/logistica/distra/distribucion/-/tags/1.0.30
[1.0.24]: http://gitlab-distra.xutil.net/distra/logistica/distra/distribucion/-/tags/1.0.24
[1.0.21]: http://gitlab-distra.xutil.net/distra/logistica/distra/distribucion/-/tags/1.0.21
[1.0.19]: http://gitlab-distra.xutil.net/distra/logistica/distra/distribucion/-/tags/1.0.19
[1.0.18]: http://gitlab-distra.xutil.net/distra/logistica/distra/distribucion/-/tags/1.0.18
[1.0.16]: http://gitlab-distra.xutil.net/distra/logistica/distra/distribucion/-/tags/1.0.16
[1.0.15]: http://gitlab-distra.xutil.net/distra/logistica/distra/distribucion/-/tags/1.0.15
[1.0.14]: http://gitlab-distra.xutil.net/distra/logistica/distra/distribucion/-/tags/1.0.14
[1.0.13]: http://gitlab-distra.xutil.net/distra/logistica/distra/distribucion/-/tags/1.0.13
[1.0.12]: http://gitlab-distra.xutil.net/distra/logistica/distra/distribucion/-/tags/1.0.12
[1.0.11]: http://gitlab-distra.xutil.net/distra/logistica/distra/distribucion/-/tags/1.0.11
[1.0.10]: http://gitlab-distra.xutil.net/distra/logistica/distra/distribucion/-/tags/1.0.10
[1.0.6]: http://gitlab-distra.xutil.net/distra/logistica/distra/distribucion/-/tags/1.0.6
[1.0.3]: http://gitlab-distra.xutil.net/distra/logistica/distra/distribucion/-/tags/1.0.3
[1.0.2]: http://gitlab-distra.xutil.net/distra/logistica/distra/distribucion/-/tags/1.0.2
[1.0.1]: http://gitlab-distra.xutil.net/distra/logistica/distra/distribucion/-/tags/1.0.1
[1.0.0]: http://gitlab-distra.xutil.net/distra/logistica/distra/distribucion/-/tags/1.0.0
