SELECT DISTINCT cg.urllogo as logo,
       doc.nrodoc,
       doc.numeroref,
       tm.consultoriomedico,
       vc.numeroidentidad,
       vc.nombre as paciente,
       doc.fechacontable,
       us.nombreusuario as aprobadopor,
       (CASE
          WHEN doc.estado = 1 THEN 'Elaboración'
          WHEN doc.estado = 2 THEN 'Preparado'
          WHEN doc.estado = 3 THEN 'Aprobado'
          ELSE '-'
        END) as estado,
       ptm_counts.cantidad as cantidadproductos
FROM mod_logfarmacia.dat_tarjetamedicamento tm
     INNER JOIN mod_logistica.dat_documento doc ON doc.iddocumento = tm.idtarjetamedicamento
     INNER JOIN mod_logpuntoventa.dat_ventacliente vc ON vc.idventacliente = tm.idpaciente
     LEFT JOIN mod_logpuntoventa.dat_ventas vent ON vent.idpersona = vc.idventacliente
     LEFT JOIN mod_logistica.conf_general cg ON cg.idestructura = doc.idestructuracomun
     LEFT JOIN mod_seguridad.seg_usuario u ON u.idusuario = doc.idusuario
     LEFT JOIN mod_seguridad.seg_usuario us ON us.idusuario = doc.aprobadopor
     LEFT JOIN mod_logfarmacia.dat_productotarjetamedicamento ptm ON ptm.idtarjetamedicamento = tm.idtarjetamedicamento
LEFT JOIN (
    SELECT idtarjetamedicamento, count(idproductotarjetamedicamento) as cantidad
    FROM mod_logfarmacia.dat_productotarjetamedicamento
    GROUP BY idtarjetamedicamento
) ptm_counts ON ptm_counts.idtarjetamedicamento = tm.idtarjetamedicamento
  WHERE doc.estado in(1,2,3)
AND(Case WHEN $P{nrotarjeta} is not null THEN doc.nrodoc = $P{nrotarjeta} else true end)
AND(Case WHEN $P{estado} is not null THEN doc.estado = $P{estado} else true end)
AND(Case WHEN $P{cipaciente} is not null THEN vc.numeroidentidad ILIKE '%' || $P{cipaciente} ||'%'  else true end)
AND(Case WHEN $P{nombre} is not null THEN  vc.nombre ILIKE '%' || $P{nombre} ||'%'  else true end)
AND(Case WHEN $P{creadopor} is not null THEN  u.nombreusuario = $P{creadopor} else true end)
AND(Case WHEN $P{aprobadopor} is not null THEN  doc.aprobadopor = $P{aprobadopor} else true end)
AND(Case WHEN $P{fechaemision} is not null THEN  ptm.fechaemision = to_date($P{fechaemision},'DD/MM/YYYY') else true end)
AND(Case WHEN $P{fechaexpiracion} is not null THEN  ptm.fechaexpiracion = to_date($P{fechaexpiracion},'DD/MM/YYYY') else true end)
AND(Case WHEN $P{fechainicio} is not null THEN doc.fechacontable = to_date($P{fechainicio},'DD/MM/YYYY') else true end)
AND(Case WHEN $P{fechafin} is not null THEN doc.fechacontable = to_date($P{fechafin},'DD/MM/YYYY') else true end)
order by tm.consultoriomedico, doc.numeroref DESC
