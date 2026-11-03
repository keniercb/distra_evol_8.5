--TYPE
DROP FUNCTION IF EXISTS mod_logabc.f_rep_parametrizacionproductos(numeric, numeric, numeric, numeric, text);
DROP TYPE IF EXISTS mod_logabc.td_parametrizacionproductos;
CREATE TYPE mod_logabc.td_parametrizacionproductos AS
(
	codigo character varying(255),
	producto character varying,
	idparametrizacionproductos numeric(19,0),
	idparametrosinventario numeric(19,0),
	valor numeric(25,4),
	idestructura numeric(19,0),
	iddeposito numeric(19,0),
	idconfperiodosclasificacionabc numeric(19,0),
	lineaproducto character varying(255),
	deposito text
);

ALTER TYPE mod_logabc.td_parametrizacionproductos OWNER TO zeolides;

--FUNCTION
CREATE OR REPLACE FUNCTION mod_logabc.f_rep_parametrizacionproductos(
	p_idestructura numeric,
	p_idconfperiodosclasificacionabc numeric,
	p_idnaturaleza numeric,
	p_iddeposito numeric,
	p_numeropieza text
)
    RETURNS SETOF mod_logabc.td_parametrizacionproductos
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$
declare
v_consulta text:= ' ';
v_filtro text:= ' ';
begin
	--(deop.codigo ||'' ''||deop.denominacion) as deposito
	v_consulta := 'select i.numeropieza AS codigo, i.denominacion AS producto, dpp.idparametrizacionproductos,
						dpp.idparametrosinventario, dpp.valor, dpp.idestructura, dpp.iddeposito, 
						dpp.idconfperiodosclasificacionabc, nn.denominacion as lineaproducto, 
						concat(deop.codigo, '' '', deop.denominacion) as deposito
					from mod_logabc.dat_parametrizacionproductos dpp
					inner join mod_logistica.dat_producto dp on dp.idproducto = dpp.idproducto
					inner join mod_datosmaestros.nom_indicador i on i.idindicador = dp.idindicador
					inner join mod_datosmaestros.nom_naturaleza nn on nn.idnaturaleza = i.idnaturaleza
					inner join mod_estructuracomp.dat_estructuraop deop on (deop.idestructuraop = dpp.iddeposito)
					where dpp.idestructura = '||p_idestructura||' AND dpp.idconfperiodosclasificacionabc = '||p_idconfperiodosclasificacionabc||'';
	if (p_idnaturaleza is not null) then
		v_filtro := v_filtro||' AND i.idnaturaleza = '||p_idnaturaleza;
	end if;

	if (p_iddeposito is not null) then
		v_filtro := v_filtro||' AND dpp.iddeposito = '||p_iddeposito;
	end if;

	if (p_numeropieza is not null) then
		v_filtro := v_filtro||' AND i.numeropieza ilike ''%'||p_numeropieza||'%'' ';
	end if;
return query execute (v_consulta||v_filtro);
end;
$BODY$;

ALTER FUNCTION mod_logabc.f_rep_parametrizacionproductos(numeric, numeric, numeric, numeric, text) OWNER TO zeolides;
--llamada
--select * from mod_logabc.f_rep_parametrizacionproductos(200531041, 8, 1000084, 200531153, '1606275180');
