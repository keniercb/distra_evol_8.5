CREATE OR REPLACE FUNCTION mod_loginventario.fn_actualizarsubmayores (
  p_idproducto numeric
)
RETURNS void AS
$body$
DECLARE
  v_rec record;
  v_cantreal numeric;
  v_importereal numeric;
  v_cantrealcup numeric;
  v_importerealcup numeric;
BEGIN

  v_cantreal = 0;
    v_importereal = 0;
    v_cantrealcup = 0;
    v_importerealcup =0;
    for v_rec in (
      select dm.idmovimiento, dm.cantidad, dm.signo,dm.idproducto,
        dm.precioalternativo, dm.importealternativo, dm.preciocontable,
        dm.importecontable, ndp.abreviatura 
        from mod_logistica.dat_documento dd
        inner join mod_logistica.dat_movimiento dm using(iddocumento)
        inner join mod_datosmaestros.dat_documentoprim ddp on ddp.iddoc = dd.iddoc
		inner join mod_datosmaestros.nom_docprim ndp on ndp.iddocumentos = ddp.iddocumentos
        where dm.idproducto = p_idproducto and dd.estado in(3,4,7,8) and dd.cronologia > 0 and ndp.abreviatura <> 'cambioccontableLog'
      and dm.signo <> 'N'
        order by dd.cronologia asc
    )loop
      	
      if v_rec.abreviatura = 'revaluacionLog' then 
      	v_cantreal = v_rec.cantidad;
      	v_importerealcup = v_importerealcup + v_importereal - coalesce((case when v_rec.cantidad <> 0 
              then (round(v_rec.importecontable/*v_rec.cantidad * v_rec.preciocontable*/,2)) else round(v_rec.importecontable,2) end),0);
      	v_importereal = 0;
      ELSE
      	if v_rec.signo = '+' then 
			v_cantreal = v_cantreal + v_rec.cantidad;            
            v_importereal = v_importereal + (case when v_rec.cantidad <> 0 
              then (round(v_rec.importealternativo/*v_rec.cantidad * v_rec.precioalternativo*/,2)) else round(v_rec.importealternativo,2) end);
            
            v_importerealcup = v_importerealcup + coalesce((case when v_rec.cantidad <> 0 
              then (round(v_rec.importecontable/*v_rec.cantidad * v_rec.preciocontable*/,2)) else round(v_rec.importecontable,2) end),0);
        else
          v_cantreal = v_cantreal - v_rec.cantidad;
            
            v_importereal = v_importereal - (case when v_rec.cantidad <> 0 
              then (round(v_rec.importealternativo/*v_rec.cantidad * v_rec.precioalternativo*/,2)) else round(v_rec.importealternativo,2) end);
            
            v_importerealcup = v_importerealcup - coalesce((case when v_rec.cantidad <> 0 
              then (round(v_rec.importecontable/*v_rec.cantidad * v_rec.preciocontable*/,2)) else round(v_rec.importecontable,2) end),0);
        end if;
      end if;        
        update mod_logistica.dat_movimiento m set 
          existenciaactual = case when v_cantreal > 0 then v_cantreal else 0 end,
          importetotalalt = v_importereal,
          preciopromalt = case when v_cantreal <> 0 then v_importereal/v_cantreal else 0 end,
            importetotal = v_importerealcup,
          preciopromedio = case when v_cantreal <> 0 then v_importerealcup/v_cantreal else 0 end
        where m.idmovimiento = v_rec.idmovimiento; 
      --raise notice '%', v_importerealcup;
        update  mod_logistica.dat_producto      u
          set precioalternativo = case when v_cantreal <> 0 then v_importereal/v_cantreal else 0 end ,
              importealternativo  = v_importereal,
              precio = case when v_cantreal <> 0 then v_importerealcup/v_cantreal else 0 end ,
              importe  =v_importerealcup
              ,cantidad = case when v_cantreal > 0 then v_cantreal else 0 end
        where u.idproducto =  v_rec.idproducto;
    end loop;  
    
END;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
COST 100;