CREATE OR REPLACE FUNCTION mod_logactivofijotangible.f_depreciarmediosentidadlinearecta (
  idestructuracomun numeric,
  iddocumento numeric
)
RETURNS void AS
$body$
DECLARE            
                 
    v_fechacontable date;
    v_rec RECORD;
    v_idmovimiento NUMERIC;
    v_idmovrn NUMERIC;
   
  
BEGIN
 
    SELECT f.fecha into v_fechacontable
    FROM mod_datosmaestros.dat_fecha f
    inner join mod_datosmaestros.dat_estructurasubsist des on des.idestructurasubsist = f.idestructurasubsist
    where des.idestructuracomun = $1 and des.idsubsistema = 11;

  

    FOR v_rec IN
      select sub.* from
      (select drna.idregnumerico, p.idproducto, drna.idestatustecnico, drna.idarearesp, drna.idcentrocosto,
      drna.idcolorprim,
              drna.idcolorsec,
              drna.idubicacion,
              drna.idactividad,
              drna.idtabla,
              drna.valoradquisicion,
              drna.depreciacionacumulada,
              drna.tasafiscal,
              drna.porcientorecuperacion,
              drna.valorcontable,
              drna.annofabricacion,
              drna.vidautil,
              drna.fechaadq,
              drna.fechaexpini,
              drna.fechaexpfin,
              drna.idcategoria,
              drna.idresponsable,
              drna.recursoconsumido,
              drna.cantidadrecursoconsumido,
              drna.importe,                              
              drna.nroinventario,
              drna.fechainicialgarantia,
              drna.fechafingarantia,
              drna.recursoconsumidomax,            
              drna.arrendado,
              drna.valorcontablealternativo,
              drna.valoradquisicionalternativo,
              drna.depreciacionacumuladaalternativo,
              drna.datos,               
             
      			
              case when 
              	drna.valorcontable * drna.tasafiscal/100/(360/30) + drna.depreciacionacumulada > drna.valorcontable 
              	OR (drna.valorcontable * drna.tasafiscal/100/(360/30) = 0 AND drna.tasafiscal > 0 AND drna.depreciacionacumulada > 0)
                
              then round((drna.valorcontable - drna.depreciacionacumulada),2)
              else round(drna.valorcontable * drna.tasafiscal/100/(360/30),2) 
              end as depreciacion,
               
              case when
                round(drna.valorcontablealternativo * drna.tasafiscal/100/(360/30),2) + drna.depreciacionacumuladaalternativo > drna.valorcontablealternativo 
              	OR (round(drna.valorcontablealternativo * drna.tasafiscal/100/(360/30),2) = 0 AND drna.tasafiscal > 0 AND drna.depreciacionacumuladaalternativo > 0)
               
              then round((drna.valorcontablealternativo - drna.depreciacionacumuladaalternativo),2)
              else round(drna.valorcontablealternativo * drna.tasafiscal/100/(360/30),2) 
              end as depreciacionalternativo,
            
              drnat.idtipocombustible,
              drnat.nrocirculacion,
              drnat.nromatricula,
              drnat.nromotor1,
              drnat.nromotor2,
              drnat.indiceconsumo,
              drnat.indicativo,
              drnat.nollaveencendido,
              drnat.capacidad,
              drnat.vin,
              drnat.ficav,
              drnat.lot,
              drnat.combustibleasignado,
              drnat.vencimientoficav,
              drnat.vencimientolot,
              drnat.vencimientocirculacion,
              drnat.expedicioncirculacion,
              drnat.cantpersonapie,
              drnat.cantpersonasentado,
              drnat.normacombustible,
              drnat.idgps,
              drnat.idcategoriatransp,
              drnat.endeposito,
              drnat.kmasignado
            
    
      FROM mod_logactivofijotangible.dat_regnumericoactivo drna
      INNER JOIN mod_logactivofijotangible.nom_actividad na ON drna.idactividad = na.idactividad  
      INNER JOIN mod_logactivofijotangible.dat_registronumerico drn ON drna.idregnumerico = drn.idregnumerico
      INNER JOIN mod_logistica.dat_producto p ON drn.idproducto = p.idproducto and p.idestructuracomun = $1
      INNER JOIN mod_datosmaestros.nom_indicador i ON p.idindicador = i.idindicador and i.idnaturaleza NOT IN (-7, -8, -5)
      INNER JOIN mod_datosmaestros.nom_indicadorhoja ih on ih.idindicador = i.idindicador
      INNER JOIN mod_logactivofijotangible.his_regnumericoestatus hrn ON drn.idregnumerico = hrn.idregnumerico and hrn.deprecia = 1 and hrn.fechainicio < v_fechacontable
      left JOIN mod_logactivofijotangible.dat_regnumericoactivotransp drnat on drnat.idregnumerico = drn.idregnumerico
      INNER JOIN mod_logactivofijotangible.nom_actividad nact on nact.idactividad = drna.idactividad
      INNER JOIN mod_logactivofijotangible.nom_depreciacion ndep on ndep.iddepreciacion = nact.iddepreciacion 
      
      WHERE (
          drna.idestadoperacion NOT IN (0,7)
          AND drna.esbaja = 0
          AND ndep.iddepreciacion = 2
          AND ih.isuh <> 1
          
      ) ORDER BY p.idproducto
      ) as sub
      where sub.depreciacion > 0 or sub.depreciacionalternativo > 0
     LOOP
         if ((v_rec.depreciacion + v_rec.depreciacionacumulada) > v_rec.valorcontable) THEN
            v_rec.depreciacion = v_rec.valorcontable - v_rec.depreciacionacumulada;
        end if;
        if ((v_rec.depreciacionalternativo + v_rec.depreciacionacumuladaalternativo) > v_rec.valorcontablealternativo) THEN
            v_rec.depreciacionalternativo = v_rec.valorcontablealternativo - v_rec.depreciacionacumuladaalternativo;
        end if;
         --RAISE NOTICE 'idregistro %',v_rec.idregnumerico;
       
         -- BUSCO EL MOVIMIENTO
         SELECT m.idmovimiento into v_idmovimiento
         from mod_logistica.dat_movimiento m
         where m.idproducto = v_rec.idproducto and m.iddocumento = $2;
       
         -- CREO EL MOVIMIENTO SI NO EXISTE
         if(v_idmovimiento is null) then       
           INSERT INTO
              mod_logistica.dat_movimiento
            (
              iddocumento,
              idproducto,            
              cantidad,
              cronologia          
            )
            VALUES (            
              $2,
              v_rec.idproducto,          
              0,
              0          
            ) RETURNING idmovimiento into v_idmovimiento;
           end if;
         
           INSERT INTO
              mod_logactivofijotangible.dat_movregnumerico
            (            
              idregnumerico,
              idmovimiento
            )
            VALUES (
              v_rec.idregnumerico,
              v_idmovimiento
            ) RETURNING idmovregnumerico into v_idmovrn;
            
            UPDATE mod_logactivofijotangible.dat_regnumericoactivo rna
				set
		     		ultimadepreciacion = v_rec.depreciacion,
        		    fechaultimadep = v_fechacontable,
                    depreciacionacumulada = rna.depreciacionacumulada + v_rec.depreciacion,
                    depreciacionacumuladaalternativo = rna.depreciacionacumuladaalternativo + v_rec.depreciacionalternativo
	         where rna.idregnumerico = v_rec.idregnumerico;
          
            INSERT INTO
              mod_logactivofijotangible.dat_movregnumericoactivo
            (
              idmovregnumerico,
              idestatustecnico,
              idarearesp,
              idcentrocosto,
              idcolorprim,
              idcolorsec,
              idubicacion,
              idactividad,
              idtabla,
              valoradquisicion,
              depreciacionacumulada,
              tasafiscal,
              porcientorecuperacion,
              valorcontable,
              annofabricacion,
              vidautil,
              fechaadq,
              fechaexpini,
              fechaexpfin,
              depreciacion,
              idcategoria,
              idresponsable,
              recursoconsumido,
              cantidadrecursoconsumido,
              importe,            
              nroinventario,
              fechainicialgarantia,
              fechafingarantia,
              recursoconsumidomax,            
              arrendado,
              valorcontablealternativo,
              valoradquisicionalternativo,
              depreciacionacumuladaalternativo,
              depreciacioncuc,
              datos
            )
            VALUES (
              v_idmovrn,
              v_rec.idestatustecnico,
              v_rec.idarearesp,
              v_rec.idcentrocosto,
              v_rec.idcolorprim,
              v_rec.idcolorsec,
              v_rec.idubicacion,
              v_rec.idactividad,
              v_rec.idtabla,
              v_rec.valoradquisicion,
              v_rec.depreciacionacumulada + v_rec.depreciacion,
              v_rec.tasafiscal,
              v_rec.porcientorecuperacion,
              v_rec.valorcontable,
              v_rec.annofabricacion,
              v_rec.vidautil,
              v_rec.fechaadq,
              v_rec.fechaexpini,
              v_rec.fechaexpfin,
              v_rec.depreciacion,
              v_rec.idcategoria,
              v_rec.idresponsable,
              v_rec.recursoconsumido,
              v_rec.cantidadrecursoconsumido,
              v_rec.importe,            
              v_rec.nroinventario,
              v_rec.fechainicialgarantia,
              v_rec.fechafingarantia,
              v_rec.recursoconsumidomax,
              v_rec.arrendado,
              v_rec.valorcontablealternativo,
              v_rec.valoradquisicionalternativo,
              v_rec.depreciacionacumuladaalternativo + v_rec.depreciacionalternativo,
              v_rec.depreciacionalternativo,
              v_rec.datos
            );  
          
            INSERT INTO
              mod_logactivofijotangible.dat_movregnumericoactivotransp
            (
              idmovregnumerico,
              idtipocombustible,
              nrocirculacion,
              nromatricula,
              nromotor1,
              nromotor2,
              indiceconsumo,
              indicativo,
              nollaveencendido,
              capacidad,
              vin,
              ficav,
              lot,
              combustibleasignado,
              vencimientoficav,
              vencimientolot,
              vencimientocirculacion,
              expedicioncirculacion,
              cantpersonapie,
              cantpersonasentado,
              normacombustible,
              idgps,
              idcategoriatransp,
              endeposito,
              kmasignado
            )
            VALUES (
              v_idmovrn,
              v_rec.idtipocombustible,
              v_rec.nrocirculacion,
              v_rec.nromatricula,
              v_rec.nromotor1,
              v_rec.nromotor2,
              v_rec.indiceconsumo,
              v_rec.indicativo,
              v_rec.nollaveencendido,
              v_rec.capacidad,
              v_rec.vin,
              v_rec.ficav,
              v_rec.lot,
              v_rec.combustibleasignado,
              v_rec.vencimientoficav,
              v_rec.vencimientolot,
              v_rec.vencimientocirculacion,
              v_rec.expedicioncirculacion,
              v_rec.cantpersonapie,
              v_rec.cantpersonasentado,
              v_rec.normacombustible,
              v_rec.idgps,
              v_rec.idcategoriatransp,
              v_rec.endeposito,
              v_rec.kmasignado
            );
            
           delete from mod_logactivofijotangible.his_regnumericoestatus hrn
	       where hrn.idregnumerico = v_rec.idregnumerico;
           
           INSERT INTO
            mod_logactivofijotangible.his_regnumericoestatus
          (
            idregnumerico,
            idestatustecnico,
            fechainicio,
            deprecia
          )
          (
          	SELECT rna.idregnumerico, rna.idestatustecnico, v_fechacontable, et.deprecia
        	FROM mod_logactivofijotangible.dat_regnumericoactivo rna
        	INNER JOIN mod_logactivofijotangible.nom_estatustecnico et on et.idestatustecnico = rna.idestatustecnico
        	WHERE rna.idregnumerico = v_rec.idregnumerico
          );
   
     END LOOP;
   
END;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
PARALLEL UNSAFE
COST 100;




CREATE OR REPLACE FUNCTION mod_logactivofijotangible.f_depreciarmediosentidadmixtocontope (
  idestructuracomun numeric,
  iddocumento numeric
)
RETURNS void AS
$body$
DECLARE            
                 
    v_fechacontable date;
    v_rec RECORD;
    v_idmovimiento NUMERIC;
    v_idmovrn NUMERIC;

    -- Variables:
    --DM - Supuesta Depreciacion mensual (Se llama supuesta porque en dependencia del limite esto lo deprecia o no)
    --MD - Cantidad de meses que lleva el medio depreciando
	--MAX_A_DEPRE - Tope/Maximo del valor que puede depreciar el medio en el periodo de tiempo(annos) segun la tasa.
	
    
	--Formulas:
    --DM = Cantidad Recursos Consumidos (kilometraje mensual) * (Vida util(en Km) / Valor contable)
    --MD = Fecha contable(cierre actual) - Fehca de adquisicion o de explotacion inicial (Se da en meses)
    --MAX_A_DEPRE = (CEIL(MD/12) / (100 / tasa fiscal)) * valor contable

    --Condiciones
    -- Se deprecia si:
    --    MAX_A_DEPRE > DM + DEPRECIACION ACUMULADA
    --    Si la DEPRECIACION ACUMULADA < MAX_A_DEPRE PERO DM + DEPRECIACION ACUMULADA > MAX_A_DEPRE:
    --			Entonces: DM = MAX_A_DEPRE - DEPRECIACION ACUMULADA

  	v_DM NUMERIC;
    v_MD NUMERIC;
    v_MAX_A_DEPRE numeric;
    
    v_explotacionadquisicion NUMERIC;
    v_fechainicial DATE;
  
BEGIN
 
    SELECT f.fecha into v_fechacontable
    FROM mod_datosmaestros.dat_fecha f
    inner join mod_datosmaestros.dat_estructurasubsist des on des.idestructurasubsist = f.idestructurasubsist
    where des.idestructuracomun = $1 and des.idsubsistema = 11;
    
    SELECT cfg.explotacionadquisicion INTO v_explotacionadquisicion -- 0 -> fecha adquisicion 1 -> fecha expl inicio
    FROM mod_logactivofijotangible.conf_parametrosgenerales cfg
    WHERE cfg.idestructura = $1;

  	
    FOR v_rec IN
      select sub.* from
      (select drna.idregnumerico, p.idproducto, drna.idestatustecnico, drna.idarearesp, drna.idcentrocosto,
      drna.idcolorprim,
              drna.idcolorsec,
              drna.idubicacion,
              drna.idactividad,
              drna.idtabla,
              drna.valoradquisicion,
              drna.depreciacionacumulada,
              drna.tasafiscal,
              drna.porcientorecuperacion,
              drna.valorcontable,
              drna.annofabricacion,
              drna.vidautil,
              COALESCE(drna.fechaadq, drna.fechaexpini) as fechaadq,
              COALESCE(drna.fechaexpini, drna.fechaadq) as fechaexpini,
              drna.fechaexpfin,
              drna.idcategoria,
              drna.idresponsable,
              drna.recursoconsumido,
              drna.cantidadrecursoconsumido,
              drna.importe,                              
              drna.nroinventario,
              drna.fechainicialgarantia,
              drna.fechafingarantia,
              drna.recursoconsumidomax,            
              drna.arrendado,
              drna.valorcontablealternativo,
              drna.valoradquisicionalternativo,
              drna.depreciacionacumuladaalternativo,
              drna.datos,           
              drna.recursoconsumido * (drna.valorcontable / drna.vidautil) as depreciacion,    
             
			  drnat.idtipocombustible,
              drnat.nrocirculacion,
              drnat.nromatricula,
              drnat.nromotor1,
              drnat.nromotor2,
              drnat.indiceconsumo,
              drnat.indicativo,
              drnat.nollaveencendido,
              drnat.capacidad,
              drnat.vin,
              drnat.ficav,
              drnat.lot,
              drnat.combustibleasignado,
              drnat.vencimientoficav,
              drnat.vencimientolot,
              drnat.vencimientocirculacion,
              drnat.expedicioncirculacion,
              drnat.cantpersonapie,
              drnat.cantpersonasentado,
              drnat.normacombustible,
              drnat.idgps,
              drnat.idcategoriatransp,
              drnat.endeposito,
              drnat.kmasignado
            
    
      FROM mod_logactivofijotangible.dat_regnumericoactivo drna
      INNER JOIN mod_logactivofijotangible.nom_actividad na ON drna.idactividad = na.idactividad  
      INNER JOIN mod_logactivofijotangible.dat_registronumerico drn ON drna.idregnumerico = drn.idregnumerico
      INNER JOIN mod_logistica.dat_producto p ON drn.idproducto = p.idproducto and p.idestructuracomun = $1
      INNER JOIN mod_datosmaestros.nom_indicador i ON p.idindicador = i.idindicador and i.idnaturaleza NOT IN (-7, -8, -5)
      INNER JOIN mod_datosmaestros.nom_indicadorhoja ih on ih.idindicador = i.idindicador
      INNER JOIN mod_logactivofijotangible.his_regnumericoestatus hrn ON drn.idregnumerico = hrn.idregnumerico and hrn.deprecia = 1 and hrn.fechainicio < v_fechacontable
      left JOIN mod_logactivofijotangible.dat_regnumericoactivotransp drnat on drnat.idregnumerico = drn.idregnumerico
      INNER JOIN mod_logactivofijotangible.nom_actividad nact on nact.idactividad = drna.idactividad
      INNER JOIN mod_logactivofijotangible.nom_depreciacion ndep on ndep.iddepreciacion = nact.iddepreciacion
       
      WHERE (
          drna.idestadoperacion NOT IN (0,7)    
          AND drna.esbaja = 0
          AND ndep.iddepreciacion = 3
          AND drna.valorcontable > drna.depreciacionacumulada 
      	  AND drna.recursoconsumido > 0
          AND ih.isuh <> 1
      ) ORDER BY p.idproducto
      ) as sub
      where sub.depreciacion > 0
     LOOP
     
     	
        v_DM := round( v_rec.recursoconsumido * (v_rec.valorcontable / v_rec.vidautil),2);
		SELECT CASE WHEN v_explotacionadquisicion = 0 THEN v_rec.fechaadq ELSE v_rec.fechaexpini END INTO v_fechainicial;
        SELECT 
			(DATE_PART('year', AGE(v_fechacontable, v_fechainicial)) * 12 ) +
		    DATE_PART('month', AGE(v_fechacontable, v_fechainicial))  + 
    		CASE WHEN DATE_PART('day', AGE(v_fechacontable, v_fechainicial)) > 0 THEN 1 ELSE 0 END INTO v_MD;
        v_MAX_A_DEPRE := (CEIL(v_MD/12) / (100/v_rec.tasafiscal) ) * v_rec.valorcontable;
        

        IF(v_MAX_A_DEPRE < v_DM + v_rec.depreciacionacumulada AND v_MAX_A_DEPRE > v_rec.depreciacionacumulada) THEN
        	v_DM = v_MAX_A_DEPRE - v_rec.depreciacionacumulada;
        END IF;
        IF(v_MAX_A_DEPRE < v_rec.depreciacionacumulada) THEN 
        	v_DM = 0; 
        END IF;
        	
         --RAISE NOTICE 'idregistro %',v_rec.idregnumerico;
       
         -- BUSCO EL MOVIMIENTO
         SELECT m.idmovimiento into v_idmovimiento
         from mod_logistica.dat_movimiento m
         where m.idproducto = v_rec.idproducto and m.iddocumento = $2;
       
         -- CREO EL MOVIMIENTO SI NO EXISTE
         if(v_idmovimiento is null) then       
           INSERT INTO
              mod_logistica.dat_movimiento
            (
              iddocumento,
              idproducto,            
              cantidad,
              cronologia          
            )
            VALUES (            
              $2,
              v_rec.idproducto,          
              0,
              0          
            ) RETURNING idmovimiento into v_idmovimiento;
           end if;
         
           INSERT INTO
              mod_logactivofijotangible.dat_movregnumerico
            (            
              idregnumerico,
              idmovimiento
            )
            VALUES (
              v_rec.idregnumerico,
              v_idmovimiento
            ) RETURNING idmovregnumerico into v_idmovrn;
            
            UPDATE mod_logactivofijotangible.dat_regnumericoactivo rna
				set
		     		ultimadepreciacion = v_DM,
        		    fechaultimadep = v_fechacontable,
                    depreciacionacumulada = rna.depreciacionacumulada + v_DM,
                    cantidadrecursoconsumido = COALESCE(rna.cantidadrecursoconsumido,0) + rna.recursoconsumido,
                    recursoconsumido = 0
	         where rna.idregnumerico = v_rec.idregnumerico;

          
            INSERT INTO
              mod_logactivofijotangible.dat_movregnumericoactivo
            (
              idmovregnumerico,
              idestatustecnico,
              idarearesp,
              idcentrocosto,
              idcolorprim,
              idcolorsec,
              idubicacion,
              idactividad,
              idtabla,
              valoradquisicion,
              depreciacionacumulada,
              tasafiscal,
              porcientorecuperacion,
              valorcontable,
              annofabricacion,
              vidautil,
              fechaadq,
              fechaexpini,
              fechaexpfin,
              depreciacion,
              idcategoria,
              idresponsable,
              recursoconsumido,
              cantidadrecursoconsumido,
              importe,            
              nroinventario,
              fechainicialgarantia,
              fechafingarantia,
              recursoconsumidomax,            
              arrendado,
              valorcontablealternativo,
              valoradquisicionalternativo,
              depreciacionacumuladaalternativo,
              depreciacioncuc,
              datos
            )
            VALUES (
              v_idmovrn,
              v_rec.idestatustecnico,
              v_rec.idarearesp,
              v_rec.idcentrocosto,
              v_rec.idcolorprim,
              v_rec.idcolorsec,
              v_rec.idubicacion,
              v_rec.idactividad,
              v_rec.idtabla,
              v_rec.valoradquisicion,
              --v_rec.depreciacionacumulada + v_rec.depreciacion,
              v_rec.depreciacionacumulada + v_DM,
              v_rec.tasafiscal,
              v_rec.porcientorecuperacion,
              v_rec.valorcontable,
              v_rec.annofabricacion,
              v_rec.vidautil,
              v_rec.fechaadq,
              v_rec.fechaexpini,
              v_rec.fechaexpfin,
              --v_rec.depreciacion,
              v_DM,
              v_rec.idcategoria,
              v_rec.idresponsable,
              v_rec.recursoconsumido,
              v_rec.cantidadrecursoconsumido,
              v_rec.importe,            
              v_rec.nroinventario,
              v_rec.fechainicialgarantia,
              v_rec.fechafingarantia,
              v_rec.recursoconsumidomax,
              v_rec.arrendado,
              v_rec.valorcontablealternativo,
              v_rec.valoradquisicionalternativo,
              --v_rec.depreciacionacumuladaalternativo + v_rec.depreciacionalternativo,
              v_rec.depreciacionacumuladaalternativo + 0,
              --v_rec.depreciacionalternativo,
              0,
              v_rec.datos
            );  
          
            INSERT INTO
              mod_logactivofijotangible.dat_movregnumericoactivotransp
            (
              idmovregnumerico,
              idtipocombustible,
              nrocirculacion,
              nromatricula,
              nromotor1,
              nromotor2,
              indiceconsumo,
              indicativo,
              nollaveencendido,
              capacidad,
              vin,
              ficav,
              lot,
              combustibleasignado,
              vencimientoficav,
              vencimientolot,
              vencimientocirculacion,
              expedicioncirculacion,
              cantpersonapie,
              cantpersonasentado,
              normacombustible,
              idgps,
              idcategoriatransp,
              endeposito,
              kmasignado
            )
            VALUES (
              v_idmovrn,
              v_rec.idtipocombustible,
              v_rec.nrocirculacion,
              v_rec.nromatricula,
              v_rec.nromotor1,
              v_rec.nromotor2,
              v_rec.indiceconsumo,
              v_rec.indicativo,
              v_rec.nollaveencendido,
              v_rec.capacidad,
              v_rec.vin,
              v_rec.ficav,
              v_rec.lot,
              v_rec.combustibleasignado,
              v_rec.vencimientoficav,
              v_rec.vencimientolot,
              v_rec.vencimientocirculacion,
              v_rec.expedicioncirculacion,
              v_rec.cantpersonapie,
              v_rec.cantpersonasentado,
              v_rec.normacombustible,
              v_rec.idgps,
              v_rec.idcategoriatransp,
              v_rec.endeposito,
              v_rec.kmasignado
            );
            
            
           delete from mod_logactivofijotangible.his_regnumericoestatus hrn
	       where hrn.idregnumerico = v_rec.idregnumerico;
           
           INSERT INTO
            mod_logactivofijotangible.his_regnumericoestatus
          (
            idregnumerico,
            idestatustecnico,
            fechainicio,
            deprecia
          )
          (
          	SELECT rna.idregnumerico, rna.idestatustecnico, v_fechacontable, et.deprecia
        	FROM mod_logactivofijotangible.dat_regnumericoactivo rna
        	INNER JOIN mod_logactivofijotangible.nom_estatustecnico et on et.idestatustecnico = rna.idestatustecnico
        	WHERE rna.idregnumerico = v_rec.idregnumerico
          );
          
          
   
     END LOOP;
     
     
     UPDATE mod_logactivofijotangible.dat_regnumericoactivo rna
        set
            cantidadrecursoconsumido = COALESCE(rna.cantidadrecursoconsumido,0) + rna.recursoconsumido,
            recursoconsumido = 0
     where rna.idregnumerico IN (
     	SELECT rn.idregnumerico
        FROM mod_logactivofijotangible.dat_registronumerico rn 
        INNER JOIN mod_logactivofijotangible.dat_regnumericoactivo drna ON rn.idregnumerico = drna.idregnumerico
        INNER JOIN mod_logistica.dat_producto p on p.idproducto = rn.idproducto
        WHERE drna.idestadoperacion NOT IN (0,7)
          AND drna.recursoconsumido > 0
          AND p.idestructuracomun = $1
     );
         
   
END;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
PARALLEL UNSAFE
COST 100;

COMMENT ON FUNCTION mod_logactivofijotangible.f_depreciarmediosentidadmixtocontope(idestructuracomun numeric, iddocumento numeric)
IS 'Metodo de depreciacion mixto con tope. Combinacion del metodo de recursos consumidos o kilometraje con un tope a depreciar anualmente segun el metodo de linea recta.

-- Variables:
    --DM - Supuesta Depreciacion mensual (Se llama supuesta porque en dependencia del limite esto lo deprecia o no)
    --MD - Cantidad de meses que lleva el medio depreciando
    --MAX_A_DEPRE - Tope/Maximo del valor que puede depreciar el medio en el periodo de tiempo(annos) segun la tasa.
    
    
    --Formulas:
    --DM = Cantidad Recursos Consumidos (kilometraje mensual) * (Vida util(en Km) / Valor contable)
    --MD = Fecha contable(cierre actual) - Fehca de adquisicion o de explotacion inicial (Se da en meses)
    --MAX_A_DEPRE = (CEIL(MD/12) / (100 / tasa fiscal)) * valor contable

    --Condiciones
    -- Se deprecia si:
    --    MAX_A_DEPRE > DM + DEPRECIACION ACUMULADA
    --    Si la DEPRECIACION ACUMULADA < MAX_A_DEPRE PERO DM + DEPRECIACION ACUMULADA > MAX_A_DEPRE:
    --			Entonces: DM = MAX_A_DEPRE - DEPRECIACION ACUMULADA
    
    ';

ALTER FUNCTION mod_logactivofijotangible.f_depreciarmediosentidadmixtocontope (idestructuracomun numeric, iddocumento numeric)
  OWNER TO zeolides;