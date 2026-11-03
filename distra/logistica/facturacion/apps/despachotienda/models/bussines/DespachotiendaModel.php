<?php

class DespachotiendaModel extends BaseModel
{

    public function __construct()
    {
        parent::__construct();
    }

    public function cargarDespachos($parametros = array())
    {
        $and = "";
        if ($parametros['criterio']) {
            $and .= " and (cast(dt.nrodespacho as varchar) = '{$parametros['criterio']}' or dt.centroentrega ilike '%{$parametros['criterio']}%')";
        }
        $respuesta = $this->doctrineHelper->getConnection()->execute(
            "SELECT dt.*, COUNT(*) OVER() as total FROM mod_logfacturacion.dat_despachotienda dt 
            INNER JOIN mod_estructuracomp.v_dametodasestructuras est on est.idestructura = dt.idestructuracomun
			WHERE dt.idestructuracomun = {$this->global->Estructura->idestructura} {$and}
			and dt.iddeposito = {$parametros['idestructura']} 
			order by dt.nrodespacho DESC, dt.nroreferencia DESC 
			offset {$parametros['start']} limit {$parametros['limit']}"
        )->fetchAll(PDO::FETCH_ASSOC);
        return array('datos' => $respuesta, 'cantidad' => (count($respuesta) ? $respuesta[0]['total'] : 0));
    }

    public function devolverFacturas($parametros)
    {
        $distinct = "";
        $addNroPed = "";
        $groupBy = " group by dd.iddocumento, desf.iddespachofactura, ddc.idcliente, df.nrofactura, dd.numeroref ";
        $limit = "";
        $and = "";
        $tipoVenta = $this->doctrineHelper->getConnection()->execute(
            "select da.tipoventa from mod_logpuntoventa.dat_areaventa da
            inner join mod_logpuntoventa.dat_centroentregaalmacen cent on cent.idareaventa = da.idareaventa
            inner join mod_logfacturacion.dat_despachotienda desp on desp.iddeposito = da.idestructuraop
            where desp.iddespachotienda = {$parametros['iddespachotienda']} limit 1"
            )->fetchAll(PDO::FETCH_ASSOC);
        if ($tipoVenta[0]['tipoventa'] != 2) {
            $addNroPed = "pt.nropedido,";
            $distinct = " distinct ";
            $groupBy = "";
        }

        if (isset($parametros['start']) && isset($parametros['limit'])) {
            $limit .= " offset {$parametros['start']} limit {$parametros['limit']} ";
        }
        if ($parametros['criterio']) {
            $and .= " and (cast(df.nrofactura as varchar) = '{$parametros['criterio']}' 
                           or cast(dd.numeroref as varchar) = '{$parametros['criterio']}' 
                           or pt.nropedido ilike '%{$parametros['criterio']}%')";
        }
        $respuesta = $this->doctrineHelper->getConnection()->execute(
            "SELECT {$distinct} dd.iddocumento,dd.numeroref as nroreferencia,desf.iddespachofactura,
            (select coalesce(ncp.nombre,de.denominacion) from mod_datosmaestros.nom_clientesproveedor ncp 
            left join mod_estructuracomp.v_dametodasestructuras de on de.idestructura = ncp.idestructura 
            where ncp.idclientesproveedores = ddc.idcliente) as cliente, {$addNroPed} 
            coalesce(cast(df.nrofactura as varchar),'-') as nrofactura,COUNT(*) OVER() as total
            FROM mod_logistica.dat_documento dd
            INNER JOIN mod_logfacturacion.dat_docfactura df on df.idfactura = dd.iddocumento
            INNER JOIN mod_logfacturacion.dat_despachofactura desf on desf.idfactura = df.idfactura
            INNER JOIN mod_logpuntoventa.dat_pedidodocumento pd on pd.iddocumento = df.idfactura
            INNER JOIN mod_logpuntoventa.dat_pedidotienda pt on pt.idpedidotienda = pd.idpedido
            inner join mod_logistica.dat_documentocliente ddc on ddc.iddocumento = dd.iddocumento
            WHERE desf.iddespachotienda = {$parametros['iddespachotienda']} {$and}{$groupBy}
			order by dd.numeroref{$limit}"
        )->fetchAll(PDO::FETCH_ASSOC);
        return array('datos' => $respuesta, 'cantidad' => (count($respuesta) ? $respuesta[0]['total'] : 0));
    }

    public function devolverProductos($parametros)
    {
        $limit = $filtro = "";
        if ($parametros['criterio']) {
            $filtro .= " and (ni.numeropieza ilike '%{$parametros['criterio']}%' or 
            ni.denominacion ilike '%{$parametros['criterio']}%') ";
        }
        if (isset($parametros['start']) && isset($parametros['limit'])) {
            $limit .= " offset {$parametros['start']} limit {$parametros['limit']} ";
        }
        $respuesta = $this->doctrineHelper->getConnection()->execute(
            "SELECT distinct prod.iddespachoproducto, prod.*, COUNT(*) OVER() as total, ni.denominacion as descripcionventa,
            nu.abreviaturaunidadmedida as umedida, ni.numeropieza as codreferencia
            FROM mod_logfacturacion.dat_despachoproducto prod
            inner join mod_logfacturacion.dat_despachotienda dt on dt.iddespachotienda = prod.iddespachotienda
            INNER JOIN mod_logistica.dat_producto dp on dp.idproducto = prod.idproducto and dp.idestructura = dt.iddeposito
            INNER JOIN mod_datosmaestros.nom_indicador ni on ni.idindicador = dp.idindicador
            INNER JOIN mod_datosmaestros.nom_unidadmedida nu on nu.idunidadmedida = dp.idumedida
			WHERE prod.iddespachotienda = {$parametros['iddespachotienda']}{$filtro} 
			group by prod.iddespachoproducto, ni.denominacion, ni.numeropieza, nu.abreviaturaunidadmedida
			order by ni.numeropieza{$limit}"
        )->fetchAll(PDO::FETCH_ASSOC);
        return array('datos' => $respuesta, 'cantidad' => (count($respuesta) ? $respuesta[0]['total'] : 0));
    }

    public function devolverProductosPedido($parametros)
    {
        $limit = $filtro = "";
        if ($parametros['criterio']) {
            $filtro .= " and (ni.numeropieza ilike '%{$parametros['criterio']}%' or 
            ni.denominacion ilike '%{$parametros['criterio']}%') ";
        }
        if (isset($parametros['start']) && isset($parametros['limit'])) {
            $limit .= " offset {$parametros['start']} limit {$parametros['limit']} ";
        }
        $facturas = implode(',',$parametros['facturas']);
        $respuesta = $this->doctrineHelper->getConnection()->execute(
            "SELECT DISTINCT ni.idindicador, ni.denominacion as descripcionventa, sum(dpp.cantidadreal-coalesce(dpp.devuelto,0)) as cantidad,
            nu.abreviaturaunidadmedida as umedida, ni.numeropieza as codreferencia, COUNT(*) OVER() as total
            FROM mod_datosmaestros.nom_indicador ni
            INNER JOIN mod_logistica.dat_producto dp on dp.idindicador = ni.idindicador
            INNER JOIN mod_datosmaestros.nom_unidadmedida nu on nu.idunidadmedida = dp.idumedida
            inner join mod_logistica.dat_movimiento dm on dm.idproducto = dp.idproducto
            inner join mod_logpuntoventa.dat_pedidodocumento pd on pd.iddocumento = dm.iddocumento
            inner join mod_logpuntoventa.dat_pedidoproducto dpp on dpp.idpedidotienda = pd.idpedido and dpp.idproducto = dp.idproducto
			WHERE dm.iddocumento in ({$facturas}) {$filtro} 
			group by ni.idindicador, nu.abreviaturaunidadmedida
			order by ni.numeropieza{$limit}"
        )->fetchAll(PDO::FETCH_ASSOC);
        /*$respuesta = $this->doctrineHelper->getConnection()->execute(
            "SELECT DISTINCT ni.idindicador, ni.denominacion as descripcionventa,
            nu.abreviaturaunidadmedida as umedida, ni.numeropieza as codreferencia, COUNT(*) OVER() as total
            FROM mod_datosmaestros.nom_indicador ni
            INNER JOIN mod_logistica.dat_producto dp on dp.idindicador = ni.idindicador
            INNER JOIN mod_datosmaestros.nom_unidadmedida nu on nu.idunidadmedida = dp.idumedida
			WHERE dp.idproducto in (
			 select dm.idproducto from mod_logistica.dat_movimiento dm where dm.iddocumento in ({$facturas})
			) {$filtro} 
			order by ni.numeropieza{$limit}"
        )->fetchAll(PDO::FETCH_ASSOC);*/
        return array('datos' => $respuesta, 'cantidad' => (count($respuesta) ? $respuesta[0]['total'] : 0));
    }

    public function guardarDespacho($params) {
        $estado = Doctrine::getTable('DatDespachotienda')->find($params['iddespacho']);
        if ($estado->estado == 1) {
            $coll = new Doctrine_Collection('DatDespachoproducto');
            foreach ($params['despachados'] as $desp) {
                $desp = (array) $desp;
                $obj = new DatDespachoproducto();
                $obj->assignIdentifier($desp['iddespachoproducto']);
                $obj->synchronizeWithArray($desp);
                $coll->add($obj);
            }
            if (count($coll)) {
                $coll->save();
            }
        }
        return true;
    }

    public function generarDespacho($params) {
        $respuesta = Doctrine_Manager::connection()->fetchAll(
            "SELECT * FROM mod_logfacturacion.f_generardespachotienda(
              {$this->global->Perfil->idusuario},{$this->global->Estructura->idestructura},{$params['iddeposito']},
              '{{$params['destinos']}}'
            )"
        );
        return array('iddespacho' => (count($respuesta) ? $respuesta[0]['f_generardespachotienda'] : null));
    }

    public function aprobarDespacho($params) {
        if (is_numeric($params['iddespacho'])) {
            $sqlExistencias = "
                select distinct dpd.idindicador, sum(dp.cantidad) as existencia, sum(dpd.despachado) as despachado from mod_logistica.dat_producto dp 
                inner join mod_logistica.dat_movimiento dm on dm.idproducto = dp.idproducto
                inner join mod_logfacturacion.dat_despachofactura despf on despf.idfactura = dm.iddocumento
                inner join mod_logfacturacion.dat_despachoproducto dpd on dp.idindicador = dpd.idindicador and dpd.iddespachotienda = despf.iddespachotienda
                where despf.iddespachotienda = {$params['iddespacho']} group by dpd.idindicador having sum(dpd.despachado) > sum(dp.cantidad);
            ";
            $existencias = $this->doctrineHelper->getConnection()->execute(
                $sqlExistencias
            )->fetchAll(PDO::FETCH_ASSOC);
            if (count($existencias)) {
                throw new ZendExt_Exception('LOG_LB_FAC_010');
            }
            $sqlPrecios = "
                select distinct dm.iddocumento, df.nrofactura from mod_logistica.dat_producto dp 
                inner join mod_logistica.dat_movimiento dm on dm.idproducto = dp.idproducto
                inner join mod_logistica.dat_movmoneda dmm on dmm.idmovimiento = dm.idmovimiento
                inner join mod_logfacturacion.dat_despachofactura despf on despf.idfactura = dm.iddocumento
                inner join mod_logfacturacion.dat_docfactura df on df.idfactura = dm.iddocumento
                where despf.iddespachotienda = {$params['iddespacho']} and (coalesce(dm.preciocontable,0) = 0 or coalesce(dmm.precio,0) = 0) ;
            ";
            $precios = $this->doctrineHelper->getConnection()->execute(
                $sqlPrecios
            )->fetchAll(PDO::FETCH_ASSOC);
            if (count($precios)) {
                throw new ZendExt_Exception('LOG_LB_FAC_012');
            }
            $estado = Doctrine::getTable('DatDespachotienda')->find($params['iddespacho']);
            if ($estado->estado == 1) {
                $prodCero = $this->doctrineHelper->getConnection()->execute(
                    "SELECT prod.*
            FROM mod_logfacturacion.dat_despachoproducto prod
			WHERE prod.iddespachotienda = {$params['iddespacho']} and prod.despachado = 0"
                )->fetchAll(PDO::FETCH_ASSOC);
                if (count($prodCero)) {
                    throw new ZendExt_Exception('LOG_LB_FAC_008');
                } else {
                    $respuesta = Doctrine_Manager::connection()->fetchAll(
                        "SELECT * FROM mod_logfacturacion.f_aprobardespachotienda(
                  {$params['iddespacho']},{$this->global->Perfil->idusuario}
                )"
                    );
                }
            }
        }
        return true;
    }

    public function eliminarFacturas($params) {
        $estado = Doctrine::getTable('DatDespachotienda')->find($params['iddespachotienda']);
        if ($estado->estado == 1) {
            if (count($params['facturas']) and is_numeric($params['iddespachotienda'])) {
                $facturas = implode(',', $params['facturas']);
                $sql = "update mod_logfacturacion.dat_despachoproducto as dprod 
                set cantidad = cantidad - coalesce((select sum(pp.cantidad-COALESCE(pp.procesado,0)-COALESCE(pp.devolver,0)-COALESCE(pp.devuelto,0)) 
                from mod_logistica.dat_movimiento dm
                inner join mod_logistica.dat_producto dp on dp.idproducto = dm.idproducto
                inner join mod_logpuntoventa.dat_pedidodocumento pd on pd.iddocumento = dm.iddocumento
                inner join mod_logpuntoventa.dat_pedidoproducto pp on pp.idpedidotienda = pd.idpedido and pp.idproducto = dp.idproducto
                where dm.iddocumento in ({$facturas}) and dp.idproducto = dprod.idproducto),0),
                despachado = 0
                from mod_logfacturacion.dat_despachotienda dt
                inner join mod_logfacturacion.dat_despachofactura df on df.iddespachotienda = dt.iddespachotienda
                where dt.iddespachotienda = dprod.iddespachotienda and dprod.iddespachotienda = {$params['iddespachotienda']} 
                and df.idfactura in ({$facturas}) and dprod.idproducto in (
                select pp1.idproducto from mod_logpuntoventa.dat_pedidoproducto pp1
                inner join mod_logpuntoventa.dat_pedidodocumento pd1 on pd1.idpedido = pp1.idpedidotienda
                where pd1.iddocumento in ({$facturas})
                )";
                        Doctrine_Manager::connection()->fetchAll($sql);
                        $sql1 = "delete from mod_logfacturacion.dat_despachoproducto where iddespachotienda = {$params['iddespachotienda']} and 
                cantidad <= 0";
                        Doctrine_Manager::connection()->fetchAll($sql1);
                        $sql2 = "delete from mod_logfacturacion.dat_despachofactura where iddespachotienda = {$params['iddespachotienda']}
                and idfactura in ({$facturas})";
                Doctrine_Manager::connection()->fetchAll($sql2);
            }
        }
        return true;
    }

    public function eliminarDespacho($params) {
        $estado = Doctrine::getTable('DatDespachotienda')->find($params['iddespacho']);
        if ($estado->estado == 1) {
            $sql = "delete from mod_logfacturacion.dat_despachotienda where iddespachotienda = {$params['iddespacho']} 
               and estado = 1";
            Doctrine_Manager::connection()->fetchAll($sql);
        }
        return true;
    }

    public function completarDespacho($params) {
        if (is_numeric($params['iddespachotienda'])) {
            $estado = Doctrine::getTable('DatDespachotienda')->find($params['iddespachotienda']);
            if ($estado->estado == 1) {
                $respuesta = Doctrine_Manager::connection()->fetchAll(
                    "update mod_logfacturacion.dat_despachoproducto 
                set despachado = cantidad where iddespachotienda = {$params['iddespachotienda']}"
                );
            }
        }
        return true;
    }

    public function getDestinos($params) {
        $sql = "select DISTINCT cent.idestructura, (dest.codigo || ' ' || dest.denominacion) as estructura from mod_logpuntoventa.dat_centroentregaalmacen cent
                inner join mod_estructuracomp.v_dametodasestructuras dest on dest.idestructura = cent.idestructura
                inner join mod_logpuntoventa.dat_almacenregion ar on ar.idestructura = cent.iddeposito
                where cent.idareaventa = (
                 select av.idareaventa from mod_logpuntoventa.dat_areaventa av where av.idestructuraop = {$params['iddeposito']} limit 1
                ) and ar.id_state in (
                    select pt.id_state
                        from mod_logpuntoventa.dat_pedidotienda pt
                        inner join mod_logpuntoventa.dat_pedidoproducto pp on pp.idpedidotienda = pt.idpedidotienda 
                        where pp.idpedidotienda in (
                            select pd.idpedido from mod_logistica.dat_documento dd
                            inner join mod_logfacturacion.dat_docfactura df on df.idfactura = dd.iddocumento
                            inner join mod_logpuntoventa.dat_pedidodocumento pd on pd.iddocumento = dd.iddocumento
                            left join mod_logfacturacion.dat_despachofactura desp on desp.idfactura = dd.iddocumento
                            where dd.estado = 1 and pd.tipo = 2 and desp.iddespachotienda is null
                        ) and (coalesce(pp.enproceso,0)-coalesce(pp.devolver,0)-coalesce(pp.devuelto,0)) > 0
                )";
        $respuesta = $this->doctrineHelper->getConnection()->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return array('datos' => $respuesta);
    }

    public function verificarIncompletos($params) {
        $sqlIncompletos = "
                select count(distinct pt.idpedidotienda) as cantidad from mod_logpuntoventa.dat_pedidotienda pt
                inner join mod_logpuntoventa.dat_pedidoproducto pp ON pp.idpedidotienda = pt.idpedidotienda
                inner join mod_logistica.dat_producto p on p.idproducto = pp.idproducto
                inner join mod_logpuntoventa.dat_pedidodocumento pd ON pd.idpedido = pt.idpedidotienda and pd.tipo = 2
                inner join mod_logfacturacion.dat_despachofactura despf on despf.idfactura = pd.iddocumento
                where despf.iddespachotienda = {$params['iddespacho']} and (pp.cantidad + coalesce(pp.devuelto,0)) < pp.cantidadreal;
            ";
        $incompletos = $this->doctrineHelper->getConnection()->execute(
            $sqlIncompletos
        )->fetchAll(PDO::FETCH_ASSOC);
        if ($incompletos[0]['cantidad'] > 0) {
            return array('codigoMsg' => 2);
        }
        return array('codigoMsg' => 1);
    }
}
