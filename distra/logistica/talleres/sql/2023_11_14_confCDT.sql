CREATE SEQUENCE mod_logtaller.sec_reporteparalizacion_seq
  INCREMENT 1 MINVALUE 1000000000
  MAXVALUE 1099999999 START 1000000001
  CACHE 1;

ALTER SEQUENCE mod_logtaller.sec_reporteparalizacion_seq RESTART WITH 1000000001;

CREATE TABLE mod_logtaller.conf_reporteparalizacion (
  idreporteparalizacion NUMERIC(19,0) DEFAULT nextval('mod_logtaller.sec_reporteparalizacion_seq'::regclass) NOT NULL,
  idestructuracomun NUMERIC(19,0),
  denominacion VARCHAR(100),
  activo NUMERIC(1,0) DEFAULT 1,
  agrupacion VARCHAR(255),
  orden NUMERIC(19,0),
  CONSTRAINT pk_reporteparalizacion PRIMARY KEY(idreporteparalizacion)
) 
WITH (oids = false);

ALTER TABLE mod_logtaller.conf_reporteparalizacion
  OWNER TO zeolides;



CREATE SEQUENCE mod_logtaller.sec_reporteconcepto_seq
  INCREMENT 1 MINVALUE 1000000000
  MAXVALUE 1099999999 START 1000000001
  CACHE 1;

ALTER SEQUENCE mod_logtaller.sec_reporteconcepto_seq RESTART WITH 1000000001;

CREATE TABLE mod_logtaller.dat_reportetipo (
  idreportetipo NUMERIC(19,0) DEFAULT nextval('mod_logtaller.sec_reporteconcepto_seq'::regclass) NOT NULL,
  idreporteparalizacion NUMERIC(19,0),
  idtipo NUMERIC(19,0),
  idestructuracomun NUMERIC(19,0),
  CONSTRAINT pk_reportetipo PRIMARY KEY(idreportetipo),
  CONSTRAINT dat_reporte_fk FOREIGN KEY (idreporteparalizacion)
    REFERENCES mod_logtaller.conf_reporteparalizacion(idreporteparalizacion)
    ON DELETE CASCADE
    ON UPDATE NO ACTION
    NOT DEFERRABLE
) 
WITH (oids = false);

ALTER TABLE mod_logtaller.dat_reportetipo
  OWNER TO zeolides;
  
CREATE TABLE mod_logtaller.dat_reportegruposubgrupo (
  idreportegruposubgrupo NUMERIC(19,0) DEFAULT nextval('mod_logtaller.sec_reporteconcepto_seq'::regclass) NOT NULL,
  idreporteparalizacion NUMERIC(19,0),
  idgruposubgrupo NUMERIC(19,0),
  idestructuracomun NUMERIC(19,0),
  CONSTRAINT pk_reportegruposubgrupo PRIMARY KEY(idreportegruposubgrupo),
  CONSTRAINT dat_reporte_fk FOREIGN KEY (idreporteparalizacion)
    REFERENCES mod_logtaller.conf_reporteparalizacion(idreporteparalizacion)
    ON DELETE CASCADE
    ON UPDATE NO ACTION
    NOT DEFERRABLE
) 
WITH (oids = false);

ALTER TABLE mod_logtaller.dat_reportegruposubgrupo
  OWNER TO zeolides;  
  

CREATE TABLE mod_logtaller.dat_reportemarca (
  idreportemarca NUMERIC(19,0) DEFAULT nextval('mod_logtaller.sec_reporteconcepto_seq'::regclass) NOT NULL,
  idreporteparalizacion NUMERIC(19,0),
  idmarca NUMERIC(19,0),
  idestructuracomun NUMERIC(19,0),
  CONSTRAINT pk_reportemarca PRIMARY KEY(idreportemarca),
  CONSTRAINT dat_reporte_fk FOREIGN KEY (idreporteparalizacion)
    REFERENCES mod_logtaller.conf_reporteparalizacion(idreporteparalizacion)
    ON DELETE CASCADE
    ON UPDATE NO ACTION
    NOT DEFERRABLE
) 
WITH (oids = false);

ALTER TABLE mod_logtaller.dat_reportemarca
  OWNER TO zeolides;    
  

CREATE TABLE mod_logtaller.dat_reportemodelo (
  idreportemodelo NUMERIC(19,0) DEFAULT nextval('mod_logtaller.sec_reporteconcepto_seq'::regclass) NOT NULL,
  idreporteparalizacion NUMERIC(19,0),
  idmodelo NUMERIC(19,0),
  idestructuracomun NUMERIC(19,0),
  CONSTRAINT pk_reportemodelo PRIMARY KEY(idreportemodelo),
  CONSTRAINT dat_reporte_fk FOREIGN KEY (idreporteparalizacion)
    REFERENCES mod_logtaller.conf_reporteparalizacion(idreporteparalizacion)
    ON DELETE CASCADE
    ON UPDATE NO ACTION
    NOT DEFERRABLE
) 
WITH (oids = false);

ALTER TABLE mod_logtaller.dat_reportemodelo
  OWNER TO zeolides;    