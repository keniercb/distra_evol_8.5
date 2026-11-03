<?php

/**
 * @class      PedidoModel
 * (Descripcion de la clase, objetivo)
 * @package    Distribucion
 * @subpackage Pedido
 * @author     Antonio Diaz Soutuyo
 * @copyright  XETID
 * @version    1.0
 */
class PedidoModel extends DocumentoLogisticaModel
{
    private $serviciosEstructuraComp;

    public function __construct($datosDoc = array())
    {
        parent::__construct($datosDoc);
        $this->serviciosEstructuraComp = ServiciosEstructuraComposicionHelper::__init();
        $relations[] = array(
            'cardinalidad' => 'one', 'relation' => 'DatPedido',
            'properties' => array('local' => 'iddocumento', 'foreign' => 'iddocumento')
        );
        $this->logisticaDoctrine->tryInyectRelactions(new DatDocumento(), $relations);
    }

    /**
     * Metodo para devolver los documentos de pedido
     * @params array $datosDoc Arreglo con los parametros para filtrar los documentos.
     * @return array
     */
    public function devolverDocumentos($datosDoc)
    {
        $configuracionHelper = ServiciosConfiguracionGeneralHelper::__init();
        if (!$datosDoc['distribucion']) {
            $idusuario = $configuracionHelper->getClienteProveedorByUser($this->global->Perfil->idusuario);
            $datosDoc['idcliente'] = is_numeric($idusuario) ? $idusuario : $datosDoc['idcliente'];

            if ($datosDoc['identidad']) {
                $datosDoc['idestructura'] = $datosDoc['identidad'];
                $objDocPrim = LogisticaDocumentosHelper::__init()
                    ->devuelveIddocByIdEstructura(
                        'pedido', $datosDoc['identidad'], LogisticaGlobal::SUBSISTEMA_INV
                    );
                if (!$objDocPrim->iddoc) {
                    return 1;
                }
                parent::setIdTipoDocumento('pedido', LogisticaGlobal::SUBSISTEMA_INV, $datosDoc['identidad']);
            }
        }
        $qDoc = parent::devolverDocumentos($datosDoc);

        //$qDoc->leftJoin('d.DatDocumentoPadre');
        $qDoc->leftJoin("d.DatDocumentoPadre dp ON (dp.iddocumento = d.iddocumento)");
        $qDoc->leftJoin("dp.DatDocumento ddpadre ON (ddpadre.iddocumento = dp.idpadre)");
        $qDoc->leftJoin("ddpadre.DatDocumentoprim dprim");
        $qDoc->leftJoin("dprim.NomDocprim ndprim");
        $qDoc->leftJoin("d.DatDocumentoprim dprimp");
        $qDoc->leftJoin("dprimp.NomDocprim ndprimp");

        $qDoc->addSelect('ddpadre.nrodoc as nroDoc, (case when dp.idpadre is not null then ndprim.denominacion else ndprimp.denominacion end) as tipoDoc, 
        (case when dp.idpadre is not null then ndprim.abreviatura else ndprimp.abreviatura end) as abreviaturatipoDoc');

        $relations[] = array(
            'cardinalidad' => 'one', 'relation' => 'DatPedido',
            'properties' => array('local' => 'iddocumento', 'foreign' => 'iddocumento')
        );
        $this->logisticaDoctrine->tryInyectRelactions(new DatDocumento(), $relations);
        $pedido = new DatPedido();
        $pedido->getJoinDatPedido($qDoc, 'd', 't', 'dpp');
        $pedido->getDatosPedido($qDoc, $datosDoc, 't', 'dpp');
        $datosDoc['fecha'] = $this->configuracionHelper->getFechaContableSubsistema(
            $this->idestructuracomun, $this->idSubsistema
        );
        $pedido->addFiltersQueryPedido($qDoc, $datosDoc, 'dpp', 't');
        $datosBusqueda = $this->logisticaDoctrine->addQueryLimits($qDoc, $datosDoc)->fetchArray();
        foreach ($datosBusqueda as $i => $datos){
            $isPedidoBalanceado = $this->isPedidoBalanceado($datos['iddocumento']);
            if(!empty($isPedidoBalanceado)){
                $datosBusqueda[$i]['balanceado'] = 1;
                $datosBusqueda[$i]['nrodocbalanceo'] = $isPedidoBalanceado[0]['nrodoc'];
            }else
                $datosBusqueda[$i]['balanceado'] = 0;
            $tienecapacidad = $this->tieneCapacidadliquida($datos['iddocumento']);
            if(!empty($tienecapacidad)){
                $datosBusqueda[$i]['capacidadliquida'] = 1;
            }else{
                $datosBusqueda[$i]['capacidadliquida'] = 0;
            }
            $datosBusqueda[$i]['denomtipopedido'] = '';
            if($datos['idnomconcepto']){
                $datosBusqueda[$i]['denomtipopedido'] = $this->getDenomNomConcepto($datos['idnomconcepto'])[0]['tipopedido'];
            }
            if($datos['abreviaturatipoDoc'] == 'ordenServicioLOG'){
                $datosBusqueda[$i]['denomtipopedido'] = $this->getDenomNomConceptoByAbreviatura($datos['abreviaturatipoDoc'])[0]['denominacion'];
            }
            if($datos['abreviaturatipoDoc'] == 'citasLog'){
                $datosBusqueda[$i]['denomtipopedido'] = $this->getDenomNomConceptoByAbreviatura($datos['abreviaturatipoDoc'])[0]['denominacion'];
            }
        }
        return array('cantidad' => $qDoc->count(), 'datos' => $this->cargarClientesDocumentos($datosBusqueda));
    }

    public function isPedidoBalanceado($idpedido)
    {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $sql= "SELECT d.*
                    FROM
                      mod_logistica.dat_documentopadre  dp
                      LEFT JOIN mod_logistica.dat_documento d on dp.iddocumento = d.iddocumento
                      where dp.idpadre = $idpedido and d.estado = 3
                    ;";
        return $conn->fetchAll($sql);
    }

    public function getDenomNomConcepto($idnomconcepto)
    {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $sql= "  SELECT 
                      nc.denominacion as tipopedido
                    FROM 
                      mod_logdistribucion.nom_concepto as nc
                      where nc.idnomconcepto = $idnomconcepto
                    ;";
        return $conn->fetchAll($sql);
    }

    public function getDenomNomConceptoByAbreviatura($abreviatura)
    {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $sql= "  SELECT 
                  nc.denominacion,nc.idnomconcepto
                FROM 
                  mod_datosmaestros.dat_documentoprim  dp
                  INNER JOIN mod_logdistribucion.nom_concepto nc on nc.iddoc = dp.iddoc
                  where dp.sigla ILIKE '%$abreviatura%';";
        return $conn->fetchAll($sql);
    }

    public function tieneCapacidadliquida($idpedido)
    {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $sql= "SELECT 
                  dcl.*
                FROM 
                  mod_logdistribucion.dat_productopedido dpp
                  INNER join mod_logistica.dat_documentocl dcl on dcl.iddocumento = dpp.idpedido
                  where dpp.idpedido = $idpedido;
                    ;";
        return $conn->fetchAll($sql);
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
     * Metodo para adicionar un documento de pedido
     * @return array
     */
    public function adicionarDocumento($datosDoc)
    {
        $idClientes = array(array('idcliente' => $datosDoc['idcliente'], 'tipocliente' => 1));
        if ($datosDoc['identidad']) {
            $datosDoc['idestructuracomun'] = $datosDoc['identidad'];
            parent::setIdTipoDocumento('pedido', LogisticaGlobal::SUBSISTEMA_INV, $datosDoc['identidad']);
        }
        $documento = parent::adicionarDocumento($datosDoc);
        $fecha = $this->configuracionHelper->getFechaContableSubsistemaObj($this->idestructuracomun, $this->idSubsistema);
        $documento->fechacontable = $fecha->fecha;
        $pedido = new DatPedido();
        if(is_numeric($datosDoc['denomtipopedido']))
            $datosDoc['idnomconcepto'] = $datosDoc['denomtipopedido'];
        $productoPedido = new DatProductopedido();
        if ($datosDoc['iddocumento']) {
            $pedido->assignIdentifier($datosDoc['iddocumento']);
        }
        //$datosDoc['capacidadliquida'] = ($datosDoc['capacidadliquida'] == 4 || $datosDoc['capacidadliquida'] == 1) ? 1 : 0;
        $pedido->synchronizeWithArray($datosDoc);
        $documento->DatPedido = $pedido;
        $documento->save();
        if ($datosDoc['documentos']) {
            $this->addPadre($datosDoc['documentos']['idpadre'], $documento->iddocumento);
        }
        parent::adicionarClientes($documento->iddocumento, $idClientes, true);
        foreach ($datosDoc['productosExtras'] as $objProductoPedido) {
            $productoPedido = new DatProductopedido();
            if ($objProductoPedido['idproductopedido']) {
                $productoPedido->assignIdentifier($objProductoPedido['idproductopedido']);
            }
            $objProductoPedido['idpedido'] = $documento->iddocumento;
            $objProductoPedido['idproducto'] = $objProductoPedido['idindicador'];
            $productoPedido->synchronizeWithArray($objProductoPedido);
            $productoPedido->save();
            if(!empty($objProductoPedido['idindicador'])){
                $this->eliminarCapacidadLiquida($documento->iddocumento,$objProductoPedido['idindicador']);
                $docCapacidadLiquida = new DatDocumentocl();
                if ($objProductoPedido['capacidadliquida']) {
                    $docCapacidadLiquida['iddocumento'] = $documento->iddocumento;
                    $docCapacidadLiquida['idindicador'] = $objProductoPedido['idindicador'];
                    $docCapacidadLiquida->save();
                }
            }
        }
        foreach ($datosDoc['serviciosExtras'] as $objServiciosPedido) {
            $servicioPedido = new DatProductopedido();
            if ($objServiciosPedido['idproductopedido']) {
                $servicioPedido->assignIdentifier($objServiciosPedido['idproductopedido']);
            }
            $objServiciosPedido['idpedido'] = $documento->iddocumento;
            $objServiciosPedido['servicio'] = 1;
            $servicioPedido->synchronizeWithArray($objServiciosPedido);
            $servicioPedido->save();
        }
        return array('iddocumento' => $documento->iddocumento, 'fechacontable' => $documento->fechacontable,
            'numeroref' => $documento->numeroref);
    }

    public function eliminarCapacidadLiquida($idpedido, $idindicador)
    {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $sql = "DELETE FROM 
                  mod_logistica.dat_documentocl 
                WHERE 
                  iddocumento = $idpedido
                  and idindicador= $idindicador
                ;";
        return $conn->fetchAll($sql);
    }

    public function reclamarPedido($params)
    {
        $reclamoPedido = new DatReclamopedido();
        $params['idtiporeclamoentidad'] = $params['idtiporeclamo'];
        $reclamoPedido->synchronizeWithArray($params);
        $reclamoPedido->save();
        return true;
    }

    public function adicionarProducto($params)
    {
        foreach ($params['productos'] as $producto) {
            $productoPedido = new DatProductopedido();
            $params['idproducto'] = $producto['idproducto'];
            $productoPedido->synchronizeWithArray($params);
            $productoPedido->save();
        }
        return true;
    }

    public function confirmarDocumento($iddocumento)
    {

        /*if ($this->clienteNovalido($iddocumento) > 0) {
            return 4;
        } else {*/
            if ($this->contarProductoServicio($iddocumento) == 0) {
                return 2;
            } elseif ($this->buscarProductoCero($iddocumento) == 0) {
                $documento = parent::confirmarDocumento($iddocumento);
                return $documento;
            } else {
                return 3;
            }
      //}
    }

    public function clienteNovalido($iddocumento)
    {
        $idcliente = $this->devolverDocumentos(
                array('iddocumento' => $iddocumento, 'identidad' => $this->idestructuracomun)
            )['datos'][0]['idcliente'];
        return $this->devolverDocumentos(
                array('identidad' => $this->idestructuracomun, 'idcliente' => $idcliente, 'distribucion' => true,
                    'estado' => 3, 'idejercicio' => ServiciosConfiguracionGeneralHelper::__init()
                        ->getEjercicioActualSubsistema(
                            $this->global->Estructura->idestructura, LogisticaGlobal::SUBSISTEMA_INV
                        ))
            )['cantidad'];
    }

    public function buscarProductoCero($iddocumento)
    {
        $queryVali = Doctrine_Query::create();
        return $queryVali->select("dpp.idproductopedido")
                ->from('DatProductopedido dpp')
                ->where('dpp.idpedido = ? and dpp.cantidad = 0 and dpp.servicio = 0', $iddocumento)
                ->count();
    }

    public function contarProductoServicio($iddocumento)
    {
        $queryVali = Doctrine_Query::create();
        return $queryVali->select("dpp.idproductopedido")
                ->from('DatProductopedido dpp')
                ->where('dpp.idpedido = ? ', $iddocumento)
                ->count();
    }

    public function cargarProductosExtras($params)
    {
        $dql = $this->devolverProductosExtrasXidPedido($params['idpedido']);
        $datosMaestros = new MaestroProductoModel();
        $datosMaestros->addQueryNomIndicador($dql, 'dpp', 'i', 'ih');
        $dql->addSelect('COALESCE(i.numeropieza, i.codigo) as codigo');
        if($params['dpl']){
            $dql->addSelect('(SELECT indp.preciodivisa FROM NomIndicadorplanif indp WHERE indp.idindicador = i.idindicador) as precioalternativo');
        }
        $importe = 0;
        if ($params['criterio'] && $params['criterio'] != '') {
            $dql->andWhere(
                "i.denominacion ilike '%{$params['criterio']}%' or i.codigo ilike '%{$params['criterio']}%'"
            );
        }
        $resp = LogisticaDoctrineHelper::__init()
            ->addQueryLimits($dql, $params)
            ->fetchArray();
        $resp = $this->comprobarExistenciaMaterial($resp);
        foreach ($resp as $key => $objProductos) {
            $importe += $objProductos['cantidad'] * $objProductos['precio'];
            if($objProductos['idindicador']){
                $compCapacidadLiq = $this->comprobarCapacidadLiquida($params['idpedido'], $objProductos['idindicador']);
                if(!empty($compCapacidadLiq)){
                    $resp[$key]['capacidadliquida'] = 1;
                }else{
                    $resp[$key]['capacidadliquida'] = 0;
                }
                $sustituto = $this->obtenerSustituto($params['idpedido'],$objProductos['idindicador']);
                if(!empty($sustituto)){
                    $resp[$key]['sustituto'] = $sustituto[0]['sustituto'];
                }else{
                    $resp[$key]['sustituto'] = '';
                }
            }

        }
        if ($dql->count() > 0) {
            $resp['0']['importeTotal'] = $importe;
        }//print_r($resp);die;
        return array('cantidad' => $dql->count(), 'datos' => $resp);
    }

    public function devolverProductosExtrasXidPedido($idpedido)
    {
        $query = new Doctrine_Query();
        return $query->select("dpp.idproductopedido, dpp.idproducto as idproducto, dpp.cantidad as cantidad")
                ->from('DatProductopedido dpp')
                ->where('dpp.idpedido = ? and dpp.servicio = 0 and dpp.contratado = 0', $idpedido);
    }

    public function comprobarExistenciaMaterial($parametros)
    {
        $structuras = $this->serviciosEstructuraComp->obtenerEstructurasNoFormales(false, null, false, null, null, null,
            -1);
        $idsEstructuras = array();
        foreach ($structuras as $struct) {
            $idsEstructuras[] = $struct['id'];
        }
        $aux = implode(',', $idsEstructuras);
        $conn = Zend_Registry::get('conexion');
        foreach ($parametros as $index => $obj) {
            if($obj['idproducto']){
                $sql = "select p.idindicador,sum(p.cantidad) as cantidad
                from mod_logistica.dat_producto p
                where p.idestructura IN($aux) and p.idindicador = {$obj['idproducto']}
                group by p.idindicador";
                $instancia = $conn->fetchAll($sql);
                if ($instancia[0]['cantidad'] > 0) {
                    $parametros[$index]['existe'] = 1;
                } else {
                    $parametros[$index]['existe'] = 0;
                }
            }
        }
        return $parametros;
    }

    public function comprobarCapacidadLiquida($idpedido, $idindicador)
    {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $sql = "SELECT *
                FROM mod_logistica.dat_documentocl 
                    where idindicador = $idindicador and iddocumento = $idpedido;";
        return $conn->fetchAll($sql);
    }

    public function obtenerSustituto($idpedido,$idindicador)
    {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $sql = "SELECT 
                 (i.numeropieza || ' - ' || i.denominacion) as sustituto
                FROM 
                  mod_logdistribucion.dat_productopedido pp
                  inner join mod_logistica.dat_documentopadre ddp on ddp.idpadre = pp.idpedido
                  inner join mod_logdistribucion.dat_productosbalanceo pb on ddp.iddocumento = pb.iddocbalanceo
                inner join mod_datosmaestros.nom_indicador i on i.idindicador = pb.idindicador
                  where pp.idpedido = $idpedido and pb.idindicadorasustituir = pp.idproducto and pb.idindicadorasustituir = $idindicador;";
        //print_r($sql);die;
        return $conn->fetchAll($sql);
    }

    public function cargarServiciosExtras($params)
    {
        $dql = $this->devolverServiciosExtrasXidPedido($params['idpedido']);
        $datosMaestros = new MaestroProductoModel();
        $datosMaestros->addQueryNomIndicador($dql, 'dpp', 'i', 'ih');
        if ($params['criterio'] && $params['criterio'] != '') {
            $dql->andWhere(
                "i.denominacion ilike '%{$params['criterio']}%' or i.codigo ilike '%{$params['criterio']}%'"
            );
        }
        $resp = LogisticaDoctrineHelper::__init()
            ->addQueryLimits($dql, $params)
            ->fetchArray();
        if ($dql->count() > 0) {
            $importe = 0;
            foreach ($dql->fetchArray() as $objProductos) {
                $importe += $objProductos['precio'];
            }
            $resp['0']['importeTotal'] = $importe;
        }
        return array('cantidad' => $dql->count(), 'datos' => $resp);
    }

    public function devolverServiciosExtrasXidPedido($idpedido)
    {
        $query = new Doctrine_Query();
        return $query->select("dpp.idproductopedido, dpp.idproducto as idproducto")
                ->from('DatProductopedido dpp')
                ->where('dpp.idpedido = ? and dpp.servicio = 1 and dpp.contratado = 0', $idpedido);
    }

    public function eliminarProducto($idProductos)
    {
        $query = Doctrine_Query::create();
        $query->delete()
            ->from('DatProductopedido')
            ->whereIn('idproductopedido', $idProductos['arrayData'])
            ->execute();
        return true;
    }

    public function eliminarReclamo($params)
    {
        $query = Doctrine_Query::create();
        $query->delete()
            ->from('DatReclamopedido')
            ->whereIn('idreclamopedido', $params['arrayData'])
            ->execute();
        return true;
    }

    public function devolverDocPedido()
    {
        $query = Doctrine_Query::create();
        return $query->select(
                    "dp.iddocumento, dp.fechavencimiento as fechavencimiento, dp.idcontrato as idcontrato" .
                    ", dpp.idproducto as idproducto, dpp.cantidad as cantidad"
                )
                ->from('DatPedido dp')
                ->innerJoin('dp.DatProductopedido dpp')
                ->execute();
    }

    public function cargarReclamos($params)
    {
        $query = new Doctrine_Query();
        $query->select(
                "drp.idreclamopedido, ntr.denominacion as tiporeclamo, drp.descripcion as descripcion," .
                "drp.fechasugerida as fechasugerida"
            )
            ->from('DatReclamopedido drp')
            ->innerJoin('drp.NomTiporeclamo ntr')
            ->where('drp.idpedido = ? ', $params['idpedido']);
        if ($params['criterio'] && $params['criterio'] != '') {
            $query->andWhere(
                "ntr.denominacion ilike '%{$params['criterio']}%' or drp.descripcion ilike '%{$params['criterio']}%'"
            );
        }
        return array('cantidad' => $query->count(), 'datos' => LogisticaDoctrineHelper::__init()
                ->addQueryLimits($query, $params)
                ->fetchArray());
    }

    public function productosByidPedido($idpedido, $servicio)
    {
        $query = new Doctrine_Query();
        if (is_array($idpedido)) {
            $query->select(
                    "
                 dpp.idproducto as idindicador,
                 sum(dpp.cantidad) as cantidad,
                 sum(dpp.distribuido) as distribuido
                "
                )
                ->from('DatProductopedido dpp')
                ->where('dpp.servicio = ?', $servicio)
                ->andWhereIn('dpp.idpedido', $idpedido)
                ->groupBy('dpp.idproducto');
        } else {
            $query->select("dpp.idproducto as idindicador, dpp.cantidad as cantidad, dpp.distribuido as distribuido")
                ->from('DatProductopedido dpp')
                ->where('dpp.idpedido = ?', $idpedido)
                ->addWhere('dpp.servicio = ?', $servicio);
        }
        return array('cantidad' => $query->count(), 'datos' => $query->fetchArray());
    }

    public function cargarClientes($parametros)
    {
        $servicioConfiguracion = ServiciosConfiguracionGeneralHelper::__init();
        $idcliente = $servicioConfiguracion->getClienteProveedorByUser($this->global->Perfil->idusuario);
        $filtro = array();
        $filtro['nombre'] = $parametros['query'];
        $clientes = $servicioConfiguracion->getClientesProveedorByParams(
            $idcliente, $this->global->Estructura->idestructura, true, true, false, $filtro, $parametros['start'],
            $parametros['limit']
        );
        return $clientes;
    }

    public function cargarClientesAprobados()
    {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $sql = "SELECT mod_logistica.dat_documentocliente.idcliente, mod_logistica.dat_documento.iddocumento, mod_logistica.dat_documentocliente.tipocliente
              FROM mod_logistica.dat_documento
              INNER JOIN mod_logistica.dat_documentocliente
              ON (mod_logistica.dat_documento.iddocumento = mod_logistica.dat_documentocliente.iddocumento)
              INNER JOIN mod_logdistribucion.dat_pedido
              ON (mod_logistica.dat_documento.iddocumento = mod_logdistribucion.dat_pedido.iddocumento)
              WHERE mod_logistica.dat_documento.estado = 3 AND mod_logdistribucion.dat_pedido.iddocumento
              GROUP BY mod_logistica.dat_documentocliente.idcliente, mod_logistica.dat_documento.iddocumento, mod_logistica.dat_documentocliente.tipocliente";
        return $conn->fetchAll($sql);
    }

    public function cerrarPedido($iddocumento)
    {
        $estadoModel = new EstadoDocumentoModel();
        $estadoModel->setEstadoDocumento($iddocumento, EstadoDocumentoModel::ESTADO_CERRADO);
        return true;
    }

    public function aprobarDistribucion($params)
    {
        if ($params['salida']) {
            $queryEstado = Doctrine_Query::create()
                ->set('estado', $params['estadonuevo'])
                ->update('DatProductopedido')
                ->where("idpedido =?", $params['idpedido'])
                ->addWhere('idproducto = ?', $params['idproducto'])
                ->execute();
        } else {
            $cantidad = $this->cantidadRestante($params);
            if ($cantidad[0]['estadopedido'] == 1) {
                $queryEstado = Doctrine_Query::create()
                    ->set('estado', 3)
                    ->update('DatProductopedido')
                    ->where("idproductopedido =?", $cantidad[0]['idproductopedido'])
                    ->execute();
            }
            $query = Doctrine_Query::create()
                ->update('DatProductopedido')
                ->where("idproductopedido =?", $cantidad[0]['idproductopedido']);
            if ($cantidad[0]['cantidad'] - ($cantidad[0]['distribuido'] + $params['cantidad']) < 0) {
                throw new LogisticaException('LOG_LB_PED_001');
            } else {
                if ($cantidad[0]['cantidad'] - ($cantidad[0]['distribuido'] + $params['cantidad']) == 0) {
                    $query->set('distribuido', $cantidad[0]['cantidad']);
                } else {
                    $query->set('distribuido', $cantidad[0]['distribuido'] + $params['cantidad']);
                }
            }
            $query->execute();
        }

        return true;
    }

    public function cantidadRestante($params)
    {
        $logistaProducto = new LogisticaProductoModel();
        $producto = $logistaProducto->getDatosProducto($params['idproducto']);
        $queryDist = Doctrine_Query::create();
        $queryDist->select("dpp.idproductopedido as idproductopedido, round(dpp.distribuido) as distribuido,
        round(dpp.cantidad) as cantidad, dpp.estado as estadopedido")
            ->from('DatProductopedido dpp')
            ->where('dpp.idpedido = ?', $params['idpedido'])
            ->addWhere('dpp.idproducto = ?', $producto['idindicador']);
        return $queryDist->fetchArray();
    }

    public function devolverDatProductoPedido($idpedido)
    {
        $query = Doctrine_Query::create();
        return $query->select("dpp.idproductopedido, dpp.idproducto as idproducto")
                ->from('DatProductopedido dpp')
                ->where('dpp.idpedido = ?', $idpedido)
                ->fetchArray();
    }

    public function copiarDocumento($iddocumento, $sameDoc = false, $cancelSigno = false)
    {
        $idCopia = parent::copiarDocumento($iddocumento, $sameDoc, $cancelSigno);
        $pedido = Doctrine::getTable('DatPedido')
            ->find($iddocumento);
        $nuevoDoc = $pedido->copy();
        $datos = $pedido->toArray();
        $datos['iddocumento'] = $idCopia;
        $nuevoDoc->synchronizeWithArray($datos);
        $nuevoDoc->save();
        $documentoCliente = Doctrine::getTable('DatDocumentoCliente')
            ->findByDql('iddocumento = ?', array($iddocumento))
            ->getFirst();
        $nuevoDocCliente = $documentoCliente->copy();
        $datosCliente = $documentoCliente->toArray();
        $datosCliente['iddocumento'] = $idCopia;
        $nuevoDocCliente->synchronizeWithArray($datosCliente);
        $nuevoDocCliente->save();
        $proPedidos = $this->devolverDatProductoPedido($iddocumento);
        foreach ($proPedidos as $objProductoPedido) {
            $productoPedido = Doctrine::getTable('DatProductopedido')
                ->find($objProductoPedido['idproductopedido']);
            $nuevoProductoPedido = $productoPedido->copy();
            $datosProductoPedido = $productoPedido->toArray();
            $datosProductoPedido['idpedido'] = $idCopia;
            $datosProductoPedido['estado'] = 1;
            $nuevoProductoPedido->synchronizeWithArray($datosProductoPedido);
            $nuevoProductoPedido->save();
        }
        return $nuevoDoc->iddocumento;
    }

    public function getEntidades()
    {
        $composicion = ServiciosEstructuraComposicionHelper::__init();
        $datos = $composicion->getEntidadesByDominio($this->global->Perfil->iddominio);
        $servicioConfiguracion = ServiciosConfiguracionGeneralHelper::__init();
        if (!is_numeric($servicioConfiguracion->getClienteProveedorByUser($this->global->Perfil->idusuario))) {
            $datos[0]['entidadunica'] = $this->global->Estructura->idestructura;
        }
        return $datos;
    }

    public function cargarProductosEstadoEjecucion($datosDoc)
    {
        $entregado = "coalesce((SELECT sum(pcto1.entregado) FROM DatProdordencmpto pcto1
            LEFT JOIN pcto1.DatProdorden dpo1
            LEFT JOIN dpo1.DatDistribucion dd1
            LEFT JOIN dd1.DatDistribucionpedido ddp1
            LEFT JOIN ddp1.DatPedido dp1
            LEFT JOIN dp1.DatProductopedido dpp1
            LEFT JOIN dpo1.DatProductoLogistica p1
            WHERE ddp1.idpedido = {$datosDoc['iddocumento']} and p1.idindicador = dpp1.idproducto and dpp.idproducto =
            p1.idindicador
            GROUP BY dp1.iddocumento),0) as entregado";

        $enproceso = "coalesce((SELECT sum(pcto2.enproceso) FROM DatProdordencmpto pcto2
            LEFT JOIN pcto2.DatProdorden dpo2
            LEFT JOIN dpo2.DatDistribucion dd2
            LEFT JOIN dd2.DatDistribucionpedido ddp2
            LEFT JOIN ddp2.DatPedido dp2
            LEFT JOIN dp2.DatProductopedido dpp2
            LEFT JOIN dpo2.DatProductoLogistica p2
            WHERE ddp2.idpedido = {$datosDoc['iddocumento']} and p2.idindicador = dpp2.idproducto and dpp.idproducto =
            p2.idindicador
            GROUP BY dp2.iddocumento),0) as enproceso";

        $subCantidad = "(SELECT dpp5.cantidad FROM DatProductopedido dpp5 "
            . "where dpp5.idproductopedido = dpp.idproductopedido )";
        $noprocesado = "coalesce((SELECT ({$subCantidad} - sum(pcto3.enproceso + pcto3.entregado))
            FROM DatProdordencmpto pcto3
            LEFT JOIN pcto3.DatProdorden dpo3
            LEFT JOIN dpo3.DatDistribucion dd3
            LEFT JOIN dd3.DatDistribucionpedido ddp3
            LEFT JOIN ddp3.DatPedido dp3
            LEFT JOIN dp3.DatProductopedido dpp3
            LEFT JOIN dpo3.DatProductoLogistica p3
            WHERE ddp3.idpedido = {$datosDoc['iddocumento']} and p3.idindicador = dpp3.idproducto and dpp.idproducto =
            p3.idindicador
            GROUP BY dp3.iddocumento),0) as noprocesado";
        $subCant = "(SELECT dpp6.cantidad FROM DatProductopedido dpp6 "
            . "where dpp6.idproductopedido = dpp.idproductopedido )";
        $porciento = "coalesce((SELECT (sum(pcto4.entregado)*100/{$subCant})
            FROM DatProdordencmpto pcto4
            LEFT JOIN pcto4.DatProdorden dpo4
            LEFT JOIN dpo4.DatDistribucion dd4
            LEFT JOIN dd4.DatDistribucionpedido ddp4
            LEFT JOIN ddp4.DatPedido dp4
            LEFT JOIN dp4.DatProductopedido dpp4
            LEFT JOIN dpo4.DatProductoLogistica p4
            WHERE ddp4.idpedido = {$datosDoc['iddocumento']} and p4.idindicador = dpp4.idproducto and dpp.idproducto =
            p4.idindicador
            GROUP BY dp4.iddocumento),0) as porciento";
        $query = Doctrine_Query::create()
            ->select(
                "dpp.idproductopedido,
                dpp.cantidad as cantidad,
                dc.idcliente as idcliente,
                dc.tipocliente as tipocliente"
            )
            ->addSelect($entregado)
            ->addSelect($porciento)
            ->addSelect($noprocesado)
            ->addSelect($enproceso)
            ->from('DatProductopedido dpp')
            ->innerJoin("dpp.DatPedido dp")
            ->innerJoin("dp.DatDocumento d")
            ->innerJoin("d.DatDocumentoCliente dc")
            ->leftJoin("dp.DatDistribucionpedido ddp")
            ->leftJoin("ddp.DatDistribucion dd")
            ->leftJoin("dd.DatProdorden dpo")
            ->leftJoin("dpo.DatProdordencmpto pcto")
            ->leftJoin("dpo.DatProductoLogistica p")
            ->where('dpp.idpedido = ?', array($datosDoc['iddocumento']));
        $maestroProductos = new MaestroProductoModel();
        $maestroProductos->addQueryNomIndicador($query, 'dpp', 'i', 'ih');
        $this->configuracionHelper->getQueryJoinUnidadMedida(
            $query, 'p', 'um', 'um.abreviaturaunidadmedida as umedida', 'um.decimales as decimales', 'leftJoin'
        );
        $datosAux = Doctrine_Query::create()
            ->select(
                'pcto.idprodorden, dp.iddocumento, dpp.idproductopedido,
                dd.iddistribucion, ddp.iddistribucionpedido,
                dpo.idproducto, dpp.cantidad as cantidad,
                count(CASE WHEN pcto.entregado = dpp.cantidad THEN pcto.idprodorden END) as cantcmplto,
                count(CASE WHEN pcto.entregado > 0 THEN pcto.idprodorden END) as cantcmpltoparcial'
            )
            ->from('DatProductopedido dpp')
            ->innerJoin("dpp.DatPedido dp")
            ->innerJoin("dp.DatDocumento d")
            ->leftJoin("d.DatDocumentoCliente dc")
            ->leftJoin("dp.DatDistribucionpedido ddp")
            ->leftJoin("ddp.DatDistribucion dd")
            ->leftJoin("dd.DatProdorden dpo")
            ->leftJoin("dpo.DatProdordencmpto pcto")
            ->leftJoin("dpo.DatProductoLogistica p")
            ->where('dp.iddocumento = ?', array($datosDoc['iddocumento']))
            ->groupBy(
                'dpo.idprodorden, pcto.idprodorden, dd.iddistribucion, ddp.iddistribucionpedido,
                                dp.iddocumento, dpp.idproductopedido'
            )
            ->fetchArray();
        $cantidad = $query->count();
        $datos = $this->cargarClientesDocumentos(
            $this->logisticaDoctrine->addQueryLimits($query, $datosDoc)
                ->fetchArray()
        );
        $porcientoTotal = 0;
        $servicioConfiguracion = ServiciosConfiguracionGeneralHelper::__init();
        if ($datosDoc['idcliente']) {
            $clientes = $servicioConfiguracion->getClientesProveedorByParams(
                $datosDoc['idcliente'], $this->global->Estructura->idestructura, true, true, false, null, null, null
            );
            foreach ($datos as &$prod) {
                $prod['cliente'] = $clientes['datos'][0]['nombre'];
                $prod['idcliente'] = $clientes['datos'][0]['idclientesproveedores'];
                $porcientoTotal += $prod['porciento'];
            }
        } else {
            foreach ($datos as &$prod) {
                $porcientoTotal += $prod['porciento'];
            }
        }
        return array('cantidad' => $cantidad, 'datos' => $datos,
            'cantcumpltotal' => $datosAux[0]['cantcmplto'], 'cantcumplparc' => $datosAux[0]['cantcmpltoparcial'],
            'porcientocumplimiento' => $porcientoTotal / $cantidad);
    }

    /**
     * Metodo para devolver los documentos de pedido que fueron generado por orden de trabajo
     * @params array $datosDoc Arreglo con los parametros para filtrar los documentos.
     * @return array
     */
    public function cargarPedidoByOrdenTrabajo($datosDoc, $dql = false)
    {
        if ($datosDoc['identidad']) {
            $objDocPrim = LogisticaDocumentosHelper::__init()
                ->devuelveIddocByIdEstructura(
                'pedido', $datosDoc['identidad'], LogisticaGlobal::SUBSISTEMA_INV
            );
            if (!$objDocPrim) {
                return 1;
            }
            parent::setIdTipoDocumento('pedido', LogisticaGlobal::SUBSISTEMA_INV, $datosDoc['identidad']);
        }
        $query = parent::devolverDocumentos($datosDoc);
        $query->innerJoin("d.DatPedido t")
            ->leftJoin("t.DatProductopedido dpp");
        $query->addSelect(
            "t.fechavencimiento as fechavencimiento,
             t.idcontrato as idcontrato,
             t.iddocumento"
        );
        $query->addSelect("(SELECT COUNT(dpps.idproductopedido) as cantprod FROM DatProductopedido dpps WHERE dpps.idpedido = d.iddocumento) as cantprod");

        $query->addWhere('d.estado IN (3)');
        return $query;
    }

    /**
     * Metodo para adicionar un nuevo pedido
     * @return array
     */
    public function adicionarPedido($datosDoc)
    {
        $idClientes = array(array('idcliente' => $datosDoc['idcliente'], 'tipocliente' => 1));
        if ($datosDoc['identidad']) {
            $datosDoc['idestructuracomun'] = $datosDoc['identidad'];
            parent::setIdTipoDocumento('pedido', LogisticaGlobal::SUBSISTEMA_INV, $datosDoc['identidad']);
        }
        $documento = parent::adicionarDocumento($datosDoc);
        $pedido = new DatPedido();
        if ($datosDoc['iddocumento']) {
            $pedido->assignIdentifier($datosDoc['iddocumento']);
        }
        $pedido->synchronizeWithArray($datosDoc);
        $documento->DatPedido = $pedido;
        $documento->save();
        parent::adicionarClientes($documento->iddocumento, $idClientes, true);
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        $conn->beginTransaction();
        foreach ($datosDoc['productosExtras'] as $pp) {
            $conn->execute("INSERT INTO mod_logdistribucion.dat_productopedido (idpedido, idproducto, cantidad)
                                    VALUES ({$documento->iddocumento},{$pp['idproducto']},{$pp['cantidad']})");
        }
        foreach ($datosDoc['serviciosExtras'] as $sp) {
            $conn->execute("INSERT INTO mod_logdistribucion.dat_productopedido (idpedido, idproducto, cantidad, servicio)
                                    VALUES ({$documento->iddocumento},{$sp['idproducto']},{$sp['cantidad']}, 1)");
        }
        $conn->commit();
        return $documento->iddocumento;
    }

    public function getEstadoEjecucionPedido($datosDoc)
    {
        $query = new Doctrine_Query();
        $query->addSelect(
            'd.nrodoc as nrodoc, d.numeroref as numeroref, d.estado as estado, d.fechacontable, dc.idcliente as idcliente, '
            . 'dc.tipocliente AS tipocliente, dc.iddocumentocliente as iddocumentocliente, '
            . 'ndp.denominacion as tipodocumento'
        )
            ->from("DatDocumento d")
            ->innerJoin("d.DatDocumentoCliente dc")
            ->innerJoin("d.DatDocumentoprim ddp")
            ->innerJoin("ddp.NomDocprim ndp")
            ->whereIn("d.estado", array(3));
        $query->innerJoin("d.DatDocumentoPadre dp")
            ->addWhere("dp.idpadre = ?", array($datosDoc['iddocumento']));
        return $query;
    }
//Importar
public function importarFichero($file, $params)
    {
        $error = $file['error'];
        Doctrine_Query::create()->delete('DatImppedido')->where('iddocumento = ?', $params['iddocumento'])->execute();
        $collection = new Doctrine_Collection('DatImppedido');
        $collection->synchronizeWithArray($file['productos']);
        $collection->save();
        if (!$error) {
            $sql = "SELECT * FROM mod_logdistribucion.f_importapedido({$params['iddocumento']}) q;";
            // Productos con tarjeta creada. Error 1.
            // Productos duplicados. Error 3.
            // Codigo producto nulo. Error 4.
            // Fecha mayor a la actual. Error 6.
            // Fecha no valida. Error 7.
            $result = Doctrine_Manager::connection()->fetchOne($sql);
        }
        if (!$error && substr_count($result, '1') > 0) {
            $error = 1;
        }
        /*$cont = substr_count($result, ',');
        if ((!$error && $cont > 0) || ($error == 1 && $cont > 1)) {
            $error = 2;
        }*/
        $sql = "SELECT count(idmovimiento) AS cantidad FROM mod_logistica.dat_movimiento WHERE iddocumento = ?";
        $prod = Doctrine_Manager::connection()->fetchRow($sql, array($params['iddocumento']));
        if (!$error && $collection->count() == $prod['cantidad']) {
            Doctrine_Query::create()->delete('DatImppedido')->where('iddocumento = ?', $params['iddocumento'])
                ->execute();
        }
        //print_r(array($collection->count(),  $prod['cantidad'], $collection->toArray(), $error));die;
        return array(
            'total' => $collection->count(), 'cantidad' => $prod['cantidad'], 'datos' => $collection->toArray(),
            'error' => $error
        );
    }

    public function sincronizarArray($datos, $params)
    {
        $campos = array(
            'nombrecliente','codigoproducto',
            'descripcionproducto', 'clasificacioncontable', 'um', 'cantidad', 'precio', 'importe', 'fechavencimiento'
        );
        $productos = array();
        foreach ($datos as $index => $item) {
            if ($index > 0) {
                $prod = array();
                foreach ($item as $key => $value) {
                    $value = trim($value);
                    if (substr_count($campos[$key], 'fecha') > 0 && $value) {
                        $temp = null;
                        $temp = explode('-', $value);
                        if (substr_count($value, '/')) {
                            $temp = explode('/', $value);
                        }
                        if (!checkdate($temp[0], $temp[1], $temp[2])) {
                            $error = 7;
                            $prod['errorfecha'] = $this->getError($campos[$key]) . ' ';
                            continue;
                        }
                        $date = new DateTime();
                        if (substr_count($value, '-')) {
                            $date = $date->createFromFormat('m-d-y', $value);
                        } else {
                            $date = $date->createFromFormat('m/d/y', $value);
                        }
                        $value = $date->format('d/m/Y');
                    }
                    if ($value && (substr_count($campos[$key], 'cantidad') || substr_count($campos[$key], 'precio') ||
                        substr_count($campos[$key], 'importe'))) {
                        $value = str_replace(',', '', $value);
                    }
                    $prod[$campos[$key]] = $value ? $value : null;
                }
                $prod['nro'] = $index + 1;
                $prod['iddocumento'] = $params['iddocumento'];
                $productos[] = $prod;
            }
        }
        return array('productos' => $productos, 'error' => $error);
    }
    public function cargarProductoError($filtro)
    {
        $selectD = "(SELECT (count(_a.codigoproducto) > 1) AS duplicado FROM mod_logdistribucion.dat_imppedido _a "
            . "WHERE _a.iddocumento = a.iddocumento AND (_a.codigoproducto is not null and _a.fechavencimiento is not null) "
            . "AND _a.codigoproducto = a.codigoproducto GROUP BY _a.codigoproducto LIMIT 1)";
        $whereD = str_replace('_a', '_a2', $selectD);
        
        $selectF = "(a.fechavencimiento > current_date AND a.fechavencimiento IS NOT NULL) AS actualp";
        $whereF = "(a.fechavencimiento > current_date and a.fechavencimiento IS NOT NULL)";
        
        $sqlCant = "a.cantidad > 0 AND a.fechavencimiento IS NULL";
        
        $sql = "SELECT a.*, (CASE WHEN {$sqlCant} THEN true END) AS sinfecha, "
            . "{$selectD} AS duplicado, {$selectF} FROM mod_logdistribucion.dat_imppedido a "
            . "WHERE a.iddocumento = ? AND (({$sqlCant}) OR a.codigoproducto IS NULL "
            . "OR a.errorfecha IS NOT NULL OR {$whereD} = true OR {$whereF}) "
            . "ORDER BY a.idimppedido";
        $cantidad = count(Doctrine_Manager::connection()->fetchAll($sql, array($filtro['iddocumento'])));
        return array(
            'cantidad' => $cantidad,
            'datos' => Doctrine_Manager::connection()
                ->fetchAll($sql . " OFFSET {$filtro['start']} LIMIT {$filtro['limit']}", array($filtro['iddocumento']))
        );
    }
    private function getError($campo)
    {
        switch ($campo) {
            case 'fechafabricacion':
                return 1;
            case 'fechavencimiento':
                return 2;
            case 'fechaproduccion':
                return 3;
            default:
                return 4;
        }
    }
    
    public function eliminarImportar($iddocumento)
    {
        Doctrine_Query::create()->delete('DatImppedido')->where('iddocumento = ?', $iddocumento)->execute();
    }


    public function getTipoPedido(){
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $query = "SELECT 
                      nc.idnomconcepto,nc.denominacion as denomtipopedido
                    FROM 
                      mod_logdistribucion.nom_concepto as nc
                      INNER JOIN mod_datosmaestros.dat_documentoprim as ddp ON nc.iddoc = ddp.iddoc
                      INNER JOIN mod_datosmaestros.nom_docprim as ndp on ddp.iddocumentos = ndp.iddocumentos
                      where ndp.abreviatura = 'pedido' ;";
        $pedidos = $conn->fetchAll($query);
        return $pedidos;
    }

    public function cargarTrazabilidad($iddocumento){
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $query = "select (d.nrodoc || ' - ' || d.fechacontable) as datos,
                (dd.nrodoc || ' - ' || dd.fechacontable|| ' - ' || nd.denominacion|| ' - ' || 
                    dd.iddocumento|| ' - ' || dd.estado|| ' - ' || dd.numeroref) as origen,
                array_agg(h1.nrodoc || ' - ' || h1.fechacontable|| ' - ' || nd1.denominacion|| ' - ' || 
                            h1.iddocumento|| ' - ' || h1.estado|| ' - ' || h1.numeroref) as hijo1,
                array_agg(coalesce(h2.nrodoc,0) || ' - ' || h2.fechacontable|| ' - ' || nd2.denominacion|| ' - ' || 
                            h2.iddocumento|| ' - ' || h2.estado|| ' - ' || h2.numeroref)  as hijo2,
                array_agg(h3.nrodoc || ' - ' || h3.fechacontable|| ' - ' || nd3.denominacion|| ' - ' || 
                            h3.iddocumento|| ' - ' || h3.estado|| ' - ' || h3.numeroref)  as hijo3,
                array_agg(h4.nrodoc || ' - ' || h4.fechacontable|| ' - ' || nd4.denominacion|| ' - ' ||
                            h4.iddocumento|| ' - ' || h4.estado|| ' - ' || h4.numeroref)  as hijo4,                            
                d.nrodoc as nroDoc, d.fechacontable as fechacreacion,
                (case when dp.idpadre is not null then nd.denominacion else ndprimp.denominacion end) as tipoDoc,
                (case when dp.idpadre is not null then nd.abreviatura else ndprimp.abreviatura end) as abreviaturatipoDoc
                      
                from mod_logistica.dat_documento d
                                
                left join mod_logistica.dat_documentopadre dp ON dp.iddocumento = d.iddocumento
                left join mod_logistica.dat_documento dd on dp.idpadre = dd.iddocumento
                left join mod_datosmaestros.dat_documentoprim dcp on dcp.iddoc = dd.iddoc
                left join mod_datosmaestros.nom_docprim nd on nd.iddocumentos = dcp.iddocumentos
                left join mod_datosmaestros.dat_documentoprim dprimp on dprimp.iddoc = d.iddoc
                left join mod_datosmaestros.nom_docprim ndprimp on ndprimp.iddocumentos = dprimp.iddocumentos
                
                left join mod_logistica.dat_documentopadre p1 ON p1.idpadre = d.iddocumento
                left join mod_logistica.dat_documento h1 on h1.iddocumento = p1.iddocumento
                left join mod_datosmaestros.dat_documentoprim dcp1 on dcp1.iddoc = h1.iddoc
                left join mod_datosmaestros.nom_docprim nd1 on nd1.iddocumentos = dcp1.iddocumentos
                
                left join mod_logistica.dat_documentopadre p2 ON p2.idpadre = h1.iddocumento
                left join mod_logistica.dat_documento h2 on h2.iddocumento IN (p2.iddocumento)
                left join mod_datosmaestros.dat_documentoprim dcp2 on dcp2.iddoc = h2.iddoc
                left join mod_datosmaestros.nom_docprim nd2 on nd2.iddocumentos = dcp2.iddocumentos
                
                left join mod_logistica.dat_documentopadre p3 ON p3.idpadre = h2.iddocumento
                left join mod_logistica.dat_documento h3 on h3.iddocumento = p3.iddocumento
                left join mod_datosmaestros.dat_documentoprim dcp3 on dcp3.iddoc = h3.iddoc
                left join mod_datosmaestros.nom_docprim nd3 on nd3.iddocumentos = dcp3.iddocumentos
                
                left join mod_logistica.dat_documentopadre p4 ON p4.idpadre = h3.iddocumento
                left join mod_logistica.dat_documento h4 on h4.iddocumento = p4.iddocumento
                left join mod_datosmaestros.dat_documentoprim dcp4 on dcp4.iddoc = h4.iddoc
                left join mod_datosmaestros.nom_docprim nd4 on nd4.iddocumentos = dcp4.iddocumentos
                
                where d.iddocumento = $iddocumento
                group by d.nrodoc,d.fechacontable,dd.nrodoc,dd.fechacontable,
                    dd.estado,dd.numeroref,nd.denominacion,dd.iddocumento,dp.idpadre,ndprimp.denominacion,nd.abreviatura,
                    ndprimp.abreviatura";
        $datosTrazabilidad = $conn->fetchAll($query);
        return $datosTrazabilidad;
    }

    public function datosDocumento($iddocumento){
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $query = "select
                (case when dp.idpadre is not null then nd.abreviatura else nd.abreviatura end) as abreviaturatipoDoc        
                from mod_logistica.dat_documento d                                
                left join mod_logistica.dat_documentopadre dp ON dp.iddocumento = d.iddocumento
                left join mod_logistica.dat_documento dd on dp.idpadre = dd.iddocumento
                left join mod_datosmaestros.dat_documentoprim dcp on dcp.iddoc = dd.iddoc
                left join mod_datosmaestros.nom_docprim nd on nd.iddocumentos = dcp.iddocumentos
                where d.iddocumento = $iddocumento
                group by dp.idpadre,nd.abreviatura";
        $datosTrazabilidad = $conn->fetchAll($query);
        return $datosTrazabilidad;
    }

    public function datosDocumentoOrigen($iddocumento){
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $sql= "SELECT d.iddocumento, d.nrodoc, d.idestructuracomun, d.estado,d.observaciones,
                      (Select his.fecha from mod_logistica.his_bitacora his 
                      where his.operacion ilike 'Documento confirmado' and his.iddocumento = d.iddocumento limit 1) as fechaconfirmado,
                      (Select his.fecha from mod_logistica.his_bitacora his 
                      where his.operacion ilike 'Documento aprobado' and his.iddocumento = d.iddocumento limit 1) as fechaaprobado,
                      (Select his.fecha from mod_logistica.his_bitacora his 
                      where his.operacion ilike 'Clientes adicionados' and his.iddocumento = d.iddocumento limit 1) as fechacreacion
                        FROM mod_logistica.dat_documentopadre  dp
                        LEFT JOIN mod_logistica.dat_documento d on dp.idpadre = d.iddocumento
                        where dp.iddocumento = $iddocumento               
                    ;";
        $datosBalanceo = $conn->fetchAll($sql);
        return $datosBalanceo;
    }

    public function datosPedido($iddocumento){
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $sql= "SELECT d.iddocumento, d.nrodoc, d.idestructuracomun, d.estado,
                      (Select his.fecha from mod_logistica.his_bitacora his 
                      where his.operacion ilike 'Documento confirmado' and his.iddocumento = $iddocumento limit 1) as fechaconfirmado,
                      (Select his.fecha from mod_logistica.his_bitacora his 
                      where his.operacion ilike 'Documento aprobado' and his.iddocumento = $iddocumento limit 1) as fechaaprobado,
                      (Select his.fecha from mod_logistica.his_bitacora his 
                      where his.operacion ilike 'Clientes adicionados' and his.iddocumento = $iddocumento limit 1) as fechacreacion
                        FROM mod_logistica.dat_documento d
                          where d.iddocumento = $iddocumento                  
                    ;";
        $datosBalanceo = $conn->fetchAll($sql);
        return $datosBalanceo;
    }

    public function getProductosPedido($idpedido){
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $query = "SELECT 
                      i.codigo, i.denominacion, i.precio, um.abreviaturaunidadmedida as umedida, p.cantidad
                    FROM 
                      mod_logdistribucion.dat_productopedido p
                      left join mod_datosmaestros.nom_indicador i on (i.idindicador = p.idproducto)
                      left join mod_datosmaestros.nom_unidadmedida um on (um.idunidadmedida = i.idumedida)
                      where p.idpedido = $idpedido;";
        $datosTrazabilidad = $conn->fetchAll($query);
        return $datosTrazabilidad;
    }

    public function datosBalanceo($iddocumento){
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $sql= "SELECT d.iddocumento, d.nrodoc, d.idestructuracomun, d.estado,
                      (Select his.fecha from mod_logistica.his_bitacora his 
                      where his.operacion ilike 'Documento confirmado' and his.iddocumento = $iddocumento limit 1) as fechaconfirmado,
                      (Select his.fecha from mod_logistica.his_bitacora his 
                      where his.operacion ilike 'Documento aprobado' and his.iddocumento = $iddocumento limit 1) as fechaaprobado,
                      (Select his.fecha from mod_logistica.his_bitacora his 
                      where his.operacion ilike 'Clientes adicionados' and his.iddocumento = $iddocumento limit 1) as fechacreacion
                        FROM
                          mod_logistica.dat_documentopadre  dp
                          LEFT JOIN mod_logistica.dat_documento d on dp.iddocumento = d.iddocumento
                          where dp.idpadre = $iddocumento
                    ;";
        $datosBalanceo = $conn->fetchAll($sql);
        return $datosBalanceo;
    }

    public function datosDistribucionPorBalanceo($iddocumento){
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $sql= "SELECT
                  doc.iddocumento, doc.nrodoc, doc.idestructuracomun, doc.estado,
                  (Select his.fecha from mod_logistica.his_bitacora his 
                  where his.operacion ilike 'Documento confirmado' and his.iddocumento = $iddocumento limit 1) as fechaconfirmado,
                (Select his.fecha from mod_logistica.his_bitacora his 
                  where his.operacion ilike 'Documento aprobado' and his.iddocumento = $iddocumento limit 1) as fechaaprobado,
                  (Select his.fecha from mod_logistica.his_bitacora his 
                  where his.operacion ilike 'Clientes adicionados' and his.iddocumento = $iddocumento limit 1) as fechacreacion
                FROM mod_logdistribucion.dat_prodbalanceodistribuir pbd
                INNER JOIN mod_logdistribucion.dat_prodbalanceopedido pbp on pbd.idproductobalanceopedido = pbp.idproductobalanceopedido
                INNER JOIN mod_logdistribucion.dat_productosbalanceo pb on pb.idproductosbalanceo = pbp.idproductobalanceo
                LEFT JOIN mod_logistica.dat_documento doc on doc.iddocumento = pbd.iddocdistribucion
                WHERE pb.iddocbalanceo = $iddocumento
                    ;";
        $datosDistribucion = $conn->fetchAll($sql);
        return $datosDistribucion;
    }

    public function datosDistribucionPorPerdido($iddocumento){
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $sql= "SELECT 
                  doc.iddocumento, doc.nrodoc, doc.idestructuracomun, doc.estado,
                  (Select his.fecha from mod_logistica.his_bitacora his 
                  where his.operacion ilike 'Documento confirmado' and his.iddocumento = $iddocumento limit 1) as fechaconfirmado,
                (Select his.fecha from mod_logistica.his_bitacora his 
                  where his.operacion ilike 'Documento aprobado' and his.iddocumento = $iddocumento limit 1) as fechaaprobado,
                  (Select his.fecha from mod_logistica.his_bitacora his 
                  where his.operacion ilike 'Clientes adicionados' and his.iddocumento = $iddocumento limit 1) as fechacreacion
                FROM 
                  mod_logdistribucion.dat_distribucionpedido d
                  LEFT JOIN mod_logistica.dat_documento doc on doc.iddocumento = d.iddistribucion  
                  where d.idpedido = $iddocumento
                    ;";
        $datosDistribucion = $conn->fetchAll($sql);
        return $datosDistribucion;
    }

    public function getProductosADistribuirPorBalanceo($iddocumento){
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $query = "SELECT i.codigo, i.denominacion, i.precio, um.abreviaturaunidadmedida as umedida, pbd.cantidad
                    FROM mod_logdistribucion.dat_prodbalanceodistribuir pbd
                    left join mod_logdistribucion.dat_prodbalanceopedido pbp on pbp.idproductobalanceopedido = pbd.idproductobalanceopedido
                    inner join mod_logdistribucion.dat_productosbalanceo pb on pb.idproductosbalanceo = pbp.idproductobalanceo
                    left join mod_datosmaestros.nom_indicador i on (i.idindicador = pb.idindicador)
                    left join mod_datosmaestros.nom_unidadmedida um on (um.idunidadmedida = i.idumedida)
                    WHERE pb.iddocbalanceo = $iddocumento;";
        $datosTrazabilidad = $conn->fetchAll($query);
        return $datosTrazabilidad;
    }

    public function getProductosADistribuirPorPedido($iddocumento){
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $query = "SELECT i.codigo, i.denominacion, i.precio, um.abreviaturaunidadmedida as umedida, pp.cantidad
                    FROM mod_logdistribucion.dat_distribucionpedido dp
                    left join mod_logdistribucion.dat_productopedido pp on (dp.idpedido = pp.idpedido)
                    left join mod_datosmaestros.nom_indicador i on (i.idindicador = pp.idproducto)
                    left join mod_datosmaestros.nom_unidadmedida um on (um.idunidadmedida = i.idumedida)
                    where dp.iddistribucion = $iddocumento;";
        $datosTrazabilidad = $conn->fetchAll($query);
        return $datosTrazabilidad;
    }

    public function datosDemanda($iddocumento){
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $query = "SELECT sn.idsolicitud, sn.numero, sn.fechacreada, sn.idestructuracomun,sne.idestado,sne.fechainicio as fechestado, ne.nombre
                    FROM mod_crmcontratacion.dat_solicitudnegocio sn
                    left join  mod_crmcontratacion.dat_solicitudnegocioestado sne on(sn.idsolicitud = sne.idsolicitud)
                    inner join mod_crmcontratacion.nom_estado ne ON(sne.idestado = ne.idestado)
                    where sn.cliente = 3 and sn.idbalanceo = $iddocumento and sne.fechafin is null;";
        $datosTrazabilidad = $conn->fetchAll($query);
        return $datosTrazabilidad;
    }

    public function datosSolicitudOferta($idsolicitud){
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $query = "SELECT sn.idsolicitud, sn.numero, sn.fechacreada, sn.idestructuracomun,sne.idestado,sne.fechainicio as fechestado, ne.nombre
                    FROM mod_crmcontratacion.dat_solicitudnegocio sn 
                    inner join mod_crmcontratacion.dat_solicituddemanda sd on(sn.idsolicitud = sd.idsolicitud)
                    left join  mod_crmcontratacion.dat_solicitudnegocioestado sne on(sn.idsolicitud = sne.idsolicitud)
                    inner join mod_crmcontratacion.nom_estado ne ON(sne.idestado = ne.idestado)
                    where sn.cliente = 4 and sd.iddemanda = $idsolicitud and sne.fechafin is null;";
        $datosTrazabilidad = $conn->fetchAll($query);
        return $datosTrazabilidad;
    }

    public function datosOfertaCompra($idsolicitud){
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $query = "SELECT ofn.idoferta, ofn.idsolicitud, ofn.fechainicio, ofn.numero, ofn.idestructuracomun, ofn.idcontrato,ofne.idestado,ofne.fechainicio as fechestado, ne.nombre
                    FROM mod_crmcontratacion.dat_ofertanegocio ofn
                    left join  mod_crmcontratacion.dat_ofertanegocioestado ofne on(ofn.idoferta = ofne.idoferta)
                    inner join mod_crmcontratacion.nom_estado ne ON(ofne.idestado = ne.idestado)
                    where ofn.idsolicitud = $idsolicitud and ofn.cliente = 3  and ofne.fechafin is null;";
        $datosTrazabilidad = $conn->fetchAll($query);
        return $datosTrazabilidad;
    }

    public function datosContrato($idoferta){
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $query = "SELECT dc.fechainicio, dc.idcontrato, dc.numero,dc.idestructuracomun,dce.idestado,dce.fechainicio as fechestado, ne.nombre
                    FROM mod_crmcontratacion.dat_ofertanegocio don 
                    left join mod_crmcontratacion.dat_contrato dc ON(dc.idcontrato = don.idcontrato)
                    left join  mod_crmcontratacion.dat_contratoestado dce on(dce.idcontrato = dc.idcontrato)
                    inner join mod_crmcontratacion.nom_estado ne ON(dce.idestado = ne.idestado)
                     where don.idoferta = $idoferta and don.idcontrato is not NULL and dce.fechafin is null;";
        $datosTrazabilidad = $conn->fetchAll($query);// one.fechafin is null and (ne.acciones::jsonb ? 'pliego')
        return $datosTrazabilidad;
    }


    public function datosTransferenciaRecepcion($iddocumento){
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $sql= "SELECT d.nrodoc,d.idestructuracomun,d.iddocumento, d.estado,
              (Select his.fecha from mod_logistica.his_bitacora his
              where his.operacion ilike 'Documento confirmado' and his.iddocumento = d.iddocumento limit 1) as fechaconfirmado,
              (Select his.fecha from mod_logistica.his_bitacora his
              where his.operacion ilike 'Documento contabilizado' and his.iddocumento = d.iddocumento limit 1) as fechacontabilizado,
              (Select his.fecha from mod_logistica.his_bitacora his
              where his.operacion ilike 'Cronologia establecida' and his.iddocumento = d.iddocumento limit 1) as fechacreacion
                FROM
                  mod_logistica.dat_documentopadre  dp
                  LEFT JOIN mod_logistica.dat_documento d on dp.iddocumento = d.iddocumento
                  where dp.idpadre = $iddocumento";
        $datosDistribucion = $conn->fetchAll($sql);
        return $datosDistribucion;
    }

    public function exportarTrazabilidad($iddocumentos)
    {
        // Crear objeto excel
        $objPHPExcel = new PHPExcel();

        // Cambiando las propiedades del documento
        $objPHPExcel->getProperties()->setCreator("DISTRA");
        $objPHPExcel->getProperties()->setLastModifiedBy("DISTRA");
        $objPHPExcel->getProperties()->setTitle("REPORTE: TRAZABILIDAD DE LOS PEDIDOS");
        $objPHPExcel->getProperties()->setSubject("REPORTE: TRAZABILIDAD DE LOS PEDIDOS");
        $objPHPExcel->getProperties()->setDescription("Reporte de trazabiidad de los pedidos.");
        $objPHPExcel->getProperties()->setKeywords("Trazabilidad, Pedido");
        $objPHPExcel->getProperties()->setCategory("REPORTE");

        // Configurando encabezado
        $objPHPExcel->setActiveSheetIndex(0);
        $objPHPExcel->getActiveSheet()->setTitle('TRAZABILIDAD DE LOS PEDIDOS');

        //Crear cuerpo del documento
        $objPHPExcel = self::crearEncabezadoExportar($objPHPExcel, $iddocumentos);

        // Save Excel 95 file
        $objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel5');

        error_reporting(E_ALL);
        ini_set('display_errors', true);
        ini_set('display_startup_errors', true);

        define('EOL', (PHP_SAPI == 'cli') ? PHP_EOL : '<br />');

        // Generate the server headers
        $name = "MODELO_EXPORT_DISTRA_BDC_" . date('dmy_his');
        header('Content-Type: application/vnd.ms-excel');
        header('Content-Disposition: attachment; filename=" ' . $name . '.xls"');
        header("Content-Transfer-Encoding: binary");
        header('Expires: 0');
        header('Cache-Control: max-age=0');
        header('Cache-Control: max-age=1');
        header('Cache-Control: cache, must-revalidate');
        header('Expires: ' . gmdate('D, d M Y H:i:s') . ' GMT');
        header('Last-Modified: ' . gmdate('D, d M Y H:i:s') . ' GMT');

        if (strpos($_SERVER['HTTP_USER_AGENT'], "MSIE") !== false) {
            header('Cache-Control: must-revalidate, post-check=0, pre-check=0');
            header('Pragma: public', true);
        } else {
            header('Pragma: no-cache');
        }

        $objWriter->save('php://output');

    }

    private function crearEncabezadoExportar($objPHPExcel, $iddocumentos)
    {
        $rcampos = array('Nro Documento', 'Tipo Documento', 'Fecha', 'Ubicación/Servicio', 'Cliente', 'Matrícula', 'Marca',
            'Modelo','VIN','Importe CUP','Estadía','Observaciones documento origen','Pedido','Estado','Cant. piezas','Fecha_pedido',
            'Días pedido','Balanceo','Estado','Fecha balance','Días','Distribución','Agencia Origen','Fecha distribución',
            'Dias distribución','Cant. productos','Depósito Origen','Demanda','Estado','Fecha demanda','Dias demanda','Línea',
            'Solicitud de oferta','Estado','Fecha solicitud','Dias Solicitud','Oferta de compra','Estado',
            'Fecha oferta','Dias oferta','Contrato','Estado','Fecha contrato','Dias contrato');

        $letraactual = '';
        foreach ($rcampos as $ind => $campo) {
            $letraactual = (($ind + 1) < 27) ? chr(($ind + 1) + 64) : 'A' . chr(($ind + 1) + 38);
            $objPHPExcel->getActiveSheet()->setCellValue($letraactual . '1', $campo);
            $this->fnPintarBordes($objPHPExcel, $letraactual . '1', 'top', PHPExcel_Style_Border::BORDER_THIN);
            $this->fnPintarBordes($objPHPExcel, $letraactual . '1', 'right', PHPExcel_Style_Border::BORDER_THIN);
            $this->fnPintarBordes($objPHPExcel, $letraactual . '1', 'bottom', PHPExcel_Style_Border::BORDER_THIN);
            $this->fnPintarBordes($objPHPExcel, $letraactual . '1', 'right', PHPExcel_Style_Border::BORDER_THIN);
        }
        //Pintar fondo de encabezado
        $this->fnPintarFondo($objPHPExcel, 'A1:' . $letraactual . '1', PHPExcel_Style_Fill::FILL_SOLID, 'BDD7EE');

        $objPHPExcel = self::Trazabilidad($objPHPExcel, $iddocumentos);

        return $objPHPExcel;
    }

    private function Trazabilidad($objPHPExcel, $iddocumentos)
    {
        $produccinnProceso = 0;
        $estadiaPromedio = 0;
        $cont = 0;
        $result = array();
        $idspedidos = array();
        $arraybalaceo = array();
        $idsbalanceo = array();
        $arraydistribucion = array();
        $arraydemandas = array();
        $idsdemandas = array();
        $idssolicitudesoferta = array();
        $idsoferta = array();
        $arraysolicitudesoferta = array();
        $arrayofertascompras= array();
        $arraycontratos= array();
        $datos = $this->datosTrazabilidad($iddocumentos);
        $idspedidos = array_column($datos,'idpedido');
        $balanceos = $this->getBalanceo($idspedidos);
        if(!empty($balanceos)){
            foreach ($balanceos as $bal){
                $arraybalaceo[$bal['idpedido']] = $bal;
                array_push($idsbalanceo,$bal['idbalanceo']);
            }
            $distribuciones = $this->distribucionPorBalanceo($idsbalanceo);
            foreach ($distribuciones as $dist){
                $arraydistribucion[$dist['iddocbalanceo']][] = $dist;
            }
            $demandas = $this->getDemanda($idsbalanceo);
            if(!empty($demandas)){
                foreach ($demandas as $dem){
                    $arraydemandas[$dem['idbalanceo']][] = $dem;
                    array_push($idsdemandas,$dem['iddemanda']);
                }
                $solicitudesoferta = $this->solicitudOferta($idsdemandas);
                if(!empty($solicitudesoferta)){
                    foreach ($solicitudesoferta as $soloferta){
                        $arraysolicitudesoferta[$soloferta['iddemanda']][] = $soloferta;
                        array_push($idssolicitudesoferta,$soloferta['idsolicitudoferta']);
                    }
                    $ofertas = $this->ofertaCompra($idssolicitudesoferta);
                    if(!empty($ofertas)){
                        foreach ($ofertas as $of){
                            $arrayofertascompras[$of['idsolicitudoferta']][] = $of;
                            array_push($idsoferta,$of['idoferta']);
                        }
                        $contratos = $this->contrato($idsoferta);
                        if(!empty($contratos)){
                            foreach ($contratos as $c){
                                $arraycontratos[$c['idoferta']][] = $c;
                            }
                        }
                    }
                }
            }
        }else{
            $distribuciones = $this->distribucionPorPerdido($idspedidos);
            foreach ($distribuciones as $dist){
                $arraydistribucion[$dist['idpedido']][] = $dist;
            }
        }
//print_r('<pre>');print_r($arraysolicitudesoferta);die;
        $row = 0;
        foreach ($datos as $i => $data) {
            $cont++;
            $datosOrigen = $this->docOrigenAndPedido($i,$data,$arraybalaceo);
            //$result[$row] = $datosOrigen[$i];
            if (!empty($arraybalaceo[$data['idpedido']])) {
                if (!empty($arraydistribucion[$arraybalaceo[$data['idpedido']]['idbalanceo']])) {
                    foreach ($arraydistribucion[$arraybalaceo[$data['idpedido']]['idbalanceo']] as $dist){
                        /*DOCUMENTO DE ORIGEN (CITA, OFERTA, ORDEN DE TRABAJO) Y EL PEDIDO*/
                        $result[$row] = $datosOrigen[$i];
                        /*DATOS DE LA DISTRIBUCION POR BALANCEO*/
                        $result[$row]['iddistribucion'] = $dist['iddistribucion'];
                        $result[$row]['nrodocdist'] = $dist['nrodocdist'];
                        $result[$row]['fechadist'] = $dist['fechadist'];
                        $result[$row]['cantproddist'] = $dist['cantproddist'];
                        $result[$row]['estadiadist'] = $dist['estadiadist'];
                        $result[$row]['agenciadist'] = $dist['agenciadist'];
                        $result[$row]['depositodist'] = $dist['depositodist'];
                        $row++;
                    }
                }
                if (!empty($arraydemandas[$arraybalaceo[$data['idpedido']]['idbalanceo']])) {
                    foreach ($arraydemandas[$arraybalaceo[$data['idpedido']]['idbalanceo']] as $dem){
                        /*DOCUMENTO DE ORIGEN (CITA, OFERTA, ORDEN DE TRABAJO) Y EL PEDIDO*/
                        $result[$row] = $datosOrigen[$i];
                        /*DATOS DE LA DEMANDA*/
                        $result[$row]['iddemanda'] = $dem['iddemanda'];
                        $result[$row]['nrodocdem'] = $dem['nrodocdem'];
                        $result[$row]['estadodem'] = $dem['estadodem'];
                        $result[$row]['fechadem'] = $dem['fechadem'];
                        $result[$row]['estadiadem'] = $dem['estadiadem'];
                        $result[$row]['naturaleza'] = $dem['naturaleza'];
                        if(!empty($arraysolicitudesoferta[$dem['iddemanda']])){
                            foreach ($arraysolicitudesoferta[$dem['iddemanda']] as $so){
                                /*DOCUMENTO DE ORIGEN (CITA, OFERTA, ORDEN DE TRABAJO) Y EL PEDIDO*/
                                $result[$row] = $datosOrigen[$i];
                                /*DATOS DE LA DEMANDA*/
                                $result[$row]['iddemanda'] = $dem['iddemanda'];
                                $result[$row]['nrodocdem'] = $dem['nrodocdem'];
                                $result[$row]['estadodem'] = $dem['estadodem'];
                                $result[$row]['fechadem'] = $dem['fechadem'];
                                $result[$row]['estadiadem'] = $dem['estadiadem'];
                                $result[$row]['naturaleza'] = $dem['naturaleza'];
                                /*DATOS DE LA SOLICITUD DE OFERTA*/
                                $result[$row]['idsolicitudoferta'] = $so['idsolicitudoferta'];
                                $result[$row]['nrodocsolicitudoferta'] = $so['nrodocsolicitudoferta'];
                                $result[$row]['estadosolicitudoferta'] = $so['estadosolicitudoferta'];
                                $result[$row]['fechasolicitudoferta'] = $so['fechasolicitudoferta'];
                                $result[$row]['estadiasolicitudoferta'] = $so['estadiasolicitudoferta'];
                                $result[$row]['agenciasolicitudoferta'] = $so['agenciasolicitudoferta'];
                                if(!empty($arrayofertascompras[$so['idsolicitudoferta']])){
                                    foreach ($arrayofertascompras[$so['idsolicitudoferta']] as $of){
                                        /*DOCUMENTO DE ORIGEN (CITA, OFERTA, ORDEN DE TRABAJO) Y EL PEDIDO*/
                                        $result[$row] = $datosOrigen[$i];
                                        /*DATOS DE LA OFERTA DE COMPRA*/
                                        $result[$row]['idoferta'] = $of['idoferta'];
                                        $result[$row]['nrodocoferta'] = $of['nrodocoferta'];
                                        $result[$row]['estadooferta'] = $of['estadooferta'];
                                        $result[$row]['fechaoferta'] = $of['fechaoferta'];
                                        $result[$row]['estadiaoferta'] = $of['estadiaoferta'];
                                        $result[$row]['agenciaoferta'] = $of['agenciaoferta'];
                                        if(!empty($arraycontratos[$of['idoferta']])){
                                            foreach ($arraycontratos[$of['idoferta']] as $c){
                                                /*DOCUMENTO DE ORIGEN (CITA, OFERTA, ORDEN DE TRABAJO) Y EL PEDIDO*/
                                                $result[$row] = $datosOrigen[$i];
                                                /*DATOS DEL CONTRATO*/
                                                $result[$row]['idcontrato'] = $c['idcontrato'];
                                                $result[$row]['nrodoccontrato'] = $c['nrodoccontrato'];
                                                $result[$row]['estadocontrato'] = $c['estadocontrato'];
                                                $result[$row]['fechacontrato'] = $c['fechacontrato'];
                                                $result[$row]['estadiacontrato'] = $c['estadiacontrato'];
                                                $result[$row]['agenciacontrato'] = $c['agenciacontrato'];
                                                $row++;
                                            }
                                        }else
                                            $row++;
                                    }
                                }else
                                    $row++;
                            }
                        }else
                            $row++;
                    }
                }
            } else {
                $result[$row] = $datosOrigen[$i];
                if (!empty($arraydistribucion[$data['idpedido']])) {
                    foreach ($arraydistribucion[$data['idpedido']] as $dist){
                        /*DOCUMENTO DE ORIGEN (CITA, OFERTA, ORDEN DE TRABAJO) Y EL PEDIDO*/
                        $result[$row] = $datosOrigen[$i];
                        /*DATOS DE LA DISTRIBUCION POR PEDIDO*/
                        $result[$row]['iddistribucion'] = $dist['iddistribucion'];
                        $result[$row]['nrodocdist'] = $dist['nrodocdist'];
                        $result[$row]['fechadist'] = $dist['fechadist'];
                        $result[$row]['cantproddist'] = $dist['cantproddist'];
                        $result[$row]['estadiadist'] = $dist['estadiadist'];
                        $result[$row]['agenciadist'] = $dist['agenciadist'];
                        $result[$row]['depositodist'] = $dist['depositodist'];
                        $row++;
                    }
                }else
                    $row++;
            }
        }

//print_r('<pre>');print_r($result);die;
        foreach ($result as $row => $data){
            $row = $row + 2;
            /*DOCUMENTO DE ORIGEN (CITA, OFERTA, ORDEN DE TRABAJO) Y EL PEDIDO*/
            $objPHPExcel->getActiveSheet()->setCellValue('A' . $row, $data['nrodoc']);
            $objPHPExcel->getActiveSheet()->setCellValue('B' . $row, $data['tipodoc']);
            $objPHPExcel->getActiveSheet()->setCellValue('C' . $row, $data['fecha']);
            $objPHPExcel->getActiveSheet()->setCellValue('D' . $row, $data['ubicacion']);
            $objPHPExcel->getActiveSheet()->setCellValue('E' . $row, $data['cliente']);
            $objPHPExcel->getActiveSheet()->setCellValue('F' . $row, $data['matricula']);
            $objPHPExcel->getActiveSheet()->setCellValue('G' . $row, $data['marca']);
            $objPHPExcel->getActiveSheet()->setCellValue('H' . $row, $data['modelo']);
            $objPHPExcel->getActiveSheet()->setCellValue('I' . $row, $data['vim']);
            $objPHPExcel->getActiveSheet()->setCellValue('J' . $row, $data['importecup']);
            $produccinnProceso += $data['importecup'];
            $objPHPExcel->getActiveSheet()->setCellValue('K' . $row, $data['estadia']);
            $estadiaPromedio += $data['estadia'];
            $objPHPExcel->getActiveSheet()->setCellValue('L' . $row, $data['observaciones']);
            /*DOCUMENTO DEL PEDIDO*/
            $objPHPExcel->getActiveSheet()->setCellValue('M' . $row, $data['nrodocpedido']);
            $objPHPExcel->getActiveSheet()->setCellValue('N' . $row, $this->getEstado($data['estadopedido']));
            $objPHPExcel->getActiveSheet()->setCellValue('O' . $row, $data['cantprod']);
            $objPHPExcel->getActiveSheet()->setCellValue('P' . $row, $data['fechapedido']);
            $objPHPExcel->getActiveSheet()->setCellValue('Q' . $row, $data['estadiapedido']);
            /*DATOS DEL BALANCEO DE PEDIDO*/
            $objPHPExcel->getActiveSheet()->setCellValue('R' . $row, $data['nrodocbalanceo']);
            $objPHPExcel->getActiveSheet()->setCellValue('S' . $row, $this->getEstado($data['estadobalanceo']));
            $objPHPExcel->getActiveSheet()->setCellValue('T' . $row, $data['fechabalanceo']);
            $objPHPExcel->getActiveSheet()->setCellValue('U' . $row, $data['estadiabalanceo']);
            /*DATOS DE LA DISTRIBUCION DEL PEDIDO*/
            $objPHPExcel->getActiveSheet()->setCellValue('V' . $row, $data['nrodocdist']);
            $objPHPExcel->getActiveSheet()->setCellValue('W' . $row, $data['agenciadist']);
            $objPHPExcel->getActiveSheet()->setCellValue('X' . $row, $data['fechadist']);
            $objPHPExcel->getActiveSheet()->setCellValue('Y' . $row, $data['estadiadist']);
            $objPHPExcel->getActiveSheet()->setCellValue('Z' . $row, $data['cantproddist']);
            $objPHPExcel->getActiveSheet()->setCellValue('AA' . $row, $data['depositodist']);
            /*DATOS DE LA DEMANDA*/
            $objPHPExcel->getActiveSheet()->setCellValue('AB' . $row, $data['nrodocdem']);
            $objPHPExcel->getActiveSheet()->setCellValue('AC' . $row, $data['estadodem']);
            $objPHPExcel->getActiveSheet()->setCellValue('AD' . $row, $data['fechadem']);
            $objPHPExcel->getActiveSheet()->setCellValue('AE' . $row, $data['estadiadem']);
            $objPHPExcel->getActiveSheet()->setCellValue('AF' . $row, $data['naturaleza']);
            /*DATOS DE LA SOLICITUD DE OFERTA*/
            $objPHPExcel->getActiveSheet()->setCellValue('AG' . $row, $data['nrodocsolicitudoferta']);
            $objPHPExcel->getActiveSheet()->setCellValue('AH' . $row, $data['estadosolicitudoferta']);
            $objPHPExcel->getActiveSheet()->setCellValue('AI' . $row, $data['fechasolicitudoferta']);
            $objPHPExcel->getActiveSheet()->setCellValue('AJ' . $row, $data['estadiasolicitudoferta']);
            //$objPHPExcel->getActiveSheet()->setCellValue('AK' . $row, $data['agenciasolicitudoferta']);
            /*DATOS DE LA OFERTA DE COMPRA*/
            $objPHPExcel->getActiveSheet()->setCellValue('AK' . $row, $data['nrodocoferta']);
            $objPHPExcel->getActiveSheet()->setCellValue('AL' . $row, $data['estadooferta']);
            $objPHPExcel->getActiveSheet()->setCellValue('AM' . $row, $data['fechaoferta']);
            $objPHPExcel->getActiveSheet()->setCellValue('AN' . $row, $data['estadiaoferta']);
            //$objPHPExcel->getActiveSheet()->setCellValue('AP' . $row, $data['agenciaoferta']);
            /*DATOS DEL CONTRATO*/
            $objPHPExcel->getActiveSheet()->setCellValue('AO' . $row, $data['nrodoccontrato']);
            $objPHPExcel->getActiveSheet()->setCellValue('AP' . $row, $data['estadocontrato']);
            $objPHPExcel->getActiveSheet()->setCellValue('AQ' . $row, $data['fechacontrato']);
            $objPHPExcel->getActiveSheet()->setCellValue('AR' . $row, $data['estadiacontrato']);
            //$objPHPExcel->getActiveSheet()->setCellValue('AU' . $row, $data['agenciacontrato']);

        }

        $ind = $row; $ind1 = $row;

        $result = array('Producción en Proceso', 'Estadía Promedio', 'Estadía Promedio TRG', '', 'Total Vehículos', 'Total Vehículos TRG',
            'Estadía Promedio TRG', '', 'Total Vehículos GAE', 'Total Vehículos MINFAR', 'Total Vehículos SASA', 'Total Vehículos TERCERO',
            'Vehículos con mas de 90 días', 'Vehículos de renta con mas de 90 días');

        foreach ($result as $row1 => $res) {
            $row1 = $ind+2;
            $objPHPExcel->getActiveSheet()->setCellValue('E' . $row1, $res);
            $ind = $row1-1;
        }

        $resultdata = array($produccinnProceso, $estadiaPromedio/$cont, '', '', '', '','', '', '', '', '', '','', '');

        foreach ($resultdata as $row2 => $res2) {
            $row2 = $ind1+2;
            $objPHPExcel->getActiveSheet()->setCellValue('J' . $row2, $res2);
            $ind1 = $row2-1;
        }

        return $objPHPExcel;
    }
    
    public function docOrigenAndPedido($i,$data,$arraybalaceo){
        /*DOCUMENTO DE ORIGEN (CITA, OFERTA, ORDEN DE TRABAJO)*/
        $result[$i]['iddocumento'] = $data['iddocumento'];
        $result[$i]['nrodoc'] = $data['nrodoc'];
        $result[$i]['fecha'] = $data['fecha'];
        $result[$i]['estadia'] = $data['estadia'];
        $result[$i]['observaciones'] = $data['observaciones'];
        $result[$i]['idpedido'] = $data['idpedido'];
        $result[$i]['nrodocpedido'] = $data['nrodocpedido'];
        $result[$i]['estadopedido'] = $data['estadopedido'];
        $result[$i]['fechapedido'] = $data['fechapedido'];
        $result[$i]['estadiapedido'] = $data['estadiapedido'];
        if($data['tipodoc'] == 'ordenServicioLOG'){
            $result[$i]['tipodoc'] = 'Orden de trabajo';
            $result[$i]['ubicacion'] = $data['ubicacion'];
            $result[$i]['cliente'] = $data['codigoclienteorden'].'-'.$data['nombreclienteorden'];
            $result[$i]['matricula'] = $data['matriculaot'];
            $result[$i]['marca'] = $data['marcaot'];
            $result[$i]['modelo'] = $data['modeloot'];
            $result[$i]['vim'] = $data['vimot'];
            $result[$i]['importecup'] = $data['importecupot'];
        }elseif($data['tipodoc'] == 'citasLog'){
            $result[$i]['tipodoc'] = 'Cita';
            $result[$i]['cliente'] = $data['codigoclientecita'].'-'.$data['nombreclientecita'];
            $result[$i]['matricula'] = $data['matriculacita'];
            $result[$i]['marca'] = $data['marcacita'];
            $result[$i]['modelo'] = $data['modelocita'];
            $result[$i]['vim'] = $data['vimcita'];
            $result[$i]['observaciones'] = $data['observacionescita'];
        }elseif($data['tipodoc'] == 'ofertaLog'){
            $result[$i]['tipodoc'] = 'Oferta';
            $result[$i]['cliente'] = $data['codigoclienteoferta'].'-'.$data['nombreclienteoferta'];
        }else{
            $result[$i]['tipodoc'] = 'Pedido';
            $result[$i]['nrodoc'] = $data['nrodocpedido'];
            $result[$i]['fecha'] = $data['fechapedido'];
            $result[$i]['observaciones'] = $data['observacionespedido'];
            $result[$i]['cantprod'] = $data['cantprod'];
            $result[$i]['estadia'] = $data['estadiapedido'];
            $result[$i]['cliente'] = $data['codigoclientepedido'].'-'.$data['nombreclientepedido'];
        }
        if (!empty($arraybalaceo[$data['idpedido']])) {
            $result[$i]['iddocbalanceo'] = $arraybalaceo[$data['idpedido']]['idbalanceo'];
            $result[$i]['nrodocbalanceo'] = $arraybalaceo[$data['idpedido']]['nrodocbalanceo'];
            $result[$i]['estadobalanceo'] = $arraybalaceo[$data['idpedido']]['estadobalanceo'];
            $result[$i]['fechabalanceo'] = $arraybalaceo[$data['idpedido']]['fechabalanceo'];
            $result[$i]['estadiabalanceo'] = $arraybalaceo[$data['idpedido']]['estadiabalanceo'];
        }
        return $result;
    }

    public function datosTrazabilidad($iddocumentos){
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $sql= "SELECT nd.abreviatura as tipodoc,
                ddpadre.iddocumento, (CASE WHEN ddpadre.nrodoc is null THEN 'Ref: ' || ddpadre.numeroref ELSE 'Nro: ' || ddpadre.nrodoc END) as nrodoc, 
                ddpadre.estado,ddpadre.observaciones ,c.observacion as observacionescita,ddpadre.fechacontable as fecha,
                (case when ddpadre.fechacontable is not null then ((current_date - ddpadre.fechacontable)) else 0 end) as estadia,
                d.iddocumento as idpedido, (CASE WHEN d.nrodoc is null THEN 'Ref: ' || d.numeroref ELSE 'Nro: ' || d.nrodoc END) as nrodocpedido, 
                d.fechacontable as fechapedido, d.estado as estadopedido, d.observaciones as observacionespedido,
                (case when d.fechacontable is not null then ((current_date - d.fechacontable)) else 0 end) as estadiapedido,
                (select count(p.idpedido) from mod_logdistribucion.dat_productopedido p where p.idpedido = d.iddocumento) as cantprod,
                cpd.codigo as codigoclientepedido, cpd.nombre as nombreclientepedido,                
                cpot.codigo as codigoclienteorden, cpot.nombre as nombreclienteorden, 
                cpc.codigo as codigoclientecita, cpc.nombre as nombreclientecita,
                cpo.codigo as codigoclienteoferta, cpo.nombre as nombreclienteoferta,nu.denominacion as ubicacion,
                cast((select ddpadre.value::json->'marca' from (SELECT value FROM json_array_elements((
                select ((cast(dm.dinamicos as json))) from mod_logtaller.dat_medioorden dm where dm.idordentrabajo = ddpadre.iddocumento
                ))) ddpadre where cast(ddpadre.value as VARCHAR) ilike '%%marca%%') as varchar) as marcaot,
                cast((select ddpadre.value::json->'modelo' from (SELECT value FROM json_array_elements((
                select ((cast(dm.dinamicos as json))) from mod_logtaller.dat_medioorden dm where dm.idordentrabajo = ddpadre.iddocumento
                ))) ddpadre where cast(ddpadre.value as VARCHAR) ilike '%%modelo%%') as varchar) as modeloot,
                cast((select ddpadre.value::json->'matricula' from (SELECT value FROM json_array_elements((
                select ((cast(dm.dinamicos as json))) from mod_logtaller.dat_medioorden dm where dm.idordentrabajo = ddpadre.iddocumento
                ))) ddpadre where cast(ddpadre.value as VARCHAR) ilike '%%matricula%%') as varchar) as matriculaot,
                cast((select ddpadre.value::json->'vim' from (SELECT value FROM json_array_elements((
                select ((cast(dm.dinamicos as json))) from mod_logtaller.dat_medioorden dm where dm.idordentrabajo = ddpadre.iddocumento
                ))) ddpadre where cast(ddpadre.value as VARCHAR) ilike '%%vim%%') as varchar) as vimot,
                (select sum(m.importecup) from mod_logtaller.dat_material m where m.idordentrabajo = ddpadre.iddocumento) as importecupot,
                
                cast((select d.value::json->'marca' from (SELECT value FROM json_array_elements((
                select ((cast(c.dinamicos as json)))))) d where cast(d.value as VARCHAR) ilike '%%marca%%') as varchar) as marcacita,
                cast((select d.value::json->'modelo' from (SELECT value FROM json_array_elements((
                select ((cast(c.dinamicos as json)))))) d where cast(d.value as VARCHAR) ilike '%%modelo%%') as varchar) as modelocita,
                cast((select d.value::json->'matricula' from (SELECT value FROM json_array_elements((
                select ((cast(c.dinamicos as json)))))) d where cast(d.value as VARCHAR) ilike '%%matricula%%') as varchar) as matriculacita,
                cast((select d.value::json->'vim' from (SELECT value FROM json_array_elements((
                select ((cast(c.dinamicos as json)))))) d where cast(d.value as VARCHAR) ilike '%%vim%%') as varchar) as vimcita
                FROM mod_logistica.dat_documento d
                left JOIN mod_logistica.dat_documentopadre dp ON dp.iddocumento = d.iddocumento
                left join mod_logistica.dat_documento ddpadre ON ddpadre.iddocumento = dp.idpadre
                left join mod_datosmaestros.dat_documentoprim dcp on dcp.iddoc = ddpadre.iddoc
                left join mod_datosmaestros.nom_docprim nd on nd.iddocumentos = dcp.iddocumentos
                
                left join mod_logtaller.dat_ordentrabajo ot on ot.idordentrabajo = ddpadre.iddocumento
                left join mod_logtaller.nom_ubicaciontall nu on ot.ubicacionactual = nu.idubicaciontall
                left join mod_datosmaestros.nom_clientesproveedor cpot on ot.idcliente = cpot.idclientesproveedores
                left join mod_logtaller.dat_cita c on ddpadre.iddocumento = c.idcita
                left join mod_datosmaestros.nom_clientesproveedor cpc on c.idcliente = cpc.idclientesproveedores
                left join mod_logfacturacion.dat_docfactura df on df.idfactura = ddpadre.iddocumento
                left join mod_datosmaestros.nom_clientesproveedor cpo on df.idcliente = cpo.idclientesproveedores
                left join mod_logistica.dat_documentocliente dc on dc.iddocumento = d.iddocumento
                left join mod_datosmaestros.nom_clientesproveedor cpd on dc.idcliente = cpd.idclientesproveedores
                where d.iddocumento IN (" . implode(',', $iddocumentos) . ")
                order by fecha desc";
        $datos = $conn->fetchAll($sql);
        return $datos;
    }

    public function getBalanceo($idpedidos){
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $sql= "SELECT d.iddocumento as idbalanceo, (CASE WHEN d.nrodoc is null THEN 'Ref: ' || d.numeroref ELSE 'Nro: ' || d.nrodoc END) as nrodocbalanceo, 
                d.estado as estadobalanceo, d.fechacontable as fechabalanceo, dp.idpadre as idpedido,
                (case when d.fechacontable is not null then ((current_date - d.fechacontable)) else 0 end) as estadiabalanceo
                        FROM
                          mod_logistica.dat_documentopadre  dp
                          LEFT JOIN mod_logistica.dat_documento d on dp.iddocumento = d.iddocumento
                          where dp.idpadre IN (" . implode(',', $idpedidos) . ") and d.estado = 3
                    ;";
        $datosBalanceo = $conn->fetchAll($sql);
        return $datosBalanceo;
    }

    public function distribucionPorBalanceo($iddocumentos){
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $sql= "SELECT doc.iddocumento as iddistribucion,
                       (CASE WHEN doc.nrodoc is null THEN 'Ref: ' || doc.numeroref ELSE 'Nro: ' || doc.nrodoc END) as nrodocdist,
                       doc.estado as estadodist,
                       doc.fechacontable as fechadist,
                       pbd.cantidad as cantproddist,
                       (case
                          when doc.fechacontable is not null then ((current_date - doc.fechacontable))
                          else 0
                        end) as estadiadist,pb.iddocbalanceo,
                        coalesce (e.codigo || ' - ' || e.denominacion,e.denominacion) as agenciadist,
                        coalesce (eop.codigo || ' - ' || eop.denominacion,eop.denominacion) as depositodist
                FROM mod_logistica.dat_documento doc 
                LEFT JOIN mod_logdistribucion.dat_prodbalanceodistribuir pbd on doc.iddocumento = pbd.iddocdistribucion
                     INNER JOIN mod_logdistribucion.dat_prodbalanceopedido pbp on pbd.idproductobalanceopedido = pbp.idproductobalanceopedido
                     INNER JOIN mod_logdistribucion.dat_productosbalanceo pb on pb.idproductosbalanceo = pbp.idproductobalanceo
                     inner join mod_logistica.dat_producto dp on dp.idproducto = pbd.idproducto
                     inner join mod_estructuracomp.v_dametodasestructuras e on e.idestructura = dp.idestructuracomun
                     inner join mod_estructuracomp.v_dametodasestructuras eop on eop.idestructura = dp.idestructura
                WHERE pb.iddocbalanceo IN (" . implode(',', $iddocumentos) . ")
                    ;";
        $datosDistribucion = $conn->fetchAll($sql);
        return $datosDistribucion;
    }

    public function distribucionPorPerdido($iddocumentos){
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $sql= "SELECT 
                doc.iddocumento as iddistribucion, (CASE WHEN doc.nrodoc is null THEN 'Ref: ' || doc.numeroref ELSE 'Nro: ' || doc.nrodoc END) as nrodocdist, 
                doc.estado as estadodist, doc.fechacontable as fechadist,
                coalesce (e.codigo || ' - ' || e.denominacion,e.denominacion) as agenciadist,d.idpedido,
                (case when doc.fechacontable is not null then ((current_date - doc.fechacontable)) else 0 end) as estadiadist
                FROM 
                mod_logdistribucion.dat_distribucionpedido d
                LEFT JOIN mod_logistica.dat_documento doc on doc.iddocumento = d.iddistribucion
                inner join mod_estructuracomp.v_dametodasestructuras e on e.idestructura = doc.idestructuracomun
                where d.idpedido IN (" . implode(',', $iddocumentos) . ")
                    ;";
        $datosDistribucion = $conn->fetchAll($sql);
        return $datosDistribucion;
    }

    public function getDemanda($idsbalanceo){
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $query = "SELECT sn.idsolicitud as iddemanda, sn.numero as nrodocdem, sn.fechacreada as fechadem, ne.nombre as estadodem, sn.idbalanceo,
                        (case
                          when sn.fechacreada is not null then ((current_date - sn.fechacreada))
                          else 0
                        end) as estadiadem, n.denominacion as naturaleza,
                    coalesce (e.codigo || ' - ' || e.denominacion,e.denominacion) as agenciadem
                    FROM mod_crmcontratacion.dat_solicitudnegocio sn
                    left join  mod_crmcontratacion.dat_solicitudnegocioestado sne on(sn.idsolicitud = sne.idsolicitud)
                    inner join mod_crmcontratacion.nom_estado ne ON(sne.idestado = ne.idestado)
                    inner join mod_estructuracomp.v_dametodasestructuras e on e.idestructura = sn.idestructuracomun
                    inner join mod_datosmaestros.nom_naturaleza n on n.idnaturaleza = sn.idlinea
                    where sn.cliente = 3 and sn.idbalanceo IN (" . implode(',', $idsbalanceo) . ") and sne.fechafin is null;";
        $datosDemanda = $conn->fetchAll($query);
        return $datosDemanda;
    }

    public function solicitudOferta($idsdemandas){
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $query = "SELECT sn.idsolicitud as idsolicitudoferta, sn.numero as nrodocsolicitudoferta, sn.fechacreada as fechasolicitudoferta, 
                          ne.nombre as estadosolicitudoferta,
                        (case
                          when sn.fechacreada is not null then ((current_date - sn.fechacreada))
                          else 0
                        end) as estadiasolicitudoferta, sd.iddemanda,
                     coalesce (e.codigo || ' - ' || e.denominacion,e.denominacion) as agenciasolicitudoferta
                    FROM mod_crmcontratacion.dat_solicitudnegocio sn 
                    inner join mod_crmcontratacion.dat_solicituddemanda sd on(sn.idsolicitud = sd.idsolicitud)
                    left join  mod_crmcontratacion.dat_solicitudnegocioestado sne on(sn.idsolicitud = sne.idsolicitud)
                    inner join mod_crmcontratacion.nom_estado ne ON(sne.idestado = ne.idestado)
                    inner join mod_estructuracomp.v_dametodasestructuras e on e.idestructura = sn.idestructuracomun
                    where sn.cliente = 4 and sd.iddemanda IN (" . implode(',', $idsdemandas) . ") and sne.fechafin is null;";
        $datosSolicitud = $conn->fetchAll($query);
        return $datosSolicitud;
    }

    public function ofertaCompra($idsolicitudes){
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $query = "SELECT ofn.idoferta, ofn.idsolicitud as idsolicitudoferta, ofn.fechainicio as fechaoferta, 
                      ofn.numero as nrodocoferta, ofn.idcontrato, ne.nombre as estadooferta,
                      (case
                          when ofn.fechainicio is not null then ((current_date - ofn.fechainicio))
                          else 0
                        end) as estadiaoferta,
                      coalesce (e.codigo || ' - ' || e.denominacion,e.denominacion) as agenciaoferta 
                    FROM mod_crmcontratacion.dat_ofertanegocio ofn
                    left join  mod_crmcontratacion.dat_ofertanegocioestado ofne on(ofn.idoferta = ofne.idoferta)
                    inner join mod_crmcontratacion.nom_estado ne ON(ofne.idestado = ne.idestado)
                    inner join mod_estructuracomp.v_dametodasestructuras e on e.idestructura = ofn.idestructuracomun
                    where ofn.idsolicitud IN (" . implode(',', $idsolicitudes) . ") and ofn.cliente = 3  and ofne.fechafin is null;";
        $datosOferta = $conn->fetchAll($query);
        return $datosOferta;
    }

    public function contrato($idsoferta){
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $query = "SELECT dc.fechainicio as fechacontrato, dc.idcontrato, dc.numero as nrodoccontrato, ne.nombre as estadocontrato,
                        (case
                          when dc.fechainicio is not null then ((current_date - dc.fechainicio))
                          else 0
                        end) as estadiacontrato, don.idoferta, 
                      coalesce (e.codigo || ' - ' || e.denominacion,e.denominacion) as agenciacontrato
                    FROM mod_crmcontratacion.dat_ofertanegocio don 
                    left join mod_crmcontratacion.dat_contrato dc ON(dc.idcontrato = don.idcontrato)
                    left join  mod_crmcontratacion.dat_contratoestado dce on(dce.idcontrato = dc.idcontrato)
                    inner join mod_crmcontratacion.nom_estado ne ON(dce.idestado = ne.idestado)
                    inner join mod_estructuracomp.v_dametodasestructuras e on e.idestructura = dc.idestructuracomun
                     where don.idoferta IN (" . implode(',', $idsoferta) . ") and don.idcontrato is not NULL and dce.fechafin is null;";
        $datosContrato = $conn->fetchAll($query);// one.fechafin is null and (ne.acciones::jsonb ? 'pliego')
        return $datosContrato;
    }

    public function restFechas($fecha1, $fecha2){
        if(!empty($fecha1) && !empty($fecha2)){
            $f1 = explode('/', $fecha1);
            $f2 = explode('/', $fecha2);
            $fech1 = new DateTime(date('Y-m-d H:i:s', mktime(0, 0, 0, $f1[1], $f1[0], $f1[2])));
            $fech2 = new DateTime(date('Y-m-d H:i:s', mktime(0, 0, 0, $f2[1], $f2[0], $f2[2])));
            return date_diff($fech2, $fech1);
        }else{
            return 0;
        }
    }

    private function getEstado($estado){
        if($estado == 1){
            return 'Elaboración';
        }elseif($estado == 2){
            return 'Preparado';
        }elseif($estado == 3){
            return 'Aprobado';
        }elseif($estado == 4){
            return 'Contabilizado';
        }elseif($estado == 5){
            return 'Eliminado';
        }
    }

    public function fnPintarBordes(&$objPHPExcel, $celda, $lado, $tipoborde)
    {
        $objPHPExcel->getActiveSheet()->getStyle($celda)->getBorders()->applyFromArray(
            array(
                $lado => array(
                    'style' => $tipoborde,
                    'color' => array(
                        'rgb' => '000000'
                    )
                )
            )
        );
    }

    public function fnPintarFondo(&$objPHPExcel, $celda, $tipofondo, $color)
    {
        $objPHPExcel->getActiveSheet()->getStyle($celda)->getFill()->applyFromArray(array(
            'type' => $tipofondo,
            'startcolor' => array(
                'rgb' => $color
            )
        ));
    }

}
