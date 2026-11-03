CREATE TABLE mod_integracionreporte.dat_reportefiltroestructura (
  idfiltro NUMERIC(19,0) NOT NULL,
  estructuracompleta NUMERIC(1,0) DEFAULT 0,
  CONSTRAINT pk_reportefiltroestructura PRIMARY KEY(idfiltro),
  CONSTRAINT fk_reportefiltro_reportefiltroestructura FOREIGN KEY (idfiltro)
    REFERENCES mod_integracionreporte.dat_reportefiltro(idfiltro)
    ON DELETE CASCADE
    ON UPDATE CASCADE
    NOT DEFERRABLE
) 
WITH (oids = false);

COMMENT ON COLUMN mod_integracionreporte.dat_reportefiltroestructura.idfiltro
IS 'Identificador del filtro.';

COMMENT ON COLUMN mod_integracionreporte.dat_reportefiltroestructura.estructuracompleta
IS '1- Visualiza la estructura completa 0- Visualiza la estructura logueada';

ALTER TABLE mod_integracionreporte.dat_reportefiltroestructura
  OWNER TO zeolides;