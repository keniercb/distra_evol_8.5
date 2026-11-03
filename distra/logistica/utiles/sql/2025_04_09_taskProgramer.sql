CREATE SCHEMA mod_logtaskprogramer AUTHORIZATION zeolides;

CREATE SEQUENCE mod_logtaskprogramer.sec_dattarea_seq
  MAXVALUE 999999999 START 10001;
  
CREATE TABLE mod_logtaskprogramer.dat_tarea (
  idtarea NUMERIC(19,0) DEFAULT nextval('mod_logtaskprogramer.sec_dattarea_seq'::regclass) NOT NULL,
  code VARCHAR(20),
  denominacion VARCHAR(255),
  descripcion VARCHAR(255),
  json TEXT,
  dow VARCHAR(255),
  horas VARCHAR(2),
  min VARCHAR(2),
  estado NUMERIC(1,0) DEFAULT 1,
  ultimaejecucion DATE,
  PRIMARY KEY(idtarea)
) 
WITH (oids = false);