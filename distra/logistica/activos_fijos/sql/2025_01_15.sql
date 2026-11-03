--añadiendo campo número inicial
ALTER TABLE IF EXISTS mod_logactivofijotangible.conf_parametrosgenerales
  ADD COLUMN IF NOT EXISTS numinicial NUMERIC(19,0);

--Modificando función para el número de inventario
-- DROP FUNCTION IF EXISTS mod_logactivofijotangible.f_generanroserie(numeric, numeric);
CREATE OR REPLACE FUNCTION mod_logactivofijotangible.f_generanroserie(p_iddocumento numeric, p_idestructura numeric)
    RETURNS void
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
DECLARE
v_sql varchar = '';
v_prefijo varchar = '';
v_doc_aft boolean := false;
datos_config record;

BEGIN
	datos_config := null;
	select exists(select d.iddocumento
	from mod_datosmaestros.dat_documentoprim as dp
	inner join mod_datosmaestros.nom_docprim as ndp on (dp.iddocumentos = ndp.iddocumentos)
	inner join mod_logistica.dat_documento as d on (d.iddoc = dp.iddoc)
	where d.iddocumento = $1 
			and
		upper(trim(sigla)) = 'MMAFT'
	) into v_doc_aft;

	if (v_doc_aft) then
		--último generado en la entidad
		select case when (ultimoinventario is null or ultimoinventario = '') 
					then numinicial else ultimoinventario::numeric end as numero, prefijo
			into datos_config
		from mod_logactivofijotangible.conf_parametrosgenerales
		where idestructura = $2;

		--el adicionar medios del documento adiciona en:
        --mod_logistica.dat_movimiento WHERE iddocumento = 1000788698
		    --mod_logactivofijotangible.dat_movregnumerico WHERE idmovimiento = 1001149724
		    --mod_logactivofijotangible.dat_movregnumericoactivo WHERE idmovregnumerico = 1000576771

		v_sql = 'create temp sequence IF NOT EXISTS seq_siguiente start ' || COALESCE(datos_config.numero::numeric,0) + 1 || ';';
		execute v_sql;

		if ( (datos_config.prefijo is not null) and (datos_config.prefijo != '') ) then
			v_prefijo = datos_config.prefijo || '-';
			update mod_logactivofijotangible.dat_movregnumericoactivo
			set nroinventario = v_prefijo || nextval('seq_siguiente')
			from (select mr.idmovregnumerico as idm
					from mod_logactivofijotangible.dat_movregnumerico mr
					inner join mod_logistica.dat_movimiento m on m.idmovimiento = mr.idmovimiento
					where m.iddocumento = $1) q
			where q.idm = idmovregnumerico;
			
			update mod_logactivofijotangible.conf_parametrosgenerales 
				set ultimoinventario = 
			(select split_part((select max(mra.nroinventario) from mod_logactivofijotangible.dat_movregnumericoactivo mra
			inner join mod_logactivofijotangible.dat_movregnumerico mr on mra.idmovregnumerico = mr.idmovregnumerico
			inner join mod_logistica.dat_movimiento m on m.idmovimiento = mr.idmovimiento where m.iddocumento = $1),'-',2))
			where idestructura = $2;
		else
			update mod_logactivofijotangible.dat_movregnumericoactivo
			set nroinventario = nextval('seq_siguiente')
			from (select mr.idmovregnumerico as idm
					from mod_logactivofijotangible.dat_movregnumerico mr
					inner join mod_logistica.dat_movimiento m on m.idmovimiento = mr.idmovimiento
					where m.iddocumento = $1) q
			where q.idm = idmovregnumerico;

			update mod_logactivofijotangible.conf_parametrosgenerales 
				set ultimoinventario = 
			(select split_part((select max(mra.nroinventario) from mod_logactivofijotangible.dat_movregnumericoactivo mra
			inner join mod_logactivofijotangible.dat_movregnumerico mr on mra.idmovregnumerico = mr.idmovregnumerico
			inner join mod_logistica.dat_movimiento m on m.idmovimiento = mr.idmovimiento where m.iddocumento = $1),'-',2))
			where idestructura = $2;
		end if;
		else
			raise notice 'El documento seleccionado no requiere número de inventario.';
	end if;
END;
$BODY$;

ALTER FUNCTION mod_logactivofijotangible.f_generanroserie(numeric, numeric) OWNER TO zeolides;
