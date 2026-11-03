CREATE OR REPLACE FUNCTION mod_logpuntoventa.f_listadodocumentosventa (
  p_idestructuraop varchar,
  p_fechainicio date,
  p_fechafin date,
  p_idestructura numeric,
  p_idcliente numeric,
  p_creadopor numeric,
  p_idproducto numeric,
  p_busqueda varchar,
  p_idmodopago numeric
)
RETURNS SETOF mod_logpuntoventa.td_listadocumentos AS
$body$
  DECLARE
  v_rec mod_logpuntoventa.td_listadocumentos;
  v_idperiodo numeric;
  v_ejercicio record;
  BEGIN
  if p_idestructura is not null and p_fechainicio is null and p_fechafin is null then
  	v_ejercicio = mod_logistica.f_obtenerejercicioactivo(13, p_idestructura);
    v_idperiodo = v_ejercicio.idperiodoactual;
  else 
  	v_idperiodo = null; 
  end if;
    for v_rec in 
    SELECT distinct d.iddocumento, d.nrodoc,d.fechacontable, v.importe - COALESCE(v.importedevuelto,0), 
    count(vp.idventaproducto)
    /*(select count(vp.idventaproducto) FROM mod_logpuntoventa.dat_ventaproducto vp 
    WHERE vp.idventas = d.iddocumento)*/ as productos,
    (vc.numeroidentidad ||' - '||vc.nombre) as cliente,
    '' as nroventa,null as fechaventa, mp.denominacion,
    d.observaciones, v.vendedor,(es.codigo||' - '||es.denominacion) as areaventa,d.hora,de.codigo||' - '||de.denominacion,
    i.urllogo,cv.fecha
    FROM mod_logistica.dat_documento d 
    INNER JOIN mod_logpuntoventa.dat_ventas v ON d.iddocumento = v.idventas 
    INNER JOIN mod_logpuntoventa.dat_ventaproducto vp on vp.idventas = v.idventas
    LEFT JOIN mod_logpuntoventa.dat_cierreventa cv ON v.idcierreventa = cv.idcierreventa 
    LEFT JOIN mod_logpuntoventa.dat_ventacliente vc ON v.idpersona = vc.idventacliente 
    LEFT JOIN mod_logpuntoventa.dat_ventaorden vo ON vo.idventas = v.idventas 
    INNER JOIN mod_logpuntoventa.nom_modopago mp ON v.idpago = mp.idmodopago
    INNER JOIN mod_datosmaestros.dat_documentoprim ddp ON ddp.iddoc = d.iddoc 
    INNER JOIN mod_datosmaestros.dat_estructurasubsist des ON des.idestructurasubsist = ddp.idestructurasubsist
    LEFT JOIN mod_estructuracomp.v_dametodasestructuras de on de.idestructura = p_idestructura
    LEFT JOIN mod_estructuracomp.v_dametodasestructuras es on es.idestructura = d.idestructuracomun
    INNER JOIN mod_logistica.conf_general i on i.idestructura = de.idestructura
    WHERE des.idestructuracomun = p_idestructura AND 1 = 1 
    AND (d.fechacontable >= p_fechainicio or p_fechainicio is null)
    AND (d.fechacontable <= p_fechafin or p_fechafin is null)
    AND (CASE WHEN v_idperiodo is null then true ELSE d.idperiodo = v_idperiodo end)
    AND (vc.idventacliente = p_idcliente or p_idcliente is null)
    AND (d.idusuario = p_creadopor or p_creadopor is null)
    AND (vp.idproducto = p_idproducto or p_idproducto is null)
    AND (d.nrodoc::varchar = p_busqueda or vc.numeroidentidad = p_busqueda or p_busqueda is null )
    group by d.iddocumento, d.nrodoc,d.fechacontable, v.importe,v.importedevuelto,
    vc.numeroidentidad,vc.nombre,mp.denominacion,d.observaciones, v.vendedor,es.codigo,es.denominacion,
    d.hora,de.codigo,de.denominacion,i.urllogo,cv.fecha
    ORDER BY areaventa,d.iddocumento desc
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

ALTER FUNCTION mod_logpuntoventa.f_listadodocumentosventa (p_idestructuraop varchar, p_fechainicio date, p_fechafin date, p_idestructura numeric, p_idcliente numeric, p_creadopor numeric, p_idproducto numeric, p_busqueda varchar, p_idmodopago numeric)
  OWNER TO zeolides;

CREATE OR REPLACE FUNCTION mod_logpuntoventa.f_listadodocumentosdev (
  p_idestructuraop varchar,
  p_fechainicio date,
  p_fechafin date,
  p_idestructura numeric,
  p_idcliente numeric,
  p_creadopor numeric,
  p_idproducto numeric,
  p_busqueda varchar,
  p_idmodopago numeric
)
RETURNS SETOF mod_logpuntoventa.td_listadocumentos AS
$body$
  DECLARE
  v_rec mod_logpuntoventa.td_listadocumentos;
  v_idperiodo numeric;
  v_ejercicio record;
  BEGIN
  if p_idestructura is not null and p_fechainicio is null and p_fechafin is null then
  	v_ejercicio = mod_logistica.f_obtenerejercicioactivo(13, p_idestructura);
    v_idperiodo = v_ejercicio.idperiodoactual;
  else 
  	v_idperiodo = null; 
  end if;
    for v_rec in 
    SELECT distinct dd.iddevolucion, d.nrodoc,dd.fecha, dd.totalefectdevuelto, 
    (select count(dpd.idproductodevolucion) FROM mod_logpuntoventa.dat_productodevolucion dpd 
    WHERE dpd.iddevolucion = dd.iddevolucion) as productos,
    (dvc.numeroidentidad ||' - '||dvc.nombre) as cliente,
    dv.nroventa,dv.fechaventa, (case when dd.tipodevolucion = 1 then 'Devolución parcial' else 'Devolución total' end),
    dd.motivodevolucion, dv.vendedor,(es.codigo||' - '||es.denominacion) as areaventa,d.hora,de.codigo||' - '||de.denominacion,
    i.urllogo
    FROM mod_logpuntoventa.dat_devolucion dd 
    INNER JOIN mod_logpuntoventa.dat_ventas dv ON (dv.idventas = dd.idventas) 
    INNER JOIN mod_logpuntoventa.dat_ventaproducto dvp ON (dvp.idventas = dv.idventas) 
    INNER JOIN mod_logpuntoventa.dat_cajausuario dcu ON (dcu.idcaja = dv.idcaja) 
    INNER JOIN mod_logistica.dat_documento d ON d.iddocumento = dd.iddevolucion 
    INNER JOIN mod_datosmaestros.dat_documentoprim ddp ON ddp.iddoc = d.iddoc 
    INNER JOIN mod_datosmaestros.dat_estructurasubsist des ON des.idestructurasubsist = ddp.idestructurasubsist 
    LEFT JOIN mod_logpuntoventa.dat_ventacliente dvc ON (dvc.idventacliente = dv.idpersona) 
    LEFT JOIN mod_estructuracomp.v_dametodasestructuras de on de.idestructura = p_idestructura
    LEFT JOIN mod_estructuracomp.v_dametodasestructuras es on es.idestructura = d.idestructuracomun
    INNER JOIN mod_logistica.conf_general i on i.idestructura = de.idestructura
    WHERE des.idestructuracomun = p_idestructura AND 1 = 1 
    AND (d.fechacontable >= p_fechainicio or p_fechainicio is null)
    AND (d.fechacontable <= p_fechafin or p_fechafin is null)
    AND (CASE WHEN v_idperiodo is null then true ELSE d.idperiodo = v_idperiodo end)
    AND (dvc.idventacliente = p_idcliente or p_idcliente is null)
    AND (dcu.idusuario = p_creadopor or p_creadopor is null)
    AND (dvp.idproducto = p_idproducto or p_idproducto is null)
    AND (d.nrodoc::varchar = p_busqueda or dvc.numeroidentidad = p_busqueda or p_busqueda is null )
    ORDER BY areaventa,dd.iddevolucion desc
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

ALTER FUNCTION mod_logpuntoventa.f_listadodocumentosdev (p_idestructuraop varchar, p_fechainicio date, p_fechafin date, p_idestructura numeric, p_idcliente numeric, p_creadopor numeric, p_idproducto numeric, p_busqueda varchar, p_idmodopago numeric)
  OWNER TO zeolides;