----********************************************************COLUMNAS********************************************************************
-- Column: idparrafofiscal
-- ALTER TABLE mod_nomina.nom_conceptoretribucionmonetaria DROP COLUMN idparrafofiscal;
ALTER TABLE mod_nomina.nom_conceptoretribucionmonetaria ADD COLUMN idparrafofiscal numeric(19,0);
--**************************************************************************************************************************************

  -- Column: idclienteproveedorcobropago
-- ALTER TABLE mod_nomina.nom_conceptoretribucionmonetaria DROP COLUMN idclienteproveedorcobropago;
ALTER TABLE mod_nomina.nom_conceptoretribucionmonetaria ADD COLUMN idclienteproveedorcobropago numeric(19,0);
--**************************************************************************************************************************************

-- Column: tiposeleccionpersonas
-- ALTER TABLE mod_nomina.conf_tiporeportescertificaciones DROP COLUMN tiposeleccionpersonas;
ALTER TABLE mod_nomina.conf_tiporeportescertificaciones ADD COLUMN tiposeleccionpersonas numeric(1,0);
--**************************************************************************************************************************************

-- Column: descripcion
-- ALTER TABLE mod_nomina.dat_reportescertificaciones DROP COLUMN descripcion;
ALTER TABLE mod_nomina.dat_reportescertificaciones ADD COLUMN descripcion character varying(255);
--**************************************************************************************************************************************

-- Column: orden
-- ALTER TABLE mod_nomina.conf_variablestiporeportescertificaciones DROP COLUMN orden;
ALTER TABLE mod_nomina.conf_variablestiporeportescertificaciones ADD COLUMN orden numeric(10,0);
--**************************************************************************************************************************************

-- Column: calculablehistoriconominasreportes
-- ALTER TABLE mod_nomina.conf_variablestiporeportescertificaciones DROP COLUMN calculablehistoriconominasreportes;
ALTER TABLE mod_nomina.conf_variablestiporeportescertificaciones ADD COLUMN calculablehistoriconominasreportes numeric(1,0);
--**************************************************************************************************************************************

-- Column: idexpresionmatematicahistoriconominasreportes
-- ALTER TABLE mod_nomina.conf_variablestiporeportescertificaciones DROP COLUMN idexpresionmatematicahistoriconominasreportes;
ALTER TABLE mod_nomina.conf_variablestiporeportescertificaciones ADD COLUMN idexpresionmatematicahistoriconominasreportes numeric(19,0);
--**************************************************************************************************************************************

-- Column: cobrosypagos
-- ALTER TABLE mod_nomina.nom_tiporetencion DROP COLUMN cobrosypagos;
ALTER TABLE mod_nomina.nom_tiporetencion ADD COLUMN cobrosypagos numeric(1,0);
ALTER TABLE mod_nomina.nom_tiporetencion ALTER COLUMN cobrosypagos SET DEFAULT 0;
--**************************************************************************************************************************************

-- Column: composicion
-- ALTER TABLE mod_nomina.nom_areas DROP COLUMN composicion;
ALTER TABLE mod_nomina.nom_areas ADD COLUMN composicion numeric(1,0);
--**************************************************************************************************************************************

-- Column: recalculable
-- ALTER TABLE mod_nomina.conf_indicadorespagoporresultado DROP COLUMN recalculable;
ALTER TABLE mod_nomina.conf_indicadorespagoporresultado ADD COLUMN recalculable numeric(1,0);
ALTER TABLE mod_nomina.conf_indicadorespagoporresultado ALTER COLUMN recalculable SET DEFAULT 0;
--**************************************************************************************************************************************

-- Column: resultadofinal
-- ALTER TABLE mod_nomina.conf_indicadorespagoporresultado DROP COLUMN resultadofinal;
ALTER TABLE mod_nomina.conf_indicadorespagoporresultado ADD COLUMN resultadofinal numeric(1,0);
ALTER TABLE mod_nomina.conf_indicadorespagoporresultado ALTER COLUMN resultadofinal SET DEFAULT 0;
--**************************************************************************************************************************************

-- Column: consecutivonomina
-- ALTER TABLE mod_nomina.nom_tipopago DROP COLUMN consecutivonomina;
ALTER TABLE mod_nomina.nom_tipopago ADD COLUMN consecutivonomina numeric(19,0);
ALTER TABLE mod_nomina.nom_tipopago ALTER COLUMN consecutivonomina SET DEFAULT 0;
--**************************************************************************************************************************************

-- Column: periodobusquedareferencianomina
-- ALTER TABLE mod_nomina.conf_estructuramodelosnomina DROP COLUMN periodobusquedareferencianomina;
ALTER TABLE mod_nomina.conf_estructuramodelosnomina ADD COLUMN periodobusquedareferencianomina numeric(1,0);
--**************************************************************************************************************************************

-- Column: pagoxresultadosdestajo
-- ALTER TABLE mod_nomina.nom_tipopago DROP COLUMN pagoxresultadosdestajo;
ALTER TABLE mod_nomina.nom_tipopago ADD COLUMN pagoxresultadosdestajo numeric(1,0);
--**************************************************************************************************************************************

-- Column: talonario
-- ALTER TABLE mod_nomina.conf_estructuramodelosnomina DROP COLUMN talonario;
ALTER TABLE mod_nomina.conf_estructuramodelosnomina ADD COLUMN talonario numeric(1,0);
--**************************************************************************************************************************************

-- Column: correo
-- ALTER TABLE mod_nomina.conf_estructuramodelosnomina DROP COLUMN correo;
ALTER TABLE mod_nomina.conf_estructuramodelosnomina ADD COLUMN correo numeric(1,0);
ALTER TABLE mod_nomina.conf_estructuramodelosnomina ALTER COLUMN correo SET DEFAULT 1;
--**************************************************************************************************************************************

-- Column: comportamientocorreo
-- ALTER TABLE mod_nomina.conf_estructuramodelosnomina DROP COLUMN 



ALTER TABLE mod_nomina.conf_estructuramodelosnomina ADD COLUMN comportamientocorreo numeric(1,0);
ALTER TABLE mod_nomina.conf_estructuramodelosnomina ALTER COLUMN comportamientocorreo SET DEFAULT 1;
--**************************************************************************************************************************************

-- Column: descripcion
-- ALTER TABLE mod_nomina.conf_estructuramodelosnomina DROP COLUMN descripcion;
ALTER TABLE mod_nomina.conf_estructuramodelosnomina ADD COLUMN descripcion character varying(255);
--**************************************************************************************************************************************

-- Column: desglosecentcosto
-- ALTER TABLE mod_nomina.dat_conceptoelaborarpago DROP COLUMN desglosecentcosto;
ALTER TABLE mod_nomina.dat_conceptoelaborarpago ADD COLUMN desglosecentcosto character varying(19);
--**************************************************************************************************************************************

-- Column: sumadestajo
-- ALTER TABLE mod_nomina.conf_indicadorespagoporresultado DROP COLUMN sumadestajo;
ALTER TABLE mod_nomina.conf_indicadorespagoporresultado ADD COLUMN sumadestajo numeric(1,0);
ALTER TABLE mod_nomina.conf_indicadorespagoporresultado ALTER COLUMN sumadestajo SET DEFAULT 0;
--**************************************************************************************************************************************

-- Column: identidad
-- ALTER TABLE mod_nomina.conf_agrupadorareas DROP COLUMN identidad;
ALTER TABLE mod_nomina.conf_agrupadorareas ADD COLUMN identidad numeric(19,0);
--**************************************************************************************************************************************

-- Column: sumadestajo
-- ALTER TABLE mod_nomina.conf_indicadorespagoporresultado DROP COLUMN sumadestajo;
ALTER TABLE mod_nomina.conf_indicadorespagoporresultado ADD COLUMN sumadestajo numeric(1,0);
ALTER TABLE mod_nomina.conf_indicadorespagoporresultado ALTER COLUMN sumadestajo SET DEFAULT 0;
--**************************************************************************************************************************************

-- Column: reporteantiguedad
-- ALTER TABLE mod_nomina.conf_certificacionannoservc DROP COLUMN reporteantiguedad;
ALTER TABLE mod_nomina.conf_certificacionannoservc ADD COLUMN reporteantiguedad boolean;
--**************************************************************************************************************************************

-- Column: idcuenta
-- ALTER TABLE mod_nomina.dat_retencionpersona DROP COLUMN idcuenta;
ALTER TABLE mod_nomina.dat_retencionpersona ADD COLUMN idcuenta numeric(19,0);
--**************************************************************************************************************************************

-- Column: idparrafofiscal
-- ALTER TABLE mod_nomina.conf_conceptoscontables DROP COLUMN idparrafofiscal;
ALTER TABLE mod_nomina.conf_conceptoscontables ADD COLUMN idparrafofiscal numeric(19,0);
--**************************************************************************************************************************************

-- Column: idclienteproveedorcobropago
-- ALTER TABLE mod_nomina.conf_conceptoscontables DROP COLUMN idclienteproveedorcobropago;
ALTER TABLE mod_nomina.conf_conceptoscontables ADD COLUMN idclienteproveedorcobropago numeric(19,0);
--**************************************************************************************************************************************

-- Column: idtienecobrospagos
-- ALTER TABLE mod_nomina.conf_conceptoscontables DROP COLUMN idtienecobrospagos;
ALTER TABLE mod_nomina.conf_conceptoscontables ADD COLUMN idtienecobrospagos numeric(1,0);
--**************************************************************************************************************************************

-- Column: idtipocobrospagos
-- ALTER TABLE mod_nomina.conf_conceptoscontables DROP COLUMN idtipocobrospagos;
ALTER TABLE mod_nomina.conf_conceptoscontables ADD COLUMN idtipocobrospagos numeric(1,0);
--**************************************************************************************************************************************

-- Column: idtipointegracioncobrospagos
-- ALTER TABLE mod_nomina.conf_conceptoscontables DROP COLUMN idtipointegracioncobrospagos;
ALTER TABLE mod_nomina.conf_conceptoscontables ADD COLUMN idtipointegracioncobrospagos numeric(1,0);
--**************************************************************************************************************************************

-- Column: cuentacontable
-- ALTER TABLE mod_nomina.conf_conceptoscontables DROP COLUMN cuentacontable;
ALTER TABLE mod_nomina.conf_conceptoscontables ADD COLUMN cuentacontable numeric(19,0);
--**************************************************************************************************************************************

-- Column: liquidacobrosypagos
-- ALTER TABLE mod_nomina.conf_conceptoscontables DROP COLUMN liquidacobrosypagos;
ALTER TABLE mod_nomina.conf_conceptoscontables ADD COLUMN liquidacobrosypagos numeric(1,0);
ALTER TABLE mod_nomina.conf_conceptoscontables ALTER COLUMN liquidacobrosypagos SET DEFAULT 0;
--**************************************************************************************************************************************

-- Column: multipleseleccioncargos
-- ALTER TABLE mod_nomina.nom_areas DROP COLUMN multipleseleccioncargos;
ALTER TABLE mod_nomina.nom_areas ADD COLUMN multipleseleccioncargos numeric(1,0);
ALTER TABLE mod_nomina.nom_areas ALTER COLUMN multipleseleccioncargos SET DEFAULT 0;
COMMENT ON COLUMN mod_nomina.nom_areas.multipleseleccioncargos IS 
'Columna para definir si se puede asociar a las plantillas nominales cargos asociados en otras plantillas: 1-Si 0-No';
--**************************************************************************************************************************************

-- Column: idarea
-- ALTER TABLE mod_nomina.conf_cargospagoporresultado DROP COLUMN idarea;
ALTER TABLE mod_nomina.conf_cargospagoporresultado ADD COLUMN idarea numeric(19,0);
--**************************************************************************************************************************************

-- Column: orden
-- ALTER TABLE mod_nomina.conf_exportacionbanco DROP COLUMN orden;
ALTER TABLE mod_nomina.conf_exportacionbanco ADD COLUMN orden numeric(19,0);
ALTER TABLE mod_nomina.conf_exportacionbanco ALTER COLUMN orden SET DEFAULT 1;
UPDATE mod_nomina.conf_exportacionbanco SET  orden=1
ALTER TABLE mod_nomina.conf_exportacionbanco ALTER COLUMN orden SET NOT NULL;
--**************************************************************************************************************************************

-- Column: tiposnomina
-- ALTER TABLE mod_nomina.conf_variablestiporeportescertificaciones DROP COLUMN tiposnomina;
ALTER TABLE mod_nomina.conf_variablestiporeportescertificaciones ADD COLUMN tiposnomina character varying(500);
--**************************************************************************************************************************************

-- Column: idcuenta
-- ALTER TABLE mod_nomina.dat_retencionpersona DROP COLUMN idcuenta;
ALTER TABLE mod_nomina.dat_retencionpersona ADD COLUMN idcuenta numeric(19,0);
--**************************************************************************************************************************************

-- Column: tipoperiodo
-- ALTER TABLE mod_nomina.nom_periodopago DROP COLUMN tipoperiodo;
ALTER TABLE mod_nomina.nom_periodopago ADD COLUMN tipoperiodo numeric(2,0);
ALTER TABLE mod_nomina.nom_periodopago ALTER COLUMN tipoperiodo SET DEFAULT 0;
--**************************************************************************************************************************************

-- Column: esmensual
-- ALTER TABLE mod_nomina.nom_periodopago DROP COLUMN esmensual;
ALTER TABLE mod_nomina.nom_periodopago ADD COLUMN esmensual numeric;
ALTER TABLE mod_nomina.nom_periodopago ALTER COLUMN esmensual SET DEFAULT 0;
--**************************************************************************************************************************************

-- Column: orden
-- ALTER TABLE mod_nomina.nom_tipopago DROP COLUMN orden;
ALTER TABLE mod_nomina.nom_tipopago ADD COLUMN orden numeric(19,0);
ALTER TABLE mod_nomina.nom_tipopago ALTER COLUMN orden SET STATISTICS 0;
--**************************************************************************************************************************************

-- Column: mostrarvacaciones
-- ALTER TABLE mod_nomina.conf_camposreportecorreo DROP COLUMN mostrarvacaciones;
ALTER TABLE mod_nomina.conf_camposreportecorreo ADD COLUMN mostrarvacaciones numeric(1,0);
ALTER TABLE mod_nomina.conf_camposreportecorreo ALTER COLUMN mostrarvacaciones SET STATISTICS 0;
--**************************************************************************************************************************************

-- Column: mostrarsnc
-- ALTER TABLE mod_nomina.conf_camposreportecorreo DROP COLUMN mostrarsnc;
ALTER TABLE mod_nomina.conf_camposreportecorreo ADD COLUMN mostrarsnc numeric(1,0);
ALTER TABLE mod_nomina.conf_camposreportecorreo ALTER COLUMN mostrarsnc SET STATISTICS 0;
--**************************************************************************************************************************************

-- Column: idcamporeportecorreo
-- ALTER TABLE mod_nomina.conf_camposreportecorreoentidad DROP COLUMN idcamporeportecorreo;
ALTER TABLE mod_nomina.conf_camposreportecorreoentidad ADD COLUMN idcamporeportecorreo numeric(19,0);
ALTER TABLE mod_nomina.conf_camposreportecorreoentidad ALTER COLUMN idcamporeportecorreo SET STATISTICS 0;
--**************************************************************************************************************************************

-- Column: horasdias
-- ALTER TABLE mod_nomina.conf_causasreporteausencia DROP COLUMN horasdias;
ALTER TABLE mod_nomina.conf_causasreporteausencia ADD COLUMN horasdias numeric(1,0);
--**************************************************************************************************************************************



--************************************************TABLAS***************************************************
--*********************************************************************************************************
-- Sequence: mod_nomina.sec_afiliacionpolitica_seq
-- DROP SEQUENCE mod_nomina.sec_afiliacionpolitica_seq;
CREATE SEQUENCE mod_nomina.sec_afiliacionpolitica_seq
  INCREMENT 1
  MINVALUE 1
  MAXVALUE 9999999999999999
  START 1
  CACHE 1;
ALTER TABLE mod_nomina.sec_afiliacionpolitica_seq
  OWNER TO zeolides;
COMMENT ON SEQUENCE mod_nomina.sec_afiliacionpolitica_seq
  IS ' Secuencia empleada para autogenerar el identificador de la tabla "conf_afiliacionpolitica".';


-- Table: mod_nomina.conf_afiliacionpolitica
-- DROP TABLE mod_nomina.conf_afiliacionpolitica;
CREATE TABLE mod_nomina.conf_afiliacionpolitica
(
  idconfafiliacion numeric(19,0) NOT NULL DEFAULT nextval('mod_nomina.sec_afiliacionpolitica_seq'::regclass),
  idafiliacion numeric(19,0),
  denominacion character varying(255) NOT NULL,
  tipospagos character varying(255) NOT NULL,
  idformula numeric(19,0) NOT NULL,
  idformuladevengadototal numeric(19,0) NOT NULL,
  CONSTRAINT pk_afiliacionpolitica PRIMARY KEY (idconfafiliacion)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE mod_nomina.conf_afiliacionpolitica
  OWNER TO zeolides;
GRANT ALL ON TABLE mod_nomina.conf_afiliacionpolitica TO zeolides;

--*********************************************************************************************************
--*********************************************************************************************************
-- Sequence: mod_nomina.sec_agrupadorareas_seq
-- DROP SEQUENCE mod_nomina.sec_agrupadorareas_seq;
CREATE SEQUENCE mod_nomina.sec_agrupadorareas_seq
  INCREMENT 1
  MINVALUE 1
  MAXVALUE 999999999999999999
  START 1
  CACHE 1;
ALTER TABLE mod_nomina.sec_agrupadorareas_seq
  OWNER TO zeolides;
GRANT ALL ON TABLE mod_nomina.sec_agrupadorareas_seq TO zeolides;
GRANT ALL ON TABLE mod_nomina.sec_agrupadorareas_seq TO public;
COMMENT ON SEQUENCE mod_nomina.sec_agrupadorareas_seq
  IS ' Secuencia empleada para autogenerar el identificador de la tabla "sec_agrupadorareas_seq".';


-- Table: mod_nomina.conf_agrupadorareas
-- DROP TABLE mod_nomina.conf_agrupadorareas;
CREATE TABLE mod_nomina.conf_agrupadorareas
(
  idagrupador numeric(19,0) NOT NULL DEFAULT nextval('mod_nomina.sec_agrupadorareas_seq'::regclass),
  idpagoporresultado numeric(19,0) NOT NULL,
  denominacion character varying(255) NOT NULL,
  idformula numeric(19,0) NOT NULL,
  identidad numeric(19,0) NOT NULL,
  CONSTRAINT pk_idagrupador PRIMARY KEY (idagrupador )
)
WITH (
  OIDS=FALSE
);
ALTER TABLE mod_nomina.conf_agrupadorareas
  OWNER TO zeolides;
GRANT ALL ON TABLE mod_nomina.conf_agrupadorareas TO zeolides;
GRANT ALL ON TABLE mod_nomina.conf_agrupadorareas TO public;

--*********************************************************************************************************
--*********************************************************************************************************
-- Sequence: mod_nomina.sec_formulasareasmontos_seq
-- DROP SEQUENCE mod_nomina.sec_formulasareasmontos_seq;
CREATE SEQUENCE mod_nomina.sec_formulasareasmontos_seq
  INCREMENT 1
  MINVALUE 1
  MAXVALUE 999999999999999999
  START 1
  CACHE 1;
ALTER TABLE mod_nomina.sec_formulasareasmontos_seq
  OWNER TO zeolides;
GRANT ALL ON TABLE mod_nomina.sec_formulasareasmontos_seq TO zeolides;
GRANT ALL ON TABLE mod_nomina.sec_formulasareasmontos_seq TO public;
COMMENT ON SEQUENCE mod_nomina.sec_formulasareasmontos_seq
  IS ' Secuencia empleada para autogenerar el identificador de la tabla "sec_formulasareasmontos_seq".';


-- Table: mod_nomina.conf_formulasareasmontos
-- DROP TABLE mod_nomina.conf_formulasareasmontos;
CREATE TABLE mod_nomina.conf_formulasareasmontos
(
  idformulaareamonto numeric(19,0) NOT NULL DEFAULT nextval('mod_nomina.sec_formulasareasmontos_seq'::regclass),
  idagrupadorarea numeric(19,0) NOT NULL,
  idarea numeric(19,0) NOT NULL,
  idformula numeric(19,0) NOT NULL,
  CONSTRAINT pk_idformulaareamonto PRIMARY KEY (idformulaareamonto ),
  CONSTRAINT fk_idagrupadorarea FOREIGN KEY (idagrupadorarea)
      REFERENCES mod_nomina.conf_agrupadorareas (idagrupador) MATCH Unknown
      ON UPDATE CASCADE ON DELETE CASCADE
)
WITH (
  OIDS=FALSE
);
ALTER TABLE mod_nomina.conf_formulasareasmontos
  OWNER TO zeolides;
GRANT ALL ON TABLE mod_nomina.conf_formulasareasmontos TO zeolides;
GRANT ALL ON TABLE mod_nomina.conf_formulasareasmontos TO public;

--*********************************************************************************************************
--*********************************************************************************************************
-- Sequence: mod_nomina.sec_pagoporresultadofechas_seq
-- DROP SEQUENCE mod_nomina.sec_pagoporresultadofechas_seq;
CREATE SEQUENCE mod_nomina.sec_pagoporresultadofechas_seq
  INCREMENT 1
  MINVALUE 1
  MAXVALUE 9999999999999999
  START 1
  CACHE 1;
ALTER TABLE mod_nomina.sec_pagoporresultadofechas_seq
  OWNER TO zeolides;
COMMENT ON SEQUENCE mod_nomina.sec_pagoporresultadofechas_seq
  IS ' Secuencia empleada para autogenerar el identificador de la tabla "conf_pagosporresultadofechas".';


-- Table: mod_nomina.conf_pagosporresultadofechas
--DROP TABLE mod_nomina.conf_pagosporresultadofechas;
CREATE TABLE mod_nomina.conf_pagosporresultadofechas
(
  idpagoporresultadofechas numeric(19,0) NOT NULL DEFAULT nextval('mod_nomina.sec_pagoporresultadofechas_seq'::regclass), -- Identificador de la tupla
  idpagoporresultado numeric(19,0) NOT NULL,
  fechainicio date,
  fechafin date,
  identidad numeric(19,0),
  CONSTRAINT pk_pagosporresultadofechas PRIMARY KEY (idpagoporresultadofechas),
  CONSTRAINT fk_pagoporresultado FOREIGN KEY (idpagoporresultado)
      REFERENCES mod_nomina.conf_pagosporresultado (idpagoporresultado) MATCH SIMPLE
      ON UPDATE CASCADE ON DELETE CASCADE
)
WITH (
  OIDS=FALSE
);
ALTER TABLE mod_nomina.conf_pagosporresultadofechas
  OWNER TO zeolides;
COMMENT ON TABLE mod_nomina.conf_pagosporresultadofechas
  IS 'Almacena la configuracin del tipo de pago y la clase que lo implementa.';
COMMENT ON COLUMN mod_nomina.conf_pagosporresultadofechas.idpagoporresultadofechas IS 'Identificador de la tupla';

--*********************************************************************************************************
--*********************************************************************************************************
-- Sequence: mod_nomina.sec_periodosdestajo_seq
-- DROP SEQUENCE mod_nomina.sec_periodosdestajo_seq;
CREATE SEQUENCE mod_nomina.sec_periodosdestajo_seq
  INCREMENT 1
  MINVALUE 1
  MAXVALUE 999999999999
  START 16
  CACHE 1;
ALTER TABLE mod_nomina.sec_periodosdestajo_seq
  OWNER TO zeolides;
GRANT ALL ON TABLE mod_nomina.sec_periodosdestajo_seq TO zeolides;
GRANT ALL ON TABLE mod_nomina.sec_periodosdestajo_seq TO public;
GRANT SELECT ON TABLE mod_nomina.sec_periodosdestajo_seq TO alfresco;
COMMENT ON SEQUENCE mod_nomina.sec_periodosdestajo_seq
  IS ' Secuencia empleada para autogenerar el identificador de la tabla "dat_periodosdestajo".';
  
-- Table: mod_nomina.dat_periodosdestajo
-- DROP TABLE mod_nomina.dat_periodosdestajo;
CREATE TABLE mod_nomina.dat_periodosdestajo
(
  idperiodosdestajo numeric(3,0) NOT NULL DEFAULT nextval('mod_nomina.sec_periodosdestajo_seq'::regclass),
  identidad numeric(19,0) NOT NULL,
  idpagoresultado numeric(19,0) NOT NULL,
  fechainicio date NOT NULL,
  fechafin date,
  CONSTRAINT pk_periodosdestajo PRIMARY KEY (idperiodosdestajo )
)
WITH (
  OIDS=FALSE
);
ALTER TABLE mod_nomina.dat_periodosdestajo
  OWNER TO zeolides;
GRANT ALL ON TABLE mod_nomina.dat_periodosdestajo TO zeolides;
GRANT ALL ON TABLE mod_nomina.dat_periodosdestajo TO public;

--*********************************************************************************************************
--*********************************************************************************************************
-- Sequence: mod_nomina.sec_dat_personaestructuranominacobrosypagos_seq
-- DROP SEQUENCE mod_nomina.sec_dat_personaestructuranominacobrosypagos_seq;
CREATE SEQUENCE mod_nomina.sec_dat_personaestructuranominacobrosypagos_seq
  INCREMENT 1
  MINVALUE 1
  MAXVALUE 999999999999
  START 502
  CACHE 1;
ALTER TABLE mod_nomina.sec_dat_personaestructuranominacobrosypagos_seq
  OWNER TO zeolides;
COMMENT ON SEQUENCE mod_nomina.sec_dat_personaestructuranominacobrosypagos_seq
  IS ' Secuencia empleada para autogenerar el identificador de la tabla "dat_personaestructuranominacobrosypagos".';
 
-- Table: mod_nomina.dat_personaestructuranominacobrosypagos
-- DROP TABLE mod_nomina.dat_personaestructuranominacobrosypagos;
CREATE TABLE mod_nomina.dat_personaestructuranominacobrosypagos
(
  idpersonaestructuranominacobrosypagos numeric(19,0) NOT NULL DEFAULT nextval('mod_nomina.sec_dat_personaestructuranominacobrosypagos_seq'::regclass),
  idpersona numeric(19,0),
  idestructuramodelodomina numeric(19,0),
  iddocumentoobligacion numeric(19,0),
  idcuenta numeric(19,0),
  importe numeric(5,2),
  estado numeric(1,0),
  CONSTRAINT pk_personaestructuranominacobrosypagos PRIMARY KEY (idpersonaestructuranominacobrosypagos)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE mod_nomina.dat_personaestructuranominacobrosypagos
  OWNER TO zeolides;
  
--*********************************************************************************************************
--*********************************************************************************************************
-- Sequence: mod_nomina.sec_exportacionbancoficheroentidad_seq
-- DROP SEQUENCE mod_nomina.sec_exportacionbancoficheroentidad_seq;
CREATE SEQUENCE mod_nomina.sec_exportacionbancoficheroentidad_seq
  INCREMENT 1
  MINVALUE 1
  MAXVALUE 999999999999
  START 502
  CACHE 1;
ALTER TABLE mod_nomina.sec_exportacionbancoficheroentidad_seq
  OWNER TO zeolides;
COMMENT ON SEQUENCE mod_nomina.sec_exportacionbancoficheroentidad_seq
  IS ' Secuencia empleada para autogenerar el identificador de la tabla "conf_exportacionbancoficheroentidad".';
 
-- Table: mod_nomina.conf_exportacionbancoficheroentidad
-- DROP TABLE mod_nomina.conf_exportacionbancoficheroentidad;
CREATE TABLE mod_nomina.conf_exportacionbancoficheroentidad
(
  idconfexportaciondbfbancoficheroentidad numeric(19,0) NOT NULL DEFAULT nextval('mod_nomina.sec_exportacionbancoficheroentidad_seq'::regclass),
  identidad numeric(19,0) NOT NULL,
  fichero character varying(255),
  CONSTRAINT pk_confexportaciondbfbancoficheroentidad PRIMARY KEY (idconfexportaciondbfbancoficheroentidad)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE mod_nomina.conf_exportacionbancoficheroentidad
  OWNER TO zeolides;

--*********************************************************************************************************
--*********************************************************************************************************
-- Sequence: mod_nomina.sec_exportacionbanco_seq
-- DROP SEQUENCE mod_nomina.sec_exportacionbanco_seq;
CREATE SEQUENCE mod_nomina.sec_exportacionbanco_seq
  INCREMENT 1
  MINVALUE 1
  MAXVALUE 999999999999
  START 502
  CACHE 1;
ALTER TABLE mod_nomina.sec_exportacionbanco_seq
  OWNER TO zeolides;
COMMENT ON SEQUENCE mod_nomina.sec_exportacionbanco_seq
  IS ' Secuencia empleada para autogenerar el identificador de la tabla "conf_exportacionbanco".';
 
-- Table: mod_nomina.conf_exportacionbanco
-- DROP TABLE mod_nomina.conf_exportacionbanco;
CREATE TABLE mod_nomina.conf_exportacionbanco
(
  idconfexportaciondbfbanco numeric(19,0) NOT NULL DEFAULT nextval('mod_nomina.sec_exportacionbanco_seq'::regclass),
  idbanco numeric(19,0) NOT NULL,
  tipocampo character varying(255) NOT NULL,
  denomcampo character varying(255) NOT NULL,
  tipodato numeric(19,0) NOT NULL,
  longitudvalor numeric(19,0) NOT NULL,
  tipofichero numeric(19,0) NOT NULL,
  lugaresdecimales numeric(19,0) NOT NULL,
  orden numeric(19,0) NOT NULL,
  idconfexportaciondbfbancoficheroentidad numeric(19,0) NOT NULL,

  CONSTRAINT pk_confexportaciondbfbanco PRIMARY KEY (idconfexportaciondbfbanco)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE mod_nomina.conf_exportacionbanco
  OWNER TO zeolides;

--*********************************************************************************************************
--********************************************************************************************************* 
-- Sequence: mod_nomina.sec_camposreportecorreoentidad_seq
-- DROP SEQUENCE mod_nomina.sec_camposreportecorreoentidad_seq;
CREATE SEQUENCE mod_nomina.sec_camposreportecorreoentidad_seq
  INCREMENT 1
  MINVALUE 1
  MAXVALUE 9999999999999999
  START 1
  CACHE 1;
ALTER TABLE mod_nomina.sec_camposreportecorreoentidad_seq
  OWNER TO zeolides;
COMMENT ON SEQUENCE mod_nomina.sec_camposreportecorreoentidad_seq
  IS ' Secuencia empleada para autogenerar el identificador de la tabla "conf_camposreportecorreoentidad".';
  
-- Table: mod_nomina.conf_camposreportecorreoentidad
-- DROP TABLE mod_nomina.conf_camposreportecorreoentidad;
CREATE TABLE mod_nomina.conf_camposreportecorreoentidad
(
  idcamporeportecorreoentidad numeric(19,0) NOT NULL DEFAULT nextval('mod_nomina.sec_camposreportecorreoentidad_seq'::regclass),
  identidad numeric(19,0) NOT NULL,
  idcamporeportecorreo numeric(19,0),
  CONSTRAINT pk_idcamporeportecorreoentidad PRIMARY KEY (idcamporeportecorreoentidad)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE mod_nomina.conf_camposreportecorreoentidad
  OWNER TO zeolides;
GRANT ALL ON TABLE mod_nomina.conf_camposreportecorreoentidad TO zeolides;
GRANT ALL ON TABLE mod_nomina.conf_camposreportecorreoentidad TO public;

--*********************************************************************************************************
--********************************************************************************************************* 
-- Sequence: mod_nomina.sec_camposreportecorreo_seq
-- DROP SEQUENCE mod_nomina.sec_camposreportecorreo_seq;
CREATE SEQUENCE mod_nomina.sec_camposreportecorreo_seq
  INCREMENT 1
  MINVALUE 1
  MAXVALUE 9999999999999999
  START 1
  CACHE 1;
ALTER TABLE mod_nomina.sec_camposreportecorreo_seq
  OWNER TO zeolides;
COMMENT ON SEQUENCE mod_nomina.sec_camposreportecorreo_seq
  IS ' Secuencia empleada para autogenerar el identificador de la tabla "conf_camposreportecorreo".';

-- DROP TABLE mod_nomina.conf_camposreportecorreo;
CREATE TABLE mod_nomina.conf_camposreportecorreo
(
  idcamporeportecorreo numeric(19,0) NOT NULL DEFAULT nextval('mod_nomina.sec_camposreportecorreo_seq'::regclass),
  denominacion character varying(255) NOT NULL,
  idformula numeric(19,0) NOT NULL,
  orden numeric(19,0),
  descripcion character varying(255),
  mostrarvacaciones numeric(1,0),
  mostrarsnc numeric(1,0),
  CONSTRAINT pk_idcamporeportecorreo PRIMARY KEY (idcamporeportecorreo)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE mod_nomina.conf_camposreportecorreo
  OWNER TO zeolides;
GRANT ALL ON TABLE mod_nomina.conf_camposreportecorreo TO zeolides;
GRANT ALL ON TABLE mod_nomina.conf_camposreportecorreo TO public;

--*********************************************************************************************************
--********************************************************************************************************* 

 -- Column: horasdias

-- ALTER TABLE mod_nomina.conf_causasreporteausencia DROP COLUMN horasdias;

ALTER TABLE mod_nomina.conf_causasreporteausencia ADD COLUMN horasdias numeric(1,0);


-- ALTER TABLE mod_nomina.conf_indicadorespagoporresultado CAMBIANDO LOS LUGARES DECIMALES expresionmatematicaformula;
ALTER TABLE mod_nomina.conf_indicadorespagoporresultado
   ALTER COLUMN expresionmatematicaformula TYPE numeric(19,0);   


-- Column: datos
-- ALTER TABLE mod_nomina.dat_reportescertificaciones DROP COLUMN datos;
ALTER TABLE mod_nomina.dat_reportescertificaciones ADD COLUMN datos text;

UPDATE mod_nomina.dat_reportescertificaciones
   SET estado = 1
 WHERE  estado = 2;
 
 -- Column: tiporeferencia

-- ALTER TABLE mod_nomina.conf_estructuramodelosnomina DROP COLUMN tiporeferencia;

ALTER TABLE mod_nomina.conf_estructuramodelosnomina ADD COLUMN tiporeferencia numeric(1,0);
COMMENT ON COLUMN mod_nomina.conf_estructuramodelosnomina.tiporeferencia IS '1. Referencias por rangos de fechas
2. Referencias especificas de los periodos de pago';

UPDATE mod_nomina.conf_estructuramodelosnomina
   SET tiporeferencia = 1
 WHERE idtipocampo = 4
 
 -- Column: fijaretencionesporpagar

-- ALTER TABLE mod_rrhhmaestro.dat_modulo DROP COLUMN fijaretencionesporpagar;

ALTER TABLE mod_rrhhmaestro.dat_modulo ADD COLUMN fijaretencionesporpagar numeric(1,0);
ALTER TABLE mod_rrhhmaestro.dat_modulo ALTER COLUMN fijaretencionesporpagar SET DEFAULT 1;

----- mod_nomina.dat_elaborarpagosreferencia
  
CREATE SEQUENCE mod_nomina.sec_datelaborarpagoreferencia_seq
  INCREMENT 1
  MINVALUE 1
  MAXVALUE 999999999999
  START 15
  CACHE 1;
ALTER TABLE mod_nomina.sec_datelaborarpagoreferencia_seq
  OWNER TO zeolides;

CREATE TABLE mod_nomina.dat_elaborarpagosreferencia
(
  idelaborarpagos numeric(19,0) NOT NULL,
  idelaborarpagosreferenciados numeric(19,0) NOT NULL,
  idelaborarpagosreferencia numeric NOT NULL DEFAULT nextval('mod_nomina.sec_datelaborarpagoreferencia_seq'::regclass),
  CONSTRAINT pk_idelaborarpagosreferencia PRIMARY KEY (idelaborarpagosreferencia)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE mod_nomina.dat_elaborarpagosreferencia
  OWNER TO zeolides;
  

  -----Cambiandole el tamao al campo descripcion de las confvariablestiporeportes
ALTER TABLE mod_nomina.conf_variablestiporeportescertificaciones 
ALTER COLUMN descripcion TYPE character varying;  

-- Column: idcampoliquidaobligacion

-- Campo que liquida una obligacion en los conceptos contables;

ALTER TABLE mod_nomina.conf_conceptoscontables ADD COLUMN idcampoliquidaobligacion numeric(19,0);
COMMENT ON COLUMN mod_nomina.conf_conceptoscontables.idcampoliquidaobligacion IS 'Campo de la estructura de nomina que liquida una obligacion';

-- Column: anotaciones
-- ALTER TABLE mod_nomina.conf_vblesgblesregsaltmpserv DROP COLUMN anotaciones;
ALTER TABLE mod_nomina.conf_vblesgblesregsaltmpserv ADD COLUMN anotaciones character varying(255);

-- DROP CONSTRAINT conf_escalaelementosalarial_fk1 + ADD CONSTRAINT conf_escalaelementosalarial_fk2
ALTER TABLE mod_nomina.conf_escalaelementosalarial
  DROP CONSTRAINT conf_escalaelementosalarial_fk1 RESTRICT;

ALTER TABLE mod_nomina.conf_escalaelementosalarial
  ADD CONSTRAINT conf_escalaelementosalarial_fk2 FOREIGN KEY (idconfconceptospdelementossalariales)
      REFERENCES mod_nomina.conf_conceptospdelementossalariales (idconfconceptospdelementossalariales) MATCH SIMPLE
      ON UPDATE CASCADE ON DELETE CASCADE;
-- DROP CONSTRAINT fk_conceptospdelementossalatial_escalaelementosalarialpersona + ADD CONSTRAINT fk_conceptospdelementossalatial_escalaelementosalarialpersona1	  
	  
 ALTER TABLE mod_nomina.conf_escalaelementosalarialpersona
  DROP CONSTRAINT fk_conceptospdelementossalatial_escalaelementosalarialpersona RESTRICT;

ALTER TABLE mod_nomina.conf_escalaelementosalarialpersona
  ADD CONSTRAINT fk_conceptospdelementossalatial_escalaelementosalarialpersona1 FOREIGN KEY (idconfconceptospdelementossalariales)
      REFERENCES mod_nomina.conf_conceptospdelementossalariales (idconfconceptospdelementossalariales) MATCH SIMPLE
      ON UPDATE CASCADE ON DELETE CASCADE;
	  
--2 lugares decimales para los ajustes
ALTER TABLE mod_nomina.his_vacacionespersona ALTER COLUMN ajusteimporte TYPE NUMERIC(19,2);
ALTER TABLE mod_nomina.his_vacacionespersona ALTER COLUMN ajustetiempo TYPE NUMERIC(19,2);	 

 --Para quitar las fechas de vencimiento en Asociar Personas a Centros de Costo.
 UPDATE mod_nomina.dat_cargosocupados
   SET fechavencimiento = null; 
   
--Para aumentarle el tamao a  textoformula en conf_estructuramodelosnomina
 ALTER TABLE mod_nomina.conf_estructuramodelosnomina ALTER COLUMN textoformula TYPE character varying;
 
 ---2 lugares decimales para los ajustes de las bajas
ALTER TABLE mod_nomina.his_vacacionespersonabaja ALTER COLUMN ajusteimporte TYPE NUMERIC(19,2);
ALTER TABLE mod_nomina.his_vacacionespersonabaja ALTER COLUMN ajustetiempo TYPE NUMERIC(19,2);

-----Tabla y secuencia nuevas para configurar las asociaciones de las cuentas contables para luego buscar descuadres
-- Sequence: mod_nomina.sec_asociacioncuentascontables_seq
-- DROP SEQUENCE mod_nomina.sec_asociacioncuentascontables_seq;
CREATE SEQUENCE mod_nomina.sec_asociacioncuentascontables_seq
  INCREMENT 1
  MINVALUE 1
  MAXVALUE 999999999999999999
  START 147
  CACHE 1;
ALTER TABLE mod_nomina.sec_asociacioncuentascontables_seq
  OWNER TO zeolides;
COMMENT ON SEQUENCE mod_nomina.sec_asociacioncuentascontables_seq
  IS ' Secuencia empleada para autogenerar el identificador de la tabla "conf_asociacioncuentascontables".';




-- Table: mod_nomina.conf_asociacioncuentascontables
-- DROP TABLE mod_nomina.conf_asociacioncuentascontables;
CREATE TABLE mod_nomina.conf_asociacioncuentascontables
(
  idasociacioncuentascont numeric(19,0) NOT NULL DEFAULT nextval('mod_nomina.sec_asociacioncuentascontables_seq'::regclass), -- Identificador de la tupla.
  identidad numeric(19,0) NOT NULL, -- Identificador de la entidad.
  idtiponomina numeric(19,0) NOT NULL, -- Identificador del tipo de nomina.
  denominacion character varying(255) NOT NULL,
  cuentasdeudoras character varying(255) NOT NULL, -- Identificador de la cuenta deudora.
  cuentasacreedoras text, -- Identificadores de los las cuentas acreedoras.
  CONSTRAINT pk_idasociacioncuentascont PRIMARY KEY (idasociacioncuentascont)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE mod_nomina.conf_asociacioncuentascontables
  OWNER TO zeolides;
GRANT ALL ON TABLE mod_nomina.conf_asociacioncuentascontables TO zeolides;
GRANT ALL ON TABLE mod_nomina.conf_asociacioncuentascontables TO public;
COMMENT ON TABLE mod_nomina.conf_asociacioncuentascontables
  IS 'Almacena las asociaciones de las cuentas contables.';
COMMENT ON COLUMN mod_nomina.conf_asociacioncuentascontables.idasociacioncuentascont IS 'Identificador de la tupla.';
COMMENT ON COLUMN mod_nomina.conf_asociacioncuentascontables.identidad IS ' Identificador de la entidad.';
COMMENT ON COLUMN mod_nomina.conf_asociacioncuentascontables.idtiponomina IS ' Identificador del tipo de nomina.';
COMMENT ON COLUMN mod_nomina.conf_asociacioncuentascontables.cuentasdeudoras IS 'Identificador de la cuenta deudora.';
COMMENT ON COLUMN mod_nomina.conf_asociacioncuentascontables.cuentasacreedoras IS 'Identificadores de los las cuentas acreedoras.';

-- Column: registrotiponominamanual

-- ALTER TABLE mod_nomina.dat_registrosalariotiemposervcio DROP COLUMN registrotiponominamanual;

ALTER TABLE mod_nomina.dat_registrosalariotiemposervcio ADD COLUMN registrotiponominamanual numeric(1,0);
ALTER TABLE mod_nomina.dat_registrosalariotiemposervcio ALTER COLUMN registrotiponominamanual SET DEFAULT 0;


-- Column: codigocontabilidad

-- Codigo en Estructura para Contabilizar en el Sistema Contable Savic. 

-- ALTER TABLE mod_estructuracomp.dat_estructura DROP COLUMN codigocontabilidad;

ALTER TABLE mod_estructuracomp.dat_estructura ADD COLUMN codigocontabilidad numeric(4,0);
COMMENT ON COLUMN mod_estructuracomp.dat_estructura.codigocontabilidad IS 'Codigo para Contabilizar en el Sistema Contable Savic.';

---2 lugares decimales para los importes del comprobante de operaciones que se guarda en  dat_comprobantenomina
ALTER TABLE mod_nomina.dat_comprobantenomina ALTER COLUMN importe TYPE NUMERIC(19,2);
ALTER TABLE mod_nomina.dat_comprobantenomina ALTER COLUMN importemb TYPE NUMERIC(19,2);
ALTER TABLE mod_nomina.dat_comprobantenomina ALTER COLUMN importemo TYPE NUMERIC(19,2);



-- Columna idvariablesconfreportescertificacionesreportesanteriores en conf_variablestiporeportescertificaciones para poder buscar valores de Reportes Antiguos;

ALTER TABLE mod_nomina.conf_variablestiporeportescertificaciones ADD COLUMN idvariablesconfreportescertificacionesreportesanteriores numeric(19,0);

-- Column: idestructurasincroniza

-- ALTER TABLE mod_nomina.conf_plantillanominal DROP COLUMN idestructurasincroniza para guardar el idesctructura que sincroniza;

ALTER TABLE mod_nomina.conf_plantillanominal ADD COLUMN idestructurasincroniza numeric(19,0);


--Campos de la estructura mapeados en codigo pero que no estan creados en base datos en TRD
--En dat_estructura: En TRD crear esta columna que ya se encuentran mapeada en el codigo -> codigonit
-- Column: codigonit
-- ALTER TABLE mod_estructuracomp.dat_estructura DROP COLUMN codigonit;
ALTER TABLE mod_estructuracomp.dat_estructura ADD COLUMN codigonit character varying(50);

  
--En dat_estructuraop: En TRD crear todas estas columnas que ya se encuentran mapeadas en el codigo -> correo,codigonit,objetosocial,funcioneslegales,direccion,fax,iddpt,telefono,idicono
-- Column: correo
-- ALTER TABLE mod_estructuracomp.dat_estructuraop DROP COLUMN correo;
ALTER TABLE mod_estructuracomp.dat_estructuraop ADD COLUMN correo character varying(50);
COMMENT ON COLUMN mod_estructuracomp.dat_estructuraop.correo IS 'Dirección de correo.';

-- Column: codigonit
-- ALTER TABLE mod_estructuracomp.dat_estructuraop DROP COLUMN codigonit;
ALTER TABLE mod_estructuracomp.dat_estructuraop ADD COLUMN codigonit character varying(50);

-- Column: objetosocial
-- ALTER TABLE mod_estructuracomp.dat_estructuraop DROP COLUMN objetosocial;
ALTER TABLE mod_estructuracomp.dat_estructuraop ADD COLUMN objetosocial character varying(255);
COMMENT ON COLUMN mod_estructuracomp.dat_estructuraop.objetosocial IS 'Objeto social.';

-- Column: funcioneslegales
-- ALTER TABLE mod_estructuracomp.dat_estructuraop DROP COLUMN funcioneslegales;
ALTER TABLE mod_estructuracomp.dat_estructuraop ADD COLUMN funcioneslegales character varying(255);
COMMENT ON COLUMN mod_estructuracomp.dat_estructuraop.funcioneslegales IS 'Funciones legales.';

-- Column: direccion
-- ALTER TABLE mod_estructuracomp.dat_estructuraop DROP COLUMN direccion;
ALTER TABLE mod_estructuracomp.dat_estructuraop ADD COLUMN direccion character varying(255);
COMMENT ON COLUMN mod_estructuracomp.dat_estructuraop.direccion IS 'Dirección.';

-- Column: fax
-- ALTER TABLE mod_estructuracomp.dat_estructuraop DROP COLUMN fax;
ALTER TABLE mod_estructuracomp.dat_estructuraop ADD COLUMN fax character varying(255);
COMMENT ON COLUMN mod_estructuracomp.dat_estructuraop.fax IS 'Fax.';

-- Column: iddpt
-- ALTER TABLE mod_estructuracomp.dat_estructuraop DROP COLUMN iddpt;
ALTER TABLE mod_estructuracomp.dat_estructuraop ADD COLUMN iddpt numeric(19,0);
COMMENT ON COLUMN mod_estructuracomp.dat_estructuraop.iddpt IS 'Identificador de instrucción política territorial.';

-- Column: telefono
-- ALTER TABLE mod_estructuracomp.dat_estructuraop DROP COLUMN telefono;
ALTER TABLE mod_estructuracomp.dat_estructuraop ADD COLUMN telefono character varying(255);
COMMENT ON COLUMN mod_estructuracomp.dat_estructuraop.telefono IS 'Número de teléfono.';

-- Column: idicono
-- ALTER TABLE mod_estructuracomp.dat_estructuraop DROP COLUMN idicono;
ALTER TABLE mod_estructuracomp.dat_estructuraop ADD COLUMN idicono numeric(100,0);
ALTER TABLE mod_estructuracomp.dat_estructuraop ALTER COLUMN idicono SET DEFAULT 0;
COMMENT ON COLUMN mod_estructuracomp.dat_estructuraop.idicono IS 'Identificador de la tabla nom_icono';


-- Quitandole el idnomina obligatorio a las opraciones del submayor de retenciones para que se puedan liquidar desde caja;
ALTER TABLE mod_nomina.his_retencionpersona ALTER COLUMN idnomina DROP NOT NULL;

--************************************************TABLA PARA LLEVAR LOS CAMBIOS EN LAS ESCALAS A LA PERSONA Y EL CARGO***************************************************
--***********************************************************************************************************************************************************************
-- Sequence: mod_nomina.sec_dat_cambiosescalaspersonacargoconceptospd_seq
-- DROP SEQUENCE mod_nomina.sec_dat_cambiosescalaspersonacargoconceptospd_seq;
CREATE SEQUENCE mod_nomina.sec_dat_cambiosescalaspersonacargoconceptospd_seq
  INCREMENT 1
  MINVALUE 1
  MAXVALUE 9999999999999999
  START 1
  CACHE 1;
ALTER TABLE mod_nomina.sec_dat_cambiosescalaspersonacargoconceptospd_seq
  OWNER TO zeolides;
COMMENT ON SEQUENCE mod_nomina.sec_dat_cambiosescalaspersonacargoconceptospd_seq
  IS ' Secuencia empleada para autogenerar el identificador de la tabla "dat_cambiosescalaspersonacargoconceptospd".';


-- Table: mod_nomina.dat_cambiosescalaspersonacargoconceptospd
-- DROP TABLE mod_nomina.dat_cambiosescalaspersonacargoconceptospd;
CREATE TABLE mod_nomina.dat_cambiosescalaspersonacargoconceptospd
(
  idcambiosescalaspersonacargoconceptospd numeric(19,0) NOT NULL DEFAULT nextval('mod_nomina.sec_dat_cambiosescalaspersonacargoconceptospd_seq'::regclass),
  idpersona numeric(19,0) NOT NULL,
  idcargo numeric(19,0) NOT NULL,
  fecha date NOT NULL DEFAULT now(),
  CONSTRAINT pk_dat_cambiosescalaspersonacargoconceptospd PRIMARY KEY (idcambiosescalaspersonacargoconceptospd)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE mod_nomina.dat_cambiosescalaspersonacargoconceptospd
  OWNER TO zeolides;
GRANT ALL ON TABLE mod_nomina.dat_cambiosescalaspersonacargoconceptospd TO zeolides;

--Poniendole Numeric al campo anno en datregistrosalariotiemposervicio
ALTER TABLE mod_nomina.dat_registrosalariotiemposervcio
   ALTER COLUMN anno TYPE numeric(4,0) USING anno::numeric;
   
   -- Column: idvariablesconfreportescertiicacionesmesinicial
-- ALTER TABLE mod_nomina.conf_variablestiporeportescertificaciones ADD COLUMN idvariablesconfreportescertiicacionesmesinicial;
ALTER TABLE mod_nomina.conf_variablestiporeportescertificaciones ADD COLUMN idvariablesconfreportescertiicacionesmesinicial numeric(19,0);

-- Poniendole tipo de fichero DBF o XLS a las Configuraciones de los Campos de los ficheros para Acreditar Salarios en el Banco;
ALTER TABLE mod_nomina.conf_exportacionbancoficheroentidad ADD COLUMN tipoformato numeric(1,0);
ALTER TABLE mod_nomina.conf_exportacionbancoficheroentidad ALTER COLUMN tipoformato SET DEFAULT 1;

-- Poniendole tipo de fichero DBFa las Configuraciones de los Campos de los ficheros para Acreditar Salarios en el Banco;
UPDATE
  mod_nomina.conf_exportacionbancoficheroentidad
SET
  tipoformato = 1;

--Campo nuevo para definir el Comportamiento del SNC. Si esta integrado en el Distra o si va a funcionar como el Sigerh
ALTER TABLE mod_rrhhmaestro.dat_modulo ADD COLUMN sncsigerh numeric(1,0);
ALTER TABLE mod_rrhhmaestro.dat_modulo ALTER COLUMN sncsigerh SET DEFAULT 0;


------------------------------------------------------------------------------------------------------------------
--Campo nuevo para poder acumular en el SNC un mes anterior o posterior
ALTER TABLE mod_nomina.conf_estructuramodelosnomina ADD COLUMN idmessnc numeric(1,0);

--Quitandole el Not Null al Campo Reporte de Salida en la Configuracion del Pago por Resultados.
ALTER TABLE mod_nomina.conf_indicadorespagoporresultado ALTER COLUMN idreportesalida DROP NOT NULL;
---------------------------------------------------------------------------------------------------------------------------------  

--------------------------------------------------------POR ACTUALIZAR------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
--------------------------------------------Cambio en el trigger  t_del_last_idp_ide de mod_nomina.dat_cargosocupados para que el Sistema no borre mas los Registros del SNC de las Personas Eliminadas----------------------------------------------------
CREATE OR REPLACE FUNCTION mod_nomina.ft_del_last_idp_ide (
)
RETURNS trigger AS
$body$
DECLARE
      v_cargoocupado record;
BEGIN
     IF (TG_OP = 'DELETE') THEN
-- Al eliminar de la tabla "dat_cargosocupados"
	SELECT OLD.idpersona||''||OLD.identidad AS denom, count(OLD.idpersona||''||OLD.identidad) AS cant
	INTO v_cargoocupado FROM mod_nomina.dat_cargosocupados
	WHERE (OLD.idpersona||''||OLD.identidad = idpersona||''||identidad::text)
	GROUP BY OLD.idpersona||''||OLD.identidad;
	--RAISE EXCEPTION 'denom: % , cant: %',v_cargoocupado.denom,v_cargoocupado.cant;
-- 1- Verificar si es la última ocurrencia del par "idpersona,identidad"
	IF (v_cargoocupado.cant = 1) THEN
--    1.1- V: Eliminar en "dat_retencionpersona" --FK (CASCADE)--> "his_retencionpersona"
	   DELETE FROM mod_nomina.dat_retencionpersona WHERE v_cargoocupado.denom = idpersona||''||identidad::text;
--	   V: Eliminar en "conf_vacacionespersona" , "dat_vacacionespersona" --FK (CASCADE)--> "his_vacacionespersona"
	   DELETE FROM mod_nomina.conf_vacacionespersona WHERE v_cargoocupado.denom = idpersona||''||idestructura::text;
	   DELETE FROM mod_nomina.dat_vacacionespersona WHERE v_cargoocupado.denom = idpersona||''||identidad::text;
--         V: Eliminar en "dat_registrosalariotiemposervcio"
	    --DELETE FROM mod_nomina.dat_registrosalariotiemposervcio WHERE v_cargoocupado.denom = idpersona||''||idestructura::text;
	   RETURN OLD;
	ELSE
	    RAISE NOTICE '%',v_cargoocupado.denom;
	    --DELETE FROM mod_nomina.dat_cargosocupados WHERE idcargosocupados = OLD.idcargosocupados;
	END IF;
     /*
        SELECT cast(OLD.idcargosocupados as numeric) INTO v_idcargoocupado
        FROM mod_nomina.dat_cargosocupados
        WHERE NEW.idsituacionlaboral IS NULL AND OLD.idsituacionlaboral IS NOT NULL;
        PERFORM mod_nomina.f_del_elementosalarialsituacionservicio(v_idcargoocupado);
        --RAISE EXCEPTION '%',v_idcargoocupado;*/
      END IF;
      RETURN OLD;
END;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
PARALLEL UNSAFE
COST 100;
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
------------------------------------------- Por actualizar-------------------------------------------------------------------
--Script para la creacion de la tabla conf_personaretencion para almasenar el listado de las personas con retención.
--nota: Correr el script del insert para almasenar en la tabla las persona que tenian retencion antes de actualizar para no perderlas.  
-- Sequence: mod_nomina.sec_conf_personaretencion_seq

-- DROP SEQUENCE mod_nomina.sec_conf_personaretencion_seq;
CREATE SEQUENCE IF NOT EXISTS mod_nomina.sec_conf_personaretencion_seq
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 9999999999999999
    CACHE 1;
ALTER SEQUENCE mod_nomina.sec_conf_personaretencion_seq OWNER TO zeolides;
GRANT ALL ON SEQUENCE mod_nomina.sec_conf_personaretencion_seq TO PUBLIC;
GRANT ALL ON SEQUENCE mod_nomina.sec_conf_personaretencion_seq TO zeolides;

-- Table: mod_nomina.conf_personaretencion

-- DROP TABLE mod_nomina.conf_personaretencion;
CREATE TABLE IF NOT EXISTS mod_nomina.conf_personaretencion
(
    idconfpersonaretencion numeric NOT NULL DEFAULT nextval('mod_nomina.sec_conf_personaretencion_seq'::regclass),
    idpersona numeric(19,0) NOT NULL,
    identidad numeric(19,0) NOT NULL,
    CONSTRAINT pk_personaretencion PRIMARY KEY (idconfpersonaretencion)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE IF EXISTS mod_nomina.conf_personaretencion OWNER to zeolides;
GRANT DELETE, INSERT, REFERENCES, SELECT, TRIGGER, UPDATE ON TABLE mod_nomina.conf_personaretencion TO PUBLIC;
GRANT ALL ON TABLE mod_nomina.conf_personaretencion TO zeolides;

--Llenar la tabla mod_nomina.conf_personaretencion
insert into mod_nomina.conf_personaretencion (idpersona,identidad)
(select idpersona, identidad from mod_nomina.dat_retencionpersona
	where idpersona||'-'||identidad not in (select idpersona||'-'||identidad from mod_nomina.conf_personaretencion)
	group by idpersona, identidad);

-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
------------------------Creación de la secuencia y el script de la tabla nom_cuentascierre para el cierre de Nómina------------------------------

-- Sequence: mod_nomina.sec_cuentascierre_seq

-- DROP SEQUENCE mod_nomina.sec_cuentascierre_seq;

CREATE SEQUENCE mod_nomina.sec_cuentascierre_seq
  INCREMENT 1
  MINVALUE 0
  MAXVALUE 9223372036854775807
  START 1000001
  CACHE 1;
ALTER TABLE mod_nomina.sec_cuentascierre_seq OWNER TO zeolides;
GRANT ALL ON TABLE mod_nomina.sec_cuentascierre_seq TO zeolides;
GRANT ALL ON TABLE mod_nomina.sec_cuentascierre_seq TO zeolides;
CREATE TABLE mod_nomina.nom_cuentascierre
(
   id numeric(19,0) NOT NULL DEFAULT nextval('mod_nomina.sec_cuentascierre_seq'::regclass), 
   idcuenta numeric(19,0) NOT NULL, 
   tipo numeric(9) NOT NULL, 
   CONSTRAINT nom_cuentascierre_pkey PRIMARY KEY (id)
) 
WITH (
  OIDS = FALSE
)
;
ALTER TABLE mod_nomina.nom_cuentascierre
  OWNER TO zeolides;
COMMENT ON COLUMN mod_nomina.nom_cuentascierre.id IS 'identificador de la tabla';
COMMENT ON COLUMN mod_nomina.nom_cuentascierre.idcuenta IS 'identificador de la cuenta del cierre';
COMMENT ON COLUMN mod_nomina.nom_cuentascierre.tipo IS 'Tipo de Cuenta para calcular 1- para las cuentas 455,164,460,334 y 2 para la 492';
COMMENT ON TABLE mod_nomina.nom_cuentascierre
  IS 'Guarda las cuentas del cierre de la nomina';


------- Insertar Nomenclador del cierre en los nomencladores 

INSERT INTO
  mod_nomina.nom_nomencladores
(
  idnomenclador,
  denom,
  descripcion,
  referencia,
  clase
)
VALUES (
 '1036',
  'Cuentas del Cierre',
  'Cuentas del Cierre',
  'nomcuentascierre',
  'Pvd.Nomina.Nomencladores.NomCuentasCierre'
);


-----------Campo comportamientoreportesc4 para la tabla mod_nomina.conf_tiporeportescertificaciones para el comportamiento del reporte de SC-4-04-------------------

ALTER TABLE mod_nomina.conf_tiporeportescertificaciones
  ADD COLUMN comportamientoreportesc4 NUMERIC(1,0) DEFAULT 1;

---Campo idelaborarpago para la tabla mod_nomina.dat_registrosalariotiemposervcio 
ALTER TABLE mod_nomina.dat_registrosalariotiemposervcio ADD COLUMN idelaborarpago NUMERIC(19,0);


---- Script de la secuencia y la tabla his_elaborarpagos-----------------------------
-- Sequence: mod_nomina.sec_his_elaborarpagos_seq           
-- DROP SEQUENCE mod_nomina.sec_his_elaborarpagos_seq;
CREATE SEQUENCE mod_nomina.sec_his_elaborarpagos_seq
INCREMENT 1
START 1
MINVALUE 1
MAXVALUE 9999999999999999
CACHE 1;
ALTER SEQUENCE mod_nomina.sec_his_elaborarpagos_seq OWNER TO zeolides;
GRANT ALL ON SEQUENCE mod_nomina.sec_his_elaborarpagos_seq TO PUBLIC;
GRANT ALL ON SEQUENCE mod_nomina.sec_his_elaborarpagos_seq TO zeolides;

-- Table: mod_nomina.his_elaborarpagos
-- DROP TABLE mod_nomina.his_elaborarpagos;
CREATE TABLE mod_nomina.his_elaborarpagos (
  idhiselaborarpagos NUMERIC DEFAULT nextval('mod_nomina.sec_his_elaborarpagos_seq'::regclass) NOT NULL,  
  idelaborarpagos NUMERIC NOT NULL,  
  idtipopago NUMERIC NOT NULL,  
  idperiodopago NUMERIC NOT NULL,  
  fechapago DATE NOT NULL,  
  fechainicioperiodo DATE,  
  fechafinperiodo DATE,    
  tipocomprobante NUMERIC DEFAULT 1 NOT NULL, 
  identidad NUMERIC NOT NULL,
  idcomprobanteoperaciones NUMERIC(19,0),  
  numerocomprobanteoperaciones NUMERIC(19,0), 
  idcomprobantecancelacion NUMERIC(19,0),  
  numerocomprobantecancelacion NUMERIC(19,0),  
  idcomprobantecuentasporcobrar NUMERIC(19,0),  
  numerocomprobantecuentaxcobrar NUMERIC(19,0),  
  idusuario NUMERIC NOT NULL,  
  descripcion VARCHAR(500),  
  CONSTRAINT his_elaborarpagos_pkey PRIMARY KEY(idhiselaborarpagos),
  CONSTRAINT fk_his_elaborarpagos_nom_periodopago FOREIGN KEY (idperiodopago)
    REFERENCES mod_nomina.nom_periodopago(idperiodopago)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
    NOT DEFERRABLE,
  CONSTRAINT fk_his_elaborarpagos_nom_tipopago FOREIGN KEY (idtipopago)
    REFERENCES mod_nomina.nom_tipopago(idtipopago)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
    NOT DEFERRABLE,
  CONSTRAINT fk_his_elaborarpagos_dat_elaborarpagos FOREIGN KEY (idelaborarpagos)
    REFERENCES mod_nomina.dat_elaborarpagos(idelaborarpagos)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
    NOT DEFERRABLE
) 
WITH (oids = false);
COMMENT ON COLUMN mod_nomina.his_elaborarpagos.descripcion
IS 'Descripción.';
ALTER TABLE mod_nomina.his_elaborarpagos
  OWNER TO zeolides;

--------Campo mesinicialsnc para la tabla mod_nomina.dat_elementosreportescertificaciones cambiarlo a numeric-------------------------------
ALTER TABLE mod_nomina.dat_fechascierreperiodos
  DROP COLUMN mesinicialsnc;
  
  ALTER TABLE mod_nomina.dat_elementosreportescertificaciones
  ADD COLUMN mesinicialsnc NUMERIC(19,0);

----Configuración campo fichero banco y exportar según tipo de banco-------
ALTER TABLE mod_nomina.conf_exportacionbanco
  ALTER COLUMN idbanco DROP NOT NULL;

