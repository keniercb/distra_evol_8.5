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


------ Creacion de la secuencia y del scrip de la tabla dat_cierrenomina q contendra la informacion de los cierre de periodos del cierre de la nomina--------
CREATE SEQUENCE mod_nomina.sec_dat_cierrenomina_seq
  INCREMENT 1
  MINVALUE 0
  MAXVALUE 9223372036854775807
  START 1000001
  CACHE 1;
ALTER TABLE mod_nomina.sec_dat_cierrenomina_seq OWNER TO zeolides;
GRANT ALL ON TABLE mod_nomina.sec_dat_cierrenomina_seq TO zeolides;
GRANT ALL ON TABLE mod_nomina.sec_dat_cierrenomina_seq TO zeolides;

CREATE TABLE mod_nomina.dat_cierrenomina (
  idcierrenomina NUMERIC(19,0)NOT NULL DEFAULT nextval(' mod_nomina.sec_dat_cierrenomina_seq'::regclass), 
  idperiodo NUMERIC(19,0) ,
  identidad NUMERIC(19,0),
  cuenta NUMERIC(19,5),
  tipopago VARCHAR(255),
  estado VARCHAR(255),
  importecont NUMERIC(19,2),
  importenomina NUMERIC(19,2),
  diferenciaimporte NUMERIC(19,2),
  CONSTRAINT dat_cierrenomina_pkey PRIMARY KEY(idcierrenomina)
) 
WITH (oids = false);

ALTER TABLE mod_nomina.dat_cierrenomina
  OWNER TO zeolides;
  ALTER TABLE mod_nomina.nom_cuentascierre
  OWNER TO zeolides;
COMMENT ON COLUMN mod_nomina.dat_cierrenomina.idcierrenomina IS 'Identificador de la tabla ';
COMMENT ON COLUMN mod_nomina.dat_cierrenomina.idperiodo IS 'Identificador del período seleccionado ';
COMMENT ON COLUMN mod_nomina.dat_cierrenomina.identidad IS 'Identificador de la identidad seleccionada ';
COMMENT ON COLUMN mod_nomina.dat_cierrenomina.cuenta IS 'Número de las cuentas que se analizan';
COMMENT ON COLUMN mod_nomina.dat_cierrenomina.tipopago IS 'Tipo de pago por cuenta analizada';
COMMENT ON COLUMN mod_nomina.dat_cierrenomina.estado IS 'Estado de las cuentas aprobada o no';
COMMENT ON COLUMN mod_nomina.dat_cierrenomina.importecont IS 'Importe de contabilidad para el período seleccionado';
COMMENT ON COLUMN mod_nomina.dat_cierrenomina.importenomina IS 'Importe de la nómina para el período seleccionado';
COMMENT ON COLUMN mod_nomina.dat_cierrenomina.diferenciaimporte IS 'Diferencia en los importes de la contabilidad y la nómina para el período seleccionado';

COMMENT ON TABLE mod_nomina.nom_cuentascierre
  IS 'Guarda la información del cierre de la nomina por períodos';