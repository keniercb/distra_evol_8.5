-- FUNCTION: mod_logactivofijotangible.f_depreciarmediosentidadlinearecta(numeric, numeric)

-- DROP FUNCTION IF EXISTS mod_logactivofijotangible.f_depreciarmediosentidadlinearecta(numeric, numeric);

CREATE OR REPLACE FUNCTION mod_logactivofijotangible.f_depreciarmediosentidadlinearecta(
	idestructuracomun numeric,
	iddocumento numeric)
    RETURNS void
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
DECLARE            
                 
    v_fechacontable date;
    v_rec RECORD;
    v_idmovimiento NUMERIC;
    v_idmovrn NUMERIC;
  
BEGIN
 
    select f.fecha into v_fechacontable
    from mod_datosmaestros.dat_fecha f
    inner join mod_datosmaestros.dat_estructurasubsist des on des.idestructurasubsist = f.idestructurasubsist
    where des.idestructuracomun = $1 and des.idsubsistema = 11;

    for v_rec in
      select sub.* from
		  (select 	drna.idregnumerico, p.idproducto, drna.idestatustecnico, drna.idarearesp, drna.idcentrocosto,
					drna.idcolorprim, drna.idcolorsec, drna.idubicacion, drna.idactividad, drna.idtabla, drna.valoradquisicion,
					drna.depreciacionacumulada, drna.tasafiscal, drna.porcientorecuperacion, drna.valorcontable, drna.annofabricacion,
					drna.vidautil, drna.fechaadq, drna.fechaexpini, drna.fechaexpfin, drna.idcategoria, drna.idresponsable, drna.recursoconsumido,
					drna.cantidadrecursoconsumido, drna.importe, drna.nroinventario, drna.fechainicialgarantia, drna.fechafingarantia,
					drna.recursoconsumidomax, drna.arrendado, drna.valorcontablealternativo, drna.valoradquisicionalternativo,
					drna.depreciacionacumuladaalternativo, drna.datos,               
					case when (drna.valorcontable * drna.tasafiscal/100/(360/30) + drna.depreciacionacumulada > drna.valorcontable 
								or (drna.valorcontable * drna.tasafiscal/100/(360/30) = 0 and drna.tasafiscal > 0 and drna.depreciacionacumulada > 0)
							   ) then round((drna.valorcontable - drna.depreciacionacumulada),2)
							else round(drna.valorcontable * drna.tasafiscal/100/(360/30),2) 
					end as depreciacion,
					case when (round(drna.valorcontablealternativo * drna.tasafiscal/100/(360/30),2) + drna.depreciacionacumuladaalternativo > drna.valorcontablealternativo 
								or (round(drna.valorcontablealternativo * drna.tasafiscal/100/(360/30),2) = 0 and drna.tasafiscal > 0 and drna.depreciacionacumuladaalternativo > 0)
							   ) then round((drna.valorcontablealternativo - drna.depreciacionacumuladaalternativo),2)
							else round(drna.valorcontablealternativo * drna.tasafiscal/100/(360/30),2) 
						 end as depreciacionalternativo,
					drnat.idtipocombustible, drnat.nrocirculacion, drnat.nromatricula, drnat.nromotor1, drnat.nromotor2, drnat.indiceconsumo,
					drnat.indicativo, drnat.nollaveencendido, drnat.capacidad, drnat.vin, drnat.ficav, drnat.lot, drnat.combustibleasignado,
					drnat.vencimientoficav, drnat.vencimientolot, drnat.vencimientocirculacion, drnat.expedicioncirculacion, drnat.cantpersonapie,
					drnat.cantpersonasentado, drnat.normacombustible, drnat.idgps, drnat.idcategoriatransp, drnat.endeposito, drnat.kmasignado
			from mod_logactivofijotangible.dat_regnumericoactivo drna
			inner join mod_logactivofijotangible.nom_actividad na on drna.idactividad = na.idactividad  
			inner join mod_logactivofijotangible.dat_registronumerico drn on drna.idregnumerico = drn.idregnumerico
			inner join mod_logistica.dat_producto p on drn.idproducto = p.idproducto and p.idestructuracomun = $1
			inner join mod_datosmaestros.nom_indicador i on p.idindicador = i.idindicador and i.idnaturaleza not in (-7, -8, -5)
			inner join mod_datosmaestros.nom_indicadorhoja ih on ih.idindicador = i.idindicador
			inner join mod_logactivofijotangible.his_regnumericoestatus hrn on drn.idregnumerico = hrn.idregnumerico and hrn.fechafin is null and hrn.deprecia = 1 and hrn.fechainicio < v_fechacontable
			left  join mod_logactivofijotangible.dat_regnumericoactivotransp drnat on drnat.idregnumerico = drn.idregnumerico
			inner join mod_logactivofijotangible.nom_actividad nact on nact.idactividad = drna.idactividad
			inner join mod_logactivofijotangible.nom_depreciacion ndep on ndep.iddepreciacion = nact.iddepreciacion 
			where ( drna.idestadoperacion <> 7 and drna.idestadoperacion <> 0 and drna.esbaja = 0 and ndep.iddepreciacion = 2 and ih.isuh <> 1 ) order by p.idproducto
		  ) as sub
      where sub.depreciacion > 0 or sub.depreciacionalternativo > 0
     loop
	 	v_idmovimiento := null; v_idmovrn := null;
		if ((v_rec.depreciacion + v_rec.depreciacionacumulada) > v_rec.valorcontable) then v_rec.depreciacion = v_rec.valorcontable - v_rec.depreciacionacumulada; end if;
        if ((v_rec.depreciacionalternativo + v_rec.depreciacionacumuladaalternativo) > v_rec.valorcontablealternativo) then
            v_rec.depreciacionalternativo = v_rec.valorcontablealternativo - v_rec.depreciacionacumuladaalternativo;
        end if;
		-- BUSCO EL MOVIMIENTO
		select m.idmovimiento into v_idmovimiento from mod_logistica.dat_movimiento m where m.idproducto = v_rec.idproducto and m.iddocumento = $2;
      	-- CREO EL MOVIMIENTO SI NO EXISTE
         if(v_idmovimiento is null) then       
           insert into mod_logistica.dat_movimiento ( iddocumento, idproducto, cantidad, cronologia )
            values ( $2, v_rec.idproducto, 0, 0 ) returning idmovimiento into v_idmovimiento;
           end if;
         
		 insert into mod_logactivofijotangible.dat_movregnumerico ( idregnumerico, idmovimiento )
            values ( v_rec.idregnumerico, v_idmovimiento ) 
			on conflict on constraint ak_registro_movimiento do nothing returning idmovregnumerico into v_idmovrn;
            
            update mod_logactivofijotangible.dat_regnumericoactivo rna
				set ultimadepreciacion = v_rec.depreciacion, fechaultimadep = v_fechacontable,
                    depreciacionacumulada = rna.depreciacionacumulada + v_rec.depreciacion,
                    depreciacionacumuladaalternativo = rna.depreciacionacumuladaalternativo + v_rec.depreciacionalternativo
	         where rna.idregnumerico = v_rec.idregnumerico;
          	
			if (v_idmovrn is null) then
				select idmovregnumerico into v_idmovrn from mod_logactivofijotangible.dat_movregnumerico 
				where idregnumerico = v_rec.idregnumerico and idmovimiento= v_idmovimiento;
			end if;
			
            insert into mod_logactivofijotangible.dat_movregnumericoactivo ( idmovregnumerico, idestatustecnico, idarearesp, idcentrocosto, idcolorprim, 
																			 idcolorsec, idubicacion, idactividad, idtabla, valoradquisicion, 
																			 depreciacionacumulada, tasafiscal, porcientorecuperacion, valorcontable, annofabricacion, 
																			 vidautil, fechaadq, fechaexpini, fechaexpfin, depreciacion, 
																			 idcategoria, idresponsable, recursoconsumido, cantidadrecursoconsumido, importe, 
																			 nroinventario, fechainicialgarantia, fechafingarantia, recursoconsumidomax, arrendado, 
																			 valorcontablealternativo, valoradquisicionalternativo, depreciacionacumuladaalternativo, depreciacioncuc, datos
																		   )
				values ( v_idmovrn, v_rec.idestatustecnico, v_rec.idarearesp, v_rec.idcentrocosto, v_rec.idcolorprim, 
						 v_rec.idcolorsec, v_rec.idubicacion, v_rec.idactividad, v_rec.idtabla, v_rec.valoradquisicion, 
						 (v_rec.depreciacionacumulada + v_rec.depreciacion), v_rec.tasafiscal, v_rec.porcientorecuperacion, v_rec.valorcontable, v_rec.annofabricacion, 
						 v_rec.vidautil, v_rec.fechaadq, v_rec.fechaexpini,	 v_rec.fechaexpfin, v_rec.depreciacion,
						 v_rec.idcategoria, v_rec.idresponsable, v_rec.recursoconsumido, v_rec.cantidadrecursoconsumido, v_rec.importe, 
						 v_rec.nroinventario, v_rec.fechainicialgarantia, v_rec.fechafingarantia, v_rec.recursoconsumidomax, v_rec.arrendado, 
						 v_rec.valorcontablealternativo, v_rec.valoradquisicionalternativo, (v_rec.depreciacionacumuladaalternativo + v_rec.depreciacionalternativo), v_rec.depreciacionalternativo, v_rec.datos
            			);
				--on conflict on constraint pk_movregnumericoactivo do nothing;
          
            insert into mod_logactivofijotangible.dat_movregnumericoactivotransp ( idmovregnumerico, idtipocombustible, nrocirculacion, nromatricula, nromotor1, nromotor2,
																				   indiceconsumo, indicativo, nollaveencendido, capacidad, vin, ficav,
																				   lot, combustibleasignado, vencimientoficav, vencimientolot, vencimientocirculacion, expedicioncirculacion, 
																				   cantpersonapie, cantpersonasentado, normacombustible, idgps, idcategoriatransp, endeposito,
																				   kmasignado
																				 )
				values ( v_idmovrn, v_rec.idtipocombustible, v_rec.nrocirculacion, v_rec.nromatricula, v_rec.nromotor1, v_rec.nromotor2, 
						 v_rec.indiceconsumo, v_rec.indicativo,	v_rec.nollaveencendido, v_rec.capacidad, v_rec.vin, v_rec.ficav, 
						 v_rec.lot, v_rec.combustibleasignado, v_rec.vencimientoficav, v_rec.vencimientolot, v_rec.vencimientocirculacion, v_rec.expedicioncirculacion, 
						 v_rec.cantpersonapie, v_rec.cantpersonasentado, v_rec.normacombustible, v_rec.idgps, v_rec.idcategoriatransp, v_rec.endeposito, 
						 v_rec.kmasignado
            	);
			--on conflict on constraint pk_movregnumericoactivotransp do nothing;
            
           delete from mod_logactivofijotangible.his_regnumericoestatus hrn where hrn.idregnumerico = v_rec.idregnumerico;
           
           insert into mod_logactivofijotangible.his_regnumericoestatus ( idregnumerico, idestatustecnico, fechainicio, deprecia )
		   ( select rna.idregnumerico, rna.idestatustecnico, v_fechacontable, et.deprecia
        	 from mod_logactivofijotangible.dat_regnumericoactivo rna
        	 inner join mod_logactivofijotangible.nom_estatustecnico et on et.idestatustecnico = rna.idestatustecnico
        	 where rna.idregnumerico = v_rec.idregnumerico
          	);
			--on conflict on constraint pk_regnumericoestatus do nothing;
   
     end loop;
   
END;
$BODY$;

ALTER FUNCTION mod_logactivofijotangible.f_depreciarmediosentidadlinearecta(numeric, numeric)
    OWNER TO zeolides;