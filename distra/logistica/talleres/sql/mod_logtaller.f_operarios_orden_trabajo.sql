-- FUNCTION: mod_logtaller.f_operarios_orden_trabajo(numeric, numeric, boolean, character varying, date, date, numeric, numeric, numeric)

-- DROP FUNCTION IF EXISTS mod_logtaller.f_operarios_orden_trabajo(numeric, numeric, boolean, character varying, date, date, numeric, numeric, numeric);

DROP FUNCTION IF EXISTS mod_logtaller.f_operarios_orden_trabajo_detallado(numeric, numeric, numeric, date, date, numeric, numeric, numeric, character varying, character varying, numeric, numeric);
DROP TYPE IF EXISTS mod_logtaller.td_operarios_orden_trabajo_detallado;

CREATE TYPE mod_logtaller.td_operarios_orden_trabajo_detallado AS
(
	ci character varying,
	nombreapellidos text,
	idarea numeric(19,0),
	area character varying(100),
	importeacobrar numeric(19,2),
	noorden numeric(19,0),
	actividad character varying(255),
	minimo numeric(19,2),
	maximo numeric(19,2),
	coeficiente numeric(19,2),
	dimension numeric(19,2),
	logo character varying(255),
	estructura character varying(100),
	idtrabajooperariosdetallado numeric(19,0),
	idtrabajooperarios numeric(19,0),
	nrodoc numeric(19,0),
	um character varying(255),
	fecha date,
	importebase numeric(19,2),
	gastosbase numeric(19,2),
	nrofactura numeric(19,0),
	iddocfactura numeric(19,0),
	cantidad bigint
);

ALTER TYPE mod_logtaller.td_operarios_orden_trabajo_detallado
    OWNER TO zeolides;

-- FUNCTION: mod_logtaller.f_operarios_orden_trabajo_detallado(numeric, numeric, numeric, date, date, numeric, numeric, numeric, character varying, character varying, numeric, numeric)

-- DROP FUNCTION IF EXISTS mod_logtaller.f_operarios_orden_trabajo_detallado(numeric, numeric, numeric, date, date, numeric, numeric, numeric, character varying, character varying, numeric, numeric);

CREATE OR REPLACE FUNCTION mod_logtaller.f_operarios_orden_trabajo_detallado(
	p_idestructura numeric,
	p_idarea numeric,
	p_idperiodo numeric,
	p_fechainicio date,
	p_fechafin date,
	p_idpersona numeric,
	p_idservicio numeric,
	p_idactividad numeric,
	p_criteriopersona character varying,
	p_criterionrodoc character varying,
	p_limit numeric,
	p_offset numeric)
    RETURNS SETOF mod_logtaller.td_operarios_orden_trabajo_detallado 
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$

DECLARE

v_rec record;
v_logo character varying(255);
v_arraypersona numeric[];

v_limit numeric = null;
v_offset numeric = 0;

BEGIN

IF p_limit is not null then
    v_limit = p_limit;
end if;

IF p_offset is not null then
    v_offset = p_offset;
end if;

select urllogo into v_logo
from mod_logistica.conf_general
where idestructura = p_idestructura
;

IF p_idpersona is not null then
    v_arraypersona = array_append(v_arraypersona, p_idpersona);
else
    SELECT distinct array_agg(per.idpersona) into v_arraypersona
    FROM mod_persona.dat_persona per
    inner join mod_persona.dat_personaentidad pere on(per.idpersona = pere.idpersona)
    inner join mod_persona.dat_docidentidad perdoc on(per.idpersona = perdoc.idpersona and perdoc.principal = 1)
    left join mod_logtaller.conf_personaarea pa on(pa.idpersona = per.idpersona and pa.idestructuracomun = p_idestructura)
    where pere.identidad = p_idestructura
    and pere.fdesde <= now()
    and (now() <= pere.fhasta OR pere.fhasta is null)
    and case when p_idarea is not null then pa.idarea = p_idarea else true end
    and case when p_criteriopersona is not null then 
    (
        perdoc.numero ilike '%' || p_criteriopersona || '%'
        or per.nombre ilike '%' || p_criteriopersona || '%'
        or per.snombre ilike '%' || p_criteriopersona || '%'
        or per.papel ilike '%' || p_criteriopersona || '%'
        or per.sapel ilike '%' || p_criteriopersona || '%'
    )
    else true end
    ;
end if;

for v_rec in (
	SELECT perdoc.numero as ci, per.nombre||' '||per.papel||' '||per.sapel as nombreapellido
     ,sa.idarea as idarea, ett.denominacion as area, tod.importecobrar as importeacobrar
    , tod.nrodoc::numeric(19) as noorden, tod.actividad, tod.minimo, tod.maximo, tod.coeficiente, tod.dimension
     , v_logo as logo, et.denominacion as estructura, 
     tod.idtrabajooperariosdetallado, tod.idtrabajooperarios, tod.nrodoc::numeric(19), tod.um, tod.fecha,
     tod.importebase, tod.gastosbase, fdoc.nrodoc as nrofactura, tod.iddocfactura,
     count(*) over() as cantidad
        FROM mod_logtaller.dat_trabajooperarios top
        inner join mod_logtaller.dat_trabajooperariosdetallado tod on (tod.idtrabajooperarios = top.idtrabajooperarios)
        inner join mod_persona.dat_persona per on(per.idpersona = top.idresponsable)
        inner join mod_persona.dat_docidentidad perdoc on(per.idpersona = perdoc.idpersona and perdoc.principal = 1)
        inner join mod_logtaller.conf_actividad ca on(ca.idactividad = tod.idactividad)
        left join mod_estructuracomp.dat_estructuraop et on(top.idestructuracomun = et.idestructuraop)
		left join mod_logtaller.conf_personaarea sa on(sa.idestructuracomun = top.idestructuracomun and per.idpersona = sa.idpersona)
		left join mod_estructuracomp.dat_estructuraop ett on(sa.idarea = ett.idestructuraop)
        left join mod_logistica.dat_documento fdoc on (tod.iddocfactura = fdoc.iddocumento)
        where top.idestructuracomun = p_idestructura
        and top.idresponsable = any(v_arraypersona)
        and case when fdoc.iddocumento is not null then fdoc.estado = 4 else true end 
        and case when p_idperiodo is not null then top.idperiodo = p_idperiodo else true end
        and case when p_fechainicio is not null then tod.fecha >= p_fechainicio::date else true end
        and case when p_fechafin is not null then tod.fecha <= p_fechafin::date else true end
        and case when p_idservicio is not null then ca.idpadre = p_idservicio else true end
        and case when p_idactividad is not null then tod.idactividad = p_idactividad else true end
        and case when p_criterionrodoc is not null then tod.nrodoc ilike '%' || p_criterionrodoc || '%' else true end
        order by per.idestructura, per.nombre, per.papel, per.sapel, tod.nrodoc, tod.fecha
        LIMIT v_limit
        OFFSET v_offset
)

loop
    RETURN NEXT v_rec;
end loop;

END;
$BODY$;

ALTER FUNCTION mod_logtaller.f_operarios_orden_trabajo_detallado(numeric, numeric, numeric, date, date, numeric, numeric, numeric, character varying, character varying, numeric, numeric)
    OWNER TO zeolides;

DROP FUNCTION IF EXISTS mod_logtaller.f_operarios_orden_trabajo(numeric, numeric);
DROP TYPE IF EXISTS mod_logtaller.td_operarios_orden_trabajo;
CREATE TYPE mod_logtaller.td_operarios_orden_trabajo AS
(
	ci character varying,
	nombreapellidos text,
	idarea numeric(19,0),
	area character varying(100),
	importeacobrar numeric(19,2),
	logo character varying(255),
	estructura character varying(100),
	idresponsable numeric(19,0),
	idtrabajooperarios numeric(19,0),
	observacion character varying,
	aprobado character varying,
	importereal numeric(19,2),
	importebase numeric(19,2),
	idbonpen numeric(1,0),
	idtipobonpen numeric,
	bonpen numeric(19,2),
	cantidad bigint
);

ALTER TYPE mod_logtaller.td_operarios_orden_trabajo
    OWNER TO zeolides;


CREATE OR REPLACE FUNCTION mod_logtaller.f_operarios_orden_trabajo(
	p_idestructura numeric,
	p_idperiodo numeric,
	p_solotpconvalor boolean,
	p_criterio character varying,
	p_fechainicio date,
	p_fechafin date,
	p_idarea numeric,
	p_limit numeric,
	p_offset numeric)
    RETURNS SETOF mod_logtaller.td_operarios_orden_trabajo 
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$

DECLARE

v_rec record;
v_logo character varying(255);
v_arraypersona numeric[];
v_limit numeric = null;
v_offset numeric = 0;

BEGIN

IF p_limit is not null then
    v_limit = p_limit;
end if;

IF p_offset is not null then
    v_offset = p_offset;
end if;

select urllogo into v_logo
from mod_logistica.conf_general
where idestructura = p_idestructura
;

SELECT distinct array_agg(per.idpersona) into v_arraypersona
FROM mod_persona.dat_persona per
inner join mod_persona.dat_personaentidad pere on(per.idpersona = pere.idpersona)
inner join mod_persona.dat_docidentidad perdoc on(per.idpersona = perdoc.idpersona and perdoc.principal = 1)
left join mod_logtaller.conf_personaarea pa on(pa.idpersona = per.idpersona and pa.idestructuracomun = p_idestructura)
where pere.identidad = p_idestructura
and pere.fdesde <= now()
and (now() <= pere.fhasta OR pere.fhasta is null)
and case when p_idarea is not null then pa.idarea = p_idarea else true end
and case when p_criterio is not null then 
(
    perdoc.numero ilike '%' || p_criterio || '%'
    or per.nombre ilike '%' || p_criterio || '%'
    or per.snombre ilike '%' || p_criterio || '%'
    or per.papel ilike '%' || p_criterio || '%'
    or per.sapel ilike '%' || p_criterio || '%'
)
 else true end
;

for v_rec in (
	select a.ci, a.nombreapellido, a.idarea, a.area, a.importeacobrar::numeric(19,2), v_logo as logo, a.estructura,
        b.idresponsable, a.idtrabajooperarios, a.observacion, a.aprobado, a.importebase::numeric(19,2) as importereal, coalesce(c.importebase::numeric(19,2), a.importebase::numeric(19,2)) as importebase
            , c.idbonpen, c.idtipobonpen, c.bonpen, count(*) over() as cantidad
        from (
            SELECT top.idresponsable, top.idtrabajooperarios, top.observacion, top.aprobado
            , case when top.importecobrar is not null then top.importecobrar else sum(tod.importecobrar) end as importeacobrar
            , coalesce(sum(tod.importecobrar), 0) as importebase,
            perdoc.numero as ci, per.nombre||' '||per.papel||' '||per.sapel as nombreapellido,
            sa.idarea as idarea, ett.denominacion as area, et.denominacion as estructura
            FROM mod_logtaller.dat_trabajooperarios top
            inner join mod_logtaller.dat_trabajooperariosdetallado tod on(top.idtrabajooperarios = tod.idtrabajooperarios)
            inner join mod_persona.dat_persona per on(per.idpersona = top.idresponsable)
            inner join mod_persona.dat_docidentidad perdoc on(per.idpersona = perdoc.idpersona and perdoc.principal = 1)
            left join mod_logistica.dat_documento fdoc on (tod.iddocfactura = fdoc.iddocumento)
            left join mod_logtaller.conf_personaarea sa on(sa.idestructuracomun = top.idestructuracomun and per.idpersona = sa.idpersona)
            left join mod_estructuracomp.dat_estructuraop et on(top.idestructuracomun = et.idestructuraop)
            left join mod_estructuracomp.dat_estructuraop ett on(sa.idarea = ett.idestructuraop)
            where top.idestructuracomun = p_idestructura
            and top.idresponsable = any(v_arraypersona)
            and case when fdoc.iddocumento is not null then fdoc.estado = 4 else true end
            and case when p_idperiodo is not null then top.idperiodo = p_idperiodo else true end
            and case when p_fechainicio is not null then tod.fecha >= p_fechainicio else true end
            and case when p_fechafin is not null then tod.fecha <= p_fechafin else true end
            group by top.idresponsable, top.idtrabajooperarios, top.observacion, top.aprobado,
            perdoc.numero, per.nombre, per.papel, per.sapel, sa.idarea, ett.denominacion, et.denominacion
        ) a
        right join (
            SELECT per.idpersona as idresponsable,
            per.nombre||' '||per.papel||' '||per.sapel as nombreapellido
            FROM mod_persona.dat_persona per
            where per.idpersona = any(v_arraypersona)
        ) b on(a.idresponsable = b.idresponsable)
        left join mod_logtaller.dat_bonificacionpenalizacion c on(a.idtrabajooperarios = c.idtrabajooperarios and c.idestado = 1)
        where case when p_solotpconvalor is not null then a.idtrabajooperarios is not null else true end
        order by a.nombreapellido, b.nombreapellido
        LIMIT v_limit
        OFFSET v_offset
)

loop
    RETURN NEXT v_rec;
end loop;

END;
$BODY$;

ALTER FUNCTION mod_logtaller.f_operarios_orden_trabajo(numeric, numeric, boolean, character varying, date, date, numeric, numeric, numeric)
    OWNER TO zeolides;
