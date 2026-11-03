INSERT INTO mod_logactivofijotangible.nom_depreciacion ( iddepreciacion, denominacion)
VALUES 
(4, 'LINEA RECTA (% Fiscal)'),
(5, 'KILOMETROS RECORRIDOS'),
(6, 'DIGITOS DECRECIENTES'),
(7, 'HORAS MAQUINAS');

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
    --DM - Depreciacion mensual
    --DA - Depreciacion acumulada
    --V - Valor contable del medio
    --TF - Tasa fiscal  del medio
    --VU - Vida util (Max cantidad de km a recorrer para depreciar totalmente)
    --CRC - Cantidad de recursos consumidos en el mes (kilometraje del mes)


    --MD - Cantidad de meses que lleva el medio depreciando
    --DAMA - Depreciacion acumulada maxima anual
    --DAMA = V / (100 / TF)
    --DAM - Depreciacion acumulada maxima
    --DAM = ((MD / 12 ) + (case MD % 12 > 0 then 1 else 0 end) ) * DAMA ---------- cambiar formula

    --Formula:
    --DM = CRC * (V / VU)

    --Condiciones
    -- Se deprecia si:
    --    DAM > DM + DA
    --    Si DA < DAM y  DAM < DM + DA entonces DM = DAM - DA

  	v_DM NUMERIC;
    v_MD NUMERIC;
    v_DAMA NUMERIC;
    v_DAM NUMERIC;
    
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
      INNER JOIN mod_logactivofijotangible.his_regnumericoestatus hrn ON drn.idregnumerico = hrn.idregnumerico and hrn.deprecia = 1 and hrn.fechainicio < v_fechacontable
      left JOIN mod_logactivofijotangible.dat_regnumericoactivotransp drnat on drnat.idregnumerico = drn.idregnumerico
      INNER JOIN mod_logactivofijotangible.nom_actividad nact on nact.idactividad = drna.idactividad
      INNER JOIN mod_logactivofijotangible.nom_depreciacion ndep on ndep.iddepreciacion = nact.iddepreciacion
       
      WHERE (
          drna.idestadoperacion <> 7
          AND drna.idestadoperacion <> 0        
          AND ndep.iddepreciacion = 3
          --AND ((drna.valorcontable - ((drna.valorcontable * drna.porcientorecuperacion)/100)) <> drna.depreciacionacumulada
          --OR (drna.valorcontablealternativo - ((drna.valorcontablealternativo * drna.porcientorecuperacion)/100)) <> drna.depreciacionacumuladaalternativo)
      ) ORDER BY p.idproducto
      ) as sub
      where sub.depreciacion > 0 or sub.depreciacionalternativo > 0
     LOOP
     
     	--v_DM := round( v_rec.recursoconsumido * (v_rec.valorcontable / v_rec.recursoconsumidomax),2);
        v_DM := round( v_rec.recursoconsumido * (v_rec.valorcontable / v_rec.vidautil),2);
		SELECT CASE WHEN v_explotacionadquisicion = 0 THEN v_rec.fechaadq ELSE v_rec.fechaexpini END INTO v_fechainicial;
        SELECT 
			(DATE_PART('year', AGE(v_fechacontable, v_fechainicial)) * 12 ) +
		    DATE_PART('month', AGE(v_fechacontable, v_fechainicial))  + 
    		CASE WHEN DATE_PART('day', AGE(v_fechacontable, v_fechainicial)) > 0 THEN 1 ELSE 0 END INTO v_MD;
     	v_DAMA := v_rec.valorcontable / (100 / v_rec.tasafiscal);
        SELECT (div(v_MD, 12) + CASE WHEN v_MD % 12 = 0 THEN 0 ELSE 1 END * v_DAMA ) INTO v_DAM;
        

        IF(v_DAM < v_DM + v_rec.depreciacionacumulada AND v_DAM > v_rec.depreciacionacumulada) THEN
        	v_DM = v_DAM - v_rec.depreciacionacumulada;
        END IF;
        IF(v_DAM < v_rec.depreciacionacumulada) THEN 
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
        		    fechaultimadep = v_fechacontable
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
   
     END LOOP;
       
         UPDATE mod_logactivofijotangible.dat_regnumericoactivo rna
         set
             depreciacionacumulada = (select mrna1.depreciacionacumulada
                                    from mod_logactivofijotangible.dat_movregnumerico mrn1
                                    inner join mod_logactivofijotangible.dat_movregnumericoactivo mrna1 on mrna1.idmovregnumerico = mrn1.idmovregnumerico
                                    inner join mod_logistica.dat_movimiento m1 on m1.idmovimiento = mrn1.idmovimiento
                                    where m1.iddocumento = $2 and mrn1.idregnumerico = rna.idregnumerico),
            depreciacionacumuladaalternativo = (select mrna1.depreciacionacumuladaalternativo
                                    from mod_logactivofijotangible.dat_movregnumerico mrn1
                                    inner join mod_logactivofijotangible.dat_movregnumericoactivo mrna1 on mrna1.idmovregnumerico = mrn1.idmovregnumerico
                                    inner join mod_logistica.dat_movimiento m1 on m1.idmovimiento = mrn1.idmovimiento
                                    where m1.iddocumento = $2 and mrn1.idregnumerico = rna.idregnumerico)
         where rna.idregnumerico IN (
             select mrn.idregnumerico
             from mod_logactivofijotangible.dat_movregnumerico mrn
            inner join mod_logactivofijotangible.dat_movregnumericoactivo mrna on mrna.idmovregnumerico = mrn.idmovregnumerico
            inner join mod_logistica.dat_movimiento m on m.idmovimiento = mrn.idmovimiento
            where m.iddocumento = $2
         );
       
         delete from mod_logactivofijotangible.his_regnumericoestatus hrn
         where hrn.idregnumerico in (
              select mrn.idregnumerico
              from mod_logactivofijotangible.dat_movregnumerico mrn
              inner join mod_logistica.dat_movimiento m on m.idmovimiento = mrn.idmovimiento
              where m.iddocumento = $2
         );
     
           INSERT INTO
          mod_logactivofijotangible.his_regnumericoestatus
        (
          idregnumerico,
          idestatustecnico,
          fechainicio,
          deprecia
        )
        (SELECT rna.idregnumerico, rna.idestatustecnico, v_fechacontable, et.deprecia
        FROM mod_logactivofijotangible.dat_regnumericoactivo rna
        INNER JOIN mod_logactivofijotangible.nom_estatustecnico et on et.idestatustecnico = rna.idestatustecnico
        WHERE rna.idregnumerico in (
            select mrn.idregnumerico
             from mod_logactivofijotangible.dat_movregnumerico mrn
            inner join mod_logactivofijotangible.dat_movregnumericoactivo mrna on mrna.idmovregnumerico = mrn.idmovregnumerico
            inner join mod_logistica.dat_movimiento m on m.idmovimiento = mrn.idmovimiento
            where m.iddocumento = $2
        ));
         
   
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
    --DM - Depreciacion mensual
    --DA - Depreciacion acumulada
    --V - Valor contable del medio
    --TF - Tasa fiscal  del medio
    --VU - Vida util (Max cantidad de km a recorrer para depreciar totalmente)
    --CRC - Cantidad de recursos consumidos en el mes (kilometraje del mes)


    --MD - Cantidad de meses que lleva el medio depreciando
    --DAMA - Depreciacion acumulada maxima anual
    --DAMA = V / (100 / TF)
    --DAM - Depreciacion acumulada maxima
    --DAM = ((MD / 12 ) + (case MD % 12 > 0 then 1 else 0 end) ) * DAMA ---------- cambiar formula

    --Formula:
    --DM = CRC * (V / VU

    --Condiciones
    -- Se deprecia si:
    --    DAM > DM + DA
    --    Si DA < DAM y  DAM < DM + DA entonces DM = DAM - DA
    
    ';

ALTER FUNCTION mod_logactivofijotangible.f_depreciarmediosentidadmixtocontope (idestructuracomun numeric, iddocumento numeric)
  OWNER TO zeolides;