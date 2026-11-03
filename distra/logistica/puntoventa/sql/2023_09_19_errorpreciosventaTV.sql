CREATE OR REPLACE FUNCTION mod_logpuntoventa.f_actualizarprecioventa (
  p_iddocumento numeric,
  p_idtipoprecio numeric
)
RETURNS void AS
$body$
DECLARE
v_precioventa numeric;
v_referencia numeric;
v_margenAux numeric;
v_movimientos record;
v_datosprecioventa record;
BEGIN

for v_movimientos in (
    select mov.idmovimiento, prd.idindicador, dpf.idtipoprecio, dd.idestructuracomun,
    mov.preciocontable, mov.cantidad 
    from mod_logistica.dat_movimiento mov
    inner join mod_logistica.dat_producto prd on prd.idproducto = mov.idproducto
    inner join mod_logfacturacion.dat_prodfactura dpf on dpf.idmovimiento = mov.idmovimiento
    inner join mod_logistica.dat_documento dd on dd.iddocumento = mov.iddocumento
    where mov.iddocumento = p_iddocumento
) LOOP
	v_precioventa := 0;
	v_referencia := 0;
	for v_datosprecioventa in (
        select dm.preciopromedio, dmm.idmoneda, dp.idcuentadesgloseprecio, dp.concepto, dp.porciento, dp.valor
         from mod_logfacturacion.dat_matrizprecio dm
        inner join mod_logfacturacion.dat_matrizpreciodualmonetaria dmm on dmm.idmatrizprecio = dm.idmatrizprecio
        inner join mod_logfacturacion.dat_precio dp on dp.idmatrizpreciodualidadmonetaria = dmm.idmatrizpreciodualidadmonetaria
        where dm.idindicador = v_movimientos.idindicador and dm.idtipoprecio = p_idtipoprecio and dm.idestructuracomun = (
            select conf.idpadrematriz from mod_logfacturacion.conf_configuracionfactura conf where conf.idestructuracomun = v_movimientos.idestructuracomun limit 1
        ) and dmm.idmoneda = 9900000000 and dp.valor > 0 and dp.valor is not null
    ) LOOP
        if v_referencia = 0 THEN
            if v_datosprecioventa.preciopromedio = 1 then
               v_referencia := v_movimientos.preciocontable;
            end if;                
            v_precioventa := v_referencia;
        end if;
        if v_datosprecioventa.porciento = 1 THEN
            v_margenAux := (v_referencia*v_datosprecioventa.valor/100);
            v_precioventa := v_precioventa + v_margenAux;
        else
            v_margenAux :=  v_datosprecioventa.valor;
            v_precioventa := v_precioventa + v_datosprecioventa.valor;
        end if;
        update mod_logfacturacion.dat_elementocategoria
        set valor = v_margenAux
        where idmovimiento = v_movimientos.idmovimiento and idcuentadesgloseprecio = v_datosprecioventa.idcuentadesgloseprecio;
    end loop;
    update mod_logistica.dat_movmoneda
    set precio = v_precioventa,
    importe = round(v_precioventa*v_movimientos.cantidad,2)
    where idmovimiento = v_movimientos.idmovimiento and idmoneda = 9900000000;
end loop;
END;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
COST 100;

ALTER FUNCTION mod_logpuntoventa.f_actualizarprecioventa (p_iddocumento numeric, p_idtipoprecio numeric)
  OWNER TO zeolides;