SELECT DISTINCT
		dm.codigoproducto,
		dm.nombreproducto,
		dm.unidadmedidamovimiento,
		dm.categoria,		
		dm.existencia,
		dm.preciounitariototalmovimiento,
		dm.cantidadmovimiento,
		dm.importetotalmovimiento,
		dm.precioalternativomovimiento,
		dm.importetotalaltmovimiento,
		dm.cuentacontable as cuenta,
		dm.cuentaalternativa as cuentaalt,
		(SELECT nm.codigoiso FROM mod_datosmaestros.nom_moneda nm WHERE nm.idmoneda = $P{monedaalternativa}) as monedaalternativa,
		(SELECT nm.codigoiso FROM mod_datosmaestros.nom_moneda nm WHERE nm.idmoneda = $P{monedacontable}) as monedacontable,
		case when conf.ordenproducto = 1 then ni.codigo end as codigoproducto,
		case when conf.ordenproducto = 2 then ni.denominacion end as denomproducto,
		case when conf.ordenproducto = 3 then dm.idmovimiento end as ordeninsercion,
		case when conf.ordenproducto = 4 then ni.numeropieza end as codigofabricante,
		case when conf.ordenproducto = 5 then nat.denominacion end as naturalezaprod,
		conf.ordenproducto
		FROM mod_logistica.v_movimiento dm 
		left join mod_logistica.dat_producto dp on dp.idproducto = dm.idproducto 
		left join mod_datosmaestros.nom_indicador ni on ni.idindicador = dp.idindicador
		left join mod_loginventario.conf_inventario conf on conf.idestructuracomun = dp.idestructuracomun
		left join mod_datosmaestros.nom_naturaleza nat on nat.idnaturaleza = ni.idnaturaleza
		WHERE dm.iddocumento = $P{iddocumento}
		order by 
			case when conf.ordenproducto = 1 then ni.codigo end,
			case when conf.ordenproducto = 2 then ni.denominacion end,
			case when conf.ordenproducto = 3 then dm.idmovimiento end,
			case when conf.ordenproducto = 4 then ni.numeropieza end,
			case when conf.ordenproducto = 5 then nat.denominacion end
