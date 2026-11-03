DROP FUNCTION IF EXISTS mod_persona.f_cantidad_por_niveleducacional(numeric[], date, date);
DROP TYPE IF EXISTS mod_persona.td_cant_por_nivel;
CREATE TYPE mod_persona.td_cant_por_nivel AS
(
	denominacion text,
	cantidad integer
);

ALTER TYPE mod_persona.td_cant_por_nivel OWNER TO zeolides;

CREATE OR REPLACE FUNCTION mod_persona.f_cantidad_por_niveleducacional(p_idcargos numeric[], p_fdesde date, p_fhasta date)
    RETURNS SETOF mod_persona.td_cant_por_nivel 
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$
DECLARE

	r_niveles record;
	r_personas record;
	v_rec mod_persona.td_cant_por_nivel;
	v_cant_pers bigint;
	v_cant_pers_sin_nivel bigint;
	v_cant bigint;	
	
BEGIN
	v_rec:=null;v_cant_pers_sin_nivel:=0;
	--personas a procesar sin nivel asosiado
	select count(p.idpersona) into v_cant_pers_sin_nivel from mod_persona.dat_persona as p
											inner join mod_persona.dat_personaentidad as pe on (p.idpersona = pe.idpersona)
											inner join mod_persona.dat_situacionlaboral as sl on (pe.idpersonaentidad = sl.idpersonaentidad)
											left join mod_personaext.dat_niveleducacional as dat_n on (dat_n.idpersona = p.idpersona)
											where p.feliminado is null
												and sl.principal = 1
												and sl.idcargo = any (p_idcargos)
												and sl.fdesde <= p_fhasta
												and (sl.estado = 0 or (sl.estado = 1 and sl.fhasta >= p_fdesde) or (sl.estado = 2 and sl.fhasta >= p_fdesde))
												and dat_n.idpersona is null;

	for r_niveles in (select idniveleducacional, denominacion from mod_personaext.nom_niveleducacional where fdesde <= now() and (fhasta >= now() or fhasta is null) order by orden)
	loop
		--por cada nivel del nomenclador
		--personas ocupando los cargos especificados en las fechas determinadas
		v_cant:= 0;
		with w_personas_seleccionadas as ( select p.idpersona from mod_persona.dat_persona as p
											inner join mod_persona.dat_personaentidad as pe on (p.idpersona = pe.idpersona)
											inner join mod_persona.dat_situacionlaboral as sl on (pe.idpersonaentidad = sl.idpersonaentidad)
											where p.feliminado is null
												and sl.principal = 1
												and sl.idcargo = any (p_idcargos)
												and sl.fdesde <= p_fhasta
												and (sl.estado = 0 or (sl.estado = 1 and sl.fhasta >= p_fdesde) or (sl.estado = 2 and sl.fhasta >= p_fdesde))
										)
		--max nivel de la persona
		select count(*) into v_cant from mod_personaext.dat_niveleducacional as dat_n
		inner join w_personas_seleccionadas as w_per_select on (w_per_select.idpersona = dat_n.idpersona)
		inner join mod_personaext.nom_niveleducacional as nom_n on (dat_n.idniveleducacional = nom_n.idniveleducacional)
		where dat_n.idpersona = w_per_select.idpersona and dat_n.idniveleducacional = r_niveles.idniveleducacional
			and dat_n.fdesde in (select max(dnie.fdesde) from mod_personaext.dat_niveleducacional as dnie where idpersona = w_per_select.idpersona);
		if(r_niveles.idniveleducacional = 0) then
			v_cant:=v_cant+v_cant_pers_sin_nivel;
		end if;
		v_rec.denominacion = r_niveles.denominacion;
		v_rec.cantidad = v_cant;
		return next v_rec;
	end loop;
	
END;
$BODY$;

ALTER FUNCTION mod_persona.f_cantidad_por_niveleducacional(numeric[], date, date) OWNER TO zeolides;
