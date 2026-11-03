CREATE SEQUENCE mod_logdistribucion.sec_datcancelacion_seq
  INCREMENT 1 MINVALUE 1000000000
  MAXVALUE 1099999999 START 1000000001
  CACHE 1;

ALTER SEQUENCE mod_logdistribucion.sec_datcancelacion_seq RESTART WITH 1000000001;

CREATE TABLE mod_logdistribucion.dat_cancelacion (
  idcancelacion NUMERIC(19,0) DEFAULT nextval('mod_logdistribucion.sec_datcancelacion_seq'::regclass) NOT NULL,
  idprodorden NUMERIC(19,0),
  cantidad NUMERIC(25,6),
  motivo VARCHAR(255),
  idusuario NUMERIC(19,0),
  PRIMARY KEY(idcancelacion)
) 
WITH (oids = false);

ALTER TABLE mod_logdistribucion.dat_cancelacion
  ADD COLUMN estado NUMERIC(1,0);

ALTER TABLE mod_logdistribucion.dat_cancelacion
  ALTER COLUMN estado SET DEFAULT 1;
  
ALTER TABLE mod_logdistribucion.dat_cancelacion
  ADD COLUMN idaprobado NUMERIC(19,0);
  
ALTER TABLE mod_logdistribucion.dat_cancelacion
  ADD COLUMN fecha DATE;  
  
  
CREATE OR REPLACE FUNCTION mod_logdistribucion.fn_arreglarcumplimiento (
  p_iddocumento numeric,
  p_idestructura numeric
)
RETURNS void AS
$body$
DECLARE
  v_recdist record;
BEGIN
	--Actualizando los entregados
	for v_recdist in (	
		select pord.idprodorden, pord.idcliente, pord.idproducto, pord.idorden
         from mod_logistica.dat_documento dd
        inner join mod_logdistribucion.dat_distribucion dist on dist.iddistribucion = dd.iddocumento
        inner join mod_logdistribucion.dat_prodorden pord on pord.idorden = dd.iddocumento
        inner join mod_logdistribucion.dat_prodordencmpto cump on cump.idprodorden = pord.idprodorden
        where dd.estado = 3
        and (dd.iddocumento = p_iddocumento or p_iddocumento is null)
        and (cump.entregado <> coalesce((select sum(dm.cantidad) from mod_logistica.dat_movimiento dm where dm.idproducto = pord.idproducto 
        and dm.iddocumento in (
        select dpad.iddocumento from mod_logistica.dat_documentopadre dpad 
        inner join mod_logistica.dat_documento d1 on d1.iddocumento = dpad.iddocumento
        inner join mod_logistica.dat_documentocliente ddc on ddc.iddocumento = d1.iddocumento
        where dpad.idpadre = dd.iddocumento and d1.estado in (3,4,7) and ddc.idcliente = pord.idcliente
        )),0) or cump.enproceso <> coalesce((select sum(dm.cantidad) from mod_logistica.dat_movimiento dm where dm.idproducto = pord.idproducto 
        and dm.iddocumento in (
        select dpad.iddocumento from mod_logistica.dat_documentopadre dpad 
        inner join mod_logistica.dat_documento d1 on d1.iddocumento = dpad.iddocumento
        inner join mod_logistica.dat_documentocliente ddc on ddc.iddocumento = d1.iddocumento
        where dpad.idpadre = dd.iddocumento and d1.estado in (3,4,7) and ddc.idcliente = pord.idcliente
        )),0)) and cump.cantidadoriginal > 0 and (dd.idestructuracomun = p_idestructura or p_idestructura is null)
        and cump.cantidadoriginal >= coalesce((select sum(dm.cantidad) from mod_logistica.dat_movimiento dm 
        where dm.idproducto = pord.idproducto 
        and dm.iddocumento in (
        select dpad.iddocumento from mod_logistica.dat_documentopadre dpad 
        inner join mod_logistica.dat_documento d1 on d1.iddocumento = dpad.iddocumento
        inner join mod_logistica.dat_documentocliente ddc on ddc.iddocumento = d1.iddocumento
        where dpad.idpadre = dd.iddocumento and d1.estado in (1,2,3,4,7) and ddc.idcliente = pord.idcliente
        )),0)
    )
    loop
    	update mod_logdistribucion.dat_prodordencmpto 
        set entregado = coalesce((select sum(dm.cantidad) from mod_logistica.dat_movimiento dm where 
        dm.idproducto = v_recdist.idproducto 
        and dm.iddocumento in (
        select dpad.iddocumento from mod_logistica.dat_documentopadre dpad 
        inner join mod_logistica.dat_documento d1 on d1.iddocumento = dpad.iddocumento
        inner join mod_logistica.dat_documentocliente ddc on ddc.iddocumento = d1.iddocumento
        where dpad.idpadre = v_recdist.idorden and d1.estado in (3,4) and ddc.idcliente = v_recdist.idcliente
        )),0) where idprodorden = v_recdist.idprodorden;

       	update mod_logdistribucion.dat_prodordencmpto 
        set enproceso = coalesce((select sum(dm.cantidad) from mod_logistica.dat_movimiento dm where 
        dm.idproducto = v_recdist.idproducto 
        and dm.iddocumento in (
        select dpad.iddocumento from mod_logistica.dat_documentopadre dpad 
        inner join mod_logistica.dat_documento d1 on d1.iddocumento = dpad.iddocumento
        inner join mod_logistica.dat_documentocliente ddc on ddc.iddocumento = d1.iddocumento
        where dpad.idpadre = v_recdist.idorden and d1.estado in (1,2) and ddc.idcliente = v_recdist.idcliente
        )),0) where idprodorden = v_recdist.idprodorden;
        
        update mod_logdistribucion.dat_prodordencmpto 
        set pendiente = cantidadoriginal - entregado - enproceso
        where idprodorden = v_recdist.idprodorden;
    end loop;
END;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
COST 100;