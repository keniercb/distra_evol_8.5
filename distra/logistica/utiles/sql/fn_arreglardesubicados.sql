-- FUNCTION: mod_logubicacion.fn_arreglardesubicados()

-- DROP FUNCTION IF EXISTS mod_logubicacion.fn_arreglardesubicados();

CREATE OR REPLACE FUNCTION mod_logubicacion.fn_arreglardesubicados(
	)
    RETURNS void
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$

DECLARE

BEGIN
    delete from mod_logubicacion.dat_areaproducto where idarea = -1 or idarea is null;
    delete from mod_logubicacion.dat_ubicacionproducto where idubicacion = -1 or idubicacion is null;
	/*ALTER SEQUENCE mod_logubicacion.sec_datareaproducto_seq
      INCREMENT 1 MINVALUE 1000000000
      MAXVALUE 1999999999 START 1000000001
      RESTART 1000000001 CACHE 1
      NO CYCLE;
      
    ALTER SEQUENCE mod_logubicacion.sec_datubicacionproducto_seq
      INCREMENT 1 MINVALUE 1000000000
      MAXVALUE 1999999999 START 1000000001
      RESTART 1000000001 CACHE 1
      NO CYCLE;*/

    INSERT INTO
      mod_logubicacion.dat_areaproducto
    (
      idproducto,
      idarea,
      disponible
    )
    SELECT
      dp.idproducto,
      -1,
      cantidad
    FROM
      mod_logistica.dat_producto dp
      left join mod_logubicacion.dat_areaproducto ap on ap.idproducto = dp.idproducto
      where ap.idareaproducto is null and dp.cronologia > 0;

    INSERT INTO
      mod_logubicacion.dat_ubicacionproducto
    (
      idproducto,
      idubicacion,
      cantidad
    )
    SELECT
      dp.idproducto,
      -1,
      dp.cantidad
    FROM
      mod_logistica.dat_producto dp
      left join mod_logubicacion.dat_ubicacionproducto ap on ap.idproducto = dp.idproducto
      where ap.idubicacionproducto is null and dp.cronologia > 0;
      
    update mod_logubicacion.dat_areaproducto as dap
    set disponible = disponible + (
    select (dp.cantidad-sum(ap.disponible)) from mod_logistica.dat_producto dp
    inner join mod_logubicacion.dat_areaproducto ap on ap.idproducto = dp.idproducto
    where dap.idproducto = dp.idproducto and dp.cronologia > 0 group by dp.cantidad
    ) where dap.idarea <> -1 and dap.idareaproducto = (
    select ap1.idareaproducto from mod_logubicacion.dat_areaproducto ap1
    where ap1.idproducto = dap.idproducto order by ap1.disponible DESC limit 1
    );
    
    update mod_logubicacion.dat_ubicacionproducto as dap
    set cantidad = cantidad + (
    select (dp.cantidad-sum(ap.cantidad)) from mod_logistica.dat_producto dp
    inner join mod_logubicacion.dat_ubicacionproducto ap on ap.idproducto = dp.idproducto
    where dap.idproducto = dp.idproducto and dp.cronologia > 0 group by dp.cantidad
    ) where dap.idubicacion <> -1 and dap.idubicacionproducto = (
    select ap1.idubicacionproducto from mod_logubicacion.dat_ubicacionproducto ap1
    where ap1.idproducto = dap.idproducto order by ap1.cantidad DESC limit 1
    );
    update mod_logubicacion.dat_areaproducto 
    set disponible = 0 where disponible < 0;
    update mod_logubicacion.dat_ubicacionproducto 
    set cantidad = 0 where cantidad < 0;
END;
$BODY$;

ALTER FUNCTION mod_logubicacion.fn_arreglardesubicados()
    OWNER TO zeolides;

GRANT EXECUTE ON FUNCTION mod_logubicacion.fn_arreglardesubicados() TO PUBLIC;

GRANT EXECUTE ON FUNCTION mod_logubicacion.fn_arreglardesubicados() TO zeolides;

