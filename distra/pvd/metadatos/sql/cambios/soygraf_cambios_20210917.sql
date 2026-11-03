----cargo-----------------------------------------------------------------
ALTER TABLE mod_estructuracomp.dat_cargo ADD COLUMN alias character varying(500);

COMMENT ON COLUMN mod_estructuracomp.dat_cargo.alias IS 'Alias del cargo civil.';

-- Column: jefebrigada

-- ALTER TABLE mod_estructuracomp.dat_cargo DROP COLUMN jefebrigada;

ALTER TABLE mod_estructuracomp.dat_cargo ADD COLUMN jefebrigada numeric(1,0);
ALTER TABLE mod_estructuracomp.dat_cargo ALTER COLUMN jefebrigada SET DEFAULT 0;
COMMENT ON COLUMN mod_estructuracomp.dat_cargo.jefebrigada IS 'Estado del cargo, permite conocer si es jefe brigada o no.';
-- Column: principal

-- ALTER TABLE mod_estructuracomp.dat_cargo DROP COLUMN principal;

ALTER TABLE mod_estructuracomp.dat_cargo ADD COLUMN principal numeric(1,0);
ALTER TABLE mod_estructuracomp.dat_cargo ALTER COLUMN principal SET DEFAULT 0;
COMMENT ON COLUMN mod_estructuracomp.dat_cargo.principal IS 'Estado del cargo, permite conocer si es principal o no.';





----estructura-----------------------------------------------------------------
-- Column: alias

-- ALTER TABLE mod_estructuracomp.dat_estructura DROP COLUMN alias;

ALTER TABLE mod_estructuracomp.dat_estructura ADD COLUMN alias character varying(500);
COMMENT ON COLUMN mod_estructuracomp.dat_estructura.alias IS 'Alias de la estructura.';


----estructura op-----------------------------------------------------------------


-----------------------------------nuevas tablas-----------------------------------------------
-- Table: mod_estructuracomp.his_reportecambios

-- DROP TABLE mod_estructuracomp.his_reportecambios;

CREATE TABLE mod_estructuracomp.his_reportecambios
(
  idreportecambios serial NOT NULL,
  nombrereporte character varying,
  reporte bytea,
  fecha date,
  nombreproyecto character varying,
  idproyecto numeric,
  CONSTRAINT his_reportecambios_pkey PRIMARY KEY (idreportecambios)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE mod_estructuracomp.his_reportecambios
  OWNER TO zeolides;
  
  
-- Table: mod_estructuracomp.his_reporteplantilla

-- DROP TABLE mod_estructuracomp.his_reporteplantilla;

CREATE TABLE mod_estructuracomp.his_reporteplantilla
(
  idreporteplantilla serial NOT NULL,
  nombrereporte character varying,
  reporte bytea,
  fechavigor date,
  fechaderogacion date,
  nombreproyecto character varying,
  idestructura numeric(19,0), -- Identificador de la estructura al que se le hizo el reporte.
  CONSTRAINT his_reporteplantilla_pkey PRIMARY KEY (idreporteplantilla)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE mod_estructuracomp.his_reporteplantilla
  OWNER TO zeolides;
COMMENT ON COLUMN mod_estructuracomp.his_reporteplantilla.idestructura IS 'Identificador de la estructura al que se le hizo el reporte.';





