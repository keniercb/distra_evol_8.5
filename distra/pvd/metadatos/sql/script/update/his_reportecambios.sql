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