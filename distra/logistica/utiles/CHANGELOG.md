# Registro de cambios 
Todos los cambios notables de este proyecto se documentarán en este archivo. 

El formato se basa en [Mantenga un registro de cambios](https://configuracion-ge.prod.xetid.cu/doku.php?id=div:gest_conf:desarrollo:desarrollo:git:git_tags_registro_cambios),
 y este proyecto se adhiere a [Versionado Semántico](https://configuracion-ge.prod.xetid.cu/doku.php?id=div:gest_conf:desarrollo:desarrollo:git:git_tags_nomenclatura).

## [1.1.6] - 2023-02-21
## Reparado
- Actualización del sustituto en el balanceo de pedidos

## [1.0.46] - 2023-01-20
## Reparado
- Se cambió donde se guardaban las observaciones del balanceo de pedidos para la tabla dat_docobservaciones

## [1.0.45] - 2022-12-08
## Reparado
- Corregida la busqueda avanzada en Balanceo de Pedidos.

## [1.1.0] - 2023-01-16
## Agregado
- Se agrego todo lo relacionado con el sistema para farmacia

## [1.0.43] - 2022-12-07
## Reparado
- Corregido el nomenclador de concepto en el campo tipo de documento.

## [1.0.38] - 2022-11-24
## Reparado
- Solucionando problema para mostrar el codigo del producto en el maestro de productos 

## [1.0.36] - 2022-11-18
## Agregado
- Funcionalidad para utilizar los contratos en talleres.

## [1.0.35] - 2022-11-15
## Agregado
- Funcionalidad para importar al maestro de productos y servicios.

## [1.0.23] - 2022-07-05
## Agregado
- Corrigiendo error al filtrar por centro de costo las Ordenes de trabajo.

## [1.0.20] - 2022-06-01
## Agregado
- Corrigiendo error al cargar la configuracion de produccion.

## [1.0.6] - 2022-02-21
## Agregado
- Se devuelve el idcomprobante al devolver los documentos para mostrar el numero de comprobante segun corresponda

## [1.0.5] - 2022-02-09
## Reparado
- Arreglado el tiempo de espera en el cargar ubicaciones de los productos
- Arreglado el conteo de inventario para que muestre los productos sin existencias

## [1.0.4] - 2022-01-27
## Reparado
- Duplicado de documento que se estaban creado con el estado del documento original y no en elaboracion
- Mostrar el nombre de los depositos de entrega en los documentos de salidad de inventario que no se mostraba
- Eliminar documento que no eliminaba fisicamente el ultimo documento y poner como anulado los anteriores

## [Nuevo]
## [1.0.4] - 2022-01-25
### Reparado

- Funcionalidad cargar clientes de los documentos.

## [1.0.3] - 2021-12-08
### Reparado

- Funcionalidad filtrar clientes.

### Agregado

- Crear demandas de compra.

## [1.0.2] - 2021-11-24
### Reparado

- Cancelar un documento que tenia liquidaciones registradas y se quedaba bloqueado.
- Cierre de depositos.

## [1.0.1] - 2021-11-16
### Eliminado

- Dualidad monetaria en recuperaciones de inventario.

### Cambió

- ID único para bloquear que no se dupliquen los documentos cancelados.


## [1.0.0] - 2021-10-29
### Agregado

- Codigo fuente del proyecto para comenzar las entregas por tags. 
[1.1.0]: https://gitlab-distra.xutil.net/distra/logistica/distra/utiles/-/tags/1.1.0
[1.1.6]: https://gitlab-distra.xutil.net/distra/logistica/distra/utiles/-/tags/1.1.6
[1.0.46]: https://gitlab-distra.xutil.net/distra/logistica/distra/utiles/-/tags/1.0.46
[1.0.45]: https://gitlab-distra.xutil.net/distra/logistica/distra/utiles/-/tags/1.0.45
[1.0.43]: https://gitlab-distra.xutil.net/distra/logistica/distra/utiles/-/tags/1.0.43
[1.0.38]: https://gitlab-distra.xutil.net/distra/logistica/distra/utiles/-/tags/1.0.38
[1.0.23]: https://gitlab-distra.xutil.net/distra/logistica/distra/utiles/-/tags/1.0.23
[1.0.20]: http://gitlab-distra.xutil.net/distra/logistica/distra/utiles/-/tags/1.0.20
[1.0.6]: http://gitlab-distra.xutil.net/distra/logistica/distra/utiles/-/tags/1.0.6
[1.0.5]: http://gitlab-distra.xutil.net/distra/logistica/distra/utiles/-/tags/1.0.5
[1.0.4]: http://gitlab-distra.xutil.net/distra/logistica/distra/utiles/-/tags/1.0.4
[1.0.3]: http://gitlab-distra.xutil.net/distra/logistica/distra/utiles_apps/-/tags/1.0.3
[1.0.2]: http://gitlab-distra.xutil.net/distra/logistica/distra/utiles_apps/-/tags/1.0.2
[1.0.1]: http://gitlab-distra.xutil.net/distra/logistica/distra/utiles_apps/-/tags/1.0.1
[1.0.0]: http://gitlab-distra.xutil.net/distra/logistica/distra/utiles_apps/-/tags/1.0.0
