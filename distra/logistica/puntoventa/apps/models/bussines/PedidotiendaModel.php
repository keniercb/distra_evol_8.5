<?php

class PedidotiendaModel extends BaseModel
{

    public function __construct()
    {
        parent::__construct();
    }

    public function cargarPedidos($parametros = array())
    {
        $filtro = "";
        if ($parametros['nropedido']) {
            $filtro .= " and ped.nropedido ilike '%{$parametros['nropedido']}%' ";
        }
        if ($parametros['estado']) {
            $filtro .= " and ped.estado = {$parametros['estado']} ";
        }
        if ($parametros['beneficiario']) {
            $filtro .= " and ped.beneficiario ilike '%{$parametros['beneficiario']}%' ";
        }
        if ($parametros['cibeneficiario']) {
            $filtro .= " and ped.cibeneficiario ilike '%{$parametros['cibeneficiario']}%' ";
        }
        if ($parametros['telbeneficiario']) {
            $filtro .= " and ped.telbeneficiario ilike '%{$parametros['telbeneficiario']}%' ";
        }
        if ($parametros['telbeneficiario']) {
            $filtro .= " and ped.telbeneficiario ilike '%{$parametros['telbeneficiario']}%' ";
        }
        if ($parametros['dirbeneficiario']) {
            $filtro .= " and ped.dirbeneficiario ilike '%{$parametros['dirbeneficiario']}%' ";
        }
        if ($parametros['remitente']) {
            $filtro .= " and ped.remitente ilike '%{$parametros['remitente']}%' ";
        }
        if ($parametros['ciremitente']) {
            $filtro .= " and ped.ciremitente ilike '%{$parametros['ciremitente']}%' ";
        }
        if ($parametros['telremitente']) {
            $filtro .= " and ped.telremitente ilike '%{$parametros['telremitente']}%' ";
        }
        if ($parametros['telremitente']) {
            $filtro .= " and ped.telremitente ilike '%{$parametros['telremitente']}%' ";
        }
        if ($parametros['dirremitente']) {
            $filtro .= " and ped.dirremitente ilike '%{$parametros['dirremitente']}%' ";
        }
        if ($parametros['desde']) {
            $filtro .= " and ped.fechapedido >= '{$parametros['desde']}' ";
        }
        if ($parametros['hasta']) {
            $filtro .= " and ped.fechapedido <= '{$parametros['hasta']}' ";
        }
        if ($parametros['nrodespacho']) {
            if ($parametros['nrodespacho'] == '-') {
                $filtro .= " and (select count(dept1.iddespachotienda) from mod_logfacturacion.dat_despachotienda dept1
              inner join mod_logfacturacion.dat_despachofactura despf1 on despf1.iddespachotienda = dept1.iddespachotienda
              inner join mod_logpuntoventa.dat_pedidodocumento pdoc1 on pdoc1.iddocumento = despf1.idfactura
              inner join mod_logpuntoventa.dat_pedidotienda pt1 on pt1.idpedidotienda = pdoc1.idpedido
              where pt1.idpedidotienda = ped.idpedidotienda) = 0 ";
            } else {
                $filtro .= " and (select cast(dept1.nrodespacho as varchar) from mod_logfacturacion.dat_despachotienda dept1
              inner join mod_logfacturacion.dat_despachofactura despf1 on despf1.iddespachotienda = dept1.iddespachotienda
              inner join mod_logpuntoventa.dat_pedidodocumento pdoc1 on pdoc1.iddocumento = despf1.idfactura
              inner join mod_logpuntoventa.dat_pedidotienda pt1 on pt1.idpedidotienda = pdoc1.idpedido
              where pt1.idpedidotienda = ped.idpedidotienda) = '{$parametros['nrodespacho']}' ";
            }
        }
        if ($parametros['idproducto']) {
            $filtro .= " and ped.idpedidotienda in (
                select dpp.idpedidotienda from mod_logpuntoventa.dat_pedidoproducto dpp where dpp.idproducto = {$parametros['idproducto']}
            )";
        }
        if ($parametros['incompletos']) {
            $filtro .= " and (
              select count(pp1.idproductopedido) from mod_logpuntoventa.dat_pedidoproducto pp1 where pp1.idpedidotienda = ped.idpedidotienda
              and pp1.cantidad < (coalesce(pp1.cantidadreal,0)-coalesce(pp1.devuelto,0))
            ) > 0";
        }
        if ($parametros['criterio']) {
            if (strlen($filtro) > 0) {
                $filtro = " and ((
                    ped.nropedido ilike '%{$parametros['criterio']}%' or 
                    ped.beneficiario ilike '%{$parametros['criterio']}%' or 
                    ped.cibeneficiario ilike '%{$parametros['criterio']}%' or 
                    ped.telbeneficiario ilike '%{$parametros['criterio']}%' or 
                    ped.dirbeneficiario ilike '%{$parametros['criterio']}%' or 
                    ped.remitente ilike '%{$parametros['criterio']}%' or 
                    ped.ciremitente ilike '%{$parametros['criterio']}%' or 
                    ped.telremitente ilike '%{$parametros['criterio']}%' or 
                    ped.dirremitente ilike '%{$parametros['criterio']}%'
                ) or (" . substr($filtro, 4) . ")) ";
            } else {
                $filtro = " and (
                    ped.nropedido ilike '%{$parametros['criterio']}%' or 
                    ped.beneficiario ilike '%{$parametros['criterio']}%' or 
                    ped.cibeneficiario ilike '%{$parametros['criterio']}%' or 
                    ped.telbeneficiario ilike '%{$parametros['criterio']}%' or 
                    ped.dirbeneficiario ilike '%{$parametros['criterio']}%' or 
                    ped.remitente ilike '%{$parametros['criterio']}%' or 
                    ped.ciremitente ilike '%{$parametros['criterio']}%' or 
                    ped.telremitente ilike '%{$parametros['criterio']}%' or 
                    ped.dirremitente ilike '%{$parametros['criterio']}%'
                ) ";
            }

        }
        $respuesta = $this->doctrineHelper->getConnection()->execute(
            "SELECT ped.*, COUNT(*) OVER() as total, (
              select sum(coalesce(pp.devolver,0)) from mod_logpuntoventa.dat_pedidoproducto pp where pp.idpedidotienda = ped.idpedidotienda
            ) as pendiente, COALESCE(
              (select cast(dept.nrodespacho as varchar) from mod_logfacturacion.dat_despachotienda dept
              inner join mod_logfacturacion.dat_despachofactura despf on despf.iddespachotienda = dept.iddespachotienda
              inner join mod_logpuntoventa.dat_pedidodocumento pdoc on pdoc.iddocumento = despf.idfactura
              inner join mod_logpuntoventa.dat_pedidotienda pt on pt.idpedidotienda = pdoc.idpedido
              where pt.idpedidotienda = ped.idpedidotienda)
              ,'-') as nrodespacho,
              (
              select sum(
                    q.cantidad
                ) from (
                    select count(pp.idproductopedido) as cantidad from mod_logpuntoventa.dat_pedidoproducto pp where pp.idpedidotienda = ped.idpedidotienda
                              and (pp.cantidad + coalesce(pp.devuelto,0)) < pp.cantidadreal
                    union 
                    select count(pp.idproductopedido) as cantidad from mod_logpuntoventa.dat_pedidoproducto pp where pp.idpedidotienda = ped.idpedidotienda
                              and pp.tipo = 1 and pp.idproducto is null
                    union
                    select count(pp.idproductopedido) as cantidad from mod_logpuntoventa.dat_pedidoproducto pp 
                    inner join mod_logistica.dat_producto p on p.idproducto = pp.idproducto
                    inner join mod_logpuntoventa.dat_pedidotienda ptt on ptt.idpedidotienda = pp.idpedidotienda
                    where ptt.estado in (1,2) and pp.idpedidotienda = ped.idpedidotienda and pp.tipo = 1 and pp.cantidad > p.cantidad
                ) q
            ) as incompleto,
            (
              select sum(
                    q.cantidad
                ) from (
                    select count(pp.idproductopedido) as cantidad from mod_logpuntoventa.dat_pedidoproducto pp where pp.idpedidotienda = ped.idpedidotienda
                              and pp.addmod in (1,2)
                ) q
            ) as modificado,
            (
              select sum(round(pp.cantidad*pp.precio,2)) from mod_logpuntoventa.dat_pedidoproducto pp where pp.idpedidotienda = ped.idpedidotienda
            ) as importe, TO_CHAR(ped.hora, 'HH24:MI:SS' ) as hora
            FROM mod_logpuntoventa.dat_pedidotienda ped
            INNER JOIN mod_estructuracomp.v_dametodasestructuras est on est.idestructura = ped.idestructuracomun
			WHERE ped.idestructuracomun = {$this->global->Estructura->idestructura} 
			and ped.idareaventa = {$parametros['idareaventa']}{$filtro}
			order by ped.idpedidotienda DESC,ped.nropedido offset {$parametros['start']} limit {$parametros['limit']}"
        )->fetchAll(PDO::FETCH_ASSOC);
        return array('datos' => $respuesta, 'cantidad' => (count($respuesta) ? $respuesta[0]['total'] : 0));
    }

    public function devolverProductos($parametros)
    {
        $limit = $filtro = "";
        $joinProd = ($parametros['cr']) ? 'LEFT' : 'INNER';
        if ($parametros['criterio']) {
            $filtro .= " and (ni.numeropieza ilike '%{$parametros['criterio']}%' or 
            ni.denominacion ilike '%{$parametros['criterio']}%') ";
        }
        if ($parametros['producto']) {
            $filtro .= " and prod.tipo = 1 ";
        } else {
            $filtro .= " and prod.tipo = 2 ";
        }
        if (isset($parametros['start']) && isset($parametros['limit'])) {
            $limit .= " offset {$parametros['start']} limit {$parametros['limit']} ";
        }
        $respuesta = $this->doctrineHelper->getConnection()->execute(
            "SELECT prod.idproductopedido,prod.codreferencia,prod.idindicador,prod.idproducto,prod.idpedidotienda,
            prod.cantidad,prod.precio,prod.preciounitario,(100-round((prod.precio*100/prod.preciounitario),0)) as descuento,prod.importe,coalesce(prod.devuelto,0) as devuelto ,
            round(coalesce(prod.devuelto*prod.precio,0),2) as importedev, coalesce(prod.devolver,0) as devolver,
            COUNT(*) OVER() as total, ni.denominacion as descripcionventa,
            nu.abreviaturaunidadmedida as umedida, prod.procesado, coalesce(prod.cantidadreal, 0) as cantidadreal, dp.cantidad as existencia,
            pt.estado as estadopedido, prod.addmod 
            FROM mod_logpuntoventa.dat_pedidoproducto prod
            inner join mod_logpuntoventa.dat_pedidotienda pt on pt.idpedidotienda = prod.idpedidotienda
            {$joinProd} JOIN mod_logistica.dat_producto dp on dp.idproducto = prod.idproducto
            INNER JOIN mod_datosmaestros.nom_indicador ni on ni.idindicador = coalesce(dp.idindicador, prod.idindicador)
            INNER JOIN mod_datosmaestros.nom_unidadmedida nu on nu.idunidadmedida = coalesce(dp.idumedida, ni.idumedida)
			WHERE prod.idpedidotienda = {$parametros['idpedidotienda']}{$filtro} 
			order by prod.codreferencia{$limit}"
        )->fetchAll(PDO::FETCH_ASSOC);
        return array('datos' => $respuesta, 'cantidad' => (count($respuesta) ? $respuesta[0]['total'] : 0));
    }

    public function devolverPagos($params) {
        $respuesta = $this->doctrineHelper->getConnection()->execute(
            "SELECT * from mod_logpuntoventa.f_getpagopedido({$params['idpedidotienda']})"
        )->fetchAll(PDO::FETCH_ASSOC);
        return array('datos' => $respuesta, 'cantidad' => (count($respuesta) ? $respuesta[0]['total'] : 0));
    }

    public function devolverRegistrables($params) {
        $respuesta = $this->doctrineHelper->getConnection()->execute(
            "
                select replace(CAST(d.value::json->'id' as varchar),'\"', '') as id, 
                replace(CAST(d.value::json->'label' as varchar),'\"', '') as label, 
                d.value::json->'value' as valor from (SELECT value FROM json_array_elements((
                select ((cast(dm.recordable as json))) from mod_logpuntoventa.dat_pedidoproducto dm 
                where dm.idproductopedido = {$params['idproductopedido']}
                and dm.recordable is not null and dm.recordable <> '-1'
                ))) d where cast(d.value as VARCHAR) ilike '%id%'
            "
        )->fetchAll(PDO::FETCH_ASSOC);
        return array('datos' => $respuesta, 'cantidad' => (count($respuesta) ? $respuesta[0]['total'] : 0));
    }

    public function descargarPedidos($params)
    {
        $query = Doctrine_Query::create()->select('da.*,inf.*')->from('DatAreaventa da')
            ->leftJoin('da.DatInfoConexion inf');
        if ($params['idareaventa']) {
            $query->where('da.idareaventa = ?', array($params['idareaventa']));
        } else {
            $query->where('da.idestructuraop = ?', array($params['idestructuraop']));
        }
        $infoConfig = $query->fetchArray();
        $infoConect = $infoConfig[0]['DatInfoConexion'];
        unset($infoConfig[0]['DatInfoConexion']);
        $params['idmonedaventa'] = $infoConfig[0]['idmoneda'];
        $params = array_merge($params, $infoConfig[0]);

        if ($infoConect['tipo'] == "ps") {
            $factory = new ExternalIntegrationFactory($infoConect['tipo']);
            $factory->setStoreConfig(array('URL' => $infoConect['url'], 'KEY' => $infoConect['clave'], 'DEBUG' => false))->connect();
        } else if ($infoConect['tipo'] == "gjt") {
            $factory = new GuajiritosApiHelper();
            $factory->setApiUrl($infoConect['url']);
            $params['usuario'] = $infoConect['usuario_api'];
            $params['password'] = $infoConect['password_api'];
        }
        $params['idestructuracomun'] = $this->global->Estructura->idestructura;
        $params['idusuario'] = $this->global->Perfil->idusuario;
        $params['nombreconexion'] = $infoConect['nombreconexion'];
        $params['codigotienda'] = $infoConect['codigotienda'];
        $params['recordable'] = $infoConect['recordable'];
        return $factory->addPedidosTienda($params);
    }

    public function descargarVentasCR($params)
    {
        $respuesta = $this->doctrineHelper->getConnection()->execute(
            "select c.identificador, case when c.idtiporegistradora = 1 then 'qpos' else 'apos' end as modelo, c.ip,
             cr.url as urlapi  
             from mod_logpuntoventa.dat_caja c
            inner join mod_logpuntoventa.dat_areaventa av on av.idareaventa = c.idareaventa
            inner join mod_logpuntoventa.dat_infoconexioncr cr on cr.idinfoconexioncr = av.idinfoconexioncr
            where c.idareaventa = {$params['idareaventa']} and c.activo = 1 and c.idtiporegistradora is not null "
        )->fetchAll(PDO::FETCH_ASSOC);

        $formatoApi = json_encode(array('datos' => $respuesta));
        $this->tpvApiHelper->setApiUrl($respuesta[0]['urlapi']);//'http://10.12.24.38:10430'

        try {
            $respuesta = $this->tpvApiHelper->exceuteCommand(TpvApiService::DOWNLOAD_PLU_TENDER_COMMAND, $formatoApi);
        } catch (Exception $e) {
            if ($e->getCode() == 1001) {
                throw new ZendExt_Exception('LOG_LB_PUNTOVENTA_010');
            }
        }
        if (isset($respuesta['data'])) {
            $fechaFacturacion = $this->configuracionHelper->getFechaContableSubsistemaObj($this->global->Estructura->idestructura,
                LogisticaGlobal::SUBSISTEMA_FAC);

            $infoCajas = $respuesta['data'];
            foreach ($infoCajas as $info) {
                if (isset($info['code']) && $info['code'] == '000') {
                    $ventas = $info['info'];
                    $formasPago = $info['info2'];
                    $sqlExist = "select pt.idpedidotienda as existe from mod_logpuntoventa.dat_pedidotienda pt 
                                  where
                                  pt.idareaventa = ? and
                                  pt.identificador = ? and  
                                  pt.estado = 1 and 
                                  pt.fechapedido = now()::date limit 1";
                    $count = Doctrine_Manager::connection()->fetchAll(
                        $sqlExist, array($params['idareaventa'], $info['identificador'])
                    );
                    if (!count($count)) {
                        $sql = "INSERT INTO
                          mod_logpuntoventa.dat_pedidotienda
                        (
                          fechapedido,estado,idestructuracomun,
                          idareaventa,idusuario,identificador,infoventa,infopago
                        )
                        VALUES (
                          to_char(CURRENT_DATE, 'DD/MM/YYYY')::date,1,{$this->global->estructura->idestructura},
                          {$params['idareaventa']},{$this->global->Perfil->idusuario},'{$info['identificador']}',
                          $$'{$ventas}'$$,$$'{$formasPago}'$$
                        ) returning idpedidotienda";
                        $idpedidoAux = Doctrine_Manager::connection()->fetchAll(
                            $sql
                        );
                        $idpedido = $idpedidoAux[0]['idpedidotienda'];
                    } else {
                        /*$sqldelete = "delete from
                          mod_logpuntoventa.dat_pedidotienda
                          where idpedidotienda = ?";
                        Doctrine_Manager::connection()->fetchAll(
                            $sqldelete, array($count[0]['existe'])
                        );
                        $idpedido = Doctrine_Manager::connection()->fetchAll(
                            $sql
                        );*/
                        $sql = "update 
                          mod_logpuntoventa.dat_pedidotienda
                          set infoventa = $$'{$ventas}'$$, infopago= $$'{$formasPago}'$$
                          where idpedidotienda = ?
                          ";
                        Doctrine_Manager::connection()->fetchAll(
                            $sql, array($count[0]['existe'])
                        );
                        $idpedido = $count[0]['existe'];
                    }
                    Doctrine_Manager::connection()->fetchAll(
                        "SELECT * FROM mod_logpuntoventa.f_procesarpedidosinfoventa(
                          {$idpedido})"
                    );
                }
            }
        }
        return true;
    }

    public function procesarPedidos($params)
    {
        if ($params['externo']) {
            $nombreFunction = ($params['cr']) ? 'f_procesarpedidoscaja' : 'f_procesarpedidosfecha';
            $params['idestructuracomun'] = $this->global->Estructura->idestructura;
            $params['idusuario'] = $this->global->Perfil->idusuario;
            $respuesta = Doctrine_Manager::connection()->fetchAll(
                "SELECT * FROM mod_logpuntoventa.{$nombreFunction}(
              {$params['idtienda']},{$this->global->Estructura->idestructura},{$this->global->Perfil->idusuario}
            )"
            );
            return $respuesta;
        } else {
            $query = Doctrine_Query::create()->select('da.*,inf.*')->from('DatAreaventa da')
                ->leftJoin('da.DatInfoConexion inf');
            if ($params['idtienda']) {
                $query->where('da.idareaventa = ?', array($params['idtienda']));
            } else {
                $query->where('da.idestructuraop = ?', array($params['idestructuraop']));
            }
            $infoConfig = $query->fetchArray();
            $infoConect = $infoConfig[0]['DatInfoConexion'];
            unset($infoConfig[0]['DatInfoConexion']);
            $params['idmonedaventa'] = $infoConfig[0]['idmoneda'];
            $params = array_merge($params, $infoConfig[0]);

            if ($infoConect['tipo'] == "ps") {
                $factory = new ExternalIntegrationFactory($infoConect['tipo']);
                $factory->setStoreConfig(array('URL' => $infoConect['url'], 'KEY' => $infoConect['clave'], 'DEBUG' => false))->connect();
            } else if ($infoConect['tipo'] == "gjt") {
                $factory = new GuajiritosApiHelper();
                $factory->setApiUrl($infoConect['url']);
                $params['usuario'] = $infoConect['usuario_api'];
                $params['password'] = $infoConect['password_api'];
            }

            $params['idestructuracomun'] = $this->global->Estructura->idestructura;
            $params['idusuario'] = $this->global->Perfil->idusuario;

            $respuesta = Doctrine_Manager::connection()->fetchAll(
                "SELECT * FROM mod_logpuntoventa.f_procesarpedidostienda(
              {$this->global->Perfil->idusuario}, 0, 0, {$this->global->Estructura->idestructura},{$params['idtienda']}
            )"
            );

            if ($infoConect['tipo'] == "ps" || $infoConect['tipo'] == "gjt") {
                $sql = "select distinct pt.idreferencia from mod_logpuntoventa.dat_pedidotienda pt
                inner join mod_logpuntoventa.dat_pedidoproducto pp on pp.idpedidotienda = pt.idpedidotienda 
                where pt.estado = 2 and pt.idareaventa = {$params['idtienda']} group by pt.idreferencia
                having sum(pp.enproceso) > 0";
                $arrayOrderInsert = $this->doctrineHelper->getConnection()->execute($sql)->fetchAll(PDO::FETCH_COLUMN);
                $respCambioEstado = true;
                if ($infoConect['tipo'] == "ps") {
                    foreach ($arrayOrderInsert as $order) {
                        $factory->cambiarEstado($order, 3);
                    }
                } else if ($infoConect['tipo'] == "gjt" && count($arrayOrderInsert) > 0){
                    //foreach ($arrayOrderInsert as $order) {
                        $respCambioEstado = $factory->cambiarEstado($params, $arrayOrderInsert, 'processing-order');
                    //}
                }
                if (count($arrayOrderInsert) && $respCambioEstado) {
                    $sqlEstado = "update mod_logpuntoventa.dat_pedidotienda
                    set estado = 3 where idareaventa = {$params['idtienda']} and idreferencia in (" . implode(',', $arrayOrderInsert) . ")";
                    $this->doctrineHelper->getConnection()->execute($sqlEstado)->fetchAll();
                }
            } else if ($infoConect['tipo'] == "cx") {
                $sql = "select distinct pt.idpedidotienda from mod_logpuntoventa.dat_pedidotienda pt
                inner join mod_logpuntoventa.dat_pedidoproducto pp on pp.idpedidotienda = pt.idpedidotienda 
                where pt.estado = 2 and pt.idareaventa = {$params['idtienda']} group by pt.idpedidotienda
                having sum(pp.enproceso) > 0";
                $arrayOrderInsert = $this->doctrineHelper->getConnection()->execute($sql)->fetchAll(PDO::FETCH_COLUMN);
                if (count($arrayOrderInsert)) {
                    $sqlEstado = "update mod_logpuntoventa.dat_pedidotienda
                    set estado = 3 where idpedidotienda in (" . implode(',', $arrayOrderInsert) . ")";
                    $this->doctrineHelper->getConnection()->execute($sqlEstado)->fetchAll();
                }
            }
            return $respuesta;
        }
    }

    public function guardarDevolucion($params)
    {
        $coll = new Doctrine_Collection('DatPedidoproducto');
        foreach ($params['devuelto'] as $dev) {
            $dev = (array)$dev;
            unset($dev['devuelto']);
            $dev['devolver'] = ($dev['devolver']) ? $dev['devolver'] : 0;
            $obj = new DatPedidoproducto();
            $obj->assignIdentifier($dev['idproductopedido']);
            $obj->synchronizeWithArray($dev);
            if($dev['addmod'] == 2) {
                $obj->idusuarioaddmod = $this->global->Perfil->idusuario;
            }
            $coll->add($obj);
        }
        if (count($coll)) {
            $coll->save();
        }
        return true;
    }

    public function devolverPedido($params)
    {
        $arrayProd = array();
        $prodDevolverSql = Doctrine::getTable('DatPedidoproducto')->findByDql(
            "idpedidotienda = ? and devolver > 0", array($params['idpedidotienda'])
        );
        $importe = 0;
        foreach ($prodDevolverSql as $p) {
            $pAux = $p->toArray();
            $arrayProd[$pAux['codreferencia']] = $pAux;
            $importe += round($pAux['precio'] * $pAux['devolver'], 2);
        }
        $respuesta = Doctrine_Manager::connection()->fetchAll(
            "SELECT * FROM mod_logpuntoventa.f_devolverpedidostienda(
              {$params['idpedidotienda']}, {$this->global->Perfil->idusuario}, {$this->global->Estructura->idestructura}, {$params['idareaventa']}
            )"
        );
        $query = Doctrine_Query::create()->select('da.*,inf.*')->from('DatAreaventa da')
            ->leftJoin('da.DatInfoConexion inf');
        $query->where('da.idareaventa = ?', array($params['idareaventa']));

        $infoConfig = $query->fetchArray();
        $infoConect = $infoConfig[0]['DatInfoConexion'];
        $iddeposito = $infoConfig[0]['idestructuraop'];
        $usuarioez = $infoConfig[0]['usuarioez'];
        unset($infoConfig[0]['DatInfoConexion']);
        $params = array_merge($params, $infoConfig[0]);
        $factory = new ExternalIntegrationFactory($infoConect['tipo']);
        $factory->setStoreConfig(array('URL' => $infoConect['url'], 'KEY' => $infoConect['clave'], 'DEBUG' => false))->connect();

        $idpedidotienda = Doctrine::getTable('DatPedidotienda')->find($params['idpedidotienda']);
        $id_orderslip = $factory->devolverPedido($idpedidotienda->idreferencia, $arrayProd);
        $devuelto = Doctrine_Manager::connection()->fetchAll(
            "SELECT SUM(dpp.cantidadreal) as cantidad, SUM(dpp.devuelto) as devuelto FROM mod_logpuntoventa.dat_pedidoproducto dpp 
                     where dpp.idpedidotienda = {$params['idpedidotienda']}"
        );
        if ($devuelto[0]['cantidad'] > $devuelto[0]['devuelto']) {
            $factory->cambiarEstado($idpedidotienda->idreferencia, 3);
        } else {
            Doctrine_Manager::connection()->fetchAll(
                "update mod_logpuntoventa.dat_pedidotienda 
                     set estado = 7 where idpedidotienda = {$params['idpedidotienda']}"
            );
        }
        $usuario = Doctrine_Manager::connection()->fetchAll(
            "SELECT seg.nombreusuario as usuario FROM mod_seguridad.seg_usuario seg 
                     where seg.idusuario = {$this->global->Perfil->idusuario}"
        );
        $entidad = Doctrine_Manager::connection()->fetchAll(
            "SELECT (est.codigo||' '||est.denominacion) as entidad  FROM mod_estructuracomp.v_dametodasestructuras est 
                     where est.idestructura = {$this->global->Estructura->idestructura}"
        );

        $deposito = Doctrine_Manager::connection()->fetchAll(
            "SELECT est.codigo as deposito  FROM mod_estructuracomp.v_dametodasestructuras est 
                     where est.idestructura = {$iddeposito}"
        );
        $anno = date('Y');
        $nroDevSql = "select max(dev.numero) from mod_logpuntoventa.dat_pedidotiendadevolucion dev 
                          where dev.idareaventa = {$idpedidotienda->idareaventa} and dev.anno = {$anno}";
        $nroDev = LogisticaDoctrineHelper::__init()->getConnection()->execute($nroDevSql)->fetchAll(PDO::FETCH_COLUMN);
        $nroDev = (count($nroDev) && $nroDev[0]) ? $nroDev[0] + 1 : 1;
        $devEZ = "select count(nv.nombre) from mod_logistica.nom_variableglobal nv 
                          where nv.nombre = 'DEV_EZ' and nv.valor = 'true'";
        $existeDevEz = LogisticaDoctrineHelper::__init()->getConnection()->execute($devEZ)->fetchAll(PDO::FETCH_COLUMN);
        $respEnzObj = null;
        $descripcion = "{$entidad[0]['entidad']} Devolucion de pedido " . $idpedidotienda->nropedido . " usuario " . $usuario[0]['usuario'];
        $commercerefundid = '';
        if ($existeDevEz[0] > 0) {
            $commercerefundid = $this->objectHelper->gcommerceRefundId(array(
                'coddeposito' => $deposito[0]['deposito'],
                'consecutivo' => $nroDev
            ));
            $enzonaTemp = LogisticaGlobal::__init()->getEznContainer();
            $data = array(
                'consumerKey' => $infoConect['consumerkey'],
                'consumerSecret' => $infoConect['consumersecret'],
                'monto' => $importe,
                'transaction_uuid' => $idpedidotienda->idtransaccion,
                'commercerefundid' => $commercerefundid,
                'usuario' => $usuarioez,
                'descripcion' => $descripcion
            );
            $respEnz = $enzonaTemp->refund($data);
            $respEnzObj = json_encode($respEnz);
        }

        $sqlDev = "INSERT INTO mod_logpuntoventa.dat_pedidotiendadevolucion
                (
                  idpedidotienda,importe,idusuario,refund_response,idareaventa,numero,descripcion,commercerefundid
                )
                VALUES ({$params['idpedidotienda']},{$importe},{$this->global->Perfil->idusuario},'{$respEnzObj}',
                {$idpedidotienda->idareaventa},{$nroDev},'{$descripcion}','{$commercerefundid}')
                returning idpedidodevolucion";
        $iddev = Doctrine_Manager::connection()->fetchAll($sqlDev);
        $sqlInsertProdDev = "INSERT INTO mod_logpuntoventa.dat_pedidoproductodev
                            (
                              idpedidodevolucion,idproductopedido,cantidad,importe
                            ) VALUES";
        foreach ($prodDevolverSql as $index => $p) {
            $sqlInsertProdDev .= " (
                                  {$iddev[0]['idpedidodevolucion']},{$p->idproductopedido},{$p->devolver},round({$p->devolver}*{$p->precio},2)
                                )";
            if ($index + 1 < count($prodDevolverSql)) {
                $sqlInsertProdDev .= ',';
            }
        }
        Doctrine_Manager::connection()->fetchAll($sqlInsertProdDev);
    }

    public function getProductosPedido($parametros)
    {
        $limit = $filtro = "";
        if ($parametros['query']) {
            $filtro .= " and (ni.numeropieza ilike '%{$parametros['query']}%' or 
            ni.denominacion ilike '%{$parametros['query']}%') ";
        }
        if (isset($parametros['start']) && isset($parametros['limit'])) {
            $limit .= " offset {$parametros['start']} limit {$parametros['limit']} ";
        }
        $respuesta = $this->doctrineHelper->getConnection()->execute(
            "SELECT distinct dp.idproducto, (ni.numeropieza || ' ' ||ni.denominacion) as denominacion, ni.numeropieza, 
            COUNT(*) OVER() as total from mod_logistica.dat_producto dp
            inner join mod_datosmaestros.nom_indicador ni on ni.idindicador = dp.idindicador
            INNER JOIN mod_logpuntoventa.dat_pedidoproducto dpp on dpp.idproducto = dp.idproducto
			WHERE dp.idestructuracomun = {$this->global->estructura->idestructura}{$filtro} 
			order by ni.numeropieza{$limit}"
        )->fetchAll(PDO::FETCH_ASSOC);
        return array('datos' => $respuesta, 'cantidad' => (count($respuesta) ? $respuesta[0]['total'] : 0));
    }

    public function getImporteXEntidadesByIdop($arrayIdopcomercio, $fechainicio, $fechafin)
    {
        $idopAux = implode("','", $arrayIdopcomercio);
        $idmoneda = LogisticaGlobal::__init()->getMonedaEntidad()->idmoneda;
        /*$sql = "SELECT cent.idestructura, dec.codigo, sum(ar.importe-(round(ar.importe*ar.comision/100,2))) as importe, array_to_string(array_agg(ar.idopcomercio),',') as idopcomercio
                from mod_logpuntoventa.dat_centroentregaalmacen cent
                inner join mod_contabilidad.dat_estructurae dec on dec.idestructuracomun = cent.idestructura
                inner join (
                select sum(round(pp.importe*tsa.factordeconversion,2)) as importe, pt.idopcomercio,pt.comision, ar.idestructura,pt.fechapedido
                from mod_logpuntoventa.dat_almacenregion ar
                inner join mod_logpuntoventa.dat_pedidotienda pt on pt.id_state = ar.id_state
                inner join mod_logpuntoventa.dat_pedidoproducto pp on pp.idpedidotienda = pt.idpedidotienda
                inner join mod_logpuntoventa.dat_areaventa dav on dav.idareaventa = pt.idareaventa
                inner join mod_datosmaestros.dat_tasa tsa on tsa.idestructuracomun = pt.idestructuracomun
                inner join mod_datosmaestros.dat_monedaentidad dme on dme.idmonedaentidad = tsa.idmonedacontable and dme.idmoneda = {$idmoneda}
                where tsa.idmoneda = dav.idmoneda and tsa.idtipotasa = (
                        select c.idtipotasa from mod_logfacturacion.conf_configuracionfactura c where c.idestructuracomun = pt.idestructuracomun limit 1
                 )
                group by pt.idopcomercio, ar.idestructura, pt.comision, pt.fechapedido
                ) ar on ar.idestructura = cent.iddeposito
                where ar.idopcomercio in ('{$idopAux}') and ar.fechapedido BETWEEN {$fechainicio} and {$fechafin}
                group by cent.idestructura, dec.codigo";*/
        $sql = "SELECT cent.idestructura, dec.codigo, round(round(sum(ar.importe)-coalesce(dev.importe,0),2)*ar.factordeconversion,2) as importe, array_to_string(array_agg(ar.idopcomercio),',') as idopcomercio
                from mod_logpuntoventa.dat_centroentregaalmacen cent
                inner join mod_contabilidad.dat_estructurae dec on dec.idestructuracomun = cent.idestructura
                inner join (
                select sum(round(pp.importe,2))-(round(sum(round(pp.importe,2))*pt.comision/100,2)) as importe, pt.idareaventa, pt.idopcomercio,pt.comision, ar.idestructura,pt.fechapedido,tsa.factordeconversion
                from mod_logpuntoventa.dat_almacenregion ar
                inner join mod_logpuntoventa.dat_pedidotienda pt on pt.id_state = ar.id_state and ar.idareaventa = pt.idareaventa
                inner join mod_logpuntoventa.dat_pedidoproducto pp on pp.idpedidotienda = pt.idpedidotienda
                inner join mod_logpuntoventa.dat_areaventa dav on dav.idareaventa = pt.idareaventa
                inner join mod_datosmaestros.dat_tasa tsa on tsa.idestructuracomun = pt.idestructuracomun
                inner join mod_datosmaestros.dat_monedaentidad dme on dme.idmonedaentidad = tsa.idmonedacontable and dme.idmoneda = {$idmoneda}
                where tsa.idmoneda = dav.idmoneda and tsa.idtipotasa = (
                        select c.idtipotasa from mod_logfacturacion.conf_configuracionfactura c where c.idestructuracomun = pt.idestructuracomun limit 1
                 )
                group by pt.idopcomercio, ar.idestructura, pt.comision, pt.fechapedido,tsa.factordeconversion, pt.idareaventa
                ) ar on ar.idestructura = cent.iddeposito and cent.idareaventa = ar.idareaventa
				left join (
					select sum(ptd.importe+(ptd.importe*ptt.comision/100)) as importe, alm.idestructura
					from mod_logpuntoventa.dat_pedidotiendadevolucion ptd
					inner join mod_logpuntoventa.dat_pedidotienda ptt on ptt.idpedidotienda = ptd.idpedidotienda
					inner join mod_logpuntoventa.dat_almacenregion alm on alm.id_state = ptt.id_state
					where ptt.idopcomercio in ('{$idopAux}') and ptd.fecha BETWEEN '{$fechainicio}' and '{$fechafin}'
					group by alm.idestructura
				) dev on dev.idestructura = cent.iddeposito
                where ar.idopcomercio in ('{$idopAux}') and ar.fechapedido BETWEEN '{$fechainicio}' and '{$fechafin}'
                group by cent.idestructura, dec.codigo, dev.importe,ar.factordeconversion";

        $respuesta = $this->doctrineHelper->getConnection()->execute(
            $sql
        )->fetchAll(PDO::FETCH_ASSOC);
        return $respuesta;
    }

    public function getDocumentosGenerados($params)
    {
        $respuesta = $this->doctrineHelper->getConnection()->execute(
            "SELECT distinct pd.iddocumento, dd.nrodoc, dd.numeroref, ndp.denominacion as tipodoc, est.denominacion as entidad,
            pd.tipo 
            from mod_logpuntoventa.dat_pedidodocumento pd
            inner join mod_logistica.dat_documento dd on dd.iddocumento = pd.iddocumento
            inner join mod_datosmaestros.dat_documentoprim ddp on ddp.iddoc = dd.iddoc
            inner join mod_datosmaestros.nom_docprim ndp on ndp.iddocumentos = ddp.iddocumentos
            inner join mod_datosmaestros.dat_estructurasubsist des on des.idestructurasubsist = ddp.idestructurasubsist
            inner join mod_estructuracomp.v_dametodasestructuras est on est.idestructura = des.idestructuracomun
            where pd.idpedido = {$params['idpedido']} order by pd.tipo"
        )->fetchAll(PDO::FETCH_ASSOC);
        return array('datos' => $respuesta, 'cantidad' => count($respuesta));
    }

    public function getDevolucionesPedido($params)
    {
        $respuesta = $this->doctrineHelper->getConnection()->execute(
            "SELECT distinct pd.idpedidodevolucion, pd.numero, pd.fecha, pd.importe, pd.descripcion, 
            (case when strpos(pd.refund_response, '\"status\":\"Aceptada\",\"transaction_status_code\":\"1111\"') > 0 
            or pd.devueltotienda = 1
            then 1 else 0 end) as estado 
            from mod_logpuntoventa.dat_pedidotiendadevolucion pd
            inner join mod_logpuntoventa.dat_pedidotienda pt on pt.idpedidotienda = pd.idpedidotienda
            where pt.idpedidotienda = {$params['idpedido']} order by pd.fecha"
        )->fetchAll(PDO::FETCH_ASSOC);
        return array('datos' => $respuesta, 'cantidad' => count($respuesta));
    }

    public function sincronizarArray($datos, $params)
    {
        $datosXml = array();
        if (count($datos->Ordenes) > 0) {
            if (count($datos->Ordenes->order) > 0) {
                $datosXml['pedidos'] = array();
                foreach ($datos->Ordenes->order as $order) {
                    $datosXml['pedidos'][] = $order;
                }
            }
        }
        if (count($datos->Entregados) > 0) {
            if (count($datos->Entregados->order) > 0) {
                $datosXml['entregados'] = array();
                foreach ($datos->Entregados->order as $order) {
                    $datosXml['entregados'][] = $order;
                }
            }
        }
        if (count($datos->EntregadosDomicilio) > 0) {
            if (count($datos->EntregadosDomicilio->order) > 0) {
                $datosXml['entregadoscasa'] = array();
                foreach ($datos->EntregadosDomicilio->order as $order) {
                    $datosXml['entregadoscasa'][] = $order;
                }
            }
        }
        if (count($datos->Reembolso) > 0) {
            if (count($datos->Reembolso->order) > 0) {
                $datosXml['reembolso'] = array();
                foreach ($datos->Reembolso->order as $order) {
                    $datosXml['reembolso'][] = $order;
                }
            }
        }
        if (count($datos->Retenidas) > 0) {
            if (count($datos->Retenidas->order) > 0) {
                $datosXml['retenidas'] = array();
                foreach ($datos->Retenidas->order as $order) {
                    $datosXml['retenidas'][] = $order;
                }
            }
        }
        return $datosXml;
    }

    public function importarFicheroJson($datos, $params)
    {
        if (isset($datos['identificador']) && isset($datos['idpuntoventa'])) {
            $sqlExist = "select av.idareaventa from mod_logpuntoventa.dat_areaventa av
                         inner join mod_integracion.dat_dispositivo disp on disp.idalmacen = av.idestructuraop 
                         where disp.identificador = '{$datos['identificador']}'";
            $av = Doctrine_Manager::connection()->fetchAll(
                $sqlExist
            );
            if ((count($av) && $av[0]['idareaventa'] != $datos['idpuntoventa']) || count($av) == 0) {
                throw new ZendExt_Exception('LOG_LB_PTV_002');
            }
        }
        foreach ($datos['ventas'] as $orden) {
            $sqlExist = "select pt.idpedidotienda from mod_logpuntoventa.dat_pedidotienda pt where pt.nropedido = '{$orden['numero']}'";
            $count = Doctrine_Manager::connection()->fetchAll(
                $sqlExist
            );
            if ($count[0]['existe'] == 0) {
                $sql = "INSERT INTO
                      mod_logpuntoventa.dat_pedidotienda
                    (
                      nropedido,fechapedido,estado,idestructuracomun,
                      idareaventa,idusuario
                    )
                    VALUES (
                      '{$orden['numero']}','{$orden['date']}',2,{$this->global->estructura->idestructura},
                      {$params['idareaventa']},{$this->global->Perfil->idusuario}
                    ) returning idpedidotienda";
                $idpedido = Doctrine_Manager::connection()->fetchAll(
                    $sql
                );
                foreach ($orden['items'] as $pos => $producto) {
                    $datProdAux = $this->obtenerProducto(array(
                            'idestructura' => $params['idestructura'],
                            'referencia' => $producto['codigoprod'],
                            'idproducto' => $producto['idproducto']
                        )
                    );
                    if (count($datProdAux)) {
                        $sqlProd = "INSERT INTO 
                              mod_logpuntoventa.dat_pedidoproducto
                            (
                              idpedidotienda,
                              codreferencia,
                              idindicador,
                              idproducto,
                              cantidad,
                              cantidadreal,
                              precio,
                              importe,
                              idumedida,
                              enproceso,
                              procesado,
                              preciounitario,
                              recordable
                            )
                            VALUES (
                              {$idpedido[0]['idpedidotienda']},
                              '{$producto['codigoprod']}',
                              {$datProdAux[0]['idindicador']},
                              {$datProdAux[0]['idproducto']},
                              {$producto['cantidad']},
                              {$producto['cantidad']},
                              {$producto['precio']},
                              round({$producto['precio']}*{$producto['cantidad']},2),
                              {$datProdAux[0]['idumedida']},
                              0,
                              0,
                              {$producto['precio']},
                              -1
                            )";
                        Doctrine_Manager::connection()->fetchAll(
                            $sqlProd
                        );
                    }
                }
            }
        }
        return true;
    }

    public function importarFichero($datos, $params)
    {
        if (isset($datos['retenidas'])) {
            foreach ($datos['retenidas'] as &$orden) {
                $sqlExist = "select count(pt.idpedidotienda) as existe from mod_logpuntoventa.dat_pedidotienda pt where pt.nropedido = '{$orden->Pedido}'";
                $count = Doctrine_Manager::connection()->fetchAll(
                    $sqlExist
                );
                if ($count[0]['existe'] == 0) {
                    $orden->Nombre = str_replace('\'', '\'||chr(39)||\'', $orden->Nombre);
                    $orden->Direccion = str_replace('\'', '\'||chr(39)||\'', $orden->Direccion);
                    $orden->Remitente = str_replace('\'', '\'||chr(39)||\'', $orden->Remitente);

                    $sql = "INSERT INTO
                      mod_logpuntoventa.dat_pedidotienda
                    (
                      nropedido,beneficiario,dirbeneficiario,remitente,dirremitente,fechapedido,estado,idestructuracomun,
                      codigoregion,idareaventa,cibeneficiario,ciremitente,telbeneficiario,telremitente,idusuario,idreferencia,
                      metodopago,idtransaccion,idopcomercio,iso_municipio,municipio,id_state,comision
                    )
                    VALUES (
                      '{$orden->Pedido}','{$orden->Nombre}','{$orden->Direccion}','{$orden->Remitente}',
                      'Exterior','{$orden->Fecha}',1,{$this->global->estructura->idestructura},1,
                      {$params['idareaventa']},'{$orden->Ci}','-','{$orden->Telefono}','-',
                      {$this->global->Perfil->idusuario},null,'-','-','{$orden->IdOpComercio}',
                      '-','{$orden->Municipio}',null,0
                    ) returning idpedidotienda";
                    $idpedido = Doctrine_Manager::connection()->fetchAll(
                        $sql
                    );
                    foreach ($orden->Lines->Line as $pos => $producto) {
                        $producto = (array)$producto;
                        $producto = $producto['@attributes'];
                        $datProdAux = $this->obtenerProducto(array(
                                'idestructura' => $params['idestructura'],
                                'referencia' => $producto['ProductRecNo'])
                        );
                        $cantidaPedida = $cantidadReal = $producto['Quantity'];
                        foreach ($datProdAux as $datProd) {

                            $cant = ($cantidaPedida <= $datProd['existenciareal']) ? $cantidaPedida : $datProd['existenciareal'];
                            $cantidaPedida -= $cant;
                            $producto['product_id'] = $datProd['idproducto'];
                            $producto['product_idind'] = $datProd['idindicador'];
                            $sqlProd = "INSERT INTO 
                              mod_logpuntoventa.dat_pedidoproducto
                            (
                              idpedidotienda,
                              codreferencia,
                              idindicador,
                              idproducto,
                              cantidad,
                              cantidadreal,
                              precio,
                              importe,
                              idumedida,
                              enproceso,
                              procesado
                            )
                            VALUES (
                              {$idpedido[0]['idpedidotienda']},
                              '{$producto['ProductRecNo']}',
                              {$datProd['idindicador']},
                              {$datProd['idproducto']},
                              {$cant},
                              {$cantidadReal},
                              {$producto['UnitBasePrice']},
                              round({$producto['UnitBasePrice']}*{$cant},2),
                              {$datProd['idumedida']},
                              0,
                              0
                            )";
                            Doctrine_Manager::connection()->fetchAll(
                                $sqlProd
                            );
                        }
                    }

                }
            }
        }
        if (isset($datos['pedidos'])) {
            foreach ($datos['pedidos'] as &$orden) {
                $sqlExist = "select pt.idpedidotienda from mod_logpuntoventa.dat_pedidotienda pt where pt.nropedido = '{$orden->Pedido}'";
                $count = Doctrine_Manager::connection()->fetchAll(
                    $sqlExist
                );
                if (!count($count)) {
                    $orden->Nombre = str_replace('\'', '\'||chr(39)||\'', $orden->Nombre);
                    $orden->Direccion = str_replace('\'', '\'||chr(39)||\'', $orden->Direccion);
                    $orden->Remitente = str_replace('\'', '\'||chr(39)||\'', $orden->Remitente);

                    $sql = "INSERT INTO
                      mod_logpuntoventa.dat_pedidotienda
                    (
                      nropedido,beneficiario,dirbeneficiario,remitente,dirremitente,fechapedido,estado,idestructuracomun,
                      codigoregion,idareaventa,cibeneficiario,ciremitente,telbeneficiario,telremitente,idusuario,idreferencia,
                      metodopago,idtransaccion,idopcomercio,iso_municipio,municipio,id_state,comision
                    )
                    VALUES (
                      '{$orden->Pedido}','{$orden->Nombre}','{$orden->Direccion}','{$orden->Remitente}',
                      'Exterior','{$orden->Fecha}',2,{$this->global->estructura->idestructura},1,
                      {$params['idareaventa']},'{$orden->Ci}','-','{$orden->Telefono}','-',
                      {$this->global->Perfil->idusuario},null,'-','-','{$orden->IdOpComercio}',
                      '-','{$orden->Municipio}',334,0
                    ) returning idpedidotienda";
                    $idpedido = Doctrine_Manager::connection()->fetchAll(
                        $sql
                    );
                    foreach ($orden->Lines->Line as $pos => $producto) {
                        $producto = (array)$producto;
                        $producto = $producto['@attributes'];
                        $datProdAux = $this->obtenerProducto(array(
                                'idestructura' => $params['idestructura'],
                                'referencia' => $producto['ProductRecNo'])
                        );
                        $cantidaPedida = $cantidadReal = $producto['Quantity'];
                        foreach ($datProdAux as $datProd) {

                            $cant = ($cantidaPedida <= $datProd['existenciareal']) ? $cantidaPedida : $datProd['existenciareal'];
                            $cantidaPedida -= $cant;
                            $producto['product_id'] = $datProd['idproducto'];
                            $producto['product_idind'] = $datProd['idindicador'];
                            $sqlProd = "INSERT INTO 
                              mod_logpuntoventa.dat_pedidoproducto
                            (
                              idpedidotienda,
                              codreferencia,
                              idindicador,
                              idproducto,
                              cantidad,
                              cantidadreal,
                              precio,
                              importe,
                              idumedida,
                              enproceso,
                              procesado
                            )
                            VALUES (
                              {$idpedido[0]['idpedidotienda']},
                              '{$producto['ProductRecNo']}',
                              {$datProd['idindicador']},
                              {$datProd['idproducto']},
                              {$cant},
                              {$cantidadReal},
                              {$producto['UnitBasePrice']},
                              round({$producto['UnitBasePrice']}*{$cant},2),
                              {$datProd['idumedida']},
                              0,
                              0
                            )";
                            Doctrine_Manager::connection()->fetchAll(
                                $sqlProd
                            );
                        }
                    }

                } else {
                    $sqlUpdate = "update mod_logpuntoventa.dat_pedidotienda set estado = 2, id_state = 334 
                                  where idpedidotienda = {$count[0]['idpedidotienda']} and estado = 1";
                    Doctrine_Manager::connection()->fetchAll(
                        $sqlUpdate
                    );
                }
            }
        }
        return true;
    }

    private function obtenerProducto($params)
    {
        $conn = Doctrine_Manager::connection();
        $and = "";
        if (isset($params['idproducto'])) {
            $and = " and p.idproducto = {$params['idproducto']} ";
        }
        if (isset($params['referencia'])) {
            $and = " and i.numeropieza = '{$params['referencia']}' ";
        }
        $sql = "select p.idproducto, p.idindicador, p.idumedida, 
                (p.cantidad 
                - coalesce((select sum(coalesce(pp.enproceso,0)) from mod_logpuntoventa.dat_pedidoproducto pp where pp.idproducto = p.idproducto),0)
                - coalesce((select sum(coalesce(pp1.cantidad,0)) from mod_logpuntoventa.dat_pedidoproducto pp1 
                inner join mod_logpuntoventa.dat_pedidotienda pt on pt.idpedidotienda = pp1.idpedidotienda
                where pp1.idproducto = p.idproducto and pt.estado = 2),0)) as existenciareal
                from mod_logistica.dat_producto p 
                inner join mod_datosmaestros.nom_indicador i on i.idindicador = p.idindicador
                where p.idestructura = {$params['idestructura']} {$and} 
                and p.idproducto not in (select pi.idproducto from mod_logistica.dat_productoinactivo pi)
                group by p.idproducto
                /*having (p.cantidad 
                - coalesce((select sum(coalesce(pp.enproceso,0)) from mod_logpuntoventa.dat_pedidoproducto pp where pp.idproducto = p.idproducto),0)
                - coalesce((select sum(coalesce(pp1.cantidad,0)) from mod_logpuntoventa.dat_pedidoproducto pp1 
                inner join mod_logpuntoventa.dat_pedidotienda pt on pt.idpedidotienda = pp1.idpedidotienda
                where pp1.idproducto = p.idproducto and pt.estado = 2),0)) > 0*/";

        $datos = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }

    public function exportarXmlGolden($params)
    {
        $seed = mktime();
        $date = date('d_m_Y');
        mkdir($_SERVER['DOCUMENT_ROOT'] . "/logistica/utiles/dispositivos/llaves/files", 0777, true);
        $ruta = $_SERVER['DOCUMENT_ROOT'] . "/logistica/utiles/dispositivos/llaves/files/{$date}_{$seed}.ORD";
        $rutaWeb = $_SERVER['HTTP_ORIGIN'] . "/logistica/utiles/dispositivos/llaves/files/{$date}_{$seed}.ORD";
        $orderArrayData = $this->getPedidosPendientes($params);
        $goldenXml = new DOMDocument('1.0', 'utf-8');
        $comment = $goldenXml->createComment('XML de ventas de punto de venta. Generado desde Distra ERP');
        $xmlRoot = $goldenXml->createElement('CierreDiario');
        $xmlRoot->appendChild($comment);
        $ordersRoot = $goldenXml->createElement('ordenes');
        $proccessedOrders = array();
        foreach ($orderArrayData as $order) {
            if (!in_array($order['idpedidotienda'], $proccessedOrders)) {
                $orderXml = $goldenXml->createElement('order');
                $orderHeader = $goldenXml->createElement('OrderHeader');
                $orderHeader->setAttribute('Customer', "");
                $orderHeader->setAttribute('Location', "");
                $orderHeader->setAttribute('Notes', "VENTA");
                $orderHeader->setAttribute('SalesMan', "AUTO");
                $orderHeader->setAttribute('ShopOrderNo', $order['nropedido']);
                $orderHeader->setAttribute('CarrierId', $order['nropedido']);
                $orderHeader->setAttribute('ShipAddrId', "");
                $orderXml->appendChild($orderHeader);
                $lines = $goldenXml->createElement('Lines');
                foreach ($orderArrayData as $itemInfo) {
                    if ($itemInfo['idpedidotienda'] == $order['idpedidotienda']) {
                        $lineData = $goldenXml->createElement('Line');
                        $lineData->setAttribute('ProductRecNo', $itemInfo['numeropieza']);
                        $lineData->setAttribute('Quantity', $itemInfo['cantidad']);
                        $lineData->setAttribute('UnitBasePrice', $itemInfo['precio']);
                        $lines->appendChild($lineData);
                    }
                }
                $orderXml->appendChild($lines);
                $ordersRoot->appendChild($orderXml);
                array_push($proccessedOrders, $order['idpedidotienda']);
            }
        }
        $xmlRoot->appendChild($ordersRoot);
        $goldenXml->appendChild($xmlRoot);
        $goldenXml->save($ruta);
        return array('file' => $rutaWeb, 'creado' => true);
    }

    private function getPedidosPendientes($params)
    {
        $sqlPedidos = "SELECT pt.idpedidotienda, pt.nropedido,pt.fechapedido,pt.idareaventa,pp.cantidad,pp.precio,ni.numeropieza
        from mod_logpuntoventa.dat_pedidotienda pt
        join mod_logpuntoventa.dat_pedidoproducto pp ON pp.idpedidotienda = pt.idpedidotienda
        join mod_logistica.dat_producto dp on dp.idproducto = pp.idproducto
        join mod_datosmaestros.nom_indicador ni ON ni.idindicador = dp.idindicador 
        where pt.estado = 2 and pt.idareaventa={$params['idareaventa']}";
        return $this->doctrineHelper->getConnection()->execute($sqlPedidos)->fetchAll(PDO::FETCH_ASSOC);
    }

    public function cancelarPedido($params) {
        $arrayPedidos = json_decode($params['pedidos']);
        $pedidos = implode(',', $arrayPedidos);
        if (count($arrayPedidos)) {
            $sql = "update mod_logpuntoventa.dat_pedidotienda
                          set estado = 6, motivocancelacion = '{$params['motivo']}', idusuariocancela = {$this->global->Perfil->idusuario}
                          where idpedidotienda in ({$pedidos}) and estado in (1,2)";
            Doctrine_Manager::connection()->fetchAll(
                $sql
            );
            return array('success'=>true);
        }
    }

    public function adicionarProducto($params) {
        $arrayProductos = json_decode($params['productos']);
        if (count($arrayProductos)) {
            $collP = new Doctrine_Collection('DatPedidoproducto');
            foreach ($arrayProductos as $p) {
                $dataProd = $this->obtenerProducto(
                    array('idestructura' => $params['idestructura'],
                        'idproducto' => $p->idproducto)
                );
                $obj = new DatPedidoproducto();
                $obj->idpedidotienda = $params['idpedidotienda'];
                $obj->idindicador = $p->idindicador;
                $obj->idproducto = $p->idproducto;
                $obj->codreferencia = $p->codigo;
                $obj->cantidad = 0;
                $obj->cantidadreal = 0;
                $obj->precio = $p->precio;
                $obj->preciounitario = $p->precio;
                $obj->importe = 0;
                $obj->enproceso = 0;
                $obj->procesado = 0;
                $obj->idumedida = $dataProd[0]['idumedida'];
                $obj->addmod = 1;
                $obj->idusuarioaddmod = $this->global->Perfil->idusuario;
                $collP->add($obj);
            }
            if (count($collP)) {
                $collP->save();
            }
        }
        return array('success'=>true);
    }

    public function cargarProductos($params) {
        $params['start'] = $params['start'] ? $params['start'] : 0;
        $params['limit'] = $params['limit'] ? $params['limit'] : 30;
        $params['criterio'] = $params['criterio'] ? "'" . $params['criterio'] . "'" : 'null';
        $datos = Doctrine_Manager::connection()->fetchAll(
            "select * from mod_logpuntoventa.f_productosventa ({$params['idestructura']}, "
            . "null, 1, "
            . "1, {$params['criterio']}, "
            . "null, null, null, "
            . "null, null,{$params['limit']}, {$params['start']},"
            . "null,null,null,1, null ) q"
        );
        foreach ($datos as &$d) {
            $d['codigoproveedor'] = $d['referencia'];
            $d['codigo'] = $d['referencia'];
            $d['denominacion'] = $d['text'];
        }
        return array('datos'=>$datos, 'cantidad'=>(count($datos) ? $datos[0]['count'] : 0));
    }

    public function eliminarProductos($params) {
        $datos = json_decode($params['datos']);
        if (count($datos)) {
            $productos = implode(',', $datos);
            $pedidos = Doctrine_Manager::connection()->fetchAll(
                "select count(pt.idpedidotienda) as cantidad from mod_logpuntoventa.dat_pedidotienda pt 
                  inner join mod_logpuntoventa.dat_pedidoproducto pp on pp.idpedidotienda = pt.idpedidotienda 
                  where pp.idproductopedido in ({$productos}) and pt.estado in (1,2)"
            );
            if ($pedidos[0]['cantidad'] > 0) {
                $this->doctrineHelper->getConnection()->execute(
                    "delete from mod_logpuntoventa.dat_pedidoproducto
                     where idproductopedido in ({$productos})"
                );
            }
        }
        return true;
    }
}
