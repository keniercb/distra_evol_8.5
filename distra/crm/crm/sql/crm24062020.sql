ALTER TABLE mod_crmcontratacion.dat_contrato ADD COLUMN vehiculos character varying(255);


CREATE SEQUENCE mod_crmcontratacion.sec_vehiculocontrato_seq
  INCREMENT 1
  MINVALUE 1
  MAXVALUE 9223372036854775807
  START 1
  CACHE 1;
ALTER TABLE mod_crmcontratacion.sec_vehiculocontrato_seq
  OWNER TO zeolides;


CREATE TABLE mod_crmcontratacion.dat_vehiculocontrato
(
  idvehiculocontrato numeric(19,0) NOT NULL DEFAULT nextval('mod_crmcontratacion.sec_vehiculocontrato_seq'::regclass), -- Identificador de la tabla.
  idclienteproveedor numeric(19,0), -- Identificador del cliente y/o proveedor.
  idindicador numeric(19,0), -- Identificador del indicador.
  idmarca numeric(19,0), -- Identificador de la marca.
  idmodelo numeric(19,0), -- Identificador del modelo.
  chapa character varying(255), -- Número de chapa o serie.
  denominacion character varying(255), -- Guarda la denominación.
  provincia character varying(255), -- Guarda la provincia a la que pertenece el vehículo.
  datos json, -- Guarda los valores de los atributos dinámicos.
  tipomedio character varying(255), -- Guarda el tipo de medio. Si es automotor o montacargas.
  CONSTRAINT pk_vehiculocontrato PRIMARY KEY (idvehiculocontrato),
  CONSTRAINT fk_vehiculocontrato_clienteproveedor FOREIGN KEY (idclienteproveedor)
      REFERENCES mod_datosmaestros.nom_clientesproveedor (idclientesproveedores) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE CASCADE,
  CONSTRAINT fk_vehiculocontrato_indicador FOREIGN KEY (idindicador)
      REFERENCES mod_datosmaestros.nom_indicador (idindicador) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE SET NULL,
  CONSTRAINT fk_vehiculocontrato_marca FOREIGN KEY (idmarca)
      REFERENCES mod_datosmaestros.nom_marca (idmarca) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE SET NULL,
  CONSTRAINT fk_vehiculocontrato_modelo FOREIGN KEY (idmodelo)
      REFERENCES mod_datosmaestros.nom_modelo (idmodelo) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE SET NULL
)
WITH (
  OIDS=FALSE
);
ALTER TABLE mod_crmcontratacion.dat_vehiculocontrato
  OWNER TO zeolides;
COMMENT ON TABLE mod_crmcontratacion.dat_vehiculocontrato
  IS 'Guarda los vehículos que se le van a prestar servicio según el contrato.';
COMMENT ON COLUMN mod_crmcontratacion.dat_vehiculocontrato.idvehiculocontrato IS 'Identificador de la tabla.';
COMMENT ON COLUMN mod_crmcontratacion.dat_vehiculocontrato.idclienteproveedor IS 'Identificador del cliente y/o proveedor.';
COMMENT ON COLUMN mod_crmcontratacion.dat_vehiculocontrato.idindicador IS 'Identificador del indicador.';
COMMENT ON COLUMN mod_crmcontratacion.dat_vehiculocontrato.idmarca IS 'Identificador de la marca.';
COMMENT ON COLUMN mod_crmcontratacion.dat_vehiculocontrato.idmodelo IS 'Identificador del modelo.';
COMMENT ON COLUMN mod_crmcontratacion.dat_vehiculocontrato.chapa IS 'Número de chapa o serie.';
COMMENT ON COLUMN mod_crmcontratacion.dat_vehiculocontrato.denominacion IS 'Guarda la denominación.';
COMMENT ON COLUMN mod_crmcontratacion.dat_vehiculocontrato.provincia IS 'Guarda la provincia a la que pertenece el vehículo.';
COMMENT ON COLUMN mod_crmcontratacion.dat_vehiculocontrato.datos IS 'Guarda los valores de los atributos dinámicos.';
COMMENT ON COLUMN mod_crmcontratacion.dat_vehiculocontrato.tipomedio IS 'Guarda el tipo de medio. Si es automotor o montacargas.';




SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;

SET search_path = mod_crmadministracion, pg_catalog;

SET default_tablespace = '';

SET default_with_oids = false;


CREATE TABLE nom_formato (
    idformato integer NOT NULL,
    formato character varying,
    denomenreportes character varying
);

ALTER TABLE nom_formato OWNER TO zeolides;

CREATE SEQUENCE nom_formato_idformato_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER TABLE nom_formato_idformato_seq OWNER TO zeolides;

ALTER SEQUENCE nom_formato_idformato_seq OWNED BY nom_formato.idformato;

ALTER TABLE ONLY nom_formato ALTER COLUMN idformato SET DEFAULT nextval('nom_formato_idformato_seq'::regclass);

INSERT INTO nom_formato (idformato, formato, denomenreportes) VALUES (3, 'Gráfica', 'SAIKU_CHART_HTML');
INSERT INTO nom_formato (idformato, formato, denomenreportes) VALUES (2, 'Excel', 'EXCEL');
INSERT INTO nom_formato (idformato, formato, denomenreportes) VALUES (1, 'Pdf', 'PDF');
INSERT INTO nom_formato (idformato, formato, denomenreportes) VALUES (4, 'CSV', 'CSV');
INSERT INTO nom_formato (idformato, formato, denomenreportes) VALUES (5, 'Html', 'HTML');
INSERT INTO nom_formato (idformato, formato, denomenreportes) VALUES (6,'Lista dinamica','LD');

SELECT pg_catalog.setval('nom_formato_idformato_seq', 5, true);


ALTER TABLE ONLY nom_formato
    ADD CONSTRAINT nom_formato_pkey PRIMARY KEY (idformato);

---------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------
---------------------------------------------------------------------------------------



CREATE OR REPLACE FUNCTION mod_crmadministracion.ft_reporte_despues_insertar()
  RETURNS trigger AS
$BODY$
DECLARE
	rec mod_crmadministracion.dat_reporte;
	idfiltro1 integer ;
BEGIN
    SET search_path =  mod_crmadministracion;


    IF (NEW.tipocontenido =4) THEN

    INSERT INTO mod_crmadministracion.dat_reportefiltro(
            denominacion, orden, anchocolumna, nombreparametro,
            tipo, idreporte, javatype)
    VALUES ('Formato',1,200,'format',4,NEW.idreporte,'String');
    idfiltro1 = (SELECT idfiltro FROM mod_crmadministracion.dat_reportefiltro  WHERE denominacion='Formato' AND orden=1 AND anchocolumna=200 AND idreporte=NEW.idreporte AND javatype='String');

    INSERT INTO mod_crmadministracion.dat_reportefiltronomenclador(
            idfiltro, nomidentificador, nomdenominacion, tipofuentedatos,
            sentenciasql, nomservicio)
    VALUES (idfiltro1,'denomenreportes','formato',0,'SELECT idformato, formato, denomenreportes FROM mod_crmadministracion.nom_formato;','');

    END IF;


RETURN NEW;
END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION mod_crmadministracion.ft_reporte_despues_insertar()
  OWNER TO zeolides;
GRANT EXECUTE ON FUNCTION mod_crmadministracion.ft_reporte_despues_insertar() TO zeolides;
GRANT EXECUTE ON FUNCTION mod_crmadministracion.ft_reporte_despues_insertar() TO public;

CREATE TRIGGER t_despues_insertar_reporte
  AFTER INSERT
  ON mod_crmadministracion.dat_reporte
  FOR EACH ROW
  EXECUTE PROCEDURE mod_crmadministracion.ft_reporte_despues_insertar();

------------------------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------
ALTER TABLE mod_crmadministracion.dat_reportefiltronomenclador ADD COLUMN idnomenclador character varying;

ALTER TABLE mod_crmadministracion.dat_reportefiltro ADD COLUMN idnomencladorespecifico character varying;
ALTER TABLE mod_crmadministracion.dat_reportefiltro   ALTER COLUMN javatype DROP NOT NULL;

ALTER TABLE mod_crmadministracion.dat_reporte ADD COLUMN identificadorreporte numeric(19,0);

