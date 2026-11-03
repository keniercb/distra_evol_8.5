<?php

class MantenimientotiendaModel extends BaseModel
{

    public function __construct()
    {
        parent::__construct();
    }

    public function importarFichero($file, $params)
    {
        //retornar file
        $error = $file['error'];
        $sqlDel = "delete from mod_logpuntoventa.temp_mantenimiento where idareaventa = {$params['idareaventa']}";

        Doctrine_Manager::connection()->execute($sqlDel);

        $sqlInsertMt = "INSERT INTO mod_logpuntoventa.temp_mantenimiento
                            (
                              numeropieza,cantidad,idareaventa
                            ) VALUES";
        foreach ($file['productos'] as $index => $p) {
            $sqlInsertMt .= " (
                                  {$p->codigoproducto},{$p->cantidad},{$params['idareaventa']}
                                )";
            if ($index + 1 < count($file['productos'])) {
                $sqlInsertMt .= ',';
            }
        }
        Doctrine_Manager::connection()->fetchAll($sqlInsertMt);

        return $file;
    }

    public function importarFicheroCSV($datos, $params) {
        $sqlDel = "delete from mod_logpuntoventa.temp_mantenimiento where idareaventa = {$params['idareaventa']}";

        Doctrine_Manager::connection()->execute($sqlDel);

        $sqlInsertMt = "INSERT INTO mod_logpuntoventa.temp_mantenimiento
                            (
                              numeropieza,cantidad,idareaventa
                            ) VALUES";

        $importados = array();

        foreach ($datos as $pos => &$item) {
            if ($pos == 0) {
                continue;
            }
            $prodArrAux = $item;
            if (count($prodArrAux)) {
                if (mb_detect_encoding($prodArrAux[3], 'UTF-8', true) && mb_detect_encoding($prodArrAux[7], 'UTF-8', true))
                {
                    $prod = array();

                    $prod['codigoproducto'] = $prodArrAux[3];
                    $prod['cantidad'] = $prodArrAux[7];

                } else {
                    $prod = array();

                    $prod['codigoproducto'] = utf8_encode($prodArrAux[3]);
                    $prod['cantidad'] = utf8_encode($prodArrAux[7]);

                }

                array_push($importados, $prod);

                $sqlInsertMt .= " (
                                  '{$prodArrAux[3]}','{$prodArrAux[7]}',{$params['idareaventa']}
                                )";
                if ($pos + 1 < count($datos)) {
                    $sqlInsertMt .= ',';
                }
            }
        }
        Doctrine_Manager::connection()->fetchAll($sqlInsertMt);


        return array(
            'total' => count($importados), 'datos' => $importados,
            'error' => ($error) ? $error : null
        );
    }

    public function sincronizarArray($datos, $params)
    {
        $campos = array(
            'codigo', 'cantidad'
        );
        $productos = array();
        foreach ($params as $param => $value) {
            if (null == $value) {
                unset($params[$param]);
            }
        }

        foreach ($datos as $index => $item) {
            if ($index > 0) {
                $prod = array();
                if (strlen($item[0]) > 0) {
                    foreach ($item as $key => $value) {
                        $value = trim($value);
                        if ($value && substr_count($campos[$key], 'cantidad')) {
                            $value = str_replace(',', '', $value);

                        }
                        $prod[$campos[$key]] = $value ? $value : null;
                    }
                    $productos[] = $prod;
                }

            }
        }

        return array('productos' => $productos);
    }

    public function cargarProductos($params)
    {
        $filtro = "";
        if ($params['criterio']) {
            $filtro .= " and ni.numeropieza ilike '%{$params['criterio']}%' ";
        }
        if ($params['condisponible']) {
            $filtro .= " and (dp.cantidad-coalesce((select sum(cc1.cantidad) from mod_logistica.dat_cantidadcomprometida cc1 where cc1.idproducto = dp.idproducto and cc1.estado = 1),0)) > 0 ";
        }
        if ($params['conexistencia']) {
            $filtro .= " and dp.cantidad > 0 ";
        }
        if ($params['tipocriterio']) {
            if ($params['tipocriterio'] == 1) {
                $filtro .= " and CAST(mant.cantidad as numeric) > (coalesce(dp.cantidad-coalesce(
                            (select sum(COALESCE(dpped.enproceso,0)-COALESCE(dpped.devuelto,0)) from mod_logpuntoventa.dat_pedidoproducto dpped where dpped.idproducto = dp.idproducto
                            and dpped.enproceso > 0)
                            ,0),0)-(dp.cantidad-coalesce((select sum(cc1.cantidad) from mod_logistica.dat_cantidadcomprometida cc1 where cc1.idproducto = dp.idproducto and cc1.estado = 1),0))) ";
            } else if ($params['tipocriterio'] == 2) {
                $filtro .= " and coalesce(
                            (select sum(COALESCE(dpped.enproceso,0)-COALESCE(dpped.devuelto,0)) from mod_logpuntoventa.dat_pedidoproducto dpped where dpped.idproducto = dp.idproducto
                            and dpped.enproceso > 0)
                            ,0) > dp.cantidad ";
            }
        }
        $respuesta = $this->doctrineHelper->getConnection()->execute(
            "select ni.numeropieza, ni.denominacion, dp.idproducto, mant.cantidad as canttienda,
            dp.cantidad as existenciadistra,
            (coalesce(dp.cantidad-coalesce(
            (select sum(COALESCE(dpped.enproceso,0)-COALESCE(dpped.devolver,0)) from mod_logpuntoventa.dat_pedidoproducto dpped where dpped.idproducto = dp.idproducto
            and dpped.enproceso > 0)
            ,0),0)-(dp.cantidad-coalesce((select sum(cc1.cantidad) from mod_logistica.dat_cantidadcomprometida cc1 where cc1.idproducto = dp.idproducto and cc1.estado = 1),0))
            - coalesce((select sum(coalesce(dpped.cantidadreal,0) - coalesce(dpped.cantidad,0) - coalesce(dpped.devuelto,0)) from mod_logpuntoventa.dat_pedidoproducto dpped 
				inner join mod_logpuntoventa.dat_pedidotienda pptd on pptd.idpedidotienda = dpped.idpedidotienda
				where pptd.estado in (2,3) and dpped.idproducto = dp.idproducto
            and dpped.cantidadreal <> dpped.cantidad),0)
            ) as canttiendadistra,
            ((coalesce(dp.cantidad-coalesce(
            (select sum(COALESCE(dpped.enproceso,0)-COALESCE(dpped.devolver,0)) from mod_logpuntoventa.dat_pedidoproducto dpped where dpped.idproducto = dp.idproducto
            and dpped.enproceso > 0)
            ,0),0)-(dp.cantidad-coalesce((select sum(cc1.cantidad) from mod_logistica.dat_cantidadcomprometida cc1 where cc1.idproducto = dp.idproducto and cc1.estado = 1),0)))-CAST(mant.cantidad as numeric)) as diftienda,
            coalesce(
            (select sum(COALESCE(dpped.enproceso,0)-COALESCE(dpped.devolver,0)) from mod_logpuntoventa.dat_pedidoproducto dpped where dpped.idproducto = dp.idproducto
            and dpped.enproceso > 0)
            ,0) as enproceso,
            (dp.cantidad-coalesce((select sum(cc1.cantidad) from mod_logistica.dat_cantidadcomprometida cc1 where cc1.idproducto = dp.idproducto and cc1.estado = 1),0)) as disponible,
            COUNT(*) OVER() as total
            from mod_logistica.dat_producto dp
            inner join mod_datosmaestros.nom_indicador ni on ni.idindicador = dp.idindicador
            inner join mod_logpuntoventa.dat_productoareaventa dar on dar.idproducto = dp.idproducto
            inner join mod_logpuntoventa.temp_mantenimiento mant on mant.numeropieza = ni.numeropieza
            where mant.idareaventa = {$params['idareaventa']} and dp.idestructura = {$params['iddeposito']} 
            and dar.idareaventa = {$params['idareaventa']} /*and dp.cantidad > 0*/ {$filtro} and dp.idproducto not in (
            select pa.idproducto from mod_logistica.dat_productoinactivo pa
            )
            and (((coalesce(dp.cantidad-coalesce(
            (select sum(COALESCE(dpped.enproceso,0)-COALESCE(dpped.devolver,0)) from mod_logpuntoventa.dat_pedidoproducto dpped where dpped.idproducto = dp.idproducto
            and dpped.enproceso > 0)
            ,0),0)-(dp.cantidad-coalesce((select sum(cc1.cantidad) from mod_logistica.dat_cantidadcomprometida cc1 where cc1.idproducto = dp.idproducto and cc1.estado = 1),0)))-CAST(mant.cantidad as numeric)) <> 0
           
		    or ((dp.cantidad-coalesce((select sum(cc1.cantidad) from mod_logistica.dat_cantidadcomprometida cc1 where cc1.idproducto = dp.idproducto and cc1.estado = 1),0))) < 0
		    or (select count(dpped.idproducto) from mod_logpuntoventa.dat_pedidoproducto dpped 
				inner join mod_logpuntoventa.dat_pedidotienda pptd on pptd.idpedidotienda = dpped.idpedidotienda
				where pptd.estado in (2,3) and dpped.idproducto = dp.idproducto
            and dpped.cantidadreal <> (dpped.cantidad+coalesce(dpped.devuelto,0))) > 0)
            --and dp.idproducto = 1000648295
            order by ((coalesce(dp.cantidad-coalesce(
            (select sum(COALESCE(dpped.enproceso,0)-COALESCE(dpped.devolver,0)) from mod_logpuntoventa.dat_pedidoproducto dpped where dpped.idproducto = dp.idproducto
            and dpped.enproceso > 0)
            ,0),0)-(dp.cantidad-coalesce((select sum(cc1.cantidad) from mod_logistica.dat_cantidadcomprometida cc1 where cc1.idproducto = dp.idproducto and cc1.estado = 1),0)))-CAST(mant.cantidad as numeric)), ni.numeropieza
            offset {$params['start']} limit {$params['limit']}"
        )->fetchAll(PDO::FETCH_ASSOC);
        return array('datos' => $respuesta, 'cantidad' => (count($respuesta) ? $respuesta[0]['total'] : 0));
    }

    public function cargarDevoluciones($params)
    {
        $filtro = "";
        if ($params['criterio']) {
            $filtro = " and ni.numeropieza ilike '%{$params['criterio']}%' ";
        }
        $respuesta = $this->doctrineHelper->getConnection()->execute(
            "select pt.nropedido, pt.fechapedido, pt.idareaventa, pt.beneficiario, pd.*, COUNT(*) OVER() as total
             from mod_logpuntoventa.dat_pedidotiendadevolucion pd
             inner join mod_logpuntoventa.dat_pedidotienda pt on pt.idpedidotienda = pd.idpedidotienda
             where pt.idareaventa = {$params['idareaventa']} and (strpos(pd.refund_response, '\"status\":\"Aceptada\",\"transaction_status_code\":\"1111\"') = 0 
            and pd.devueltotienda = 0)
            offset {$params['start']} limit {$params['limit']}"
        )->fetchAll(PDO::FETCH_ASSOC);
        return array('datos' => $respuesta, 'cantidad' => (count($respuesta) ? $respuesta[0]['total'] : 0));
    }

    public function descargarProductos($params)
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
        $factory = new ExternalIntegrationFactory($infoConect['tipo']);
        $factory->setStoreConfig(array('URL' => $infoConect['url'], 'KEY' => $infoConect['clave'], 'DEBUG' => false))->connect();

        $params['idestructuracomun'] = $this->global->Estructura->idestructura;
        $params['idusuario'] = $this->global->Perfil->idusuario;
        $params['codigotienda'] = $infoConect['codigotienda'];
        $params['nombreconexion'] = $infoConect['nombreconexion'];
        return $factory->descargarProdMantenimiento($params);
    }

    public function ajustarTienda($params)
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
        $factory = new ExternalIntegrationFactory($infoConect['tipo']);
        $factory->setStoreConfig(array('URL' => $infoConect['url'], 'KEY' => $infoConect['clave'], 'DEBUG' => false))->connect();

        $params['idestructuracomun'] = $this->global->Estructura->idestructura;
        $params['idusuario'] = $this->global->Perfil->idusuario;
        $params['nombreconexion'] = $infoConect['nombreconexion'];
        $params['codigotienda'] = $infoConect['codigotienda'];
        $params['references'] = json_decode($params['references']);
        return $factory->ajustarProdMantenimiento($params);
    }

    public function ajustarDistra($params)
    {
        $params['references'] = json_decode($params['references']);
        $disponible = ($params['disponible']) ? 1 : 'null';
        $existencia = ($params['existencia']) ? 1 : 'null';
        $tipodif = ($params['tipocriterio']) ? $params['tipocriterio'] : 'null';
        if (count($params['references'])) {
            $references = "{";
            foreach ($params['references'] as $pos => $p) {
                $p = (array) $p;
                if (count($params['references'])-1 == $pos) {
                    $references .= "".$p['numeropieza']."";
                } else {
                    $references .= "".$p['numeropieza'].",";
                }
            }
            $references .= "}";
            $sql = "SELECT * FROM mod_logpuntoventa.f_arreglardisponibletienda ({$params['iddeposito']}, "
                . "{$params['idareaventa']},'{$references}',{$disponible},{$existencia},{$tipodif}) q";

        } else {
            $sql = "SELECT * FROM mod_logpuntoventa.f_arreglardisponibletienda ({$params['iddeposito']}, "
                . "{$params['idareaventa']},null,{$disponible},{$existencia},{$tipodif}) q";

        }
        Doctrine_Manager::connection()->fetchAll($sql);
        return true;
    }

    public function devolverPedido($params) {
        $query = Doctrine_Query::create()->select('da.*,inf.*')->from('DatAreaventa da')
            ->leftJoin('da.DatInfoConexion inf');
        $query->where('da.idareaventa = ?', array($params['idareaventa']));

        $infoConfig = $query->fetchArray();
        $infoConect = $infoConfig[0]['DatInfoConexion'];
        $iddeposito = $infoConfig[0]['idestructuraop'];
        $usuarioez = $infoConfig[0]['usuarioez'];

        $sql = "select * from mod_logpuntoventa.dat_pedidotiendadevolucion where idpedidodevolucion = {$params['idpedidodevolucion']}";
        $respuesta = $this->doctrineHelper->getConnection()->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        $pedido = Doctrine::getTable('DatPedidotienda')->find($respuesta[0]['idpedidotienda']);

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

        $devEZ = "select count(nv.nombre) from mod_logistica.nom_variableglobal nv 
                          where nv.nombre = 'DEV_EZ' and nv.valor = 'true'";
        $existeDevEz = LogisticaDoctrineHelper::__init()->getConnection()->execute($devEZ)->fetchAll(PDO::FETCH_COLUMN);
        $respEnzObj = null;
        $descripcion = "{$entidad[0]['entidad']} Devolucion de pedido " . $pedido->nropedido . " usuario " . $usuario[0]['usuario'];
        $commercerefundid = '';
        if ($existeDevEz[0] > 0) {
            $commercerefundid = $this->objectHelper->gcommerceRefundId(array(
                'coddeposito' => $deposito[0]['deposito'],
                'consecutivo' => $respuesta[0]['numero']
            ));
            $enzonaTemp = LogisticaGlobal::__init()->getEznContainer();
            $data = array(
                'consumerKey' => $infoConect['consumerkey'],
                'consumerSecret' => $infoConect['consumersecret'],
                'monto' => $respuesta[0]['importe'],
                'transaction_uuid' => $pedido->idtransaccion,
                'commercerefundid' => $commercerefundid,
                'usuario' => $usuarioez,
                'descripcion' => $descripcion
            );
            $respEnz = $enzonaTemp->refund($data);
            $respEnzObj = json_encode($respEnz);

            $sqlUpdate = "update mod_logpuntoventa.dat_pedidotiendadevolucion 
                         set importe = {$respuesta[0]['importe']}, idusuario = {$this->global->Perfil->idusuario},
                         refund_response = '{$respEnzObj}', descripcion='{$descripcion}', commercerefundid='{$commercerefundid}',
                         fecha=now()
                         where idpedidodevolucion = {$params['idpedidodevolucion']}
                         ";
            Doctrine_Manager::connection()->fetchAll($sqlUpdate);
        }
    }

    public function setDevuelto($params) {
        $query = Doctrine_Query::create()->select('da.*,inf.*')->from('DatAreaventa da')
            ->leftJoin('da.DatInfoConexion inf');
        $query->where('da.idareaventa = ?', array($params['idareaventa']));

        $infoConfig = $query->fetchArray();
        $infoConect = $infoConfig[0]['DatInfoConexion'];
        $iddeposito = $infoConfig[0]['idestructuraop'];
        $usuarioez = $infoConfig[0]['usuarioez'];

        $sql = "update mod_logpuntoventa.dat_pedidotiendadevolucion set devueltotienda = 1 where idpedidodevolucion = {$params['idpedidodevolucion']}";
        Doctrine_Manager::connection()->fetchAll($sql);
    }

    public function cargarPedidos($params) {
        $sql = "select pp.codreferencia, ni.denominacion, p.idproducto, sum(pp.cantidad) as cantidad,
                coalesce(
                (select sum(COALESCE(dpped.enproceso,0)-COALESCE(dpped.devolver,0)) from mod_logpuntoventa.dat_pedidoproducto dpped where dpped.idproducto = p.idproducto
                and dpped.enproceso > 0)
                ,0) as enproceso, array_to_string(array_agg(pt.nropedido),', ') as nropedido, COUNT(*) OVER() as total
                , sum(pp.cantidadreal) as cantidadreal, p.cantidad as existencia from mod_logpuntoventa.dat_pedidotienda pt
                inner join mod_logpuntoventa.dat_pedidoproducto pp ON pp.idpedidotienda = pt.idpedidotienda
                inner join mod_datosmaestros.nom_indicador ni ON ni.numeropieza = pp.codreferencia
                inner join mod_logistica.dat_producto p on p.idproducto = pp.idproducto
                left join mod_logpuntoventa.dat_pedidodocumento pd ON pd.idpedido = pt.idpedidotienda and pd.tipo = 2
                left join mod_logfacturacion.dat_despachofactura despf on despf.idfactura = pd.iddocumento
                where pt.idareaventa = {$params['idareaventa']} and pt.estado = 3 and (pp.cantidad + coalesce(pp.devuelto,0)) < pp.cantidadreal
                and (despf.iddespachotienda is null or despf.iddespachotienda in (
                    select det.iddespachotienda from mod_logfacturacion.dat_despachotienda det where det.estado = 1
                )) 
                --and despf.iddespachotienda is null --and p.idproducto = 1000769010
                group by pp.codreferencia, ni.denominacion, p.cantidad, p.idproducto
                offset {$params['start']} limit {$params['limit']}";

        $respuesta = $this->doctrineHelper->getConnection()->execute(
            $sql
        )->fetchAll(PDO::FETCH_ASSOC);
        return array('datos' => $respuesta, 'cantidad' => (count($respuesta) ? $respuesta[0]['total'] : 0));
    }

    public function reprocesar($params) {

        if ($params['idproducto']) {
            $sqlVerificar = "select pp.codreferencia, ni.denominacion, p.idproducto, sum(pp.cantidad) as cantidad,
                coalesce(
                (select sum(COALESCE(dpped.enproceso,0)-COALESCE(dpped.devuelto,0)) from mod_logpuntoventa.dat_pedidoproducto dpped where dpped.idproducto = p.idproducto
                and dpped.enproceso > 0)
                ,0) as enproceso, array_to_string(array_agg(pt.nropedido),', ') as nropedido, COUNT(*) OVER() as total
                , sum(pp.cantidadreal) as cantidadreal, p.cantidad as existencia from mod_logpuntoventa.dat_pedidotienda pt
                inner join mod_logpuntoventa.dat_pedidoproducto pp ON pp.idpedidotienda = pt.idpedidotienda
                inner join mod_datosmaestros.nom_indicador ni ON ni.numeropieza = pp.codreferencia
                inner join mod_logistica.dat_producto p on p.idproducto = pp.idproducto
                left join mod_logpuntoventa.dat_pedidodocumento pd ON pd.idpedido = pt.idpedidotienda and pd.tipo = 2
                left join mod_logfacturacion.dat_despachofactura despf on despf.idfactura = pd.iddocumento
                where pt.idareaventa = {$params['idareaventa']} and pt.estado = 3 and pp.cantidad < pp.cantidadreal
                and (despf.iddespachotienda in (
                    select det.iddespachotienda from mod_logfacturacion.dat_despachotienda det where det.estado = 1
                )) 
                and p.idproducto = {$params['idproducto']}
                --and despf.iddespachotienda is null --and p.idproducto = 1000769010
                group by pp.codreferencia, ni.denominacion, p.cantidad, p.idproducto
                offset {$params['start']} limit {$params['limit']}";

            $respuesta = $this->doctrineHelper->getConnection()->execute(
                $sqlVerificar
            )->fetchAll(PDO::FETCH_ASSOC);
            if (count($respuesta)) {
                throw new ZendExt_Exception('LOG_LB_PTV_001');
            }

            $sql = "SELECT * FROM mod_logfacturacion.f_arreglarpedidostienda ({$params['idareaventa']}, "
                . "{$params['idproducto']}) q";

        } else {
            $sqlVerificar = "select pp.codreferencia, ni.denominacion, p.idproducto, sum(pp.cantidad) as cantidad,
                coalesce(
                (select sum(COALESCE(dpped.enproceso,0)-COALESCE(dpped.devuelto,0)) from mod_logpuntoventa.dat_pedidoproducto dpped where dpped.idproducto = p.idproducto
                and dpped.enproceso > 0)
                ,0) as enproceso, array_to_string(array_agg(pt.nropedido),', ') as nropedido, COUNT(*) OVER() as total
                , sum(pp.cantidadreal) as cantidadreal, p.cantidad as existencia from mod_logpuntoventa.dat_pedidotienda pt
                inner join mod_logpuntoventa.dat_pedidoproducto pp ON pp.idpedidotienda = pt.idpedidotienda
                inner join mod_datosmaestros.nom_indicador ni ON ni.numeropieza = pp.codreferencia
                inner join mod_logistica.dat_producto p on p.idproducto = pp.idproducto
                left join mod_logpuntoventa.dat_pedidodocumento pd ON pd.idpedido = pt.idpedidotienda and pd.tipo = 2
                left join mod_logfacturacion.dat_despachofactura despf on despf.idfactura = pd.iddocumento
                where pt.idareaventa = {$params['idareaventa']} and pt.estado = 3 and pp.cantidad < pp.cantidadreal
                and (despf.iddespachotienda in (
                    select det.iddespachotienda from mod_logfacturacion.dat_despachotienda det where det.estado = 1
                )) 
                --and despf.iddespachotienda is null --and p.idproducto = 1000769010
                group by pp.codreferencia, ni.denominacion, p.cantidad, p.idproducto
                offset {$params['start']} limit {$params['limit']}";

            $respuesta = $this->doctrineHelper->getConnection()->execute(
                $sqlVerificar
            )->fetchAll(PDO::FETCH_ASSOC);
            if (count($respuesta)) {
                throw new ZendExt_Exception('LOG_LB_PTV_001');
            }
            $sql = "SELECT * FROM mod_logfacturacion.f_arreglarpedidostienda ({$params['idareaventa']}, "
                . "null) q";

        }
        Doctrine_Manager::connection()->fetchAll($sql);
        return true;
    }

}
