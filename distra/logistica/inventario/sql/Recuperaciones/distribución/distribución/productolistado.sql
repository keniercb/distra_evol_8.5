SELECT DISTINCT
dpo.codigoproducto,
dpo.nombreproducto,
dpo.cantidadordenada as cantidad,
dpo.unidadmedidaproducto,
dpo.categoria,
dpo.preciocontable,
coalesce(dpo.preciocontable * dpo.cantidadordenada,0) as importe,
dpo.entregado  as cantdespachado,
(dpo.cantidadoriginal - dpo.entregado) as catparcial,
dpo.precioalternativo as preciocuc,
coalesce(dpo.precioalternativo * dpo.cantidadordenada,0) as importecuc,
dpo.deposito as deposito,
ddc.nombre as entregar,
ddc.direccion as direccion,
(select ddc1.numerocuenta from mod_logistica.v_documentocliente ddc1 where ddc1.iddocumento = dpo.idorden and ddc1.idcliente = dpo.idcliente limit 1) cuentabancaria,
(select ddc1.numerosucursal from mod_logistica.v_documentocliente ddc1 where ddc1.iddocumento = dpo.idorden and ddc1.idcliente = dpo.idcliente limit 1) as numerosucursal,
ddc.tipocliente as tipocliente,
dpo.ubicacioncompleta as ubicacioncompleta,
dpo.idprodorden,
(select nm.codigoiso from mod_datosmaestros.nom_moneda nm where nm.idmoneda =  $P{monedaalternativa}) as monedaalternativa,
(select nm.codigoiso from mod_datosmaestros.nom_moneda nm where nm.idmoneda = $P{monedacontable}) as monedacontable,
(select * from mod_loginventario.f_obtenerubicompleta(deup.idestructuraubicacion,deup.nivel)) as ubicacioncompleta,

case when conf.ordenproducto = 1 then ni.codigo end as codigoproducto,
case when conf.ordenproducto = 2 then ni.denominacion end as denomproducto,
case when conf.ordenproducto = 3 then dpo.idprodorden end as ordeninsercion,
case when conf.ordenproducto = 4 then ni.numeropieza end as codigofabricante,
case when conf.ordenproducto = 5 then nat.denominacion end as naturalezaprod,
conf.ordenproducto
FROM mod_logistica.v_prodorden dpo
INNER JOIN mod_logistica.v_documentocliente ddc ON ddc.iddocumento = dpo.idorden and ddc.idcliente = dpo.idcliente
LEFT JOIN mod_logubicacion.dat_ubicacionproducto dup on dup.idproducto = dpo.idproducto
LEFT JOIN mod_logubicacion.dat_estructuraubicacion deup on deup.idestructuraubicacion = dup.idubicacion

left join mod_logistica.dat_producto dp on dp.idproducto = dpo.idproducto 
left join mod_datosmaestros.nom_indicador ni on ni.idindicador = dp.idindicador
left join mod_loginventario.conf_inventario conf on conf.idestructuracomun = dp.idestructuracomun
left join mod_datosmaestros.nom_naturaleza nat on nat.idnaturaleza = ni.idnaturaleza

WHERE dpo.idorden = $P{iddocumento}
ORDER BY
case when conf.ordenproducto = 1 then ni.codigo end,
case when conf.ordenproducto = 2 then ni.denominacion end,
case when conf.ordenproducto = 3 then dpo.idprodorden end,--cambio
case when conf.ordenproducto = 4 then ni.numeropieza end,
case when conf.ordenproducto = 5 then nat.denominacion end
