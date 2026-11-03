update mod_logfacturacion.dat_prodfactura as dpf
set preciofactura = (select dmm.precio from mod_logistica.dat_movmoneda dmm
inner join mod_logistica.dat_movimiento dm using(idmovimiento)
inner join mod_logistica.dat_documentopadre dp on dp.idpadre = dm.iddocumento
where dmm.idmoneda = 9900000000 and dm.idproducto = dm1.idproducto and dp.iddocumento = dd.iddocumento)
from mod_logistica.dat_movimiento dm1
inner join mod_logistica.dat_documento dd using(iddocumento)
inner join mod_datosmaestros.dat_documentoprim ddp using(iddoc)
inner join mod_datosmaestros.nom_docprim ndp USING(iddocumentos)
where dpf.idmovimiento = dm1.idmovimiento and ndp.abreviatura = 'creditoLog';

CREATE OR REPLACE FUNCTION mod_logfacturacion.f_modelofacturaprod (
  p_iddocumento numeric,
  p_monedacontable numeric,
  p_monedalternativa numeric
)
RETURNS SETOF mod_logfacturacion.td_modelofacturaprod AS
$body$
DECLARE

	v_rec mod_logfacturacion.td_modelofacturaprod;
    v_conf numeric;

	BEGIN    
    
    	v_conf := (select cf.listarmcomercial from mod_logfacturacion.conf_configuracionfactura cf 
        		  where cf.idestructuracomun = (select df.idestructuracomun from mod_logfacturacion.dat_docfactura df where df.idfactura = $1 limit 1) limit 1);
                  
		if v_conf = 1 then
        	for v_rec in              

            (select DISTINCT 

            ni.codigo as codigo,

            'Ninguno' as categoria,

            ni.denominacion as denom,

            num.abreviaturaunidadmedida as um,

            def.cantidad as cantidad,

            (select dde.preciotarifa - (select coalesce(sum(dec.valor),0) from mod_logfacturacion.dat_elementocategoria dec where dec.idelementofactura = dde.idelementofactura and dec.idmoneda = $2) 
            from mod_logfacturacion.dat_desgloselemento dde where dde.idelementofactura = def.idelementofactura and dde.idmoneda = $2) as precio,

            (select (dde.preciotarifa- (select coalesce(sum(dec.valor),0) from mod_logfacturacion.dat_elementocategoria dec where dec.idelementofactura = dde.idelementofactura and dec.idmoneda = $2)) * def.cantidad from mod_logfacturacion.dat_desgloselemento dde where dde.idelementofactura = def.idelementofactura and dde.idmoneda = $2) as importe,

            (select dde.preciotarifa - (select coalesce(sum(dec.valor),0) from mod_logfacturacion.dat_elementocategoria dec where dec.idelementofactura = dde.idelementofactura and dec.idmoneda = $3) from mod_logfacturacion.dat_desgloselemento dde where dde.idelementofactura = def.idelementofactura and dde.idmoneda = $3) as precioalternativo,

            (select (dde.preciotarifa - (select coalesce(sum(dec.valor),0) from mod_logfacturacion.dat_elementocategoria dec where dec.idelementofactura = dde.idelementofactura and dec.idmoneda = $3))* def.cantidad from mod_logfacturacion.dat_desgloselemento dde where dde.idelementofactura = def.idelementofactura and dde.idmoneda = $3) as importealternativo,

            (select nm.codigoiso from mod_datosmaestros.nom_moneda nm where nm.idmoneda = $3) as monedaalternativa,

            (select nm.codigoiso from mod_datosmaestros.nom_moneda nm where nm.idmoneda = $2) as monedacontable,
            'No tiene' as numeroserie,
            COALESCE(
            (select round((sum(case when ddcpf.concepto = '+' then COALESCE(ddcpf.valorcalculo,0) else 0 end) - sum(case when ddcpf.concepto = '-' then COALESCE(ddcpf.valorcalculo,0) else 0 end)),2)
            from mod_logfacturacion.dat_categoriapreciofactura dcpf 
            inner join mod_logfacturacion.dat_desglosecategoriapreciofactura ddcpf on ddcpf.idcategoriafactura = dcpf.idcategoriafactura
            where dcpf.idfactura = $1 and ddcpf.idmoneda = $3),0) as recargoalternativa,

            COALESCE((select round((sum(case when ddcpf.concepto = '+' then COALESCE(ddcpf.valorcalculo,0) else 0 end) - sum(case when ddcpf.concepto = '-' then COALESCE(ddcpf.valorcalculo,0) else 0 end)),2)
            from mod_logfacturacion.dat_categoriapreciofactura dcpf 
            inner join mod_logfacturacion.dat_desglosecategoriapreciofactura ddcpf on ddcpf.idcategoriafactura = dcpf.idcategoriafactura
            where dcpf.idfactura = $1 and ddcpf.idmoneda = $2),0) as recargocontable,
            (CASE WHEN dpn.tipo = 1 THEN 'Partes, Piezas o Componentes' ELSE 'Servicios Asociados' END) as tipoindicador

            from mod_logfacturacion.dat_elementosfactura def
            left join mod_logfacturacion.dat_prodservnomenclador dpn on dpn.idelementofactura = def.idelementofactura        
            left join mod_logfacturacion.dat_activosfactura daf on daf.idelementofactura = def.idelementofactura
            left join mod_datosmaestros.nom_indicador ni on ni.idindicador = dpn.idindicador		
            left join mod_datosmaestros.nom_unidadmedida num on num.idunidadmedida = ni.idumedida
            where def.idfactura = $1)
            
            union 

            ( select

            'Ninguno' as codigo,

            'Ninguno' as categoria,

            'Ninguno' as denom,

            'Ninguno' as um,

            0 as cantidad,

            0 as precio,

            0 as importe,

            0 as precioalternativo,

            0 as importealternativo,

            (select nm.codigoiso from mod_datosmaestros.nom_moneda nm where nm.idmoneda = $3) as monedaalternativa,

            (select nm.codigoiso from mod_datosmaestros.nom_moneda nm where nm.idmoneda = $2) as monedacontable ,
            'No tiene' as numeroserie,
            COALESCE(
            (select round((sum(case when ddcpf.concepto = '+' then COALESCE(ddcpf.valorcalculo,0) else 0 end) - sum(case when ddcpf.concepto = '-' then COALESCE(ddcpf.valorcalculo,0) else 0 end)),2)
            from mod_logfacturacion.dat_categoriapreciofactura dcpf 
            inner join mod_logfacturacion.dat_desglosecategoriapreciofactura ddcpf on ddcpf.idcategoriafactura = dcpf.idcategoriafactura
            where dcpf.idfactura = $1 and ddcpf.idmoneda = $3),0) as recargoalternativa,

            COALESCE((select round((sum(case when ddcpf.concepto = '+' then COALESCE(ddcpf.valorcalculo,0) else 0 end) - sum(case when ddcpf.concepto = '-' then COALESCE(ddcpf.valorcalculo,0) else 0 end)),2)
            from mod_logfacturacion.dat_categoriapreciofactura dcpf 
            inner join mod_logfacturacion.dat_desglosecategoriapreciofactura ddcpf on ddcpf.idcategoriafactura = dcpf.idcategoriafactura
            where dcpf.idfactura = $1 and ddcpf.idmoneda = $2),0) as recargocontable,
            'Servicios Asociados' as tipoindicador

            from mod_logfacturacion.dat_elementosfactura def 

            inner join mod_logfacturacion.dat_actividadesfactura da on da.idelementofactura = def.idelementofactura

            left join mod_planificacion.nom_actividad na on na.idactividad = da.idactividad

            where def.idfactura = $1)

            union

            (select

            ni.codigo as codigo,

            nc.denominacion as categoria,

            ni.denominacion as denom,

            num.abreviaturaunidadmedida as um,

            dm.cantidad as cantidad,

            (select dmm1.preciocontable from mod_logistica.dat_movimiento dmm1 where dmm1.idmovimiento = dm.idmovimiento) as precio,

            (select dmm1.preciocontable * dm.cantidad from mod_logistica.dat_movimiento dmm1 where dmm1.idmovimiento = dm.idmovimiento) as importe,
            COALESCE((select dmm1.precioalternativo from mod_logistica.dat_movimiento dmm1 where dmm1.idmovimiento = dm.idmovimiento),0) as precioalternativo,
            COALESCE((select dmm1.precioalternativo * dm.cantidad from mod_logistica.dat_movimiento dmm1 where dmm1.idmovimiento = dm.idmovimiento),0) as importealternativo,

            
            (select nm.codigoiso from mod_datosmaestros.nom_moneda nm where nm.idmoneda = $3) as monedaalternativa,

            (select nm.codigoiso from mod_datosmaestros.nom_moneda nm where nm.idmoneda = $2) as monedacontable,
            'No tiene' as numeroserie,
            
            COALESCE(
            (select round((sum(case when ddcpf.concepto = '+' then COALESCE(ddcpf.valorcalculo,0) else 0 end) - sum(case when ddcpf.concepto = '-' then COALESCE(ddcpf.valorcalculo,0) else 0 end)),2)
            from mod_logfacturacion.dat_categoriapreciofactura dcpf 
            inner join mod_logfacturacion.dat_desglosecategoriapreciofactura ddcpf on ddcpf.idcategoriafactura = dcpf.idcategoriafactura
            where dcpf.idfactura = $1 and ddcpf.idmoneda = $3),0) as recargoalternativa,

            COALESCE((select round((sum(case when ddcpf.concepto = '+' then COALESCE(ddcpf.valorcalculo,0) else 0 end) - sum(case when ddcpf.concepto = '-' then COALESCE(ddcpf.valorcalculo,0) else 0 end)),2)
            from mod_logfacturacion.dat_categoriapreciofactura dcpf 
            inner join mod_logfacturacion.dat_desglosecategoriapreciofactura ddcpf on ddcpf.idcategoriafactura = dcpf.idcategoriafactura
            where dcpf.idfactura = $1 and ddcpf.idmoneda = $2),0) as recargocontable,
            'Partes, Piezas o Componentes' as tipoindicador

            from mod_logistica.dat_movimiento dm

            inner join mod_logistica.dat_producto dprod on dprod.idproducto = dm.idproducto

            left join mod_datosmaestros.nom_indicador ni on ni.idindicador = dprod.idindicador

            left join mod_logistica.nom_categoria nc on nc.idcategoria = dprod.idcategoria

            left join mod_datosmaestros.nom_unidadmedida num on num.idunidadmedida = dm.idunidadmedida

            left join mod_logistica.dat_movmoneda dmm on dmm.idmovimiento = dm.idmovimiento

            left join mod_logfacturacion.dat_prodfactura dpf on dpf.idmovimiento = dm.idmovimiento

            where dm.iddocumento = $1)
            union
            (select 

            '-' as codigo,
            
            '' as categoria,
            
            ncp.denominacion as denom,

            '' as um,

            1 as cantidad,

            (COALESCE((select sum(dec1.valor*dm1.cantidad) from mod_logfacturacion.dat_elementocategoria dec1
            inner join mod_logistica.dat_movimiento dm1 on dm1.idmovimiento = dec1.idmovimiento
             where dec1.idcuentadesgloseprecio = dec.idcuentadesgloseprecio and dec1.idmoneda = $2 and dm1.idmovimiento in (select dmm1.idmovimiento from mod_logistica.dat_movimiento dmm1 where dmm1.iddocumento = $1)),0)
             +COALESCE((select sum(dec1.valor*dm1.cantidad) from mod_logfacturacion.dat_elementocategoria dec1
            inner join mod_logfacturacion.dat_elementosfactura dm1 on dm1.idelementofactura = dec1.idelementofactura
             where dec1.idcuentadesgloseprecio = dec.idcuentadesgloseprecio and dec1.idmoneda = $2),0)) as precio,

            (COALESCE((select sum(dec1.valor*dm1.cantidad) from mod_logfacturacion.dat_elementocategoria dec1
            inner join mod_logistica.dat_movimiento dm1 on dm1.idmovimiento = dec1.idmovimiento
             where dec1.idcuentadesgloseprecio = dec.idcuentadesgloseprecio and dec1.idmoneda = $2  and dm1.idmovimiento in (select dmm1.idmovimiento from mod_logistica.dat_movimiento dmm1 where dmm1.iddocumento = $1)),0)
             +COALESCE((select sum(dec1.valor*dm1.cantidad) from mod_logfacturacion.dat_elementocategoria dec1
            inner join mod_logfacturacion.dat_elementosfactura dm1 on dm1.idelementofactura = dec1.idelementofactura
             where dec1.idcuentadesgloseprecio = dec.idcuentadesgloseprecio and dec1.idmoneda = $2),0)) as importe,

            (COALESCE((select sum(dec1.valor*dm1.cantidad) from mod_logfacturacion.dat_elementocategoria dec1
            inner join mod_logistica.dat_movimiento dm1 on dm1.idmovimiento = dec1.idmovimiento
             where dec1.idcuentadesgloseprecio = dec.idcuentadesgloseprecio and dec1.idmoneda = $3  and dm1.idmovimiento in (select dmm1.idmovimiento from mod_logistica.dat_movimiento dmm1 where dmm1.iddocumento = $1)),0)
             +COALESCE((select sum(dec1.valor*dm1.cantidad) from mod_logfacturacion.dat_elementocategoria dec1
            inner join mod_logfacturacion.dat_elementosfactura dm1 on dm1.idelementofactura = dec1.idelementofactura
             where dec1.idcuentadesgloseprecio = dec.idcuentadesgloseprecio and dec1.idmoneda = $3),0)) as precioalternativo,

            (COALESCE((select sum(dec1.valor*dm1.cantidad) from mod_logfacturacion.dat_elementocategoria dec1
            inner join mod_logistica.dat_movimiento dm1 on dm1.idmovimiento = dec1.idmovimiento
             where dec1.idcuentadesgloseprecio = dec.idcuentadesgloseprecio and dec1.idmoneda = $3  and dm1.idmovimiento in (select dmm1.idmovimiento from mod_logistica.dat_movimiento dmm1 where dmm1.iddocumento = $1)),0)
             +COALESCE((select sum(dec1.valor*dm1.cantidad) from mod_logfacturacion.dat_elementocategoria dec1
            inner join mod_logfacturacion.dat_elementosfactura dm1 on dm1.idelementofactura = dec1.idelementofactura
             where dec1.idcuentadesgloseprecio = dec.idcuentadesgloseprecio and dec1.idmoneda = $3),0)) as importealternativo,

            (select nm.codigoiso from mod_datosmaestros.nom_moneda nm where nm.idmoneda = $3) as monedaalternativa,

            (select nm.codigoiso from mod_datosmaestros.nom_moneda nm where nm.idmoneda = $2) as monedacontable,
            '' as numeroserie,
            0 as recargoalternativa,

            0 as recargocontable,
            'y' as tipoindicador
            

            from mod_logfacturacion.dat_elementocategoria dec
            inner join mod_logistica.dat_movimiento dm on dm.idmovimiento = dec.idmovimiento
            inner join mod_logfacturacion.dat_cuentadesgloseprecio dcd on dcd.idcuentadesgloseprecio = dec.idcuentadesgloseprecio
            inner join mod_logfacturacion.dat_categoriaprecioentidad dce on dce.idcategoriaprecioentidad = dcd.idcategoriaprecioentidad
            inner join mod_logfacturacion.nom_categoriaprecio ncp on ncp.idcategoriaprecio = dce.idcategoriaprecio        
            where dm.iddocumento = $1)
            union
            (select 

            '-' as codigo,
            
            '' as categoria,
            
            ncp.denominacion as denom,

            '' as um,

            1 as cantidad,

            COALESCE((select COALESCE(ddcp.valorcalculo,0) from mod_logfacturacion.dat_desglosecategoriapreciofactura ddcp
            where ddcp.idcategoriafactura = dcp.idcategoriafactura and ddcp.idmoneda = $2),0) as precio,

            COALESCE((select COALESCE(ddcp.valorcalculo*1,0) from mod_logfacturacion.dat_desglosecategoriapreciofactura ddcp
            where ddcp.idcategoriafactura = dcp.idcategoriafactura and ddcp.idmoneda = $2),0) as importe,

            COALESCE((select COALESCE(ddcp.valorcalculo,0) from mod_logfacturacion.dat_desglosecategoriapreciofactura ddcp
            where ddcp.idcategoriafactura = dcp.idcategoriafactura and ddcp.idmoneda = $3),0) as precioalternativo,

            COALESCE((select COALESCE(ddcp.valorcalculo*1,0) from mod_logfacturacion.dat_desglosecategoriapreciofactura ddcp
            where ddcp.idcategoriafactura = dcp.idcategoriafactura and ddcp.idmoneda = $3),0) as importealternativo,

            (select nm.codigoiso from mod_datosmaestros.nom_moneda nm where nm.idmoneda = $3) as monedaalternativa,

            (select nm.codigoiso from mod_datosmaestros.nom_moneda nm where nm.idmoneda = $2) as monedacontable,
            '' as numeroserie,
            0 as recargoalternativa,

            0 as recargocontable,
            'Z' as tipoindicador
            

            from mod_logfacturacion.dat_categoriapreciofactura dcp
            inner join mod_logfacturacion.nom_categoriaprecio ncp on ncp.idcategoriaprecio = dcp.idcategoriaprecio        
            where dcp.idfactura = $1)

            loop
                return next v_rec;
            end loop;
        else
        	for v_rec in              

            (select DISTINCT 

            ni.numeropieza as codigo,

            'Ninguno' as categoria,

            ni.denominacion as denom,

            num.abreviaturaunidadmedida as um,

            def.cantidad as cantidad,

            (select dde.preciotarifa from mod_logfacturacion.dat_desgloselemento dde where dde.idelementofactura = def.idelementofactura and dde.idmoneda = $2) as precio,

            (select dde.preciotarifa * def.cantidad from mod_logfacturacion.dat_desgloselemento dde where dde.idelementofactura = def.idelementofactura and dde.idmoneda = $2) as importe,

            (select dde.preciotarifa from mod_logfacturacion.dat_desgloselemento dde where dde.idelementofactura = def.idelementofactura and dde.idmoneda = $3) as precioalternativo,

            (select dde.preciotarifa * def.cantidad from mod_logfacturacion.dat_desgloselemento dde where dde.idelementofactura = def.idelementofactura and dde.idmoneda = $3) as importealternativo,

            (select nm.codigoiso from mod_datosmaestros.nom_moneda nm where nm.idmoneda = $3) as monedaalternativa,

            (select nm.codigoiso from mod_datosmaestros.nom_moneda nm where nm.idmoneda = $2) as monedacontable,
            'No tiene' as numeroserie,
            COALESCE(
            (select round((sum(case when ddcpf.concepto = '+' then COALESCE(ddcpf.valorcalculo,0) else 0 end) - sum(case when ddcpf.concepto = '-' then COALESCE(ddcpf.valorcalculo,0) else 0 end)),2)
            from mod_logfacturacion.dat_categoriapreciofactura dcpf 
            inner join mod_logfacturacion.dat_desglosecategoriapreciofactura ddcpf on ddcpf.idcategoriafactura = dcpf.idcategoriafactura
            where dcpf.idfactura = $1 and ddcpf.idmoneda = $3),0) as recargoalternativa,

            COALESCE((select round((sum(case when ddcpf.concepto = '+' then COALESCE(ddcpf.valorcalculo,0) else 0 end) - sum(case when ddcpf.concepto = '-' then COALESCE(ddcpf.valorcalculo,0) else 0 end)),2)
            from mod_logfacturacion.dat_categoriapreciofactura dcpf 
            inner join mod_logfacturacion.dat_desglosecategoriapreciofactura ddcpf on ddcpf.idcategoriafactura = dcpf.idcategoriafactura
            where dcpf.idfactura = $1 and ddcpf.idmoneda = $2),0) as recargocontable

            from mod_logfacturacion.dat_elementosfactura def
            left join mod_logfacturacion.dat_prodservnomenclador dpn on dpn.idelementofactura = def.idelementofactura        
            left join mod_logfacturacion.dat_activosfactura daf on daf.idelementofactura = def.idelementofactura
            left join mod_datosmaestros.nom_indicador ni on ni.idindicador = dpn.idindicador		
            left join mod_datosmaestros.nom_unidadmedida num on num.idunidadmedida = ni.idumedida
            where def.idfactura = $1)
            
            union 

            ( select

            'Ninguno' as codigo,

            'Ninguno' as categoria,

            'Ninguno' as denom,

            'Ninguno' as um,

            0 as cantidad,

            0 as precio,

            0 as importe,

            0 as precioalternativo,

            0 as importealternativo,

            (select nm.codigoiso from mod_datosmaestros.nom_moneda nm where nm.idmoneda = $3) as monedaalternativa,

            (select nm.codigoiso from mod_datosmaestros.nom_moneda nm where nm.idmoneda = $2) as monedacontable ,
            'No tiene' as numeroserie,
            COALESCE(
            (select round((sum(case when ddcpf.concepto = '+' then COALESCE(ddcpf.valorcalculo,0) else 0 end) - sum(case when ddcpf.concepto = '-' then COALESCE(ddcpf.valorcalculo,0) else 0 end)),2)
            from mod_logfacturacion.dat_categoriapreciofactura dcpf 
            inner join mod_logfacturacion.dat_desglosecategoriapreciofactura ddcpf on ddcpf.idcategoriafactura = dcpf.idcategoriafactura
            where dcpf.idfactura = $1 and ddcpf.idmoneda = $3),0) as recargoalternativa,

            COALESCE((select round((sum(case when ddcpf.concepto = '+' then COALESCE(ddcpf.valorcalculo,0) else 0 end) - sum(case when ddcpf.concepto = '-' then COALESCE(ddcpf.valorcalculo,0) else 0 end)),2)
            from mod_logfacturacion.dat_categoriapreciofactura dcpf 
            inner join mod_logfacturacion.dat_desglosecategoriapreciofactura ddcpf on ddcpf.idcategoriafactura = dcpf.idcategoriafactura
            where dcpf.idfactura = $1 and ddcpf.idmoneda = $2),0) as recargocontable

            from mod_logfacturacion.dat_elementosfactura def 

            inner join mod_logfacturacion.dat_actividadesfactura da on da.idelementofactura = def.idelementofactura

            left join mod_planificacion.nom_actividad na on na.idactividad = da.idactividad

            where def.idfactura = $1)

            union

            (select

            ni.numeropieza as codigo,

            nc.denominacion as categoria,

            ni.denominacion as denom,

            num.abreviaturaunidadmedida as um,

            dm.cantidad as cantidad,

            (select dmm1.precio from mod_logistica.dat_movmoneda dmm1 where dmm1.idmovimiento = dm.idmovimiento and dmm1.idmoneda = $2) as precio,

            (select dmm1.precio * dm.cantidad from mod_logistica.dat_movmoneda dmm1 where dmm1.idmovimiento = dm.idmovimiento and dmm1.idmoneda = $2) as importe,
            COALESCE((select dmm1.precio from mod_logistica.dat_movmoneda dmm1 where dmm1.idmovimiento = dm.idmovimiento and dmm1.idmoneda = $3),0) as precioalternativo,
            COALESCE((select dmm1.precio * dm.cantidad from mod_logistica.dat_movmoneda dmm1 where dmm1.idmovimiento = dm.idmovimiento and dmm1.idmoneda = $3),0) as importealternativo,

            
            (select nm.codigoiso from mod_datosmaestros.nom_moneda nm where nm.idmoneda = $3) as monedaalternativa,

            (select nm.codigoiso from mod_datosmaestros.nom_moneda nm where nm.idmoneda = $2) as monedacontable,
            'No tiene' as numeroserie,
            
            COALESCE(
            (select round((sum(case when ddcpf.concepto = '+' then COALESCE(ddcpf.valorcalculo,0) else 0 end) - sum(case when ddcpf.concepto = '-' then COALESCE(ddcpf.valorcalculo,0) else 0 end)),2)
            from mod_logfacturacion.dat_categoriapreciofactura dcpf 
            inner join mod_logfacturacion.dat_desglosecategoriapreciofactura ddcpf on ddcpf.idcategoriafactura = dcpf.idcategoriafactura
            where dcpf.idfactura = $1 and ddcpf.idmoneda = $3),0) as recargoalternativa,

            COALESCE((select round((sum(case when ddcpf.concepto = '+' then COALESCE(ddcpf.valorcalculo,0) else 0 end) - sum(case when ddcpf.concepto = '-' then COALESCE(ddcpf.valorcalculo,0) else 0 end)),2)
            from mod_logfacturacion.dat_categoriapreciofactura dcpf 
            inner join mod_logfacturacion.dat_desglosecategoriapreciofactura ddcpf on ddcpf.idcategoriafactura = dcpf.idcategoriafactura
            where dcpf.idfactura = $1 and ddcpf.idmoneda = $2),0) as recargocontable

            from mod_logistica.dat_movimiento dm

            inner join mod_logistica.dat_producto dprod on dprod.idproducto = dm.idproducto

            left join mod_datosmaestros.nom_indicador ni on ni.idindicador = dprod.idindicador

            left join mod_logistica.nom_categoria nc on nc.idcategoria = dprod.idcategoria

            left join mod_datosmaestros.nom_unidadmedida num on num.idunidadmedida = dm.idunidadmedida

            left join mod_logistica.dat_movmoneda dmm on dmm.idmovimiento = dm.idmovimiento

            left join mod_logfacturacion.dat_prodfactura dpf on dpf.idmovimiento = dm.idmovimiento

            where dm.iddocumento = $1)

            loop

                return next v_rec;

            end loop;
        end if;
		

	END;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
COST 100 ROWS 1000;

CREATE OR REPLACE FUNCTION mod_logfacturacion.f_modelonotadcprodsuchel (
  p_iddocumento numeric,
  p_monedacontable numeric,
  p_monedalternativa numeric
)
RETURNS SETOF mod_logfacturacion.td_modelofacturaprod AS
$body$
	DECLARE

	v_rec mod_logfacturacion.td_modelofacturaprod;
    v_count numeric = 0;
	v_pos numeric = 0;
    
	BEGIN    

		for v_rec in              

        (select DISTINCT 

        ni.numeropieza as codigo,

        'Ninguno' as categoria,

        ni.denominacion as denom,

        num.abreviaturaunidadmedida as um,

        def.cantidad as cantidad,

        (select (case when def.cantidad > 0 or dde.preciotarifa > 0 then abs(dde.preciotarifa-dde.preciotarifafactura)
        else 0 end) from mod_logfacturacion.dat_desgloselemento dde 
        where dde.idelementofactura = def.idelementofactura and dde.idmoneda = $2) as precio,

        (select (case when def.cantidad > 0 or dde.preciotarifa > 0 then abs(dde.preciotarifa-dde.preciotarifafactura)*def.cantidad
        else def.importe end) from mod_logfacturacion.dat_desgloselemento dde 
        where dde.idelementofactura = def.idelementofactura and dde.idmoneda = $2) as importe,

        (select dde.preciotarifa from mod_logfacturacion.dat_desgloselemento dde where dde.idelementofactura = def.idelementofactura and dde.idmoneda = $3) as precioalternativo,

        (select dde.preciotarifa * def.cantidad from mod_logfacturacion.dat_desgloselemento dde where dde.idelementofactura = def.idelementofactura and dde.idmoneda = $3) as importealternativo,

        (select nm.codigoiso from mod_datosmaestros.nom_moneda nm where nm.idmoneda = $3) as monedaalternativa,

        (select nm.codigoiso from mod_datosmaestros.nom_moneda nm where nm.idmoneda = $2) as monedacontable,
        'No tiene' as numeroserie,
        COALESCE(
        (select round((sum(case when ddcpf.concepto = '+' then COALESCE(ddcpf.valorcalculo,0) else 0 end) - sum(case when ddcpf.concepto = '-' then COALESCE(ddcpf.valorcalculo,0) else 0 end)),2)
        from mod_logfacturacion.dat_categoriapreciofactura dcpf 
        inner join mod_logfacturacion.dat_desglosecategoriapreciofactura ddcpf on ddcpf.idcategoriafactura = dcpf.idcategoriafactura
        where dcpf.idfactura = $1 and ddcpf.idmoneda = $3),0) as recargoalternativa,

        COALESCE((select round((sum(case when ddcpf.concepto = '+' then COALESCE(ddcpf.valorcalculo,0) else 0 end) - sum(case when ddcpf.concepto = '-' then COALESCE(ddcpf.valorcalculo,0) else 0 end)),2)
        from mod_logfacturacion.dat_categoriapreciofactura dcpf 
        inner join mod_logfacturacion.dat_desglosecategoriapreciofactura ddcpf on ddcpf.idcategoriafactura = dcpf.idcategoriafactura
        where dcpf.idfactura = $1 and ddcpf.idmoneda = $2),0) as recargocontable

        from mod_logfacturacion.dat_elementosfactura def
        left join mod_logfacturacion.dat_prodservnomenclador dpn on dpn.idelementofactura = def.idelementofactura        
        left join mod_logfacturacion.dat_activosfactura daf on daf.idelementofactura = def.idelementofactura
        left join mod_datosmaestros.nom_indicador ni on ni.idindicador = dpn.idindicador		
        left join mod_datosmaestros.nom_unidadmedida num on num.idunidadmedida = ni.idumedida
        where def.idfactura = $1)
        
        union 

        ( select

        'Ninguno' as codigo,

        'Ninguno' as categoria,

        'Ninguno' as denom,

        'Ninguno' as um,

        0 as cantidad,

        0 as precio,

        0 as importe,

        0 as precioalternativo,

        0 as importealternativo,

        (select nm.codigoiso from mod_datosmaestros.nom_moneda nm where nm.idmoneda = $3) as monedaalternativa,

        (select nm.codigoiso from mod_datosmaestros.nom_moneda nm where nm.idmoneda = $2) as monedacontable ,
        'No tiene' as numeroserie,
        COALESCE(
        (select round((sum(case when ddcpf.concepto = '+' then COALESCE(ddcpf.valorcalculo,0) else 0 end) - sum(case when ddcpf.concepto = '-' then COALESCE(ddcpf.valorcalculo,0) else 0 end)),2)
        from mod_logfacturacion.dat_categoriapreciofactura dcpf 
        inner join mod_logfacturacion.dat_desglosecategoriapreciofactura ddcpf on ddcpf.idcategoriafactura = dcpf.idcategoriafactura
        where dcpf.idfactura = $1 and ddcpf.idmoneda = $3),0) as recargoalternativa,

        COALESCE((select round((sum(case when ddcpf.concepto = '+' then COALESCE(ddcpf.valorcalculo,0) else 0 end) - sum(case when ddcpf.concepto = '-' then COALESCE(ddcpf.valorcalculo,0) else 0 end)),2)
        from mod_logfacturacion.dat_categoriapreciofactura dcpf 
        inner join mod_logfacturacion.dat_desglosecategoriapreciofactura ddcpf on ddcpf.idcategoriafactura = dcpf.idcategoriafactura
        where dcpf.idfactura = $1 and ddcpf.idmoneda = $2),0) as recargocontable

        from mod_logfacturacion.dat_elementosfactura def 

        inner join mod_logfacturacion.dat_actividadesfactura da on da.idelementofactura = def.idelementofactura

        left join mod_planificacion.nom_actividad na on na.idactividad = da.idactividad

        where def.idfactura = $1)

        union

        (select

        ni.numeropieza as codigo,

        nc.denominacion as categoria,

        ni.denominacion as denom,

        num.abreviaturaunidadmedida as um,

        (case when dm.cantidad > 0 then dm.cantidad 
        when dpf.importe > 0 then 0 else dpf.cantidadfactura end) as cantidad,

        (select (case when (dmm1.precio > 0 or dm.cantidad > 0) then (
        case when dmm1.precio <> dpf1.preciofactura then abs(dmm1.precio-dpf1.preciofactura)
         else dpf1.preciofactura end
        ) 
        else 0 end) from mod_logistica.dat_movmoneda dmm1 
        inner join mod_logfacturacion.dat_prodfactura dpf1 on dpf1.idmovimiento = dm.idmovimiento
        where dmm1.idmovimiento = dm.idmovimiento and dmm1.idmoneda = $2) as precio,

        (select (case when (dmm1.precio > 0 or dm.cantidad > 0) then (
        case when dmm1.precio <> dpf1.preciofactura then abs(dmm1.precio-dpf1.preciofactura)
         else dpf1.preciofactura end
        )*
        (case when dm.cantidad > 0 then dm.cantidad else dpf1.cantidadfactura end) 
        else dpf1.importe end) from mod_logistica.dat_movmoneda dmm1 
        inner join mod_logfacturacion.dat_prodfactura dpf1 on dpf1.idmovimiento = dm.idmovimiento
        where dmm1.idmovimiento = dm.idmovimiento and dmm1.idmoneda = $2) as importe,
		
        COALESCE((select dmm1.precio from mod_logistica.dat_movmoneda dmm1 where dmm1.idmovimiento = dm.idmovimiento and dmm1.idmoneda = $3),0) as precioalternativo,
		COALESCE((select dmm1.precio * dm.cantidad from mod_logistica.dat_movmoneda dmm1 where dmm1.idmovimiento = dm.idmovimiento and dmm1.idmoneda = $3),0) as importealternativo,

        
        (select nm.codigoiso from mod_datosmaestros.nom_moneda nm where nm.idmoneda = $3) as monedaalternativa,

        (select nm.codigoiso from mod_datosmaestros.nom_moneda nm where nm.idmoneda = $2) as monedacontable,
        'No tiene' as numeroserie,
        
        COALESCE(
        (select round((sum(case when ddcpf.concepto = '+' then COALESCE(ddcpf.valorcalculo,0) else 0 end) - sum(case when ddcpf.concepto = '-' then COALESCE(ddcpf.valorcalculo,0) else 0 end)),2)
        from mod_logfacturacion.dat_categoriapreciofactura dcpf 
        inner join mod_logfacturacion.dat_desglosecategoriapreciofactura ddcpf on ddcpf.idcategoriafactura = dcpf.idcategoriafactura
        where dcpf.idfactura = $1 and ddcpf.idmoneda = $3),0) as recargoalternativa,

        COALESCE((select round((sum(case when ddcpf.concepto = '+' then COALESCE(ddcpf.valorcalculo,0) else 0 end) - sum(case when ddcpf.concepto = '-' then COALESCE(ddcpf.valorcalculo,0) else 0 end)),2)
        from mod_logfacturacion.dat_categoriapreciofactura dcpf 
        inner join mod_logfacturacion.dat_desglosecategoriapreciofactura ddcpf on ddcpf.idcategoriafactura = dcpf.idcategoriafactura
        where dcpf.idfactura = $1 and ddcpf.idmoneda = $2),0) as recargocontable

        from mod_logistica.dat_movimiento dm

        inner join mod_logistica.dat_producto dprod on dprod.idproducto = dm.idproducto

        left join mod_datosmaestros.nom_indicador ni on ni.idindicador = dprod.idindicador

        left join mod_logistica.nom_categoria nc on nc.idcategoria = dprod.idcategoria

        left join mod_datosmaestros.nom_unidadmedida num on num.idunidadmedida = dm.idunidadmedida

        left join mod_logistica.dat_movmoneda dmm on dmm.idmovimiento = dm.idmovimiento

        left join mod_logfacturacion.dat_prodfactura dpf on dpf.idmovimiento = dm.idmovimiento

        where dm.iddocumento = $1 and 
        (dpf.importe > 0 or (
        dm.cantidad > 0 and (select ndp.abreviatura from mod_datosmaestros.nom_docprim ndp
        inner join mod_datosmaestros.dat_documentoprim ddpr using(iddocumentos)
        inner join mod_logistica.dat_documento ddd using(iddoc)
        where ddd.iddocumento = $1 limit 1
        ) = 'creditoLog'
        ) or dmm.precio <> dpf.preciofactura))

		loop  
			return next v_rec;
		end loop;

	END;
$body$
LANGUAGE 'plpgsql'
VOLATILE
CALLED ON NULL INPUT
SECURITY INVOKER
PARALLEL UNSAFE
COST 100 ROWS 1000;

ALTER FUNCTION mod_logfacturacion.f_modelonotadcprodsuchel (p_iddocumento numeric, p_monedacontable numeric, p_monedalternativa numeric)
  OWNER TO zeolides;