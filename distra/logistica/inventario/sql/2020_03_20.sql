CREATE TABLE mod_logabc.nom_clasificacionabc
(
  idclasificacionabc numeric(19,0) NOT NULL,
  denominacion character varying(100),
  activo numeric(1,0) DEFAULT 1,
  CONSTRAINT nnom_clasificacionabc_pk PRIMARY KEY (idclasificacionabc)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE mod_logabc.nom_clasificacionabc
  OWNER TO zeolides;
GRANT ALL ON TABLE mod_logabc.nom_clasificacionabc TO zeolides;

ALTER TABLE mod_logabc.nom_clasificacionabc
   ADD COLUMN limiteinferior numeric;

ALTER TABLE mod_logabc.nom_clasificacionabc
   ADD COLUMN limitesuperior numeric;

ALTER TABLE mod_logabc.conf_definicion RENAME clasificacion  TO idclasificacionabc;

ALTER TABLE mod_logabc.conf_definicion
  DROP COLUMN popularidad;
ALTER TABLE mod_logabc.conf_definicion
  DROP COLUMN cantunidadesvendidas;
ALTER TABLE mod_logabc.conf_definicion
  DROP COLUMN importeventas;

ALTER TABLE mod_logabc.nom_criteriovaloracion RENAME idcriterioeval  TO idcriteriovaloracion;

ALTER TABLE mod_logabc.conf_definicion ADD COLUMN idcriteriovaloracion numeric;
ALTER TABLE mod_logabc.conf_definicion
  DROP COLUMN idclasificacionabc;
ALTER TABLE mod_logabc.conf_definicion
   ALTER COLUMN idcriteriovaloracion TYPE numeric(19,0);
ALTER TABLE mod_logabc.conf_definicion
   ALTER COLUMN idcriteriovaloracion SET NOT NULL;

ALTER TABLE mod_logabc.conf_definicion ADD COLUMN idclasificacionabc numeric(19,0);
ALTER TABLE mod_logabc.conf_definicion ALTER COLUMN idclasificacionabc SET NOT NULL;