CREATE SEQUENCE IF NOT EXISTS mod_logtaller.sec_datactividadpersonas_seq
    INCREMENT 1
    START 1000000001
    MINVALUE 1000000000
    MAXVALUE 1099999999
    CACHE 1;

ALTER SEQUENCE mod_logtaller.sec_datactividad_seq
    OWNER TO zeolides;

COMMENT ON SEQUENCE mod_logtaller.sec_datactividad_seq
    IS 'Secuencia empleada para autogenerar el identificador de la tabla dat_ordenactividadpersonas. ';

-----------

CREATE TABLE IF NOT EXISTS mod_logtaller.dat_ordenactividadpersonas
(
    idordenactividadpersona numeric(19,0) NOT NULL DEFAULT nextval('mod_logtaller.sec_datactividadpersonas_seq'::regclass),
    idordenactividad numeric(19,0) NOT NULL,
    idresponsable numeric(19,0) NOT NULL,
    coeficiente numeric(19,2),
    dimension numeric(19,2),
    importecobrar numeric(19,2),
    observacion character varying(255),
    estadoeliminado numeric(1,0) DEFAULT 0,
    CONSTRAINT dat_actividadordenpersona_pkey PRIMARY KEY (idordenactividadpersona),
    CONSTRAINT dat_ordenactividad_fk FOREIGN KEY (idordenactividad)
    REFERENCES mod_logtaller.dat_ordenactividad (idordenactividad) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE CASCADE
    )
    WITH (
        OIDS = FALSE
        )
    TABLESPACE pg_default;

ALTER TABLE IF EXISTS mod_logtaller.dat_ordenactividadpersonas
    OWNER to zeolides;

COMMENT ON TABLE mod_logtaller.dat_ordenactividadpersonas
    IS 'Tabla para almacenar las personas asignadas a actividades por órdenes';

-----------------------------

DROP INDEX IF EXISTS mod_logtaller.dat_material_idx;

CREATE UNIQUE INDEX IF NOT EXISTS dat_material_idx
    ON mod_logtaller.dat_material USING btree
    (idproducto ASC NULLS LAST, idordentrabajo ASC NULLS LAST, idactividad ASC NULLS LAST)
    TABLESPACE pg_default;

INSERT INTO
    mod_logistica.nom_variableglobal
(
    nombre,
    valor
)
VALUES (
           'vg_operariosvarios',
           '0'
       );

-----------------------------

--DROP FUNCTION IF EXISTS mod_logtaller.f_operarios_orden_trabajo(numeric, character varying, character varying);
--DROP TYPE IF EXISTS mod_logtaller.td_operarios_orden_trabajo;

CREATE TYPE mod_logtaller.td_operarios_orden_trabajo AS
    (
    ci character varying(36),
    nombreapellidos text,
    idarea numeric(19),
    importeacobrar numeric(19,2),
    logo character varying(255),
    estructura character varying(100)
    );


CREATE OR REPLACE FUNCTION mod_logtaller.f_operarios_orden_trabajo(
	p_idestructura numeric,
	p_idperiodo numeric
)
RETURNS SETOF mod_logtaller.td_operarios_orden_trabajo
LANGUAGE 'plpgsql'

AS $BODY$

DECLARE

v_rec record;
v_logo character varying(255);

BEGIN

select urllogo into v_logo
from mod_logistica.conf_general
where idestructura = p_idestructura
;

for v_rec in (
	SELECT per.idsuin as ci, per.nombre||' '||per.papel||' '||per.sapel as nombreapellido
     ,per.idestructura as idarea
     , case when top.importecobrar is not null then top.importecobrar else sum(tod.importecobrar)::numeric(19,2) end as importeacobrar
     , v_logo as logo, et.denominacion as estructura
        FROM mod_logtaller.dat_trabajooperarios top
        inner join mod_logtaller.dat_trabajooperariosdetallado tod on(top.idtrabajooperarios = tod.idtrabajooperarios)
        inner join mod_persona.dat_persona per on(per.idpersona = top.idresponsable)
        left join mod_estructuracomp.dat_estructuraop et on(top.idestructuracomun = et.idestructuraop)
        where top.idestructuracomun = p_idestructura and tod.estado = 1
        and case when p_idperiodo is not null then top.idperiodo = p_idperiodo else true end
        group by per.nombre, per.papel, per.sapel, per.idsuin, per.idestructura, et.denominacion, top.importecobrar
)

loop
    RETURN NEXT v_rec;
end loop;

END;
$BODY$;

-------------

--DROP FUNCTION IF EXISTS mod_logtaller.td_operarios_orden_trabajo_detallado(numeric, character varying, character varying, numeric);
--DROP TYPE IF EXISTS mod_logtaller.td_operarios_orden_trabajo_detallado;
CREATE TYPE mod_logtaller.td_operarios_orden_trabajo_detallado AS
    (
    ci character varying(36),
    nombreapellidos text,
    idarea numeric(19),
    importeacobrar numeric(19,2),
    noorden numeric(19),
    actividad character varying(255),
    minimo numeric(19,2),
    maximo numeric(19,2),
    coeficiente numeric(19,2),
    dimension numeric(19,2),
    logo character varying(255),
    estructura character varying(100)
    );


CREATE OR REPLACE FUNCTION mod_logtaller.f_operarios_orden_trabajo_detallado(
	p_idestructura numeric,
	p_fechainicio character varying,
	p_fechafin character varying,
	p_idpersona numeric
)
RETURNS SETOF mod_logtaller.td_operarios_orden_trabajo_detallado
LANGUAGE 'plpgsql'

AS $BODY$

DECLARE

v_rec record;
v_logo character varying(255);

BEGIN

select urllogo into v_logo
from mod_logistica.conf_general
where idestructura = p_idestructura
;

for v_rec in (
	SELECT per.idsuin as ci, per.nombre||' '||per.papel||' '||per.sapel as nombreapellido
     ,per.idestructura as idarea, tod.importecobrar as importeacobrar
    , tod.nrodoc as noorden, tod.actividad, tod.minimo, tod.maximo, tod.coeficiente, tod.dimension
     , v_logo as logo, et.denominacion as estructura
        FROM mod_logtaller.dat_trabajooperarios top
        inner join mod_logtaller.dat_trabajooperariosdetallado tod on (tod.idtrabajooperarios = top.idtrabajooperarios)
        inner join mod_persona.dat_persona per on(per.idpersona = top.idresponsable)
        left join mod_estructuracomp.dat_estructuraop et on(top.idestructuracomun = et.idestructuraop)
        where top.idestructuracomun = p_idestructura
        and case when p_idpersona is not null then top.idresponsable = p_idpersona else true end
        and case when p_fechainicio is not null then tod.fecha >= p_fechainicio::date else true end
        and case when p_fechafin is not null then tod.fecha <= p_fechafin::date else true end
        order by per.idestructura, per.nombre, per.papel, per.sapel, tod.nrodoc
)

loop
    RETURN NEXT v_rec;
end loop;

END;
$BODY$;


--------

ALTER TABLE IF EXISTS mod_logtaller.dat_ordenactividadpersonas
    ADD COLUMN IF NOT EXISTS minimo numeric(19, 2);

ALTER TABLE IF EXISTS mod_logtaller.dat_ordenactividadpersonas
    ADD COLUMN IF NOT EXISTS maximo numeric(19, 2);

ALTER TABLE IF EXISTS mod_logtaller.dat_ordenactividadpersonas
    ADD COLUMN IF NOT EXISTS tipo numeric(1);

COMMENT ON COLUMN mod_logtaller.dat_ordenactividadpersonas.tipo
    IS '1-porcentual
2-unidad de medida
3-fijo';

-- ALTER TABLE IF EXISTS mod_logtaller.dat_ordenactividadpersonas
--     ADD COLUMN IF NOT EXISTS aprobado numeric(1);
--
-- ALTER TABLE IF EXISTS mod_logtaller.dat_ordenactividadpersonas
-- ALTER COLUMN aprobado SET DEFAULT 0;

----------

CREATE SEQUENCE IF NOT EXISTS mod_logtaller.sec_trabajooperarios_seq
    INCREMENT 1
    START 1000000001
    MINVALUE 1000000000
    MAXVALUE 1099999999
    CACHE 1;

ALTER SEQUENCE mod_logtaller.sec_trabajooperarios_seq
    OWNER TO zeolides;


CREATE TABLE IF NOT EXISTS mod_logtaller.dat_trabajooperarios
(
    idtrabajooperarios numeric(19,0) NOT NULL DEFAULT nextval('mod_logtaller.sec_trabajooperarios_seq'::regclass),
    idestructuracomun numeric(19,0) NOT NULL,
--     fechainicio date,
--     fechafin date,
    idresponsable numeric(19,0) NOT NULL,
    importecobrar numeric(19,2),
    observacion character varying(255),
    aprobado character varying(255),
    idperiodo numeric(19,0) NOT NULL,
    CONSTRAINT dat_trabajooperarios_pkey PRIMARY KEY (idtrabajooperarios)
    )
    WITH (
        OIDS = FALSE
        )
    TABLESPACE pg_default;

ALTER TABLE IF EXISTS mod_logtaller.dat_trabajooperarios
    OWNER to zeolides;


CREATE SEQUENCE IF NOT EXISTS mod_logtaller.sec_trabajooperariosdetallado_seq
    INCREMENT 1
    START 1000000001
    MINVALUE 1000000000
    MAXVALUE 1099999999
    CACHE 1;

ALTER SEQUENCE mod_logtaller.sec_trabajooperariosdetallado_seq
    OWNER TO zeolides;


CREATE TABLE IF NOT EXISTS mod_logtaller.dat_trabajooperariosdetallado
(
    idtrabajooperariosdetallado numeric(19,0) NOT NULL DEFAULT nextval('mod_logtaller.sec_trabajooperariosdetallado_seq'::regclass),
    idtrabajooperarios numeric(19,0) NOT NULL,
    importebase numeric(19,2),
    gastosbase numeric(19,2),
    minimo numeric(19,2),
    maximo numeric(19,2),
    coeficiente numeric(19,2),
    dimension numeric(19,2),
    importecobrar numeric(19,2),
    nrodoc character varying(255),
    idordentrabajo numeric(19,0),
    actividad character varying(255),
    idactividad numeric(19,0),
    um character varying(255),
    tipo numeric(1),
    fecha date,
    iddocfactura numeric(19,0),
    estado numeric(1,0) DEFAULT 0,
    fechasistema timestamp without time zone DEFAULT now(),
    CONSTRAINT dat_trabajooperariosdetallado_pkey PRIMARY KEY (idtrabajooperariosdetallado)
    )
    WITH (
        OIDS = FALSE
        )
    TABLESPACE pg_default;

ALTER TABLE IF EXISTS mod_logtaller.dat_trabajooperariosdetallado
    OWNER to zeolides;

COMMENT ON COLUMN mod_logtaller.dat_trabajooperariosdetallado.tipo
    IS '1-porcentual
2-unidad de medida
3-fijo';


-----------------------------------------------------------------------
--configuracion

CREATE SEQUENCE IF NOT EXISTS mod_logtaller.sec_confpersonaarea_seq
    INCREMENT 1
    START 1000000001
    MINVALUE 1000000000
    MAXVALUE 1099999999
    CACHE 1;

ALTER SEQUENCE mod_logtaller.sec_confpersonaarea_seq
    OWNER TO zeolides;

-----------

CREATE TABLE IF NOT EXISTS mod_logtaller.conf_personaarea
(
    idpersonaarea numeric(19,0) NOT NULL DEFAULT nextval('mod_logtaller.sec_confpersonaarea_seq'::regclass),
    idpersona numeric(19,0) NOT NULL,
    idarea numeric(19,0) NOT NULL,
    idestructuracomun numeric(19,0) NOT NULL,
    CONSTRAINT conf_personaarea_pkey PRIMARY KEY (idpersonaarea)
    )
    WITH (
        OIDS = FALSE
        )
    TABLESPACE pg_default;

ALTER TABLE IF EXISTS mod_logtaller.conf_personaarea
    OWNER to zeolides;

ALTER TABLE IF EXISTS mod_logtaller.conf_servicioarea
    ADD COLUMN IF NOT EXISTS idcentrodecosto numeric(19);

---

CREATE SEQUENCE IF NOT EXISTS mod_logtaller.sec_conftalleres_seq
    INCREMENT 1
    START 1000000001
    MINVALUE 1000000000
    MAXVALUE 1099999999
    CACHE 1;

ALTER SEQUENCE mod_logtaller.sec_conftalleres_seq
    OWNER TO zeolides;

-----------

CREATE TABLE IF NOT EXISTS mod_logtaller.conf_talleres
(
    idconftalleres numeric(19,0) NOT NULL DEFAULT nextval('mod_logtaller.sec_conftalleres_seq'::regclass),
    idestructuracomun numeric(19,0) NOT NULL,
    centrocostosporactividad numeric(1,0),
    CONSTRAINT conf_talleres_pkey PRIMARY KEY (idconftalleres)
    )
    WITH (
        OIDS = FALSE
        )
    TABLESPACE pg_default;

ALTER TABLE IF EXISTS mod_logtaller.conf_talleres
    OWNER to zeolides;

----

ALTER TABLE IF EXISTS mod_logtaller.dat_ordenactividad
    ADD COLUMN IF NOT EXISTS idcentrodecosto numeric(19);