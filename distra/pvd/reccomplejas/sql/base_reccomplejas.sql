--<Schema>
-- Created By : ScriptSplitGenerador
-- Code : http://10.12.170.129:9880/reccomplejas/trunk/lineabase
-- Only Schema
SET statement_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;
CREATE SCHEMA mod_reccomplejas2;
COMMENT ON SCHEMA mod_reccomplejas2 IS 'Agrupa los datos del componente recuperaciones complejas. Versión 2. (RRHH)';
SET search_path = mod_reccomplejas2, pg_catalog;
CREATE FUNCTION f_cambiar_orden(idcampo_v numeric, idpadre_v numeric, sentido numeric) RETURNS boolean
    LANGUAGE plpgsql
    AS $_$declare 
v_res boolean;
hijos record;
padre record;
v_ind_aux integer;
v_index_par record;
begin
v_res := false;
SELECT index,idconfiguracion into v_index_par FROM mod_reccomplejas2.dat_campo WHERE idcampo=$1;
IF($2 IS NOT NULL) THEN 
IF ($3=1) THEN
SELECT idcampo, index into hijos FROM mod_reccomplejas2.dat_campo where idpadre = $2 AND index < v_index_par.index ORDER BY index DESC LIMIT 1;
IF (hijos IS NOT NULL) THEN
			v_ind_aux:=hijos.index;			
			UPDATE mod_reccomplejas2.dat_campo SET index=v_index_par.index WHERE idcampo=hijos.idcampo;
			UPDATE mod_reccomplejas2.dat_campo SET index=v_ind_aux WHERE idcampo=$1;
			v_res := true;
		END IF;
ELSE
SELECT idcampo, index into hijos FROM mod_reccomplejas2.dat_campo where idpadre = $2 AND index > v_index_par.index ORDER BY index LIMIT 1; 
		IF (hijos IS NOT NULL) THEN
			v_ind_aux:=hijos.index;
			UPDATE mod_reccomplejas2.dat_campo SET index=v_index_par.index WHERE idcampo=hijos.idcampo;
			UPDATE mod_reccomplejas2.dat_campo SET index=v_ind_aux WHERE idcampo=$1;
			v_res := true;
		END IF;
END IF;
ELSE
IF ($3=1) THEN
SELECT idcampo, index into padre FROM mod_reccomplejas2.dat_campo where idconfiguracion = v_index_par.idconfiguracion AND idpadre IS NULL AND index < v_index_par.index ORDER BY index DESC LIMIT 1;
IF (padre IS NOT NULL) THEN
			v_ind_aux:=padre.index;			
			UPDATE mod_reccomplejas2.dat_campo SET index=v_index_par.index WHERE idcampo=padre.idcampo;
			UPDATE mod_reccomplejas2.dat_campo SET index=v_ind_aux WHERE idcampo=$1;
			v_res := true;
		END IF;
ELSE
SELECT idcampo, index into padre FROM mod_reccomplejas2.dat_campo where idconfiguracion = v_index_par.idconfiguracion AND idpadre IS NULL AND index > v_index_par.index ORDER BY index LIMIT 1; 
		IF (padre IS NOT NULL) THEN
			v_ind_aux:=padre.index;
			UPDATE mod_reccomplejas2.dat_campo SET index=v_index_par.index WHERE idcampo=padre.idcampo;
			UPDATE mod_reccomplejas2.dat_campo SET index=v_ind_aux WHERE idcampo=$1;
			v_res := true;
			
		END IF;
END IF;
END IF;
return v_res;
end;$_$;
CREATE SEQUENCE sec_busqueda_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    MAXVALUE 999999999999999999
    CACHE 1;
COMMENT ON SEQUENCE sec_busqueda_seq IS ' Secuencia empleada para autogenerar el identificador de la tabla "dat_busqueda".';
SET default_tablespace = '';
SET default_with_oids = false;
CREATE TABLE dat_busqueda (
    idbusqueda numeric(19,0) DEFAULT nextval('sec_busqueda_seq'::regclass) NOT NULL,
    codigo character varying(255),
    denominacion character varying(255) NOT NULL,
    descripcion character varying(500),
    sqlbusqueda character varying NOT NULL,
    sqltotal character varying NOT NULL,
    idaviso numeric(19,0),
    tablasvisitadas character varying,
    arrideventos character varying,
    configuracion character varying,
    idconfiguracion character varying(50) NOT NULL,
    cantidad numeric(1,0) DEFAULT 0 NOT NULL
);
COMMENT ON TABLE dat_busqueda IS 'Almacena todas las búsquedas configuradas.';
COMMENT ON COLUMN dat_busqueda.idbusqueda IS 'Identificador de la búsqueda.';
COMMENT ON COLUMN dat_busqueda.codigo IS 'Código de la búsqueda.';
COMMENT ON COLUMN dat_busqueda.denominacion IS 'Denominación de la búsqueda.';
COMMENT ON COLUMN dat_busqueda.descripcion IS 'Descripción de la búsqueda.';
COMMENT ON COLUMN dat_busqueda.sqlbusqueda IS 'SQL generado por la búsqueda.';
COMMENT ON COLUMN dat_busqueda.sqltotal IS 'SQL que devuelve la cantidad de filas retornadas por la búsqueda.';
COMMENT ON COLUMN dat_busqueda.idaviso IS 'Identificador del aviso que genera la búsqueda.';
COMMENT ON COLUMN dat_busqueda.tablasvisitadas IS 'Para almacenar todas las tablas que fueron visitadas durante la búsqueda.
Se almacenan todas las tablas separadas por comas.
Ejemplo: esquema.tabla1,esquemaN.tablaN..';
COMMENT ON COLUMN dat_busqueda.arrideventos IS 'Variable para almacenar todos los ideventos que tienen relación con la tabla.
Ejemplo: 1,2,3,4,5.';
COMMENT ON COLUMN dat_busqueda.configuracion IS 'Campo donde se guardará la configuración en formato json.';
COMMENT ON COLUMN dat_busqueda.idconfiguracion IS 'URI de la configuración.';
COMMENT ON COLUMN dat_busqueda.cantidad IS '0-Busqueda de campos
1-Busqueda de cantidad';
CREATE SEQUENCE sec_busquedausuario_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    MAXVALUE 999999999999999999
    CACHE 1;
COMMENT ON SEQUENCE sec_busquedausuario_seq IS ' Secuencia empleada para autogenerar el identificador de la tabla "dat_busquedausuario".';
SET default_with_oids = true;
CREATE TABLE dat_busquedausuario (
    idbusquedausuario numeric(19,0) DEFAULT nextval('sec_busquedausuario_seq'::regclass) NOT NULL,
    idbusqueda numeric(19,0) NOT NULL,
    idusuario numeric(19,0) NOT NULL,
    pordefecto numeric(1,0) DEFAULT 0 NOT NULL,
    propietario numeric(1,0) DEFAULT 1 NOT NULL
);
COMMENT ON TABLE dat_busquedausuario IS 'Almacena las búsquedas que tiene cada usuario.';
COMMENT ON COLUMN dat_busquedausuario.idbusquedausuario IS 'Identificador de la búsqueda por usuario.';
COMMENT ON COLUMN dat_busquedausuario.idbusqueda IS 'Identificador de la búsqueda.';
COMMENT ON COLUMN dat_busquedausuario.idusuario IS 'Identificador del usuario al que pertenece la búsqueda.';
COMMENT ON COLUMN dat_busquedausuario.pordefecto IS 'Para conocer la búsqueda por defecto para cada usuario. Cada usuario posee solo una búsqueda por defecto.
0- No es por defecto.
1- Es por defecto.';
COMMENT ON COLUMN dat_busquedausuario.propietario IS 'Para saber si el usuario es propietario de la búsqueda.
0- No propietario.
1- Propietario.';
CREATE SEQUENCE sec_campo_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    MAXVALUE 999999999999999999
    CACHE 1;
COMMENT ON SEQUENCE sec_campo_seq IS ' Secuencia empleada para autogenerar el identificador de la tabla "dat_campo".';
SET default_with_oids = false;
CREATE TABLE dat_campo (
    idcampo numeric(19,0) DEFAULT nextval('sec_campo_seq'::regclass) NOT NULL,
    idconfiguracion character varying(50) NOT NULL,
    idpadre numeric(19,0),
    campo character varying(255),
    denominacion character varying(255) NOT NULL,
    descripcion character varying(255),
    esquema character varying(255),
    tabla character varying(255),
    alias character varying(50),
    index numeric(19,0)
);
COMMENT ON TABLE dat_campo IS 'Almacena todos los campos de las configuraciones.';
COMMENT ON COLUMN dat_campo.idcampo IS 'Identificador del campo.';
COMMENT ON COLUMN dat_campo.idconfiguracion IS 'Identificador de la configuración.';
COMMENT ON COLUMN dat_campo.idpadre IS 'Identificador del nodo padre.';
COMMENT ON COLUMN dat_campo.campo IS 'Nombre del campo en base de datos.';
COMMENT ON COLUMN dat_campo.denominacion IS 'Nombre del campo que se le va a presentar al usuario.';
COMMENT ON COLUMN dat_campo.descripcion IS 'Breve descripción del campo.';
COMMENT ON COLUMN dat_campo.esquema IS 'Esquema al que pertenece el campo.';
COMMENT ON COLUMN dat_campo.tabla IS 'Tabla al que pertenece el campo.';
COMMENT ON COLUMN dat_campo.alias IS 'Alias del campo a utilizar cuando se genera la consulta.';
CREATE SEQUENCE sec_configcondicion_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    MAXVALUE 999999999999999999
    CACHE 1;
COMMENT ON SEQUENCE sec_configcondicion_seq IS ' Secuencia empleada para autogenerar el identificador de la tabla "dat_configcondicion".';
CREATE TABLE dat_configcondicion (
    idconfigcondicion numeric(19,0) DEFAULT nextval('sec_configcondicion_seq'::regclass) NOT NULL,
    idcampo numeric(19,0) NOT NULL,
    tipodato character varying(50) DEFAULT 'TEXTO'::character varying NOT NULL,
    condicionpordefecto character varying(10),
    expresionregular character varying,
    sqlwhere character varying,
    idtabla character varying(50),
    usarcondicion numeric(1,0) DEFAULT 1 NOT NULL,
    representartbar numeric(1,0) DEFAULT 0 NOT NULL,
    sqlfilter character varying,
    usarreemplazar character varying(255) DEFAULT 'NINGUNO'::character varying
);
COMMENT ON TABLE dat_configcondicion IS 'Almacena la configuración del campo para ser usado como condición.';
COMMENT ON COLUMN dat_configcondicion.idconfigcondicion IS 'Identificador de la configuración de la condición.';
COMMENT ON COLUMN dat_configcondicion.idcampo IS 'Identificador del campo.';
COMMENT ON COLUMN dat_configcondicion.tipodato IS 'Tipo de dato que puede tomar el campo en el recuperador complejo:
TEXTO, FECHA, HORA, NUMERO, NOMENCLADOR.';
COMMENT ON COLUMN dat_configcondicion.condicionpordefecto IS 'Condición por defecto que va a tomar el campo cuando se decida representar en el toolbar de reporte.';
COMMENT ON COLUMN dat_configcondicion.expresionregular IS 'Expresión regular que puede usar el campo como condición cuando sea de tipo TEXTO.';
COMMENT ON COLUMN dat_configcondicion.sqlwhere IS 'Expresión SQL que se incluye en la parte del WHERE de la consulta generada por el componente.';
COMMENT ON COLUMN dat_configcondicion.idtabla IS 'Identificador de la tabla de origen.';
COMMENT ON COLUMN dat_configcondicion.usarcondicion IS 'Indica si el campo puede ser usado como condición o no:
0-No se usa como condición.
1-Si se usa como condición.';
COMMENT ON COLUMN dat_configcondicion.representartbar IS 'Indica si el campo se va representar en el toolbar de reporte.
0- No se representa.
1-Se representa.';
CREATE SEQUENCE sec_configmostrar_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    MAXVALUE 999999999999999999
    CACHE 1;
COMMENT ON SEQUENCE sec_configmostrar_seq IS ' Secuencia empleada para autogenerar el identificador de la tabla "dat_configmostrar".';
CREATE TABLE dat_configmostrar (
    idconfigmostrar numeric(19,0) DEFAULT nextval('sec_configmostrar_seq'::regclass) NOT NULL,
    idcampo numeric(19,0) NOT NULL,
    anchocolumna numeric(3,0) DEFAULT 100,
    sqlselect character varying,
    renderer character varying(255),
    obligatorio numeric(1,0) DEFAULT 0 NOT NULL,
    expander numeric(1,0) DEFAULT 0 NOT NULL,
    agruparcampo numeric(1,0) DEFAULT 0 NOT NULL,
    tooltip numeric(1,0) DEFAULT 0 NOT NULL,
    oculto numeric(1,0) DEFAULT 0 NOT NULL,
    icono character varying(100)
);
COMMENT ON TABLE dat_configmostrar IS 'Almacena la configuración del campo que permita ser mostrado.';
COMMENT ON COLUMN dat_configmostrar.idconfigmostrar IS 'Identificador de la configuración a mostrar.';
COMMENT ON COLUMN dat_configmostrar.idcampo IS 'Identificador del campo.';
COMMENT ON COLUMN dat_configmostrar.anchocolumna IS 'Ancho de la columna de la tabla donde se represente.';
COMMENT ON COLUMN dat_configmostrar.sqlselect IS 'Código SQL que va a ser incrustado en la sentencia SELECT de la consulta generada por el componente.';
COMMENT ON COLUMN dat_configmostrar.renderer IS 'Nombre de la función en Javascript que va a modificar la forma de representación del dato.';
COMMENT ON COLUMN dat_configmostrar.obligatorio IS 'Si el campo siempre se va a seleccionar en la consulta:
0 - No es obligatorio.
1 - Si es obligatorio.';
COMMENT ON COLUMN dat_configmostrar.expander IS 'Si el campo se va a representar en el expander de la tabla y no como una columna mas:
0 - No representar en expander.
1 - Si representar en expander.';
COMMENT ON COLUMN dat_configmostrar.agruparcampo IS 'Permite agrupar la representación de los datos por este campo en la tabla:
0 - No agrupar.
1 - Si agrupar.';
COMMENT ON COLUMN dat_configmostrar.tooltip IS 'Representar el campo como parte de un tooltip y no como una columna más de la tabla:
0 - No representar en tooltip.
1 - Si representar en tooltip.';
COMMENT ON COLUMN dat_configmostrar.oculto IS 'Si no se desea representar el campo en la tabla:
0 - Visible.
1 - Oculto.';
COMMENT ON COLUMN dat_configmostrar.icono IS '�?cono que se utiliza para identificar el campo.';
CREATE SEQUENCE sec_mapeo_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    MAXVALUE 999999999999999999
    CACHE 1;
COMMENT ON SEQUENCE sec_mapeo_seq IS ' Secuencia empleada para autogenerar el identificador de la tabla "dat_mapeo".';
SET default_with_oids = true;
CREATE TABLE dat_mapeo (
    idmapeo numeric(19,0) DEFAULT nextval('sec_mapeo_seq'::regclass) NOT NULL,
    idcampo numeric(19,0) NOT NULL,
    esquema character varying(50) NOT NULL,
    tabla character varying(50) NOT NULL,
    idpersistejoin numeric(5,0),
    tipoconexion character varying(25),
    persistejoin numeric(1,0) DEFAULT 0 NOT NULL
);
COMMENT ON TABLE dat_mapeo IS 'Almacena la relación desde la tabla principal hasta la tabla que posee el campo.';
COMMENT ON COLUMN dat_mapeo.idmapeo IS 'Identificador del mapeo.';
COMMENT ON COLUMN dat_mapeo.idcampo IS 'Identificador del campo.';
COMMENT ON COLUMN dat_mapeo.esquema IS 'Nombre del esquema.';
COMMENT ON COLUMN dat_mapeo.tabla IS 'Nombre de la tabla.';
COMMENT ON COLUMN dat_mapeo.idpersistejoin IS 'Número que se utiliza para generar el alias de la tabla cuando la misma persista.';
COMMENT ON COLUMN dat_mapeo.tipoconexion IS 'Tipo de conexión:
LEFT JOIN, INNER JOIN.';
COMMENT ON COLUMN dat_mapeo.persistejoin IS 'Permite si se va a crear una nueva conexión a la tabla aunque ya la misma posea una:
0 - No persiste.
1 - Persite el join.';
CREATE TABLE dat_multievaluado (
    valor character varying(255) NOT NULL,
    denominacion character varying(255) NOT NULL,
    idcampo numeric(19,0) NOT NULL
);
COMMENT ON TABLE dat_multievaluado IS 'Almacena los valores de los campos multievaluados.';
COMMENT ON COLUMN dat_multievaluado.valor IS 'Valor que existe en base de datos.';
COMMENT ON COLUMN dat_multievaluado.denominacion IS 'Valor que se va a mostrar.';
COMMENT ON COLUMN dat_multievaluado.idcampo IS 'Identificador del campo.';
CREATE SEQUENCE sec_union_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    MAXVALUE 999999999999999999
    CACHE 1;
COMMENT ON SEQUENCE sec_union_seq IS ' Secuencia empleada para autogenerar el identificador de la tabla "dat_union".';
CREATE TABLE dat_union (
    idunion numeric(19,0) DEFAULT nextval('sec_union_seq'::regclass) NOT NULL,
    idmapeo numeric(19,0) NOT NULL,
    campoinicial character varying(255) NOT NULL,
    operador character varying(255) NOT NULL,
    campofinal character varying(255) NOT NULL,
    logico character varying(255)
);
COMMENT ON TABLE dat_union IS 'Almacena las uniones entre las tablas.';
COMMENT ON COLUMN dat_union.idunion IS 'Identificador de la unión.';
COMMENT ON COLUMN dat_union.idmapeo IS 'Identificador de mapeo.';
COMMENT ON COLUMN dat_union.campoinicial IS 'Campo inicial de la conexión.';
COMMENT ON COLUMN dat_union.operador IS 'Operador a utilizar en la conexión.';
COMMENT ON COLUMN dat_union.campofinal IS 'Campo final de la conexión.';
COMMENT ON COLUMN dat_union.logico IS 'Operador lógico:
AND, OR.';
CREATE TABLE nom_configuracion (
    idconfiguracion character varying(50) NOT NULL,
    denominacion character varying(255) NOT NULL,
    servidor character varying(15) NOT NULL,
    puerto numeric(4,0) NOT NULL,
    basedato character varying(255) NOT NULL,
    usuario character varying(255) NOT NULL,
    contrasena character varying(255) NOT NULL,
    claveproteccion character varying(255) NOT NULL,
    esquema character varying(50) NOT NULL,
    tabla character varying(50) NOT NULL,
    idtablabase character varying(50) NOT NULL
);
COMMENT ON TABLE nom_configuracion IS 'Almacena las configuraciones.';
COMMENT ON COLUMN nom_configuracion.idconfiguracion IS 'Identificador de la configuración.';
COMMENT ON COLUMN nom_configuracion.denominacion IS 'Nombre de la configuración.';
COMMENT ON COLUMN nom_configuracion.servidor IS 'Servidor sobre el que se va a basar la configuración.';
COMMENT ON COLUMN nom_configuracion.puerto IS 'Puerto de conexión al servidor.';
COMMENT ON COLUMN nom_configuracion.basedato IS 'Base de datos sobre la que se va a basar la configuración.';
COMMENT ON COLUMN nom_configuracion.usuario IS 'Nombre de usuario para conexión al servidor.';
COMMENT ON COLUMN nom_configuracion.contrasena IS 'Contraseña de conexión.';
COMMENT ON COLUMN nom_configuracion.claveproteccion IS 'Contraseña para restringir el acceso a la configuración.';
COMMENT ON COLUMN nom_configuracion.esquema IS 'Esquema de la tabla base.';
COMMENT ON COLUMN nom_configuracion.tabla IS 'Nombre de la tabla base.';
COMMENT ON COLUMN nom_configuracion.idtablabase IS 'Id de la tabla base.';
CREATE SEQUENCE sec_filtro_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    MAXVALUE 999999999999999999
    CACHE 1;
COMMENT ON SEQUENCE sec_filtro_seq IS ' Secuencia empleada para autogenerar el identificador de la tabla "seg_filtro".';
CREATE SEQUENCE sec_segcampo_seq
    START WITH 1
    INCREMENT BY 1
    MINVALUE 0
    MAXVALUE 999999999999999999
    CACHE 1;
COMMENT ON SEQUENCE sec_segcampo_seq IS ' Secuencia empleada para autogenerar el identificador de la tabla "seg_campo".';
SET default_with_oids = false;
CREATE TABLE seg_campo (
    idsegcampo numeric(19,0) DEFAULT nextval('sec_segcampo_seq'::regclass) NOT NULL,
    idcampo numeric(19,0) NOT NULL,
    idrol numeric(19,0) NOT NULL
);
COMMENT ON TABLE seg_campo IS 'Almacena la asociación del campo al rol.';
COMMENT ON COLUMN seg_campo.idsegcampo IS 'Identificador del campo asociado al rol.';
COMMENT ON COLUMN seg_campo.idcampo IS 'Identificador del campo.';
COMMENT ON COLUMN seg_campo.idrol IS 'Identificador del rol.';
CREATE TABLE seg_filtro (
    idfiltro numeric(19,0) DEFAULT nextval('sec_filtro_seq'::regclass) NOT NULL,
    condicion character varying(20) NOT NULL,
    valor character varying,
    logico character varying(3),
    idcampo numeric(19,0) NOT NULL,
    idrol numeric(19,0) NOT NULL,
    orden numeric(1,0),
    valormostrar character varying(255)
);
COMMENT ON TABLE seg_filtro IS 'Almacena los filtros aplicables al campo.';
COMMENT ON COLUMN seg_filtro.idfiltro IS 'Identificador del filtro.';
COMMENT ON COLUMN seg_filtro.condicion IS 'Condicional asociada al campo a filtrar.';
COMMENT ON COLUMN seg_filtro.valor IS 'Valor a filtrar por la condición del campo.';
COMMENT ON COLUMN seg_filtro.logico IS 'Operador lógico de la condicional.';
COMMENT ON COLUMN seg_filtro.idcampo IS 'Identificador del campo.';
COMMENT ON COLUMN seg_filtro.idrol IS 'Identificador del rol.';
COMMENT ON COLUMN seg_filtro.orden IS 'Orden para verificar las condicionales del campo dentro del filtrado.';
COMMENT ON COLUMN seg_filtro.valormostrar IS 'Valor que se debe mostrar al usuario al configurar los filtros en la compartimentación.';
--</lineabase>
--</Schema>

--<data>
-- Created By : ScriptSplitGenerador
-- Code : http://10.12.170.129:9880/reccomplejas/trunk/lineabase
-- Only Data
SET statement_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;
SET search_path = mod_reccomplejas2, pg_catalog;
INSERT INTO dat_busqueda (idbusqueda, codigo, denominacion, descripcion, sqlbusqueda, sqltotal, idaviso, tablasvisitadas, arrideventos, configuracion, idconfiguracion, cantidad) VALUES (36, NULL, 'Cantidad por Afiliacion y Sexo', NULL, '', '', NULL, NULL, ',,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,', '{"selectores":[{"idcampo":"1641","esquema":"mod_persona","tabla":"dat_persona","campo":"papel","alias":"papel","obligatorio":"1","anchocolumna":"100","expander":"0","renderer":"","agruparcampo":"0"},{"idcampo":"1642","esquema":"mod_persona","tabla":"dat_persona","campo":"sapel","alias":"sapel","obligatorio":"1","anchocolumna":"100","expander":"0","renderer":"","agruparcampo":"0"},{"idcampo":"1674","esquema":"mod_persona","tabla":"dat_persona","campo":"nombre","alias":"nombre","obligatorio":"1","anchocolumna":"100","expander":"0","renderer":"","agruparcampo":"0"},{"idcampo":"1640","esquema":"mod_persona","tabla":"dat_persona","campo":"snombre","alias":"snombre","obligatorio":"1","anchocolumna":"100","expander":"0","renderer":"","agruparcampo":"0"},{"idcampo":"1643","esquema":"mod_persona","tabla":"dat_persona","campo":"sexo","alias":"sexo","obligatorio":"1","anchocolumna":"100","expander":"0","renderer":"showSexo","agruparcampo":"0"},{"idcampo":"1420","esquema":"mod_persona","tabla":"dat_docidentidad","campo":"numero","alias":"numid","obligatorio":"1","anchocolumna":"150","expander":"0","renderer":"","agruparcampo":"0"},{"idcampo":"1438","esquema":"mod_personaext","tabla":"nom_organizacion","campo":"denominacion","alias":"_1438","obligatorio":"0","anchocolumna":"100","expander":"0","renderer":"","agruparcampo":"0"}],"condiciones":[],"orden":[],"operacion":[{"campo":"Organizaci\u00f3n afiliada","idcampo":"1438","tooltip":"","tipoOperacion":"COUNT","nombreOperacion":"Cantidad","esquema":"mod_personaext","tabla":"Organizaci\u00f3n afiliada"},{"campo":"Sexo","idcampo":"1643","tooltip":"","tipoOperacion":"COUNT","nombreOperacion":"Cantidad","esquema":"mod_persona","tabla":"dat_persona"}]}', 'personas', 1);
INSERT INTO dat_busqueda (idbusqueda, codigo, denominacion, descripcion, sqlbusqueda, sqltotal, idaviso, tablasvisitadas, arrideventos, configuracion, idconfiguracion, cantidad) VALUES (35, NULL, 'Cantidad por sexo', NULL, '', '', NULL, NULL, ',,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,', '{"selectores":[{"idcampo":"1641","esquema":"mod_persona","tabla":"dat_persona","campo":"papel","alias":"papel","obligatorio":"1","anchocolumna":"100","expander":"0","renderer":"","agruparcampo":"0"},{"idcampo":"1642","esquema":"mod_persona","tabla":"dat_persona","campo":"sapel","alias":"sapel","obligatorio":"1","anchocolumna":"100","expander":"0","renderer":"","agruparcampo":"0"},{"idcampo":"1674","esquema":"mod_persona","tabla":"dat_persona","campo":"nombre","alias":"nombre","obligatorio":"1","anchocolumna":"100","expander":"0","renderer":"","agruparcampo":"0"},{"idcampo":"1640","esquema":"mod_persona","tabla":"dat_persona","campo":"snombre","alias":"snombre","obligatorio":"1","anchocolumna":"100","expander":"0","renderer":"","agruparcampo":"0"},{"idcampo":"1643","esquema":"mod_persona","tabla":"dat_persona","campo":"sexo","alias":"sexo","obligatorio":"1","anchocolumna":"100","expander":"0","renderer":"showSexo","agruparcampo":"0"},{"idcampo":"1420","esquema":"mod_persona","tabla":"dat_docidentidad","campo":"numero","alias":"numid","obligatorio":"1","anchocolumna":"150","expander":"0","renderer":"","agruparcampo":"0"}],"condiciones":[],"orden":[],"operacion":[{"campo":"Sexo","idcampo":"1643","tooltip":"","tipoOperacion":"COUNT","nombreOperacion":"Cantidad","esquema":"mod_persona","tabla":"dat_persona"}]}', 'personas', 1);
INSERT INTO dat_busqueda (idbusqueda, codigo, denominacion, descripcion, sqlbusqueda, sqltotal, idaviso, tablasvisitadas, arrideventos, configuracion, idconfiguracion, cantidad) VALUES (34, NULL, 'Busqueda de operaciones', NULL, '', '', NULL, NULL, ',,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,', '{"selectores":[{"idcampo":"1641","esquema":"mod_persona","tabla":"dat_persona","campo":"papel","alias":"papel","obligatorio":"1","anchocolumna":"100","expander":"0","renderer":"","agruparcampo":"0"},{"idcampo":"1642","esquema":"mod_persona","tabla":"dat_persona","campo":"sapel","alias":"sapel","obligatorio":"1","anchocolumna":"100","expander":"0","renderer":"","agruparcampo":"0"},{"idcampo":"1674","esquema":"mod_persona","tabla":"dat_persona","campo":"nombre","alias":"nombre","obligatorio":"1","anchocolumna":"100","expander":"0","renderer":"","agruparcampo":"0"},{"idcampo":"1640","esquema":"mod_persona","tabla":"dat_persona","campo":"snombre","alias":"snombre","obligatorio":"1","anchocolumna":"100","expander":"0","renderer":"","agruparcampo":"0"},{"idcampo":"1643","esquema":"mod_persona","tabla":"dat_persona","campo":"sexo","alias":"sexo","obligatorio":"1","anchocolumna":"100","expander":"0","renderer":"showSexo","agruparcampo":"0"},{"idcampo":"1403","esquema":"mod_persona","tabla":"nom_colorojos","campo":"denominacion","alias":"denomcolorojos","obligatorio":"0","anchocolumna":"100","expander":"0","renderer":"","agruparcampo":"0"},{"idcampo":"1404","esquema":"mod_persona","tabla":"nom_colorpelo","campo":"denominacion","alias":"denomcolorpelo","obligatorio":"0","anchocolumna":"100","expander":"0","renderer":"","agruparcampo":"0"},{"idcampo":"1405","esquema":"mod_persona","tabla":"nom_colorpiel","campo":"denominacion","alias":"denomcolorpiel","obligatorio":"0","anchocolumna":"100","expander":"0","renderer":"","agruparcampo":"0"},{"idcampo":"1420","esquema":"mod_persona","tabla":"dat_docidentidad","campo":"numero","alias":"numid","obligatorio":"1","anchocolumna":"150","expander":"0","renderer":"","agruparcampo":"0"}],"condiciones":[],"orden":[],"operacion":[{"campo":"Color de ojos","idcampo":"1403","tooltip":"","tipoOperacion":"COUNT","nombreOperacion":"Cantidad","esquema":"mod_persona","tabla":"nom_colorojos"},{"campo":"Sexo","idcampo":"1643","tooltip":"","tipoOperacion":"COUNT","nombreOperacion":"Cantidad","esquema":"mod_persona","tabla":"dat_persona"}]}', 'personas', 1);
INSERT INTO dat_busqueda (idbusqueda, codigo, denominacion, descripcion, sqlbusqueda, sqltotal, idaviso, tablasvisitadas, arrideventos, configuracion, idconfiguracion, cantidad) VALUES (77, NULL, 'Personas por nivel educacional', NULL, 'SELECT DISTINCT COUNT(ab2.denominacion) as "Cantidad",ab2.denominacion as "Nivel educacional" FROM mod_persona.dat_persona ab0 LEFT JOIN mod_personaext.dat_niveleducacional ab1 ON(  ab1.idpersona = ab0.idpersona) LEFT JOIN mod_personaext.nom_niveleducacional ab2 ON(  ab2.idniveleducacional = ab1.idniveleducacional)  GROUP BY "Nivel educacional" HAVING COUNT(ab2.denominacion) <> 0', '', NULL, NULL, ',,,', '{"selectores":[{"idcampo":"1641","esquema":"mod_persona","tabla":"dat_persona","campo":"papel","alias":"papel","obligatorio":"1","anchocolumna":"100","expander":"0","renderer":"","agruparcampo":"0"},{"idcampo":"1642","esquema":"mod_persona","tabla":"dat_persona","campo":"sapel","alias":"sapel","obligatorio":"1","anchocolumna":"100","expander":"0","renderer":"","agruparcampo":"0"},{"idcampo":"1674","esquema":"mod_persona","tabla":"dat_persona","campo":"nombre","alias":"nombre","obligatorio":"1","anchocolumna":"100","expander":"0","renderer":"","agruparcampo":"0"},{"idcampo":"1640","esquema":"mod_persona","tabla":"dat_persona","campo":"snombre","alias":"snombre","obligatorio":"1","anchocolumna":"100","expander":"0","renderer":"","agruparcampo":"0"},{"idcampo":"1643","esquema":"mod_persona","tabla":"dat_persona","campo":"sexo","alias":"sexo","obligatorio":"1","anchocolumna":"100","expander":"0","renderer":"showSexo","agruparcampo":"0"},{"idcampo":"1420","esquema":"mod_persona","tabla":"dat_docidentidad","campo":"numero","alias":"numid","obligatorio":"1","anchocolumna":"150","expander":"0","renderer":"","agruparcampo":"0"},{"idcampo":"1746","esquema":"mod_personaext","tabla":"nom_niveleducacional","campo":"denominacion","alias":"_1746","obligatorio":"0","anchocolumna":"100","expander":"0","renderer":"","agruparcampo":"0"}],"condiciones":[],"orden":[],"operacion":[{"campo":"Nivel educacional","idcampo":"1746","tooltip":"","tipoOperacion":"COUNT","nombreOperacion":"Cantidad","esquema":"mod_personaext","tabla":"nom_niveleducacional"}]}', 'personas', 1);
INSERT INTO dat_busqueda (idbusqueda, codigo, denominacion, descripcion, sqlbusqueda, sqltotal, idaviso, tablasvisitadas, arrideventos, configuracion, idconfiguracion, cantidad) VALUES (79, NULL, 'Cantidad por color de piel', NULL, 'SELECT DISTINCT COUNT(ab2.denominacion) as "Cantidad",ab2.denominacion as "Color de piel" FROM mod_persona.dat_persona ab0 LEFT JOIN mod_persona.dat_fenotipo ab1 ON(  ab1.idpersona = ab0.idpersona) LEFT JOIN mod_persona.nom_colorpiel ab2 ON(  ab2.idcolorpiel = ab1.idcolorpiel)  GROUP BY "Color de piel" HAVING COUNT(ab2.denominacion) <> 0', '', NULL, NULL, ',,,', '{"selectores":[{"idcampo":"1641","esquema":"mod_persona","tabla":"dat_persona","campo":"papel","alias":"papel","obligatorio":"1","anchocolumna":"100","expander":"0","renderer":"","agruparcampo":"0"},{"idcampo":"1642","esquema":"mod_persona","tabla":"dat_persona","campo":"sapel","alias":"sapel","obligatorio":"1","anchocolumna":"100","expander":"0","renderer":"","agruparcampo":"0"},{"idcampo":"1674","esquema":"mod_persona","tabla":"dat_persona","campo":"nombre","alias":"nombre","obligatorio":"1","anchocolumna":"100","expander":"0","renderer":"","agruparcampo":"0"},{"idcampo":"1640","esquema":"mod_persona","tabla":"dat_persona","campo":"snombre","alias":"snombre","obligatorio":"1","anchocolumna":"100","expander":"0","renderer":"","agruparcampo":"0"},{"idcampo":"1643","esquema":"mod_persona","tabla":"dat_persona","campo":"sexo","alias":"sexo","obligatorio":"1","anchocolumna":"100","expander":"0","renderer":"showSexo","agruparcampo":"0"},{"idcampo":"1405","esquema":"mod_persona","tabla":"nom_colorpiel","campo":"denominacion","alias":"denomcolorpiel","obligatorio":"0","anchocolumna":"100","expander":"0","renderer":"","agruparcampo":"0"},{"idcampo":"1420","esquema":"mod_persona","tabla":"dat_docidentidad","campo":"numero","alias":"numid","obligatorio":"1","anchocolumna":"150","expander":"0","renderer":"","agruparcampo":"0"}],"condiciones":[],"orden":[],"operacion":[{"campo":"Color de piel","idcampo":"1405","tooltip":"","tipoOperacion":"COUNT","nombreOperacion":"Cantidad","esquema":"mod_persona","tabla":"nom_colorpiel"}]}', 'personas', 1);
INSERT INTO dat_busqueda (idbusqueda, codigo, denominacion, descripcion, sqlbusqueda, sqltotal, idaviso, tablasvisitadas, arrideventos, configuracion, idconfiguracion, cantidad) VALUES (45, NULL, 'Cargos ejecutivos escala 9', NULL, '', '', NULL, 'mod_estructuracomp.dat_cargo,mod_estructuracomp.nom_cargo,mod_estructuracomp.nom_grupocomplejidad,mod_estructuracomp.dat_cargocivil,mod_estructuracomp.nom_categocup', ',,,', '{"selectores":[{"idcampo":"1771","esquema":"mod_estructuracomp","tabla":"nom_cargo","campo":"denominacion","alias":"_1771","obligatorio":"1","anchocolumna":"120","expander":"0","renderer":"","agruparcampo":"0"},{"idcampo":"1773","esquema":"mod_estructuracomp","tabla":"nom_salario","campo":"salario","alias":"_1773","obligatorio":"0","anchocolumna":"100","expander":"0","renderer":"","agruparcampo":"0"},{"idcampo":"1774","esquema":"mod_estructuracomp","tabla":"nom_categocup","campo":"denominacion","alias":"_1774","obligatorio":"0","anchocolumna":"100","expander":"0","renderer":"","agruparcampo":"0"}],"condiciones":[{"idcampo":"1772","denominacion":"Grupo escala","condicionmostrar":"Igual","valormostrar":"IX","logico":"and","mostrarlogico":"Y","tipo":"NOMENCLADOR","condicion":"=","valor":"9"},{"idcampo":"1774","denominacion":"Categor\u00eda ocupacional","condicionmostrar":"Igual","valormostrar":"EJECUTIVO","logico":"","mostrarlogico":"","tipo":"NOMENCLADOR","condicion":"=","valor":"0"}],"orden":[],"operacion":[]}', 'estructura', 0);
INSERT INTO dat_busqueda (idbusqueda, codigo, denominacion, descripcion, sqlbusqueda, sqltotal, idaviso, tablasvisitadas, arrideventos, configuracion, idconfiguracion, cantidad) VALUES (76, NULL, 'Personas x edad', NULL, 'SELECT DISTINCT COUNT(ab1.fechanacimiento) as "Cantidad", (date_part(''year'',age(ab1.fechanacimiento)) || '' años'') as "Edad" , COUNT(*) as "Cant", ((CASE WHEN ab0.sexo = ''0'' THEN ''Femenino'' WHEN ab0.sexo = ''1'' THEN ''Masculino'' END)) as "Sexo" FROM mod_persona.dat_persona ab0 LEFT JOIN mod_persona.dat_datosnacimiento ab1 ON(  ab1.idpersona = ab0.idpersona)   GROUP BY "Edad", "Sexo" HAVING COUNT(ab1.fechanacimiento) <> 0 AND COUNT(ab0.sexo) <> 0', '', NULL, NULL, ',,,,,,,,,,,,,,', '{"selectores":[{"idcampo":"1641","esquema":"mod_persona","tabla":"dat_persona","campo":"papel","alias":"papel","obligatorio":"1","anchocolumna":"100","expander":"0","renderer":"","agruparcampo":"0"},{"idcampo":"1642","esquema":"mod_persona","tabla":"dat_persona","campo":"sapel","alias":"sapel","obligatorio":"1","anchocolumna":"100","expander":"0","renderer":"","agruparcampo":"0"},{"idcampo":"1674","esquema":"mod_persona","tabla":"dat_persona","campo":"nombre","alias":"nombre","obligatorio":"1","anchocolumna":"100","expander":"0","renderer":"","agruparcampo":"0"},{"idcampo":"1640","esquema":"mod_persona","tabla":"dat_persona","campo":"snombre","alias":"snombre","obligatorio":"1","anchocolumna":"100","expander":"0","renderer":"","agruparcampo":"0"},{"idcampo":"1643","esquema":"mod_persona","tabla":"dat_persona","campo":"sexo","alias":"sexo","obligatorio":"1","anchocolumna":"100","expander":"0","renderer":"showSexo","agruparcampo":"0"},{"idcampo":"1503","esquema":"mod_persona","tabla":"dat_datosnacimiento","campo":"fechanacimiento","alias":"edad","obligatorio":"0","anchocolumna":"100","expander":"0","renderer":"","agruparcampo":"0"},{"idcampo":"1420","esquema":"mod_persona","tabla":"dat_docidentidad","campo":"numero","alias":"numid","obligatorio":"1","anchocolumna":"150","expander":"0","renderer":"","agruparcampo":"0"}],"condiciones":[],"orden":[],"operacion":[{"campo":"Edad","idcampo":"1503","tooltip":"","tipoOperacion":"COUNT","nombreOperacion":"Cantidad","esquema":"mod_persona","tabla":"dat_datosnacimiento"},{"campo":"Sexo","idcampo":"1643","tooltip":"","tipoOperacion":"COUNT","nombreOperacion":"Cant","esquema":"mod_persona","tabla":"dat_persona"}]}', 'personas', 1);
INSERT INTO dat_busqueda (idbusqueda, codigo, denominacion, descripcion, sqlbusqueda, sqltotal, idaviso, tablasvisitadas, arrideventos, configuracion, idconfiguracion, cantidad) VALUES (26, NULL, 'Cantidad por sexo mayores de 15 años', NULL, '', '', NULL, 'mod_persona.dat_datosnacimiento', '', '{"selectores":[{"idcampo":"1641","esquema":"mod_persona","tabla":"dat_persona","campo":"papel","alias":"papel","obligatorio":"1","anchocolumna":"100","expander":"0","renderer":"","agruparcampo":"0"},{"idcampo":"1642","esquema":"mod_persona","tabla":"dat_persona","campo":"sapel","alias":"sapel","obligatorio":"1","anchocolumna":"100","expander":"0","renderer":"","agruparcampo":"0"},{"idcampo":"1674","esquema":"mod_persona","tabla":"dat_persona","campo":"nombre","alias":"nombre","obligatorio":"1","anchocolumna":"100","expander":"0","renderer":"","agruparcampo":"0"},{"idcampo":"1640","esquema":"mod_persona","tabla":"dat_persona","campo":"snombre","alias":"snombre","obligatorio":"1","anchocolumna":"100","expander":"0","renderer":"","agruparcampo":"0"},{"idcampo":"1643","esquema":"mod_persona","tabla":"dat_persona","campo":"sexo","alias":"sexo","obligatorio":"1","anchocolumna":"100","expander":"0","renderer":"showSexo","agruparcampo":"0"},{"idcampo":"1420","esquema":"mod_persona","tabla":"dat_docidentidad","campo":"numero","alias":"numid","obligatorio":"1","anchocolumna":"150","expander":"0","renderer":"","agruparcampo":"0"}],"condiciones":[{"idcampo":"1503","denominacion":"Edad","condicionmostrar":"Igual","valormostrar":15,"logico":"","mostrarlogico":"","tipo":"NUMERO","condicion":"=","valor":15}],"orden":[],"operacion":[]}', 'personas', 0);
INSERT INTO dat_busqueda (idbusqueda, codigo, denominacion, descripcion, sqlbusqueda, sqltotal, idaviso, tablasvisitadas, arrideventos, configuracion, idconfiguracion, cantidad) VALUES (37, NULL, 'Cantidad por afiliacion', NULL, '', '', NULL, NULL, ',,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,', '{"selectores":[{"idcampo":"1641","esquema":"mod_persona","tabla":"dat_persona","campo":"papel","alias":"papel","obligatorio":"1","anchocolumna":"100","expander":"0","renderer":"","agruparcampo":"0"},{"idcampo":"1642","esquema":"mod_persona","tabla":"dat_persona","campo":"sapel","alias":"sapel","obligatorio":"1","anchocolumna":"100","expander":"0","renderer":"","agruparcampo":"0"},{"idcampo":"1674","esquema":"mod_persona","tabla":"dat_persona","campo":"nombre","alias":"nombre","obligatorio":"1","anchocolumna":"100","expander":"0","renderer":"","agruparcampo":"0"},{"idcampo":"1640","esquema":"mod_persona","tabla":"dat_persona","campo":"snombre","alias":"snombre","obligatorio":"1","anchocolumna":"100","expander":"0","renderer":"","agruparcampo":"0"},{"idcampo":"1643","esquema":"mod_persona","tabla":"dat_persona","campo":"sexo","alias":"sexo","obligatorio":"1","anchocolumna":"100","expander":"0","renderer":"showSexo","agruparcampo":"0"},{"idcampo":"1420","esquema":"mod_persona","tabla":"dat_docidentidad","campo":"numero","alias":"numid","obligatorio":"1","anchocolumna":"150","expander":"0","renderer":"","agruparcampo":"0"},{"idcampo":"1438","esquema":"mod_personaext","tabla":"nom_organizacion","campo":"denominacion","alias":"_1438","obligatorio":"0","anchocolumna":"100","expander":"0","renderer":"","agruparcampo":"0"}],"condiciones":[],"orden":[],"operacion":[{"campo":"Organizaci\u00f3n afiliada","idcampo":"1438","tooltip":"","tipoOperacion":"COUNT","nombreOperacion":"Cantidad","esquema":"mod_personaext","tabla":"nom_organizacion"}]}', 'personas', 1);
INSERT INTO dat_busqueda (idbusqueda, codigo, denominacion, descripcion, sqlbusqueda, sqltotal, idaviso, tablasvisitadas, arrideventos, configuracion, idconfiguracion, cantidad) VALUES (65, NULL, 'Cant por sexo', NULL, 'SELECT DISTINCT COUNT(*) as "Cantidad", ((CASE WHEN ab0.sexo = ''0'' THEN ''Femenino'' WHEN ab0.sexo = ''1'' THEN ''Masculino'' END)) as "Sexo" FROM mod_persona.dat_persona ab0  GROUP BY "Sexo" HAVING COUNT(ab0.sexo) <> 0', '', NULL, NULL, ',', '{"selectores":[{"idcampo":"1641","esquema":"mod_persona","tabla":"dat_persona","campo":"papel","alias":"papel","obligatorio":"1","anchocolumna":"100","expander":"0","renderer":"","agruparcampo":"0"},{"idcampo":"1642","esquema":"mod_persona","tabla":"dat_persona","campo":"sapel","alias":"sapel","obligatorio":"1","anchocolumna":"100","expander":"0","renderer":"","agruparcampo":"0"},{"idcampo":"1674","esquema":"mod_persona","tabla":"dat_persona","campo":"nombre","alias":"nombre","obligatorio":"1","anchocolumna":"100","expander":"0","renderer":"","agruparcampo":"0"},{"idcampo":"1640","esquema":"mod_persona","tabla":"dat_persona","campo":"snombre","alias":"snombre","obligatorio":"1","anchocolumna":"100","expander":"0","renderer":"","agruparcampo":"0"},{"idcampo":"1643","esquema":"mod_persona","tabla":"dat_persona","campo":"sexo","alias":"sexo","obligatorio":"1","anchocolumna":"100","expander":"0","renderer":"showSexo","agruparcampo":"0"},{"idcampo":"1420","esquema":"mod_persona","tabla":"dat_docidentidad","campo":"numero","alias":"numid","obligatorio":"1","anchocolumna":"150","expander":"0","renderer":"","agruparcampo":"0"}],"condiciones":[],"orden":[],"operacion":[{"campo":"Sexo","idcampo":"1643","tooltip":"","tipoOperacion":"COUNT","nombreOperacion":"Cantidad","esquema":"mod_persona","tabla":"dat_persona"}]}', 'personas', 1);
INSERT INTO dat_busquedausuario (idbusquedausuario, idbusqueda, idusuario, pordefecto, propietario) VALUES (64, 26, 300000000553, 0, 1);
INSERT INTO dat_busquedausuario (idbusquedausuario, idbusqueda, idusuario, pordefecto, propietario) VALUES (72, 34, 300000000566, 0, 1);
INSERT INTO dat_busquedausuario (idbusquedausuario, idbusqueda, idusuario, pordefecto, propietario) VALUES (73, 35, 300000000566, 0, 1);
INSERT INTO dat_busquedausuario (idbusquedausuario, idbusqueda, idusuario, pordefecto, propietario) VALUES (74, 36, 300000000566, 0, 1);
INSERT INTO dat_busquedausuario (idbusquedausuario, idbusqueda, idusuario, pordefecto, propietario) VALUES (75, 37, 300000000566, 0, 1);
INSERT INTO dat_busquedausuario (idbusquedausuario, idbusqueda, idusuario, pordefecto, propietario) VALUES (83, 45, 300000000172, 0, 1);
INSERT INTO dat_busquedausuario (idbusquedausuario, idbusqueda, idusuario, pordefecto, propietario) VALUES (103, 65, 300000000172, 0, 1);
INSERT INTO dat_busquedausuario (idbusquedausuario, idbusqueda, idusuario, pordefecto, propietario) VALUES (114, 76, 300000000172, 0, 1);
INSERT INTO dat_busquedausuario (idbusquedausuario, idbusqueda, idusuario, pordefecto, propietario) VALUES (115, 77, 300000000172, 0, 1);
INSERT INTO dat_busquedausuario (idbusquedausuario, idbusqueda, idusuario, pordefecto, propietario) VALUES (117, 79, 300000000172, 0, 1);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1734, 'personas', 1730, 'orgentidad', 'Entidad', '', 'mod_personaext', 'his_trayectorialaboral', '', NULL);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1752, 'personas', NULL, NULL, 'Direcciones', 'Datos de la direccion de la persona', NULL, NULL, NULL, NULL);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1640, 'personas', 1638, 'snombre', 'Segundo Nombre', '', 'mod_persona', 'dat_persona', 'snombre', 1643);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1759, 'contratos', NULL, NULL, 'Datos generales', 'Datos generales', NULL, NULL, NULL, NULL);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1675, 'personas', 1729, 'denominacion', 'Situación laboral', 'Situación laboral de la persona', 'mod_persona', 'nom_situacion', 'denomSitLab', 1678);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1745, 'personas', 1468, NULL, 'Nivel educacional', 'Nivel educacional', NULL, NULL, NULL, NULL);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1765, 'contratos', 1759, 'fechanacimiento', 'Fecha de nacimiento', '', 'mod_persona', 'dat_datosnacimiento', '', 1765);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1729, 'personas', 977, NULL, 'Ocupación actual', 'Datos de la ocupación actual', NULL, NULL, NULL, 1729);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1642, 'personas', 1638, 'sapel', 'Segundo Apellido', '', 'mod_persona', 'dat_persona', 'sapel', 1641);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1674, 'personas', 1638, 'nombre', 'Nombre', 'Nombre de la persona', 'mod_persona', 'dat_persona', 'nombre', 1642);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1492, 'personas', NULL, NULL, 'Idiomas', '', NULL, NULL, NULL, 1513);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1401, 'personas', NULL, NULL, 'Datos fenotípicos', '', NULL, NULL, NULL, 1409);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (977, 'personas', NULL, NULL, 'Datos laborales', '', 'mod_persona', NULL, NULL, 1401);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1647, 'personas', 1636, 'snombre', 'Nombre y apellidos', '', 'mod_persona', 'dat_persona', 'nombreyapellidos', 1647);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1659, 'personas', 1729, 'denominacion', 'Cargo actual', 'Cargo que ocupa el trabajador', 'mod_estructuracomp', 'nom_cargo', 'denomcargo', 1659);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1710, 'personas', 936, 'denominacion', 'Provincia', 'Provincia de nacimiento', 'mod_datosmaestros', 'nom_dpt', 'denprov', 1710);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1660, 'personas', 1729, 'denominacion', 'Entidad actual', 'Entidad en la que la persona se encuentra constratada', 'mod_estructuracomp', 'dat_estructura', 'denomemtidad', 1660);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1735, 'personas', 1730, 'cargo', 'Cargo', '', 'mod_personaext', 'his_trayectorialaboral', '', NULL);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1495, 'personas', NULL, NULL, 'Sanciones', '', NULL, NULL, NULL, 1631);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1468, 'personas', NULL, NULL, 'Datos educacionales', '', NULL, NULL, NULL, 1482);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1413, 'personas', NULL, NULL, 'Datos de contacto', '', NULL, NULL, NULL, 1426);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1753, 'personas', 1752, 'denominacion', 'Provincia de residencia', '', 'mod_datosmaestros', 'nom_dpt', '', 1753);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1739, 'personas', 1729, 'principal', 'Es principal', '', 'mod_persona', 'dat_situacionlaboral', '', 1741);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1746, 'personas', 1745, 'denominacion', 'Nivel educacional', '', 'mod_personaext', 'nom_niveleducacional', '', 1746);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1760, 'contratos', 1759, 'nombre', 'Nombre', '', 'mod_persona', 'dat_persona', '', 1760);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1766, 'contratos', 1759, 'denominacion', 'Titulo, profesión u oficio', '', 'mod_personaext', 'nom_titulo', '', 1766);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1405, 'personas', 1401, 'denominacion', 'Color de piel', '', 'mod_persona', 'nom_colorpiel', 'denomcolorpiel', 1405);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1406, 'personas', 1401, 'estatura', 'Estatura', '', 'mod_persona', 'dat_fenotipo', 'denomestatura', 1406);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1407, 'personas', 1401, 'pesocorporal', 'Peso corporal', '', 'mod_persona', 'dat_fenotipo', 'denompesocorporal', 1407);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1410, 'personas', 1409, 'denominacion', 'Ciudadania', '', 'mod_persona', 'nom_ciudadania', 'denomciudadania', 1410);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1411, 'personas', 1409, 'fdesde', 'Desde', 'Fecha cuando obtiene la ciudadania', 'mod_persona', 'nom_ciudadania', '', 1411);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1412, 'personas', 1409, 'fhasta', 'Hasta', 'Fecha en que pierde la ciudadania', 'mod_persona', 'nom_ciudadania', '', 1412);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1754, 'personas', 1752, 'denominacion', 'Municipio de residencia', '', 'mod_datosmaestros', 'nom_dpt', '', 1754);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1736, 'personas', 1730, 'fdesde', 'Desde', '', 'mod_personaext', 'his_trayectorialaboral', '', NULL);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1636, 'personas', NULL, NULL, 'Datos auxiliares', '', NULL, NULL, NULL, 1619);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1436, 'personas', NULL, NULL, 'Datos de afiliaciones', '', NULL, NULL, NULL, 1447);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1431, 'personas', NULL, NULL, 'Datos de salud', '', NULL, NULL, NULL, 1436);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1426, 'personas', NULL, NULL, 'Nacionalidades', '', NULL, NULL, NULL, 1431);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1409, 'personas', NULL, NULL, 'Ciudadanias', '', NULL, NULL, NULL, 1418);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1740, 'personas', 1729, 'fdesde', 'Fecha inicio (Situación laboral)', '', 'mod_persona', 'dat_situacionlaboral', 'fdesdeSitLab', 1739);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1761, 'contratos', 1759, 'snombre', 'Segundo nombre', '', 'mod_persona', 'dat_persona', '', 1761);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1747, 'personas', 1745, 'denominacion', 'Título', '', 'mod_personaext', 'nom_titulo', '', 1747);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1724, 'personas', 1723, 'denominacion', 'Tipo de condecoración', 'Tipo de condecoración', 'mod_personaext', 'nom_tipocondecoracion', 'tipocondecoracion', 1724);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1422, 'personas', 1418, 'fdesde', 'Desde', 'Fecha en la que se obtiene el doc de identidicación', 'mod_persona', 'dat_docidentidad', '', 1422);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1427, 'personas', 1426, 'denominacion', 'Nacionalidades', '', 'mod_persona', 'nom_nacionalidad', '', 1427);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1429, 'personas', 1426, 'fdesde', 'Desde', 'Fecha en que obtiene la nacionalidad', 'mod_persona', 'dat_nacionalidad', '', 1429);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1430, 'personas', 1426, 'fhasta', 'Hasta', 'Fecha en la que pierde la nacionalidad', 'mod_persona', 'dat_nacionalidad', '', 1430);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1432, 'personas', 1431, 'denominacion', 'Padecimientos', '', 'mod_personaext', 'nom_padecimiento', '', 1432);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1433, 'personas', 1431, 'tratamiento', 'Tratamiento', '', 'mod_personaext', 'dat_afeccion', '', 1433);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1434, 'personas', 1431, 'fdesde', 'Desde', 'Fecha de detección del padecimiento', 'mod_personaext', 'dat_afeccion', '', 1434);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1435, 'personas', 1431, 'fhasta', 'Hasta', '', 'mod_personaext', 'dat_afeccion', '', 1435);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1438, 'personas', 1436, 'denominacion', 'Organización afiliada', '', 'mod_personaext', 'nom_organizacion', '', 1438);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1439, 'personas', 1436, 'denominacion', 'Tipo de organización afiliada', 'Tipo de organización afiliada', 'mod_personaext', 'nom_tipoorganizacion', '', 1439);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1440, 'personas', 1436, 'denominacion', 'Cargo en organización afiliada', '', 'mod_personaext', 'nom_cargoorganizacion', '', 1440);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1420, 'personas', 1418, 'numero', 'No. Identidad', 'Número de identidad de la persona. (Documento principal)', 'mod_persona', 'dat_docidentidad', 'numid', 1420);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1503, 'personas', 936, 'fechanacimiento', 'Edad', '', 'mod_persona', 'dat_datosnacimiento', 'edad', 1503);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (936, 'personas', NULL, NULL, 'Datos de nacimiento', 'Datos de nacimiento de la persona', 'mod_persona', NULL, NULL, 977);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1755, 'personas', 1752, 'direccion', 'Dirección de residencia', '', 'mod_persona', 'dat_direccion', '', 1755);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (937, 'personas', 936, 'fechanacimiento', 'Fecha de nacimiento', 'Fecha de nacimiento de la persona', 'mod_persona', 'dat_datosnacimiento', '', 937);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1737, 'personas', 1730, 'fhasta', 'Hasta', '', 'mod_personaext', 'his_trayectorialaboral', '', NULL);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1679, 'seleccion', NULL, NULL, 'Datos personales', 'Datos personales del candidato', NULL, NULL, NULL, 1679);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1741, 'personas', 1729, 'denominacion', 'ÿrea', '', 'mod_estructuracomp', 'dat_estructuraop', '', 1675);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1699, 'seleccion', 1694, 'freincorporacion', 'Fecha de reincorporación', 'Fecha en que se reincorpora el candidato al porceso', 'mod_seleccion', 'dat_excluido', 'freincorporacion', 1699);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1706, 'personas', 1705, 'denominacion', 'Categoría', 'Categoría de la persona.', 'mod_personaext', 'nom_categoria', 'categcient', 1706);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1748, 'personas', NULL, NULL, 'Datos de tallaje', 'Datos de tallaje', NULL, NULL, NULL, NULL);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1762, 'contratos', 1759, 'papel', 'Primer apellido', '', 'mod_persona', 'dat_persona', '', 1762);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1402, 'personas', 1401, 'denominacion', 'Grupo sanguineo', '', 'mod_persona', 'nom_gruposanguineo', 'denomgruposanguineo', 1402);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1403, 'personas', 1401, 'denominacion', 'Color de ojos', '', 'mod_persona', 'nom_colorojos', 'denomcolorojos', 1403);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1404, 'personas', 1401, 'denominacion', 'Color de pelo', '', 'mod_persona', 'nom_colorpelo', 'denomcolorpelo', 1404);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1408, 'personas', 1401, 'observaciones', 'Observaciones', '', 'mod_persona', 'dat_fenotipo', '', 1408);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1637, 'personas', 1636, 'idpersona', 'Identificador', 'Identificador de la persona', 'mod_persona', 'dat_persona', 'idpersona', 1637);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1645, 'personas', 1636, 'fregistro', 'Fecha de registro', 'Fecha de registro de la persona en el sistema', 'mod_persona', 'dat_persona', 'fregistro', 1645);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1648, 'personas', 1636, 'foto', 'Foto', 'Foto de la persona', 'mod_persona', 'dat_foto', 'foto', 1648);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1651, 'personas', 1636, 'idtipodocidentidad', 'Identificador del tipo de documento de identidad', '', 'mod_persona', 'dat_docidentidad', 'idtipodocidentidad', 1651);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1652, 'personas', 1636, 'denominacion', 'Tipo de documento de identidad', '', 'mod_persona', 'nom_tipodocidentidad', 'denomTipoDocIdentidad', 1652);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1653, 'personas', 1636, 'maxcaracter', 'Cantidad máxima de caracteres', '', 'mod_persona', 'nom_tipodocidentidad', 'maxcaracter', 1653);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1654, 'personas', 1636, 'mincaracter', 'Cantidad mínima de caracteres', '', 'mod_persona', 'nom_tipodocidentidad', 'mincaracter', 1654);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1656, 'personas', 1636, 'denominacion', 'Cargo', 'Cargo que ocupa la persona', 'mod_estructuracomp', 'nom_cargo', 'dencargo', 1656);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1657, 'personas', 1636, 'denominacion', 'ÿrea', '', 'mod_estructuracomp', 'dat_estructuraop', 'denarea', 1657);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1658, 'personas', 1636, 'denominacion', 'Entidad', '', 'mod_estructuracomp', 'dat_estructura', 'denentidad', 1658);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1694, 'seleccion', NULL, NULL, 'Datos de exclusión y reincorporación', 'Datos de exclusión y reicorporación del candidato del proceso', NULL, NULL, NULL, 1694);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1512, 'pago_resultado', NULL, 'denominacion', 'Tipo de pago', '', 'mod_nomina', 'nom_tipopago', 'tipopago', 1495);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1490, 'personas', NULL, NULL, 'Grados militares', '', NULL, NULL, NULL, 1492);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1680, 'seleccion', 1679, 'numero', 'No. Identidad', 'Número principal de identificación', 'mod_persona', 'dat_docidentidad', 'numid', 1680);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1705, 'personas', 1468, NULL, 'Categorías científicas', 'Categorías científicas de la persona', NULL, NULL, NULL, 1705);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1681, 'seleccion', 1679, 'snombre', 'Apellidos y Nombre(s)', 'Apellidos y nombre(s) de los candidatos', 'mod_persona', 'dat_persona', 'apellnomb', 1681);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1682, 'seleccion', 1679, 'feliminado', 'Fecha de eliminación', 'Fecha en que se elimina la persona', 'mod_persona', 'dat_persona', 'feliminado', 1682);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1683, 'seleccion', 1679, 'nombre', 'Nombre', 'Nombre del candidato', 'mod_persona', 'dat_persona', 'nombre', 1683);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1684, 'seleccion', 1679, 'snombre', 'Segundo nombre', 'Segundo nombre del candidato', 'mod_persona', 'dat_persona', 'snombre', 1684);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1685, 'seleccion', 1679, 'papel', 'Primer apellido', 'Primer apellido del candidato', 'mod_persona', 'dat_persona', 'papel', 1685);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1686, 'seleccion', 1679, 'sapel', 'Segundo apellido', 'Segundo apellido del candidato', 'mod_persona', 'dat_persona', 'sapel', 1686);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1687, 'seleccion', NULL, NULL, 'Datos generales del proceso', 'Datos generales del proceso de selección', NULL, NULL, NULL, 1687);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1688, 'seleccion', 1687, 'denominacion', 'Proceso de selección', '', 'mod_seleccion', 'dat_proceso', 'proceso', 1688);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1689, 'seleccion', NULL, NULL, 'Datos del candidato', 'Datos del candidato', NULL, NULL, NULL, 1689);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1690, 'seleccion', 1689, 'denominacion', 'Vía de reclutamiento', 'Vía de reclutamiento del candidato', 'mod_seleccion', 'nom_viareclutamiento', 'viareclutamiento', 1690);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1714, 'personas', 936, 'tomo', 'Tomo', '', 'mod_persona', 'dat_datosnacimiento', 'tomo', 1714);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1414, 'personas', 1413, 'contacto', 'Contacto', '', 'mod_persona', 'dat_contacto', '', 1414);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1415, 'personas', 1413, 'oficial', 'Oficial', 'Contacto con caracter oficial', 'mod_persona', 'dat_contacto', '', 1415);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1417, 'personas', 1413, 'denominacion', 'Tipo contacto', '', 'mod_persona', 'nom_tipocontacto', '', 1417);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1416, 'personas', 1413, 'denominacion', 'Medio contacto', '', 'mod_persona', 'nom_tipomediocontacto', '', 1416);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1424, 'personas', 1418, 'fhasta', 'Hasta', 'Fecha en la que deja de ser valido el doc de identificación', 'mod_persona', 'dat_docidentidad', '', 1424);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1425, 'personas', 1418, 'serie', 'Serie', '', 'mod_persona', 'dat_docidentidad', '', 1425);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1460, 'personas', 1458, 'nombre', 'Banco', '', 'mod_datosmaestros', 'nom_banco', '', 1460);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1480, 'personas', 1431, 'estadosalud', 'Estado de salud', '', 'mod_personaext', 'dat_estadosalud', '', 1480);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1481, 'personas', 1431, 'denominacion', 'Aptitud física', '', 'mod_personaext', 'nom_aptitudfisica', '', 1481);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1483, 'personas', 1482, 'denominacion', 'Misión', '', 'mod_personaext', 'nom_mision', '', 1483);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1484, 'personas', 1482, 'denominacion', 'Tipo de misión', '', 'mod_personaext', 'nom_tipomision', '', 1484);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1486, 'personas', 1482, 'denominacion', 'Tipo de estancia en el exterior', 'Tipo de estancia en el exterior', 'mod_personaext', 'nom_tipoestanciaexterior', '', 1486);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1487, 'personas', 1482, 'cargo', 'Cargo durante la estancia', 'Cargo durante la estancia', 'mod_personaext', 'dat_estanciaexterior', '', 1487);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1488, 'personas', 1482, 'fdesde', 'Desde', 'Fecha en que sale al exterior', 'mod_personaext', 'dat_estanciaexterior', '', 1488);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1489, 'personas', 1482, 'fhasta', 'Hasta', 'Fecha de regreso', 'mod_personaext', 'dat_estanciaexterior', '', 1489);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1491, 'personas', 1490, 'denominacion', 'Grado militar', '', 'mod_estructuracomp', 'nom_grado', '', 1491);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1421, 'personas', 1418, 'principal', 'Es principal', 'Define el doc principal', 'mod_persona', 'dat_docidentidad', '', 1421);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1493, 'personas', 1492, 'denominacion', 'Idioma', '', 'mod_personaext', 'nom_idioma', '', 1493);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1494, 'personas', 1492, 'denominacion', 'Via de aprendizaje', '', 'mod_personaext', 'nom_formaadquiriridioma', '', 1494);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1496, 'personas', 1495, 'denominacion', 'Sanciones', '', 'mod_personaext', 'nom_sancion', '', 1496);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1497, 'personas', 1495, 'denominacion', 'Tipo de sanción', '', 'mod_personaext', 'nom_tiposancion', '', 1497);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1498, 'personas', 1495, 'denominacion', 'Motivo de sanción', '', 'mod_personaext', 'nom_motivosancion', '', 1498);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1499, 'personas', 1495, 'fimposicion', 'Fecha de imposición', 'Fecha en la que se toma la medida como sanción', 'mod_personaext', 'dat_sancion', '', 1499);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1500, 'personas', 1495, 'fdesde', 'Fecha inicio', 'Fecha que da inicio al cumplimiento de la sanción', 'mod_personaext', 'dat_sancion', '', 1500);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1501, 'personas', 1495, 'tiemposancion', 'Tiempo de sanción', '', 'mod_personaext', 'dat_sancion', '', 1501);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1723, 'personas', 1452, NULL, 'Condecoraciones', 'Datos de condecoraciones', NULL, NULL, NULL, 1723);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1731, 'personas', 1468, NULL, 'Estudios concluidos', 'Datos de estudios concluidos', NULL, NULL, NULL, 1731);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1732, 'personas', 1731, 'denominacion', 'Curso', '', 'mod_personaext', 'nom_curso', '', 1732);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1478, 'personas', 1731, 'fdesde', 'Fecha Inicio', 'Fecha en que inició el curso', 'mod_personaext', 'dat_educacion', '', 1478);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1479, 'personas', 1731, 'fhasta', 'Fecha Conclusión', 'Fecha en que conluye el curso', 'mod_personaext', 'dat_educacion', '', 1479);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1715, 'personas', 936, 'folio', 'Folio', '', 'mod_persona', 'dat_datosnacimiento', 'folio', 1715);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1485, 'personas', 1482, 'nombrepais', 'País', '', 'mod_datosmaestros', 'nom_pais', '', 1485);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1419, 'personas', 1418, 'denominacion', 'Tipo de documento', 'Tipo de documento de identidad', 'mod_persona', 'nom_tipodocidentidad', 'tipodocidentidad', 1419);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1441, 'personas', 1436, 'denominacion', 'Nivel en la organización', '', 'mod_personaext', 'nom_nivelorganizacion', '', 1441);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1701, 'seleccion', 1694, 'observreincorporacion', 'Detalles de la reincorporación', 'Detalles de la reincorporación del candidato al proceso', 'mod_seleccion', 'dat_excluido', 'observreincorporacion', 1701);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1708, 'personas', 1705, 'fdesde', 'Fecha', 'Fecha en que la persona obtiene la categoría', 'mod_personaext', 'dat_categorizacion', 'fdesdeCteg', 1708);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1502, 'personas', 1495, 'unidadtiempo', 'Unidad de tiempo', '', 'mod_personaext', 'dat_sancion', '', 1502);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1514, 'pago_resultado', NULL, 'estadocalculado', 'Calculado', '', 'mod_nomina', 'conf_pagosporresultado', 'estadocalculado', 1514);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1515, 'pago_resultado', NULL, 'identidad', 'identidad', '', 'mod_nomina', 'conf_pagosporresultado', 'identidad', 1515);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1458, 'personas', NULL, NULL, 'Cuentas bancarias', '', NULL, NULL, NULL, 1468);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1513, 'pago_resultado', NULL, 'referencia', 'Referencia', '', 'mod_nomina', 'conf_pagosporresultado', 'referencia', 1512);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1678, 'personas', 1729, 'fhasta', 'Fecha fin (Situación laboral)', '', 'mod_persona', 'dat_situacionlaboral', 'fhastaSitLab', 1740);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1730, 'personas', 977, NULL, 'Trayectoria laboral', 'Datos de trayectoria laboral', NULL, NULL, NULL, 1730);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1482, 'personas', NULL, NULL, 'Estancias en el exterior', '', NULL, NULL, NULL, 1490);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1418, 'personas', NULL, NULL, 'Documentos de identificación', 'Documentos de identificación de la persona', NULL, NULL, NULL, 1413);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1742, 'personas', 1729, 'salario', 'Salario escala', '', 'mod_estructuracomp', 'nom_salario', '', 1742);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1749, 'personas', 1748, 'denominacion', 'Prenda', '', 'mod_personaext', 'nom_prenda', '', 1749);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1756, 'personas', 1752, 'oficial', 'Es dirección oficial', '', 'mod_persona', 'dat_direccion', '', 1756);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1641, 'personas', 1638, 'papel', 'Primer Apellido', '', 'mod_persona', 'dat_persona', 'papel', 1640);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1452, 'personas', NULL, NULL, 'Condecoraciones y sanciones', 'Datos de condecoraciones y sanciones', NULL, NULL, NULL, 1458);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1447, 'personas', NULL, NULL, 'Catacteristicas sociales', '', NULL, NULL, NULL, 1452);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1618, 'aistencia', NULL, NULL, 'Datos asistencia', '', NULL, NULL, NULL, 1618);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1700, 'seleccion', 1694, 'denominacion', 'Motivo de reincorporación', 'Motivo de reincorporación del candidato al proceso', 'mod_seleccion', 'nom_motivoreicorporacion', 'motivoreincorporacion', 1700);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1743, 'personas', 1729, 'denominacion', 'Grupo escala', '', 'mod_estructuracomp', 'nom_grupocomplejidad', '', 1743);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1707, 'personas', 1705, 'denominacion', 'Tipo de Categoría', 'Tipo de categoría de la persona', 'mod_personaext', 'nom_tipocategoria', 'tipoCateg', 1707);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1733, 'personas', 1731, 'resultado', 'Resultado obtenido', 'Resultado obtenido en el curso', 'mod_personaext', 'dat_educacion', '', 1733);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1711, 'personas', 936, 'denominacion', 'Municipio', 'Municipio de nacimiento', 'mod_datosmaestros', 'nom_dpt', 'denmunicipio', 1711);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1712, 'personas', 936, 'localidad', 'Localidad', 'Localidad de nacimiento', 'mod_persona', 'dat_datosnacimiento', 'locnacimiento', 1712);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1716, 'personas', 936, 'nombremadre', 'Nombre de la madre', '', 'mod_persona', 'dat_datosnacimiento', 'nombmadre', 1716);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1442, 'personas', 1436, 'fdesde', 'Desde', 'Fecha en la que ingresa a la organización', 'mod_personaext', 'dat_afiliacion', '', 1442);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1443, 'personas', 1436, 'fhasta', 'Hasta', 'Fecha en la que sale de la organización', 'mod_personaext', 'dat_afiliacion', '', 1443);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1445, 'personas', 1436, 'fdesde', 'Desde en el cargo', '', 'mod_personaext', 'dat_cargoorganizacion', '', 1445);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1446, 'personas', 1436, 'fhasta', 'Hasta en el cargo', '', 'mod_personaext', 'dat_cargoorganizacion', '', 1446);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1448, 'personas', 1447, 'denominacion', 'Estado civil', '', 'mod_personaext', 'nom_estadocivil', '', 1448);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1449, 'personas', 1447, 'denominacion', 'Estratificación social', '', 'mod_personaext', 'nom_estratificacionsocial', '', 1449);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1450, 'personas', 1447, 'alia', 'Alia o apodo', '', 'mod_personaext', 'dat_caracteristicasocial', '', 1450);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1451, 'personas', 1447, 'observaciones', 'Observaciones', 'Observaciones sobre caracteristicas sociales', 'mod_personaext', 'dat_caracteristicasocial', '', 1451);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1461, 'personas', 1458, 'codigo', 'Código del banco', '', 'mod_datosmaestros', 'nom_banco', '', 1461);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1462, 'personas', 1458, 'nombremoneda', 'Moneda de la cuenta', '', 'mod_datosmaestros', 'nom_moneda', '', 1462);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1464, 'personas', 1458, 'numerocuenta', 'No cuenta bancaria', '', 'mod_personaext', 'dat_cuentabancaria', '', 1464);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1465, 'personas', 1458, 'fdesde', 'Desde', 'Fecha de creación de la cuenta', 'mod_personaext', 'dat_cuentabancaria', '', 1465);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1467, 'personas', 1458, 'fhasta', 'Hasta', 'Fecha en la que caduca la cuenta', 'mod_personaext', 'dat_cuentabancaria', '', 1467);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1650, 'personas', 1418, 'numero', 'Documento de identidad', 'Documento de identidad de la persona', 'mod_persona', 'dat_docidentidad', 'docidentidad', 1650);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1655, 'personas', 1636, 'type', 'Tipo de expresión regular', '', 'mod_persona', 'nom_tipodocidentidad', 'type', 1655);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1596, 'activarpersona', NULL, 'snombre', 'Nombre(s) y apellidos', '', 'mod_persona', 'dat_persona', 'nombrecompleto', 1596);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1587, 'activarpersona', NULL, 'idpersona', 'idpersona', '', 'mod_persona', 'dat_persona', 'idpersona', 1587);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1610, 'aistencia', 1609, 'idpersona', 'idpersona', '', 'mod_persona', 'dat_persona', 'idpersona', 1610);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1611, 'aistencia', 1609, 'nombre', 'Nombre', '', 'mod_persona', 'dat_persona', 'nombre', 1611);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1613, 'aistencia', 1609, 'papel', 'Primer apellido', '', 'mod_persona', 'dat_persona', 'papel', 1613);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1614, 'aistencia', 1609, 'sapel', 'Segundo apellido', '', 'mod_persona', 'dat_persona', 'sapel', 1614);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1616, 'aistencia', 1609, 'sexo', 'Sexo', '', 'mod_persona', 'dat_persona', 'sexo', 1616);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1617, 'aistencia', 1609, 'numero', 'No. Identidad', '', 'mod_persona', 'dat_docidentidad', 'numid', 1617);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1609, 'aistencia', NULL, NULL, 'Datos personales', 'Datos personales de la persona', NULL, NULL, NULL, 1609);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1750, 'personas', 1748, 'denominacion', 'Norma', '', 'mod_personaext', 'nom_norma', '', 1750);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1620, 'aistencia', NULL, NULL, 'Datos causas', '', NULL, NULL, NULL, 1636);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1757, 'personas', 1752, 'fdesde', 'Fecha inicio', '', 'mod_persona', 'dat_direccion', '', 1757);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1763, 'contratos', 1759, 'sapel', 'Segundo apellido', '', 'mod_persona', 'dat_persona', '', 1763);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1624, 'aistencia', 1619, 'denominacion', 'Régimen de trabajo', '', 'mod_regimentrabajo', 'nom_regimentrabajo', 'regimentrabajo', 1624);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1625, 'aistencia', 1619, 'denominacion', 'Grupo de descanso', '', 'mod_regimentrabajo', 'nom_grupodescanso', 'grupodescanso', 1625);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1626, 'aistencia', 1619, 'denominacion', 'Turno de trabajo', '', 'mod_regimentrabajo', 'nom_turnotrabajo', 'turnotrabajo', 1626);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1725, 'personas', 1723, 'denominacion', 'Condecoración', 'Condecoración otorgada a la persona', 'mod_personaext', 'nom_condecoracion', 'condecoracion', 1725);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1469, 'personas', 1731, 'denominacion', 'Tipo de preparación', '', 'mod_personaext', 'nom_tipoformacion', '', 1469);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1470, 'personas', 1731, 'denominacion', 'Forma de preparación', '', 'mod_personaext', 'nom_modoformacion', '', 1470);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1594, 'activarpersona', NULL, 'iddocidentidad', 'iddocidentidad', '', 'mod_persona', 'dat_docidentidad', '', 1595);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1589, 'activarpersona', NULL, 'papel', 'Primer apellido', '', 'mod_persona', 'dat_persona', 'papel', 1589);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1590, 'activarpersona', NULL, 'sapel', 'Segundo apellido', '', 'mod_persona', 'dat_persona', 'sapel', 1590);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1588, 'activarpersona', NULL, 'nombre', 'Nombre', '', 'mod_persona', 'dat_persona', 'nombre', 1591);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1593, 'activarpersona', NULL, 'feliminado', 'Fecha eliminado', '', 'mod_persona', 'dat_persona', 'feliminado', 1594);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1595, 'activarpersona', NULL, 'numero', 'Número ID', '', 'mod_persona', 'dat_docidentidad', 'numid', 1588);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1471, 'personas', 1731, 'denominacion', 'Centro de estudio', '', 'mod_personaext', 'nom_centroestudio', '', 1471);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1717, 'personas', 936, 'nombrepadre', 'Nombre del padre', '', 'mod_persona', 'dat_datosnacimiento', 'nombpadre', 1717);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1727, 'personas', 1723, 'fecha', 'Fecha de condecoración', 'Fecha en que se otorga la condecoración', 'mod_personaext', 'dat_condecoracion', 'fcondecoracion', 1727);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1718, 'personas', 936, 'registrocivil', 'Registro civil', '', 'mod_persona', 'dat_datosnacimiento', 'registrocivil', 1718);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1758, 'personas', 1752, 'fhasta', 'Fecha fin', '', 'mod_persona', 'dat_direccion', '', 1758);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1751, 'personas', 1748, 'denominacion', 'Talla', '', 'mod_personaext', 'nom_talla', '', 1751);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1764, 'contratos', 1759, 'numero', 'No. identidad', '', 'mod_persona', 'dat_docidentidad', '', 1764);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1643, 'personas', 1638, 'sexo', 'Sexo', '', 'mod_persona', 'dat_persona', 'sexo', 1674);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1638, 'personas', NULL, NULL, 'Datos básicos', 'Datos básicos de la persona', NULL, NULL, NULL, 936);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1631, 'aistencia', NULL, NULL, 'Datos laborales', '', NULL, NULL, NULL, 1638);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1709, 'personas', 936, 'nombrepais', 'País', '', 'mod_datosmaestros', 'nom_pais', 'paisnac', 1709);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1726, 'personas', 1723, 'denominacion', 'Motivo de condecoración', 'Motivo por el cual se otorga una condecoración', 'mod_personaext', 'nom_motivocondecoracion', 'motivocondecoracion', 1726);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1612, 'aistencia', 1609, 'snombre', 'Nombre y apellidos', '', 'mod_persona', 'dat_persona', 'nombreapellidos', 1612);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1627, 'aistencia', 1620, 'denominacion', 'Causa', '', 'mod_regimentrabajo', 'nom_causa', 'denomcausa', 1627);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1628, 'aistencia', 1618, 'fecharegistro', 'Fecha', '', 'mod_regimentrabajo', 'dat_asistencia', 'fecharegistro', 1628);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1629, 'aistencia', 1618, 'fdesde', 'Desde', '', 'mod_regimentrabajo', 'dat_asistencia', 'fdesde', 1629);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1630, 'aistencia', 1618, 'fhasta', 'Hasta', '', 'mod_regimentrabajo', 'dat_asistencia', 'fhasta', 1630);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1632, 'aistencia', 1631, 'denominacion', 'Cargo', '', 'mod_estructuracomp', 'nom_cargo', 'denomcargo', 1632);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1634, 'aistencia', 1631, 'denominacion', 'ÿrea', '', 'mod_estructuracomp', 'dat_estructuraop', 'denomarea', 1634);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1635, 'aistencia', 1631, 'denominacion', 'Entidad', '', 'mod_estructuracomp', 'dat_estructura', 'denomentidad', 1635);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1692, 'seleccion', 1689, 'fhasta', 'Fecha fin', 'Fecha en que la persona deja de ser candidato del porceso', 'mod_seleccion', 'dat_candidato', 'ffincand', 1692);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1691, 'seleccion', 1689, 'fdesde', 'Fecha de registro', 'Fecha de registro como candidato en el proceso', 'mod_seleccion', 'dat_candidato', 'fdesdecand', 1691);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1693, 'seleccion', 1689, 'nombreusuario', 'Registrado por', 'Usuario que registra al candidato', 'mod_seguridad', 'seg_usuario', 'usuario', 1693);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1695, 'seleccion', 1694, 'fexclusion', 'Fecha de exclusión', 'Fecha en que se excluye el candidato del proceso', 'mod_seleccion', 'dat_excluido', 'fexclusion', 1695);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1696, 'seleccion', 1694, 'denominacion', 'Motivo de exclusión', 'Motivo de exclusión del candidato', 'mod_seleccion', 'nom_motivoexclusion', 'motivoexclusion', 1696);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1697, 'seleccion', 1694, 'observexclusion', 'Detalles de la exclusión', 'Conjunto de detalles y observaciones de la exclusión', 'mod_seleccion', 'dat_excluido', 'observexclusion', 1697);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1698, 'seleccion', 1694, 'tipo', 'Tipo de exclusión', '', 'mod_seleccion', 'dat_excluido', 'tipoexclusion', 1698);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1728, 'personas', 1723, 'observacion', 'Observación', 'Observación relacionada con la condecoración', 'mod_personaext', 'dat_condecoracion', 'observcondecoracion', 1728);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1619, 'aistencia', NULL, NULL, 'Datos régimen', '', NULL, NULL, NULL, 1620);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1767, 'personas', NULL, NULL, 'Dirección oficial', '', NULL, NULL, NULL, NULL);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1768, 'personas', 1767, 'direccion', 'Dirección', '', 'mod_persona', 'dat_direccion', '', 1768);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1769, 'personas', 1636, 'fechanacimiento', 'Edad', '', 'mod_persona', 'dat_datosnacimiento', 'edad', 1769);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1770, 'estructura', NULL, NULL, 'Plantilla', '', NULL, NULL, NULL, NULL);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1771, 'estructura', 1770, 'denominacion', 'Cargo', '', 'mod_estructuracomp', 'nom_cargo', '', 1771);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1772, 'estructura', 1770, 'denominacion', 'Grupo escala', '', 'mod_estructuracomp', 'nom_grupocomplejidad', '', 1772);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1773, 'estructura', 1770, 'salario', 'Salario', '', 'mod_estructuracomp', 'nom_salario', '', 1773);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1644, 'personas', 1636, 'feliminado', 'Fecha de eliminado', 'Fecha en que se eliminó la persona', 'mod_persona', 'dat_persona', 'feliminado', 1644);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1792, 'estructura', 1770, 'denominacion', 'Tipo de escala', '', 'mod_estructuracomp', 'nom_tipoescala', '', 1793);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1784, 'estructura', 1770, 'idcargo', 'ÿrea', '', 'mod_estructuracomp', 'dat_cargo', '', 1790);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1798, 'estructura', 1770, 'denominacion', 'Cargo nomenclador', '', 'mod_estructuracomp', 'nom_cargo', '', 1798);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1782, 'estructura', 1770, 'denominacion', 'Cargo facultado', '', 'mod_estructuracomp', 'nom_cargo', '', 1784);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1777, 'estructura', 1770, 'decisorio', 'Decisorio', '', 'mod_estructuracomp', 'dat_cargo', '', 1778);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1791, 'estructura', 1770, 'denespecialidad', 'Especialidad de preparación', '', 'mod_datosmaestros', 'nom_especialidad', '', 1792);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1780, 'estructura', 1770, 'cantidadreal', 'Ocupados', '', 'mod_estructuracomp', 'dat_cargo', '', 1782);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1794, 'estructura', 1770, 'temporal', 'Temporal', '', 'mod_estructuracomp', 'dat_cargo', '', 1795);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1779, 'estructura', 1770, 'cantidad', 'Cantidad', '', 'mod_estructuracomp', 'dat_cargo', '', 1780);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1793, 'estructura', 1770, 'directo', 'Directo', '', 'mod_estructuracomp', 'dat_cargo', '', 1794);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1790, 'estructura', 1770, 'denespecialidad', 'Especialidad de empleo', '', 'mod_datosmaestros', 'nom_especialidad', '', 1791);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1776, 'estructura', 1770, 'idcargo', 'Entidad', '', 'mod_estructuracomp', 'dat_cargo', '', 1777);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1778, 'estructura', 1770, 'denominacion', 'Sector', '', 'mod_estructuracomp', 'nom_sector', '', 1779);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1775, 'estructura', 1770, 'idfila', 'Buscar cargos contenidos en estructuras', '', 'mod_estructuracomp', 'nom_filaestruc', '', 1776);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1795, 'estructura', 1770, 'denominacion', 'Categoría ocupacional', '', 'mod_estructuracomp', 'nom_categocup', '', 1775);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1591, 'activarpersona', NULL, 'sexo', 'Sexo', '', 'mod_persona', 'dat_persona', 'sexo', 1593);
INSERT INTO dat_campo (idcampo, idconfiguracion, idpadre, campo, denominacion, descripcion, esquema, tabla, alias, index) VALUES (1592, 'activarpersona', NULL, 'snombre', 'Segundo nombre', '', 'mod_persona', 'dat_persona', 'snombre', 1592);
INSERT INTO dat_configcondicion (idconfigcondicion, idcampo, tipodato, condicionpordefecto, expresionregular, sqlwhere, idtabla, usarcondicion, representartbar, sqlfilter, usarreemplazar) VALUES (1321, 1698, 'MULTIPLESVALORES', '', '', '', '', 1, 0, '', 'NINGUNO');
INSERT INTO dat_configcondicion (idconfigcondicion, idcampo, tipodato, condicionpordefecto, expresionregular, sqlwhere, idtabla, usarcondicion, representartbar, sqlfilter, usarreemplazar) VALUES (1323, 1700, 'NOMENCLADOR', '', '', '', 'idmotivoreicorporacion', 1, 0, '', 'NINGUNO');
INSERT INTO dat_configcondicion (idconfigcondicion, idcampo, tipodato, condicionpordefecto, expresionregular, sqlwhere, idtabla, usarcondicion, representartbar, sqlfilter, usarreemplazar) VALUES (1326, 1707, 'NOMENCLADOR', '', '', '', 'idtipocategoria', 1, 0, '', 'NINGUNO');
INSERT INTO dat_configcondicion (idconfigcondicion, idcampo, tipodato, condicionpordefecto, expresionregular, sqlwhere, idtabla, usarcondicion, representartbar, sqlfilter, usarreemplazar) VALUES (1328, 1709, 'NOMENCLADOR', '', '', '', 'idpais', 1, 0, '', 'NINGUNO');
INSERT INTO dat_configcondicion (idconfigcondicion, idcampo, tipodato, condicionpordefecto, expresionregular, sqlwhere, idtabla, usarcondicion, representartbar, sqlfilter, usarreemplazar) VALUES (1330, 1711, 'NOMENCLADOR', '', '', '', 'iddpt', 1, 0, 'idnivelestructural = 17', 'NINGUNO');
INSERT INTO dat_configcondicion (idconfigcondicion, idcampo, tipodato, condicionpordefecto, expresionregular, sqlwhere, idtabla, usarcondicion, representartbar, sqlfilter, usarreemplazar) VALUES (1360, 1747, 'NOMENCLADOR', '=', '', '', 'idtitulo', 1, 0, '', 'NINGUNO');
INSERT INTO dat_configcondicion (idconfigcondicion, idcampo, tipodato, condicionpordefecto, expresionregular, sqlwhere, idtabla, usarcondicion, representartbar, sqlfilter, usarreemplazar) VALUES (1076, 1408, 'TEXTO', '%x%', '', 'mod_rrhhmaestro.sustituiryconvertir({campo})', '', 1, 0, '', 'MINUSCULA SIN TILDE');
INSERT INTO dat_configcondicion (idconfigcondicion, idcampo, tipodato, condicionpordefecto, expresionregular, sqlwhere, idtabla, usarcondicion, representartbar, sqlfilter, usarreemplazar) VALUES (650, 937, 'FECHA', '=', '', '', '', 1, 0, '', 'NINGUNO');
INSERT INTO dat_configcondicion (idconfigcondicion, idcampo, tipodato, condicionpordefecto, expresionregular, sqlwhere, idtabla, usarcondicion, representartbar, sqlfilter, usarreemplazar) VALUES (1070, 1402, 'NOMENCLADOR', '=', '', '', 'idgruposanguineo', 1, 0, '', 'NINGUNO');
INSERT INTO dat_configcondicion (idconfigcondicion, idcampo, tipodato, condicionpordefecto, expresionregular, sqlwhere, idtabla, usarcondicion, representartbar, sqlfilter, usarreemplazar) VALUES (1071, 1403, 'NOMENCLADOR', '=', '', '', 'idcolorojos', 1, 0, '', 'NINGUNO');
INSERT INTO dat_configcondicion (idconfigcondicion, idcampo, tipodato, condicionpordefecto, expresionregular, sqlwhere, idtabla, usarcondicion, representartbar, sqlfilter, usarreemplazar) VALUES (1072, 1404, 'NOMENCLADOR', '=', '', '', 'idcolorpelo', 1, 0, '', 'NINGUNO');
INSERT INTO dat_configcondicion (idconfigcondicion, idcampo, tipodato, condicionpordefecto, expresionregular, sqlwhere, idtabla, usarcondicion, representartbar, sqlfilter, usarreemplazar) VALUES (1073, 1405, 'NOMENCLADOR', '=', '', '', 'idcolorpiel', 1, 0, '', 'NINGUNO');
INSERT INTO dat_configcondicion (idconfigcondicion, idcampo, tipodato, condicionpordefecto, expresionregular, sqlwhere, idtabla, usarcondicion, representartbar, sqlfilter, usarreemplazar) VALUES (1074, 1406, 'NUMERO', '=', '', '', '', 1, 0, '', 'NINGUNO');
INSERT INTO dat_configcondicion (idconfigcondicion, idcampo, tipodato, condicionpordefecto, expresionregular, sqlwhere, idtabla, usarcondicion, representartbar, sqlfilter, usarreemplazar) VALUES (1075, 1407, 'NUMERO', '=', '', '', '', 1, 0, '', 'NINGUNO');
INSERT INTO dat_configcondicion (idconfigcondicion, idcampo, tipodato, condicionpordefecto, expresionregular, sqlwhere, idtabla, usarcondicion, representartbar, sqlfilter, usarreemplazar) VALUES (1086, 1421, 'MULTIPLESVALORES', '', '', '', '', 1, 0, '', 'NINGUNO');
INSERT INTO dat_configcondicion (idconfigcondicion, idcampo, tipodato, condicionpordefecto, expresionregular, sqlwhere, idtabla, usarcondicion, representartbar, sqlfilter, usarreemplazar) VALUES (1077, 1410, 'NOMENCLADOR', '=', '', '', 'idciudadania', 1, 0, '', 'NINGUNO');
INSERT INTO dat_configcondicion (idconfigcondicion, idcampo, tipodato, condicionpordefecto, expresionregular, sqlwhere, idtabla, usarcondicion, representartbar, sqlfilter, usarreemplazar) VALUES (1078, 1411, 'FECHA', '=', '', '', '', 1, 0, '', 'NINGUNO');
INSERT INTO dat_configcondicion (idconfigcondicion, idcampo, tipodato, condicionpordefecto, expresionregular, sqlwhere, idtabla, usarcondicion, representartbar, sqlfilter, usarreemplazar) VALUES (1079, 1412, 'TEXTO', '', '', '', '', 1, 0, '', 'NINGUNO');
INSERT INTO dat_configcondicion (idconfigcondicion, idcampo, tipodato, condicionpordefecto, expresionregular, sqlwhere, idtabla, usarcondicion, representartbar, sqlfilter, usarreemplazar) VALUES (1080, 1414, 'TEXTO', '', '', '', '', 1, 0, '', 'NINGUNO');
INSERT INTO dat_configcondicion (idconfigcondicion, idcampo, tipodato, condicionpordefecto, expresionregular, sqlwhere, idtabla, usarcondicion, representartbar, sqlfilter, usarreemplazar) VALUES (1342, 1725, 'NOMENCLADOR', '', '', '', 'idcondecoracion', 1, 0, '', 'NINGUNO');
INSERT INTO dat_configcondicion (idconfigcondicion, idcampo, tipodato, condicionpordefecto, expresionregular, sqlwhere, idtabla, usarcondicion, representartbar, sqlfilter, usarreemplazar) VALUES (1344, 1727, 'FECHA', '', '', '', '', 1, 0, '', 'NINGUNO');
INSERT INTO dat_configcondicion (idconfigcondicion, idcampo, tipodato, condicionpordefecto, expresionregular, sqlwhere, idtabla, usarcondicion, representartbar, sqlfilter, usarreemplazar) VALUES (1135, 1479, 'FECHA', '', '', '', '', 1, 0, '', 'NINGUNO');
INSERT INTO dat_configcondicion (idconfigcondicion, idcampo, tipodato, condicionpordefecto, expresionregular, sqlwhere, idtabla, usarcondicion, representartbar, sqlfilter, usarreemplazar) VALUES (1134, 1478, 'FECHA', '', '', '', '', 1, 0, '', 'NINGUNO');
INSERT INTO dat_configcondicion (idconfigcondicion, idcampo, tipodato, condicionpordefecto, expresionregular, sqlwhere, idtabla, usarcondicion, representartbar, sqlfilter, usarreemplazar) VALUES (1347, 1733, 'TEXTO', '', '', '', '', 1, 0, '', 'NINGUNO');
INSERT INTO dat_configcondicion (idconfigcondicion, idcampo, tipodato, condicionpordefecto, expresionregular, sqlwhere, idtabla, usarcondicion, representartbar, sqlfilter, usarreemplazar) VALUES (1141, 1486, 'NOMENCLADOR', '', '', '', 'idtipoestanciaexterior', 1, 0, '', 'NINGUNO');
INSERT INTO dat_configcondicion (idconfigcondicion, idcampo, tipodato, condicionpordefecto, expresionregular, sqlwhere, idtabla, usarcondicion, representartbar, sqlfilter, usarreemplazar) VALUES (1143, 1488, 'FECHA', '', '', '', '', 1, 0, '', 'NINGUNO');
INSERT INTO dat_configcondicion (idconfigcondicion, idcampo, tipodato, condicionpordefecto, expresionregular, sqlwhere, idtabla, usarcondicion, representartbar, sqlfilter, usarreemplazar) VALUES (1356, 1742, 'NUMERO', '', '', '', '', 1, 0, '', 'NINGUNO');
INSERT INTO dat_configcondicion (idconfigcondicion, idcampo, tipodato, condicionpordefecto, expresionregular, sqlwhere, idtabla, usarcondicion, representartbar, sqlfilter, usarreemplazar) VALUES (1351, 1737, 'TEXTO', '', '', '', '', 1, 0, '', 'NINGUNO');
INSERT INTO dat_configcondicion (idconfigcondicion, idcampo, tipodato, condicionpordefecto, expresionregular, sqlwhere, idtabla, usarcondicion, representartbar, sqlfilter, usarreemplazar) VALUES (1082, 1416, 'NOMENCLADOR', '=', '', '', 'idtipomediocontacto', 1, 0, '', 'NINGUNO');
INSERT INTO dat_configcondicion (idconfigcondicion, idcampo, tipodato, condicionpordefecto, expresionregular, sqlwhere, idtabla, usarcondicion, representartbar, sqlfilter, usarreemplazar) VALUES (1354, 1740, 'FECHA', '', '', '', '', 1, 0, '', 'NINGUNO');
INSERT INTO dat_configcondicion (idconfigcondicion, idcampo, tipodato, condicionpordefecto, expresionregular, sqlwhere, idtabla, usarcondicion, representartbar, sqlfilter, usarreemplazar) VALUES (1083, 1417, 'NOMENCLADOR', '=', '', '', 'idtipocontacto', 1, 0, '', 'NINGUNO');
INSERT INTO dat_configcondicion (idconfigcondicion, idcampo, tipodato, condicionpordefecto, expresionregular, sqlwhere, idtabla, usarcondicion, representartbar, sqlfilter, usarreemplazar) VALUES (1087, 1422, 'FECHA', '', '', '', '', 1, 0, '', 'NINGUNO');
INSERT INTO dat_configcondicion (idconfigcondicion, idcampo, tipodato, condicionpordefecto, expresionregular, sqlwhere, idtabla, usarcondicion, representartbar, sqlfilter, usarreemplazar) VALUES (1089, 1424, 'FECHA', '', '', '', '', 1, 0, '', 'NINGUNO');
INSERT INTO dat_configcondicion (idconfigcondicion, idcampo, tipodato, condicionpordefecto, expresionregular, sqlwhere, idtabla, usarcondicion, representartbar, sqlfilter, usarreemplazar) VALUES (1090, 1425, 'TEXTO', '', '', '', '', 1, 0, '', 'NINGUNO');
INSERT INTO dat_configcondicion (idconfigcondicion, idcampo, tipodato, condicionpordefecto, expresionregular, sqlwhere, idtabla, usarcondicion, representartbar, sqlfilter, usarreemplazar) VALUES (1091, 1427, 'NOMENCLADOR', '=', '', '', 'idnacionalidad', 1, 0, '', 'NINGUNO');
INSERT INTO dat_configcondicion (idconfigcondicion, idcampo, tipodato, condicionpordefecto, expresionregular, sqlwhere, idtabla, usarcondicion, representartbar, sqlfilter, usarreemplazar) VALUES (1093, 1429, 'FECHA', '=', '', '', '', 1, 0, '', 'NINGUNO');
INSERT INTO dat_configcondicion (idconfigcondicion, idcampo, tipodato, condicionpordefecto, expresionregular, sqlwhere, idtabla, usarcondicion, representartbar, sqlfilter, usarreemplazar) VALUES (1094, 1430, 'FECHA', '', '', '', '', 1, 0, '', 'NINGUNO');
INSERT INTO dat_configcondicion (idconfigcondicion, idcampo, tipodato, condicionpordefecto, expresionregular, sqlwhere, idtabla, usarcondicion, representartbar, sqlfilter, usarreemplazar) VALUES (1095, 1432, 'NOMENCLADOR', '=', '', '', 'idpadecimiento', 1, 0, '', 'NINGUNO');
INSERT INTO dat_configcondicion (idconfigcondicion, idcampo, tipodato, condicionpordefecto, expresionregular, sqlwhere, idtabla, usarcondicion, representartbar, sqlfilter, usarreemplazar) VALUES (1097, 1434, 'FECHA', '', '', '', '', 1, 0, '', 'NINGUNO');
INSERT INTO dat_configcondicion (idconfigcondicion, idcampo, tipodato, condicionpordefecto, expresionregular, sqlwhere, idtabla, usarcondicion, representartbar, sqlfilter, usarreemplazar) VALUES (1096, 1433, 'TEXTO', '', '', '', '', 1, 0, '', 'NINGUNO');
INSERT INTO dat_configcondicion (idconfigcondicion, idcampo, tipodato, condicionpordefecto, expresionregular, sqlwhere, idtabla, usarcondicion, representartbar, sqlfilter, usarreemplazar) VALUES (1098, 1435, 'FECHA', '=', '', '', '', 1, 0, '', 'NINGUNO');
INSERT INTO dat_configcondicion (idconfigcondicion, idcampo, tipodato, condicionpordefecto, expresionregular, sqlwhere, idtabla, usarcondicion, representartbar, sqlfilter, usarreemplazar) VALUES (1100, 1438, 'NOMENCLADOR', '', '', '', 'idorganizacion', 1, 0, '', 'NINGUNO');
INSERT INTO dat_configcondicion (idconfigcondicion, idcampo, tipodato, condicionpordefecto, expresionregular, sqlwhere, idtabla, usarcondicion, representartbar, sqlfilter, usarreemplazar) VALUES (1101, 1439, 'NOMENCLADOR', '', '', '', 'idtipoorganizacion', 1, 0, '', 'NINGUNO');
INSERT INTO dat_configcondicion (idconfigcondicion, idcampo, tipodato, condicionpordefecto, expresionregular, sqlwhere, idtabla, usarcondicion, representartbar, sqlfilter, usarreemplazar) VALUES (1102, 1440, 'NOMENCLADOR', '', '', '', 'idcargoorganizacion', 1, 0, '', 'NINGUNO');
INSERT INTO dat_configcondicion (idconfigcondicion, idcampo, tipodato, condicionpordefecto, expresionregular, sqlwhere, idtabla, usarcondicion, representartbar, sqlfilter, usarreemplazar) VALUES (1103, 1441, 'NOMENCLADOR', '=', '', '', 'idnivelorganizacion', 1, 0, '', 'NINGUNO');
INSERT INTO dat_configcondicion (idconfigcondicion, idcampo, tipodato, condicionpordefecto, expresionregular, sqlwhere, idtabla, usarcondicion, representartbar, sqlfilter, usarreemplazar) VALUES (1104, 1442, 'TEXTO', '', '', '', '', 1, 0, '', 'NINGUNO');
INSERT INTO dat_configcondicion (idconfigcondicion, idcampo, tipodato, condicionpordefecto, expresionregular, sqlwhere, idtabla, usarcondicion, representartbar, sqlfilter, usarreemplazar) VALUES (1105, 1443, 'TEXTO', '', '', '', '', 1, 0, '', 'NINGUNO');
INSERT INTO dat_configcondicion (idconfigcondicion, idcampo, tipodato, condicionpordefecto, expresionregular, sqlwhere, idtabla, usarcondicion, representartbar, sqlfilter, usarreemplazar) VALUES (1106, 1445, 'FECHA', '', '', '', '', 1, 0, '', 'NINGUNO');
INSERT INTO dat_configcondicion (idconfigcondicion, idcampo, tipodato, condicionpordefecto, expresionregular, sqlwhere, idtabla, usarcondicion, representartbar, sqlfilter, usarreemplazar) VALUES (1107, 1446, 'FECHA', '', '', '', '', 1, 0, '', 'NINGUNO');
INSERT INTO dat_configcondicion (idconfigcondicion, idcampo, tipodato, condicionpordefecto, expresionregular, sqlwhere, idtabla, usarcondicion, representartbar, sqlfilter, usarreemplazar) VALUES (1108, 1448, 'NOMENCLADOR', '=', '', '', 'idestadocivil', 1, 0, '', 'NINGUNO');
INSERT INTO dat_configcondicion (idconfigcondicion, idcampo, tipodato, condicionpordefecto, expresionregular, sqlwhere, idtabla, usarcondicion, representartbar, sqlfilter, usarreemplazar) VALUES (1109, 1449, 'NOMENCLADOR', '=', '', '', 'idestratificacionsocial', 1, 0, '', 'NINGUNO');
INSERT INTO dat_configcondicion (idconfigcondicion, idcampo, tipodato, condicionpordefecto, expresionregular, sqlwhere, idtabla, usarcondicion, representartbar, sqlfilter, usarreemplazar) VALUES (1110, 1450, 'TEXTO', '', '', '', '', 1, 0, '', 'NINGUNO');
INSERT INTO dat_configcondicion (idconfigcondicion, idcampo, tipodato, condicionpordefecto, expresionregular, sqlwhere, idtabla, usarcondicion, representartbar, sqlfilter, usarreemplazar) VALUES (1111, 1451, 'TEXTO', '%x%', '', '', '', 1, 0, '', 'NINGUNO');
INSERT INTO dat_configcondicion (idconfigcondicion, idcampo, tipodato, condicionpordefecto, expresionregular, sqlwhere, idtabla, usarcondicion, representartbar, sqlfilter, usarreemplazar) VALUES (1117, 1460, 'NOMENCLADOR', '', '', '', 'idbanco', 1, 0, '', 'NINGUNO');
INSERT INTO dat_configcondicion (idconfigcondicion, idcampo, tipodato, condicionpordefecto, expresionregular, sqlwhere, idtabla, usarcondicion, representartbar, sqlfilter, usarreemplazar) VALUES (1118, 1461, 'NOMENCLADOR', '', '', '', 'idbanco', 1, 0, '', 'NINGUNO');
INSERT INTO dat_configcondicion (idconfigcondicion, idcampo, tipodato, condicionpordefecto, expresionregular, sqlwhere, idtabla, usarcondicion, representartbar, sqlfilter, usarreemplazar) VALUES (1119, 1462, 'NOMENCLADOR', '', '', '', 'idmoneda', 1, 0, '', 'NINGUNO');
INSERT INTO dat_configcondicion (idconfigcondicion, idcampo, tipodato, condicionpordefecto, expresionregular, sqlwhere, idtabla, usarcondicion, representartbar, sqlfilter, usarreemplazar) VALUES (1121, 1464, 'NUMERO', '', '', '', '', 1, 0, '', 'NINGUNO');
INSERT INTO dat_configcondicion (idconfigcondicion, idcampo, tipodato, condicionpordefecto, expresionregular, sqlwhere, idtabla, usarcondicion, representartbar, sqlfilter, usarreemplazar) VALUES (1122, 1465, 'FECHA', '', '', '', '', 1, 0, '', 'NINGUNO');
INSERT INTO dat_configcondicion (idconfigcondicion, idcampo, tipodato, condicionpordefecto, expresionregular, sqlwhere, idtabla, usarcondicion, representartbar, sqlfilter, usarreemplazar) VALUES (1124, 1467, 'FECHA', '', '', '', '', 1, 0, '', 'NINGUNO');
INSERT INTO dat_configcondicion (idconfigcondicion, idcampo, tipodato, condicionpordefecto, expresionregular, sqlwhere, idtabla, usarcondicion, representartbar, sqlfilter, usarreemplazar) VALUES (1125, 1469, 'NOMENCLADOR', '', '', '', 'idtipoformacion', 1, 0, '', 'NINGUNO');
INSERT INTO dat_configcondicion (idconfigcondicion, idcampo, tipodato, condicionpordefecto, expresionregular, sqlwhere, idtabla, usarcondicion, representartbar, sqlfilter, usarreemplazar) VALUES (1127, 1471, 'NOMENCLADOR', '', '', '', 'idcentroestudio', 1, 0, '', 'NINGUNO');
INSERT INTO dat_configcondicion (idconfigcondicion, idcampo, tipodato, condicionpordefecto, expresionregular, sqlwhere, idtabla, usarcondicion, representartbar, sqlfilter, usarreemplazar) VALUES (1126, 1470, 'NOMENCLADOR', '', '', '', 'idmodoformacion', 1, 0, '', 'NINGUNO');
INSERT INTO dat_configcondicion (idconfigcondicion, idcampo, tipodato, condicionpordefecto, expresionregular, sqlwhere, idtabla, usarcondicion, representartbar, sqlfilter, usarreemplazar) VALUES (1137, 1481, 'NOMENCLADOR', '', '', '', 'idaptitudfisica', 1, 0, '', 'NINGUNO');
INSERT INTO dat_configcondicion (idconfigcondicion, idcampo, tipodato, condicionpordefecto, expresionregular, sqlwhere, idtabla, usarcondicion, representartbar, sqlfilter, usarreemplazar) VALUES (1136, 1480, 'MULTIPLESVALORES', '', '', '', '', 1, 0, '', 'NINGUNO');
INSERT INTO dat_configcondicion (idconfigcondicion, idcampo, tipodato, condicionpordefecto, expresionregular, sqlwhere, idtabla, usarcondicion, representartbar, sqlfilter, usarreemplazar) VALUES (1138, 1483, 'NOMENCLADOR', '', '', '', 'idmision', 1, 0, '', 'NINGUNO');
INSERT INTO dat_configcondicion (idconfigcondicion, idcampo, tipodato, condicionpordefecto, expresionregular, sqlwhere, idtabla, usarcondicion, representartbar, sqlfilter, usarreemplazar) VALUES (1140, 1485, 'NOMENCLADOR', '', '', '', 'idpais', 1, 0, '', 'NINGUNO');
INSERT INTO dat_configcondicion (idconfigcondicion, idcampo, tipodato, condicionpordefecto, expresionregular, sqlwhere, idtabla, usarcondicion, representartbar, sqlfilter, usarreemplazar) VALUES (1139, 1484, 'NOMENCLADOR', '', '', '', 'idtipomision', 1, 0, '', 'NINGUNO');
INSERT INTO dat_configcondicion (idconfigcondicion, idcampo, tipodato, condicionpordefecto, expresionregular, sqlwhere, idtabla, usarcondicion, representartbar, sqlfilter, usarreemplazar) VALUES (1142, 1487, 'TEXTO', '', '', '', '', 1, 0, '', 'NINGUNO');
INSERT INTO dat_configcondicion (idconfigcondicion, idcampo, tipodato, condicionpordefecto, expresionregular, sqlwhere, idtabla, usarcondicion, representartbar, sqlfilter, usarreemplazar) VALUES (1144, 1489, 'FECHA', '', '', '', '', 1, 0, '', 'NINGUNO');
INSERT INTO dat_configcondicion (idconfigcondicion, idcampo, tipodato, condicionpordefecto, expresionregular, sqlwhere, idtabla, usarcondicion, representartbar, sqlfilter, usarreemplazar) VALUES (1146, 1493, 'NOMENCLADOR', '', '', '', 'ididioma', 1, 0, '', 'NINGUNO');
INSERT INTO dat_configcondicion (idconfigcondicion, idcampo, tipodato, condicionpordefecto, expresionregular, sqlwhere, idtabla, usarcondicion, representartbar, sqlfilter, usarreemplazar) VALUES (1147, 1494, 'NOMENCLADOR', '', '', '', 'idformaadquiriridioma', 1, 0, '', 'NINGUNO');
INSERT INTO dat_configcondicion (idconfigcondicion, idcampo, tipodato, condicionpordefecto, expresionregular, sqlwhere, idtabla, usarcondicion, representartbar, sqlfilter, usarreemplazar) VALUES (1150, 1498, 'NOMENCLADOR', '', '', '', 'idmotivosancion', 1, 0, '', 'NINGUNO');
INSERT INTO dat_configcondicion (idconfigcondicion, idcampo, tipodato, condicionpordefecto, expresionregular, sqlwhere, idtabla, usarcondicion, representartbar, sqlfilter, usarreemplazar) VALUES (1149, 1497, 'NOMENCLADOR', '', '', '', 'idtiposancion', 1, 0, '', 'NINGUNO');
INSERT INTO dat_configcondicion (idconfigcondicion, idcampo, tipodato, condicionpordefecto, expresionregular, sqlwhere, idtabla, usarcondicion, representartbar, sqlfilter, usarreemplazar) VALUES (1148, 1496, 'NOMENCLADOR', '', '', '', 'idsancion', 1, 0, '', 'NINGUNO');
INSERT INTO dat_configcondicion (idconfigcondicion, idcampo, tipodato, condicionpordefecto, expresionregular, sqlwhere, idtabla, usarcondicion, representartbar, sqlfilter, usarreemplazar) VALUES (1153, 1501, 'FECHA', '', '', '', '', 1, 0, '', 'NINGUNO');
INSERT INTO dat_configcondicion (idconfigcondicion, idcampo, tipodato, condicionpordefecto, expresionregular, sqlwhere, idtabla, usarcondicion, representartbar, sqlfilter, usarreemplazar) VALUES (1152, 1500, 'FECHA', '', '', '', '', 1, 0, '', 'NINGUNO');
INSERT INTO dat_configcondicion (idconfigcondicion, idcampo, tipodato, condicionpordefecto, expresionregular, sqlwhere, idtabla, usarcondicion, representartbar, sqlfilter, usarreemplazar) VALUES (1151, 1499, 'FECHA', '', '', '', '', 1, 0, '', 'NINGUNO');
INSERT INTO dat_configcondicion (idconfigcondicion, idcampo, tipodato, condicionpordefecto, expresionregular, sqlwhere, idtabla, usarcondicion, representartbar, sqlfilter, usarreemplazar) VALUES (1164, 1512, 'TEXTO', '', '', '', '', 1, 1, '', 'NINGUNO');
INSERT INTO dat_configcondicion (idconfigcondicion, idcampo, tipodato, condicionpordefecto, expresionregular, sqlwhere, idtabla, usarcondicion, representartbar, sqlfilter, usarreemplazar) VALUES (1154, 1502, 'MULTIPLESVALORES', '', '', '', '', 1, 0, '', 'NINGUNO');
INSERT INTO dat_configcondicion (idconfigcondicion, idcampo, tipodato, condicionpordefecto, expresionregular, sqlwhere, idtabla, usarcondicion, representartbar, sqlfilter, usarreemplazar) VALUES (1167, 1515, 'TEXTO', '', '', '', '', 1, 0, '', 'NINGUNO');
INSERT INTO dat_configcondicion (idconfigcondicion, idcampo, tipodato, condicionpordefecto, expresionregular, sqlwhere, idtabla, usarcondicion, representartbar, sqlfilter, usarreemplazar) VALUES (1166, 1514, 'TEXTO', '', '', '', '', 1, 0, '', 'NINGUNO');
INSERT INTO dat_configcondicion (idconfigcondicion, idcampo, tipodato, condicionpordefecto, expresionregular, sqlwhere, idtabla, usarcondicion, representartbar, sqlfilter, usarreemplazar) VALUES (1165, 1513, 'TEXTO', '', '', '', '', 1, 0, '', 'NINGUNO');
INSERT INTO dat_configcondicion (idconfigcondicion, idcampo, tipodato, condicionpordefecto, expresionregular, sqlwhere, idtabla, usarcondicion, representartbar, sqlfilter, usarreemplazar) VALUES (1334, 1715, 'TEXTO', '', '', 'mod_rrhhmaestro.sustituiryconvertir({campo})', '', 1, 0, '', 'MINUSCULA SIN TILDE');
INSERT INTO dat_configcondicion (idconfigcondicion, idcampo, tipodato, condicionpordefecto, expresionregular, sqlwhere, idtabla, usarcondicion, representartbar, sqlfilter, usarreemplazar) VALUES (1336, 1717, 'TEXTO', '', '', 'mod_rrhhmaestro.sustituiryconvertir({campo})', '', 1, 0, '', 'MINUSCULA SIN TILDE');
INSERT INTO dat_configcondicion (idconfigcondicion, idcampo, tipodato, condicionpordefecto, expresionregular, sqlwhere, idtabla, usarcondicion, representartbar, sqlfilter, usarreemplazar) VALUES (1349, 1735, 'TEXTO', '', '', 'mod_rrhhmaestro.sustituiryconvertir({campo})', '', 1, 0, '', 'MINUSCULA SIN TILDE');
INSERT INTO dat_configcondicion (idconfigcondicion, idcampo, tipodato, condicionpordefecto, expresionregular, sqlwhere, idtabla, usarcondicion, representartbar, sqlfilter, usarreemplazar) VALUES (1081, 1415, 'MULTIPLESVALORES', '', '', '', '', 1, 0, '', 'NINGUNO');
INSERT INTO dat_configcondicion (idconfigcondicion, idcampo, tipodato, condicionpordefecto, expresionregular, sqlwhere, idtabla, usarcondicion, representartbar, sqlfilter, usarreemplazar) VALUES (1362, 1750, 'NOMENCLADOR', '', '', '', 'idnorma', 1, 0, '', 'NINGUNO');
INSERT INTO dat_configcondicion (idconfigcondicion, idcampo, tipodato, condicionpordefecto, expresionregular, sqlwhere, idtabla, usarcondicion, representartbar, sqlfilter, usarreemplazar) VALUES (1364, 1753, 'NOMENCLADOR', '=', '', '', 'iddpt', 1, 0, 'idnivelestructural = 16', 'NINGUNO');
INSERT INTO dat_configcondicion (idconfigcondicion, idcampo, tipodato, condicionpordefecto, expresionregular, sqlwhere, idtabla, usarcondicion, representartbar, sqlfilter, usarreemplazar) VALUES (1368, 1757, 'FECHA', '', '', '', '', 1, 0, '', 'NINGUNO');
INSERT INTO dat_configcondicion (idconfigcondicion, idcampo, tipodato, condicionpordefecto, expresionregular, sqlwhere, idtabla, usarcondicion, representartbar, sqlfilter, usarreemplazar) VALUES (1366, 1755, 'TEXTO', '%x%', '', 'mod_rrhhmaestro.sustituiryconvertir({campo})', '', 1, 0, '', 'MINUSCULA SIN TILDE');
INSERT INTO dat_configcondicion (idconfigcondicion, idcampo, tipodato, condicionpordefecto, expresionregular, sqlwhere, idtabla, usarcondicion, representartbar, sqlfilter, usarreemplazar) VALUES (1370, 1760, 'TEXTO', '', '', '', '', 1, 0, '', 'NINGUNO');
INSERT INTO dat_configcondicion (idconfigcondicion, idcampo, tipodato, condicionpordefecto, expresionregular, sqlwhere, idtabla, usarcondicion, representartbar, sqlfilter, usarreemplazar) VALUES (1372, 1762, 'TEXTO', '', '', '', '', 1, 0, '', 'NINGUNO');
INSERT INTO dat_configcondicion (idconfigcondicion, idcampo, tipodato, condicionpordefecto, expresionregular, sqlwhere, idtabla, usarcondicion, representartbar, sqlfilter, usarreemplazar) VALUES (1374, 1764, 'TEXTO', '', '', '', '', 1, 0, '', 'NINGUNO');
INSERT INTO dat_configcondicion (idconfigcondicion, idcampo, tipodato, condicionpordefecto, expresionregular, sqlwhere, idtabla, usarcondicion, representartbar, sqlfilter, usarreemplazar) VALUES (1376, 1766, 'NOMENCLADOR', '', '', '', 'idtitulo', 1, 0, '', 'NINGUNO');
INSERT INTO dat_configcondicion (idconfigcondicion, idcampo, tipodato, condicionpordefecto, expresionregular, sqlwhere, idtabla, usarcondicion, representartbar, sqlfilter, usarreemplazar) VALUES (1314, 1690, 'NOMENCLADOR', '', '', '', 'idviareclutamiento', 1, 0, '', 'NINGUNO');
INSERT INTO dat_configcondicion (idconfigcondicion, idcampo, tipodato, condicionpordefecto, expresionregular, sqlwhere, idtabla, usarcondicion, representartbar, sqlfilter, usarreemplazar) VALUES (1322, 1699, 'FECHA', '', '', '', '', 1, 0, '', 'NINGUNO');
INSERT INTO dat_configcondicion (idconfigcondicion, idcampo, tipodato, condicionpordefecto, expresionregular, sqlwhere, idtabla, usarcondicion, representartbar, sqlfilter, usarreemplazar) VALUES (1324, 1701, 'TEXTO', '', '', '', '', 1, 0, '', 'NINGUNO');
INSERT INTO dat_configcondicion (idconfigcondicion, idcampo, tipodato, condicionpordefecto, expresionregular, sqlwhere, idtabla, usarcondicion, representartbar, sqlfilter, usarreemplazar) VALUES (1085, 1420, 'TEXTO', '%x%', '/^[0-9]+$/', '', '', 1, 1, '', 'NINGUNO');
INSERT INTO dat_configcondicion (idconfigcondicion, idcampo, tipodato, condicionpordefecto, expresionregular, sqlwhere, idtabla, usarcondicion, representartbar, sqlfilter, usarreemplazar) VALUES (1325, 1706, 'NOMENCLADOR', '', '', '', 'idcategoria', 1, 0, '', 'NINGUNO');
INSERT INTO dat_configcondicion (idconfigcondicion, idcampo, tipodato, condicionpordefecto, expresionregular, sqlwhere, idtabla, usarcondicion, representartbar, sqlfilter, usarreemplazar) VALUES (1327, 1708, 'FECHA', '', '', '', '', 1, 0, '', 'NINGUNO');
INSERT INTO dat_configcondicion (idconfigcondicion, idcampo, tipodato, condicionpordefecto, expresionregular, sqlwhere, idtabla, usarcondicion, representartbar, sqlfilter, usarreemplazar) VALUES (1398, 1791, 'NOMENCLADOR', '', '', '', 'idespecialidad', 1, 0, '', 'NINGUNO');
INSERT INTO dat_configcondicion (idconfigcondicion, idcampo, tipodato, condicionpordefecto, expresionregular, sqlwhere, idtabla, usarcondicion, representartbar, sqlfilter, usarreemplazar) VALUES (1268, 1641, 'TEXTO', '%x%', '', 'mod_rrhhmaestro.sustituiryconvertir({campo})', '', 1, 1, '', 'MINUSCULA SIN TILDE');
INSERT INTO dat_configcondicion (idconfigcondicion, idcampo, tipodato, condicionpordefecto, expresionregular, sqlwhere, idtabla, usarcondicion, representartbar, sqlfilter, usarreemplazar) VALUES (1145, 1491, 'NOMENCLADOR', '', '', '', 'idgrado', 1, 0, '', 'NINGUNO');
INSERT INTO dat_configcondicion (idconfigcondicion, idcampo, tipodato, condicionpordefecto, expresionregular, sqlwhere, idtabla, usarcondicion, representartbar, sqlfilter, usarreemplazar) VALUES (1269, 1642, 'TEXTO', '%x%', '', 'mod_rrhhmaestro.sustituiryconvertir({campo})', '', 1, 1, '', 'MINUSCULA SIN TILDE');
INSERT INTO dat_configcondicion (idconfigcondicion, idcampo, tipodato, condicionpordefecto, expresionregular, sqlwhere, idtabla, usarcondicion, representartbar, sqlfilter, usarreemplazar) VALUES (1301, 1674, 'TEXTO', '%x%', '', 'mod_rrhhmaestro.sustituiryconvertir({campo})', '', 1, 1, '', 'MINUSCULA SIN TILDE');
INSERT INTO dat_configcondicion (idconfigcondicion, idcampo, tipodato, condicionpordefecto, expresionregular, sqlwhere, idtabla, usarcondicion, representartbar, sqlfilter, usarreemplazar) VALUES (1267, 1640, 'TEXTO', '%x%', '', 'mod_rrhhmaestro.sustituiryconvertir({campo})', '', 1, 0, '', 'NINGUNO');
INSERT INTO dat_configcondicion (idconfigcondicion, idcampo, tipodato, condicionpordefecto, expresionregular, sqlwhere, idtabla, usarcondicion, representartbar, sqlfilter, usarreemplazar) VALUES (1329, 1710, 'NOMENCLADOR', '', '', '', 'iddpt', 1, 0, 'idnivelestructural = 16', 'NINGUNO');
INSERT INTO dat_configcondicion (idconfigcondicion, idcampo, tipodato, condicionpordefecto, expresionregular, sqlwhere, idtabla, usarcondicion, representartbar, sqlfilter, usarreemplazar) VALUES (1331, 1712, 'TEXTO', '=', '', 'mod_rrhhmaestro.sustituiryconvertir({campo})', '', 1, 0, '', 'MINUSCULA SIN TILDE');
INSERT INTO dat_configcondicion (idconfigcondicion, idcampo, tipodato, condicionpordefecto, expresionregular, sqlwhere, idtabla, usarcondicion, representartbar, sqlfilter, usarreemplazar) VALUES (1224, 1587, 'TEXTO', '', '', '', '', 1, 0, '', 'NINGUNO');
INSERT INTO dat_configcondicion (idconfigcondicion, idcampo, tipodato, condicionpordefecto, expresionregular, sqlwhere, idtabla, usarcondicion, representartbar, sqlfilter, usarreemplazar) VALUES (1341, 1724, 'NOMENCLADOR', '', '', '', 'idtipocondecoracion', 1, 0, '', 'NINGUNO');
INSERT INTO dat_configcondicion (idconfigcondicion, idcampo, tipodato, condicionpordefecto, expresionregular, sqlwhere, idtabla, usarcondicion, representartbar, sqlfilter, usarreemplazar) VALUES (1343, 1726, 'NOMENCLADOR', '', '', '', 'idmotivocondecoracion', 1, 0, '', 'NINGUNO');
INSERT INTO dat_configcondicion (idconfigcondicion, idcampo, tipodato, condicionpordefecto, expresionregular, sqlwhere, idtabla, usarcondicion, representartbar, sqlfilter, usarreemplazar) VALUES (1365, 1754, 'NOMENCLADOR', '=', '', '', 'iddpt', 1, 0, 'idnivelestructural = 17', 'NINGUNO');
INSERT INTO dat_configcondicion (idconfigcondicion, idcampo, tipodato, condicionpordefecto, expresionregular, sqlwhere, idtabla, usarcondicion, representartbar, sqlfilter, usarreemplazar) VALUES (1305, 1678, 'FECHA', '', '', '', '', 1, 0, '', 'NINGUNO');
INSERT INTO dat_configcondicion (idconfigcondicion, idcampo, tipodato, condicionpordefecto, expresionregular, sqlwhere, idtabla, usarcondicion, representartbar, sqlfilter, usarreemplazar) VALUES (1345, 1728, 'TEXTO', '', '', '', '', 1, 0, '', 'NINGUNO');
INSERT INTO dat_configcondicion (idconfigcondicion, idcampo, tipodato, condicionpordefecto, expresionregular, sqlwhere, idtabla, usarcondicion, representartbar, sqlfilter, usarreemplazar) VALUES (1346, 1732, 'NOMENCLADOR', '', '', '', 'idcurso', 1, 0, '', 'NINGUNO');
INSERT INTO dat_configcondicion (idconfigcondicion, idcampo, tipodato, condicionpordefecto, expresionregular, sqlwhere, idtabla, usarcondicion, representartbar, sqlfilter, usarreemplazar) VALUES (1306, 1680, 'TEXTO', '%x%', '', '', '', 1, 1, '', 'NINGUNO');
INSERT INTO dat_configcondicion (idconfigcondicion, idcampo, tipodato, condicionpordefecto, expresionregular, sqlwhere, idtabla, usarcondicion, representartbar, sqlfilter, usarreemplazar) VALUES (1308, 1682, 'FECHA', '', '', '', '', 1, 0, '', 'NINGUNO');
INSERT INTO dat_configcondicion (idconfigcondicion, idcampo, tipodato, condicionpordefecto, expresionregular, sqlwhere, idtabla, usarcondicion, representartbar, sqlfilter, usarreemplazar) VALUES (1348, 1734, 'TEXTO', '', '', 'mod_rrhhmaestro.sustituiryconvertir({campo})', '', 1, 0, '', 'MINUSCULA SIN TILDE');
INSERT INTO dat_configcondicion (idconfigcondicion, idcampo, tipodato, condicionpordefecto, expresionregular, sqlwhere, idtabla, usarcondicion, representartbar, sqlfilter, usarreemplazar) VALUES (1309, 1683, 'TEXTO', '%x%', '', '', '', 1, 1, '', 'NINGUNO');
INSERT INTO dat_configcondicion (idconfigcondicion, idcampo, tipodato, condicionpordefecto, expresionregular, sqlwhere, idtabla, usarcondicion, representartbar, sqlfilter, usarreemplazar) VALUES (1311, 1685, 'TEXTO', '%x%', '', '', '', 1, 1, '', 'NINGUNO');
INSERT INTO dat_configcondicion (idconfigcondicion, idcampo, tipodato, condicionpordefecto, expresionregular, sqlwhere, idtabla, usarcondicion, representartbar, sqlfilter, usarreemplazar) VALUES (1350, 1736, 'TEXTO', '', '', '', '', 1, 0, '', 'NINGUNO');
INSERT INTO dat_configcondicion (idconfigcondicion, idcampo, tipodato, condicionpordefecto, expresionregular, sqlwhere, idtabla, usarcondicion, representartbar, sqlfilter, usarreemplazar) VALUES (1245, 1612, 'TEXTO', '%x%', '', '', '', 1, 0, '', 'NINGUNO');
INSERT INTO dat_configcondicion (idconfigcondicion, idcampo, tipodato, condicionpordefecto, expresionregular, sqlwhere, idtabla, usarcondicion, representartbar, sqlfilter, usarreemplazar) VALUES (1310, 1684, 'TEXTO', '%x%', '', '', '', 1, 0, '', 'NINGUNO');
INSERT INTO dat_configcondicion (idconfigcondicion, idcampo, tipodato, condicionpordefecto, expresionregular, sqlwhere, idtabla, usarcondicion, representartbar, sqlfilter, usarreemplazar) VALUES (1312, 1686, 'TEXTO', '%x%', '', '', '', 1, 1, '', 'NINGUNO');
INSERT INTO dat_configcondicion (idconfigcondicion, idcampo, tipodato, condicionpordefecto, expresionregular, sqlwhere, idtabla, usarcondicion, representartbar, sqlfilter, usarreemplazar) VALUES (1307, 1681, 'TEXTO', '', '', '', '', 1, 0, '', 'NINGUNO');
INSERT INTO dat_configcondicion (idconfigcondicion, idcampo, tipodato, condicionpordefecto, expresionregular, sqlwhere, idtabla, usarcondicion, representartbar, sqlfilter, usarreemplazar) VALUES (1333, 1714, 'TEXTO', '=', '', 'mod_rrhhmaestro.sustituiryconvertir({campo})', '', 1, 0, '', 'MINUSCULA SIN TILDE');
INSERT INTO dat_configcondicion (idconfigcondicion, idcampo, tipodato, condicionpordefecto, expresionregular, sqlwhere, idtabla, usarcondicion, representartbar, sqlfilter, usarreemplazar) VALUES (1353, 1739, 'MULTIPLESVALORES', '', '', '', '', 1, 0, '', 'NINGUNO');
INSERT INTO dat_configcondicion (idconfigcondicion, idcampo, tipodato, condicionpordefecto, expresionregular, sqlwhere, idtabla, usarcondicion, representartbar, sqlfilter, usarreemplazar) VALUES (1313, 1688, 'NOMENCLADOR', '', '', '', 'idproceso', 1, 0, '', 'NINGUNO');
INSERT INTO dat_configcondicion (idconfigcondicion, idcampo, tipodato, condicionpordefecto, expresionregular, sqlwhere, idtabla, usarcondicion, representartbar, sqlfilter, usarreemplazar) VALUES (1084, 1419, 'NOMENCLADOR', '=', '', '', 'idtipodocidentidad', 1, 0, '', 'NINGUNO');
INSERT INTO dat_configcondicion (idconfigcondicion, idcampo, tipodato, condicionpordefecto, expresionregular, sqlwhere, idtabla, usarcondicion, representartbar, sqlfilter, usarreemplazar) VALUES (1316, 1692, 'FECHA', '', '', '', '', 1, 0, '', 'NINGUNO');
INSERT INTO dat_configcondicion (idconfigcondicion, idcampo, tipodato, condicionpordefecto, expresionregular, sqlwhere, idtabla, usarcondicion, representartbar, sqlfilter, usarreemplazar) VALUES (1228, 1591, 'TEXTO', '', '', '', '', 1, 0, '', 'NINGUNO');
INSERT INTO dat_configcondicion (idconfigcondicion, idcampo, tipodato, condicionpordefecto, expresionregular, sqlwhere, idtabla, usarcondicion, representartbar, sqlfilter, usarreemplazar) VALUES (1315, 1691, 'FECHA', '', '', '', '', 1, 0, '', 'NINGUNO');
INSERT INTO dat_configcondicion (idconfigcondicion, idcampo, tipodato, condicionpordefecto, expresionregular, sqlwhere, idtabla, usarcondicion, representartbar, sqlfilter, usarreemplazar) VALUES (1317, 1693, 'TEXTO', '', '', '', '', 1, 0, '', 'NINGUNO');
INSERT INTO dat_configcondicion (idconfigcondicion, idcampo, tipodato, condicionpordefecto, expresionregular, sqlwhere, idtabla, usarcondicion, representartbar, sqlfilter, usarreemplazar) VALUES (1318, 1695, 'FECHA', '', '', '', '', 1, 0, '', 'NINGUNO');
INSERT INTO dat_configcondicion (idconfigcondicion, idcampo, tipodato, condicionpordefecto, expresionregular, sqlwhere, idtabla, usarcondicion, representartbar, sqlfilter, usarreemplazar) VALUES (1319, 1696, 'NOMENCLADOR', '', '', '', 'idmotivoexclusion', 1, 0, '', 'NINGUNO');
INSERT INTO dat_configcondicion (idconfigcondicion, idcampo, tipodato, condicionpordefecto, expresionregular, sqlwhere, idtabla, usarcondicion, representartbar, sqlfilter, usarreemplazar) VALUES (1320, 1697, 'TEXTO', '', '', '', '', 1, 0, '', 'NINGUNO');
INSERT INTO dat_configcondicion (idconfigcondicion, idcampo, tipodato, condicionpordefecto, expresionregular, sqlwhere, idtabla, usarcondicion, representartbar, sqlfilter, usarreemplazar) VALUES (1231, 1594, 'TEXTO', '', '', '', '', 1, 0, '', 'NINGUNO');
INSERT INTO dat_configcondicion (idconfigcondicion, idcampo, tipodato, condicionpordefecto, expresionregular, sqlwhere, idtabla, usarcondicion, representartbar, sqlfilter, usarreemplazar) VALUES (1244, 1611, 'TEXTO', '%x%', '', '', '', 1, 1, '', 'NINGUNO');
INSERT INTO dat_configcondicion (idconfigcondicion, idcampo, tipodato, condicionpordefecto, expresionregular, sqlwhere, idtabla, usarcondicion, representartbar, sqlfilter, usarreemplazar) VALUES (1243, 1610, 'NUMERO', '', '', '', '', 1, 0, '', 'NINGUNO');
INSERT INTO dat_configcondicion (idconfigcondicion, idcampo, tipodato, condicionpordefecto, expresionregular, sqlwhere, idtabla, usarcondicion, representartbar, sqlfilter, usarreemplazar) VALUES (1247, 1614, 'TEXTO', '%x%', '', '', '', 1, 1, '', 'NINGUNO');
INSERT INTO dat_configcondicion (idconfigcondicion, idcampo, tipodato, condicionpordefecto, expresionregular, sqlwhere, idtabla, usarcondicion, representartbar, sqlfilter, usarreemplazar) VALUES (1246, 1613, 'TEXTO', '%x%', '', '', '', 1, 1, '', 'NINGUNO');
INSERT INTO dat_configcondicion (idconfigcondicion, idcampo, tipodato, condicionpordefecto, expresionregular, sqlwhere, idtabla, usarcondicion, representartbar, sqlfilter, usarreemplazar) VALUES (1257, 1627, 'NOMENCLADOR', '=', '', '', 'idcausa', 1, 0, '', 'NINGUNO');
INSERT INTO dat_configcondicion (idconfigcondicion, idcampo, tipodato, condicionpordefecto, expresionregular, sqlwhere, idtabla, usarcondicion, representartbar, sqlfilter, usarreemplazar) VALUES (1256, 1626, 'NOMENCLADOR', '=', '', '', 'idturnotrabajo', 1, 0, '', 'NINGUNO');
INSERT INTO dat_configcondicion (idconfigcondicion, idcampo, tipodato, condicionpordefecto, expresionregular, sqlwhere, idtabla, usarcondicion, representartbar, sqlfilter, usarreemplazar) VALUES (1255, 1625, 'NOMENCLADOR', '=', '', '', 'idgrupodescanso', 1, 0, '', 'NINGUNO');
INSERT INTO dat_configcondicion (idconfigcondicion, idcampo, tipodato, condicionpordefecto, expresionregular, sqlwhere, idtabla, usarcondicion, representartbar, sqlfilter, usarreemplazar) VALUES (1254, 1624, 'NOMENCLADOR', '=', '', '', 'idregimentrabajo', 1, 0, '', 'NINGUNO');
INSERT INTO dat_configcondicion (idconfigcondicion, idcampo, tipodato, condicionpordefecto, expresionregular, sqlwhere, idtabla, usarcondicion, representartbar, sqlfilter, usarreemplazar) VALUES (1250, 1617, 'TEXTO', '', '', '', '', 1, 1, '', 'NINGUNO');
INSERT INTO dat_configcondicion (idconfigcondicion, idcampo, tipodato, condicionpordefecto, expresionregular, sqlwhere, idtabla, usarcondicion, representartbar, sqlfilter, usarreemplazar) VALUES (1249, 1616, 'TEXTO', '', '', '', '', 1, 0, '', 'NINGUNO');
INSERT INTO dat_configcondicion (idconfigcondicion, idcampo, tipodato, condicionpordefecto, expresionregular, sqlwhere, idtabla, usarcondicion, representartbar, sqlfilter, usarreemplazar) VALUES (1264, 1635, 'TEXTO', '%x%', '', '', '', 1, 0, '', 'NINGUNO');
INSERT INTO dat_configcondicion (idconfigcondicion, idcampo, tipodato, condicionpordefecto, expresionregular, sqlwhere, idtabla, usarcondicion, representartbar, sqlfilter, usarreemplazar) VALUES (1263, 1634, 'TEXTO', '%x%', '', '', '', 1, 0, '', 'NINGUNO');
INSERT INTO dat_configcondicion (idconfigcondicion, idcampo, tipodato, condicionpordefecto, expresionregular, sqlwhere, idtabla, usarcondicion, representartbar, sqlfilter, usarreemplazar) VALUES (1261, 1632, 'NOMENCLADOR', '=', '', '', 'idnomcargo', 1, 0, '', 'NINGUNO');
INSERT INTO dat_configcondicion (idconfigcondicion, idcampo, tipodato, condicionpordefecto, expresionregular, sqlwhere, idtabla, usarcondicion, representartbar, sqlfilter, usarreemplazar) VALUES (1260, 1630, 'FECHA', '<=', '', '', '', 1, 0, '', 'NINGUNO');
INSERT INTO dat_configcondicion (idconfigcondicion, idcampo, tipodato, condicionpordefecto, expresionregular, sqlwhere, idtabla, usarcondicion, representartbar, sqlfilter, usarreemplazar) VALUES (1287, 1660, 'NOMENCLADOR', '', '', '', 'idestructura', 1, 0, 'idproyecto = 0', 'NINGUNO');
INSERT INTO dat_configcondicion (idconfigcondicion, idcampo, tipodato, condicionpordefecto, expresionregular, sqlwhere, idtabla, usarcondicion, representartbar, sqlfilter, usarreemplazar) VALUES (1286, 1659, 'NOMENCLADOR', '', '', '', 'idnomcargo', 1, 0, '', 'NINGUNO');
INSERT INTO dat_configcondicion (idconfigcondicion, idcampo, tipodato, condicionpordefecto, expresionregular, sqlwhere, idtabla, usarcondicion, representartbar, sqlfilter, usarreemplazar) VALUES (1285, 1658, 'TEXTO', '', '', '', '', 1, 0, '', 'NINGUNO');
INSERT INTO dat_configcondicion (idconfigcondicion, idcampo, tipodato, condicionpordefecto, expresionregular, sqlwhere, idtabla, usarcondicion, representartbar, sqlfilter, usarreemplazar) VALUES (1284, 1657, 'TEXTO', '', '', '', '', 1, 0, '', 'NINGUNO');
INSERT INTO dat_configcondicion (idconfigcondicion, idcampo, tipodato, condicionpordefecto, expresionregular, sqlwhere, idtabla, usarcondicion, representartbar, sqlfilter, usarreemplazar) VALUES (1283, 1656, 'TEXTO', '', '', '', '', 1, 0, '', 'NINGUNO');
INSERT INTO dat_configcondicion (idconfigcondicion, idcampo, tipodato, condicionpordefecto, expresionregular, sqlwhere, idtabla, usarcondicion, representartbar, sqlfilter, usarreemplazar) VALUES (1282, 1655, 'TEXTO', '', '', '', '', 1, 0, '', 'NINGUNO');
INSERT INTO dat_configcondicion (idconfigcondicion, idcampo, tipodato, condicionpordefecto, expresionregular, sqlwhere, idtabla, usarcondicion, representartbar, sqlfilter, usarreemplazar) VALUES (1281, 1654, 'TEXTO', '', '', '', '', 1, 0, '', 'NINGUNO');
INSERT INTO dat_configcondicion (idconfigcondicion, idcampo, tipodato, condicionpordefecto, expresionregular, sqlwhere, idtabla, usarcondicion, representartbar, sqlfilter, usarreemplazar) VALUES (1280, 1653, 'TEXTO', '', '', '', '', 1, 0, '', 'NINGUNO');
INSERT INTO dat_configcondicion (idconfigcondicion, idcampo, tipodato, condicionpordefecto, expresionregular, sqlwhere, idtabla, usarcondicion, representartbar, sqlfilter, usarreemplazar) VALUES (1279, 1652, 'TEXTO', '', '', '', '', 1, 0, '', 'NINGUNO');
INSERT INTO dat_configcondicion (idconfigcondicion, idcampo, tipodato, condicionpordefecto, expresionregular, sqlwhere, idtabla, usarcondicion, representartbar, sqlfilter, usarreemplazar) VALUES (1278, 1651, 'NUMERO', '', '', '', '', 1, 0, '', 'NINGUNO');
INSERT INTO dat_configcondicion (idconfigcondicion, idcampo, tipodato, condicionpordefecto, expresionregular, sqlwhere, idtabla, usarcondicion, representartbar, sqlfilter, usarreemplazar) VALUES (1277, 1650, 'TEXTO', '', '', '', '', 1, 0, '', 'NINGUNO');
INSERT INTO dat_configcondicion (idconfigcondicion, idcampo, tipodato, condicionpordefecto, expresionregular, sqlwhere, idtabla, usarcondicion, representartbar, sqlfilter, usarreemplazar) VALUES (1275, 1648, 'TEXTO', '', '', '', '', 1, 0, '', 'NINGUNO');
INSERT INTO dat_configcondicion (idconfigcondicion, idcampo, tipodato, condicionpordefecto, expresionregular, sqlwhere, idtabla, usarcondicion, representartbar, sqlfilter, usarreemplazar) VALUES (1274, 1647, 'TEXTO', '', '', '', '', 1, 0, '', 'NINGUNO');
INSERT INTO dat_configcondicion (idconfigcondicion, idcampo, tipodato, condicionpordefecto, expresionregular, sqlwhere, idtabla, usarcondicion, representartbar, sqlfilter, usarreemplazar) VALUES (1272, 1645, 'FECHA', '', '', '', '', 1, 0, '', 'NINGUNO');
INSERT INTO dat_configcondicion (idconfigcondicion, idcampo, tipodato, condicionpordefecto, expresionregular, sqlwhere, idtabla, usarcondicion, representartbar, sqlfilter, usarreemplazar) VALUES (1335, 1716, 'TEXTO', '', '', 'mod_rrhhmaestro.sustituiryconvertir({campo})', '', 1, 0, '', 'MINUSCULA SIN TILDE');
INSERT INTO dat_configcondicion (idconfigcondicion, idcampo, tipodato, condicionpordefecto, expresionregular, sqlwhere, idtabla, usarcondicion, representartbar, sqlfilter, usarreemplazar) VALUES (1337, 1718, 'TEXTO', '', '', 'mod_rrhhmaestro.sustituiryconvertir({campo})', '', 1, 0, '', 'MINUSCULA SIN TILDE');
INSERT INTO dat_configcondicion (idconfigcondicion, idcampo, tipodato, condicionpordefecto, expresionregular, sqlwhere, idtabla, usarcondicion, representartbar, sqlfilter, usarreemplazar) VALUES (1265, 1637, 'NUMERO', '', '', '', '', 1, 0, '', 'NINGUNO');
INSERT INTO dat_configcondicion (idconfigcondicion, idcampo, tipodato, condicionpordefecto, expresionregular, sqlwhere, idtabla, usarcondicion, representartbar, sqlfilter, usarreemplazar) VALUES (1259, 1629, 'FECHA', '>=', '', '', '', 1, 0, '', 'NINGUNO');
INSERT INTO dat_configcondicion (idconfigcondicion, idcampo, tipodato, condicionpordefecto, expresionregular, sqlwhere, idtabla, usarcondicion, representartbar, sqlfilter, usarreemplazar) VALUES (1258, 1628, 'FECHA', '=', '', '', '', 1, 0, '', 'NINGUNO');
INSERT INTO dat_configcondicion (idconfigcondicion, idcampo, tipodato, condicionpordefecto, expresionregular, sqlwhere, idtabla, usarcondicion, representartbar, sqlfilter, usarreemplazar) VALUES (1357, 1743, 'NOMENCLADOR', '', '', '', 'idgrupocomplejidad', 1, 0, '', 'NINGUNO');
INSERT INTO dat_configcondicion (idconfigcondicion, idcampo, tipodato, condicionpordefecto, expresionregular, sqlwhere, idtabla, usarcondicion, representartbar, sqlfilter, usarreemplazar) VALUES (1355, 1741, 'NOMENCLADOR', '=', '', '', 'idestructuraop', 1, 0, 'idproyecto = 0', 'NINGUNO');
INSERT INTO dat_configcondicion (idconfigcondicion, idcampo, tipodato, condicionpordefecto, expresionregular, sqlwhere, idtabla, usarcondicion, representartbar, sqlfilter, usarreemplazar) VALUES (1302, 1675, 'NOMENCLADOR', '', '', '', 'idsituacion', 1, 0, '', 'NINGUNO');
INSERT INTO dat_configcondicion (idconfigcondicion, idcampo, tipodato, condicionpordefecto, expresionregular, sqlwhere, idtabla, usarcondicion, representartbar, sqlfilter, usarreemplazar) VALUES (1359, 1746, 'NOMENCLADOR', '=', '', '', 'idniveleducacional', 1, 0, '', 'NINGUNO');
INSERT INTO dat_configcondicion (idconfigcondicion, idcampo, tipodato, condicionpordefecto, expresionregular, sqlwhere, idtabla, usarcondicion, representartbar, sqlfilter, usarreemplazar) VALUES (1361, 1749, 'NOMENCLADOR', '', '', '', 'idprenda', 1, 0, '', 'NINGUNO');
INSERT INTO dat_configcondicion (idconfigcondicion, idcampo, tipodato, condicionpordefecto, expresionregular, sqlwhere, idtabla, usarcondicion, representartbar, sqlfilter, usarreemplazar) VALUES (1155, 1503, 'NUMERO', '=', '', 'date_part(''year'',age({campo}))', '', 1, 0, '', 'NINGUNO');
INSERT INTO dat_configcondicion (idconfigcondicion, idcampo, tipodato, condicionpordefecto, expresionregular, sqlwhere, idtabla, usarcondicion, representartbar, sqlfilter, usarreemplazar) VALUES (1363, 1751, 'NOMENCLADOR', '', '', '', 'idtalla', 1, 0, '', 'NINGUNO');
INSERT INTO dat_configcondicion (idconfigcondicion, idcampo, tipodato, condicionpordefecto, expresionregular, sqlwhere, idtabla, usarcondicion, representartbar, sqlfilter, usarreemplazar) VALUES (1367, 1756, 'MULTIPLESVALORES', '', '', '', '', 1, 0, '', 'NINGUNO');
INSERT INTO dat_configcondicion (idconfigcondicion, idcampo, tipodato, condicionpordefecto, expresionregular, sqlwhere, idtabla, usarcondicion, representartbar, sqlfilter, usarreemplazar) VALUES (1369, 1758, 'FECHA', '', '', '', '', 1, 0, '', 'NINGUNO');
INSERT INTO dat_configcondicion (idconfigcondicion, idcampo, tipodato, condicionpordefecto, expresionregular, sqlwhere, idtabla, usarcondicion, representartbar, sqlfilter, usarreemplazar) VALUES (1371, 1761, 'TEXTO', '', '', '', '', 1, 0, '', 'NINGUNO');
INSERT INTO dat_configcondicion (idconfigcondicion, idcampo, tipodato, condicionpordefecto, expresionregular, sqlwhere, idtabla, usarcondicion, representartbar, sqlfilter, usarreemplazar) VALUES (1373, 1763, 'TEXTO', '', '', '', '', 1, 0, '', 'NINGUNO');
INSERT INTO dat_configcondicion (idconfigcondicion, idcampo, tipodato, condicionpordefecto, expresionregular, sqlwhere, idtabla, usarcondicion, representartbar, sqlfilter, usarreemplazar) VALUES (1375, 1765, 'FECHA', '', '', '', '', 1, 0, '', 'NINGUNO');
INSERT INTO dat_configcondicion (idconfigcondicion, idcampo, tipodato, condicionpordefecto, expresionregular, sqlwhere, idtabla, usarcondicion, representartbar, sqlfilter, usarreemplazar) VALUES (1377, 1768, 'TEXTO', '', '', '', '', 1, 0, '', 'NINGUNO');
INSERT INTO dat_configcondicion (idconfigcondicion, idcampo, tipodato, condicionpordefecto, expresionregular, sqlwhere, idtabla, usarcondicion, representartbar, sqlfilter, usarreemplazar) VALUES (1378, 1769, 'TEXTO', '', '', '', '', 1, 0, '', 'NINGUNO');
INSERT INTO dat_configcondicion (idconfigcondicion, idcampo, tipodato, condicionpordefecto, expresionregular, sqlwhere, idtabla, usarcondicion, representartbar, sqlfilter, usarreemplazar) VALUES (1381, 1773, 'NOMENCLADOR', '=', '', '', 'idsalario', 1, 0, '', 'NINGUNO');
INSERT INTO dat_configcondicion (idconfigcondicion, idcampo, tipodato, condicionpordefecto, expresionregular, sqlwhere, idtabla, usarcondicion, representartbar, sqlfilter, usarreemplazar) VALUES (1387, 1779, 'TEXTO', '', '', '', '', 1, 0, '', 'NINGUNO');
INSERT INTO dat_configcondicion (idconfigcondicion, idcampo, tipodato, condicionpordefecto, expresionregular, sqlwhere, idtabla, usarcondicion, representartbar, sqlfilter, usarreemplazar) VALUES (1388, 1780, 'TEXTO', '', '', '', '', 1, 0, '', 'NINGUNO');
INSERT INTO dat_configcondicion (idconfigcondicion, idcampo, tipodato, condicionpordefecto, expresionregular, sqlwhere, idtabla, usarcondicion, representartbar, sqlfilter, usarreemplazar) VALUES (1385, 1777, 'MULTIPLESVALORES', '', '', '', '', 1, 0, '', 'NINGUNO');
INSERT INTO dat_configcondicion (idconfigcondicion, idcampo, tipodato, condicionpordefecto, expresionregular, sqlwhere, idtabla, usarcondicion, representartbar, sqlfilter, usarreemplazar) VALUES (1271, 1644, 'FECHA', '', '', '', '', 1, 0, '', 'NINGUNO');
INSERT INTO dat_configcondicion (idconfigcondicion, idcampo, tipodato, condicionpordefecto, expresionregular, sqlwhere, idtabla, usarcondicion, representartbar, sqlfilter, usarreemplazar) VALUES (1386, 1778, 'NOMENCLADOR', '=', '', '', 'idsector', 1, 1, '', 'NINGUNO');
INSERT INTO dat_configcondicion (idconfigcondicion, idcampo, tipodato, condicionpordefecto, expresionregular, sqlwhere, idtabla, usarcondicion, representartbar, sqlfilter, usarreemplazar) VALUES (1233, 1596, 'TEXTO', '', '', '', '', 1, 0, '', 'NINGUNO');
INSERT INTO dat_configcondicion (idconfigcondicion, idcampo, tipodato, condicionpordefecto, expresionregular, sqlwhere, idtabla, usarcondicion, representartbar, sqlfilter, usarreemplazar) VALUES (1380, 1772, 'NOMENCLADOR', '=', '', '', 'idgrupocomplejidad', 1, 1, '', 'NINGUNO');
INSERT INTO dat_configcondicion (idconfigcondicion, idcampo, tipodato, condicionpordefecto, expresionregular, sqlwhere, idtabla, usarcondicion, representartbar, sqlfilter, usarreemplazar) VALUES (1379, 1771, 'TEXTO', '%x%', '', 'mod_rrhhmaestro.sustituiryconvertir({campo})', 'idnomcargo', 1, 1, '', 'MINUSCULA SIN TILDE');
INSERT INTO dat_configcondicion (idconfigcondicion, idcampo, tipodato, condicionpordefecto, expresionregular, sqlwhere, idtabla, usarcondicion, representartbar, sqlfilter, usarreemplazar) VALUES (1230, 1593, 'TEXTO', '=', '', '', '', 1, 0, '', 'NINGUNO');
INSERT INTO dat_configcondicion (idconfigcondicion, idcampo, tipodato, condicionpordefecto, expresionregular, sqlwhere, idtabla, usarcondicion, representartbar, sqlfilter, usarreemplazar) VALUES (1383, 1775, 'ARBOL', '', '', '{php}buscarCargosPorEstructura', 'idfila', 1, 0, '{php}listarestructura', 'NINGUNO');
INSERT INTO dat_configcondicion (idconfigcondicion, idcampo, tipodato, condicionpordefecto, expresionregular, sqlwhere, idtabla, usarcondicion, representartbar, sqlfilter, usarreemplazar) VALUES (1229, 1592, 'TEXTO', '%x%', '', 'mod_rrhhmaestro.sustituiryconvertir({campo})', '', 1, 1, '', 'MINUSCULA SIN TILDE');
INSERT INTO dat_configcondicion (idconfigcondicion, idcampo, tipodato, condicionpordefecto, expresionregular, sqlwhere, idtabla, usarcondicion, representartbar, sqlfilter, usarreemplazar) VALUES (1232, 1595, 'TEXTO', '%x%', '', '', '', 1, 1, '', 'NINGUNO');
INSERT INTO dat_configcondicion (idconfigcondicion, idcampo, tipodato, condicionpordefecto, expresionregular, sqlwhere, idtabla, usarcondicion, representartbar, sqlfilter, usarreemplazar) VALUES (1390, 1782, 'TEXTO', '%x%', '', '', '', 1, 0, '', 'NINGUNO');
INSERT INTO dat_configcondicion (idconfigcondicion, idcampo, tipodato, condicionpordefecto, expresionregular, sqlwhere, idtabla, usarcondicion, representartbar, sqlfilter, usarreemplazar) VALUES (1384, 1776, 'TEXTO', '%x%', '', '', '', 1, 0, '{php}buscarCargosPorEstructura', 'NINGUNO');
INSERT INTO dat_configcondicion (idconfigcondicion, idcampo, tipodato, condicionpordefecto, expresionregular, sqlwhere, idtabla, usarcondicion, representartbar, sqlfilter, usarreemplazar) VALUES (1397, 1790, 'NOMENCLADOR', '', '', '', 'idespecialidad', 1, 0, '', 'NINGUNO');
INSERT INTO dat_configcondicion (idconfigcondicion, idcampo, tipodato, condicionpordefecto, expresionregular, sqlwhere, idtabla, usarcondicion, representartbar, sqlfilter, usarreemplazar) VALUES (1399, 1792, 'NOMENCLADOR', '', '', '', 'idtipoescala', 1, 0, '', 'NINGUNO');
INSERT INTO dat_configcondicion (idconfigcondicion, idcampo, tipodato, condicionpordefecto, expresionregular, sqlwhere, idtabla, usarcondicion, representartbar, sqlfilter, usarreemplazar) VALUES (1400, 1793, 'MULTIPLESVALORES', '', '', '', '', 1, 0, '', 'NINGUNO');
INSERT INTO dat_configcondicion (idconfigcondicion, idcampo, tipodato, condicionpordefecto, expresionregular, sqlwhere, idtabla, usarcondicion, representartbar, sqlfilter, usarreemplazar) VALUES (1401, 1794, 'MULTIPLESVALORES', '', '', '', '', 1, 0, '', 'NINGUNO');
INSERT INTO dat_configcondicion (idconfigcondicion, idcampo, tipodato, condicionpordefecto, expresionregular, sqlwhere, idtabla, usarcondicion, representartbar, sqlfilter, usarreemplazar) VALUES (1402, 1795, 'NOMENCLADOR', '=', '', '', 'idcategocup', 1, 1, '', 'NINGUNO');
INSERT INTO dat_configcondicion (idconfigcondicion, idcampo, tipodato, condicionpordefecto, expresionregular, sqlwhere, idtabla, usarcondicion, representartbar, sqlfilter, usarreemplazar) VALUES (1392, 1784, 'TEXTO', '%x%', '', 'mod_rrhhmaestro.sustituiryconvertir({campo})', '', 1, 0, '', 'MINUSCULA SIN TILDE');
INSERT INTO dat_configcondicion (idconfigcondicion, idcampo, tipodato, condicionpordefecto, expresionregular, sqlwhere, idtabla, usarcondicion, representartbar, sqlfilter, usarreemplazar) VALUES (1405, 1798, 'NOMENCLADOR', '=', '', '', 'idnomcargo', 1, 1, '', 'NINGUNO');
INSERT INTO dat_configcondicion (idconfigcondicion, idcampo, tipodato, condicionpordefecto, expresionregular, sqlwhere, idtabla, usarcondicion, representartbar, sqlfilter, usarreemplazar) VALUES (1226, 1589, 'TEXTO', '%x%', '', 'mod_rrhhmaestro.sustituiryconvertir({campo})', '', 1, 1, '', 'MINUSCULA SIN TILDE');
INSERT INTO dat_configcondicion (idconfigcondicion, idcampo, tipodato, condicionpordefecto, expresionregular, sqlwhere, idtabla, usarcondicion, representartbar, sqlfilter, usarreemplazar) VALUES (1227, 1590, 'TEXTO', '%x%', '', 'mod_rrhhmaestro.sustituiryconvertir({campo})', '', 1, 1, '', 'MAYUSCULA SIN TILDE');
INSERT INTO dat_configcondicion (idconfigcondicion, idcampo, tipodato, condicionpordefecto, expresionregular, sqlwhere, idtabla, usarcondicion, representartbar, sqlfilter, usarreemplazar) VALUES (1225, 1588, 'TEXTO', '%x%', '', 'mod_rrhhmaestro.sustituiryconvertir({campo})', '', 1, 1, '', 'MINUSCULA SIN TILDE');
INSERT INTO dat_configcondicion (idconfigcondicion, idcampo, tipodato, condicionpordefecto, expresionregular, sqlwhere, idtabla, usarcondicion, representartbar, sqlfilter, usarreemplazar) VALUES (1270, 1643, 'MULTIPLESVALORES', '=', '', '', '', 1, 1, '', 'NINGUNO');
INSERT INTO dat_configmostrar (idconfigmostrar, idcampo, anchocolumna, sqlselect, renderer, obligatorio, expander, agruparcampo, tooltip, oculto, icono) VALUES (1391, 1753, 120, '', '', 0, 0, 0, 0, 0, NULL);
INSERT INTO dat_configmostrar (idconfigmostrar, idcampo, anchocolumna, sqlselect, renderer, obligatorio, expander, agruparcampo, tooltip, oculto, icono) VALUES (1103, 1408, 100, '', '', 0, 0, 0, 0, 0, NULL);
INSERT INTO dat_configmostrar (idconfigmostrar, idcampo, anchocolumna, sqlselect, renderer, obligatorio, expander, agruparcampo, tooltip, oculto, icono) VALUES (1113, 1421, 100, '', '', 0, 0, 0, 0, 0, NULL);
INSERT INTO dat_configmostrar (idconfigmostrar, idcampo, anchocolumna, sqlselect, renderer, obligatorio, expander, agruparcampo, tooltip, oculto, icono) VALUES (1381, 1740, 100, '', '', 0, 0, 0, 0, 0, NULL);
INSERT INTO dat_configmostrar (idconfigmostrar, idcampo, anchocolumna, sqlselect, renderer, obligatorio, expander, agruparcampo, tooltip, oculto, icono) VALUES (1383, 1742, 100, '', '', 0, 0, 0, 0, 0, NULL);
INSERT INTO dat_configmostrar (idconfigmostrar, idcampo, anchocolumna, sqlselect, renderer, obligatorio, expander, agruparcampo, tooltip, oculto, icono) VALUES (1108, 1415, 100, '', '', 0, 0, 0, 0, 0, NULL);
INSERT INTO dat_configmostrar (idconfigmostrar, idcampo, anchocolumna, sqlselect, renderer, obligatorio, expander, agruparcampo, tooltip, oculto, icono) VALUES (1395, 1757, 100, '', '', 0, 0, 0, 0, 0, NULL);
INSERT INTO dat_configmostrar (idconfigmostrar, idcampo, anchocolumna, sqlselect, renderer, obligatorio, expander, agruparcampo, tooltip, oculto, icono) VALUES (1097, 1402, 100, '', '', 0, 0, 0, 0, 0, NULL);
INSERT INTO dat_configmostrar (idconfigmostrar, idcampo, anchocolumna, sqlselect, renderer, obligatorio, expander, agruparcampo, tooltip, oculto, icono) VALUES (1098, 1403, 100, '', '', 0, 0, 0, 0, 0, NULL);
INSERT INTO dat_configmostrar (idconfigmostrar, idcampo, anchocolumna, sqlselect, renderer, obligatorio, expander, agruparcampo, tooltip, oculto, icono) VALUES (1099, 1404, 100, '', '', 0, 0, 0, 0, 0, NULL);
INSERT INTO dat_configmostrar (idconfigmostrar, idcampo, anchocolumna, sqlselect, renderer, obligatorio, expander, agruparcampo, tooltip, oculto, icono) VALUES (1100, 1405, 100, '', '', 0, 0, 0, 0, 0, NULL);
INSERT INTO dat_configmostrar (idconfigmostrar, idcampo, anchocolumna, sqlselect, renderer, obligatorio, expander, agruparcampo, tooltip, oculto, icono) VALUES (1101, 1406, 100, '', '', 0, 0, 0, 0, 0, NULL);
INSERT INTO dat_configmostrar (idconfigmostrar, idcampo, anchocolumna, sqlselect, renderer, obligatorio, expander, agruparcampo, tooltip, oculto, icono) VALUES (1102, 1407, 100, '', '', 0, 0, 0, 0, 0, NULL);
INSERT INTO dat_configmostrar (idconfigmostrar, idcampo, anchocolumna, sqlselect, renderer, obligatorio, expander, agruparcampo, tooltip, oculto, icono) VALUES (1104, 1410, 100, '', '', 0, 0, 0, 0, 0, NULL);
INSERT INTO dat_configmostrar (idconfigmostrar, idcampo, anchocolumna, sqlselect, renderer, obligatorio, expander, agruparcampo, tooltip, oculto, icono) VALUES (1105, 1411, 100, '', '', 0, 0, 0, 0, 0, NULL);
INSERT INTO dat_configmostrar (idconfigmostrar, idcampo, anchocolumna, sqlselect, renderer, obligatorio, expander, agruparcampo, tooltip, oculto, icono) VALUES (1106, 1412, 100, '', '', 0, 0, 0, 0, 0, NULL);
INSERT INTO dat_configmostrar (idconfigmostrar, idcampo, anchocolumna, sqlselect, renderer, obligatorio, expander, agruparcampo, tooltip, oculto, icono) VALUES (1122, 1432, 100, '', '', 0, 0, 0, 0, 0, NULL);
INSERT INTO dat_configmostrar (idconfigmostrar, idcampo, anchocolumna, sqlselect, renderer, obligatorio, expander, agruparcampo, tooltip, oculto, icono) VALUES (1123, 1433, 100, '', '', 0, 0, 0, 0, 0, NULL);
INSERT INTO dat_configmostrar (idconfigmostrar, idcampo, anchocolumna, sqlselect, renderer, obligatorio, expander, agruparcampo, tooltip, oculto, icono) VALUES (1109, 1416, 100, '', '', 0, 0, 0, 0, 0, NULL);
INSERT INTO dat_configmostrar (idconfigmostrar, idcampo, anchocolumna, sqlselect, renderer, obligatorio, expander, agruparcampo, tooltip, oculto, icono) VALUES (1110, 1417, 100, '', '', 0, 0, 0, 0, 0, NULL);
INSERT INTO dat_configmostrar (idconfigmostrar, idcampo, anchocolumna, sqlselect, renderer, obligatorio, expander, agruparcampo, tooltip, oculto, icono) VALUES (1114, 1422, 100, '', '', 0, 0, 0, 0, 0, NULL);
INSERT INTO dat_configmostrar (idconfigmostrar, idcampo, anchocolumna, sqlselect, renderer, obligatorio, expander, agruparcampo, tooltip, oculto, icono) VALUES (1116, 1424, 100, '', '', 0, 0, 0, 0, 0, NULL);
INSERT INTO dat_configmostrar (idconfigmostrar, idcampo, anchocolumna, sqlselect, renderer, obligatorio, expander, agruparcampo, tooltip, oculto, icono) VALUES (1117, 1425, 100, '', '', 0, 0, 0, 0, 0, NULL);
INSERT INTO dat_configmostrar (idconfigmostrar, idcampo, anchocolumna, sqlselect, renderer, obligatorio, expander, agruparcampo, tooltip, oculto, icono) VALUES (1118, 1427, 100, '', '', 0, 0, 0, 0, 0, NULL);
INSERT INTO dat_configmostrar (idconfigmostrar, idcampo, anchocolumna, sqlselect, renderer, obligatorio, expander, agruparcampo, tooltip, oculto, icono) VALUES (1120, 1429, 100, '', '', 0, 0, 0, 0, 0, NULL);
INSERT INTO dat_configmostrar (idconfigmostrar, idcampo, anchocolumna, sqlselect, renderer, obligatorio, expander, agruparcampo, tooltip, oculto, icono) VALUES (1121, 1430, 100, '', '', 0, 0, 0, 0, 0, NULL);
INSERT INTO dat_configmostrar (idconfigmostrar, idcampo, anchocolumna, sqlselect, renderer, obligatorio, expander, agruparcampo, tooltip, oculto, icono) VALUES (1124, 1434, 100, '', '', 0, 0, 0, 0, 0, NULL);
INSERT INTO dat_configmostrar (idconfigmostrar, idcampo, anchocolumna, sqlselect, renderer, obligatorio, expander, agruparcampo, tooltip, oculto, icono) VALUES (1125, 1435, 100, '', '', 0, 0, 0, 0, 0, NULL);
INSERT INTO dat_configmostrar (idconfigmostrar, idcampo, anchocolumna, sqlselect, renderer, obligatorio, expander, agruparcampo, tooltip, oculto, icono) VALUES (1127, 1438, 100, '', '', 0, 0, 0, 0, 0, NULL);
INSERT INTO dat_configmostrar (idconfigmostrar, idcampo, anchocolumna, sqlselect, renderer, obligatorio, expander, agruparcampo, tooltip, oculto, icono) VALUES (1128, 1439, 100, '', '', 0, 0, 0, 0, 0, NULL);
INSERT INTO dat_configmostrar (idconfigmostrar, idcampo, anchocolumna, sqlselect, renderer, obligatorio, expander, agruparcampo, tooltip, oculto, icono) VALUES (1129, 1440, 100, '', '', 0, 0, 0, 0, 0, NULL);
INSERT INTO dat_configmostrar (idconfigmostrar, idcampo, anchocolumna, sqlselect, renderer, obligatorio, expander, agruparcampo, tooltip, oculto, icono) VALUES (1130, 1441, 100, '', '', 0, 0, 0, 0, 0, NULL);
INSERT INTO dat_configmostrar (idconfigmostrar, idcampo, anchocolumna, sqlselect, renderer, obligatorio, expander, agruparcampo, tooltip, oculto, icono) VALUES (1131, 1442, 100, '', '', 0, 0, 0, 0, 0, NULL);
INSERT INTO dat_configmostrar (idconfigmostrar, idcampo, anchocolumna, sqlselect, renderer, obligatorio, expander, agruparcampo, tooltip, oculto, icono) VALUES (1132, 1443, 100, '', '', 0, 0, 0, 0, 0, NULL);
INSERT INTO dat_configmostrar (idconfigmostrar, idcampo, anchocolumna, sqlselect, renderer, obligatorio, expander, agruparcampo, tooltip, oculto, icono) VALUES (1133, 1445, 100, '', '', 0, 0, 0, 0, 0, NULL);
INSERT INTO dat_configmostrar (idconfigmostrar, idcampo, anchocolumna, sqlselect, renderer, obligatorio, expander, agruparcampo, tooltip, oculto, icono) VALUES (1134, 1446, 100, '', '', 0, 0, 0, 0, 0, NULL);
INSERT INTO dat_configmostrar (idconfigmostrar, idcampo, anchocolumna, sqlselect, renderer, obligatorio, expander, agruparcampo, tooltip, oculto, icono) VALUES (1135, 1448, 100, '', '', 0, 0, 0, 0, 0, NULL);
INSERT INTO dat_configmostrar (idconfigmostrar, idcampo, anchocolumna, sqlselect, renderer, obligatorio, expander, agruparcampo, tooltip, oculto, icono) VALUES (1136, 1449, 100, '', '', 0, 0, 0, 0, 0, NULL);
INSERT INTO dat_configmostrar (idconfigmostrar, idcampo, anchocolumna, sqlselect, renderer, obligatorio, expander, agruparcampo, tooltip, oculto, icono) VALUES (1137, 1450, 100, '', '', 0, 0, 0, 0, 0, NULL);
INSERT INTO dat_configmostrar (idconfigmostrar, idcampo, anchocolumna, sqlselect, renderer, obligatorio, expander, agruparcampo, tooltip, oculto, icono) VALUES (1144, 1460, 100, '', '', 0, 0, 0, 0, 0, NULL);
INSERT INTO dat_configmostrar (idconfigmostrar, idcampo, anchocolumna, sqlselect, renderer, obligatorio, expander, agruparcampo, tooltip, oculto, icono) VALUES (1138, 1451, 100, '', '', 0, 0, 0, 0, 0, NULL);
INSERT INTO dat_configmostrar (idconfigmostrar, idcampo, anchocolumna, sqlselect, renderer, obligatorio, expander, agruparcampo, tooltip, oculto, icono) VALUES (1396, 1758, 100, '', '', 0, 0, 0, 0, 0, NULL);
INSERT INTO dat_configmostrar (idconfigmostrar, idcampo, anchocolumna, sqlselect, renderer, obligatorio, expander, agruparcampo, tooltip, oculto, icono) VALUES (1387, 1747, 150, '', '', 0, 0, 0, 0, 0, NULL);
INSERT INTO dat_configmostrar (idconfigmostrar, idcampo, anchocolumna, sqlselect, renderer, obligatorio, expander, agruparcampo, tooltip, oculto, icono) VALUES (1145, 1461, 100, '', '', 0, 0, 0, 0, 0, NULL);
INSERT INTO dat_configmostrar (idconfigmostrar, idcampo, anchocolumna, sqlselect, renderer, obligatorio, expander, agruparcampo, tooltip, oculto, icono) VALUES (1146, 1462, 100, '', '', 0, 0, 0, 0, 0, NULL);
INSERT INTO dat_configmostrar (idconfigmostrar, idcampo, anchocolumna, sqlselect, renderer, obligatorio, expander, agruparcampo, tooltip, oculto, icono) VALUES (1148, 1464, 100, '', '', 0, 0, 0, 0, 0, NULL);
INSERT INTO dat_configmostrar (idconfigmostrar, idcampo, anchocolumna, sqlselect, renderer, obligatorio, expander, agruparcampo, tooltip, oculto, icono) VALUES (1149, 1465, 100, '', '', 0, 0, 0, 0, 0, NULL);
INSERT INTO dat_configmostrar (idconfigmostrar, idcampo, anchocolumna, sqlselect, renderer, obligatorio, expander, agruparcampo, tooltip, oculto, icono) VALUES (1151, 1467, 100, '', '', 0, 0, 0, 0, 0, NULL);
INSERT INTO dat_configmostrar (idconfigmostrar, idcampo, anchocolumna, sqlselect, renderer, obligatorio, expander, agruparcampo, tooltip, oculto, icono) VALUES (1389, 1750, 100, '', '', 0, 0, 0, 0, 0, NULL);
INSERT INTO dat_configmostrar (idconfigmostrar, idcampo, anchocolumna, sqlselect, renderer, obligatorio, expander, agruparcampo, tooltip, oculto, icono) VALUES (1154, 1471, 100, '', '', 0, 0, 0, 0, 0, NULL);
INSERT INTO dat_configmostrar (idconfigmostrar, idcampo, anchocolumna, sqlselect, renderer, obligatorio, expander, agruparcampo, tooltip, oculto, icono) VALUES (1390, 1751, 100, '', '', 0, 0, 0, 0, 0, NULL);
INSERT INTO dat_configmostrar (idconfigmostrar, idcampo, anchocolumna, sqlselect, renderer, obligatorio, expander, agruparcampo, tooltip, oculto, icono) VALUES (1182, 1503, 100, 'date_part(''year'',age({campo})) || '' años''', '', 0, 0, 0, 0, 0, NULL);
INSERT INTO dat_configmostrar (idconfigmostrar, idcampo, anchocolumna, sqlselect, renderer, obligatorio, expander, agruparcampo, tooltip, oculto, icono) VALUES (1393, 1755, 200, '', '', 0, 0, 0, 0, 0, NULL);
INSERT INTO dat_configmostrar (idconfigmostrar, idcampo, anchocolumna, sqlselect, renderer, obligatorio, expander, agruparcampo, tooltip, oculto, icono) VALUES (1397, 1760, 100, '', '', 0, 0, 0, 0, 0, NULL);
INSERT INTO dat_configmostrar (idconfigmostrar, idcampo, anchocolumna, sqlselect, renderer, obligatorio, expander, agruparcampo, tooltip, oculto, icono) VALUES (1163, 1480, 100, '', '', 0, 0, 0, 0, 0, NULL);
INSERT INTO dat_configmostrar (idconfigmostrar, idcampo, anchocolumna, sqlselect, renderer, obligatorio, expander, agruparcampo, tooltip, oculto, icono) VALUES (1164, 1481, 100, '', '', 0, 0, 0, 0, 0, NULL);
INSERT INTO dat_configmostrar (idconfigmostrar, idcampo, anchocolumna, sqlselect, renderer, obligatorio, expander, agruparcampo, tooltip, oculto, icono) VALUES (1165, 1483, 100, '', '', 0, 0, 0, 0, 0, NULL);
INSERT INTO dat_configmostrar (idconfigmostrar, idcampo, anchocolumna, sqlselect, renderer, obligatorio, expander, agruparcampo, tooltip, oculto, icono) VALUES (1166, 1484, 100, '', '', 0, 0, 0, 0, 0, NULL);
INSERT INTO dat_configmostrar (idconfigmostrar, idcampo, anchocolumna, sqlselect, renderer, obligatorio, expander, agruparcampo, tooltip, oculto, icono) VALUES (1167, 1485, 100, '', '', 0, 0, 0, 0, 0, NULL);
INSERT INTO dat_configmostrar (idconfigmostrar, idcampo, anchocolumna, sqlselect, renderer, obligatorio, expander, agruparcampo, tooltip, oculto, icono) VALUES (1168, 1486, 100, '', '', 0, 0, 0, 0, 0, NULL);
INSERT INTO dat_configmostrar (idconfigmostrar, idcampo, anchocolumna, sqlselect, renderer, obligatorio, expander, agruparcampo, tooltip, oculto, icono) VALUES (1169, 1487, 100, '', '', 0, 0, 0, 0, 0, NULL);
INSERT INTO dat_configmostrar (idconfigmostrar, idcampo, anchocolumna, sqlselect, renderer, obligatorio, expander, agruparcampo, tooltip, oculto, icono) VALUES (1170, 1488, 100, '', '', 0, 0, 0, 0, 0, NULL);
INSERT INTO dat_configmostrar (idconfigmostrar, idcampo, anchocolumna, sqlselect, renderer, obligatorio, expander, agruparcampo, tooltip, oculto, icono) VALUES (1171, 1489, 100, '', '', 0, 0, 0, 0, 0, NULL);
INSERT INTO dat_configmostrar (idconfigmostrar, idcampo, anchocolumna, sqlselect, renderer, obligatorio, expander, agruparcampo, tooltip, oculto, icono) VALUES (1173, 1493, 100, '', '', 0, 0, 0, 0, 0, NULL);
INSERT INTO dat_configmostrar (idconfigmostrar, idcampo, anchocolumna, sqlselect, renderer, obligatorio, expander, agruparcampo, tooltip, oculto, icono) VALUES (1174, 1494, 100, '', '', 0, 0, 0, 0, 0, NULL);
INSERT INTO dat_configmostrar (idconfigmostrar, idcampo, anchocolumna, sqlselect, renderer, obligatorio, expander, agruparcampo, tooltip, oculto, icono) VALUES (1175, 1496, 100, '', '', 0, 0, 0, 0, 0, NULL);
INSERT INTO dat_configmostrar (idconfigmostrar, idcampo, anchocolumna, sqlselect, renderer, obligatorio, expander, agruparcampo, tooltip, oculto, icono) VALUES (1176, 1497, 100, '', '', 0, 0, 0, 0, 0, NULL);
INSERT INTO dat_configmostrar (idconfigmostrar, idcampo, anchocolumna, sqlselect, renderer, obligatorio, expander, agruparcampo, tooltip, oculto, icono) VALUES (1177, 1498, 100, '', '', 0, 0, 0, 0, 0, NULL);
INSERT INTO dat_configmostrar (idconfigmostrar, idcampo, anchocolumna, sqlselect, renderer, obligatorio, expander, agruparcampo, tooltip, oculto, icono) VALUES (1178, 1499, 100, '', '', 0, 0, 0, 0, 0, NULL);
INSERT INTO dat_configmostrar (idconfigmostrar, idcampo, anchocolumna, sqlselect, renderer, obligatorio, expander, agruparcampo, tooltip, oculto, icono) VALUES (1107, 1414, 100, '', '', 0, 0, 0, 0, 0, NULL);
INSERT INTO dat_configmostrar (idconfigmostrar, idcampo, anchocolumna, sqlselect, renderer, obligatorio, expander, agruparcampo, tooltip, oculto, icono) VALUES (1179, 1500, 100, '', '', 0, 0, 0, 0, 0, NULL);
INSERT INTO dat_configmostrar (idconfigmostrar, idcampo, anchocolumna, sqlselect, renderer, obligatorio, expander, agruparcampo, tooltip, oculto, icono) VALUES (1180, 1501, 100, '', '', 0, 0, 0, 0, 0, NULL);
INSERT INTO dat_configmostrar (idconfigmostrar, idcampo, anchocolumna, sqlselect, renderer, obligatorio, expander, agruparcampo, tooltip, oculto, icono) VALUES (1181, 1502, 100, '', '', 0, 0, 0, 0, 0, NULL);
INSERT INTO dat_configmostrar (idconfigmostrar, idcampo, anchocolumna, sqlselect, renderer, obligatorio, expander, agruparcampo, tooltip, oculto, icono) VALUES (1398, 1761, 100, '', '', 0, 0, 0, 0, 0, NULL);
INSERT INTO dat_configmostrar (idconfigmostrar, idcampo, anchocolumna, sqlselect, renderer, obligatorio, expander, agruparcampo, tooltip, oculto, icono) VALUES (1399, 1762, 100, '', '', 0, 0, 0, 0, 0, NULL);
INSERT INTO dat_configmostrar (idconfigmostrar, idcampo, anchocolumna, sqlselect, renderer, obligatorio, expander, agruparcampo, tooltip, oculto, icono) VALUES (1400, 1763, 100, '', '', 0, 0, 0, 0, 0, NULL);
INSERT INTO dat_configmostrar (idconfigmostrar, idcampo, anchocolumna, sqlselect, renderer, obligatorio, expander, agruparcampo, tooltip, oculto, icono) VALUES (1401, 1764, 100, '', '', 0, 0, 0, 0, 0, NULL);
INSERT INTO dat_configmostrar (idconfigmostrar, idcampo, anchocolumna, sqlselect, renderer, obligatorio, expander, agruparcampo, tooltip, oculto, icono) VALUES (1402, 1765, 100, '', '', 0, 0, 0, 0, 0, NULL);
INSERT INTO dat_configmostrar (idconfigmostrar, idcampo, anchocolumna, sqlselect, renderer, obligatorio, expander, agruparcampo, tooltip, oculto, icono) VALUES (1192, 1513, 100, '', '', 1, 0, 0, 0, 0, NULL);
INSERT INTO dat_configmostrar (idconfigmostrar, idcampo, anchocolumna, sqlselect, renderer, obligatorio, expander, agruparcampo, tooltip, oculto, icono) VALUES (1193, 1514, 100, '', '', 1, 0, 0, 0, 0, NULL);
INSERT INTO dat_configmostrar (idconfigmostrar, idcampo, anchocolumna, sqlselect, renderer, obligatorio, expander, agruparcampo, tooltip, oculto, icono) VALUES (1191, 1512, 600, '', '', 1, 0, 0, 0, 0, NULL);
INSERT INTO dat_configmostrar (idconfigmostrar, idcampo, anchocolumna, sqlselect, renderer, obligatorio, expander, agruparcampo, tooltip, oculto, icono) VALUES (1194, 1515, 100, '', '', 1, 0, 0, 0, 1, NULL);
INSERT INTO dat_configmostrar (idconfigmostrar, idcampo, anchocolumna, sqlselect, renderer, obligatorio, expander, agruparcampo, tooltip, oculto, icono) VALUES (678, 937, 100, '', '', 0, 0, 0, 0, 0, NULL);
INSERT INTO dat_configmostrar (idconfigmostrar, idcampo, anchocolumna, sqlselect, renderer, obligatorio, expander, agruparcampo, tooltip, oculto, icono) VALUES (1403, 1766, 100, '', '', 0, 0, 0, 0, 0, NULL);
INSERT INTO dat_configmostrar (idconfigmostrar, idcampo, anchocolumna, sqlselect, renderer, obligatorio, expander, agruparcampo, tooltip, oculto, icono) VALUES (1112, 1420, 150, '', '', 1, 0, 0, 0, 0, NULL);
INSERT INTO dat_configmostrar (idconfigmostrar, idcampo, anchocolumna, sqlselect, renderer, obligatorio, expander, agruparcampo, tooltip, oculto, icono) VALUES (1111, 1419, 100, '', '', 0, 0, 0, 0, 0, NULL);
INSERT INTO dat_configmostrar (idconfigmostrar, idcampo, anchocolumna, sqlselect, renderer, obligatorio, expander, agruparcampo, tooltip, oculto, icono) VALUES (1152, 1469, 100, '', '', 0, 0, 0, 0, 0, NULL);
INSERT INTO dat_configmostrar (idconfigmostrar, idcampo, anchocolumna, sqlselect, renderer, obligatorio, expander, agruparcampo, tooltip, oculto, icono) VALUES (1153, 1470, 100, '', '', 0, 0, 0, 0, 0, NULL);
INSERT INTO dat_configmostrar (idconfigmostrar, idcampo, anchocolumna, sqlselect, renderer, obligatorio, expander, agruparcampo, tooltip, oculto, icono) VALUES (1161, 1478, 100, '', '', 0, 0, 0, 0, 0, NULL);
INSERT INTO dat_configmostrar (idconfigmostrar, idcampo, anchocolumna, sqlselect, renderer, obligatorio, expander, agruparcampo, tooltip, oculto, icono) VALUES (1162, 1479, 100, '', '', 0, 0, 0, 0, 0, NULL);
INSERT INTO dat_configmostrar (idconfigmostrar, idcampo, anchocolumna, sqlselect, renderer, obligatorio, expander, agruparcampo, tooltip, oculto, icono) VALUES (1362, 1716, 100, '', '', 0, 0, 0, 0, 0, NULL);
INSERT INTO dat_configmostrar (idconfigmostrar, idcampo, anchocolumna, sqlselect, renderer, obligatorio, expander, agruparcampo, tooltip, oculto, icono) VALUES (1361, 1715, 100, '', '', 0, 0, 0, 0, 0, NULL);
INSERT INTO dat_configmostrar (idconfigmostrar, idcampo, anchocolumna, sqlselect, renderer, obligatorio, expander, agruparcampo, tooltip, oculto, icono) VALUES (1360, 1714, 100, '', '', 0, 0, 0, 0, 0, NULL);
INSERT INTO dat_configmostrar (idconfigmostrar, idcampo, anchocolumna, sqlselect, renderer, obligatorio, expander, agruparcampo, tooltip, oculto, icono) VALUES (1363, 1717, 100, '', '', 0, 0, 0, 0, 0, NULL);
INSERT INTO dat_configmostrar (idconfigmostrar, idcampo, anchocolumna, sqlselect, renderer, obligatorio, expander, agruparcampo, tooltip, oculto, icono) VALUES (1364, 1718, 150, '', '', 0, 0, 0, 0, 0, NULL);
INSERT INTO dat_configmostrar (idconfigmostrar, idcampo, anchocolumna, sqlselect, renderer, obligatorio, expander, agruparcampo, tooltip, oculto, icono) VALUES (1376, 1735, 100, '', '', 0, 0, 0, 0, 0, NULL);
INSERT INTO dat_configmostrar (idconfigmostrar, idcampo, anchocolumna, sqlselect, renderer, obligatorio, expander, agruparcampo, tooltip, oculto, icono) VALUES (1258, 1594, 100, '', '', 1, 0, 0, 0, 1, NULL);
INSERT INTO dat_configmostrar (idconfigmostrar, idcampo, anchocolumna, sqlselect, renderer, obligatorio, expander, agruparcampo, tooltip, oculto, icono) VALUES (1296, 1642, 100, '', '', 1, 0, 0, 0, 0, NULL);
INSERT INTO dat_configmostrar (idconfigmostrar, idcampo, anchocolumna, sqlselect, renderer, obligatorio, expander, agruparcampo, tooltip, oculto, icono) VALUES (1328, 1674, 100, '', '', 1, 0, 0, 0, 0, NULL);
INSERT INTO dat_configmostrar (idconfigmostrar, idcampo, anchocolumna, sqlselect, renderer, obligatorio, expander, agruparcampo, tooltip, oculto, icono) VALUES (1294, 1640, 100, '', '', 1, 0, 0, 0, 0, NULL);
INSERT INTO dat_configmostrar (idconfigmostrar, idcampo, anchocolumna, sqlselect, renderer, obligatorio, expander, agruparcampo, tooltip, oculto, icono) VALUES (1295, 1641, 100, '', '', 1, 0, 0, 0, 0, NULL);
INSERT INTO dat_configmostrar (idconfigmostrar, idcampo, anchocolumna, sqlselect, renderer, obligatorio, expander, agruparcampo, tooltip, oculto, icono) VALUES (1358, 1712, 150, '', '', 0, 0, 0, 0, 0, NULL);
INSERT INTO dat_configmostrar (idconfigmostrar, idcampo, anchocolumna, sqlselect, renderer, obligatorio, expander, agruparcampo, tooltip, oculto, icono) VALUES (1375, 1734, 100, '', '', 0, 0, 0, 0, 0, NULL);
INSERT INTO dat_configmostrar (idconfigmostrar, idcampo, anchocolumna, sqlselect, renderer, obligatorio, expander, agruparcampo, tooltip, oculto, icono) VALUES (1380, 1739, 80, '', '', 0, 0, 0, 0, 0, NULL);
INSERT INTO dat_configmostrar (idconfigmostrar, idcampo, anchocolumna, sqlselect, renderer, obligatorio, expander, agruparcampo, tooltip, oculto, icono) VALUES (1382, 1741, 100, '', '', 0, 0, 0, 0, 0, NULL);
INSERT INTO dat_configmostrar (idconfigmostrar, idcampo, anchocolumna, sqlselect, renderer, obligatorio, expander, agruparcampo, tooltip, oculto, icono) VALUES (1384, 1743, 100, '', '', 0, 0, 0, 0, 0, NULL);
INSERT INTO dat_configmostrar (idconfigmostrar, idcampo, anchocolumna, sqlselect, renderer, obligatorio, expander, agruparcampo, tooltip, oculto, icono) VALUES (1329, 1675, 100, '', '', 0, 0, 0, 0, 0, NULL);
INSERT INTO dat_configmostrar (idconfigmostrar, idcampo, anchocolumna, sqlselect, renderer, obligatorio, expander, agruparcampo, tooltip, oculto, icono) VALUES (1255, 1591, 50, '', 'showSexo', 1, 0, 0, 0, 0, NULL);
INSERT INTO dat_configmostrar (idconfigmostrar, idcampo, anchocolumna, sqlselect, renderer, obligatorio, expander, agruparcampo, tooltip, oculto, icono) VALUES (1386, 1746, 100, '', '', 0, 0, 0, 0, 0, NULL);
INSERT INTO dat_configmostrar (idconfigmostrar, idcampo, anchocolumna, sqlselect, renderer, obligatorio, expander, agruparcampo, tooltip, oculto, icono) VALUES (1257, 1593, 100, '', '', 1, 0, 0, 0, 0, NULL);
INSERT INTO dat_configmostrar (idconfigmostrar, idcampo, anchocolumna, sqlselect, renderer, obligatorio, expander, agruparcampo, tooltip, oculto, icono) VALUES (1251, 1587, 100, '', '', 1, 0, 0, 0, 1, NULL);
INSERT INTO dat_configmostrar (idconfigmostrar, idcampo, anchocolumna, sqlselect, renderer, obligatorio, expander, agruparcampo, tooltip, oculto, icono) VALUES (1392, 1754, 150, '', '', 0, 0, 0, 0, 0, NULL);
INSERT INTO dat_configmostrar (idconfigmostrar, idcampo, anchocolumna, sqlselect, renderer, obligatorio, expander, agruparcampo, tooltip, oculto, icono) VALUES (1172, 1491, 100, '', '', 0, 0, 0, 0, 0, NULL);
INSERT INTO dat_configmostrar (idconfigmostrar, idcampo, anchocolumna, sqlselect, renderer, obligatorio, expander, agruparcampo, tooltip, oculto, icono) VALUES (1288, 1632, 250, '', '', 0, 0, 0, 0, 0, NULL);
INSERT INTO dat_configmostrar (idconfigmostrar, idcampo, anchocolumna, sqlselect, renderer, obligatorio, expander, agruparcampo, tooltip, oculto, icono) VALUES (1273, 1613, 150, '', '', 0, 0, 0, 0, 0, NULL);
INSERT INTO dat_configmostrar (idconfigmostrar, idcampo, anchocolumna, sqlselect, renderer, obligatorio, expander, agruparcampo, tooltip, oculto, icono) VALUES (1254, 1590, 100, '', '', 1, 0, 0, 0, 0, NULL);
INSERT INTO dat_configmostrar (idconfigmostrar, idcampo, anchocolumna, sqlselect, renderer, obligatorio, expander, agruparcampo, tooltip, oculto, icono) VALUES (1271, 1611, 150, '', '', 0, 0, 0, 0, 0, NULL);
INSERT INTO dat_configmostrar (idconfigmostrar, idcampo, anchocolumna, sqlselect, renderer, obligatorio, expander, agruparcampo, tooltip, oculto, icono) VALUES (1276, 1616, 60, '', 'showSexo', 1, 0, 0, 0, 0, NULL);
INSERT INTO dat_configmostrar (idconfigmostrar, idcampo, anchocolumna, sqlselect, renderer, obligatorio, expander, agruparcampo, tooltip, oculto, icono) VALUES (1284, 1627, 150, '', '', 0, 0, 0, 0, 0, NULL);
INSERT INTO dat_configmostrar (idconfigmostrar, idcampo, anchocolumna, sqlselect, renderer, obligatorio, expander, agruparcampo, tooltip, oculto, icono) VALUES (1270, 1610, 100, '', '', 0, 0, 0, 0, 0, NULL);
INSERT INTO dat_configmostrar (idconfigmostrar, idcampo, anchocolumna, sqlselect, renderer, obligatorio, expander, agruparcampo, tooltip, oculto, icono) VALUES (1274, 1614, 150, '', '', 0, 0, 0, 0, 0, NULL);
INSERT INTO dat_configmostrar (idconfigmostrar, idcampo, anchocolumna, sqlselect, renderer, obligatorio, expander, agruparcampo, tooltip, oculto, icono) VALUES (1291, 1635, 250, '', '', 0, 0, 0, 0, 0, NULL);
INSERT INTO dat_configmostrar (idconfigmostrar, idcampo, anchocolumna, sqlselect, renderer, obligatorio, expander, agruparcampo, tooltip, oculto, icono) VALUES (1290, 1634, 250, '', '', 0, 0, 0, 0, 0, NULL);
INSERT INTO dat_configmostrar (idconfigmostrar, idcampo, anchocolumna, sqlselect, renderer, obligatorio, expander, agruparcampo, tooltip, oculto, icono) VALUES (1286, 1629, 100, '', '', 0, 0, 0, 0, 0, NULL);
INSERT INTO dat_configmostrar (idconfigmostrar, idcampo, anchocolumna, sqlselect, renderer, obligatorio, expander, agruparcampo, tooltip, oculto, icono) VALUES (1287, 1630, 100, '', '', 0, 0, 0, 0, 0, NULL);
INSERT INTO dat_configmostrar (idconfigmostrar, idcampo, anchocolumna, sqlselect, renderer, obligatorio, expander, agruparcampo, tooltip, oculto, icono) VALUES (1282, 1625, 150, '', '', 0, 0, 0, 0, 0, NULL);
INSERT INTO dat_configmostrar (idconfigmostrar, idcampo, anchocolumna, sqlselect, renderer, obligatorio, expander, agruparcampo, tooltip, oculto, icono) VALUES (1281, 1624, 150, '', '', 0, 0, 0, 0, 0, NULL);
INSERT INTO dat_configmostrar (idconfigmostrar, idcampo, anchocolumna, sqlselect, renderer, obligatorio, expander, agruparcampo, tooltip, oculto, icono) VALUES (1277, 1617, 100, '', '', 1, 0, 0, 0, 0, NULL);
INSERT INTO dat_configmostrar (idconfigmostrar, idcampo, anchocolumna, sqlselect, renderer, obligatorio, expander, agruparcampo, tooltip, oculto, icono) VALUES (1272, 1612, 200, 'CASE WHEN {campo} is not null THEN ab0.nombre || '' '' || {campo} || '' '' || ab0.papel || '' '' || ab0.sapel ELSE ab0.nombre || '' '' || ab0.papel || '' '' ||  ab0.sapel END', '', 1, 0, 0, 0, 0, NULL);
INSERT INTO dat_configmostrar (idconfigmostrar, idcampo, anchocolumna, sqlselect, renderer, obligatorio, expander, agruparcampo, tooltip, oculto, icono) VALUES (1283, 1626, 180, '', '', 0, 0, 0, 0, 0, NULL);
INSERT INTO dat_configmostrar (idconfigmostrar, idcampo, anchocolumna, sqlselect, renderer, obligatorio, expander, agruparcampo, tooltip, oculto, icono) VALUES (1285, 1628, 100, '', '', 0, 0, 0, 0, 0, NULL);
INSERT INTO dat_configmostrar (idconfigmostrar, idcampo, anchocolumna, sqlselect, renderer, obligatorio, expander, agruparcampo, tooltip, oculto, icono) VALUES (1299, 1645, 100, '', '', 0, 0, 0, 0, 0, NULL);
INSERT INTO dat_configmostrar (idconfigmostrar, idcampo, anchocolumna, sqlselect, renderer, obligatorio, expander, agruparcampo, tooltip, oculto, icono) VALUES (1292, 1637, 10, '', '', 1, 0, 0, 0, 1, NULL);
INSERT INTO dat_configmostrar (idconfigmostrar, idcampo, anchocolumna, sqlselect, renderer, obligatorio, expander, agruparcampo, tooltip, oculto, icono) VALUES (1304, 1650, 150, '', '', 0, 0, 0, 0, 0, NULL);
INSERT INTO dat_configmostrar (idconfigmostrar, idcampo, anchocolumna, sqlselect, renderer, obligatorio, expander, agruparcampo, tooltip, oculto, icono) VALUES (1302, 1648, 100, 'encode({campo},''escape'')', '', 1, 0, 0, 0, 1, NULL);
INSERT INTO dat_configmostrar (idconfigmostrar, idcampo, anchocolumna, sqlselect, renderer, obligatorio, expander, agruparcampo, tooltip, oculto, icono) VALUES (1305, 1651, 100, '', '', 1, 0, 0, 0, 1, NULL);
INSERT INTO dat_configmostrar (idconfigmostrar, idcampo, anchocolumna, sqlselect, renderer, obligatorio, expander, agruparcampo, tooltip, oculto, icono) VALUES (1306, 1652, 100, '', '', 1, 0, 0, 0, 1, NULL);
INSERT INTO dat_configmostrar (idconfigmostrar, idcampo, anchocolumna, sqlselect, renderer, obligatorio, expander, agruparcampo, tooltip, oculto, icono) VALUES (1307, 1653, 100, '', '', 1, 0, 0, 0, 1, NULL);
INSERT INTO dat_configmostrar (idconfigmostrar, idcampo, anchocolumna, sqlselect, renderer, obligatorio, expander, agruparcampo, tooltip, oculto, icono) VALUES (1308, 1654, 100, '', '', 1, 0, 0, 0, 1, NULL);
INSERT INTO dat_configmostrar (idconfigmostrar, idcampo, anchocolumna, sqlselect, renderer, obligatorio, expander, agruparcampo, tooltip, oculto, icono) VALUES (1309, 1655, 100, '', '', 1, 0, 0, 0, 1, NULL);
INSERT INTO dat_configmostrar (idconfigmostrar, idcampo, anchocolumna, sqlselect, renderer, obligatorio, expander, agruparcampo, tooltip, oculto, icono) VALUES (1311, 1657, 100, '', '', 1, 0, 0, 0, 1, NULL);
INSERT INTO dat_configmostrar (idconfigmostrar, idcampo, anchocolumna, sqlselect, renderer, obligatorio, expander, agruparcampo, tooltip, oculto, icono) VALUES (1312, 1658, 100, '', '', 1, 0, 0, 0, 1, NULL);
INSERT INTO dat_configmostrar (idconfigmostrar, idcampo, anchocolumna, sqlselect, renderer, obligatorio, expander, agruparcampo, tooltip, oculto, icono) VALUES (1313, 1659, 255, '', '', 0, 0, 0, 0, 0, NULL);
INSERT INTO dat_configmostrar (idconfigmostrar, idcampo, anchocolumna, sqlselect, renderer, obligatorio, expander, agruparcampo, tooltip, oculto, icono) VALUES (1314, 1660, 100, '', '', 0, 0, 0, 0, 0, NULL);
INSERT INTO dat_configmostrar (idconfigmostrar, idcampo, anchocolumna, sqlselect, renderer, obligatorio, expander, agruparcampo, tooltip, oculto, icono) VALUES (1310, 1656, 100, '', '', 1, 0, 0, 0, 1, NULL);
INSERT INTO dat_configmostrar (idconfigmostrar, idcampo, anchocolumna, sqlselect, renderer, obligatorio, expander, agruparcampo, tooltip, oculto, icono) VALUES (1332, 1678, 100, '', '', 0, 0, 0, 0, 0, NULL);
INSERT INTO dat_configmostrar (idconfigmostrar, idcampo, anchocolumna, sqlselect, renderer, obligatorio, expander, agruparcampo, tooltip, oculto, icono) VALUES (1301, 1647, 200, 'CASE WHEN {campo} is not null THEN ab0.nombre || '' '' || {campo} || '' '' || ab0.papel || '' '' || ab0.sapel ELSE ab0.nombre || '' '' || ab0.papel || '' '' ||  ab0.sapel END', '', 1, 0, 0, 0, 1, NULL);
INSERT INTO dat_configmostrar (idconfigmostrar, idcampo, anchocolumna, sqlselect, renderer, obligatorio, expander, agruparcampo, tooltip, oculto, icono) VALUES (1336, 1683, 100, '', '', 1, 0, 0, 0, 1, NULL);
INSERT INTO dat_configmostrar (idconfigmostrar, idcampo, anchocolumna, sqlselect, renderer, obligatorio, expander, agruparcampo, tooltip, oculto, icono) VALUES (1333, 1680, 100, '', '', 1, 0, 0, 0, 0, NULL);
INSERT INTO dat_configmostrar (idconfigmostrar, idcampo, anchocolumna, sqlselect, renderer, obligatorio, expander, agruparcampo, tooltip, oculto, icono) VALUES (1335, 1682, 100, '', '', 1, 0, 0, 0, 1, NULL);
INSERT INTO dat_configmostrar (idconfigmostrar, idcampo, anchocolumna, sqlselect, renderer, obligatorio, expander, agruparcampo, tooltip, oculto, icono) VALUES (1340, 1688, 200, '', '', 1, 0, 0, 0, 0, NULL);
INSERT INTO dat_configmostrar (idconfigmostrar, idcampo, anchocolumna, sqlselect, renderer, obligatorio, expander, agruparcampo, tooltip, oculto, icono) VALUES (1338, 1685, 100, '', '', 1, 0, 0, 0, 1, NULL);
INSERT INTO dat_configmostrar (idconfigmostrar, idcampo, anchocolumna, sqlselect, renderer, obligatorio, expander, agruparcampo, tooltip, oculto, icono) VALUES (1353, 1707, 150, '', '', 0, 0, 0, 0, 0, NULL);
INSERT INTO dat_configmostrar (idconfigmostrar, idcampo, anchocolumna, sqlselect, renderer, obligatorio, expander, agruparcampo, tooltip, oculto, icono) VALUES (1343, 1692, 100, '', '', 0, 0, 0, 0, 0, NULL);
INSERT INTO dat_configmostrar (idconfigmostrar, idcampo, anchocolumna, sqlselect, renderer, obligatorio, expander, agruparcampo, tooltip, oculto, icono) VALUES (1352, 1706, 150, '', '', 0, 0, 0, 0, 0, NULL);
INSERT INTO dat_configmostrar (idconfigmostrar, idcampo, anchocolumna, sqlselect, renderer, obligatorio, expander, agruparcampo, tooltip, oculto, icono) VALUES (1342, 1691, 100, '', '', 0, 0, 0, 0, 0, NULL);
INSERT INTO dat_configmostrar (idconfigmostrar, idcampo, anchocolumna, sqlselect, renderer, obligatorio, expander, agruparcampo, tooltip, oculto, icono) VALUES (1337, 1684, 100, '', '', 1, 0, 0, 0, 1, NULL);
INSERT INTO dat_configmostrar (idconfigmostrar, idcampo, anchocolumna, sqlselect, renderer, obligatorio, expander, agruparcampo, tooltip, oculto, icono) VALUES (1339, 1686, 100, '', '', 1, 0, 0, 0, 1, NULL);
INSERT INTO dat_configmostrar (idconfigmostrar, idcampo, anchocolumna, sqlselect, renderer, obligatorio, expander, agruparcampo, tooltip, oculto, icono) VALUES (1344, 1693, 100, '', '', 0, 0, 0, 0, 0, NULL);
INSERT INTO dat_configmostrar (idconfigmostrar, idcampo, anchocolumna, sqlselect, renderer, obligatorio, expander, agruparcampo, tooltip, oculto, icono) VALUES (1334, 1681, 200, 'CASE WHEN {campo} is not null THEN ab1.papel || '' '' || ab1.sapel || '', '' || ab1.nombre || '' '' || {campo} ELSE ab1.papel || '' '' ||  ab1.sapel || '', '' || ab1.nombre END', '', 1, 0, 0, 0, 0, NULL);
INSERT INTO dat_configmostrar (idconfigmostrar, idcampo, anchocolumna, sqlselect, renderer, obligatorio, expander, agruparcampo, tooltip, oculto, icono) VALUES (1345, 1695, 100, '', '', 0, 0, 0, 0, 0, NULL);
INSERT INTO dat_configmostrar (idconfigmostrar, idcampo, anchocolumna, sqlselect, renderer, obligatorio, expander, agruparcampo, tooltip, oculto, icono) VALUES (1346, 1696, 100, '', '', 0, 0, 0, 0, 0, NULL);
INSERT INTO dat_configmostrar (idconfigmostrar, idcampo, anchocolumna, sqlselect, renderer, obligatorio, expander, agruparcampo, tooltip, oculto, icono) VALUES (1347, 1697, 100, '', '', 0, 0, 0, 0, 0, NULL);
INSERT INTO dat_configmostrar (idconfigmostrar, idcampo, anchocolumna, sqlselect, renderer, obligatorio, expander, agruparcampo, tooltip, oculto, icono) VALUES (1354, 1708, 100, '', '', 0, 0, 0, 0, 0, NULL);
INSERT INTO dat_configmostrar (idconfigmostrar, idcampo, anchocolumna, sqlselect, renderer, obligatorio, expander, agruparcampo, tooltip, oculto, icono) VALUES (1348, 1698, 100, '', '', 0, 0, 0, 0, 0, NULL);
INSERT INTO dat_configmostrar (idconfigmostrar, idcampo, anchocolumna, sqlselect, renderer, obligatorio, expander, agruparcampo, tooltip, oculto, icono) VALUES (1341, 1690, 150, '', '', 0, 0, 0, 0, 0, NULL);
INSERT INTO dat_configmostrar (idconfigmostrar, idcampo, anchocolumna, sqlselect, renderer, obligatorio, expander, agruparcampo, tooltip, oculto, icono) VALUES (1349, 1699, 100, '', '', 0, 0, 0, 0, 0, NULL);
INSERT INTO dat_configmostrar (idconfigmostrar, idcampo, anchocolumna, sqlselect, renderer, obligatorio, expander, agruparcampo, tooltip, oculto, icono) VALUES (1350, 1700, 100, '', '', 0, 0, 0, 0, 0, NULL);
INSERT INTO dat_configmostrar (idconfigmostrar, idcampo, anchocolumna, sqlselect, renderer, obligatorio, expander, agruparcampo, tooltip, oculto, icono) VALUES (1351, 1701, 100, '', '', 0, 0, 0, 0, 0, NULL);
INSERT INTO dat_configmostrar (idconfigmostrar, idcampo, anchocolumna, sqlselect, renderer, obligatorio, expander, agruparcampo, tooltip, oculto, icono) VALUES (1355, 1709, 150, '', '', 0, 0, 0, 0, 0, NULL);
INSERT INTO dat_configmostrar (idconfigmostrar, idcampo, anchocolumna, sqlselect, renderer, obligatorio, expander, agruparcampo, tooltip, oculto, icono) VALUES (1356, 1710, 150, '', '', 0, 0, 0, 0, 0, NULL);
INSERT INTO dat_configmostrar (idconfigmostrar, idcampo, anchocolumna, sqlselect, renderer, obligatorio, expander, agruparcampo, tooltip, oculto, icono) VALUES (1388, 1749, 100, '', '', 0, 0, 0, 0, 0, NULL);
INSERT INTO dat_configmostrar (idconfigmostrar, idcampo, anchocolumna, sqlselect, renderer, obligatorio, expander, agruparcampo, tooltip, oculto, icono) VALUES (1394, 1756, 100, '', '', 0, 0, 0, 0, 0, NULL);
INSERT INTO dat_configmostrar (idconfigmostrar, idcampo, anchocolumna, sqlselect, renderer, obligatorio, expander, agruparcampo, tooltip, oculto, icono) VALUES (1357, 1711, 100, '', '', 0, 0, 0, 0, 0, NULL);
INSERT INTO dat_configmostrar (idconfigmostrar, idcampo, anchocolumna, sqlselect, renderer, obligatorio, expander, agruparcampo, tooltip, oculto, icono) VALUES (1368, 1724, 100, '', '', 0, 0, 0, 0, 0, NULL);
INSERT INTO dat_configmostrar (idconfigmostrar, idcampo, anchocolumna, sqlselect, renderer, obligatorio, expander, agruparcampo, tooltip, oculto, icono) VALUES (1369, 1725, 100, '', '', 0, 0, 0, 0, 0, NULL);
INSERT INTO dat_configmostrar (idconfigmostrar, idcampo, anchocolumna, sqlselect, renderer, obligatorio, expander, agruparcampo, tooltip, oculto, icono) VALUES (1370, 1726, 100, '', '', 0, 0, 0, 0, 0, NULL);
INSERT INTO dat_configmostrar (idconfigmostrar, idcampo, anchocolumna, sqlselect, renderer, obligatorio, expander, agruparcampo, tooltip, oculto, icono) VALUES (1371, 1727, 100, '', '', 0, 0, 0, 0, 0, NULL);
INSERT INTO dat_configmostrar (idconfigmostrar, idcampo, anchocolumna, sqlselect, renderer, obligatorio, expander, agruparcampo, tooltip, oculto, icono) VALUES (1372, 1728, 100, '', '', 0, 0, 0, 0, 0, NULL);
INSERT INTO dat_configmostrar (idconfigmostrar, idcampo, anchocolumna, sqlselect, renderer, obligatorio, expander, agruparcampo, tooltip, oculto, icono) VALUES (1373, 1732, 100, '', '', 0, 0, 0, 0, 0, NULL);
INSERT INTO dat_configmostrar (idconfigmostrar, idcampo, anchocolumna, sqlselect, renderer, obligatorio, expander, agruparcampo, tooltip, oculto, icono) VALUES (1374, 1733, 100, '', '', 0, 0, 0, 0, 0, NULL);
INSERT INTO dat_configmostrar (idconfigmostrar, idcampo, anchocolumna, sqlselect, renderer, obligatorio, expander, agruparcampo, tooltip, oculto, icono) VALUES (1377, 1736, 100, '', '', 0, 0, 0, 0, 0, NULL);
INSERT INTO dat_configmostrar (idconfigmostrar, idcampo, anchocolumna, sqlselect, renderer, obligatorio, expander, agruparcampo, tooltip, oculto, icono) VALUES (1378, 1737, 100, '', '', 0, 0, 0, 0, 0, NULL);
INSERT INTO dat_configmostrar (idconfigmostrar, idcampo, anchocolumna, sqlselect, renderer, obligatorio, expander, agruparcampo, tooltip, oculto, icono) VALUES (1404, 1768, 100, '', '', 0, 0, 0, 0, 0, NULL);
INSERT INTO dat_configmostrar (idconfigmostrar, idcampo, anchocolumna, sqlselect, renderer, obligatorio, expander, agruparcampo, tooltip, oculto, icono) VALUES (1405, 1769, 100, 'date_part(''year'',age({campo})) || '' años''', '', 1, 0, 0, 0, 1, NULL);
INSERT INTO dat_configmostrar (idconfigmostrar, idcampo, anchocolumna, sqlselect, renderer, obligatorio, expander, agruparcampo, tooltip, oculto, icono) VALUES (1408, 1773, 100, '', '', 1, 0, 0, 0, 0, NULL);
INSERT INTO dat_configmostrar (idconfigmostrar, idcampo, anchocolumna, sqlselect, renderer, obligatorio, expander, agruparcampo, tooltip, oculto, icono) VALUES (1414, 1779, 100, '', '', 0, 0, 0, 0, 0, NULL);
INSERT INTO dat_configmostrar (idconfigmostrar, idcampo, anchocolumna, sqlselect, renderer, obligatorio, expander, agruparcampo, tooltip, oculto, icono) VALUES (1415, 1780, 100, '', '', 0, 0, 0, 0, 0, NULL);
INSERT INTO dat_configmostrar (idconfigmostrar, idcampo, anchocolumna, sqlselect, renderer, obligatorio, expander, agruparcampo, tooltip, oculto, icono) VALUES (1298, 1644, 100, '', '', 1, 0, 0, 0, 1, NULL);
INSERT INTO dat_configmostrar (idconfigmostrar, idcampo, anchocolumna, sqlselect, renderer, obligatorio, expander, agruparcampo, tooltip, oculto, icono) VALUES (1412, 1777, 100, 'CASE WHEN  {campo} = 0 THEN ''No'' ELSE ''Sí'' END', '', 0, 0, 0, 0, 0, NULL);
INSERT INTO dat_configmostrar (idconfigmostrar, idcampo, anchocolumna, sqlselect, renderer, obligatorio, expander, agruparcampo, tooltip, oculto, icono) VALUES (1417, 1782, 350, '', '', 0, 0, 0, 0, 0, NULL);
INSERT INTO dat_configmostrar (idconfigmostrar, idcampo, anchocolumna, sqlselect, renderer, obligatorio, expander, agruparcampo, tooltip, oculto, icono) VALUES (1410, 1775, 100, '', '', 0, 0, 0, 0, 0, NULL);
INSERT INTO dat_configmostrar (idconfigmostrar, idcampo, anchocolumna, sqlselect, renderer, obligatorio, expander, agruparcampo, tooltip, oculto, icono) VALUES (1411, 1776, 350, 'SELECT   de.denominacion FROM    mod_estructuracomp.nom_filaestruc nfe INNER JOIN     mod_estructuracomp.dat_estructura de ON(nfe.idfila = de.idestructura and de.idproyecto=0) WHERE nfe.parent_path @> (SELECT  f.parent_path FROM  mod_estructuracomp.nom_filaestruc f WHERE f.idfila={campo} ) and nfe.idconcepto=3 LIMIT 1', '', 0, 0, 0, 0, 0, NULL);
INSERT INTO dat_configmostrar (idconfigmostrar, idcampo, anchocolumna, sqlselect, renderer, obligatorio, expander, agruparcampo, tooltip, oculto, icono) VALUES (1413, 1778, 300, '', '', 0, 0, 0, 0, 0, NULL);
INSERT INTO dat_configmostrar (idconfigmostrar, idcampo, anchocolumna, sqlselect, renderer, obligatorio, expander, agruparcampo, tooltip, oculto, icono) VALUES (1424, 1790, 120, '', '', 0, 0, 0, 0, 0, NULL);
INSERT INTO dat_configmostrar (idconfigmostrar, idcampo, anchocolumna, sqlselect, renderer, obligatorio, expander, agruparcampo, tooltip, oculto, icono) VALUES (1407, 1772, 100, '', '', 1, 0, 0, 0, 0, NULL);
INSERT INTO dat_configmostrar (idconfigmostrar, idcampo, anchocolumna, sqlselect, renderer, obligatorio, expander, agruparcampo, tooltip, oculto, icono) VALUES (1406, 1771, 300, '', '', 1, 0, 0, 0, 0, NULL);
INSERT INTO dat_configmostrar (idconfigmostrar, idcampo, anchocolumna, sqlselect, renderer, obligatorio, expander, agruparcampo, tooltip, oculto, icono) VALUES (1425, 1791, 120, '', '', 0, 0, 0, 0, 0, NULL);
INSERT INTO dat_configmostrar (idconfigmostrar, idcampo, anchocolumna, sqlselect, renderer, obligatorio, expander, agruparcampo, tooltip, oculto, icono) VALUES (1426, 1792, 200, '', '', 0, 0, 0, 0, 0, NULL);
INSERT INTO dat_configmostrar (idconfigmostrar, idcampo, anchocolumna, sqlselect, renderer, obligatorio, expander, agruparcampo, tooltip, oculto, icono) VALUES (1427, 1793, 100, '', '', 0, 0, 0, 0, 0, NULL);
INSERT INTO dat_configmostrar (idconfigmostrar, idcampo, anchocolumna, sqlselect, renderer, obligatorio, expander, agruparcampo, tooltip, oculto, icono) VALUES (1428, 1794, 100, '', '', 0, 0, 0, 0, 0, NULL);
INSERT INTO dat_configmostrar (idconfigmostrar, idcampo, anchocolumna, sqlselect, renderer, obligatorio, expander, agruparcampo, tooltip, oculto, icono) VALUES (1429, 1795, 150, '', '', 1, 0, 0, 0, 0, NULL);
INSERT INTO dat_configmostrar (idconfigmostrar, idcampo, anchocolumna, sqlselect, renderer, obligatorio, expander, agruparcampo, tooltip, oculto, icono) VALUES (1419, 1784, 200, 'SELECT  CASE WHEN de.denominacion is null THEN deop.denominacion ELSE de.denominacion END as denominacion FROM    mod_estructuracomp.nom_filaestruc nfe  LEFT JOIN  mod_estructuracomp.dat_estructura de ON(nfe.idfila = de.idestructura and de.idproyecto=0) LEFT JOIN  mod_estructuracomp.dat_estructuraop deop ON(nfe.idfila = deop.idestructuraop and deop.idproyecto=0) WHERE nfe.idfila = (SELECT  f.idpadre FROM  mod_estructuracomp.nom_filaestruc f WHERE f.idfila={campo} ) ', '', 1, 0, 0, 0, 0, NULL);
INSERT INTO dat_configmostrar (idconfigmostrar, idcampo, anchocolumna, sqlselect, renderer, obligatorio, expander, agruparcampo, tooltip, oculto, icono) VALUES (1432, 1798, 300, '', '', 0, 0, 0, 0, 0, NULL);
INSERT INTO dat_configmostrar (idconfigmostrar, idcampo, anchocolumna, sqlselect, renderer, obligatorio, expander, agruparcampo, tooltip, oculto, icono) VALUES (1260, 1596, 500, 'CASE WHEN {campo} is not null THEN ab0.nombre || '' '' || {campo} || '' '' || ab0.papel || '' '' || ab0.sapel ELSE ab0.nombre || '' '' || ab0.papel || '' '' ||  ab0.sapel END', '', 1, 0, 0, 0, 1, NULL);
INSERT INTO dat_configmostrar (idconfigmostrar, idcampo, anchocolumna, sqlselect, renderer, obligatorio, expander, agruparcampo, tooltip, oculto, icono) VALUES (1259, 1595, 100, '', '', 1, 0, 0, 0, 0, NULL);
INSERT INTO dat_configmostrar (idconfigmostrar, idcampo, anchocolumna, sqlselect, renderer, obligatorio, expander, agruparcampo, tooltip, oculto, icono) VALUES (1253, 1589, 100, '', '', 1, 0, 0, 0, 0, NULL);
INSERT INTO dat_configmostrar (idconfigmostrar, idcampo, anchocolumna, sqlselect, renderer, obligatorio, expander, agruparcampo, tooltip, oculto, icono) VALUES (1252, 1588, 100, '', '', 1, 0, 0, 0, 0, NULL);
INSERT INTO dat_configmostrar (idconfigmostrar, idcampo, anchocolumna, sqlselect, renderer, obligatorio, expander, agruparcampo, tooltip, oculto, icono) VALUES (1256, 1592, 100, '', '', 1, 0, 0, 0, 0, NULL);
INSERT INTO dat_configmostrar (idconfigmostrar, idcampo, anchocolumna, sqlselect, renderer, obligatorio, expander, agruparcampo, tooltip, oculto, icono) VALUES (1297, 1643, 100, '', 'showSexo', 1, 0, 0, 0, 0, NULL);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (959, 937, 'mod_persona', 'dat_persona', NULL, NULL, 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2490, 1753, 'mod_persona', 'dat_persona', NULL, NULL, 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2452, 1739, 'mod_persona', 'dat_situacionlaboral', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2457, 1741, 'mod_persona', 'dat_persona', NULL, NULL, 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2462, 1743, 'mod_persona', 'dat_persona', NULL, NULL, 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2467, 1743, 'mod_persona', 'dat_personaentidad', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2496, 1753, 'mod_persona', 'dat_direccion', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2477, 1746, 'mod_personaext', 'dat_niveleducacional', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2482, 1750, 'mod_persona', 'dat_persona', NULL, NULL, 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2487, 1750, 'mod_personaext', 'nom_norma', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2502, 1757, 'mod_persona', 'dat_direccion', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2508, 1764, 'mod_persona', 'dat_persona', NULL, NULL, 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (1822, 1402, 'mod_persona', 'dat_persona', NULL, NULL, 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (1823, 1403, 'mod_persona', 'dat_persona', NULL, NULL, 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (1824, 1404, 'mod_persona', 'dat_persona', NULL, NULL, 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (1825, 1405, 'mod_persona', 'dat_persona', NULL, NULL, 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (1826, 1406, 'mod_persona', 'dat_persona', NULL, NULL, 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (1827, 1407, 'mod_persona', 'dat_persona', NULL, NULL, 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (1828, 1408, 'mod_persona', 'dat_persona', NULL, NULL, 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (1829, 1402, 'mod_persona', 'dat_fenotipo', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (1830, 1402, 'mod_persona', 'nom_gruposanguineo', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (1831, 1403, 'mod_persona', 'dat_fenotipo', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (1832, 1403, 'mod_persona', 'nom_colorojos', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (1833, 1404, 'mod_persona', 'dat_fenotipo', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (1834, 1404, 'mod_persona', 'nom_colorpelo', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (1835, 1405, 'mod_persona', 'dat_fenotipo', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (1836, 1405, 'mod_persona', 'nom_colorpiel', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (1837, 1410, 'mod_persona', 'dat_persona', NULL, NULL, 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (1838, 1411, 'mod_persona', 'dat_persona', NULL, NULL, 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (1839, 1412, 'mod_persona', 'dat_persona', NULL, NULL, 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (1840, 1410, 'mod_persona', 'dat_ciudadania', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (1841, 1410, 'mod_persona', 'nom_ciudadania', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (1842, 1411, 'mod_persona', 'dat_ciudadania', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (1843, 1412, 'mod_persona', 'dat_ciudadania', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (1844, 1414, 'mod_persona', 'dat_persona', NULL, NULL, 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (1845, 1415, 'mod_persona', 'dat_persona', NULL, NULL, 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (1846, 1416, 'mod_persona', 'dat_persona', NULL, NULL, 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (1847, 1417, 'mod_persona', 'dat_persona', NULL, NULL, 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (1848, 1416, 'mod_persona', 'dat_contacto', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (1850, 1417, 'mod_persona', 'dat_contacto', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (1851, 1417, 'mod_persona', 'nom_tipocontacto', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (1852, 1416, 'mod_persona', 'nom_tipomediocontacto', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (1853, 1419, 'mod_persona', 'dat_persona', NULL, NULL, 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (1854, 1420, 'mod_persona', 'dat_persona', NULL, NULL, 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (1855, 1421, 'mod_persona', 'dat_persona', NULL, NULL, 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (1856, 1422, 'mod_persona', 'dat_persona', NULL, NULL, 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (1858, 1424, 'mod_persona', 'dat_persona', NULL, NULL, 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (1859, 1425, 'mod_persona', 'dat_persona', NULL, NULL, 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (1860, 1419, 'mod_persona', 'dat_docidentidad', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (1861, 1419, 'mod_persona', 'nom_tipodocidentidad', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (1862, 1427, 'mod_persona', 'dat_persona', NULL, NULL, 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (1864, 1429, 'mod_persona', 'dat_persona', NULL, NULL, 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (1865, 1430, 'mod_persona', 'dat_persona', NULL, NULL, 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (1866, 1427, 'mod_persona', 'dat_nacionalidad', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (1867, 1427, 'mod_persona', 'nom_nacionalidad', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (1868, 1432, 'mod_persona', 'dat_persona', NULL, NULL, 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (1869, 1433, 'mod_persona', 'dat_persona', NULL, NULL, 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (1870, 1434, 'mod_persona', 'dat_persona', NULL, NULL, 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (1871, 1435, 'mod_persona', 'dat_persona', NULL, NULL, 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (1872, 1432, 'mod_personaext', 'dat_afeccion', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (1873, 1432, 'mod_personaext', 'nom_padecimiento', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (1875, 1438, 'mod_persona', 'dat_persona', NULL, NULL, 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (1876, 1439, 'mod_persona', 'dat_persona', NULL, NULL, 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (1877, 1440, 'mod_persona', 'dat_persona', NULL, NULL, 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (1878, 1441, 'mod_persona', 'dat_persona', NULL, NULL, 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (1879, 1442, 'mod_persona', 'dat_persona', NULL, NULL, 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (1880, 1443, 'mod_persona', 'dat_persona', NULL, NULL, 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (1881, 1445, 'mod_persona', 'dat_persona', NULL, NULL, 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (1882, 1446, 'mod_persona', 'dat_persona', NULL, NULL, 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (1883, 1438, 'mod_personaext', 'dat_afiliacion', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (1884, 1438, 'mod_personaext', 'nom_organizacion', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (1885, 1439, 'mod_personaext', 'dat_afiliacion', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (1887, 1439, 'mod_personaext', 'nom_organizacion', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (1888, 1439, 'mod_personaext', 'nom_tipoorganizacion', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (1890, 1440, 'mod_personaext', 'dat_afiliacion', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (1891, 1440, 'mod_personaext', 'dat_cargoorganizacion', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (1892, 1440, 'mod_personaext', 'nom_cargoorganizacion', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (1893, 1441, 'mod_personaext', 'dat_afiliacion', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (1894, 1441, 'mod_personaext', 'dat_cargoorganizacion', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (1895, 1441, 'mod_personaext', 'nom_nivelorganizacion', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (1896, 1442, 'mod_personaext', 'dat_afiliacion', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (1897, 1429, 'mod_persona', 'dat_nacionalidad', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (1898, 1430, 'mod_persona', 'dat_nacionalidad', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (1899, 1406, 'mod_persona', 'dat_fenotipo', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (1900, 1407, 'mod_persona', 'dat_fenotipo', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (1901, 1408, 'mod_persona', 'dat_fenotipo', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (1902, 1443, 'mod_personaext', 'dat_afiliacion', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (1903, 1445, 'mod_personaext', 'dat_afiliacion', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (960, 937, 'mod_persona', 'dat_datosnacimiento', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (1904, 1445, 'mod_personaext', 'dat_cargoorganizacion', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (1905, 1446, 'mod_personaext', 'dat_afiliacion', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (1906, 1446, 'mod_personaext', 'dat_cargoorganizacion', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (1907, 1415, 'mod_persona', 'dat_contacto', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (1908, 1414, 'mod_persona', 'dat_contacto', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (1909, 1433, 'mod_personaext', 'dat_afeccion', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (1910, 1434, 'mod_personaext', 'dat_afeccion', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (1911, 1435, 'mod_personaext', 'dat_afeccion', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (1912, 1420, 'mod_persona', 'dat_docidentidad', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (1913, 1421, 'mod_persona', 'dat_docidentidad', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (1914, 1422, 'mod_persona', 'dat_docidentidad', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (1915, 1424, 'mod_persona', 'dat_docidentidad', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (1916, 1425, 'mod_persona', 'dat_docidentidad', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (1917, 1448, 'mod_persona', 'dat_persona', NULL, NULL, 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (1918, 1449, 'mod_persona', 'dat_persona', NULL, NULL, 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (1919, 1450, 'mod_persona', 'dat_persona', NULL, NULL, 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (1920, 1451, 'mod_persona', 'dat_persona', NULL, NULL, 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (1921, 1449, 'mod_personaext', 'dat_caracteristicasocial', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (1922, 1449, 'mod_personaext', 'nom_estratificacionsocial', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (1923, 1450, 'mod_personaext', 'dat_caracteristicasocial', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (1924, 1448, 'mod_personaext', 'dat_caracteristicasocial', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (1925, 1448, 'mod_personaext', 'nom_estadocivil', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (1926, 1451, 'mod_personaext', 'dat_caracteristicasocial', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2448, 1711, 'mod_persona', 'dat_datosnacimiento', 444, 'LEFT JOIN', 1);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2453, 1740, 'mod_persona', 'dat_persona', NULL, NULL, 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2458, 1741, 'mod_persona', 'dat_personaentidad', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2463, 1742, 'mod_persona', 'dat_personaentidad', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2468, 1743, 'mod_persona', 'dat_situacionlaboral', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2491, 1754, 'mod_persona', 'dat_persona', NULL, NULL, 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2478, 1746, 'mod_personaext', 'nom_niveleducacional', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2483, 1751, 'mod_persona', 'dat_persona', NULL, NULL, 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2488, 1751, 'mod_personaext', 'dat_tallaje', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2497, 1753, 'mod_datosmaestros', 'nom_dpt', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2503, 1758, 'mod_persona', 'dat_direccion', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2509, 1765, 'mod_persona', 'dat_persona', NULL, NULL, 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (1942, 1460, 'mod_persona', 'dat_persona', NULL, NULL, 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (1943, 1461, 'mod_persona', 'dat_persona', NULL, NULL, 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (1944, 1462, 'mod_persona', 'dat_persona', NULL, NULL, 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (1946, 1464, 'mod_persona', 'dat_persona', NULL, NULL, 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (1947, 1465, 'mod_persona', 'dat_persona', NULL, NULL, 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (1949, 1467, 'mod_persona', 'dat_persona', NULL, NULL, 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (1950, 1460, 'mod_personaext', 'dat_cuentabancaria', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (1951, 1460, 'mod_datosmaestros', 'nom_banco', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (1952, 1461, 'mod_personaext', 'dat_cuentabancaria', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (1953, 1461, 'mod_datosmaestros', 'nom_banco', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (1954, 1462, 'mod_personaext', 'dat_cuentabancaria', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (1955, 1462, 'mod_datosmaestros', 'nom_moneda', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (1956, 1464, 'mod_personaext', 'dat_cuentabancaria', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (1957, 1465, 'mod_personaext', 'dat_cuentabancaria', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (1958, 1467, 'mod_personaext', 'dat_cuentabancaria', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (1959, 1469, 'mod_persona', 'dat_persona', NULL, NULL, 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (1960, 1470, 'mod_persona', 'dat_persona', NULL, NULL, 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (1961, 1471, 'mod_persona', 'dat_persona', NULL, NULL, 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (1968, 1478, 'mod_persona', 'dat_persona', NULL, NULL, 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (1969, 1479, 'mod_persona', 'dat_persona', NULL, NULL, 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (1970, 1469, 'mod_personaext', 'dat_educacion', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (1971, 1469, 'mod_personaext', 'nom_tipoformacion', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (1972, 1470, 'mod_personaext', 'dat_educacion', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (1973, 1470, 'mod_personaext', 'nom_modoformacion', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (1977, 1471, 'mod_personaext', 'dat_educacion', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (1978, 1471, 'mod_personaext', 'nom_centroestudio', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (1988, 1478, 'mod_personaext', 'dat_educacion', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (1989, 1479, 'mod_personaext', 'dat_educacion', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (1990, 1480, 'mod_persona', 'dat_persona', NULL, NULL, 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (1991, 1481, 'mod_persona', 'dat_persona', NULL, NULL, 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (1992, 1480, 'mod_personaext', 'dat_estadosalud', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (1993, 1481, 'mod_personaext', 'dat_estadosalud', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (1994, 1481, 'mod_personaext', 'nom_aptitudfisica', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (1995, 1483, 'mod_persona', 'dat_persona', NULL, NULL, 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (1996, 1484, 'mod_persona', 'dat_persona', NULL, NULL, 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (1997, 1485, 'mod_persona', 'dat_persona', NULL, NULL, 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (1998, 1486, 'mod_persona', 'dat_persona', NULL, NULL, 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (1999, 1487, 'mod_persona', 'dat_persona', NULL, NULL, 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2000, 1488, 'mod_persona', 'dat_persona', NULL, NULL, 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2001, 1489, 'mod_persona', 'dat_persona', NULL, NULL, 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2002, 1483, 'mod_personaext', 'dat_estanciaexterior', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2003, 1483, 'mod_personaext', 'nom_mision', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2004, 1484, 'mod_personaext', 'dat_estanciaexterior', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2005, 1484, 'mod_personaext', 'nom_mision', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2006, 1484, 'mod_personaext', 'nom_tipomision', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2007, 1485, 'mod_personaext', 'dat_estanciaexterior', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2009, 1486, 'mod_personaext', 'dat_estanciaexterior', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2010, 1486, 'mod_personaext', 'nom_tipoestanciaexterior', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2011, 1487, 'mod_personaext', 'dat_estanciaexterior', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2012, 1488, 'mod_personaext', 'dat_estanciaexterior', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2013, 1489, 'mod_personaext', 'dat_estanciaexterior', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2014, 1491, 'mod_persona', 'dat_persona', NULL, NULL, 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2015, 1493, 'mod_persona', 'dat_persona', NULL, NULL, 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2016, 1494, 'mod_persona', 'dat_persona', NULL, NULL, 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2017, 1493, 'mod_personaext', 'dat_idioma', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2018, 1493, 'mod_personaext', 'nom_idioma', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2019, 1494, 'mod_personaext', 'dat_idioma', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2020, 1494, 'mod_personaext', 'nom_formaadquiriridioma', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2021, 1496, 'mod_persona', 'dat_persona', NULL, NULL, 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2022, 1497, 'mod_persona', 'dat_persona', NULL, NULL, 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2023, 1498, 'mod_persona', 'dat_persona', NULL, NULL, 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2024, 1499, 'mod_persona', 'dat_persona', NULL, NULL, 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2025, 1500, 'mod_persona', 'dat_persona', NULL, NULL, 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2026, 1501, 'mod_persona', 'dat_persona', NULL, NULL, 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2027, 1502, 'mod_persona', 'dat_persona', NULL, NULL, 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2028, 1496, 'mod_personaext', 'dat_sancion', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2029, 1496, 'mod_personaext', 'nom_sancion', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2030, 1497, 'mod_personaext', 'dat_sancion', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2031, 1497, 'mod_personaext', 'nom_sancion', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2032, 1497, 'mod_personaext', 'nom_tiposancion', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2033, 1498, 'mod_personaext', 'dat_sancion', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2034, 1498, 'mod_personaext', 'nom_motivosancion', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2035, 1499, 'mod_personaext', 'dat_sancion', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2036, 1500, 'mod_personaext', 'dat_sancion', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2037, 1501, 'mod_personaext', 'dat_sancion', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2038, 1502, 'mod_personaext', 'dat_sancion', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2039, 1503, 'mod_persona', 'dat_persona', NULL, NULL, 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2040, 1503, 'mod_persona', 'dat_datosnacimiento', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2052, 1512, 'mod_nomina', 'conf_pagosporresultado', NULL, NULL, 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2053, 1513, 'mod_nomina', 'conf_pagosporresultado', NULL, NULL, 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2054, 1514, 'mod_nomina', 'conf_pagosporresultado', NULL, NULL, 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2056, 1512, 'mod_nomina', 'nom_tipopago', NULL, 'INNER JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2057, 1515, 'mod_nomina', 'conf_pagosporresultado', NULL, NULL, 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2449, 1711, 'mod_datosmaestros', 'nom_dpt', 333, 'LEFT JOIN', 1);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2492, 1755, 'mod_persona', 'dat_persona', NULL, NULL, 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2459, 1741, 'mod_persona', 'dat_situacionlaboral', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2464, 1742, 'mod_persona', 'dat_situacionlaboral', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2469, 1743, 'mod_estructuracomp', 'dat_cargo', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2498, 1754, 'mod_persona', 'dat_direccion', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2504, 1760, 'mod_persona', 'dat_persona', NULL, NULL, 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2479, 1747, 'mod_personaext', 'dat_niveleducacional', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2484, 1749, 'mod_personaext', 'dat_tallaje', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2489, 1751, 'mod_personaext', 'nom_talla', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2510, 1766, 'mod_persona', 'dat_persona', NULL, NULL, 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2450, 1739, 'mod_persona', 'dat_persona', NULL, NULL, 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2455, 1740, 'mod_persona', 'dat_personaentidad', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2460, 1741, 'mod_estructuracomp', 'dat_estructuraop', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2465, 1742, 'mod_estructuracomp', 'dat_cargo', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2470, 1743, 'mod_estructuracomp', 'nom_salario', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2475, 1746, 'mod_persona', 'dat_persona', NULL, NULL, 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2480, 1747, 'mod_personaext', 'nom_titulo', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2485, 1749, 'mod_personaext', 'nom_prenda', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2493, 1756, 'mod_persona', 'dat_persona', NULL, NULL, 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2499, 1754, 'mod_datosmaestros', 'nom_dpt', 257, 'LEFT JOIN', 1);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2505, 1761, 'mod_persona', 'dat_persona', NULL, NULL, 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2160, 1587, 'mod_persona', 'dat_persona', NULL, NULL, 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2161, 1588, 'mod_persona', 'dat_persona', NULL, NULL, 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2162, 1589, 'mod_persona', 'dat_persona', NULL, NULL, 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2163, 1590, 'mod_persona', 'dat_persona', NULL, NULL, 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2164, 1591, 'mod_persona', 'dat_persona', NULL, NULL, 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2165, 1592, 'mod_persona', 'dat_persona', NULL, NULL, 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2166, 1593, 'mod_persona', 'dat_persona', NULL, NULL, 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2167, 1594, 'mod_persona', 'dat_persona', NULL, NULL, 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2168, 1595, 'mod_persona', 'dat_persona', NULL, NULL, 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2169, 1596, 'mod_persona', 'dat_persona', NULL, NULL, 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2171, 1595, 'mod_persona', 'dat_docidentidad', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2173, 1594, 'mod_persona', 'dat_docidentidad', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2209, 1491, 'mod_personaext', 'dat_gradomilitar', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2210, 1491, 'mod_estructuracomp', 'nom_grado', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2220, 1610, 'mod_persona', 'dat_persona', NULL, NULL, 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2221, 1611, 'mod_persona', 'dat_persona', NULL, NULL, 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2222, 1612, 'mod_persona', 'dat_persona', NULL, NULL, 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2223, 1613, 'mod_persona', 'dat_persona', NULL, NULL, 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2224, 1614, 'mod_persona', 'dat_persona', NULL, NULL, 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2226, 1616, 'mod_persona', 'dat_persona', NULL, NULL, 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2227, 1617, 'mod_persona', 'dat_persona', NULL, NULL, 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2228, 1617, 'mod_persona', 'dat_docidentidad', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2232, 1624, 'mod_persona', 'dat_persona', NULL, NULL, 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2233, 1625, 'mod_persona', 'dat_persona', NULL, NULL, 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2234, 1626, 'mod_persona', 'dat_persona', NULL, NULL, 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2238, 1624, 'mod_personaext', 'dat_regimentrabajo', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2243, 1626, 'mod_personaext', 'dat_regimentrabajo', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2245, 1627, 'mod_persona', 'dat_persona', NULL, NULL, 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2246, 1627, 'mod_regimentrabajo', 'dat_asistencia', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2242, 1625, 'mod_regimentrabajo', 'nom_grupodescanso', NULL, 'INNER JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2247, 1627, 'mod_regimentrabajo', 'nom_causa', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2240, 1625, 'mod_personaext', 'dat_regimentrabajo', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2248, 1628, 'mod_persona', 'dat_persona', NULL, NULL, 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2249, 1628, 'mod_regimentrabajo', 'dat_asistencia', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2250, 1629, 'mod_persona', 'dat_persona', NULL, NULL, 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2251, 1630, 'mod_persona', 'dat_persona', NULL, NULL, 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2252, 1629, 'mod_regimentrabajo', 'dat_asistencia', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2253, 1630, 'mod_regimentrabajo', 'dat_asistencia', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2254, 1632, 'mod_persona', 'dat_persona', NULL, NULL, 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2255, 1632, 'mod_persona', 'dat_personaentidad', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2256, 1632, 'mod_persona', 'dat_situacionlaboral', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2257, 1632, 'mod_estructuracomp', 'dat_cargo', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2258, 1632, 'mod_estructuracomp', 'nom_cargo', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2262, 1634, 'mod_persona', 'dat_persona', NULL, NULL, 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2263, 1634, 'mod_persona', 'dat_personaentidad', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2265, 1634, 'mod_persona', 'dat_situacionlaboral', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2266, 1634, 'mod_estructuracomp', 'nom_filaestruc', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2267, 1634, 'mod_estructuracomp', 'dat_estructuraop', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2268, 1635, 'mod_persona', 'dat_persona', NULL, NULL, 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2269, 1635, 'mod_persona', 'dat_personaentidad', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2270, 1635, 'mod_estructuracomp', 'dat_estructura', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2239, 1624, 'mod_regimentrabajo', 'nom_regimentrabajo', NULL, 'INNER JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2244, 1626, 'mod_regimentrabajo', 'nom_turnotrabajo', NULL, 'INNER JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2271, 1637, 'mod_persona', 'dat_persona', NULL, NULL, 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2273, 1640, 'mod_persona', 'dat_persona', NULL, NULL, 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2274, 1641, 'mod_persona', 'dat_persona', NULL, NULL, 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2275, 1642, 'mod_persona', 'dat_persona', NULL, NULL, 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2276, 1643, 'mod_persona', 'dat_persona', NULL, NULL, 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2277, 1644, 'mod_persona', 'dat_persona', NULL, NULL, 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2278, 1645, 'mod_persona', 'dat_persona', NULL, NULL, 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2280, 1647, 'mod_persona', 'dat_persona', NULL, NULL, 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2281, 1648, 'mod_persona', 'dat_persona', NULL, NULL, 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2282, 1648, 'mod_persona', 'dat_foto', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2284, 1650, 'mod_persona', 'dat_persona', NULL, NULL, 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2285, 1650, 'mod_persona', 'dat_docidentidad', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2286, 1651, 'mod_persona', 'dat_persona', NULL, NULL, 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2287, 1651, 'mod_persona', 'dat_docidentidad', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2288, 1652, 'mod_persona', 'dat_persona', NULL, NULL, 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2289, 1652, 'mod_persona', 'dat_docidentidad', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2290, 1652, 'mod_persona', 'nom_tipodocidentidad', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2291, 1653, 'mod_persona', 'dat_persona', NULL, NULL, 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2292, 1654, 'mod_persona', 'dat_persona', NULL, NULL, 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2293, 1655, 'mod_persona', 'dat_persona', NULL, NULL, 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2294, 1653, 'mod_persona', 'dat_docidentidad', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2295, 1653, 'mod_persona', 'nom_tipodocidentidad', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2296, 1654, 'mod_persona', 'dat_docidentidad', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2297, 1654, 'mod_persona', 'nom_tipodocidentidad', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2298, 1655, 'mod_persona', 'dat_docidentidad', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2299, 1655, 'mod_persona', 'nom_tipodocidentidad', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2300, 1656, 'mod_persona', 'dat_persona', NULL, NULL, 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2301, 1656, 'mod_persona', 'dat_personaentidad', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2302, 1656, 'mod_persona', 'dat_situacionlaboral', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2303, 1656, 'mod_estructuracomp', 'dat_cargo', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2304, 1656, 'mod_estructuracomp', 'nom_cargo', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2305, 1657, 'mod_persona', 'dat_persona', NULL, NULL, 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2306, 1657, 'mod_persona', 'dat_personaentidad', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2307, 1657, 'mod_persona', 'dat_situacionlaboral', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2308, 1657, 'mod_estructuracomp', 'dat_estructuraop', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2309, 1658, 'mod_persona', 'dat_persona', NULL, NULL, 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2310, 1658, 'mod_persona', 'dat_personaentidad', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2313, 1658, 'mod_estructuracomp', 'dat_estructura', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2314, 1659, 'mod_persona', 'dat_persona', NULL, NULL, 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2315, 1659, 'mod_persona', 'dat_personaentidad', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2316, 1659, 'mod_persona', 'dat_situacionlaboral', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2317, 1659, 'mod_estructuracomp', 'dat_cargo', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2318, 1659, 'mod_estructuracomp', 'nom_cargo', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2319, 1660, 'mod_persona', 'dat_persona', NULL, NULL, 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2320, 1660, 'mod_persona', 'dat_personaentidad', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2322, 1660, 'mod_estructuracomp', 'dat_estructura', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2494, 1757, 'mod_persona', 'dat_persona', NULL, NULL, 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2336, 1674, 'mod_persona', 'dat_persona', NULL, NULL, 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2337, 1675, 'mod_persona', 'dat_persona', NULL, NULL, 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2338, 1675, 'mod_persona', 'dat_personaentidad', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2500, 1755, 'mod_persona', 'dat_direccion', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2340, 1675, 'mod_persona', 'dat_situacionlaboral', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2341, 1675, 'mod_persona', 'nom_situacion', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2506, 1762, 'mod_persona', 'dat_persona', NULL, NULL, 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2346, 1678, 'mod_persona', 'dat_persona', NULL, NULL, 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2347, 1678, 'mod_persona', 'dat_personaentidad', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2348, 1678, 'mod_persona', 'dat_situacionlaboral', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2349, 1680, 'mod_seleccion', 'dat_candidato', NULL, NULL, 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2350, 1681, 'mod_seleccion', 'dat_candidato', NULL, NULL, 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2351, 1680, 'mod_persona', 'dat_persona', NULL, 'INNER JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2352, 1680, 'mod_persona', 'dat_docidentidad', NULL, 'INNER JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2353, 1681, 'mod_persona', 'dat_persona', NULL, 'INNER JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2354, 1682, 'mod_seleccion', 'dat_candidato', NULL, NULL, 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2355, 1683, 'mod_seleccion', 'dat_candidato', NULL, NULL, 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2356, 1684, 'mod_seleccion', 'dat_candidato', NULL, NULL, 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2357, 1685, 'mod_seleccion', 'dat_candidato', NULL, NULL, 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2358, 1686, 'mod_seleccion', 'dat_candidato', NULL, NULL, 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2359, 1688, 'mod_seleccion', 'dat_candidato', NULL, NULL, 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2360, 1688, 'mod_seleccion', 'dat_proceso', NULL, 'INNER JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2361, 1690, 'mod_seleccion', 'dat_candidato', NULL, NULL, 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2362, 1690, 'mod_seleccion', 'nom_viareclutamiento', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2363, 1691, 'mod_seleccion', 'dat_candidato', NULL, NULL, 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2364, 1692, 'mod_seleccion', 'dat_candidato', NULL, NULL, 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2365, 1693, 'mod_seleccion', 'dat_candidato', NULL, NULL, 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2366, 1693, 'mod_seguridad', 'seg_usuario', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2367, 1695, 'mod_seleccion', 'dat_candidato', NULL, NULL, 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2368, 1696, 'mod_seleccion', 'dat_candidato', NULL, NULL, 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2369, 1697, 'mod_seleccion', 'dat_candidato', NULL, NULL, 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2370, 1698, 'mod_seleccion', 'dat_candidato', NULL, NULL, 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2371, 1698, 'mod_seleccion', 'dat_excluido', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2372, 1695, 'mod_seleccion', 'dat_excluido', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2373, 1696, 'mod_seleccion', 'dat_excluido', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2374, 1697, 'mod_seleccion', 'dat_excluido', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2375, 1696, 'mod_seleccion', 'nom_motivoexclusion', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2376, 1699, 'mod_seleccion', 'dat_candidato', NULL, NULL, 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2377, 1699, 'mod_seleccion', 'dat_excluido', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2378, 1700, 'mod_seleccion', 'dat_candidato', NULL, NULL, 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2379, 1701, 'mod_seleccion', 'dat_candidato', NULL, NULL, 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2380, 1700, 'mod_seleccion', 'dat_excluido', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2381, 1700, 'mod_seleccion', 'nom_motivoreicorporacion', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2382, 1701, 'mod_seleccion', 'dat_excluido', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2383, 1706, 'mod_persona', 'dat_persona', NULL, NULL, 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2384, 1706, 'mod_personaext', 'dat_categorizacion', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2385, 1706, 'mod_personaext', 'nom_categoria', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2386, 1707, 'mod_persona', 'dat_persona', NULL, NULL, 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2387, 1708, 'mod_persona', 'dat_persona', NULL, NULL, 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2388, 1707, 'mod_personaext', 'dat_categorizacion', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2389, 1707, 'mod_personaext', 'nom_categoria', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2390, 1707, 'mod_personaext', 'nom_tipocategoria', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2391, 1708, 'mod_personaext', 'dat_categorizacion', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2392, 1709, 'mod_persona', 'dat_persona', NULL, NULL, 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2393, 1710, 'mod_persona', 'dat_persona', NULL, NULL, 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2394, 1711, 'mod_persona', 'dat_persona', NULL, NULL, 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2395, 1712, 'mod_persona', 'dat_persona', NULL, NULL, 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2396, 1709, 'mod_persona', 'dat_datosnacimiento', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2397, 1709, 'mod_datosmaestros', 'nom_pais', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2400, 1712, 'mod_persona', 'dat_datosnacimiento', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2401, 1710, 'mod_persona', 'dat_datosnacimiento', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2402, 1710, 'mod_datosmaestros', 'nom_dpt', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2451, 1739, 'mod_persona', 'dat_personaentidad', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2404, 1714, 'mod_persona', 'dat_persona', NULL, NULL, 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2405, 1715, 'mod_persona', 'dat_persona', NULL, NULL, 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2406, 1716, 'mod_persona', 'dat_persona', NULL, NULL, 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2407, 1717, 'mod_persona', 'dat_persona', NULL, NULL, 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2408, 1718, 'mod_persona', 'dat_persona', NULL, NULL, 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2456, 1740, 'mod_persona', 'dat_situacionlaboral', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2461, 1742, 'mod_persona', 'dat_persona', NULL, NULL, 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2466, 1742, 'mod_estructuracomp', 'nom_salario', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2412, 1717, 'mod_persona', 'dat_datosnacimiento', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2413, 1715, 'mod_persona', 'dat_datosnacimiento', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2414, 1716, 'mod_persona', 'dat_datosnacimiento', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2415, 1718, 'mod_persona', 'dat_datosnacimiento', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2416, 1714, 'mod_persona', 'dat_datosnacimiento', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2471, 1743, 'mod_estructuracomp', 'nom_grupocomplejidad', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2418, 1724, 'mod_persona', 'dat_persona', NULL, NULL, 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2419, 1725, 'mod_persona', 'dat_persona', NULL, NULL, 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2420, 1726, 'mod_persona', 'dat_persona', NULL, NULL, 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2421, 1727, 'mod_persona', 'dat_persona', NULL, NULL, 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2422, 1728, 'mod_persona', 'dat_persona', NULL, NULL, 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2423, 1725, 'mod_personaext', 'dat_condecoracion', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2424, 1725, 'mod_personaext', 'nom_condecoracion', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2425, 1727, 'mod_personaext', 'dat_condecoracion', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2426, 1724, 'mod_personaext', 'dat_condecoracion', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2427, 1724, 'mod_personaext', 'nom_condecoracion', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2428, 1724, 'mod_personaext', 'nom_tipocondecoracion', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2429, 1726, 'mod_personaext', 'dat_condecoracion', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2430, 1726, 'mod_personaext', 'nom_motivocondecoracion', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2431, 1728, 'mod_personaext', 'dat_condecoracion', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2432, 1732, 'mod_persona', 'dat_persona', NULL, NULL, 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2433, 1733, 'mod_persona', 'dat_persona', NULL, NULL, 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2434, 1733, 'mod_personaext', 'dat_educacion', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2435, 1732, 'mod_personaext', 'dat_educacion', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2436, 1732, 'mod_personaext', 'nom_curso', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2437, 1485, 'mod_datosmaestros', 'nom_pais', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2438, 1734, 'mod_persona', 'dat_persona', NULL, NULL, 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2439, 1735, 'mod_persona', 'dat_persona', NULL, NULL, 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2440, 1736, 'mod_persona', 'dat_persona', NULL, NULL, 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2441, 1737, 'mod_persona', 'dat_persona', NULL, NULL, 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2442, 1735, 'mod_personaext', 'his_trayectorialaboral', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2443, 1737, 'mod_personaext', 'his_trayectorialaboral', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2444, 1734, 'mod_personaext', 'his_trayectorialaboral', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2445, 1736, 'mod_personaext', 'his_trayectorialaboral', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2476, 1747, 'mod_persona', 'dat_persona', NULL, NULL, 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2481, 1749, 'mod_persona', 'dat_persona', NULL, NULL, 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2486, 1750, 'mod_personaext', 'dat_tallaje', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2495, 1758, 'mod_persona', 'dat_persona', NULL, NULL, 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2501, 1756, 'mod_persona', 'dat_direccion', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2507, 1763, 'mod_persona', 'dat_persona', NULL, NULL, 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2511, 1768, 'mod_persona', 'dat_persona', NULL, NULL, 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2512, 1768, 'mod_persona', 'dat_direccion', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2513, 1769, 'mod_persona', 'dat_persona', NULL, NULL, 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2514, 1769, 'mod_persona', 'dat_datosnacimiento', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2515, 1771, 'mod_estructuracomp', 'nom_filaestruc', NULL, NULL, 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2516, 1772, 'mod_estructuracomp', 'nom_filaestruc', NULL, NULL, 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2517, 1773, 'mod_estructuracomp', 'nom_filaestruc', NULL, NULL, 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2518, 1771, 'mod_estructuracomp', 'dat_cargo', NULL, 'INNER JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2522, 1772, 'mod_estructuracomp', 'dat_cargo', NULL, 'INNER JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2524, 1772, 'mod_estructuracomp', 'nom_grupocomplejidad', NULL, 'INNER JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2523, 1772, 'mod_estructuracomp', 'nom_cargo', NULL, 'INNER JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2520, 1771, 'mod_estructuracomp', 'nom_cargo', NULL, 'INNER JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2525, 1773, 'mod_estructuracomp', 'dat_cargo', NULL, 'INNER JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2527, 1773, 'mod_estructuracomp', 'nom_salario', NULL, 'INNER JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2531, 1775, 'mod_estructuracomp', 'nom_filaestruc', NULL, NULL, 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2532, 1776, 'mod_estructuracomp', 'nom_filaestruc', NULL, NULL, 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2533, 1777, 'mod_estructuracomp', 'nom_filaestruc', NULL, NULL, 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2534, 1778, 'mod_estructuracomp', 'nom_filaestruc', NULL, NULL, 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2535, 1778, 'mod_estructuracomp', 'dat_cargo', NULL, 'INNER JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2536, 1778, 'mod_estructuracomp', 'nom_sector', NULL, 'INNER JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2537, 1779, 'mod_estructuracomp', 'nom_filaestruc', NULL, NULL, 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2538, 1780, 'mod_estructuracomp', 'nom_filaestruc', NULL, NULL, 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2542, 1782, 'mod_estructuracomp', 'nom_filaestruc', NULL, NULL, 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2545, 1784, 'mod_estructuracomp', 'nom_filaestruc', NULL, NULL, 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2550, 1790, 'mod_estructuracomp', 'nom_filaestruc', NULL, NULL, 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2551, 1790, 'mod_estructuracomp', 'dat_cargo', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2552, 1790, 'mod_datosmaestros', 'nom_especialidad', NULL, 'INNER JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2553, 1791, 'mod_estructuracomp', 'nom_filaestruc', NULL, NULL, 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2554, 1791, 'mod_estructuracomp', 'dat_cargo', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2555, 1791, 'mod_datosmaestros', 'nom_especialidad', NULL, 'INNER JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2556, 1792, 'mod_estructuracomp', 'nom_filaestruc', NULL, NULL, 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2557, 1792, 'mod_estructuracomp', 'dat_cargo', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2558, 1792, 'mod_estructuracomp', 'nom_tipoescala', NULL, 'INNER JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2559, 1793, 'mod_estructuracomp', 'nom_filaestruc', NULL, NULL, 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2560, 1794, 'mod_estructuracomp', 'nom_filaestruc', NULL, NULL, 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2561, 1795, 'mod_estructuracomp', 'nom_filaestruc', NULL, NULL, 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2562, 1795, 'mod_estructuracomp', 'dat_cargo', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2564, 1795, 'mod_estructuracomp', 'nom_categocup', NULL, 'INNER JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2563, 1795, 'mod_estructuracomp', 'dat_cargocivil', NULL, 'INNER JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2567, 1798, 'mod_estructuracomp', 'nom_filaestruc', NULL, NULL, 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2569, 1798, 'mod_estructuracomp', 'nom_cargo', NULL, 'INNER JOIN', 0);
INSERT INTO dat_mapeo (idmapeo, idcampo, esquema, tabla, idpersistejoin, tipoconexion, persistejoin) VALUES (2568, 1798, 'mod_estructuracomp', 'dat_cargo', NULL, 'LEFT JOIN', 0);
INSERT INTO dat_multievaluado (valor, denominacion, idcampo) VALUES ('0', 'No', 1756);
INSERT INTO dat_multievaluado (valor, denominacion, idcampo) VALUES ('1', 'Si', 1756);
INSERT INTO dat_multievaluado (valor, denominacion, idcampo) VALUES ('2', 'Malo', 1480);
INSERT INTO dat_multievaluado (valor, denominacion, idcampo) VALUES ('1', 'Regular', 1480);
INSERT INTO dat_multievaluado (valor, denominacion, idcampo) VALUES ('0', 'Bueno', 1480);
INSERT INTO dat_multievaluado (valor, denominacion, idcampo) VALUES ('2', 'Años', 1502);
INSERT INTO dat_multievaluado (valor, denominacion, idcampo) VALUES ('1', 'Meses', 1502);
INSERT INTO dat_multievaluado (valor, denominacion, idcampo) VALUES ('0', 'Dias', 1502);
INSERT INTO dat_multievaluado (valor, denominacion, idcampo) VALUES ('0', 'No', 1421);
INSERT INTO dat_multievaluado (valor, denominacion, idcampo) VALUES ('1', 'Si', 1421);
INSERT INTO dat_multievaluado (valor, denominacion, idcampo) VALUES ('a', 'sas', 1587);
INSERT INTO dat_multievaluado (valor, denominacion, idcampo) VALUES ('1', 'Si', 1739);
INSERT INTO dat_multievaluado (valor, denominacion, idcampo) VALUES ('0', 'No', 1739);
INSERT INTO dat_multievaluado (valor, denominacion, idcampo) VALUES ('1', 'Excluido por el proceso', 1698);
INSERT INTO dat_multievaluado (valor, denominacion, idcampo) VALUES ('2', 'Excluido por el usuario', 1698);
INSERT INTO dat_multievaluado (valor, denominacion, idcampo) VALUES ('0', 'No', 1415);
INSERT INTO dat_multievaluado (valor, denominacion, idcampo) VALUES ('1', 'Si', 1415);
INSERT INTO dat_multievaluado (valor, denominacion, idcampo) VALUES ('0', 'No', 1777);
INSERT INTO dat_multievaluado (valor, denominacion, idcampo) VALUES ('1', 'Sí', 1777);
INSERT INTO dat_multievaluado (valor, denominacion, idcampo) VALUES ('0', 'No', 1793);
INSERT INTO dat_multievaluado (valor, denominacion, idcampo) VALUES ('1', 'Sí', 1793);
INSERT INTO dat_multievaluado (valor, denominacion, idcampo) VALUES ('0', 'No', 1794);
INSERT INTO dat_multievaluado (valor, denominacion, idcampo) VALUES ('1', 'Sí', 1794);
INSERT INTO dat_multievaluado (valor, denominacion, idcampo) VALUES ('0', 'Femenino', 1643);
INSERT INTO dat_multievaluado (valor, denominacion, idcampo) VALUES ('1', 'Masculino', 1643);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (399, 960, 'idpersona', '=', 'idpersona', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1328, 2448, 'idpersona', '=', 'idpersona', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1331, 2451, '{consulta}', 'IS NULL', '{consulta}({alias}.fhasta', 'and');
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1393, 2496, 'idpersona', '=', 'idpersona', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1337, 2455, '{consulta}', 'IS NULL', '{consulta}({alias}.fhasta', 'and');
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (893, 1829, 'idpersona', '=', 'idpersona', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (894, 1830, 'idgruposanguineo', '=', 'idgruposanguineo', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (895, 1831, 'idpersona', '=', 'idpersona', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (896, 1833, 'idpersona', '=', 'idpersona', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (897, 1834, 'idcolorpelo', '=', 'idcolorpelo', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (898, 1835, 'idpersona', '=', 'idpersona', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (899, 1836, 'idcolorpiel', '=', 'idcolorpiel', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (900, 1840, 'idpersona', '=', 'idpersona', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (901, 1841, 'idciudadania', '=', 'idciudadania', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (902, 1842, 'idpersona', '=', 'idpersona', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (903, 1843, 'idpersona', '=', 'idpersona', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (904, 1848, 'idpersona', '=', 'idpersona', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (906, 1852, 'idtipomediocontacto', '=', 'idtipomediocontacto', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (907, 1850, 'idpersona', '=', 'idpersona', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (908, 1851, 'idtipocontacto', '=', 'idtipocontacto', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (909, 1860, 'idpersona', '=', 'idpersona', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (910, 1861, 'idtipodocidentidad', '=', 'idtipodocidentidad', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (911, 1866, 'idpersona', '=', 'idpersona', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (912, 1867, 'idnacionalidad', '=', 'idnacionalidad', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (913, 1832, 'idcolorojos', '=', 'idcolorojos', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (914, 1872, 'idpersona', '=', 'idpersona', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (915, 1873, 'idpadecimiento', '=', 'idpadecimiento', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (916, 1883, 'idpersona', '=', 'idpersona', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (917, 1884, 'idorganizacion', '=', 'idorganizacion', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (918, 1885, 'idpersona', '=', 'idpersona', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (919, 1887, 'idorganizacion', '=', 'idorganizacion', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (920, 1888, 'idtipoorganizacion', '=', 'idtipoorganizacion', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (921, 1890, 'idpersona', '=', 'idpersona', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (922, 1891, 'idafiliacion', '=', 'idafiliacion', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (923, 1892, 'idcargoorganizacion', '=', 'idcargoorganizacion', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (924, 1893, 'idpersona', '=', 'idorganizacion', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (925, 1894, 'idafiliacion', '=', 'idafiliacion', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (926, 1895, 'idnivelorganizacion', '=', 'idnivelorganizacion', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (927, 1898, 'idpersona', '=', 'idpersona', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (928, 1897, 'idpersona', '=', 'idpersona', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (929, 1899, 'idpersona', '=', 'idpersona', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (930, 1900, 'idpersona', '=', 'idpersona', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (931, 1901, 'idpersona', '=', 'idpersona', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (932, 1896, 'idpersona', '=', 'idpersona', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (933, 1902, 'idpersona', '=', 'idpersona', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (934, 1903, 'idpersona', '=', 'idpersona', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (935, 1904, 'idafiliacion', '=', 'idafiliacion', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (936, 1905, 'idpersona', '=', 'idpersona', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (937, 1906, 'idafiliacion', '=', 'idafiliacion', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (938, 1907, 'idpersona', '=', 'idpersona', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (939, 1908, 'idpersona', '=', 'idpersona', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (940, 1909, 'idpersona', '=', 'idpersona', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (941, 1910, 'idpersona', '=', 'idpersona', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (942, 1911, 'idpersona', '=', 'idpersona', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (943, 1912, 'idpersona', '=', 'idpersona', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (944, 1913, 'idpersona', '=', 'idpersona', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (945, 1914, 'idpersona', '=', 'idpersona', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (946, 1915, 'idpersona', '=', 'idpersona', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (947, 1916, 'idpersona', '=', 'idpersona', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (948, 1921, 'idpersona', '=', 'idpersona', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (949, 1922, 'idestratificacionsocial', '=', 'idestratificacionsocial', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (950, 1923, 'idpersona', '=', 'idpersona', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (951, 1924, 'idpersona', '=', 'idpersona', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (952, 1925, 'idestadocivil', '=', 'idestadocivil', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (953, 1926, 'idpersona', '=', 'idpersona', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1396, 2498, 'idpersona', '=', 'idpersona', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1343, 2458, '{consulta}', 'IS NULL', '{consulta}({alias}.fhasta', 'and');
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1399, 2500, 'idpersona', '=', 'idpersona', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1349, 2460, '{consulta}0', '=', 'idproyecto', 'and');
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1402, 2503, 'idpersona', '=', 'idpersona', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1358, 2466, 'idsalario', '=', 'idsalario', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (962, 1950, 'idpersona', '=', 'idpersona', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (963, 1951, 'idbanco', '=', 'idbanco', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (964, 1952, 'idpersona', '=', 'idpersona', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (965, 1953, 'idbanco', '=', 'idbanco', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (966, 1954, 'idpersona', '=', 'idpersona', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (967, 1955, 'idmoneda', '=', 'idmoneda', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (968, 1956, 'idpersona', '=', 'idpersona', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (969, 1957, 'idpersona', '=', 'idpersona', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (970, 1958, 'idpersona', '=', 'idpersona', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (971, 1970, 'idpersona', '=', 'idpersona', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (972, 1971, 'idtipoformacion', '=', 'idtipoformacion', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (973, 1972, 'idpersona', '=', 'idpersona', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (974, 1973, 'idmodoformacion', '=', 'idmodoformacion', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1367, 2470, 'idsalario', '=', 'idsalario', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (978, 1977, 'idpersona', '=', 'idpersona', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (979, 1978, 'idcentroestudio', '=', 'idcentroestudio', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1376, 2340, '{consulta}0', '=', 'estado', 'and');
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1379, 2452, '{consulta}0', '=', 'estado', 'and');
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1382, 2468, '{consulta}0', '=', 'estado', 'and');
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1385, 2479, 'idpersona', '=', 'idpersona', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1388, 2485, 'idprenda', '=', 'idprenda', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1391, 2488, 'idpersona', '=', 'idpersona', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (989, 1988, 'idpersona', '=', 'idpersona', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (990, 1989, 'idpersona', '=', 'idpersona', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (991, 1992, 'idpersona', '=', 'idpersona', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (992, 1993, 'idpersona', '=', 'idpersona', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (993, 1994, 'idaptitudfisica', '=', 'idaptitudfisica', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (994, 2002, 'idpersona', '=', 'idpersona', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (995, 2003, 'idmision', '=', 'idmision', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (996, 2004, 'idpersona', '=', 'idpersona', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (997, 2005, 'idmision', '=', 'idmision', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (998, 2006, 'idtipomision', '=', 'idtipomision', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (999, 2007, 'idpersona', '=', 'idpersona', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1329, 2449, 'idmunicipio', '=', 'iddpt', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1001, 2009, 'idpersona', '=', 'idpersona', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1002, 2010, 'idtipoestanciaexterior', '=', 'idtipoestanciaexterior', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1003, 2011, 'idpersona', '=', 'idpersona', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1004, 2012, 'idpersona', '=', 'idpersona', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1005, 2013, 'idpersona', '=', 'idpersona', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1006, 2017, 'idpersona', '=', 'idpersona', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1007, 2018, 'ididioma', '=', 'ididioma', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1008, 2019, 'idpersona', '=', 'idpersona', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1009, 2020, 'idformaadquiriridioma', '=', 'idformaadquiriridioma', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1010, 2028, 'idpersona', '=', 'idpersona', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1011, 2029, 'idsancion', '=', 'idsancion', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1012, 2030, 'idpersona', '=', 'idpersona', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1013, 2031, 'idsancion', '=', 'idsancion', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1014, 2032, 'idtiposancion', '=', 'idtiposancion', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1015, 2033, 'idpersona', '=', 'idpersona', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1016, 2034, 'idmotivosancion', '=', 'idmotivosancion', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1017, 2035, 'idpersona', '=', 'idpersona', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1018, 2036, 'idpersona', '=', 'idpersona', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1019, 2037, 'idpersona', '=', 'idpersona', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1020, 2038, 'idpersona', '=', 'idpersona', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1021, 2040, 'idpersona', '=', 'idpersona', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1033, 2056, 'idtipopago', '=', 'idtipopago', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1394, 2497, 'idprovincia', '=', 'iddpt', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1397, 2499, 'idmunicipio', '=', 'iddpt', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1400, 2501, 'idpersona', '=', 'idpersona', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1350, 2463, 'idpersona', '=', 'idpersona', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1356, 2465, 'idcargo', '=', 'idcargo', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1359, 2467, 'idpersona', '=', 'idpersona', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1362, 2468, 'idpersonaentidad', '=', 'idpersonaentidad', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1365, 2469, 'idcargo', '=', 'idcargo', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1368, 2471, 'idgrupocomplejidad', '=', 'idgrupocomplejidad', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1389, 2486, 'idpersona', '=', 'idpersona', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1377, 2456, '{consulta}0', '=', 'estado', 'and');
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1380, 2464, 'idpersonaentidad', '=', 'idpersonaentidad', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1383, 2477, 'idpersona', '=', 'idpersona', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1386, 2480, 'idtitulo', '=', 'idtitulo', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1392, 2489, 'idtalla', '=', 'idtalla', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1083, 2171, 'idpersona', '=', 'idpersona', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1084, 2171, '{consulta}1', '=', 'principal', 'and');
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1085, 2173, 'idpersona', '=', 'idpersona', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1086, 2173, '{consulta}1', '=', 'principal', 'and');
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1135, 2209, 'idpersona', '=', 'idpersona', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1137, 2209, '{consulta}', 'IS NULL', 'fhasta', 'and');
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1136, 2210, 'idgrado', '=', 'idgrado', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1156, 2228, 'idpersona', '=', 'idpersona', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1157, 2228, '{consulta}1', '=', 'principal', 'and');
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1164, 2238, 'idpersona', '=', 'idpersona', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1167, 2240, 'idpersona', '=', 'idpersona', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1169, 2242, 'idgrupodescanso', '=', 'idgrupodescanso', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1170, 2243, 'idpersona', '=', 'idpersona', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1172, 2244, 'idturnotrabajo', '=', 'idturnotrabajo', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1166, 2239, 'idregimentrabajo', '=', 'idregimentrabajo', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1174, 2238, '{consulta}1', '=', 'actual', 'and');
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1175, 2240, '{consulta}1', '=', 'actual', 'and');
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1176, 2243, '{consulta}1', '=', 'actual', 'and');
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1177, 2246, 'idpersona', '=', 'idpersona', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1178, 2247, 'idcausa', '=', 'idcausa', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1179, 2249, 'idpersona', '=', 'idpersona', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1180, 2252, 'idpersona', '=', 'idpersona', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1181, 2253, 'idpersona', '=', 'idpersona', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1182, 2255, 'idpersona', '=', 'idpersona', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1183, 2256, 'idpersonaentidad', '=', 'idpersonaentidad', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1186, 2257, 'idcargo', '=', 'idcargo', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1187, 2258, 'idnomcargo', '=', 'idnomcargo', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1190, 2263, 'idpersona', '=', 'idpersona', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1191, 2265, 'idpersonaentidad', '=', 'idpersonaentidad', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1192, 2266, 'idarea', '=', 'idfila', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1193, 2267, 'idfila', '=', 'idestructuraop', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1194, 2269, 'idpersona', '=', 'idpersona', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1195, 2270, 'identidad', '=', 'idestructura', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1185, 2256, '){consulta}', 'IS NULL', '{consulta}({alias}.fhasta', 'and');
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1196, 2282, 'idpersona', '=', 'idpersona', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1197, 2282, '{consulta}1', '=', 'principal', 'and');
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1198, 1912, '{consulta}1', '=', 'principal', 'and');
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1199, 2285, 'idpersona', '=', 'idpersona', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1200, 2287, 'idpersona', '=', 'idpersona', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1201, 2289, 'idpersona', '=', 'idpersona', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1202, 2290, 'idtipodocidentidad', '=', 'idtipodocidentidad', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1203, 2294, 'idpersona', '=', 'idpersona', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1204, 2295, 'idtipodocidentidad', '=', 'idtipodocidentidad', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1205, 2296, 'idpersona', '=', 'idpersona', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1206, 2297, 'idtipodocidentidad', '=', 'idtipodocidentidad', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1207, 2298, 'idpersona', '=', 'idpersona', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1208, 2299, 'idtipodocidentidad', '=', 'idtipodocidentidad', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1209, 2301, 'idpersona', '=', 'idpersona', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1210, 2302, 'idpersonaentidad', '=', 'idpersonaentidad', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1211, 2303, 'idcargo', '=', 'idcargo', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1212, 2304, 'idnomcargo', '=', 'idnomcargo', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1214, 2302, '{consulta}0', '=', 'estado', 'and');
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1215, 2306, 'idpersona', '=', 'idpersona', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1216, 2307, 'idpersonaentidad', '=', 'idpersonaentidad', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1217, 2307, '{consulta}0', '=', 'estado', 'and');
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1395, 2497, '{consulta}16', '=', 'idnivelestructural', 'and');
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1219, 2308, 'idarea', '=', 'idestructuraop', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1220, 2310, 'idpersona', '=', 'idpersona', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1224, 2313, 'identidad', '=', 'idestructura', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1231, 2301, '{consulta}', 'IS NULL', '{consulta}({alias}.fhasta', 'and');
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1232, 2301, '{consulta}now())', '>=', 'fhasta', 'or');
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1233, 2303, '{consulta}0', '=', 'idproyecto', 'and');
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1234, 2306, '{consulta}', 'IS NULL', '{consulta}({alias}.fhasta', 'and');
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1235, 2306, '{consulta}now())', '>=', 'fhasta', 'or');
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1236, 2308, '{consulta}0', '=', 'idproyecto', 'and');
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1237, 2310, '{consulta}', 'IS NULL', '{consulta}({alias}.fhasta', 'and');
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1238, 2310, '{consulta}now())', '>=', 'fhasta', 'or');
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1239, 2313, '{consulta}0', '=', 'idproyecto', 'and');
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1240, 2315, 'idpersona', '=', 'idpersona', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1241, 2315, '{consulta}', 'IS NULL', '{consulta}({alias}.fhasta', 'and');
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1243, 2316, 'idpersonaentidad', '=', 'idpersonaentidad', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1244, 2316, '{consulta}0', '=', 'estado', 'and');
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1245, 2317, 'idcargo', '=', 'idcargo', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1338, 2455, '{consulta}now())', '>=', 'fhasta', 'or');
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1332, 2451, '{consulta}now())', '>=', 'fhasta', 'or');
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1246, 2317, '{consulta}0', '=', 'idproyecto', 'and');
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1247, 2318, 'idnomcargo', '=', 'idnomcargo', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1248, 2320, 'idpersona', '=', 'idpersona', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1249, 2320, '{consulta}', 'IS NULL', '{consulta}({alias}.fhasta', 'and');
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1254, 2322, 'identidad', '=', 'idestructura', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1255, 2322, '{consulta}0', '=', 'idproyecto', 'and');
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1256, 2338, 'idpersona', '=', 'idpersona', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1257, 2338, '{consulta}', 'IS NULL', '{consulta}({alias}.fhasta', 'and');
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1259, 2340, 'idpersonaentidad', '=', 'idpersonaentidad', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1398, 2499, '{consulta}17', '=', 'idnivelestructural', 'and');
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1401, 2502, 'idpersona', '=', 'idpersona', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1262, 2341, 'idsituacion', '=', 'idsituacion', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1269, 2347, 'idpersona', '=', 'idpersona', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1270, 2347, '{consulta}', 'IS NULL', '{consulta}({alias}.fhasta', 'and');
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1274, 2348, 'idpersonaentidad', '=', 'idpersonaentidad', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1277, 2351, 'idpersona', '=', 'idpersona', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1278, 2352, 'idpersona', '=', 'idpersona', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1279, 2352, '{consulta}1', '=', 'principal', 'and');
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1280, 2353, 'idpersona', '=', 'idpersona', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1281, 2360, 'idproceso', '=', 'idproceso', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1282, 2362, 'idviareclutamiento', '=', 'idviareclutamiento', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1283, 2366, 'idusuario', '=', 'idusuario', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1284, 2371, 'idcandidato', '=', 'idcandidato', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1285, 2372, 'idcandidato', '=', 'idcandidato', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1286, 2373, 'idcandidato', '=', 'idcandidato', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1287, 2374, 'idcandidato', '=', 'idcandidato', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1288, 2375, 'idmotivoexclusion', '=', 'idmotivoexclusion', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1289, 2377, 'idcandidato', '=', 'idcandidato', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1290, 2380, 'idcandidato', '=', 'idcandidato', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1291, 2381, 'idmotivoreincorporacion', '=', 'idmotivoreicorporacion', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1292, 2382, 'idcandidato', '=', 'idcandidato', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1293, 2384, 'idpersona', '=', 'idpersona', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1294, 2385, 'idcategoria', '=', 'idcategoria', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1295, 2388, 'idpersona', '=', 'idpersona', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1296, 2389, 'idcategoria', '=', 'idcategoria', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1297, 2390, 'idtipocategoria', '=', 'idtipocategoria', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1298, 2391, 'idpersona', '=', 'idpersona', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1299, 2396, 'idpersona', '=', 'idpersona', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1300, 2397, 'idpais', '=', 'idpais', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1303, 2400, 'idpersona', '=', 'idpersona', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1304, 2401, 'idpersona', '=', 'idpersona', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1305, 2402, 'idprovincia', '=', 'iddpt', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1306, 2412, 'idpersona', '=', 'idpersona', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1307, 2413, 'idpersona', '=', 'idpersona', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1308, 2414, 'idpersona', '=', 'idpersona', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1309, 2415, 'idpersona', '=', 'idpersona', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1310, 2416, 'idpersona', '=', 'idpersona', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1311, 2423, 'idpersona', '=', 'idpersona', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1312, 2424, 'idcondecoracion', '=', 'idcondecoracion', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1313, 2425, 'idpersona', '=', 'idpersona', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1314, 2426, 'idpersona', '=', 'idpersona', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1315, 2427, 'idcondecoracion', '=', 'idcondecoracion', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1316, 2428, 'idtipocondecoracion', '=', 'idtipocondecoracion', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1317, 2429, 'idpersona', '=', 'idpersona', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1318, 2430, 'idmotivocondecoracion', '=', 'idmotivocondecoracion', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1319, 2431, 'idpersona', '=', 'idpersona', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1320, 2434, 'idpersona', '=', 'idpersona', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1321, 2435, 'idpersona', '=', 'idpersona', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1322, 2436, 'idcurso', '=', 'idcurso', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1323, 2437, 'idpais', '=', 'idpais', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1324, 2442, 'idpersona', '=', 'idpersona', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1325, 2443, 'idpersona', '=', 'idpersona', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1326, 2444, 'idpersona', '=', 'idpersona', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1327, 2445, 'idpersona', '=', 'idpersona', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1330, 2451, 'idpersona', '=', 'idpersona', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1333, 2452, 'idpersonaentidad', '=', 'idpersonaentidad', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1336, 2455, 'idpersona', '=', 'idpersona', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1339, 2456, 'idpersonaentidad', '=', 'idpersonaentidad', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1342, 2458, 'idpersona', '=', 'idpersona', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1345, 2459, 'idpersonaentidad', '=', 'idpersonaentidad', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1348, 2460, 'idarea', '=', 'idestructuraop', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1351, 2463, '{consulta}', 'IS NULL', '{consulta}({alias}.fhasta', 'and');
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1357, 2465, '{consulta}0', '=', 'idproyecto', 'and');
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1360, 2467, '{consulta}', 'IS NULL', '{consulta}({alias}.fhasta', 'and');
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1366, 2469, '{consulta}0', '=', 'idproyecto', 'and');
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1375, 2459, '{consulta}0', '=', 'estado', 'and');
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1378, 2348, '{consulta}0', '=', 'estado', 'and');
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1381, 2464, '{consulta}0', '=', 'estado', 'and');
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1384, 2478, 'idniveleducacional', '=', 'idniveleducacional', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1387, 2484, 'idpersona', '=', 'idpersona', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1390, 2487, 'idnorma', '=', 'idnorma', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1403, 2512, 'idpersona', '=', 'idpersona', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1404, 2512, '{consulta}', 'IS NULL', 'fhasta', 'and');
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1405, 2512, '{consulta}1', '=', 'oficial', 'and');
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1406, 2514, 'idpersona', '=', 'idpersona', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1407, 2518, 'idfila', '=', 'idcargo', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1408, 2518, '{consulta}0', '=', 'idproyecto', 'and');
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1409, 2520, 'idnomcargo', '=', 'idnomcargo', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1417, 2525, 'idfila', '=', 'idcargo', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1413, 2522, 'idfila', '=', 'idcargo', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1415, 2523, 'idnomcargo', '=', 'idnomcargo', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1414, 2522, '{consulta}0', '=', 'idproyecto', 'and');
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1416, 2524, 'idgrupocomplejidad', '=', 'idgrupocomplejidad', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1418, 2525, '{consulta}0', '=', 'idproyecto', 'and');
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1420, 2527, 'idsalario', '=', 'idsalario', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1425, 2535, 'idfila', '=', 'idcargo', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1426, 2536, 'idsector', '=', 'idsector', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1432, 2551, 'idfila', '=', 'idcargo', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1433, 2551, '{consulta}0', '=', 'idproyecto', 'and');
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1434, 2552, 'idespecialidadempleo', '=', 'idespecialidad', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1435, 2554, 'idfila', '=', 'idcargo', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1436, 2554, '{consulta}0', '=', 'idproyecto', 'and');
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1437, 2555, 'idespecialidadpreparacion', '=', 'idespecialidad', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1438, 2557, 'idfila', '=', 'idcargo', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1242, 2315, '{consulta}now())', '>=', 'fhasta', 'or');
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1258, 2338, '{consulta}now())', '>=', 'fhasta', 'or');
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1271, 2347, '{consulta}now())', '>=', 'fhasta', 'or');
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1439, 2557, '{consulta}0', '=', 'idproyecto', 'and');
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1440, 2558, 'idtipoescala', '=', 'idtipoescala', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1441, 2562, 'idfila', '=', 'idcargo', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1442, 2562, '{consulta}0', '=', 'idproyecto', 'and');
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1443, 2563, 'idcargo', '=', 'idcargo', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1444, 2564, 'idcategocup', '=', 'idcategocup', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1445, 2568, 'idfila', '=', 'idcargo', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1446, 2568, '{consulta}0', '=', 'idproyecto', 'and');
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1447, 2569, 'idcargo', '=', 'idnomcargo', NULL);
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1361, 2467, '{consulta}now())', '>=', 'fhasta', 'or');
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1352, 2463, '{consulta}now())', '>=', 'fhasta', 'or');
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1344, 2458, '{consulta}now())', '>=', 'fhasta', 'or');
INSERT INTO dat_union (idunion, idmapeo, campoinicial, operador, campofinal, logico) VALUES (1250, 2320, '{consulta}now())', '>=', 'fhasta', 'or');
INSERT INTO nom_configuracion (idconfiguracion, denominacion, servidor, puerto, basedato, usuario, contrasena, claveproteccion, esquema, tabla, idtablabase) VALUES ('contratos', 'Recuperaciones para mostrar en los contratos', '10.12.170.102', 5432, 'distra-ch', 'zeolides', '20024114340201298346 11550504209581049503 74725448906263473676', '', 'mod_persona', 'dat_persona', '[{"campo":"idpersona"}]');
INSERT INTO nom_configuracion (idconfiguracion, denominacion, servidor, puerto, basedato, usuario, contrasena, claveproteccion, esquema, tabla, idtablabase) VALUES ('pago_resultado', 'Pago por resultado', '10.12.170.102', 5432, 'distra-ch', 'zeolides', '20024114340201298346 11550504209581049503 74725448906263473676', '', 'mod_nomina', 'conf_pagosporresultado', '[{"campo":"idpagoporresultado"}]');
INSERT INTO nom_configuracion (idconfiguracion, denominacion, servidor, puerto, basedato, usuario, contrasena, claveproteccion, esquema, tabla, idtablabase) VALUES ('aistencia', 'Recuperación de asistencia', '10.12.170.102', 5432, 'distra-ch', 'zeolides', '20024114340201298346 11550504209581049503 74725448906263473676', '', 'mod_persona', 'dat_persona', '[{"campo":"idpersona"}]');
INSERT INTO nom_configuracion (idconfiguracion, denominacion, servidor, puerto, basedato, usuario, contrasena, claveproteccion, esquema, tabla, idtablabase) VALUES ('seleccion', 'Recuperación del módulo de selección de personal', '10.12.170.102', 5432, 'distra-ch', 'zeolides', '20024114340201298346 11550504209581049503 74725448906263473676', '', 'mod_seleccion', 'dat_candidato', '[{"campo":"idcandidato"}]');
INSERT INTO nom_configuracion (idconfiguracion, denominacion, servidor, puerto, basedato, usuario, contrasena, claveproteccion, esquema, tabla, idtablabase) VALUES ('activarpersona', 'Activar personas eliminadas', '10.12.170.102', 5432, 'distra-ch', 'zeolides', '20024114340201298346 11550504209581049503 74725448906263473676', '', 'mod_persona', 'dat_persona', '[{"campo":"idpersona"}]');
INSERT INTO nom_configuracion (idconfiguracion, denominacion, servidor, puerto, basedato, usuario, contrasena, claveproteccion, esquema, tabla, idtablabase) VALUES ('personas', 'Recuperacion personas V2', '10.12.170.102', 5432, 'distra-ch', 'zeolides', '20024114340201298346 11550504209581049503 74725448906263473676', '', 'mod_persona', 'dat_persona', '[{"campo":"idpersona"}]');
INSERT INTO nom_configuracion (idconfiguracion, denominacion, servidor, puerto, basedato, usuario, contrasena, claveproteccion, esquema, tabla, idtablabase) VALUES ('estructura', 'Recuperaciones de Estructura y Composición', '10.12.170.102', 5432, 'distra-ch', 'zeolides', '20024114340201298346 11550504209581049503 74725448906263473676', '', 'mod_estructuracomp', 'nom_filaestruc', '[{"campo":"idfila"}]');
INSERT INTO seg_filtro (idfiltro, condicion, valor, logico, idcampo, idrol, orden, valormostrar) VALUES (42, 'IS NULL', '', '', 1644, 100000000001, 1, '');
INSERT INTO seg_filtro (idfiltro, condicion, valor, logico, idcampo, idrol, orden, valormostrar) VALUES (43, 'IS NOT NULL', '', '', 1593, 100000000001, 1, '');
SELECT pg_catalog.setval('sec_busqueda_seq', 79, true);
SELECT pg_catalog.setval('sec_busquedausuario_seq', 117, true);
SELECT pg_catalog.setval('sec_campo_seq', 1798, true);
SELECT pg_catalog.setval('sec_configcondicion_seq', 1405, true);
SELECT pg_catalog.setval('sec_configmostrar_seq', 1432, true);
SELECT pg_catalog.setval('sec_filtro_seq', 43, true);
SELECT pg_catalog.setval('sec_mapeo_seq', 2569, true);
SELECT pg_catalog.setval('sec_segcampo_seq', 0, true);
SELECT pg_catalog.setval('sec_union_seq', 1447, true);
--</lineabase>
--</data>

--<Restrictions>
-- Created By : ScriptSplitGenerador
-- Code: http://10.12.170.129:9880/reccomplejas/trunk/lineabase
-- Only Restrictions
SET statement_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;
SET search_path = mod_reccomplejas2, pg_catalog;
ALTER TABLE ONLY dat_busqueda
    ADD CONSTRAINT pk_busqueda PRIMARY KEY (idbusqueda);
COMMENT ON CONSTRAINT pk_busqueda ON dat_busqueda IS 'LLave primaria para identificar la tupla.';
ALTER TABLE ONLY dat_busquedausuario
    ADD CONSTRAINT pk_busquedausuario PRIMARY KEY (idbusquedausuario);
COMMENT ON CONSTRAINT pk_busquedausuario ON dat_busquedausuario IS 'LLave primaria para identificar la tupla.';
ALTER TABLE ONLY dat_campo
    ADD CONSTRAINT pk_campo PRIMARY KEY (idcampo);
COMMENT ON CONSTRAINT pk_campo ON dat_campo IS 'LLave primaria para identificar la tupla.';
ALTER TABLE ONLY seg_campo
    ADD CONSTRAINT pk_camporol PRIMARY KEY (idsegcampo);
COMMENT ON CONSTRAINT pk_camporol ON seg_campo IS 'LLave primaria para identificar la tupla.';
ALTER TABLE ONLY dat_configcondicion
    ADD CONSTRAINT pk_configcondicion PRIMARY KEY (idconfigcondicion);
COMMENT ON CONSTRAINT pk_configcondicion ON dat_configcondicion IS 'LLave primaria para identificar la tupla.';
ALTER TABLE ONLY dat_configmostrar
    ADD CONSTRAINT pk_configmostrar PRIMARY KEY (idconfigmostrar);
COMMENT ON CONSTRAINT pk_configmostrar ON dat_configmostrar IS 'LLave primaria para identificar la tupla.';
ALTER TABLE ONLY nom_configuracion
    ADD CONSTRAINT pk_configuracion PRIMARY KEY (idconfiguracion);
COMMENT ON CONSTRAINT pk_configuracion ON nom_configuracion IS 'LLave primaria para identificar la tupla.';
ALTER TABLE ONLY seg_filtro
    ADD CONSTRAINT pk_filtrorol PRIMARY KEY (idfiltro);
COMMENT ON CONSTRAINT pk_filtrorol ON seg_filtro IS 'LLave primaria para identificar la tupla.';
ALTER TABLE ONLY dat_mapeo
    ADD CONSTRAINT pk_mapeo PRIMARY KEY (idmapeo);
COMMENT ON CONSTRAINT pk_mapeo ON dat_mapeo IS 'LLave primaria para identificar la tupla.';
ALTER TABLE ONLY dat_multievaluado
    ADD CONSTRAINT pk_multievaluado PRIMARY KEY (idcampo, valor, denominacion);
COMMENT ON CONSTRAINT pk_multievaluado ON dat_multievaluado IS 'LLave primaria para identificar la tupla.';
ALTER TABLE ONLY dat_union
    ADD CONSTRAINT pk_union PRIMARY KEY (idunion);
COMMENT ON CONSTRAINT pk_union ON dat_union IS 'LLave primaria para identificar la tupla.';
CREATE INDEX idx_aviso_busqueda ON dat_busqueda USING btree (idaviso);
CREATE INDEX idx_campo_campo_idpadre ON dat_campo USING btree (idpadre);
CREATE INDEX idx_campo_configmostrar_idcampo ON dat_configmostrar USING btree (idcampo);
ALTER TABLE ONLY dat_busquedausuario
    ADD CONSTRAINT fk_busqueda_busquedausuario FOREIGN KEY (idbusqueda) REFERENCES dat_busqueda(idbusqueda) ON UPDATE CASCADE ON DELETE CASCADE;
COMMENT ON CONSTRAINT fk_busqueda_busquedausuario ON dat_busquedausuario IS 'LLave foránea para identificar la relación y garantizar la integridad referencial entre las tablas (dat_busqueda y dat_busquedausuario).';
ALTER TABLE ONLY dat_campo
    ADD CONSTRAINT fk_campo_campo FOREIGN KEY (idpadre) REFERENCES dat_campo(idcampo) ON UPDATE CASCADE ON DELETE CASCADE;
COMMENT ON CONSTRAINT fk_campo_campo ON dat_campo IS 'LLave foránea para identificar la relación y garantizar la integridad referencial de la estructura arbólea en la tabla (dat_campo).';
ALTER TABLE ONLY seg_campo
    ADD CONSTRAINT fk_campo_campo FOREIGN KEY (idcampo) REFERENCES dat_campo(idcampo) ON UPDATE CASCADE ON DELETE CASCADE;
COMMENT ON CONSTRAINT fk_campo_campo ON seg_campo IS 'LLave foránea para identificar la relación y garantizar la integridad referencial entre las tablas (dat_campo y seg_campo).';
ALTER TABLE ONLY dat_configcondicion
    ADD CONSTRAINT fk_campo_configcondicion FOREIGN KEY (idcampo) REFERENCES dat_campo(idcampo) ON UPDATE CASCADE ON DELETE CASCADE;
COMMENT ON CONSTRAINT fk_campo_configcondicion ON dat_configcondicion IS 'LLave foránea para identificar la relación y garantizar la integridad referencial entre las tablas (dat_campo y dat_configcondicion).';
ALTER TABLE ONLY dat_configmostrar
    ADD CONSTRAINT fk_campo_configmostrar FOREIGN KEY (idcampo) REFERENCES dat_campo(idcampo) ON UPDATE CASCADE ON DELETE CASCADE;
COMMENT ON CONSTRAINT fk_campo_configmostrar ON dat_configmostrar IS 'LLave foránea para identificar la relación y garantizar la integridad referencial entre las tablas (dat_campo y dat_configmostrar).';
ALTER TABLE ONLY seg_filtro
    ADD CONSTRAINT fk_campo_filtro FOREIGN KEY (idcampo) REFERENCES dat_campo(idcampo) ON UPDATE CASCADE ON DELETE CASCADE;
COMMENT ON CONSTRAINT fk_campo_filtro ON seg_filtro IS 'LLave foránea para identificar la relación y garantizar la integridad referencial entre las tablas (dat_campo y seg_filtro).';
ALTER TABLE ONLY dat_mapeo
    ADD CONSTRAINT fk_campo_mapeo FOREIGN KEY (idcampo) REFERENCES dat_campo(idcampo) ON UPDATE CASCADE ON DELETE CASCADE;
COMMENT ON CONSTRAINT fk_campo_mapeo ON dat_mapeo IS 'LLave foránea para identificar la relación y garantizar la integridad referencial entre las tablas (dat_mapeo y dat_campo).';
ALTER TABLE ONLY dat_multievaluado
    ADD CONSTRAINT fk_campo_multievaluado FOREIGN KEY (idcampo) REFERENCES dat_campo(idcampo) ON UPDATE CASCADE ON DELETE CASCADE;
COMMENT ON CONSTRAINT fk_campo_multievaluado ON dat_multievaluado IS 'LLave foránea para identificar la relación y garantizar la integridad referencial entre las tablas (dat_campo y dat_multievaluado).';
ALTER TABLE ONLY dat_campo
    ADD CONSTRAINT fk_configuracion_campo FOREIGN KEY (idconfiguracion) REFERENCES nom_configuracion(idconfiguracion) ON UPDATE CASCADE ON DELETE CASCADE;
COMMENT ON CONSTRAINT fk_configuracion_campo ON dat_campo IS 'LLave foránea para identificar la relación y garantizar la integridad referencial entre las tablas (nom_configuracion y dat_campo).';
ALTER TABLE ONLY dat_union
    ADD CONSTRAINT fk_mapeo_union FOREIGN KEY (idmapeo) REFERENCES dat_mapeo(idmapeo) ON UPDATE CASCADE ON DELETE CASCADE;
COMMENT ON CONSTRAINT fk_mapeo_union ON dat_union IS 'LLave foránea para identificar la relación y garantizar la integridad referencial entre las tablas (dat_mapeo y dat_union).';
--</Restrictions>

--<Dependents>
--</Dependents>