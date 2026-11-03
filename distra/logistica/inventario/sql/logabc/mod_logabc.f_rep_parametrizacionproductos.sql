
CREATE OR REPLACE FUNCTION mod_logabc.f_rep_parametrizacionproductos(
	p_idestructura numeric,
	p_idconfperiodosclasificacionabc numeric,
	p_idnaturaleza numeric,
	p_iddeposito numeric,
	p_numeropieza text)
    RETURNS SETOF mod_logabc.td_parametrizacionproductos 
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$
declare
	r_parametrosinventario record;
	v_cont int:= 0;
	v_consulta text:= ' ';
	v_consulta_dos text:= ' ';
	v_consulta_final text:= ' ';
	v_filtro text:= ' ';
	v_columnas text:= '  codigo character varying, precio numeric, producto character varying, lineaproducto character varying, iddeposito numeric, 
		logo character varying, entidad character varying, deposito text, clasificacion character varying, existencia numeric, disponibilidad numeric, ';
	a_statics_attributes text[]:= '{ codigo character varying, precio numeric, producto character varying, lineaproducto character varying, iddeposito numeric, 
		logo character varying, entidad character varying, deposito text, clasificacion character varying, existencia numeric, disponibilidad numeric}';
	a_dynamic_attributes text[];
	v_iteracion int:= 0;
	v_dynamic_type text:= ' ';
begin
	select * into v_columnas from mod_logabc.f_aux_addatributesparametrizacion(true);
	v_consulta := 'select i.numeropieza AS codigo, dp.precio, i.denominacion AS producto, nn.denominacion as lineaproducto, dpp.iddeposito::numeric,
						cg.urllogo as logo, e.denominacion as entidad, concat(deop.codigo,'' '',deop.denominacion) as deposito, dpp.valor, 
						idparametrosinventario, dp.idindicador					
					from mod_logabc.dat_parametrizacionproductos dpp
					inner join mod_logistica.dat_producto dp on dp.idproducto = dpp.idproducto
					inner join mod_datosmaestros.nom_indicador i on i.idindicador = dp.idindicador
					inner join mod_datosmaestros.nom_naturaleza nn on nn.idnaturaleza = i.idnaturaleza
					inner join mod_estructuracomp.dat_estructuraop deop on deop.idestructuraop = dpp.iddeposito
					inner join mod_estructuracomp.v_dametodasestructuras e on e.idestructura = dpp.idestructura
					left  join mod_logistica.conf_general cg on cg.idestructura = e.idestructura or cg.idestructura = deop.idestructuraop
					where dpp.idestructura = '||p_idestructura||' AND dpp.idconfperiodosclasificacionabc = '||p_idconfperiodosclasificacionabc||'';
	
	if (p_idnaturaleza is not null) then
		v_filtro := v_filtro||' AND i.idnaturaleza = '||p_idnaturaleza;
	end if;

	if (p_iddeposito is not null) then
		v_filtro := v_filtro||' AND dpp.iddeposito = '||p_iddeposito;
	end if;

	if (p_numeropieza is not null) then
		v_filtro := v_filtro||' AND i.numeropieza ilike ''''%'||p_numeropieza||'%'''' ';
	end if;

	if(v_filtro is not null) then
		v_consulta:= v_consulta||v_filtro;
	end if;

v_consulta_dos := '
	inner join ( SELECT c.idparametrosinventario, n.abreviatura, c.orden
FROM mod_logabc.conf_parametrosinventario c
INNER JOIN mod_logabc.nom_parametrosinventario n ON n.idparametrosinventario = c.idparametrosinventario
INNER JOIN mod_logabc.nom_tipoparametrosinventario tn ON tn.idtipoparametrosinventario = n.idtipoparametrosinventario
WHERE c.idestructura = 200530666 ORDER BY c.orden
) as TB on (TA.idparametrosinventario = TB.idparametrosinventario)
inner join ( select clasificacion, existencia, disponibilidad, idindicador from mod_loginventario.f_rep_clasificacionabclistado( '||'''{'||p_idestructura||'}'||''', '||p_idconfperiodosclasificacionabc||' ) ) as TC
	on (TA.idindicador = TC.idindicador)';

v_consulta_final:= 'SELECT * FROM crosstab( 
											''select 	TA.codigo, TA.precio, TA.producto, TA.lineaproducto, TA.iddeposito, 
														TA.logo, TA.entidad, TA.deposito, TC.clasificacion, TC.existencia, 
														TC.disponibilidad, TB.abreviatura, TA.valor::numeric(25,4)
												from (
														'''||v_consulta||''' ) as TA '''||v_consulta_dos||'''
											'',''select distinct abreviatura from mod_logabc.nom_parametrosinventario order by 1'') AS final_result ('||v_columnas||')';
v_consulta_final := (select replace(v_consulta_final,'''select i.numeropieza','select i.numeropieza'));
v_consulta_final := (select replace(v_consulta_final,'deop.codigo,'' '',deop.denominacion','deop.codigo,'''' '''',deop.denominacion'));
v_consulta_final := (select replace(v_consulta_final,''' ) as TA ''',' ) as TA '));
v_consulta_final := (select replace(v_consulta_final,'''Costo x unidad''','''''Costo x unidad'''''));
v_consulta_final := (select replace(v_consulta_final,''',''select',',''select'));
v_consulta_final := (select replace(v_consulta_final,'''{','''''{'));
v_consulta_final := (select replace(v_consulta_final,'}''','}'''''));

return query execute (v_consulta_final);
end;
$BODY$;

ALTER FUNCTION mod_logabc.f_rep_parametrizacionproductos(numeric, numeric, numeric, numeric, text) OWNER TO zeolides;
--select * from mod_logabc.f_rep_parametrizacionproductos(200531041, 8, null, null, null);