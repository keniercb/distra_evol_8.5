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

--- Column: codigonit

-- ALTER TABLE mod_estructuracomp.dat_estructura DROP COLUMN codigonit;

ALTER TABLE mod_estructuracomp.dat_estructura ADD COLUMN codigonit character varying(255);

-- Column: alias

-- ALTER TABLE mod_estructuracomp.dat_estructura DROP COLUMN alias;

ALTER TABLE mod_estructuracomp.dat_estructura ADD COLUMN alias character varying(500);
COMMENT ON COLUMN mod_estructuracomp.dat_estructura.alias IS 'Alias de la estructura.';


----estructura op-----------------------------------------------------------------
-- Column: idicono

-- ALTER TABLE mod_estructuracomp.dat_estructuraop DROP COLUMN idicono;

ALTER TABLE mod_estructuracomp.dat_estructuraop ADD COLUMN idicono numeric(100,0);
ALTER TABLE mod_estructuracomp.dat_estructuraop ALTER COLUMN idicono SET DEFAULT 0;
COMMENT ON COLUMN mod_estructuracomp.dat_estructuraop.idicono IS 'Identificador de la tabla nom_icono';


-- Column: correo

-- ALTER TABLE mod_estructuracomp.dat_estructuraop DROP COLUMN correo;

ALTER TABLE mod_estructuracomp.dat_estructuraop ADD COLUMN correo character varying(50);
COMMENT ON COLUMN mod_estructuracomp.dat_estructuraop.correo IS 'Dirección de correo.';

-- Column: objetosocial

-- ALTER TABLE mod_estructuracomp.dat_estructuraop DROP COLUMN objetosocial;

ALTER TABLE mod_estructuracomp.dat_estructuraop ADD COLUMN objetosocial character varying(255);
COMMENT ON COLUMN mod_estructuracomp.dat_estructuraop.objetosocial IS 'Objeto social.';
-- Column: fax

-- ALTER TABLE mod_estructuracomp.dat_estructuraop DROP COLUMN fax;

ALTER TABLE mod_estructuracomp.dat_estructuraop ADD COLUMN fax character varying(100);
COMMENT ON COLUMN mod_estructuracomp.dat_estructuraop.fax IS 'Fax.';
-- Column: iddpt

-- ALTER TABLE mod_estructuracomp.dat_estructuraop DROP COLUMN iddpt;

ALTER TABLE mod_estructuracomp.dat_estructuraop ADD COLUMN iddpt numeric(19,0);
COMMENT ON COLUMN mod_estructuracomp.dat_estructuraop.iddpt IS 'Identificador de instrucción política territorial.';
-- Column: telefono

-- ALTER TABLE mod_estructuracomp.dat_estructuraop DROP COLUMN telefono;

ALTER TABLE mod_estructuracomp.dat_estructuraop ADD COLUMN telefono character varying(100);
COMMENT ON COLUMN mod_estructuracomp.dat_estructuraop.telefono IS 'Número de teléfono.';
-- Column: funcioneslegales

-- ALTER TABLE mod_estructuracomp.dat_estructuraop DROP COLUMN funcioneslegales;

ALTER TABLE mod_estructuracomp.dat_estructuraop ADD COLUMN funcioneslegales character varying(255);
COMMENT ON COLUMN mod_estructuracomp.dat_estructuraop.funcioneslegales IS 'Funciones legales.';
-- Column: codigonit

-- ALTER TABLE mod_estructuracomp.dat_estructuraop DROP COLUMN codigonit;

ALTER TABLE mod_estructuracomp.dat_estructuraop ADD COLUMN codigonit character varying(255);

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





