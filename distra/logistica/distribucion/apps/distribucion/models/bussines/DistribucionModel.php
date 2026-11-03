<?php

class DistribucionModel extends DocumentoLogisticaModel
{

    private $_serviciosUbicacion, $_loteService, $_confdistibucionService, $_comunReserva,
        $_maestroProductos, $_ubicacion, $_objPedido, $_objProd, $_arrProdOrden, $_serviciosEstComposicion,
        $_datProdOrden, $_varGlobal, $_esFarmacia;

    public function __construct($datosDoc = array())
    {
        parent::__construct($datosDoc);
        $this->_serviciosUbicacion = LogisticaEstructuraUbicHelper::__init();
        $this->_loteService = new LoteService();
        if (class_exists('ConfiguraciondistribucionService')) {
            $this->_confdistibucionService = new ConfiguraciondistribucionService();
        }
        $this->_maestroProductos = new MaestroProductoModel;
        $this->_ubicacion = new UtilesubicacionService();
        /*if (class_exists('PedidoService')) {
            $this->_objPedido = new PedidoService();
        }*/
        $this->_objProd = new LogisticaProductoModel();
        $this->_arrProdOrden = array();
        $this->_serviciosEstComposicion = ServiciosEstructuraComposicionHelper::__init();
        $this->_datProdOrden = new DatProdorden();
        $this->_varGlobal = ZendExt_GlobalConcept::getInstance();
        $this->_esFarmacia = (new VariablesGlobalesModel())->obtenerValor('farmacia');
        if (class_exists('ComunReservaService')) {
            $this->_comunReserva = new ComunReservaService();
        }
        $relations = array();
        $relations[] = array('cardinalidad' => 'one', 'relation' => 'DatDistribucion',
            'properties' => array('local' => 'iddocumento', 'foreign' => 'iddistribucion'));
        /* $relations[] = array('cardinalidad' => 'one', 'relation' => 'DatPedido',
          'properties' => array('local' => 'iddocumento', 'foreign' => 'iddocumento')); */
        $relations[] = array('cardinalidad' => 'one', 'relation' => 'DatDistribucionpedido',
            'properties' => array('local' => 'iddocumento', 'foreign' => 'iddistribucion'));
        $relations[] = array('cardinalidad' => 'one', 'relation' => 'DatProdorden',
            'properties' => array('local' => 'iddocumento', 'foreign' => 'idorden'));
        $this->logisticaDoctrine->tryInyectRelactions(
            new DatDocumento(), $relations
        );
        $relations = array();
        $relations[] = array('cardinalidad' => 'one', 'relation' => 'DatProductopedido',
            'properties' => array('local' => 'idindicador', 'foreign' => 'idproducto'));
        $this->logisticaDoctrine->tryInyectRelactions(
            new DatProductoLogistica(), $relations
        );
        $relations = array();
        $relations[] = array('cardinalidad' => 'one', 'relation' => 'DatProdordenlote',
            'properties' => array('local' => 'idlote', 'foreign' => 'idlote'));
        $this->logisticaDoctrine->tryInyectRelactions(
            new DatLote(), $relations
        );
    }

    /**
     * Método que permite confirmar si el documento tiene productos
     *
     * @param Integer $iddocumento Identificador de documento
     *
     * @return boolean
     */
    public function contieneProductos($iddocumento)
    {
        $datProdOrden = new DatProdorden();
        $datosBusqueda = $datProdOrden->devolverProductos(implode(',', Zend_Json::decode($iddocumento)), false);
        if ($datosBusqueda[0]['cantidad'] > 0) {
            return true;
        }
        return false;
    }

    /**
     * Método que permite confirmar si un producto tiene cantidad registrada
     *
     * @param Integer $iddocumento Identificador de documento
     *
     * @return boolean
     */
    public function contieneCantidad($iddocumento)
    {
        $datProdOrden = new DatProdorden();
        $datosBusqueda = $datProdOrden->devolverProductos(implode(',', Zend_Json::decode($iddocumento)), true);
        if ($datosBusqueda[0]['cantidad'] > 0) {
            return false;
        }
        return true;
    }

    /**
     * Método para devolver los depositos
     *
     * @return array
     */
    public function cargarEstructuras($parametros)
    {
        $parametros['identidad'] = ($parametros['identidad']) ? $parametros['identidad'] : $this->global->Estructura->idestructura;
        $depositos = $this->estructuraHelper->obtenerEstructurasNoFormalesPorEntidad($parametros['identidad'], ($parametros['query'])?$parametros['query']:$parametros['criterio']);
        $datos = array();
        foreach ($depositos as $index => $r) {

            $uxiliar = ($r->codigo) ? $r->codigo . '-' : '';
            if ($parametros['depositosprod']) {
                $datos[$index]['iddeposito'] = $r->idfila;
            } else {
                $datos[$index]['idestructuraop'] = $r->idfila;
            }
            $datos[$index]['id'] = $r->idfila;
            $datos[$index]['deposito'] = $uxiliar . $r->idfila;
            $datos[$index]['codigo'] = ($r->codigo) ? $r->codigo : '-';
            $datos[$index]['nombre'] = $r->denominacion;
            $datos[$index]['leaf'] = true;
            foreach ($parametros['idseleccionados'] as $idDeposito) {
                if ($r->idfila == $idDeposito) {
                    unset($datos[$index]);
                }
            }
        }
        return array('cantidad' => count($datos), 'datos' => array_values($datos));
    }

    public function addJoinModel(Doctrine_Query $query, $alias, $joinType = 1)
    {
        if ($joinType == 1) {
            $query->innerJoin("{$alias}.{$this->getDomainTableClass()} {$this->getTableAlias()}");
        } else {
            $query->leftJoin("{$alias}.{$this->getDomainTableClass()} {$this->getTableAlias()}");
        }
        $query->addSelect($this->getSelectionString($this->getTableAlias()));
    }

    public function cargarClientesDoc($datosDoc)
    {
        $datos = parent::cargarClientesDocumentos($datosDoc);

        foreach($datos as $pos => $doc){
            $datos[$pos]['estadoejecucion'] = 2;
            $sqlCumplim ="select count(dpo.idprodorden) as cantidad
                                from mod_logdistribucion.dat_prodorden dpo
                                join mod_logdistribucion.dat_prodordencmpto dpoc ON dpoc.idprodorden = dpo.idprodorden
                                where dpo.idorden = {$doc['iddocumento']} and dpoc.pendiente = dpo.cantidad";
            //$datos[$pos]['iddocumento']
            $count = $this->doctrineHelper->getConnection()->execute($sqlCumplim)->fetchAll();
            $sqlClientes ="select count(dpo.idprodorden) as cantidad
                                from mod_logdistribucion.dat_prodorden dpo
                                where dpo.idorden = {$doc['iddocumento']}";
            $countClientes = $this->doctrineHelper->getConnection()->execute($sqlClientes)->fetchAll();
            if($count[0]['cantidad'] == $countClientes[0]['cantidad']){
                $datos[$pos]['estadoejecucion'] = 1;
            }
            $sqlCumplim ="select count(dpo.idprodorden) as cantidad
				from mod_logdistribucion.dat_prodorden dpo
				join mod_logdistribucion.dat_prodordencmpto dpoc ON dpoc.idprodorden = dpo.idprodorden
				where dpo.idorden = {$doc['iddocumento']} and dpoc.entregado = dpo.cantidad";
            $count = $this->doctrineHelper->getConnection()->execute($sqlCumplim)->fetchAll();
            if($count[0]['cantidad'] == $countClientes[0]['cantidad']){
                $datos[$pos]['estadoejecucion'] = 3;
            }
            if($doc['estado'] < 3){
                $datos[$pos]['estadoejecucion'] = 1;
            }
        }
        return $datos;
    }
    /**
     * Método para devolver los documentos de distribucion
     *
     * @params array $datosDoc Arreglo con los parametros para filtrar los documentos
     *
     * @return array
     */
    public function devolverDocumentos($datosDoc)
    {
        $datosDoc['idestructuracomun'] = $this->idestructuracomun;
        if ($datosDoc['idcliente'] == null) {
            unset($datosDoc['idcliente']);
        }
        if ($datosDoc['facturacion']) {
            $facturacion = true;
        } else {
            $facturacion = false;
        }
        if ($datosDoc['mayorista'] && $datosDoc['mayorista'] != -1) {
            $filtro['mayorista'] = 1;
            $clMayoristasAux = $this->configuracionHelper->getClientesProveedorByParams(
                false, $this->global->Estructura->idestructura, true,
                true, false, $filtro, null, null
            )['datos'];
            $clMayoristas = LogisticaObjectHelper::__init()
                ->extractValueFromArrayColumn($clMayoristasAux, 'idclientesproveedores');
            if (!count($clMayoristas)) {
                $clMayoristas = array(-1);
            }
            $datosDoc['idcliente'] = $clMayoristas;
        }
        $qDoc = parent::devolverDocumentos($datosDoc);
        $distribucion = new DatDistribucion();
        $distribucion->getJoinDatDistribucion($qDoc, $datosDoc, 'd', 'dd');
        $datProdOrden = new DatProdorden();
        $datProdOrden->addDqlProductosDocumentos($qDoc, $datosDoc, 'd', 'p', 'po', 'cmpto');
        $salida = ($datosDoc['salida']) ? true : false;
        
        if ($facturacion/* || $salida */) {
            if ($datosDoc['depositoreserva']) {
                $depReserva = $datosDoc['depositoreserva'];
            }
            $datosDoc = $this->logisticaDoctrine->addQueryLimits($qDoc, $datosDoc)
                ->fetchArray();
            ($facturacion) ? $salFac = 'fac' : $salFac = 'sal';
        } else {
            $datosDoc=$this->logisticaDoctrine->addQueryLimits($qDoc, $datosDoc)->fetchArray();
            $datosDoc= $this->cargarClientesDoc($datosDoc);
        }
        $reserva = LogisticaGlobal::__init()->estaAperturadoSubsistema(LogisticaGlobal::SUBSISTEMA_RESERVA);
        if ($reserva) {
            if (class_exists('RotacionService')) {
                $rotacion = new RotacionService();
            }
        }
        
        if (isset($salFac)) {
            foreach ($datosDoc as $index => $data) {
                $data['salfac'] = $salFac;
                if ($data['cant_clientes'] == 1) {
                    $datosDoc[$index]['arrayClientes'] = array($data['idcliente']);
                    $clientes = $this->configuracionHelper->getClientesProveedorByParams(
                        $data['idcliente'], false, true,
                        true, false, null, null, null
                    )['datos'];
                    $datosDoc[$index]['cliente'] = $clientes[0]['nombre'];
                    $datosDoc[$index]['codigo'] = $clientes[0]['codigo'];
                } else {
                    if (isset($clMayoristas)) {
                        $result = Doctrine_Query::create()->select('ddc.idcliente')
                            ->from('DatDocumentoCliente ddc')->andWhere('ddc.iddocumento = ?', $data['iddocumento'])
                            ->andWhereIn('idcliente', $clMayoristas)
                            ->fetchArray();
                        if (count($result) == 1) {
                            $clientes = $this->configuracionHelper->getClientesProveedorByParams(
                                $result[0]['idcliente'], false, true,
                                true, false, null, null, null
                            )['datos'];
                            $datosDoc[$index]['cliente'] = $clientes[0]['nombre'];
                            $datosDoc[$index]['codigo'] = $clientes[0]['codigo'];
                        } else {
                            $datosDoc[$index]['cliente'] = count($result)." clientes";
                        }
                        $datosDoc[$index]['arrayClientes'] = LogisticaObjectHelper::__init()
                            ->extractValueFromArrayColumn($result, 'idcliente');
                    } else {
                        $result = Doctrine_Query::create()->select('ddc.idcliente')
                            ->from('DatDocumentoCliente ddc')->where('ddc.iddocumento = ?', $data['iddocumento'])
                            ->fetchArray();
                        $datosDoc[$index]['cliente'] = "{$data['cant_clientes']} clientes";
                        $datosDoc[$index]['arrayClientes'] = LogisticaObjectHelper::__init()
                            ->extractValueFromArrayColumn($result, 'idcliente');
                    }
                }
                /*if ($reserva) {
                    //if (class_exists('RotacionService')) {
                    $datosDoc[$index]['rotacion'] = $rotacion->existeDistribucionService(
                        array('iddistribucion' => $data['iddocumento'])
                    );
                    //}
                }*/
            }
        }
        return array('cantidad' => $qDoc->count(), 'datos' => $datosDoc);
    }

    /**
     * Método para devolver un arreglo del identificador de cliente
     *
     * @params array $index Arreglo con los idclientes
     *
     * @return array
     */
    public function getArrayIdClientes($index, $idestructura = false, $depositosReserva = false)
    {
        $arrayClientes = $this->devolverClientes($index, $idestructura, $depositosReserva);
        $arrayidcliente = array();
        foreach ($arrayClientes['datos'] as $data) {
            array_push($arrayidcliente, $data['idcliente']);
        }
        return $arrayidcliente;
    }

    /**
     * Método para devolver los clientes de distribucion (clientes, centros de costo, depositos, pedidos)
     * @params array $datosDoc Arreglo con los parametros para filtrar los documentos.
     * @return array
     */
    public function devolverClientes($datosDoc, $idestructura = false, $depositosReserva = false)
    {
        $objDistibucion = new DatDistribucion();
        $datosCliente = $objDistibucion->getClientesDocumento($datosDoc, $idestructura, $depositosReserva);
        if ($datosDoc['tipodistribucion'] == 2 && !isset($datosDoc['salfac'])) {
            $objDistibucionPedido = new DatDistribucionpedido();
            $datosPedido = $objDistibucionPedido->getPedidoByIdDocumento($datosDoc);
            $arrayPedido = array();
            foreach ($datosPedido as $pedido) {
                $ped = $this->_objPedido->CargarDocPedido($pedido)['datos'][0];
                if ($ped) {
                    $arrayPedido[] = $ped;
                }
            }
        }

        foreach ($arrayPedido as $index => $pedido) {
            $arrayPedido[$index]['idpedido'] = $pedido['iddocumento'];
            $arrayPedido[$index]['nropedido'] = $pedido['nrodoc'];
            $arrayPedido[$index]['idcliente'] = $pedido['idcliente'];
            $arrayPedido[$index]['descripcliente'] = $pedido['cliente'];
            $arrayPedido[$index]['cantidadreclamo'] = ($pedido['reclamos']) ? $pedido['reclamos'] : 0;
            $arrayPedido[$index]['cantidadproducto'] = $pedido['productos'];
        }

        return array(
            'cantidad' => count($datosCliente),
            'datos' => ($datosDoc['tipodistribucion'] == 2 && !isset($datosDoc['salfac'])) ? $arrayPedido :
                $this->cargarClientesDocumentos($datosCliente, $datosDoc['criterio']) //$clientes['datos']
        );
    }

    /**
     * Método para devolver los clientes de los pedidos
     * @params array $datosDoc Arreglo con los parametros para filtrar los documentos.
     * @return array
     */
    public function devolverClientesPedidos($datosDoc)
    {
        $filtro = array();
        if ($datosDoc['criterio']) {
            $filtro['nombre'] = $datosDoc['criterio'];
            $filtro['codigo'] = $datosDoc['criterio'];
        }
        if ($datosDoc['query']) {
            $filtro['nombre'] = $datosDoc['query'];
            $filtro['codigo'] = $datosDoc['query'];
        }
        if ($datosDoc['tipodistribucion'] == 2) {
            $clientes = $this->_objPedido->cargarClientesAprobados();
            $this->cargarClientesDocumentos($clientes);
        } else {
            $notIn = null;
            $notIn = array('ids' => $datosDoc['listaClientes'], 'notin' => 1);
            $clientes = $this->configuracionHelper->getClientesProveedorByParams(
                $notIn, $this->global->Estructura->idestructura, true, true, false, $filtro, $datosDoc['start'],
                $datosDoc['limit']
            );
        }
        return ($datosDoc['tipodistribucion'] == 2) ? array('cantidad' => count($clientes),
            'datos' => $clientes) : $clientes;
    }

    /**
     * Método para devolver los clientes que tienen consumo critico
     * @params array $datosDoc Arreglo con los parametros para filtrar los documentos.
     * @return array
     */
    public function devolverClientesConsumoCritico($datosDoc)
    {
        $fechacontable = $this->configuracionHelper->getFechaContableSubsistema(
            $this->global->Estructura->idestructura, LogisticaGlobal::SUBSISTEMA_INV
        );
        if (!$fechacontable) {
            throw new LogisticaException('LOG_LB_DOC_016'); //LOG_R_007
        }
        $resultado = $this->_confdistibucionService->getDatosPlanConsumoCritico(
            $fechacontable, $datosDoc['limit'], $datosDoc['start']
        )['datos'];

        $filtro = array();
        if ($datosDoc['criterio']) {
            $busqueda = array();
            $filtro['nombre'] = $datosDoc['criterio'];
            $filtro['codigo'] = $datosDoc['criterio'];
        }
        foreach ($resultado as $k => $value) {
            $clientes = $this->configuracionHelper->getClientesProveedorByParams(
                $value['idcliente'], $this->global->Estructura->idestructura, true, false, false, $filtro,
                $datosDoc['start'], $datosDoc['limit']
            );
            $resultado[$k]['nombre'] = $clientes['datos'][0]['nombre'];
            $resultado[$k]['codigo'] = $clientes['datos'][0]['codigo'];
            if (isset($busqueda)) {
                if (count($clientes['datos']) > 0) {
                    $busqueda[] = $resultado[$k];
                }
            }
        }
        if (isset($busqueda)) {
            return array('cantidad' => count($busqueda), 'datos' => $busqueda);
        } else {
            return array('cantidad' => count($resultado), 'datos' => $resultado);
        }
    }

    /**
     * Método para devolver los productos de distribucion
     *
     * @params array $datosDoc Arreglo con los parametros para filtrar los documentos
     *
     * @return array
     */
    public function devolverMovimientos($datosDoc)
    {
        $cont = 0;
        $contAux = 0;
        $modelUbic = new UbicacionModel();
        $objProdOrden = new DatProdorden();
        $query = $objProdOrden->getDatosProducto($datosDoc, 'dpo', 'p', 'dd', 'cpmto');
        $modelUbic->addSqlProductosUbicacion($query, 'p', 'ubic');
        if (class_exists('NomencladoresLogService')) {
            $nomenclador = new NomencladoresLogService();
            $nomenclador->innerJoinNomCategoria($query, 'p', 'nc');
        }
        (new MaestroProductoModel())->addQueryNomIndicador($query, 'p', 'i', 'ih');
        $query->addSelect(
            '(case when i.numeropieza is null or length(i.numeropieza) = 0 then i.codigo else i.numeropieza end) as codigo'
        );
        $this->configuracionHelper->innerJoinNomNaturaleza($query, 'i', 'nat', false);
        $query->addSelect(
            'nat.denominacion as naturaleza'
        );
        if ($datosDoc['criterio'] && $datosDoc['criterio'] != '') {
            $query->andWhere(
                "i.denominacion ilike '%{$datosDoc['criterio']}%' or i.codigo ilike '%{$datosDoc['criterio']}%' 
                or i.numeropieza ilike '%{$datosDoc['criterio']}%' or p.numerolote ilike '%{$datosDoc['criterio']}%'"
            );
        }
        $this->configuracionHelper->getQueryJoinUnidadMedida(
            $query, 'p', 'um', 'um.abreviaturaunidadmedida as umedida, um.decimales as decimales', 'leftJoin'
        );
        if($datosDoc['sortfield'] == 'cliente') {
            $query->orderBy('dpo.idcliente');
            $query = $this->getOrdenByConfig($query);
        } else if ($datosDoc['sortfield'] == 'producto'){
            $query->orderBy('dpo.idproducto');
            $query = $this->getOrdenByConfig($query);
        } else {
            $query->orderBy('dpo.idprodorden asc');
        }
        
        if($this->_esFarmacia == 1){
            $query->addSelect('p.numerolote as numerolote, p.fechavencelote as fechavencelote');
            $query->addOrderBy('i.denominacion')->addOrderBy('p.fechavencelote ASC');
        }

        /*if ($datosDoc['pedido'] || $datosDoc['cumplimiento'] || $datosDoc['sortfield'] == 'cliente') {
            $query->orderBy('dpo.idcliente DESC');
        } else {
            $query->orderBy('dpo.idproducto DESC');
        }*/

        $datos = $this->cargarClientesDocumentos(
            $this->logisticaDoctrine->addQueryLimits($query, $datosDoc)->fetchArray(), array('cambioAlias' => true)
        );
        $importetotal = $entregado = $cantidad = $importetotalcuc = 0;
        if ($datosDoc['cumplimiento']) {
            foreach ($datos as $index => $prod) {
                $datos[$index]['porciento'] = ($prod['cantidad'] == 0) ? 0 : ($prod['entregado'] * 100) / $prod['cantidad'];
                $entregado += $prod['entregado'];
                $cantidad += $prod['cantidad'];
                if ($datos[$index]['porciento'] == 100) {
                    $cont++;
                } elseif ($datos[$index]['porciento'] > 0) {
                    $contAux++;
                }
            }
        } else {
            if (count($datos) > 0) {
                $productosSinPedido = array();
                $paisArray = array();
                $cantclientes = $this->getCantidadClienteDocumento($datosDoc['iddocumento']);
                $cantproductos = $this->_datProdOrden->getCantidadProductoDocumento($datosDoc)[0]['cantidad'];
                foreach ($datos as &$prod) {
                    $objDistibucion = new DatDistribucion();
                    $datosCliente = $objDistibucion->getClientesDocumento($datosDoc/*, $prod['idestructura']*/);
                    if ($datosCliente[0]['tipocliente'] == 3 || $datosCliente[0]['tipocliente'] == 1 || $datosCliente[0]['tipocliente'] == 2) {
                        if ($prod['idestructura']) {
                            $datosDepo = $this->estructuraHelper->obtenerEstructurasNoFormalesPorEntidad(
                                $prod['idestructura'], false , true
                            );
                            $prod['deposito'] = ($datosDepo[0]->codigo) ?
                                $datosDepo[0]->codigo . ' - ' . $datosDepo[0]->denominacion : $datosDepo[0]->denominacion;

                            $datosCliente = $objDistibucion->getClientesDocumento($datosDoc/*, $prod['idestructura']*/);
                            if ($datosCliente[0]['id']) {
                                $estructura = ServiciosEstructuraComposicionHelper::__init()->obtenerEstructuras($datosCliente[0]['id']);
                                foreach ($estructura as $est) {
                                    if ($est->idestructura == $datosCliente[0]['id']) {
                                        $prod['cliente'] = $est->denominacion;
                                    }
                                }
                            }
                        }
                    } else if ($datosCliente[0]['tipocliente'] == 4) {
                        $datosDeposito = $this->estructuraHelper->getEstructura($prod['idestructura']);
                        if ($datosDeposito[0]) {
                            $prod['deposito'] = ($datosDeposito[0]->codigo) ?
                                $datosDeposito[0]->codigo . ' - ' . $datosDeposito[0]->denominacion : $datosDeposito[0]->denominacion;
                        }
                        $datosCliente = $objDistibucion->getClientesDocumento($datosDoc);
                        if ($datosCliente[0]['idcliente']) {
                            $areasResp = $this->estructuraHelper->getEstructura($datosCliente[0]['idcliente']);
                            $prod['cliente'] = $areasResp[0]->denominacion;
                        }
                    }

                    if ($prod['idpais']) {
                        if (!$paisArray[$prod['idpais']]) {
                            $paisArray[$prod['idpais']] = $this->configuracionHelper->obtenerPaisXID($prod['idpais']);
                        }
                        $prod['nacionalidad'] = $paisArray[$prod['idpais']]['siglas'];
                    }

                    if ($datosDoc['isreserva'] == 1) {
                        $datosReserva = $this->_comunReserva->devolverDatosDepositario(
                            $datosDoc['iddocumento'], $prod['idcliente'], $prod['idproducto'], false
                        );
                        $prod['distribuida'] = $datosReserva[0]['distribuido'];
                        $prod['pedida'] = $datosReserva[0]['cantidad'];
                    } elseif ($datosDoc['pedido'] == 1) {
                        $objDistibucionPedido = new DatDistribucionpedido();
                        $arrayPedido = $objDistibucionPedido->getPedidoByIdDocumento(
                            array(
                                'idproducto' => $prod['idindicador'],
                                'iddocumento' => $prod['DatDistribucion']['iddistribucion']
                            )
                        );
                        foreach ($arrayPedido as $objPedido) {
                            if ($prod['idcliente'] == $objPedido['idcliente'] &&
                                $prod['idindicador'] == $objPedido['idindicador']
                            ) {
                                $prod['cliente'] = '' . $prod['cliente'] . ' - Nro de Pedido: '
                                    . $objPedido['nropedido'];
                                $prod['distribuida'] = $objPedido['distribuida'];
                                $prod['pedida'] = $objPedido['pedida'];
                                $prod['idpedido'] = $objPedido['iddocumento'];
                            }
                        }
                        if (!$prod['pedida'] && !$prod['idprodorigen']) {
                            $productosSinPedido[] = $prod['idprodorden'];
                        }
                    } elseif ($datosDoc['isbalanceo'] == 1) {
                        $idbalanceo = $this->getIdDocumentosPadre($datosDoc['iddocumento']);
                        if (count($idbalanceo) > 0) {
                            $params['iddocumento'] = $idbalanceo[0];
                            $params['idindicador'] = $prod['idindicador'];
                            $arrayPedido = $this->getTotalPedidoBalanceo($params);
                            $prod['pedida'] = $arrayPedido[0]['totalpedidos'];
                        }

                    } else {
                        $importetotal += $prod['cantidad'] * $prod['preciocontable'];
                        $importetotalcuc += $prod['cantidad'] * $prod['precioalternativo'];
                        if ($cantproductos < $cantclientes) {
                            $prod['coddenominacion'] = ($prod['codigo']) ? $prod['codigo'] . ' - '
                                . $prod['denominacion'] . ' - '
                                . $prod['nacionalidad'] : $prod['text'];
                        } else {
                            $prod['coddenominacion'] = $prod['denominacion'];
                        }
                    }
                }
            }
        }
        return array(
            'cantidad' => $query->count(), 'datos' => $datos, 'cantcumpltotal' => $cont,
            'cantcumplparc' => $contAux,
            'porcientocumplimiento' => $entregado * 100 / $cantidad,
            'importetotal' => $importetotal,
            'importetotalcuc' => $importetotalcuc,
            'cant_clientes' => $this->getCantidadClienteDocumento($datosDoc['iddocumento']),
            'cant_productos' => $this->_datProdOrden->getCantidadProductoDocumento($datosDoc)[0]['cantidad']
        );
    }

    public function getOrdenByConfig(&$query)
    {
        //Configuracion inventario para el orden de los productos
        $config = new ConfiguracioninventarioService();
        $result = $config->devolverConfiguracion($this->idestructuracomun);
        switch ($result['ordenproducto']) {
            case 1:
                $query = $query->orderBy("i.codigo",'ASC');
                return $query;
            case 2:
                $query = $query->orderBy("i.denominacion",'ASC');
                return $query;
            case 3:
                $query = $query->orderBy("dpo.idprodorden",'ASC');
                return $query;
            case 4:
                $query = $query->orderBy("i.numeropieza",'ASC');
                return $query;
            case 5:
                $query = $query->orderBy("i.idnaturaleza",'ASC');
                return $query;
            default:
                $query = $query->orderBy("i.numeropieza",'ASC');
                return $query;
        }
    }

    /**
     * Método para devolver los indicadores de un pedido
     *
     * @params array $params Arreglo con los parametros para filtrar los documentos
     *
     * @return array
     */
    public function devolverIndicadoresPedido($params)
    {
        $objDistibucionPedido = new DatDistribucionpedido();
        $pedidos = $objDistibucionPedido->devolverPedidosDistribucion($params['iddocumento']);
        $idindicadorPedido = array();
        foreach ($pedidos as $objPedido) {
            $temp = $objDistibucionPedido->devolverIdindicadorPedido($objPedido['idpedido']);
            foreach ($temp as $prodPedido) {
                $idindicadorPedido[] = $prodPedido['idindicadorpedido'];
            }
        }
        return $idindicadorPedido;
    }

    public function devolverMovimientosParaFact($datosDoc) //Esto es una prueba
    {
        $array[] = array('cardinalidad' => 'many', 'relation' => 'DatProdorden',
            'properties' => array('local' => 'idproducto', 'foreign' => 'idproducto'));
        $this->logisticaDoctrine->tryInyectRelactions(
            new DatProductoLogistica(), $array
        );
        $query = new Doctrine_Query();
        $datosMaestros = new MaestroProductoModel();
        $query->addSelect("p.idproducto");
        if (!isset($datosDoc['reserva']) || $datosDoc['reserva'] != 1) {
            $query->addWhere(
                "p.idestructuracomun = ?",
                array($this->idestructuracomun)
            );
        }
        $query->addWhere(
            "p.idestructura = ?",
            array($datosDoc['iddeposito'])
        );
        if ($datosDoc['idcliente']) {
            $query->addWhere("dpo.idcliente = ?", array($datosDoc['idcliente']));
        }
        $query->andWhereIn("dpo.idorden", $datosDoc['iddocumento']);
        $query->from("DatProductoLogistica p")
            ->innerJoin("p.DatProdorden dpo");
        $datosMaestros->addQueryNomIndicador($query, 'p', 'i', 'ih');
        $datos = $query->orderBy('dpo.idprodorden')->fetchArray();
        return array('datos' => $datos);
    }

    /**
     * Método para devolver los productos de un pedido a distribuir
     *
     * @params array $datosDoc Arreglo con los parametros para filtrar los documentos
     *
     * @return array
     */
    public function devolverProductosDistribuir($datosDoc)
    {
        $configuracionHelper = ServiciosConfiguracionGeneralHelper::__init();
        $objDistibucionPedido = new DatDistribucionpedido();
        $arrayPedido = $objDistibucionPedido->getPedidoByIdDocumento($datosDoc);
        $pos = 0;
        foreach ($arrayPedido as $objPedido) {
            $cliente = $configuracionHelper->getClientesProveedorByParams(
                $objPedido['idcliente'], $this->global->Estructura->idestructura, true, true, false, false, false, false
            );
            $arrayPedido[$pos]['cliente'] = $cliente['datos'][0]['nombre'];
            $pos++;
        }

        return array('cantidad' => count($arrayPedido), 'datos' => $arrayPedido);
    }

    /**
     * Método para devolver los productos distribuidos de un pedido
     *
     * @params array $datosDoc Arreglo con los parametros para filtrar los documentos
     *
     * @return array
     */
    public function devolverProductosDistribuidos($datosDoc)
    {
        $objProdOrden = new DatProdorden();
        $query = $objProdOrden->getDatosProductosDistribuidos($datosDoc, 'dpo', 'p');
        $datosMaestros = new MaestroProductoModel();
        $datosMaestros->addQueryNomIndicador($query, 'p', 'i', 'ih');
        $this->configuracionHelper->getQueryJoinUnidadMedida(
            $query, 'p', 'um', 'um.abreviaturaunidadmedida as umedida', 'leftJoin'
        );
        $datosDoc = $this->logisticaDoctrine->addQueryLimits($query, $datosDoc)
            ->fetchArray();
        if (count($datosDoc) > 0) {
            $objDistibucionPedido = new DatDistribucionpedido();
            $arrayPedido = $objDistibucionPedido->getPedidoByIdDocumento($datosDoc);
            $servicePedido = new PedidoService();
            $datosPedido = $servicePedido->CargarDocPedido($arrayPedido[0]);
            $datosDoc[0]['cliente'] = $datosPedido['datos'][0]['cliente'];
            $datosDoc[0]['distribuida'] = $datosPedido['datos'][0]['distribuir'] < $datosPedido['datos'][0]['cantidad']
                ? ($datosPedido['datos'][0]['cantidad'] - $datosPedido['datos'][0]['distribuir']) : 0;
            $datosDoc[0]['pedida'] = $datosPedido['datos'][0]['cantidad'];
            if ($datosPedido['datos'][0]['estadopedido'] == 3) {
                $datosDoc[0]['distribuida'] = $datosPedido['datos'][0]['cantidad'];
            }
        }
        return array('cantidad' => $query->count(), 'datos' => $datosDoc);
    }

    /**
     * Método para devolver los productos distribuidos de un pedido
     *
     * @params array $datosDoc Arreglo con los parametros para filtrar los documentos
     *
     * @return array
     */
    public function devolverProductosEstadoEjecucion($datosDoc)
    {
        $objProdOrden = new DatProdorden();
        $query = $objProdOrden->getDatosProductosEstadoEjecucion($datosDoc, 'dpo', 'p', 'cmpto');
        $datosMaestros = new MaestroProductoModel();
        $datosMaestros->addQueryNomIndicador($query, 'p', 'i', 'ih');
        $datos = $this->logisticaDoctrine->addQueryLimits($query, $datosDoc)
            ->fetchArray();
        foreach ($datos as $index => $data) {
            $clientes = $this->configuracionHelper->getClientesProveedorByParams(
                $data['idcliente'], $this->global->Estructura->idestructura, true, false, false, null, null, null
            )['datos'];
            $datos[$index]['cliente'] = $clientes[0]['nombre'];
        }
        return array('cantidad' => $query->count(), 'datos' => $datos);
    }

    /**
     * Método para devolver los documentos generados por una distribución
     *
     * @params array $datosDoc Arreglo con los parametros para filtrar los documentos
     *
     * @return array
     */
    public function devolverDocumentosGenerados($datosDoc)
    {
        $query = new Doctrine_Query();
        $distribucion = new DatDistribucion();
        $distribucion->getDatosDistribucion($datosDoc, $query);
        if (!is_numeric($datosDoc['criterio'])) {
            $cliente = $datosDoc['criterio'];
        }
        $docGen = $this->logisticaDoctrine->addQueryLimits($query, $datosDoc)->fetchArray();
        return array('cantidad' => $query->count(), 'datos' => $this->cargarClientesDocumentos(
            $docGen, $cliente
        ));
    }

    /**
     * Método para adicionar los padres del documento de distirbucion
     *
     * @params Integer $iddocumento Identificador del documento de distribucion
     * @params array $padres Arreglo con los id de los documentos padres
     *
     * @return void
     */
    private function adicionarDocumentoPadre($iddocumento, $padres)
    {
        $collDocumentoPadre = new Doctrine_Collection('DatDocumentoPadre');
        $documentoPadre = new DatDocumentoPadre();
        foreach ($padres as $key => $idpadre) {
            if (!$documentoPadre->verificarRelacionPadreHijo($iddocumento, $idpadre)) {
                $documentopadre = new DatDocumentoPadre();
                $documentopadre->idpadre = $idpadre;
                $documentopadre->iddocumento = $iddocumento;
                $collDocumentoPadre->add($documentopadre);
            }
        }
        $collDocumentoPadre->save();
    }

    /**
     * Método para adicionar un documento de distribucion
     *
     * @params array $datosDoc Arreglo con los parametros para adicionar un documento
     *
     * @return Integer
     */
    public function adicionarDocumento($datosDoc)
    {
        $documento = parent::adicionarDocumento($datosDoc);
        $distribucion = new DatDistribucion();
        if ($datosDoc['iddocumento']) {
            $distribucion->assignIdentifier($datosDoc['iddocumento']);
        }
        $datosDoc['idestructuraop'] = ($datosDoc['idestructuracomun']) ? $datosDoc['idestructuracomun'] : $this->global->Estructura->idestructura;
        $datosDoc['tipodestino'] = ($datosDoc['tipodistribucion'] == 2 || $datosDoc['tipodistribucion'] == 1 ||
            $datosDoc['tipodistribucion'] == 4) ? 1 : $datosDoc['tipodestino'];
        $datosDoc['idnomconcepto'] = $datosDoc['idnomconcepto'] ? $datosDoc['idnomconcepto'] : null;
        $datosDoc['salidaporfactura'] = ($datosDoc['tipodistribucion'] == 4 || $datosDoc['salidaporfactura'] == 1) ? 1 : 0;
        $distribucion->synchronizeWithArray($datosDoc);
        $documento->DatDistribucion = $distribucion;
        $documento->save();
        if ($datosDoc['documentos']) {
            $this->adicionarDocumentoPadre($documento->iddocumento, $datosDoc['documentos']);
        }
        if ($datosDoc['tipodistribucion'] == 4 && $datosDoc['tipo'] != 5) {
            $addDestino = $this->adicionarProductosDocReserva($documento->iddocumento, $datosDoc);
        } else if ($datosDoc['tipodistribucion'] == 2) {
            $addDestino = $this->adicionarDistribucionPedido($documento->iddocumento, $datosDoc);
        } else {
            $addDestino = $this->adicionarClientesDocumento($documento->iddocumento, $datosDoc);
        }
        return array('iddocumento' => $documento->iddocumento, 'nro' => $documento->nrodoc,
            'fecha' => $documento->fechacontable, 'numeroref' => $documento->numeroref,
            'tipodestino' => $documento->DatDistribucion->tipodestino,
            'tipodistribucion' => $documento->DatDistribucion->tipodistribucion,
            'destino' => $addDestino,
            'cantclientes' => $this->getCantidadClienteDocumento($documento->iddocumento));
    }

    /**
     * Método para adicionar los clientes (cliente, centros de costo, deposito, pedido) a una distribucion
     *
     * @params Integer $iddocumento Identificador de documento
     * @params array $datosDoc Arreglo con los parametros para adicionar un documento
     *
     * @return Integer
     */
    public function adicionarClientesDocumento($iddocumento, $datosDoc)
    {
        $flagPedido = 0;
        if (is_array($datosDoc['idcliente']) && count($datosDoc['idcliente']) > 0) {
            $flagPedido = 1;
            $datosDoc['iddocumento'] = $iddocumento;
            if ($datosDoc['distribucion'] == 2) {
                $datosDoc['idestructuraop'] = $this->global->Estructura->idestructura;
                foreach ($datosDoc['idcliente'] as $cliente) {
                    $datosPedido = array();
                    $pedidos = $this->_objPedido->cargarDocPedido($cliente);
                    foreach ($pedidos['datos'] as $index => $ped) {
                        $datosPedido[$index] = array(
                            'idpedido' => $ped['iddocumento'], 'idcliente' => $ped['idcliente']
                        );
                    }
                    $datosDoc['idpedido'] = $datosPedido;
                    $flagPedido = $this->adicionarDistribucionPedido($iddocumento, $datosDoc);
                }
            } else {
                $this->adicionarClientes($iddocumento, $datosDoc['idcliente']);
                if ($datosDoc['addproductos'] == 1) {
                    $datProdOrden = new DatProdorden();
                    $result = $datProdOrden->getProductosByIddoc($iddocumento);
                    $datosDoc['iddocumento'] = $iddocumento;
                    foreach ($result as $index => $r) {
                        $datosDoc['idproductos'][$index] = array(
                            'idproducto' => $r['idproducto']
                        );
                    }
                    return $this->adicionarProductosClientes($datosDoc);
                }
            }
        }
        //return array('success' => ($flagPedido == 1) ? true : false);
        return array(
            'success' => ($flagPedido == 1) ? true : false,
            'cantclientes' => $this->getCantidadClienteDocumento($iddocumento),
            'cantproductos' => $this->_datProdOrden->getCantidadProductoDocumento($datosDoc)[0]['cantidad']
        );
    }

    /**
     * Método para adicionar el pedido a la distribucion
     *
     * @params Integer $iddocumento Identificador de documento
     * @params array $datosDoc Arreglo con los parametros para adicionar el pedido a la distribucion
     *
     * @return Boolean
     */
    public function adicionarDistribucionPedido($iddocumento, $datosDoc)
    {
        $flag = 0;
        $collPedidos = new Doctrine_Collection('DatDistribucionpedido');
        $arregloClientes = array();
        if (is_array($datosDoc['idpedido']) && count($datosDoc['idpedido']) > 0) {
            foreach ($datosDoc['idpedido'] as $i => $datos) {
                $distribucionPedido = new DatDistribucionpedido();
                if (!$distribucionPedido->existeDistribucionPedido($iddocumento, $datos['idpedido'])) {
                    $distribucionPedido->synchronizeWithArray(
                        array('iddistribucion' => $iddocumento, 'idpedido' => $datos['idpedido'])
                    );
                    $productos = $this->getProductosPedido(
                        $iddocumento, $datos['idpedido'], $datosDoc['idcliente'][$i], $datosDoc['idestructuraop']
                    );
                    if ($productos != 3) {
                        array_push($arregloClientes, $datosDoc['idcliente'][$i]);
                        $collPedidos->add($distribucionPedido);
                    }
                    if ($productos > $flag) {
                        $flag = $productos;
                    }
                }
            }
        }

        if ($collPedidos->count() > 0) {
            $collPedidos->save();
            if (count($arregloClientes) > 0) {
                $this->adicionarClientes($iddocumento, $arregloClientes);
            }
        }
        if ($flag == 3) {
            throw new ZendExt_Exception('LOG_LB_DIST_002');
        }
        return $flag;
    }

    /**
     * Método para obtener los productos del pedido
     *
     * @params Integer $iddocumento Identificador de documento
     * @params array $datos Arreglo con los pedidos de la distribucion
     *
     * @return void
     */
    public function getProductosPedido($iddocumento, $idpedido, $datosCliente)
    {
        $arrayProductos = array();
        $pedido = new PedidoService();
        $datosDocPedido = $pedido->CargarProductosXPedido($idpedido);
        foreach ($datosDocPedido['datos'] as $datos) {
            $params = array(
                'idindicador' => $datos['idindicador'],
                'idestructura' => $this->getDepositosEntidad($identidad = null)['datos'],
                'condisponible' => true
            );
            //Comprobar si existe al menos un producto en ese almacen, de existir adicionarlo
            $datosProd = $this->_objProd->cargarProductos($params);
            if ($datosProd['cantidad'] > 0) {
                $idMayor = $datosProd['datos'][0]['idproducto'];
                $disponibleMayor = $datosProd['datos'][0]['disponible'];
                foreach ($datosProd['datos'] as $producto) {
                    if ($producto['disponible'] > $disponibleMayor && $producto['disponible'] > 0) {
                        $disponibleMayor = $producto['disponible'];
                        $idMayor = $producto['idproducto'];
                    }
                }
                $arrayProd = array('idproducto' => $idMayor);
                if ($datos['cantidad'] > $datos['distribuido']) {
                    array_push($arrayProductos, $arrayProd);
                }
            }
        }
        if (count($arrayProductos) > 0) {
            $this->adicionarProdOrdenPedido($iddocumento, $arrayProductos, $datosCliente['idcliente']);
            if (count($arrayProductos) < count($datosDocPedido['datos'])) {
                return 2;
                //  Existen productos del pedido que no se encuentran en el almacén
            } else {
                return 1;
                // Todo esta bien
            }
        } else {
            return 3;
            // Ningun producto se adiciona
        }
    }

    /**
     * Método para comprobar la existencia material de un producto
     *
     * @params array $parametros Arreglo con los datos del producto
     *
     * @return array
     */
    public function comprobarExistenciaMaterial($parametros)
    {
        $serviciosEstructuraComp = ServiciosEstructuraComposicionHelper::__init();
        $structuras = $serviciosEstructuraComp->obtenerEstructurasNoFormales();
        $idsEstructuras = array();
        foreach ($structuras as $struct) {
            $idsEstructuras[] = $struct['id'];
        }
        $aux = implode(',', $idsEstructuras);
        $conn = Zend_Registry::get('conexion');
        $pos = 0;
        foreach ($parametros as $obj) {
            $sql = "select p.idindicador,sum(p.cantidad) as cantidad
                from mod_logistica.dat_producto p
                where p.idestructura IN($aux) and p.idindicador = {$obj['idproducto']}
                group by p.idindicador";
            $instancia = $conn->fetchAll($sql);
            if ($instancia[0]['cantidad'] > 0) {
                $parametros[$pos]['existe'] = true;
            } else {
                $parametros[$pos]['existe'] = false;
            }
            $pos++;
        }
        return $parametros;
    }

    /**
     * Método para cargar el arbol de clientes
     *
     * @params array $datosDoc Arreglo con los datos del documento
     *
     * @return array
     */
    public function cargarClientes($datosDoc)
    {
        $objDistibucion = new DatDistribucion();
        $datosCliente = $objDistibucion->getClientesDocumento($datosDoc);
        $this->cargarClientesDocumentos($datosCliente);
        if (count($datosCliente) > 0) {
            foreach ($datosCliente as &$data) {
                $data['text'] = $data['cliente'];
            }
        }
        return $datosCliente;
    }

    /**
     * Método para adicionar los productos (cliente, centros de costo, deposito, pedido) a una distribucion
     *
     * @params Integer $iddocumento Identificador de documento
     * @params array $datosDoc Arreglo con los parametros para adicionar un documento
     *
     * @return Integer
     */
    public function adicionarMovimientos($datosProd)
    {
        $arrayClientes = array();
        if ($datosProd['iddocumento']) {
            $arrayClientes = Doctrine_Query::create()
                ->select('ddc.iddocumentocliente, ddc.idcliente as idcliente')
                ->from('DatDocumentoCliente ddc')
                ->where('ddc.iddocumento = ? ', $datosProd['iddocumento'])
                ->fetchArray();
        }
        $collProdOrden = new Doctrine_Collection('DatProdorden');
        $comprometida = new CantidadesComprometidasModel();
        $cont = 0;
        foreach ($datosProd['idproductos'] as $i => $producto) {
            LogisticaObjectHelper::__init()->unsetNullValues($producto);
            foreach ($arrayClientes as $index => $cliente) {
                $datProdOrden = new DatProdorden();
                if (!$datProdOrden->existeProdOrden($datosProd['iddocumento'], $producto['idproducto'])) {
                    $cantidad = $producto['cantidad'] ? $producto['cantidad'] : 0;
                    $dql = "SELECT ((p.cantidad - coalesce((SELECT sum(cc.cantidad) FROM DatCantidadesComprometidas cc "
                        . "WHERE cc.idproducto = {$producto['idproducto']} AND cc.estado = 1), 0))) as saldo "
                        . "FROM DatProductoLogistica p "
                        . "WHERE p.idproducto = {$producto['idproducto']}";
                    $disponible = $this->doctrineHelper->query($dql)->toArray();
                    if ($disponible[0]['saldo'] > 0) {
                        $oProdOrden = new DatProdorden();
                        $oProdOrden->idproducto = $producto['idproducto'];
                        $oProdOrden->idcliente = $cliente['idcliente'];
                        $oProdOrden->idorden = $datosProd['iddocumento'];
                        $oProdOrdenCmpto = new DatProdordencmpto();
                        if ($producto['recepcion']) {
                            $this->addPadre($producto['idrecepcion'], $datosProd['iddocumento']);
                            if ($producto['cantidad'] > count($arrayClientes)) {
                                if (($producto['cantidad'] % count($arrayClientes) != 0) && ($cont < (float)$producto['cantidad'] % count($arrayClientes))) {
                                    $cantidad = floor((($disponible[0]['saldo'] >= $producto['cantidad']) ? $producto['cantidad'] : $disponible[0]['saldo']) / count($arrayClientes)) + 1;
                                    $cont++;
                                } else {
                                    $cantidad = floor((($disponible[0]['saldo'] >= $producto['cantidad']) ? $producto['cantidad'] : $disponible[0]['saldo']) / count($arrayClientes));
                                }
                            } else {
                                if ($cont < $producto['cantidad']) {
                                    $cantidad = 1;
                                    $cont++;
                                } else {
                                    $cantidad = 0;
                                }
                            }
                            $oProdOrden->cantidad = $cantidad;
                            $this->producto->checkDisponibleProducto(
                                $producto['idproducto'], 0 - $oProdOrden->cantidad, true
                            );
                        } else {

                            try {
                                $this->producto->checkDisponibleProducto(
                                    $producto['idproducto'], 0 - $oProdOrden->cantidad, true
                                );
                                $oProdOrden->cantidad = ($producto['rotar']) ? $producto['cantidad'] : 0;
                                $oProdOrdenCmpto->cantidadoriginal = ($producto['rotar']) ? $producto['cantidad'] : 0;
                            } catch (Exception $e) {
                                $oProdOrden->cantidad = 0;
                            }
                        }
                        $oProdOrdenCmpto->entregado = 0;
                        $oProdOrdenCmpto->enproceso = 0;
                        $oProdOrdenCmpto->pendiente = ($producto['rotar']) ? $producto['cantidad'] : 0;
                        $oProdOrdenCmpto->idprodorden = $oProdOrden->idprodorden;
                        $oProdOrden->DatProdordencmpto = $oProdOrdenCmpto;
                        $collProdOrden->add($oProdOrden);
                        $array = $oProdOrden->toArray();
                        $array['iddocumento'] = $array['idorden'];
                        if ($array['cantidad'] == '') {
                            unset($array['cantidad']);
                        }
                        LogisticaObjectHelper::__init()->unsetNullValues($array);
                        $comprometida->insertarCantidadComprometida($array);
                    }
                }
            }
        }
        if ($collProdOrden->count() > 0) {
            $collProdOrden->save();
        }

        return array('success' => ($collProdOrden->count() > 0) ? true : false,
            'productos' => $collProdOrden->toArray(),
            'cant_clientes' => $this->getCantidadClienteDocumento($datosProd['iddocumento']),
            'cant_productos' => $this->_datProdOrden->getCantidadProductoDocumento($datosProd)[0]['cantidad']
        );
    }

    public function addPadre($idpadre, $iddocumento){
        $existe = Doctrine::getTable('DatDocumentoPadre')->findByDql('idpadre = ? and iddocumento = ?', array($idpadre, $iddocumento));
        if (count($existe) == 0){
            $obDocPadre = new DatDocumentoPadre();
            $obDocPadre->idpadre = $idpadre;
            $obDocPadre->iddocumento = $iddocumento;;
            $obDocPadre->save();
        }
    }
    /**
     * Método para adicionar los productos de forma equitativa a los clientes de la distribucion
     *
     * @params array $datosProd Arreglo con los parametros para adicionar un producto
     *
     * @return Integer
     */
    public function adicionarProductosClientes($datosProd)
    {
        $collProdOrden = new Doctrine_Collection('DatProdorden');
        $comprometida = new CantidadesComprometidasModel();
        foreach ($datosProd['idproductos'] as $producto) {
            foreach ($datosProd['idcliente'] as $cliente) {
                $oProdOrden = new DatProdorden();
                $oProdOrden->idproducto = $producto['idproducto'];
                $oProdOrden->idcliente = $cliente['idcliente'];
                $oProdOrden->idorden = $datosProd['iddocumento'];
                $oProdOrden->cantidad = $producto['cantidad'] ? $producto['cantidad'] : 0;
                $oProdOrdenCmpto = new DatProdordencmpto();
                $oProdOrdenCmpto->entregado = 0;
                $oProdOrdenCmpto->enproceso = 0;
                $oProdOrdenCmpto->pendiente = 0;
                $oProdOrdenCmpto->idprodorden = $oProdOrden->idprodorden;
                $oProdOrden->DatProdordencmpto = $oProdOrdenCmpto;
                $collProdOrden->add($oProdOrden);
                $array = $oProdOrden->toArray();
                $array['iddocumento'] = $array['idorden'];
                $comprometida->insertarCantidadComprometida($array);
            }
        }
        if ($collProdOrden->count() > 0) {
            $collProdOrden->save();
        }

        return array('success' => true,
            'cant_clientes' => $this->getCantidadClienteDocumento($datosProd['iddocumento']),
            'cant_productos' => $this->_datProdOrden->getCantidadProductoDocumento($datosProd)[0]['cantidad']
        );
    }

    /**
     * Método para adicionar los productos alternativos a una distribucion
     *
     * @params array $datosProd Arreglo con los parametros para adicionar un producto
     *
     * @return Boolean
     */
    public function adicionarProdAlternativos($datosProd)
    {
        $collProdOrden = new Doctrine_Collection('DatProdorden');
        foreach ($datosProd['idproductos'] as $producto) {
            $oProdOrden = new DatProdorden();
            $oProdOrden->idproducto = $producto['idproducto'];
            $oProdOrden->idcliente = $producto['idcliente'];
            $oProdOrden->idorden = $datosProd['iddocumento'];
            $oProdOrden->idprodorigen = $producto['idprodorigen'];
            $oProdOrden->cantidad = 0;
            $oProdOrdenCmpto = new DatProdordencmpto();
            $oProdOrdenCmpto->entregado = 0;
            $oProdOrdenCmpto->enproceso = 0;
            $oProdOrdenCmpto->pendiente = 0;
            $oProdOrdenCmpto->idprodorden = $oProdOrden->idprodorden;
            $oProdOrden->DatProdordencmpto = $oProdOrdenCmpto;
            $collProdOrden->add($oProdOrden);
        }
        if ($collProdOrden->count() > 0) {
            try {
                $collProdOrden->save();
            } catch (Exception $e) {
                print_r($e);
            }
            return true;
        }
        return false;
    }

    public function adicionarProdOrdenPedido($iddocumento, $arrayProductos, $arrayClientes)
    {
        $collProdOrden = new Doctrine_Collection('DatProdorden');
        foreach ($arrayProductos as $producto) {
            $oProdOrden = new DatProdorden();
            $oProdOrden->idproducto = $producto['idproducto'];
            $oProdOrden->idcliente = $arrayClientes;
            $oProdOrden->idorden = $iddocumento;
            $oProdOrden->cantidad = ($producto['cantidad']) ? $producto['cantidad'] : 0;
            $oProdOrdenCmpto = new DatProdordencmpto();
            $oProdOrdenCmpto->entregado = 0;
            $oProdOrdenCmpto->enproceso = 0;
            $oProdOrdenCmpto->pendiente = $oProdOrden->cantidad;
            $oProdOrdenCmpto->idprodorden = $oProdOrden->idprodorden;
            $oProdOrden->DatProdordencmpto = $oProdOrdenCmpto;
            $collProdOrden->add($oProdOrden);
        }
        if ($collProdOrden->count()) {
            $collProdOrden->save();
            return true;
        }
        return false;
    }


    /**
     * Método para actualizar el disponible y eliminar la distribucion
     *
     * @param mixed $iddocumento Identificador de documento
     *
     * @return Integer
     */
    public function eliminarDocumento($iddocumento)
    {
        if ($this->_comunReserva) {
            $this->_comunReserva->actualizarDatosCumplimiento(array('iddocumento' => $iddocumento), 1);
        }
        $this->eliminarProductosOrden($iddocumento);
        return parent::eliminarDocumento($iddocumento);
    }

    /**
     * Método para eliminar los clientes de la distribucion
     *
     * @param type $parametros
     *
     * @return boolean
     */
    public function eliminarDestinos($parametros)
    {
        if ($parametros['iddocclientes']['iddocumentoclientes']) {
            Doctrine_Query::create()
                ->delete('DatDocumentoCliente')
                ->whereIn("iddocumentocliente", $parametros['iddocclientes']['iddocumentoclientes'])
                ->execute();
        }
        if ($parametros['iddocclientes']['idclientes']) {
            Doctrine_Query::create()
                ->delete('DatProdorden')
                ->where('idorden = ?', $parametros['iddocumento'])
                ->whereIn('idcliente', $parametros['iddocclientes']['idclientes'])
                ->execute();
            Doctrine_Query::create()
                ->delete('DatDocumentoCliente')
                ->where('iddocumento = ?', $parametros['iddocumento'])
                ->whereIn('idcliente', $parametros['iddocclientes']['idclientes'])
                ->execute();
            $idclientes = $parametros['iddocclientes']['idclientes'];
            $comprometida = new CantidadesComprometidasModel();
            $comprometida->eliminarCantidadComprometida($parametros['iddocumento'], null, $idclientes);
        }
        if ($parametros['iddocclientes']['idpedido']) {
            Doctrine_Query::create()
                ->delete('DatDistribucionpedido')
                ->where('iddistribucion = ?', $parametros['iddocumento'])
                ->whereIn('idpedido', $parametros['iddocclientes']['idpedido'])
                ->execute();
        }
        return array('success' => true);
    }

    /**
     * Método para eliminar los productos de la distribucion
     *
     * @param type $parametros
     *
     * @return boolean
     */
    public function eliminarProductos($parametros)
    {
        if (count($parametros['idmovimientos']) == 0) {
            return false;
        }
        $iddocumento = $parametros['iddocumento'];
        //unset($parametros['iddocumento']);
        if ($parametros['idmovimientos']) {
            $res['idmovimientos'] = implode($parametros['idmovimientos'], ',');
            $prod = Doctrine::getTable('DatProdorden')->findByDql("idprodorden IN ({$res['idmovimientos']})")->toArray();
            $idproductos = $this->objectHelper->extractValueFromArrayColumn($prod, 'idproducto');
            $idclientes = $this->objectHelper->extractValueFromArrayColumn($prod, 'idcliente');
        }
        if ($parametros['idclientes']) {
            $idclientes = $parametros['idclientes'];
        }
        $comprometida = new CantidadesComprometidasModel();
        $comprometida->eliminarCantidadComprometida($iddocumento, $idproductos, $idclientes);
        Doctrine_Query::create()
            ->delete('DatProdorden')
            ->whereIn('idprodorden', $parametros['idmovimientos'])
            ->execute();

        return array(
            'success' => true,
            'cant_clientes' => $this->getCantidadClienteDocumento($iddocumento),
            'cant_productos' => $this->_datProdOrden->getCantidadProductoDocumento($parametros)[0]['cantidad']
        );
    }

    /**
     * Metodo para confirmar la distribucion
     *
     * @param mixed $iddocumento Identificador de documento
     *
     * @return Integer
     */
    public function confirmarDocumento($iddocumento, $parametros)
    {
        $noconfirmados = array();
        $datosBusqueda = $this->verificarDatosProducto($iddocumento, $parametros);

        if ($datosBusqueda != -1) {
            $noconfirmados[] = $datosBusqueda;
        }

        if (count($noconfirmados[0]) == 0) {
            parent::confirmarDocumento($iddocumento);
        }
        return array('noconfirmados' => (count($noconfirmados) == 0 ? true : $noconfirmados),
            'success' => (count($noconfirmados) == 0 ? true : false));
    }

    /**
     * Metodo para anular el estado de la distribucion
     *
     * @param mixed $iddocumento Identificador de documento
     *
     * @return Integer
     */
    public function anularEstadoDocumento($iddocumento)
    {
        return parent::anularEstadoDocumento($iddocumento);
    }

    /**
     * Metodo para aprobar la distribucion
     *
     * @param mixed $iddocumento Identificador de documento
     *
     * @return Integer
     */
    public function aprobarDocumento($parametros)
    {
        $iddocumento = $parametros['iddocumento'];
        $doc = Doctrine_Query::create()->select('sum(po.cantidad) AS cantidad, sum(poc.enproceso) AS enproceso,
   		     sum(poc.entregado) AS entregado, sum(po.cancelar) AS cancelado')
            ->from('DatProdordencmpto poc')->innerJoin('poc.DatProdorden po')->innerJoin('po.DatDocumento d')
            ->where(
                'po.idorden = ? AND d.estado = ?', array(
                    $iddocumento, EstadoDocumentoModel::ESTADO_PROPUESTO_CANCELAR
                )
            )->groupBy('poc.idprodorden')
            ->fetchArray();
        $objcantComprometida = new CantidadesComprometidasModel();
        $objprodOrden = new DatProdordenModel();
        if ($doc && $doc[0]['cantidad'] == $doc[0]['cancelado'] && $doc[0]['enproceso'] == 0 && $doc[0]['entregado'] == 0) {
            //return array('success' => $this->eliminarDocumento($iddocumento), 'eliminado' => true);

            $objProdOrden = Doctrine::getTable('DatProdorden')
                ->findByDql('idorden = ?', array($iddocumento))->toArray();

            foreach ($objProdOrden as $objprod) {
                $objcantComprometida->eliminarCantidadComprometida(array($iddocumento), $objprod['idproducto'], $objprod['idcliente']);
            }
            /*$this->eliminarProductosOrden($iddocumento);
            Doctrine_Query::create()->delete('DatDocumento')->where('iddocumento = ?', array($iddocumento))->execute();
            Doctrine_Query::create()->delete()->from('DatDocumentoPadre')->where('iddocumento = ?', $iddocumento)->execute();

            return array('success' => true, 'eliminado' => true);*/
        }
        $objDistribucion = Doctrine::getTable('DatDistribucion')->find($iddocumento);
        $tipodistribucion = $objDistribucion->tipodistribucion;
        $objProdOrden = Doctrine::getTable('DatProdorden')->findByDql('idorden = ?', array($iddocumento));
        $collProdOrdenCmpto = new Doctrine_Collection('DatProdordencmpto');
        foreach ($objProdOrden as $prod) {
            //$prod->cancelar = 0;
            $objDatCantComp = Doctrine::getTable('DatCantidadesComprometidas')->findByDql(
                'iddocumento = ? and idproducto = ? and idcliente = ?', array($iddocumento, $prod->idproducto, $prod->idcliente)
            )->getFirst();
            $arrayProd['cantidad'] = (float)$objDatCantComp->cantidad - (float)$prod->cancelar;
            $objProdOrdenCmpto = new DatProdordencmpto();
            $objProdOrdenCmpto->assignIdentifier($prod->idprodorden);
            $objProdOrdenCmpto->pendiente = $prod->cantidad;
            $objProdOrdenCmpto->cantidadoriginal = $prod->cantidad;
            $collProdOrdenCmpto->add($objProdOrdenCmpto);
            $arrayProd['iddocumento'] = $prod->idorden;
            $arrayProd['idproducto'] = $prod->idproducto;
            $arrayProd['idcliente'] = $prod->idcliente;

            if ($arrayProd['cantidad'] == 0) {
                $objcantComprometida->eliminarCantidadComprometida(array($iddocumento), $arrayProd['idproducto'], $arrayProd['idcliente']);
                $this->eliminarProductosClientesOrden(array($iddocumento), $arrayProd['idproducto'], $arrayProd['idcliente']);
                if ($this->getTotalProductosClientes($iddocumento, $arrayProd['idcliente']) == 0) {
                    $this->eliminarClienteByDocProducto(array($iddocumento), $arrayProd['idcliente']);
                }
            } else {
                $objcantComprometida->insertarCantidadComprometida($arrayProd);
                $objprodOrden->modificarCantidadADistribuir($prod->toArray());
            }

            if ($tipodistribucion == 2) {
                $pedidoService = new PedidoService();
                $objDistibucionPedido = new DatDistribucionpedido();
                $datosPedido = $objDistibucionPedido->getPedidoByIdDocumento(array('iddocumento' => $iddocumento));
                if ($datosPedido[0]['idpedido']) {
                    $params = array('idpedido' => $datosPedido[0]['idpedido'], 'idproducto' => $prod->idproducto,
                        'cantidad' => $prod->cantidad);
                    $pedidoService->aprobarDistribucion($params);
                }
            } elseif ($tipodistribucion == 4) {
                $this->_comunReserva->actualizarDatosCumplimiento($prod->toArray(), 2);
            }
            $prod->save();
        }
        $collProdOrdenCmpto->save();
        /*$comprometida = new CantidadesComprometidasModel();
        $comprometida->cambiarEstado(2, $iddocumento, null);*/
        return array('success' => parent::aprobarDocumento($iddocumento));
    }

    /**
     * Método para guardar las cantidades a distribuir del producto
     *
     * @params array $datosDoc Arreglo con los parametros para guardar las cantidades a distribuir
     *
     * @return Integer
     */
    public function salvarCantidades($datosDoc)
    {
        $comprometida = new CantidadesComprometidasModel();
        $collProdOrden = new Doctrine_Collection('DatProdorden');
        foreach ($datosDoc['datos'] as $prod) {
            $datosProd = new DatProdorden();
            $datosProd->assignIdentifier($prod['idprodorden']);
            $tempArrData = $datosProd->toArray();
            try {
                $this->producto->checkDisponibleProducto(
                    $tempArrData['idproducto'], $datosProd->cantidad - $prod['cantidad'], true
                );
                $datosProd->cantidad = $prod['cantidad'];
            } catch (Exception $e) {
                $datosProd->cantidad = 0;
            }
//          $productoLogistica = new DatProductoLogistica();
//          $productoLogistica->assignIdentifier($tempArrData['idproducto']);
//          $productoLogistica->disponible = $productoLogistica->disponible + $datosProd->cantidad - $prod['cantidad'];
//          $productoLogistica->save();
            $collProdOrden->add($datosProd);
            $array = $datosProd->toArray();
            $array['iddocumento'] = $array['idorden'];
            $comprometida->insertarCantidadComprometida($array);
        }

        if ($collProdOrden->count() > 0) {
            $collProdOrden->save();
        }
        return true;
    }

    /**
     * Método para actualizar el disponible de un producto
     *
     * @params array $pArrDatosOperacion Arreglo con los parametros para guardar las cantidades a distribuir
     *
     * @return Integer
     */
    public function actualizarCantidadDisponible($pArrDatosOperacion)
    {
        $comprometida = new CantidadesComprometidasModel();
        foreach ($pArrDatosOperacion['productos'] as $d) {
            $params = $d;
            $params['iddocumento'] = $pArrDatosOperacion['iddocumento'];
            $params['idproducto'] = $d['idproductologistica'];
            $comprometida->insertarCantidadComprometida($params);
        }
//        $operacion = $pArrDatosOperacion['resta'] == true ? '-' : '+';
//        $selec = $pArrDatosOperacion['anular'] ? 'cancelar' : 'cantidad';
//        if ($pArrDatosOperacion['iddocumento']) {
//            $_where = "dpo.idorden = {$pArrDatosOperacion['iddocumento']}";
//        } else {
//            $_where = " dpo.idprodorden in ({$pArrDatosOperacion['idmovimientos']})";
//        }
//        $sqlUpdateProducto = "UPDATE mod_logistica.dat_producto
//              set disponible = coalesce(disponible,0) {$operacion} t.cant
//              from (select sum($selec) as cant, idproducto as id from mod_logdistribucion.dat_prodorden dpo
//              where {$_where} group by idproducto) as t
//              where idproducto = t.id";
//        $conn = Zend_Registry::get('conexion');
//        $conn->execute($sqlUpdateProducto);
    }

    /**
     * Método para devolver los productos de un documento
     *
     * @params array $datosDoc Arreglo con los parametros para filtrar los documentos
     *
     * @return array
     */
    public function devolverProductosAnulacion($datosDoc)
    {
        $query = new Doctrine_Query();
        $query->Select(
            "dpo.idprodorden,dpo.idproducto,p.idproducto, cptmo.idprodorden,dpo.cantidad,dpo.idcliente,dpo.cancelar,
            cpmto.entregado as entregado, (dpo.cantidad - cpmto.entregado - cpmto.enproceso) as propuestoanular,
            (SELECT COALESCE(cc.motivo,'') FROM DatCancelacion cc WHERE cc.idprodorden = dpo.idprodorden AND cc.estado = 1 limit 1) as motivo"
        )
            ->Where("dpo.idorden = ?", $datosDoc['iddocumento'])
            //->addWhere("dpo.cantidad > cpmto.entregado")
            ->from("DatProdorden dpo")
            ->innerJoin("dpo.DatProductoLogistica p")
            //->innerJoin("p.DatMovimientos m")
            ->innerJoin("dpo.DatProdordencmpto cpmto")
            ->orderBy('dpo.idcliente DESC');
        $datosMaestros = new MaestroProductoModel();
        $datosMaestros->addQueryNomIndicador($query, 'p', 'i', 'ih');
        $this->configuracionHelper->getQueryJoinUnidadMedida(
            $query, 'p', 'um', 'um.abreviaturaunidadmedida as umedida', 'leftJoin'
        );
        if ($this->_esFarmacia) {
            $query->addSelect('p.numerolote as numerolote, p.fechavencelote as fechavencelote');
            $query->addOrderBy('p.fechavencelote ASC');
        }
        if ($datosDoc['criterio']) {
            $query->addWhere("i.numeropieza ilike '%{$datosDoc['criterio']}%' or i.codigo ilike '%{$datosDoc['criterio']}%' 
            or i.denominacion ilike '%{$datosDoc['criterio']}%' or p.numerolote ilike '%{$datosDoc['criterio']}%'");
        }

        $objDistibucion = new DatDistribucion();
        $datosCliente = $objDistibucion->getClientesDocumento($datosDoc);
        $this->cargarClientesDocumentos($datosCliente);
        $cantidad = $query->count();
        $datos = $this->logisticaDoctrine->addQueryLimits($query, $datosDoc)
            ->fetchArray();
        $cancelada = 0;
        foreach ($datos as &$obj) {
            foreach ($datosCliente as $cliente) {
                if ($obj['idcliente'] == $cliente['idcliente']) {
                    $obj['cliente'] = $cliente['cliente'];
                }
                if ($obj['cancelar'] > 0) {
                    $cancelada = 1;
                }
            }
        }
        return array('cantidad' => $cantidad, 'datos' => $datos, 'asigcancelada' => $cancelada);
    }

    /**
     * Método para salvar las cantidades a anular por cada producto
     *
     * @params array $datosDoc Arreglo con los parametros para filtrar los documentos
     *
     * @return Boolean
     */
    public function salvarCantidadesAnular($datosDoc)
    {
        $comprometida = new CantidadesComprometidasModel();
        $cProdorden = new Doctrine_Collection('DatProdorden');
        $cCancelacion = new Doctrine_Collection('DatCancelacion');
        foreach ($datosDoc['datos'] as $datos) {
            $datosProd = Doctrine::getTable('DatProdorden')->find($datos['idprodorden']);
            $cantidad = (float)$datos['cantidad'] - (float)$datos['cancelar'];
            $this->producto->checkDisponibleProducto($datosProd->idproducto, $cantidad, true);
            if ($datos['cancelar'] != null) {
                //$datosProd->cantidad = $cantidad;
                $datosProd->cancelar = (float)$datos['cancelar'];
                $cProdorden->add($datosProd);
                $existe = Doctrine::getTable('DatCancelacion')->findByDql('idprodorden = ? and estado = 1', array($datos['idprodorden']));
                if (count($existe)) {
                    $objCancelacion = $existe[0];
                } else {
                    $objCancelacion = new DatCancelacion();
                    $objCancelacion->idprodorden = $datos['idprodorden'];
                }
                $objCancelacion->cantidad = $datosProd->cancelar;
                $objCancelacion->idusuario = $this->global->Perfil->idusuario;
                $objCancelacion->motivo = $datos['motivo'];
                $objCancelacion->fecha = date("d/m/Y");
                $cCancelacion->add($objCancelacion);
                /*$array = $datosProd->toArray();
                $array['iddocumento'] = $array['idorden'];
                $array['cantidad'] = (float)$datos['propuestocancelar'] - (float)$datos['cancelar'];
                $comprometida->insertarCantidadComprometida($array);*/
            }
        }
        if ($cProdorden->count()) {
            $cProdorden->save();
            $cCancelacion->save();
        }
        return true;
    }

    /**
     * Método para anular el estado propuesto a cancelar de un producto
     * @params $iddoc id del documento para anular el estado
     */
    public function anularEstadoDoc($iddoc)
    {
        $doc = Doctrine_Query::create()->select('sum(po.cantidad) AS cantidad, sum(poc.enproceso) AS enproceso,
     		sum(poc.entregado) AS entregado, sum(po.cancelar) AS cancelado')
            ->from('DatProdordencmpto poc')->innerJoin('poc.DatProdorden po')->innerJoin('po.DatDocumento d')
            ->where(
                'po.idorden = ? AND d.estado = ?', array(
                    $iddoc, EstadoDocumentoModel::ESTADO_PROPUESTO_CANCELAR
                )
            )/*->groupBy('poc.idprodorden')*/
            ->fetchArray();
        $objcantComprometida = new CantidadesComprometidasModel();
        $objprodOrden = new DatProdordenModel();
        if ($doc && $doc[0]['cantidad'] == $doc[0]['cancelado'] && $doc[0]['enproceso'] == 0 && $doc[0]['entregado'] == 0) {

            $objProdOrden = Doctrine::getTable('DatProdorden')
                ->findByDql('idorden = ?', array($iddoc))->toArray();

            /*foreach ($objProdOrden as $objprod) {
                $objcantComprometida->eliminarCantidadComprometida(array($iddoc), $objprod['idproducto'], $objprod['idcliente']);
            }*/
            /*$this->eliminarProductosOrden($iddoc);
            Doctrine_Query::create()->delete('DatDocumento')->where('iddocumento = ?', array($iddoc))->execute();
            Doctrine_Query::create()->delete()->from('DatDocumentoPadre')->where('iddocumento = ?', $iddoc)->execute();

            return array('success' => true, 'eliminado' => true);*/
        }
        $objDistribucion = Doctrine::getTable('DatDistribucion')->find($iddoc);
        $tipodistribucion = $objDistribucion->tipodistribucion;
        $objProdOrden = Doctrine::getTable('DatProdorden')
            ->findByDql('idorden = ?', array($iddoc));
        $collProdOrdenCmpto = new Doctrine_Collection('DatProdordencmpto');
        foreach ($objProdOrden as &$prod) {
            $objDatCantComp = Doctrine::getTable('DatCantidadesComprometidas')->findByDql(
                'iddocumento = ? and idproducto = ? and idcliente = ?', array($iddoc, $prod->idproducto, $prod->idcliente)
            )->getFirst();
            $arrayProd['cantidad'] = (float)$objDatCantComp->cantidad - (float)$prod->cancelar;
            $objProdOrdenCmpto = new DatProdordencmpto();
            $objProdOrdenCmpto->assignIdentifier($prod->idprodorden);
            $objProdOrdenCmpto->cantidadoriginal = $prod->cantidad;
            $collProdOrdenCmpto->add($objProdOrdenCmpto);
            $arrayProd['iddocumento'] = $prod->idorden;
            $arrayProd['idproducto'] = $prod->idproducto;
            $arrayProd['idcliente'] = $prod->idcliente;

            if ($arrayProd['cantidad'] == 0) {
                $objcantComprometida->eliminarCantidadComprometida(array($iddoc), $arrayProd['idproducto'], $arrayProd['idcliente']);
                $objprodOrden->modificarCantidadADistribuir($prod->toArray());
                /*$this->eliminarProductosClientesOrden(array($iddoc), $arrayProd['idproducto'], $arrayProd['idcliente']);
                if ($this->getTotalProductosClientes($iddoc, $arrayProd['idcliente']) == 0) {
                    $this->eliminarClienteByDocProducto(array($iddoc), $arrayProd['idcliente']);
                }*/
            } else {
                $objcantComprometida->insertarCantidadComprometida($arrayProd);
                $objprodOrden->modificarCantidadADistribuir($prod->toArray());
            }

            if ($tipodistribucion == 2 && !count($doc)) {
                $pedidoService = new PedidoService();
                $objDistibucionPedido = new DatDistribucionpedido();
                $datosPedido = $objDistibucionPedido->getPedidoByIdDocumento(array('iddocumento' => $iddoc));
                $params = array('idpedido' => $datosPedido[0]['idpedido'], 'idproducto' => $prod->idproducto,
                    'cantidad' => $prod->cantidad);
                $pedidoService->aprobarDistribucion($params);
            }
            $prod->save();
        }
        $sqlUpdate = "update mod_logdistribucion.dat_cancelacion ".
            "set estado = 2, idaprobado = {$this->global->Perfil->idusuario} ".
            "where idprodorden in (select dp.idprodorden from mod_logdistribucion.dat_prodorden dp "
            ."where dp.idorden = {$iddoc}) and estado = 1 ";
        $update = $this->doctrineHelper->getConnection()->execute($sqlUpdate)->fetchAll();

        $collProdOrdenCmpto->save();
        return array(
            'success' => $this->estadoModel->setEstadoDocumento($iddoc, EstadoDocumentoModel::ESTADO_APROBADO),
            'eliminado' => ($this->getTotalProductosByDoc($iddoc) == 0) ? true : false
        );
    }

    public function eliminarClienteByDocProducto($iddoc, $arrayProd) {
        Doctrine_Query::create()
            ->delete('DatDocumentoCliente')
            ->where('iddocumento = ?', $iddoc)
            ->whereIn('idcliente', $arrayProd)
            ->execute();
    }

    public function getTotalProductosByDoc($iddocumento) {
        return Doctrine_Query::create()
            ->from('DatProdorden')
            ->where('idorden = ?', array($iddocumento))
            ->count();
    }

    /**
     * Método para actualizar las cantidades a anular por cada producto
     *
     * @params array $datosDoc Arreglo con los parametros para filtrar los documentos
     *
     * @return Boolean
     */
    public function actualizarCantidades($iddocumento)
    {
        $this->estadoModel->setEstadoDocumento($iddocumento, EstadoDocumentoModel::ESTADO_PROPUESTO_CANCELAR);
        return true;
    }

    public function realizarPropuestaDistribucion($datosDoc)
    {
        $conf = new stdClass();
        /* Con el servicio de devolverConfiguracion se obtienen la configuracion de la distribucion (formadistribucion,
          formadistribucion, completarmaximo) */
        $fechacontable = date("d/m/Y");
        $configuracion = $this->_confdistibucionService->devolverConfiguracion();
        $conf->fechacontable = $fechacontable;
        if (!$configuracion[0]['formadistribucion'] && !$configuracion[0]['politicacovertura'] &&
            !$configuracion[0]['completarmaximo']
        ) {
            throw new LogisticaException('LOG_LB_DIST_003');
        }
        if (!$configuracion[0]['duracionplan']) {
            throw new LogisticaException('LOG_LB_DIST_004');
        }
        $conf->formadistribucion = $configuracion[0]['formadistribucion'];
        $conf->politicacobertura = $configuracion[0]['politicacovertura'];
        $conf->completarmaximo = $configuracion[0]['completarmaximo'];
        $conf->duracionplan = $configuracion[0]['duracionplan'];
        $datosDoc['paramsDistribucion'] = $this->devolverParametrosDistribucion($conf);
        $datosDoc['idcliente'] = array_unique($datosDoc['idcliente']);
        /*compruebo si existen productos asociados al cliente y los parametros necesarios para realizar la distribucion
        (existencia, plan de consumo, politica de cobertura, maximo, minimo y fecha de existencia)*/
        $datPlanConsumo = new DatPlanconsumo();
        $datosPConsumo = $datPlanConsumo->getPlanConsumoByProductoCliente(
            $this->global->Estructura->idestructura, $datosDoc['idindicador'], $datosDoc['idcliente']
        );

        if ((!$datosPConsumo[0]['planconsumo'] || $datosPConsumo[0]['planconsumo'] == 0) ||
            (!$datosPConsumo[0]['politicacobertura'] || $datosPConsumo[0]['politicacobertura'] == 0) ||
            (!$datosPConsumo[0]['fechaexistencia'] || $datosPConsumo[0]['fechaexistencia'] == "")
        ) {
            throw new LogisticaException('LOG_LB_DIST_005');
        }
        /* si la forma de distribucion es 1 entonces voy a distribuir por prioridad, esta
          funcion devuelve los parametros
          necesarios para realizar la distribucion por prioridad */
        if ($conf->formadistribucion == 1) {
            $distribuido = 0;
            $nodistribuido = 0;
            $idproductos = Array();
            $arrayClientes = $this->devolverParametrosDistribucionFPrioridad($datosDoc['iddocumento']);
            foreach ($datosDoc['idproducto'] as $idproducto) {
                foreach ($arrayClientes as $cliente) {

                    $sql = "UPDATE dat_prodorden dpo " .
                        "SET cantidad = COALESCE((SELECT {$datosDoc['paramsDistribucion']['necesidad']} " .
                        "FROM dat_planconsumo pc " . "left join dat_producto dp on dp.idproducto = {$idproducto} " .
                        "WHERE pc.existencia is not null and pc.politicacobertura is not null " .
                        "AND pc.planconsumo is not null  " .
                        "AND dp.disponible >= {$datosDoc['paramsDistribucion']['necesidad']} " .
                        "AND pc.idcliente = dpo.idcliente " . "AND pc.idproducto = dp.idindicador),0) " .
                        "WHERE dpo.idorden = {$datosDoc['iddocumento']} " .
                        "AND dpo.idcliente = {$cliente['idcliente']} " . "AND dpo.idproducto = {$idproducto} ";
                    $datosProd = Zend_Registry::get('conexion')->prepare($sql)->execute();
                    //$datosProd = $this->doctrineHelper->getConnection()->execute($sql)->fetchAll();
                    if ($datosProd) {
                        $distribuido++;
                    } else {
                        $idproductos[] = $idproducto;
                        $nodistribuido++;
                    }

                    $sqlUpdateCantidadComprometida = "SELECT t.cant " .
                        "FROM (select cantidad as cant, idproducto as id " .
                        "FROM mod_logdistribucion.dat_prodorden dpo " .
                        "WHERE dpo.idorden = {$datosDoc['iddocumento']} " .
                        "AND dpo.idcliente = {$cliente['idcliente']} " .
                        "AND dpo.idproducto = {$idproducto}) as t ";
                    $cantidad = $this->doctrineHelper->getConnection()->fetchAll($sqlUpdateCantidadComprometida);
                    $array = array(
                        'iddocumento' => $datosDoc['iddocumento'], 'idproducto' => $idproducto,
                        'idcliente' => $cliente['idcliente'], 'cantidad' => $cantidad[0]['cant']
                    );
                    $comprometida = new CantidadesComprometidasModel();
                    $comprometida->insertarCantidadComprometida($array);
                }
            }
        }
        /* si la forma de distribucion es 2 entonces voy a distribuir por equitativa, esta funcion
          devuelve los parametros
          necesarios para realizar la distribucion equitativa */
        if ($conf->formadistribucion == 2) {
            foreach ($datosDoc['idproducto'] as $idproducto) {
                $necesidadTotal = $this->devolverParametrosDistribucionEquitativa($datosDoc, $idproducto);
                foreach ($datosDoc['idcliente'] as $cliente) {
                    $sql = "UPDATE dat_prodorden dpo " .
                        "SET cantidad = COALESCE((SELECT (case when {$datosDoc['paramsDistribucion']['necesidad']} >
                        0 AND " .
                        "{$datosDoc['paramsDistribucion']['necesidad']} is not null " .
                        "then ROUND(({$datosDoc['paramsDistribucion']['necesidad']} " .
                        "/ {$necesidadTotal[0]['necesidadTotal']} * dp.disponible),0) else 0 end)" .
                        "FROM dat_planconsumo pc " . "left join dat_producto dp on dp.idproducto = {$idproducto} " .
                        "WHERE pc.existencia is not null and pc.politicacobertura is not null " .
                        "AND pc.planconsumo is not null  " .
                        "AND dp.disponible >= {$datosDoc['paramsDistribucion']['necesidad']} " .
                        "AND pc.idcliente = dpo.idcliente " . "AND pc.idproducto = dp.idindicador),0) " .
                        "WHERE dpo.idorden = {$datosDoc['iddocumento']} " .
                        "AND dpo.idcliente = {$cliente} " . "AND dpo.idproducto = {$idproducto} ";
                    $this->doctrineHelper->getConnection()
                        ->fetchAll($sql);

                    $sqlUpdateCantidadComprometida = "SELECT t.cant " .
                        "FROM (select cantidad as cant, idproducto as id " .
                        "FROM mod_logdistribucion.dat_prodorden dpo " .
                        "WHERE dpo.idorden= {$datosDoc['iddocumento']} " .
                        "AND dpo.idcliente = {$cliente} " .
                        "AND dpo.idproducto = {$idproducto}) as t ";
                    $cantidad = $this->doctrineHelper->query($sqlUpdateCantidadComprometida)->toArray();
                    $array = array(
                        'iddocumento' => $datosDoc['iddocumento'], 'idproducto' => $idproducto,
                        'idcliente' => $cliente, 'cantidad' => $cantidad[0]['cant']
                    );
                    $comprometida = new CantidadesComprometidasModel();
                    $comprometida->insertarCantidadComprometida($array);
                }
            }
        }

        if ($conf->formadistribucion == 2 || $distribuido == count($arrayClientes)) {
            return array('success' => true);
        } else {
            return array('nodistribuidos' => $nodistribuido, 'arrayproductos' => $idproductos);
        }
    }

    public function verificarDisponibilidad($datosDoc, $cliente, $idproducto)
    {
        $sql = "SELECT COALESCE({$datosDoc['paramsDistribucion']['necesidad']}, 0) as necesidad " .
            "FROM dat_planconsumo pc " . "left join dat_producto dp on dp.idindicador =  pc.idproducto " .
            "left join dat_prodorden dpo on dpo.idproducto = dp.idproducto " .
            "where dpo.idorden = {$datosDoc['iddocumento']} " . "AND dpo.idcliente = {$cliente['idcliente']} " .
            "AND dpo.idproducto = {$idproducto} AND dp.disponible >= {$datosDoc['paramsDistribucion']['necesidad']} ";
        $datosProd = $this->doctrineHelper->getConnection()->fetchAll($sql);
        $this->producto->checkDisponibleProducto(
            $idproducto, $datosProd[0]['necesidad'] * -1
        );
        return true;
    }

    /* Distribucion equitativa, por prioridad, mixta */

    public function devolverParametrosDistribucion($params)
    {
        $arrayDatos = array();
        $arrayDatos['pdiario'] = "pc.planconsumo/$params->duracionplan";
        $arrayDatos['politicaCobert'] = "pc.politicacobertura * ({$arrayDatos['pdiario']})";
        $arrayDatos['cdias'] = "(date('{$params->fechacontable}') - date(pc.fechaexistencia))";
        $arrayDatos['existenciaTeorica'] = "(pc.existencia - ({$arrayDatos['cdias']} * {$arrayDatos['pdiario']}))";
        if ($params->completarmaximo == 2 && $params->politicacovertura == 1) {
            $arrayDatos['necesidad'] = $this->devolverNecesidadCoberturaMaximo($arrayDatos);
        } else {
            $arrayDatos['necesidad'] = ($params->completarmaximo == 2) ? $this->devolverNecesidadMaximo($arrayDatos) :
                $this->devolverNecesidadCobertura($arrayDatos);
        }
        return $arrayDatos;
    }

    /* Aqui calculo la necesidad para la politica por cobertura */

    public function devolverNecesidadCobertura($arrayDatos)
    {
        $necesidad = " case when ({$arrayDatos['existenciaTeorica']}) <= 0 then ({$arrayDatos['politicaCobert']})
        when ({$arrayDatos['existenciaTeorica']})  > ( {$arrayDatos['politicaCobert']} ) then 0
        when coalesce(pc.minimo,0) > 0 AND pc.minimo > ({$arrayDatos['existenciaTeorica']}) then
        ({$arrayDatos['politicaCobert']}) - ({$arrayDatos['existenciaTeorica']})
        when coalesce(pc.minimo,0) = 0 AND ({$arrayDatos['politicaCobert']})  > ({$arrayDatos['existenciaTeorica']})
        then ({$arrayDatos['politicaCobert']} ) - ({$arrayDatos['existenciaTeorica']} ) end";
        return $necesidad;
    }

    /* Aqui calculo la necesidad para completar por maximos */

    public function devolverNecesidadMaximo($arrayDatos)
    {
        $necesidad = "
        case when ({$arrayDatos['existenciaTeorica']}) < 0 then case when pc.maximo > 0 then pc.maximo
        else ({$arrayDatos['politicaCobert']}) end
        when ({$arrayDatos['existenciaTeorica']}) > ({$arrayDatos['politicaCobert']}) then 0
        when coalesce(pc.minimo,0) > 0 AND pc.minimo > ({$arrayDatos['existenciaTeorica']}) then case when pc.maximo > 0
        then pc.maximo - ({$arrayDatos['existenciaTeorica']})
        else ({$arrayDatos['politicaCobert']}) - ({$arrayDatos['existenciaTeorica']}) end
		when coalesce(pc.minimo,0) = 0 AND ({$arrayDatos['politicaCobert']})  > ({$arrayDatos['existenciaTeorica']})
		then case when pc.maximo > 0 then pc.maximo - ({$arrayDatos['existenciaTeorica']}) else
		({$arrayDatos['politicaCobert']}) - ({$arrayDatos['existenciaTeorica']}) end end";
        return $necesidad;
    }

    /* Aqui calculo la necesidad para la politica por cobertura y completar por maximos */

    public function devolverNecesidadCoberturaMaximo($arrayDatos)
    {
        $necesidad = " case when ({$arrayDatos['politicaCobert']}) > pc.maximo
        then (pc.maximo) - ({$arrayDatos['existenciaTeorica']})
        when ({$arrayDatos['politicaCobert']}) <= pc.maximo
        then ({$arrayDatos['politicaCobert']}) - ({$arrayDatos['existenciaTeorica']}) end";
        return $necesidad;
    }

    public function eliminarProductosOrden($iddocumento, $idproductos = '')
    {
        if (is_array($idproductos)) {
            $idproductos = implode(',', $idproductos);
        }
        if (is_array($iddocumento)) {
            $iddocumento = implode(',', $iddocumento);
        }
        $arrWhere = array();
        $arrWhere[] = "idorden in ({$iddocumento})";
        if (!is_null($idproductos) && $idproductos != 0) {
            $arrWhere[] = "idproducto in ({$idproductos})";
        }
        $sqlWhere = implode(' and ', $arrWhere);
        $sql = "select po.idprodorden from dat_prodorden po where {$sqlWhere} and cantidad <> 0";
        $conn = Zend_Registry::get('conexion');
        $a = $conn->execute($sql);
        $arrDatosProdorden = $a->fetchAll(PDO::FETCH_ASSOC);
        $arrParams = array();
        if (count($arrDatosProdorden) > 0) {
            foreach ($arrDatosProdorden as $data) {
                array_push($arrParams, $data['idprodorden']);
            }
        }
        if (count($arrParams) > 0) {
            $this->updateBeforeOperacion(array('idprodorden' => implode(',', $arrParams)));
        }
        $sqlEliminar = "delete from dat_prodorden cascade where {$sqlWhere} and idproducto <> 0";
        $conn->execute($sqlEliminar);
        return 1;
    }

    public function updateBeforeOperacion($pArrDatosOperacion)
    {
        $operacion = $pArrDatosOperacion['resta'] == true ? '-' : '+';
        if (!$pArrDatosOperacion['iddocumento'] &&
            (!$pArrDatosOperacion['idpadre'] && !$pArrDatosOperacion['idprodorden'])
        ) { //Excepcion para desarrolladores
            //throw new ZendExt_Exception('IOC002');
        }
        if ($pArrDatosOperacion['iddocumento']) {
            $where = " dpo.iddocumento = {$pArrDatosOperacion['iddocumento']}";
        } else {
            if ($pArrDatosOperacion['idpadre']) {
                $where = " dpo.idpadre in ({$pArrDatosOperacion['idpadre']})";
            } else {
                $where = " dpo.idprodorden in ({$pArrDatosOperacion['idprodorden']})";
            }
        }
        if ($pArrDatosOperacion['idcliente']) {
            $where .= " AND dpo.idcliente in ({$pArrDatosOperacion['idcliente']})";
        }
        $this->Actualizar($operacion, $where);
    }

    public function Actualizar($operacion, $where)
    {
        $sqlUpdateProducto = "update mod_logistica.dat_producto
                              set disponible = coalesce(disponible,0) {$operacion} t.cant
                              from (select sum(cantidad) as cant, idproducto as id
                              from mod_logdistribucion.dat_prodorden dpo where {$where} group by idproducto) as t
                              where idproducto = t.id";
        $sqlUpdateAreaproducto = "update mod_logubicacion.dat_areaproducto
                                  set disponible = coalesce(disponible,0) {$operacion} t.cant
                                  from (select dpo.idproducto as id, poa.idareaproducto as area,
                                  sum(poa.cantidad)as cant
                                  from mod_logdistribucion.dat_prodorden dpo
                                  inner join mod_logdistribucion.dat_prodordenarea poa
                                  on poa.idprodorden = dpo.idprodorden
                                  where {$where}
                                  group by dpo.idproducto, poa.idareaproducto) as t where t.area = idarea
                                  and t.id = idproducto";
        $conexion = Zend_Registry::get('conexion');
        $conexion->execute($sqlUpdateProducto);
        $conexion->execute($sqlUpdateAreaproducto);
    }

    public function devolverParametrosDistribucionEquitativa($datosDoc, $idproducto)
    {
        return Doctrine_Query::create()
            ->select("COALESCE(SUM({$datosDoc['paramsDistribucion']['necesidad']}),0) as necesidadTotal")
            ->from('DatPlanconsumo pc')
            ->leftJoin('DatProductoLogistica dp on dp.idindicador = pc.idproducto')
            ->whereIn('pc.idcliente', $datosDoc['idcliente'])
            ->addWhere('dp.idproducto = ? ', array($idproducto))
            ->fetchArray();
    }

    public function devolverParametrosDistribucionFPrioridad($iddocumento)
    {
        return Doctrine_Query::create()
            ->select('ddc.iddocumentocliente, ddc.idcliente as idcliente, ddc.prioridad as prioridad')
            ->from('DatDocumentoCliente ddc')
            ->where('ddc.iddocumento = ? ', array($iddocumento))
            ->orderBy('ddc.prioridad')
            ->fetchArray();
    }

    public function ajustarPrioridades($parametros)
    {
        $cliente = new DatDocumentoCliente();
        foreach ($parametros as $row) {
            $cliente->assignIdentifier($row['iddocumentocliente']);
            $cliente->synchronizeWithArray($row);
            $cliente->save();
        }
        return true;
    }

    private function adicionarProdOrden($iddocumento, $idproducto, $cantidad, $idcliente, $collProdOrden)
    {
        $pos = $this->_arrProdOrden[$idproducto . '-' . $idcliente];
        if ($pos === 0 || $pos > 0) {
            $collProdOrden[$pos]->cantidad += $cantidad;
        } else {
            $oProdOrden = new DatProdorden();
            $oProdOrden->idproducto = $idproducto;
            $oProdOrden->idcliente = $idcliente;
            $oProdOrden->idorden = $iddocumento;
            $oProdOrden->cantidad = $cantidad;
            $oProdOrdenCmpto = new DatProdordencmpto();
            $oProdOrdenCmpto->entregado = 0;
            $oProdOrdenCmpto->enproceso = 0;
            $oProdOrdenCmpto->pendiente = 0;
            $oProdOrdenCmpto->idprodorden = $oProdOrden->idprodorden;
            $oProdOrden->DatProdordencmpto = $oProdOrdenCmpto;
            $collProdOrden->add($oProdOrden);
            $this->_arrProdOrden[$idproducto . '-' . $idcliente] = $collProdOrden->key();
        }

        return $collProdOrden;
    }

    public function adicionarProductosDocReserva($iddocumento, $datosDoc)
    {
        $flag = 0;
        $documentos = array();
        $documentosInverso = array();
        foreach ($datosDoc['documentos'] as $index => $doc) {
            if ($datosDoc['inversa'][$index] == 1) {
                $documentosInverso[] = $doc;
            } else {
                $documentos[] = $doc;
            }
        }
        $confreserva = new ConfreservaService();
        if ($datosDoc['tipo'] == 1) {
            $obj = new PrestamoService();
        } else if ($datosDoc['tipo'] == 2) {
            $obj = new CambioubicacionService();
        } else if ($datosDoc['tipo'] == 3) {
            $obj = new SurtidoService();
        } else {
            $obj = new LiberacioncomercializacionService();
        }
        $arrayProd = array();
        $arrayProductosInverso = array();
        if (count($documentos) > 0) {
            $arrayProd = $obj->getDatosDocumentos(
                array('iddocumento' => $documentos, 'alternativo' => 1,
                    'iddelegacion' => $this->global->Estructura->idestructura)
            );
        }
        if (count($documentosInverso) > 0) {
            $arrayProductosInverso = $obj->getDatosDocumentosInverso(
                array('iddocumento' => $documentosInverso, 'iddelegacion' => $this->global->Estructura->idestructura)
            );
        }
        $arrayProductos = array_merge($arrayProd, $arrayProductosInverso);
        $arrDisponibles = array();
        $collProdOrden = new Doctrine_Collection('DatProdorden');
        $arrClientes = array();
        $arregloClientes = array();
        foreach ($arrayProductos as $key => &$value) {
            $originalvalue = $value['cantidad'];
            if ($value['cantidad'] > 0) {
                $arrayDepositos = $confreserva->obtenerDepositosService(
                    array('empresas' => array($value['idempresa']))
                );
                $idcliente = $value['idcliente'];
                foreach ($arrayDepositos as $key => $deposito) {
                    $iddeposito = $deposito['iddeposito'];
                    $value['enproceso'] = 0;
                    $datosprod = $this->producto->existeIndicadorEstructura(
                        array('idindicador' => $value['idproducto'], 'idestructura' => array($iddeposito))
                    );

                    $idproducto = $datosprod[0]['idproducto'];
                    if (!empty($datosprod)) {
                        if (!array_key_exists($idproducto . '-' . $iddeposito, $arrDisponibles)) {
                            $arrDisponibles[$idproducto . '-' . $iddeposito] = $datosprod[0];
                        }
                        $disponible = $arrDisponibles[$idproducto . '-' . $iddeposito]['disponible'];
                        if ($disponible >= $value['cantidad']) {
                            $collProdOrden = $this->adicionarProdOrden(
                                $iddocumento, $idproducto, $value['cantidad'], $idcliente, $collProdOrden
                            );
                            $value['enproceso'] = $value['cantidad'];
                            $disponible = $value['cantidad'];
                            $value['cantidad'] = 0;
                            $flag = true;
                        } else {
                            if ($disponible > 0) {
                                $collProdOrden = $this->adicionarProdOrden(
                                    $iddocumento, $idproducto, $disponible, $idcliente, $collProdOrden
                                );
                                $value['enproceso'] += $disponible;
                                $value['cantidad'] -= $disponible;
                                $flag = true;
                            }
                        }
                        $arrDisponibles[$idproducto . '-' . $iddeposito]['disponible'] -= $disponible;
                        if ($value['cantidad'] == 0 || $disponible == 0) {
                            $value['cantidad'] = $originalvalue;
                            $value['idproductologistica'] = $idproducto;
                            break;
                        }
                    }
                }
                if (!in_array($idcliente, $arrClientes)) {
                    array_push($arrClientes, $idcliente);
                    array_push($arregloClientes, array('idcliente' => $idcliente, 'tipocliente' => 1));
                }
            }
            $value['cantidad'] = $originalvalue;
        }
        if ($collProdOrden->count()) {
            $collProdOrden->save();
            if (count($arregloClientes) > 0) {
                $this->adicionarClientes($iddocumento, $arregloClientes);
            }
            $this->actualizarCantidadDisponible(
                array(
                    'signo' => LogisticaMovimientoModel::SIGNO_MOV_RESTA,
                    'iddocumento' => $iddocumento,
                    'productos' => $arrayProductos
                )
            );
            $this->_comunReserva->actualizarDatosCumplimiento($arrayProductos);
            $flag = 1;
        } else {
            $flag = 3;
            $this->eliminarDocumento($iddocumento);
        }

        return $flag;
    }

    /**
     * Devuelve los informes de recepción contabilizados de los depositos al cual el usuario tiene permiso.
     * @return array
     */
    public function cargarRecepcion($datosDoc)
    {
        $recepcion = new RecepcionService();
        $doc = $recepcion->devolverDocumentos($datosDoc, true);
        $doc->innerJoin('d.DatDocumentoprim ddp');
        $doc->innerJoin('ddp.NomDocprim ndp');
        $doc->addSelect('ndp.abreviatura as abreviatura');
        $doc->andWhere('ndp.abreviatura = ?', array($datosDoc['alias']));
        //print_r($datosDoc);die;
        $cantidad = $doc->count();
        //$doc = $doc->orderBy('d.idestructuracomun, d.nrodoc');
        $result = $this->logisticaDoctrine->addQueryLimits($doc, $datosDoc)
            ->fetchArray();
        $depositos = LogisticaEstructuraUbicHelper::__init()->cargardepositos(null, null, null, null, null, -1, false, 1);
        $datos = array();
        $pos = 0;
        foreach ($depositos['depositos'] as $r) {
            foreach ($result as $d) {
                if ($r['iddeposito'] == $d['iddeposito']) {
                    $deposito = $this->estructuraHelper->getEstructura($d['iddeposito'])[0];
                    $datos[$pos]['iddeposito'] = $d['iddeposito'];
                    $datos[$pos]['almacen'] = $deposito->codigo.' '.$deposito->text;
                    $datos[$pos]['nrodoc'] = $d['nrodoc'];
                    $datos[$pos]['numeroref'] = $d['numeroref'];
                    $datos[$pos]['fechacontable'] = $d['fechacontable'];
                    $datos[$pos]['cantproductos'] = $d['cantproductos'];
                    $datos[$pos]['idcliente'] = $d['idcliente'];
                    $datos[$pos]['tipocliente'] = $d['tipocliente'];
                    $datos[$pos]['iddocumento'] = $d['iddocumento'];
                    $datos[$pos]['idestructuracomun'] = $d['idestructuracomun'];
                    $pos++;
                }
            }
        }
        return array('cantidad' => $cantidad, 'datos' => $this->cargarClientesDocumentos($datos));
    }

    /**
     * Devuelve los movimientos de un informe de recepción.
     * @param numeric $iddocumento
     * @return array
     */
    public function cargarMovRecepcion($iddocumento, $parametros)
    {
        $query = $this->getProductoModel()->devolverMovimientos(array('iddocumento' => $iddocumento), true);
        return $this->getProductoModel()->concatenarDeposito(
            array('cantidad' => $query->count(),
                'datos' => $this->doctrineHelper->addQueryLimits($query, $parametros)->fetchArray()
            )
        );
    }


    public function cargarProductos($parametros)
    {
        $tmpEstructura = json_decode($parametros['idestructura']);
        if (!is_array($tmpEstructura)) {
            $tmpEstructura = explode(',', $parametros['idestructura']);
        }
        $modelProducto = new LogisticaProductoModel();
        $query = $modelProducto->cargarProductos($parametros, true);
        $clientes = $this->getArrayClientes($parametros['iddocumento'], 'idcliente');
        if (count($clientes) == 1) {
            $query->addWhere('p.idestructura <> ?', $clientes[0]);
        }
        return $modelProducto->concatenarDeposito(
            array(
                'cantidad' => $query->count(),
                'datos' => $this->_maestroProductos->setLastLevel(
                    $this->doctrineHelper->addQueryLimits($query, $parametros)
                    ->addOrderBy('p.idestructuracomun')
                    ->fetchArray()
                )
            )
        );
    }

    public function getDepositosEntidad($parametros)
    {
        $parametros['identidad'] = $this->global->Estructura->idestructura;
        /*$depositos = LogisticaEstructuraUbicHelper::__init()->cargardepositos(null, null, null, null, -1, false, 1);*/
        $idsDeposit = $this->seguridadHelper->obtenerEstructurasNoFormales($this->global->Perfil->certificado, 8);
        $depositos = $this->estructuraHelper->obtenerEstructurasNoFormales(
            false, $parametros['identidad'], false, null, null, $idsDeposit, -1
        );
        $datosDepositos = array();
        foreach ($depositos as $i => $r) {
            $datosDepositos[] = $r['DatEstructuraop'][0]['idestructuraop'];
        }
        /*foreach ($depositos['depositos'] as $i => $r) {
            $datosDepositos[] = $r['iddeposito'];
        }*/
        if (count($datosDepositos) > 0) {
            return array('cantidad' => count($datosDepositos), 'datos' => $datosDepositos);
        } else {
            return false;
        }
    }

    public function getCantidadClienteDocumento($iddocumento)
    {
        $clientes = Doctrine_Query::create()->select('count(ddc.iddocumentocliente) AS cantidad')
            ->from('DatDocumentoCliente ddc')->where('ddc.iddocumento = ?', $iddocumento)
            ->fetchArray();
        return $clientes[0]['cantidad'];
    }

    public function eliminarClientesProductos($parametros)
    {
        if (count($parametros['idmovimientos']) == 0 && count($parametros['idclientes']) == 0) {
            return false;
        }
        $iddocumento = $parametros['iddocumento'];
        if ($parametros['idprodorden']) {
            $res['idprodorden'] = implode($parametros['idprodorden'], ',');
            $prod = Doctrine::getTable('DatProdorden')->findByDql("idprodorden IN ({$res['idprodorden']})")->toArray();
            $idproductos = $this->objectHelper->extractValueFromArrayColumn($prod, 'idproducto');
            $idclientes = $this->objectHelper->extractValueFromArrayColumn($prod, 'idcliente');
        }
        if ($parametros['idclientes']) {
            $idclientes = $parametros['idclientes'];
        }

        $comprometida = new CantidadesComprometidasModel();
        $comprometida->eliminarCantidadComprometida($iddocumento, $idproductos, $idclientes);

        if (count($parametros['idmovimientos']) > 0) {
            Doctrine_Query::create()
                ->delete('DatProdorden')
                ->where('idorden = ?', $parametros['iddocumento'])
                ->whereIn('idproducto', $parametros['idmovimientos'])
                ->execute();
        }

        if ($idclientes && $this->getTotalProductosClientes($iddocumento, $idclientes) == 0) {
            Doctrine_Query::create()
                ->delete('DatDocumentoCliente')
                ->where('iddocumento = ?', $parametros['iddocumento'])
                ->whereIn('idcliente', $idclientes)
                ->execute();
        }

        if (count($parametros['idclientes']) > 0) {
            Doctrine_Query::create()
                ->delete('DatProdorden')
                ->where('idorden = ?', $parametros['iddocumento'])
                ->whereIn('idcliente', $parametros['idclientes'])
                ->execute();
            Doctrine_Query::create()
                ->delete('DatDocumentoCliente')
                ->where('iddocumento = ?', $parametros['iddocumento'])
                ->whereIn('idcliente', $parametros['idclientes'])
                ->execute();
        }
        return array(
            'success' => true,
            'cant_clientes' => $this->getCantidadClienteDocumento($parametros['iddocumento']),
            'cant_productos' => $this->_datProdOrden->getCantidadProductoDocumento($parametros)[0]['cantidad']
        );
    }

    public function eliminarProductosClientesOrden($iddocumento, $idproducto, $idcliente)
    {
        $query = Doctrine_Query::create()
            ->delete('DatProdorden dpo')
            ->whereIn('dpo.idorden', $iddocumento);
        if ($idproducto) {
            $idproductos = is_array($idproducto) ? $idproducto : array($idproducto);
            $query->whereIn('dpo.idproducto', $idproductos);
        }
        if ($idcliente) {
            $idclientes = is_array($idcliente) ? $idcliente : array($idcliente);
            $query->andWhereIn('dpo.idcliente', $idclientes);
        }
        return $query->execute();
    }

    public function verificarDatosProducto($iddocumento, $parametros)
    {
        if ($parametros['confsinproducto'] == 1) {
            if (count($parametros['idclientes']) > 0) {
                Doctrine_Query::create()
                    ->delete('DatDocumentoCliente')
                    ->where('iddocumento = ?', $parametros['iddocumento'])
                    ->whereIn('idcliente', $parametros['idclientes'])
                    ->execute();
            }
        }
        $result = array();
        $clientes = $this->getArrayClientes($iddocumento);
        if (count($clientes) > 0) {
            foreach ($clientes as $c) {
                $cantProductos = $this->getTotalProductosClientes($iddocumento, $c);
                if ($cantProductos == 0) {
                    $result[] = array('idcliente' => $c);
                }
            }
            if (count($result) > 0) {
                return $result;
            }
            return -1;
        } else {
            return array('idcliente' => $iddocumento, 'sinclientes' => 1);
        }
    }

    public function getArrayClientes($iddocumento, $needle = 'idcliente')
    {
        $clientes = Doctrine::getTable('DatDocumentoCliente')
            ->findByDql('iddocumento = ?', array($iddocumento));
        foreach ($clientes as $i => $c) {
            $return[$i] = $c->$needle;
        }
        return $return;
    }

    public function getTotalProductosClientes($iddocumento, $cliente)
    {
        if (is_array($cliente)) {
            $arrClientes = implode(',', $cliente);
        } else {
            $arrClientes = $cliente;
        }
        return Doctrine_Query::create()
            ->from('DatProdorden')
            ->where("idorden = ? and idcliente in ($arrClientes)", array($iddocumento))
            ->count();
    }

    public function copiarDocumento($iddocumento, $sameDoc = false, $cancelSigno = false)
    {
        $idCopia = parent::copiarDocumento($iddocumento, $sameDoc, $cancelSigno);
        $this->saveDuplicarDocumento($iddocumento, $idCopia);
        $datosDoc = array();
        $datosDoc['iddocumento'] = $idCopia;
        $idcliente = Doctrine_Query::create()->select('idcliente, tipocliente')->from('DatDocumentoCliente')
            ->where('iddocumento = ?', array($iddocumento))
            ->fetchArray();
        $datosDoc['addproductos'] = 1;
        if (count($idcliente) > 0) {
            foreach ($idcliente as $id) {
                $datosDoc['idcliente'][] = array('idcliente' => $id['idcliente'], 'tipocliente' => $id['tipocliente']);
            }
        }

        if (is_array($datosDoc['idcliente']) && count($datosDoc['idcliente']) > 0) {
            $this->adicionarClientes($idCopia, $datosDoc['idcliente']);
        }

        $prodDoc = Doctrine_Query::create()->select('dpo.*, (NULL) AS idprodorden')->from('DatProdorden dpo')
            ->where('dpo.idorden = ?', $iddocumento)
            ->fetchArray();
        if (count($prodDoc) > 0) {
            foreach ($prodDoc as $id) {
                $datosDoc['idproductos'][] = array('idproducto' => $id['idproducto'], 'cantidad' => $id['cantidad'],
                    'idcliente'=> $id['idcliente']);
            }
        }

        if (is_array($datosDoc['idproductos']) && count($datosDoc['idproductos']) > 0) {
            $this->adicionarCopiaProductos($datosDoc, $iddocumento);
        }
        //$this->adicionarClientesDocumento($idCopia, $datosDoc);
        $doc = Doctrine::getTable('DatDocumento')->find($idCopia);
        return array('iddocumento' => $idCopia, 'observaciones' => $doc->observaciones);
    }

    /**
     * @description Método auxiliar para duplicar la información del documento según iddocumento
     * @param integer $iddocumento
     * @param integer $nuevoIddocumento
     * @param string $class
     */
    private function saveDuplicarDocumento($iddocumento, $nuevoIddocumento, $class = 'DatDistribucion')
    {
        $datosDoc = Doctrine_Query::create()->from($class)->where('iddistribucion = ?', array($iddocumento))->fetchArray();
        $documentoDuplicado = new $class;
        $documentoDuplicado->synchronizeWithArray($datosDoc[0]);
        $documentoDuplicado->set('iddistribucion', $nuevoIddocumento);
        $documentoDuplicado->save();
    }

    public function adicionarCopiaProductos($datosProd, $oldiddocumento)
    {
        $collProdOrden = new Doctrine_Collection('DatProdorden');
        $comprometida = new CantidadesComprometidasModel();
        foreach ($datosProd['idproductos'] as $producto) {
            foreach ($datosProd['idcliente'] as $cliente) {
                $oProdOrden = new DatProdorden();
                if ($oProdOrden->existeProdOrden($oldiddocumento, $producto['idproducto'])) {
                    $cantidad = $producto['cantidad'] ? $producto['cantidad'] : 0;
                    $dql = "SELECT ((p.cantidad - coalesce((SELECT sum(cc.cantidad) FROM DatCantidadesComprometidas cc "
                        . "WHERE cc.idproducto = {$producto['idproducto']} AND cc.estado = 1), 0))) as saldo "
                        . "FROM DatProductoLogistica p "
                        . "WHERE p.idproducto = {$producto['idproducto']}";
                    $disponible = $this->doctrineHelper->query($dql)->toArray();
                    if ($disponible[0]['saldo'] > 0) {
                        $cantidad = ($disponible[0]['saldo'] >= $cantidad) ? $cantidad : $disponible[0]['saldo'];
                        if ($cliente['idcliente'] == $producto['idcliente']) {
                            $oProdOrden->idproducto = $producto['idproducto'];
                            $oProdOrden->idcliente = $cliente['idcliente'];
                            $oProdOrden->idorden = $datosProd['iddocumento'];
                            $oProdOrden->cantidad = $cantidad;
                            $oProdOrdenCmpto = new DatProdordencmpto();
                            $oProdOrdenCmpto->entregado = 0;
                            $oProdOrdenCmpto->enproceso = 0;
                            $oProdOrdenCmpto->pendiente = 0;
                            $oProdOrdenCmpto->idprodorden = $oProdOrden->idprodorden;
                            $oProdOrden->DatProdordencmpto = $oProdOrdenCmpto;
                            $collProdOrden->add($oProdOrden);
                            $array = $oProdOrden->toArray();
                            $array['iddocumento'] = $array['idorden'];
                            $comprometida->insertarCantidadComprometida($array);
                        }
                    }
                }
            }
        }
        if ($collProdOrden->count() > 0) {
            $collProdOrden->save();
            return true;
        }
        return false;
    }

    public function cargarCancelaciones($idprodorden) {
        $sqlUpdate = "select cc.*, u.nombreusuario as creadopor, ua.nombreusuario as aprobadopor from mod_logdistribucion.dat_cancelacion cc ".
            "left join mod_seguridad.seg_usuario u on u.idusuario = cc.idusuario ".
            "left join mod_seguridad.seg_usuario ua on ua.idusuario = cc.idaprobado ".
            "where cc.idprodorden = {$idprodorden} and cc.estado <> 1 ";
        $datos = $this->doctrineHelper->getConnection()->execute($sqlUpdate)->fetchAll(PDO::FETCH_ASSOC);
        return array('datos' => $datos);
    }

    public function restablecerCumplimiento($iddocumento) {
        if (is_numeric($iddocumento)) {
            $this->doctrineHelper->getConnection()->execute(
                "select mod_logdistribucion.fn_arreglarcumplimiento({$iddocumento}, null)"
            );
        }
        return true;
    }

    public function cancelarAsignaciones($iddocumento, $motivo = '') {
        if (is_numeric($iddocumento)) {
            $this->doctrineHelper->getConnection()->execute(
                "select mod_logdistribucion.fn_cancelarasignaciones({$iddocumento}, '{$motivo}')"
            );
        }
        return true;
    }

    public function cargarEntidades($criterio = ''){
        $where = ($criterio != '') ? " where ee.codigo ilike '%{$criterio}%' or ee.descripcion ilike '%{$criterio}%'" : "";
        $sql = "select ee.idestructuracomun as idestructura, ee.descripcion as denominacion, ee.codigo from mod_contabilidad.dat_estructurae ee {$where}";
        return $this->doctrineHelper->getConnection()->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
    }
    /**
     * Método para devolver los documentos que generaron una distribución
     *
     * @params array $datosDoc Arreglo con los parametros para filtrar los documentos
     *
     * @return array
     */
    public function getIdDocumentosPadre($iddocumento)
    {
        $extraer = function($valor) {
            return $valor['idpadre'];
        };

        $data =
            Doctrine_Query::create()
                ->select("ddp.idpadre as idpadre")
                ->from("DatDocumentoPadre ddp")
                ->where("ddp.iddocumento = {$iddocumento}")
                ->fetchArray(array(), Doctrine_Core::HYDRATE_SCALAR);

        return array_map($extraer, $data);
    }

    public function getTotalPedidoBalanceo($datosDoc)
    {
        $sql = "
        SELECT
           (
          	 SELECT COALESCE(SUM(pbp.cantidadpedidos), 0)
             FROM mod_logdistribucion.dat_prodbalanceopedido pbp
             WHERE pbp.idproductobalanceo = pb.idproductosbalanceo
           ) as  totalpedidos
           from mod_logdistribucion.dat_productosbalanceo pb
           ";
        $where = " WHERE pb.iddocbalanceo = {$datosDoc['iddocumento']} and pb.idindicador = {$datosDoc['idindicador']}";
        $sql .= $where;
        $conn = Zend_Registry::get('conexion');
        $datos = $conn->fetchAll($sql);
        return $datos;
    }

    public function adicionarDocumentoBalanceo($datosBalanceo)
    {
        $datos = array();
        $datosDoc['iddocbalanceo'] = $datosBalanceo['iddocbalanceo'] ? $datosBalanceo['iddocbalanceo'] : null;
        $datosDoc['idbloqueousuario'] = $this->global->Perfil->idusuario;
        $datosDoc['estado'] = '2';
        $datosDoc['tipodestino'] = ($datosBalanceo['tipodestino']) ? $datosBalanceo['tipodestino'] : 3;
        $datosDoc['tipodistribucion'] = ($datosBalanceo['tipodistribucion']) ? $datosBalanceo['tipodistribucion'] : 6;
        foreach ($datosBalanceo['entidades'] as $identidad => $ent) {
            $datosDoc['idestructuracomun'] = $identidad;
            $objDocPrim = $this->documentosHelper->devuelveIddocByIdEstructura(
                'entregaLog', $identidad, LogisticaGlobal::SUBSISTEMA_DIST
            );
            $datosDoc['iddoc'] = $objDocPrim->iddoc;
            $datosCliente = null;
            foreach ($ent['clientes'] as $idcliente => $client) {
                $datosCliente['idcliente'][0] = array(
                    'idcliente' => $idcliente,
                    'tipocliente' => 3
                );
                $datosProd = null;
                foreach ($client['depositos'] as $iddeposito => $dep) {
                    $datosDoc['idestructuraop'] = $iddeposito;
                    foreach ($dep['productos'] as $idproducto => $prod) {
                        $datosProd['idproductos'][] = array(
                            'idproducto' => $idproducto,
                            'cantidad' => $prod['cantidad'],
                            'rotar' => $prod['rotar'],
                            'idpedido' => $prod['idpedido']
                        );
                    }
                }
                $datos[] = $this->adicionarDocBalanceo($datosDoc, $datosCliente, $datosProd);
            }
        }
        return $datos;
    }

    public function adicionarDocBalanceo($datosDoc, $datosCliente, $datosProd)
    {
        $documento = parent::adicionarDocumento($datosDoc);
        $distribucion = new DatDistribucion();
        $distribucion->synchronizeWithArray($datosDoc);
        $documento->DatDistribucion = $distribucion;
        $documento->save();
        if ($datosDoc['iddocbalanceo']) {
            $this->addPadre($datosDoc['iddocbalanceo'], $documento->iddocumento);
        }
        $this->adicionarClientesDocumento($documento->iddocumento, $datosCliente);
        $datosProd['iddocumento'] = $documento->iddocumento;
        $movs = $this->adicionarMovimientos($datosProd)['productos'];
        $resp = array();
        foreach ($movs as $mov){
            array_push($resp, array(
                'iddocumento' => $mov['idorden'],
                'idproducto' => $mov['idproducto'],
                'idcliente' => $mov['idcliente']
            ));
        }
        return $resp;
    }
}
