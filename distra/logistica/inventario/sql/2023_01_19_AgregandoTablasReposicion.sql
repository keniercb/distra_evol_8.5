ALTER TABLE mod_loginventario.conf_inventarioext
  ALTER COLUMN minimo TYPE NUMERIC(4,2);
  
ALTER TABLE mod_loginventario.conf_inventarioext
  ALTER COLUMN fondofijo TYPE NUMERIC(4,2);
  
ALTER TABLE mod_loginventario.conf_inventarioext
  ALTER COLUMN reserva TYPE NUMERIC(4,2);
  
ALTER TABLE mod_loginventario.conf_inventarioext
  ALTER COLUMN minarea TYPE NUMERIC(4,2);
  
CREATE SEQUENCE mod_loginventario.sec_datreposicion_seq
  INCREMENT 1 MINVALUE 1000000000
  MAXVALUE 1099999999 START 1000000001
  CACHE 1;

ALTER SEQUENCE mod_loginventario.sec_datreposicion_seq RESTART WITH 1000000001;

GRANT SELECT, UPDATE, USAGE
  ON mod_loginventario.sec_datreposicion_seq TO zeolides;
ALTER SEQUENCE mod_loginventario.sec_datreposicion_seq
  OWNER TO zeolides;
  
CREATE TABLE mod_loginventario.dat_reposicion (
  idreposicion NUMERIC(19,0) DEFAULT nextval('mod_loginventario.sec_datreposicion_seq'::regclass) NOT NULL,
  cantidad NUMERIC(19,6),
  idindicador NUMERIC(19,0),
  idestructura NUMERIC(19,0),
  idtransferencia NUMERIC(19,0),
  CONSTRAINT dat_reposicion_pkey PRIMARY KEY(idreposicion)
) 
WITH (oids = false);

ALTER TABLE mod_loginventario.dat_reposicion
  ALTER COLUMN idtransferencia SET STATISTICS 0;

COMMENT ON COLUMN mod_loginventario.dat_reposicion.cantidad
IS 'Cantidad real a reponer';

COMMENT ON COLUMN mod_loginventario.dat_reposicion.idindicador
IS 'Identificador del indicador';

COMMENT ON COLUMN mod_loginventario.dat_reposicion.idestructura
IS 'idestructura';

ALTER TABLE mod_loginventario.dat_reposicion
  OWNER TO zeolides;
