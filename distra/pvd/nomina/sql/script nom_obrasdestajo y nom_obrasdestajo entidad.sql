-- Sequence: mod_nomina.sec_obrasdestajo_seq

-- DROP SEQUENCE mod_nomina.sec_obrasdestajo_seq;
CREATE SEQUENCE IF NOT EXISTS mod_nomina.sec_obrasdestajo_seq
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 9999999999999999
    CACHE 1;
ALTER SEQUENCE mod_nomina.sec_obrasdestajo_seq OWNER TO zeolides;
GRANT ALL ON SEQUENCE mod_nomina.sec_obrasdestajo_seq TO PUBLIC;
GRANT ALL ON SEQUENCE mod_nomina.sec_obrasdestajo_seq TO zeolides;

CREATE SEQUENCE IF NOT EXISTS mod_nomina.sec_obrasdestajoentidad_seq
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 9999999999999999
    CACHE 1;
ALTER SEQUENCE mod_nomina.sec_obrasdestajoentidad_seq OWNER TO zeolides;
GRANT ALL ON SEQUENCE mod_nomina.sec_obrasdestajoentidad_seq TO PUBLIC;
GRANT ALL ON SEQUENCE mod_nomina.sec_obrasdestajoentidad_seq TO zeolides;

CREATE TABLE IF NOT EXISTS mod_nomina.nom_obrasdestajo(
  idnomobrasdestajo NUMERIC(19,0) DEFAULT nextval('mod_nomina.sec_obrasdestajo_seq'::regclass) NOT NULL,
  codigo VARCHAR(19) NOT NULL,
  denominacion VARCHAR(255),
  estado VARCHAR(1) DEFAULT 1,
  fechainicio DATE,
  fechafin DATE,  
  CONSTRAINT ak_obrasdestajo_codigo UNIQUE(codigo),
  CONSTRAINT pk_obrasdestajo PRIMARY KEY(idnomobrasdestajo)
) 
WITH (oids = false);

CREATE TABLE IF NOT EXISTS mod_nomina.nom_obrasdestajoentidad(
  idnomobrasdestajoentidad NUMERIC(19,0) DEFAULT nextval('mod_nomina.sec_obrasdestajoentidad_seq'::regclass) NOT NULL,
  idnomobrasdestajo NUMERIC(19,0) NOT NULL,
  identidad NUMERIC(19,0) NOT NULL,
  activo numeric(1,0) DEFAULT 0,
  CONSTRAINT pk_obrasdestajoentidad PRIMARY KEY(idnomobrasdestajoentidad),
  CONSTRAINT chk_activo_obrdestent CHECK ((activo = (0)::numeric) OR (activo = (1)::numeric)),
  CONSTRAINT fk_filaestruc_obrasdestajoentidad_idfila FOREIGN KEY (identidad)
    REFERENCES mod_estructuracomp.nom_filaestruc(idfila)
    ON DELETE CASCADE
    ON UPDATE CASCADE
    NOT DEFERRABLE,
  CONSTRAINT fk_obrasdestajo_entidad_idnomobrasdestajo FOREIGN KEY (idnomobrasdestajo)
    REFERENCES mod_nomina.nom_obrasdestajo(idnomobrasdestajo)
    ON DELETE CASCADE
    ON UPDATE CASCADE
    NOT DEFERRABLE
) 
WITH (oids = false);