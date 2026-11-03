-- FUNCTION: mod_logistica.fn_movperiodo(numeric, character varying, character varying, numeric)

-- DROP FUNCTION IF EXISTS mod_logistica.fn_movperiodo(numeric, character varying, character varying, numeric);

CREATE OR REPLACE FUNCTION mod_logistica.fn_movperiodo(
	p_idalmacen numeric,
	p_fechaini character varying,
	p_fechafin character varying,
	p_idclasificacion numeric)
    RETURNS SETOF mod_logistica.td_movperiodo 
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$
DECLARE
  v_result mod_logistica.td_movperiodo;
BEGIN
	for v_result in ( select 0 as cuadrado, 0 as descuadre, '' as formula, ni.numeropieza, ni.denominacion, dum.abreviaturaunidadmedida,
    					/*COALESCE((select dm.existenciaactual from mod_logistica.dat_movimiento dm
            						inner join mod_logistica.dat_documento dd using(iddocumento)
            						inner join mod_datosmaestros.dat_documentoprim ddp on ddp.iddoc = dd.iddoc 
            						inner join mod_datosmaestros.nom_docprim ndp on ndp.iddocumentos = ddp.iddocumentos
            						where dm.idproducto = dp.idproducto 
            							and (dd.fechacontable = cast(p_fechaini as date) or dm.fecha = cast(p_fechaini as date))
                						and ndp.abreviatura in ('recepcionLog')
                						and dd.estado = 4
            						order by dd.cronologia asc limit 1            
      							),0)*/
						coalesce((select dm.existenciaactual from mod_logistica.dat_movimiento dm
                  								inner join mod_logistica.dat_documento dd using(iddocumento)
                  								inner join mod_datosmaestros.dat_documentoprim ddp on ddp.iddoc = dd.iddoc 
                  								inner join mod_datosmaestros.nom_docprim ndp on ndp.iddocumentos = ddp.iddocumentos
                  								where dd.estado in (4,7,8) and dm.idproducto = dp.idproducto
                      								and (dd.fechacontable < cast(p_fechaini as date))
                  								order by dd.cronologia desc 
											 	limit 1
            								),0),--saldoinicio
						((COALESCE((select sum(coalesce(dm.cantidad,0)) from mod_logistica.dat_movimiento dm
            						inner join mod_logistica.dat_documento dd using(iddocumento)
            						inner join mod_datosmaestros.dat_documentoprim ddp on ddp.iddoc = dd.iddoc 
            						inner join mod_datosmaestros.nom_docprim ndp on ndp.iddocumentos = ddp.iddocumentos
            						where dm.idproducto = dp.idproducto 
            							and (dd.fechacontable between cast(p_fechaini as date) and cast(p_fechafin as date))
                						and ndp.abreviatura in ('recepcionLog', 'valedev') and dd.iddocumento <> 1000286508
                						and dd.estado in (4,7)
      							),0) +
	 					COALESCE((select sum(coalesce(dm.cantidad,0)) from mod_logistica.dat_movimiento dm
            						inner join mod_logistica.dat_documento dd using(iddocumento)
            						inner join mod_datosmaestros.dat_documentoprim ddp on ddp.iddoc = dd.iddoc 
            						inner join mod_datosmaestros.nom_docprim ndp on ndp.iddocumentos = ddp.iddocumentos
									inner join mod_datosmaestros.nom_operacion op on op.idnomoperaciones = dd.idoperacion  
            						where dm.idproducto = dp.idproducto  
            							and (dd.fechacontable between cast(p_fechaini as date) and cast(p_fechafin as date))
                						and ndp.abreviatura in ('ajusteLog') and dd.iddocumento <> 1000286508
                						and dd.estado in (4,7)
			  							and op.codigooperacion in ('OPER_INV_SOBRANTE')
      							),0)
						)+(COALESCE((select sum(coalesce(dm.cantidad,0)) from mod_logistica.dat_movimiento dm
            						inner join mod_logistica.dat_documento dd using(iddocumento)
            						inner join mod_datosmaestros.dat_documentoprim ddp on ddp.iddoc = dd.iddoc 
            						inner join mod_datosmaestros.nom_docprim ndp on ndp.iddocumentos = ddp.iddocumentos
            						where dm.idproducto = dp.idproducto 
            							and (dd.fechacontable between cast(p_fechaini as date) and cast(p_fechafin as date))
                						and ndp.abreviatura in ('valeLog', 'facturaLog', 'transferenciaLog') and dd.iddocumento <> 1000286508
                						and dd.estado = 8
      							),0) +
	 					COALESCE((select sum(coalesce(dm.cantidad,0)) from mod_logistica.dat_movimiento dm
            						inner join mod_logistica.dat_documento dd using(iddocumento)
            						inner join mod_datosmaestros.dat_documentoprim ddp on ddp.iddoc = dd.iddoc 
            						inner join mod_datosmaestros.nom_docprim ndp on ndp.iddocumentos = ddp.iddocumentos
									inner join mod_datosmaestros.nom_operacion op on op.idnomoperaciones = dd.idoperacion  
            						where dm.idproducto = dp.idproducto  
            							and (dd.fechacontable between cast(p_fechaini as date) and cast(p_fechafin as date))
                						and ndp.abreviatura in ('ajusteLog') and dd.iddocumento <> 1000286508
                						and dd.estado = 8
			  							and op.codigooperacion in ('OPER_INV_MERMA','OPER_INV_FALTANTE','OPER_INV_ROTURA','OPER_INV_BAJA')
      							),0)
						)) as entradas,--entradas
						((COALESCE((select sum(coalesce(dm.cantidad,0)) from mod_logistica.dat_movimiento dm
            						inner join mod_logistica.dat_documento dd using(iddocumento)
            						inner join mod_datosmaestros.dat_documentoprim ddp on ddp.iddoc = dd.iddoc 
            						inner join mod_datosmaestros.nom_docprim ndp on ndp.iddocumentos = ddp.iddocumentos
            						where dm.idproducto = dp.idproducto 
            							and (dd.fechacontable between cast(p_fechaini as date) and cast(p_fechafin as date))
                						and ndp.abreviatura in ('valeLog', 'facturaLog') and dd.iddocumento <> 1000286508
                						and dd.estado in (4,7)
      							),0) +
	 					COALESCE((select sum(coalesce(dm.cantidad,0)) from mod_logistica.dat_movimiento dm
            						inner join mod_logistica.dat_documento dd using(iddocumento)
            						inner join mod_datosmaestros.dat_documentoprim ddp on ddp.iddoc = dd.iddoc 
            						inner join mod_datosmaestros.nom_docprim ndp on ndp.iddocumentos = ddp.iddocumentos
									inner join mod_datosmaestros.nom_operacion op on op.idnomoperaciones = dd.idoperacion  
            						where dm.idproducto = dp.idproducto  
            							and (dd.fechacontable between cast(p_fechaini as date) and cast(p_fechafin as date))
                						and ndp.abreviatura in ('ajusteLog') and dd.iddocumento <> 1000286508
                						and dd.estado in (4,7)
			  							and op.codigooperacion in ('OPER_INV_MERMA','OPER_INV_FALTANTE','OPER_INV_ROTURA','OPER_INV_BAJA')
      							),0)
						)+(COALESCE((select sum(coalesce(dm.cantidad,0)) from mod_logistica.dat_movimiento dm
            						inner join mod_logistica.dat_documento dd using(iddocumento)
            						inner join mod_datosmaestros.dat_documentoprim ddp on ddp.iddoc = dd.iddoc 
            						inner join mod_datosmaestros.nom_docprim ndp on ndp.iddocumentos = ddp.iddocumentos
            						where dm.idproducto = dp.idproducto 
            							and (dd.fechacontable between cast(p_fechaini as date) and cast(p_fechafin as date))
                						and ndp.abreviatura in ('recepcionLog', 'valedev') and dd.iddocumento <> 1000286508
                						and dd.estado = 8
      							),0) +
	 					COALESCE((select sum(coalesce(dm.cantidad,0)) from mod_logistica.dat_movimiento dm
            						inner join mod_logistica.dat_documento dd using(iddocumento)
            						inner join mod_datosmaestros.dat_documentoprim ddp on ddp.iddoc = dd.iddoc 
            						inner join mod_datosmaestros.nom_docprim ndp on ndp.iddocumentos = ddp.iddocumentos
									inner join mod_datosmaestros.nom_operacion op on op.idnomoperaciones = dd.idoperacion  
            						where dm.idproducto = dp.idproducto  
            							and (dd.fechacontable between cast(p_fechaini as date) and cast(p_fechafin as date))
                						and ndp.abreviatura in ('ajusteLog') and dd.iddocumento <> 1000286508
                						and dd.estado = 8
			  							and op.codigooperacion in ('OPER_INV_SOBRANTE')
      							),0)
						)) as salidas,
					 	(COALESCE((select sum(coalesce(dm.cantidad,0)) from mod_logistica.dat_movimiento dm
            						inner join mod_logistica.dat_documento dd using(iddocumento)
            						inner join mod_datosmaestros.dat_documentoprim ddp on ddp.iddoc = dd.iddoc 
            						inner join mod_datosmaestros.nom_docprim ndp on ndp.iddocumentos = ddp.iddocumentos
            						inner join mod_logistica.dat_documentocliente ddc using(iddocumento)
            						where dm.idproducto = dp.idproducto 
            							and (dd.fechacontable between cast(p_fechaini as date) and cast(p_fechafin as date))
                						and ndp.abreviatura in ('transferenciaLog')
                						and ddc.idcliente in (select vv.idestructura from mod_estructuracomp.v_dametodasestructuras vv 
															  where vv.idconcepto = 8)
                						and dd.estado in (4,7)
      							),0)-COALESCE((select sum(coalesce(dm.cantidad,0)) from mod_logistica.dat_movimiento dm
            						inner join mod_logistica.dat_documento dd using(iddocumento)
            						inner join mod_datosmaestros.dat_documentoprim ddp on ddp.iddoc = dd.iddoc 
            						inner join mod_datosmaestros.nom_docprim ndp on ndp.iddocumentos = ddp.iddocumentos
            						inner join mod_logistica.dat_documentocliente ddc using(iddocumento)
            						where dm.idproducto = dp.idproducto 
            							and (dd.fechacontable between cast(p_fechaini as date) and cast(p_fechafin as date))
                						and ndp.abreviatura in ('transferenciaLog')
                						and ddc.idcliente in (select vv.idestructura from mod_estructuracomp.v_dametodasestructuras vv 
															  where vv.idconcepto = 8)
                						and dd.estado = 8
      							),0)) as transfint,
						(COALESCE((select sum(coalesce(dm.cantidad,0)) from mod_logistica.dat_movimiento dm
            						inner join mod_logistica.dat_documento dd using(iddocumento)
            						inner join mod_datosmaestros.dat_documentoprim ddp on ddp.iddoc = dd.iddoc 
            						inner join mod_datosmaestros.nom_docprim ndp on ndp.iddocumentos = ddp.iddocumentos
            						inner join mod_logistica.dat_documentocliente ddc using(iddocumento)
            						where dm.idproducto = dp.idproducto 
            							and (dd.fechacontable between cast(p_fechaini as date) and cast(p_fechafin as date))
                						and ndp.abreviatura in ('transferenciaLog')
                						and ddc.idcliente in (select vv.idestructura from mod_estructuracomp.v_dametodasestructuras vv 
															  where vv.idconcepto <> 8)
                						and dd.estado in (4,7)
      							),0)-COALESCE((select sum(coalesce(dm.cantidad,0)) from mod_logistica.dat_movimiento dm
            						inner join mod_logistica.dat_documento dd using(iddocumento)
            						inner join mod_datosmaestros.dat_documentoprim ddp on ddp.iddoc = dd.iddoc 
            						inner join mod_datosmaestros.nom_docprim ndp on ndp.iddocumentos = ddp.iddocumentos
            						inner join mod_logistica.dat_documentocliente ddc using(iddocumento)
            						where dm.idproducto = dp.idproducto 
            							and (dd.fechacontable between cast(p_fechaini as date) and cast(p_fechafin as date))
                						and ndp.abreviatura in ('transferenciaLog')
                						and ddc.idcliente in (select vv.idestructura from mod_estructuracomp.v_dametodasestructuras vv 
															  where vv.idconcepto <> 8)
                						and dd.estado = 8
      							),0)) as transfext,
      					(select dm.existenciaactual from mod_logistica.dat_movimiento dm
            				inner join mod_logistica.dat_documento dd using(iddocumento)
							inner join mod_datosmaestros.dat_documentoprim ddp on ddp.iddoc = dd.iddoc 
            				inner join mod_datosmaestros.nom_docprim ndp on ndp.iddocumentos = ddp.iddocumentos
            				where dm.idproducto = dp.idproducto and (dd.fechacontable between cast(p_fechaini as date) and cast(p_fechafin as date)) 
            					and dd.estado in (4,7,8) and ndp.abreviatura <> 'cambioccontableLog'
            				order by dd.cronologia desc
						 	limit 1
      					) as saldo,
    					(select v.denominacion from mod_estructuracomp.v_dametodasestructuras v 
						 where v.idestructura = p_idalmacen limit 1) as almacen,
    					(select v.denominacion from mod_estructuracomp.v_dametodasestructuras v 
						 where v.idestructura = dp.idestructuracomun limit 1) as entidad,
    					dp.idproducto,
    					(select nc.denominacion from mod_logistica.nom_clasificacioncontable nc 
						 where nc.idclasificacioncontable = p_idclasificacion)
    				from mod_logistica.dat_producto dp
    				inner join mod_datosmaestros.nom_indicador ni using(idindicador)
    				inner join mod_datosmaestros.nom_unidadmedida dum on dum.idunidadmedida = dp.idumedida
    				where dp.idestructura = p_idalmacen and dp.idclasificacioncontable = p_idclasificacion
    					and dp.idproducto in ( select dm.idproducto from mod_logistica.dat_movimiento dm
            									inner join mod_logistica.dat_documento dd using(iddocumento)
            									inner join mod_logistica.dat_producto dp2 on dp2.idproducto = dm.idproducto
            									where (dd.fechacontable between cast(p_fechaini as date) and cast(p_fechafin as date)) 
            										and dp2.idestructura = p_idalmacen and dd.cronologia > 0
      										)
					order by ni.numeropieza
    			)
	loop
		v_result.formula:='';
		v_result.descuadre:= 0;
    	/*if v_result.saldoinicio = 0 then
        	v_result.saldoinicio = coalesce((select dm.existenciaactual from mod_logistica.dat_movimiento dm
                  								inner join mod_logistica.dat_documento dd using(iddocumento)
                  								inner join mod_datosmaestros.dat_documentoprim ddp on ddp.iddoc = dd.iddoc 
                  								inner join mod_datosmaestros.nom_docprim ndp on ndp.iddocumentos = ddp.iddocumentos
                  								where dd.estado = 4 and dm.idproducto = v_result.idproducto
                      								and (dd.fechacontable < cast(p_fechaini as date))
                  								order by dd.cronologia desc 
											 	limit 1
            								),0);
        else
        	v_result.entradas = v_result.entradas - v_result.saldoinicio;
        end if;*/
			v_result.descuadre:= (v_result.saldo) - ((v_result.saldoinicio + v_result.entradas) - (v_result.salidas + v_result.transfint + v_result.transfext));
			v_result.formula:='('||v_result.saldo||') - (('||v_result.saldoinicio||' + '||v_result.entradas||') - ('||v_result.salidas||'+'||v_result.transfint||' + '||v_result.transfext||'))';
		if( ((v_result.saldoinicio + v_result.entradas) - (v_result.salidas + v_result.transfint + v_result.transfext)) = v_result.saldo )then
			v_result.cuadrado = 1;
		end if;
		
    	return next v_result;
    end loop;
    
END;
$BODY$;

ALTER FUNCTION mod_logistica.fn_movperiodo(numeric, character varying, character varying, numeric)
    OWNER TO zeolides;
