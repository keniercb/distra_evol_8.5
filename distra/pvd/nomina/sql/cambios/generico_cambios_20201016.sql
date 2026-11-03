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
  

  -----Cambiandole el tamaño al campo descripcion de las confvariablestiporeportes
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
