--6. inicio/inventario/almacen/gestionar ajustes de inventarios/imprimir modelo.

SELECT DISTINCT
	dm.codigoproducto,
	dm.categoria,
	dm.nombreproducto,
	dm.unidadmedidamovimiento,
	COALESCE(dm.cantidadmovimiento,0) as cantidadproducto,
	COALESCE(dm.preciocontablemovimiento,0) as preciocontablemovimiento,
	(CASE WHEN nop.codigooperacion in ('OPER_INV_IMPORTE_MAS','OPER_INV_IMPORTE_MEN') THEN
 			COALESCE(dm.importetotalmovimiento,0)
       	ELSE COALESCE(ROUND(dm.cantidadmovimiento * dm.preciocontablemovimiento,2),0)
      END) as importemovimiento,
	COALESCE(dm.precioalternativomovimiento,0) as precioalternativomovimiento,
	COALESCE(dm.importetotalaltmovimiento,0) as importealtmovimiento,
	(select nm.codigoiso from mod_datosmaestros.nom_moneda nm where nm.idmoneda = $P{monedaalternativa}) as monedaalternativa,
	(select nm.codigoiso from mod_datosmaestros.nom_moneda nm where nm.idmoneda = $P{monedacontable}) as monedacontable,
	dm.cuentacontable as cuenta,
	dm.cuentaalternativa as cuentaalt,
	COALESCE(dm.existencia,0) as existencia,
	( CASE WHEN nop.codigooperacion in ('OPER_INV_SOBRANTE') THEN COALESCE(dm.existencia,0) + COALESCE(dm.cantidadmovimiento,0)
    	   WHEN nop.codigooperacion in ('OPER_INV_FALTANTE','OPER_INV_ROTURA','OPER_INV_MERMA') THEN COALESCE(dm.existencia,0) - COALESCE(dm.cantidadmovimiento,0)
       ELSE COALESCE(dm.existencia,0)
       END) as existenciainventario,

	case when conf.ordenproducto = 1 then ni.codigo end as codigoproducto_ord,
	case when conf.ordenproducto = 2 then ni.denominacion end as denomproducto_ord,
	case when conf.ordenproducto = 3 then dm.idmovimiento end as ordeninsercion_ord,
	case when conf.ordenproducto = 4 then ni.numeropieza end as codigofabricante_ord,
	case when conf.ordenproducto = 5 then nat.denominacion end as naturalezaprod_ord,
	conf.ordenproducto
	
FROM mod_loginventario.dat_ajuste daj
LEFT JOIN mod_logistica.v_movimiento dm on daj.idajuste = dm.iddocumento
LEFT JOIN mod_datosmaestros.nom_operacion nop on nop.idnomoperaciones = daj.idoperacion
left join mod_logistica.dat_producto pr on pr.idproducto = dm.idproducto
left join mod_datosmaestros.nom_indicador ni on ni.idindicador = pr.idindicador
left join mod_loginventario.conf_inventario conf on conf.idestructuracomun = pr.idestructuracomun
left join mod_datosmaestros.nom_naturaleza nat on nat.idnaturaleza = ni.idnaturaleza
WHERE daj.idajuste = $P{iddocumento}
order by 
		case when conf.ordenproducto = 1 then ni.codigo end,
		case when conf.ordenproducto = 2 then ni.denominacion end,
		case when conf.ordenproducto = 3 then dm.idmovimiento end,
		case when conf.ordenproducto = 4 then ni.numeropieza end,
		case when conf.ordenproducto = 5 then nat.denominacion end
