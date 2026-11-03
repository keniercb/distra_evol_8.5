# Registro de cambios 
Todos los cambios notables de este proyecto se documentarán en este archivo. 

El formato se basa en [Mantenga un registro de cambios](https://configuracion-ge.prod.xetid.cu/doku.php?id=div:gest_conf:desarrollo:desarrollo:git:git_tags_registro_cambios),
 y este proyecto se adhiere a [Versionado Semántico](https://configuracion-ge.prod.xetid.cu/doku.php?id=div:gest_conf:desarrollo:desarrollo:git:git_tags_nomenclatura).


 ## [2.0.30] - 2024-08-30
### Reparado
- No permitir que se caiga la máscara hasta que no termine el proceso a la hora de obtener los elementos en Reportes y certificaciones


 ## [2.0.29] - 2024-08-15
### Reparado
- Cambiar en el reporte de nómina el nombre de la entidad, sale con las tildes cambiadas por caracteres.
- Se resuelven las NC 93946, 93473, 93492, 94561 y 93482. Cuando se exporta en reportes y certificaciones, las personas salían dobles.
- Se corrige error al actualizar pago

### Modificaciones
- Cuando se mueve un trabajador de una entidad a otra, que se realiza el reporte de ese trabajador en la nueva entidad, aparece como que trabajo por las dos entidades 190.6 horas en la asistencia (CIMEX)
- SC. Permitir deshabilitar el btn Aprobar, Certificar, Elaborar para algunos roles o usuarios. (btnCertificarTodosNomina, btnElaborar, btnContabilizar, btnAprobarTodasNomina)
- Se elimina la condición de que el reporte tiene que estar aprobado para exportar los datos.

### Agregado
- SC. Se adiciona el reporte Listado de personas por cajero en Depositar salarios (CIMEX)


## [2.0.4] - 2023-10-17
### Modificaciones
- Modificaciones en el combo para seleccionar la operacion contable en condiciones para las retenciones
- Ordenando por plantilla nominal el listado del historico de retenciones de personas bajas
- Correcion del label de entidades subordinadas en depositar salarios 

### Agregado
- Cuadrar por nominas en el submayor de retenciones
- Ordenando por plantilla nominal el listado del historico de retenciones de personas bajas
- Validaciones para cuando se vaya a eliminar un concepto y este usado en conceptos generales de nomina
 
## [2.0.3] - 2023-09-27
### Reparado
- Se corrigieron las paginaciones de nomina
- Se arregló el orden por estructura de las personas

### Agregado
- Validación para la exportación del registro de salarios para un tipo de nómina obligatorio
- Validar en Asociar persona a centro de costo que solo muestre las cuentas bancarias que no tienen fecha fin
- Se adicionó una opción para el comportamiento del reporte de SC-4-04 en Reportes y Certificaciones

## [1.9.2] - 2022-12-20
### Reparado
- Se corrigió el panel de exportar en Gestión de Reportes y Certificaciones
- Se arregló el pdf de los talones de pagos que salian picados al saltar de hoja
- Se corrigió el cuadrar submayor de las retenciones



## [1.9.1] - 2022-10-31
### Reparado
- Resuelto error interno al eliminar una escala en Elementos salariales al cargo.

## [1.9.0] - 2022-07-14
### Agregado
- Cambio para que el Sistema se conecte al Servidor de Correo segun el fichero json de configuracion que pongan en el servidor de aplicaciones.
- Se agrego otro fichero json para conectarse al servidor de correos de la UNE.


### Reparado
- Se corrigieron los Parametros del Correo de Xetid.
- Sql para arreglar el historico del Registro de Salario y Tiempo de Servicio. Se modifico el trigger de eliminar en mod_nomina.dat_cargosocupados para que no elimine en el Registro de Salario y Tiempo de Servicio.


## [1.8.0] - 2022-07-14
### Agregado
- Cambios en la Configuracion del Registro de Slararios y Tiempo de Servicios para poder Configurar varias Variables para el Calculo de las Vacaciones Adelantadas.
- En Estructurar Modelos de Nominas se puso la Opcion de poder Acumular en el SNC un mes Anterior o Posterior al Periodo de Pago.
- Se modifico la funcionalidad de Gestionar Registro de Salarios y Tiempo de Servicio para que las Vacaciones Adelantadas se acumulan un mes posterior al mes del pago la Nomina.
- Se le quito a la Configuracion del Pago por Resultados que el Reporte de Salida sea obligatorio.
- Se Modifico la Funcion Guardar de la Configuracion del Pago por Resultados para poder Guardar Indicadores sin Reporte de Salida Configurado.
- Sincronizacion automatica de los Cargos Nuevos de la Estructura en las Plantillas Nominales cuando estas se listan.
- Se le agrego el Salario Escala al Componente de Expresiones Matematicas de la Configuracion del Pago por Resultados.
-Implementacion en el Calculo del Pago por Resultados Generico para poder calcular el Salario Escala.
- En Gestionar Cargos Ocupados se optimizo el multiple select de el Grid de las Personas.
- En la Funcionalidad de Elementos Salariales a la Persona se Optimizo el multiple select.
- Se puso un boton para Actualizar los Cargos de las Personas Seleccionadas desde Movimientos Laborales de forma Automatica.
-  Se Implemento una Funcionalidad para Actualizar los Cargos de las Personas Seleccionadas desde Movimientos Laborales de forma Automatica.

### Reparado
- Se le puso al Calculo de las Formulas en Gestionar Reportes y Certificaciones que redondee a los lugares decimales de la configuracion de las Variables del Reporte.

## [1.7.0] - 2022-05-23
### Agregado
- Ya se le cambia automaticamente el Estado a todos los Reportes que coincidan con el rango de fecha de la Nomina y esten Configurados en Formas y Sistemas de Pago.

### Reparado
- Se arreglo el Calculo de los valores del SNC en las Formulas de los Reportes.

## [1.6.0] - 2022-05-17
### Agregado
- Cambios en la Configuracion de los Ficheros del Banco para Configurar el TXT de BPA. 
    . Cuando la Configuracion es Manual se puso en el Formulario si se va a Exportar un DBF o un TXT(BPA).	
	. Se agrego Para el fichero TXT:  cod_centro_pago_bpa, cod_sucursal_bpa, cod_banco_bpa.
- En Depositar Salarios se Implemento la Exportacion del Fichero TXT para la Acreditacion del Salario en BPA.
- Se Implemento en Gestionar Reportes y Certificaciones la forma de poder Exportar los Excel con Encabezado y sin Encabezado. El Excel sin Encabezados sirve para importalo luego.
- Se Implemento las Contabilizacion de BICSA a partir de Sustituciones Dinamicas.

### Reparado
- En la Configuracion del Pago por Resultados se habilito para que se pueda Replicar hasta el ultimo nivel.
- En Depositar Salarios se quito el Menu para Exportar los DBF de CUC.
- Cambios en la Notificacion de Licencias y Subsidios.
- Se resolvio el problema que habia en la Nomina con las Personas con Situaciones del Servicio que no cojian los valores de los Reportes.
- SIGERH: Ahora el SNC tiene varios comportamientos:
    . Si "mod_rrhhmaestro.dat_modulo.sncsigerh = 1" entonces el SNC lista a las Personas desde el Registro de Personas sin compartimentarlas por entidades. Sistema SIGERH.	
    .. Si "mod_rrhhmaestro.dat_modulo.sncsigerh != 1" entonces el SNC lista a las Personas que esten de Alta en Asociar Personas a Cantros de Costo compartimentadas por entidades. Sistema DISTRA.	
- En la Nomina se Implemento para que las Retenciones se apliquen una sola vez al mes. Con esto se arregla el tema de las Retenciones en los Pagos Quincenales o Semanales en las Nominas.
- Se arreglo el mareo que habia entre los combo box de los Tipos de Pago en Elaborar Pagos.
	
## [1.3.0] - 2022-01-27
### Agregado
- Se agrega a acumular en el Registro de Salarios y Tiempo de Servicio la fecha de inicio del Periodo.
- Modelo SC-4-04 de Notificaciones De Licencias y Subsidios.

### Reparado
- Se elimina el boton de Exportar Personas de Caja en Depositar Salarios.
- Se corrige en el mensaje de dar Alta en Asociar Personas a Centros de Costo.
- Se corrigen faltas de ortografía al Contabilizar la Nomina.
- Corrección de faltas de ortografía en las Nominas.
- Corrección de la acción Sincronizar Centros de Costo en Asociar Personas a Centros de Costo desde las Plantillas Nominales.
- Se arreglo en Estructurar Modelos de Nomina el problema que daba cuendo se trataba de Modificar el Neto y este Campo es un Concepto de Pago Salario.
- Se corrige el Excel de la Contabilizacion de las Nominas por Centros de Costo.
- Se incorporan mejoras en la acción del botón "Calcular Acumulados" del Reporte de Vacaciones ya calcula y redondea a la cantidad de lugares especificados en la columna "lugaresdecimales" del campo Importe(iftipovariable = 2 en confvariablestiposreportescertificaciones).
- Correcciones en Depositar Salarios el Orden descendente de los Cierres del Historico.
- Se corrige el orden de las Operaciones del Historico del Submayor de Retenciones.
- Se corrige la acción del Botón 'Recargar' de los Reportes redondea a los lugares decimales que tenga la columna especificada en la configuracion
- Se elimina el inicio y limite de elementos en el historico del submayor de vacaciones.
- Se corrige la acción de Replicar de Configurar Formas y Sistemas de Pago. Se abrió el árbol de la Estructura a Replicar hasta el ultimo nivel.
- Mejoras en Elementos Salariales al Cargo. Para que solo se listen los Conceptos de Percepcion y Descuento que son Escalas de Valores.
- Se corrige el problema de los Consecutivos de las Nominas.
- Se corrige la acción de Replicar de Configurar Conceptos Generales de Nomina. Se abrio el arbol de la Estructura a Replicar hasta el ultimo nivel.
- Se corrige en la acción Replicar de Estructurar Modelos de Nomina. Se abrio el arbol de la Estructura a Replicar hasta el ultimo nivel.
- En Depositar Salarios se elimina el Exportar el DBF de CUC en el Menu de Exportar.
- En Depositar Salarios se quito el Exportar de las Personas de Caja ya que este reporte no se usa.

## [1.2.1] - 2022-01-27
### Reparado
- Error al modificar el Neto (Concepto de Pago Salario) en Estructurar Modelos de Nómina.
- Se suprime el botón Exportar Personas de Caja en Depositar Salarios.
- Correccón del mensaje de dar alta en Asociar Personas a Centros de Costo-
- Corrección del orden (descendente) de los cierres del hitórico en Depositar salarios.
- Corrección de faltas de ortografía al contabilizar la nómina.
- Corrección de faltas de ortografía en las nóminas.
- Corrección de la sincronización de centros de costos al Asociar Personas a Centro de Costo desde las plantillas nominales.
- Corrección del Excel de la Contabilizacion de las Nominas por Centros de Costo.
- Correcciñon del botón "Calcular Acumulados" del Reporte de Vacaciones (calcula y redondea a la cantidad de lugares especificados en la columna "lugaresdecimales" del campo Importe(iftipovariable = 2 en confvariablestiposreportescertificaciones)).
- Se corrige el orden de las Operaciones del Historico del Submayor de Retenciones.
- Corrección del botón 'Recargar' de los Reportes redondea a los lugares decimales que tenga la columna especificada en la configuracion.
- Corrección de los límites (limit y start) en en el historico del submayor de vacaciones
- Eliminando el FASTCGI ya que se estan aplicando dobles las Retenciones.
- Modificación de los Elementos Salariales al Cargo para que solo se listen los Conceptos de Percepcion y Descuento que son Escalas de Valores.

## [1.2.0] - 2021-12-01
### Agregado
- Validacion en la Contabilizacion de la Nominas para validar que a una persona no pueda cobrar mas Importe por una Nomina de Reintegro que el saldo pendiente a liquidar que tiene la Cuenta Por Cobrar en Finanzas.
- Se le agrego al Reporte de la Nomina la Cantidad de Trabajadores.
### Reparado
- Corrección de la forma de guardarse los Montos de los Conceptos Contables en la Nomina. Esto resuelve la No Conformidad de que hay obligaciones que no viajan a Finanzas->Cobros y Pagos.
- Corrección de la Importacion  del SNC para que el Sistema pueda leer tanto numeros con comas como con puntos:
Formatos permitidos: 3000.25 o 3000,25
Formatos no permitidos: 3.000,25
- Se corrige para que solo salgan las Plantillas Nominales de las personas de la Nomina.

## [1.1.0] - 2021-11-11
### Agregado
- Se adicionó un nuevo botón en el panel de Períodos de pago, para recargar los mismos, en el caso que se elimine un nomenclador de Períodos de pagos o no esté configurado correctamente.
- Se activaron las teclas calientes de los botones del Configurar períodos de pagos.
### Reparado
- Validacion en la Contabilizacion de la Nominas para validar que a una persona no pueda cobrar mas Importe por una Nomina de Reintegro que el saldo pendiente a liquidar que tiene la Cuenta Por Cobrar en Finanzas.
- Validacion para que no se puedan poner dos Campos en Estructurar Modelos de Nomina con Concepto Pago Salario habilitado.

## [1.0.1] - 2021-10-31
### Cambió
- Poniendole el Numero Consecutivo a cada persona en Elaborar Pagos.
- Quitando la fecha de aplicacion de Asociar Personas a Centros de Costo en la Nomina.
- En el nomenclador de tipo de pago si no se ha seleccionado algún tipo, se deshabilita el panel y el botón de Adicionar dependencias.
### Reparado
- Se arreglo la Integracion con Finanzas - Caja. Ya salen todas las personas de la Caja para Liquidar la Nomina.
- Arreglo en los reportes del submayor de retenciones para que coja el Carnet principal.
- Limpiando el Grid de las personas de caja, el del cajero, los grid de los desgloses y los montos en cup y cuc cuando se selecionen los Periodos de Pago en Depositar Salarios.
- En el nomenclador de Tipos de conceptos de percepciones y descuentos en las ventanas de Adicionar y Modificar ya funciona la tecla caliente del Enter para guardar los datos.
- En el nomenclador de Formas y sistemas de pagos al modificar ya funciona la tecla caliente del Enter para aceptar la modificación.
- En el nomenclador de Formas y sistemas de pagos ya funcionan las teclas calientes de los botones del panel Listado de sistemas de pago.
- Arreglo en la fecha de registro de Asociar Personas a Centros de Costo para que el ultimo dia activado sea la fecha actual.
- El botón Adicionar del panel (Listado de las dependencias de los tipos de pago) ya tiene una nueva combinación de teclas calientes, ya funcionan las teclas calientes para el panel de dependencias.
- Cuando se modifica algún campo en el formulario de Nomenclador de Períodos de pagos y se presiona la tecla enter ya se guardan los datos correctamente.
- En la Configuración de registros de salarios y tiempo de servicio, se arreglaron los botones ¨Aplicar¨ al adicionar una variable del SNC y al adicionar una variable auxiliar.
- La ventana correspondiente a la acción de Adicionar variable auxiliar en Registro de salarios y tiempo de servicio  ya no se sale de la interfaz contenedora.
- Ya funcionan correctamente el Modificar y Eliminar concepto de percepción y descuento, se habilitan si al menos hay un concepto seleccionado.

## [1.0.0] - 2021-10-29
### Agregado
- Codigo fuente del proyecto para comenzar las entregas por tags. 

[2.0.30]: http://gitlab-distra.xutil.net/distra/pvd/distra/nomina/-/tags/2.0.30
[2.0.29]: http://gitlab-distra.xutil.net/distra/pvd/distra/nomina/-/tags/2.0.29
[1.9.2]: http://gitlab-distra.xutil.net/distra/pvd/distra/nomina/-/tags/1.9.2
[1.9.1]: http://gitlab-distra.xutil.net/distra/pvd/distra/nomina/-/tags/1.9.1
[1.9.0]: http://gitlab-distra.xutil.net/distra/pvd/distra/nomina/-/tags/1.9.0
[1.8.0]: http://gitlab-distra.xutil.net/distra/pvd/distra/nomina/-/tags/1.8.0
[1.7.0]: http://gitlab-distra.xutil.net/distra/pvd/distra/nomina/-/tags/1.7.0
[1.6.0]: http://gitlab-distra.xutil.net/distra/pvd/distra/nomina/-/tags/1.6.0
[1.3.0]: http://gitlab-distra.xutil.net/distra/pvd/distra/nomina_apps/-/tags/1.3.0
[1.2.1]: http://gitlab-distra.xutil.net/distra/pvd/distra/nomina_apps/-/tags/1.2.1
[1.2.0]: http://gitlab-distra.xutil.net/distra/pvd/distra/nomina_apps/-/tags/1.2.0
[1.1.0]: http://gitlab-distra.xutil.net/distra/pvd/distra/nomina_apps/-/tags/1.1.0
[1.0.1]: http://gitlab-distra.xutil.net/distra/pvd/distra/nomina_apps/-/tags/1.0.1
[1.0.0]: http://gitlab-distra.xutil.net/distra/pvd/distra/nomina_apps/-/tags/1.0.0


