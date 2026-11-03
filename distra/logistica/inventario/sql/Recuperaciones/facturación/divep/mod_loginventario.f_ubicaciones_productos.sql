CREATE OR REPLACE FUNCTION mod_loginventario.f_ubicaciones_productos(
	p_iddocumento numeric,
	p_codigo_indicador character varying)
    RETURNS text
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$

declare
rec record;
rec_mov_data record;
v_cont integer := 0;
v_suma_cantidades numeric := 0;
r_ubicacion text := 'Sin ubicación. ';
begin
	v_cont := 0;
	select dm.cantidad, dm.idproducto into rec_mov_data from mod_logistica.dat_movimiento as dm
	inner join mod_logistica.dat_documento d on d.iddocumento = dm.iddocumento
	where idproducto in ( SELECT idproducto FROM mod_logistica.dat_producto 
							where idindicador in (select idindicador from mod_datosmaestros.nom_indicador
													where (case when length(numeropieza) = 0 or numeropieza is null 
															then codigo else numeropieza end) = $2)
						)
	and d.iddocumento = $1;

	if (rec_mov_data.cantidad > 0) then
		--buscar ubicaciones del producto con capacidades de satisfacer
		for rec in ( select COUNT(*) OVER() AS total, concat(eup.descripcion,' ',eup2.descripcion,' ', eu.descripcion) as ubicacion
					, up.cantidad
				from mod_logubicacion.dat_ubicacionproducto up 
				inner join mod_logubicacion.dat_estructuraubicacion eu on eu.idestructuraubicacion = up.idubicacion
				left join mod_logubicacion.dat_estructuraubicacion eup2 on eup2.idestructuraubicacion = eu.idpadre 
					and eup2.idestructuraubicacion <> eup2.idpadre
				left join mod_logubicacion.dat_estructuraubicacion eup on eup.idarea = eu.idarea 
					and eup.idestructuraubicacion = eup.idpadre
				where up.cantidad > 0 and up.idproducto = rec_mov_data.idproducto
				order by up.idproducto, cantidad desc
			) 
		loop
			v_cont := v_cont + 1;
			if (rec.total = 1) then
				return rec.ubicacion||'( cantidad: '||rec.cantidad||')';
			elsif (rec.total > 1) then
					if(v_cont = 1) then
						r_ubicacion := rec.ubicacion||'( cantidad: '||rec.cantidad||')'||chr(10);
						v_suma_cantidades := v_suma_cantidades + rec.cantidad;
					else
						if (v_suma_cantidades < rec_mov_data.cantidad) then 
							r_ubicacion := r_ubicacion||rec.ubicacion||'( cantidad: '||rec.cantidad||')'||chr(10);
							v_suma_cantidades := v_suma_cantidades + rec.cantidad;
						else
							raise notice 'Necesidad cubierta: v_suma_cantidades: % > v_cant_demandada: %',v_suma_cantidades,rec_mov_data.cantidad;
						end if;
					end if;
			else
				return 'Sin ubicación disponible.';
			end if;			
		end loop;
		if (v_suma_cantidades < rec_mov_data.cantidad) then
			r_ubicacion := r_ubicacion||'( cantidad pendiente: '||(rec_mov_data.cantidad-v_suma_cantidades)||')'||chr(10);							
		end if;
	else
		return null;
	end if;
	return r_ubicacion;
end;
$BODY$;

ALTER FUNCTION mod_loginventario.f_ubicaciones_productos(numeric, character varying) OWNER TO zeolides;
