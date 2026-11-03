CREATE OR REPLACE FUNCTION mod_logpuntoventa.f_actualizarpreciosventa (
  p_idareaventa numeric,
  p_fechacontable date
)
RETURNS void AS
$body$
DECLARE
v_datosconf record;
v_recprodutos record;
v_in record;
v_tasa record;
v_preciobase numeric;
v_precio numeric;
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
      if v_in.idproducto is not null and (v_in.precio != v_precio or v_in.preciobase != v_preciobase) then
       	UPDATE mod_logpuntoventa.dat_productoareaventa 
        SET preciobase = v_preciobase,
            precio = v_precio,
            idmoneda = v_datosconf.idmoneda,
            fecha = p_fechacontable
        WHERE idproducto = v_in.idproducto; 
          INSERT INTO mod_logpuntoventa.his_productoareaventa(idproducto,preciobase,precio,idmoneda,fechaanterior,fechaactualizacion)
			VALUES (v_in.idproducto,v_in.preciobase,v_in.precio,v_in.idmoneda,v_in.fecha,p_fechacontable);
          --enviar el otro para el historico
      else if v_in.idproducto is null then 
        INSERT INTO mod_logpuntoventa.dat_productoareaventa(idproducto,preciobase,precio,idmoneda,idareaventa,fecha)
          VALUES (v_recprodutos.idproducto,v_preciobase,v_precio,v_datosconf.idmoneda,p_idareaventa,p_fechacontable);
        end if;
      end if;
end loop;  
END;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
PARALLEL UNSAFE
COST 100;

ALTER FUNCTION mod_logpuntoventa.f_actualizarpreciosventa (p_idareaventa numeric, p_fechacontable date)
  OWNER TO zeolides;
  