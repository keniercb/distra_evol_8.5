ALTER TABLE mod_loginventario.conf_inventario
  ADD COLUMN cuadrediario NUMERIC(1,0) DEFAULT 0;

COMMENT ON COLUMN mod_loginventario.conf_inventario.cuadrediario
IS 'Campo para saber si una entidad puede cerrar el cuadre diario con diferencia.';

CREATE TABLE mod_logdistribucion.conf_depositocuadrediario (
  iddeposito NUMERIC(19,0) NOT NULL,
  clasificaciones TEXT,
  CONSTRAINT conf_depositocuadrediario_pkey PRIMARY KEY(iddeposito),
  CONSTRAINT conf_depositocuadrediario_fk FOREIGN KEY (iddeposito)
    REFERENCES mod_estructuracomp.nom_filaestruc(idfila)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
    NOT DEFERRABLE
) 
WITH (oids = false);

COMMENT ON COLUMN mod_logdistribucion.conf_depositocuadrediario.iddeposito
IS 'Id del deposito a realizar cuadre diario';

COMMENT ON COLUMN mod_logdistribucion.conf_depositocuadrediario.clasificaciones
IS 'Id de las clasificaciones contables configuradas';

ALTER TABLE mod_logdistribucion.conf_depositocuadrediario
  OWNER TO zeolides;
  
CREATE SEQUENCE mod_logistica.sec_hiscuadrediario_seq
  INCREMENT 1 MINVALUE 1000000000
  MAXVALUE 1099999999 START 1000000001
  CACHE 1;

COMMENT ON SEQUENCE mod_logistica.sec_hiscuadrediario_seq
IS 'Secuencia empleada para autogenerar el identificador de la 
tabla his_cuadrediario. ';


CREATE TABLE mod_logistica.his_cuadrediario (
  idcierrediario NUMERIC(19,0) DEFAULT nextval('mod_logistica.sec_hiscuadrediario_seq'::regclass) NOT NULL,
  iddeposito NUMERIC(19,0) NOT NULL,
  estado NUMERIC(1,0) DEFAULT 0 NOT NULL,
  fechacierre DATE DEFAULT now() NOT NULL,
  saldoinicial NUMERIC(25,6) DEFAULT 0 NOT NULL,
  saldofinal NUMERIC(25,6) DEFAULT 0 NOT NULL,
  saldocontable NUMERIC(25,6) DEFAULT 0 NOT NULL,
  diferencia NUMERIC(25,6) DEFAULT 0 NOT NULL,
  CONSTRAINT his_cuadrediario_pkey PRIMARY KEY(idcierrediario)
) 
WITH (oids = false);

ALTER TABLE mod_logistica.his_cuadrediario
  ALTER COLUMN idcierrediario SET STATISTICS 0;

ALTER TABLE mod_logistica.his_cuadrediario
  ALTER COLUMN iddeposito SET STATISTICS 0;

ALTER TABLE mod_logistica.his_cuadrediario
  ALTER COLUMN estado SET STATISTICS 0;

ALTER TABLE mod_logistica.his_cuadrediario
  ALTER COLUMN fechacierre SET STATISTICS 0;

ALTER TABLE mod_logistica.his_cuadrediario
  ALTER COLUMN saldoinicial SET STATISTICS 0;

ALTER TABLE mod_logistica.his_cuadrediario
  ALTER COLUMN saldofinal SET STATISTICS 0;

ALTER TABLE mod_logistica.his_cuadrediario
  ALTER COLUMN saldocontable SET STATISTICS 0;

ALTER TABLE mod_logistica.his_cuadrediario
  ALTER COLUMN diferencia SET STATISTICS 0;

COMMENT ON COLUMN mod_logistica.his_cuadrediario.idcierrediario
IS 'Id del cuadre diario de almacen';

COMMENT ON COLUMN mod_logistica.his_cuadrediario.iddeposito
IS 'Identificador del deposito del cuadre diario';

COMMENT ON COLUMN mod_logistica.his_cuadrediario.estado
IS 'Estado del cierre diario de almacen (1 cerrado, 0 no cerrado)';

COMMENT ON COLUMN mod_logistica.his_cuadrediario.fechacierre
IS 'Fecha de cierre del almacen';

COMMENT ON COLUMN mod_logistica.his_cuadrediario.saldoinicial
IS 'Saldo inicial: valor del saldo final del cierre anterior';

COMMENT ON COLUMN mod_logistica.his_cuadrediario.saldofinal
IS 'saldo final: es la sumatoria de los saldos de cada movimiento del dia por clasificación contable.';

COMMENT ON COLUMN mod_logistica.his_cuadrediario.saldocontable
IS 'saldo contable: valor de la cuenta contable de la clasificación en la contabilidad';

COMMENT ON COLUMN mod_logistica.his_cuadrediario.diferencia
IS 'diferencia saldo: saldo final – valor de inventario.';

ALTER TABLE mod_logistica.his_cuadrediario
  OWNER TO zeolides;
  
ALTER TABLE mod_logistica.his_cuadrediario
  DROP COLUMN diferencia;

ALTER SEQUENCE mod_logistica.sec_hiscuadrediario_seq
  OWNER TO zeolides;
  
ALTER TABLE mod_logistica.his_cuadrediario
  ADD COLUMN contador NUMERIC(2,0) DEFAULT 1;

COMMENT ON COLUMN mod_logistica.his_cuadrediario.contador
IS 'Cantidad de veces que se ha realizado el cierre';

ALTER TABLE mod_logistica.his_cuadrediario
  ALTER COLUMN saldoinicial DROP DEFAULT;

ALTER TABLE mod_logistica.his_cuadrediario
  ALTER COLUMN saldoinicial TYPE NUMERIC(25,2);

ALTER TABLE mod_logistica.his_cuadrediario
  ALTER COLUMN saldoinicial SET DEFAULT 0;
  
ALTER TABLE mod_logistica.his_cuadrediario
  ALTER COLUMN saldofinal DROP DEFAULT;

ALTER TABLE mod_logistica.his_cuadrediario
  ALTER COLUMN saldofinal TYPE NUMERIC(25,2);

ALTER TABLE mod_logistica.his_cuadrediario
  ALTER COLUMN saldofinal SET DEFAULT 0;
  
ALTER TABLE mod_logistica.his_cuadrediario
  ALTER COLUMN saldocontable DROP DEFAULT;

ALTER TABLE mod_logistica.his_cuadrediario
  ALTER COLUMN saldocontable TYPE NUMERIC(25,2);

ALTER TABLE mod_logistica.his_cuadrediario
  ALTER COLUMN saldocontable SET DEFAULT 0;
  
ALTER TABLE mod_logistica.his_cuadrediario
  ADD COLUMN apertura NUMERIC(1,0) DEFAULT 0;

COMMENT ON COLUMN mod_logistica.his_cuadrediario.apertura
IS 'Campo para saber si es la primera carga de los saldo';
