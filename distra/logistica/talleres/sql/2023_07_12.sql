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
     ,sa.idarea as idarea, ett.denominacion as area, tod.importecobrar as importeacobrar
    , tod.nrodoc::numeric(19) as noorden, tod.actividad, tod.minimo, tod.maximo, tod.coeficiente, tod.dimension
     , v_logo as logo, et.denominacion as estructura
        FROM mod_logtaller.dat_trabajooperarios top
        inner join mod_logtaller.dat_trabajooperariosdetallado tod on (tod.idtrabajooperarios = top.idtrabajooperarios)
        inner join mod_persona.dat_persona per on(per.idpersona = top.idresponsable)
        left join mod_estructuracomp.dat_estructuraop et on(top.idestructuracomun = et.idestructuraop)
		left join mod_logtaller.conf_personaarea sa on(sa.idestructuracomun = top.idestructuracomun and per.idpersona = sa.idpersona)
		left join mod_estructuracomp.dat_estructuraop ett on(sa.idarea = ett.idestructuraop)
        left join mod_logistica.dat_documento fdoc on (tod.iddocfactura = fdoc.iddocumento)
        where top.idestructuracomun = p_idestructura --and tod.estado = 1
        and case when fdoc.iddocumento is not null then fdoc.estado = 4 else true end 
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
-----------------------------


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
     ,sa.idarea as idarea, ett.denominacion as area
     , case when top.importecobrar is not null then top.importecobrar else sum(tod.importecobrar)::numeric(19,2) end as importeacobrar
     , v_logo as logo, et.denominacion as estructura
        FROM mod_logtaller.dat_trabajooperarios top
        inner join mod_logtaller.dat_trabajooperariosdetallado tod on(top.idtrabajooperarios = tod.idtrabajooperarios)
        inner join mod_persona.dat_persona per on(per.idpersona = top.idresponsable)
        left join mod_estructuracomp.dat_estructuraop et on(top.idestructuracomun = et.idestructuraop)
		left join mod_logtaller.conf_personaarea sa on(sa.idestructuracomun = top.idestructuracomun and per.idpersona = sa.idpersona)
		left join mod_estructuracomp.dat_estructuraop ett on(sa.idarea = ett.idestructuraop)
        left join mod_logistica.dat_documento fdoc on (tod.iddocfactura = fdoc.iddocumento)
        where top.idestructuracomun = p_idestructura --and tod.estado = 1
        and case when fdoc.iddocumento is not null then fdoc.estado = 4 else true end
        and case when p_idperiodo is not null then top.idperiodo = p_idperiodo else true end
        group by per.nombre, per.papel, per.sapel, per.idsuin, sa.idarea, ett.denominacion, et.denominacion, top.importecobrar
)

loop
    RETURN NEXT v_rec;
end loop;

END;
$BODY$;