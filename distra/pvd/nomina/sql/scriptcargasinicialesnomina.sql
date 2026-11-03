--Borrando todas las Tablas de Datos que no son necesarias en las cargas iniciales.
DELETE FROM mod_nomina.seg_trazacertificacionannoservc;
DELETE FROM mod_nomina.seg_compartimentacionnomina;
DELETE FROM mod_nomina.seg_compartimentacioncargoportiponomina;
DELETE FROM mod_nomina.seg_compartcargocategoria;
DELETE FROM mod_nomina.nom_areascargos;
DELETE FROM mod_nomina.nom_areas;
DELETE FROM mod_nomina.his_variableselementosreportescertificaciones;
DELETE FROM mod_nomina.his_vacacionespersonabaja;
DELETE FROM mod_nomina.his_vacacionespersona;
DELETE FROM mod_nomina.his_retencionpersona;
DELETE FROM mod_nomina.his_reportecertificacion;
DELETE FROM mod_nomina.his_personasnocertificadasannosresvicio;
DELETE FROM mod_nomina.his_personacertificacionincremento;
DELETE FROM mod_nomina.his_personabaja;
DELETE FROM mod_nomina.his_operacionretencionpersona;
DELETE FROM mod_nomina.his_elementosreportescertificaciones;
DELETE FROM mod_nomina.his_datretencionpersona;
DELETE FROM mod_nomina.his_certificacionannoservc;
DELETE FROM mod_nomina.his_cargosocupados;
DELETE FROM mod_nomina.his_cargoscertificacionincremento;
DELETE FROM mod_nomina.his_cargoincrementomensual;
DELETE FROM mod_nomina.his_ajustevacacionespersona;
DELETE FROM mod_nomina.dat_variablespersonaselaborarpagos;
DELETE FROM mod_nomina.dat_variablesformulavacacionesvariables;
DELETE FROM mod_nomina.dat_variableselementosreportescertificaciones;
DELETE FROM mod_nomina.dat_variablescondicionesretenciones;
DELETE FROM mod_nomina.dat_vacacionesvariables;
DELETE FROM mod_nomina.dat_vacacionespersona;
DELETE FROM mod_nomina.dat_suerdoporcargoespecifico;
DELETE FROM mod_nomina.dat_retencionpersona;
DELETE FROM mod_nomina.dat_retencionesaplicadasporpersona;
DELETE FROM mod_nomina.dat_elementosreportescertificaciones;
DELETE FROM mod_nomina.dat_reportescertificaciones;
DELETE FROM mod_nomina.dat_reintegropersona;
DELETE FROM mod_nomina.dat_registrosalariotiemposervcio;
DELETE FROM mod_nomina.dat_personaselaborarpagos;
DELETE FROM mod_nomina.dat_personaestructuranominacobrosypagos;
DELETE FROM mod_nomina.dat_personaelaborarpagoscargosocupados;
DELETE FROM mod_nomina.dat_periodosdestajo;
DELETE FROM mod_nomina.dat_personaelaborarpagoscargosocupados;
DELETE FROM mod_nomina.dat_periodosdestajo;
DELETE FROM mod_nomina.dat_partidagasto;
DELETE FROM mod_nomina.dat_nominadatos;
DELETE FROM mod_nomina.dat_nominaaprobacioncertificacion;
DELETE FROM mod_nomina.dat_nomina;
DELETE FROM mod_nomina.dat_modeloconvenioindividual;
DELETE FROM mod_nomina.dat_modeloconveniocolectivo;
DELETE FROM mod_nomina.dat_cierreperiodosnomina;
DELETE FROM mod_nomina.dat_fechascierreperiodos;
DELETE FROM mod_nomina.dat_elaborarpagosreferencia;
DELETE FROM mod_nomina.dat_datoscertificadoselaborarpago;
DELETE FROM mod_nomina.dat_descuentosaplicadosporpersona;
DELETE FROM mod_nomina.dat_desaprobarnominatraza;
DELETE FROM mod_nomina.dat_consecutivosnominaporpagos;
DELETE FROM mod_nomina.dat_conceptoelaborarpago;
DELETE FROM mod_nomina.dat_comprobantenominacentroscosto;
DELETE FROM mod_nomina.dat_comprobantenomina;
DELETE FROM mod_nomina.dat_elaborarpagos;
DELETE FROM mod_nomina.dat_datossbc;
DELETE FROM mod_nomina.dat_convenio;
DELETE FROM mod_nomina.dat_conceptoscontableselementosgasto;
DELETE FROM mod_nomina.dat_cargosocupados;
DELETE FROM mod_nomina.dat_cargoincrementomensual;
DELETE FROM mod_nomina.dat_calculopagoporresultado;
DELETE FROM mod_nomina.conf_vartiporeportescertificacionesparaperiodosvacaciones;
DELETE FROM mod_nomina.conf_variableglobalvalor;
DELETE FROM mod_nomina.conf_vacacionespersona;
DELETE FROM mod_nomina.conf_tipospagosconsecutivosnomina;
DELETE FROM mod_nomina.conf_tipopagodependencia;
DELETE FROM mod_nomina.conf_reporteconceptoselementossalariales;
DELETE FROM mod_nomina.conf_plantillanominalcargo;
DELETE FROM mod_nomina.conf_plantillanominal;
DELETE FROM mod_nomina.conf_personasnocertificadasannosresvicio;
DELETE FROM mod_nomina.conf_personacertificacionincremento;
DELETE FROM mod_nomina.conf_personacdgocontable;
DELETE FROM mod_nomina.conf_pagosporresultadoperiodopago;
DELETE FROM mod_nomina.conf_pagosporresultadofechas;
DELETE FROM mod_nomina.conf_pagosporresultadoarea;
DELETE FROM mod_nomina.conf_pagosporresultadoarea;
DELETE FROM mod_nomina.conf_nivelactiveconom;
DELETE FROM mod_nomina.conf_modelonominacategoria;
DELETE FROM mod_nomina.conf_indicadorespagoporresultado;
DELETE FROM mod_nomina.conf_formulasareasmontos;
DELETE FROM mod_nomina.conf_exportacionbanco;
DELETE FROM mod_nomina.conf_exportacionbancoficheroentidad;
DELETE FROM mod_nomina.conf_escalaelementosalarialsituacionservicio;
DELETE FROM mod_nomina.conf_escalaelementosalarialpersona;
DELETE FROM mod_nomina.conf_escalaelementosalarial;
DELETE FROM mod_nomina.conf_elementosalarialsituacionservicio;
DELETE FROM mod_nomina.conf_elementosalarialcargo;
DELETE FROM mod_nomina.conf_desgloseperiodos;
DELETE FROM mod_nomina.conf_periodostipospago;
DELETE FROM mod_nomina.conf_cuentasaperturapersona;
DELETE FROM mod_nomina.conf_contabilizacion;
DELETE FROM mod_nomina.conf_conceptpelementsalarialessituacionservicio;
DELETE FROM mod_nomina.conf_conceptospdsituacionesservicio;
DELETE FROM mod_nomina.conf_conceptospdelementossalariales;
DELETE FROM mod_nomina.conf_conceptopdxestructura;
DELETE FROM mod_nomina.conf_certificacionannoservc;
DELETE FROM mod_nomina.conf_cargostipopago;
DELETE FROM mod_nomina.conf_cargospagoporresultado;
DELETE FROM mod_nomina.conf_cargoscertificacionincremento;
DELETE FROM mod_nomina.conf_camposreportecorreoentidad;
DELETE FROM mod_nomina.conf_camposreportecorreo;
DELETE FROM mod_nomina.conf_asociacioncuentascontables;
DELETE FROM mod_nomina.conf_agrupadorareas;
DELETE FROM mod_nomina.conf_afiliacionpolitica;

--Falta el pedazo de Script para Borrar en Formas y Sistemas de Pago, Conceptos Generales de Nomina, Estructurar Modelos de Nomina y Conceptos Contables los datos de las Estructuras que no van

--Actualizando las Tablas de las Cargas Iniciales de las Formulas de las Nominas que llevan idestructura

UPDATE mod_nomina.conf_conceptoscontablesentidad
   SET idestructura=?;
   
UPDATE mod_nomina.conf_conceptosgeneralesnomina
   SET identidad = ?;
   
UPDATE mod_nomina.conf_conceptosportiposysistemaspago
   SET identidad = ?;
   
UPDATE mod_nomina.conf_estructuramodelosnominaentidad
   SET idestructura = ?;
 
