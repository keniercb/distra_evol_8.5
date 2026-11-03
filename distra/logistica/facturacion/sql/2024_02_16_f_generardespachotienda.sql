-- FUNCTION: mod_logfacturacion.f_generardespachotienda(numeric, numeric, numeric, character varying)

-- DROP FUNCTION IF EXISTS mod_logfacturacion.f_generardespachotienda(numeric, numeric, numeric, character varying);

CREATE OR REPLACE FUNCTION mod_logfacturacion.f_generardespachotienda(
	p_idusuario numeric,
	p_idestructuracomun numeric,
	p_iddeposito numeric,
	p_destinos character varying)
    RETURNS numeric
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE STRICT PARALLEL UNSAFE
AS $BODY$
DECLARE
  v_facturas record;
  v_iddespacho numeric;
  v_countproductos numeric;
  v_centroentrega record;
BEGIN
	--Inicializando despacho
    for v_centroentrega in 
    (select DISTINCT cent.idestructura, (dest.codigo || ' ' || dest.denominacion) as estructura 
			from mod_logpuntoventa.dat_centroentregaalmacen cent
            inner join mod_estructuracomp.v_dametodasestructuras dest on dest.idestructura = cent.idestructura
			where cent.idestructura = any(cast(p_destinos as NUMERIC[]))
    ) LOOP
    	select count(DISTINCT pp.idindicador) into v_countproductos
        from mod_logpuntoventa.dat_pedidoproducto pp
        where pp.idpedidotienda in (
        	select pd.idpedido from mod_logistica.dat_documento dd
            inner join mod_logfacturacion.dat_docfactura df on df.idfactura = dd.iddocumento
            inner join mod_logpuntoventa.dat_pedidodocumento pd on pd.iddocumento = dd.iddocumento
            inner join mod_logpuntoventa.dat_pedidotienda pt on pt.idpedidotienda = pd.idpedido
            inner join mod_logpuntoventa.dat_areaventa av on av.idareaventa = pt.idareaventa
            left join mod_logfacturacion.dat_despachofactura desp on desp.idfactura = dd.iddocumento
            where av.idestructuraop = p_iddeposito and dd.estado = 1 and pd.tipo = 2 and desp.iddespachotienda is null and pt.id_state in (
                select ar.id_state from mod_logpuntoventa.dat_almacenregion ar
                inner join mod_logpuntoventa.dat_centroentregaalmacen cea on cea.iddeposito = ar.idestructura
                where cea.idestructura = v_centroentrega.idestructura
            )
        ) and (coalesce(pp.enproceso,0)-coalesce(pp.devolver,0)-coalesce(pp.devuelto,0)) > 0;
        if v_countproductos > 0 then 
            INSERT INTO 
              mod_logfacturacion.dat_despachotienda
            (
              nrodespacho,
              nroreferencia,
              fecha,
              idestructuracomun,
              iddeposito,
              idusuario,
              idcentroentrega,
              centroentrega
            )
            VALUES (
            (COALESCE((
                    select max(des.nrodespacho) from mod_logfacturacion.dat_despachotienda des 
                    where des.iddeposito = p_iddeposito
                  ),0)+1),
              (COALESCE((
                    select max(des.nroreferencia) from mod_logfacturacion.dat_despachotienda des 
                    where des.iddeposito = p_iddeposito
                  ),0)+1),
              now(),
              p_idestructuracomun,
              p_iddeposito,
              p_idusuario,
              v_centroentrega.idestructura,
              v_centroentrega.estructura
            ) returning iddespachotienda into v_iddespacho;
            
            INSERT INTO 
              mod_logfacturacion.dat_despachoproducto
            (
              idproducto, 	
              idindicador,
              iddespachotienda,
              cantidad,
              despachado
            )
            select DISTINCT pp.idproducto, pp.idindicador, v_iddespacho, sum(pp.cantidad-COALESCE(pp.devolver,0)/*-COALESCE(pp.devuelto,0)*/) as cantidad, 0
            from mod_logpuntoventa.dat_pedidoproducto pp
            where pp.idpedidotienda in (
                select pd.idpedido from mod_logistica.dat_documento dd
                inner join mod_logfacturacion.dat_docfactura df on df.idfactura = dd.iddocumento
                inner join mod_logpuntoventa.dat_pedidodocumento pd on pd.iddocumento = dd.iddocumento
                inner join mod_logpuntoventa.dat_pedidotienda pt on pt.idpedidotienda = pd.idpedido
                inner join mod_logpuntoventa.dat_areaventa av on av.idareaventa = pt.idareaventa
                left join mod_logfacturacion.dat_despachofactura desp on desp.idfactura = dd.iddocumento
                where av.idestructuraop = p_iddeposito and dd.estado = 1 and pd.tipo = 2 and desp.iddespachotienda is null and pt.id_state in (
                    select ar.id_state from mod_logpuntoventa.dat_almacenregion ar
                    inner join mod_logpuntoventa.dat_centroentregaalmacen cea on cea.iddeposito = ar.idestructura
                    where cea.idestructura = v_centroentrega.idestructura
                )
            ) and (coalesce(pp.enproceso,0)-coalesce(pp.devolver,0)-coalesce(pp.devuelto,0)) > 0 
            group by pp.idproducto,pp.idindicador;
    		
        
        for v_facturas in (
            select distinct dd.iddocumento from mod_logistica.dat_documento dd
            inner join mod_logfacturacion.dat_docfactura df on df.idfactura = dd.iddocumento
            inner join mod_logpuntoventa.dat_pedidodocumento pd on pd.iddocumento = dd.iddocumento
            inner join mod_logpuntoventa.dat_pedidotienda pt on pt.idpedidotienda = pd.idpedido
            inner join mod_logpuntoventa.dat_areaventa av on av.idareaventa = pt.idareaventa
            left join mod_logfacturacion.dat_despachofactura desp on desp.idfactura = dd.iddocumento
            where av.idestructuraop = p_iddeposito and dd.estado = 1 and pd.tipo = 2 and desp.iddespachotienda is null
            and pt.id_state in (
                select ar.id_state from mod_logpuntoventa.dat_almacenregion ar
                inner join mod_logpuntoventa.dat_centroentregaalmacen cea on cea.iddeposito = ar.idestructura
                where cea.idestructura = v_centroentrega.idestructura
            )
        ) loop
            INSERT INTO 
              mod_logfacturacion.dat_despachofactura
            (
              iddespachotienda,
              idfactura
            )
            VALUES (
              v_iddespacho,
              v_facturas.iddocumento
            );
        end loop;
       end if;
    end loop;
   return v_iddespacho;
END;
$BODY$;

ALTER FUNCTION mod_logfacturacion.f_generardespachotienda(numeric, numeric, numeric, character varying)
    OWNER TO zeolides;
