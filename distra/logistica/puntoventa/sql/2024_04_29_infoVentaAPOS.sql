ALTER TABLE mod_logpuntoventa.dat_caja
  ADD UNIQUE (identificador);

-- FUNCTION: mod_logpuntoventa.f_procesarpedidosinfoventa(numeric)

-- DROP FUNCTION IF EXISTS mod_logpuntoventa.f_procesarpedidosinfoventa(numeric);

CREATE OR REPLACE FUNCTION mod_logpuntoventa.f_procesarpedidosinfoventa(
	p_idpedido numeric)
    RETURNS void
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE STRICT PARALLEL UNSAFE
AS $BODY$
DECLARE
  v_lineinfo record;
  v_datosareaventa record;
  v_recindicador record;
  v_lineprod varchar[];
  v_codprod varchar;
  v_cantidadprod numeric;
  v_precioprod numeric;
  v_importeprod numeric;
  v_contadoroper integer;
  v_nombretabla varchar;
  v_sql varchar;
  v_sql2 varchar;
BEGIN
   delete from mod_logpuntoventa.dat_pedidoproducto where idpedidotienda = p_idpedido;
   v_nombretabla := 'tem_infoventas_'||p_idpedido;
   select av.*, dc.idtiporegistradora into v_datosareaventa from mod_logpuntoventa.dat_areaventa av
   inner join mod_logpuntoventa.dat_pedidotienda pt on pt.idareaventa = av.idareaventa and pt.idpedidotienda = p_idpedido
   inner join mod_logpuntoventa.dat_caja dc on dc.identificador = pt.identificador;
     
   v_sql := 'CREATE TEMPORARY TABLE '||v_nombretabla||' ON COMMIT DROP AS (
   		select
		regexp_split_to_table(
			pt.infoventa
			, ''\n'') as linea 
		from mod_logpuntoventa.dat_pedidotienda pt
	   where pt.idpedidotienda ='|| p_idpedido||'
   )';
   execute v_sql;
	--'||$$'{$$ ||v_rangofecha.startdate|| $$}'$$||' and '||$$'{$$ ||v_rangofecha.enddate|| $$}'$$||'
	v_sql2 := 'select iv.linea from '||v_nombretabla||' iv';
   for v_lineinfo in execute v_sql2 loop
   		select
		array_agg(t.fragmento) into v_lineprod from (
			select regexp_split_to_table(v_lineinfo.linea, ';') as fragmento
		) t;  
   		if v_lineprod[4]::numeric = 4 then
			v_codprod := v_lineprod[5];
			if length(v_codprod) < 14 then
				v_codprod := SUBSTRING('00000000000000', 1, 14-length(v_codprod))||v_codprod;
			end if;
			v_cantidadprod := REGEXP_REPLACE(v_lineprod[8],',','')::numeric;
			v_importeprod := REGEXP_REPLACE(v_lineprod[9],',','')::numeric;
			v_precioprod := REGEXP_REPLACE(v_lineprod[17],',','')::numeric;
			/*if v_datosareaventa.idtiporegistradora = 2 then
				v_codprod := SUBSTRING(v_codprod, 2);
			end if;*/
			select ni.* into v_recindicador from mod_datosmaestros.nom_indicador ni
			inner join mod_datosmaestros.nom_indicadorhoja nih on nih.idindicador = ni.idindicador
			where nih.codigobarra = v_codprod or ni.codigo = v_codprod limit 1;
			if v_recindicador.tipo = 1 then
			INSERT INTO mod_logpuntoventa.dat_pedidoproducto(
				idpedidotienda, codreferencia, idindicador, idproducto, 
				cantidad, precio, importe, idumedida, enproceso, procesado, 
				devuelto, devolver, cantidadreal, preciounitario, tipo
			)
				select 
				p_idpedido, ni.numeropieza, ni.idindicador, dp.idproducto, v_cantidadprod, v_precioprod, v_importeprod, coalesce(dp.idumedida, ni.idumedida),
				0,0,0,0,v_cantidadprod,v_precioprod, ni.tipo
				from mod_datosmaestros.nom_indicador ni 
				inner join mod_datosmaestros.nom_indicadorhoja nih on nih.idindicador = ni.idindicador
				inner join (
					select dpp.idproducto, dpp.idindicador, dpp.idestructura, dpp.idumedida, (
						case when dpa.idproducto is null then 1 else 0 end
					) as activo from mod_logistica.dat_producto dpp
					left join mod_logistica.dat_productoinactivo dpa on dpa.idproducto = dpp.idproducto 
				) dp on dp.idindicador = ni.idindicador and dp.idestructura = v_datosareaventa.idestructuraop and dp.activo = 1
				where ni.codigo = v_codprod or nih.codigobarra = v_codprod;
				else 
					INSERT INTO mod_logpuntoventa.dat_pedidoproducto(
						idpedidotienda, codreferencia, idindicador, idproducto, 
						cantidad, precio, importe, idumedida, enproceso, procesado, 
						devuelto, devolver, cantidadreal, preciounitario, tipo
					)
						select 
						p_idpedido, ni.numeropieza, ni.idindicador, null, v_cantidadprod, v_precioprod, v_importeprod, ni.idumedida,
						0,0,0,0,v_cantidadprod,v_precioprod, ni.tipo
						from mod_datosmaestros.nom_indicador ni 
						inner join mod_datosmaestros.nom_indicadorhoja nih on nih.idindicador = ni.idindicador
						where ni.idindicador = v_recindicador.idindicador;
				end if;
					elseif array_length(v_lineprod,1)::numeric = 8 
						and REGEXP_REPLACE(v_lineprod[1],'\''','')::numeric = 0 and v_lineprod[2]::numeric = 0 and v_lineprod[3]::numeric = 0 and v_lineprod[4]::numeric = 0 and v_lineprod[5]::numeric = 6 then
						v_contadoroper := v_lineprod[8]::numeric;
					end if;
					raise notice 'linea %', v_lineinfo.linea;
   end loop;
   update mod_logpuntoventa.dat_pedidotienda set receiptnumber = v_contadoroper where idpedidotienda = p_idpedido;
   return;
   commit;
END;
$BODY$;

ALTER FUNCTION mod_logpuntoventa.f_procesarpedidosinfoventa(numeric)
    OWNER TO zeolides;


-- FUNCTION: mod_logpuntoventa.f_getpagopedido(numeric)

-- DROP FUNCTION IF EXISTS mod_logpuntoventa.f_getpagopedido(numeric);

CREATE OR REPLACE FUNCTION mod_logpuntoventa.f_getpagopedido(
	p_idpedido numeric)
    RETURNS SETOF mod_logpuntoventa.td_infopagopedido 
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$
	DECLARE

	v_rec mod_logpuntoventa.td_infopagopedido;
    v_pedidostienda record;
    v_infopago record;
    v_lineinfopago varchar[];

	BEGIN    
    select pt.* into v_pedidostienda from mod_logpuntoventa.dat_pedidotienda pt where pt.idpedidotienda = p_idpedido;
		for v_infopago in (
					select t.fragmento from (
							select regexp_split_to_table(v_pedidostienda.infopago, '\n') as fragmento
						) t
					)
		loop
        	select array_agg(t.fragmento) into v_lineinfopago from (
                        select regexp_split_to_table(v_infopago.fragmento, ';') as fragmento
                    ) t;
                if v_lineinfopago[4]::numeric = 6 then
                    --v_tipopago := (select np.idmodopago from mod_logpuntoventa.nom_modopago np where np.codigocaja = v_lineinfopago[5]::numeric limit 1);
                    v_rec.idpago = v_lineinfopago[5]::numeric;
                    v_rec.denominacion = REPLACE(v_lineinfopago[6],'"','');
                    v_rec.importe = REPLACE(v_lineinfopago[9],',','')::numeric;
                    --if v_tipopago is not null then
                        /*INSERT INTO mod_logpuntoventa.dat_desglosepago(
                        iddocumento, idformapago, importe)
                        VALUES (v_iddocumento, v_tipopago, v_importepago);*/
                        return next v_rec;
                    --end if;	
                end if;
		end loop;
	END;
$BODY$;

ALTER FUNCTION mod_logpuntoventa.f_getpagopedido(numeric)
    OWNER TO zeolides;
