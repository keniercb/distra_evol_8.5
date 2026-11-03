# Registro de cambios 
Todos los cambios notables de este proyecto se documentarán en este archivo. 

El formato se basa en [Mantenga un registro de cambios](https://configuracion-ge.prod.xetid.cu/doku.php?id=div:gest_conf:desarrollo:desarrollo:git:git_tags_registro_cambios),
 y este proyecto se adhiere a [Versionado Semántico](https://configuracion-ge.prod.xetid.cu/doku.php?id=div:gest_conf:desarrollo:desarrollo:git:git_tags_nomenclatura).

 ## [1.4.53] - 2024-12-20
 ### Reparado
- Resuelto problema en Asistencia que no mostraba en Asistencia Mensual las personas que son alta en la entidad.

 ## [1.4.51] - 2024-10-29
 ### Reparado
- Resuelto problema con los dias feriados en Asistencia mensual.

 ## [1.4.50] - 2024-10-14
 ### Reparado
- NC Detectada. Ordenar alfabeticamente los usuarios en la Configuración general de asistencia Configurar grupos.

 ## [1.4.49] - 2024-10-14
 ### Reparado
- Resuelto problema en el sistema de la xetid borraba las asistencias cuando se planificaba el calendario de las personas especificas.

 ## [1.4.48] - 2024-10-01
 ### Reparado
- Problemas con el regimen de trabajo fijo en asistencia mensual.

 ## [1.4.47] - 2024-10-01
 ### Reparado
- Resuelto problema en cimex error 500 a la hora de cargar la asistencia en nomina.

 ## [1.4.46] - 2024-09-30
 ### Reparado
- Problemas con el regimen de trabajo fijo en asistencia mensual y en gestionar asistencia (CIMEX).

    ## [1.4.45] - 2024-09-24
 ### Reparado
- NC. Registro y Control de Asistencia. Si esta predefinido que el fondo de tiempo fijo es de 190.6 horas y tiene el mes completo afectado tiene que dar las 190.6 en las horas perdidas, no exactamente lo que el suma en el mes completo (CIMEX).

     ## [1.4.44] - 2024-09-23
 ### Reparado
- NC 93484. En la UEB AT Comercial Centro, se planificaron los días feriados, y a la hora de gestionar la asistencia no los pone como días feriados.
- NC 53063. Solicitamos que se actualice de forma automática los movimientos labores en registro de persona (Mariel).
- SC. Permitir diferenciar por entidad, los turnos de trabajo, como mismo el nomenclador de Régimen de trabajo y descanso. (CIMEX)
- Corrección del mensaje en Gestionar asistencia cuando si tiene configurada la estructura de control
- Implementación de un mecanismo para el control y recuperación de las tuplas borradas de la tabla "dat_asistencia".

       ## [1.4.43] - 2024-09-18
 ### Reparado
- Permitir modificar el calendario predeterminado solo por los usuarios definidos.

       ## [1.4.42] - 2024-09-12
 ### Reparado
- Resuelta la NC soporte 88918. En el reporte de Asistencia mensual no se puede eliminar la certificación de un registro de asistencia.
- Resuelto problema con los botones que son por recurso en la interfaz Asistencia mensual.

       ## [1.4.41] - 2024-08-30
 ### Reparado
- Optimización del código para la obtención del servicio de asitencia en el reporte de ausencias de Reportes y certificaciones

  
       ## [1.4.40] - 2024-08-15
 ### Reparado
- Correcciones en el servicio de asistencia para nómina


         ## [1.4.39] - 2024-05-30
 ### Reparado
- Problema en asistencia mensual cuando el FT es fijo y la persona tiene una causal el mes entero..

        ## [1.4.38] - 2024-05-24
 ### Reparado
- Resuelto error en la interfaz Registrar asistencia que no guarda los datos.

        ## [1.4.37] - 2024-05-08
 ### Reparado
- Resuelto problema con la nocturnidad.

        ## [1.4.36] - 2024-04-16
 ### Reparado
- No está cargando el nomenclador de régimen de trabajo en el reporte de asistencia Reporte Régimen de Trabajo

        ## [1.4.35] - 2024-04-01
 ### Reparado
  - No permitir modificar el calendario predeterminado.

        ## [1.4.34] - 2024-02-19
 ### Reparado
  - Incorporar el campo estado en dat_asistencia para definir el estado de animo de la persona en el dia..

       ## [1.4.33] - 2024-01-29
 ### Reparado
  - Reparada la funcion f_listadopersonastiempocausas y el td td_persona_tiempo_causa1 en la BD.

       ## [1.4.32] - 2024-01-25
 ### Reparado
  - NC soporte 54250. Error al generar reporte de nomina, cuando se Gestiona Reportes y Certificaciones en Capital Humano.

       ## [1.4.31] - 2023-12-19
 ### Reparado
  - Corregido el buscar del reporte nominal del Reporte de asistencia.
 
      ## [1.4.30] - 2023-12-11
 ### Reparado
  - Desarrollada la pre-nomina con el tipo de hoja A0 porque no se visualizan las causales cuando son muchas.

     ## [1.4.29] - 2023-11-15
 ### Reparado
  - NC soporte 54256. Error al cargar las horas de un trabajador si este tiene alguna incidencia con mas de un mes de duración, por ejemplo   certificado medico.
  - Error interno en el reporte Resumen de ausentismo
  - NC soporte 37450. Solicitud de cambio. Se solicita que el sistema DISTRA genere el reporte de notificaciones de descanso retribuida.

    ## [1.4.28] - 2023-10-26
 ### Reparado
 - En el plan de vacaciones cuando se genere el modelo de vacaciones mostrar tambien las vacaciones que vienen de Gestionar asistencia.

   ## [1.4.27] - 2023-10-23
 ### Reparado
 - Configuración para los reportes de la ONEI.

  ## [1.4.26] - 2023-10-06
 ### Reparado
 - Configuración del reporte Promedio de trabajadores del subsistema Fuerza de trabajo del componente Análisis.

 ## [1.4.25] - 2023-09-24
 ### Reparado
 -Reimplementacion del reporte Resumen de ausentismo
 -Configuracion de las causales del reporte Resumen de ausentismo

        ## [1.4.24] - 2023-08-16
 ### Reparado
Resuelta NC soporte 39881 del Mariel
- Cuando la persona tiene el dia feriado habilitado y no lo trabaja debe ponerle en el reporte Asistencia mensual 'Sin registro' y en la hoja de firma no ponerle feriado.

       ## [1.4.23] - 2023-06-11
 ### Reparado
Resuelta NC 27535 de Transgaviota 
Cuando el FT es fijo y la suma del TRT y las HP es mayor al FT se le resta al FT las horas perdidas y te dan las horas trabajadas.

      ## [1.4.22] - 2023-06-06
 ### Reparado
 Resuelta la solicitud 33173 
 - Configuración para escoger los cargos que no firman desde el subsistema de Control de acceso.
 - En gestionar asistencia no se tienen en cuenta esos cargos a la hora de importar los datos de Control de acceso.
 - Fueron incluidos los cargos en la configuración hora entrada/salida por defecto en la configuración general.

     ## [1.4.21] - 2023-04-28
 ### Reparado
 - Resuelto problema en gestionar asistencia que estaba descontando 8h cuando la causal no descuenta salario.

      ## [1.4.20] - 2023-04-13
 ### Reparado
 - Resuelto problema en gestionar asistencia cuando a una persona se le pone una causal que no descuenta salario está poniendo horas descontadas.

     ## [1.4.18] - 2023-04-03
 ### Reparado
 - Corregido error con el servicio de Control de acceso.

    ## [1.4.17] - 2023-03-07
 ### Reparado
 - Corregido error en el tiempo real trabajado en la prenomina.

    ## [1.4.16] - 2023-03-02
 ### Reparado
- Resuelto error en el tiempo real trabajado en Asistencia mensual.

   ## [1.4.15] - 2023-01-26
 ### Reparado
- Corregido error en el servicio que trae los datos del subsistema de control de acceso.

  ## [1.4.14] - 2023-01-13
 ### Reparado
Fueron resueltas las NC 22038  y 16976 
 - Cuando el dia feriado es un fin de semana en el reporte de asistencia mensual no mostraba en la observacion que el dia era "Feriado".
 - Cuando en la nocturnidad la persona tiene una causal que no descuenta no estaba registrando en el reporte asistencia mensual las horas de nocturnidad.

  ## [1.4.13] - 2023-01-11
 ### Reparado
 - Actualización del reporte Asistencia mensual, fue incluido un histórico con la asistencia de las personas que fueron baja y movimiento por período y estructura.

   ## [1.4.12] - 2022-12-22
 ### Reparado
 - Resuelto el orden de las personas en los listados por estructura y composicion.

   ## [1.4.10] - 2022-11-23
 ### Reparado
 Resuelto error en asociar persona a regimen al cargar el combo de los grupos de trabajo y descanso.

   ## [1.4.8] - 2022-11-18
 ### Reparado
 - Corregido error en Asistencia mensual cuando el tiempo diario trabajado es '00:00' poner 'Sin registro'.

  ## [1.4.7] - 2022-11-02
 ### Reparado
 - Reimplementación del servicio de la prenomina.

  ## [1.4.6] - 2022-11-01
 ### Reparado
- Corregido error en los datos de la prenomina.

 ## [1.4.5] - 2022-10-04
 ### Reparado
- Corregido error interno en el reporte Utilización del Fondo de tiempo. 

## [1.4.4] - 2022-09-20
 ### Reparado
- Corrección del exportar hoja de firma, cuando el trabajador tiene determinada observación un sábado no lo muestra.

## [1.4.3] - 2022-07-14
 ### Reparado
- Corrección de los datos del exportar hoja de firma.  

## [1.4.2] - 2022-07-01
 ### Reparado
- Corrección de los datos de la prenomina.

## [1.4.1] - 2022-05-06
 ### Reparado
- Corregido error en los datos en la prenomina de las personas que son baja de la entidad.
- Corrección de los datos de la pronomina cuando el FT es fijo.

## [1.4.1] - 2022-03-28
### Reparado
- Corrección de los datos de la prenomina.
- Corregido en el reporte asistencia mensual cuando la causa es un fin de semana y trabaje la persona muestre la causa en el reporte.

## [1.4.0] - 2022-04-11
### Agregado
- Configuración para definir los dias que pierde una persona en cada causa.
- Fue incorporado en el modelo de vacaciones los acumulados en días e importe.

### Reparado
- Corrección de integración con nóminas cuando la persona es baja.

## [1.3.1] - 2022-03-15
### Reparado
- Reimplementación de la integración del módulo de regimen de trabajo con el sistema de control de acceso de la XETID.

## [1.3.0] - 2022-03-10
### Agregado
- Servicio para guardar los registros de acceso en el modulo de control de acceso.

### Reparado
- Correccion de la funcion que incluye en la prenomina el mes y año anterior al certificado inicial.
- Corrección de las horas descontadas por causa cuando el fondo de tiempo es fijo.

## [1.2.1] - 2022-03-02
### Reparado
- Corrección de la integración con el sistema de Control de acceso para las personas que trabajan 24 horas.
- Corrección del tiempo real trabajado cuando el fondo de tiempo es fijo (Incluir el .6 en el trt).

## [1.2.0] - 2022-02-21
### Reparado
- Corrección de error que muestra las asistencias de las personas que no tienen registro con las horas trabajadas.

### Agregado
- Reporte de utilización del fondo de tiempo

## [1.1.8] - 2022-02-02
### Reparado
- Corrección del cálculo del tiempo real trabajado cuando el fondo de tiempo es fijo.
- Corrección del cálculo de los días trabajados cuando el fondo de tiempo es fijo.

## [1.1.7] - 2022-02-01
### Reparado
- Corrección del trt en asistencia mensual cuando la persona tiene un dia de receso laboral.

## [1.1.4] - 2021-12-15
### Reparado
- Corrección del cálculo de horas perdidas por causa en la prenomina. 

## [1.1.3] - 2021-12-15
### Reparado
- Corrección de la planificación en la gestión de asistencia de forma masiva.

## [1.1.2] - 2021-12-07
### Reparado
- Corrección el cálculo horas por causa.

## [1.1.1] - 2021-11-29
### Reparado
- Cálculo de las horas perdidas por causa en asistencia mensual cuando el fondo de tiempo del mes es fijo.

## [1.1.0] - 2021-11-22
### Agregado
- Gestión de calendario predeterminado para que determinadas causas se apliquen sobre este calendario y no el asignado al grupo de trabajo y descanso.
- Configuración que define los grupos de trabajo y descanso que emplearán el calendario predeterminado.

### Reparado
- Corrección del cálculo del tiempo perdido por causas en la prenómina.


## [1.0.1] - 2021-11-01
### Reparado

- Fue resuelto el error en el tiempo real trabajo en asistencia mensual cuando el día era feriado trabajado estaba dando incorrecto el valor.

- Fue resuelto el problema en el calendario a la hora de planificar a la persona eliminaba el calendario del grupo.

- Fue resuelto en el calendario el problema a la hora de cargar que se demoraba la petición.

## [1.0.0] - 2021-10-29
### Agregado

- Codigo fuente del proyecto para comenzar las entregas por tags. 

[Nuevo]: http://gitlab-distra.xutil.net/distra/pvd/distra/regimentrabajo_apps/-/tree/master
[1.4.53]: http://gitlab-distra.xutil.net/distra/pvd/distra/regimentrabajo/-/tags/1.4.53
[1.4.51]: http://gitlab-distra.xutil.net/distra/pvd/distra/regimentrabajo/-/tags/1.4.51
[1.4.50]: http://gitlab-distra.xutil.net/distra/pvd/distra/regimentrabajo/-/tags/1.4.50
[1.4.49]: http://gitlab-distra.xutil.net/distra/pvd/distra/regimentrabajo/-/tags/1.4.49
[1.4.48]: http://gitlab-distra.xutil.net/distra/pvd/distra/regimentrabajo/-/tags/1.4.48
[1.4.47]: http://gitlab-distra.xutil.net/distra/pvd/distra/regimentrabajo/-/tags/1.4.47
[1.4.46]: http://gitlab-distra.xutil.net/distra/pvd/distra/regimentrabajo/-/tags/1.4.46
[1.4.45]: http://gitlab-distra.xutil.net/distra/pvd/distra/regimentrabajo/-/tags/1.4.45
[1.4.44]: http://gitlab-distra.xutil.net/distra/pvd/distra/regimentrabajo/-/tags/1.4.44
[1.4.43]: http://gitlab-distra.xutil.net/distra/pvd/distra/regimentrabajo/-/tags/1.4.43
[1.4.42]: http://gitlab-distra.xutil.net/distra/pvd/distra/regimentrabajo/-/tags/1.4.42
[1.4.41]: http://gitlab-distra.xutil.net/distra/pvd/distra/regimentrabajo/-/tags/1.4.41
[1.4.40]: http://gitlab-distra.xutil.net/distra/pvd/distra/regimentrabajo/-/tags/1.4.40
[1.4.39]: http://gitlab-distra.xutil.net/distra/pvd/distra/regimentrabajo/-/tags/1.4.39
[1.4.38]: http://gitlab-distra.xutil.net/distra/pvd/distra/regimentrabajo/-/tags/1.4.38
[1.4.37]: http://gitlab-distra.xutil.net/distra/pvd/distra/regimentrabajo/-/tags/1.4.37
[1.4.36]: http://gitlab-distra.xutil.net/distra/pvd/distra/regimentrabajo/-/tags/1.4.36
[1.4.35]: http://gitlab-distra.xutil.net/distra/pvd/distra/regimentrabajo/-/tags/1.4.35
[1.4.34]: http://gitlab-distra.xutil.net/distra/pvd/distra/regimentrabajo/-/tags/1.4.34
[1.4.33]: http://gitlab-distra.xutil.net/distra/pvd/distra/regimentrabajo/-/tags/1.4.33
[1.4.32]: http://gitlab-distra.xutil.net/distra/pvd/distra/regimentrabajo/-/tags/1.4.32
[1.4.31]: http://gitlab-distra.xutil.net/distra/pvd/distra/regimentrabajo/-/tags/1.4.31
[1.4.30]: http://gitlab-distra.xutil.net/distra/pvd/distra/regimentrabajo/-/tags/1.4.30
[1.4.29]: http://gitlab-distra.xutil.net/distra/pvd/distra/regimentrabajo/-/tags/1.4.29
[1.4.28]: http://gitlab-distra.xutil.net/distra/pvd/distra/regimentrabajo/-/tags/1.4.28
[1.4.27]: http://gitlab-distra.xutil.net/distra/pvd/distra/regimentrabajo/-/tags/1.4.27
[1.4.26]: http://gitlab-distra.xutil.net/distra/pvd/distra/regimentrabajo/-/tags/1.4.26
[1.4.25]: http://gitlab-distra.xutil.net/distra/pvd/distra/regimentrabajo/-/tags/1.4.25
[1.4.24]: http://gitlab-distra.xutil.net/distra/pvd/distra/regimentrabajo/-/tags/1.4.24
[1.4.23]: http://gitlab-distra.xutil.net/distra/pvd/distra/regimentrabajo/-/tags/1.4.23
[1.4.22]: http://gitlab-distra.xutil.net/distra/pvd/distra/regimentrabajo/-/tags/1.4.22
[1.4.21]: http://gitlab-distra.xutil.net/distra/pvd/distra/regimentrabajo/-/tags/1.4.21
[1.4.20]: http://gitlab-distra.xutil.net/distra/pvd/distra/regimentrabajo/-/tags/1.4.20
[1.4.18]: http://gitlab-distra.xutil.net/distra/pvd/distra/regimentrabajo/-/tags/1.4.18
[1.4.17]: http://gitlab-distra.xutil.net/distra/pvd/distra/regimentrabajo/-/tags/1.4.17
[1.4.16]: http://gitlab-distra.xutil.net/distra/pvd/distra/regimentrabajo/-/tags/1.4.16
[1.4.15]: http://gitlab-distra.xutil.net/distra/pvd/distra/regimentrabajo/-/tags/1.4.15
[1.4.14]: http://gitlab-distra.xutil.net/distra/pvd/distra/regimentrabajo/-/tags/1.4.14
[1.4.13]: http://gitlab-distra.xutil.net/distra/pvd/distra/regimentrabajo/-/tags/1.4.13
[1.4.12]: http://gitlab-distra.xutil.net/distra/pvd/distra/regimentrabajo/-/tags/1.4.12
[1.4.10]: http://gitlab-distra.xutil.net/distra/pvd/distra/regimentrabajo/-/tags/1.4.10
[1.4.8]: http://gitlab-distra.xutil.net/distra/pvd/distra/regimentrabajo/-/tags/1.4.8
[1.4.7]: http://gitlab-distra.xutil.net/distra/pvd/distra/regimentrabajo/-/tags/1.4.7
[1.4.6]: http://gitlab-distra.xutil.net/distra/pvd/distra/regimentrabajo/-/tags/1.4.6
[1.4.5]: http://gitlab-distra.xutil.net/distra/pvd/distra/regimentrabajo/-/tags/1.4.5
[1.4.4]: http://gitlab-distra.xutil.net/distra/pvd/distra/regimentrabajo/-/tags/1.4.4
[1.4.3]: http://gitlab-distra.xutil.net/distra/pvd/distra/regimentrabajo/-/tags/1.4.3
[1.4.2]: http://gitlab-distra.xutil.net/distra/pvd/distra/regimentrabajo/-/tags/1.4.2
[1.4.1]: http://gitlab-distra.xutil.net/distra/pvd/distra/regimentrabajo/-/tags/1.4.1
[1.4.0]: http://gitlab-distra.xutil.net/distra/pvd/distra/regimentrabajo/-/tags/1.4.0
[1.3.1]: http://gitlab-distra.xutil.net/distra/pvd/distra/regimentrabajo/-/tags/1.3.1
[1.3.0]: http://gitlab-distra.xutil.net/distra/pvd/distra/regimentrabajo/-/tags/1.3.0
[1.2.1]: http://gitlab-distra.xutil.net/distra/pvd/distra/regimentrabajo/-/tags/1.2.1
[1.2.0]: http://gitlab-distra.xutil.net/distra/pvd/distra/regimentrabajo/-/tags/1.2.0
[1.1.8]: http://gitlab-distra.xutil.net/distra/pvd/distra/regimentrabajo/-/tags/1.1.8
[1.1.7]: http://gitlab-distra.xutil.net/distra/pvd/distra/regimentrabajo/-/tags/1.1.7
[1.1.4]: http://gitlab-distra.xutil.net/distra/pvd/distra/regimentrabajo_web/-/tags/1.1.4
[1.1.3]: http://gitlab-distra.xutil.net/distra/pvd/distra/regimentrabajo_web/-/tags/1.1.3
[1.1.2]: http://gitlab-distra.xutil.net/distra/pvd/distra/regimentrabajo_apps/-/tags/1.1.2
[1.1.1]: http://gitlab-distra.xutil.net/distra/pvd/distra/regimentrabajo_apps/-/tags/1.1.1
[1.1.0]: http://gitlab-distra.xutil.net/distra/pvd/distra/regimentrabajo_apps/-/tags/1.1.0
[1.0.1]: http://gitlab-distra.xutil.net/distra/pvd/distra/regimentrabajo_apps/-/tags/1.0.1
[1.0.0]: http://gitlab-distra.xutil.net/distra/pvd/distra/regimentrabajo_apps/-/tags/1.0.0
