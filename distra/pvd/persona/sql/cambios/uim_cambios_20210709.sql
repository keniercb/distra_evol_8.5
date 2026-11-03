--Cambios 09/07/2021
--<ALTER>
/* mod_persona.sec_colorojos_seq (Different, Sequences) */
/* Different properties: Description, Max Value */
ALTER SEQUENCE mod_persona.sec_colorojos_seq
  INCREMENT 1 MINVALUE 0
  MAXVALUE 999999999999999999 START 0
  CACHE 1 NO CYCLE;
/* mod_persona.sec_colorpelo_seq (Different, Sequences) */
/* Different properties: Description, Max Value */
ALTER SEQUENCE mod_persona.sec_colorpelo_seq
  INCREMENT 1 MINVALUE 0
  MAXVALUE 999999999999999999 START 0
  CACHE 1 NO CYCLE;
/* mod_persona.sec_condicionmigratoria_seq (Unique Source, Sequences) */
CREATE SEQUENCE mod_persona.sec_condicionmigratoria_seq
  INCREMENT 1 MINVALUE 0
  MAXVALUE 999999999999999999 START 400
  CACHE 1;
ALTER SEQUENCE mod_persona.sec_condicionmigratoria_seq RESTART WITH 7;
/* mod_persona.sec_validacionpersona_seq (Unique Source, Sequences) */
CREATE SEQUENCE mod_persona.sec_validacionpersona_seq
  INCREMENT 1 MINVALUE 0
  MAXVALUE 999999999999999999 START 1
  CACHE 1;
/* mod_persona.sec_colorpiel_seq (Different, Sequences) */
/* Different properties: Description, Max Value */
ALTER SEQUENCE mod_persona.sec_colorpiel_seq
  INCREMENT 1 MINVALUE 0
  MAXVALUE 999999999999999999 START 0
  CACHE 1 NO CYCLE;
/* mod_persona.nom_ciudadania.gestion (Unique Source, Fields) */
ALTER TABLE mod_persona.nom_ciudadania
  ADD COLUMN gestion NUMERIC(1,0) DEFAULT 1;
/* mod_persona.nom_ciudadania.abreviatura (Unique Source, Fields) */
ALTER TABLE mod_persona.nom_ciudadania
  ADD COLUMN abreviatura VARCHAR(5);
/* mod_persona.nom_colorojos.idcolorojos (Different, Fields) */
/* Different properties: Size */
ALTER TABLE mod_persona.nom_colorojos
  ALTER COLUMN idcolorojos DROP DEFAULT;
ALTER TABLE mod_persona.nom_colorojos
  ALTER COLUMN idcolorojos TYPE NUMERIC(19,0);
ALTER TABLE mod_persona.nom_colorojos
  ALTER COLUMN idcolorojos SET DEFAULT nextval('mod_persona.sec_colorojos_seq'::regclass);
/* mod_persona.nom_colorojos.gestion (Unique Source, Fields) */
ALTER TABLE mod_persona.nom_colorojos
  ADD COLUMN gestion NUMERIC(1,0) DEFAULT 1;
/* mod_persona.nom_colorojos.abreviatura (Unique Source, Fields) */
ALTER TABLE mod_persona.nom_colorojos
  ADD COLUMN abreviatura VARCHAR(5);
/* mod_persona.nom_colorpelo.idcolorpelo (Different, Fields) */
/* Different properties: Size */
ALTER TABLE mod_persona.nom_colorpelo
  ALTER COLUMN idcolorpelo DROP DEFAULT;
ALTER TABLE mod_persona.nom_colorpelo
  ALTER COLUMN idcolorpelo TYPE NUMERIC(19,0);
ALTER TABLE mod_persona.nom_colorpelo
  ALTER COLUMN idcolorpelo SET DEFAULT nextval('mod_persona.sec_colorpelo_seq'::regclass);
/* mod_persona.nom_colorpelo.gestion (Unique Source, Fields) */
ALTER TABLE mod_persona.nom_colorpelo
  ADD COLUMN gestion NUMERIC(1,0) DEFAULT 1;
/* mod_persona.nom_colorpelo.abreviatura (Unique Source, Fields) */
ALTER TABLE mod_persona.nom_colorpelo
  ADD COLUMN abreviatura VARCHAR(5);
/* mod_persona.nom_colorpiel.idcolorpiel (Different, Fields) */
/* Different properties: Size */
ALTER TABLE mod_persona.nom_colorpiel
  ALTER COLUMN idcolorpiel DROP DEFAULT;
ALTER TABLE mod_persona.nom_colorpiel
  ALTER COLUMN idcolorpiel TYPE NUMERIC(19,0);
ALTER TABLE mod_persona.nom_colorpiel
  ALTER COLUMN idcolorpiel SET DEFAULT nextval('mod_persona.sec_colorpiel_seq'::regclass);
/* mod_persona.nom_colorpiel.gestion (Unique Source, Fields) */
ALTER TABLE mod_persona.nom_colorpiel
  ADD COLUMN gestion NUMERIC(1,0) DEFAULT 1;
/* mod_persona.nom_colorpiel.abreviatura (Unique Source, Fields) */
ALTER TABLE mod_persona.nom_colorpiel
  ADD COLUMN abreviatura VARCHAR(5);
/* mod_persona.nom_gruposanguineo.idgruposanguineo (Different, Fields) */
/* Different properties: Size */
ALTER TABLE mod_persona.nom_gruposanguineo
  ALTER COLUMN idgruposanguineo DROP DEFAULT;
ALTER TABLE mod_persona.nom_gruposanguineo
  ALTER COLUMN idgruposanguineo TYPE NUMERIC(3,0);
ALTER TABLE mod_persona.nom_gruposanguineo
  ALTER COLUMN idgruposanguineo SET DEFAULT nextval('mod_persona.sec_gruposanguineo_seq'::regclass);
/* mod_persona.nom_gruposanguineo.compatiblecon (Unique Source, Fields) */
ALTER TABLE mod_persona.nom_gruposanguineo
  ADD COLUMN compatiblecon VARCHAR(30);
/* mod_persona.nom_gruposanguineo.descripcion (Different, Fields) */
/* Different properties: Default */
ALTER TABLE mod_persona.nom_gruposanguineo
  ALTER COLUMN descripcion SET DEFAULT 'Sin descripción'::character varying;
/* mod_persona.nom_gruposanguineo.gestion (Unique Source, Fields) */
ALTER TABLE mod_persona.nom_gruposanguineo
  ADD COLUMN gestion NUMERIC(1,0) DEFAULT 1;
/* mod_persona.nom_gruposanguineo.abreviatura (Unique Source, Fields) */
ALTER TABLE mod_persona.nom_gruposanguineo
  ADD COLUMN abreviatura VARCHAR(5);
/* mod_persona.nom_nacionalidad.gestion (Unique Source, Fields) */
ALTER TABLE mod_persona.nom_nacionalidad
  ADD COLUMN gestion NUMERIC(1,0) DEFAULT 1;
/* mod_persona.nom_nacionalidad.abreviatura (Unique Source, Fields) */
ALTER TABLE mod_persona.nom_nacionalidad
  ADD COLUMN abreviatura VARCHAR(5);
/* mod_persona.dat_nomenclador.agrupador (Unique Source, Fields) */
ALTER TABLE mod_persona.dat_nomenclador
  ADD COLUMN agrupador VARCHAR(100) DEFAULT 'Otros'::character varying NOT NULL;
/* mod_persona.dat_persona.migrado (Unique Source, Fields) */
ALTER TABLE mod_persona.dat_persona
  ADD COLUMN migrado INTEGER;
/* mod_persona.nom_situacion.gestion (Unique Source, Fields) */
ALTER TABLE mod_persona.nom_situacion
  ADD COLUMN gestion NUMERIC(1,0) DEFAULT 1 NOT NULL;
/* mod_persona.nom_situacion.abreviatura (Unique Source, Fields) */
ALTER TABLE mod_persona.nom_situacion
  ADD COLUMN abreviatura VARCHAR(60);
/* mod_persona.nom_tipocontacto.gestion (Unique Source, Fields) */
ALTER TABLE mod_persona.nom_tipocontacto
  ADD COLUMN gestion NUMERIC(1,0) DEFAULT 1;
/* mod_persona.nom_tipocontacto.abreviatura (Unique Source, Fields) */
ALTER TABLE mod_persona.nom_tipocontacto
  ADD COLUMN abreviatura VARCHAR(5);
/* mod_persona.nom_tipodocidentidad.gestion (Unique Source, Fields) */
ALTER TABLE mod_persona.nom_tipodocidentidad
  ADD COLUMN gestion NUMERIC(1,0) DEFAULT 1;
/* mod_persona.nom_tipodocidentidad.abreviatura (Unique Source, Fields) */
ALTER TABLE mod_persona.nom_tipodocidentidad
  ADD COLUMN abreviatura VARCHAR(5);
/* mod_persona.nom_tipomediocontacto.gestion (Unique Source, Fields) */
ALTER TABLE mod_persona.nom_tipomediocontacto
  ADD COLUMN gestion NUMERIC(1,0) DEFAULT 1;
/* mod_persona.nom_tipomediocontacto.abreviatura (Unique Source, Fields) */
ALTER TABLE mod_persona.nom_tipomediocontacto
  ADD COLUMN abreviatura VARCHAR(5);
/* mod_persona.dat_fenotipo.idcolorojos (Different, Fields) */
/* Different properties: Not Null, Size */
ALTER TABLE mod_persona.dat_fenotipo
  ALTER COLUMN idcolorojos TYPE NUMERIC(19,0);
ALTER TABLE mod_persona.dat_fenotipo
  ALTER COLUMN idcolorojos DROP NOT NULL;
/* mod_persona.dat_fenotipo.idcolorpiel (Different, Fields) */
/* Different properties: Size */
ALTER TABLE mod_persona.dat_fenotipo
  ALTER COLUMN idcolorpiel TYPE NUMERIC(19,0);
/* mod_persona.dat_fenotipo.idcolorpelo (Different, Fields) */
/* Different properties: Not Null, Size */
ALTER TABLE mod_persona.dat_fenotipo
  ALTER COLUMN idcolorpelo TYPE NUMERIC(19,0);
ALTER TABLE mod_persona.dat_fenotipo
  ALTER COLUMN idcolorpelo DROP NOT NULL;
/* mod_persona.dat_fenotipo.migrado (Unique Source, Fields) */
ALTER TABLE mod_persona.dat_fenotipo
  ADD COLUMN migrado INTEGER;
/* mod_persona.dat_datosnacimiento.localidad (Unique Source, Fields) */
ALTER TABLE mod_persona.dat_datosnacimiento
  ADD COLUMN localidad VARCHAR(255);
/* mod_persona.dat_datosnacimiento.migrado (Unique Source, Fields) */
ALTER TABLE mod_persona.dat_datosnacimiento
  ADD COLUMN migrado INTEGER;
/* mod_persona.dat_direccion.idpais (Unique Source, Fields) */
ALTER TABLE mod_persona.dat_direccion
  ADD COLUMN idpais NUMERIC(19,0);
/* mod_persona.dat_direccion.migrado (Unique Source, Fields) */
ALTER TABLE mod_persona.dat_direccion
  ADD COLUMN migrado INTEGER;
/* mod_persona.dat_personaentidad.idprocedenciasocial (Different, Fields) */
/* Different properties: Not Null */
ALTER TABLE mod_persona.dat_personaentidad
  ALTER COLUMN idprocedenciasocial SET NOT NULL;
/* mod_persona.dat_docidentidad.migrado (Unique Source, Fields) */
ALTER TABLE mod_persona.dat_docidentidad
  ADD COLUMN migrado INTEGER;
/* mod_persona.dat_contacto.migrado (Unique Source, Fields) */
ALTER TABLE mod_persona.dat_contacto
  ADD COLUMN migrado INTEGER;
/* mod_persona.dat_situacionlaboral.idprogramalaboral (Unique Source, Fields) */
ALTER TABLE mod_persona.dat_situacionlaboral
  ADD COLUMN idprogramalaboral NUMERIC(19,0);
/* mod_persona.dat_situacionlaboral.nromn (Unique Source, Fields) */
ALTER TABLE mod_persona.dat_situacionlaboral
  ADD COLUMN nromn NUMERIC(19,0);
/* mod_persona.dat_datosnacimiento.idlocalidad (Unique Target, Fields) */
ALTER TABLE mod_persona.dat_datosnacimiento
  DROP COLUMN idlocalidad;
/* mod_persona.dat_datosnacimiento.idnacionalidadp (Unique Target, Fields) */
ALTER TABLE mod_persona.dat_datosnacimiento
  DROP COLUMN idnacionalidadp;
--</ALTER>

--<CREATE>
/* mod_persona.nom_condicionmigratoria (Unique Source, Tables) */
CREATE TABLE mod_persona.nom_condicionmigratoria (
  idcondicionmigratoria INTEGER DEFAULT nextval('mod_persona.sec_condicionmigratoria_seq'::regclass) NOT NULL,
  denominacion VARCHAR(50) NOT NULL,
  gestion NUMERIC(1,0) DEFAULT 1,
  abreviatura VARCHAR(5),
  CONSTRAINT pk_condicionmigratoria PRIMARY KEY(idcondicionmigratoria),
  CONSTRAINT chk_gestion_condicionmigratoria CHECK ((gestion = (0)::numeric) OR (gestion = (1)::numeric))
) 
WITH (oids = false);
/* mod_persona.dat_validacionpersona (Unique Source, Tables) */
CREATE TABLE mod_persona.dat_validacionpersona (
  idvalidacionpersona NUMERIC(19,0) DEFAULT nextval('mod_persona.sec_validacionpersona_seq'::regclass) NOT NULL,
  idpersona NUMERIC(19,0) NOT NULL,
  idfuente NUMERIC(2,0) NOT NULL,
  fechavalidacion TIMESTAMP WITHOUT TIME ZONE DEFAULT now() NOT NULL,
  CONSTRAINT pk_validacionpersona PRIMARY KEY(idvalidacionpersona)
) 
WITH (oids = false);
--</CREATE>

--<CONSTRAINT>
/* mod_persona.dat_situacionlaboral.chk_estado_situacionlaboral (Different, Checks) */
/* Different properties: Condition */
ALTER TABLE mod_persona.dat_situacionlaboral
  DROP CONSTRAINT chk_estado_situacionlaboral RESTRICT;
/* mod_persona.nom_motivobaja (Unique Target, Tables) */
ALTER TABLE mod_persona.nom_motivobaja
  DROP CONSTRAINT fk_motivobaja_motivobaja_idpadre RESTRICT;
/* mod_persona.dat_situacionlaboral.fk_confespcargo_situacionlaboralp_idespcargo (Different, Foreign keys) */
/* Different properties: Description, Delete Action, Update Action */
ALTER TABLE mod_persona.dat_situacionlaboral
  DROP CONSTRAINT fk_confespcargo_situacionlaboralp_idespcargo RESTRICT;
/* mod_persona.dat_personaentidad.fk_procedenciasocial_personaentidad (Different, Foreign keys) */
/* Different properties: Foreign Table */
ALTER TABLE mod_persona.dat_personaentidad
  DROP CONSTRAINT fk_procedenciasocial_personaentidad RESTRICT;
/* mod_persona.nom_gruposanguineo.chk_gestion_gruposanguineo (Unique Source, Checks) */
ALTER TABLE mod_persona.nom_gruposanguineo
  ADD CONSTRAINT chk_gestion_gruposanguineo CHECK ((gestion = (0)::numeric) OR (gestion = (1)::numeric));
/* mod_persona.nom_nacionalidad.chk_gestion_nacionalidad (Unique Source, Checks) */
ALTER TABLE mod_persona.nom_nacionalidad
  ADD CONSTRAINT chk_gestion_nacionalidad CHECK ((gestion = (0)::numeric) OR (gestion = (1)::numeric));
/* mod_persona.nom_tipocontacto.chk_gestion_tipocontacto (Unique Source, Checks) */
ALTER TABLE mod_persona.nom_tipocontacto
  ADD CONSTRAINT chk_gestion_tipocontacto CHECK ((gestion = (0)::numeric) OR (gestion = (1)::numeric));
/* mod_persona.nom_tipodocidentidad.chk_gestion_tipodocidentidad (Unique Source, Checks) */
ALTER TABLE mod_persona.nom_tipodocidentidad
  ADD CONSTRAINT chk_gestion_tipodocidentidad CHECK ((gestion = (0)::numeric) OR (gestion = (1)::numeric));
/* mod_persona.nom_tipomediocontacto.chk_gestion_tipomediocontacto (Unique Source, Checks) */
ALTER TABLE mod_persona.nom_tipomediocontacto
  ADD CONSTRAINT chk_gestion_tipomediocontacto CHECK ((gestion = (0)::numeric) OR (gestion = (1)::numeric));
/* mod_persona.dat_situacionlaboral.chk_estado_situacionlaboral (Different, Checks) */
/* Different properties: Condition */
ALTER TABLE mod_persona.dat_situacionlaboral
  ADD CONSTRAINT chk_estado_situacionlaboral CHECK ((estado = (0)::numeric) OR (estado = (1)::numeric) OR (estado = (2)::numeric) OR (estado = (3)::numeric));
/* mod_persona.nom_ciudadania.chk_gestion_ciudadania (Unique Source, Checks) */
ALTER TABLE mod_persona.nom_ciudadania
  ADD CONSTRAINT chk_gestion_ciudadania CHECK ((gestion = (0)::numeric) OR (gestion = (1)::numeric));
/* mod_persona.nom_colorojos.chk_gestion_colorojos (Unique Source, Checks) */
ALTER TABLE mod_persona.nom_colorojos
  ADD CONSTRAINT chk_gestion_colorojos CHECK ((gestion = (0)::numeric) OR (gestion = (1)::numeric));
/* mod_persona.nom_colorpelo.chk_gestion_colorpelo (Unique Source, Checks) */
ALTER TABLE mod_persona.nom_colorpelo
  ADD CONSTRAINT chk_gestion_colorpelo CHECK ((gestion = (0)::numeric) OR (gestion = (1)::numeric));
/* mod_persona.nom_colorpiel.chk_gestion_colorpiel (Unique Source, Checks) */
ALTER TABLE mod_persona.nom_colorpiel
  ADD CONSTRAINT chk_gestion_colorpiel CHECK ((gestion = (0)::numeric) OR (gestion = (1)::numeric));
/* mod_persona.dat_docidentidad.ak_idp_num_tipdoc (Unique Source, Indices) */
ALTER TABLE mod_persona.dat_docidentidad
  ADD CONSTRAINT ak_idp_num_tipdoc 
    UNIQUE (idpersona, numero, idtipodocidentidad) NOT DEFERRABLE;
/* mod_persona.dat_validacionpersona (Unique Source, Tables) */
ALTER TABLE mod_persona.dat_validacionpersona
  ADD CONSTRAINT fk_persona_validacionpersona_idpersona FOREIGN KEY (idpersona)
    REFERENCES mod_persona.dat_persona(idpersona)
    ON DELETE CASCADE
    ON UPDATE CASCADE
    NOT DEFERRABLE;
/* mod_persona.dat_situacionlaboral.fk_confespcargo_situacionlaboralp_idespcargo (Different, Foreign keys) */
/* Different properties: Description, Delete Action, Update Action */
ALTER TABLE mod_persona.dat_situacionlaboral
  ADD CONSTRAINT fk_confespcargo_situacionlaboralp_idespcargo FOREIGN KEY (idespcargo)
    REFERENCES mod_rrhhmaestro.conf_espcargo(idespcargo)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
    NOT DEFERRABLE;
--</CONSTRAINT>

--Cambios 10/07/2021
CREATE TYPE mod_persona.td_foreingkey AS (
  esquema NAME,
  tabla NAME,
  esquemaforaneo NAME,
  tablaforanea NAME,
  nombre NAME,
  addforeingkey1 TEXT,
  addforeingkey2 TEXT,
  dropforeingkey TEXT
);

COMMENT ON TYPE mod_persona.td_foreingkey
IS 'Tipo de dato creado para el retorno de la función (mod_persona.f_foreingkey_info).';

CREATE OR REPLACE FUNCTION mod_persona.convertir_prim_mayusc_resto_minusc (
)
RETURNS void AS
$body$
BEGIN

UPDATE mod_persona.dat_persona
   SET nombre = (UPPER(LEFT(nombre, 1))||LOWER(SUBSTRING(nombre, 2, length(nombre)))),
       snombre = (UPPER(LEFT(snombre, 1))||LOWER(SUBSTRING(snombre, 2, length(snombre)))),
       papel = (UPPER(LEFT(papel, 1))||LOWER(SUBSTRING(papel, 2, length(papel)))),
       sapel = (UPPER(LEFT(sapel, 1))||LOWER(SUBSTRING(sapel, 2, length(sapel))));
END;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
PARALLEL UNSAFE
COST 5;

CREATE OR REPLACE FUNCTION mod_persona.f_adicionar_columna (
  esquema varchar,
  columna varchar,
  tipodat varchar
)
RETURNS boolean AS
$body$
DECLARE

r boolean;
tables_nom_nextval record;
addcolumn character varying;

BEGIN
r := false;
raise notice 'Flujo1 "ALTER" ';
For tables_nom_nextval in select table_name,(replace(table_name,'nom_','')) as restchk FROM information_schema.tables WHERE table_schema = $1 and table_name like 'nom_%' and table_name not in 
										(select table_name 
											FROM information_schema.columns 
											WHERE table_schema = $1 and table_name like 'nom_%' and column_name like $2)
loop
r := true;
addcolumn:= 'ALTER TABLE '||$1||'.'||tables_nom_nextval.table_name||' ADD COLUMN '||$2||' '||$3||';';
raise notice 'addcolumn: %',addcolumn;
execute addcolumn;
end loop;

RETURN r;
END;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
PARALLEL UNSAFE
COST 100;

COMMENT ON FUNCTION mod_persona.f_adicionar_columna(esquema varchar, columna varchar, tipodat varchar)
IS 'Adiciona la columna "columna_tipodat" a todos los nomencladores del esquema especificado.';

CREATE OR REPLACE FUNCTION mod_persona.f_adicionar_columna_gestion (
  esquema varchar
)
RETURNS boolean AS
$body$
DECLARE
r boolean;

tables_nom_nextval record;
upd record;

addcolumn character varying;
defaultcolumn character varying;
addcheck character varying;
update_data character varying;

BEGIN
r := false;
raise notice 'Flujo1 "ALTER" ';
For tables_nom_nextval in select table_name,(replace(table_name,'nom_','')) as restchk FROM information_schema.tables WHERE table_schema = $1 and table_name like 'nom_%' and table_name not in 
										(select table_name 
											FROM information_schema.columns 
											WHERE table_schema = $1 and table_name like 'nom_%' and column_name like 'gestion')
loop
r := true;
addcolumn:= 'ALTER TABLE '||$1||'.'||tables_nom_nextval.table_name||' ADD COLUMN gestion numeric(1,0)'||';';
raise notice 'addcolumn: %',addcolumn;
execute addcolumn;
defaultcolumn:='ALTER TABLE '||$1||'.'||tables_nom_nextval.table_name||' ALTER COLUMN gestion SET DEFAULT 1'||';';
raise notice 'addcolumn: %',defaultcolumn;
execute defaultcolumn;
addcheck:='ALTER TABLE '||$1||'.'||tables_nom_nextval.table_name||' ADD CONSTRAINT chk_gestion_'||tables_nom_nextval.restchk||' CHECK (gestion = 0::numeric OR gestion = 1::numeric)'||';';
raise notice 'addcolumn: %',addcheck;
execute addcheck;
end loop;
raise notice '';
raise notice 'Flujo2 "UPDATE" ';
for upd in (select table_name FROM information_schema.columns 
			      WHERE table_schema = $1 and table_name like 'nom_%' and column_name like 'gestion')loop
--Flujo2
update_data:= 'UPDATE '||$1||'.'||upd.table_name||' SET gestion=1 WHERE gestion is null and (SELECT count(*) FROM '||$1||'.'||upd.table_name||') > 0'||';';
execute update_data;
raise notice 'addcolumn: %',update_data;
r := true;
end loop;

RETURN r;
END;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
PARALLEL UNSAFE
COST 100;

COMMENT ON FUNCTION mod_persona.f_adicionar_columna_gestion(esquema varchar)
IS 'Adiciona la columna "gestion" a todos los nomencladores del esquema especificado.';

CREATE OR REPLACE FUNCTION mod_persona.f_cambiar_owner (
  esquema varchar,
  usuario varchar
)
RETURNS boolean AS
$body$
DECLARE
r boolean;
sentencia record;
consulta character varying;
esq record;
sqlexe character varying;
BEGIN
r := false; 
SELECT 'ALTER SCHEMA '||$1||' OWNER TO '||$2||';' AS sql INTO esq;
consulta:= esq.sql;
execute consulta;
For sentencia in SELECT 'ALTER TABLE '|| schemaname || '.' || tablename ||' OWNER TO '||$2||';' AS sentencia_sql_alter
FROM pg_tables WHERE schemaname IN ($1)
ORDER BY schemaname, tablename
loop
consulta:=  sentencia.sentencia_sql_alter;
execute consulta;
r := true;
end loop;
RETURN r;
END;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
PARALLEL UNSAFE
COST 100;

COMMENT ON FUNCTION mod_persona.f_cambiar_owner(esquema varchar, usuario varchar)
IS 'Función para cambiar el propietario del esquema especificado por parámetro y sus tablas. Versión 2. (RRHH)';

CREATE OR REPLACE FUNCTION mod_persona.f_cambiar_owner_seq (
  esquema varchar,
  usuario varchar
)
RETURNS boolean AS
$body$
DECLARE
r boolean;
sentencia record;
consulta character varying;
BEGIN
r := false; 
For sentencia in SELECT 'ALTER SEQUENCE '|| sequence_schema || '.' || sequence_name ||' OWNER TO '||$2||';' AS sentencia_sql_alter
FROM information_schema.sequences WHERE sequence_schema IN ($1)
ORDER BY sequence_schema, sequence_name
loop
consulta:=  sentencia.sentencia_sql_alter;
execute consulta;
r := true;
end loop;
RETURN r;
END;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
PARALLEL UNSAFE
COST 100;

COMMENT ON FUNCTION mod_persona.f_cambiar_owner_seq(esquema varchar, usuario varchar)
IS 'Función para cambiar el propietario de las secuencias del esquema especificado por parámetro. Versión 1. (RRHH)';

CREATE OR REPLACE FUNCTION mod_persona.f_comentarsecuencias (
  esquema varchar
)
RETURNS boolean AS
$body$
DECLARE
r boolean;
tables_nextval record;
BEGIN
r := false; 
for tables_nextval in select table_name, column_name, column_default, table_schema, substring(column_default,10,length(column_default)-21) as nombre
from information_schema.columns where table_schema = esquema and column_default like 'nextval%'
loop
/*COMMENT ON SEQUENCE mod_persona.sec_ciudadania_seq IS 'Secuencia empleada para autogenerar el identificador de la tabla "nom_ciudadania".';*/
execute 'COMMENT ON SEQUENCE ' ||tables_nextval.nombre|| ' IS ' ||''' '  ||''||'Secuencia empleada para autogenerar el identificador de la tabla '||'"'||tables_nextval.table_name||'".'||''' ';
r := true;
end loop;
RETURN r;
END;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
PARALLEL UNSAFE
COST 100;

COMMENT ON FUNCTION mod_persona.f_comentarsecuencias(esquema varchar)
IS 'Función para comentar las secuencias pertenecientes al esquema especificado por parámetro. Versión 1. (RRHH)';

CREATE OR REPLACE FUNCTION mod_persona.f_for_cleaning_schema (
  esquema varchar
)
RETURNS boolean AS
$body$
DECLARE
r boolean;
v_tablas record;
BEGIN
r := false;
IF ($1 NOT IN ('mod_utiles','mod_personaproyecto','mod_reccomplejas2'))THEN
	FOR v_tablas IN (SELECT table_name FROM information_schema.tables WHERE table_schema LIKE $1 AND table_type LIKE 'BASE TABLE' ORDER BY table_name DESC) LOOP
	IF ( ($1 LIKE 'mod_evaluaciones' AND ((v_tablas.table_name LIKE 'dat_evaldominioevaluativo') OR (v_tablas.table_name LIKE 'dat_evalescala')
	                                  OR (v_tablas.table_name LIKE 'dat_evalescalarangonumerico') OR (v_tablas.table_name LIKE 'dat_evalescalavalorescualitativos')
	                                  OR (v_tablas.table_name LIKE 'dat_evalindicadoresevaluar') OR (v_tablas.table_name LIKE 'dat_evalindicadoresplanilla')
	                                  OR (v_tablas.table_name LIKE 'dat_evalmodelo') OR (v_tablas.table_name LIKE 'dat_evalplanillasevaluativas')
	                                  OR (v_tablas.table_name LIKE 'dat_evalrecursoevaluativo') OR (v_tablas.table_name LIKE 'nom_%')
	                                ))
	    OR ($1 LIKE 'mod_persona' AND ((v_tablas.table_name LIKE 'dat_nomenclador') OR (v_tablas.table_name LIKE 'dat_persona')
	                                    OR (v_tablas.table_name LIKE 'nom_%')))
	    OR ($1 LIKE 'mod_personaext' AND ((v_tablas.table_name LIKE 'nom_%')))                           
	    OR ($1 LIKE 'mod_fuerzatrabajo' AND v_tablas.table_name LIKE 'nom_%')
	    OR ($1 LIKE 'mod_rrhhmaestro' AND ((v_tablas.table_name LIKE 'nom_dominio')))
	    OR ($1 LIKE 'mod_nomina' AND (
						v_tablas.table_name LIKE 'nom_%'
						OR v_tablas.table_name LIKE 'conf_calendario'
						OR v_tablas.table_name LIKE 'conf_conceptoscontables' 
						OR v_tablas.table_name LIKE 'conf_conceptoscontablesentidad' 
						OR v_tablas.table_name LIKE 'conf_conceptosgeneralesnomina'
						OR v_tablas.table_name LIKE 'conf_conceptospdformasysistemaspago'						 
						OR v_tablas.table_name LIKE 'conf_conceptosportiposysistemaspago'						
						OR v_tablas.table_name LIKE 'conf_condicionesretenciones'
						OR v_tablas.table_name LIKE 'conf_estructuramodelosnomina'
						OR v_tablas.table_name LIKE 'conf_estructuramodelosnominaentidad'
						OR v_tablas.table_name LIKE 'conf_modelonomina'
						OR v_tablas.table_name LIKE 'conf_modelonominacategoria'
						OR v_tablas.table_name LIKE 'conf_periodostipospago'
						OR v_tablas.table_name LIKE 'conf_registsalartiempservc'
						OR v_tablas.table_name LIKE 'conf_tiporeportescertificaciones'						
						OR v_tablas.table_name LIKE 'conf_variableglobalvalor'						
						OR v_tablas.table_name LIKE 'conf_variablestiporeportescertificaciones'						
						OR v_tablas.table_name LIKE 'dat_conceptoscontableselementosgasto'
						OR v_tablas.table_name LIKE 'dat_datosmodelonominaconceptos'
						OR v_tablas.table_name LIKE 'dat_variableauxconceptospdformasysistemaspago'			
					)
	       )
	    OR ($1 LIKE 'mod_seleccion' AND (v_tablas.table_name LIKE 'nom_comite' OR v_tablas.table_name LIKE 'nom_motivoexclusion'
	                                     OR v_tablas.table_name LIKE 'nom_motivoreicorporacion' OR v_tablas.table_name LIKE 'nom_motivoseguimiento'
	                                     OR v_tablas.table_name LIKE 'nom_viareclutamiento'))
	    OR ($1 LIKE 'mod_regimentrabajo' AND (v_tablas.table_name LIKE 'conf_habcontrolacceso' OR v_tablas.table_name LIKE 'conf_horasextras'
	                                     OR v_tablas.table_name LIKE 'conf_habilitarhorarioentradasalida' OR v_tablas.table_name LIKE 'nom_causa'
	                                     OR v_tablas.table_name LIKE 'nom_tipodedia'))	                                     	         
	    
	   )THEN
	        RAISE NOTICE '**********************************************************************************************************************';
		RAISE NOTICE '*** AVISO: Tabla % descartada en el vaciado del esquema %. (((¡¡¡CONTENIDO PROTEGIDO!!!))) ***',v_tablas.table_name,$1;
		RAISE NOTICE '**********************************************************************************************************************';
	ELSE
		EXECUTE 'TRUNCATE TABLE ' ||$1||'.'||v_tablas.table_name||' CASCADE;';
		r := true;
	END IF;
	END LOOP;
END IF;
PERFORM * FROM mod_persona.f_reiniciarsecuencias($1);
RETURN r;
END;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
PARALLEL UNSAFE
COST 100;

COMMENT ON FUNCTION mod_persona.f_for_cleaning_schema(esquema varchar)
IS 'TRUNCATE TABLE mod_agendareunion.nom_causales CASCADE;';

CREATE OR REPLACE FUNCTION mod_persona.f_reiniciarsecuencias (
  esquema varchar
)
RETURNS boolean AS
$body$
DECLARE
r boolean;
maximo numeric;
secuencia record;
tables_nextval record;
cadena character varying;
consulta character varying;
esq character varying;
remplz character varying;
limpiar character varying;
cadena_parent character varying;
BEGIN
r := false; 
For tables_nextval in  select
table_name,column_name,column_default ,table_schema
FROM information_schema.columns WHERE table_schema = esquema and column_default like 'nextval%'
loop
/* Selecciona el nombre de la secuencia del nextval en el record, o sea de:  nextval('public.sec_nombre_seq'::regclass) se queda con 'public.sec_nombre_seq' */
cadena:= (select split_part(
(
select "substring"( tables_nextval.column_default,(select position('(' in tables_nextval.column_default))+1, (select length(tables_nextval.column_default)) ) ), ':', 1));
/* Guardamos en esq el lugar donde se encuentra la secuencia o sea esquema.tabla*/                               
esq = ($1||'.'||tables_nextval.table_name);
/* Selecciona el valor maximo de la columna en donde esta la secuencia*/
consulta:=  ' select max('||tables_nextval.column_name||') FROM '||esq||';';
/* Ejecuta consulta y lo almacena en la variable max */
execute consulta into maximo;
--execute 'ALTER SEQUENCE '||cadena||' MAXVALUE 999999999999999999;';
select split_part((select "substring"(cadena,(select position('.' in cadena))+1,(select length(cadena)))),'.',1) into remplz;
limpiar:= replace(remplz,'''','');
select minimum_value::numeric, maximum_value::numeric into secuencia from information_schema.sequences where sequence_schema=$1 and sequence_name=limpiar;
/* Si max no esta vacio reinicia la secuencia por el valor maximo encontrado*/
cadena_parent:= replace(cadena,'(','');
if(maximo is not null)then
raise notice 'cadena: % , min: % y max: %',cadena_parent,secuencia.minimum_value,maximo;
if(maximo >= secuencia.minimum_value)then
	if(maximo < secuencia.maximum_value)then		
		raise notice 'cadena_parent %',cadena_parent;
		execute'select setval('||cadena_parent|| ','||maximo||',true);';
	else
		--descartar
		raise notice 'Reinicio de secuencia descartado para "%". Nota: valor de inicio SUPERIOR al valor máximo definido por el objeto en su creación.',cadena_parent;
	end if;
else
--descartar
raise notice 'Reinicio de secuencia descartado para "%". Nota: valor de inicio INFERIOR al valor mínimo definido por el objeto en su creación.',cadena_parent;
end if;
/* Si max esta vacio reinicia por defecto con el valor 1*/
else 
select split_part((select "substring"(cadena_parent,
                                     (select position('.' in cadena_parent))+1,
                                     (select length(cadena_parent))
                                     )
                  ),
                  '.',
                  1) into remplz;
limpiar:= replace(remplz,'''','');
--consulta:= 'select minimum_value::numeric from information_schema.sequences where sequence_schema='||$1||' and sequence_name='||limpiar||';';
select minimum_value::numeric into secuencia from information_schema.sequences where sequence_schema=$1 and sequence_name=limpiar;
raise notice 'cadena: % y min: %',cadena_parent,secuencia.minimum_value;
execute ' select setval('||cadena_parent||','||secuencia.minimum_value||',true);';
end if;
r := true;
end loop;
RETURN r;
END;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
PARALLEL UNSAFE
COST 100;

COMMENT ON FUNCTION mod_persona.f_reiniciarsecuencias(esquema varchar)
IS 'Función para reiniciar las secuencias pertenecientes al esquema especificado por parámetro. Versión 2. (RRHH)';

CREATE OR REPLACE FUNCTION mod_persona.f_validar_esquema (
  ndatabase varchar,
  nesquema varchar
)
RETURNS boolean AS
$body$
DECLARE
v_esquema character varying;
salida boolean;

BEGIN
salida := false;
	IF (($1 IS NULL) OR ($1 LIKE '')) THEN 
		RAISE EXCEPTION 'Requiere un nombre de base de datos en el primer parámetro.';
		salida := false;
	END IF;
	IF (($2 IS NULL) OR ($2 LIKE '')) THEN
		RAISE EXCEPTION 'Requiere un nombre de esquema en el segundo parámetro.';
		salida := false;
	END IF;
	SELECT schema_name INTO v_esquema FROM information_schema.schemata WHERE catalog_name=$1 AND schema_name LIKE $2;
	IF(v_esquema NOT LIKE '') THEN
	   salida := true;
	   RAISE NOTICE 'El esquema referenciado existe.';
	ELSE
	   salida := false;
	   RAISE NOTICE 'No existe el esquema referenciado. Verifique que sus datos especificados (BD: % y ESQ: %) sean los correctos.',$1,$2;
	END IF;
RETURN salida;
END;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
PARALLEL UNSAFE
COST 100;

CREATE OR REPLACE FUNCTION mod_persona.ft_actualizar_trayectoria (
)
RETURNS trigger AS
$body$
DECLARE
  existe_situacion numeric;
  idpers numeric;
  denom_entidad VARCHAR;
  denom_cargo VARCHAR;
  fdesde_alta date;
  fhasta_baja date;
BEGIN
  IF (NEW.estado = 1 OR NEW.estado = 2) THEN
    SELECT count(idtrayectorialaboral) INTO existe_situacion FROM mod_personaext.his_trayectorialaboral WHERE idsituacionlaboral = NEW.idsituacionlaboralp;
    SELECT idpersona INTO idpers FROM mod_persona.dat_personaentidad WHERE idpersonaentidad = NEW.idpersonaentidad;
    SELECT de.denominacion INTO denom_entidad FROM mod_persona.dat_personaentidad dpe INNER JOIN mod_estructuracomp.dat_estructura de ON (dpe.identidad = de.idestructura AND de.idproyecto = 0) WHERE idpersonaentidad = NEW.idpersonaentidad;
    SELECT nc.denominacion INTO denom_cargo FROM mod_persona.dat_situacionlaboral dsl INNER JOIN mod_estructuracomp.dat_cargo dc ON (dsl.idcargo = dc.idcargo AND dc.idproyecto = 0) INNER JOIN mod_estructuracomp.nom_cargo nc ON (dc.idnomcargo = nc.idnomcargo) WHERE dsl.idsituacionlaboralp = NEW.idsituacionlaboralp;
    SELECT fdesde INTO fdesde_alta FROM mod_persona.dat_personaentidad WHERE idpersonaentidad = NEW.idpersonaentidad;
    SELECT fhasta INTO fhasta_baja FROM mod_persona.dat_personaentidad WHERE idpersonaentidad = NEW.idpersonaentidad;
    IF(existe_situacion = 0) THEN
  	  INSERT INTO mod_personaext.his_trayectorialaboral (idpersona, orgentidad, cargo, fdesde, fhasta, observacion, noalta, falta, fbaja, motivobaja, idsituacionlaboral) VALUES (idpers, denom_entidad, denom_cargo, NEW.fdesde, NEW.fhasta, null, NEW.noalta, fdesde_alta, fhasta_baja, null, NEW.idsituacionlaboralp);
    END IF;
    IF (existe_situacion = 1) THEN
  	  UPDATE mod_personaext.his_trayectorialaboral SET idpersona = idpers, orgentidad = denom_entidad, cargo = denom_cargo, fdesde = NEW.fdesde, fhasta = NEW.fhasta, noalta = NEW.noalta, falta = fdesde_alta, fbaja = fhasta_baja WHERE idsituacionlaboral = NEW.idsituacionlaboralp;
    END IF;
  END IF;
  RETURN NULL;
END;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
PARALLEL UNSAFE
COST 100;

CREATE OR REPLACE FUNCTION mod_persona.soundexesp (
  input text
)
RETURNS text AS
$body$
DECLARE
	soundex text='';	
	-- para determinar la primera letra
	pri_letra text;
	resto text;
	sustituida text ='';
	-- para quitar adyacentes
	anterior text;
	actual text;
	corregido text;
BEGIN
       -- devolver null si recibi un string en blanco o con espacios en blanco
	IF LENGTH(TRIM(INPUT))= 0 THEN
		RETURN NULL;
	END IF;
 
 
	-- 1: LIMPIEZA:
		-- pasar a mayuscula, eliminar la letra "H" inicial, los acentos y la enie
		-- 'holá coñó' => 'OLA CONO'
		INPUT=translate(ltrim(TRIM(UPPER(INPUT)),'H'),'ÑÁÉÍÓÚÀÈÌÒÙÜ','NAEIOUAEIOUU');
 
		-- eliminar caracteres no alfabéticos (números, símbolos como &,%,",*,!,+, etc.
		INPUT=regexp_replace(INPUT, '[^a-zA-Z]', '', 'g');
 
	-- 2: PRIMERA LETRA ES IMPORTANTE, DEBO ASOCIAR LAS SIMILARES
	--  'vaca' se convierte en 'baca'  y 'zapote' se convierte en 'sapote'
	-- un fenomeno importante es GE y GI se vuelven JE y JI; CA se vuelve KA, etc
	pri_letra =substr(INPUT,1,1);
	resto =substr(INPUT,2);
	CASE 
		WHEN pri_letra IN ('V') THEN
			sustituida='B';
		WHEN pri_letra IN ('Z','X') THEN
			sustituida='S';
		WHEN pri_letra IN ('G') AND substr(INPUT,2,1) IN ('E','I') THEN
			sustituida='J';
		WHEN pri_letra IN('C') AND substr(INPUT,2,1) NOT IN ('H','E','I') THEN
			sustituida='K';
		ELSE
			sustituida=pri_letra;
 
	END CASE;
	--corregir el parametro con las consonantes sustituidas:
	INPUT=sustituida || resto;		
 
	-- 3: corregir "letras compuestas" y volverlas una sola
	INPUT=REPLACE(INPUT,'CH','V');
	INPUT=REPLACE(INPUT,'QU','K');
	INPUT=REPLACE(INPUT,'LL','J');
	INPUT=REPLACE(INPUT,'CE','S');
	INPUT=REPLACE(INPUT,'CI','S');
	INPUT=REPLACE(INPUT,'YA','J');
	INPUT=REPLACE(INPUT,'YE','J');
	INPUT=REPLACE(INPUT,'YI','J');
	INPUT=REPLACE(INPUT,'YO','J');
	INPUT=REPLACE(INPUT,'YU','J');
	INPUT=REPLACE(INPUT,'GE','J');
	INPUT=REPLACE(INPUT,'GI','J');
	INPUT=REPLACE(INPUT,'NY','N');
	-- para debug:    --return input;
 
	-- EMPIEZA EL CALCULO DEL SOUNDEX
	-- 4: OBTENER PRIMERA letra
	pri_letra=substr(INPUT,1,1);
 
	-- 5: retener el resto del string
	resto=substr(INPUT,2);
 
	--6: en el resto del string, quitar vocales y vocales fonéticas
	resto=translate(resto,'@AEIOUHWY','@');
 
	--7: convertir las letras foneticamente equivalentes a numeros  (esto hace que B sea equivalente a V, C con S y Z, etc.)
	resto=translate(resto, 'BPFVCGKSXZDTLMNRQJ', '111122222233455677');
	-- así va quedando la cosa
	soundex=pri_letra || resto;
 
	--8: eliminar números iguales adyacentes (A11233 se vuelve A123)
	anterior=substr(soundex,1,1);
	corregido=anterior;
 
	FOR i IN 2 .. LENGTH(soundex) LOOP
		actual = substr(soundex, i, 1);
		IF actual <> anterior THEN
			corregido=corregido || actual;
			anterior=actual;			
		END IF;
	END LOOP;
	-- así va la cosa
	soundex=corregido;
 
	-- 9: siempre retornar un string de 4 posiciones
	soundex=rpad(soundex,4,'0');
	soundex=substr(soundex,1,4);		
 
	-- YA ESTUVO
	RETURN soundex;	
END;
$body$
LANGUAGE 'plpgsql'
IMMUTABLE
RETURNS NULL ON NULL INPUT
SECURITY INVOKER
PARALLEL UNSAFE
COST 500;

COMMENT ON FUNCTION mod_persona.soundexesp(input text)
IS 'https://wiki.postgresql.org/wiki/SoundexESP';

CREATE OR REPLACE FUNCTION mod_persona.sustituiryconvertir (
  campo varchar
)
RETURNS varchar AS
$body$
BEGIN
     RETURN lower(replace(replace(replace(replace(replace(replace(replace(replace(replace(replace(replace
                (replace(replace(replace(replace(replace(replace(replace(replace(replace(replace(replace(replace
                (replace(replace(trim(trim(trim(trim(trim($1)))))
                ,'''', ' '),'Á', 'A'),'É', 'E'),'Í', 'I'),'Ó', 'O'),'Ú', 'U'),'Ñ', 'N'),'Ü', 'U')
                ,'À', 'A'),'È', 'E'),'Ì', 'I'),'Ò', 'O'),'Ù', 'U')
                ,'á', 'a'),'é', 'e'),'í', 'i'),'ó', 'o'),'ú', 'u')
                ,'à', 'a'),'è', 'e'),'ì', 'i'),'ò', 'o'),'ù', 'u'),'ü', 'u'),'ñ', 'n'));
END;
$body$
LANGUAGE 'plpgsql'
IMMUTABLE
CALLED ON NULL INPUT
SECURITY INVOKER
PARALLEL UNSAFE
COST 5;

COMMENT ON FUNCTION mod_persona.sustituiryconvertir(campo varchar)
IS 'Función para cambiar los caracteres con acento del parámetro, para retornar el mismo con los caracteres sin acentuar. Versión 1. (RRHH)';

COMMENT ON SEQUENCE mod_persona.sec_accesosindominio_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "seg_accesosindominio".';

COMMENT ON SEQUENCE mod_persona.sec_ciudadania_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "nom_ciudadania".';

COMMENT ON SEQUENCE mod_persona.sec_ciudadaniap_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "dat_ciudadania".';

COMMENT ON SEQUENCE mod_persona.sec_colorojos_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "nom_colorojos".';

COMMENT ON SEQUENCE mod_persona.sec_colorpelo_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "nom_colorpelo".';

COMMENT ON SEQUENCE mod_persona.sec_colorpiel_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "nom_colorpiel".';

COMMENT ON SEQUENCE mod_persona.sec_condicionmigratoria_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "nom_condicionmigratoria".';

COMMENT ON SEQUENCE mod_persona.sec_contacto_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "dat_contacto".';

COMMENT ON SEQUENCE mod_persona.sec_datosnacimiento_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "dat_datosnacimiento".';

COMMENT ON SEQUENCE mod_persona.sec_direccion_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "dat_direccion".';

COMMENT ON SEQUENCE mod_persona.sec_docidentidad_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "dat_docidentidad".';

COMMENT ON SEQUENCE mod_persona.sec_fenotipo_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "dat_fenotipo".';

COMMENT ON SEQUENCE mod_persona.sec_foto_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "dat_foto".';

COMMENT ON SEQUENCE mod_persona.sec_gruposanguineo_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "nom_gruposanguineo".';

COMMENT ON SEQUENCE mod_persona.sec_nacionalidad_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "nom_nacionalidad".';

COMMENT ON SEQUENCE mod_persona.sec_nacionalidadp_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "dat_nacionalidad".';

COMMENT ON SEQUENCE mod_persona.sec_nomenclador_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "dat_nomenclador".';

COMMENT ON SEQUENCE mod_persona.sec_persona_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "dat_persona".';

COMMENT ON SEQUENCE mod_persona.sec_personaentidad_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "dat_personaentidad".';

COMMENT ON SEQUENCE mod_persona.sec_situacion_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "nom_situacion".';

COMMENT ON SEQUENCE mod_persona.sec_situacionlaboralp_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "dat_situacionlaboral".';

COMMENT ON SEQUENCE mod_persona.sec_tipocontacto_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "nom_tipocontacto".';

COMMENT ON SEQUENCE mod_persona.sec_tipodocidentidad_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "nom_tipodocidentidad".';

COMMENT ON SEQUENCE mod_persona.sec_tipomediocontacto_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "nom_tipomediocontacto".';

COMMENT ON SEQUENCE mod_persona.sec_validacionpersona_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "dat_validacionpersona".';

CREATE OR REPLACE FUNCTION mod_persona.f_foreingkey_info (
  nombredatabase varchar,
  nombreesquema varchar
)
RETURNS SETOF mod_persona.td_foreingkey AS
$body$
DECLARE
v_foreing record;
v_td_fk mod_persona.td_foreingkey;
v_esquemas record;
v_esq character varying;
BEGIN
IF (($1 IS NULL) OR ($1 LIKE '')) THEN
RAISE EXCEPTION 'Requiere un nombre de base de datos.';
ELSE
SELECT schema_name INTO v_esquemas FROM information_schema.schemata WHERE catalog_name=$1 AND schema_name NOT LIKE 'pg_%' AND schema_name<>'information_schema' ORDER BY schema_name;
SELECT schema_name INTO v_esq FROM information_schema.schemata
WHERE catalog_name=$1 AND schema_name NOT LIKE 'pg_%' AND schema_name<>'information_schema' AND schema_name like $2 ORDER BY schema_name;
IF(v_esq IS NOT NULL)THEN
RAISE NOTICE 'Datos foráneos referentes al esquema (%) de la base de datos(%).',$2,$1;
RAISE NOTICE 'Esquema: %',$2;
    FOR v_foreing IN (
     SELECT
	pg_namespace.nspname as esquema
	, pg_class.relname AS tabla
	,(select ns.nspname from pg_namespace ns inner join pg_class a on(ns.oid = a.relnamespace) where a.oid=pg_constraint.confrelid) as esquemaforaneo
	, (select a.relname from pg_class a where a.oid=pg_constraint.confrelid) as tablaforanea
	, pg_constraint.conname as nombrellave
	, 'ALTER TABLE '||pg_namespace.nspname||'.'||pg_class.relname ||' ADD CONSTRAINT '||pg_constraint.conname as consulta_add_1
	, ' '||pg_get_constraintdef(pg_constraint.oid)||';' as consulta_add_2
	, 'ALTER TABLE '||pg_namespace.nspname||'.'||pg_class.relname ||' DROP CONSTRAINT '||pg_constraint.conname||';' as consulta_drop
	FROM pg_constraint, pg_class, pg_namespace
      WHERE (	(pg_constraint.contype = 'f'::"char")
		and (pg_constraint.conrelid = pg_class.oid)
		and pg_class.relnamespace = pg_namespace.oid
		and pg_namespace.nspname = $2
	--para obtener las foraneas de esquemas diferentes al referenciado. (salto de línea chr(10))
		--and pg_namespace.nspname <> (select ns.nspname from pg_namespace ns inner join pg_class a on(ns.oid = a.relnamespace) where a.oid=pg_constraint.confrelid)
      )ORDER BY esquemaforaneo,tablaforanea)
     LOOP
	v_td_fk.esquema = v_foreing.esquema;
	v_td_fk.tabla = v_foreing.tabla;
	v_td_fk.esquemaforaneo = v_foreing.esquemaforaneo;
	v_td_fk.tablaforanea = v_foreing.tablaforanea;
	v_td_fk.nombre = v_foreing.nombrellave;
	v_td_fk.addforeingkey1 = v_foreing.consulta_add_1;
	v_td_fk.addforeingkey2 = v_foreing.consulta_add_2;
	v_td_fk.dropforeingkey = v_foreing.consulta_drop;
	RAISE NOTICE 'Datos foráneos: %',v_foreing;
	RETURN NEXT v_td_fk;
     END LOOP;
ELSE
    RAISE NOTICE 'No existe el esquema (%) en la base de datos (%). Compruebe sus datos en el parámetro de la función.',$2,$1;
    FOR v_esquemas IN (SELECT schema_name FROM information_schema.schemata WHERE catalog_name=$1 AND schema_name NOT LIKE 'pg_%' AND schema_name<>'information_schema' ORDER BY schema_name)LOOP
    RAISE NOTICE 'Esquema: %',v_esquemas;
        FOR v_foreing IN (
		SELECT	pg_namespace.nspname as esquema
			, pg_class.relname AS tabla
			,(select ns.nspname from pg_namespace ns inner join pg_class a on(ns.oid = a.relnamespace) where a.oid=pg_constraint.confrelid) as esquemaforaneo
			, (select a.relname from pg_class a where a.oid=pg_constraint.confrelid) as tablaforanea
			, pg_constraint.conname as nombrellave
			, 'ALTER TABLE '||pg_namespace.nspname||'.'||pg_class.relname ||' ADD CONSTRAINT '||pg_constraint.conname as consulta_add_1
			, ' '||pg_get_constraintdef(pg_constraint.oid)||';' as consulta_add_2
			, 'ALTER TABLE '||pg_namespace.nspname||'.'||pg_class.relname ||' DROP CONSTRAINT '||pg_constraint.conname||';' as consulta_drop
			FROM pg_constraint, pg_class, pg_namespace
		WHERE (		(pg_constraint.contype = 'f'::"char")
				and (pg_constraint.conrelid = pg_class.oid)
				and pg_class.relnamespace = pg_namespace.oid
				and pg_namespace.nspname = v_esquemas.schema_name
			--para obtener las foraneas de esquemas diferentes al referenciado.
				--and pg_namespace.nspname <> (select ns.nspname from pg_namespace ns inner join pg_class a on(ns.oid = a.relnamespace) where a.oid=pg_constraint.confrelid)
		)
		ORDER BY esquemaforaneo,tablaforanea)
		LOOP
			v_td_fk.esquema = v_foreing.esquema;
			v_td_fk.tabla = v_foreing.tabla;
			v_td_fk.esquemaforaneo = v_foreing.esquemaforaneo;
			v_td_fk.tablaforanea = v_foreing.tablaforanea;
			v_td_fk.nombre = v_foreing.nombrellave;
			v_td_fk.addforeingkey1 = v_foreing.consulta_add_1;
			v_td_fk.addforeingkey2 = v_foreing.consulta_add_2;
			v_td_fk.dropforeingkey = v_foreing.consulta_drop;
			RAISE NOTICE 'v_foreing: %',v_foreing;
			RETURN NEXT v_td_fk;
		END LOOP;
    END LOOP;
END IF;
END IF;
END;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
PARALLEL UNSAFE
COST 100 ROWS 1000;

COMMENT ON FUNCTION mod_persona.f_foreingkey_info(nombredatabase varchar, nombreesquema varchar)
IS 'Función para obtener las llaves foráneas al esquema especificado por parámetro. Versión 2. (RRHH)';

COMMENT ON COLUMN mod_persona.nom_ciudadania.abreviatura
IS 'Abreviatura de la ciudadanía.';

COMMENT ON CONSTRAINT chk_gestion_colorojos ON mod_persona.nom_colorojos
IS 'Restricción sobre la(s) columna(s) "gestion".';

COMMENT ON COLUMN mod_persona.nom_colorojos.gestion
IS 'Indicador de gestión de la información.1- Gestionable, 0- No gestionable.';

COMMENT ON COLUMN mod_persona.nom_colorojos.abreviatura
IS 'Abreviatura del color de ojos.';

COMMENT ON CONSTRAINT chk_gestion_colorpelo ON mod_persona.nom_colorpelo
IS 'Restricción sobre la(s) columna(s) "gestion".';

COMMENT ON COLUMN mod_persona.nom_colorpelo.gestion
IS 'Indicador de gestión de la información.1- Gestionable, 0- No gestionable.';

COMMENT ON COLUMN mod_persona.nom_colorpelo.abreviatura
IS 'Abreviatura del color de pelo.';

COMMENT ON CONSTRAINT chk_gestion_colorpiel ON mod_persona.nom_colorpiel
IS 'Restricción sobre la(s) columna(s) "gestion".';

COMMENT ON COLUMN mod_persona.nom_colorpiel.gestion
IS 'Indicador de gestión de la información.1- Gestionable, 0- No gestionable.';

COMMENT ON COLUMN mod_persona.nom_colorpiel.abreviatura
IS 'Abreviatura del color de piel.';

COMMENT ON TABLE mod_persona.nom_condicionmigratoria
IS 'Almacena la condición migratoria.';

ALTER TABLE mod_persona.nom_condicionmigratoria OWNER TO zeolides;

COMMENT ON COLUMN mod_persona.nom_condicionmigratoria.idcondicionmigratoria
IS 'Identificador de la condición migratoria.';

COMMENT ON COLUMN mod_persona.nom_condicionmigratoria.denominacion
IS 'Denominación de la condición migratoria.';

COMMENT ON CONSTRAINT pk_condicionmigratoria ON mod_persona.nom_condicionmigratoria
IS 'LLave primaria para identificar la tupla.';

COMMENT ON COLUMN mod_persona.nom_gruposanguineo.compatiblecon
IS 'Almacena los grupos sanguíneos compatibles.';

COMMENT ON COLUMN mod_persona.nom_gruposanguineo.abreviatura
IS 'Abreviatura del grupo sanguineo.';

COMMENT ON COLUMN mod_persona.nom_nacionalidad.abreviatura
IS 'Abreviatura de la nacionalidad.';

COMMENT ON COLUMN mod_persona.dat_nomenclador.agrupador
IS 'Denominación del agrupador de nomencladores.';

COMMENT ON COLUMN mod_persona.nom_situacion.gestion
IS 'Determina si el registro es gestionable(1) o no(0).';

COMMENT ON COLUMN mod_persona.nom_tipocontacto.abreviatura
IS 'Abreviatura del tipo de contacto.';

--update para todas la tuplas de nom_tipodocidentidad
update mod_persona.nom_tipodocidentidad
set type='onlynumber', maxcaracter=11, mincaracter=11
where type is null;

ALTER TABLE mod_persona.nom_tipodocidentidad
  ALTER COLUMN type SET NOT NULL;

ALTER TABLE mod_persona.nom_tipodocidentidad
  ALTER COLUMN maxcaracter SET NOT NULL;

ALTER TABLE mod_persona.nom_tipodocidentidad
  ALTER COLUMN mincaracter SET NOT NULL;

COMMENT ON COLUMN mod_persona.nom_tipodocidentidad.abreviatura
IS 'Abreviatura del tipo de doc de identidad.';

COMMENT ON RULE r_tipodocumento ON mod_persona.nom_tipodocidentidad
IS 'Regla de integridad de la información para los datos iniciales y obligatorios del sistema.';

--update
update mod_persona.nom_tipomediocontacto
set type='onlyphone',maxcaracter=15, mincaracter=1
where idtipomediocontacto in (1,3,4);
update mod_persona.nom_tipomediocontacto
set type='correo',maxcaracter=50, mincaracter=1
where idtipomediocontacto = 2;
update mod_persona.nom_tipomediocontacto
set type='onlyphone',maxcaracter=15, mincaracter=1
where idtipomediocontacto = 5;

ALTER TABLE mod_persona.nom_tipomediocontacto
  ALTER COLUMN type SET NOT NULL;

ALTER TABLE mod_persona.nom_tipomediocontacto
  ALTER COLUMN maxcaracter SET NOT NULL;

ALTER TABLE mod_persona.nom_tipomediocontacto
  ALTER COLUMN mincaracter SET NOT NULL;

COMMENT ON COLUMN mod_persona.nom_tipomediocontacto.abreviatura
IS 'Abreviatura del tipo de medio de contacto.';


COMMENT ON COLUMN mod_persona.dat_datosnacimiento.localidad
IS 'Identificador de la localidad en que fue inscrita la persona.';

COMMENT ON COLUMN mod_persona.dat_direccion.idpais
IS 'Identificador del país en que reside la persona.';

COMMENT ON TABLE mod_persona.dat_validacionpersona
IS 'Almacena los datos relacionados a las validación de la persona.';

ALTER TABLE mod_persona.dat_validacionpersona OWNER TO zeolides;

COMMENT ON COLUMN mod_persona.dat_validacionpersona.idvalidacionpersona
IS 'Identificador de la tabla.';

COMMENT ON COLUMN mod_persona.dat_validacionpersona.idpersona
IS 'Identificador de la persona.';

COMMENT ON COLUMN mod_persona.dat_validacionpersona.idfuente
IS 'Identificador de la fuente por la que se validó la persona la última vez. 1-SUIN, 2-SUINFAR.';

COMMENT ON COLUMN mod_persona.dat_validacionpersona.fechavalidacion
IS 'Fecha en que se realizó la última validación a la persona.';

COMMENT ON CONSTRAINT chk_estado_situacionlaboral ON mod_persona.dat_situacionlaboral
IS 'Restricción sobre la(s) columna(s) "estado".';

COMMENT ON COLUMN mod_persona.dat_situacionlaboral.estado
IS 'Indicador del estado de la situación asociada a la persona e identificador para la obtención de la denominación del nomenclador (nom_motivobaja y nom_motivomovimiento) para 0-Actual, 1-Movimiento, 2-Baja, 3-Cambio de contrato.';

COMMENT ON COLUMN mod_persona.dat_situacionlaboral.idprogramalaboral
IS 'Identificador del programa constructivo.';

COMMENT ON COLUMN mod_persona.dat_situacionlaboral.nromn
IS 'Número que se genera en el movimiento de nómina.';

COMMENT ON CONSTRAINT fk_confespcargo_situacionlaboralp_idespcargo ON mod_persona.dat_situacionlaboral
IS 'LLave foránea para identificar la relación y garantizar la integridad referencial entre las tablas. (dat_situacionlaboral y conf_espcargo).';

COMMENT ON CONSTRAINT fk_tipocontrato_situacionlaboralp_idtipocontrato ON mod_persona.dat_situacionlaboral
IS 'LLave foránea para identificar la relación y garantizar la integridad referencial entre las tablas. (dat_situacionlaboral y nom_tipocontrato).';

CREATE INDEX idx_tipocontrato_situacionlaboralp_idtipocontrato ON mod_persona.dat_situacionlaboral
  USING btree (idtipocontrato);

COMMENT ON INDEX mod_persona.idx_tipocontrato_situacionlaboralp_idtipocontrato
IS 'Índice sobre la(s) columna(s) "idtipocontrato" para agilizar la búsqueda de información.';

CREATE INDEX idx_confespcargo_situacionlaboralp_idespcargo ON mod_persona.dat_situacionlaboral
  USING btree (idespcargo);

COMMENT ON INDEX mod_persona.idx_confespcargo_situacionlaboralp_idespcargo
IS 'Índice sobre la(s) columna(s) "idespcargo" para agilizar la búsqueda de información.';

CREATE INDEX fki_programalab_situacionlaboralp_idprogramalaboral ON mod_persona.dat_situacionlaboral
  USING btree (idprogramalaboral);

CREATE INDEX idx_idprocedenciasocial_personaentidad ON mod_persona.dat_personaentidad
  USING btree (idprocedenciasocial);

CREATE INDEX idx_numero_docidentidad ON mod_persona.dat_docidentidad
  USING btree (numero);

COMMENT ON INDEX mod_persona.idx_numero_docidentidad
IS 'Índice sobre la(s) columna(s) "numero" para agilizar la búsqueda de información.';

CREATE INDEX idx_idtipomediocontacto_contacto ON mod_persona.dat_contacto
  USING btree (idtipomediocontacto);

CREATE LOCAL TEMPORARY TABLE dat_situacionlaboral0kvyeh (
  idsituacionlaboralp NUMERIC(19,0),
  idcargo NUMERIC(19,0),
  idsituacion NUMERIC(19,0),
  fdesde DATE,
  fhasta DATE,
  idpersonaentidad NUMERIC(19,0),
  idarea NUMERIC(19,0),
  idtipocontrato NUMERIC(19,0),
  idmotivo NUMERIC(19,0),
  estado NUMERIC(1,0),
  noalta VARCHAR(20),
  principal NUMERIC(1,0),
  idespcargo NUMERIC(19,0),
  ueb NUMERIC(19,0),
  idprogramalaboral NUMERIC(19,0),
  nromn NUMERIC(19,0)
) ;

-- Copy the source table's data to the temporary table

INSERT INTO dat_situacionlaboral0kvyeh (idsituacionlaboralp, idcargo, idsituacion, fdesde, fhasta, idpersonaentidad, idarea, idtipocontrato, idmotivo, estado, noalta, principal, idespcargo, ueb, idprogramalaboral, nromn)
SELECT idsituacionlaboralp, idcargo, idsituacion, fdesde, fhasta, idpersonaentidad, idarea, idtipocontrato, idmotivo, estado, noalta, principal, idespcargo, ueb, idprogramalaboral, nromn FROM mod_persona.dat_situacionlaboral;

-- Drop the source table

DROP TABLE mod_persona.dat_situacionlaboral;

-- Create the destination table

CREATE TABLE mod_persona.dat_situacionlaboral (
  idsituacionlaboralp NUMERIC(19,0) DEFAULT nextval('mod_persona.sec_situacionlaboralp_seq'::regclass) NOT NULL,
  idcargo NUMERIC(19,0),
  idsituacion NUMERIC(19,0) NOT NULL,
  fdesde DATE NOT NULL,
  fhasta DATE,
  idpersonaentidad NUMERIC(19,0) NOT NULL,
  idarea NUMERIC(19,0),
  idtipocontrato NUMERIC(19,0),
  idmotivo NUMERIC(19,0),
  estado NUMERIC(1,0) DEFAULT 0,
  noalta VARCHAR(20),
  principal NUMERIC(1,0) DEFAULT 0 NOT NULL,
  idespcargo NUMERIC(19,0),
  ueb NUMERIC(19,0),
  idprogramalaboral NUMERIC(19,0),
  nromn NUMERIC(19,0),
  CONSTRAINT pk_movimientoestructura PRIMARY KEY(idsituacionlaboralp),
  CONSTRAINT chk_estado_situacionlaboral CHECK ((estado = (0)::numeric) OR (estado = (1)::numeric) OR (estado = (2)::numeric) OR (estado = (3)::numeric)),
  CONSTRAINT chk_principal_situacionlaboral CHECK ((principal = (0)::numeric) OR (principal = (1)::numeric)),
  CONSTRAINT fk_confespcargo_situacionlaboralp_idespcargo FOREIGN KEY (idespcargo)
    REFERENCES mod_rrhhmaestro.conf_espcargo(idespcargo)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
    NOT DEFERRABLE,
  CONSTRAINT fk_personaentidad_situacionlaboralp_idpersonaentidad FOREIGN KEY (idpersonaentidad)
    REFERENCES mod_persona.dat_personaentidad(idpersonaentidad)
    ON DELETE CASCADE
    ON UPDATE CASCADE
    NOT DEFERRABLE,
  CONSTRAINT fk_programalab_situacionlaboralp_idprogramalaboral FOREIGN KEY (idprogramalaboral)
    REFERENCES mod_fuerzatrabajo.nom_programalaboral(idprogramalaboral)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
    NOT DEFERRABLE,
  CONSTRAINT fk_situacionlaboral_situacionlaboralp_idsituacionlaboral FOREIGN KEY (idsituacion)
    REFERENCES mod_persona.nom_situacion(idsituacion)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
    NOT DEFERRABLE,
  CONSTRAINT fk_tipocontrato_situacionlaboralp_idtipocontrato FOREIGN KEY (idtipocontrato)
    REFERENCES mod_fuerzatrabajo.nom_tipocontrato(idtipocontrato)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
    NOT DEFERRABLE
) 
WITH (oids = false);

COMMENT ON TABLE mod_persona.dat_situacionlaboral
IS 'Almacena los movimientos de nómina de la persona.';

COMMENT ON COLUMN mod_persona.dat_situacionlaboral.idsituacionlaboralp
IS 'Identificador de la situación laboral asociada al alta causada por la persona en una entidad determinada.';

COMMENT ON COLUMN mod_persona.dat_situacionlaboral.idcargo
IS 'Identificador del cargo.';

COMMENT ON COLUMN mod_persona.dat_situacionlaboral.idsituacion
IS 'Identificador de la situación.';

COMMENT ON COLUMN mod_persona.dat_situacionlaboral.fdesde
IS 'Fecha de inicio de aplicación del movimiento.';

COMMENT ON COLUMN mod_persona.dat_situacionlaboral.fhasta
IS 'Fecha de fin del movimiento.';

COMMENT ON COLUMN mod_persona.dat_situacionlaboral.idpersonaentidad
IS 'Identificador del alta en la entidad.';

COMMENT ON COLUMN mod_persona.dat_situacionlaboral.idarea
IS 'Identificador del área del cargo.';

COMMENT ON COLUMN mod_persona.dat_situacionlaboral.idtipocontrato
IS 'Identificador del tipo de contrato.';

COMMENT ON COLUMN mod_persona.dat_situacionlaboral.idmotivo
IS 'Identificador del motivo de baja o motivo de movimiento. Identificando al nomenclador según el valor de la columna "estado". 1-Movimiento y 2-Baja.';

COMMENT ON COLUMN mod_persona.dat_situacionlaboral.estado
IS 'Indicador del estado de la situación asociada a la persona e identificador para la obtención de la denominación del nomenclador (nom_motivobaja y nom_motivomovimiento) para 0-Actual, 1-Movimiento, 2-Baja, 3-Cambio de contrato.';

COMMENT ON COLUMN mod_persona.dat_situacionlaboral.noalta
IS 'Número del alta.';

COMMENT ON COLUMN mod_persona.dat_situacionlaboral.principal
IS 'Determina si la situación laboral es la principal de la persona. 0-Secundaria y 1-Principal.';

COMMENT ON COLUMN mod_persona.dat_situacionlaboral.idespcargo
IS 'Identificador de la especialización en el cargo.';

COMMENT ON COLUMN mod_persona.dat_situacionlaboral.ueb
IS 'Identificador de la estrutura que corresponde con la Unidad Empresarial de Base.';

COMMENT ON COLUMN mod_persona.dat_situacionlaboral.idprogramalaboral
IS 'Identificador del programa constructivo.';

COMMENT ON COLUMN mod_persona.dat_situacionlaboral.nromn
IS 'Número que se genera en el movimiento de nómina.';

COMMENT ON CONSTRAINT chk_estado_situacionlaboral ON mod_persona.dat_situacionlaboral
IS 'Restricción sobre la(s) columna(s) "estado".';

COMMENT ON CONSTRAINT chk_principal_situacionlaboral ON mod_persona.dat_situacionlaboral
IS 'Restricción sobre la(s) columna(s) "principal".';

COMMENT ON CONSTRAINT fk_confespcargo_situacionlaboralp_idespcargo ON mod_persona.dat_situacionlaboral
IS 'LLave foránea para identificar la relación y garantizar la integridad referencial entre las tablas. (dat_situacionlaboral y conf_espcargo).';

COMMENT ON CONSTRAINT fk_personaentidad_situacionlaboralp_idpersonaentidad ON mod_persona.dat_situacionlaboral
IS 'LLave foránea para identificar la relación y garantizar la integridad referencial entre las tablas. (dat_situacionlaboral y dat_personaentidad).';

COMMENT ON CONSTRAINT fk_situacionlaboral_situacionlaboralp_idsituacionlaboral ON mod_persona.dat_situacionlaboral
IS 'LLave foránea para identificar la relación y garantizar la integridad referencial entre las tablas. (dat_situacionlaboral y nom_situacion).';

COMMENT ON CONSTRAINT fk_tipocontrato_situacionlaboralp_idtipocontrato ON mod_persona.dat_situacionlaboral
IS 'LLave foránea para identificar la relación y garantizar la integridad referencial entre las tablas. (dat_situacionlaboral y nom_tipocontrato).';

-- Copy the temporary table's data to the destination table

INSERT INTO mod_persona.dat_situacionlaboral (idsituacionlaboralp, idcargo, idsituacion, fdesde, fhasta, idpersonaentidad, idarea, idtipocontrato, idmotivo, estado, noalta, principal, idespcargo, ueb, idprogramalaboral, nromn)
SELECT idsituacionlaboralp, idcargo, idsituacion, fdesde, fhasta, idpersonaentidad, idarea, idtipocontrato, idmotivo, estado, noalta, principal, idespcargo, ueb, idprogramalaboral, nromn FROM dat_situacionlaboral0kvyeh;

-- Create indices, triggers and rules

CREATE INDEX fki_programalab_situacionlaboralp_idprogramalaboral ON mod_persona.dat_situacionlaboral
  USING btree (idprogramalaboral);

CREATE INDEX idx_confespcargo_situacionlaboralp_idespcargo ON mod_persona.dat_situacionlaboral
  USING btree (idespcargo);

COMMENT ON INDEX mod_persona.idx_confespcargo_situacionlaboralp_idespcargo
IS 'Índice sobre la(s) columna(s) "idespcargo" para agilizar la búsqueda de información.';

CREATE INDEX idx_idpersonaentidad_situacionlaboral ON mod_persona.dat_situacionlaboral
  USING btree (idpersonaentidad);

COMMENT ON INDEX mod_persona.idx_idpersonaentidad_situacionlaboral
IS 'Índice sobre la(s) columna(s) "idpersonaentidad" para agilizar la búsqueda de información.';

CREATE INDEX idx_idsituacion_situacionlaboral ON mod_persona.dat_situacionlaboral
  USING btree (idsituacion);

COMMENT ON INDEX mod_persona.idx_idsituacion_situacionlaboral
IS 'Índice sobre la(s) columna(s) "idsituacion" para agilizar la búsqueda de información.';

CREATE INDEX idx_tipocontrato_situacionlaboralp_idtipocontrato ON mod_persona.dat_situacionlaboral
  USING btree (idtipocontrato);

COMMENT ON INDEX mod_persona.idx_tipocontrato_situacionlaboralp_idtipocontrato
IS 'Índice sobre la(s) columna(s) "idtipocontrato" para agilizar la búsqueda de información.';

COMMENT ON CONSTRAINT pk_movimientoestructura ON mod_persona.dat_situacionlaboral
IS 'LLave primaria para identificar la tupla.';

CREATE TRIGGER t_situacionlaboral_trayectoria
  AFTER INSERT OR UPDATE 
  ON mod_persona.dat_situacionlaboral
  
FOR EACH ROW 
  EXECUTE PROCEDURE mod_persona.ft_actualizar_trayectoria();

-- Restore table's permissions

ALTER TABLE mod_persona.dat_situacionlaboral
  OWNER TO zeolides;

GRANT SELECT, INSERT, UPDATE, DELETE, REFERENCES, TRIGGER, TRUNCATE
  ON mod_persona.dat_situacionlaboral TO zeolides;
GRANT SELECT, INSERT, UPDATE, DELETE, REFERENCES, TRIGGER
  ON mod_persona.dat_situacionlaboral TO "PUBLIC";


-- Drop the temporary table

DROP TABLE dat_situacionlaboral0kvyeh;

CREATE TRIGGER t_situacionlaboral_trayectoria
  AFTER INSERT OR UPDATE 
  ON mod_persona.dat_situacionlaboral
  
FOR EACH ROW 
  EXECUTE PROCEDURE mod_persona.ft_actualizar_trayectoria();
/*
ALTER TABLE mod_persona.dat_situacionlaboral
  ADD CONSTRAINT fk_programalab_situacionlaboralp_idprogramalaboral FOREIGN KEY (idprogramalaboral)
    REFERENCES mod_fuerzatrabajo.nom_programalaboral(idprogramalaboral)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
    NOT DEFERRABLE;

ALTER TABLE mod_persona.dat_personaentidad
  ADD CONSTRAINT fk_procedenciasocial_personaentidad FOREIGN KEY (idprocedenciasocial)
    REFERENCES mod_fuerzatrabajo.nom_procedenciasocial(idprocedenciasocial)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
    NOT DEFERRABLE;

COMMENT ON CONSTRAINT fk_procedenciasocial_personaentidad ON mod_persona.dat_personaentidad
IS 'LLave foránea para identificar la relación y garantizar la integridad referencial entre las tablas. (nom_procedenciasocial y dat_personaentidad).';
*/

COMMENT ON CONSTRAINT pk_movimientoestructura ON mod_persona.dat_situacionlaboral
IS 'LLave primaria para identificar la tupla.';

CREATE TRIGGER t_situacionlaboral_trayectoria
  AFTER INSERT OR UPDATE 
  ON mod_persona.dat_situacionlaboral
  
FOR EACH ROW 
  EXECUTE PROCEDURE mod_persona.ft_actualizar_trayectoria();

-- Restore table's permissions

ALTER TABLE mod_persona.dat_situacionlaboral
  OWNER TO zeolides;

GRANT SELECT, INSERT, UPDATE, DELETE, REFERENCES, TRIGGER, TRUNCATE
  ON mod_persona.dat_situacionlaboral TO zeolides;
 
 ----mod_personaext
 /* mod_personaext.sec_areatematicaempresa_seq (Unique Source, Sequences) */
CREATE SEQUENCE mod_personaext.sec_areatematicaempresa_seq
  INCREMENT 1 MINVALUE 1
  MAXVALUE 999999999999999999 START 1
  CACHE 1;

ALTER SEQUENCE mod_personaext.sec_areatematicaempresa_seq RESTART WITH 14;

COMMENT ON SEQUENCE mod_personaext.sec_areatematicaempresa_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "nom_areatematicaempresa".';

/* mod_personaext.sec_aseo_seq (Unique Source, Sequences) */
CREATE SEQUENCE mod_personaext.sec_aseo_seq
  INCREMENT 1 MINVALUE 1
  MAXVALUE 999999999999999999 START 30
  CACHE 1;

ALTER SEQUENCE mod_personaext.sec_aseo_seq RESTART WITH 32;

COMMENT ON SEQUENCE mod_personaext.sec_aseo_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "nom_aseo".';

/* mod_personaext.sec_asignacion_seq (Unique Source, Sequences) */
CREATE SEQUENCE mod_personaext.sec_asignacion_seq
  INCREMENT 1 MINVALUE 1
  MAXVALUE 999999999999999999 START 4
  CACHE 1;

ALTER SEQUENCE mod_personaext.sec_asignacion_seq RESTART WITH 37;

COMMENT ON SEQUENCE mod_personaext.sec_asignacion_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "nom_asignacion".';

/* mod_personaext.sec_asignaciondefensa_seq (Unique Source, Sequences) */
CREATE SEQUENCE mod_personaext.sec_asignaciondefensa_seq
  INCREMENT 1 MINVALUE 0
  MAXVALUE 999999999999999999 START 1
  CACHE 1;

ALTER SEQUENCE mod_personaext.sec_asignaciondefensa_seq RESTART WITH 10;

COMMENT ON SEQUENCE mod_personaext.sec_asignaciondefensa_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "nom_situacexcep".';

/* mod_personaext.sec_canteras_seq (Unique Source, Sequences) */
CREATE SEQUENCE mod_personaext.sec_canteras_seq
  INCREMENT 1 MINVALUE 1
  MAXVALUE 999999999999999999 START 6
  CACHE 1;

ALTER SEQUENCE mod_personaext.sec_canteras_seq RESTART WITH 2;

COMMENT ON SEQUENCE mod_personaext.sec_canteras_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "dat_cantera".';

/* mod_personaext.sec_caracterizacion_seq (Unique Source, Sequences) */
CREATE SEQUENCE mod_personaext.sec_caracterizacion_seq
  INCREMENT 1 MINVALUE 0
  MAXVALUE 9223372036854775807 START 1
  CACHE 1;

COMMENT ON SEQUENCE mod_personaext.sec_caracterizacion_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "dat_caracterizacion".';

/* mod_personaext.sec_cargodefensa_seq (Unique Source, Sequences) */
CREATE SEQUENCE mod_personaext.sec_cargodefensa_seq
  INCREMENT 1 MINVALUE 0
  MAXVALUE 999999999999999999 START 3
  CACHE 1;

ALTER SEQUENCE mod_personaext.sec_cargodefensa_seq RESTART WITH 13;

COMMENT ON SEQUENCE mod_personaext.sec_cargodefensa_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "nom_cargodefensa".';

/* mod_personaext.sec_cargoexcep_seq (Unique Source, Sequences) */
CREATE SEQUENCE mod_personaext.sec_cargoexcep_seq
  INCREMENT 1 MINVALUE 1
  MAXVALUE 9223372036854775807 START 1
  CACHE 1;

ALTER SEQUENCE mod_personaext.sec_cargoexcep_seq RESTART WITH 7;

COMMENT ON SEQUENCE mod_personaext.sec_cargoexcep_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "nom_cargoexcep".';

/* mod_personaext.sec_conftallaje_seq (Unique Source, Sequences) */
CREATE SEQUENCE mod_personaext.sec_conftallaje_seq
  INCREMENT 1 MINVALUE 1
  MAXVALUE 999999999999999999 START 1
  CACHE 1;

ALTER SEQUENCE mod_personaext.sec_conftallaje_seq RESTART WITH 351;

COMMENT ON SEQUENCE mod_personaext.sec_conftallaje_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "conf_tallaje".';

/* mod_personaext.sec_convivencia_seq (Unique Source, Sequences) */
CREATE SEQUENCE mod_personaext.sec_convivencia_seq
  INCREMENT 1 MINVALUE 1
  MAXVALUE 999999 START 19
  CACHE 1;

ALTER SEQUENCE mod_personaext.sec_convivencia_seq RESTART WITH 4;

COMMENT ON SEQUENCE mod_personaext.sec_convivencia_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "nom_convivencia".';

/* mod_personaext.sec_dataseo_seq (Unique Source, Sequences) */
CREATE SEQUENCE mod_personaext.sec_dataseo_seq
  INCREMENT 1 MINVALUE 1
  MAXVALUE 999999999999999999 START 6
  CACHE 1;

ALTER SEQUENCE mod_personaext.sec_dataseo_seq RESTART WITH 2;

COMMENT ON SEQUENCE mod_personaext.sec_dataseo_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "dat_aseo".';

/* mod_personaext.sec_disposicion_seq (Unique Source, Sequences) */
CREATE SEQUENCE mod_personaext.sec_disposicion_seq
  INCREMENT 1 MINVALUE 0
  MAXVALUE 9223372036854775807 START 1
  CACHE 1;

ALTER SEQUENCE mod_personaext.sec_disposicion_seq RESTART WITH 5;

/* mod_personaext.sec_estadovivienda_seq (Unique Source, Sequences) */
CREATE SEQUENCE mod_personaext.sec_estadovivienda_seq
  INCREMENT 1 MINVALUE 0
  MAXVALUE 999999999 START 45
  CACHE 1;

ALTER SEQUENCE mod_personaext.sec_estadovivienda_seq RESTART WITH 5;

COMMENT ON SEQUENCE mod_personaext.sec_estadovivienda_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "nom_estadovivienda".';

/* mod_personaext.sec_estadoviviendap_seq (Unique Source, Sequences) */
CREATE SEQUENCE mod_personaext.sec_estadoviviendap_seq
  INCREMENT 1 MINVALUE 0
  MAXVALUE 999999999999999999 START 1
  CACHE 1;

COMMENT ON SEQUENCE mod_personaext.sec_estadoviviendap_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "dat_estadovivienda".';

/* mod_personaext.sec_estalimentacion_seq (Unique Source, Sequences) */
CREATE SEQUENCE mod_personaext.sec_estalimentacion_seq
  INCREMENT 1 MINVALUE 0
  MAXVALUE 9223372036854775807 START 1
  CACHE 1;

ALTER SEQUENCE mod_personaext.sec_estalimentacion_seq RESTART WITH 16;

COMMENT ON SEQUENCE mod_personaext.sec_estalimentacion_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "nom_estalimentacion".';

/* mod_personaext.sec_estructuraalojamiento_seq (Unique Source, Sequences) */
CREATE SEQUENCE mod_personaext.sec_estructuraalojamiento_seq
  INCREMENT 1 MINVALUE 0
  MAXVALUE 999999999999999999 START 4
  CACHE 1;

ALTER SEQUENCE mod_personaext.sec_estructuraalojamiento_seq RESTART WITH 75;

COMMENT ON SEQUENCE mod_personaext.sec_estructuraalojamiento_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "nom_estructuraalojamiento".';

/* mod_personaext.sec_estructuratransportacion_seq (Unique Source, Sequences) */
CREATE SEQUENCE mod_personaext.sec_estructuratransportacion_seq
  INCREMENT 1 MINVALUE 0
  MAXVALUE 999999999999999999 START 8
  CACHE 1;

ALTER SEQUENCE mod_personaext.sec_estructuratransportacion_seq RESTART WITH 12;

COMMENT ON SEQUENCE mod_personaext.sec_estructuratransportacion_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "nom_estructuratransportacion".';

/* mod_personaext.sec_familiar2_seq (Unique Source, Sequences) */
CREATE SEQUENCE mod_personaext.sec_familiar2_seq
  INCREMENT 1 MINVALUE 0
  MAXVALUE 9223372036854775807 START 1
  CACHE 1;

COMMENT ON SEQUENCE mod_personaext.sec_familiar2_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "dat_familiar2".';

/* mod_personaext.sec_familiarexterior_seq (Unique Source, Sequences) */
CREATE SEQUENCE mod_personaext.sec_familiarexterior_seq
  INCREMENT 1 MINVALUE 1
  MAXVALUE 999999999999999999 START 1
  CACHE 1;

ALTER SEQUENCE mod_personaext.sec_familiarexterior_seq RESTART WITH 2;

COMMENT ON SEQUENCE mod_personaext.sec_familiarexterior_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "dat_familiarexterior".';

/* mod_personaext.sec_familiarresidente_seq (Unique Source, Sequences) */
CREATE SEQUENCE mod_personaext.sec_familiarresidente_seq
  INCREMENT 1 MINVALUE 1
  MAXVALUE 999999999999999999 START 1
  CACHE 1;

ALTER SEQUENCE mod_personaext.sec_familiarresidente_seq RESTART WITH 2;

COMMENT ON SEQUENCE mod_personaext.sec_familiarresidente_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "dat_familiarresidente".';

/* mod_personaext.sec_familiarsancionado_seq (Unique Source, Sequences) */
CREATE SEQUENCE mod_personaext.sec_familiarsancionado_seq
  INCREMENT 1 MINVALUE 1
  MAXVALUE 999999999999999999 START 1
  CACHE 1;

ALTER SEQUENCE mod_personaext.sec_familiarsancionado_seq RESTART WITH 2;

COMMENT ON SEQUENCE mod_personaext.sec_familiarsancionado_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "dat_familiarsancionado".';

/* mod_personaext.sec_familiarviaje_seq (Unique Source, Sequences) */
CREATE SEQUENCE mod_personaext.sec_familiarviaje_seq
  INCREMENT 1 MINVALUE 1
  MAXVALUE 999999999999999999 START 1
  CACHE 1;

ALTER SEQUENCE mod_personaext.sec_familiarviaje_seq RESTART WITH 2;

COMMENT ON SEQUENCE mod_personaext.sec_familiarviaje_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "dat_familiarviaje".';

/* mod_personaext.sec_huella_seq (Unique Source, Sequences) */
CREATE SEQUENCE mod_personaext.sec_huella_seq
  INCREMENT 1 MINVALUE 0
  MAXVALUE 999999999999999999 START 1161
  CACHE 1;

ALTER SEQUENCE mod_personaext.sec_huella_seq RESTART WITH 1;

COMMENT ON SEQUENCE mod_personaext.sec_huella_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "dat_huella".';

/* mod_personaext.sec_ingreso_seq (Unique Source, Sequences) */
CREATE SEQUENCE mod_personaext.sec_ingreso_seq
  INCREMENT 1 MINVALUE 0
  MAXVALUE 9223372036854775807 START 1
  CACHE 1;

COMMENT ON SEQUENCE mod_personaext.sec_ingreso_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "dat_ingreso".';

/* mod_personaext.sec_jefefacultado_seq (Unique Source, Sequences) */
CREATE SEQUENCE mod_personaext.sec_jefefacultado_seq
  INCREMENT 1 MINVALUE 0
  MAXVALUE 999999999999999999 START 418
  CACHE 1;

ALTER SEQUENCE mod_personaext.sec_jefefacultado_seq RESTART WITH 1;

COMMENT ON SEQUENCE mod_personaext.sec_jefefacultado_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "nom_jefefacultado".';

/* mod_personaext.sec_jefesfacultados_seq (Unique Source, Sequences) */
CREATE SEQUENCE mod_personaext.sec_jefesfacultados_seq
  INCREMENT 1 MINVALUE 1
  MAXVALUE 999999999999999999 START 5
  CACHE 1;

ALTER SEQUENCE mod_personaext.sec_jefesfacultados_seq RESTART WITH 10;

COMMENT ON SEQUENCE mod_personaext.sec_jefesfacultados_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "nom_jefesfacultados".';

/* mod_personaext.sec_medios_seq (Unique Source, Sequences) */
CREATE SEQUENCE mod_personaext.sec_medios_seq
  INCREMENT 1 MINVALUE 1
  MAXVALUE 999999999999999999 START 1
  CACHE 1;

ALTER SEQUENCE mod_personaext.sec_medios_seq RESTART WITH 11;

COMMENT ON SEQUENCE mod_personaext.sec_medios_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "nom_mediopersona".';

/* mod_personaext.sec_niveleducacionalp_seq (Unique Source, Sequences) */
CREATE SEQUENCE mod_personaext.sec_niveleducacionalp_seq
  INCREMENT 1 MINVALUE 1
  MAXVALUE 999999999999999999 START 1
  CACHE 1;

ALTER SEQUENCE mod_personaext.sec_niveleducacionalp_seq RESTART WITH 2;

COMMENT ON SEQUENCE mod_personaext.sec_niveleducacionalp_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "dat_niveleducacional".';

/* mod_personaext.sec_nomdedo_seq (Unique Source, Sequences) */
CREATE SEQUENCE mod_personaext.sec_nomdedo_seq
  INCREMENT 1 MINVALUE 1
  MAXVALUE 9999999999 START 10
  CACHE 1;

ALTER SEQUENCE mod_personaext.sec_nomdedo_seq RESTART WITH 11;

COMMENT ON SEQUENCE mod_personaext.sec_nomdedo_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "nom_dedo".';

/* mod_personaext.sec_obra_seq (Unique Source, Sequences) */
CREATE SEQUENCE mod_personaext.sec_obra_seq
  INCREMENT 1 MINVALUE 1
  MAXVALUE 999999999999999999 START 32
  CACHE 1;

ALTER SEQUENCE mod_personaext.sec_obra_seq RESTART WITH 2;

COMMENT ON SEQUENCE mod_personaext.sec_obra_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "dat_obra".';

/* mod_personaext.sec_observacion_seq (Unique Source, Sequences) */
CREATE SEQUENCE mod_personaext.sec_observacion_seq
  INCREMENT 1 MINVALUE 0
  MAXVALUE 999999999999999999 START 58038
  CACHE 1;

ALTER SEQUENCE mod_personaext.sec_observacion_seq RESTART WITH 1;

COMMENT ON SEQUENCE mod_personaext.sec_observacion_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "dat_observacion".';

/* mod_personaext.sec_ocupaciontiempoguerra_seq (Unique Source, Sequences) */
CREATE SEQUENCE mod_personaext.sec_ocupaciontiempoguerra_seq
  INCREMENT 1 MINVALUE 1
  MAXVALUE 999999999999999999 START 1
  CACHE 1;

ALTER SEQUENCE mod_personaext.sec_ocupaciontiempoguerra_seq RESTART WITH 2;

COMMENT ON SEQUENCE mod_personaext.sec_ocupaciontiempoguerra_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "dat_ocupaciontiempoguerra".';

/* mod_personaext.sec_personaareatematicaempresa_seq (Unique Source, Sequences) */
CREATE SEQUENCE mod_personaext.sec_personaareatematicaempresa_seq
  INCREMENT 1 MINVALUE 1
  MAXVALUE 999999999999999999 START 1
  CACHE 1;

ALTER SEQUENCE mod_personaext.sec_personaareatematicaempresa_seq RESTART WITH 2;

COMMENT ON SEQUENCE mod_personaext.sec_personaareatematicaempresa_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "dat_personaareatematicaempresa".';

/* mod_personaext.sec_personamedio_seq (Unique Source, Sequences) */
CREATE SEQUENCE mod_personaext.sec_personamedio_seq
  INCREMENT 1 MINVALUE 1
  MAXVALUE 999999999999999999 START 20074
  CACHE 1;

ALTER SEQUENCE mod_personaext.sec_personamedio_seq RESTART WITH 2;

COMMENT ON SEQUENCE mod_personaext.sec_personamedio_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "dat_personamedio".';

/* mod_personaext.sec_programaconstructivo_seq (Unique Source, Sequences) */
CREATE SEQUENCE mod_personaext.sec_programaconstructivo_seq
  INCREMENT 1 MINVALUE 0
  MAXVALUE 9223372036854775807 START 37
  CACHE 1;

ALTER SEQUENCE mod_personaext.sec_programaconstructivo_seq RESTART WITH 4;

COMMENT ON SEQUENCE mod_personaext.sec_programaconstructivo_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "nom_programaconstructivo".';

/* mod_personaext.sec_reclamacion_seq (Unique Source, Sequences) */
CREATE SEQUENCE mod_personaext.sec_reclamacion_seq
  INCREMENT 1 MINVALUE 1
  MAXVALUE 999999 START 3
  CACHE 1;

ALTER SEQUENCE mod_personaext.sec_reclamacion_seq RESTART WITH 2;

COMMENT ON SEQUENCE mod_personaext.sec_reclamacion_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "dat_reclamacion".';

/* mod_personaext.sec_sitexcepcional_seq (Unique Source, Sequences) */
CREATE SEQUENCE mod_personaext.sec_sitexcepcional_seq
  INCREMENT 1 MINVALUE 0
  MAXVALUE 9223372036854775807 START 1
  CACHE 1;

ALTER SEQUENCE mod_personaext.sec_sitexcepcional_seq RESTART WITH 4;

COMMENT ON SEQUENCE mod_personaext.sec_sitexcepcional_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "dat_sitexcepcional".';

/* mod_personaext.sec_situaciondefensa_seq (Unique Source, Sequences) */
CREATE SEQUENCE mod_personaext.sec_situaciondefensa_seq
  INCREMENT 1 MINVALUE 0
  MAXVALUE 999999999999999999 START 5
  CACHE 1;

ALTER SEQUENCE mod_personaext.sec_situaciondefensa_seq RESTART WITH 1;

COMMENT ON SEQUENCE mod_personaext.sec_situaciondefensa_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "dat_situaciondefensa".';

/* mod_personaext.sec_tipoingreso_seq (Unique Source, Sequences) */
CREATE SEQUENCE mod_personaext.sec_tipoingreso_seq
  INCREMENT 1 MINVALUE 0
  MAXVALUE 9223372036854775807 START 1
  CACHE 1;

ALTER SEQUENCE mod_personaext.sec_tipoingreso_seq RESTART WITH 3;

COMMENT ON SEQUENCE mod_personaext.sec_tipoingreso_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "nom_tipoingreso".';

/* mod_personaext.sec_trayectoriacargo_seq (Unique Source, Sequences) */
CREATE SEQUENCE mod_personaext.sec_trayectoriacargo_seq
  INCREMENT 1 MINVALUE 0
  MAXVALUE 9223372036854775807 START 1
  CACHE 1;

/* mod_personaext.sec_trayectoriaentidad_seq (Unique Source, Sequences) */
CREATE SEQUENCE mod_personaext.sec_trayectoriaentidad_seq
  INCREMENT 1 MINVALUE 0
  MAXVALUE 9223372036854775807 START 1
  CACHE 1;

/* mod_personaext.sec_trayectorialaboral_seq (Unique Source, Sequences) */
CREATE SEQUENCE mod_personaext.sec_trayectorialaboral_seq
  INCREMENT 1 MINVALUE 0
  MAXVALUE 9223372036854775807 START 711767
  CACHE 1;

ALTER SEQUENCE mod_personaext.sec_trayectorialaboral_seq RESTART WITH 8;

COMMENT ON SEQUENCE mod_personaext.sec_trayectorialaboral_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "his_trayectorialaboral".';

/* mod_personaext.dat_servtransportacion.idx_idestructura_servtransportacion (Different, Indices) */
/* Different properties: Fields, Not Null */
DROP INDEX mod_personaext.idx_idestructura_servtransportacion;

/* mod_personaext.dat_servalojamiento.idx_idestructura_servalojamiento (Different, Indices) */
/* Different properties: Fields, Not Null */
DROP INDEX mod_personaext.idx_idestructura_servalojamiento;

/* mod_personaext.dat_servalimentacion.idx_idestructura_servalimentacion (Different, Indices) */
/* Different properties: Fields, Not Null */
DROP INDEX mod_personaext.idx_idestructura_servalimentacion;

/* mod_personaext.dat_familiar.fki_parentesco_familiar_idparentesco (Unique Target, Indices) */
DROP INDEX mod_personaext.fki_parentesco_familiar_idparentesco;

/* mod_personaext.td_conceptovivienda (Unique Source, Composite Types) */
CREATE TYPE mod_personaext.td_conceptovivienda AS (
  grafica INTEGER,
  ueb NUMERIC,
  denom_ueb VARCHAR,
  idestadovivienda NUMERIC,
  denom_ev VARCHAR,
  idconvivencia NUMERIC,
  denom_cv VARCHAR,
  cant INTEGER,
  idpersona NUMERIC
);

/* mod_personaext.ft_estructuraalojamiento_insertar (Unique Source, Functions) */
CREATE OR REPLACE FUNCTION mod_personaext.ft_estructuraalojamiento_insertar (
)
RETURNS trigger AS
$body$
BEGIN
    SET search_path = mod_persona;
    IF  (NEW.idpadre is null)THEN
    	 NEW.idpadre:= NEW.idestructuraalojamiento;
    END IF;    
RETURN NEW;
END;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
PARALLEL UNSAFE
COST 10;

/* mod_personaext.ft_estructuratransportacion_insertar (Unique Source, Functions) */
CREATE OR REPLACE FUNCTION mod_personaext.ft_estructuratransportacion_insertar (
)
RETURNS trigger AS
$body$
BEGIN
    SET search_path = mod_persona;
    IF  (NEW.idpadre is null)THEN
    	 NEW.idpadre:= NEW.idestructuratransportacion;
    END IF;    
RETURN NEW;
END;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
PARALLEL UNSAFE
COST 10;

/* mod_personaext.sec_afeccion_seq (Different, Sequences) */
/* Different properties: Description */
COMMENT ON SEQUENCE mod_personaext.sec_afeccion_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "dat_afeccion".';

/* mod_personaext.sec_afiliacion_seq (Different, Sequences) */
/* Different properties: Description */
COMMENT ON SEQUENCE mod_personaext.sec_afiliacion_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "dat_afiliacion".';

/* mod_personaext.sec_aptitudfisica_seq (Different, Sequences) */
/* Different properties: Description */
COMMENT ON SEQUENCE mod_personaext.sec_aptitudfisica_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "nom_aptitudfisica".';

/* mod_personaext.sec_caracteristicasocial_seq (Different, Sequences) */
/* Different properties: Description */
COMMENT ON SEQUENCE mod_personaext.sec_caracteristicasocial_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "dat_caracteristicasocial".';

/* mod_personaext.sec_cargoorganizacion_seq (Different, Sequences) */
/* Different properties: Description */
COMMENT ON SEQUENCE mod_personaext.sec_cargoorganizacion_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "nom_cargoorganizacion".';

/* mod_personaext.sec_cargoorganizacionp_seq (Different, Sequences) */
/* Different properties: Description */
COMMENT ON SEQUENCE mod_personaext.sec_cargoorganizacionp_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "dat_cargoorganizacion".';

/* mod_personaext.sec_categoria_seq (Different, Sequences) */
/* Different properties: Description */
COMMENT ON SEQUENCE mod_personaext.sec_categoria_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "nom_categoria".';

/* mod_personaext.sec_categoriap_seq (Different, Sequences) */
/* Different properties: Description */
COMMENT ON SEQUENCE mod_personaext.sec_categoriap_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "dat_categoria".';

/* mod_personaext.sec_categoriapersona_seq (Different, Sequences) */
/* Different properties: Description */
COMMENT ON SEQUENCE mod_personaext.sec_categoriapersona_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "nom_categoriapersona".';

/* mod_personaext.sec_categorizacion_seq (Different, Sequences) */
/* Different properties: Description */
COMMENT ON SEQUENCE mod_personaext.sec_categorizacion_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "dat_categorizacion".';

/* mod_personaext.sec_causalimitacion_seq (Different, Sequences) */
/* Different properties: Description */
COMMENT ON SEQUENCE mod_personaext.sec_causalimitacion_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "nom_causalimitacion".';

/* mod_personaext.sec_centroestudio_seq (Different, Sequences) */
/* Different properties: Description */
COMMENT ON SEQUENCE mod_personaext.sec_centroestudio_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "nom_centroestudio".';

/* mod_personaext.sec_condecoracion_seq (Different, Sequences) */
/* Different properties: Description */
COMMENT ON SEQUENCE mod_personaext.sec_condecoracion_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "nom_condecoracion".';

/* mod_personaext.sec_condecoracionp_seq (Different, Sequences) */
/* Different properties: Description */
COMMENT ON SEQUENCE mod_personaext.sec_condecoracionp_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "dat_condecoracion".';

/* mod_personaext.sec_cuentabancaria_seq (Different, Sequences) */
/* Different properties: Description */
COMMENT ON SEQUENCE mod_personaext.sec_cuentabancaria_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "dat_cuentabancaria".';

/* mod_personaext.sec_curso_seq (Different, Sequences) */
/* Different properties: Description */
COMMENT ON SEQUENCE mod_personaext.sec_curso_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "nom_curso".';

/* mod_personaext.sec_datidioma_seq (Different, Sequences) */
/* Different properties: Description */
COMMENT ON SEQUENCE mod_personaext.sec_datidioma_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "dat_idioma".';

/* mod_personaext.sec_educacion_seq (Different, Sequences) */
/* Different properties: Description */
COMMENT ON SEQUENCE mod_personaext.sec_educacion_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "dat_educacion".';

/* mod_personaext.sec_estadocivil_seq (Different, Sequences) */
/* Different properties: Description */
COMMENT ON SEQUENCE mod_personaext.sec_estadocivil_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "nom_estadocivil".';

/* mod_personaext.sec_estadosalud_seq (Different, Sequences) */
/* Different properties: Description */
COMMENT ON SEQUENCE mod_personaext.sec_estadosalud_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "dat_estadosalud".';

/* mod_personaext.sec_estanciaexterior_seq (Different, Sequences) */
/* Different properties: Description */
COMMENT ON SEQUENCE mod_personaext.sec_estanciaexterior_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "dat_estanciaexterior".';

/* mod_personaext.sec_estratificacionsocial_seq (Different, Sequences) */
/* Different properties: Description */
COMMENT ON SEQUENCE mod_personaext.sec_estratificacionsocial_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "nom_estratificacionsocial".';

/* mod_personaext.sec_eventoalimentacion_seq (Different, Sequences) */
/* Different properties: Description */
COMMENT ON SEQUENCE mod_personaext.sec_eventoalimentacion_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "nom_eventoalimentacion".';

/* mod_personaext.sec_facultadestudio_seq (Different, Sequences) */
/* Different properties: Description */
COMMENT ON SEQUENCE mod_personaext.sec_facultadestudio_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "nom_facultadestudio".';

/* mod_personaext.sec_familiar_seq (Different, Sequences) */
/* Different properties: Description */
COMMENT ON SEQUENCE mod_personaext.sec_familiar_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "dat_familiar".';

/* mod_personaext.sec_formaadquiriridioma_seq (Different, Sequences) */
/* Different properties: Description */
COMMENT ON SEQUENCE mod_personaext.sec_formaadquiriridioma_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "nom_formaadquiriridioma".';

/* mod_personaext.sec_gradomilitar_seq (Different, Sequences) */
/* Different properties: Description */
COMMENT ON SEQUENCE mod_personaext.sec_gradomilitar_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "dat_gradomilitar".';

/* mod_personaext.sec_idioma_seq (Different, Sequences) */
/* Different properties: Description */
COMMENT ON SEQUENCE mod_personaext.sec_idioma_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "nom_idioma".';

/* mod_personaext.sec_limitacion_seq (Different, Sequences) */
/* Different properties: Description */
COMMENT ON SEQUENCE mod_personaext.sec_limitacion_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "dat_limitacion".';

/* mod_personaext.sec_mision_seq (Different, Sequences) */
/* Different properties: Description */
COMMENT ON SEQUENCE mod_personaext.sec_mision_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "nom_mision".';

/* mod_personaext.sec_modoformacion_seq (Different, Sequences) */
/* Different properties: Description */
COMMENT ON SEQUENCE mod_personaext.sec_modoformacion_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "nom_modoformacion".';

/* mod_personaext.sec_motivocondecoracion_seq (Different, Sequences) */
/* Different properties: Description */
COMMENT ON SEQUENCE mod_personaext.sec_motivocondecoracion_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "nom_motivocondecoracion".';

/* mod_personaext.sec_motivosancion_seq (Different, Sequences) */
/* Different properties: Description */
COMMENT ON SEQUENCE mod_personaext.sec_motivosancion_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "nom_motivosancion".';

/* mod_personaext.sec_niveleducacional_seq (Different, Sequences) */
/* Different properties: Description */
COMMENT ON SEQUENCE mod_personaext.sec_niveleducacional_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "nom_niveleducacional".';

/* mod_personaext.sec_nivelorganizacion_seq (Different, Sequences) */
/* Different properties: Description */
COMMENT ON SEQUENCE mod_personaext.sec_nivelorganizacion_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "nom_nivelorganizacion".';

/* mod_personaext.sec_norma_seq (Different, Sequences) */
/* Different properties: Description */
COMMENT ON SEQUENCE mod_personaext.sec_norma_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "nom_norma".';

/* mod_personaext.sec_organizacion_seq (Different, Sequences) */
/* Different properties: Description */
COMMENT ON SEQUENCE mod_personaext.sec_organizacion_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "nom_organizacion".';

/* mod_personaext.sec_padecimiento_seq (Different, Sequences) */
/* Different properties: Description */
COMMENT ON SEQUENCE mod_personaext.sec_padecimiento_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "nom_padecimiento".';

/* mod_personaext.sec_parentesco_seq (Different, Sequences) */
/* Different properties: Description */
COMMENT ON SEQUENCE mod_personaext.sec_parentesco_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "nom_parentesco".';

/* mod_personaext.sec_personaregimen_seq (Different, Sequences) */
/* Different properties: Description */
COMMENT ON SEQUENCE mod_personaext.sec_personaregimen_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "dat_regimentrabajo".';

/* mod_personaext.sec_prenda_seq (Different, Sequences) */
/* Different properties: Description */
COMMENT ON SEQUENCE mod_personaext.sec_prenda_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "nom_prenda".';

/* mod_personaext.sec_sancion_seq (Different, Sequences) */
/* Different properties: Description */
COMMENT ON SEQUENCE mod_personaext.sec_sancion_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "nom_sancion".';

/* mod_personaext.sec_sancionp_seq (Different, Sequences) */
/* Different properties: Description */
COMMENT ON SEQUENCE mod_personaext.sec_sancionp_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "dat_sancion".';

/* mod_personaext.sec_servalimentacion_seq (Different, Sequences) */
/* Different properties: Description */
COMMENT ON SEQUENCE mod_personaext.sec_servalimentacion_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "dat_servalimentacion".';

/* mod_personaext.sec_servalojamiento_seq (Different, Sequences) */
/* Different properties: Description */
COMMENT ON SEQUENCE mod_personaext.sec_servalojamiento_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "dat_servalojamiento".';

/* mod_personaext.sec_servtransportacion_seq (Different, Sequences) */
/* Different properties: Description */
COMMENT ON SEQUENCE mod_personaext.sec_servtransportacion_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "dat_servtransportacion".';

/* mod_personaext.sec_talla_seq (Different, Sequences) */
/* Different properties: Description */
COMMENT ON SEQUENCE mod_personaext.sec_talla_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "nom_talla".';

/* mod_personaext.sec_tallaje_seq (Different, Sequences) */
/* Different properties: Description */
COMMENT ON SEQUENCE mod_personaext.sec_tallaje_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "dat_tallaje".';

/* mod_personaext.sec_tipocategoria_seq (Different, Sequences) */
/* Different properties: Description */
COMMENT ON SEQUENCE mod_personaext.sec_tipocategoria_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "nom_tipocategoria".';

/* mod_personaext.sec_tipocentroestudio_seq (Different, Sequences) */
/* Different properties: Description */
COMMENT ON SEQUENCE mod_personaext.sec_tipocentroestudio_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "nom_tipocentroestudio".';

/* mod_personaext.sec_tipocondecoracion_seq (Different, Sequences) */
/* Different properties: Description */
COMMENT ON SEQUENCE mod_personaext.sec_tipocondecoracion_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "nom_tipocondecoracion".';

/* mod_personaext.sec_tipocuentabancaria_seq (Different, Sequences) */
/* Different properties: Description */
COMMENT ON SEQUENCE mod_personaext.sec_tipocuentabancaria_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "nom_tipocuentabancaria".';

/* mod_personaext.sec_tipoestanciaexterior_seq (Different, Sequences) */
/* Different properties: Description */
COMMENT ON SEQUENCE mod_personaext.sec_tipoestanciaexterior_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "nom_tipoestanciaexterior".';

/* mod_personaext.sec_tipoformacion_seq (Different, Sequences) */
/* Different properties: Description */
COMMENT ON SEQUENCE mod_personaext.sec_tipoformacion_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "nom_tipoformacion".';

/* mod_personaext.sec_tipomision_seq (Different, Sequences) */
/* Different properties: Description */
COMMENT ON SEQUENCE mod_personaext.sec_tipomision_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "nom_tipomision".';

/* mod_personaext.sec_tipoorganizacion_seq (Different, Sequences) */
/* Different properties: Description */
COMMENT ON SEQUENCE mod_personaext.sec_tipoorganizacion_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "nom_tipoorganizacion".';

/* mod_personaext.sec_tiposancion_seq (Different, Sequences) */
/* Different properties: Description */
COMMENT ON SEQUENCE mod_personaext.sec_tiposancion_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "nom_tiposancion".';

/* mod_personaext.sec_titulo_seq (Different, Sequences) */
/* Different properties: Description */
COMMENT ON SEQUENCE mod_personaext.sec_titulo_seq
IS ' Secuencia empleada para autogenerar el identificador de la tabla "nom_titulo".';

/* mod_personaext.nom_tipoacreditacionsalario (Unique Source, Tables) */
CREATE TABLE mod_personaext.nom_tipoacreditacionsalario (
  idtipoacreditacionsalario NUMERIC(3,0) NOT NULL,
  abreviatura VARCHAR(100) NOT NULL,
  descripcion VARCHAR(255),
  gestion NUMERIC(1,0) DEFAULT 1,
  CONSTRAINT pk_tipoacreditacionsalario PRIMARY KEY(idtipoacreditacionsalario),
  CONSTRAINT chk_gestion_tipoacreditacionsalario CHECK ((gestion = (0)::numeric) OR (gestion = (1)::numeric))
) 
WITH (oids = false);

/* mod_personaext.f_ueb_conceptovivienda (Unique Source, Functions) */
CREATE OR REPLACE FUNCTION mod_personaext.f_ueb_conceptovivienda (
  a_idestructura numeric [],
  graf integer
)
RETURNS SETOF mod_personaext.td_conceptovivienda AS
$body$
DECLARE
v_rec mod_personaext.td_conceptovivienda;
v_res record;
v_estado record;
v_convivencia record;
v_i numeric = 1;
BEGIN
for v_i in 1 .. array_length($1, 1)
   loop
       IF ($2=1) THEN
	--convivencia
	for v_res in (SELECT CASE WHEN (sl.ueb = $1[v_i]) 
					THEN count(dev.idpersona) 
					ELSE 0
					END as cantpers,
					dev.idpersona,
				 ncv.idconvivencia,
				 ncv.denominacion
			  FROM mod_personaext.nom_convivencia as ncv
			  LEFT JOIN mod_personaext.dat_estadovivienda as dev using(idconvivencia)
			  LEFT JOIN mod_persona.dat_personaentidad as pe using(idpersona)
			  LEFT JOIN mod_persona.dat_situacionlaboral as sl using(idpersonaentidad)
			  GROUP BY sl.ueb,ncv.idconvivencia,dev.idpersona)
	    loop
		    	v_rec.grafica = $2;
			v_rec.ueb = $1[v_i];
			v_rec.idconvivencia = v_res.idconvivencia;
			v_rec.denom_cv = v_res.denominacion;
			v_rec.cant = v_res.cantpers;
			v_rec.idpersona=v_res.idpersona;
			return next v_rec;

	    end loop;
       ELSIF($2=2) THEN
	--estado
	    for v_res in (SELECT CASE WHEN (sl.ueb = $1[v_i]) 
					THEN count(dev.idpersona) 
					ELSE 0
					END as cantpers,
dev.idpersona,
				 nev.idestadovivienda,
				 nev.denominacion
			  FROM mod_personaext.nom_estadovivienda as nev
			  LEFT JOIN mod_personaext.dat_estadovivienda as dev using(idestadovivienda)
			  LEFT JOIN mod_persona.dat_personaentidad as pe using(idpersona)
			  LEFT JOIN mod_persona.dat_situacionlaboral as sl using(idpersonaentidad)
			  GROUP BY sl.ueb,nev.idestadovivienda,dev.idpersona)
	    loop
		    	v_rec.grafica = $2;
			v_rec.ueb = $1[v_i];
			v_rec.idestadovivienda = v_res.idestadovivienda;
			v_rec.denom_ev = v_res.denominacion;
			v_rec.cant = v_res.cantpers;
			v_rec.idpersona=v_res.idpersona;
			return next v_rec;

	    end loop;
       ELSE
	--las dos
	RAISE NOTICE 'las dos: %',$2;
	END IF;
   end loop;     
END;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
PARALLEL UNSAFE
COST 100 ROWS 1000;

COMMENT ON FUNCTION mod_personaext.f_ueb_conceptovivienda(a_idestructura numeric [], graf integer)
IS 'SELECT * FROM mod_reportessiac.f_entidades_arrayid( ''{101,102,103,104,106,1013}''::numeric[]);';

/* mod_personaext.nom_aptitudfisica.gestion (Unique Source, Fields) */
ALTER TABLE mod_personaext.nom_aptitudfisica
  ADD COLUMN gestion NUMERIC(1,0) DEFAULT 1;

/* mod_personaext.nom_aptitudfisica.abreviatura (Unique Source, Fields) */
ALTER TABLE mod_personaext.nom_aptitudfisica
  ADD COLUMN abreviatura VARCHAR(5);

COMMENT ON COLUMN mod_personaext.nom_aptitudfisica.abreviatura
IS 'Abreviatura de la aptitud física';

/* mod_personaext.nom_areatematicaempresa (Unique Source, Tables) */
CREATE TABLE mod_personaext.nom_areatematicaempresa (
  idareatematicaempresa NUMERIC(19,0) DEFAULT nextval('mod_personaext.sec_areatematicaempresa_seq'::regclass) NOT NULL,
  denominacion VARCHAR(255) NOT NULL,
  descripcion VARCHAR(500) DEFAULT 'Sin descripción.'::character varying,
  fdesde DATE DEFAULT now() NOT NULL,
  fhasta DATE,
  gestion NUMERIC(1,0) DEFAULT 1,
  abreviatura VARCHAR(60),
  CONSTRAINT pk_areatematicaempresa PRIMARY KEY(idareatematicaempresa),
  CONSTRAINT chk_gestion_areatematicaempresa CHECK ((gestion = (0)::numeric) OR (gestion = (1)::numeric))
) 
WITH (oids = false);

COMMENT ON TABLE mod_personaext.nom_areatematicaempresa
IS 'Almacena los cargos válidos para emplearlos en las organizaciones.';

COMMENT ON COLUMN mod_personaext.nom_areatematicaempresa.idareatematicaempresa
IS 'Identificador del area.';

COMMENT ON COLUMN mod_personaext.nom_areatematicaempresa.denominacion
IS 'Denominación del area.';

COMMENT ON COLUMN mod_personaext.nom_areatematicaempresa.descripcion
IS 'Descripción del area.';

COMMENT ON COLUMN mod_personaext.nom_areatematicaempresa.fdesde
IS 'Fecha de entrada en vigor del valor nomenclado.';

COMMENT ON COLUMN mod_personaext.nom_areatematicaempresa.fhasta
IS 'Fecha en que concluye la vigencia del valor nomenclado.';

COMMENT ON CONSTRAINT pk_areatematicaempresa ON mod_personaext.nom_areatematicaempresa
IS 'LLave primaria para identificar la tupla.';

/* mod_personaext.nom_aseo (Unique Source, Tables) */
CREATE TABLE mod_personaext.nom_aseo (
  idaseo NUMERIC(19,0) DEFAULT nextval('mod_personaext.sec_aseo_seq'::regclass) NOT NULL,
  denominacion VARCHAR(255) NOT NULL,
  descripcion VARCHAR(500) DEFAULT 'Sin descripción.'::character varying,
  fdesde DATE DEFAULT now() NOT NULL,
  fhasta DATE,
  gestion NUMERIC(1,0) DEFAULT 1,
  abreviatura VARCHAR(5),
  CONSTRAINT pk_aseo PRIMARY KEY(idaseo),
  CONSTRAINT chk_gestion_aseo CHECK ((gestion = (0)::numeric) OR (gestion = (1)::numeric))
) 
WITH (oids = false);

COMMENT ON TABLE mod_personaext.nom_aseo
IS 'Almacena la condición natural o la capacidad que poseen los seres humanos para hacer cualquier actividad física.';

COMMENT ON COLUMN mod_personaext.nom_aseo.idaseo
IS 'Identificador del aseo.';

COMMENT ON COLUMN mod_personaext.nom_aseo.denominacion
IS 'Denominación del aseo.';

COMMENT ON COLUMN mod_personaext.nom_aseo.descripcion
IS 'Descripción del aseo.';

COMMENT ON COLUMN mod_personaext.nom_aseo.fdesde
IS 'Fecha de entrada en vigor del valor nomenclado.';

COMMENT ON COLUMN mod_personaext.nom_aseo.fhasta
IS 'Fecha en que concluye la vigencia del valor nomenclado.';

COMMENT ON COLUMN mod_personaext.nom_aseo.abreviatura
IS 'Abreviatura del aseo';

COMMENT ON CONSTRAINT pk_aseo ON mod_personaext.nom_aseo
IS 'LLave primaria para identificar la tupla.';

/* mod_personaext.nom_asignacion (Unique Source, Tables) */
CREATE TABLE mod_personaext.nom_asignacion (
  idasignacion NUMERIC(19,0) DEFAULT nextval('mod_personaext.sec_asignacion_seq'::regclass) NOT NULL,
  denominacion VARCHAR(100) NOT NULL,
  descripcion VARCHAR(500),
  fdesde DATE DEFAULT now() NOT NULL,
  fhasta DATE,
  gestion NUMERIC(1,0) DEFAULT 1,
  abreviatura VARCHAR(5),
  CONSTRAINT pk_asignacion PRIMARY KEY(idasignacion),
  CONSTRAINT chk_gestion_asignacion CHECK ((gestion = (0)::numeric) OR (gestion = (1)::numeric))
) 
WITH (oids = false);

COMMENT ON TABLE mod_personaext.nom_asignacion
IS 'Almacena las diferentes asignaciones de medios de una persona.';

COMMENT ON COLUMN mod_personaext.nom_asignacion.idasignacion
IS 'Identificador de la tabla.';

COMMENT ON COLUMN mod_personaext.nom_asignacion.denominacion
IS 'Denominación de la asignación.';

COMMENT ON COLUMN mod_personaext.nom_asignacion.descripcion
IS 'Descripción de la asignación.';

COMMENT ON COLUMN mod_personaext.nom_asignacion.fdesde
IS 'Fecha de registro en el sistema o a partir de la cual se habilitará el valor en el nomenclador.';

COMMENT ON COLUMN mod_personaext.nom_asignacion.fhasta
IS 'Fecha de caducidad del valor en el nomenclador, a partir de la cual no podrá asignarse el valor en cuestión del concepto. Sin embargo debe poder brindar la información cuando se recupere el histórico.';

COMMENT ON COLUMN mod_personaext.nom_asignacion.abreviatura
IS 'Abreviatura de la asignación';

COMMENT ON CONSTRAINT pk_asignacion ON mod_personaext.nom_asignacion
IS 'LLave primaria para la identificar la tupla.';

/* mod_personaext.nom_asignaciondefensa (Unique Source, Tables) */
CREATE TABLE mod_personaext.nom_asignaciondefensa (
  idasignaciondefensa NUMERIC(19,0) DEFAULT nextval('mod_personaext.sec_asignaciondefensa_seq'::regclass) NOT NULL,
  denominacion VARCHAR(255) NOT NULL,
  descripcion VARCHAR(500) DEFAULT 'Sin descripción.'::character varying,
  fdesde DATE DEFAULT now() NOT NULL,
  fhasta DATE,
  gestion NUMERIC(1,0) DEFAULT 1,
  abreviatura VARCHAR(5),
  CONSTRAINT pk_asignaciondefensa PRIMARY KEY(idasignaciondefensa),
  CONSTRAINT chk_gestion_asignaciondefensa CHECK ((gestion = (0)::numeric) OR (gestion = (1)::numeric))
) 
WITH (oids = false);

COMMENT ON COLUMN mod_personaext.nom_asignaciondefensa.idasignaciondefensa
IS 'Identificador de la asignación.';

COMMENT ON COLUMN mod_personaext.nom_asignaciondefensa.denominacion
IS 'Denominación de la asignación.';

COMMENT ON COLUMN mod_personaext.nom_asignaciondefensa.descripcion
IS 'Descripción de la asignación.';

COMMENT ON COLUMN mod_personaext.nom_asignaciondefensa.fdesde
IS 'Fecha de entrada en vigor del valor nomenclado.';

COMMENT ON COLUMN mod_personaext.nom_asignaciondefensa.fhasta
IS 'Fecha en que concluye la vigencia del valor nomenclado.';

COMMENT ON COLUMN mod_personaext.nom_asignaciondefensa.abreviatura
IS 'Abreviatura de la asignación';

COMMENT ON CONSTRAINT pk_asignaciondefensa ON mod_personaext.nom_asignaciondefensa
IS 'LLave primaria para identificar la tupla.';

/* mod_personaext.dat_cantera (Unique Source, Tables) */
CREATE TABLE mod_personaext.dat_cantera (
  fechapropuesta DATE NOT NULL,
  fechatermino DATE,
  idcantera NUMERIC(19,0) DEFAULT nextval('mod_personaext.sec_canteras_seq'::regclass) NOT NULL,
  idcargopropuesto NUMERIC(19,0),
  idorganismo NUMERIC(19,0),
  idpropone NUMERIC(19,0),
  idpersona NUMERIC(19,0) NOT NULL,
  propone VARCHAR(255) NOT NULL,
  estadocantera VARCHAR(255) NOT NULL,
  CONSTRAINT idcantera PRIMARY KEY(idcantera)
) 
WITH (oids = false);

COMMENT ON TABLE mod_personaext.dat_cantera
IS 'Tabla utilizada para registrar las canteras.';

/* mod_personaext.dat_caracterizacion (Unique Source, Tables) */
CREATE TABLE mod_personaext.dat_caracterizacion (
  idcaracterizacion NUMERIC(19,0) DEFAULT nextval('mod_personaext.sec_caracterizacion_seq'::regclass) NOT NULL,
  idpersona NUMERIC(19,0) NOT NULL,
  coeficiente VARCHAR(100),
  expresion VARCHAR(100),
  apariencia VARCHAR(100),
  motivacion VARCHAR(100),
  perfil NUMERIC(1,0) DEFAULT 0,
  explaboral NUMERIC(2,0),
  expactividad NUMERIC(2,0),
  resumen VARCHAR(5000),
  aptoperfil NUMERIC(1,0),
  CONSTRAINT dat_caracterizacion_pkey PRIMARY KEY(idcaracterizacion)
) 
WITH (oids = false);

COMMENT ON COLUMN mod_personaext.dat_caracterizacion.idcaracterizacion
IS 'Identificador de la caracterización personal';

COMMENT ON COLUMN mod_personaext.dat_caracterizacion.idpersona
IS 'Identificador de la persona';

COMMENT ON COLUMN mod_personaext.dat_caracterizacion.coeficiente
IS 'Coeficiente intelectual de la persona';

COMMENT ON COLUMN mod_personaext.dat_caracterizacion.expresion
IS 'Expresión verbal de la persona';

COMMENT ON COLUMN mod_personaext.dat_caracterizacion.apariencia
IS 'Apariencia personal';

COMMENT ON COLUMN mod_personaext.dat_caracterizacion.motivacion
IS 'Motivación de la persona';

COMMENT ON COLUMN mod_personaext.dat_caracterizacion.perfil
IS 'Determina si la persona posee perfiles afines.';

COMMENT ON COLUMN mod_personaext.dat_caracterizacion.explaboral
IS 'Experiencia laboral de la persona en años';

COMMENT ON COLUMN mod_personaext.dat_caracterizacion.expactividad
IS 'Experiencia en la actividad en años';

/* mod_personaext.nom_cargodefensa (Unique Source, Tables) */
CREATE TABLE mod_personaext.nom_cargodefensa (
  idcargodefensa NUMERIC(19,0) DEFAULT nextval('mod_personaext.sec_cargodefensa_seq'::regclass) NOT NULL,
  denominacion VARCHAR(255) NOT NULL,
  descripcion VARCHAR(500) DEFAULT 'Sin descripción.'::character varying,
  fdesde DATE DEFAULT now() NOT NULL,
  fhasta DATE,
  gestion NUMERIC(1,0) DEFAULT 1,
  abreviatura VARCHAR(5),
  CONSTRAINT pk_cargodefensa PRIMARY KEY(idcargodefensa),
  CONSTRAINT chk_gestion_cargodefensa CHECK ((gestion = (0)::numeric) OR (gestion = (1)::numeric))
) 
WITH (oids = false);

COMMENT ON TABLE mod_personaext.nom_cargodefensa
IS 'Almacena los cargos en la defensa.';

COMMENT ON COLUMN mod_personaext.nom_cargodefensa.idcargodefensa
IS 'Identificador del cargo.';

COMMENT ON COLUMN mod_personaext.nom_cargodefensa.denominacion
IS 'Denominación del cargo.';

COMMENT ON COLUMN mod_personaext.nom_cargodefensa.descripcion
IS 'Descripción del cargo.';

COMMENT ON COLUMN mod_personaext.nom_cargodefensa.fdesde
IS 'Fecha de entrada en vigor del valor nomenclado.';

COMMENT ON COLUMN mod_personaext.nom_cargodefensa.fhasta
IS 'Fecha en que concluye la vigencia del valor nomenclado.';

COMMENT ON COLUMN mod_personaext.nom_cargodefensa.abreviatura
IS 'Abreviatura del cargo en la defensa';

COMMENT ON CONSTRAINT pk_cargodefensa ON mod_personaext.nom_cargodefensa
IS 'LLave primaria para identificar la tupla.';

/* mod_personaext.nom_cargoexcep (Unique Source, Tables) */
CREATE TABLE mod_personaext.nom_cargoexcep (
  idcargoexcep NUMERIC(19,0) DEFAULT nextval('mod_personaext.sec_cargoexcep_seq'::regclass) NOT NULL,
  denominacion VARCHAR(255) NOT NULL,
  fdesde DATE NOT NULL,
  fhasta DATE,
  descripcion VARCHAR(255),
  gestion NUMERIC(1,0) DEFAULT 1,
  abreviatura VARCHAR(5),
  CONSTRAINT chk_gestion_cargoexcep CHECK ((gestion = (0)::numeric) OR (gestion = (1)::numeric))
) 
WITH (oids = false);

COMMENT ON COLUMN mod_personaext.nom_cargoexcep.abreviatura
IS 'Abreviatura del cargo';

/* mod_personaext.nom_cargoorganizacion.gestion (Unique Source, Fields) */
ALTER TABLE mod_personaext.nom_cargoorganizacion
  ADD COLUMN gestion NUMERIC(1,0) DEFAULT 1;

/* mod_personaext.nom_cargoorganizacion.abreviatura (Unique Source, Fields) */
ALTER TABLE mod_personaext.nom_cargoorganizacion
  ADD COLUMN abreviatura VARCHAR(5);

COMMENT ON COLUMN mod_personaext.nom_cargoorganizacion.abreviatura
IS 'Abreviatura del cargo en la organización';

/* mod_personaext.nom_categoriapersona.gestion (Unique Source, Fields) */
ALTER TABLE mod_personaext.nom_categoriapersona
  ADD COLUMN gestion NUMERIC(1,0) DEFAULT 1;

/* mod_personaext.nom_categoriapersona.abreviatura (Unique Source, Fields) */
ALTER TABLE mod_personaext.nom_categoriapersona
  ADD COLUMN abreviatura VARCHAR(60);

/* mod_personaext.nom_causalimitacion.gestion (Unique Source, Fields) */
ALTER TABLE mod_personaext.nom_causalimitacion
  ADD COLUMN gestion NUMERIC(1,0) DEFAULT 1;

/* mod_personaext.nom_causalimitacion.abreviatura (Unique Source, Fields) */
ALTER TABLE mod_personaext.nom_causalimitacion
  ADD COLUMN abreviatura VARCHAR(5);

COMMENT ON COLUMN mod_personaext.nom_causalimitacion.abreviatura
IS 'Abreviatura de la causa de limitación';

/* mod_personaext.nom_convivencia (Unique Source, Tables) */
CREATE TABLE mod_personaext.nom_convivencia (
  idconvivencia NUMERIC(19,0) DEFAULT nextval('mod_personaext.sec_convivencia_seq'::regclass) NOT NULL,
  denominacion VARCHAR(255) NOT NULL,
  descripcion VARCHAR(255),
  fdesde DATE,
  fhasta DATE,
  gestion NUMERIC(1,0) DEFAULT 1,
  abreviatura VARCHAR(5),
  CONSTRAINT pk_convivencia PRIMARY KEY(idconvivencia),
  CONSTRAINT chk_gestion_convivencia CHECK ((gestion = (0)::numeric) OR (gestion = (1)::numeric))
) 
WITH (oids = true);

COMMENT ON COLUMN mod_personaext.nom_convivencia.idconvivencia
IS 'Identificador de la tabla.';

COMMENT ON COLUMN mod_personaext.nom_convivencia.denominacion
IS 'Denominación de la convivencia.';

COMMENT ON COLUMN mod_personaext.nom_convivencia.descripcion
IS 'Descripción de la convivencia.';

COMMENT ON COLUMN mod_personaext.nom_convivencia.fdesde
IS 'Fecha en que se inserta la convivencia.';

COMMENT ON COLUMN mod_personaext.nom_convivencia.fhasta
IS 'Fecha en la que finaliza la vigencia del valor nomenclado.';

COMMENT ON COLUMN mod_personaext.nom_convivencia.abreviatura
IS 'Abreviatura de la situación de convivencia.';

/* mod_personaext.nom_curso.gestion (Unique Source, Fields) */
ALTER TABLE mod_personaext.nom_curso
  ADD COLUMN gestion NUMERIC(1,0) DEFAULT 1;

COMMENT ON COLUMN mod_personaext.nom_curso.gestion
IS 'Indicador de gestión de la información.1- Gestionable, 0- No gestionable.';

/* mod_personaext.nom_curso.abreviatura (Unique Source, Fields) */
ALTER TABLE mod_personaext.nom_curso
  ADD COLUMN abreviatura VARCHAR(5);

COMMENT ON COLUMN mod_personaext.nom_curso.abreviatura
IS 'Abreviatura de la organización';

/* mod_personaext.nom_disposicion (Unique Source, Tables) */
CREATE TABLE mod_personaext.nom_disposicion (
  iddisposicion NUMERIC(19,0) DEFAULT nextval('mod_personaext.sec_disposicion_seq'::regclass) NOT NULL,
  denominacion VARCHAR(255) NOT NULL,
  abreviatura VARCHAR(10),
  descripcion VARCHAR(500),
  fdesde DATE DEFAULT now() NOT NULL,
  fhasta DATE,
  gestion NUMERIC(1,0) DEFAULT 1 NOT NULL,
  CONSTRAINT pk_disposicion PRIMARY KEY(iddisposicion),
  CONSTRAINT uk_disposicion_denominacion UNIQUE(denominacion),
  CONSTRAINT chk_gestion CHECK ((gestion = (0)::numeric) OR (gestion = (1)::numeric))
) 
WITH (oids = false);

COMMENT ON COLUMN mod_personaext.nom_disposicion.iddisposicion
IS 'Identificador de la disposición.';

COMMENT ON COLUMN mod_personaext.nom_disposicion.denominacion
IS 'Denominación de la disposición.';

COMMENT ON COLUMN mod_personaext.nom_disposicion.abreviatura
IS 'Abreviatura de la disposición.';

COMMENT ON COLUMN mod_personaext.nom_disposicion.descripcion
IS 'Descripción de la disposición.';

COMMENT ON COLUMN mod_personaext.nom_disposicion.fdesde
IS 'Fecha en que inicia la vigencia de la disposición';

COMMENT ON COLUMN mod_personaext.nom_disposicion.fhasta
IS 'Fecha en que concluye la vigencia de la disposición.';

COMMENT ON COLUMN mod_personaext.nom_disposicion.gestion
IS 'Determina si elemento es gestionable o no desde el sistema. (0: No gestionable, 1: Gestionable)';

/* mod_personaext.nom_estadocivil.gestion (Unique Source, Fields) */
ALTER TABLE mod_personaext.nom_estadocivil
  ADD COLUMN gestion NUMERIC(1,0) DEFAULT 1;

/* mod_personaext.nom_estadocivil.abreviatura (Unique Source, Fields) */
ALTER TABLE mod_personaext.nom_estadocivil
  ADD COLUMN abreviatura VARCHAR(5);

COMMENT ON COLUMN mod_personaext.nom_estadocivil.abreviatura
IS 'Abreviatura del estado civil.';

/* mod_personaext.nom_estadovivienda (Unique Source, Tables) */
CREATE TABLE mod_personaext.nom_estadovivienda (
  idestadovivienda NUMERIC(19,0) DEFAULT nextval('mod_personaext.sec_estadovivienda_seq'::regclass) NOT NULL,
  denominacion VARCHAR(255) NOT NULL,
  descripcion VARCHAR(255),
  fdesde DATE,
  fhasta DATE,
  gestion NUMERIC(1,0) DEFAULT 1,
  abreviatura VARCHAR(5),
  CONSTRAINT pk_estadovivienda PRIMARY KEY(idestadovivienda),
  CONSTRAINT chk_gestion_estadovivienda CHECK ((gestion = (0)::numeric) OR (gestion = (1)::numeric))
) 
WITH (oids = false);

COMMENT ON COLUMN mod_personaext.nom_estadovivienda.idestadovivienda
IS 'Identificador de la tabla.';

COMMENT ON COLUMN mod_personaext.nom_estadovivienda.denominacion
IS 'Denominación del estado de la vivienda.';

COMMENT ON COLUMN mod_personaext.nom_estadovivienda.descripcion
IS 'Descripción del estado de la vivienda.';

COMMENT ON COLUMN mod_personaext.nom_estadovivienda.fdesde
IS 'Fecha en que se inserta el estado de la vivienda.';

COMMENT ON COLUMN mod_personaext.nom_estadovivienda.fhasta
IS 'Fecha en la que finaliza la vigencia del valor nomenclado.';

COMMENT ON COLUMN mod_personaext.nom_estadovivienda.abreviatura
IS 'Abreviatura del estado de la vivienda.';

/* mod_personaext.nom_estalimentacion (Unique Source, Tables) */
CREATE TABLE mod_personaext.nom_estalimentacion (
  idestalimentacion NUMERIC(19,0) DEFAULT nextval('mod_personaext.sec_estalimentacion_seq'::regclass) NOT NULL,
  denominacion VARCHAR(100) NOT NULL,
  descripcion VARCHAR(500),
  fdesde DATE DEFAULT now() NOT NULL,
  fhasta DATE,
  gestion NUMERIC(1,0) DEFAULT 1,
  abreviatura VARCHAR(5),
  CONSTRAINT nom_estalimentacion_pkey PRIMARY KEY(idestalimentacion),
  CONSTRAINT chk_gestion_estalimentacion CHECK ((gestion = (0)::numeric) OR (gestion = (1)::numeric))
) 
WITH (oids = false);

COMMENT ON TABLE mod_personaext.nom_estalimentacion
IS 'Nomenclador de estructuras de alimentación.';

COMMENT ON COLUMN mod_personaext.nom_estalimentacion.idestalimentacion
IS 'Identificador de la estructura de alimentación.';

COMMENT ON COLUMN mod_personaext.nom_estalimentacion.denominacion
IS 'Denominación del servicio de alimentación.';

COMMENT ON COLUMN mod_personaext.nom_estalimentacion.descripcion
IS 'Descripción del servicio de alimentación.';

COMMENT ON COLUMN mod_personaext.nom_estalimentacion.fdesde
IS 'Fecha en que inicia la vigencia del registro.';

COMMENT ON COLUMN mod_personaext.nom_estalimentacion.fhasta
IS 'Fecha en que concluye la vigencia el registro.';

COMMENT ON COLUMN mod_personaext.nom_estalimentacion.abreviatura
IS 'Abreviatura de la estructura de alimentación.';

/* mod_personaext.nom_estratificacionsocial.gestion (Unique Source, Fields) */
ALTER TABLE mod_personaext.nom_estratificacionsocial
  ADD COLUMN gestion NUMERIC(1,0) DEFAULT 1;

/* mod_personaext.nom_estratificacionsocial.abreviatura (Unique Source, Fields) */
ALTER TABLE mod_personaext.nom_estratificacionsocial
  ADD COLUMN abreviatura VARCHAR(5);

COMMENT ON COLUMN mod_personaext.nom_estratificacionsocial.abreviatura
IS 'Abreviatura de la estratificación social.';

/* mod_personaext.nom_estructuraalojamiento (Unique Source, Tables) */
CREATE TABLE mod_personaext.nom_estructuraalojamiento (
  idestructuraalojamiento NUMERIC(19,0) DEFAULT nextval('mod_personaext.sec_estructuraalojamiento_seq'::regclass) NOT NULL,
  denominacion VARCHAR(255) NOT NULL,
  descripcion VARCHAR(500) DEFAULT 'Sin descripción.'::character varying,
  fdesde DATE DEFAULT now() NOT NULL,
  fhasta DATE,
  idpadre NUMERIC(19,0),
  gestion NUMERIC(1,0) DEFAULT 1,
  abreviatura VARCHAR(60),
  CONSTRAINT pk_estructuraalojamiento PRIMARY KEY(idestructuraalojamiento),
  CONSTRAINT chk_gestion_estructuraalojamiento CHECK ((gestion = (0)::numeric) OR (gestion = (1)::numeric))
) 
WITH (oids = false);

COMMENT ON TABLE mod_personaext.nom_estructuraalojamiento
IS 'Almacena las estructuras de alojamiento.';

COMMENT ON COLUMN mod_personaext.nom_estructuraalojamiento.idestructuraalojamiento
IS 'Identificador de la estructura de alojamiento.';

COMMENT ON COLUMN mod_personaext.nom_estructuraalojamiento.denominacion
IS 'Denominación del estructura de alojamiento.';

COMMENT ON COLUMN mod_personaext.nom_estructuraalojamiento.descripcion
IS 'Descripción del estructura de alojamiento.';

COMMENT ON COLUMN mod_personaext.nom_estructuraalojamiento.fdesde
IS 'Fecha de entrada en vigor del valor nomenclado.';

COMMENT ON COLUMN mod_personaext.nom_estructuraalojamiento.fhasta
IS 'Fecha en que concluye la vigencia del valor nomenclado.';

COMMENT ON COLUMN mod_personaext.nom_estructuraalojamiento.idpadre
IS 'Identificador del estructura de alojamiento agrupador o padre.';

CREATE INDEX idx_idpadre_estructuraalojamiento ON mod_personaext.nom_estructuraalojamiento
  USING btree (idpadre);

COMMENT ON INDEX mod_personaext.idx_idpadre_estructuraalojamiento
IS 'Índice sobre la(s) columna(s) "idpadre" para agilizar la búsqueda de información.';

COMMENT ON CONSTRAINT pk_estructuraalojamiento ON mod_personaext.nom_estructuraalojamiento
IS 'LLave primaria para identificar la tupla.';

CREATE TRIGGER t_estructuraalojamiento_insertar
  BEFORE INSERT 
  ON mod_personaext.nom_estructuraalojamiento
  
FOR EACH ROW 
  EXECUTE PROCEDURE mod_personaext.ft_estructuraalojamiento_insertar();

COMMENT ON TRIGGER t_estructuraalojamiento_insertar ON mod_personaext.nom_estructuraalojamiento
IS 'Ejecuta la función "ft_estructuraalojamiento_insertar()".';

/* mod_personaext.nom_estructuratransportacion (Unique Source, Tables) */
CREATE TABLE mod_personaext.nom_estructuratransportacion (
  idestructuratransportacion NUMERIC(19,0) DEFAULT nextval('mod_personaext.sec_estructuratransportacion_seq'::regclass) NOT NULL,
  denominacion VARCHAR(255) NOT NULL,
  descripcion VARCHAR(500) DEFAULT 'Sin descripción.'::character varying,
  fdesde DATE DEFAULT now() NOT NULL,
  fhasta DATE,
  idpadre NUMERIC(19,0),
  gestion NUMERIC(1,0) DEFAULT 1,
  abreviatura VARCHAR(60),
  CONSTRAINT pk_estructuratransportacion PRIMARY KEY(idestructuratransportacion),
  CONSTRAINT chk_gestion_estructuratransportacion CHECK ((gestion = (0)::numeric) OR (gestion = (1)::numeric))
) 
WITH (oids = false);

COMMENT ON TABLE mod_personaext.nom_estructuratransportacion
IS 'Almacena las estructuras de alojamiento.';

COMMENT ON COLUMN mod_personaext.nom_estructuratransportacion.idestructuratransportacion
IS 'Identificador de la estructura de transportación.';

COMMENT ON COLUMN mod_personaext.nom_estructuratransportacion.denominacion
IS 'Denominación del estructura de transportación.';

COMMENT ON COLUMN mod_personaext.nom_estructuratransportacion.descripcion
IS 'Descripción del estructura de transportación.';

COMMENT ON COLUMN mod_personaext.nom_estructuratransportacion.fdesde
IS 'Fecha de entrada en vigor del valor nomenclado.';

COMMENT ON COLUMN mod_personaext.nom_estructuratransportacion.fhasta
IS 'Fecha en que concluye la vigencia del valor nomenclado.';

COMMENT ON COLUMN mod_personaext.nom_estructuratransportacion.idpadre
IS 'Identificador del estructura de alojamiento agrupador o padre.';

CREATE INDEX idx_idpadre_estructuratransportacion ON mod_personaext.nom_estructuratransportacion
  USING btree (idpadre);

COMMENT ON INDEX mod_personaext.idx_idpadre_estructuratransportacion
IS 'Índice sobre la(s) columna(s) "idpadre" para agilizar la búsqueda de información.';

COMMENT ON CONSTRAINT pk_estructuratransportacion ON mod_personaext.nom_estructuratransportacion
IS 'LLave primaria para identificar la tupla.';

CREATE TRIGGER t_estructuratransportacion_insertar
  BEFORE INSERT 
  ON mod_personaext.nom_estructuratransportacion
  
FOR EACH ROW 
  EXECUTE PROCEDURE mod_personaext.ft_estructuratransportacion_insertar();

COMMENT ON TRIGGER t_estructuratransportacion_insertar ON mod_personaext.nom_estructuratransportacion
IS 'Ejecuta la función "ft_estructuratransportacion_insertar()".';

/* mod_personaext.nom_eventoalimentacion.gestion (Unique Source, Fields) */
ALTER TABLE mod_personaext.nom_eventoalimentacion
  ADD COLUMN gestion NUMERIC(1,0) DEFAULT 1;

/* mod_personaext.nom_eventoalimentacion.abreviatura (Unique Source, Fields) */
ALTER TABLE mod_personaext.nom_eventoalimentacion
  ADD COLUMN abreviatura VARCHAR(5);

COMMENT ON COLUMN mod_personaext.nom_eventoalimentacion.abreviatura
IS 'Abreviatura de los eventos de alimentación.';

/* mod_personaext.dat_familiar2 (Unique Source, Tables) */
CREATE TABLE mod_personaext.dat_familiar2 (
  idfamiliar NUMERIC(19,0) DEFAULT nextval('mod_personaext.sec_familiar2_seq'::regclass) NOT NULL,
  familiar VARCHAR(200) NOT NULL,
  idparentesco NUMERIC(19,0) NOT NULL,
  allegado NUMERIC(1,0) DEFAULT 0 NOT NULL,
  conviven NUMERIC(1,0) DEFAULT 0 NOT NULL,
  observaciones VARCHAR(500),
  idpersona NUMERIC(19,0),
  CONSTRAINT dat_familiar2_pkey PRIMARY KEY(idfamiliar)
) 
WITH (oids = false);

COMMENT ON COLUMN mod_personaext.dat_familiar2.familiar
IS 'Nombre del familiar';

COMMENT ON COLUMN mod_personaext.dat_familiar2.idparentesco
IS 'Identificador del parentesco.';

COMMENT ON COLUMN mod_personaext.dat_familiar2.allegado
IS 'Determina si el familiar es allegado o no. 0->No, 1->Si';

COMMENT ON COLUMN mod_personaext.dat_familiar2.conviven
IS 'Determina si el familiar convive con la persona. 0->No, 1->Si';

COMMENT ON COLUMN mod_personaext.dat_familiar2.observaciones
IS 'Conjunto de observaciones asociadas al familiar.';

/* mod_personaext.nom_formaadquiriridioma.gestion (Unique Source, Fields) */
ALTER TABLE mod_personaext.nom_formaadquiriridioma
  ADD COLUMN gestion NUMERIC(1,0) DEFAULT 1;

/* mod_personaext.nom_formaadquiriridioma.abreviatura (Unique Source, Fields) */
ALTER TABLE mod_personaext.nom_formaadquiriridioma
  ADD COLUMN abreviatura VARCHAR(5);

COMMENT ON COLUMN mod_personaext.nom_formaadquiriridioma.abreviatura
IS 'Abreviatura de la vía de aprendizaje.';

/* mod_personaext.nom_idioma.gestion (Unique Source, Fields) */
ALTER TABLE mod_personaext.nom_idioma
  ADD COLUMN gestion NUMERIC(1,0) DEFAULT 1;

/* mod_personaext.nom_idioma.abreviatura (Unique Source, Fields) */
ALTER TABLE mod_personaext.nom_idioma
  ADD COLUMN abreviatura VARCHAR(5);

COMMENT ON COLUMN mod_personaext.nom_idioma.abreviatura
IS 'Abreviatura de la organización';

/* mod_personaext.nom_jefefacultado (Unique Source, Tables) */
CREATE TABLE mod_personaext.nom_jefefacultado (
  idjefefacultado NUMERIC(19,0) DEFAULT nextval('mod_personaext.sec_jefefacultado_seq'::regclass) NOT NULL,
  denominacion VARCHAR(255) NOT NULL,
  descripcion VARCHAR(500) DEFAULT 'Sin descripción.'::character varying,
  bandera VARCHAR(50),
  fdesde DATE DEFAULT now() NOT NULL,
  fhasta DATE,
  gestion NUMERIC(1,0) DEFAULT 1,
  abreviatura VARCHAR(5),
  CONSTRAINT pk_idjefefacultado PRIMARY KEY(idjefefacultado),
  CONSTRAINT chk_gestion_jefefacultado CHECK ((gestion = (0)::numeric) OR (gestion = (1)::numeric))
) 
WITH (oids = false);

COMMENT ON TABLE mod_personaext.nom_jefefacultado
IS 'Almacena los idiomas.';

COMMENT ON COLUMN mod_personaext.nom_jefefacultado.idjefefacultado
IS 'Identificador del jefe facultado.';

COMMENT ON COLUMN mod_personaext.nom_jefefacultado.denominacion
IS 'Denominación del jefe facultado.';

COMMENT ON COLUMN mod_personaext.nom_jefefacultado.descripcion
IS 'Descripción del jefe facultado.';

COMMENT ON COLUMN mod_personaext.nom_jefefacultado.bandera
IS 'Nombre del estilo css.';

COMMENT ON COLUMN mod_personaext.nom_jefefacultado.fdesde
IS 'Fecha de entrada en vigor del valor nomenclado.';

COMMENT ON COLUMN mod_personaext.nom_jefefacultado.fhasta
IS 'Fecha en que concluye la vigencia del valor nomenclado.';

COMMENT ON COLUMN mod_personaext.nom_jefefacultado.abreviatura
IS 'Abreviatura del jefe facultado';

COMMENT ON CONSTRAINT pk_idjefefacultado ON mod_personaext.nom_jefefacultado
IS 'LLave primaria para identificar la tupla.';

/* mod_personaext.nom_jefesfacultados (Unique Source, Tables) */
CREATE TABLE mod_personaext.nom_jefesfacultados (
  idjefesfacultado NUMERIC(19,0) DEFAULT nextval('mod_personaext.sec_jefesfacultados_seq'::regclass) NOT NULL,
  descripcion VARCHAR(500),
  fdesde DATE DEFAULT now() NOT NULL,
  fhasta DATE,
  idcargopropuesto NUMERIC(19,0) NOT NULL,
  gestion NUMERIC(1,0) DEFAULT 1,
  abreviatura VARCHAR(5),
  CONSTRAINT pk_jefesfacultados PRIMARY KEY(idjefesfacultado),
  CONSTRAINT chk_gestion_jefesfacultados CHECK ((gestion = (0)::numeric) OR (gestion = (1)::numeric))
) 
WITH (oids = false);

COMMENT ON COLUMN mod_personaext.nom_jefesfacultados.abreviatura
IS 'Abreviatura del jefe facultado';

/* mod_personaext.nom_mediopersona (Unique Source, Tables) */
CREATE TABLE mod_personaext.nom_mediopersona (
  idmediopersona NUMERIC(19,0) DEFAULT nextval('mod_personaext.sec_medios_seq'::regclass) NOT NULL,
  denominacion VARCHAR(100) NOT NULL,
  fdesde DATE DEFAULT now() NOT NULL,
  fhasta DATE,
  descripcion VARCHAR(255),
  gestion NUMERIC(1,0) DEFAULT 1,
  abreviatura VARCHAR(5),
  CONSTRAINT ak_denominacion_mediopersona UNIQUE(denominacion),
  CONSTRAINT pk_mediopersona PRIMARY KEY(idmediopersona),
  CONSTRAINT chk_gestion_mediopersona CHECK ((gestion = (0)::numeric) OR (gestion = (1)::numeric))
) 
WITH (oids = false);

COMMENT ON TABLE mod_personaext.nom_mediopersona
IS 'Almacena los medios.';

COMMENT ON COLUMN mod_personaext.nom_mediopersona.idmediopersona
IS 'Identificador del medio.';

COMMENT ON COLUMN mod_personaext.nom_mediopersona.denominacion
IS 'Denominación del medio.';

COMMENT ON COLUMN mod_personaext.nom_mediopersona.fdesde
IS 'Fecha de registro.';

COMMENT ON COLUMN mod_personaext.nom_mediopersona.fhasta
IS 'Fecha de eliminado.';

COMMENT ON COLUMN mod_personaext.nom_mediopersona.abreviatura
IS 'Abreviatura del medio';

/* mod_personaext.nom_modoformacion.gestion (Unique Source, Fields) */
ALTER TABLE mod_personaext.nom_modoformacion
  ADD COLUMN gestion NUMERIC(1,0) DEFAULT 1;

/* mod_personaext.nom_modoformacion.abreviatura (Unique Source, Fields) */
ALTER TABLE mod_personaext.nom_modoformacion
  ADD COLUMN abreviatura VARCHAR(5);

COMMENT ON COLUMN mod_personaext.nom_modoformacion.abreviatura
IS 'Abreviatura del modo de formación.';

/* mod_personaext.nom_motivocondecoracion.gestion (Unique Source, Fields) */
ALTER TABLE mod_personaext.nom_motivocondecoracion
  ADD COLUMN gestion NUMERIC(1,0) DEFAULT 1;

/* mod_personaext.nom_motivocondecoracion.abreviatura (Unique Source, Fields) */
ALTER TABLE mod_personaext.nom_motivocondecoracion
  ADD COLUMN abreviatura VARCHAR(5);

COMMENT ON COLUMN mod_personaext.nom_motivocondecoracion.abreviatura
IS 'Abreviatura del motivo de condecoración.';

/* mod_personaext.nom_motivosancion.gestion (Unique Source, Fields) */
ALTER TABLE mod_personaext.nom_motivosancion
  ADD COLUMN gestion NUMERIC(1,0) DEFAULT 1;

/* mod_personaext.nom_motivosancion.abreviatura (Unique Source, Fields) */
ALTER TABLE mod_personaext.nom_motivosancion
  ADD COLUMN abreviatura VARCHAR(5);

COMMENT ON COLUMN mod_personaext.nom_motivosancion.abreviatura
IS 'Abreviatura del motivo de sanción.';

/* mod_personaext.nom_niveleducacional.gestion (Unique Source, Fields) */
ALTER TABLE mod_personaext.nom_niveleducacional
  ADD COLUMN gestion NUMERIC(1,0) DEFAULT 1;

/* mod_personaext.nom_niveleducacional.abreviatura (Unique Source, Fields) */
ALTER TABLE mod_personaext.nom_niveleducacional
  ADD COLUMN abreviatura VARCHAR(5);

COMMENT ON COLUMN mod_personaext.nom_niveleducacional.abreviatura
IS 'Abreviatura del nivel educacional.';

/* mod_personaext.nom_nivelorganizacion.gestion (Unique Source, Fields) */
ALTER TABLE mod_personaext.nom_nivelorganizacion
  ADD COLUMN gestion NUMERIC(1,0) DEFAULT 1;

/* mod_personaext.nom_nivelorganizacion.abreviatura (Unique Source, Fields) */
ALTER TABLE mod_personaext.nom_nivelorganizacion
  ADD COLUMN abreviatura VARCHAR(5);

COMMENT ON COLUMN mod_personaext.nom_nivelorganizacion.abreviatura
IS 'Abreviatura del cargo en la organización';

/* mod_personaext.nom_dedo (Unique Source, Tables) */
CREATE TABLE mod_personaext.nom_dedo (
  iddedo NUMERIC(19,0) DEFAULT nextval('mod_personaext.sec_nomdedo_seq'::regclass) NOT NULL,
  denominacion VARCHAR(255) NOT NULL,
  descripcion VARCHAR(500),
  activo NUMERIC(1,0) DEFAULT 0,
  imagen BYTEA NOT NULL,
  numdedo VARCHAR(2) NOT NULL,
  gestion NUMERIC(1,0) DEFAULT 1,
  abreviatura VARCHAR(60),
  CONSTRAINT pk_dedo PRIMARY KEY(iddedo),
  CONSTRAINT chk_gestion_dedo CHECK ((gestion = (0)::numeric) OR (gestion = (1)::numeric))
) 
WITH (oids = false);

COMMENT ON COLUMN mod_personaext.nom_dedo.numdedo
IS 'Identificador del dedo segun corresponde a la mano
1-mennique
2-anular
3-medio
4-indice
5-pulgar';

/* mod_personaext.nom_norma.gestion (Unique Source, Fields) */
ALTER TABLE mod_personaext.nom_norma
  ADD COLUMN gestion NUMERIC(1,0) DEFAULT 1;

/* mod_personaext.nom_norma.abreviatura (Unique Source, Fields) */
ALTER TABLE mod_personaext.nom_norma
  ADD COLUMN abreviatura VARCHAR(5);

/* mod_personaext.dat_obra (Unique Source, Tables) */
CREATE TABLE mod_personaext.dat_obra (
  idobra NUMERIC(19,0) DEFAULT nextval('mod_personaext.sec_obra_seq'::regclass) NOT NULL,
  fdesde DATE NOT NULL,
  fhasta DATE,
  idpersona NUMERIC(19,0) NOT NULL,
  CONSTRAINT idobra PRIMARY KEY(idobra)
) 
WITH (oids = false);

/* mod_personaext.dat_observacion (Unique Source, Tables) */
CREATE TABLE mod_personaext.dat_observacion (
  idobservacion NUMERIC(19,0) DEFAULT nextval('mod_personaext.sec_observacion_seq'::regclass) NOT NULL,
  idpersona NUMERIC(19,0) NOT NULL,
  observacion VARCHAR NOT NULL,
  fregistro DATE DEFAULT now() NOT NULL,
  CONSTRAINT pk_observacion PRIMARY KEY(idobservacion)
) 
WITH (oids = false);

COMMENT ON TABLE mod_personaext.dat_observacion
IS 'Almacena las observaciones generales a modo de resumir información sobre la persona.';

COMMENT ON COLUMN mod_personaext.dat_observacion.idobservacion
IS 'Identificador de la tabla.';

COMMENT ON COLUMN mod_personaext.dat_observacion.idpersona
IS 'Identificador de la persona.';

COMMENT ON COLUMN mod_personaext.dat_observacion.observacion
IS 'Alamcena las observaciones generales de la persona a modo de resumir (una/la) situación en la entidad.';

COMMENT ON CONSTRAINT pk_observacion ON mod_personaext.dat_observacion
IS 'LLave primaria para la identificar la tupla.';

/* mod_personaext.dat_ocupaciontiempoguerra (Unique Source, Tables) */
CREATE TABLE mod_personaext.dat_ocupaciontiempoguerra (
  idocupaciontiempoguerra NUMERIC(19,0) DEFAULT nextval('mod_personaext.sec_ocupaciontiempoguerra_seq'::regclass) NOT NULL,
  entidad VARCHAR(255) NOT NULL,
  cargo VARCHAR(255) NOT NULL,
  fdesde DATE DEFAULT now() NOT NULL,
  fhasta DATE,
  idpersona NUMERIC(19,0) NOT NULL,
  oficial NUMERIC(1,0),
  CONSTRAINT pk_ocupaciontiempoguerra PRIMARY KEY(idocupaciontiempoguerra),
  CONSTRAINT chk_oficial_ocuptiempguerra CHECK ((oficial = (0)::numeric) OR (oficial = (1)::numeric))
) 
WITH (oids = false);

/* mod_personaext.nom_padecimiento.gestion (Unique Source, Fields) */
ALTER TABLE mod_personaext.nom_padecimiento
  ADD COLUMN gestion NUMERIC(1,0) DEFAULT 1;

/* mod_personaext.nom_padecimiento.abreviatura (Unique Source, Fields) */
ALTER TABLE mod_personaext.nom_padecimiento
  ADD COLUMN abreviatura VARCHAR(5);

COMMENT ON COLUMN mod_personaext.nom_padecimiento.abreviatura
IS 'Abreviatura del padecimiento';

/* mod_personaext.nom_parentesco (Different, Tables) */
/* Different properties: Description */
COMMENT ON TABLE mod_personaext.nom_parentesco
IS '';

/* mod_personaext.nom_parentesco.idparentesco (Different, Fields) */
/* Different properties: Description */
COMMENT ON COLUMN mod_personaext.nom_parentesco.idparentesco
IS '';

/* mod_personaext.nom_parentesco.denominacion (Different, Fields) */
/* Different properties: Description */
COMMENT ON COLUMN mod_personaext.nom_parentesco.denominacion
IS '';

/* mod_personaext.nom_parentesco.descripcion (Different, Fields) */
/* Different properties: Description, Size */
COMMENT ON COLUMN mod_personaext.nom_parentesco.descripcion
IS '';

ALTER TABLE mod_personaext.nom_parentesco
  ALTER COLUMN descripcion TYPE VARCHAR(500) COLLATE pg_catalog."default";

/* mod_personaext.nom_parentesco.fdesde (Different, Fields) */
/* Different properties: Description */
COMMENT ON COLUMN mod_personaext.nom_parentesco.fdesde
IS '';

/* mod_personaext.nom_parentesco.fhasta (Different, Fields) */
/* Different properties: Description */
COMMENT ON COLUMN mod_personaext.nom_parentesco.fhasta
IS '';

/* mod_personaext.nom_parentesco.inverso (Unique Source, Fields) */
ALTER TABLE mod_personaext.nom_parentesco
  ADD COLUMN inverso NUMERIC(19,0);

/* mod_personaext.nom_parentesco.cant (Unique Source, Fields) */
ALTER TABLE mod_personaext.nom_parentesco
  ADD COLUMN cant NUMERIC(1,0);

/* mod_personaext.nom_parentesco.gestion (Unique Source, Fields) */
ALTER TABLE mod_personaext.nom_parentesco
  ADD COLUMN gestion NUMERIC(1,0) DEFAULT 1;

/* mod_personaext.nom_parentesco.abreviatura (Unique Source, Fields) */
ALTER TABLE mod_personaext.nom_parentesco
  ADD COLUMN abreviatura VARCHAR(5);

COMMENT ON COLUMN mod_personaext.nom_parentesco.abreviatura
IS 'Abreviatura del parentesco';

/* mod_personaext.dat_personaareatematicaempresa (Unique Source, Tables) */
CREATE TABLE mod_personaext.dat_personaareatematicaempresa (
  idpersonaareatematicaempresa NUMERIC(19,0) DEFAULT nextval('mod_personaext.sec_personaareatematicaempresa_seq'::regclass) NOT NULL,
  idpersona VARCHAR(255) NOT NULL,
  idareatematicaempresa VARCHAR(500) DEFAULT 'Sin descripción.'::character varying,
  fdesde DATE DEFAULT now() NOT NULL,
  lugarprocedencia VARCHAR(255),
  CONSTRAINT pk_personaareatematicaempresa PRIMARY KEY(idpersonaareatematicaempresa)
) 
WITH (oids = false);

COMMENT ON TABLE mod_personaext.dat_personaareatematicaempresa
IS 'Almacena los cargos válidos para emplearlos en las organizaciones.';

COMMENT ON COLUMN mod_personaext.dat_personaareatematicaempresa.idpersonaareatematicaempresa
IS 'Identificador del personaarea.';

COMMENT ON COLUMN mod_personaext.dat_personaareatematicaempresa.idpersona
IS 'Denominación delpersonaarea.';

COMMENT ON COLUMN mod_personaext.dat_personaareatematicaempresa.idareatematicaempresa
IS 'Descripción del personaarea.';

COMMENT ON COLUMN mod_personaext.dat_personaareatematicaempresa.fdesde
IS 'Fecha de entrada en vigor del valor personaarea.';

COMMENT ON CONSTRAINT pk_personaareatematicaempresa ON mod_personaext.dat_personaareatematicaempresa
IS 'LLave primaria para identificar la tupla.';

/* mod_personaext.dat_regimentrabajo.idturnotrabajo (Different, Fields) */
/* Different properties: Not Null */
ALTER TABLE mod_personaext.dat_regimentrabajo
  ALTER COLUMN idturnotrabajo DROP NOT NULL;

/* mod_personaext.dat_regimentrabajo.idcargo (Unique Source, Fields) */
ALTER TABLE mod_personaext.dat_regimentrabajo
  ADD COLUMN idcargo NUMERIC(19,0);

COMMENT ON COLUMN mod_personaext.dat_regimentrabajo.idcargo
IS 'Identificador del cargo.';

/* mod_personaext.dat_regimentrabajo.fechainsercion (Unique Source, Fields) */
ALTER TABLE mod_personaext.dat_regimentrabajo
  ADD COLUMN fechainsercion TIMESTAMP WITHOUT TIME ZONE DEFAULT now();

/* mod_personaext.nom_prenda.gestion (Unique Source, Fields) */
ALTER TABLE mod_personaext.nom_prenda
  ADD COLUMN gestion NUMERIC(1,0) DEFAULT 1;

/* mod_personaext.nom_prenda.abreviatura (Unique Source, Fields) */
ALTER TABLE mod_personaext.nom_prenda
  ADD COLUMN abreviatura VARCHAR(5);

COMMENT ON COLUMN mod_personaext.nom_prenda.abreviatura
IS 'Abreviatura de la prenda.';

/* mod_personaext.nom_programaconstructivo (Unique Source, Tables) */
CREATE TABLE mod_personaext.nom_programaconstructivo (
  idprogramaconstructivo NUMERIC(19,0) DEFAULT nextval('mod_personaext.sec_programaconstructivo_seq'::regclass) NOT NULL,
  denominacion VARCHAR(255) NOT NULL,
  descripcion VARCHAR(500),
  fdesde DATE DEFAULT now() NOT NULL,
  fhasta DATE,
  gestion NUMERIC(1,0) DEFAULT 1 NOT NULL,
  abreviatura VARCHAR(60),
  CONSTRAINT pk_programacontructivo PRIMARY KEY(idprogramaconstructivo)
) 
WITH (oids = false);

COMMENT ON COLUMN mod_personaext.nom_programaconstructivo.idprogramaconstructivo
IS 'Identificador de la tabla.';

COMMENT ON COLUMN mod_personaext.nom_programaconstructivo.denominacion
IS 'Denominación del programa constructivo.';

COMMENT ON COLUMN mod_personaext.nom_programaconstructivo.descripcion
IS 'Descripción del programa constructivo.';

COMMENT ON COLUMN mod_personaext.nom_programaconstructivo.fdesde
IS 'Fecha de entrada en vigor del valor nomenclado.';

COMMENT ON COLUMN mod_personaext.nom_programaconstructivo.fhasta
IS 'Fecha en que concluye la vigencia del valor nomenclado.';

COMMENT ON COLUMN mod_personaext.nom_programaconstructivo.gestion
IS 'Indicador de gestión de la información.1- Gestionable, 0- No gestionable.';

/* mod_personaext.dat_reclamacion (Unique Source, Tables) */
CREATE TABLE mod_personaext.dat_reclamacion (
  idreclamacion NUMERIC(19,0) DEFAULT nextval('mod_personaext.sec_reclamacion_seq'::regclass) NOT NULL,
  fechaacuerdo DATE NOT NULL,
  numeroacuerdo NUMERIC(19,0),
  reclamacion VARCHAR(255) NOT NULL,
  nuevaplaza VARCHAR(255) NOT NULL,
  idpersona NUMERIC(19,0) NOT NULL,
  decision VARCHAR(255),
  CONSTRAINT idreclamacion PRIMARY KEY(idreclamacion)
) 
WITH (oids = false);

COMMENT ON TABLE mod_personaext.dat_reclamacion
IS 'Tabla utilizada para registrar las reclamaciones.';

/* mod_personaext.dat_servalojamiento.idestructuraalojamiento (Different, Fields) */
/* Different properties: Name */
ALTER TABLE mod_personaext.dat_servalojamiento
  RENAME COLUMN idestructura TO idestructuraalojamiento;

/* mod_personaext.dat_servtransportacion.idestructuratransportacion (Different, Fields) */
/* Different properties: Name */
ALTER TABLE mod_personaext.dat_servtransportacion
  RENAME COLUMN idestructura TO idestructuratransportacion;

/* mod_personaext.dat_sitexcepcional (Unique Source, Tables) */
CREATE TABLE mod_personaext.dat_sitexcepcional (
  idsitexcepcional NUMERIC(19,0) DEFAULT nextval('mod_personaext.sec_sitexcepcional_seq'::regclass) NOT NULL,
  idsituacexcep NUMERIC(19,0) NOT NULL,
  idcargoexcep NUMERIC(19,0) NOT NULL,
  fdesde DATE DEFAULT now() NOT NULL,
  fhasta DATE,
  idpersona NUMERIC(19,0) NOT NULL,
  CONSTRAINT dat_sitexcepcional_pkey PRIMARY KEY(idsitexcepcional)
) 
WITH (oids = false);

COMMENT ON COLUMN mod_personaext.dat_sitexcepcional.idsitexcepcional
IS 'Identificador de la situación excepcional.';

COMMENT ON COLUMN mod_personaext.dat_sitexcepcional.idsituacexcep
IS 'Identificador de la situación excepcional.';

COMMENT ON COLUMN mod_personaext.dat_sitexcepcional.idcargoexcep
IS 'Identificador del cargo que ocupa la persona en  las situaciones excepcionales.';

/* mod_personaext.nom_situacexcep (Unique Source, Tables) */
CREATE TABLE mod_personaext.nom_situacexcep (
  idsituacexcep NUMERIC(19,0) DEFAULT nextval('mod_personaext.sec_sitexcepcional_seq'::regclass) NOT NULL,
  denominacion VARCHAR(255) NOT NULL,
  fdesde DATE NOT NULL,
  fhasta DATE,
  descripcion VARCHAR(255),
  gestion NUMERIC(1,0) DEFAULT 1,
  abreviatura VARCHAR(5),
  CONSTRAINT pk_situacexcep PRIMARY KEY(idsituacexcep),
  CONSTRAINT chk_gestion_situacexcep CHECK ((gestion = (0)::numeric) OR (gestion = (1)::numeric))
) 
WITH (oids = false);

COMMENT ON COLUMN mod_personaext.nom_situacexcep.abreviatura
IS 'Abreviatura del cargo';

/* mod_personaext.nom_talla.gestion (Unique Source, Fields) */
ALTER TABLE mod_personaext.nom_talla
  ADD COLUMN gestion NUMERIC(1,0) DEFAULT 1;

/* mod_personaext.nom_talla.abreviatura (Unique Source, Fields) */
ALTER TABLE mod_personaext.nom_talla
  ADD COLUMN abreviatura VARCHAR(5);

COMMENT ON COLUMN mod_personaext.nom_talla.abreviatura
IS 'Abreviatura de la talla.';

/* mod_personaext.nom_tipocategoria.gestion (Unique Source, Fields) */
ALTER TABLE mod_personaext.nom_tipocategoria
  ADD COLUMN gestion NUMERIC(1,0) DEFAULT 1;

/* mod_personaext.nom_tipocategoria.abreviatura (Unique Source, Fields) */
ALTER TABLE mod_personaext.nom_tipocategoria
  ADD COLUMN abreviatura VARCHAR(5);

COMMENT ON COLUMN mod_personaext.nom_tipocategoria.abreviatura
IS 'Abreviatura de la organización';

/* mod_personaext.nom_tipocentroestudio.gestion (Unique Source, Fields) */
ALTER TABLE mod_personaext.nom_tipocentroestudio
  ADD COLUMN gestion NUMERIC(1,0) DEFAULT 1;

/* mod_personaext.nom_tipocentroestudio.abreviatura (Unique Source, Fields) */
ALTER TABLE mod_personaext.nom_tipocentroestudio
  ADD COLUMN abreviatura VARCHAR(5);

COMMENT ON COLUMN mod_personaext.nom_tipocentroestudio.abreviatura
IS 'Abreviatura del tipo de centro de estudio.';

/* mod_personaext.nom_tipocondecoracion.gestion (Unique Source, Fields) */
ALTER TABLE mod_personaext.nom_tipocondecoracion
  ADD COLUMN gestion NUMERIC(1,0) DEFAULT 1;

/* mod_personaext.nom_tipocondecoracion.abreviatura (Unique Source, Fields) */
ALTER TABLE mod_personaext.nom_tipocondecoracion
  ADD COLUMN abreviatura VARCHAR(5);

COMMENT ON COLUMN mod_personaext.nom_tipocondecoracion.abreviatura
IS 'Abreviatura del tipo de condecoración.';

/* mod_personaext.nom_tipocuentabancaria.gestion (Unique Source, Fields) */
ALTER TABLE mod_personaext.nom_tipocuentabancaria
  ADD COLUMN gestion NUMERIC(1,0) DEFAULT 1;

/* mod_personaext.nom_tipocuentabancaria.abreviatura (Unique Source, Fields) */
ALTER TABLE mod_personaext.nom_tipocuentabancaria
  ADD COLUMN abreviatura VARCHAR(5);

COMMENT ON COLUMN mod_personaext.nom_tipocuentabancaria.abreviatura
IS 'Abreviatura del tipo de cuenta bancaria';

/* mod_personaext.nom_tipoestanciaexterior.gestion (Unique Source, Fields) */
ALTER TABLE mod_personaext.nom_tipoestanciaexterior
  ADD COLUMN gestion NUMERIC(1,0) DEFAULT 1;

/* mod_personaext.nom_tipoestanciaexterior.abreviatura (Unique Source, Fields) */
ALTER TABLE mod_personaext.nom_tipoestanciaexterior
  ADD COLUMN abreviatura VARCHAR(5);

COMMENT ON COLUMN mod_personaext.nom_tipoestanciaexterior.abreviatura
IS 'Abreviatura del tipo de estancia en el exterior.';

/* mod_personaext.nom_tipoformacion.gestion (Unique Source, Fields) */
ALTER TABLE mod_personaext.nom_tipoformacion
  ADD COLUMN gestion NUMERIC(1,0) DEFAULT 1;

/* mod_personaext.nom_tipoformacion.abreviatura (Unique Source, Fields) */
ALTER TABLE mod_personaext.nom_tipoformacion
  ADD COLUMN abreviatura VARCHAR(60);

/* mod_personaext.nom_tipoingreso (Unique Source, Tables) */
CREATE TABLE mod_personaext.nom_tipoingreso (
  idtipoingreso NUMERIC(19,0) DEFAULT nextval('mod_personaext.sec_tipoingreso_seq'::regclass) NOT NULL,
  denominacion VARCHAR(100) NOT NULL,
  descripcion VARCHAR(255),
  fdesde DATE DEFAULT now() NOT NULL,
  fhasta DATE,
  gestion NUMERIC(1,0) DEFAULT 1,
  abreviatura VARCHAR(5),
  CONSTRAINT pk_tipoingreso PRIMARY KEY(idtipoingreso),
  CONSTRAINT chk_gestion_tipoingreso CHECK ((gestion = (0)::numeric) OR (gestion = (1)::numeric))
) 
WITH (oids = false);

COMMENT ON COLUMN mod_personaext.nom_tipoingreso.abreviatura
IS 'Abreviatura del tipo de ingreso';

/* mod_personaext.nom_tipomision.gestion (Unique Source, Fields) */
ALTER TABLE mod_personaext.nom_tipomision
  ADD COLUMN gestion NUMERIC(1,0) DEFAULT 1;

/* mod_personaext.nom_tipomision.abreviatura (Unique Source, Fields) */
ALTER TABLE mod_personaext.nom_tipomision
  ADD COLUMN abreviatura VARCHAR(5);

COMMENT ON COLUMN mod_personaext.nom_tipomision.abreviatura
IS 'Abreviatura del tipo de misión.';

/* mod_personaext.nom_tipoorganizacion.gestion (Unique Source, Fields) */
ALTER TABLE mod_personaext.nom_tipoorganizacion
  ADD COLUMN gestion NUMERIC(1,0) DEFAULT 1;

/* mod_personaext.nom_tipoorganizacion.abreviatura (Unique Source, Fields) */
ALTER TABLE mod_personaext.nom_tipoorganizacion
  ADD COLUMN abreviatura VARCHAR(5);

COMMENT ON COLUMN mod_personaext.nom_tipoorganizacion.abreviatura
IS 'Abreviatura de la organización';

/* mod_personaext.nom_tiposancion.codigo (Unique Source, Fields) */
ALTER TABLE mod_personaext.nom_tiposancion
  ADD COLUMN codigo NUMERIC(3,0);

COMMENT ON COLUMN mod_personaext.nom_tiposancion.codigo
IS 'Codigo unico para identificar el tipo de sanción
1-Judiciales
2-Politicas
3-Administrativas';

/* mod_personaext.nom_tiposancion.gestion (Unique Source, Fields) */
ALTER TABLE mod_personaext.nom_tiposancion
  ADD COLUMN gestion NUMERIC(1,0) DEFAULT 1;

/* mod_personaext.nom_tiposancion.abreviatura (Unique Source, Fields) */
ALTER TABLE mod_personaext.nom_tiposancion
  ADD COLUMN abreviatura VARCHAR(5);

COMMENT ON COLUMN mod_personaext.nom_tiposancion.abreviatura
IS 'Abreviatura del tipo de sanción.';

/* mod_personaext.his_trayectoriaentidad (Unique Source, Tables) */
CREATE TABLE mod_personaext.his_trayectoriaentidad (
  idtrayectoriaentidad NUMERIC(19,0) DEFAULT nextval('mod_personaext.sec_trayectoriaentidad_seq'::regclass) NOT NULL,
  idpersona NUMERIC(19,0) NOT NULL,
  entidad VARCHAR(250) NOT NULL,
  fdesde DATE NOT NULL,
  fhasta DATE NOT NULL,
  observacion VARCHAR(500),
  idpersonaentidad NUMERIC(19,0),
  CONSTRAINT pk_trayectoriaentidad PRIMARY KEY(idtrayectoriaentidad)
) 
WITH (oids = false);

COMMENT ON COLUMN mod_personaext.his_trayectoriaentidad.idtrayectoriaentidad
IS 'Identificador de la trayectoria.';

COMMENT ON COLUMN mod_personaext.his_trayectoriaentidad.idpersona
IS 'Identificador de la persona.';

COMMENT ON COLUMN mod_personaext.his_trayectoriaentidad.entidad
IS 'Denominación de la entidad.';

COMMENT ON COLUMN mod_personaext.his_trayectoriaentidad.fdesde
IS 'Fecha en que inicia la relación de la persona con la entidad.';

COMMENT ON COLUMN mod_personaext.his_trayectoriaentidad.fhasta
IS 'Fecha en que la persona concluye la relación con la entidad.';

COMMENT ON COLUMN mod_personaext.his_trayectoriaentidad.observacion
IS 'Observación';

COMMENT ON COLUMN mod_personaext.his_trayectoriaentidad.idpersonaentidad
IS 'Identificador de la relación Persona-Entidad. Cuando tiene valor es que se actualizó el registro desde Movimientos laborales (Fuerza de trabajo). En caso de ser nulo es que se registró manualmente.';

/* mod_personaext.his_trayectorialaboral (Unique Source, Tables) */
CREATE TABLE mod_personaext.his_trayectorialaboral (
  idtrayectorialaboral NUMERIC(19,0) DEFAULT nextval('mod_personaext.sec_trayectorialaboral_seq'::regclass) NOT NULL,
  idpersona NUMERIC(19,0) NOT NULL,
  orgentidad VARCHAR(500) DEFAULT 'NO CONOCIDO'::character varying,
  cargo VARCHAR(255) DEFAULT 'NO CONOCIDO'::character varying,
  fdesde DATE NOT NULL,
  fhasta DATE,
  observacion VARCHAR(255),
  noalta VARCHAR(20),
  falta DATE,
  fbaja DATE,
  motivobaja NUMERIC(19,0),
  idsituacionlaboral NUMERIC(19,0),
  categocup VARCHAR(255),
  CONSTRAINT pk_histrayectorialaboral PRIMARY KEY(idtrayectorialaboral)
) 
WITH (oids = false);

COMMENT ON TABLE mod_personaext.his_trayectorialaboral
IS 'Tabla que almacena los datos de la trayectoria laboral.';

COMMENT ON COLUMN mod_personaext.his_trayectorialaboral.idtrayectorialaboral
IS 'Identificador de la tabla.';

COMMENT ON COLUMN mod_personaext.his_trayectorialaboral.idpersona
IS 'Identificador de la persona.';

COMMENT ON COLUMN mod_personaext.his_trayectorialaboral.orgentidad
IS 'Denominación compuesta por el Organismo, Entidad y Área a la que perteneció la persona.';

COMMENT ON COLUMN mod_personaext.his_trayectorialaboral.cargo
IS 'Cargo que ocupó la persona.';

COMMENT ON COLUMN mod_personaext.his_trayectorialaboral.fdesde
IS 'Fecha en que la persona inicia en el cargo de la trayectoria.';

COMMENT ON COLUMN mod_personaext.his_trayectorialaboral.observacion
IS 'Observación asociada a la trayectoria.';

COMMENT ON COLUMN mod_personaext.his_trayectorialaboral.noalta
IS 'Número de alta, resolución, etc. que aprueba el cargo ocupado por la persona';

COMMENT ON COLUMN mod_personaext.his_trayectorialaboral.falta
IS 'Fecha de alta en la entidad.';

COMMENT ON COLUMN mod_personaext.his_trayectorialaboral.fbaja
IS 'Fecha de baja de la entidad.';

COMMENT ON COLUMN mod_personaext.his_trayectorialaboral.idsituacionlaboral
IS 'Identificador de la situacion laboral de la persona.';

/* mod_personaext.dat_aseo (Unique Source, Tables) */
CREATE TABLE mod_personaext.dat_aseo (
  idaseop NUMERIC(19,0) DEFAULT nextval('mod_personaext.sec_dataseo_seq'::regclass) NOT NULL,
  idaseo NUMERIC(19,0) NOT NULL,
  fdesde DATE NOT NULL,
  fhasta DATE,
  idpersona NUMERIC(19,0) NOT NULL,
  CONSTRAINT idaseop PRIMARY KEY(idaseop)
) 
WITH (oids = false);

/* mod_personaext.dat_situaciondefensa (Unique Source, Tables) */
CREATE TABLE mod_personaext.dat_situaciondefensa (
  idasignaciondefensa NUMERIC(19,0) NOT NULL,
  idcargodefensa NUMERIC(19,0),
  fhasta DATE,
  fdesde DATE,
  idsituaciondefensa NUMERIC(19,0) DEFAULT nextval('mod_personaext.sec_situaciondefensa_seq'::regclass) NOT NULL,
  idpersona NUMERIC(19,0) NOT NULL,
  CONSTRAINT pk_situaciondefensa PRIMARY KEY(idsituaciondefensa)
) 
WITH (oids = false);

CREATE INDEX fki_asignaciondefensa_situaciondefensa ON mod_personaext.dat_situaciondefensa
  USING btree (idasignaciondefensa);

/* mod_personaext.dat_limitacion.idsituacionlaboral (Unique Source, Fields) */
ALTER TABLE mod_personaext.dat_limitacion
  ADD COLUMN idsituacionlaboral NUMERIC(19,0) NOT NULL;

COMMENT ON COLUMN mod_personaext.dat_limitacion.idsituacionlaboral
IS 'Identificador de la situación laboral.';

/* mod_personaext.dat_estadovivienda (Unique Source, Tables) */
CREATE TABLE mod_personaext.dat_estadovivienda (
  idestadoviviendap NUMERIC(19,0) DEFAULT nextval('mod_personaext.sec_estadoviviendap_seq'::regclass) NOT NULL,
  idpersona NUMERIC(19,0) NOT NULL,
  idestadovivienda NUMERIC(19,0) NOT NULL,
  idconvivencia NUMERIC(19,0) NOT NULL,
  CONSTRAINT pk_estadoviviendap PRIMARY KEY(idestadoviviendap)
) 
WITH (oids = false);

/* mod_personaext.dat_caracteristicasocial.jubilado (Unique Source, Fields) */
ALTER TABLE mod_personaext.dat_caracteristicasocial
  ADD COLUMN jubilado NUMERIC(1,0) DEFAULT 0 NOT NULL;

COMMENT ON COLUMN mod_personaext.dat_caracteristicasocial.jubilado
IS 'Establece si la persona es jubilada(1) o no(0).';

/* mod_personaext.dat_caracteristicasocial.iddisposicion (Unique Source, Fields) */
ALTER TABLE mod_personaext.dat_caracteristicasocial
  ADD COLUMN iddisposicion NUMERIC(19,0);

COMMENT ON COLUMN mod_personaext.dat_caracteristicasocial.iddisposicion
IS 'Identificador de la disposición que establece la jubilaciín de la persona.';

/* mod_personaext.dat_caracteristicasocial.fk_estadocivil_caracteristicasocial (Different, Foreign keys) */
/* Different properties: Description */
COMMENT ON CONSTRAINT fk_estadocivil_caracteristicasocial ON mod_personaext.dat_caracteristicasocial
IS 'LLave foránea para identificar la relación y garantizar la integridad referencial entre las tablas (nom_estadocivil y dat_caracteristicasocial).';

/* mod_personaext.dat_caracteristicasocial.fk_estratificacionsocial_caracteristicasocial (Different, Foreign keys) */
/* Different properties: Description */
COMMENT ON CONSTRAINT fk_estratificacionsocial_caracteristicasocial ON mod_personaext.dat_caracteristicasocial
IS 'LLave foránea para identificar la relación y garantizar la integridad referencial entre las tablas (nom_estratificacionsocial y dat_caracteristicasocial).';

/* mod_personaext.dat_servalimentacion.idestalimentacion (Unique Source, Fields) */
ALTER TABLE mod_personaext.dat_servalimentacion
  ADD COLUMN idestalimentacion NUMERIC(19,0) NOT NULL;

COMMENT ON COLUMN mod_personaext.dat_servalimentacion.idestalimentacion
IS 'Identificador de la estructura de alimentación.';

/* mod_personaext.dat_idioma.fk_formaadquiriridioma_idioma (Different, Foreign keys) */
/* Different properties: Description */
COMMENT ON CONSTRAINT fk_formaadquiriridioma_idioma ON mod_personaext.dat_idioma
IS 'LLave foránea para identificar la relación y garantizar la integridad referencial entre las tablas (nom_formaadquiriridioma y dat_idioma).';

/* mod_personaext.dat_idioma.fk_idioma_idioma (Different, Foreign keys) */
/* Different properties: Description */
COMMENT ON CONSTRAINT fk_idioma_idioma ON mod_personaext.dat_idioma
IS 'LLave foránea para identificar la relación y garantizar la integridad referencial entre las tablas (nom_idioma y dat_idioma).';

/* mod_personaext.dat_personamedio (Unique Source, Tables) */
CREATE TABLE mod_personaext.dat_personamedio (
  idpersonamedio NUMERIC(19,0) DEFAULT nextval('mod_personaext.sec_personamedio_seq'::regclass) NOT NULL,
  idasignacion NUMERIC(19,0) NOT NULL,
  idmedio NUMERIC(19,0) NOT NULL,
  idpersona NUMERIC(19,0) NOT NULL,
  serie VARCHAR(20),
  fdesde DATE DEFAULT now() NOT NULL,
  fhasta DATE,
  CONSTRAINT pk_personamedio PRIMARY KEY(idpersonamedio)
) 
WITH (oids = false);

COMMENT ON COLUMN mod_personaext.dat_personamedio.idpersonamedio
IS 'Identificador de la tupla.';

COMMENT ON COLUMN mod_personaext.dat_personamedio.idasignacion
IS 'Identificador del tipo de asignación del medio.';

COMMENT ON COLUMN mod_personaext.dat_personamedio.idmedio
IS 'Identificador del medio.';

COMMENT ON COLUMN mod_personaext.dat_personamedio.idpersona
IS 'Identificador de la persona.';

COMMENT ON COLUMN mod_personaext.dat_personamedio.serie
IS 'Codificación, matrícula o número de serie del medio asociado a la persona.';

COMMENT ON COLUMN mod_personaext.dat_personamedio.fdesde
IS 'Fecha en la que se le asigna el medio a la persona.';

COMMENT ON COLUMN mod_personaext.dat_personamedio.fhasta
IS 'Fecha en la que se le retira el medio a la persona.';

/* mod_personaext.nom_titulo.gestion (Unique Source, Fields) */
ALTER TABLE mod_personaext.nom_titulo
  ADD COLUMN gestion NUMERIC(1,0) DEFAULT 1;

/* mod_personaext.nom_titulo.idpadre (Unique Source, Fields) */
ALTER TABLE mod_personaext.nom_titulo
  ADD COLUMN idpadre NUMERIC(19,0);

/* mod_personaext.nom_titulo.abreviatura (Unique Source, Fields) */
ALTER TABLE mod_personaext.nom_titulo
  ADD COLUMN abreviatura VARCHAR(10);

COMMENT ON COLUMN mod_personaext.nom_titulo.abreviatura
IS 'Abreviatura del título';

/* mod_personaext.dat_huella (Unique Source, Tables) */
CREATE TABLE mod_personaext.dat_huella (
  idhuella NUMERIC(19,0) DEFAULT nextval('mod_personaext.sec_huella_seq'::regclass) NOT NULL,
  iddedo NUMERIC(19,0) NOT NULL,
  idpersona NUMERIC(19,0) NOT NULL,
  imagen BYTEA,
  minutia BYTEA,
  calidad NUMERIC(3,0),
  fdesde DATE DEFAULT now(),
  visitante NUMERIC(1,0) DEFAULT 0 NOT NULL,
  CONSTRAINT dat_huella_pkey PRIMARY KEY(idhuella)
) 
WITH (oids = false);

COMMENT ON COLUMN mod_personaext.dat_huella.idhuella
IS 'Identificador de la tabla.';

COMMENT ON COLUMN mod_personaext.dat_huella.iddedo
IS 'Identificador del dedo.';

COMMENT ON COLUMN mod_personaext.dat_huella.idpersona
IS 'Identificador de la persona.';

COMMENT ON COLUMN mod_personaext.dat_huella.imagen
IS 'Imagen de la huella capturada por el lector.';

COMMENT ON COLUMN mod_personaext.dat_huella.minutia
IS 'Alamcena las minucias de la huella dactilar de la persona.';

COMMENT ON COLUMN mod_personaext.dat_huella.calidad
IS 'Almacena la calidad de la captura de la imagen.';

COMMENT ON COLUMN mod_personaext.dat_huella.fdesde
IS 'Almacena la fecha de registro de captura de la(s) huella(s) de la persona.';

COMMENT ON COLUMN mod_personaext.dat_huella.visitante
IS '0-plantilla
	1-visitante';

/* mod_personaext.dat_familiar (Different, Tables) */
/* Different properties: Description */
COMMENT ON TABLE mod_personaext.dat_familiar
IS 'Almacena los datos de familiares de la persona.';

/* mod_personaext.dat_familiar.idfamiliar (Different, Fields) */
/* Different properties: Description */
COMMENT ON COLUMN mod_personaext.dat_familiar.idfamiliar
IS 'Identificador del familiar de la persona.';

/* mod_personaext.dat_familiar.numid (Different, Fields) */
/* Different properties: Description, Size */
COMMENT ON COLUMN mod_personaext.dat_familiar.numid
IS 'Número de identidad del familiar.';

ALTER TABLE mod_personaext.dat_familiar
  ALTER COLUMN numid TYPE VARCHAR(50) COLLATE pg_catalog."default";

/* mod_personaext.dat_familiar.nombre (Different, Fields) */
/* Different properties: Description */
COMMENT ON COLUMN mod_personaext.dat_familiar.nombre
IS 'Nombres y apellidos del familiar.';

/* mod_personaext.dat_familiar.idsiun (Unique Source, Fields) */
ALTER TABLE mod_personaext.dat_familiar
  ADD COLUMN idsiun VARCHAR(36);

COMMENT ON COLUMN mod_personaext.dat_familiar.idsiun
IS 'Identificador del sistema único de identificación nacional.';

/* mod_personaext.dat_familiar.idparentesco (Different, Fields) */
/* Different properties: Description, Size */
COMMENT ON COLUMN mod_personaext.dat_familiar.idparentesco
IS 'Identificador del parentesco del familiar con la persona.';

ALTER TABLE mod_personaext.dat_familiar
  ALTER COLUMN idparentesco TYPE NUMERIC(19,0);

/* mod_personaext.dat_familiar.allegado (Unique Source, Fields) */
ALTER TABLE mod_personaext.dat_familiar
  ADD COLUMN allegado NUMERIC(1,0) DEFAULT 1 NOT NULL;

COMMENT ON COLUMN mod_personaext.dat_familiar.allegado
IS 'Determina si el familiar es allegado o no a la persona. 0-> No es allegado, 1-> Es allegado.';

/* mod_personaext.dat_familiar.conviven (Unique Source, Fields) */
ALTER TABLE mod_personaext.dat_familiar
  ADD COLUMN conviven NUMERIC(1,0) DEFAULT 0 NOT NULL;

COMMENT ON COLUMN mod_personaext.dat_familiar.conviven
IS 'Determina si el familiar convive con la persona. 0-> No convive, 1-> Convive.';

/* mod_personaext.dat_familiar.idpersona (Different, Fields) */
/* Different properties: Description */
COMMENT ON COLUMN mod_personaext.dat_familiar.idpersona
IS '';

/* mod_personaext.dat_familiar.fnacimineto (Unique Source, Fields) */
ALTER TABLE mod_personaext.dat_familiar
  ADD COLUMN fnacimineto VARCHAR(20);

COMMENT ON COLUMN mod_personaext.dat_familiar.fnacimineto
IS 'Fecha de nacimiento del familiar';

/* mod_personaext.dat_familiar.centrotrabajo (Unique Source, Fields) */
ALTER TABLE mod_personaext.dat_familiar
  ADD COLUMN centrotrabajo VARCHAR(100);

COMMENT ON COLUMN mod_personaext.dat_familiar.centrotrabajo
IS 'Centro de trabajo o estudio del familiar';

/* mod_personaext.dat_familiar.idorganizacion (Unique Source, Fields) */
ALTER TABLE mod_personaext.dat_familiar
  ADD COLUMN idorganizacion VARCHAR(250);

/* mod_personaext.dat_familiar.observaciones (Unique Source, Fields) */
ALTER TABLE mod_personaext.dat_familiar
  ADD COLUMN observaciones VARCHAR(255);

/* mod_personaext.dat_familiar.pk_familiar (Different, Indices) */
/* Different properties: Description */
COMMENT ON CONSTRAINT pk_familiar ON mod_personaext.dat_familiar
IS 'Llave primaria de la tabla "dat_fa,miliar"';

/* mod_personaext.conf_tallaje (Unique Source, Tables) */
CREATE TABLE mod_personaext.conf_tallaje (
  idconftallaje NUMERIC(19,0) DEFAULT nextval('mod_personaext.sec_conftallaje_seq'::regclass) NOT NULL,
  idprenda NUMERIC(19,0) NOT NULL,
  idnorma NUMERIC(19,0) NOT NULL,
  idtalla NUMERIC(19,0) NOT NULL,
  CONSTRAINT pk_conftallaje PRIMARY KEY(idconftallaje)
) 
WITH (oids = false);

COMMENT ON TABLE mod_personaext.conf_tallaje
IS 'Almacena la configuración de la prenda, talla y norma.';

COMMENT ON COLUMN mod_personaext.conf_tallaje.idconftallaje
IS 'Identificador de la configuración del tallaje.';

COMMENT ON COLUMN mod_personaext.conf_tallaje.idprenda
IS 'Identificador de la prenda.';

COMMENT ON COLUMN mod_personaext.conf_tallaje.idnorma
IS 'Identificador de la norma.';

COMMENT ON COLUMN mod_personaext.conf_tallaje.idtalla
IS 'Identificador de la talla.';

COMMENT ON CONSTRAINT pk_conftallaje ON mod_personaext.conf_tallaje
IS 'LLave primaria para identificar la tupla.';

/* mod_personaext.nom_categoria.gestion (Unique Source, Fields) */
ALTER TABLE mod_personaext.nom_categoria
  ADD COLUMN gestion NUMERIC(1,0) DEFAULT 1;

/* mod_personaext.nom_categoria.abreviatura (Unique Source, Fields) */
ALTER TABLE mod_personaext.nom_categoria
  ADD COLUMN abreviatura VARCHAR(5);

COMMENT ON COLUMN mod_personaext.nom_categoria.abreviatura
IS 'Abreviatura de la organización';

/* mod_personaext.nom_centroestudio.gestion (Unique Source, Fields) */
ALTER TABLE mod_personaext.nom_centroestudio
  ADD COLUMN gestion NUMERIC(1,0) DEFAULT 1;

/* mod_personaext.nom_centroestudio.abreviatura (Unique Source, Fields) */
ALTER TABLE mod_personaext.nom_centroestudio
  ADD COLUMN abreviatura VARCHAR(5);

COMMENT ON COLUMN mod_personaext.nom_centroestudio.abreviatura
IS 'Abreviatura del centro de estudio.';

/* mod_personaext.nom_condecoracion.gestion (Unique Source, Fields) */
ALTER TABLE mod_personaext.nom_condecoracion
  ADD COLUMN gestion NUMERIC(1,0) DEFAULT 1;

/* mod_personaext.nom_condecoracion.abreviatura (Unique Source, Fields) */
ALTER TABLE mod_personaext.nom_condecoracion
  ADD COLUMN abreviatura VARCHAR(5);

COMMENT ON COLUMN mod_personaext.nom_condecoracion.abreviatura
IS 'Abreviatura de la condecoración.';

/* mod_personaext.dat_cuentabancaria.idtipoacreditacionsalario (Unique Source, Fields) */
ALTER TABLE mod_personaext.dat_cuentabancaria
  ADD COLUMN idtipoacreditacionsalario NUMERIC(3,0);

COMMENT ON COLUMN mod_personaext.dat_cuentabancaria.idtipoacreditacionsalario
IS 'Codigo de la cuenta bancaria. 1- CI, 2-CM, 3-CP.';

/* mod_personaext.dat_cuentabancaria.codtipoid (Unique Source, Fields) */
ALTER TABLE mod_personaext.dat_cuentabancaria
  ADD COLUMN codtipoid NUMERIC(2,0) DEFAULT 1 NOT NULL;

COMMENT ON COLUMN mod_personaext.dat_cuentabancaria.codtipoid
IS 'Codigo de la cuenta bancaria. 1- CI, 2-CM, 3-CP.';

/* mod_personaext.dat_cuentabancaria.migrado (Unique Source, Fields) */
ALTER TABLE mod_personaext.dat_cuentabancaria
  ADD COLUMN migrado INTEGER;

/* mod_personaext.nom_mision.gestion (Unique Source, Fields) */
ALTER TABLE mod_personaext.nom_mision
  ADD COLUMN gestion NUMERIC(1,0) DEFAULT 1;

/* mod_personaext.nom_mision.abreviatura (Unique Source, Fields) */
ALTER TABLE mod_personaext.nom_mision
  ADD COLUMN abreviatura VARCHAR(5);

COMMENT ON COLUMN mod_personaext.nom_mision.abreviatura
IS 'Abreviatura de la misión.';

/* mod_personaext.nom_organizacion.gestion (Unique Source, Fields) */
ALTER TABLE mod_personaext.nom_organizacion
  ADD COLUMN gestion NUMERIC(1,0) DEFAULT 1;

/* mod_personaext.nom_organizacion.abreviatura (Unique Source, Fields) */
ALTER TABLE mod_personaext.nom_organizacion
  ADD COLUMN abreviatura VARCHAR(10);

COMMENT ON COLUMN mod_personaext.nom_organizacion.abreviatura
IS 'Abreviatura de la organización';

/* mod_personaext.nom_sancion.gestion (Unique Source, Fields) */
ALTER TABLE mod_personaext.nom_sancion
  ADD COLUMN gestion NUMERIC(1,0) DEFAULT 1;

/* mod_personaext.nom_sancion.abreviatura (Unique Source, Fields) */
ALTER TABLE mod_personaext.nom_sancion
  ADD COLUMN abreviatura VARCHAR(5);

COMMENT ON COLUMN mod_personaext.nom_sancion.abreviatura
IS 'Abreviatura de la sanción.';

/* mod_personaext.his_trayectoriacargo (Unique Source, Tables) */
CREATE TABLE mod_personaext.his_trayectoriacargo (
  idtrayectoriacargo NUMERIC(19,0) NOT NULL,
  idpersona NUMERIC(19,0) NOT NULL,
  idtrayectoriaentidad NUMERIC(19,0) NOT NULL,
  cargo VARCHAR(255) NOT NULL,
  fdesde DATE NOT NULL,
  fhasta DATE,
  motivo VARCHAR(255),
  observacion VARCHAR(500),
  CONSTRAINT pk_trayectoriacargo PRIMARY KEY(idtrayectoriacargo)
) 
WITH (oids = false);

COMMENT ON COLUMN mod_personaext.his_trayectoriacargo.idtrayectoriacargo
IS 'Identificador de la trayectoria en cargos.';

COMMENT ON COLUMN mod_personaext.his_trayectoriacargo.idpersona
IS 'Identificador de la persona.';

COMMENT ON COLUMN mod_personaext.his_trayectoriacargo.idtrayectoriaentidad
IS 'Identificador de la entidad en trayectoria.';

COMMENT ON COLUMN mod_personaext.his_trayectoriacargo.cargo
IS 'Denominación del cargo.';

COMMENT ON COLUMN mod_personaext.his_trayectoriacargo.fdesde
IS 'Fecha en que la persona comienza a ocupar el cargo.';

COMMENT ON COLUMN mod_personaext.his_trayectoriacargo.fhasta
IS 'Fecha en que la persona termina de ocupar el cargo.';

COMMENT ON COLUMN mod_personaext.his_trayectoriacargo.motivo
IS 'Motivo por el cual la persona deja de ocupar el cargo.';

COMMENT ON COLUMN mod_personaext.his_trayectoriacargo.observacion
IS 'Observaciones relacionadas a la ocupación del cargo.';

/* mod_personaext.dat_niveleducacional (Unique Source, Tables) */
CREATE TABLE mod_personaext.dat_niveleducacional (
  idniveleducacionalp NUMERIC(19,0) DEFAULT nextval('mod_personaext.sec_niveleducacionalp_seq'::regclass) NOT NULL,
  descripcion VARCHAR(500) DEFAULT 'Sin descripción.'::character varying,
  fdesde DATE DEFAULT now() NOT NULL,
  idniveleducacional NUMERIC(19,0) NOT NULL,
  idpersona NUMERIC(19,0) NOT NULL,
  idtitulo NUMERIC(19,0),
  CONSTRAINT pk_idniveleducacionalp PRIMARY KEY(idniveleducacionalp)
) 
WITH (oids = false);

COMMENT ON COLUMN mod_personaext.dat_niveleducacional.idniveleducacionalp
IS 'Identificador del la tabla.';

COMMENT ON COLUMN mod_personaext.dat_niveleducacional.descripcion
IS 'Descripción del título.';

COMMENT ON COLUMN mod_personaext.dat_niveleducacional.fdesde
IS 'Fecha de entrada en vigor del valor nomenclado.';

COMMENT ON COLUMN mod_personaext.dat_niveleducacional.idniveleducacional
IS 'Identificador del nivel educacional.';

COMMENT ON COLUMN mod_personaext.dat_niveleducacional.idpersona
IS 'Identificador de la persona.';

COMMENT ON COLUMN mod_personaext.dat_niveleducacional.idtitulo
IS 'Identificador del título';

COMMENT ON CONSTRAINT fk_persona_niveleducacionalp ON mod_personaext.dat_niveleducacional
IS 'LLave foránea para identificar la relación y garantizar la integridad referencial entre las tablas. (dat_persona y dat_niveleducacional).';

CREATE INDEX idx_idniveleducacional_niveleducacionalp ON mod_personaext.dat_niveleducacional
  USING btree (idniveleducacional);

COMMENT ON INDEX mod_personaext.idx_idniveleducacional_niveleducacionalp
IS 'Índice sobre la(s) columna(s) "idniveleducacional" para agilizar la búsqueda de información.';

COMMENT ON CONSTRAINT pk_idniveleducacionalp ON mod_personaext.dat_niveleducacional
IS 'LLave primaria para identificar la tupla.';

/* mod_personaext.dat_ingreso (Unique Source, Tables) */
CREATE TABLE mod_personaext.dat_ingreso (
  idingreso NUMERIC(19,0) DEFAULT nextval('mod_personaext.sec_ingreso_seq'::regclass) NOT NULL,
  idpersona NUMERIC(19,0) NOT NULL,
  idfamiliar NUMERIC(19,0),
  idtipoingreso NUMERIC(19,0) NOT NULL,
  idmoneda NUMERIC(19,0) NOT NULL,
  cuantia NUMERIC(19,0) NOT NULL,
  CONSTRAINT pk_ingreso PRIMARY KEY(idingreso)
) 
WITH (oids = false);

CREATE INDEX fki_familiar_ingreso ON mod_personaext.dat_ingreso
  USING btree (idfamiliar);

CREATE INDEX fki_tipoingreso_ingreso ON mod_personaext.dat_ingreso
  USING btree (idtipoingreso);

/* mod_personaext.dat_familiarexterior (Unique Source, Tables) */
CREATE TABLE mod_personaext.dat_familiarexterior (
  idfamiliarexterior NUMERIC(11,0) DEFAULT nextval('mod_personaext.sec_familiarexterior_seq'::regclass) NOT NULL,
  idpais NUMERIC(11,0),
  idfamiliar NUMERIC(11,0),
  fdesde DATE,
  fhasta DATE,
  idpersona NUMERIC(11,0),
  CONSTRAINT pk_idfamiliarexterior PRIMARY KEY(idfamiliarexterior)
) 
WITH (oids = false);

/* mod_personaext.dat_familiarresidente (Unique Source, Tables) */
CREATE TABLE mod_personaext.dat_familiarresidente (
  idfamiliarresidente NUMERIC(11,0) DEFAULT nextval('mod_personaext.sec_familiarresidente_seq'::regclass) NOT NULL,
  idpais NUMERIC(11,0) NOT NULL,
  idfamiliar NUMERIC(11,0) NOT NULL,
  idnacionalidad NUMERIC(11,0) NOT NULL,
  fdesde DATE NOT NULL,
  fhasta DATE,
  idpersona NUMERIC(11,0),
  CONSTRAINT pk_idfamiliarresidente PRIMARY KEY(idfamiliarresidente)
) 
WITH (oids = false);

/* mod_personaext.dat_familiarviaje (Unique Source, Tables) */
CREATE TABLE mod_personaext.dat_familiarviaje (
  idfamiliarviaje NUMERIC(11,0) DEFAULT nextval('mod_personaext.sec_familiarviaje_seq'::regclass) NOT NULL,
  fdesde DATE,
  fhasta DATE,
  idpais NUMERIC(11,0),
  idfamiliar NUMERIC(11,0),
  idpersona NUMERIC(11,0),
  CONSTRAINT pk_idfamiliarviaje PRIMARY KEY(idfamiliarviaje)
) 
WITH (oids = false);

COMMENT ON TABLE mod_personaext.dat_familiarviaje
IS 'Familiar o persona que halla relizado viajes al extranjero';

COMMENT ON COLUMN mod_personaext.dat_familiarviaje.idfamiliarviaje
IS 'Indtificador de la entidad';

COMMENT ON COLUMN mod_personaext.dat_familiarviaje.fdesde
IS 'Fecha de salida';

COMMENT ON COLUMN mod_personaext.dat_familiarviaje.fhasta
IS 'Fecha de regreso';

COMMENT ON COLUMN mod_personaext.dat_familiarviaje.idpais
IS 'Pais de visita';

COMMENT ON COLUMN mod_personaext.dat_familiarviaje.idfamiliar
IS 'Identtificador del familiar';

COMMENT ON COLUMN mod_personaext.dat_familiarviaje.idpersona
IS 'Identificador de la persona';

/* mod_personaext.dat_categorizacion.fk_categoria_categorizacion (Different, Foreign keys) */
/* Different properties: Description */
COMMENT ON CONSTRAINT fk_categoria_categorizacion ON mod_personaext.dat_categorizacion
IS 'LLave foránea para identificar la relación y garantizar la integridad referencial entre las tablas. (dat_categorizacion y nom_categoria).';

/* mod_personaext.dat_educacion.fk_centroestudio_educacion (Different, Foreign keys) */
/* Different properties: Description */
COMMENT ON CONSTRAINT fk_centroestudio_educacion ON mod_personaext.dat_educacion
IS 'LLave foránea para identificar la relación y garantizar la integridad referencial entre las tablas (nom_centroestudio y dat_educacion).';

/* mod_personaext.nom_facultadestudio.gestion (Unique Source, Fields) */
ALTER TABLE mod_personaext.nom_facultadestudio
  ADD COLUMN gestion NUMERIC(1,0) DEFAULT 1;

/* mod_personaext.nom_facultadestudio.abreviatura (Unique Source, Fields) */
ALTER TABLE mod_personaext.nom_facultadestudio
  ADD COLUMN abreviatura VARCHAR(5);

COMMENT ON COLUMN mod_personaext.nom_facultadestudio.abreviatura
IS 'Abreviatura de la organización';

/* mod_personaext.dat_condecoracion.fk_condecoracion_condecoracion (Different, Foreign keys) */
/* Different properties: Description */
COMMENT ON CONSTRAINT fk_condecoracion_condecoracion ON mod_personaext.dat_condecoracion
IS 'LLave foránea para identificar la relación y garantizar la integridad referencial entre las tablas (nom_condecoracion y dat_condecoracion).';

/* mod_personaext.dat_condecoracion.fk_motivocondecoracion_condecoracion (Different, Foreign keys) */
/* Different properties: Description */
COMMENT ON CONSTRAINT fk_motivocondecoracion_condecoracion ON mod_personaext.dat_condecoracion
IS 'LLave foránea para identificar la relación y garantizar la integridad referencial entre las tablas (nom_motivocondecoracion y dat_condecoracion).';

/* mod_personaext.dat_afiliacion.fk_organizacion_afiliacion (Different, Foreign keys) */
/* Different properties: Description */
COMMENT ON CONSTRAINT fk_organizacion_afiliacion ON mod_personaext.dat_afiliacion
IS 'LLave foránea para identificar la relación y garantizar la integridad referencial entre las tablas (nom_organizacion y dat_afiliacion).';

/* mod_personaext.dat_familiarsancionado (Unique Source, Tables) */
CREATE TABLE mod_personaext.dat_familiarsancionado (
  idfamiliarsancionado NUMERIC(11,0) DEFAULT nextval('mod_personaext.sec_familiarsancionado_seq'::regclass) NOT NULL,
  idsancion NUMERIC(11,0) NOT NULL,
  idfamiliar NUMERIC(11,0) NOT NULL,
  idmotivosancion NUMERIC(11,0) NOT NULL,
  fdesde DATE NOT NULL,
  fhasta DATE,
  idpersona NUMERIC(11,0),
  CONSTRAINT pk_idfamiliarsancionado PRIMARY KEY(idfamiliarsancionado)
) 
WITH (oids = false);

/* mod_personaext.dat_sancion.frehabilitacion (Unique Source, Fields) */
ALTER TABLE mod_personaext.dat_sancion
  ADD COLUMN frehabilitacion DATE;

COMMENT ON COLUMN mod_personaext.dat_sancion.frehabilitacion
IS 'Fecha que da inicio al cumplimiento de la sanción.';

/* mod_personaext.dat_sancion.resolucion (Unique Source, Fields) */
ALTER TABLE mod_personaext.dat_sancion
  ADD COLUMN resolucion VARCHAR(50);

COMMENT ON COLUMN mod_personaext.dat_sancion.resolucion
IS 'Número de resolución que aprueba la sanción';

/* mod_personaext.dat_sancion.fnotificacion (Unique Source, Fields) */
ALTER TABLE mod_personaext.dat_sancion
  ADD COLUMN fnotificacion DATE;

COMMENT ON COLUMN mod_personaext.dat_sancion.fnotificacion
IS 'Fecha de notificación de la sanción al infractor';

/* mod_personaext.dat_sancion.idcargofacultado (Unique Source, Fields) */
ALTER TABLE mod_personaext.dat_sancion
  ADD COLUMN idcargofacultado NUMERIC(19,0);

COMMENT ON COLUMN mod_personaext.dat_sancion.idcargofacultado
IS 'Identificador del cargo del jefe que aprueba la sanción';

/* mod_personaext.dat_sancion.resrehabilitacion (Unique Source, Fields) */
ALTER TABLE mod_personaext.dat_sancion
  ADD COLUMN resrehabilitacion VARCHAR(50);

COMMENT ON COLUMN mod_personaext.dat_sancion.resrehabilitacion
IS 'Resolución de rehabilitación.';

/* mod_personaext.dat_sancion.fk_motivosancion_sancion (Different, Foreign keys) */
/* Different properties: Description */
COMMENT ON CONSTRAINT fk_motivosancion_sancion ON mod_personaext.dat_sancion
IS 'LLave foránea para identificar la relación y garantizar la integridad referencial entre las tablas (nom_motivosancion y dat_sancion).';

/* mod_personaext.dat_sancion.fk_sancion_sancion (Different, Foreign keys) */
/* Different properties: Description */
COMMENT ON CONSTRAINT fk_sancion_sancion ON mod_personaext.dat_sancion
IS 'LLave foránea para identificar la relación y garantizar la integridad referencial entre las tablas (nom_sancion y dat_sancion).';

/* mod_personaext.dat_cargoorganizacion.fk_cargoorganizacion_cargoorganizacion (Different, Foreign keys) */
/* Different properties: Description */
COMMENT ON CONSTRAINT fk_cargoorganizacion_cargoorganizacion ON mod_personaext.dat_cargoorganizacion
IS 'LLave foránea para identificar la relación y garantizar la integridad referencial entre las tablas (nom_cargoorganizacion y dat_cargoorganizacion).';

/* mod_personaext.dat_cargoorganizacion.fk_nivelorganizacion_cargoorganizacion (Different, Foreign keys) */
/* Different properties: Description */
COMMENT ON CONSTRAINT fk_nivelorganizacion_cargoorganizacion ON mod_personaext.dat_cargoorganizacion
IS 'LLave foránea para identificar la relación y garantizar la integridad referencial entre las tablas (nom_nivelorganizacion y dat_cargoorganizacion).';

/* mod_personaext.dat_sancion.fdesde (Unique Target, Fields) */
ALTER TABLE mod_personaext.dat_sancion
  DROP COLUMN fdesde;

/* mod_personaext.dat_familiar.idsuin (Unique Target, Fields) */
ALTER TABLE mod_personaext.dat_familiar
  DROP COLUMN idsuin;

/* mod_personaext.dat_servalimentacion.idestructura (Unique Target, Fields) */
ALTER TABLE mod_personaext.dat_servalimentacion
  DROP COLUMN idestructura;

/* mod_personaext.ft_insertar_modoformacion (Unique Target, Functions) */
DROP FUNCTION mod_personaext.ft_insertar_modoformacion();

/* mod_personaext.nom_parentesco.fki_idparentesco_inverso (Unique Source, Indices) */
CREATE INDEX fki_idparentesco_inverso ON mod_personaext.nom_parentesco
  USING btree (inverso);

/* mod_personaext.nom_parentesco.ak_denominacion (Unique Source, Indices) */
ALTER TABLE mod_personaext.nom_parentesco
  ADD CONSTRAINT ak_denominacion 
    UNIQUE (denominacion) NOT DEFERRABLE;

/* mod_personaext.dat_servtransportacion.idx_idestructura_servtransportacion (Different, Indices) */
/* Different properties: Fields, Not Null */
CREATE INDEX idx_idestructura_servtransportacion ON mod_personaext.dat_servtransportacion
  USING btree (idestructuratransportacion);

COMMENT ON INDEX mod_personaext.idx_idestructura_servtransportacion
IS 'Índice sobre la(s) columna(s) "idestructura" para agilizar la búsqueda de información.';

/* mod_personaext.dat_servalojamiento.idx_idestructura_servalojamiento (Different, Indices) */
/* Different properties: Fields, Not Null */
CREATE INDEX idx_idestructura_servalojamiento ON mod_personaext.dat_servalojamiento
  USING btree (idestructuraalojamiento);

COMMENT ON INDEX mod_personaext.idx_idestructura_servalojamiento
IS 'Índice sobre la(s) columna(s) "idestructura" para agilizar la búsqueda de información.';

/* mod_personaext.dat_servalimentacion.idx_idestructura_servalimentacion (Different, Indices) */
/* Different properties: Fields, Not Null */
CREATE INDEX idx_idestructura_servalimentacion ON mod_personaext.dat_servalimentacion
  USING btree (idestalimentacion);

COMMENT ON INDEX mod_personaext.idx_idestructura_servalimentacion
IS 'Índice sobre la(s) columna(s) "idestructura" para agilizar la búsqueda de información.';

/* mod_personaext.dat_limitacion.fki_situacionlaboral_limitacion_idsituacionlaboral (Unique Source, Indices) */
CREATE INDEX fki_situacionlaboral_limitacion_idsituacionlaboral ON mod_personaext.dat_limitacion
  USING btree (idsituacionlaboral);

/* mod_personaext.dat_familiar.idx_fk_idpersona (Unique Source, Indices) */
CREATE INDEX idx_fk_idpersona ON mod_personaext.dat_familiar
  USING btree (idpersona);

/* mod_personaext.dat_familiar.idx_fk_idparentesco (Unique Source, Indices) */
CREATE INDEX idx_fk_idparentesco ON mod_personaext.dat_familiar
  USING btree (idparentesco);

/* mod_personaext.nom_parentesco.fk_idparentesco_inverso (Unique Source, Foreign keys) */
ALTER TABLE mod_personaext.nom_parentesco
  ADD CONSTRAINT fk_idparentesco_inverso FOREIGN KEY (inverso)
    REFERENCES mod_personaext.nom_parentesco(idparentesco)
    ON DELETE SET NULL
    ON UPDATE CASCADE
    NOT DEFERRABLE;

/* mod_personaext.nom_estructuratransportacion (Unique Source, Tables) */
ALTER TABLE mod_personaext.nom_estructuratransportacion
  ADD CONSTRAINT fk_estructuratransportacion_estructuratransportacion_idpadre FOREIGN KEY (idpadre)
    REFERENCES mod_personaext.nom_estructuratransportacion(idestructuratransportacion)
    ON DELETE CASCADE
    ON UPDATE CASCADE
    NOT DEFERRABLE;

COMMENT ON CONSTRAINT fk_estructuratransportacion_estructuratransportacion_idpadre ON mod_personaext.nom_estructuratransportacion
IS 'LLave foránea para identificar la relación y garantizar la integridad referencial de la estructura arbólea en la tabla. (nom_estructuratransportacion).';

/* mod_personaext.nom_estructuraalojamiento (Unique Source, Tables) */
ALTER TABLE mod_personaext.nom_estructuraalojamiento
  ADD CONSTRAINT fk_estructuraalojamiento_estructuraalojamiento_idpadre FOREIGN KEY (idpadre)
    REFERENCES mod_personaext.nom_estructuraalojamiento(idestructuraalojamiento)
    ON DELETE CASCADE
    ON UPDATE CASCADE
    NOT DEFERRABLE;

COMMENT ON CONSTRAINT fk_estructuraalojamiento_estructuraalojamiento_idpadre ON mod_personaext.nom_estructuraalojamiento
IS 'LLave foránea para identificar la relación y garantizar la integridad referencial de la estructura arbólea en la tabla. (nom_estructuraalojamiento).';

/* mod_personaext.his_trayectoriaentidad (Unique Source, Tables) */
ALTER TABLE mod_personaext.his_trayectoriaentidad
  ADD CONSTRAINT fk_trayectoriaentidad_persona_idpersona FOREIGN KEY (idpersona)
    REFERENCES mod_persona.dat_persona(idpersona)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
    NOT DEFERRABLE;

/* mod_personaext.his_trayectoriacargo (Unique Source, Tables) */
ALTER TABLE mod_personaext.his_trayectoriacargo
  ADD CONSTRAINT fk_trayectoriaentidad_trayectoriacargo FOREIGN KEY (idtrayectoriaentidad)
    REFERENCES mod_personaext.his_trayectoriaentidad(idtrayectoriaentidad)
    ON DELETE CASCADE
    ON UPDATE CASCADE
    NOT DEFERRABLE;

/* mod_personaext.dat_situaciondefensa (Unique Source, Tables) */
ALTER TABLE mod_personaext.dat_situaciondefensa
  ADD CONSTRAINT fk_asignaciondefensa_situaciondefensa FOREIGN KEY (idasignaciondefensa)
    REFERENCES mod_personaext.nom_asignaciondefensa(idasignaciondefensa)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
    NOT DEFERRABLE;

/* mod_personaext.dat_servalimentacion.dat_servalimentacion_fk (Unique Source, Foreign keys) */
ALTER TABLE mod_personaext.dat_servalimentacion
  ADD CONSTRAINT dat_servalimentacion_fk FOREIGN KEY (idestalimentacion)
    REFERENCES mod_personaext.nom_estalimentacion(idestalimentacion)
    ON DELETE RESTRICT
    ON UPDATE NO ACTION
    NOT DEFERRABLE;

/* mod_personaext.dat_personamedio (Unique Source, Tables) */
ALTER TABLE mod_personaext.dat_personamedio
  ADD CONSTRAINT fk_asignacion_personamedio FOREIGN KEY (idasignacion)
    REFERENCES mod_personaext.nom_asignacion(idasignacion)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
    NOT DEFERRABLE;

ALTER TABLE mod_personaext.dat_personamedio
  ADD CONSTRAINT fk_mediopersona_personamedio FOREIGN KEY (idmedio)
    REFERENCES mod_personaext.nom_mediopersona(idmediopersona)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
    NOT DEFERRABLE;

ALTER TABLE mod_personaext.dat_personamedio
  ADD CONSTRAINT fk_persona_personamedio FOREIGN KEY (idpersona)
    REFERENCES mod_persona.dat_persona(idpersona)
    ON DELETE CASCADE
    ON UPDATE CASCADE
    NOT DEFERRABLE;

/* mod_personaext.dat_ocupaciontiempoguerra (Unique Source, Tables) */
ALTER TABLE mod_personaext.dat_ocupaciontiempoguerra
  ADD CONSTRAINT fk_persona_ocupaciontiempoguerra_idpersona FOREIGN KEY (idpersona)
    REFERENCES mod_persona.dat_persona(idpersona)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
    NOT DEFERRABLE;

/* mod_personaext.dat_observacion (Unique Source, Tables) */
ALTER TABLE mod_personaext.dat_observacion
  ADD CONSTRAINT fk_persona_observacion FOREIGN KEY (idpersona)
    REFERENCES mod_persona.dat_persona(idpersona)
    ON DELETE CASCADE
    ON UPDATE CASCADE
    NOT DEFERRABLE;

COMMENT ON CONSTRAINT fk_persona_observacion ON mod_personaext.dat_observacion
IS 'LLave foránea para identificar la relación y garantizar la integridad referencial entre las tablas. (dat_persona y dat_observacion).';

/* mod_personaext.dat_niveleducacional (Unique Source, Tables) */
ALTER TABLE mod_personaext.dat_niveleducacional
  ADD CONSTRAINT fk_niveleducacional_niveleducacionalp FOREIGN KEY (idniveleducacional)
    REFERENCES mod_personaext.nom_niveleducacional(idniveleducacional)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
    NOT DEFERRABLE;

COMMENT ON CONSTRAINT fk_niveleducacional_niveleducacionalp ON mod_personaext.dat_niveleducacional
IS 'LLave foránea para identificar la relación y garantizar la integridad referencial entre las tablas (nom_niveleducacional y at_niveleducacional).';

ALTER TABLE mod_personaext.dat_niveleducacional
  ADD CONSTRAINT fk_persona_niveleducacionalp FOREIGN KEY (idpersona)
    REFERENCES mod_persona.dat_persona(idpersona)
    ON DELETE CASCADE
    ON UPDATE CASCADE
    NOT DEFERRABLE;

COMMENT ON CONSTRAINT fk_persona_niveleducacionalp ON mod_personaext.dat_niveleducacional
IS 'LLave foránea para identificar la relación y garantizar la integridad referencial entre las tablas. (dat_persona y dat_niveleducacional).';

ALTER TABLE mod_personaext.dat_niveleducacional
  ADD CONSTRAINT fk_titulo_niveleducacional FOREIGN KEY (idtitulo)
    REFERENCES mod_personaext.nom_titulo(idtitulo)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
    NOT DEFERRABLE;

/* mod_personaext.dat_limitacion.fk_situacionlaboral_limitacion_idsituacionlaboral (Unique Source, Foreign keys) */
ALTER TABLE mod_personaext.dat_limitacion
  ADD CONSTRAINT fk_situacionlaboral_limitacion_idsituacionlaboral FOREIGN KEY (idsituacionlaboral)
    REFERENCES mod_persona.dat_situacionlaboral(idsituacionlaboralp)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
    NOT DEFERRABLE;

/* mod_personaext.dat_ingreso (Unique Source, Tables) */
ALTER TABLE mod_personaext.dat_ingreso
  ADD CONSTRAINT fk_familiar_ingreso FOREIGN KEY (idfamiliar)
    REFERENCES mod_personaext.dat_familiar(idfamiliar)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
    NOT DEFERRABLE;

ALTER TABLE mod_personaext.dat_ingreso
  ADD CONSTRAINT fk_tipoingreso_ingreso FOREIGN KEY (idtipoingreso)
    REFERENCES mod_personaext.nom_tipoingreso(idtipoingreso)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
    NOT DEFERRABLE;

/* mod_personaext.dat_huella (Unique Source, Tables) */
ALTER TABLE mod_personaext.dat_huella
  ADD CONSTRAINT dat_huella_fk FOREIGN KEY (iddedo)
    REFERENCES mod_personaext.nom_dedo(iddedo)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
    NOT DEFERRABLE;

ALTER TABLE mod_personaext.dat_huella
  ADD CONSTRAINT dat_huella_iddedo_fkey FOREIGN KEY (iddedo)
    REFERENCES mod_personaext.nom_dedo(iddedo)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
    NOT DEFERRABLE;

/* mod_personaext.dat_familiarviaje (Unique Source, Tables) */
ALTER TABLE mod_personaext.dat_familiarviaje
  ADD CONSTRAINT fk_familiarviaje_idfamiliar FOREIGN KEY (idfamiliar)
    REFERENCES mod_personaext.dat_familiar(idfamiliar)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
    NOT DEFERRABLE;

ALTER TABLE mod_personaext.dat_familiarviaje
  ADD CONSTRAINT fk_familiarviaje_idpersona FOREIGN KEY (idpersona)
    REFERENCES mod_persona.dat_persona(idpersona)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
    NOT DEFERRABLE;

/* mod_personaext.dat_familiarsancionado (Unique Source, Tables) */
ALTER TABLE mod_personaext.dat_familiarsancionado
  ADD CONSTRAINT fk_familiarsancionado_idfamiliar FOREIGN KEY (idfamiliar)
    REFERENCES mod_personaext.dat_familiar(idfamiliar)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
    NOT DEFERRABLE;

ALTER TABLE mod_personaext.dat_familiarsancionado
  ADD CONSTRAINT fk_familiarsancionado_idmotivosancion FOREIGN KEY (idmotivosancion)
    REFERENCES mod_personaext.nom_motivosancion(idmotivosancion)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
    NOT DEFERRABLE;

ALTER TABLE mod_personaext.dat_familiarsancionado
  ADD CONSTRAINT fk_familiarsancionado_idsancion FOREIGN KEY (idsancion)
    REFERENCES mod_personaext.nom_sancion(idsancion)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
    NOT DEFERRABLE;

/* mod_personaext.dat_familiarresidente (Unique Source, Tables) */
ALTER TABLE mod_personaext.dat_familiarresidente
  ADD CONSTRAINT fk_familiarresidente_idfamiliar FOREIGN KEY (idfamiliar)
    REFERENCES mod_personaext.dat_familiar(idfamiliar)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
    NOT DEFERRABLE;

ALTER TABLE mod_personaext.dat_familiarresidente
  ADD CONSTRAINT fk_familiarresidente_idnacionalidad FOREIGN KEY (idnacionalidad)
    REFERENCES mod_persona.nom_nacionalidad(idnacionalidad)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
    NOT DEFERRABLE;

/* mod_personaext.dat_familiarexterior (Unique Source, Tables) */
ALTER TABLE mod_personaext.dat_familiarexterior
  ADD CONSTRAINT fk_familiarexterior_idfamiliar FOREIGN KEY (idfamiliar)
    REFERENCES mod_personaext.dat_familiar(idfamiliar)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
    NOT DEFERRABLE;

/* mod_personaext.dat_familiar.fk_persona_familiar_idpersona (Unique Source, Foreign keys) */
ALTER TABLE mod_personaext.dat_familiar
  ADD CONSTRAINT fk_persona_familiar_idpersona FOREIGN KEY (idpersona)
    REFERENCES mod_persona.dat_persona(idpersona)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
    NOT DEFERRABLE;

/* mod_personaext.dat_estadovivienda (Unique Source, Tables) */
ALTER TABLE mod_personaext.dat_estadovivienda
  ADD CONSTRAINT fk_convivencia_estadoviviendap_idconvivencia FOREIGN KEY (idconvivencia)
    REFERENCES mod_personaext.nom_convivencia(idconvivencia)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
    NOT DEFERRABLE;

ALTER TABLE mod_personaext.dat_estadovivienda
  ADD CONSTRAINT fk_estadovivienda_estadovivienda_idestadovivienda FOREIGN KEY (idestadovivienda)
    REFERENCES mod_personaext.nom_estadovivienda(idestadovivienda)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
    NOT DEFERRABLE;

ALTER TABLE mod_personaext.dat_estadovivienda
  ADD CONSTRAINT fk_persona_estadoviviendap FOREIGN KEY (idpersona)
    REFERENCES mod_persona.dat_persona(idpersona)
    ON DELETE CASCADE
    ON UPDATE CASCADE
    NOT DEFERRABLE;

/* mod_personaext.dat_cuentabancaria.fk_tipoacreditacionsalario_cuentabancaria (Unique Source, Foreign keys) */
ALTER TABLE mod_personaext.dat_cuentabancaria
  ADD CONSTRAINT fk_tipoacreditacionsalario_cuentabancaria FOREIGN KEY (idtipoacreditacionsalario)
    REFERENCES mod_personaext.nom_tipoacreditacionsalario(idtipoacreditacionsalario)
    ON DELETE SET NULL
    ON UPDATE CASCADE
    NOT DEFERRABLE;

COMMENT ON CONSTRAINT fk_tipoacreditacionsalario_cuentabancaria ON mod_personaext.dat_cuentabancaria
IS 'LLave foránea para identificar la relación y garantizar la integridad referencial entre las tablas. (nom_tipoacreditacionsalario y dat_cuentabancaria).';

/* mod_personaext.dat_caracteristicasocial.fk_disposicion_caracteristicasocial (Unique Source, Foreign keys) */
ALTER TABLE mod_personaext.dat_caracteristicasocial
  ADD CONSTRAINT fk_disposicion_caracteristicasocial FOREIGN KEY (iddisposicion)
    REFERENCES mod_personaext.nom_disposicion(iddisposicion)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
    NOT DEFERRABLE;

/* mod_personaext.dat_aseo (Unique Source, Tables) */
ALTER TABLE mod_personaext.dat_aseo
  ADD CONSTRAINT fk_aseo_aseo FOREIGN KEY (idaseo)
    REFERENCES mod_personaext.nom_aseo(idaseo)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
    NOT DEFERRABLE;

/* mod_personaext.conf_tallaje (Unique Source, Tables) */
ALTER TABLE mod_personaext.conf_tallaje
  ADD CONSTRAINT fk_norma_tallaje FOREIGN KEY (idnorma)
    REFERENCES mod_personaext.nom_norma(idnorma)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
    NOT DEFERRABLE;

COMMENT ON CONSTRAINT fk_norma_tallaje ON mod_personaext.conf_tallaje
IS 'LLave foránea para identificar la relación y garantizar la integridad referencial entre las tablas (nom_norma y conf_tallaje).';

ALTER TABLE mod_personaext.conf_tallaje
  ADD CONSTRAINT fk_prenda_tallaje FOREIGN KEY (idprenda)
    REFERENCES mod_personaext.nom_prenda(idprenda)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
    NOT DEFERRABLE;

COMMENT ON CONSTRAINT fk_prenda_tallaje ON mod_personaext.conf_tallaje
IS 'LLave foránea para identificar la relación y garantizar la integridad referencial entre las tablas (nom_prenda y conf_tallaje).';

ALTER TABLE mod_personaext.conf_tallaje
  ADD CONSTRAINT fk_talla_tallaje FOREIGN KEY (idtalla)
    REFERENCES mod_personaext.nom_talla(idtalla)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
    NOT DEFERRABLE;

COMMENT ON CONSTRAINT fk_talla_tallaje ON mod_personaext.conf_tallaje
IS 'LLave foránea para identificar la relación y garantizar la integridad referencial entre las tablas (nom_talla y conf_tallaje).';

/* mod_personaext.dat_caracteristicasocial (Different, Tables) */
-- Create a temporary table

CREATE LOCAL TEMPORARY TABLE dat_caracteristicasocial0gbnme (
  idcaracteristicasocial NUMERIC(19,0),
  idpersona NUMERIC(19,0),
  idestadocivil NUMERIC(19,0),
  idestratificacionsocial NUMERIC(19,0),
  alia VARCHAR(20),
  jubilado NUMERIC(1,0),
  iddisposicion NUMERIC(19,0),
  observaciones VARCHAR(500)
) ;

-- Copy the source table's data to the temporary table

INSERT INTO dat_caracteristicasocial0gbnme (idcaracteristicasocial, idpersona, idestadocivil, idestratificacionsocial, alia, jubilado, iddisposicion, observaciones)
SELECT idcaracteristicasocial, idpersona, idestadocivil, idestratificacionsocial, alia, jubilado, iddisposicion, observaciones FROM mod_personaext.dat_caracteristicasocial;

-- Drop the source table

DROP TABLE mod_personaext.dat_caracteristicasocial;

-- Create the destination table

CREATE TABLE mod_personaext.dat_caracteristicasocial (
  idcaracteristicasocial NUMERIC(19,0) DEFAULT nextval('mod_personaext.sec_caracteristicasocial_seq'::regclass) NOT NULL,
  idpersona NUMERIC(19,0) NOT NULL,
  idestadocivil NUMERIC(19,0) NOT NULL,
  idestratificacionsocial NUMERIC(19,0) NOT NULL,
  alia VARCHAR(20),
  jubilado NUMERIC(1,0) DEFAULT 0 NOT NULL,
  iddisposicion NUMERIC(19,0),
  observaciones VARCHAR(500),
  CONSTRAINT pk_carateristicasocial PRIMARY KEY(idcaracteristicasocial),
  CONSTRAINT chk_jubilado_caracteristicasocial CHECK ((jubilado = (0)::numeric) OR (jubilado = (1)::numeric)),
  CONSTRAINT fk_disposicion_caracteristicasocial FOREIGN KEY (iddisposicion)
    REFERENCES mod_personaext.nom_disposicion(iddisposicion)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
    NOT DEFERRABLE,
  CONSTRAINT fk_estadocivil_caracteristicasocial FOREIGN KEY (idestadocivil)
    REFERENCES mod_personaext.nom_estadocivil(idestadocivil)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
    NOT DEFERRABLE,
  CONSTRAINT fk_estratificacionsocial_caracteristicasocial FOREIGN KEY (idestratificacionsocial)
    REFERENCES mod_personaext.nom_estratificacionsocial(idestratificacionsocial)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
    NOT DEFERRABLE,
  CONSTRAINT fk_persona_caracteristicasocial FOREIGN KEY (idpersona)
    REFERENCES mod_persona.dat_persona(idpersona)
    ON DELETE CASCADE
    ON UPDATE CASCADE
    NOT DEFERRABLE
) 
WITH (oids = false);

COMMENT ON TABLE mod_personaext.dat_caracteristicasocial
IS 'Almacena las características de la persona como ser social, recogiendo su estado civil, estratificación y observaciones en general.';

COMMENT ON COLUMN mod_personaext.dat_caracteristicasocial.idcaracteristicasocial
IS 'Identificador de las características sociales de la persona.';

COMMENT ON COLUMN mod_personaext.dat_caracteristicasocial.idpersona
IS 'Identificador de la persona.';

COMMENT ON COLUMN mod_personaext.dat_caracteristicasocial.idestadocivil
IS 'Identificador del estado civil.';

COMMENT ON COLUMN mod_personaext.dat_caracteristicasocial.idestratificacionsocial
IS 'Identificador de la estratificación social.';

COMMENT ON COLUMN mod_personaext.dat_caracteristicasocial.alia
IS 'Alias o sobrenombre de la persona.';

COMMENT ON COLUMN mod_personaext.dat_caracteristicasocial.jubilado
IS 'Establece si la persona es jubilada(1) o no(0).';

COMMENT ON COLUMN mod_personaext.dat_caracteristicasocial.iddisposicion
IS 'Identificador de la disposición que establece la jubilaciín de la persona.';

COMMENT ON COLUMN mod_personaext.dat_caracteristicasocial.observaciones
IS 'Observaciones generales en aspectos de la sociedad.';

COMMENT ON CONSTRAINT fk_estadocivil_caracteristicasocial ON mod_personaext.dat_caracteristicasocial
IS 'LLave foránea para identificar la relación y garantizar la integridad referencial entre las tablas (nom_estadocivil y dat_caracteristicasocial).';

COMMENT ON CONSTRAINT fk_estratificacionsocial_caracteristicasocial ON mod_personaext.dat_caracteristicasocial
IS 'LLave foránea para identificar la relación y garantizar la integridad referencial entre las tablas (nom_estratificacionsocial y dat_caracteristicasocial).';

COMMENT ON CONSTRAINT fk_persona_caracteristicasocial ON mod_personaext.dat_caracteristicasocial
IS 'LLave foránea para identificar la relación y garantizar la integridad referencial entre las tablas. (dat_persona y dat_caracteristicasocial).';

-- Copy the temporary table's data to the destination table

INSERT INTO mod_personaext.dat_caracteristicasocial (idcaracteristicasocial, idpersona, idestadocivil, idestratificacionsocial, alia, jubilado, iddisposicion, observaciones)
SELECT idcaracteristicasocial, idpersona, idestadocivil, idestratificacionsocial, alia, jubilado, iddisposicion, observaciones FROM dat_caracteristicasocial0gbnme;

-- Create indices, triggers and rules

CREATE INDEX idx_idestratificacionsocial_caracteristicasocial ON mod_personaext.dat_caracteristicasocial
  USING btree (idestratificacionsocial);

COMMENT ON INDEX mod_personaext.idx_idestratificacionsocial_caracteristicasocial
IS 'Índice sobre la(s) columna(s) "idestratificacionsocial" para agilizar la búsqueda de información.';

CREATE INDEX idx_idpersona_caracteristicasocial ON mod_personaext.dat_caracteristicasocial
  USING btree (idpersona);

COMMENT ON INDEX mod_personaext.idx_idpersona_caracteristicasocial
IS 'Índice sobre la(s) columna(s) "idpersona" para agilizar la búsqueda de información.';

COMMENT ON CONSTRAINT pk_carateristicasocial ON mod_personaext.dat_caracteristicasocial
IS 'LLave primaria para identificar la tupla.';

-- Restore table's permissions

ALTER TABLE mod_personaext.dat_caracteristicasocial
  OWNER TO zeolides;



-- Drop the temporary table

DROP TABLE dat_caracteristicasocial0gbnme;

/* mod_personaext.dat_caracteristicasocial.chk_jubilado_caracteristicasocial (Unique Source, Checks) */
ALTER TABLE mod_personaext.dat_caracteristicasocial
  ADD CONSTRAINT chk_jubilado_caracteristicasocial CHECK ((jubilado = (0)::numeric) OR (jubilado = (1)::numeric));

/* mod_personaext.dat_familiar (Different, Tables) */
/* Different properties: Description */
-- Create a temporary table

CREATE LOCAL TEMPORARY TABLE dat_familiar0bbujr (
  idfamiliar NUMERIC(19,0),
  numid VARCHAR(50),
  nombre VARCHAR(255),
  idsiun VARCHAR(36),
  idparentesco NUMERIC(19,0),
  allegado NUMERIC(1,0),
  conviven NUMERIC(1,0),
  idpersona NUMERIC(19,0),
  fnacimineto VARCHAR(20),
  centrotrabajo VARCHAR(100),
  idorganizacion VARCHAR(250),
  observaciones VARCHAR(255)
) ;

-- Copy the source table's data to the temporary table

INSERT INTO dat_familiar0bbujr (idfamiliar, numid, nombre, idsiun, idparentesco, allegado, conviven, idpersona, fnacimineto, centrotrabajo, idorganizacion, observaciones)
SELECT idfamiliar, numid, nombre, idsiun, idparentesco, allegado, conviven, idpersona, fnacimineto, centrotrabajo, idorganizacion, observaciones FROM mod_personaext.dat_familiar;

-- Drop the source table

DROP TABLE mod_personaext.dat_familiar;

-- Create the destination table

CREATE TABLE mod_personaext.dat_familiar (
  idfamiliar NUMERIC(19,0) DEFAULT nextval('mod_personaext.sec_familiar_seq'::regclass) NOT NULL,
  numid VARCHAR(50),
  nombre VARCHAR(255) NOT NULL,
  idsiun VARCHAR(36),
  idparentesco NUMERIC(19,0) NOT NULL,
  allegado NUMERIC(1,0) DEFAULT 1 NOT NULL,
  conviven NUMERIC(1,0) DEFAULT 0 NOT NULL,
  idpersona NUMERIC(19,0) NOT NULL,
  fnacimineto VARCHAR(20),
  centrotrabajo VARCHAR(100),
  idorganizacion VARCHAR(250),
  observaciones VARCHAR(255),
  CONSTRAINT pk_familiar PRIMARY KEY(idfamiliar),
  CONSTRAINT fk_parentesco_familiar_idparentesco FOREIGN KEY (idparentesco)
    REFERENCES mod_personaext.nom_parentesco(idparentesco)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
    NOT DEFERRABLE,
  CONSTRAINT fk_persona_familiar_idpersona FOREIGN KEY (idpersona)
    REFERENCES mod_persona.dat_persona(idpersona)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
    NOT DEFERRABLE
) 
WITH (oids = false);

COMMENT ON TABLE mod_personaext.dat_familiar
IS 'Almacena los datos de familiares de la persona.';

COMMENT ON COLUMN mod_personaext.dat_familiar.idfamiliar
IS 'Identificador del familiar de la persona.';

COMMENT ON COLUMN mod_personaext.dat_familiar.numid
IS 'Número de identidad del familiar.';

COMMENT ON COLUMN mod_personaext.dat_familiar.nombre
IS 'Nombres y apellidos del familiar.';

COMMENT ON COLUMN mod_personaext.dat_familiar.idsiun
IS 'Identificador del sistema único de identificación nacional.';

COMMENT ON COLUMN mod_personaext.dat_familiar.idparentesco
IS 'Identificador del parentesco del familiar con la persona.';

COMMENT ON COLUMN mod_personaext.dat_familiar.allegado
IS 'Determina si el familiar es allegado o no a la persona. 0-> No es allegado, 1-> Es allegado.';

COMMENT ON COLUMN mod_personaext.dat_familiar.conviven
IS 'Determina si el familiar convive con la persona. 0-> No convive, 1-> Convive.';

COMMENT ON COLUMN mod_personaext.dat_familiar.fnacimineto
IS 'Fecha de nacimiento del familiar';

COMMENT ON COLUMN mod_personaext.dat_familiar.centrotrabajo
IS 'Centro de trabajo o estudio del familiar';

-- Copy the temporary table's data to the destination table

INSERT INTO mod_personaext.dat_familiar (idfamiliar, numid, nombre, idsiun, idparentesco, allegado, conviven, idpersona, fnacimineto, centrotrabajo, idorganizacion, observaciones)
SELECT idfamiliar, numid, nombre, idsiun, idparentesco, allegado, conviven, idpersona, fnacimineto, centrotrabajo, idorganizacion, observaciones FROM dat_familiar0bbujr;

-- Create indices, triggers and rules

CREATE INDEX idx_fk_idparentesco ON mod_personaext.dat_familiar
  USING btree (idparentesco);

CREATE INDEX idx_fk_idpersona ON mod_personaext.dat_familiar
  USING btree (idpersona);

COMMENT ON CONSTRAINT pk_familiar ON mod_personaext.dat_familiar
IS 'Llave primaria de la tabla "dat_fa,miliar"';

-- Restore table's permissions

ALTER TABLE mod_personaext.dat_familiar
  OWNER TO zeolides;



-- Drop the temporary table

DROP TABLE dat_familiar0bbujr;

/* mod_personaext.dat_tallaje (Different, Tables) */
-- Create a temporary table

CREATE LOCAL TEMPORARY TABLE dat_tallaje0gwsur (
  idtallaje NUMERIC(19,0),
  idpersona NUMERIC(19,0),
  idprenda NUMERIC(19,0),
  idnorma NUMERIC(19,0),
  idtalla NUMERIC(19,0)
) ;

-- Copy the source table's data to the temporary table

INSERT INTO dat_tallaje0gwsur (idtallaje, idpersona, idprenda, idnorma, idtalla)
SELECT idtallaje, idpersona, idprenda, idnorma, idtalla FROM mod_personaext.dat_tallaje;

-- Drop the source table

DROP TABLE mod_personaext.dat_tallaje;

-- Create the destination table

CREATE TABLE mod_personaext.dat_tallaje (
  idtallaje NUMERIC(19,0) DEFAULT nextval('mod_personaext.sec_tallaje_seq'::regclass) NOT NULL,
  idpersona NUMERIC(19,0) NOT NULL,
  idprenda NUMERIC(19,0) NOT NULL,
  idnorma NUMERIC(19,0) NOT NULL,
  idtalla NUMERIC(19,0) NOT NULL,
  CONSTRAINT pk_tallaje PRIMARY KEY(idtallaje),
  CONSTRAINT fk_norma_tallaje FOREIGN KEY (idnorma)
    REFERENCES mod_personaext.nom_norma(idnorma)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
    NOT DEFERRABLE,
  CONSTRAINT fk_persona_tallaje FOREIGN KEY (idpersona)
    REFERENCES mod_persona.dat_persona(idpersona)
    ON DELETE CASCADE
    ON UPDATE CASCADE
    NOT DEFERRABLE,
  CONSTRAINT fk_prenda_tallaje FOREIGN KEY (idprenda)
    REFERENCES mod_personaext.nom_prenda(idprenda)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
    NOT DEFERRABLE,
  CONSTRAINT fk_talla_tallaje FOREIGN KEY (idtalla)
    REFERENCES mod_personaext.nom_talla(idtalla)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
    NOT DEFERRABLE
) 
WITH (oids = false);

COMMENT ON TABLE mod_personaext.dat_tallaje
IS 'Almacena la asociación de la prenda, talla y norma de la persona.';

COMMENT ON COLUMN mod_personaext.dat_tallaje.idtallaje
IS 'Identificador de la asociación del tallaje a la persona.';

COMMENT ON COLUMN mod_personaext.dat_tallaje.idpersona
IS 'Identificador de la persona.';

COMMENT ON COLUMN mod_personaext.dat_tallaje.idprenda
IS 'Identificador de la prenda.';

COMMENT ON COLUMN mod_personaext.dat_tallaje.idnorma
IS 'Identificador de la norma.';

COMMENT ON COLUMN mod_personaext.dat_tallaje.idtalla
IS 'Identificador de la talla.';

COMMENT ON CONSTRAINT fk_persona_tallaje ON mod_personaext.dat_tallaje
IS 'LLave foránea para identificar la relación y garantizar la integridad referencial entre las tablas. (dat_persona y dat_tallaje).';

-- Copy the temporary table's data to the destination table

INSERT INTO mod_personaext.dat_tallaje (idtallaje, idpersona, idprenda, idnorma, idtalla) 
SELECT idtallaje, idpersona, idprenda, idnorma, idtalla FROM dat_tallaje0gwsur;

-- Create indices, triggers and rules

CREATE INDEX idx_idpersona_tallaje ON mod_personaext.dat_tallaje
  USING btree (idpersona);

COMMENT ON INDEX mod_personaext.idx_idpersona_tallaje
IS 'Índice sobre la(s) columna(s) "idpersona" para agilizar la búsqueda de información.';

COMMENT ON CONSTRAINT pk_tallaje ON mod_personaext.dat_tallaje
IS 'LLave primaria para identificar la tupla.';

-- Restore table's permissions

ALTER TABLE mod_personaext.dat_tallaje
  OWNER TO zeolides;

GRANT SELECT, INSERT, UPDATE, DELETE, REFERENCES, TRIGGER, TRUNCATE
  ON mod_personaext.dat_tallaje TO zeolides;
GRANT SELECT, INSERT, UPDATE, DELETE, REFERENCES, TRIGGER
  ON mod_personaext.dat_tallaje TO "PUBLIC";


-- Drop the temporary table

DROP TABLE dat_tallaje0gwsur;

/* mod_personaext.nom_aptitudfisica.chk_gestion_aptitudfisica (Unique Source, Checks) */
ALTER TABLE mod_personaext.nom_aptitudfisica
  ADD CONSTRAINT chk_gestion_aptitudfisica CHECK ((gestion = (0)::numeric) OR (gestion = (1)::numeric));

/* mod_personaext.nom_cargoorganizacion.chk_gestion_cargoorganizacion (Unique Source, Checks) */
ALTER TABLE mod_personaext.nom_cargoorganizacion
  ADD CONSTRAINT chk_gestion_cargoorganizacion CHECK ((gestion = (0)::numeric) OR (gestion = (1)::numeric));

/* mod_personaext.nom_categoria.chk_gestion_categoria (Unique Source, Checks) */
ALTER TABLE mod_personaext.nom_categoria
  ADD CONSTRAINT chk_gestion_categoria CHECK ((gestion = (0)::numeric) OR (gestion = (1)::numeric));

/* mod_personaext.nom_categoriapersona.chk_gestion_categoriapersona (Unique Source, Checks) */
ALTER TABLE mod_personaext.nom_categoriapersona
  ADD CONSTRAINT chk_gestion_categoriapersona CHECK ((gestion = (0)::numeric) OR (gestion = (1)::numeric));

/* mod_personaext.nom_causalimitacion.chk_gestion_causalimitacion (Unique Source, Checks) */
ALTER TABLE mod_personaext.nom_causalimitacion
  ADD CONSTRAINT chk_gestion_causalimitacion CHECK ((gestion = (0)::numeric) OR (gestion = (1)::numeric));

/* mod_personaext.nom_centroestudio.chk_gestion_centroestudio (Unique Source, Checks) */
ALTER TABLE mod_personaext.nom_centroestudio
  ADD CONSTRAINT chk_gestion_centroestudio CHECK ((gestion = (0)::numeric) OR (gestion = (1)::numeric));

/* mod_personaext.nom_condecoracion.chk_gestion_condecoracion (Unique Source, Checks) */
ALTER TABLE mod_personaext.nom_condecoracion
  ADD CONSTRAINT chk_gestion_condecoracion CHECK ((gestion = (0)::numeric) OR (gestion = (1)::numeric));

/* mod_personaext.nom_estadocivil.chk_gestion_estadocivil (Unique Source, Checks) */
ALTER TABLE mod_personaext.nom_estadocivil
  ADD CONSTRAINT chk_gestion_estadocivil CHECK ((gestion = (0)::numeric) OR (gestion = (1)::numeric));

/* mod_personaext.nom_estratificacionsocial.chk_gestion_estratificacionsocial (Unique Source, Checks) */
ALTER TABLE mod_personaext.nom_estratificacionsocial
  ADD CONSTRAINT chk_gestion_estratificacionsocial CHECK ((gestion = (0)::numeric) OR (gestion = (1)::numeric));

/* mod_personaext.nom_eventoalimentacion.chk_gestion_eventoalimentacion (Unique Source, Checks) */
ALTER TABLE mod_personaext.nom_eventoalimentacion
  ADD CONSTRAINT chk_gestion_eventoalimentacion CHECK ((gestion = (0)::numeric) OR (gestion = (1)::numeric));

/* mod_personaext.nom_facultadestudio.chk_gestion_facultadestudio (Unique Source, Checks) */
ALTER TABLE mod_personaext.nom_facultadestudio
  ADD CONSTRAINT chk_gestion_facultadestudio CHECK ((gestion = (0)::numeric) OR (gestion = (1)::numeric));

/* mod_personaext.nom_formaadquiriridioma.chk_gestion_formaadquiriridioma (Unique Source, Checks) */
ALTER TABLE mod_personaext.nom_formaadquiriridioma
  ADD CONSTRAINT chk_gestion_formaadquiriridioma CHECK ((gestion = (0)::numeric) OR (gestion = (1)::numeric));

/* mod_personaext.nom_idioma.chk_gestion_idioma (Unique Source, Checks) */
ALTER TABLE mod_personaext.nom_idioma
  ADD CONSTRAINT chk_gestion_idioma CHECK ((gestion = (0)::numeric) OR (gestion = (1)::numeric));

/* mod_personaext.nom_mision.chk_gestion_mision (Unique Source, Checks) */
ALTER TABLE mod_personaext.nom_mision
  ADD CONSTRAINT chk_gestion_mision CHECK ((gestion = (0)::numeric) OR (gestion = (1)::numeric));

/* mod_personaext.nom_modoformacion.chk_gestion_modoformacion (Unique Source, Checks) */
ALTER TABLE mod_personaext.nom_modoformacion
  ADD CONSTRAINT chk_gestion_modoformacion CHECK ((gestion = (0)::numeric) OR (gestion = (1)::numeric));

/* mod_personaext.nom_motivocondecoracion.chk_gestion_motivocondecoracion (Unique Source, Checks) */
ALTER TABLE mod_personaext.nom_motivocondecoracion
  ADD CONSTRAINT chk_gestion_motivocondecoracion CHECK ((gestion = (0)::numeric) OR (gestion = (1)::numeric));

/* mod_personaext.nom_motivosancion.chk_gestion_motivosancion (Unique Source, Checks) */
ALTER TABLE mod_personaext.nom_motivosancion
  ADD CONSTRAINT chk_gestion_motivosancion CHECK ((gestion = (0)::numeric) OR (gestion = (1)::numeric));

/* mod_personaext.nom_niveleducacional.chk_gestion_niveleducacional (Unique Source, Checks) */
ALTER TABLE mod_personaext.nom_niveleducacional
  ADD CONSTRAINT chk_gestion_niveleducacional CHECK ((gestion = (0)::numeric) OR (gestion = (1)::numeric));

/* mod_personaext.nom_nivelorganizacion.chk_gestion_nivelorganizacion (Unique Source, Checks) */
ALTER TABLE mod_personaext.nom_nivelorganizacion
  ADD CONSTRAINT chk_gestion_nivelorganizacion CHECK ((gestion = (0)::numeric) OR (gestion = (1)::numeric));

/* mod_personaext.nom_norma.chk_gestion_norma (Unique Source, Checks) */
ALTER TABLE mod_personaext.nom_norma
  ADD CONSTRAINT chk_gestion_norma CHECK ((gestion = (0)::numeric) OR (gestion = (1)::numeric));

/* mod_personaext.nom_organizacion.chk_gestion_organizacion (Unique Source, Checks) */
ALTER TABLE mod_personaext.nom_organizacion
  ADD CONSTRAINT chk_gestion_organizacion CHECK ((gestion = (0)::numeric) OR (gestion = (1)::numeric));

/* mod_personaext.nom_padecimiento.chk_gestion_padecimiento (Unique Source, Checks) */
ALTER TABLE mod_personaext.nom_padecimiento
  ADD CONSTRAINT chk_gestion_padecimiento CHECK ((gestion = (0)::numeric) OR (gestion = (1)::numeric));

/* mod_personaext.nom_parentesco.chk_gestion_parentesco (Unique Source, Checks) */
ALTER TABLE mod_personaext.nom_parentesco
  ADD CONSTRAINT chk_gestion_parentesco CHECK ((gestion = (0)::numeric) OR (gestion = (1)::numeric));

/* mod_personaext.nom_prenda.chk_gestion_prenda (Unique Source, Checks) */
ALTER TABLE mod_personaext.nom_prenda
  ADD CONSTRAINT chk_gestion_prenda CHECK ((gestion = (0)::numeric) OR (gestion = (1)::numeric));

/* mod_personaext.nom_sancion.chk_gestion_sancion (Unique Source, Checks) */
ALTER TABLE mod_personaext.nom_sancion
  ADD CONSTRAINT chk_gestion_sancion CHECK ((gestion = (0)::numeric) OR (gestion = (1)::numeric));

/* mod_personaext.nom_talla.chk_gestion_talla (Unique Source, Checks) */
ALTER TABLE mod_personaext.nom_talla
  ADD CONSTRAINT chk_gestion_talla CHECK ((gestion = (0)::numeric) OR (gestion = (1)::numeric));

/* mod_personaext.nom_tipocategoria.chk_gestion_tipocategoria (Unique Source, Checks) */
ALTER TABLE mod_personaext.nom_tipocategoria
  ADD CONSTRAINT chk_gestion_tipocategoria CHECK ((gestion = (0)::numeric) OR (gestion = (1)::numeric));

/* mod_personaext.nom_tipocentroestudio.chk_gestion_tipocentroestudio (Unique Source, Checks) */
ALTER TABLE mod_personaext.nom_tipocentroestudio
  ADD CONSTRAINT chk_gestion_tipocentroestudio CHECK ((gestion = (0)::numeric) OR (gestion = (1)::numeric));

/* mod_personaext.nom_tipocondecoracion.chk_gestion_tipocondecoracion (Unique Source, Checks) */
ALTER TABLE mod_personaext.nom_tipocondecoracion
  ADD CONSTRAINT chk_gestion_tipocondecoracion CHECK ((gestion = (0)::numeric) OR (gestion = (1)::numeric));

/* mod_personaext.nom_tipocuentabancaria.chk_gestion_tipocuentabancaria (Unique Source, Checks) */
ALTER TABLE mod_personaext.nom_tipocuentabancaria
  ADD CONSTRAINT chk_gestion_tipocuentabancaria CHECK ((gestion = (0)::numeric) OR (gestion = (1)::numeric));

/* mod_personaext.nom_tipoestanciaexterior.chk_gestion_tipoestanciaexterior (Unique Source, Checks) */
ALTER TABLE mod_personaext.nom_tipoestanciaexterior
  ADD CONSTRAINT chk_gestion_tipoestanciaexterior CHECK ((gestion = (0)::numeric) OR (gestion = (1)::numeric));

/* mod_personaext.nom_tipoformacion.chk_gestion_tipoformacion (Unique Source, Checks) */
ALTER TABLE mod_personaext.nom_tipoformacion
  ADD CONSTRAINT chk_gestion_tipoformacion CHECK ((gestion = (0)::numeric) OR (gestion = (1)::numeric));

/* mod_personaext.nom_tipomision.chk_gestion_tipomision (Unique Source, Checks) */
ALTER TABLE mod_personaext.nom_tipomision
  ADD CONSTRAINT chk_gestion_tipomision CHECK ((gestion = (0)::numeric) OR (gestion = (1)::numeric));

/* mod_personaext.nom_tipoorganizacion.chk_gestion_tipoorganizacion (Unique Source, Checks) */
ALTER TABLE mod_personaext.nom_tipoorganizacion
  ADD CONSTRAINT chk_gestion_tipoorganizacion CHECK ((gestion = (0)::numeric) OR (gestion = (1)::numeric));

/* mod_personaext.nom_tiposancion.chk_gestion_tiposancion (Unique Source, Checks) */
ALTER TABLE mod_personaext.nom_tiposancion
  ADD CONSTRAINT chk_gestion_tiposancion CHECK ((gestion = (0)::numeric) OR (gestion = (1)::numeric));

/* mod_personaext.nom_titulo.chk_gestion_titulo (Unique Source, Checks) */
ALTER TABLE mod_personaext.nom_titulo
  ADD CONSTRAINT chk_gestion_titulo CHECK ((gestion = (0)::numeric) OR (gestion = (1)::numeric));
