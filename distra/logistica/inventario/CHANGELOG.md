# Registro de cambios 
Todos los cambios notables de este proyecto se documentarán en este archivo. 

El formato se basa en [Mantenga un registro de cambios](https://configuracion-ge.prod.xetid.cu/doku.php?id=div:gest_conf:desarrollo:desarrollo:git:git_tags_registro_cambios),
 y este proyecto se adhiere a [Versionado Semántico](https://configuracion-ge.prod.xetid.cu/doku.php?id=div:gest_conf:desarrollo:desarrollo:git:git_tags_nomenclatura).


## [1.2.0] - 2023-01-16
### Agregado
- Se agregaron las columnas para el trabajo del sistema en farmacia .

## [1.1.0] - 2022-10-11
### Agregado
- Se agregó la funcionalidad nueva Transferencia interna al módulo de inventario .

## [1.0.16] - 2022-06-21
### Reparado
- Se permite recepcionar transferencias que ya habian sido recepcionadas y canceladas las recepciones.

## [1.0.13] - 2022-03-29
### Reparado
- Corrigiendo que los vales de salida se puedan contabilizar al ser generados por una distribución.

## [1.0.12] - 2022-03-24
### Modificado
- Modificando los datos del documento origen en la ventana de adicionar y modificar solicitud de entrega.

## [1.0.11] - 2022-03-15
### Modificado
- Se modifica en el componente de firmas el creado por, incorporando el solicitado por.
- Modificar el pie de firma del reporte modelo del documento solicitud de entrega.

## [1.0.10] - 2022-03-08
### Agregado
- Agregando datos del documento origen para la solicitud de entrega.

## [1.0.9] - 2022-03-04
### Agregado
- Se agrega opcion para poder exportar los movimientos del periodo en el submayor de inventario.
- Se agrega opcion para poder imprimir los movimientos del periodo por clasificacon contableen el submayor de inventario.
- Se permite buscar todos los documentos para hacer devoluciones.

## [1.0.8] - 2022-02-22
### Agregado
- Se muestran en una columna cuando un producto se tiene que desubicar en salida

## [1.0.7] - 2022-02-21
### Agregado
- Se muestran los lotes por productos en el submayor de inventario
- Se muestra el numero de comprobante en los documentos de devolucion
- Para realizar las conversiones se necesita que salga el lote y vencimiento y no esta esa opción, es decir en el inventario del submayor del almacén debe reflejar otra columna con el lote y vencimiento

### Reparado
- Conflicto al recepcionar transferencias con productos de categorias diferentes o sin categorias

## [1.0.6] - 2022-01-27
### Agregado
- Columna descripcion en los documentos externos de la recepcion por transferencia.
## [1.0.5] - 2022-01-24
### Reparado

- Corrigiendo guardar condicion de pago en cualquier estado del documento mientras no tenga comprobante generado

## [1.0.4] - 2021-12-15
### Reparado

- Corrigiendo calculo del importe de los informes de recepcion
### Modificado

- Servicios de cargar documentos de salidas acepta varias operaciones a filtrar.

## [1.0.2] - 2021-11-17
### Reparado

- Actualización del reporte vale de salida.

## [1.0.1] - 2021-11-16
### Reparado

- Actualización del reporte de lento movimiento. 

- Arreglo de bug en recepción.

## [1.0.0] - 2021-10-29
### Agregado

- Codigo fuente del proyecto para comenzar las entregas por tags. 
[1.2.0]: https://gitlab-distra.xutil.net/distra/logistica/distra/inventario/-/tags/1.2.0
[1.1.0]: https://gitlab-distra.xutil.net/distra/logistica/distra/inventario/-/tags/1.1.0
[1.0.16]: https://gitlab-distra.xutil.net/distra/logistica/distra/inventario/-/tags/1.0.16
[1.0.9]: http://gitlab-distra.xutil.net/distra/logistica/distra/inventario/-/tags/1.0.9
[1.0.8]: http://gitlab-distra.xutil.net/distra/logistica/distra/inventario/-/tags/1.0.8
[1.0.7]: http://gitlab-distra.xutil.net/distra/logistica/distra/inventario/-/tags/1.0.7
[1.0.6]: http://gitlab-distra.xutil.net/distra/logistica/distra/inventario/-/tags/1.0.6
[1.0.5]: http://gitlab-distra.xutil.net/distra/logistica/distra/inventario/-/tags/1.0.5
[1.0.4]: http://gitlab-distra.xutil.net/distra/logistica/distra/inventario_apps/-/tags/1.0.4
[1.0.3]: http://gitlab-distra.xutil.net/distra/logistica/distra/inventario_apps/-/tags/1.0.3
[1.0.2]: http://gitlab-distra.xutil.net/distra/logistica/distra/inventario_apps/-/tags/1.0.2
[1.0.1]: http://gitlab-distra.xutil.net/distra/logistica/distra/inventario_apps/-/tags/1.0.1
[1.0.0]: http://gitlab-distra.xutil.net/distra/logistica/distra/inventario_apps/-/tags/1.0.0
