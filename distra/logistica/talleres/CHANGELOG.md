# Registro de cambios 
Todos los cambios notables de este proyecto se documentarán en este archivo. 

El formato se basa en [Mantenga un registro de cambios](https://configuracion-ge.prod.xetid.cu/doku.php?id=div:gest_conf:desarrollo:desarrollo:git:git_tags_registro_cambios),
 y este proyecto se adhiere a [Versionado Semántico](https://configuracion-ge.prod.xetid.cu/doku.php?id=div:gest_conf:desarrollo:desarrollo:git:git_tags_nomenclatura).

## [1.1.0] - 2023-01-18
### Agregado

- Se agrego todo lo relacionado con el sistema para autochap

## [1.0.11] - 2022-11-18
### Agregado

- Realizar recuperaciones de orden de factura y cuadre de proceso para el módulo de talleres.
- Generar pedidos y órdenes de trabajo a partir de la gestión de una cita. 
- Generar pedidos a partir de una  orden de trabajo.
- Utilizar órdenes de trabajo con o sin contratos, según la configuración que se gestione.

### Modificado

- Cambiar la configuración de las actividades y talleres para ser utilizado en las funcionalidades de talleres.
- Modificar la estructura del reporte de modelo de cita.
- Concatenar los datos a mostrar en la columna de nro de cita a (nro de cita.codigode agencia.año).
- Corregir el campo de texto para mostrar los datos del medio en cita.
- Visualizar la referencia(ref) o número del documento(doc) del pedido generado en la cita.


## [1.0.4] - 2022-06-21
### Agregado

- Permite seleccionar equipo registrado al cliente en el maestro de clientes y proveedores para enviar al taller 

## [1.0.0] - 2021-10-29
### Agregado

- Codigo fuente del proyecto para comenzar las entregas por tags. 

[1.1.0]: https://gitlab-distra.xutil.net/distra/logistica/distra/talleres/-/tags/1.1.0
[Nuevo]: http://gitlab-distra.xutil.net/distra/logistica/distra/talleres_apps/-/tree/master
[1.0.4]: https://gitlab-distra.xutil.net/distra/logistica/distra/talleres/-/tags/1.0.4
[1.0.0]: http://gitlab-distra.xutil.net/distra/logistica/distra/talleres_apps/-/tags/1.0.0
