--------------- SQL ---------------

DROP TABLE IF EXISTS mod_logtaller.rep_parteparalizacion;

--------------- SQL ---------------

CREATE TABLE mod_logtaller.rep_parteparalizacion (
  idordentrabajo NUMERIC(19,0),
  idusuario NUMERIC(19,0) NOT NULL,
  idconfiguracion NUMERIC(19,0) NOT NULL,
  agencia VARCHAR(255),
  nroorden NUMERIC(19,0) NOT NULL,
  ubicacion VARCHAR(255),
  cliente VARCHAR(500),
  matricula VARCHAR(255),
  marca VARCHAR(255),
  modelo VARCHAR(255),
  fechainicio DATE,
  diasparalizado NUMERIC(19,0),
  indicativo VARCHAR(50),
  dictamentecnico VARCHAR(255),
  fechafin DATE,
  sobreestadia NUMERIC(19,0),
  importepiezas NUMERIC(19,2) DEFAULT 0 NOT NULL,
  importeactividad NUMERIC(19,2) DEFAULT 0 NOT NULL,
  nropedido VARCHAR(255),
  fechapedido VARCHAR(255),
  observaciones VARCHAR(255),
  denoconfiguracion VARCHAR(255),
  garantia NUMERIC(1,0)
) 
WITH (oids = false);

ALTER TABLE mod_logtaller.rep_parteparalizacion
  OWNER TO zeolides;
  
--------------- SQL ---------------

DROP TABLE IF EXISTS mod_logtaller.rep_parteparalizaciongeneral;

--------------- SQL ---------------  
  
CREATE TABLE mod_logtaller.rep_parteparalizaciongeneral (
  idusuario NUMERIC(19,0) NOT NULL,
  idconfiguracion NUMERIC(19,0) NOT NULL,
  denoconfiguracion VARCHAR(255) NOT NULL,
  agencia VARCHAR(255) NOT NULL,
  total NUMERIC(19,0) DEFAULT 0 NOT NULL,
  buenestado NUMERIC(20,0) DEFAULT 0 NOT NULL,
  paralizadosenbase NUMERIC(20,0) DEFAULT 0 NOT NULL,
  paralizadosotrostalleres NUMERIC(20,0) DEFAULT 0 NOT NULL,
  paralizados NUMERIC(20,0) DEFAULT 0 NOT NULL,
  rango1_30 NUMERIC(20,0) DEFAULT 0 NOT NULL,
  rango31_60 NUMERIC(20,0) DEFAULT 0 NOT NULL,
  rango61_90 NUMERIC(20,0) DEFAULT 0 NOT NULL,
  rango91_120 NUMERIC(20,0) DEFAULT 0 NOT NULL,
  rango121_360 NUMERIC(20,0) DEFAULT 0 NOT NULL,
  rango360 NUMERIC(20,0) DEFAULT 0 NOT NULL,
  cdt NUMERIC(19,2) DEFAULT 0 NOT NULL,
  idparteparalizaciongeneral NUMERIC(19,0) DEFAULT nextval('mod_logtaller.sec_parteparalizaciongeneral_seq'::regclass) NOT NULL,
  idestructuracomun NUMERIC(19,0) NOT NULL,
  CONSTRAINT rep_parteparalizaciongeneral_pkey PRIMARY KEY(idparteparalizaciongeneral)
) 
WITH (oids = false);

ALTER TABLE mod_logtaller.rep_parteparalizaciongeneral
  ALTER COLUMN idusuario SET STATISTICS 0;

ALTER TABLE mod_logtaller.rep_parteparalizaciongeneral
  ALTER COLUMN idconfiguracion SET STATISTICS 0;

ALTER TABLE mod_logtaller.rep_parteparalizaciongeneral
  ALTER COLUMN denoconfiguracion SET STATISTICS 0;

ALTER TABLE mod_logtaller.rep_parteparalizaciongeneral
  ALTER COLUMN agencia SET STATISTICS 0;

ALTER TABLE mod_logtaller.rep_parteparalizaciongeneral
  ALTER COLUMN total SET STATISTICS 0;

ALTER TABLE mod_logtaller.rep_parteparalizaciongeneral
  ALTER COLUMN buenestado SET STATISTICS 0;

ALTER TABLE mod_logtaller.rep_parteparalizaciongeneral
  ALTER COLUMN paralizadosenbase SET STATISTICS 0;

ALTER TABLE mod_logtaller.rep_parteparalizaciongeneral
  ALTER COLUMN paralizadosotrostalleres SET STATISTICS 0;

ALTER TABLE mod_logtaller.rep_parteparalizaciongeneral
  ALTER COLUMN paralizados SET STATISTICS 0;

ALTER TABLE mod_logtaller.rep_parteparalizaciongeneral
  ALTER COLUMN rango1_30 SET STATISTICS 0;

ALTER TABLE mod_logtaller.rep_parteparalizaciongeneral
  ALTER COLUMN rango31_60 SET STATISTICS 0;

ALTER TABLE mod_logtaller.rep_parteparalizaciongeneral
  ALTER COLUMN rango61_90 SET STATISTICS 0;

ALTER TABLE mod_logtaller.rep_parteparalizaciongeneral
  ALTER COLUMN rango91_120 SET STATISTICS 0;

ALTER TABLE mod_logtaller.rep_parteparalizaciongeneral
  ALTER COLUMN rango121_360 SET STATISTICS 0;

ALTER TABLE mod_logtaller.rep_parteparalizaciongeneral
  ALTER COLUMN rango360 SET STATISTICS 0;

ALTER TABLE mod_logtaller.rep_parteparalizaciongeneral
  ALTER COLUMN cdt SET STATISTICS 0;

ALTER TABLE mod_logtaller.rep_parteparalizaciongeneral
  OWNER TO zeolides;  