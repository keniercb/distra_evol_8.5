-- FUNCTION: mod_logpuntoventa.f_actualizarpreciosventa(numeric, date)

-- DROP FUNCTION IF EXISTS mod_logpuntoventa.f_actualizarpreciosventa(numeric, date);

CREATE OR REPLACE FUNCTION mod_logpuntoventa.f_actualizarpreciosventa(
	p_idareaventa numeric,
	p_fechacontable date)
    RETURNS void
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
DECLARE
v_datosconf record;
v_recprodutos record;
v_recservicios record;
v_in record;
v_tasa record;
v_preciobase numeric;
v_precio numeric;
v_idprecioslotes numeric;
v_count numeric;
BEGIN
SELECT * into v_datosconf FROM mod_logpuntoventa.dat_areaventa where idareaventa = p_idareaventa;
--raise notice 'v_datosconf %',v_datosconf;
for v_recprodutos in SELECT idproducto, precio, precioventa, precioalt, precioventaalt, monedacontable, monedaalternativa 
                      FROM mod_logfacturacion.f_getproductosprecioventa(v_datosconf.idestructuraop, v_datosconf.idcliente, 
                      v_datosconf.idtipoprecio, v_datosconf.idmoneda, v_datosconf.idestructuracomun)
loop
	/*if v_recprodutos.monedaalternativa != v_datosconf.idmoneda then
        v_preciobase = 0;
        v_precio = 0;
   		select * into v_tasa from mod_logpuntoventa.nom_tasacambio where idmonedabase = v_recprodutos.monedaalternativa and idmonedacambio = v_datosconf.idmoneda; 	
        if v_tasa.idtasacambio is not null then
        	v_preciobase = round((v_recprodutos.precioalt * v_tasa.venta),2);
            v_precio = round((v_recprodutos.precioventaalt * v_tasa.venta),2);
        else 
        	select * into v_tasa from mod_logpuntoventa.nom_tasacambio where idmonedabase = v_datosconf.idmoneda and idmonedacambio = v_recprodutos.monedaalternativa; 
            if v_tasa.idtasacambio is not null then
            	v_preciobase = round((v_recprodutos.precioalt / v_tasa.venta),2);
                v_precio = round((v_recprodutos.precioventaalt / v_tasa.venta),2);
            end if;
        end if;
    else*/
    	v_preciobase = v_recprodutos.precio;
        v_precio = v_recprodutos.precioventa;
    --end if;
    --raise notice 'v_tasa %',v_tasa;
	select * into v_in from mod_logpuntoventa.dat_productoareaventa where idproducto = v_recprodutos.idproducto;
    --raise notice 'v_in %',v_in.precio||'---'|| v_recprodutos.precioventaalt;
      if v_in.idproducto is not null and (coalesce(v_in.precio,0) != v_precio or coalesce(v_in.preciobase,0) != v_preciobase) then
       	UPDATE mod_logpuntoventa.dat_productoareaventa 
        SET preciobase = coalesce(v_preciobase,0),
            precio = coalesce(v_precio,0),
            idmoneda = v_datosconf.idmoneda,
            fecha = p_fechacontable
        WHERE idproducto = v_in.idproducto; 
          INSERT INTO mod_logpuntoventa.his_productoareaventa(idproducto,preciobase,precio,idmoneda,fechaanterior,fechaactualizacion)
			VALUES (v_in.idproducto,coalesce(v_in.preciobase,0),coalesce(v_in.precio,0),v_in.idmoneda,v_in.fecha,p_fechacontable);
          --enviar el otro para el historico
      else if v_in.idproducto is null then 
        INSERT INTO mod_logpuntoventa.dat_productoareaventa(idproducto,preciobase,precio,idmoneda,idareaventa,fecha)
          VALUES (v_recprodutos.idproducto,coalesce(v_preciobase,0),coalesce(v_precio,0),v_datosconf.idmoneda,p_idareaventa,p_fechacontable);
        end if;
      end if;
      v_count := (select count(l.idlote) 
       from mod_logistica.dat_lote l 
      left join mod_logpuntoventa.dat_productolote pl on pl.idlote = l.idlote
      where l.idproducto = v_recprodutos.idproducto and l.cronologia > 0 and pl.idlote is null);
      if v_count > 0 and v_precio > 0 and v_preciobase > 0 then
        v_idprecioslotes := COALESCE((select pl.idprecioslotes from mod_logpuntoventa.dat_preciolotes pl where pl.idproducto = v_recprodutos.idproducto
        and pl.preciobase = v_preciobase and pl.precioventa = v_precio limit 1),0);
        if v_idprecioslotes = 0 then
            insert into mod_logpuntoventa.dat_preciolotes
            (
                preciobase,precioventa,fecha,idproducto
            )
            values (v_preciobase, v_precio, p_fechacontable, v_recprodutos.idproducto)
            returning idprecioslotes into v_idprecioslotes;
        end if; 
        insert into mod_logpuntoventa.dat_productolote(idlote, idproducto, preciobase, precioventa, fecha, idprecioslotes)
        (select l.idlote, v_recprodutos.idproducto, v_preciobase, v_precio, p_fechacontable, v_idprecioslotes 
         from mod_logistica.dat_lote l 
        left join mod_logpuntoventa.dat_productolote pl on pl.idlote = l.idlote
        where l.idproducto = v_recprodutos.idproducto and l.cronologia > 0 and pl.idlote is null);
     end if; 	   
     
end loop;  

for v_recservicios in SELECT f.idproducto, f.precio, f.precioventa, f.precioalt, f.precioventaalt, f.monedacontable, f.monedaalternativa,
 					  dsa.idindicador	
                      FROM mod_logfacturacion.f_getserviciosprecioventa(v_datosconf.idareaventa, v_datosconf.idcliente, 
                      v_datosconf.idtipoprecio, v_datosconf.idmoneda, v_datosconf.idestructuracomun) f
                      inner join mod_logpuntoventa.dat_servicioareaventa dsa on dsa.idservicio = f.idproducto
loop
	
    	v_preciobase = v_recservicios.precio;
        v_precio = v_recservicios.precioventa;
    
    select * into v_in from mod_logpuntoventa.dat_servicioareaventa where idservicio = v_recservicios.idproducto;
      if v_in.idservicio is not null and (v_in.precio != v_precio or v_in.preciobase != v_preciobase) then
       	UPDATE mod_logpuntoventa.dat_servicioareaventa 
        SET preciobase = v_preciobase,
            precio = v_precio,
            idmoneda = v_datosconf.idmoneda,
            fecha = p_fechacontable
        WHERE idservicio = v_in.idservicio; 
          INSERT INTO mod_logpuntoventa.his_servicioareaventa(idservicio, idindicador,preciobase,precio,idmoneda,fechaanterior,fechaactualizacion)
			VALUES (v_in.idservicio, v_in.idindicador,v_in.preciobase,v_in.precio,v_in.idmoneda,v_in.fecha,p_fechacontable);
          --enviar el otro para el historico
      else if v_in.idservicio is null then 
        INSERT INTO mod_logpuntoventa.dat_servicioareaventa(idservicio,idindicador,preciobase,precio,idmoneda,idareaventa,fecha)
          VALUES (v_recservicios.idproducto,v_recservicios.idindicador,v_preciobase,v_precio,v_datosconf.idmoneda,p_idareaventa,p_fechacontable);
        end if;
      end if;	   
     
end loop;

END;
$BODY$;

ALTER FUNCTION mod_logpuntoventa.f_actualizarpreciosventa(numeric, date)
    OWNER TO zeolides;
