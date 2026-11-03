<?php

/**
 * @class ReclamacionModel
 * (Descripcion de la clase, objetivo)
 * @package Inventario
 * @subpackage Entrada
 * @author Dainier Aguila Medina
 * @copyright XETID
 * @version 1.0
 */
class ReclamacionModel extends EntradaModel
{
    public function __construct($datos = array())
    {
        parent::__construct($datos);
        $this->tryInyector();
    }

    /**
     * Devuelve los documentos dado los criterios de búsqueda especificados.
     * @param array $datosDoc Arreglo de datos del documento con sus preductos.
     * @return array
     */
    public function devolverDocumentos($datosDoc = array(), $dql = false)
    {
        $query = parent::devolverDocumentos($datosDoc);
        $reclamacion = new DatReclamacion();
        $reclamacion->getJoinDatReclamacion($query, $datosDoc, 'd');
        $this->cargarTransportador($query, 'd2');
        $tienda = "select count(nv.nombre) from mod_logistica.nom_variableglobal nv 
                          where nv.nombre = 'TV_EXIST' and nv.valor = 'true'";
        $existe = LogisticaDoctrineHelper::__init()->getConnection()->execute($tienda)->fetchAll(PDO::FETCH_COLUMN);
        if ($existe[0] > 0) {
            $query->addSelect('(SELECT COUNT(dpd.iddocumento) FROM DatPedidodocumento dpd 
            WHERE dpd.iddocumento = r.idrecepcion) as detienda');
        }
        if ($dql) {
            return $query;
        }
        return array(
            'cantidad' => $query->count(),
            'datos' => $this->cargarClientesDocumentos(
                $this->doctrineHelper->addQueryLimits($query, $datosDoc)->fetchArray()
            )
        );
    }

    /**
     * Adiciona un documento.
     * @param array $datosDoc Arreglo de datos del documento con sus preductos.
     * @return int iddocumento
     */
    public function adicionarDocumento($datosDoc = array())
    {
        $documento = parent::adicionarDocumento($datosDoc);
        $reclamacion = new DatReclamacion();
        if ($datosDoc['iddocumento']) {
            $reclamacion->assignIdentifier($datosDoc['iddocumento']);
        }
        if ($datosDoc['reposicion']) {
            $datosDoc['tiporeclamacion'] = 1;
        } else {
            $datosDoc['tiporeclamacion'] = 0;
        }
        $reclamacion->synchronizeWithArray($datosDoc);
        $documento->DatReclamacion = $reclamacion;
        $documento->save();
        $docPadre = Doctrine::getTable('DatDocumentoPadre')
            ->findByDql('iddocumento = ? AND idpadre = ?', array($documento->iddocumento, $datosDoc['idrecepcion']))
            ->toArray();
        if (!$docPadre) {
            $docPadre = new DatDocumentoPadre();
            $docPadre->synchronizeWithArray(
                array('iddocumento' => $documento->iddocumento, 'idpadre' => $datosDoc['idrecepcion'])
            );
            $docPadre->save();
        }
        $this->trazaDocumento->guardarTraza('Documento adicionado', $documento->iddocumento);
        if (is_array($datosDoc['idproductos']) && count($datosDoc['idproductos']) > 0) {
            $this->getProductoModel()->adicionarMovimientos(
                $documento->iddocumento, $datosDoc['idproductos'], LogisticaMovimientoModel::SIGNO_NINGUNO
            );
        }
        if (is_array($datosDoc['productos']) && count($datosDoc['productos']) > 0) {
            $this->producto->modificarMovimientos($datosDoc['productos']);
        }
        return $documento->iddocumento;
    }

    /**
     * @param Integer $iddocumento Identificador del documento a aprobar
     * @return boolean
     */
    public function aprobarDocumento($iddocumento)
    {
        parent::aprobarDocumento($iddocumento, true);
        $iddocPadre = Doctrine::getTable('DatReclamacion')->find($iddocumento);
        $documento = Doctrine::getTable('DatDocumento')->find($iddocPadre->idrecepcion);
        if ($this->existComponent('log.fac.despachotienda')) {
            $sqlExiste = "select pd.idpedido from mod_logpuntoventa.dat_pedidodocumento pd 
                          where pd.iddocumento = {$iddocPadre->idrecepcion}";
            $existe = LogisticaDoctrineHelper::__init()->getConnection()->execute($sqlExiste)->fetchAll(PDO::FETCH_COLUMN);
            if (count($existe)) {
                if ($iddocPadre->tiporeclamacion == 1) {
                    Doctrine_Manager::connection()->execute(
                        "select mod_logpuntoventa.f_procesarrecepciontienda({$iddocPadre->idrecepcion}, 
                            {$this->global->Estructura->idestructura},{$this->global->Perfil->idusuario},0,0)"
                    );
                } else {
                    Doctrine_Manager::connection()->execute(
                        "select mod_logpuntoventa.f_procesarrecepciontiendadev({$iddocPadre->idrecepcion}, 
                            {$this->global->Estructura->idestructura},{$this->global->Perfil->idusuario},0,0)"
                    );
                    $sqlPedido = "select pt.* from mod_logpuntoventa.dat_pedidotienda pt 
                          where pt.idpedidotienda = {$existe[0]}";
                    $datosPedido = LogisticaDoctrineHelper::__init()->getConnection()->execute($sqlPedido)->fetchAll(PDO::FETCH_ASSOC);
                    $query = Doctrine_Query::create()->select('da.*,inf.*')->from('DatAreaventa da')
                        ->leftJoin('da.DatInfoConexion inf');
                    $query->where('da.idareaventa = ?', array($datosPedido[0]['idareaventa']));

                    $infoConfig = $query->fetchArray();
                    $infoConect = $infoConfig[0]['DatInfoConexion'];
                    $iddeposito = $documento->idestructuracomun;
                    $usuarioez = $infoConfig[0]['usuarioez'];
                    unset($infoConfig[0]['DatInfoConexion']);
                    $factory = new ExternalIntegrationFactory($infoConect['tipo']);
                    $factory->setStoreConfig(array('URL' => $infoConect['url'], 'KEY' => $infoConect['clave'], 'DEBUG' => false))->connect();
                    $arrayProd = array();
                    $sqlProdDev = "select dmr.precio, dmr.codreferencia, (mre.cantidad - dm.cantidad) as devolver,
                                    dmr.idproductopedido 
                                from mod_logistica.dat_movimiento dm
                                inner join mod_logistica.dat_producto dp on dp.idproducto = dm.idproducto
                                inner join mod_logistica.dat_producto dpp on dpp.idindicador = dp.idindicador
                                inner join mod_logpuntoventa.dat_pedidoproducto dmr on dmr.idproducto = dpp.idproducto
                                inner join mod_loginventario.dat_movrecepcion mre on mre.idmovimiento = dm.idmovimiento
                                where dm.iddocumento = {$iddocPadre->idrecepcion} and dmr.idpedidotienda = {$existe[0]} 
                                and dm.cantidad < mre.cantidad";
                    $datosProdDev = LogisticaDoctrineHelper::__init()->getConnection()->execute($sqlProdDev)->fetchAll(PDO::FETCH_ASSOC);
                    $importe = 0;
                    foreach ($datosProdDev as $pAux) {
                        $arrayProd[$pAux['codreferencia']] = $pAux;
                        $importe += round($pAux['precio']*$pAux['devolver'],2);
                    }
                    $id_orderslip = $factory->devolverPedido($datosPedido[0]['idreferencia'], $arrayProd);
                    $devuelto = Doctrine_Manager::connection()->fetchAll(
                        "SELECT SUM(dpp.cantidad) as cantidad, SUM(dpp.devuelto) as devuelto FROM mod_logpuntoventa.dat_pedidoproducto dpp 
                     where dpp.idpedidotienda = {$existe[0]}"
                    );
                    if ($devuelto[0]['cantidad'] > $devuelto[0]['devuelto']) {
                        $factory->cambiarEstado($datosPedido[0]['idreferencia'], 3);
                    } else {
                        Doctrine_Manager::connection()->fetchAll(
                            "update mod_logpuntoventa.dat_pedidotienda 
                     set estado = 7 where idpedidotienda = {$existe[0]}"
                        );
                    }
                    $anno = date('Y');
                    $nroDevSql = "select max(dev.numero) from mod_logpuntoventa.dat_pedidotiendadevolucion dev 
                          where dev.idareaventa = {$datosPedido[0]['idareaventa']} and dev.anno = {$anno}";
                    $nroDev = LogisticaDoctrineHelper::__init()->getConnection()->execute($nroDevSql)->fetchAll(PDO::FETCH_COLUMN);
                    $nroDev = (count($nroDev) && $nroDev[0]) ? $nroDev[0]+1 : 1;
                    //devolviendo enzona
                    $devEZ = "select count(nv.nombre) from mod_logistica.nom_variableglobal nv 
                          where nv.nombre = 'DEV_EZ' and nv.valor = 'true'";
                    $existeDevEz = LogisticaDoctrineHelper::__init()->getConnection()->execute($devEZ)->fetchAll(PDO::FETCH_COLUMN);
                    $respEnzObj = null;
                    $entidad = Doctrine_Manager::connection()->fetchAll(
                        "SELECT (est.codigo||' '||est.denominacion) as entidad  FROM mod_estructuracomp.v_dametodasestructuras est 
                                    where est.idestructura = {$this->global->Estructura->idestructura}"
                    );
                    $usuario = Doctrine_Manager::connection()->fetchAll(
                        "SELECT seg.nombreusuario as usuario FROM mod_seguridad.seg_usuario seg 
                                    where seg.idusuario = {$this->global->Perfil->idusuario}"
                    );
                    $descripcion = "{$entidad[0]['entidad']} Devolucion de pedido ".$datosPedido[0]['nropedido'].' usuario '.$usuario[0]['usuario'];
                    $commercerefundid = '';
                    if ($existeDevEz[0] > 0) {
                        $deposito = Doctrine_Manager::connection()->fetchAll(
                            "SELECT est.codigo as deposito  FROM mod_estructuracomp.v_dametodasestructuras est 
                                     where est.idestructura = {$iddeposito}"
                        );
                        $commercerefundid = $this->objectHelper->gcommerceRefundId(array(
                            'coddeposito' => $deposito[0]['deposito'],
                            'consecutivo' => $nroDev
                        ));
                        $enzonaTemp = LogisticaGlobal::__init()->getEznContainer();
                        $data = array(
                            'consumerKey' => $infoConect['consumerkey'],
                            'consumerSecret' => $infoConect['consumersecret'],
                            'monto' => $importe,
                            'transaction_uuid' => $datosPedido[0]['idtransaccion'],
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
                    VALUES ({$datosPedido[0]['idpedidotienda']},{$importe},{$this->global->Perfil->idusuario},'{$respEnzObj}',
                    {$datosPedido[0]['idareaventa']},{$nroDev},'{$descripcion}','{$commercerefundid}')
                    returning idpedidodevolucion";
                    $iddev = Doctrine_Manager::connection()->fetchAll($sqlDev);
                    $sqlInsertProdDev = "INSERT INTO mod_logpuntoventa.dat_pedidoproductodev
                            (
                              idpedidodevolucion,idproductopedido,cantidad,importe
                            ) VALUES";
                    foreach ($datosProdDev as $index => $p) {
                        $sqlInsertProdDev .= " (
                                  {$iddev[0]['idpedidodevolucion']},{$p['idproductopedido']},{$p['devolver']},round({$p['devolver']}*{$p['precio']},2)
                                )";
                        if ($index+1 < count($datosProdDev)) {
                            $sqlInsertProdDev .= ',';
                        }
                    }
                    Doctrine_Manager::connection()->fetchAll($sqlInsertProdDev);
                }
            }
        }
        return true;
    }

    /**
     * Duplica el documento seleccionado.
     * @param int $iddocumento Indentificador del documento.
     * @return int
     */
    public function copiarDocumento($iddocumento)
    {
        $idCopia = parent::copiarDocumento($iddocumento);
        $reclamacion = Doctrine::getTable('DatReclamacion')->find($iddocumento);
        $nuevoDoc = $reclamacion->copy();
        $datos = $reclamacion->toArray();
        $datos['iddocumento'] = $idCopia;
        $nuevoDoc->synchronizeWithArray($datos);
        $nuevoDoc->save();
        $doc = Doctrine::getTable('DatDocumento')->find($idCopia);
        $docPadre = new DatDocumentoPadre();
        $docPadre->synchronizeWithArray(
            array('iddocumento' => $idCopia, 'idpadre' => $datos['idrecepcion'])
        );
        $docPadre->save();
        $docPadre = new DatDocumentoPadre();
        $docPadre->synchronizeWithArray(
            array('iddocumento' => $idCopia, 'idpadre' => $iddocumento)
        );
        $docPadre->save();
        $this->trazaDocumento->guardarTraza('Documento duplicado', $idCopia);
        return array(
            'iddocumento' => $nuevoDoc->iddocumento,
            'observaciones' => $doc->observaciones
        );
    }

    /**
     * Devuelve los movimientos de un documento.
     * @param array $filtro
     */
    public function devolverMovimientos($filtro)
    {
        if ($filtro['productos']) {
            $filtro['asentado'] = true;
            $query = $this->getProductoModel()->cargarProductos($filtro, true)
                ->leftJoin(
                    "p.DatMovimientos _m ON (_m.iddocumento = {$filtro['idrecepcion']} "
                    . "AND _m.idproducto = p.idproducto)"
                )
                ->addWhere('_m.idmovimiento IS NULL');
        } else {
            $query = $this->getProductoModel()->devolverMovimientos($filtro, true);
            if ($filtro['idreclamacion']) {
                $query->innerJoin('mov.DatRecepcion r')
                    ->innerJoin('r.DatDocumentoPadre dp ON (r.iddocumento = dp.idpadre)')
                    ->leftJoin('dp.DatDocumento d ON (d.iddocumento = dp.iddocumento)')
                    ->leftJoin('d.DatReclamacion rc')
                    ->leftJoin(
                        'rc.DatMovimientos m2 ON (m2.iddocumento = rc.iddocumento AND m2.idproducto = mov.idproducto)'
                    )
                    ->addWhere('d.iddocumento = ? AND m2.idmovimiento IS NULL', $filtro['idreclamacion']);
            } else {
                $query->addSelect('(m.idmovimiento IS NULL) AS enfalta, (mr.idmovimiento IS NOT NULL) AS porfactura')
                    ->leftJoin('mov.DatReclamacion rc')
                    ->leftJoin('rc.DatDocumentoPadre dp ON (rc.iddocumento = dp.iddocumento)')
                    ->leftJoin('dp.DatDocumento d ON (d.iddocumento = dp.idpadre)')
                    ->leftJoin('d.DatRecepcion r')
                    ->leftJoin('r.DatMovimientos m ON (m.iddocumento = r.iddocumento AND m.idproducto = mov.idproducto)')
                    ->leftJoin('m.DatMovrecepcion mr');
            }
        }
        $maestroP = new MaestroProductoModel();
        return array(
            'cantidad' => $query->count(),
            'datos' => $maestroP->addSelectionData($this->doctrineHelper->addQueryLimits($query, $filtro)->fetchArray())
        );
    }

    /**
     * Verifica que los productos del documento tengan cantidades registradas.
     * @param numeric $iddocumento
     * @return boolean
     */
    public function productosConCantidad($iddocumento)
    {
        $query = Doctrine_Query::create()
            ->select('m.idmovimiento')
            ->from('DatMovimientos m')
            ->leftJoin('m.DatMovdiferencia md')
            ->leftJoin('m.DatMovdiferenciacalidad mdc')
            ->where('m.iddocumento = ? AND md.idmovimiento IS NULL AND mdc.idmovimiento IS NULL', array($iddocumento));
        if ($query->count()) {
            return false;
        }
        return true;
    }

    /**
     * @param array $filtro
     * @return array
     */
    public function cargarDiferenciasXCantidad($filtro)
    {
        $query = Doctrine_Query::create()
            ->select(
                'm.idmovimiento, md.signo AS signo, md.cantidaddiferencia AS cantidaddiferencia, '
                . 'coalesce(md.preciodiferencia, 0) AS preciodiferencia, '
                . 'coalesce(md.importediferencia, 0) AS importediferencia, '
                . 'coalesce(md.preciodiferenciaalt, 0) AS preciodiferenciaalt, '
                . 'coalesce(md.importediferenciaalt, 0) AS importediferenciaalt'
            )
            ->from('DatMovimientos m')
            ->leftJoin('m.DatMovdiferencia md')
            ->where('m.idmovimiento = ?', array($filtro['idmovimiento']));
        if ($filtro['dif']) {
            $query->addSelect("m2.cantidad AS cantidad")
                ->innerJoin('m.DatDocumento d')
                ->innerJoin('d.DatReclamacion rc')
                ->innerJoin('d.DatDocumentoPadre dp ON (dp.iddocumento = d.iddocumento)')
                ->innerJoin('dp.DatDocumento d2 ON (d2.iddocumento = dp.idpadre)')
                ->innerJoin('d2.DatRecepcion r2')
                ->innerJoin('r2.DatMovimientos m2');
        } else {
            $query->addSelect('m.cantidad');
        }
        return array('datos' => $query->fetchArray()[0]);
    }

    /**
     * @param numeric $idmovimiento
     * @return array
     */
    public function cargarDiferenciasXCalidad($idmovimiento)
    {
        $total = Doctrine_Query::create()
            ->select('m2.idmovimiento AS idmovimiento, m2.cantidad AS cantidad')
            ->from('DatMovimientos m')
            ->innerJoin('m.DatDocumento d')
            ->innerJoin('d.DatReclamacion rc')
            ->innerJoin('d.DatDocumentoPadre dp ON (dp.iddocumento = d.iddocumento)')
            ->innerJoin('dp.DatDocumento d2 ON (d2.iddocumento = dp.idpadre)')
            ->innerJoin('d2.DatRecepcion r ON (r.iddocumento = d2.iddocumento)')
            ->innerJoin('d2.DatMovimientos m2')
            ->where('m.idmovimiento = ? AND m.idproducto = m2.idproducto', $idmovimiento)
            ->fetchArray();
        $query = Doctrine_Query::create()->from("DatMovdiferenciacalidad dmd")
            ->select("dmd.idmovdiferenciacalidad, dmd.idmovimiento, dmd.idcalidad, dmd.cantidaddiferencia")
            ->where("dmd.idmovimiento = ?", $idmovimiento)
            ->orderBy("dmd.idmovdiferenciacalidad DESC");
        return array(
            'total' => $total[0]['cantidad'],
            'cantidad' => $query->count(),
            'datos' => $this->logisticaDoctrine->addQueryLimits($query)->fetchArray()
        );
    }

    /**
     * Registra las diferencias de los movimientos.
     * @param array $datos
     * @param boolean $varios [Opcional] Determina si se registra diferencias a varios movimientos.
     * @return boolean
     */
    public function registrarDiferencias($datos, $varios = false)
    {
        $movimientos = $varios ? $datos : array($datos);
        foreach ($movimientos as $item) {
            if (!$item['signo'] && $item['preciodiferencia'] <= 0 && $item['preciodiferenciaalt'] <= 0) {
                Doctrine_Query::create()->delete('DatMovdiferencia')->where('idmovimiento = ?', $item['idmovimiento'])
                    ->execute();
            } else {
                $diferencia = new DatMovdiferencia();
                $obj = Doctrine::getTable('DatMovdiferencia')->find($item['idmovimiento']);
                if ($obj) {
                    $diferencia->assignIdentifier($item['idmovimiento']);
                }
                $item['cantidaddiferencia'] = $item['cantidaddiferencia'] ? $item['cantidaddiferencia'] : 0;
                $diferencia->synchronizeWithArray($item);
                $diferencia->save();
            }
            $collection = new Doctrine_Collection('DatMovdiferenciacalidad');
            foreach ($item['calidad'] as $value) {
                if (!$value['eliminar']) {
                    $calidad = new DatMovdiferenciacalidad();
                    if ($value['idmovdiferenciacalidad']) {
                        $calidad->assignIdentifier($value['idmovdiferenciacalidad']);
                    }
                    $calidad->synchronizeWithArray($value);
                    $collection->add($calidad);
                } else {
                    Doctrine_Query::create()->delete('DatMovdiferenciacalidad')
                        ->where('idmovdiferenciacalidad = ?', $value['idmovdiferenciacalidad'])->execute();
                }
            }
            if ($collection->count()) {
                $collection->save();
            }
            if ($item['dif']) {
                $mdc = Doctrine_Query::create()
                    ->select('sum(mdc.cantidaddiferencia) AS cantidad')->from('DatMovdiferenciacalidad mdc')
                    ->where('mdc.idmovimiento = ?', array($item['idmovimiento']))
                    ->fetchArray();
                $item['cantidaddiferencia'] += $mdc[0]['cantidad'];
                Doctrine_Query::create()->update('DatMovimientos')
                    ->set('importecontable', '? * preciocontable', $item['cantidaddiferencia'])
                    ->set('importealternativo', '? * precioalternativo', $item['cantidaddiferencia'])
                    ->where('idmovimiento = ?', $item['idmovimiento'])->execute();
            }
        }
        return true;
    }
    
    private function tryInyector()
    {
        $relations[] = array(
            'cardinalidad' => 'one', 'relation' => 'DatReclamacion',
            'properties' => array('local' => 'iddocumento', 'foreign' => 'iddocumento')
        );
        $relations[] = array(
            'cardinalidad' => 'one', 'relation' => 'DatRecepcion',
            'properties' => array('local' => 'iddocumento', 'foreign' => 'iddocumento')
        );
        $this->logisticaDoctrine->tryInyectRelactions(new DatDocumento(), $relations);
        $relations = array();
        $relations[] = array(
            'cardinalidad' => 'many', 'relation' => 'DatReclamacion',
            'properties' => array('local' => 'iddocumento', 'foreign' => 'iddocumento')
        );
        $relations[] = array(
            'cardinalidad' => 'many', 'relation' => 'DatRecepcion',
            'properties' => array('local' => 'iddocumento', 'foreign' => 'iddocumento')
        );
        $relations[] = array(
            'cardinalidad' => 'one', 'relation' => 'DatMovrecepcion',
            'properties' => array('local' => 'idmovimiento', 'foreign' => 'idmovimiento')
        );
        $relations[] = array(
            'cardinalidad' => 'one', 'relation' => 'DatMovdiferencia',
            'properties' => array('local' => 'idmovimiento', 'foreign' => 'idmovimiento')
        );
        $relations[] = array(
            'cardinalidad' => 'many', 'relation' => 'DatMovdiferenciacalidad',
            'properties' => array('local' => 'idmovimiento', 'foreign' => 'idmovimiento')
        );
        $this->logisticaDoctrine->tryInyectRelactions(new DatMovimientos(), $relations);
    }

}
