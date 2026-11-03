INSERT INTO 
  mod_nomina.nom_nomencladores
(
  denom,
  descripcion,
  referencia,
  clase
)
VALUES (
  'Tipo de destajo',
  'Tipo de destajo',
  'nomtipodestajo',
  'Pvd.Nomina.Nomencladores.NomTipoDestajo'
);

-- Sequence: mod_nomina.sec_nom_tipodestajo_seq
-- DROP SEQUENCE mod_nomina.sec_nom_tipodestajo_seq;
CREATE SEQUENCE IF NOT EXISTS mod_nomina.sec_nom_tipodestajo_seq
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 9999999999999999
    CACHE 1;
ALTER SEQUENCE mod_nomina.sec_nom_tipodestajo_seq OWNER TO zeolides;
GRANT ALL ON SEQUENCE mod_nomina.sec_nom_tipodestajo_seq TO PUBLIC;
GRANT ALL ON SEQUENCE mod_nomina.sec_nom_tipodestajo_seq TO zeolides;

-- Table: mod_nomina.nom_tipodestajo

-- DROP TABLE mod_nomina.nom_tipodestajo;
CREATE TABLE IF NOT EXISTS mod_nomina.nom_tipodestajo
(
    idnomtipodestajo numeric NOT NULL DEFAULT nextval('mod_nomina.sec_nom_tipodestajo_seq'::regclass),
  	denominacion VARCHAR(100) NOT NULL,
    fechainicio DATE NOT NULL,
    fechafin DATE,
    descripcion VARCHAR(255),
    CONSTRAINT pk_nomtipodestajo PRIMARY KEY (idnomtipodestajo)  
)