<?php

/**
 * Esta clase gestiona la Facturacion del sistema
 *
 * @package    Facturacion
 * @author     Division de Gestion de Entidades
 * @copyright  XETID
 * @version    5.0
 */
class GestionarFacturaModel extends DocumentoLogisticaModel {

    private $docfatura;
    private $estructuraHelper;
    private $estructuraUbicHelper;
    private $configuracionHelper;
    private $productoModel;
    private $servicioModel;
    private $idestructura;
    private $slogiticaDoc;
    private $objIddocFac;
    private $objIddocNota;
    private $objIddocOferta;
    private $objIddocNotaDebito;
    private $objIddocNotaCredito;
    private $objIddocOrden;
    private $maestroP;
    private $serviciosPlanificacion;
    private $numeroCtl;
    private $fechacontable;
    private $monedacontable;
    private $monedalternativa;
    private $sContabilidadFinanzas;
    private $dualidad;
    private $_dualidadMonedas;
    private $_idejercicio;
    private $_tipotasa;
    private $_tipoDocumento;
    private $_cacheClienteRedondeo;
    private $_cacheNaturalezamedia;
    private $_cacheSectormedia;
    private $objIddocVenta;
    private $objIddocDev;
    private $confFactModel;
    private $_comprobanteModel;
    private $_configuracion;
    private $_numeroferta;

    public function __construct($datos = array())
    {
        parent::__construct($datos);
        $this->_cacheClienteRedondeo = array();
        $this->_cacheNaturalezamedia = array();
        $this->_cacheSectormedia = array();
        $this->docfatura = new DatDocfactura();
        $this->estructuraHelper = ServiciosEstructuraComposicionHelper::__init();
        $this->estructuraUbicHelper = LogisticaEstructuraUbicHelper::__init();
        $this->configuracionHelper = ServiciosConfiguracionGeneralHelper::__init();
        $this->slogiticaDoc = LogisticaDocumentosHelper::__init();
        $this->productoModel = new GestionarProductosModel();
        $this->servicioModel = new GestionarServiciosModel();
        $this->idestructura = $this->global->Estructura->idestructura;
        $this->fechacontable = $this->global->FechaContable->fecha;
        $this->_idejercicio = $this->configuracionHelper
            ->getEjercicioActualSubsistema($this->idestructura, LogisticaGlobal::SUBSISTEMA_FAC);
        //$this->producto = new LogisticaProductoModel();

        $this->maestroP = new MaestroProductoModel();
        $this->serviciosPlanificacion = ServiciosPlanificacionHelper::__init();
        $this->sContabilidadFinanzas = ServiciosContabilidadFinanzasHelper::__init();
        $this->objIddocFac = $this->slogiticaDoc->devuelveIddocByIdEstructura(
                'facturaLog', $this->idestructura, LogisticaGlobal::SUBSISTEMA_FAC
        );
        $this->objIddocNota = $this->slogiticaDoc->devuelveIddocByIdEstructura(
                'conduceLog', $this->idestructura, LogisticaGlobal::SUBSISTEMA_FAC
        );
        $this->objIddocOferta = $this->slogiticaDoc->devuelveIddocByIdEstructura(
                'ofertaLog', $this->idestructura, LogisticaGlobal::SUBSISTEMA_FAC
        );
        $this->objIddocNotaDebito = $this->slogiticaDoc->devuelveIddocByIdEstructura(
            'debitoLog', $this->idestructura, LogisticaGlobal::SUBSISTEMA_FAC
        );
        $this->objIddocNotaCredito = $this->slogiticaDoc->devuelveIddocByIdEstructura(
            'creditoLog', $this->idestructura, LogisticaGlobal::SUBSISTEMA_FAC
        );
        $this->objIddocOrden = $this->slogiticaDoc->devuelveIddocByIdEstructura(
            'ordenServicioLOG', $this->idestructura, LogisticaGlobal::SUBSISTEMA_TALLERES
        );
        $this->iddoc = array($this->objIddocFac->iddoc);
        $this->_tipoDocumento[$this->objIddocFac->iddoc] = $this->objIddocFac->denominacion;
        if ($this->objIddocNota->iddoc) {
            $this->iddoc[] = $this->objIddocNota->iddoc;
            $this->_tipoDocumento[$this->objIddocNota->iddoc] = $this->objIddocNota->denominacion;
        }
        if ($this->objIddocOferta->iddoc) {
            $this->iddoc[] = $this->objIddocOferta->iddoc;
            $this->_tipoDocumento[$this->objIddocOferta->iddoc] = $this->objIddocOferta->denominacion;
        }
        if ($this->objIddocNotaDebito->iddoc) {
            $this->iddoc[] = $this->objIddocNotaDebito->iddoc;
            $this->_tipoDocumento[$this->objIddocNotaDebito->iddoc] = $this->objIddocNotaDebito->denominacion;
        }
        if ($this->objIddocNotaCredito->iddoc) {
            $this->iddoc[] = $this->objIddocNotaCredito->iddoc;
            $this->_tipoDocumento[$this->objIddocNotaCredito->iddoc] = $this->objIddocNotaCredito->denominacion;
        }
        $this->objIddocVenta = $this->slogiticaDoc->devuelveIddocByIdEstructura(
                'compventaLog', $this->idestructura, LogisticaGlobal::SUBSISTEMA_FAC
          );   
        $this->objIddocDev = $this->slogiticaDoc->devuelveIddocByIdEstructura(
              'compdevLog', $this->idestructura, LogisticaGlobal::SUBSISTEMA_FAC
        );  
        if($this->objIddocVenta->iddoc) {
              $this->iddoc[] = $this->objIddocVenta->iddoc;
          }
        if($this->objIddocDev->iddoc) {
            $this->iddoc[] = $this->objIddocDev->iddoc;
        }   
        $this->numeroCtl = new DatNumerocontrol();
        /*$this->monedacontable = (array) $this->configuracionHelper->obtenerMonedaContablePorEntidad(
                        $this->idestructura
        );*/
        //$this->monedas = $this->getMonedasEntidad();
        $relations = array();
        $relations[] = array('cardinalidad' => 'one', 'relation' => 'DatMovnroserie',
            'properties' => array('local' => 'idmovimiento', 'foreign' => 'idmovimiento'));
        $relations[] = array('cardinalidad' => 'many', 'relation' => 'DatMovubicacion',
            'properties' => array('local' => 'idmovimiento', 'foreign' => 'idmovimiento'));
        $relations[] = array('cardinalidad' => 'many', 'relation' => 'DatLote',
            'properties' => array('local' => 'idproducto', 'foreign' => 'idproducto'));
        $this->logisticaDoctrine->tryInyectRelactions(new DatMovimientos(), $relations);
        if(class_exists('DatUbicacionComprometida')){
            $relations = array();
            $relations[] = array(
                'cardinalidad' => 'many', 'relation' => 'DatMovimientos',
                'properties' => array('local' => 'idproducto', 'foreign' => 'idproducto')
            );
            $this->logisticaDoctrine->tryInyectRelactions(new DatUbicacionComprometida(), $relations);
        }
        
        if(class_exists('DatContrato')){           
            $relations[] = array(
                'cardinalidad' => 'one', 'relation' => 'DatContrato',
                'properties' => array('local' => 'idcontrato', 'foreign' => 'idcontrato')
            );
            $this->logisticaDoctrine->tryInyectRelactions(new DatFacturacontrato(), $relations);
        }

        $this->_dualidadMonedas = LogisticaGlobal::__init()->getMonedaEntidad();//reemplazar lo viejo por esto
        $this->dualidad = ($this->_dualidadMonedas->idmonedaalternativa) ? 1 : 0;
        $this->confFactModel = new ConfFacturacionModel();
        $this->_configuracion =$this->confFactModel->cargarConfiguracion(
            $this->idestructura
        ); 
        $this->_tipotasa = $this->_configuracion['idtipotasa'];
        $this->_numeroferta=$this->_configuracion['utilizarnumeroref'];
    }

    private function getCondicionByOperacion($idoperacion) {
        $operacion = $this->getOperaciones(array('idoperacion' => $idoperacion));
        return $operacion[0]['idcondiciondefecto'];
    }

    public function getDualidadMonedas(){//cambiar lo viejo por esto
        return $this->_dualidadMonedas;
    }

    public function getIddocNotaDebito(){
        if ($this->objIddocNotaDebito->iddoc) {
            return $this->objIddocNotaDebito->iddoc;
        }
        return false;
    }

    public function getIddocNotaCredito(){
        if ($this->objIddocNotaCredito->iddoc) {
            return $this->objIddocNotaCredito->iddoc;
        }
        return false;
    }
    
    public function getIddocOrden(){
        if ($this->objIddocOrden->iddoc) {
            return $this->objIddocOrden->iddoc;
        }
        return false;
    }

    public function getMonedaContableAlternativa()
    {
        $result = array($this->_dualidadMonedas->idmoneda);
        if ($this->_dualidadMonedas->idmonedaalternativa) {
            $result[] = $this->_dualidadMonedas->idmonedaalternativa;
        }
        return $result;
    }

    /**
     * Funcion que permite adicionar o modificar una factura
     *
     * @param array $params Arreglo con los datos necesarios
     *                      para crear una nueva factura
     *
     * @return boolean Retorna true si fue un exito la accion
     */
    public function adicionarModificarFactura($params)
    {
        if (!$params['factorconvercion']) {
            unset($params['factorconvercion']);
        }
        if ($params['accion'] == 'add') {
            return $this->adicionarFactura($params);
        } else {
            return $this->modificarFactura($params);
        }
    }

    public function convertirFecha($fecha){
        $arrayFecha = explode('/', $fecha);
        return "{$arrayFecha[2]}-{$arrayFecha[1]}-{$arrayFecha[0]}";
    }

    /**
     * Funcion que permite adicionar una nueva factura
     *
     * @param array $params Arreglo con los datos necesarios
     *                      para crear una nueva factura
     *
     * @return boolean Retorna true si fue un exito la accion
     */
    public function adicionarFactura($params)
    {
        if ($params['iddeposito'] && $params['iddeposito'] == -1) {
            unset($params['iddeposito']);
        }
        if (strlen($params['idclienteauxiliar']) == 0) {
            unset($params['idclienteauxiliar']);
        }
        if ($params['tipoDoc'] == 3) {
            $params['esnota'] = 1;
            $params['iddoc'] = $this->objIddocNota->iddoc;
        }
        if ($params['tipoDoc'] == 1) {
            $params['oferta'] = 1;
            $params['iddoc'] = $this->objIddocOferta->iddoc;
        }

        if (!$params['iddoc']) {
            if ($params['tipoDoc'] != 3) {
                $params['iddoc'] = $this->objIddocFac->iddoc;
            }
        } else {
            ($this->objIddocNota->iddoc == $params['iddoc']) ? $params['esnota'] = 1 : $params['esnota'] = 0;
        }

        if (!$params['idoperacion']) {
            $params['idoperacion'] = $this->getOperaciones(
                            array('idsubsistema' => $params['idsubsistema'])
                    )[0]['idnomoperaciones'];
        }
        if ($params['iddeposito']) {
            //$params['idestructuracomun'] = $params['iddeposito'];
        }
        $params['manual'] = ($params['tipoDoc'] == 2) ? 1 : 0;

        $documento = $this->adicionarDocumento($params);
        $documento->DatDocfactura = $this->adicionarDatosGenerales(
                $documento, $params
        );
        if (!isset($params['idcondicionpago'])) {
            $idpordefecto = $this->getCondicionByOperacion($params['idoperacion']);
            $nomCliente =  $this->configuracionHelper->getClientesProveedorByParams($params['idcliente']);
            if ($this->inCondicionCuentaPorCobrar($nomCliente['datos'][0], $idpordefecto)) {
                $params['idcondicionpago'] = $idpordefecto;
            }
        } else if ($params['idcondicionpago'] == -1) {
            $params['idcondicionpago'] = null;
        }
        if ($params['docorigen']) {
            $this->addDatDocumentoPadre($params, $documento);
        }
        /*if ($params['depositoAreas']) {
            $this->adicionarAreasFactura($documento, $params['depositoAreas']);
        }*/
        if ($params['idventas']) {
            $this->adicionarVenta($params, $documento);
        }
        $documento->save();
        $this->adicionarClientes(
                $documento->iddocumento, array(array('idcliente' => $params['idcliente'], 'tipocliente' => 1, 'idcondicionpago' => $params['idcondicionpago'])), true
        );
        if ($params['productos']) {
            $this->adicionarProductos($documento, $params);
        }
        if ($params['servicios']) {
            $this->servicioModel->adicionarServicios(
                $documento, $params
            );
        }
        if ($params['conceptos']) {
            $this->adicionarConceptos($documento, $params);
        } else {
            if ($params['tipoDoc'] == 'nd' || $params['tipoDoc'] == 'nc'){
                $params['conceptos'] = $this->getConceptosFactura($params['docorigen']);
                $this->adicionarConceptos($documento, $params);
            } else {
                $params['conceptos'] = $this->getConceptosAplicarTodos();
                $this->adicionarConceptos($documento, $params);
            }
        }
        $this->actualizarImporte($documento->iddocumento);
        if ($params['aplicar']) {
            return $this->obtenerFacturas(
                            array('iddocumento' => $documento->iddocumento, 'aplicar' => true,
                                'idsubsistema' => $documento->DatDocfactura->idsubsistema, 'paramsProd' => $params['paramsProd'],
                                'paramsServ' => $params['paramsServ'])
            );
        } else {
            return array('numero' => $documento->nrodoc,'numeroref' => $documento->numeroref, 'iddocumento' => $documento->iddocumento);
        }
    }


    public function adicionarVenta($params, $documento){
        $documento->DatDocfactura->DatVentafactura->idventas = $params['idventas'];
    }

    public function copiarDocumento($iddocumento, $sameDoc = false, $cancelSigno = false)
    {
        $idCopia = parent::copiarDocumento($iddocumento, $sameDoc, $cancelSigno);
        $docFactura = Doctrine::getTable('DatDocfactura')->find($iddocumento);  
        $recepcion = $docFactura->copy();
        $recepcion->idestructuracomun = -1;
        $datos = $docFactura->toArray();
        unset($datos['idestructuracomun']);
        if ($datos['nrorden'])
          $datos['nrorden'] = $datos['nrorden'].'-FC';
        else
          unset($datos['nrorden']); 
        $datos['idfactura'] = $idCopia;
        $recepcion->synchronizeWithArray($datos);
        $recepcion->save();
        if ($docFactura->nrorden)
          $docFactura->nrorden = $docFactura->nrorden.'-C';
        $docFactura->save();
        $doc = Doctrine::getTable('DatDocumento')->find($idCopia);
        return array('iddocumento' => $idCopia, 'observaciones' => $doc->observaciones);
    }


    public function actualizarImporte($documento)
    {
        $idmonedaAlt = ($this->_dualidadMonedas->idmonedaalternativa) ? $this->_dualidadMonedas->idmonedaalternativa : -1;
        $ubicaciones = Doctrine_Manager::connection()->fetchAll(
            "SELECT * FROM mod_logfacturacion.fn_actualizarpreciobi({$documento}, {$this->_dualidadMonedas->idmoneda}, {$idmonedaAlt})"
        );
        //$confFactModel = new ConfFacturacionModel();
        /*$tipoTasa = $this->confFactModel->cargarConfiguracion(
            $this->idestructura
        )['idtipotasa'];*/
        $this->actualizarImpuestosFactura($documento);
        new DatProdFactura(); //falta los impuestos de la factura
        $importeTotal = 0;
        $documentoFactura = Doctrine::getTable('DatDocfactura')
                ->find(
                $documento
        );
        /*$importeMovCont = $importeMovAlt = $importeServCont = $importeServAlt = array('importetotal' => 0);

        $importeServCont = $this->doctrineHelper->query(
            "SELECT SUM(def.cantidad * dde.preciotarifa) as importetotal from DatElementosFactura def
                     INNER JOIN def.DatDesgloselemento dde
                     WHERE def.idfactura = {$documento} and dde.idmoneda = {$this->_dualidadMonedas->idmoneda}"
        )
            ->getFirst()
            ->toArray();
        if ($documentoFactura->idsubsistema == LogisticaGlobal::SUBSISTEMA_INV) {
            $importeMovCont = $this->doctrineHelper->query(
                "SELECT SUM(dm.cantidad * dmm.precio) as importetotal from DatMovimientos dm
                         INNER JOIN dm.DatMovmoneda dmm
                         where dm.iddocumento = {$documento} and dmm.idmoneda = {$this->_dualidadMonedas->idmoneda}"
            )
                ->getFirst()
                ->toArray();
        }
        $conceptoCont = 0;
        $arrayConceptoCont = $this->doctrineHelper->query(
            "SELECT ddcp.concepto,ddcp.porciento,ddcp.valorcalculo FROM DatDesglosecategoriapreciofactura ddcp
                INNER JOIN ddcp.DatCategoriaPrecioFactura dcpf
                WHERE dcpf.idfactura = {$documento} and ddcp.idmoneda = {$this->_dualidadMonedas->idmoneda}"
        )
            ->toArray();
        foreach ($arrayConceptoCont as $c) {
            if ($c['concepto'] == '+') {
                $conceptoCont += $c['valorcalculo'];
            } else if ($c['concepto'] == '-') {
                $conceptoCont -= $c['valorcalculo'];
            }
        }
        if ($this->_dualidadMonedas->idmonedaalternativa) {
            $importeServAlt = $this->doctrineHelper->query(
                "SELECT SUM(def.cantidad * dde.preciotarifa) as importetotal from DatElementosFactura def
                     INNER JOIN def.DatDesgloselemento dde
                     WHERE def.idfactura = {$documento} and dde.idmoneda = {$this->_dualidadMonedas->idmonedaalternativa}"
            )
                ->getFirst()
                ->toArray();
            if ($documentoFactura->idsubsistema == LogisticaGlobal::SUBSISTEMA_INV) {
                $importeMovAlt = $this->doctrineHelper->query(
                    "SELECT SUM(dm.cantidad * dmm.precio) as importetotal from DatMovimientos dm
                         INNER JOIN dm.DatMovmoneda dmm
                         where dm.iddocumento = {$documento} and dmm.idmoneda = {$this->_dualidadMonedas->idmonedaalternativa}"
                )
                    ->getFirst()
                    ->toArray();
            }
            $arrayConceptoAlt = $this->doctrineHelper->query(
                "SELECT ddcp.concepto,ddcp.porciento,ddcp.valorcalculo FROM DatDesglosecategoriapreciofactura ddcp
                INNER JOIN ddcp.DatCategoriaPrecioFactura dcpf
                WHERE dcpf.idfactura = {$documento} and ddcp.idmoneda = {$this->_dualidadMonedas->idmonedaalternativa}"
            )
                ->toArray();
            $conceptoAlt = 0;
            foreach ($arrayConceptoAlt as $c) {
                if ($c['concepto'] == '+') {
                    $conceptoAlt += $c['valorcalculo'];
                } else {
                    $conceptoAlt -= $c['valorcalculo'];
                }
            }
        }
        if ($documentoFactura->idtipotasa) {
            $this->_tipotasa = $documentoFactura->idtipotasa;
        }
        $importeAlt = $this->configuracionHelper->convertirImporte(
            $this->_dualidadMonedas->idmonedaalternativa, $this->_dualidadMonedas->idmoneda, $this->_tipoTasa, ($importeMovAlt['importetotal'] + $importeServAlt['importetotal'] + $conceptoAlt), 0
        );
        $importeAlt = is_numeric($importeAlt) ? $importeAlt : 0;
        $importeCont = $importeMovCont['importetotal'] + $importeServCont['importetotal'] + $conceptoCont;
        $importeTotal += ($importeCont + $importeAlt);
        $documentoFactura->importetotal = $importeTotal;
        $documentoFactura->importecontable = $importeMovCont['importetotal'] + $importeServCont['importetotal'];
        $documentoFactura->importealt = $importeMovAlt['importetotal'] + $importeServAlt['importetotal'];                
        $documentoFactura->save();*/
        $importes = $this->getImporteTotalDocumento($documento);
        $importeTotal = $importes['importecontable'] + $importes['importealternativo'];
        $documentoFactura->importetotal = $importeTotal;
        $documentoFactura->importecontable = $importes['importecontable'];
        $documentoFactura->importealt = $importes['importealternativo'];
        $documentoFactura->save();
    }

    public function modificarDatosGenerales($parametros)
    {
        /*if ($parametros['datoscuentasuministrador']) {
            $collDS = new Doctrine_Collection('DatCuentafactura');
            $notIn = array();
            $new = array();
            foreach ($parametros['datoscuentasuministrador'] as $index => $valor) {
                $aux = Doctrine::getTable('DatCuentafactura')
                        ->findByDql(
                        'idfactura = ? and idcuentasuministrador = ?', array($parametros['iddocumento'], $valor->idcuentasuministrador)
                );
                if (count($aux) == 0) {
                    $cuentafactura = new DatCuentafactura();
                    $cuentafactura->synchronizeWithArray($valor);
                    $cuentafactura->idfactura = $parametros['iddocumento'];
                    $collDS->add($cuentafactura);
                    $new[] = $valor->idmoneda;
                }
                $notIn[$index] = $valor->idcuentasuministrador;
            }
            $collDS->save();
            //$this->addPrecioNewMonedas($new, $parametros);
            Doctrine_Query::create()
                    ->delete()
                    ->from('DatCuentafactura')
                    ->where(
                            'idfactura = ?', array($parametros['iddocumento'])
                    )
                    ->andWhereNotIn('idcuentasuministrador', $notIn)
                    ->execute();
        }*/
        if ($parametros['datoscuentacliente']) {//hacer lo mismo de arriba
            $collDC = new Doctrine_Collection('DatCuentafacturacliente');
            Doctrine_Query::create()
                    ->delete()
                    ->from('DatCuentafacturacliente')
                    ->where(
                            'idfactura = ?', array($parametros['iddocumento'])
                    )
                    ->execute();
            foreach ($parametros['datoscuentacliente'] as $index => $valor) {
                if ($valor->idcuentacliente = -1) {
                    $valor->idcuentacliente = null;
                    $valor->idmoneda = null;
                    $valor->numerocuenta = $valor->cuenta;
                }
                $cuentafacturacliente = new DatCuentafacturacliente();
                $cuentafacturacliente->synchronizeWithArray($valor);
                $cuentafacturacliente->idfactura = $parametros['iddocumento'];
                $collDC->add($cuentafacturacliente);
            }
            $collDC->save();
        }
        if($parametros['idcliente']){
            $auxC = Doctrine::getTable('DatDocumentoCliente')
                ->findByDql(
                    'iddocumento = ?',
                    array($parametros['iddocumento'])
                );
            $auxC[0]->synchronizeWithArray($parametros);
            $auxC[0]->save();
        }
    }

    /* public function addPrecioNewMonedas($monedas, $parametros){
      if($parametros['idsubsistema'] == LogisticaGlobal::SUBSISTEMA_INV){

      }else{
      $query = new Doctrine_Query();
      $productos = $query->select(
      'def.idelementofactura,
      dps.idtipoprecio as idtipoprecio,
      dps.idindicador as idindicador'
      )
      ->from('DatElementosFactura def')
      ->innerJoin('def.DatProdServNomenclador dps')
      ->where('def.idfactura = ?', array($parametros['iddocumento']))
      ->fetchArray();
      $collection = new Doctrine_Collection('DatDesgloselemento');
      foreach($productos as $index => $prod){
      $params = new stdClass();
      $params->idindicador = $prod['idindicador'];
      $params->idtipoprecio = $prod['idtipoprecio'];
      $prec = $this->getPrecio($params);
      foreach($monedas as $moneda){
      $cuentafactura = Doctrine::getTable('DatCuentafactura')->findByDql(
      'idfactura = ? and idmoneda = ?',
      array($parametros['iddocumento'], $moneda)
      );
      $obj = new DatDesgloselemento();
      $obj->idcuentafactura = $cuentafactura[0]->idcuentafactura;
      $obj->idelementofactura = $prod['idelementofactura'];
      $obj->preciotarifa = is_array($prec)?$prec['datos'][$moneda]['precioventa']:0;
      $collection->add($obj);
      }
      }
      $collection->save();
      }
      } */

    /**
     * Funcion que permite modificar una nueva factura
     *
     * @param array $params Arreglo con los datos necesarios
     *                      para crear una nueva factura
     *
     * @return boolean Retorna true si fue un exito la accion
     */
    public function modificarFactura($params)
    {
        $documento = $this->findDocumento($params['iddocumento']);
        if ($documento->estado == EstadoDocumentoModel::ESTADO_ELABORACION) {
            $documentoFactura = Doctrine::getTable('DatDocfactura')
                ->find(
                    $params['iddocumento']
                );
            $this->verificarNroOrden($params);
            if (isset($params['idnumerocontrol']) && $params['idnumerocontrol'] == null) {
                $numeroControl = Doctrine::getTable('DatNumerocontrol')
                    ->find($documentoFactura->idnumerocontrol);
                $numeroControl->asignado = 0;
                $numeroControl->save();
                $documentoFactura->idnumerocontrol = null;
                unset($params['idnumerocontrol']);
            } else {
                if ($params['idnumerocontrol'] != null) {
                    $numeroControl = Doctrine::getTable('DatNumerocontrol')
                        ->find($params['idnumerocontrol']);
                    $numeroControl->asignado = 1;
                    $numeroControl->save();
                }
            }
            if ($params['idcondicionpago'] == null) {
                unset($params['idcondicionpago']);
            }
            if (strlen($params['idclienteauxiliar']) == 0) {
                unset($params['idclienteauxiliar']);
            }
            $factoranterior = $documentoFactura->factorconvercion;
            if ($params['idmoneda'] && $params['idmoneda'] == $this->_dualidadMonedas->idmoneda) {
                $params['factorconvercion'] = 1;
                $params['factoranterior'] = $factoranterior;
            }
            $documentoFactura->synchronizeWithArray($params);
            if ($params['idcondicionpago'] == -1) {
                $params['idcondicionpago'] = null;        
                }
            $this->modificarDatosGenerales($params); //ampliar este metodo para mejorar el modificar(muy grande)
            if ($params['numero'] || $params['fecha']) {
                $datosContrato = Doctrine::getTable('DatFacturacontrato')
                    ->find($params['iddocumento']);
                if (!$datosContrato) {
                    $datosContrato = new DatFacturacontrato();
                    $datosContrato->idfactura = $params['iddocumento'];
                }
                $datosContrato->synchronizeWithArray($params);
            }
            if (isset($params['reservaprecio']) || isset($params['reservadisponible'])) {
                $datosPrefactura = Doctrine::getTable('DatFacturaPrefactura')
                    ->find($params['iddocumento']);
                $datosPrefactura->synchronizeWithArray($params);
            }
            if ($params['observaciones'] || $params['iddeposito'] || $params['observaciones'] == '') {
                $documento->synchronizeWithArray($params);
                //$documento->idestructuracomun = $params['iddeposito'];
                $documento->save();
            }
            if ($params['idoperacionmod']) {
                $documento->idoperacion = $params['idoperacionmod'];
                $documento->save();
            }
            /*if ($params['depositoAreas']) {
                DatAreaFactura::deleteAreasFacturas(array($params['iddocumento']));
                $coll = new Doctrine_Collection('DatAreaFactura');
                foreach ($params['depositoAreas'] as $area) {
                    $areaObj = new DatAreaFactura();
                    $areaObj->idarea = $area;
                    $areaObj->idfactura = $params['iddocumento'];
                    $coll->add($areaObj);
                }
                $coll->save();
            }*/
            $datosTransportador = Doctrine::getTable('DatDocFacturaTransportacion')
                ->find($params['iddocumento']);
            if ($datosTransportador) {
                $datosTransportador->synchronizeWithArray($params);
                $datosTransportador->save();
            }

            if ($datosContrato) {
                $datosContrato->save();
            }
            if ($datosPrefactura) {
                $datosPrefactura->save();
            }
            if ($params['idmoneda']) {
                $documentoFactura->idmonedaprod = null;
            }
            $documentoFactura->save();
            if ($params['productos']) {
                $this->modificarProductos($params, $documentoFactura);
            }
            if ($params['servicios']) {
                $elemtModel = new ElementosFacturaModel();
                $elemtModel->modificarElementos($params, $documentoFactura, 0);
            }
             if ($params['idmoneda'] || $params['factorconvercion']) {
              $params['factoranterior'] = $factoranterior;
              $this->recalcularPrecio($params, $documentoFactura);
              }
            if ($params['prodservicios']) {
                $this->modificarProdServicios($params['prodservicios']);
            }
            if ($params['conceptos']) {
                $this->modificarConceptos($params['iddocumento'], $params['conceptos']);
            }
            if ($params['lotes']) {
                $this->modificarLotes(
                    $params['lotes'], array('collection' => true, 'signo' => '-', 'actualizarMov' => true, 'afectaLote' => true)
                );
            }
            $this->actualizarImporte($params['iddocumento']);
            if ($params['idmoneda'] == $this->_dualidadMonedas->idmoneda) {
                $documentoFactura->idmoneda = null;
                $documentoFactura->factorconvercion = null;
                $documentoFactura->save();
            }

            if ($params['aplicar']) {
                return $this->obtenerFacturas(
                    array('iddocumento' => $params['iddocumento'], 'aplicar' => true, 'filtrado' => 1,
                        'idsubsistema' => $documentoFactura->idsubsistema, 'paramsProd' => $params['paramsProd'],
                        'paramsServ' => $params['paramsServ'])
                );
            } else {
                return true;
            }
        } else if (($documento->estado == EstadoDocumentoModel::ESTADO_CONTABILIZADO || $documento->estado == EstadoDocumentoModel::ESTADO_APROBADO) && !$documento->idcomprobante) {
            if ($params['conceptos']) {
                $this->modificarConceptos($params['iddocumento'], $params['conceptos']);
            }
            if ($params['idcentrocosto'] || $params['idcondicionpago']) {
                $documentoFactura = Doctrine::getTable('DatDocfactura')
                    ->find(
                        $params['iddocumento']
                    );
                if ($params['idcentrocosto'])
                    $documentoFactura->idcentrocosto = $params['idcentrocosto'];
                if ($params['idcondicionpago']) {
                    if ($params['idcondicionpago'] == -1) {
                        $params['idcondicionpago'] = null;
                    }
                    $documentoFactura->idcondicionpago = $params['idcondicionpago'];
                    $documentoCliente = Doctrine::getTable('DatDocumentoCliente')
                        ->findByDql(
                            'iddocumento = ?', array($params['iddocumento'])
                        );
                    $documentoCliente[0]->idcondicionpago = $params['idcondicionpago'];
                    $documentoCliente[0]->save();
                }
                $documentoFactura->save();
            }
            if ($params['idoperacionmod']) {
                $documento = Doctrine::getTable('DatDocumento')
                    ->find(
                        $params['iddocumento']
                    );
                $documento->idoperacion = $params['idoperacionmod'];
                $documento->save();
            }
            return $this->obtenerFacturas(
                array('iddocumento' => $params['iddocumento'], 'aplicar' => true, 'filtrado' => 1,
                    'idsubsistema' => $documentoFactura->idsubsistema, 'paramsProd' => $params['paramsProd'],
                    'paramsServ' => $params['paramsServ'])
            );
        }
    }

    public function modificarProductos($params, $documentoFactura)
    {
        $idmonedafactura = ($params['idmoneda']) ? $params['idmoneda'] : ($documentoFactura->idmonedaprod ? $documentoFactura->idmonedaprod : $documentoFactura->idmoneda);
        $fconv = is_numeric($documentoFactura->factorconvercion) ? $documentoFactura->factorconvercion : 1;
        if ($documentoFactura->idtipotasa) {
            $this->_tipotasa = $documentoFactura->idtipotasa;
        }
        $reservaDisponible = false;
        if ($documentoFactura->oferta) {
            $preffactura = Doctrine::getTable('DatFacturaPrefactura')
                ->find(
                    $documentoFactura->idfactura
                );
            if ($preffactura->reservadisponible) {
                $reservaDisponible = true;
                $prodModel = new LogisticaProductoModel();
            }
        }
        $serviceLote = new LoteService();
        if ($documentoFactura->idsubsistema == LogisticaGlobal::SUBSISTEMA_INV && $documentoFactura->oferta == 0) {
            $objProdFactura = new DatProdFactura();
            $nombreDesglose = 'DatMovmoneda';
        } else {
            $objProdServ = ($documentoFactura->idsubsistema == LogisticaGlobal::SUBSISTEMA_AFT)
                ? new DatActivosfactura(): new DatProdServNomenclador();
            $nombreDesglose = 'DatDesgloselemento';
        }
        $cElementos = new Doctrine_Collection('DatElementosFactura');
        $cElementoCateg = new Doctrine_Collection('DatElementocategoria');
        $cDesgloseElementos = new Doctrine_Collection($nombreDesglose);
        $monedas = $this->getDualidadMonedas();
        $umSql = "select count(nv.nombre) from mod_logistica.nom_variableglobal nv 
                          where nv.nombre = 'USAR_UM_MATRIZ' and nv.valor = 'true'";
        $um = LogisticaDoctrineHelper::__init()->getConnection()->execute($umSql)->fetchAll(PDO::FETCH_COLUMN);
        $usarUm = ($um[0] > 0) ? true : false;
        foreach ($params['productos'] as &$prod) {
            $prod = (array) $prod;
            if ($reservaDisponible) {
                $prodOferta = Doctrine::getTable('DatElementosFactura')
                    ->find(
                        $prod['idelementofactura']
                    );
                $tempArrData = $prodOferta->toArray();
                $cantidad = floatval($tempArrData['cantidad']) - floatval($prod['cantidad']);
                $prodModel->checkDisponibleProducto($prodOferta->idprod, $cantidad);
                $datosCatComp['iddocumento'] = $documentoFactura->idfactura;
                $datosCatComp['idproducto'] = $prodOferta->idprod;
                $datosCatComp['cantidad'] = $prod['cantidad'];
                $comprometida = new CantidadesComprometidasModel();
                $comprometida->insertarCantidadComprometida($datosCatComp);
            }
            if ($prod['cambioTipoPrecio']) {
                $value = new stdClass();
                $value->idtipoprecio = $prod['idtipoprecio'];
                $value->idestructura = $this->idestructura;
                $value->idindicador = $prod['idindicador'];
                $value->idumedidacrc = $prod['idumedidacrc'];
                $value->idfactura = $documentoFactura->idfactura;
                $value->idcliente = $documentoFactura->idcliente;
                if ($documentoFactura->oferta != 0) {
                   if($prod['idproducto']) {
                       $value->idproducto = $prod['idproducto'];
                   }   
                }
                if($prod['idregnumerico'])
                    $value->idregnumerico = $prod['idregnumerico'];
                $clienteMoneda = $this->isUnicaMoneda(
                    array('idtipoprecio'=>$prod['idtipoprecio'], 'idcliente'=>$documentoFactura->idcliente, 'idestructura'=>$this->idestructura)
                );
                $idmonedaunica = false;
                if ($prod['idmovimiento']) {
                    $prodFact = $objProdFactura->getProdFactura(
                            $prod['idmovimiento']
                    );
                    $value->idproducto = $prod['idproducto'];
                    $value->idmovimiento = $prod['idmovimiento'];
                    unset($prod['preciocontable']);
                    if(count($clienteMoneda) > 0){
                        $idmonedaunica = $clienteMoneda[0]['idmoneda'];
                        $prec = $this->getPrecio($value, $idmonedaunica, $idmonedafactura, $usarUm, $fconv);
                    }else{
                        $prec = $this->getPrecio($value, false, $idmonedafactura, $usarUm, $fconv);
                    }
                    Doctrine_Query::create()
                            ->delete()
                            ->from('DatElementocategoria')
                            ->where(
                                    'idmovimiento = ?', array($prod['idmovimiento'])
                            )
                            ->execute();
                    if ($prec == -2) {
                        $this->modificarPrecioManualInv(
                            $prod, $documentoFactura->idfactura, $prodFact[0], $cDesgloseElementos, $idmonedaunica
                        );
                    } else {
                        if (is_array($prec)) {
                            $idmonedaPrecio = $monedas->idmoneda;
                            if ($idmonedafactura && isset($prec['datos'][$idmonedafactura])){
                                $idmonedaPrecio = $idmonedafactura;
                            }
                            $prodFact[0]->preciobase = $prec['precioventa'];
                            $prodFact[0]->referencia = $prec['datos'][$idmonedaPrecio]['precio'];
                            $prodFact[0]->mediatotal = $prec['datos'][$idmonedaPrecio]['media'];
                            if ($monedas->idmonedaalternativa)
                                $prodFact[0]->referenciaalt = $prec['datos'][$monedas->idmonedaalternativa]['precio'];
                            if($idmonedaunica){
                                $this->precioUnicaMonedaDesglose($monedas, $prod, $prec, $cDesgloseElementos, $cElementoCateg,$idmonedaunica);
                            }else{
                                $monedaMov = Doctrine::getTable('DatMovmoneda')
                                    ->findByDql(
                                        'idmovimiento = ? and idmoneda = ?', array($prod['idmovimiento'], $monedas->idmoneda)
                                    );
                                if (count($monedaMov) > 0) {
                                    $obj = $monedaMov[0];
                                } else {
                                    $obj = new DatMovmoneda();
                                    $obj->idmovimiento = $prod['idmovimiento'];
                                    $obj->idmoneda = $monedas->idmoneda;
                                }

                                $obj->precio = is_array($prec) ? $prec['datos'][$idmonedaPrecio]['precioventa'] : 0;
                                $obj->importe = round($obj->precio * $prod['cantidad'],2);
                                $cDesgloseElementos->add($obj);
                                foreach ($prec['datos'][$idmonedaPrecio]['DatPrecio'] as $i => &$d) {
                                    if ($d['porciento'] == 1) {
                                        $d['valor'] = $prec['datos'][$idmonedaPrecio]['precio'] * $d['valor'] / 100;
                                    } else {
                                        if(!$monedas->idmonedaalternativa && $idmonedafactura) {
                                            if ($idmonedaPrecio == $monedas->idmoneda) {
                                                $d['valor'] = $this->configuracionHelper->convertirImporte(
                                                    $this->_dualidadMonedas->idmoneda, $idmonedafactura, $this->_tipotasa, $d['valor'], 1
                                                );
                                            }
                                        }
                                    }
                                    $elementoCategoria = new DatElementocategoria();
                                    $elementoCategoria->synchronizeWithArray($d);
                                    $elementoCategoria->idindicador = $prod['idindicador'];
                                    $elementoCategoria->idmovimiento = $prod['idmovimiento'];
                                    $elementoCategoria->idmoneda = $monedas->idmoneda;
                                    $cElementoCateg->add($elementoCategoria);
                                }
                                if ($monedas->idmonedaalternativa){
                                    $monedaMov = Doctrine::getTable('DatMovmoneda')
                                        ->findByDql(
                                            'idmovimiento = ? and idmoneda = ?', array($prod['idmovimiento'], $monedas->idmonedaalternativa)
                                        );
                                    if (count($monedaMov) > 0) {
                                        $obj = $monedaMov[0];
                                    } else {
                                        $obj = new DatMovmoneda();
                                        $obj->idmovimiento = $prod['idmovimiento'];
                                        $obj->idmoneda = $monedas->idmonedaalternativa;
                                    }
                                                                       
                                    $obj->precio = is_array($prec) ? $prec['datos'][$monedas->idmonedaalternativa]['precioventa'] : 0;
                                    $obj->importe = round($obj->precio * $prod['cantidad'],2);
                                    $cDesgloseElementos->add($obj);
                                    foreach ($prec['datos'][$monedas->idmonedaalternativa]['DatPrecio'] as $i => &$d) {
                                        if ($d['porciento'] == 1) {
                                            $d['valor'] = $prec['datos'][$monedas->idmonedaalternativa]['precio'] * $d['valor'] / 100;
                                        }
                                        $elementoCategoria = new DatElementocategoria();
                                        $elementoCategoria->synchronizeWithArray($d);
                                        $elementoCategoria->idindicador = $prod['idindicador'];
                                        $elementoCategoria->idmovimiento = $prod['idmovimiento'];
                                        $elementoCategoria->idmoneda = $monedas->idmonedaalternativa;
                                        $cElementoCateg->add($elementoCategoria);
                                    }
                                }
                            }
                        }
                    }
                    $this->actualizarCumplRegCant($prod, $documentoFactura);
                    if ($documentoFactura->oferta == 1) {
                        $this->actualizarCmptoPrefMov($prod);
                    }
                } else {
                    $elemento = Doctrine::getTable('DatElementosFactura')
                            ->find(
                            $prod['idelementofactura']
                    );
                    $prodFact = $objProdServ->getProdServicio(
                            $prod['idelementofactura']
                    );
                    if(count($clienteMoneda) > 0){
                        $idmonedaunica = $clienteMoneda[0]['idmoneda'];
                        $prec = $this->getPrecio($value, $idmonedaunica,$idmonedafactura, $usarUm, $documentoFactura->factorconvercion);
                    }else{
                        $prec = $this->getPrecio($value,false,$idmonedafactura, $usarUm, $documentoFactura->factorconvercion);
                    }
                    Doctrine_Query::create()
                            ->delete()
                            ->from('DatElementocategoria')
                            ->where(
                                    'idelementofactura = ?', array($prod['idelementofactura'])
                            )
                            ->execute();
                    if ($prec == -2) {
                        $this->modificarPrecioManual($prod, $documentoFactura->idfactura, $elemento,
                            $cDesgloseElementos,$idmonedaunica,$idmonedafactura);
                    } else {
                        if (is_array($prec)) {
                            $elemento->preciotarifabase = $prec['precioventa'];
                            if($idmonedaunica){
                                $this->precioUnicaMonedaDesglose($monedas, $prod, $prec, $cDesgloseElementos, $cElementoCateg,$idmonedaunica);
                            }else{
                                $idmonedaPrecio = $monedas->idmoneda;
                                if ($idmonedafactura && isset($prec['datos'][$idmonedafactura])){
                                    $idmonedaPrecio = $idmonedafactura;
                                }
                                $desg = Doctrine::getTable('DatDesgloselemento')
                                    ->findByDql(
                                        'idmoneda = ? and idelementofactura = ?', array($monedas->idmoneda, $prod['idelementofactura'])
                                    );
                                if (count($desg) > 0) {
                                    $obj = $desg[0];
                                } else {
                                    $obj = new DatDesgloselemento();
                                    $obj->idmoneda = $monedas->idmoneda;
                                    $obj->idelementofactura = $prod['idelementofactura'];
                                }
                                $obj->preciotarifa = is_array($prec) ? $prec['datos'][$idmonedaPrecio]['precioventa'] : 0;
                                $cDesgloseElementos->add($obj);
                                foreach ($prec['datos'][$idmonedaPrecio]['DatPrecio'] as $i => &$d) {
                                    if ($d['porciento'] == 1) {
                                        $d['valor'] = $prec['datos'][$idmonedaPrecio]['precio'] * $d['valor'] / 100;
                                    } else {
                                        if(!$monedas->idmonedaalternativa && $idmonedafactura) {
                                            if ($idmonedaPrecio == $monedas->idmoneda) {
                                                $d['valor'] = $this->configuracionHelper->convertirImporte(
                                                    $this->_dualidadMonedas->idmoneda, $idmonedafactura, $this->_tipotasa, $d['valor'], 1
                                                );
                                            }
                                        }
                                    }
                                    $elementoCategoria = new DatElementocategoria();
                                    $elementoCategoria->synchronizeWithArray($d);
                                    $elementoCategoria->idindicador = $prod['idindicador'];
                                    $elementoCategoria->idelementofactura = $prod['idelementofactura'];
                                    $elementoCategoria->idmoneda = $monedas->idmoneda;
                                    $cElementoCateg->add($elementoCategoria);
                                }
                                if($monedas->idmonedaalternativa){
                                    $desg = Doctrine::getTable('DatDesgloselemento')
                                        ->findByDql(
                                            'idmoneda = ? and idelementofactura = ?', array($monedas->idmonedaalternativa, $prod['idelementofactura'])
                                        );
                                    if (count($desg) > 0) {
                                        $obj = $desg[0];
                                    } else {
                                        $obj = new DatDesgloselemento();
                                        $obj->idmoneda = $monedas->idmonedaalternativa;
                                        $obj->idelementofactura = $prod['idelementofactura'];
                                    }
                                    $obj->preciotarifa = is_array($prec) ? $prec['datos'][$monedas->idmonedaalternativa]['precioventa'] : 0;
                                    $cDesgloseElementos->add($obj);
                                    foreach ($prec['datos'][$monedas->idmonedaalternativa]['DatPrecio'] as $i => &$d) {
                                        if ($d['porciento'] == 1) {
                                            $d['valor'] = $prec['datos'][$monedas->idmonedaalternativa]['precio'] * $d['valor'] / 100;
                                        }
                                        $elementoCategoria = new DatElementocategoria();
                                        $elementoCategoria->synchronizeWithArray($d);
                                        $elementoCategoria->idindicador = $prod['idindicador'];
                                        $elementoCategoria->idelementofactura = $prod['idelementofactura'];
                                        $elementoCategoria->idmoneda = $monedas->idmonedaalternativa;
                                        $cElementoCateg->add($elementoCategoria);
                                    }
                                }
                            }
                            /*foreach ($monedas as $m) {
                                $desg = Doctrine::getTable('DatDesgloselemento')
                                        ->findByDql(
                                        'idmoneda = ? and idelementofactura = ?', array($m, $prod['idelementofactura'])
                                );
                                if (count($desg) > 0) {
                                    $obj = $desg[0];
                                } else {
                                    $obj = new DatDesgloselemento();
                                    $obj->idmoneda = $m;
                                    $obj->idelementofactura = $prod['idelementofactura'];
                                }
                                $obj->preciotarifa = is_array($prec) ? $prec['datos'][$m]['precioventa'] : 0;
                                $cDesgloseElementos->add($obj);
                                foreach ($prec['datos'][$m]['DatPrecio'] as $i => &$d) {
                                    if ($d['porciento'] == 1) {
                                        $d['valor'] = $prec['datos'][$m]['precio'] * $d['valor'] / 100;
                                    }
                                    $elementoCategoria = new DatElementocategoria();
                                    $elementoCategoria->synchronizeWithArray($d);
                                    $elementoCategoria->idindicador = $prod['idindicador'];
                                    $elementoCategoria->idelementofactura = $prod['idelementofactura'];
                                    $elementoCategoria->idmoneda = $m;
                                    $cElementoCateg->add($elementoCategoria);
                                }
                            }*/
                        } else {
                            $elemento->preciotarifabase = $prec;
                        }
                    }
                    if ($documentoFactura->oferta == 1) {
                        $this->actualizarCmptoPref($prod);
                    }
                    $elemento->synchronizeWithArray($prod);
                    $cElementos->add($elemento);
                }
                $prodFact[0]->idtipoprecio = $prod['idtipoprecio'];
                $prodFact[0]->referencia = $prec['datos'][$idmonedaPrecio]['precio'];
                $prodFact[0]->mediatotal = $prec['datos'][$idmonedaPrecio]['media'];
                $prodFact[0]->referenciaalt = $prec['datos'][$monedas->idmonedaalternativa]['precio'];
                $prodFact[0]->save();
            } else {
                if ($prod['idmovimiento']) {
                    $this->actualizarCumplRegCant($prod, $documentoFactura);
                    if ($documentoFactura->oferta == 1) {
                        $this->actualizarCmptoPrefMov($prod);
                    }
                    unset($prod['preciocontable']);
                } else {
                    if ($documentoFactura->oferta == 1) {
                        $this->actualizarCmptoPref($prod);
                    }
                    $elemento = Doctrine::getTable('DatElementosFactura')
                            ->find(
                            $prod['idelementofactura']
                    );
                    /* if (isset($prod['preciocontable'])) {
                      $prod['importe'] = $prod['preciocontable'] * $prod['cantidad'];
                      } */
                    $elemento->synchronizeWithArray($prod);
                    $cElementos->add($elemento);
                }
            }
            if ($prod['idmovimiento']) {
                $movObj =  Doctrine::getTable('DatMovimientos')->find($prod['idmovimiento']);
                $prod['preciocontable'] = $movObj->preciocontable;
                $prod['precioalternativo'] = $movObj->precioalternativo;
                if ($this->objIddocNotaCredito->iddoc && $documentoFactura->iddoc = $this->objIddocNotaCredito->iddoc) {
                    $prod['entrada'] = true;
                }
            }
        }
        if ($cElementos->count()) {
            $cElementos->save();
        }
        if ($cElementoCateg->count()) {
            $cElementoCateg->save();
        }
        if ($cDesgloseElementos->count()) {
            $cDesgloseElementos->save();
        }
        /*if ($params['idsubsistema'] == LogisticaGlobal::SUBSISTEMA_INV && $documentoFactura->oferta == 0) {
            $serviceLote->extraerCantidades($params['productos'], true);
        }*/
        if ($params['productos'][0]['idmovimiento']) {
            //$prodLogModel = new LogisticaProductoModel();
            //$prodLogModel->modificarMovimientos(
            $afectaDisponible = true;
            if ($params['afectaDisponible'] == 0) {
                $afectaDisponible = false;
            }
            $this->producto->modificarMovimientos(
                    $params['productos'], $afectaDisponible
            ); //verificar si tiene documento origen para afectar el disponible
        }/* else {
          $elemtModel = new ElementosFacturaModel();
          $elemtModel->modificarElementos(
          $params['productos']
          );
          } */
    }

    public function precioUnicaMonedaDesglose($monedas, $prod, $prec, $cDesgloseElementos, $cElementoCateg, $idmonedaunica){
        $tasa = $this->configuracionHelper->getTasaByMonedas(
            $this->_dualidadMonedas->idmoneda, $this->_dualidadMonedas->idmonedaalternativa, $this->_tipotasa
        );
        if($monedas->idmoneda == $idmonedaunica){
            $idMonedacero = $monedas->idmonedaalternativa;
            $tasaAux = $tasa[0]['compra'];
        }else{
            $idMonedacero = $monedas->idmoneda;
            $tasaAux = $tasa[0]['venta'];
        }
        if ($prod['idmovimiento']){
            $monedaMov = Doctrine::getTable('DatMovmoneda')
                ->findByDql(
                    'idmovimiento = ? and idmoneda = ?', array($prod['idmovimiento'], $idmonedaunica)
                );
            if (count($monedaMov) > 0) {
                $obj = $monedaMov[0];
            } else {
                $obj = new DatMovmoneda();
                $obj->idmovimiento = $prod['idmovimiento'];
                $obj->idmoneda = $idmonedaunica;
            }
            $obj->precio = is_array($prec)
                ? $prec['datos'][$idmonedaunica]['precioventa'] /*+ $this->convertirPrecio(
                    $tasaAux, $tasa[0]['factordeconversion'], $prec['datos'][$idMonedacero]['precioventa']
                )*/
                : 0;
            $obj->importe = round($obj->precio * $prod['cantidad'],2);
            $monedaMov1 = Doctrine::getTable('DatMovmoneda')
                ->findByDql(
                    'idmovimiento = ? and idmoneda = ?', array($prod['idmovimiento'], $idMonedacero)
                );
            if (count($monedaMov1) > 0) {
                $obj1 = $monedaMov1[0];
            } else {
                $obj1 = new DatMovmoneda();
                $obj1->idmovimiento = $prod['idmovimiento'];
                $obj1->idmoneda = $idMonedacero;
            }
            $obj1->precio = 0;
            $obj1->importe = round($obj1->precio * $prod['cantidad'],2);
        } else {
            $desg = Doctrine::getTable('DatDesgloselemento')
                ->findByDql(
                    'idmoneda = ? and idelementofactura = ?', array($idmonedaunica, $prod['idelementofactura'])
                );
            if (count($desg) > 0) {
                $obj = $desg[0];
            } else {
                $obj = new DatDesgloselemento();
                $obj->idmoneda = $idmonedaunica;
                $obj->idelementofactura = $prod['idelementofactura'];
            }
            $obj->preciotarifa = is_array($prec)
                ? $prec['datos'][$idmonedaunica]['precioventa']/* + $this->convertirPrecio(
                        $tasaAux, $tasa[0]['factordeconversion'], $prec['datos'][$idMonedacero]['precioventa']
                    )*/
                : 0;
            $desg1 = Doctrine::getTable('DatDesgloselemento')
                ->findByDql(
                    'idmoneda = ? and idelementofactura = ?', array($idMonedacero, $prod['idelementofactura'])
                );
            if (count($desg1) > 0) {
                $obj1 = $desg1[0];
            } else {
                $obj1 = new DatDesgloselemento();
                $obj1->idmoneda = $idMonedacero;
                $obj1->idelementofactura = $prod['idelementofactura'];
            }
            $obj1->preciotarifa = 0;
        }
        $cDesgloseElementos->add($obj);
        $cDesgloseElementos->add($obj1);
        foreach ($prec['datos'][$idmonedaunica]['DatPrecio'] as $i => &$d) {
            if ($d['porciento'] == 1) {
                $d['valor'] = $prec['datos'][$idmonedaunica]['precio'] * $d['valor'] / 100;
                $d['valor'] += $this->convertirPrecio($tasaAux,
                    $tasa[0]['factordeconversion'],
                    $prec['datos'][$idMonedacero]['precio'] * $prec['datos'][$idMonedacero]['DatPrecio'][$i]['valor'] / 100);
            }else{
                $d['valor'] += $this->convertirPrecio($tasaAux, $tasa[0]['factordeconversion'], $prec['datos'][$idMonedacero]['DatPrecio'][$i]['valor']);
            }
            $elementoCategoria = new DatElementocategoria();
            $elementoCategoria->synchronizeWithArray($d);
            $elementoCategoria->idindicador = $prod['idindicador'];
            if($prod['idmovimiento']){
                $elementoCategoria->idmovimiento = $prod['idmovimiento'];
            }else{
                $elementoCategoria->idelementofactura = $prod['idelementofactura'];
            }
            $elementoCategoria->idmoneda = $idmonedaunica;
            $cElementoCateg->add($elementoCategoria);
        }
        foreach ($prec['datos'][$idMonedacero]['DatPrecio'] as $i => &$d) {
            $d['valor'] = 0;
            $elementoCategoria = new DatElementocategoria();
            $elementoCategoria->synchronizeWithArray($d);
            $elementoCategoria->idindicador = $prod['idindicador'];
            if($prod['idmovimiento']){
                $elementoCategoria->idmovimiento = $prod['idmovimiento'];
            }else{
                $elementoCategoria->idelementofactura = $prod['idelementofactura'];
            }
            $elementoCategoria->idmoneda = $idMonedacero;
            $cElementoCateg->add($elementoCategoria);
        }
    }

    public function precioUnicaMonedaDesgloseServicio($monedas, $prod, $prec, $cDesgloseElementos, $cElementoCateg, $idmonedaunica, $materiales = false){
        $tasa = $this->configuracionHelper->getTasaByMonedas(
            $this->_dualidadMonedas->idmoneda, $this->_dualidadMonedas->idmonedaalternativa, $this->_tipotasa
        );
        if($monedas->idmoneda == $idmonedaunica){
            $idMonedacero = $monedas->idmonedaalternativa;
            $tasaAux = $tasa[0]['compra'];
        }else{
            $idMonedacero = $monedas->idmoneda;
            $tasaAux = $tasa[0]['venta'];
        }
        $desg = Doctrine::getTable('DatDesgloselemento')
            ->findByDql(
                'idmoneda = ? and idelementofactura = ?', array($idmonedaunica, $prod['idelementofactura'])
            );
        if (count($desg) > 0) {
            $obj = $desg[0];
        } else {
            $obj = new DatDesgloselemento();
            $obj->idmoneda = $idmonedaunica;
            $obj->idelementofactura = $prod['idelementofactura'];
        }
        if($prod['orden']){
            $elementoCategoria = new DatElementocategoria();
            if($monedas->idmoneda == $idmonedaunica){
                $sumado = $prod['precio'] + $this->convertirPrecio(
                        $tasaAux, $tasa[0]['factordeconversion'], $prod['precioalternativo']
                    );
            }else{

                $sumado = $prod['precioalternativo'] + $this->convertirPrecio(
                    $tasaAux, $tasa[0]['factordeconversion'], $prod['precio']
                );
            }
            $obj->preciotarifaoriginal =  $sumado;
            $elementoCategoria->valor = $sumado;
            $obj->preciotarifa = $obj->preciotarifaoriginal;
            $elementoCategoria->idindicador = $prod['idindicador'];
            $elementoCategoria->idelementofactura = $prod['idelementofactura'];
            $elementoCategoria->idmoneda = $idmonedaunica;
            $cElementoCateg->add($elementoCategoria);
        } else {
            $obj->preciotarifaoriginal = is_array($prec)
                ?$prec['datos'][$idmonedaunica]['precioventa']
                : 0;
            $obj->preciotarifa = $obj->preciotarifaoriginal;
        }

        if($prec['preciopromedio'] && $prec['preciopromedio'] == 1)
            $obj->preciotarifa += $materiales[$idmonedaunica];

        $desg1 = Doctrine::getTable('DatDesgloselemento')
            ->findByDql(
                'idmoneda = ? and idelementofactura = ?', array($idMonedacero, $prod['idelementofactura'])
            );
        if (count($desg1) > 0) {
            $obj1 = $desg1[0];
        } else {
            $obj1 = new DatDesgloselemento();
            $obj1->idmoneda = $idMonedacero;
            $obj1->idelementofactura = $prod['idelementofactura'];
        }
        $obj1->preciotarifaoriginal = 0;
        $obj1->preciotarifa = 0;
        $cDesgloseElementos->add($obj);
        $cDesgloseElementos->add($obj1);
        foreach ($prec['datos'][$idmonedaunica]['DatPrecio'] as $i => &$d) {
            if($prec['preciopromedio'] && $prec['preciopromedio'] == 1){
                if ($d['porciento'] == 1) {
                    $d['valor'] = $prec['datos'][$idmonedaunica]['precio'] + $materiales[$idmonedaunica] * $d['valor'] / 100;
                    $d['valor'] += $this->convertirPrecio($tasaAux,
                        $tasa[0]['factordeconversion'],
                        $prec['datos'][$idMonedacero]['precio'] * $prec['datos'][$idMonedacero]['DatPrecio'][$i]['valor'] / 100);
                }else{
                    $d['valor'] += $this->convertirPrecio(
                        $tasaAux, $tasa[0]['factordeconversion'], $prec['datos'][$idMonedacero]['DatPrecio'][$i]['valor']
                    );
                }
            } else {
                if ($d['porciento'] == 1) {
                    $d['valor'] = $prec['datos'][$idmonedaunica]['precio'] * $d['valor'] / 100;
                    $d['valor'] += $this->convertirPrecio($tasaAux,
                        $tasa[0]['factordeconversion'],
                        $prec['datos'][$idMonedacero]['precio'] * $prec['datos'][$idMonedacero]['DatPrecio'][$i]['valor'] / 100);
                }else{
                    $d['valor'] += $this->convertirPrecio($tasaAux, $tasa[0]['factordeconversion'], $prec['datos'][$idMonedacero]['DatPrecio'][$i]['valor']);
                }
            }
            $elementoCategoria = new DatElementocategoria();
            $elementoCategoria->synchronizeWithArray($d);
            $elementoCategoria->idindicador = $prod['idindicador'];
            $elementoCategoria->idelementofactura = $prod['idelementofactura'];
            $elementoCategoria->idmoneda = $idmonedaunica;
            $cElementoCateg->add($elementoCategoria);
        }
        foreach ($prec['datos'][$idMonedacero]['DatPrecio'] as $i => &$d) {
            $d['valor'] = 0;
            $elementoCategoria = new DatElementocategoria();
            $elementoCategoria->synchronizeWithArray($d);
            $elementoCategoria->idindicador = $prod['idindicador'];
            $elementoCategoria->idelementofactura = $prod['idelementofactura'];
            $elementoCategoria->idmoneda = $idMonedacero;
            $cElementoCateg->add($elementoCategoria);
        }
    }

    public function modificarPrecioManual($producto, $documento, $elemento, Doctrine_Collection $coll,$idmonedaunica = false, $otramoneda = false, $factoranterior = false)
    {
        if ($producto['datosPrecioMoneda']) {
            $factura = Doctrine::getTable('DatDocfactura')->find($documento);
            if ($factura->idtipotasa) {
                $this->_tipotasa = $factura->idtipotasa;
            }
            if($idmonedaunica){
                $tasa = $this->configuracionHelper->getTasaByMonedas(
                    $this->_dualidadMonedas->idmoneda, $this->_dualidadMonedas->idmonedaalternativa, $this->_tipotasa
                );
                if($this->_dualidadMonedas->idmoneda == $idmonedaunica){
                    $idmonedacero = $this->_dualidadMonedas->idmonedaalternativa;
                    $tasaAux = $tasa[0]['compra'];
                }else{
                    $tasaAux = $tasa[0]['venta'];
                    $idmonedacero = $this->_dualidadMonedas->idmoneda;
                }
                $precioAux = false;
                if(count($producto['datosPrecioMoneda']) == 2) {
                    foreach ($producto['datosPrecioMoneda'] as $index => $datos) {
                        if ($idmonedaunica != $datos->idmoneda) {
                            $precioAux = $datos->precio;
                        } else if(!$precioAux){
                            $precioAux = $producto['datosPrecioMoneda'][$index+1]->precio;
                        }
                        $monedaElem = Doctrine::getTable('DatDesgloselemento')
                            ->findByDql(
                                "idmoneda = ? and idelementofactura = ?",
                                array($datos->idmoneda, $producto['idelementofactura'])
                            );
                        if (count($monedaElem) > 0) {
                            $obj = $monedaElem[0];
                        } else {
                            $obj = new DatDesgloselemento();
                            $obj->idelementofactura = $producto['idelementofactura'];
                            $obj->idmoneda = $datos->idmoneda;
                        }
                        /*if($factura->idmoneda){
                            if($this->_dualidadMonedas->idmonedaalternativa){
                                if($datos->idmoneda == $this->_dualidadMonedas->idmonedaalternativa){
                                    $datos->precio = $this->convertirPrecio(
                                        $factura->tasacambio, $factura->factorconvercion, $datos->precio, true);
                                }
                            }else{
                                if ($datos->idmoneda == $this->_dualidadMonedas->idmoneda) {
                                    $datos->precio = $this->convertirPrecio(
                                        $factura->tasacambio, $factura->factorconvercion, $datos->precio, true
                                    );
                                }
                            }
                        }*/
                        if ($datos->idmoneda == $idmonedaunica){
                            $datos->precio += $this->convertirPrecio($tasaAux, $tasa[0]['factordeconversion'],$precioAux);
                        } else {
                            $datos->precio = 0;
                        }
                        $obj->preciotarifa = $datos->precio;
                        $obj->preciotarifaoriginal = $datos->precio;
                        $coll->add($obj);

                        if ($datos->idmoneda == $this->_dualidadMonedas->idmoneda) {
                            $elemento->preciotarifabase = $datos->precio;
                        }
                    }
                } else {
                    $datos = $producto['datosPrecioMoneda'][0];
                    if ($idmonedaunica != $datos->idmoneda) {
                        $precioAux = $datos->precio;
                        $monedaElem1 = Doctrine::getTable('DatDesgloselemento')
                            ->findByDql(
                                "idmoneda = ? and idelementofactura = ?",
                                array($datos->idmoneda, $producto['idelementofactura'])
                            );
                        if (count($monedaElem1) > 0) {
                            $obj1 = $monedaElem1[0];
                        } else {
                            $obj1 = new DatDesgloselemento();
                            $obj1->idelementofactura = $producto['idelementofactura'];
                            $obj1->idmoneda = $datos->idmoneda;
                        }
                        $monedaElem = Doctrine::getTable('DatDesgloselemento')
                            ->findByDql(
                                "idmoneda = ? and idelementofactura = ?",
                                array($idmonedaunica, $producto['idelementofactura'])
                            );
                        if (count($monedaElem) > 0) {
                            $obj = $monedaElem[0];
                        } else {
                            $obj = new DatDesgloselemento();
                            $obj->idelementofactura = $producto['idelementofactura'];
                            $obj->idmoneda = $idmonedaunica;
                        }
                    } else {
                        $monedaElem1 = Doctrine::getTable('DatDesgloselemento')
                            ->findByDql(
                                "idmoneda = ? and idelementofactura = ?",
                                array($idmonedacero, $producto['idelementofactura'])
                            );
                        if (count($monedaElem1) > 0) {
                            $obj1 = $monedaElem1[0];
                        } else {
                            $obj1 = new DatDesgloselemento();
                            $obj1->idelementofactura = $producto['idelementofactura'];
                            $obj1->idmoneda = $idmonedacero;
                        }
                        $monedaElem = Doctrine::getTable('DatDesgloselemento')
                            ->findByDql(
                                "idmoneda = ? and idelementofactura = ?",
                                array($datos->idmoneda, $producto['idelementofactura'])
                            );
                        if (count($monedaElem) > 0) {
                            $obj = $monedaElem[0];
                        } else {
                            $obj = new DatDesgloselemento();
                            $obj->idelementofactura = $producto['idelementofactura'];
                            $obj->idmoneda = $datos->idmoneda;
                        }
                        if (count($monedaElem1) > 0) {
                            $precioAux = $monedaElem1[0]->preciotarifa;
                        } else {
                            $precioAux = 0;
                        }

                    }

                    /*if($factura->idmoneda){
                        if($this->_dualidadMonedas->idmonedaalternativa){
                            if($datos->idmoneda == $this->_dualidadMonedas->idmonedaalternativa){
                                $datos->precio = $this->convertirPrecio(
                                    $factura->tasacambio, $factura->factorconvercion, $datos->precio, true);
                            }
                        }else{
                            if ($datos->idmoneda == $this->_dualidadMonedas->idmoneda) {
                                $datos->precio = $this->convertirPrecio(
                                    $factura->tasacambio, $factura->factorconvercion, $datos->precio, true
                                );
                            }
                        }
                    }*/
                    if ($datos->idmoneda == $idmonedaunica){
                        $datos->precio += $precioAux;//$this->convertirPrecio($tasaAux, $tasa[0]['factordeconversion'],$precioAux);
                    } else {
                        $precioSuma = $obj->preciotarifa + $precioAux;//$this->convertirPrecio($tasaAux, $tasa[0]['factordeconversion'],$precioAux);
                        $datos->precio = $precioSuma;
                    }
                    $obj->preciotarifa = $datos->precio;
                    $obj->preciotarifaoriginal = $datos->precio;

                    $obj1->preciotarifa = 0;
                    $obj1->preciotarifaoriginal = 0;
                    $coll->add($obj);
                    $coll->add($obj1);

                    $elemento->preciotarifabase = $datos->precio;
                }

            } else {
                foreach ($producto['datosPrecioMoneda'] as $datos) {
                    $monedaElem = Doctrine::getTable('DatDesgloselemento')
                        ->findByDql(
                            "idmoneda = ? and idelementofactura = ?",
                            array($datos->idmoneda, $producto['idelementofactura'])
                        );
                    if (count($monedaElem) > 0) {
                        $obj = $monedaElem[0];
                    } else {
                        $obj = new DatDesgloselemento();
                        $obj->idelementofactura = $producto['idelementofactura'];
                        $obj->idmoneda = $datos->idmoneda;
                    }
                    /*if($factura->idmoneda){
                        if($this->_dualidadMonedas->idmonedaalternativa){
                            if($datos->idmoneda == $this->_dualidadMonedas->idmonedaalternativa){
                                $datos->precio = $this->convertirPrecio(
                                    $factura->tasacambio, $factura->factorconvercion, $datos->precio, true);
                            }
                        }else{
                            if ($datos->idmoneda == $this->_dualidadMonedas->idmoneda) {
                                $datos->precio = $this->convertirPrecio(
                                    $factura->tasacambio, $factura->factorconvercion, $datos->precio, true
                                );
                            }
                        }
                    }*/
                    $obj->preciotarifa = ($datos->precio == -1) ? 0 : $datos->precio;
                    $obj->preciotarifaoriginal = ($datos->precio == -1) ? 0 : $datos->precio;
                    if ($datos->precio == -1)
                        $obj->importe = $producto['impcontable'];
                    else
                        $obj->importe = null;

                    $coll->add($obj);

                    if ($datos->idmoneda == $this->_dualidadMonedas->idmoneda) {
                        $elemento->preciotarifabase = ($datos->precio == -1) ? 0 : $datos->precio;
                    }
                }
            }

        } else if ($otramoneda && !$this->_dualidadMonedas->idmonedaalternativa) {
            $factura = Doctrine::getTable('DatDocfactura')->find($documento);
            $fconv = is_numeric($factura->factorconvercion) ? $factura->factorconvercion : 1;
            if ($factura->idtipotasa) {
                $this->_tipotasa = $factura->idtipotasa;
            }
            $monedaElem = Doctrine::getTable('DatDesgloselemento')
                ->findByDql(
                    "idmoneda = ? and idelementofactura = ?",
                    array($this->_dualidadMonedas->idmoneda, $producto['idelementofactura'])
                );
            if (count($monedaElem) > 0) {
                $obj = $monedaElem[0];
            } else {
                $obj = new DatDesgloselemento();
                $obj->idelementofactura = $producto['idelementofactura'];
                $obj->idmoneda = $this->_dualidadMonedas->idmoneda;
            }
            $obj->preciotarifa = ($producto['preciobase'] == -1) ? 0 : $producto['preciobase'];
            $obj->preciotarifaoriginal = ($producto['preciobase'] == -1) ? 0 : $producto['preciobase'];
            if ($producto['preciobase'] == -1)
                $obj->importe = $producto['impcontable'];
            else
                $obj->importe = null;

            if ($otramoneda == $this->_dualidadMonedas->idmoneda && $factoranterior) {
                $fconv = $factoranterior;
                $obj->preciotarifa = $this->convertirPrecio(1, $fconv, $obj->preciotarifa, true);
                $obj->preciotarifaoriginal = $this->convertirPrecio(1, $fconv, $obj->preciotarifaoriginal, true);
                if (is_numeric($obj->importe)) {
                    $obj->importe = $this->convertirPrecio(1, $fconv, $obj->importe, true);
                }
                $elemento->preciotarifabase = $obj->preciotarifa;
            } else {
                if ($otramoneda == $factura->idmoneda && $factoranterior && $factoranterior != $fconv) {
                    $obj->preciotarifa = $obj->preciotarifa * $factoranterior;
                    $obj->preciotarifaoriginal = $obj->preciotarifaoriginal * $factoranterior;
                    if (is_numeric($obj->importe)) {
                      $obj->importe = $obj->importe * $factoranterior;
                    }
                }
                $obj->preciotarifa = $this->convertirPrecio(1, $fconv, $obj->preciotarifa);/*$this->configuracionHelper->convertirImporte(
                $this->_dualidadMonedas->idmoneda, $otramoneda, $this->_tipotasa, $obj->preciotarifa, 1, $fconv
                );*/
                $obj->preciotarifaoriginal = $this->convertirPrecio(1, $fconv, $obj->preciotarifaoriginal);/*$this->configuracionHelper->convertirImporte(
                    $this->_dualidadMonedas->idmoneda, $otramoneda, $this->_tipotasa, $obj->preciotarifaoriginal, 1, $fconv
                );*/
                if (is_numeric($obj->importe)) {
                    $obj->importe = $this->convertirPrecio(1, $fconv, $obj->importe);/*$this->configuracionHelper->convertirImporte(
                        $this->_dualidadMonedas->idmoneda, $otramoneda, $this->_tipotasa, $obj->importe, 1, $fconv
                    );*/
                }
                $elemento->preciotarifabase = $obj->preciotarifa;
            }

            $coll->add($obj);
        }
    }

    public function modificarPrecioManualInv($producto, $documento, $elemento, Doctrine_Collection $coll, $idmonedaunica = false)
    {
        if ($producto['datosPrecioMoneda']) {
            $factura = Doctrine::getTable('DatDocfactura')->find($documento);
            if ($factura->idtipotasa) {
                $this->_tipotasa = $factura->idtipotasa;
            }
            if ($idmonedaunica) {
                $tasa = $this->configuracionHelper->getTasaByMonedas(
                    $this->_dualidadMonedas->idmoneda, $this->_dualidadMonedas->idmonedaalternativa, $this->_tipotasa
                );
                if($this->_dualidadMonedas->idmoneda == $idmonedaunica){
                    $idmonedacero = $this->_dualidadMonedas->idmonedaalternativa;
                    $tasaAux = $tasa[0]['compra'];
                }else{
                    $tasaAux = $tasa[0]['venta'];
                    $idmonedacero = $this->_dualidadMonedas->idmoneda;
                }
                $precioAux = false;
                if(count($producto['datosPrecioMoneda']) == 2) {
                    foreach ($producto['datosPrecioMoneda'] as $index => $datos) {
                        if ($idmonedaunica != $datos->idmoneda) {
                            $precioAux = $datos->precio;
                        } else if (!$precioAux) {
                            $precioAux = $producto['datosPrecioMoneda'][$index + 1]->precio;
                        }
                        $monedaMov = Doctrine::getTable('DatMovmoneda')
                            ->findByDql(
                                'idmovimiento = ? and idmoneda = ?', array($producto['idmovimiento'], $datos->idmoneda)
                            );
                        if (count($monedaMov) > 0) {
                            $obj = $monedaMov[0];
                        } else {
                            $obj = new DatMovmoneda();
                            $obj->idmovimiento = $producto['idmovimiento'];
                            $obj->idmoneda = $datos->idmoneda;
                        }
                        if ($factura->idmoneda) {
                            if ($this->_dualidadMonedas->idmonedaalternativa) {
                                if ($datos->idmoneda == $this->_dualidadMonedas->idmonedaalternativa) {
                                    $datos->precio = $this->convertirPrecio(
                                        $factura->tasacambio, $factura->factorconvercion, $datos->precio, true
                                    );
                                }
                            } else {
                                if ($datos->idmoneda == $this->_dualidadMonedas->idmoneda) {
                                    $datos->precio = $this->convertirPrecio(
                                        $factura->tasacambio, $factura->factorconvercion, $datos->precio, true
                                    );
                                }
                            }
                        }
                        if ($datos->idmoneda == $idmonedaunica) {
                            $datos->precio += $this->convertirPrecio($tasaAux, $tasa[0]['factordeconversion'], $precioAux);
                        } else {
                            $datos->precio = 0;
                        }
                        $obj->precio = $datos->precio;
                        $obj->importe = round($obj->precio * $producto['cantidad'],2);
                        $coll->add($obj);
                        if ($datos->idmoneda == $this->_dualidadMonedas->idmoneda) {
                            $elemento->preciobase = $datos->precio;
                        }
                    }
                } else {
                    $datos = $producto['datosPrecioMoneda'][0];
                    if ($idmonedaunica != $datos->idmoneda) {
                        $precioAux = $datos->precio;
                        $monedaMov1 = Doctrine::getTable('DatMovmoneda')
                            ->findByDql(
                                'idmovimiento = ? and idmoneda = ?', array($producto['idmovimiento'], $datos->idmoneda)
                            );
                        if (count($monedaMov1) > 0) {
                            $obj1 = $monedaMov1[0];
                        } else {
                            $obj1 = new DatMovmoneda();
                            $obj1->idmovimiento = $producto['idmovimiento'];
                            $obj1->idmoneda = $datos->idmoneda;
                        }
                        $monedaMov = Doctrine::getTable('DatMovmoneda')
                            ->findByDql(
                                'idmovimiento = ? and idmoneda = ?', array($producto['idmovimiento'], $idmonedaunica)
                            );
                        if (count($monedaMov) > 0) {
                            $obj = $monedaMov[0];
                        } else {
                            $obj = new DatMovmoneda();
                            $obj->idmovimiento = $producto['idmovimiento'];
                            $obj->idmoneda = $idmonedaunica;
                        }
                    } else {
                        $monedaMov1 = Doctrine::getTable('DatMovmoneda')
                            ->findByDql(
                                'idmovimiento = ? and idmoneda = ?', array($producto['idmovimiento'], $idmonedacero)
                            );
                        if (count($monedaMov1) > 0) {
                            $obj1 = $monedaMov1[0];
                        } else {
                            $obj1 = new DatMovmoneda();
                            $obj1->idmovimiento = $producto['idmovimiento'];
                            $obj1->idmoneda = $idmonedacero;
                        }
                        $monedaMov = Doctrine::getTable('DatMovmoneda')
                            ->findByDql(
                                'idmovimiento = ? and idmoneda = ?', array($producto['idmovimiento'], $datos->idmoneda)
                            );
                        if (count($monedaMov) > 0) {
                            $obj = $monedaMov[0];
                        } else {
                            $obj = new DatMovmoneda();
                            $obj->idmovimiento = $producto['idmovimiento'];
                            $obj->idmoneda = $datos->idmoneda;
                        }
                        if (count($monedaMov1) > 0) {
                            $precioAux = $monedaMov1[0]->precio;
                        } else {
                            $precioAux = 0;
                        }
                    }

                    if($factura->idmoneda){
                        if($this->_dualidadMonedas->idmonedaalternativa){
                            if($datos->idmoneda == $this->_dualidadMonedas->idmonedaalternativa){
                                $datos->precio = $this->convertirPrecio(
                                    $factura->tasacambio, $factura->factorconvercion, $datos->precio, true);
                            }
                        }else{
                            if ($datos->idmoneda == $this->_dualidadMonedas->idmoneda) {
                                $datos->precio = $this->convertirPrecio(
                                    $factura->tasacambio, $factura->factorconvercion, $datos->precio, true
                                );
                            }
                        }
                    }
                    if ($datos->idmoneda == $idmonedaunica){
                        $datos->precio += $this->convertirPrecio($tasaAux, $tasa[0]['factordeconversion'],$precioAux);
                    } else {
                        $precioSuma = $obj->precio + $this->convertirPrecio($tasaAux, $tasa[0]['factordeconversion'],$precioAux);
                        $datos->precio = $precioSuma;
                    }
                    $obj->precio = $datos->precio;
                    $obj->importe = round($obj->precio * $producto['cantidad'],2);

                    $obj1->precio = 0;
                    $obj1->importe = 0;
                    $coll->add($obj);
                    $coll->add($obj1);

                    $elemento->preciobase = $datos->precio;
                }
            } else {
                foreach ($producto['datosPrecioMoneda'] as $datos) {
                    $monedaMov = Doctrine::getTable('DatMovmoneda')
                        ->findByDql(
                            'idmovimiento = ? and idmoneda = ?', array($producto['idmovimiento'], $datos->idmoneda)
                        );
                    if (count($monedaMov) > 0) {
                        $obj = $monedaMov[0];
                    } else {
                        $obj = new DatMovmoneda();
                        $obj->idmovimiento = $producto['idmovimiento'];
                        $obj->idmoneda = $datos->idmoneda;
                    }
                    /*if ($factura->idmoneda) {
                        if ($this->_dualidadMonedas->idmonedaalternativa) {
                            if ($datos->idmoneda == $this->_dualidadMonedas->idmonedaalternativa) {
                                $datos->precio = $this->convertirPrecio(
                                    $factura->tasacambio, $factura->factorconvercion, $datos->precio, true
                                );
                            }
                        } else {
                            if ($datos->idmoneda == $this->_dualidadMonedas->idmoneda) {
                                $datos->precio = $this->convertirPrecio(
                                    $factura->tasacambio, $factura->factorconvercion, $datos->precio, true
                                );
                            }
                        }
                    }*/
                    if ($datos->precio == -1 && $producto['impcontable'] > 0)
                        $elemento->importe = $producto['impcontable'];
                    else
                        $elemento->importe = null;

                    $obj->precio = ($datos->precio == -1) ? 0 : $datos->precio;
                    $obj->importe = round((($datos->precio == -1) ? 0 : $datos->precio) * $producto['cantidad'],2);
                    $coll->add($obj);
                    if ($datos->idmoneda == $this->_dualidadMonedas->idmoneda) {
                        $elemento->preciobase = ($datos->precio == -1) ? 0 : $datos->precio;
                    }
                }
            }
        }
    }

    public function actualizarCmptoPrefMov($parametros)
    {
        $cmpto = Doctrine::getTable('DatPrefacturacmpto')
                ->findByDql("idmovimiento = {$parametros['idmovimiento']}");
        $cmpto[0]->synchronizeWithArray(array('pendiente' => $parametros['cantidad']));
        $cmpto[0]->save();
    }

    public function actualizarCmptoPref($parametros)
    {
        $cmpto = Doctrine::getTable('DatPrefacturacmpto')
                ->findByDql("idelementofactura = {$parametros['idelementofactura']}");
        $cmpto[0]->synchronizeWithArray(array('pendiente' => $parametros['cantidad']));
        $cmpto[0]->save();
    }

    public function recalcularPrecio($parametros, $factura)
    {
        $params = array(
            'iddocumento' => $factura->idfactura,
            'idsubsistema' => $factura->idsubsistema,
            'dql' => 1
        );
        if ($factura->oferta == 1) {
            $params = array_merge($params, array('tipoDoc' => 1));
        }
        $productos = $this->getProductosDb(
            $params
        )->fetchArray();
        foreach ($productos as &$p) {
            $p['cambioTipoPrecio'] = 1;
            unset($p['DatProductoLogistica']);
            unset($p['DatProdFactura']);
            unset($p['DatMovmoneda']);
        }
        $this->modificarProductos(array('productos'=>$productos), $factura);
        $elemtModel = new ElementosFacturaModel();
        $servicios = $this->getServiciosDb(
            array(
                'iddocumento' => $factura->idfactura,
                'idsubsistema' => $factura->idsubsistema,
                'dql' => 1
            )
        )->fetchArray();
        foreach ($servicios as &$s) {
            $s['cambioTipoTarifa'] = 1;
        }
        //$elemtModel->modificarElementos($params, $documentoFactura, 0);
        $elemtModel->modificarElementos(array('servicios'=>$servicios, 'factoranterior' => (isset($parametros['factoranterior'])) ? $parametros['factoranterior'] : false), $factura, 0);
        $this->actualizarImporte($factura->idfactura);
        /*if ($parametros['idsubsistema'] == LogisticaGlobal::SUBSISTEMA_INV) {
            $productos = Doctrine::getTable('DatMovimientos')
                    ->findByDql("iddocumento = {$parametros['iddocumento']}");
            $coll = new Doctrine_Collection('DatProdFactura');
            foreach ($productos as $prod) {
                $prodFactura = Doctrine::getTable('DatProdFactura')
                        ->findByDql("idmovimiento = {$prod->idmovimiento}");
                $prodFactura[0]->precio = $this->configuracionHelper->calcularImporteDadoMonedas(
                        $parametros['idmoneda'], $prodFactura[0]->preciobase, $this->idestructura, false
                );
                $coll->add($prodFactura[0]);
            }
            $coll->save();
            $this->actualizarProdyServicios($parametros);
        } else {
            $this->actualizarProdyServicios($parametros);
        }*/
    }

    public function actualizarProdyServicios($parametros)
    {
        /* $productos = Doctrine::getTable('DatElementosFactura')
          ->findByDql("idfactura = {$parametros['iddocumento']}"); */
        $elemtModel = new ElementosFacturaModel();
        $productos = $elemtModel->getAllElementos($parametros);
        $coll = new Doctrine_Collection('DatElementosFactura');
        $collMat = new Doctrine_Collection('DatProdServicios');
        foreach ($productos as $prod) {
            $prod['preciotarifa'] = $this->configuracionHelper->calcularImporteDadoMonedas(
                    $parametros['idmoneda'], $prod['preciotarifabase'], $this->idestructura, false
            );
            $prod['importe'] = $prod['preciotarifa'] * $prod['cantidad'];
            $ob = new DatElementosFactura();
            $ob->assignIdentifier($prod['idelementofactura']);
            $ob->synchronizeWithArray($prod);
            $coll->add($ob);
            if ($prod['tipo'] == 2) {
                $materiales = Doctrine::getTable('DatProdServicios')
                        ->findByDql("idelementofactura = {$prod['idelementofactura']}");
                if (count($materiales) > 0) {
                    foreach ($materiales as $mat) {
                        $mat->precio = $this->configuracionHelper->calcularImporteDadoMonedas(
                                $parametros['idmoneda'], $mat->preciobase, $this->idestructura, false
                        );
                        $mat->importetotal = $mat->precio * $mat->cantidad;
                        $collMat->add($mat);
                    }
                }
            }
        }
        $coll->save();
        $collMat->save();
    }

    public function modificarLotes($lotes, $array)
    {
        $serviceLote = new LoteService();
        $cantidadTotal = 0;
        $conteoLote = array();
        $lotesMod = array();
        foreach ($lotes as &$dat) {
            $dat = (array) $dat;
            $cantidadTotal += $dat['cantidad'];
            $lotesMod[] = $dat['idmovlote'];
        }
        $cantidadTotal += $this->getCantidadLotes($lotes[0]['idmovimiento'], $lotesMod);
        $prodFact = Doctrine::getTable('DatMovimientos')
                ->find(
                $lotes[0]['idmovimiento']
        );
        $documento = Doctrine::getTable('DatDocfactura')
                ->find(
                $prodFact->iddocumento
        );
        $docsOrigen = $this->getDocOrigen($prodFact->iddocumento);
        $arrayDocsOrigen = array();
        foreach ($docsOrigen as $doc) {
            $arrayDocsOrigen[] = $doc['idpadre'];
        }
        $datosCmpto = array();

        $arrayProductos = array(
            'idproducto' => $prodFact->idproducto, 'iddocorigen' => $arrayDocsOrigen,
            'enprocesonuevo' => $cantidadTotal, 'enprocesoviejo' => $prodFact->cantidad, 'entregado' => 0
        );
        $datosCmpto['productos'][0] = $arrayProductos;
        $datosCmpto['idcliente'] = $documento->idcliente;
        if (count($datosCmpto) > 0) {
            $prodOrdenModel = new ProdordenModel();
            $prodOrdenModel->actualizarCumplimientoByParams($datosCmpto);
        }
        $serviceLote->adicionarLote($lotes, $array);
    }

    public function getCantidadLotes($idmovimiento, $lotesNotIn)
    {
        $query = new Doctrine_Query();
        $result = $query->select('SUM(dml.cantidad) as cantidad')
            ->from('DatMovlote dml')
            ->where('dml.idmovimiento = ?', array($idmovimiento))
            ->andWhereNotIn('dml.idmovlote', $lotesNotIn)
            ->fetchArray();
        return $result[0]['cantidad'];
    }

    public function adicionarConceptos($documento, $parametros)
    {
        $collConceptos = new Doctrine_Collection('DatCategoriaPrecioFactura');
        if ($parametros['deconduce']) {
            $conceptos = $parametros['conceptos'];
            foreach ($conceptos as $index => $concepto) {
                $datConc = new DatCategoriaPrecioFactura();
                $datConc->synchronizeWithArray($concepto);
                $datConc->idfactura = $documento->iddocumento;
                foreach ($concepto->datosValorMoneda as $val) {
                    $desg = new DatDesglosecategoriapreciofactura();
                    $desg->idmoneda = $val->idmoneda;
                    $desg->valor = $val->valor;
                    $desg->concepto = $val->concepto;
                    $desg->porciento = $val->porciento;
                    $datConc->DatDesglosecategoriapreciofactura->add($desg);
                }
                $collConceptos[$index] = $datConc;
            }
        } else {
            $conceptos = $parametros['conceptos'];
            foreach ($conceptos as $index => $concepto) {
                $concepto = (array) $concepto;
                if (!$concepto['aplicar']) {
                    unset($concepto['aplicar']);
                }
                if (!$concepto['noexterior']) {
                    unset($concepto['noexterior']);
                }
                if (!$concepto['idcondicionpago']) {
                    unset($concepto['idcondicionpago']);
                }
                if (!$concepto['idcuenta']) {
                    unset($concepto['idcuenta']);
                }
                if (!$concepto['idcliente']) {
                    unset($concepto['idcliente']);
                }
                $concepto['bi'] = ($concepto['bi']) ? 1 : 0;
                $concepto['noexterior'] = 0;
                $datConc = new DatCategoriaPrecioFactura();
                $datConc->synchronizeWithArray($concepto);
                $datConc->idfactura = $documento->iddocumento;
                foreach ($concepto['datosValorMoneda'] as $val) {
                    if($val->idmoneda) {
                        $desg = new DatDesglosecategoriapreciofactura();
                        $desg->idmoneda = $val->idmoneda;
                        if ($val->idmonedacategoria)
                            $desg->idmonedacategoria = $val->idmonedacategoria;
                        $desg->valor = $val->valor;
                        $desg->concepto = $concepto['concepto'];
                        $desg->porciento = $concepto['porciento'];
                        $desg->valorcalculo = ($val->valorcalculo) ? $val->valorcalculo : 0;
                        if ($parametros['tipoDoc'] == 'nd' || $parametros['tipoDoc'] == 'nc') {
                            $desg->valorcalculofact = ($val->valorcalculo && $parametros['tipoDoc'] == 'nd') ? $val->valorcalculo : 0;
                        }
                        $datConc->DatDesglosecategoriapreciofactura->add($desg);
                    }
                }
                $collConceptos[$index] = $datConc;
            }
        }
        $collConceptos->save();
    }

    public function modificarConceptos($documento, $conceptos)
    {
        //print_r($conceptos);die;
        $collConceptos = new Doctrine_Collection('DatCategoriaPrecioFactura');
        $factura = Doctrine::getTable('DatDocfactura')->find($documento);
        $sql = "select oper.vm from mod_logfacturacion.dat_operacionsubsistema oper
                    inner join mod_logistica.dat_documento dd on dd.idoperacion = oper.idnomoperaciones
                    where dd.iddocumento = {$documento} and oper.idestructura = {$this->global->Estructura->idestructura}";
        $datAux = $this->doctrineHelper->getConnection()->execute($sql)->fetchAll(PDO::FETCH_COLUMN);
        $mayorista = false;
        if (count($datAux)) {
            $mayorista = $datAux[0];
        }
        foreach ($conceptos as $index => &$concepto) {
            $concepto = (array) $concepto;
            if($concepto['aplicar'] == 0 && $concepto['aplicartodos'] == 1) {
                $borrar[] = $concepto['idcategoriafactura'];
            }
            if (!$concepto['aplicar']) {
                unset($concepto['aplicar']);
            }
            if (!$concepto['bi']) {
                unset($concepto['bi']);
            }
            if (!$concepto['noexterior']) {
                unset($concepto['noexterior']);
            }
            if (!$concepto['idcondicionpago']) {
                unset($concepto['idcondicionpago']);
            }
            if (!$concepto['idcuenta']) {
                unset($concepto['idcuenta']);
            }
            if (!$concepto['idcliente']) {
                unset($concepto['idcliente']);
            }
            if ($concepto['codigo'] == "CL") {
                $sqlCuenta = "select ccp.denominacion from mod_crmclienteproveedor.dat_identificador ccp
                    inner join mod_crmclienteproveedor.nom_tipocodigo ntp on ntp.idtipocodigo = ccp.idtipocodigo
                    where ccp.idclienteproveedor = {$factura->idcliente} and ntp.validacion = 'ccl' limit 1";
                $cuentaAux = $this->doctrineHelper->getConnection()->execute($sqlCuenta)->fetchAll(PDO::FETCH_COLUMN);
                if (count($cuentaAux)) {
                    $concepto['cuenta'] = $cuentaAux[0];
                }
            }
            if (!!$concepto['idcategoriafactura']) {

                $datConc = Doctrine::getTable('DatCategoriaPrecioFactura')
                        ->find($concepto['idcategoriafactura']);
                foreach ($concepto['datosValorMoneda'] as $val) {
                    $desg = Doctrine::getTable('DatDesglosecategoriapreciofactura')
                            ->findByDql(
                            'idcategoriafactura=? and idmoneda=?', array($concepto['idcategoriafactura'], $val->idmoneda)
                    );
                    if($factura->idmoneda && $concepto['porciento'] != 1){
                        if($this->_dualidadMonedas->idmonedaalternativa){
                            if($this->_dualidadMonedas->idmonedaalternativa == $val->idmoneda){
                                $val->valor = $this->convertirPrecio(
                                    $factura->tasacambio, $factura->factorconvercion, $val->valor, true
                                );
                            }
                        }else{
                            if ($val->idmoneda && $val->idmoneda != $this->_dualidadMonedas->idmoneda) {
                                $val->valor = $this->convertirPrecio(
                                    $factura->tasacambio, $factura->factorconvercion, $val->valor, true
                                );
                            }
                        }
                    }
                    if (count($desg) > 0) {
                        $desg[0]->valor = $val->valor;
                        $desg[0]->concepto = $concepto['concepto'];
                        $desg[0]->porciento = $concepto['porciento'];
                        $desg[0]->save();
                    } else {
                        $desg = new DatDesglosecategoriapreciofactura();
                        $desg->idmoneda = $val->idmoneda;
                        if ($val->idmonedacategoria)
                            $desg->idmonedacategoria = $val->idmonedacategoria;
                        $desg->valor = $val->valor;
                        $desg->concepto = $concepto['concepto'];
                        $desg->porciento = $concepto['porciento'];
                        $datConc->DatDesglosecategoriapreciofactura->add($desg);
                    }
                    if ($factura->idmonedaprod) {
                        $desg = Doctrine::getTable('DatDesglosecategoriapreciofactura')
                            ->findByDql(
                                'idcategoriafactura=? and idmoneda=?', array($concepto['idcategoriafactura'], $factura->idmonedaprod)
                            );
                        if($factura->idmoneda && $concepto['porciento'] != 1){
                            if($this->_dualidadMonedas->idmonedaalternativa){
                                if($this->_dualidadMonedas->idmonedaalternativa == $val->idmoneda){
                                    $val->valor = $this->convertirPrecio(
                                        $factura->tasacambio, $factura->factorconvercion, $val->valor, true
                                    );
                                }
                            }else{
                                if ($val->idmoneda && $val->idmoneda != $this->_dualidadMonedas->idmoneda) {
                                    $val->valor = $this->convertirPrecio(
                                        $factura->tasacambio, $factura->factorconvercion, $val->valor, true
                                    );
                                }
                            }
                        }
                        if (count($desg) > 0) {
                            $desg[0]->valor = $val->valor;
                            $desg[0]->concepto = $concepto['concepto'];
                            $desg[0]->porciento = $concepto['porciento'];
                            $desg[0]->save();
                        } else {
                            $desg = new DatDesglosecategoriapreciofactura();
                            $desg->idmoneda = $factura->idmonedaprod;
                            if ($val->idmonedacategoria)
                                $desg->idmonedacategoria = $val->idmonedacategoria;
                            $desg->valor = $val->valor;
                            $desg->concepto = $concepto['concepto'];
                            $desg->porciento = $concepto['porciento'];
                            $datConc->DatDesglosecategoriapreciofactura->add($desg);
                        }
                    }
                }
                $datConc->bi = ($concepto['bi']) ? 1 : 0;
                $datConc->aplicar = ($concepto['aplicar']) ? 1 : 0;
                $datConc->noexterior = ($concepto['noexterior']) ? 1 : 0;
                if ($concepto['codigo']) {
                    $datConc->codigo = $concepto['codigo'];
                }
                if (isset($concepto['cuenta'])) {
                    $datConc->cuenta = $concepto['cuenta'];
                }
                if (strlen($concepto['idcondicionpago']) > 0) {
                    $datConc->idcondicionpago = $concepto['idcondicionpago'];
                    $datConc->condicionpago = $concepto['condicionpago'];
                    $datConc->idcliente = $concepto['idcliente'];
                }

                if (strlen($concepto['idcuenta']) > 0)
                  $datConc->idcuenta = $concepto['idcuenta'];
                //$datConc->synchronizeWithArray($concepto);
            } else {
                $aux = Doctrine::getTable('DatCategoriaPrecioFactura')
                    ->findByDql('idcategoriaprecio = ? and idfactura = ?', array($concepto['idcategoriaprecio'], $documento));
                $idCategoriaAux = -1;
                if (count($aux)) {
                    unset($concepto['idcategoriafactura']);
                    $datConc = $aux[0];
                    $datConc->assignIdentifier($aux[0]->idcategoriafactura);
                    $idCategoriaAux = $aux[0]->idcategoriafactura;
                } else {
                    $datConc = new DatCategoriaPrecioFactura();
                }
                if (strlen($concepto['idcuenta']) == 0)
                  unset($concepto['idcuenta']);  
                $concepto['bi'] = ($concepto['bi']) ? 1 : 0;  
                $concepto['noexterior'] = ($concepto['noexterior']) ? 1 : 0;
                $datConc->synchronizeWithArray($concepto);
                $datConc->idfactura = $documento;
                foreach ($concepto['datosValorMoneda'] as $val) {
                    $desg = Doctrine::getTable('DatDesglosecategoriapreciofactura')
                        ->findByDql(
                            'idcategoriafactura=? and idmoneda=?', array($idCategoriaAux, $val->idmoneda)
                        );
                    if ($factura->idmoneda && $concepto['porciento'] != 1) {
                        if ($this->_dualidadMonedas->idmonedaalternativa) {
                            if ($this->_dualidadMonedas->idmonedaalternativa == $val->idmoneda) {
                                $val->valor = $this->convertirPrecio(
                                    $factura->tasacambio, $factura->factorconvercion, $val->valor, true
                                );
                            }
                        } else {
                            if ($val->idmoneda && $val->idmoneda != $this->_dualidadMonedas->idmoneda) {
                                $val->valor = $this->convertirPrecio(
                                    $factura->tasacambio, $factura->factorconvercion, $val->valor, true
                                );
                            }
                        }
                    }


                    if (count($desg) > 0) {
                        $desg[0]->valor = $val->valor;
                        $desg[0]->concepto = $concepto['concepto'];
                        $desg[0]->porciento = $concepto['porciento'];
                        if ($val->idmonedacategoria)
                            $desg[0]->idmonedacategoria = $val->idmonedacategoria;
                        $desg[0]->save();
                    } else {
                        $desg = new DatDesglosecategoriapreciofactura();
                        $desg->idmoneda = $val->idmoneda;
                        if ($val->idmonedacategoria)
                            $desg->idmonedacategoria = $val->idmonedacategoria;
                        $desg->valor = $val->valor;
                        $desg->concepto = $concepto['concepto'];
                        $desg->porciento = $concepto['porciento'];
                        $datConc->DatDesglosecategoriapreciofactura->add($desg);
                    }
                }
            }
            $collConceptos[$index] = $datConc;
        }
        $collConceptos->save();
    }

    public function modificarProdServicios($productos)
    {
        $pServObj = new DatProdServicios();
        $collection = new Doctrine_Collection('DatProdServicios');
        $collDesgElem = new Doctrine_Collection('DatDesgloselemento');
        $collDesgPS = new Doctrine_Collection('DatDesglosemonedaprodserv');
        $servicio = Doctrine::getTable('DatElementosFactura')->find($productos[0]->idelementofactura);
        $prodServNom = Doctrine::getTable('DatProdServNomenclador')->find($productos[0]->idelementofactura);
        $sumar = array();
        foreach ($productos as $prod) {
            $prod = (array) $prod;
            if (isset($prod['preciocontable'])) {
                $prod['precio'] = $prod['preciocontable'];
                $prod['preciobase'] = $prod['preciocontable'];
            }
            $p = Doctrine::getTable('DatProdServicios')
                    ->find($prod['idprodservicio']);
            $p->synchronizeWithArray($prod);
            if($servicio->preciopromedio == 1 || $prodServNom->idtipoprecio == -2){
                $desgP = Doctrine::getTable('DatDesglosemonedaprodserv')
                    ->findByDql(
                        'idprodservicio = ? and idmoneda = ?', array($prod['idprodservicio'], $this->_dualidadMonedas->idmoneda)
                    );
                foreach($desgP as $dps){
                    $desPs = Doctrine::getTable('DatDesglosemonedaprodserv')
                        ->find($dps->idesglosemonedaprodserv);
                    $desPs->synchronizeWithArray($dps);
                    $desPs->precio = $prod['precio'];
                    $collDesgPS->add($desPs);
                    $sumar[$dps->idmoneda] += ($prod['precio'] ? $prod['precio'] : $dps->precio) * $p->cantidad;
                }
            }
            $collection->add($p);
        }
        $collDesgPS->save();
        $collection->save();
        if($servicio->preciopromedio == 1 || $prodServNom->idtipoprecio == -2){
            $desgSC = Doctrine::getTable('DatDesgloselemento')
                ->findByDql(
                    'idelementofactura = ? and idmoneda = ?',
                    array($productos[0]->idelementofactura, $this->_dualidadMonedas->idmoneda)
                );
            /*inicio*/
            $queryPS = new Doctrine_Query();
            $arrayDesg = $queryPS->select('SUM(ROUND(COALESCE(dps.precio*ds.cantidad,0),2)) as importe')
                ->from('DatProdServicios ds')
                ->innerJoin('ds.DatDesglosemonedaprodserv dps')
                ->where('ds.idelementofactura = ?', array($servicio->idelementofactura))
                ->fetchArray();
            /*fin*/
            $desgSC[0]->preciotarifa = $desgSC[0]->preciotarifaoriginal + (count($arrayDesg) ? $arrayDesg[0]['importe'] : 0)/*$sumar[$this->_dualidadMonedas->idmoneda]*/;
            $collDesgElem->add($desgSC[0]);
            if ($this->_dualidadMonedas->idmonedaalternativa) {
                $desgSA = Doctrine::getTable('DatDesgloselemento')
                    ->findByDql(
                        'idelementofactura = ? and idmoneda = ?',
                        array($productos[0]->idelementofactura, $this->_dualidadMonedas->idmonedaalternativa)
                    );
                $desgSA[0]->preciotarifa =
                    $desgSA[0]->preciotarifaoriginal + $sumar[$this->_dualidadMonedas->idmonedaalternativa];
                $collDesgElem->add($desgSA[0]);
            }
        }
        $servicio->preciotarifabase = $servicio->preciotarifaoriginal + $sumar[$this->_dualidadMonedas->idmoneda];
        $servicio->save();

        $collDesgElem->save();
        //$collDesgPS->save();
    }

    public function adicionarFacturasDeDocumentos($params)
    {
        $contador = 0;
        $documento = 0;
        foreach ($params['cliente'] as $cliente) {
            //foreach($cliente->depositos as $deposito){
            $parametros = $params;
            $parametros['docorigen'] = $cliente->documentos;
            //falta mandar el deposito y por ahi se sacan las areas
            $parametros['iddeposito'] = $cliente->deposito;
            $parametros['idcliente'] = $cliente->idcliente;
            $parametros['reserva'] = $cliente->reserva;
            $parametros['rotacion'] = $cliente->rotacion;
            $parametros['promedio'] = 1;
            $nomCliente =  $this->configuracionHelper->getClientesProveedorByParams($cliente->idcliente);
            $nomCliente = $nomCliente['datos'][0];
            foreach ($nomCliente['cuentabancaria'] as $c) {
                $parametros['datoscuentacliente'][] = array('idmoneda'=>$c['idmoneda'], 'idcuentacliente'=>$c['idcuentabancliente']);
            }
            if ($params['tipoDoc'] == 4) {
                $parametros['productos'] = $this->getProductosDistribucion(
                        $parametros
                );
                $idrecepcion = Doctrine::getTable('DatDocumentoPadre')
                                ->findByDql('iddocumento = ?', array($cliente->documentos[0]))->toArray();
                if (count($idrecepcion) > 0) {
                    $recep = Doctrine::getTable('DatRecepcion')->find($idrecepcion[0]['idpadre']);
                    if ($recep->salidafactura == 1)
                        $parametros['conceptos'] = $this->getConceptosRecep($idrecepcion[0]['idpadre']);
                    $parametros['bl'] = $recep->bl;
                    $parametros['contenedor'] = $recep->contenedor;
                    $parametros['idpuertodestino'] = $recep->idpuertodestino;
                    $parametros['puertodestino'] = $recep->puertodestino;
                    $parametros['destinocomercial'] = $recep->destinocomercial;
                    $parametros['prodgenerico'] = $recep->prodgenerico;
                }
                if ($nomCliente && $nomCliente['idestructura'] && count($cliente->documentos) == 1) {
                    $docOrigen = Doctrine::getTable('DatDocumento')->find($cliente->documentos[0]);
                    $parametros['observaciones'] = $docOrigen->observaciones;
                }
            } else {
                if ($params['tipoDoc'] == 5 || $params['tipoDoc'] == 'nd' || $params['tipoDoc'] == 'nc') {
                    $conduce = Doctrine::getTable('DatDocfactura')->find($parametros['docorigen'][0]);
                    if ($params['tipoDoc'] == 'nd') {
                        $parametros['iddoc'] = $this->objIddocNotaDebito->iddoc;
                        $parametros['idcondicionpago'] = $conduce->idcondicionpago;
                    } else if($params['tipoDoc'] == 'nc'){
                        $parametros['iddoc'] = $this->objIddocNotaCredito->iddoc;
                        $parametros['idcondicionpago'] = $conduce->idcondicionpago;
                    }
                    $parametros['deconduce'] = ($params['tipoDoc'] == 5) ? 1 : null;
                    $parametros['idmoneda'] = $conduce->idmoneda;
                    $parametros['tasacambio'] = $conduce->tasacambio;
                    $parametros['factorconvercion'] = $conduce->factorconvercion;
                    $parametros['productos'] = $this->productoModel->getProductos(
                            $parametros['docorigen'], $parametros['idsubsistema']
                    );
                    $parametros['servicios'] = $this->servicioModel->getServicios(
                        $parametros['docorigen']
                    );
                    $parametros['servicios'] = $this->productoModel->arrayUnico($parametros['servicios'],
                        'idindicador');
                    foreach($parametros['servicios'] as &$serv){
                        $serv['cantidad'] = $this->productoModel->getCantidad($parametros['docorigen'], $serv);
                    }
                } else if ($params['tipoDoc'] == 8) {
                    $clienteCentro = Doctrine::getTable('DatDocumentoCliente')
                        ->findByDql('iddocumento = ? and tipocliente = 2', array($cliente->documentos[0]))->toArray();
                    if (count($clienteCentro)) {
                        $parametros['idcentrocosto'] = $clienteCentro[0]['idcliente'];
                    }
                    $observOt = Doctrine::getTable('DatDocObservaciones')
                        ->findByDql('iddocumento = ?', array($cliente->documentos[0]))->toArray();
                    if (count($observOt)) {
                        $parametros['observaciones'] = $observOt[0]['observaciones'];
                    }
                    $parametros['productos'] = $this->getProductosOrden(
                        $parametros
                    );
                    $parametros['servicios'] = $this->getServiciosOrdenes(
                        $parametros
                    );
                }
                if($params['idsubsistema'] == LogisticaGlobal::SUBSISTEMA_AFT){
                    if($params['alquiler']){
                        $parametros['alquiler'] = $params['alquiler'];
                        $tipoPrecio = $this->getTipoPrecios($parametros);
                        $parametros['servicios'] = $params['servicios'];
                        $parametros['servicios'][0]->idtipoprecio = $tipoPrecio[0]['idtipoprecio'];
                        $parametros['servicios'][0]->idestructura = $this->idestructura;
                        $parametros['servicios'][0]->materiales = $this->getMediosActivo(
                            $parametros
                        );
                    }else{
                        $parametros['productos'] = $this->getMediosActivo(
                            $parametros
                        );
                    }
                }
            }
            $documento = $this->adicionarFactura($parametros);
            $contador++;
            //}
        }
        $fecha = $this->fechacontable;
        return array('contador' => $contador, 'fecha' => $fecha, 'documento' => $documento);
    }

    private function getConceptosRecep($idrecepcion) {
        $conn = Zend_Registry::get('conexion');
        $q = $conn->execute("
                Select ci.idconceptoimporte as idcategoriaprecio, ci.valormn, ci.valoralt, nc.concepto, nc.porciento 
                from mod_loginventario.dat_conceptoimporterecep ci 
                inner join mod_logfacturacion.nom_categoriaprecio nc on nc.idcategoriaprecio = ci.idconceptoimporte 
                where ci.iddocumento = {$idrecepcion} 
                ")
            ->fetchAll(PDO::FETCH_ASSOC);
        $result = array();
        foreach ($q as $c) {
            $obj = new stdClass();
            $objMC = new stdClass();
            $objMC->idmoneda = $this->_dualidadMonedas->idmoneda;
            $objMC->valor = $c['valormn'];
            $objMA = new stdClass();
            $objMA->idmoneda = $this->_dualidadMonedas->idmonedaalternativa;
            $objMA->valor = $c['valoralt'];
            $obj->idcategoriaprecio = $c['idcategoriaprecio'];
            $obj->concepto = $c['concepto'];
            $obj->porciento = $c['porciento'];
            $obj->datosValorMoneda = array(
                $objMC, $objMA
            );
            $result[] = $obj;
        }

        return $result;
    }

    private function getConceptosFactura($iddocumento) {
        $conn = Zend_Registry::get('conexion');
        $q = $conn->execute("
                Select ci.idcategoriaprecio as idcategoriaprecio, ci.bi,ci.aplicar, ci.condicionpago, ci.idcondicionpago, 
                ci.idcuenta, ci.idcategoriafactura, nc.*
                from mod_logfacturacion.dat_categoriapreciofactura ci  
                inner join mod_logfacturacion.nom_categoriaprecio nc on nc.idcategoriaprecio = ci.idcategoriaprecio 
                where ci.idfactura in (".implode($iddocumento).") 
                ")
            ->fetchAll(PDO::FETCH_ASSOC);
        $result = array();
        foreach ($q as $c) {
            $obj = new stdClass();
            $obj->idcategoriaprecio = $c['idcategoriaprecio'];
            $obj->concepto = $c['concepto'];
            $obj->porciento = $c['porciento'];
            $obj->idcuenta = $c['idcuenta'];
            $obj->bi = $c['bi'];
            $obj->aplicar = $c['aplicar'];
            $q1 = $conn->execute("
                Select cd.*
                from mod_logfacturacion.dat_desglosecategoriapreciofactura cd   
                where cd.idcategoriafactura = {$c['idcategoriafactura']} 
                ")
                ->fetchAll(PDO::FETCH_ASSOC);
            $obj->datosValorMoneda = array(
            );
            foreach ($q1 as $d){
                $objD = new stdClass();
                $objD->idmoneda = $d['idmoneda'];
                $objD->valor = $d['valor'];
                $objD->valorcalculo = $d['valorcalculo'];
                $objD->idmonedacategoria = $d['idmonedacategoria'];
                $obj->datosValorMoneda[] = $objD;
            }
            $result[] = $obj;
        }
        return $result;
    }

    private function getConceptosAplicarTodos() {
        $conn = Zend_Registry::get('conexion');
        $q = $conn->execute("
                Select nc.idcategoriaprecio, nc.valor, nc.concepto, nc.porciento, nc.idmoneda
                from mod_logfacturacion.nom_categoriaprecio nc 
                where nc.aplicartodos = 1 and nc.conformaprecio <> 1 and nc.idtipo = 2 and nc.estado = 1
                ")
            ->fetchAll(PDO::FETCH_ASSOC);
        $result = array();
        foreach ($q as $c) {
            $obj = new stdClass();
            $objMC = new stdClass();
            $objMC->idmoneda = $this->_dualidadMonedas->idmoneda;
            $objMC->valor = (!$c['idmoneda'] || $c['idmoneda'] == $this->_dualidadMonedas->idmoneda) ? $c['valor'] : 0;
            /*$objMA = new stdClass();
            $objMA->idmoneda = $this->_dualidadMonedas->idmonedaalternativa;
            $objMA->valor = (!$c['idmoneda'] || $c['idmoneda'] == $this->_dualidadMonedas->idmonedaalternativa) ? $c['valor'] : 0;*/
            $obj->idcategoriaprecio = $c['idcategoriaprecio'];
            $obj->concepto = $c['concepto'];
            $obj->porciento = $c['porciento'];
            $obj->datosValorMoneda = array(
                $objMC/*, $objMA*/
            );
            $result[] = $obj;
        }

        return $result;
    }

    private function addDatDocumentoPadre($value, &$datDocumento)
    {
        foreach ($value['docorigen'] as $docorigen) {
            $obDocPadre = new DatDocumentoPadre();
            $obDocPadre->idpadre = $docorigen;
            $datDocumento->DatDocumentoPadre->add($obDocPadre);
            if ($value['tipoDoc'] == 5) {
                $nota = Doctrine::getTable('DatDocfactura')
                        ->find($docorigen);
                $nota->esnota = 2;
                $nota->save();
            }
        }
    }

    public function adicionarProductos($documento, $parametros)
    {
        if ($parametros['idsubsistema'] == LogisticaGlobal::SUBSISTEMA_INV && $parametros['tipoDoc'] != 1) {
            $afectaDisponible = true;
            if ($parametros['tipoDoc'] == 4 || $parametros['tipoDoc'] == 5 || $parametros['tipoDoc'] == 'nd' || $parametros['tipoDoc'] == 'nc') {
                $afectaDisponible = false;
            } else {
                if ($parametros['tipoDoc'] == 1) {
                    if (!isset($parametros['reservadisponible']) || $parametros['reservadisponible'] == 0) {
                        $afectaDisponible = false;
                    }
                }
            }
            $ubicarProductos = ($parametros['tipoDoc'] == 4 && $parametros['accion'] == 'add') ? array('tipoDoc' => 4) : (($parametros['tipoDoc'] == 1) ? array('tipoDoc' => 1) : false);
            /* $this->productoModel->adicionarProductos(
              $documento, $parametros['productos'], $ubicarProductos, $afectaDisponible, $parametros['idmoneda'],
              $parametros['resrvprecio']
              ); */
            $this->productoModel->adicionarProductos(
                $documento, $parametros, $ubicarProductos, $afectaDisponible
            );
        } else {
            $this->productoModel->adicionarProductosNom(
                $documento, $parametros
            );
        }
    }

    public function adicionarProdServicio($parametros)
    {
        $colleccion = new Doctrine_Collection('DatProdServicios');
        $servicio = Doctrine::getTable('DatElementosFactura')->find($parametros->productos[0]->idelementofactura);
        $iddocumento = $servicio->idfactura;
        $collDesgElem = new Doctrine_Collection('DatDesgloselemento');
        $materialesExistentes = Doctrine::getTable('DatProdServicios')->findByDql(
            'idelementofactura = ?', array($parametros->productos[0]->idelementofactura)
        );
        $sumar = array();
        $documentoFactura = Doctrine::getTable('DatDocfactura')->find($iddocumento);
        foreach ($parametros->productos as $index => $prod) {
            $clienteMoneda = $this->isUnicaMoneda(
                array('idtipoprecio'=>$prod->idtipoprecio, 'idcliente'=>$documentoFactura->idcliente, 'idestructura'=>$this->idestructura)
            );
            $idmonedaunica = false;
            $prod->idcliente = $documentoFactura->idcliente;
            if(count($clienteMoneda) > 0){
                $idmonedaunica = $clienteMoneda[0]['idmoneda'];
                $prec = $this->getPrecio($prod, $idmonedaunica);
            }else{
                $prec = $this->getPrecio($prod);
            }
            $prod = (array)$prod;
            $prod['preciobase'] = ($prec['precioventa']) ? $prec['precioventa'] : 0;
            $prod['importetotal'] = round($prod['preciobase'] * $prod['cantidad'], 2);
            $datProdServ = new DatProdServicios();

            $datProdServ->synchronizeWithArray($prod);
            $obj = new DatDesglosemonedaprodserv();
            $obj->idmoneda = $this->_dualidadMonedas->idmoneda;
            $obj->precio = $prec['datos'][$this->_dualidadMonedas->idmoneda]['precioventa'];
            if($servicio->preciopromedio == 1){
                $sumar[$this->_dualidadMonedas->idmoneda] += $obj->precio;
            }
            $datProdServ->DatDesglosemonedaprodserv->add($obj);
            if($this->_dualidadMonedas->idmonedaalternativa){
                $obj = new DatDesglosemonedaprodserv();
                $obj->idmoneda = $this->_dualidadMonedas->idmonedaalternativa;
                $obj->precio = $prec['datos'][$this->_dualidadMonedas->idmonedaalternativa]['precioventa'];
                if ($servicio->preciopromedio == 1) {
                    $sumar[$this->_dualidadMonedas->idmonedaalternativa] += $obj->precio;
                }
                $datProdServ->DatDesglosemonedaprodserv->add($obj);
            }
            $colleccion->add($datProdServ);
            unset($prec);
        }
        if ($servicio->preciopromedio == 1) {
            $desgSC = Doctrine::getTable('DatDesgloselemento')
                ->findByDql(
                    'idelementofactura = ? and idmoneda = ?',
                    array($parametros->productos[0]->idelementofactura, $this->_dualidadMonedas->idmoneda)
                );
            if(count($materialesExistentes) > 0){
                $sumar[$this->_dualidadMonedas->idmoneda] += $this->getSumaMaterialesExistentes(
                    $materialesExistentes, $this->_dualidadMonedas->idmoneda
                );
            }
            $desgSC[0]->preciotarifa = $desgSC[0]->preciotarifaoriginal + $sumar[$this->_dualidadMonedas->idmoneda];
            $collDesgElem->add($desgSC[0]);
            if ($this->_dualidadMonedas->idmonedaalternativa) {
                $desgSA = Doctrine::getTable('DatDesgloselemento')
                    ->findByDql(
                        'idelementofactura = ? and idmoneda = ?',
                        array(
                            $parametros->productos[0]->idelementofactura, $this->_dualidadMonedas->idmonedaalternativa
                        )
                    );
                if (count($materialesExistentes) > 0) {
                    $sumar[$this->_dualidadMonedas->idmonedaalternativa] += $this->getSumaMaterialesExistentes(
                        $materialesExistentes, $this->_dualidadMonedas->idmonedaalternativa
                    );
                }
                $desgSA[0]->preciotarifa =
                    $desgSA[0]->preciotarifaoriginal + $sumar[$this->_dualidadMonedas->idmonedaalternativa];
                $collDesgElem->add($desgSA[0]);
            }
        }
        $colleccion->save();
        $collDesgElem->save();
        $this->actualizarImporte($iddocumento);
        return $this->getImporteTotalDocumento($iddocumento);
    }

    public function getSumaMaterialesExistentes($materialesExistentes, $idmoneda){
        $sumas = 0;
        foreach($materialesExistentes as $mat){
            $desgM = Doctrine::getTable('DatDesglosemonedaprodserv')->
                        findByDql('idprodservicio = ? and idmoneda = ?', array($mat->idprodservicio, $idmoneda));
            $sumas += $desgM[0]->precio;
        }
        return $sumas;
    }

    public function adicionarDatosGenerales($documento, $parametros)
    {
        $factura = new DatDocfactura();
        if ($documento['iddocumento']) {
            $factura->assignIdentifier($documento['iddocumento']);
        }
        if ($parametros['idnumerocontrol']) {
            $obj = Doctrine::getTable('DatNumerocontrol')
                    ->find("{$parametros['idnumerocontrol']}");
            $obj->asignado = 1;
            $obj->save();
        }
        $parametros['idejercicio'] = $this->_idejercicio;
        $parametros['idestructuracomun'] = $this->idestructura;

        $sql = "select oper.pagoexterior, oper.preciocero from mod_logfacturacion.dat_operacionsubsistema oper
                where oper.idnomoperaciones = {$parametros['idoperacion']} and oper.idestructura = {$this->global->Estructura->idestructura}";
        $datAux = $this->doctrineHelper->getConnection()->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        if ($datAux[0]['pagoexterior'] == 1) {
            $parametros['pagoexterior'] = 1;
        }

        $parametros['preciocero'] = $datAux[0]['preciocero'];

        $factura->synchronizeWithArray($parametros);
        
        $datosTransp = new DatDocFacturaTransportacion();
        $datosTransp->synchronizeWithArray($parametros);
        $factura->DatDocFacturaTransportacion = $datosTransp;

        if ($parametros['idcontrato'] || $parametros['numero'] || $parametros['fecha']) {
            $datosContrato = new DatFacturacontrato();
            $datosContrato->synchronizeWithArray($parametros);
            $factura->DatFacturacontrato = $datosContrato;
        }
        if ($parametros['tipoDoc'] == 1) {
            $prefactura = new DatFacturaPrefactura();
            $prefactura->synchronizeWithArray($parametros);
            $factura->DatFacturaPrefactura = $prefactura;
        }
        if (count($parametros['datoscuentacliente']) == 0) {
            $nomCliente =  $this->configuracionHelper->getClientesProveedorByParams($parametros['idcliente']);
            if(count($nomCliente['datos'])) {
                $nomCliente = $nomCliente['datos'][0];
                foreach ($nomCliente['cuentabancaria'] as $c) {
                    $parametros['datoscuentacliente'][] = array('idmoneda'=>$c['idmoneda'], 'idcuentacliente'=>$c['idcuentabancliente']);
                }
            }
        }
        foreach ($parametros['datoscuentacliente'] as $index => $valor) {
            $cuentafacturacliente = new DatCuentafacturacliente();
            $cuentafacturacliente->synchronizeWithArray($valor);
            $factura->DatCuentafacturacliente->add($cuentafacturacliente);
        }
        return $factura;
    }

    public function adicionarAreasFactura(&$documento, $areas)
    {
        if ($areas && is_array($areas)) {
            foreach ($areas as $area) {
                $areaObj = new DatAreaFactura();
                $areaObj->idarea = $area;
                $documento->DatDocfactura->DatAreaFactura->add($areaObj);
            }
        }
    }

    public function adicionarProducto($datos)
    {
        if ($datos->idsubsistema == LogisticaGlobal::SUBSISTEMA_INV && $datos->oferta != 1) {
            $this->productoModel->adicionarProductos(
                    $datos->documento, $datos, array(), true
            );
        } else {
            $this->productoModel->adicionarProductosNom(
                    $datos->documento, array('productos' => $datos->productos, 'idmoneda' => $datos->idmoneda, 'oferta' => $datos->oferta)
            );
        }
    }

    public function adicionarServicio($datos)
    {
        $this->servicioModel->adicionarServicios(
                $datos->documento, (array) $datos
        );
        $this->actualizarImporte($datos->documento);
        return $this->getImporteTotalDocumento($datos->documento);
    }

    /**
     * Funcion que permite eliminar una o varias
     * facturas seleccionadas en estado de elaboracion
     *
     * @param array $params Arreglo con el identificador
     *                      de cada factura seleccionada
     *
     * @return boolean Retorna true si fue un exito la accion
     */
    public function eliminarFactura($params)
    {
        $ubicacionServ = new UtilesubicacionService();
        $prodLogModel = new LogisticaProductoModel();
        $serviceLote = new LoteService();
        $numSerie = new NoSerieService();
        foreach ($params['documentos'] as $index => $documento) {
            if (parent::verificarTiendaVirtual($documento)) {
                $movimientos = $this->productoModel->getProductos($documento, $params['idsubsistema']);
		        if ($params['idsubsistema'] == LogisticaGlobal::SUBSISTEMA_TALLERES) {
                    $actividades = $this->servicioModel->getServicios($documento);
                    if (count($actividades) || count($movimientos)) {
                        if (!$this->verificarEliminarTaller()){
                            return false;
                        }
                    }
            	}
                $docsOrigen = $this->getDocOrigen($documento);
                $arrayDocsOrigen = array();
                foreach ($docsOrigen as $doc) {
                    $arrayDocsOrigen[] = $doc['idpadre'];
                }
                $iddocOrigen = Doctrine::getTable('DatDocumento')->find($arrayDocsOrigen[0])->iddoc;
                $noNota = ($iddocOrigen != $this->getIddocNota()) ? true : false;
                $datosCmpto = $datosLotes = array();
                foreach ($movimientos as $i => $prod) {
                    $arrayProductos = array(
                        'idproducto' => $prod['idproducto'], 'idindicador' => $prod['idindicador'],
                        'iddocorigen' => $arrayDocsOrigen, 'enprocesonuevo' => 0, 'enprocesoviejo' => $prod['cantidad'],
                        'entregado' => 0, 'idactividad'=>($prod['idactividadmaterial'] ? $prod['idactividadmaterial'] : null)
                    );
                    if ($params['idsubsistema'] == LogisticaGlobal::SUBSISTEMA_INV) {
                        $datosCmpto['productos'][$i] = $arrayProductos;
                        if($noNota)
                            $numSerie->cambiaEstadoFacturacion($prod['idmovimiento']);
                    }
                    $datosCmptoPf[$i] = $arrayProductos;
		    if ($params['idsubsistema'] == LogisticaGlobal::SUBSISTEMA_TALLERES) {
                        $datosCmptoOrden['productos'][$i] = $arrayProductos;
                    }
                    /* $lotes = Doctrine::getTable('DatMovlote')->findByDql('idmovimiento = ?', array($prod['idmovimiento']));
                      foreach($lotes as $lote){
                      $datosLotes[] = array('cantidad'=>0,'cantidadVieja'=>$lote['cantidad'], 'idlote'=>$lote['idlote']);
                      } */
                }
		if (isset($actividades)) {
	                foreach ($actividades as $i => $serv) {
	                    $arrayServ = array(
	                        'idindicador' => $serv['idindicador'],
	                        'iddocorigen' => $arrayDocsOrigen, 'enprocesonuevo' => 0, 'enprocesoviejo' => $serv['cantidad'],
	                        'entregado' => 0
	                    );
	                    $datosCmptoOrden['actividades'][$i] = $arrayServ;
	                    /* $lotes = Doctrine::getTable('DatMovlote')->findByDql('idmovimiento = ?', array($prod['idmovimiento']));
	                      foreach($lotes as $lote){
	                      $datosLotes[] = array('cantidad'=>0,'cantidadVieja'=>$lote['cantidad'], 'idlote'=>$lote['idlote']);
	                      } */
	                }
	            }
                //if(count($datosLotes) > 0){
                $serviceLote->eliminarLotesDocumento($documento);
                //}
                if (count($datosCmpto) > 0) {
                    $datosCmpto['idcliente'] = $params['clientes'][$index];
                    $prodOrdenModel = new ProdordenModel();
                    $prodOrdenModel->actualizarCumplimientoByParams($datosCmpto);
                }
                if ($datosCmptoPf) {
                    $this->productoModel->actualizarCumpPrefByParams($datosCmptoPf);
                }
		if ($datosCmptoOrden) {
                $datosCmptoOrden['iddocumento'] = $documento;
                $ordenService = new OrdenTrabajoTalleresService();
                $ordenService->actualizarCumplimiento($datosCmptoOrden);
            }
                /*if ($params['idsubsistema'] == LogisticaGlobal::SUBSISTEMA_INV) {
                    $updateDicponible = true;
                    if (count($docsOrigen) > 0) {
                        //verificar lo de reservar disponible aki
                        $updateDicponible = false;
                    } else {
                        if ($params['oferta'][$index]->oferta == 1 && $params['oferta'][$index]->reservadisponible == 0) {
                            $updateDicponible = false;
                        }
                    }
                    $prodLogModel->eliminarMovimientos(
                            $documento, array(), $updateDicponible, false
                    );
                }*/
                $this->eliminarDocumento($documento);
                if (count($arrayDocsOrigen) > 0) {
                    $this->docfatura->updateOfertasNotas($arrayDocsOrigen);
                    //$this->deleteDocumentoPadre($documento);
                }
                $ubicacionServ->eliminarUbicacionComprometida($documento);
            }

        }
        //$this->docfatura->eliminarFacturas($params['documentos']);
        /*$datAreaFactura = new DatAreaFactura();
        $datAreaFactura->deleteAreasFacturas($params['documentos']);*/
        return true;
    }

    public function deleteDocumentoPadre($documentos)
    {
        return Doctrine_Query::create()
                        ->delete()
                        ->from('DatDocumentoPadre')
                        ->whereIn(
                                'iddocumento', $documentos
                        )
                        ->execute();
    }

    public function getIdCondicionPago($array) {
        if (count($array['cobrospagos'])) {
            foreach ($array['cobrospagos'] as $c) {
                if ($c['idclasificacion'] == 1) {
                    return $c['idterminodepago'];
                }
            }
        }
        return null;
    }

    private function inCondicionCuentaPorCobrar($array, $idcondicion) {
        if (count($array['cobrospagos'])) {
            foreach ($array['cobrospagos'] as $c) {
                if ($c['idclasificacion'] == 1 && $c['idterminodepago'] == $idcondicion) {
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * Funcion que permite confirmar una o varias
     * facturas seleccionadas en estado de elaboracion
     *
     * @param array $params Arreglo con el identificador
     *                      de cada factura seleccionada
     *
     * @return boolean Retorna true si fue un exito la accion
     */
    public function confirmarFactura($params)
    {
        $numSql = "select count(nv.nombre) from mod_logistica.nom_variableglobal nv 
                          where nv.nombre = 'NROFACT_CONFIRMAR' and nv.valor = 'true'";
        $num = LogisticaDoctrineHelper::__init()->getConnection()->execute($numSql)->fetchAll(PDO::FETCH_COLUMN);
        $generarNumero = ($num[0] > 0) ? true : false;
        $ubicacionServ = new UtilesubicacionService();

        if ($generarNumero) {
            $sql = "select c.*
                from mod_logfacturacion.conf_configuracionfactura c where c.idestructuracomun = {$this->idestructuracomun}";
            $aux = LogisticaDoctrineHelper::__init()->getConnection()->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
            $utilizaserie = $aux[0]['utilizarserie'];
            if ($utilizaserie == 1) {
                $numerosdocumentos = $this->GetNumerosDocumentosAsignar($params);
            } else {
                $numerosdocumentos = $this->GetNumerosDocumentosSinSerie($params);
            }
            foreach ($numerosdocumentos as $idseriedocentidad => $documentos) {
                $numdocumento = ($documentos[0]['numedocumeno']) ? ++$documentos[0]['numedocumeno'] : $documentos[0]['nrodocumentoinicial'];
                $longguia = strlen($documentos[0]['nrodocumentoinicial']);
                foreach ($documentos as $pos => $docData) {
                    $documento = $docData['idfactura'];
                    $fact = Doctrine::getTable('DatDocfactura')->find($documento);

                    if (!$fact->nrofactura){
                        $numR = str_pad($numdocumento++, $longguia, 0, STR_PAD_LEFT);
                        $fact->nrofactura = $numR;
                    }
                    if (!$fact->idcondicionpago) {
                        $nomCliente =  $this->configuracionHelper->getClientesProveedorByParams($fact->idcliente);
                        if (count($nomCliente['datos'])) {
                            $idCP = $this->getIdCondicionPago($nomCliente['datos'][0]);
                            $fact->idcondicionpago = $idCP;
                            $documentoCliente = Doctrine::getTable('DatDocumentoCliente')
                                ->findByDql(
                                    'iddocumento = ?', array($documento)
                                );
                            $documentoCliente[0]->idcondicionpago = $idCP;
                            $documentoCliente[0]->save();
                        }
                    }
                    $fact->save();
                    if ($fact->oferta == 0 && $fact->iddoc == $this->objIddocFac->iddoc) {
                        $query = $this->getProductoModel()->devolverMovimientos(array('iddocumento' => $documento), true);
                        $query->addSelect(
                            'mov.iddocumento AS iddocumento, (SELECT (count(up.idubicacion) = 1) FROM DatUbicacionproducto up ' .
                            'WHERE up.idproducto = mov.idproducto AND up.cantidad > 0) AS ubicacionunica, (SELECT mu.idmovubicacion ' .
                            'FROM DatMovubicacion mu WHERE mu.idmovimiento = mov.idmovimiento AND (SELECT count(mu2.idmovubicacion) ' .
                            'FROM DatMovubicacion mu2 WHERE mu2.idmovimiento = mov.idmovimiento) = 1) AS idmovubicacion, ' .
                            '(SELECT up2.idubicacion FROM DatUbicacionproducto up2 WHERE up2.idproducto = mov.idproducto ' .
                            'AND (SELECT count(up3.idubicacion) FROM DatUbicacionproducto up3 ' .
                            'WHERE up3.idproducto = mov.idproducto AND up3.cantidad > 0) = 1 limit 1) AS idestructuraubicacion'
                        );
                        $movimientos = $query->fetchArray();
                        $collection = new Doctrine_Collection('DatMovubicacion');
                        foreach ($movimientos as $value) {
                            if (!$value['tienelote'] && !$value['equipo'] && !$value['municion'] && $value['ubicacionunica']) {
                                $record = new DatMovubicacion();
                                if ($value['idmovubicacion']) {
                                    $record->assignIdentifier($value['idmovubicacion']);
                                }
                                $record->synchronizeWithArray($value);
                                $collection->add($record);

                                $value['idubicacion'] = $value['idestructuraubicacion'];
                                //$ubicacionServ->adicionarUbicacionComprometida($value);
                            }
                        }
                        if ($collection->count() > 0) {
                            $collection->save();
                        }
                    }
                    parent::confirmarDocumento($documento);
                    $query = Doctrine_Query::create()
                        ->delete()
                        ->from('DatCilindroFactura')
                        ->addWhere('iddocumento = ? and cantidad = 0', array($documento))->execute();
                }
            }
        } else {
            foreach ($params as $documento) {
                $fact = Doctrine::getTable('DatDocfactura')->find($documento);
                if (!$fact->idcondicionpago) {
                    $nomCliente =  $this->configuracionHelper->getClientesProveedorByParams($fact->idcliente);
                    if (count($nomCliente['datos'])) {
                        $idCP = $this->getIdCondicionPago($nomCliente['datos'][0]);
                        $fact->idcondicionpago = $idCP;
                        $documentoCliente = Doctrine::getTable('DatDocumentoCliente')
                            ->findByDql(
                                'iddocumento = ?', array($documento)
                            );
                        $documentoCliente[0]->idcondicionpago = $idCP;
                        $documentoCliente[0]->save();
                        $fact->save();
                    }
                }
                if ($fact->oferta == 0 && $fact->iddoc == $this->objIddocFac->iddoc) {
                    $query = $this->getProductoModel()->devolverMovimientos(array('iddocumento' => $documento), true);
                    $query->addSelect(
                        'mov.iddocumento AS iddocumento, (SELECT (count(up.idubicacion) = 1) FROM DatUbicacionproducto up ' .
                        'WHERE up.idproducto = mov.idproducto AND up.cantidad > 0) AS ubicacionunica, (SELECT mu.idmovubicacion ' .
                        'FROM DatMovubicacion mu WHERE mu.idmovimiento = mov.idmovimiento AND (SELECT count(mu2.idmovubicacion) ' .
                        'FROM DatMovubicacion mu2 WHERE mu2.idmovimiento = mov.idmovimiento) = 1) AS idmovubicacion, ' .
                        '(SELECT up2.idubicacion FROM DatUbicacionproducto up2 WHERE up2.idproducto = mov.idproducto ' .
                        'AND (SELECT count(up3.idubicacion) FROM DatUbicacionproducto up3 ' .
                        'WHERE up3.idproducto = mov.idproducto AND up3.cantidad > 0) = 1 limit 1) AS idestructuraubicacion'
                    );
                    $movimientos = $query->fetchArray();
                    $collection = new Doctrine_Collection('DatMovubicacion');
                    foreach ($movimientos as $value) {
                        if (!$value['tienelote'] && !$value['equipo'] && !$value['municion'] && $value['ubicacionunica']) {
                            $record = new DatMovubicacion();
                            if ($value['idmovubicacion']) {
                                $record->assignIdentifier($value['idmovubicacion']);
                            }
                            $record->synchronizeWithArray($value);
                            $collection->add($record);

                            $value['idubicacion'] = $value['idestructuraubicacion'];
                            //$ubicacionServ->adicionarUbicacionComprometida($value);
                        }
                    }
                    if ($collection->count() > 0) {
                        $collection->save();
                    }
                }
                parent::confirmarDocumento($documento);
                $query = Doctrine_Query::create()
                    ->delete()
                    ->from('DatCilindroFactura')
                    ->addWhere('iddocumento = ? and cantidad = 0', array($documento))->execute();
            }
        }


        return array('success' => true, 'estado' => EstadoDocumentoModel::ESTADO_PENDIENTE);
    }

    public function ubicacionConDatosCorrectos($iddocumento)
    {
        $ubicacionServ = new UtilesubicacionService();
        $datosBusqueda = $this->getProductoModel()->devolverMovimientos(array('iddocumento' => $iddocumento));
        return $ubicacionServ->comprobarUbicacionMov($datosBusqueda);
    }

    /**
     * Funcion que permite facturar una o varias
     * facturas seleccionadas en estado de preparado
     *
     * @param array $params Arreglo con el identificador
     *                      de cada factura seleccionada
     *
     * @return boolean Retorna true si fue un exito la accion
     */
    public function contabilizarFactura($params, $utilizaserie = 0, $infoDoc = array())
    {
        $idoperacion = false;
        $ubicacionServ = new UtilesubicacionService();
        //en params tengo que diferenciar cuando sea una nota porque no rebajan existencia
        //$resultado = $this->verificarExistencias($params);
        $inventario = LogisticaGlobal::__init()
            ->estaAperturadoSubsistema(LogisticaGlobal::SUBSISTEMA_INV);
        if($inventario){
            $modeloCComp = new CantidadesComprometidasModel();
            $serviceLote = new LoteService();
        }
        //if ($resultado['respuesta'] == 0) {
            $prodModel = new LogisticaProductoModel();
            $coll = new Doctrine_Collection('DatDocfactura');
            if ($utilizaserie == 1) {
                $numerosdocumentos = $this->GetNumerosDocumentosAsignar($params);
            } else {
                $numerosdocumentos = $this->GetNumerosDocumentosSinSerie($params);
            }
            $arrayDocumentos = array();
            foreach ($numerosdocumentos as $idseriedocentidad => $documentos) {
                $numdocumento = ($documentos[0]['numedocumeno']) ? ++$documentos[0]['numedocumeno'] : $documentos[0]['nrodocumentoinicial'];
                $longguia = strlen($documentos[0]['nrodocumentoinicial']);
                foreach ($documentos as $pos => $documento) {
                    if (parent::verificarTiendaVirtual($documento['idfactura'])) {
                        $arrayDocumentos[] = $documento['idfactura'];
                        //verificar si es a partir de documentos de entrega sino no actalizo cumplimientos
                        $datdocfactura = Doctrine::getTable("DatDocfactura")
                            ->find($documento['idfactura']);
                    $datDocumento = Doctrine::getTable("DatDocumento")
                        ->find($documento['idfactura']);
                    $idoperacion = $datDocumento->idoperacion;
                    if ($datdocfactura->idsubsistema == LogisticaGlobal::SUBSISTEMA_INV && $datDocumento->iddoc == $this->objIddocFac->iddoc) {
                        $productos = $this->getProductosDb(
                            array(
                                'iddocumento' => $documento['idfactura'],
                                'idsubsistema' => LogisticaGlobal::SUBSISTEMA_INV,
                                'dql' => 1
                            )
                        )->fetchArray();
                        foreach ($productos as &$p) {
                            $p['cambioTipoPrecio'] = 1;
                            unset($p['DatProductoLogistica']);
                            unset($p['DatProdFactura']);
                            unset($p['DatMovmoneda']);
                        }
                        $this->modificarProductos(array('productos'=>$productos), $datdocfactura);
                    }
                    $docOrigen = $this->getDocOrigen($documento['idfactura']);
                    $updateExistencia = true;
                    $isEntrada = ($this->objIddocNotaCredito->iddoc && $datDocumento->iddoc == $this->objIddocNotaCredito->iddoc) ? true : false;
                    if (count($this->iddoc) > 1) {
                        if ($docOrigen[0]['iddoc'] == $this->iddoc[1]) {
                            $updateExistencia = false;
                        }
                    }
                    if ($docOrigen[0]['iddoc'] == $this->objIddocFac->iddoc && $datDocumento->iddoc != $this->objIddocNotaCredito->iddoc) {
                        $updateExistencia = false;
                    } else if ($datDocumento->iddoc == $this->objIddocNotaCredito->iddoc) {
                        $importe = $this->getImporteTotalDocumento($documento['idfactura']);
                        if ($this->contabilidadHelper->verificarDuoContabilizadoExterno(
                                $docOrigen[0]['idpadre'], $importe['importecontable']
                            ) == true) {
                            throw new ZendExt_Exception('LOG_LB_DOC_030');
                        }
                    }
                    $this->setEstadoVenta($documento['idfactura']);
                    $this->actualizarCumplimientos(
                        $datdocfactura, $datdocfactura->idcliente
                    );
                    $cronologia = parent::contabilizarDocumento($documento['idfactura']);
                    /*$datDocumento = Doctrine::getTable("DatDocumento")
                        ->find($documento['idfactura']);*/
                    $prodModel->aprobarMovimientos(
                            $documento['idfactura'], $cronologia, $isEntrada, $updateExistencia
                    );
                    if (
                        $datdocfactura->idsubsistema == LogisticaGlobal::SUBSISTEMA_AFT
                        && $datdocfactura->alquiler == 0
                    ) {
                        $this->actualizarExistenciasActivos($documento['idfactura']);
                    }
                    if ($updateExistencia && $inventario) {
                        $serviceLote->actualizarExistenciaLote($documento['idfactura']);
                        $this->actualizarUbicacion($documento['idfactura']);
                    }
                    $this->actualizarImporte($documento['idfactura']);
                    //$this->actualizarImpuestosFactura($documento['idfactura']);
                    if ($inventario) {
                        $modeloCComp->cambiarEstado(2, $documento['idfactura']);
                        $ubicacionServ->cambiarEstado($documento['idfactura'], 2);
                    }
                        if (!$datdocfactura->nrofactura) {
                            $numR = str_pad($numdocumento++, $longguia, 0, STR_PAD_LEFT);
                            $datdocfactura->nrofactura = $numR;
                        }
                        $fechaDoc = $this->convertirFecha($datDocumento->fechacontable);
                        $fecha = date_create($fechaDoc);
                        date_add($fecha, date_interval_create_from_date_string("{$datdocfactura->dias} days"));
                        $fechaVencimiento = date_format($fecha, 'd/m/Y');
                        $datdocfactura->fechavencimiento = $fechaVencimiento;
                        $coll->add($datdocfactura);
                        $infoDoc[$pos]->nrofactura = $numR;
                        $this->saveImgQrCode($infoDoc[$pos]);
                    }
                }
            }

            if (count($coll) > 0) {
                try{
                    $coll->save();
                }catch (Doctrine_Exception $e){
                    throw new LogisticaException('LOG_LB_FAC_004', null, null, $this->idestructura);
                }

                if ($this->getOperacionComprobante($idoperacion) == 1) {
                    $comp = $this->generarComprobante($arrayDocumentos, LogisticaGlobal::SUBSISTEMA_FAC);
                    $resultado['comprobante'] = $comp[0];
                }
            }
            $resultado['estado'] = EstadoDocumentoModel::ESTADO_CONTABILIZADO;
            $resultado['nrofactura'] = $numR;
            $resultado['fechavencimiento'] = $fechaVencimiento;
        //}
        return $resultado;
    }

    private function saveImgQrCode($datosQR)
    {
        $datosImp = explode(" ", $datosQR->importetotal);
		$moneda = "'".$datosImp[1]."'";
		$sql = "SELECT idestructura,consumerkey,consumersecret,idmoneda,codigoiso
				FROM mod_logfacturacion.conf_pagoelectronico 
				WHERE codigoiso = {$moneda} and idestructura = {$datosQR->idestructuracomun}";
		$confpago = $this->doctrineHelper->getConnection()->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
		
        if($confpago[0]->consumerkey && $confpago[0]->consumersecret){
            $obs = 'ENTIDAD: '+$datosQR->deposito+'REFERENCIA: '+$datosQR->nrofactura+'FECHA: '+$datosQR->fechacontable;
            $dataQr = LogisticaGlobal::__init()->getEznContainer()->generateQrCode(
                array('monto' => $datosImp[0],
                    'idComercio' =>'',
                    'moneda' => $datosImp[1],
                    'descripcion' => $obs,
                    'consumerKey'=> $confpago[0]->consumerkey,
                    'consumerSecret'=>$confpago[0]->consumersecret,
                    'type'=>0));

            if($datosQR->iddocumento && $dataQr['image']){
                $documento =  new DocumentoLogisticaModel();
                $documento->saveQrByDoc($datosQR->iddocumento, $dataQr['image'],1);
            }
        }
    }

    private function actualizarExistenciasActivos($iddocumento = false, $restar = true, $producto = false){
        $movService = new MovimientoService();
        if($iddocumento){
            $elemtModel = new ElementosFacturaModel();
            $prod = $elemtModel->getElementos(
                array('iddocumento' => array($iddocumento), 'activosfijos' => 1)
            );
            foreach ($prod as $p) {
                $movService->modCantidadMedios($p['idproducto'], 1, (($restar) ? '-' : '+'));
            }
        } else {
            $movService->modCantidadMedios($producto['idproducto'], 1, (($restar) ? '-' : '+'));
        }
    }

    private function setEstadoVenta($idfactura){
        if(class_exists('DatVentafactura')){
            $query = Doctrine_Query::create()
                ->select('dvf.idventas')
                ->from('DatVentafactura dvf')
                ->where('dvf.idfactura = ?', array($idfactura))
                ->fetchArray();
            if (count($query) > 0) {
                $pv = new PuntodeventaService();
                $pv->cambiarEstadoVenta(array('idventas' => $query[0]['idventas'], 'estado' => 2));
            }
        }
    }

    private function actualizarCumplimientos($documento, $idcliente)
    {
        $movimientos = $this->productoModel->getProductos($documento->idfactura, $documento->idsubsistema);
        if ($documento->idsubsistema == LogisticaGlobal::SUBSISTEMA_TALLERES) {
            $actividades = $this->servicioModel->getServicios($documento->idfactura);
        }
        $docsOrigen = $this->getDocOrigen($documento->idfactura);
        $arrayDocsOrigen = array();
        foreach ($docsOrigen as $doc) {
            $arrayDocsOrigen[] = $doc['idpadre'];
        }
        $datosCmpto = array();
        foreach ($movimientos as $i => $prod) {
            $arrayProductos = array('idproducto' => $prod['idproducto'], 'idindicador' => $prod['idindicador'],
                'iddocorigen' => $arrayDocsOrigen, 'enprocesonuevo' => 0, 'enprocesoviejo' => 0,
                'entregado' => $prod['cantidad'], 'idactividad'=>($prod['idactividadmaterial'] ? $prod['idactividadmaterial'] : null));
            if ($documento->idsubsistema == LogisticaGlobal::SUBSISTEMA_INV) {
                $datosCmpto['productos'][$i] = $arrayProductos;
            }
            $datosCmptoPf[$i] = $arrayProductos;
            $datosCmptoOrden['productos'][$i] = $arrayProductos;
        }
        $datosCmpto['idcliente'] = $idcliente;
        $datosCmpto['reserva'] = $documento->reserva;

        if ($documento->idsubsistema == LogisticaGlobal::SUBSISTEMA_INV && isset($datosCmpto['productos'])) {
            $prodOrdenModel = new ProdordenModel();
            $prodOrdenModel->actualizarCumplimientoByParams($datosCmpto);
        }
        if ($datosCmptoPf) {
            $this->productoModel->actualizarCumpPrefByParams($datosCmptoPf);
        }
	if ($documento->idsubsistema == LogisticaGlobal::SUBSISTEMA_TALLERES) {
            foreach ($actividades as $i => $serv) {
                $arrayServ = array('idindicador' => $serv['idindicador'],
                    'iddocorigen' => $arrayDocsOrigen, 'enprocesonuevo' => 0, 'enprocesoviejo' => 0,
                    'entregado' => $serv['cantidad']);
                $datosCmptoOrden['actividades'][$i] = $arrayServ;
                /* $lotes = Doctrine::getTable('DatMovlote')->findByDql('idmovimiento = ?', array($prod['idmovimiento']));
                  foreach($lotes as $lote){
                  $datosLotes[] = array('cantidad'=>0,'cantidadVieja'=>$lote['cantidad'], 'idlote'=>$lote['idlote']);
                  } */
            }
            $datosCmptoOrden['iddocumento'] = $documento->idfactura;
            $ordenService = new OrdenTrabajoTalleresService();
            $ordenService->actualizarCumplimiento($datosCmptoOrden);
        }
    }

    private function actualizarUbicacion($iddocumento, $ubicar = false)
    {
        $ubicacionServ = new UtilesubicacionService();
        $query = Doctrine_Query::create()
            ->select(
                'mu.idestructuraubicacion AS idubicacion, mu.cantidad, m.idproducto AS idproducto, ' .
                'up.idubicacionproducto AS idubicacionproducto, ap.idareaproducto AS idareaproducto'
            )
            ->from('DatMovubicacion mu')
            ->innerJoin('mu.DatMovimientos m')
            ->innerJoin('mu.DatEstructuraubicacion eu')
            ->innerJoin('eu.DatArea a')
            ->innerJoin('a.DatAreaproducto ap')
            ->innerJoin('eu.DatUbicacionproducto up')
            ->innerJoin(
                'a.DatEstructuraubicacion eu2 ON (eu2.idarea = a.idarea AND eu2.idestructuraubicacion = eu2.idpadre)'
            )
            ->leftJoin('m.DatLote l')
            ->leftJoin('m.DatMovnroserie mns')
            ->where(
                'm.iddocumento = ? AND m.idproducto = up.idproducto AND m.idproducto = ap.idproducto ' .
                'AND eu.idarbol = eu2.idarbol AND l.idlote IS NULL AND mns.idmovnumeroserie IS NULL', $iddocumento
            )
            ->orderBy('m.idproducto');
        /*if ($this->existComponent('log.inv.armamento')) {
            $query->leftJoin('m.DatMovproductomunic mpm')
                ->addWhere('mpm.idmovproductomunic IS NULL');
        }*/
        $ubicaciones = $query->fetchArray();
        if ($ubicar) {
            foreach ($ubicaciones as $value) {
                $ubicacionServ->ubicarProducto($value);
            }
        } else {
            $ubicacionServ->desubicarProducto($ubicaciones);
        }
        return true;
    }

    private function actualizarCumplRegCant($prod, $documento)
    {
        $prodFact = Doctrine::getTable('DatMovimientos')
                ->find(
                $prod['idmovimiento']
        );
        $docsOrigen = $this->getDocOrigen($documento->idfactura);
        $arrayDocsOrigen = array();
        foreach ($docsOrigen as $doc) {
            $arrayDocsOrigen[] = $doc['idpadre'];
        }
        $datosCmpto = array();
        $arrayProductos = array(
            'idproducto' => $prodFact->idproducto, 'iddocorigen' => $arrayDocsOrigen,
            'enprocesonuevo' => $prod['cantidad'], 'enprocesoviejo' => $prodFact->cantidad, 'entregado' => 0
        );
        $datosCmpto['productos'][0] = $arrayProductos;
        $datosCmpto['idcliente'] = $documento->idcliente;
        if (count($datosCmpto) > 0) {
            $prodOrdenModel = new ProdordenModel();
            $prodOrdenModel->actualizarCumplimientoByParams($datosCmpto);
        }
        if($prod['diferencia'] == 0){
            $this->rectificarDiferencia(
                array(
                    'idproducto' => $prod['idproducto'],
                    'idmovimiento' => array($prod['idmovimiento']),
                    'docorigen' => $arrayDocsOrigen,
                    'idcliente' => $documento->idcliente,
                    'autorizado' => $prod['autorizado'],
                    'cantidad' => $prod['cantidad']
                )
            );
        }
    }

    public function rectificarDiferencia($parametros){
        if(count($parametros['docorigen']) > 0){
            $query = new Doctrine_Query();
            $dqlpart = "";
            $cantidad = 0;
            $movimientos = array();
            if ($parametros['idmovimiento']) {
                $dqlpart = " and dm.idmovimiento not in (".implode(',', $parametros['idmovimiento']).")";
                $movimientos = array_merge($movimientos, $parametros['idmovimiento']);
            }
            $resp = $query->select('dm.idmovimiento, COALESCE(sum(dm.cantidad),0) as cantidad')
                ->from('DatMovimientos dm')
                ->innerJoin('dm.DatDocumento dd')
                ->innerJoin('dd.DatDocfactura df')
                ->where(
                    "dd.estado in (1,2,4) and dm.iddocumento in (SELECT ddp.iddocumento FROM DatDocumentoPadre ddp
                 WHERE ddp.idpadre in (" . implode(',', $parametros['docorigen']) . ")) and dm.idproducto = ?
                 and df.idcliente = ? {$dqlpart}", array($parametros['idproducto'], $parametros['idcliente'])
                )->groupBy('dm.idmovimiento')
                ->fetchArray();
            foreach($resp as $r){
                $cantidad += $r['cantidad'];
                $movimientos[] = $r['idmovimiento'];
            }
            $cantidad += $parametros['cantidad'];
            if($cantidad <= $parametros['autorizado']){
                Doctrine_Query::create()
                    ->update('DatMovimientos')
                    ->set(
                        'diferencia', 0
                    )
                    ->andWhereIn("idmovimiento", $movimientos)
                    ->execute();
            }else{

            }
        }

    }

    private function verificarExistencias($documentos)
    {
        $datos = $this->docfatura->getDatosExistencias($documentos);
        foreach ($datos as $value) {
            if ($value['suma'] > $value['cantidad']) {
                return array('respuesta' => 1);
            }
        }
        return array('respuesta' => 0);
    }

    /**
     * Funcion que permite cargar las facturas gestionadas en la estructura
     *
     * @param array $params Arreglo con los parametros necesarios
     *
     * @return array Arreglo con las facturas y la cantidad total
     */
    public function obtenerFacturas($params)
    {
        $numeroferta = $this->_numeroferta;
        $criterio =  $params['criterio'];
        $nrodoc =  $params['nrodoc'];
        $arraynotas = array($this->objIddocFac->iddoc);
        unset($params['criterio']);
        unset($params['nrodoc']);
        if(!$params['estado']){
          $params['estado'] = array(
                                EstadoDocumentoModel::ESTADO_ELABORACION
                                ,EstadoDocumentoModel::ESTADO_PENDIENTE,
                                EstadoDocumentoModel::ESTADO_APROBADO,EstadoDocumentoModel::ESTADO_CONTABILIZADO,
                                EstadoDocumentoModel::ESTADO_CANCELADO,EstadoDocumentoModel::ESTADO_PROPUESTO_CANCELAR
                                );
        }
        if ($params['idnomoperaciones']) {
            $params['idoperacion'] = explode(',', $params['idnomoperaciones']);
            unset($params['idsubsistema']);
        }
        $query = parent::devolverDocumentos($params);
        $params['criterio'] = $criterio;
        $params['nrodoc'] = $nrodoc;
        if(!$params['compventa']) {
          $queryFactura = $this->docfatura->innerJoinWithFactura($query, 'd','df', 1,$numeroferta);
        } else {
          $queryFactura = $this->docfatura->innerJoinWithFactura($query, 'd', 'df', false);
          if($this->objIddocVenta->iddoc) {
              $arraynotas[] = $this->objIddocVenta->iddoc;
          }
          if($this->objIddocDev->iddoc) {
              $arraynotas[] = $this->objIddocDev->iddoc;
          }
        }

        $queryFactura->addSelect(
            '(SELECT COUNT(ddpp.iddocumentopadre) FROM DatDocumentoPadre ddpp '.
            'WHERE ddpp.iddocumento = d.iddocumento) as tienepadre'
        );
        $queryFactura->addSelect(
            'd.idcomprobante'
        );
        if ($params['notadc']) {
            if($this->objIddocNotaDebito->iddoc) {
                $arraynotas[] = $this->objIddocNotaDebito->iddoc;
            }
            if($this->objIddocNotaCredito->iddoc) {
                $arraynotas[] = $this->objIddocNotaCredito->iddoc;
            }
            $params['iddocnotadc'] = $arraynotas;
        }
        $params['iddocfact'] = $this->objIddocFac->iddoc;
        $this->docfatura->addFiltersFactura($queryFactura, $params);
        if (!$params['datosBasicos']) {
            $queryFactura = DatDocFacturaTransportacion::getJoinFacturaTransportacion(
                            $queryFactura
            );
            $queryFactura = DatFacturacontrato::getJoinFacturaContrato(
                            $queryFactura
            );
            $queryFactura = DatFacturaPrefactura::getJoinPrefacturaFactura(
                            $queryFactura
            );
            $queryFactura = DatNumerocontrol::getJoinFacturaNumeroControl(
                            $queryFactura, 'df'
            );
        } else {
            if ($params['comprobante']) {
                $queryFactura->addWhere("d.idcomprobante is null");
            }
        }
        if ($params['compgenerado']) {
            $queryFactura->addWhere("d.idcomprobante is not null");
        }
        $total = $queryFactura->count();
        $dql = $this->logisticaDoctrine->addQueryLimits(
            $queryFactura, $params
        );
        $dql->addSelect('((SELECT COALESCE(COUNT(defp.idelementofactura)) FROM DatElementosFactura defp'.
            ' INNER JOIN defp.DatProdServNomenclador dpsn WHERE defp.idfactura = d.iddocumento and dpsn.tipo = 1) + '.
            '(SELECT COALESCE(COUNT(defp1.idelementofactura),0) FROM DatElementosFactura defp1'.
            ' INNER JOIN defp1.DatActivosfactura daf WHERE defp1.idfactura = d.iddocumento) + '.
            ' (SELECT COALESCE(COUNT(dmcp.idmovimiento),0) FROM DatMovimientos dmcp WHERE dmcp.iddocumento = d.iddocumento)'.
            ') as productos');
        $dql->addSelect('(SELECT COALESCE(COUNT(defp2.idelementofactura)) FROM DatElementosFactura defp2'.
            ' INNER JOIN defp2.DatProdServNomenclador dpsn1 WHERE defp2.idfactura = d.iddocumento and dpsn1.tipo = 2'.
            ') as servicios');
        $dql->addSelect("(CASE WHEN df.idmoneda IS NOT NULL THEN (SELECT nm.codigoiso FROM NomMoneda nm WHERE nm.idmoneda = df.idmoneda".
            ") WHEN df.idmonedaprod IS NOT NULL THEN (SELECT nm1.codigoiso FROM NomMoneda nm1 WHERE nm1.idmoneda = df.idmonedaprod) ELSE '{$this->_dualidadMonedas->codigoiso}' END) as isomoneda");
        $facturas = $dql
                ->fetchArray();
        if (!$params['datosBasicos']) {
            foreach ($facturas as &$value) {
                $datAuxF = $this->datosFacturaAux($value['iddocumento']);
                if (count($datAuxF)) {
                    $value['nrocuentacliente'] = $datAuxF[0]['cuentas'];
                    $value['condicionpago'] = $datAuxF[0]['nombre'];
                }
                if ($value['idproveedor']) {
                    $transp = $this->configuracionHelper->getClientesProveedorByParams(
                            $value['idproveedor'], null, null, null, null, null
                    );
                    if (count($transp['datos']) > 0) {
                        $value['nombretransp'] = $transp['datos'][0]['nombre'];
                    } else {
                        $value['nombretransp'] = $this->estructuraHelper->getEstructura(
                                        $value['idproveedor']
                                )[0]->denominacion;
                    }
                }
                if ($value['iddeposito']) {
                    $deposito = $this->estructuraHelper->obtenerEstructurasNoFormales(
                        false, $this->idestructura, array(), false, false, array($value['iddeposito']), -1
                    );
                    $estructuraOp = $deposito[0]['DatEstructuraop'];
                    $depositoCodigo = $estructuraOp[0]['codigo'].' '. $estructuraOp[0]['text'];
                    $value['depositofactura'] = $depositoCodigo;
                }
                if ($value['idcentrocosto']) {
                    $centrocosto = $this->getCentroDeCostoById($value['idcentrocosto']);
                    if ($centrocosto) {
                        $value['centrocosto'] = $centrocosto->text;
                    }
                }
                $value['tipodocumento'] = $this->getTipoDocumento($value);
                $value['importes'] = $this->getImporteTotalDocumento($value['iddocumento']);
                $value['importetotal'] = number_format($value['importes']['importecontable'], 2).' '.$value['isomoneda'];
                $value['importetotalalt'] = $value['importes']['importealternativo'];
                $recdesc = 0;
                if ($value['calculoconcepto'] > 0) {
                    $recdesc = $value['calculoconcepto'];
                    if ($value['conceptoventa'] == '-') {
                        $recdesc *= -1;
                    }
                }
                $value['importefinal'] = number_format($value['importes']['importecontable']+$recdesc, 2).' '.$value['isomoneda'];
                if ($value['importes']['importeconceptocup']) {
                    $value['importetotal'] .= ', '.number_format($value['importes']['importeconceptocup'],2).' '.$this->_dualidadMonedas->codigoiso;
                }
                /*$value['productos'] = $this->productoModel->getCantidadProductos(
                        $value['iddocumento'], $value['idsubsistema'], $value['oferta']
                );*/
                //$value['servicios'] = $this->servicioModel->getCantServicios($value['iddocumento']);
                $resultDql = $this->getDocOrigen($value['iddocumento']);
                if (count($resultDql) > 0) {
                    $value['datosdocorigen'] = $resultDql;
                    $value['docorigen'] = $this->getStringDocOrigen($resultDql);
                    $tipoDocOrg = $this->getTipoDocOrigen($resultDql);
                    $value['tipodocorigen'] = ($value['idsubsistema'] == LogisticaGlobal::SUBSISTEMA_AFT)
                        ?(($value['alquiler'] == 1)
                            ? $this->getOperacionesActivo('OPER_ALQUILER')
                            : $this->getOperacionesActivo('OPER_BAJA_VENTA'))
                        :$tipoDocOrg['denominacion'];
                    $value['tipoDoc'] = $tipoDocOrg['tipoDoc'];
                }
            }
            $this->cargarClientesDocumentos($facturas);
        }else{
            $this->cargarClientesDocumentos($facturas);
            $conn = Doctrine_Manager:: connection();
            foreach ($facturas as &$value){
                if ($value['iddeposito']) {
                    $deposito = $this->estructuraHelper->obtenerEstructurasNoFormales(
                        false, $this->idestructura, array(), false, false, array($value['iddeposito']), -1
                    );
                    $estructuraOp = $deposito[0]['DatEstructuraop'];
                    $depositoCodigo = $estructuraOp[0]['codigo'] . ' ' . $estructuraOp[0]['text'];
                    $value['deposito'] = $depositoCodigo;
                }
                $importe = $this->getImporteTotalDocumento($value['iddocumento']);
                if ($this->objIddocVenta->iddoc && ($value['iddoc'] == $this->objIddocVenta->iddoc || $value['iddoc'] == $this->objIddocDev->iddoc)) {
                  $value['importetotal'] = $importe['importecontable'] + $importe['importealternativo'];
                  $sqlMoneda = "Select mm.idmoneda from mod_logistica.dat_movmoneda mm inner join mod_logistica.dat_movimiento dm 
                  on dm.idmovimiento = mm.idmovimiento
                  where dm.iddocumento = {$value['iddocumento']} limit 1";
                  $arrayMoneda = $conn->execute($sqlMoneda)
                      ->fetchAll(PDO::FETCH_ASSOC);
                    if (!count($arrayMoneda)) {
                        $sqlMoneda = "select mm.idmoneda from mod_logpuntoventa.dat_ventaservicio mm 
                        where mm.idventas = {$value['iddocumento']} limit 1";
                        $arrayMoneda = $this->doctrineHelper->getConnection()->fetchAll($sqlMoneda);
                    }
                  $tasa = $this->configuracionHelper->getTasaByMonedas(
                        $this->_dualidadMonedas->idmoneda, $arrayMoneda[0]['idmoneda'], $this->_tipotasa
                    );

                  $auxVenta = Doctrine::getTable('DatVenta')->find($value['iddocumento']);
                  if($auxVenta->nrofactura)
                    $value['nrodoc'] = $auxVenta->nrofactura;

                  $recdesc = 0;
                  if ($auxVenta->calculoconcepto > 0) {
                      $recdesc = $auxVenta->calculoconcepto;
                      if ($auxVenta->conceptoventa == '-') {
                          $recdesc *= -1;
                      }
                  }
                  $value['importetotal'] += $recdesc;
                  if (count($tasa)) {
                      $value['importetotal'] *= $tasa[0]['factordeconversion'];
                  }

                } else {
                  if($params['comprobante']){
                      $recdesc = 0;
                      if ($value['calculoconcepto'] > 0) {
                          $recdesc = $value['calculoconcepto'];
                          if ($value['conceptoventa'] == '-') {
                              $recdesc *= -1;
                          }
                      }
                      $value['importetotal'] = ($importe['importecontable']+$recdesc)*(($value['factorconvercion']) ? $value['factorconvercion'] : 1);
                      if ($importe['importeconceptocup']) {
                          $value['importetotal'] += $importe['importeconceptocup'];
                      }
                  } else {
                      $value['importetotal'] = $importe['importecontable'];
                  }
                  $value['importetotalalt'] = $importe['importealternativo'];
                }
            }
        }
        $usuario = $this->cargaInicial();
        
        return array('datos' => $facturas, 'total' => $total, 'usuarios' => $usuario['usuarios']);
    }

    private function getCentroDeCostoById($idCentroDeCosto)
    {
        if ($idCentroDeCosto) {
            $centrocosto = $this->contabilidadHelper->obtenerCentrosCostoFiltro(
                $this->idestructuracomun, 0, 10000,
                null, [$idCentroDeCosto]
            );
            return $centrocosto[0];
        }
        return null;
    }

    private function datosFacturaAux($idfactura) {
        $conn = Doctrine_Manager:: connection();
        $sql = "select df.idcondicionpago, nt.nombre, array_agg(concat(cf.idcuentacliente,'-',cbc.numerocuenta)) as cuentas 
                from mod_logfacturacion.dat_docfactura df 
                left join mod_datosmaestros.nom_terminosdepago nt on nt.idterminodepago = df.idcondicionpago
                left join mod_logfacturacion.dat_cuentafacturacliente cf on cf.idfactura = df.idfactura
                left join mod_datosmaestros.dat_cuentabanccliente cbc on cbc.idcuentabancliente = cf.idcuentacliente
                where df.idfactura = {$idfactura}
                group by df.idcondicionpago, nt.nombre";
        return $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
    }

    private function getStringDocOrigen($array)
    {
        $string = "";
        foreach ($array as $value) {
            if ($string == "") {
                $string .= $value['nrodoc'];
            } else {
                $string .= ", " . $value['nrodoc'];
            }
        }
        return $string;
    }

    private function getTipoDocOrigen($array)
    {
        $datos = $this->configuracionHelper->getTipoDocumentoById(
                $array[0]['iddoc']
        );
        $result = array();
        /* if ($datos->iddoc == $this->objIddocFac->iddoc) {
          $result['denominacion'] = 1;
          $result['tipoDoc'] = 9;
          return $result;
          } */

        $result['denominacion'] = $datos->denominacion;
        $result['tipoDoc'] = ($datos->codigo == 103)//cambiar sigla por otra cosa ke identifique
                ? 5 : (($datos->codigo == 194) ? 7 : (($datos->codigo == 'ot') ? 8 : (($datos->codigo == 'MMAFT')
                ?6:4)));
        return $result;
    }

    public function getDocOrigen($iddocumento = null, $params = null)
    {
        $query = new Doctrine_Query();
        $query->select(
            'DISTINCT d.nrodoc as nrodoc, ddp.iddocumento, ddp.idpadre,'.
            "COALESCE((CASE WHEN df.idseriedocentidad IS NULL OR df.idseriedocentidad = -1 then
                 ''||df.nrofactura ELSE nsd.denominacion||'-'||df.nrofactura END), ''||d.nrodoc) as nrodoc"
        )
                ->from('DatDocumentoPadre ddp')
                ->innerJoin('ddp.DatDocumento d')
                ->leftJoin('d.DatDocfactura df')
                ->leftJoin("df.DatSerieDocumentoEntidad dse")
                ->leftJoin("dse.NomSerieDocumento nsd");
        $query->orderBy('d.nrodoc');
        if ($params) {
          if ($params['limit']) {
              $query->offset($params['start'])->limit($params['limit']);
          } 
          if ($params['query']) {
             $query->addWhere('d.nrodoc = ? or df.nrofactura = ?', array($params['query'], $params['query']));       
          }
        }
        if ($iddocumento) {
            $query->addSelect(
                    'd.iddoc as iddoc, d.fechacontable as fechaemision'
            );
            $query->addWhere('ddp.iddocumento = ?', array($iddocumento));
            return $query->fetchArray();
        } else {
            $idfacturas = $this->docfatura->getIdsFacturas($params);
            if (count($idfacturas) == 0) {
                return;
            }
            $query->addWhere(
                    "ddp.iddocumento in (" . implode(',', $idfacturas) . ")"
            );
        }
        $datos = $query->fetchArray();
        $result = array();
        foreach ($datos as $dat) {
            $pos = $this->estaNumeroInArray($dat['nrodoc'], $result);
            if ($pos == -1) {
                $result[] = array('nrodoc' => $dat['nrodoc'], 'idpadre' => $dat['idpadre']);
            } else {
                $result[$pos]['idpadre'] .= ',' . $dat['idpadre'];
            }
        }
        return $result;
    }

    private function estaNumeroInArray($numero, $array)
    {
        foreach ($array as $i => $value) {
            if ($value['nrodoc'] == $numero) {
                return $i;
            }
        }
        return -1;
    }

    private function estaServicioInArray($array, $servicio)
    {
        foreach ($array as $i => $value) {
            if ($servicio['idactividad']) {
                if ($value['idactividad'] == $servicio['idactividad']) {
                    return $i;
                }
            } else {
                if ($servicio['idindicador']) {
                    if ($value['idindicador'] == $servicio['idindicador']) {
                        return $i;
                    }
                }
            }
        }
        return -1;
    }

    public function getTipoDocumento($doc)
    {
        return $this->_tipoDocumento[$doc['iddoc']];
        /*if ($this->objIddocFac->iddoc && ($this->objIddocFac->iddoc == $doc['iddoc'])
        ) {
            return $this->objIddocFac->sigla;
        } else {
            if ($this->objIddocNota->iddoc && ($this->objIddocNota->iddoc == $doc['iddoc'])) {
                return $this->objIddocNota->sigla;
            } else {
                if ($this->objIddocOferta->iddoc && ($this->objIddocOferta->iddoc == $doc['iddoc'])
                ) {
                    return $this->objIddocOferta->sigla;
                }
            }
        }*/
    }

    /**
     * Funcion que permite obtener los productos de la entidad
     *
     * @return array Retorna un arreglo
     * con los productos y la cantidad total de productos
     */
    public function obtenerProductos($params)
    {
        if ($params['accion'] == 'add') {
            return $this->getProductosRecord($params);
        } else {
            return $this->getProductosDb($params);
        }
    }

    public function getProductosRecord($parametros)
    {
        if ($parametros['primeravez'] && $parametros['primeravez'] == 1) {
            $parametros['docorigen'] = json_decode($parametros['docorigen']);
            if ($parametros['tipoDoc'] == 4) {
                $productos = $this->getProductosDistribucion($parametros);
            } else {
                if ($parametros['tipoDoc'] == 5) {
                    $productos = $this->productoModel->getProductos(
                            $parametros['docorigen'], $parametros['idsubsistema']
                    );
                } else {
                    if ($parametros['tipoDoc'] == 7) {
                        $productos = $this->getProductosPedido($parametros);
                    } else {
                        if ($parametros['tipoDoc'] == 8) {
                            $productos = $this->getProductosOrden($parametros);
                        }
                    }
                }
            }
        } else {
            $productos = json_decode($parametros['datos']);
            //$datosMoneda = $this->getMonedaContableAlternativa();
            $arrayIndix = array();
            /*foreach ($datosMoneda as $mo) {
                $arrayIndix[$mo['idmoneda']] = array('precio' => strtolower('preciocontable' . $mo['codigoiso']),
                    'importe' => strtolower('importe' . $mo['codigoiso']));
            }*/
            $arrayIndix[$this->_dualidadMonedas->idmoneda] = array('precio' => strtolower('preciocontable' . $this->_dualidadMonedas->codigoiso),
                'importe' => strtolower('importe' . $this->_dualidadMonedas->codigoiso));
            if($this->_dualidadMonedas->idmonedaalternativa){
                $arrayIndix[$this->_dualidadMonedas->idmonedaalternativa] = array('precio' => strtolower('preciocontable' . $this->_dualidadMonedas->codigoisoalt),
                    'importe' => strtolower('importe' . $this->_dualidadMonedas->codigoisoalt));
            }
            if ($parametros['criterio']) {
                $arrayFind = array();
            }
            foreach ($productos as &$value) {
                $value->text = ($value->text) ? $value->text : $value->codigo . ' - ' . $value->denominacion;
                $value->cantidad = ($value->cantidad) ? $value->cantidad : 0;
                $value->denominacionPrecio = $this->getTipoPrecios(
                        null, $value->idtipoprecio
                );
                $value->idmonedaanterior = ($parametros['idmonedaanterior']) ? $parametros['idmonedaanterior'] : $parametros['idmoneda'];
                if ($parametros['tipoDoc'] == 4) {
                    $prec = $this->getPrecio($value);
                    if (is_array($prec)) {
                        foreach ($prec['datos'] as $index => $v) {
                            $idmoneda = (isset($v['idmoneda'])) ? $v['idmoneda'] : $index;
                            $precio = $arrayIndix[$idmoneda]['precio'];
                            $importe = $arrayIndix[$idmoneda]['importe'];
                            if ($parametros['idmoneda']) {
                                if ($this->getDualidad() == 1) {
                                    if ($idmoneda == $this->_dualidadMonedas->idmonedaalternativa) {
                                        $calculoPrecio = $this->configuracionHelper->convertirImporte(
                                                $idmoneda, $parametros['idmoneda'], $parametros['tipotasa'], $v['precioventa'], 1
                                        );
                                        $value->$precio = ($calculoPrecio) ? $calculoPrecio : 0;
                                        $value->$importe = $value->$precio * $value->cantidad;
                                    } else {
                                        $value->$precio = ($v['precioventa']) ? $v['precioventa'] : 0;
                                        $value->$importe = $v['precioventa'] * $value->cantidad;
                                    }
                                } else {
                                    $value->$precio = ($v['precioventa']) ? $v['precioventa'] : 0;
                                    $value->$importe = $v['precioventa'] * $value->cantidad;
                                }
                            } else {
                                $value->$precio = ($v['precioventa']) ? $v['precioventa'] : 0;
                                $value->$importe = $v['precioventa'] * $value->cantidad;
                            }
                        }
                    } else {
                        
                    }
                } else {
                    if ($parametros['tipoDoc'] == 5) {
                        if ($parametros['idmoneda']) {
                            if ($this->getDualidad() == 1) {
                                $indexAlt = $arrayIndix[$this->_dualidadMonedas->idmonedaalternativa]['precio'];
                                if (!isset($value->precioalternativo)) {
                                    $value->precioalternativo = $value->$indexAlt;
                                }
                                $indexImpAlt = $arrayIndix[$this->_dualidadMonedas->idmonedaalternativa]['importe'];
                                $calculoPrecio = $this->configuracionHelper->convertirImporte(
                                    $this->_dualidadMonedas->idmonedaalternativa, $parametros['idmoneda'], $parametros['tipotasa'], $value->precioalternativo, 1
                                );
                                $value->$indexAlt = number_format(
                                        $calculoPrecio, 6, '.', ''
                                );
                                $value->$indexImpAlt = number_format(
                                        ($calculoPrecio * $value->cantidad), 2, '.', ''
                                );
                            } else {
                                $indexCont = $arrayIndix[$this->_dualidadMonedas->idmoneda]['precio'];
                                $indexImpCont = $arrayIndix[$this->_dualidadMonedas->idmoneda]['importe'];
                                if (!isset($value->preciocont)) {
                                    $value->preciocont = $value->$indexCont;
                                }
                                $calculoPrecio = $this->configuracionHelper->convertirImporte(
                                    $this->_dualidadMonedas->idmoneda, $parametros['idmoneda'], $parametros['tipotasa'], $value->preciocont, 1
                                );
                                $value->$indexCont = number_format(
                                        $calculoPrecio, 6, '.', ''
                                );
                                $value->$indexImpCont = number_format(
                                        ($calculoPrecio * $value->cantidad), 2, '.', ''
                                );
                            }
                        }
                    }
                }
                $value->um = ($value->um) ? $value->um : $value->umedida;
                if ($parametros['criterio']) {
                    if ((substr_count(strtoupper($value->denominacion), strtoupper($parametros['criterio'])) > 0) ||
                            (substr_count(
                                    strtoupper($value->codigo), strtoupper($parametros['criterio'])
                            ) > 0)
                    ) {
                        $arrayFind[] = $value;
                    }
                }
            }
        }
        $result['datosAux'] = $productos;
        $result['datos'] = (!isset($arrayFind)) ? $productos : $arrayFind;
        $result['total'] = count($result['datos']);
        return $result;
    }

    public function getProductosOrden($parametros)
    {
        $ordenService = new OrdenTrabajoTalleresService();
        $datas = $ordenService->getOrdenesTrabajoCerradasEspecificas(
                $parametros['docorigen']
        );
        foreach ($datas['productos'] as &$prod) {
            $indicador = $this->maestroP->cargarGridNomenclador(
                    array('idindicador' => $prod['idindicador'])
            );
            $prod = array_merge($prod, $indicador['datos'][0]);
            //$prod['idtipoprecio'] = $prod['idtipoprecio'];
            /*$prod['denominacionPrecio'] = $this->getTipoPrecios(
                    null, $prod['idtipoprecio']
            );*/
            $prod['docorigen'] = $parametros['docorigen'];
            /*if ($prod['idtipoprecio'] != -1) {
                //hay que agregarle los datos de la matriz
                $precio = $prod['importecup']/$prod['cantidad']; //$this->getPrecio((object) $prod);
            } else {
                $precio = $prod['importecup'];
            }*/
            //$prod['cantidad'] = $prod['cantidad'] - $prod['enproceso'] - $prod['facturado'];
            /*$precio = $prod['importecontable']/$prod['cantidad'];
            $precioalt = $prod['alternativo']/$prod['cantidad'];*/
            $prod['um'] = $prod['umedida'];
            /*$prod['preciocontable'] = ($precio) ? $precio : 0;
            $prod['precioalt'] = ($precioalt) ? $precioalt : 0;
            $prod['importe'] = round(
                    $prod['preciocontable'] * $prod['cantidad'], 2
            );*/
        }
        return $datas['productos'];
    }

    public function getProductosPedido($parametros)
    {
        $pedidoService = new PedidoService();
        $productos = $pedidoService->cargarProductosXPedido(
                $parametros['docorigen']
        );
        $prodLog = new DatProductoLogistica();
        $result = array();
        foreach ($productos['datos'] as &$prod) {
            $producto = $prodLog->existeProducto(
                    $parametros['iddeposito'], $prod['idindicador']
            );
            if (count($producto) > 0) {
                $filtro = array('idproducto' => $producto[0]['idproducto']);
                $datosProd = $this->producto->cargarProductos($filtro);
                if (count($datosProd['datos']) > 0) {
                    $prod = array_merge($prod, $datosProd['datos'][0]);
                    $prod['idtipoprecio'] = $parametros['idtipoprecio'];
                    $prec = $this->getPrecio((object) $prod);
                    if (is_array($prec)) {
                        $precio = $prec['precioventa'];
                    } else {
                        $precio = $prec;
                    }
                    $prod['preciocontable'] = ($precio) ? $precio : 0;
                    $prod['um'] = $prod['umedida'];
                    $prod['cantidad'] -= $prod['distribuido'];
                    $prod['importe'] = round(
                            $prod['preciocontable'] * $prod['cantidad'], 2
                    );
                    $prod['denominacionPrecio'] = $this->getTipoPrecios(
                            null, $parametros['idtipoprecio']
                    );
                    $result[] = $prod;
                }
            }
        }
        return $result;
    }

    public function getProductosDistribucion($parametros)
    {
        $distribucionService = new DistribucionService();
        //$datosMoneda = $this->getMonedaContableAlternativa();
        $arrayIndix = array();
        $arrayIndix[$this->_dualidadMonedas->idmoneda] = array('precio' => strtolower('preciocontable' . $this->_dualidadMonedas->codigoiso),
            'importe' => strtolower('importe' . $this->_dualidadMonedas->codigoiso));
        if($this->_dualidadMonedas->idmonedaalternativa){
            $arrayIndix[$this->_dualidadMonedas->idmonedaalternativa] = array('precio' => strtolower('preciocontable' . $this->_dualidadMonedas->codigoisoalt),
                'importe' => strtolower('importe' . $this->_dualidadMonedas->codigoisoalt));
        }
        $productos = $distribucionService->devolverProductosDistribucionFact(
                        array('iddocumento' => $parametros['docorigen'], 'iddeposito' => $parametros['iddeposito'],
                            'idcliente' => $parametros['idcliente'], 'reserva' => $parametros['reserva'])
                )['datos'];
        $retorno = array();
       // print_r($productos);die;//kknn
       $parametros['tipo'] = 1;
       $tipoPrecio = $this->getTipoPrecios($parametros);
        foreach ($productos as &$value) {
            $value['endocumento'] = $distribucionService->getEntregadoProceso(
                    array('idcliente' => $parametros['idcliente'], 'iddocumento' => $parametros['docorigen'],
                        'idproducto' => $value['idproducto'])
            );
            $value['idtipoprecio'] = $parametros['idtipoprecio'] == -2 ?  $parametros['idtipoprecio'] : $tipoPrecio[0]['idtipoprecio'];
            $value['autorizado'] = $distribucionService->getCantidadProducto(
                    $value['idproducto'], $parametros['docorigen'], $parametros['idcliente']
            );
            $value['pendiente'] = $value['autorizado'] - $value['endocumento'];
            $value['cantidad'] = $value['autorizado'] - $value['endocumento'];
            if ($value['cantidad'] > 0) {
                /*$value['denominacionPrecio'] = $this->getTipoPrecios(
                        $parametros, $value['idtipoprecio']
                );*/
                //$value['idindicador'] = $value['idprod'];
                /*$value['docorigen'] = $parametros['docorigen'];
                $value['idcliente'] = $parametros['idcliente'];
                $prec = $this->getPrecio((object) $value);
                if (is_array($prec)) {
                    //$precio = $prec['precioventa'];
                    foreach ($prec['datos'] as $v) {
                        $value[$arrayIndix[$v['idmoneda']]['precio']] = $v['precioventa'];
                        $value[$arrayIndix[$v['idmoneda']]['importe']] = $v['precioventa'] * $value['cantidad'];
                    }
                } else {
                    $precio = $prec;
                }*/
                //$value['um'] = $value['umedida'];
                /* $value['preciocontable'] = ($precio) ? $precio : 0;
                  $value['importe'] = round(
                  $value['preciocontable'] * $value['cantidad'], 2
                  ); */
                $retorno[] = $value;
            }
        }
        return $retorno;
    }

    public function getMediosActivo($parametros){
        $service = new DocumentoActivoService();
        return $service->getMediosDocumentos($parametros['docorigen']);
    }

    public function getProductosDb($parametros)
    {
        if ($parametros['paramsProd']) {
            $parametros['paramsProd'] = (array) $parametros['paramsProd'];
            $parametros['start'] = $parametros['paramsProd']['start'];
            $parametros['limit'] = $parametros['paramsProd']['limit'];
        }
        if ($parametros['idsubsistema'] == LogisticaGlobal::SUBSISTEMA_INV && $parametros['tipoDoc'] != 1) {
            new DatProdFactura();
            $query = $this->producto->devolverMovimientos(
                    $parametros, true
            );
            $query->innerJoin('mov.DatProdFactura dpf');
            $query->innerJoin('mov.DatMovmoneda dmm');
            $query->addSelect(
                    "dpf.idtipoprecio as idtipoprecio, dpf.factorconvercion,dpf.cantidadfactura as cantidadfactura, mov.iddocumento,mov.diferencia,
                mov.cantidad as cantidad, dpf.preciobase as preciobase, dmm.idmoneda,
                dmm.precio, dmm.importe, dpf.importe as importenc, dpf.preciofactura as preciofactura"
            );
            $query->addSelect("(SELECT COUNT(ncil.idindicador) FROM NomIndicadorcilindro ncil WHERE ncil.idindicador = i.idindicador) as cilindro");
            $query->addSelect('(SELECT (count(up.idubicacion) = 1) FROM DatUbicacionproducto up ' .
                'WHERE up.idproducto = mov.idproducto AND up.cantidad > 0) AS ubicacionunica, (SELECT mu.idmovubicacion ' .
                'FROM DatMovubicacion mu WHERE mu.idmovimiento = mov.idmovimiento AND (SELECT count(mu2.idmovubicacion) ' .
                'FROM DatMovubicacion mu2 WHERE mu2.idmovimiento = mov.idmovimiento) = 1) AS idmovubicacion, ' .
                '(SELECT up2.idubicacion FROM DatUbicacionproducto up2 WHERE up2.idproducto = mov.idproducto ' .
                'AND (SELECT count(up3.idubicacion) FROM DatUbicacionproducto up3 ' .
                'WHERE up3.idproducto = mov.idproducto AND up3.cantidad > 0) = 1 limit 1) AS idestructuraubicacion');
            $query->addSelect(
                "(SELECT umm.abreviaturaunidadmedida FROM NomUnidadmedida umm WHERE umm.idunidadmedida = COALESCE((SELECT dmp.idumedida FROM DatMatrizprecio dmp WHERE dmp.idtipoprecio = dpf.idtipoprecio AND 
                dmp.idindicador = p.idindicador limit 1), (SELECT ni.idumedida FROM NomIndicador ni WHERE ni.idindicador = p.idindicador))) as umedidamatriz"
            );
            $total = $query->count();
            if ($parametros['limit']) {
                $query->limit($parametros['limit'])
                        ->offset(($parametros['start']) ? $parametros['start'] : 0);
            }
            if ($parametros['dql']) {
                return $query;
            }
            $datos = $query->fetchArray();

            $distribucionService = new DistribucionService();
            $documento = Doctrine::getTable('DatDocumento')->find($parametros['iddocumento']);
            foreach ($datos as &$prod) {
                $parmprecio = array('idsubsistema' => LogisticaGlobal::SUBSISTEMA_INV);
                if($prod['idtipoprecio'] == -1){
                    $parmprecio['promedio'] = 1;
                }
                $prod['denominacionPrecio'] = $this->getTipoPrecios(
                    $parmprecio, $prod['idtipoprecio']
                );
                $docsOrigen = $this->getDocOrigen($parametros['iddocumento']);
                $arrayDocsOrigen = array();
                foreach ($docsOrigen as $doc) {
                    $arrayDocsOrigen[] = $doc['idpadre'];
                }
                if ($prod['cantidadfactura']) {
                    $prod['autorizado'] = $prod['cantidadfactura'];
                } else {
                    $ubicado = $distribucionService->devolverCantidadPendiente(
                        array('idproducto' => $prod['idproducto'], 'idcliente' => $parametros['idcliente'],
                            'iddocumento' => $arrayDocsOrigen)
                    );
                    $prod['endocumento'] = $distribucionService->getEntregadoProceso(
                        array('idcliente' => $parametros['idcliente'], 'iddocumento' => $arrayDocsOrigen,
                            'idproducto' => $prod['idproducto'])
                    );
                    foreach ($ubicado as $ub) {
                        $prod['autorizado'] += $ub['ordenado'];
                    }
                    $pend = $prod['autorizado'] - $prod['endocumento'];
                    $prod['pendiente'] = ($pend > 0) ? $pend : 0;
                }

                $prod['diferenciaauxiliar'] = $this->getDiferenciaProd(
                    array(
                        'docorigen'=>$arrayDocsOrigen,
                        'idproducto'=> $prod['idproducto'],
                        'idcliente' => $parametros['idcliente'],
                        'idmovimiento' => $prod['idmovimiento']
                    )
                );
                foreach ($prod['DatMovmoneda'] as $moneda) {
                    $indice = ($moneda['idmoneda'] == $this->_dualidadMonedas->idmoneda) ? 'pcontable' :
                    'palternativo';
                    $indiceImporte = ($moneda['idmoneda'] == $this->_dualidadMonedas->idmoneda) ? 'impcontable' :
                        'impalternativo';
                    $prod[$indice] = $moneda['precio'];
                    $prod[$indiceImporte] = ($prod['importenc']) ? $prod['importenc'] : round($moneda['precio']*$prod['cantidad'],2);
                    //$this->formarPrecio($indice, $indiceImporte, $moneda, $prod, $parametros);
                }
                if($prod['pcontable'] != 0 && $prod['cantidadfactura']) {
                    $prod['credito'] = ($prod['preciofactura']-$prod['pcontable']);
                    if (!$prod['importenc']) {
                        if ($prod['cantidad'] > 0) {
                            $prod['impcontable'] = ($prod['credito'] > 0 ? $prod['credito'] : $prod['preciofactura'])*$prod['cantidad'];
                        } else {
                            $prod['impcontable'] = $prod['credito']*$prod['cantidadfactura'];
                        }
                    } else {
                        $prod['credito'] = $prod['importenc'];
                    }
                }

                /*$nacionalidad = $this->configuracionHelper->obtenerPaisXID($prod['idpais']);
                $prod['nacionalidad'] = $nacionalidad['siglas'];*/
            }
        } else {
            $datos = $this->productoModel->getProductos(
                    $parametros['iddocumento'], $parametros['idsubsistema'],
                    $parametros['criterio'], $parametros['idmoneda'],
                    (($parametros['tipoDoc'] == 1) ? true : false), $parametros['tipotasa'], $parametros['dql']
            );
            if ($parametros['dql']) {
                return $datos;
            }
        }
        if ($parametros['externo']) {
            $result['datos'] = $datos;
            $result['total'] = $total;
        } else {
            $result['datosAux'] = $datos;
            if ($parametros['limit']) {
                $result['datos'] = $datos;
            } else {
                $result['datos'] = $datos;
            }
            $result['total'] = $total;
        }
        //$this->actualizarImporte($parametros['iddocumento']);
        $result['importes'] = $this->getImporteTotalDocumento($parametros['iddocumento']);
        return $result;
    }

    public function getDiferenciaProd($parametros)
    {
        if(count($parametros['docorigen']) > 0){
            $query = new Doctrine_Query();
            $dqlpart = "";
            if($parametros['idmovimiento']){
                $dqlpart = " and dm.idmovimiento <> {$parametros['idmovimiento']}";
            }
            $resp = $query->select('COALESCE(sum(dm.diferencia),0) as diferencia')
                ->from('DatMovimientos dm')
                ->innerJoin('dm.DatDocumento dd')
                ->innerJoin('dd.DatDocfactura df')
                ->where(
                    "dd.estado in (1,2,4) and dm.iddocumento in (SELECT ddp.iddocumento FROM DatDocumentoPadre ddp
                 WHERE ddp.idpadre in (".implode(',', $parametros['docorigen']).")) and dm.idproducto = ?
                 and df.idcliente = ? {$dqlpart}", array($parametros['idproducto'], $parametros['idcliente'])
                )
                ->fetchArray();
            return $resp[0]['diferencia'];
        } else {
            return 0;
        }
    }

    public function formarPrecio($indice, $indiceImporte, $moneda, &$prod, $parametros)
    {
        $factura = Doctrine::getTable('DatDocfactura')
                ->find($parametros['iddocumento']);
        if ($parametros['idmoneda']) {
            if ($this->_dualidadMonedas->idmonedaalternativa) {
                if ($moneda['idmoneda'] == $this->_dualidadMonedas->idmonedaalternativa) {
                    if ($factura->idmoneda == $parametros['idmoneda']) {
                        $calculoPrecio = $this->convertirPrecio(
                                $factura->tasacambio, $factura->factorconvercion, $moneda['precio']
                        );
                    } else {
                        $calculoPrecio = $this->configuracionHelper->convertirImporte(
                                $moneda['idmoneda'], $parametros['idmoneda'], $parametros['tipotasa'], $moneda['precio'], 1
                        );
                    }
                    if (is_array($calculoPrecio)) {
                        throw new ZendExt_Exception('LOG_LB_FAC_001');
                    }
                    $prod[$indice] = number_format(
                            $calculoPrecio, 6, '.', ''
                    );
                    $prod[$indiceImporte] = round(
                            $calculoPrecio * $prod['cantidad'], 2
                    );
                } else {
                    $prod[$indice] = number_format(
                            $moneda['precio'], 6, '.', ''
                    );
                    $prod[$indiceImporte] = round(
                            $moneda['precio'] * $prod['cantidad'], 2
                    );
                }
            } else {
                if ($factura->idmoneda == $parametros['idmoneda']) {
                    $calculoPrecio = $this->convertirPrecio(
                            $factura->tasacambio, $factura->factorconvercion, $moneda['precio']
                    );
                } else {
                    if ($factura->idtipotasa) {
                        $parametros['tipotasa'] = $factura->idtipotasa;
                    }
                    $calculoPrecio = $this->configuracionHelper->convertirImporte(
                            $moneda['idmoneda'], $parametros['idmoneda'], $parametros['tipotasa'], $moneda['precio'], 1
                    );
                }
                if (is_array($calculoPrecio)) {
                    throw new ZendExt_Exception('LOG_LB_FAC_001');
                }
                $prod[$indice] = number_format(
                        $calculoPrecio, 6, '.', ''
                );
                $prod[$indiceImporte] = round(
                        $calculoPrecio * $prod['cantidad'], 2
                );
            }
        } else {
            $prod[$indice] = number_format(
                    $moneda['precio'], 6, '.', ''
            );
            $prod[$indiceImporte] = round(
                    $moneda['precio'] * $prod['cantidad'], 2
            );
        }
    }

    public function obtenerServicios($params)
    {
        if ($params['accion'] == 'add') {
            return $this->getServiciosRecord($params);
        } else {
            return $this->getServiciosDb($params);
        }
    }

    public function obtenerProductosServicios($params)
    {
        $datos['datos'] = json_decode($params['datos']);
        foreach ($datos['datos'] as &$mat) {
            settype($mat, 'array');
            $mat['precio'] = number_format((($calcPrec) ? $calcPrec : 0), 6, '.', '');
            $mat['importetotal'] = round($mat['precio'] * $mat['cantidad'], 2);
        }
        if($params['limit']){
            $start = $params['start'];
            $limit = $params['limit'];
        }else{
            $start = 0;
            $limit = 30;
        }
        $datos['datosAux'] = $datos['datos'];
        $datos['total'] = count($datos['datosAux']);
        $datos['datos'] = array_splice($datos['datos'], $start, $limit);
        return $datos;
        /* if ($params['accion'] == 'add') {
          return $this->getProductosServiciosRecord($params);
          } else {
          return $this->getProductosServiciosDb($params);
          } */
    }

    public function getServiciosRecord($parametros)
    {
        if ($parametros['primeravez'] && $parametros['primeravez'] == 1) {
            $parametros['iddocumento'] = json_decode($parametros['docorigen']);
            if ($parametros['tipoDoc'] == 5) {
                $servicios = $this->servicioModel->getServicios($parametros['iddocumento'], $parametros);
                $serviciosResult = array();
                foreach ($servicios as $index => &$value) {
                    unset($value['idelementofactura']);
                    unset($value['idfactura']);
                    $pos = $this->estaServicioInArray($serviciosResult, $value);
                    if ($pos != -1) {
                        $serviciosResult[$pos]['cantidad'] += $value['cantidad'];
                        foreach ($value['materiales'] as $j => $material) {
                            unset($material['idelementofactura']);
                            unset($material['idprodservicio']);
                            $posM = $this->estaServicioInArray($serviciosResult[$pos]['materiales'], $material);
                            if ($posM != -1) {
                                $serviciosResult[$pos]['materiales'][$posM]['cantidad'] += $material['cantidad'];
                            } else {
                                $serviciosResult[$pos]['materiales'][] = $material;
                            }
                        }
                    } else {
                        foreach ($value['materiales'] as $index => &$prod) {
                            unset($prod['idelementofactura']);
                            unset($prod['idprodservicio']);
                        }
                        $serviciosResult[] = $value;
                    }
                }
                $servicios = $serviciosResult;
            } else {
                if ($parametros['tipoDoc'] == 7) {
                    $pedidoService = new PedidoService();
                    $servicios = $pedidoService->cargarProductosXPedido(
                                    $parametros['iddocumento'], 1
                            )['datos'];
                    foreach ($servicios as $index => &$value) {
                        $datos = $this->maestroP->cargarGridNomenclador(
                                array('idindicador' => $value['idindicador'])
                        );
                        $value = $datos['datos'][0];
                        $value['cantidad'] = 1;
                        $value['idtipoprecio'] = $parametros['idtipoprecio'];
                        $value['preciotarifa'] = $value['precio'];
                        $value['importe'] = round(
                                $value['preciotarifa'] * $value['cantidad'], 2
                        );
                        $value['denominacionPrecio'] = $this->getTipoPrecios(
                                null, $parametros['idtipoprecio']
                        );
                    }
                } else {
                    if ($parametros['tipoDoc'] == 8) {
                        $ordenService = new OrdenTrabajoTalleresService();
                        $datas = $ordenService->getOrdenesTrabajoCerradasEspecificas(
                                $parametros['iddocumento']
                        );
                        $servicios = $datas['actividades'];
                        $arrayMonedas = $this->formarArrayMonedas();
                        foreach ($servicios as &$serv) {
                            foreach ($arrayMonedas as $mon) {
                                $indice = strtolower('preciotarifa' . $mon['codigoiso']);
                                $indiceImporte = strtolower('importe' . $mon['codigoiso']);
                                $serv[$indice] = $serv['tiemporeal'] * $serv['tarifahora'];
                                $serv[$indiceImporte] = round(
                                        $serv[$indice] * $serv['cantidad'], 2
                                );
                            }
                            $serv['productos'] = count($serv['materiales']);
                            foreach ($serv['materiales'] as &$prod) {
                                $datos = $this->maestroP->cargarGridNomenclador(
                                                array('idindicador' => $prod['idindicador'])
                                        )['datos'];
                                $prod['denominacion'] = $datos[0]['denominacion'];
                                $prod['codigo'] = $datos[0]['codigo'];
                                $prod['importetotal'] = $prod['importecup'];
                                //$prod = array_merge($prod, $indicador['datos'][0]);
                            }
                        }
                    }
                }
            }
        } else {
            $servicios = json_decode($parametros['datos']);
            if ($parametros['criterio']) {
                $arrayFind = array();
            }
            foreach ($servicios as $index => &$value) {
                if ($value->idactividad) {
                    $value->denominacionPrecio = '-';
                    $precio = 0; //servicio de planificacion que no esta todavia
                } else {
                    $value->idmonedaanterior = ($parametros['idmonedaanterior']) ? $parametros['idmonedaanterior'] : $parametros['idmoneda'];
                    $value->denominacionPrecio = $this->getTipoPrecios(
                            null, $value->idtipoprecio
                    );
                    $prec = $this->getPrecio($value);
                    if (is_array($prec)) {
                        $precio = $prec['precioventa'];
                    } else {
                        $precio = $prec;
                    }
                }
                $value->preciotarifabase = $precio;
                $value->preciotarifa = number_format(
                        $this->configuracionHelper->calcularImporteDadoMonedas(
                                $parametros['idmoneda'], $value->preciotarifabase, $this->idestructura, false
                        ), 6, '.', ''
                );
                /* foreach($value->materiales as &$mat){
                  settype($mat, 'array');
                  $calcPrec = $this->configuracionHelper->calcularImporteDadoMonedas(
                  $parametros['idmoneda'], $mat['preciobase'], $this->idestructura, false
                  );
                  $mat['precio'] = number_format((($calcPrec)?$calcPrec:0),6);
                  $mat['importetotal'] = round($mat['precio'] * $mat['cantidad'],2);
                  } */
                $value->importe = round(
                        $value->preciotarifa * $value->cantidad, 2
                );
                if ($parametros['criterio']) {
                    if ((substr_count(strtoupper($value->denominacion), strtoupper($parametros['criterio'])) > 0) ||
                            (substr_count(
                                    strtoupper($value->codigo), strtoupper($parametros['criterio'])
                            ) > 0)
                    ) {
                        $arrayFind[] = $value;
                    }
                }
                //print_r($this->servicioModel->getProductosServicio(array('idservicio'=>$value->idindicador)));die;
            }
        }
        $result['datosAux'] = $servicios;
        $result['datos'] = (!isset($arrayFind)) ? $servicios : $arrayFind;
        if(count($result['datos']) == 0){
            $result['datos'] = array();
        }
        $result['total'] = count($result['datos']);
        return $result;
    }

    public function getServiciosOrdenes($parametros)
    {
        $ordenService = new OrdenTrabajoTalleresService();
        $datas = $ordenService->getOrdenesTrabajoCerradasEspecificas(
                $parametros['docorigen']
        );
        $servicios = $datas['actividades'];
        foreach ($servicios as &$serv) {
            $serv['preciotarifa'] = $serv['precio'];
			      $serv['tipo'] = 2;
            /*$serv['importe'] = round(
                    $serv['preciotarifa'] * $serv['cantidad'], 2
            );*/
			      $serv['importe'] = $serv['precio'];
			      $serv['cantidad'] = $serv['tiemporeal']-$serv['enproceso']-$serv['facturado'];
            /*$serv['productos'] = count($serv['materiales']);
            foreach ($serv['materiales'] as &$prod) {
                $prod['denominacion'] = 'denominacion del material';
                $prod['importetotal'] = $prod['importecup'];
                //$prod = array_merge($prod, $indicador['datos'][0]);
            }*/
        }
        return $servicios;
    }

    public function getServiciosDb($parametros)
    {
        $datas = $this->servicioModel->getServicios($parametros['iddocumento'], $parametros);
        if($parametros['dql']) {
          return $datas;
        }
        $result['datosAux'] = $datas;
        if (!$parametros['limit']) {
            $parametros['limit'] = 30;
            $parametros['start'] = 0;
        }
        $result['datos'] = array_splice(
                $datas, $parametros['start'], $parametros['limit']
        );
        $result['total'] = count($result['datosAux']);
        $result['importes'] = $this->getImporteTotalDocumento($parametros['iddocumento']);
        return $result;
    }

    /**
     * Funcion que permite anular el estado de una o varias
     * facturas seleccionadas en estado de preparado
     *
     * @param array $params Arreglo con el identificador
     *                      de cada factura seleccionada
     *
     * @return boolean Retorna true si fue un exito la accion
     */
    public function anularEstadoFactura($params, $estado)
    {
        $ubicacionServ = new UtilesubicacionService();
        foreach ($params as $i => $doc) {
            //if ($estado[$i] == 2) {
            $uc = Doctrine_Query::create()
                ->select('uc.idubicacioncomprometida, mu.idmovubicacion AS idmovubicacion, uc.idproducto')
                ->from('DatUbicacionComprometida uc')
                ->innerJoin('uc.DatMovimientos m')
                ->innerJoin('m.DatMovubicacion mu')
                ->where(
                    'm.iddocumento = ? AND uc.idubicacion = mu.idestructuraubicacion AND uc.iddocumento = m.iddocumento',
                    $doc
                )
                ->fetchArray();
            foreach ($uc as $value) {
                $ubicacion = $ubicacionServ->getUbicacionUnica($value['idproducto']);
                if ($ubicacion) {
                    $idubicacioncomprometida[] = $value['idubicacioncomprometida'];
                    $idmovubicacion[] = $value['idmovubicacion'];
                }
            }
            $ubicacionServ->eliminarUbicacionComprometida(null, null, $idubicacioncomprometida);
            if(count($idmovubicacion) > 0){
                Doctrine_Query::create()->delete('DatMovubicacion')->whereIn('idmovubicacion', $idmovubicacion)->execute();
            }
            parent::anularEstadoDocumento($doc);
            $estado = EstadoDocumentoModel::ESTADO_ELABORACION;

            /*} else {
                $this->trazaDocumento->guardarTraza('Estado anulado ', $doc, EstadoDocumentoModel::ESTADO_PROPUESTO_CANCELAR);
                $this->estadoModel->setEstadoDocumento($doc, EstadoDocumentoModel::ESTADO_PROPUESTO_CANCELAR);
                $estado = EstadoDocumentoModel::ESTADO_PROPUESTO_CANCELAR;
            }*/
        }
        return array('success' => true, 'estado' => $estado);
    }

    public function aprobarDocumento($iddocumento)
    {
        $numSerie = new NoSerieService();
        $numSerie->actualizarEstadoNumeroSerie($iddocumento);
        parent::aprobarDocumento($iddocumento);
        $doc = Doctrine::getTable('DatDocumento')->find($iddocumento);
        $nroAux = $doc->nrodoc;
        $sql = "select des.codigo from mod_estructuracomp.v_dametodasestructuras des 
                    where des.idestructura = {$doc->idestructuracomun} limit 1";
        $entidad = $this->doctrineHelper->getConnection()->execute($sql)->fetchAll(PDO::FETCH_COLUMN);
        $codigo = $entidad[0];
        $nroFinal = $doc->nrodoc.'.'.$codigo.'.'.$doc->anno;
        Doctrine_Query::create()
            ->update('DatDocfactura')
            ->set(
                'nroreal', "'" . $nroFinal . "'"
            )
            ->where("idfactura = ?", array($iddocumento))
            ->execute();
        return true;
    }

    public function anularFactura($documentos, $observacion)
    {
        $prodModel = new LogisticaProductoModel();
        $collDoc = new Doctrine_Collection('DatDocumento');
        $collNcontrol = new Doctrine_Collection("DatNumerocontrol");
        $serviceLote = new LoteService();
        $numSerie = new NoSerieService();
        $talleres = LogisticaGlobal::__init()
            ->estaAperturadoSubsistema(LogisticaGlobal::SUBSISTEMA_TALLERES);
        if ($talleres) {
            $ordenService = new OrdenTrabajoTalleresService();
        }
        foreach ($documentos as $doc) {
	  if (parent::verificarTiendaVirtual($doc[0])) {
            $docOrigen = $this->getDocOrigen($doc[0]);
            $updateExistencia = true;
            $updateDisponible = false;
            $arrayDocsOrigen = array();
            foreach ($docOrigen as $dat) {
                $arrayDocsOrigen[] = $dat['idpadre'];
                $documentoFactura = Doctrine::getTable('DatDocfactura')
                        ->find(
                        $dat['idpadre']
                );
                if ($documentoFactura) {
                    if ($documentoFactura->esnota == 2) {
                        $documentoFactura->esnota = 1;
                        $documentoFactura->save();
                    }
                }
            }
            if (count($this->iddoc) == 2) {
                if ($docOrigen[0]['iddoc'] == $this->iddoc[1]) {
                    $updateExistencia = false;
                    //$updateDisponible = false;
                }
            }
            $documento = Doctrine::getTable('DatDocumento')->find($doc[0]);
            $isEntrada = ($this->objIddocNotaCredito->iddoc && $documento->iddoc == $this->objIddocNotaCredito->iddoc) ? true : false;
            if ($updateExistencia) {
                $numSerie->actualizarEstadoNumeroSerie($doc[0], !$isEntrada);
            }
            $movimientos = $this->productoModel->getProductos($doc[0], $documento->DatDocfactura->idsubsistema);
            $datosCmpto = array();
            if ($documento->DatDocfactura->idsubsistema == LogisticaGlobal::SUBSISTEMA_TALLERES) {
                $actividades = $this->servicioModel->getServicios($doc[0]);
            }
            foreach ($movimientos as $i => $prod) {
                $arrayProductos = array(
                    'idproducto' => $prod['idproducto'], 'idindicador' => $prod['idindicador'],
                    'iddocorigen' => $arrayDocsOrigen, 'enprocesonuevo' => 0, 'enprocesoviejo' => 0,
                    'entregado' => -$prod['cantidad'], 'idactividad'=>($prod['idactividadmaterial'] ? $prod['idactividadmaterial'] : null)
                );
                if ($documento->DatDocfactura->idsubsistema == LogisticaGlobal::SUBSISTEMA_INV) {
                    $datosCmpto['productos'][$i] = $arrayProductos;
//                    if($updateExistencia)
//                        $numSerie->cambiaEstadoFacturacion($prod['idmovimiento']);
                }else if (
                    $documento->DatDocfactura->idsubsistema == LogisticaGlobal::SUBSISTEMA_AFT
                    && $documento->DatDocfactura->alquiler == 0
                ) {
                    $this->actualizarExistenciasActivos(false , false, $prod);
                }
                $datosCmptoPf[$i] = $arrayProductos;
                $datosCmptoOrden['productos'][$i] = $arrayProductos;
                /* $lotes = Doctrine::getTable('DatMovlote')->findByDql('idmovimiento = ?', array($prod['idmovimiento']));
                  foreach($lotes as $lote){
                  $datosLotes[] = array('cantidad'=>0,'cantidadVieja'=>$lote['cantidad'], 'idlote'=>$lote['idlote']);
                  } */
            }
            $datosCmpto['idcliente'] = $documento->DatDocfactura->idcliente;
            $datosCmpto['reserva'] = $documento->DatDocfactura->reserva;
            /*if (count($datosCmpto) > 0) {
                $prodOrdenModel = new ProdordenModel();
                $prodOrdenModel->actualizarCumplimientoByParams($datosCmpto);
            }*/
            if ($documento->DatDocfactura->idsubsistema == LogisticaGlobal::SUBSISTEMA_TALLERES) {
                foreach ($actividades as $i => $serv) {
                    $arrayServ = array('idindicador' => $serv['idindicador'],
                        'iddocorigen' => $arrayDocsOrigen, 'enprocesonuevo' => 0, 'enprocesoviejo' => 0,
                        'entregado' => -$serv['cantidad']);
                    $datosCmptoOrden['actividades'][$i] = $arrayServ;
                    /* $lotes = Doctrine::getTable('DatMovlote')->findByDql('idmovimiento = ?', array($prod['idmovimiento']));
                      foreach($lotes as $lote){
                      $datosLotes[] = array('cantidad'=>0,'cantidadVieja'=>$lote['cantidad'], 'idlote'=>$lote['idlote']);
                      } */
                }
                $datosCmptoOrden['iddocumento'] = $documento->iddocumento;
                $ordenService->actualizarCumplimiento($datosCmptoOrden);
            }
            if ($documento->DatDocfactura->idnumerocontrol) {
                $numeroControl = Doctrine::getTable('DatNumerocontrol')
                        ->find(
                        $documento->DatDocfactura->idnumerocontrol
                );
                $numeroControl->anulado = 1;
                $numeroControl->fechaanulado = $this->fechacontable;
                $collNcontrol->add($numeroControl);
            }
            $datosCancelado = parent::cancelarDocumento($doc[0], $doc[1]);

            $prodModel->cancelarMovimientos($datosCancelado['iddocumento'], $datosCancelado['cronologia'], $isEntrada);
            $documento->observaciones = $observacion;
            $collDoc->add($documento);
            if($updateExistencia){
                $serviceLote->actualizarExistenciaLote(
                    $documento->iddocumento, $isEntrada,$datosCancelado['cronologia'], !$isEntrada
                );
                $this->actualizarUbicacion($doc[0], !$isEntrada);
		}
            }
        }
        if (count($collDoc) > 0) {
            $collDoc->save();
        }
        if (count($collNcontrol) > 0) {
            $collNcontrol->save();
        }
        $ubicaciones = Doctrine_Manager::connection()->fetchAll(
            "SELECT * FROM mod_logubicacion.fn_arreglardesubicados()"
        );
        return array('success' => true, 'estado' => EstadoDocumentoModel::ESTADO_CANCELADO);
    }

    public function checkPuedeCancelar($idDocumento)
    {
        //$this->checkDerechoObligaciones($idDocumento);
        /*$dql = "SELECT count(DISTINCT p.idproducto) as cant_posteriores FROM DatProductoLogistica p INNER JOIN"
            . " p.DatMovimientos m INNER JOIN m.DatDocumento d WHERE p.idproducto IN ( "
            . " SELECT mm.idproducto FROM DatMovimientos mm  where mm.iddocumento = {$idDocumento} "
            . ") AND d.cronologia > (SELECT dd.cronologia FROM DatDocumento dd WHERE dd.iddocumento = {$idDocumento})";
        $dqlResult = $this->doctrineHelper->query($dql)->toArray();
        if ($dqlResult[0]['cant_posteriores'] > 0) {
            throw new ZendExt_Exception('LOG_LB_DOC_006');
        }*/
        return true;
    }

    /*public function checkDerechoObligaciones($iddocumento){
        if($this->contabilidadHelper->checkDerechoObligacionesLiquidados($iddocumento)){
            throw new ZendExt_Exception('LOG_LB_DOC_028');
        }
        return true;
    }*/

    /**
     * Funcion que permite imprimir una o varias
     * facturas seleccionadas en estado de contabilizado
     *
     * @param array $params Arreglo con el identificador
     *                      de cada factura seleccionada
     */
    public function imprimirFactura($params)
    {
        
    }

    /**
     * Funcion que permite imprimir un listado de todas las facturas
     *
     * @param array $params Arreglo con el identificador
     *                      de todas las facturas
     */
    public function imprimirListado($params)
    {
        
    }

    /**
     * Funcion que permite obtener los depositos
     *
     * @param
     */
    public function obtenerDepositos()
    {
        $depositos = $this->estructuraHelper->obtenerEstructurasNoFormales(
                $this->global->perfil->iddominio, $this->idestructura
        );
        foreach ($depositos as &$deposito) {
            $deposito['iddeposito'] = $deposito['id'];
            $deposito['deposito'] = $deposito['text'];
        }
        return array('depositos' => $depositos);
    }

    /**
     * Funcion que permite obtener las areas por depositos
     *
     * @param
     */
    public function obtenerAreasPorIddeposito($params)
    {
        $ubicacionServ = new UtilesubicacionService();
        $depositos = ($params['node'] == '-1' || $params['node'] == '1')
            ? $this->estructuraHelper->obtenerEstructurasNoFormales(
                $this->global->perfil->iddominio, $params['idestructura']
            ) : $ubicacionServ->devolverAreasPorDeposito($params['node']);
        $fechacontable = $this->fechacontable;
        if ($params['node'] == '1') {
            $depositos[0]['areas'] = $ubicacionServ->devolverAreasPorDeposito(
                    $depositos[0]['id']
            );
            return $depositos;
        }
        $result = array();
        foreach ($depositos as $i => $r) {
            $result[$i]['idpadre'] = $params['node'];
            $result[$i]['leaf'] = ($params['node'] == '-1') ? false : true;
            $result[$i]['checked'] = false;
            $result[$i]['entidad'] = ($r['idpadre']) ? $r['idpadre'] : $params['idestructura'];
            $result[$i]['fechacontable'] = $fechacontable;
            $result[$i]['text'] = ($r['descripcion']) ? $r['descripcion'] : $r['text'];
            $result[$i]['id'] = ($r['idarea']) ? $r['idarea'] : $r['id'];
        }
        return $result;
    }

    public function getMonedasEntidad()
    {
        $this->dualidad = 0;
        $monedaContable = (array) $this->configuracionHelper->obtenerMonedaContablePorEntidad(
                        $this->idestructura
        );
        if ($monedaContable) {
            $monedaContable['contable'] = true;
            $arrayResult[] = $monedaContable;
        }
        $monedasAlternativas = (array) $this->configuracionHelper->obtenerMonedasAlternativasPorEntidad(
                        $this->idestructura
                )['datos'];
        foreach ($monedasAlternativas as &$mon) {
            if ($mon['dualidad'] == 1) {
                $mon['alternativa'] = true;
                //$this->monedalternativa = $mon;
                $this->dualidad = 1;
            }
            $arrayResult[] = $mon;
        }
        return ($arrayResult) ? $arrayResult : array();
    }

    public function getDualidad()
    {
        return $this->dualidad;
    }

    public function getCondicionesPago($idestructura)
    {
        $objNomService = new NomencladoresLogService();
        return $objNomService->devolverCondicionpagoEntidad($idestructura);
    }

    public function getTipoPrecios($parametros = null, $idprecio = null)
    {
        if ($idprecio == -2) {
            return '-';
        } else {
            //Esto se hizo para que en la Orden de Trabajo cargaran todos los tipos de precio sin tener en cuenta  la entidad
            $params = array('idnom' => 'idtipoprecio', 'modelo' => 'NomTipoprecio');
            
            if($parametros['tipo'] && $parametros['cargarSinEntidad']=1){
                  $params = array('idnom' => 'idtipoprecio', 'modelo' => 'NomTipoprecio','tipo'=>$parametros['tipo'],'cargarSinEntidad'=>'1');
            
                /*if($parametros['tipo']==1)
                    $params = array('idnom' => 'idtipoprecio', 'modelo' => 'NomTipoprecio','tipo'=>'1','cargarSinEntidad'=>'1');
                if($parametros['tipo']==2)
                    $params = array('idnom' => 'idtipoprecio', 'modelo' => 'NomTipoprecio','tipo'=>'2','cargarSinEntidad'=>'1');
*/

            }
            if(isset($parametros['tipo'])) {
                $params['tipo'] = $parametros['tipo'];
            }
            $objNomenclador = new NomencladoresLogService();
            $tipoPrecios = $objNomenclador->devolverTipoPrecio($params, true);
            if ($parametros && $parametros['idcliente']) {
                $obDesgPrecio = new DatClientedesgloceprecio();
                $preciosCliente = $obDesgPrecio->getResultByIdCliente(
                        array('idestructuracomun' => $this->idestructura, 'idcliente' => $parametros['idcliente'])
                );
                $tipoPrecios['query']->andWhereIn(
                        'm.idtipoprecio', (count($preciosCliente) > 0)
                    ? $preciosCliente
                    : (LogisticaGlobal::SUBSISTEMA_AFT ? array(-3): array(-1))
                );
            }
            $tipoPrecios = $tipoPrecios['query']->fetchArray();

            if (($parametros['idsubsistema'] == LogisticaGlobal::SUBSISTEMA_INV && $parametros['promedio']) || $parametros['oferta'] || ($idprecio && $idprecio == -1) || $parametros['idsubsistema'] == LogisticaGlobal::SUBSISTEMA_TALLERES)
            {
                if(!isset($parametros['tipo']) || $parametros['tipo'] == 1 || ($idprecio && $idprecio == -1))
                  $tipoPrecios[] = array('idtipoprecio' => -1, 'denominacion' => 'Precio promedio');
            }
            
            if ($parametros['idsubsistema'] == LogisticaGlobal::SUBSISTEMA_AFT && $parametros['promedio']) {
                $tipoPrecios[] = array('idtipoprecio' => -3, 'denominacion' => 'Precio contable');
            }
            foreach ($tipoPrecios as &$precio) {
                if ($idprecio) {
                    if ($precio['idtipoprecio'] == $idprecio) {
                        return $precio['denominacion'];
                    }
                }
                $precio['denominacionPrecio'] = $precio['denominacion'];
            }
        }
        return (!$idprecio) ? $tipoPrecios : '-';
    }

    public function calcularPrecioVentaPromedio(&$precio, $params){    
        $conn = Zend_Registry::get('conexion');
        $media = 0;
        if($params->idproducto){
            $dp = Doctrine::getTable('DatProductoLogistica')->find($params->idproducto);
            if ($dp->cantidad > 0) {
                $dp = array(array('preciocontable' => $dp->precio, 'precioalternativo' => $dp->precioalternativo));
            } else {
              $dp = $conn->execute("select dm.preciocontable, dm.precioalternativo from mod_logistica.dat_movimiento dm where dm.idproducto = {$params->idproducto} and dm.cronologia = (select max(dm1.cronologia) from mod_logistica.dat_movimiento dm1 
            inner join mod_logistica.dat_documento dd using(iddocumento)
            inner join mod_datosmaestros.dat_documentoprim ddp using(iddoc)
            inner join mod_datosmaestros.nom_docprim ndp using(iddocumentos)
            where dm1.idproducto = {$params->idproducto} and ndp.abreviatura <> 'cambioccontableLog') limit 1")->fetchAll(PDO::FETCH_ASSOC);  
            }

            foreach($precio['datos'][0]['DatMatrizpreciodualmonetaria'] as &$dat){
                $sumas = 0;
                $restas = 0;
                //if($dat['idmoneda'] == $this->_dualidadMonedas->idmoneda){
                    $valorRef = ($params->formula == 1) ? $dp[0]['preciocontable']*$params->mediaproductos : $dp[0]['preciocontable'];
                    if ($params->formula == 1) {
                        $media = ($dp[0]['preciocontable']*$params->mediaproductos) - $dp[0]['preciocontable'];
                    }
                /*}else{
                    $valorRef = /*($params->preciorefalt) ? $params->preciorefalt : */$dp[0]['precioalternativo'];
                /*}*/
                foreach ($dat['DatPrecio'] as $datosPrecio) {
                    if ($datosPrecio['porciento'] != 1) {
                        if ($datosPrecio['concepto'] == '+') {
                            $sumas += $datosPrecio['valor'];
                        } else {
                            $restas += $datosPrecio['valor'];
                        }
                    } else {
                        $calculo = $valorRef * $datosPrecio['valor'] / 100;
                        if ($datosPrecio['concepto'] == '+') {
                            $sumas += $calculo;
                        } else {
                            $restas += $calculo;
                        }
                    }
                }
                if ($params->formula != 1) {
                    $media = (($valorRef + $sumas - $restas)*$params->mediaproductos) - ($valorRef + $sumas - $restas);
                }
                $dat['precioventa'] = $this->formulaPVenta($valorRef, $params->mediaproductos, $sumas, $restas, $params->formula);
                $dat['precio'] = $valorRef;
                $dat['media'] = $media;
            }
        }elseif($params->idindicador){
			$docOrigen = $this->getDocOrigen($params->idfactura);
			$iddocOrigen = $docOrigen[0]['iddoc'];
            $and = "";
			if ($this->objIddocOrden->iddoc && $iddocOrigen == $this->objIddocOrden->iddoc) {
				$datproducto = $conn->execute("select idproducto	from mod_logtaller.dat_material where idindicador = {$params->idindicador} and idordentrabajo = {$docOrigen[0]['idpadre']}")->fetchAll(PDO::FETCH_ASSOC);
        $dp = $conn->execute("select dm.preciocontable, dm.precioalternativo from mod_logistica.dat_movimiento dm
        where dm.idproducto = {$datproducto[0]['idproducto']} and dm.cronologia = (select max(dm1.cronologia) from mod_logistica.dat_movimiento dm1 where dm1.idproducto = {$datproducto[0]['idproducto']}) limit 1")->fetchAll(PDO::FETCH_ASSOC);
			} else {
				if($params->idestructuraop){
              $and = "idestructura = {$params->idestructuraop} and";
				}
				$dp = $conn->execute("select round(sum(COALESCE(importe,0))/(case when sum(cantidad) = 0 then 1 else sum(cantidad) end),6) as preciocontable,
                                        round(sum(COALESCE(importealternativo,0))/(case when sum(cantidad) = 0 then 1 else sum(cantidad) end),6) as precioalternativo
                                        from mod_logistica.dat_producto where {$and} idindicador = ".$params->idindicador)
						->fetchAll(PDO::FETCH_ASSOC);       
			}
            foreach($precio['datos'][0]['DatMatrizpreciodualmonetaria'] as &$dat){
                $sumas = 0;
                $restas = 0;
                //if($dat['idmoneda'] == $this->_dualidadMonedas->idmoneda){
                    $valorRef = ($params->formula == 1) ? $dp[0]['preciocontable']*$params->mediaproductos : $dp[0]['preciocontable'];
                    if ($params->formula == 1) {
                        $media = ($dp[0]['preciocontable']*$params->mediaproductos) - $dp[0]['preciocontable'];
                    }
                /*}else{
                    $valorRef = $dp[0]['precioalternativo'];
                }*/
                foreach ($dat['DatPrecio'] as $datosPrecio) {
                    if ($datosPrecio['porciento'] != 1) {
                        if ($datosPrecio['concepto'] == '+') {
                            $sumas += $datosPrecio['valor'];
                        } else {
                            $restas += $datosPrecio['valor'];
                        }
                    } else {
                        $calculo = $valorRef * $datosPrecio['valor'] / 100;
                        if ($datosPrecio['concepto'] == '+') {
                            $sumas += $calculo;
                        } else {
                            $restas += $calculo;
                        }
                    }
                }
                if ($params->formula != 1) {
                    $media = (($valorRef + $sumas - $restas)*$params->mediaproductos) - ($valorRef + $sumas - $restas);
                }
                $dat['precioventa'] = $this->formulaPVenta($valorRef, $params->mediaproductos, $sumas, $restas, $params->formula);
                $dat['precio'] = $valorRef;
                $dat['media'] = $media;
            }
        }
    }

    public function calcularPrecioVentaFactor(&$precio, $params){
        if($params->idproducto){
            $dp = Doctrine::getTable('DatProductoLogistica')->find($params->idproducto);
        }
        foreach($precio['datos'][0]['DatMatrizpreciodualmonetaria'] as &$dat){
            if ($params->idproducto)
                $dat['precioventa'] *= $dp->factorbase;
            $dat['media'] = ($dat['precioventa']*$params->mediaproductos)-$dat['precioventa'];
            $dat['precioventa'] *= $params->mediaproductos;
        }
    }

    public function getPrecio($params, $idmonedaunica = false, $otramoneda = false, $um = false, $factordoc = 1)
    {
        //$confFactModel = new ConfFacturacionModel();
        if (is_numeric($otramoneda)) {
            $params->otramoneda = $otramoneda;
        }
        $confAux = $this->confFactModel->getIdPadreMatriz();
        $media = $this->getMedia(
            array('idtipoprecio'=>$params->idtipoprecio, 'idcliente'=>$params->idcliente, 'idestructura'=>$this->idestructura)
        );
        $params->mediaproductos = (count($media)) ? $media[0]['media'] : $confAux['mediaproductos'];
        $params->mediaservicios = $confAux['mediaservicios'];
        $params->formula = $confAux['formula'];
        $idpadreMatriz = $confAux['idpadre'];
        $redondear5 = false;
        if (!array_key_exists($params->idcliente, $this->_cacheClienteRedondeo[$this->idestructura][$params->idtipoprecio])) {
            $clienteredondeo = $this->isRedondear(
                array('idtipoprecio'=>$params->idtipoprecio, 'idcliente'=>$params->idcliente, 'idestructura'=>$this->idestructura)
            );
            $this->_cacheClienteRedondeo[$this->idestructura][$params->idtipoprecio][$params->idcliente] = (count($clienteredondeo)) ? 1 : 0;
        }
        if ($this->_cacheClienteRedondeo[$this->idestructura][$params->idtipoprecio][$params->idcliente]) {
            $redondear5 = true;
        }
        $idnatindicador = $this->getNaturalezaIndicador($params->idindicador);
        if (!array_key_exists($idnatindicador, $this->_cacheNaturalezamedia[$params->idtipoprecio])) {
            $mediaNaturaleza = $this->getMediaNaturaleza(
                array('idtipoprecio'=>$params->idtipoprecio, 'idnaturaleza' => $idnatindicador)
            );
            $this->_cacheNaturalezamedia[$params->idtipoprecio][$idnatindicador] = (count($mediaNaturaleza)) ? $mediaNaturaleza[0] : 1;
        }
        $idsectorcliente = $this->getSectorCliente($params->idcliente);
        if (!array_key_exists($idsectorcliente, $this->_cacheSectormedia[$params->idtipoprecio])) {
            $mediaSector = $this->getMediaSector(
                array('idtipoprecio'=>$params->idtipoprecio, 'idnaturaleza' => $idnatindicador, 'idsector' => $idsectorcliente)
            );
            $this->_cacheSectormedia[$params->idtipoprecio][$idsectorcliente][$idnatindicador] = (count($mediaSector)) ? $mediaSector[0] : 1;
        } else {
            if (!array_key_exists($idnatindicador, $this->_cacheSectormedia[$params->idtipoprecio][$idsectorcliente])) {
                $mediaSector = $this->getMediaSector(
                    array('idtipoprecio'=>$params->idtipoprecio, 'idnaturaleza' => $idnatindicador, 'idsector' => $idsectorcliente)
                );
                $this->_cacheSectormedia[$params->idtipoprecio][$idsectorcliente][$idnatindicador] = (count($mediaSector)) ? $mediaSector[0] : 1;
            }
        }
        $params->mediaproductos *= $this->_cacheNaturalezamedia[$params->idtipoprecio][$idnatindicador]*$this->_cacheSectormedia[$params->idtipoprecio][$idsectorcliente][$idnatindicador];
        $params->mediaservicios *= $this->_cacheNaturalezamedia[$params->idtipoprecio][$idnatindicador]*$this->_cacheSectormedia[$params->idtipoprecio][$idsectorcliente][$idnatindicador];

        if ($params->idtipoprecio != -1 && $params->idtipoprecio != -3) {
            if ($params->idtipoprecio == -2) {
                return -2;
            } else {
                $objMatrizPrecio = new DatMatrizprecio();
                $precio = $objMatrizPrecio->getDataToMatrizPrecio(
                        array('identificador' => $params->idindicador, 'idtipoprecio' => $params->idtipoprecio,
                            'idestructuracomun' => $idpadreMatriz)
                );
                $precioCero = false;
                $factor = 1;
                $idumedidaprod = ($precio['datos'][0]['idumedida']) ? $precio['datos'][0]['idumedida'] : Doctrine::getTable('NomIndicador')->find($params->idindicador)->idumedida;
                if($um && (($params->idumedidacrc && $idumedidaprod) && ($params->idumedidacrc != $idumedidaprod))){
                    if ($params->idmovimiento) {
                        $prodFact = Doctrine::getTable('DatProdFactura')->findByDql('idmovimiento = ?', array($params->idmovimiento));
                        if ($prodFact[0]->factorconvercion != 0) {
                            $factor = $prodFact[0]->factorconvercion;
                        } else {
                            $qfactoraux = $this->maestroP->cargarFactorConversion(
                                array('idindicador'=>$params->idindicador, 'idunidadmedida'=>$params->idumedidacrc),true
                            );
                            $factoraux = $qfactoraux->fetchArray();
                            if (count($factoraux) > 0) {
                                $qfactoraux2 = $this->maestroP->cargarFactorConversion(
                                    array('idindicador'=>$params->idindicador, 'idunidadmedida'=>$idumedidaprod),true
                                );
                                $factoraux2 = $qfactoraux2->fetchArray();
                                if(count($factoraux2) > 0)
                                    $factor = 1/$factoraux[0]['factorconversion'] * $factoraux2[0]['factorconversion'];
                                else
                                    $factor = $factoraux[0]['factorconversion'];
                            } else {
                                $qfactoraux = $this->maestroP->cargarFactorConversion(
                                    array('idindicador'=>$params->idindicador, 'idunidadmedida'=>$idumedidaprod),true
                                );
                                $factoraux = $qfactoraux->fetchArray();
                                $factor = $factoraux[0]['factorconversion'];
                            }
                        }
                    } else {
                        $precioCero = true;
                    }
                }

                if ($factor != 1){
                    foreach ($precio['datos'][0]['DatMatrizpreciodualmonetaria'] as &$d){
                        foreach ($d['DatPrecio'] as &$dp){
                            $dp['valor'] *= $factor;
                        }
                    }
                }
                
                if(!$params->servicio){
                    if($precio['datos'][0]['preciopromedio'] == 1){
                        if($confAux['preciocentral']) {//a partir de aqui
                            $this->calcularPrecioVentaPromedioCentral($precio, $params);
                        } else {
                            $this->calcularPrecioVentaPromedio($precio, $params);
                        }
                    }else{
                        $this->calcularPrecioVentaFactor($precio, $params);
                    }
                }
                $data = array();
                if (count($precio['datos']) > 0 && !$precioCero) {
                    foreach ($precio['datos'][0]['DatMatrizpreciodualmonetaria'] as $value) {
                        if ($value['idmoneda'] == $this->_dualidadMonedas->idmoneda) {
                            if ($params->servicio) {
                                $value['precio'] = ($params->costo) ? $value['precio'] : $value['precio']*$params->mediaservicios;
                                $value['precioventa'] = ($params->costo) ? $value['precio'] : $value['precioventa']*$params->mediaservicios;
                            }
                            if ($otramoneda && !$this->_dualidadMonedas->idmonedaalternativa) {
                                /*$value['precio'] = $this->configuracionHelper->convertirImporte(
                                    $this->_dualidadMonedas->idmoneda, $otramoneda, $this->_tipotasa, $value['precio'], 1
                                );
                                $value['precioventa'] = $this->configuracionHelper->convertirImporte(
                                    $this->_dualidadMonedas->idmoneda, $otramoneda, $this->_tipotasa, $value['precioventa'], 1
                                );*/
                                $value['precio'] = $this->convertirPrecio(1, $factordoc, $value['precio']);
                                $value['precioventa'] = $this->convertirPrecio(1, $factordoc, $value['precioventa']);
                            }
                            $data[$this->_dualidadMonedas->idmoneda] = $value;
                        } else if ($this->_dualidadMonedas->idmonedaalternativa) {
                            if ($value['idmoneda'] == $this->_dualidadMonedas->idmonedaalternativa) {
                                if ($otramoneda) {
                                    /*$value['precio'] = $this->configuracionHelper->convertirImporte(
                                        $this->_dualidadMonedas->idmonedaalternativa, $otramoneda, $this->_tipotasa, $value['precio'], 1
                                    );
                                    $value['precioventa'] = $this->configuracionHelper->convertirImporte(
                                        $this->_dualidadMonedas->idmonedaalternativa, $otramoneda, $this->_tipotasa, $value['precioventa'], 1
                                    );*/
                                    $value['precio'] = $this->convertirPrecio(1, $factordoc, $value['precio']);
                                    $value['precioventa'] = $this->convertirPrecio(1, $factordoc, $value['precioventa']);
                                }
                                $data[$this->_dualidadMonedas->idmonedaalternativa] = $value;
                            } else {
                              $data[$this->_dualidadMonedas->idmoneda] = $value;
                            }
                        } else {
                            $data[$value['idmoneda']] = $value;
                        }
                    }
                    $arrayPrecio = array('precioventa' => number_format(
                        $data[$this->_dualidadMonedas->idmoneda]['precioventa'], 6, '.', ''
                    ), 'preciopromedio' => $precio['datos'][0]['preciopromedio'], 'datos' => $data);
                    if(!$idmonedaunica){
                        if ($redondear5) {//redondeo 5
                            $arrayPrecio['precioventa'] = LogisticaObjectHelper::__init()->_roundDecimaSuperior($arrayPrecio['precioventa']);
                            $pVenta = $arrayPrecio['datos'][$this->_dualidadMonedas->idmoneda]['precioventa'];
                            $arrayPrecio['datos'][$this->_dualidadMonedas->idmoneda]['precioventa'] = LogisticaObjectHelper::__init()->_roundDecimaSuperior($pVenta);
                            if ($this->_dualidadMonedas->idmonedaalternativa) {
                                $pVentaAlt = $arrayPrecio['datos'][$this->_dualidadMonedas->idmonedaalternativa]['precioventa'];
                                $arrayPrecio['datos'][$this->_dualidadMonedas->idmonedaalternativa]['precioventa'] = LogisticaObjectHelper::__init()->_roundDecimaSuperior($pVentaAlt);
                            }
                        }
                        return $arrayPrecio;
                    }else{
                        return $this->precioUnicaMoneda($arrayPrecio, $idmonedaunica, $redondear5);
                    }
                } else {
                    $data[$this->_dualidadMonedas->idmoneda] = 0;
                    if($this->_dualidadMonedas->idmonedaalternativa){
                        $data[$this->_dualidadMonedas->idmonedaalternativa] = 0;
                    }
                    return array('precioventa' => number_format(
                                0, 6, '.', ''
                        ), 'datos' => $data);
                }
            }
        } else if($params->idtipoprecio == -1){
            return $this->precioPromedio($params, $idmonedaunica, $redondear5, $confAux['preciocentral'], $factordoc);
        }else{
            return $this->precioContableActivo($params, $idmonedaunica, $redondear5);
        }
    }

    public function precioPromedio($params, $idmonedaunica = false, $redondear5 = false, $preciocentral = false, $factordoc = 1)
    {
        $conn = Zend_Registry::get('conexion');
        if ($params->idfactura) {
            $docOrigen = $this->getDocOrigen($params->idfactura);
            $iddocOrigen = $docOrigen[0]['iddoc'];
            $iddoc = Doctrine::getTable('DatDocumento')->find($params->idfactura)->iddoc;
        }
        if ($params->idfactura && (($this->objIddocOrden->iddoc && $iddocOrigen == $this->objIddocOrden->iddoc) || ($this->objIddocOferta->iddoc && $this->objIddocOferta->iddoc == $iddoc))) {
            if ($preciocentral) {
                $indicador = Doctrine::getTable('NomIndicador')->find($params->idindicador);
                $mov = array(array('preciocontable' => $indicador->precio, 'precioalternativo' => $indicador->precioalternativo));
            } else {
                if ($this->objIddocOrden->iddoc && $iddocOrigen == $this->objIddocOrden->iddoc) {
                    $dp = $conn->execute("select idproducto	from mod_logtaller.dat_material where idindicador = {$params->idindicador} and idordentrabajo = {$docOrigen[0]['idpadre']}")->fetchAll(PDO::FETCH_ASSOC);
                } else {
                    $dp = $conn->execute("select coalesce(def.idprod,-1) as idproducto	from mod_logfacturacion.dat_elementosfactura def
             inner join mod_logfacturacion.dat_prodservnomenclador dps on dps.idelementofactura = def.idelementofactura
             where dps.idindicador = {$params->idindicador} and def.idfactura = {$params->idfactura}")->fetchAll(PDO::FETCH_ASSOC);
                    $dp[0]['idproducto'] = (count($dp) == 0 || $dp[0]['idproducto'] == -1) ? (($params->idproducto) ? $params->idproducto : -1) : $dp[0]['idproducto'];
                }
                $mov = $conn->execute("select dm.preciocontable, dm.precioalternativo from mod_logistica.dat_movimiento dm
where dm.idproducto = {$dp[0]['idproducto']} and dm.cronologia = (select max(dm1.cronologia) from mod_logistica.dat_movimiento dm1 where dm1.idproducto = {$dp[0]['idproducto']}) limit 1")->fetchAll(PDO::FETCH_ASSOC);
            }
            $mov[0]['preciocontable'] *= $params->mediaproductos;
            $data = array();
            if ($this->_dualidadMonedas->idmonedaalternativa) {
                if ($params->otramoneda) {
                    $mov[0]['precioalternativo'] = $this->configuracionHelper->convertirImporte(
                        $this->_dualidadMonedas->idmonedaalternativa, $params->otramoneda, $this->_tipotasa, $mov[0]['precioalternativo'], 1
                    );
                }
                $data[$this->_dualidadMonedas->idmonedaalternativa] = array('precioventa' => $mov[0]['precioalternativo'], 'idmoneda' => $this->_dualidadMonedas->idmonedaalternativa);
            } else {
                if ($params->otramoneda) {
                    $mov[0]['preciocontable'] = $this->convertirPrecio(1, $factordoc, $mov[0]['preciocontable']);
                    /*$mov[0]['preciocontable'] = $this->configuracionHelper->convertirImporte(
                        $this->_dualidadMonedas->idmoneda, $params->otramoneda, $this->_tipotasa, $mov[0]['preciocontable'], 1
                    );*/
                }
            }
            $data[$this->_dualidadMonedas->idmoneda] = array('precioventa' => $mov[0]['preciocontable'], 'idmoneda' => $this->_dualidadMonedas->idmoneda);
            $arrayPrecio = array('precioventa' => number_format(
                $data[$this->_dualidadMonedas->idmoneda]['precioventa'], 6, '.', ''
            ), 'datos' => $data);
            if (!$idmonedaunica) {
                if ($redondear5) {//redondeo 5
                    $arrayPrecio['precioventa'] = LogisticaObjectHelper::__init()->_roundDecimaSuperior($arrayPrecio['precioventa']);
                    $pVenta = $arrayPrecio['datos'][$this->_dualidadMonedas->idmoneda]['precioventa'];
                    $arrayPrecio['datos'][$this->_dualidadMonedas->idmoneda]['precioventa'] = LogisticaObjectHelper::__init()->_roundDecimaSuperior($pVenta);
                    if ($this->_dualidadMonedas->idmonedaalternativa) {
                        $pVentaAlt = $arrayPrecio['datos'][$this->_dualidadMonedas->idmonedaalternativa]['precioventa'];
                        $arrayPrecio['datos'][$this->_dualidadMonedas->idmonedaalternativa]['precioventa'] = LogisticaObjectHelper::__init()->_roundDecimaSuperior($pVentaAlt);
                    }
                }
                return $arrayPrecio;
            } else {
                return $this->precioUnicaMoneda($arrayPrecio, $idmonedaunica, $redondear5);
            }
        } else {
            if ($params->idproducto) {
                if ($preciocentral) {
                    $indicador = Doctrine::getTable('NomIndicador')->find($params->idindicador);
                    $prod = array('precio' => $indicador->precio, 'precioalternativo' => $indicador->precioalternativo);
                } else {
                    $prod = $this->producto->getDatosProducto($params->idproducto);
                }
                //$monedas = $this->getMonedaContableAlternativa();
                $prod['precio'] *= $params->mediaproductos;
                $data = array();
                if ($this->_dualidadMonedas->idmonedaalternativa) {
                    if ($params->otramoneda) {
                        $prod['precioalternativo'] = $this->configuracionHelper->convertirImporte(
                            $this->_dualidadMonedas->idmonedaalternativa, $params->otramoneda, $this->_tipotasa, $prod['precioalternativo'], 1
                        );
                    }
                    $data[$this->_dualidadMonedas->idmonedaalternativa] = array('precioventa' => $prod['precioalternativo'], 'idmoneda' => $this->_dualidadMonedas->idmonedaalternativa);
                } else {
                    if ($params->otramoneda) {
                        $prod['precio'] = $this->convertirPrecio(1, $factordoc, $prod['precio']);
                        /*$prod['precio'] = $this->configuracionHelper->convertirImporte(
                            $this->_dualidadMonedas->idmoneda, $params->otramoneda, $this->_tipotasa, $prod['precio'], 1
                        );*/
                    }
                }
                $data[$this->_dualidadMonedas->idmoneda] = array('precioventa' => $prod['precio'], 'idmoneda' => $this->_dualidadMonedas->idmoneda);
                $arrayPrecio = array('precioventa' => number_format(
                    $data[$this->_dualidadMonedas->idmoneda]['precioventa'], 6, '.', ''
                ), 'datos' => $data);
                if (!$idmonedaunica) {
                    if ($redondear5) {//redondeo 5
                        $arrayPrecio['precioventa'] = LogisticaObjectHelper::__init()->_roundDecimaSuperior($arrayPrecio['precioventa']);
                        $pVenta = $arrayPrecio['datos'][$this->_dualidadMonedas->idmoneda]['precioventa'];
                        $arrayPrecio['datos'][$this->_dualidadMonedas->idmoneda]['precioventa'] = LogisticaObjectHelper::__init()->_roundDecimaSuperior($pVenta);
                        if ($this->_dualidadMonedas->idmonedaalternativa) {
                            $pVentaAlt = $arrayPrecio['datos'][$this->_dualidadMonedas->idmonedaalternativa]['precioventa'];
                            $arrayPrecio['datos'][$this->_dualidadMonedas->idmonedaalternativa]['precioventa'] = LogisticaObjectHelper::__init()->_roundDecimaSuperior($pVentaAlt);
                        }
                    }
                    return $arrayPrecio;
                }else{
                    return $this->precioUnicaMoneda($arrayPrecio, $idmonedaunica, $redondear5);
                }
            } else {
                $prod = $this->maestroP->cargarGridNomenclador(
                        array('idindicador' => $params->idindicador)
                );
                return number_format($prod['datos'][0]['precio'], 6, '.', '');
            }
        }     
    }

    public function precioContableActivo($params, $idmonedaunica = false, $redondear5 = false)
    {
        if ($params->idregnumerico) {
            $service = new RegNumActivoService();
            $query = $service->getQueryDataVisualizarRegNumActivos(
                array('idregnumerico' => $params->idregnumerico), 'drna'
            );
            $prod = $query->fetchArray();
            $monedas = $this->getDualidadMonedas();
            $data = array();
            $data[$monedas->idmoneda] = array('precioventa' => $prod[0]['valorcontable'], 'idmoneda' => $monedas->idmoneda);
            if($monedas->idmonedaalternativa){
                $data[$monedas->idmonedaalternativa] =
                    array('precioventa' => $prod[0]['valorcontablealternativo'], 'idmoneda' => $monedas->idmonedaalternativa);
            }
            $arrayPrecio =array('precioventa' => number_format(
                $data[$monedas->idmoneda]['precioventa'], 6, '.', ''
            ), 'datos' => $data);
            if(!$idmonedaunica){
                if ($redondear5) {//redondeo 5
                    $arrayPrecio['precioventa'] = LogisticaObjectHelper::__init()->_roundDecimaSuperior($arrayPrecio['precioventa']);
                    $pVenta = $arrayPrecio['datos'][$this->_dualidadMonedas->idmoneda]['precioventa'];
                    $arrayPrecio['datos'][$this->_dualidadMonedas->idmoneda]['precioventa'] = LogisticaObjectHelper::__init()->_roundDecimaSuperior($pVenta);
                    if ($this->_dualidadMonedas->idmonedaalternativa) {
                        $pVentaAlt = $arrayPrecio['datos'][$this->_dualidadMonedas->idmonedaalternativa]['precioventa'];
                        $arrayPrecio['datos'][$this->_dualidadMonedas->idmonedaalternativa]['precioventa'] = LogisticaObjectHelper::__init()->_roundDecimaSuperior($pVentaAlt);
                    }
                }
                return $arrayPrecio;
            }else{
                return $this->precioUnicaMoneda($arrayPrecio, $idmonedaunica);
            }
        }
    }

    public function getClientes($parametros)
    {
        $filtro = array();
        //$filtro['vigenteduplicado'] = 1;
        if ($parametros['query']) {
            $filtro['nombre'] = $parametros['query'];
            $filtro['codigo'] = $parametros['query'];
            //$filtro['cobrospagos'] = 1;
        }
        if ($parametros['mayorista']) {
            $filtro['mayorista'] = $parametros['mayorista'];
        }
		$idcliente = null;
		if($parametros['iddocumento']){
		    if ($parametros['clienteaux']) {
                $data =Doctrine_Query::create()
                    ->from('DatDocfactura df')
                    ->where('df.idfactura = ? ', array($parametros['iddocumento']))
                    ->fetchArray();
                $idcliente=  $data[0]['idclienteauxiliar'];
            } else {
                $data =Doctrine_Query::create()
                    ->from('DatDocumentoCliente d')
                    ->where('d.iddocumento = ? ', array($parametros['iddocumento']))
                    ->fetchArray();
                $idcliente=  $data[0]['idcliente'];
            }
			
		} else if ($parametros['idclientepadre']){
             $idcliente = $parametros['idclientepadre'];
        }
        $clientes = $this->configuracionHelper->getClientesProveedorByParams(
                $idcliente, $this->global->Estructura->idestructura, true, true, false, $filtro, $parametros['start'], $parametros['limit']
        );
        $conn = Doctrine_Manager:: connection();
              foreach($clientes['datos'] as &$c){          
                  $result = $conn->fetchAll(
                  "SELECT distinct c.idcontacto,(c.nombre || ' ' ||c.numeroidentidad) as nombre
                      FROM mod_datosmaestros.nom_contacto c 
                      inner join mod_crmclienteproveedor.dat_facultad f on f.idcontacto = c.idcontacto
                      inner join mod_logfacturacion.dat_facultadcomprador dfc on dfc.idfacultad = f.idtipofacultad
                      WHERE c.idclientesproveedores={$c['idclientesproveedores']} ORDER BY c.idcontacto;"
                  );
              $c['contactos'] = $result;
              $c['nombre'] = $c['codigo'].' '.$c['nombre'];
        }
        /* if ($parametros['start'] || $parametros['limit']) {
          $result['cantidad'] = count($clientes);
          $result['datos'] = array_splice($clientes, $parametros['start'], $parametros['limit']);
          return $result;
          } else { */
        return $clientes;
        //}
    }

    public function getAllIddocsByCategorias()
    {
        $arrDocs = $this->slogiticaDoc->devuelveIddocByidestructura(
                'facturaLog', $this->idestructura, LogisticaGlobal::SUBSISTEMA_FAC
        );
        $documentoNota = $this->slogiticaDoc->devuelveIddocByidestructura(
                'conduceLog', $this->idestructura, LogisticaGlobal::SUBSISTEMA_FAC
        );
        $result = array();
        $result[] = array('iddoc' => $arrDocs->iddoc, 'denominacion' => $arrDocs->denominacion); //cambiar denominacion por sigla
        if ($documentoNota->iddoc) {
            $result[] = array('iddoc' => $documentoNota->iddoc,
                'denominacion' => $documentoNota->denominacion); //cambiar denominacion por sigla
        }
        return $result;
    }

    public function getDocumentosaGenerar()
    {
        $arrDocumentos = $this->getAllIddocsByCategorias();
        return $arrDocumentos;
    }

    public function getNroDocOrigen()
    {
        $conn = Zend_Registry::get('conexion');
        $nrodoc = $conn->execute(
                        "SELECT distinct(dda.nrodoc) as nrodoc, dfe.iddocumentoentrega as iddocumentoentrega
             FROM mod_logfacturacion.dat_docfacturadocsentrega dfe
             inner join mod_logistica.dat_documento dda on dfe.iddocumentoentrega = dda.iddocumento"
                )
                ->fetchAll(PDO::FETCH_ASSOC);
        return array('datos' => $nrodoc);
    }

    public function countClienteAgrup(
    $iddocumento, $iddeposito = false, $otrosParam = array('select' => false, 'fetchColumn' => false)
    )
    {
        $filtro = '';
        if ($iddeposito) {
            $filtro = 'AND dp.idestructuraop = ' . $iddeposito;
        }
        if ($otrosParam['idcontratos']) {
            $filtro .= "AND dpc.idcontrato in({$otrosParam['idcontratos']}) ";
        }
        $select = ($otrosParam['select']) ? $otrosParam['select'] : 'ON(idcliente,dpc.idcontrato) idcliente, ordencliente, dpc.idcontrato,dp.iddocumento';
        $conn = Zend_Registry::get('conexion');
        $query = "SELECT DISTINCT  $select FROM
                  mod_logistica.dat_prodorden as dp
                  left join mod_logistica.dat_prodordencontrato dpc on dpc.idprodorden = dp.idprodorden
                  inner  JOIN mod_logistica.dat_prodordenarea poa ON dp.idprodorden = poa.idprodorden
                  inner JOIN mod_logistica.dat_prodordenareacumplimiento pac
                  ON poa.idprodordenarea = pac.idprodordenarea and pac.noprocesado > 0
                  WHERE dp.iddocumento in ({$iddocumento}) $filtro ";
        //echo $query;die;
        return ($otrosParam['fetchColumn']) ? array('idcontratos' => $conn->fetchColumn($query), 'datos' => $conn->fetchAll($query)) : $conn->fetchAll(
                        $query
        ); //$conn->fetchColumn($query);
    }

    /**
     * Funcion que permite cargar la configuracion de Facturacion
     *
     * @return array Retorna la configuracion segun la estructura
     */
    public function cargarConfiguracion($params)
    {
        //$confFactModel = new ConfFacturacionModel();
        $documentoNota = $this->slogiticaDoc->devuelveIddocByIdEstructura(
                'conduceLog', $params['idestructuracomun'], LogisticaGlobal::SUBSISTEMA_FAC
        );
        $documentoOferta = $this->slogiticaDoc->devuelveIddocByIdEstructura(
                'ofertaLog', $params['idestructuracomun'], LogisticaGlobal::SUBSISTEMA_FAC
        );
        $configuracion = $this->confFactModel->cargarConfiguracion(
                $params['idestructuracomun']
        );
        /*$entidad = $this->estructuraHelper->getEstructura($params['idestructuracomun']);
        $configuracion['suministrador']['denominacion'] = $entidad[0]->denominacion;
        $configuracion['suministrador']['codigo'] = $entidad[0]->codigo;
        $configuracion['suministrador']['direccion'] = $entidad[0]->direccion;*/
        if ($documentoNota->iddoc) {
            $configuracion['notaEntrega'] = 1;
            $configuracion['denominacionNota'] = $documentoNota->denominacion;
        } else {
            $configuracion['notaEntrega'] = 0;
        }
        if ($documentoOferta->iddoc) {
            $configuracion['oferta'] = 1;
            $configuracion['denominacionOferta'] = $documentoOferta->denominacion;
        } else {
            $configuracion['oferta'] = 0;
        }
        $configuracion['dualidad'] = $this->dualidad;
        $configuracion['monedas'] = $this->_dualidadMonedas;
        $configuracion['tipotasa'] = $configuracion['idtipotasa'];
        $this->_tipotasa = $configuracion['idtipotasa'];
        $this->_numeroferta = $configuracion['utilizarnumeroref'];
        $planificacion = LogisticaGlobal::__init()->estaAperturadoSubsistema(LogisticaGlobal::SUBSISTEMA_PLAN);
        $configuracion['planificacion'] = ($planificacion) ? 1 : 0;
        return $configuracion;
    }

    public function getTipoDocumentos()
    {
        $documentoNota = $this->slogiticaDoc->devuelveIddocByIdEstructura(
                'conduceLog', $this->idestructura, LogisticaGlobal::SUBSISTEMA_FAC
        );
        $documentoDistrib = $this->slogiticaDoc->devuelveIddocByIdEstructura(
                'entregaLog', $this->idestructura, LogisticaGlobal::SUBSISTEMA_INV
        );
         $documentoNDebito = $this->slogiticaDoc->devuelveIddocByIdEstructura(
          'debitoLog', $this->idestructura, LogisticaGlobal::SUBSISTEMA_FAC
          );
        $documentoNCredito = $this->slogiticaDoc->devuelveIddocByIdEstructura(
            'creditoLog', $this->idestructura, LogisticaGlobal::SUBSISTEMA_FAC
        );
        $respuesta = array();
        if ($documentoDistrib->iddoc) {
            $respuesta[] = array('denominacion' => $documentoDistrib->denominacion, 'tipoDoc' => 4); //cambiar denominacion por sigla
        }
        if ($documentoNota->iddoc) {
            $respuesta[] = array('denominacion' => $documentoNota->denominacion, 'tipoDoc' => 5); //cambiar denominacion por sigla
        }
         if ($documentoNDebito->iddoc) {
          $respuesta[] = array('denominacion' => $documentoNDebito->denominacion,
          'tipoDoc' => 'nd');
          }
          if ($documentoNCredito->iddoc) {
          $respuesta[] = array('denominacion' => $documentoNCredito->denominacion,
          'tipoDoc' => 'nc');
          }
        return $respuesta;
    }

    public function cargarDocumentos($params)
    {
        switch ($params['tipoDoc']) {
            case 4:
                $datas = $this->cargarDistribucion($params);
                break;
            case 5:
                $params['solonotas'] = 1;
                $params['estado'] = EstadoDocumentoModel::ESTADO_CONTABILIZADO;
                $datas = $this->obtenerFacturas($params);
                break;
            case 6:
                $datas = $this->getDocumentosAft($params);
                break;
            case 7:
                $datas = $this->cargarPedidos($params);
                break;
            case 8:
                $params['idoperacionAux'] = $params['idoperacion'];
                unset($params['idoperacion']);
                $params['docorigenexcluir'] = array(3);
                $datas = $this->cargarOrdenes($params);
                $datas['total'] = $datas['cantidad'];
                break;
            case 'nd':
                $params['estado'] = EstadoDocumentoModel::ESTADO_CONTABILIZADO;
                $params['sinnotascd'] = 1;
                $params['compgenerado'] = 1;
                unset($params['idoperacion']);
                $datas = $this->obtenerFacturas($params);
                break;
            case 'nc':
                $params['estado'] = EstadoDocumentoModel::ESTADO_CONTABILIZADO;
                $params['sinnotascd'] = 1;
                $params['compgenerado'] = 1;
                unset($params['idoperacion']);
                $datas = $this->obtenerFacturas($params);
                break;
        }
        return $datas;
    }

    /**
     * Funcion que permite cargar los doc de Pedidos
     *
     * @return array Retorna la configuracion segun la estructura
     */
    public function cargarOrdenes($params)
    {
        $mayorista = false;
        if (is_numeric($params['idoperacionAux'])) {
            $sql = "select oper.vm from mod_logfacturacion.dat_operacionsubsistema oper 
                    where oper.idnomoperaciones = {$params['idoperacionAux']} and oper.idestructura = {$this->global->Estructura->idestructura}";
            $datAux = $this->doctrineHelper->getConnection()->execute($sql)->fetchAll(PDO::FETCH_COLUMN);
            if (count($datAux)) {
                $mayorista = $datAux[0];
            }
        }
        $arrDocs = $this->slogiticaDoc->devuelveIddocByidestructura(
                'ordenServicioLOG', $this->idestructura, LogisticaGlobal::SUBSISTEMA_TALLERES
        );
        if($arrDocs->iddoc){
            $params['notIn'] = $this->getConDocOrigen($arrDocs->iddoc);
            $params['facturacion'] = 1;
            $params['mayorista'] = $mayorista;
            $params['fechacierre'] = $this->fechacontable;
            $ordenService = new OrdenTrabajoTalleresService();
            if ($params['all']) {
                $params['filtrado'] = 1;
            }
            $datas = $ordenService->getOrdenesTrabajoCerradas($params);
            foreach ($datas['datos'] as &$data) {
                $data['idcliente'] = $data['idcliente'];
                $data['tipocliente'] = 1;
                $data['servicios'] = 1;
                $data['cant_clientes'] = 1;
                $data['productos'] = count($data['materialessinactividad']);
                $data['tipodocumento'] = $arrDocs->denominacion; //cambiar denominacion por sigla
            }
            $this->cargarClientesDocumentos($datas['datos']);
            return $datas;
        }
    }

    /*public function getConDocOrigen($iddoc)
    {
        $query = new Doctrine_Query();
        $array = $query->select('dd.iddocumento')
                ->from('DatDocumento dd')
                ->innerJoin(
                        'dd.DatDocumentoPadre ddp on dd.iddocumento = ddp.idpadre'
                )
                ->where('dd.iddoc = ? and ddp.iddocumento in (SELECT df.idfactura FROM DatDocfactura df)', array($iddoc))
                ->fetchArray();
        $result = array();
        foreach ($array as $i => $a) {
            $result[$i] = $a['iddocumento'];
        }
        return $result;
    }*/
	
	public function getConDocOrigen($iddoc)
    {
        $query = new Doctrine_Query();
        $array = $query->select('dd.iddocumento')
                ->from('DatDocumento dd')
                ->innerJoin(
                        'dd.DatDocumentoPadre ddp on dd.iddocumento = ddp.idpadre'
                )
                ->where('dd.iddoc = ? and ddp.iddocumento in (SELECT df.idfactura FROM DatDocfactura df INNER JOIN df.DatDocumento d WHERE d.estado <> 7 and d.estado <> 5)', array($iddoc))
                ->fetchArray();
        $result = array();
        foreach ($array as $i => $a) {
            $result[$i] = $a['iddocumento'];
        }
        return $result;
    }

    /**
     * Funcion que permite cargar los doc de Pedidos
     *
     * @return array Retorna la configuracion segun la estructura
     */
    public function cargarPedidos($params)
    {
        $pedidoService = new PedidoService();
        $datas = $pedidoService->cargarDocPedido($params);
        return $datas;
    }

    /**
     * Funcion que permite cargar los doc de Distribucion
     *
     * @return array Retorna la configuracion segun la estructura
     */
    public function cargarDistribucion($params)
    {
        $mayorista = false;
        if (is_numeric($params['idoperacion'])) {
            $sql = "select oper.vm from mod_logfacturacion.dat_operacionsubsistema oper 
                    where oper.idnomoperaciones = {$params['idoperacion']} and oper.idestructura = {$this->global->Estructura->idestructura}";
            $datAux = $this->doctrineHelper->getConnection()->execute($sql)->fetchAll(PDO::FETCH_COLUMN);
            if (count($datAux)) {
                $mayorista = $datAux[0];
            }
        }
        unset($params['idoperacion']);
        $distribucionService = new DistribucionService();
        $params['estado'] = EstadoDocumentoModel::ESTADO_APROBADO;
        $params['entragara'] = 1;
        $params['facturacion'] = true;
        $params['ejecucion'] = 1;
        $params['salidaporfactura'] = 1;
        $params['filtraiddoc'] = true;
        $params['mayorista'] = $mayorista;
        if(!$params['all']){
            $params['idusuario'] = $this->idusuario;
        } else {
            unset($params['iddeposito']);
        }
        $fecha = $this->configuracionHelper->getFechaContableSubsistemaObj($this->global->Estructura->idestructura,
            LogisticaGlobal::SUBSISTEMA_FAC);
        $params['hasta'] = $fecha->fecha;
        $reserva = LogisticaGlobal::__init()->estaAperturadoSubsistema(LogisticaGlobal::SUBSISTEMA_RESERVA);
        if ($reserva) {
            $cfgReserva = new ConfreservaService();
            $depReserva = $cfgReserva->getDepositosSubordinados();
            if(count($depReserva) > 0){
                $params['depositoreserva'] = $depReserva;
            }
        }
        $datas = $distribucionService->devolverDocDistribucion($params);
        foreach ($datas['datos'] as &$data) {
            foreach ($data['arrayClientes'] as $cliente) {
                $data['depositos'][$cliente] = $distribucionService->getDepositosDistribucion(
                        $data['iddocumento'], $cliente
                );
            }
        }
        return $datas;
    }

    /**
     * Funcion que permite cargar los clientes del doc de Distribucion
     *
     * @return array Retorna la los clientes segun el doc
     */
    public function getClientesByDocumentos($params)
    {
        $distribucionService = new DistribucionService();
        $params['iddocumento'] = json_decode($params['arrDocumentos']);
        $params['idclientes'] = json_decode($params['idclientes']);
        //$params['facturacion'] = 1;
        $datas = $distribucionService->devolverClientes($params);
        /* $datas = $distribucionService->devolverDocDistribucion($params);
          $result = array();
          $cantidad = $datas['cantidad'];
          foreach ($datas['datos'] as $dats) {
          if (array_keys($arrDocumentos, $dats['iddocumento'])) {
          foreach ($dats['arrayClientes'] as $idcliente) {
          $arrIcliente = $this->configuracionHelper->getClientesProveedorByParams(
          $idcliente, $this->global->Estructura->idestructura, true,
          false, false,null,null,null
          )['datos'];
          if (count($arrIcliente) > 0) {
          $needle = array('idcliente'=>$arrIcliente[0]['idclientesproveedores'],
          'nombre'=>$arrIcliente[0]['nombre']);
          if(!in_array($needle, $result, true)){
          $result[] = array('idcliente'=>$arrIcliente[0]['idclientesproveedores'],
          'nombre'=>$arrIcliente[0]['nombre']);
          }
          }
          }
          }
          } */
        //return array('datos' => $result, 'cantidad' => count($result));
        return $datas;
    }

    public function eliminarProdFactura($movimientos, $idsubsistema, $documento)
    {
        if (parent::verificarTiendaVirtual($documento)) {
            if(is_array($documento)){
                foreach($documento as $doc){
                    $this->productoModel->eliminarProdFactura(
                        $movimientos, $idsubsistema, $doc
                    );
                    $this->actualizarImporte($doc);
                    return true;
                }
            } else {
                $this->productoModel->eliminarProdFactura(
                    $movimientos, $idsubsistema, $documento
                );
                $this->actualizarImporte($documento);
                return $this->getImporteTotalDocumento($documento);
            }
        }
    }

    public function eliminarServFactura($servicios, $documento = false)
    {
        $this->servicioModel->eliminarServFactura($servicios, $documento);
        $this->actualizarImporte($documento);
        return $this->getImporteTotalDocumento($documento);
    }

    public function eliminarProdServicio($productos)
    {
        $stringarray = implode(',', $productos);
        $prodEliminar = Doctrine::getTable('DatProdServicios')->findByDql(
            "idprodservicio in ({$stringarray})"
        );
        $idservicio = $prodEliminar[0]->idelementofactura;
        $servicio = Doctrine::getTable('DatElementosFactura')
            ->find($idservicio);
        $iddocumento = $servicio->idfactura;
        if($servicio->preciopromedio == 1){
            $collDesgServ = new Doctrine_Collection('DatDesgloselemento');
            $restar = array();
            $desgloses = Doctrine::getTable('DatDesglosemonedaprodserv')
                ->findByDql(
                    "idprodservicio in ({$stringarray})"
                );
            foreach($desgloses as $desg){
                $restar[$desg->idmoneda] += $desg->precio;
            }

            $desgSC = Doctrine::getTable('DatDesgloselemento')
                ->findByDql(
                    'idelementofactura = ? and idmoneda = ?',
                    array($idservicio, $this->_dualidadMonedas->idmoneda)
                );
            $desgSC[0]->preciotarifa -= $restar[$this->_dualidadMonedas->idmoneda];
            $collDesgServ->add($desgSC[0]);
            if ($this->_dualidadMonedas->idmonedaalternativa) {
                $desgSA = Doctrine::getTable('DatDesgloselemento')
                    ->findByDql(
                        'idelementofactura = ? and idmoneda = ?',
                        array($idservicio, $this->_dualidadMonedas->idmonedaalternativa)
                    );
                $desgSA[0]->preciotarifa -= $restar[$this->_dualidadMonedas->idmonedaalternativa];
                $collDesgServ->add($desgSA[0]);
            }
            $collDesgServ->save();
            $servicio->preciotarifabase -= $restar[$this->_dualidadMonedas->idmoneda];
            $servicio->save();
        }
        $dql = Doctrine_Query::create()->delete()
            ->from('DatProdServicios')
            ->whereIn(
                'idprodservicio', $productos
            )->execute();
        $this->actualizarImporte($iddocumento);
        return $this->getImporteTotalDocumento($iddocumento);
    }

    public function getDocumentosAft($params)
    {
        $service = new DocumentoActivoService();
        $documentos = $service->getDocsBajaVentaDadoIdOperacion($params['idoperacion']);
        $this->cargarClientesDocumentos($documentos['datos']);
        return $documentos;
    }

    public function generarFacturaDeOferta($documentos)
    {
        try {
            foreach ($documentos as $doc) {
                $arrayParams = array();
                $documento = $this->findDocumento($doc)
                        ->toArray();
                $documentoFactura = Doctrine::getTable('DatDocfactura')
                        ->find(
                        $doc
                );
                $preffactura = Doctrine::getTable('DatFacturaPrefactura')
                        ->find(
                        $doc
                );
                $datosTransportador = Doctrine::getTable(
                                'DatDocFacturaTransportacion'
                        )
                        ->find($doc);
                $parametros = $documentoFactura->toArray();
                unset($parametros['idfactura']);
                $productos = $this->productoModel->getProductos($doc, $parametros['idsubsistema'], false, false, true);
                $servicios = $this->servicioModel->getServicios($doc, $parametros);
                $parametros = array_merge(
                        $parametros, $datosTransportador->toArray()
                );
                $parametros['oferta'] = 0;
                $parametros['tipoDoc'] = 2;
                $parametros['deoferta'] = 1;
                $parametros['observaciones'] = $documento['observaciones'];
                $parametros['idoperacion'] = $documento['idoperacion'];
                $parametros['docorigen'] = array($doc);
                //$parametros['depositoAreas'] = DatAreaFactura::getAreasByIdfacturaSql($doc);
                //$this->getProdOferta($documentoFactura, $parametros);
                if ($parametros['idsubsistema'] == LogisticaGlobal::SUBSISTEMA_INV) {
                    $pedido = new PedidoService();
                }//else{
                $objProdServ = new DatProdServNomenclador();
                //}
                foreach ($productos as $i => &$prod) {
                    /* if($prod['idmovimiento']){
                      if(!isset($arrayParams[$prod['idestructura']])){
                      $parametros['iddeposito'] = $prod['idestructura'];
                      $arrayParams[$prod['idestructura']] = $parametros;
                      }
                      $prodFact = $objProdFactura->getProdFactura(
                      $prod['idmovimiento']
                      )->toArray();
                      unset($prod['idmovimiento']);
                      unset($prod['iddocumento']);
                      $prod['idtipoprecio'] = $prodFact[0]['idtipoprecio'];
                      $prod['preciobase'] = $prodFact[0]['preciobase'];
                      $prod['docorigen'] = array($doc);
                      $arrayParams[$prod['idestructura']]['productos'][] = $prod;
                      //$parametros['productos'][$i] = $prod;
                      }else{ */
                    $prodFact = $objProdServ->getProdServicio($prod['idelementofactura'])
                            ->toArray();
                    unset($prod['idelementofactura']);
                    $prod['idtipoprecio'] = $prodFact[0]['idtipoprecio'];
                    $prod['docorigen'] = array($doc);
                    if (isset($pedido)) {
                        $prod['idproducto'] = $prod['idindicador'];
                        $datosCmptoPf[$i] = array('idindicador' => $prod['idindicador'], 'enprocesonuevo' => $prod['cantidad'],
                                    'iddocorigen' => $doc, 'enprocesoviejo' => 0,);
                    }
                    $parametros['productos'][$i] = $prod;
                    $arrayParams[0] = $parametros;
                    //}
                }
                if (count($arrayParams) == 0) {
                    $arrayParams[0] = $parametros;
                }
                foreach ($arrayParams as $k => $param) {
                    if (count($servicios) > 0) {
                        $param['servicios'] = $servicios;
                        $servicios = array();
                    }
                    $param['reservaprecio'] = $preffactura->reservaprecio;
                    if (isset($pedido)) {
                        $iddocumento = $pedido->adicionarPedido($param['idcliente'], $param['productos'], $param['servicios'], $doc);
                        $pedidoGen = Doctrine::getTable('DatDocumento')->find($iddocumento);
                        $datosDocGen = array('numero' => $pedidoGen->numeroref);
                    } else {
                        unset($param['iddoc']);
                        $datosDocGen = $this->adicionarFactura($param);
                    }
                }
                if (isset($datosCmptoPf) && count($datosCmptoPf) > 0) {
                    $this->productoModel->actualizarCumpPrefByParams($datosCmptoPf);
                }
                //$documentoFactura->oferta = 2;
                $documentoFactura->save();
            }
            return array('success'=>true, 'nrogenerado' => $datosDocGen['numero']);
        } catch (Doctrine_Exception $e) {
            return false;
        }
    }

    public function generaPedidoDeOferta($documentos)
    {
        try {
            foreach ($documentos as $doc) {
                $arrayParams = array();
                $documento = $this->findDocumento($doc)
                    ->toArray();
                $documentoFactura = Doctrine::getTable('DatDocfactura')
                    ->find(
                        $doc
                    );
                $preffactura = Doctrine::getTable('DatFacturaPrefactura')
                    ->find(
                        $doc
                    );
                $datosTransportador = Doctrine::getTable(
                    'DatDocFacturaTransportacion'
                )
                    ->find($doc);
                $parametros = $documentoFactura->toArray();
                unset($parametros['idfactura']);
                $productos = $this->productoModel->getProductos($doc, $parametros['idsubsistema'], false, false, true);
                $servicios = $this->servicioModel->getServicios($doc, $parametros);
                $parametros = array_merge(
                    $parametros, $datosTransportador->toArray()
                );
                $parametros['oferta'] = 0;
                $parametros['tipoDoc'] = 2;
                $parametros['deoferta'] = 1;
                $parametros['observaciones'] = $documento['observaciones'];
                $parametros['idoperacion'] = $documento['idoperacion'];
                $parametros['docorigen'] = array($doc);

                $pedido = new PedidoService();

                $objProdServ = new DatProdServNomenclador();
                foreach ($productos as $i => &$prod) {
                    $prodFact = $objProdServ->getProdServicio($prod['idelementofactura'])
                        ->toArray();
                    unset($prod['idelementofactura']);
                    $prod['idtipoprecio'] = $prodFact[0]['idtipoprecio'];
                    $prod['docorigen'] = array($doc);
                    if (isset($pedido)) {
                        $prod['idproducto'] = $prod['idindicador'];
                        $datosCmptoPf[$i] = array('idindicador' => $prod['idindicador'], 'enprocesonuevo' => $prod['cantidad'],
                            'iddocorigen' => $doc, 'enprocesoviejo' => 0,);
                    }
                    $parametros['productos'][$i] = $prod;
                    $arrayParams[0] = $parametros;
                    //}
                }
                if (count($arrayParams) == 0) {
                    $arrayParams[0] = $parametros;
                }
                foreach ($arrayParams as $k => $param) {
                    if (count($servicios) > 0) {
                        $param['servicios'] = $servicios;
                        $servicios = array();
                    } else {
                        $param['servicios'] = array();
                    }
                    $param['reservaprecio'] = $preffactura->reservaprecio;

                    $pedidoAdd = $pedido->adicionarPedido($param['idcliente'], $param['productos'], $param['servicios'], $doc);
                    $pedidoGen = Doctrine::getTable('DatDocumento')->find($pedidoAdd['iddocumento']);
                    $datosDocGen = array('numero' => $pedidoGen->numeroref);
                }
                if (isset($datosCmptoPf) && count($datosCmptoPf) > 0) {
                    $this->productoModel->actualizarCumpPrefByParams($datosCmptoPf);
                }
                //$documentoFactura->oferta = 2;
                $documentoFactura->save();
            }
            return array('success'=>true, 'nrogenerado' => $datosDocGen['numero']);
        } catch (Exception $e) {
            return false;
        }
    }

    public function generaDistribucionFactura($documentos)
    {
        try {
            foreach ($documentos as $doc) {
                $arrayParams = array();
                $documento = $this->findDocumento($doc)
                    ->toArray();
                $documentoFactura = Doctrine::getTable('DatDocfactura')
                    ->find(
                        $doc
                    );
                $preffactura = Doctrine::getTable('DatFacturaPrefactura')
                    ->find(
                        $doc
                    );
                $datosTransportador = Doctrine::getTable(
                    'DatDocFacturaTransportacion'
                )
                    ->find($doc);
                $parametros = $documentoFactura->toArray();
                unset($parametros['idfactura']);
                $productos = $this->productoModel->getProductos($doc, $parametros['idsubsistema'], false, false, true);
                $servicios = $this->servicioModel->getServicios($doc, $parametros);
                $parametros = array_merge(
                    $parametros, $datosTransportador->toArray()
                );
                $parametros['oferta'] = 0;
                $parametros['tipoDoc'] = 2;
                $parametros['deoferta'] = 1;
                $parametros['observaciones'] = $documento['observaciones'];
                $parametros['idoperacion'] = $documento['idoperacion'];
                $parametros['docorigen'] = array($doc);
                //$parametros['depositoAreas'] = DatAreaFactura::getAreasByIdfacturaSql($doc);
                //$this->getProdOferta($documentoFactura, $parametros);
                if ($parametros['idsubsistema'] == LogisticaGlobal::SUBSISTEMA_INV) {
                    $respuesta = Doctrine_Manager::connection()->fetchAll(
                        "SELECT * FROM mod_logfacturacion.f_generardistribucionfactura(
                          {$doc},{$this->global->Perfil->idusuario},{$documento['idestructuracomun']}
                        )"
                    );
                    $datosDocGen = array('numeroref'=>$respuesta[0]['f_generardistribucionfactura']);
                } else{
                    $objProdServ = new DatProdServNomenclador();
                    foreach ($productos as $i => &$prod) {

                        $prodFact = $objProdServ->getProdServicio($prod['idelementofactura'])
                            ->toArray();
                        //unset($prod['idelementofactura']);
                        $prod['idtipoprecio'] = $prodFact[0]['idtipoprecio'];
                        $prod['docorigen'] = array($doc);
                        $parametros['productos'][$i] = $prod;
                        $arrayParams[0] = $parametros;
                        //}
                    }
                    if (count($arrayParams) == 0) {
                        $arrayParams[0] = $parametros;
                    }
                    foreach ($arrayParams as $k => $param) {
                        if (count($servicios) > 0) {
                            $param['servicios'] = $servicios;
                            $servicios = array();
                        }
                        $param['reservaprecio'] = $preffactura->reservaprecio;
                        unset($param['iddoc']);
                        $datosDocGen = $this->adicionarFactura($param);
                    }
                    if (isset($datosCmptoPf) && count($datosCmptoPf) > 0) {
                        $this->productoModel->actualizarCumpPrefByParams($datosCmptoPf);
                    }
                    //$documentoFactura->oferta = 2;
                    $documentoFactura->save();
                }

            }
            return array('success'=>true, 'nrogenerado' => $datosDocGen['numeroref']);
        } catch (Doctrine_Exception $e) {
            return false;
        }
    }

    public function getProdOferta($documento, &$parametros)
    {
        if ($documento['idsubsistema'] == LogisticaGlobal::SUBSISTEMA_INV) {
            $productos = $this->productoModel->getProductos(
                    $documento['idfactura'], $documento['idsubsistema']
            );
            foreach ($productos as $i => &$prod) {
                $prodFact = DatProdFactura::getProdFactura(
                                $prod['idmovimiento']
                        )
                        ->toArray();
                unset($prod['idmovimiento']);
                unset($prod['iddocumento']);
                $prod['idtipoprecio'] = $prodFact[0]['idtipoprecio'];
                $parametros['productos'][$i] = $prod;
            }
        } else {
            
        }
    }

    /*public function getSubsistemasFacturan($parametros = false)
    {
        $result[] = array('idsubsistema' => -2, 'denominacion' => 'S/D');
        $result[] = array('idsubsistema' => -1, 'denominacion' => "Facturaci�n");
        $inventario = LogisticaGlobal::__init()
            ->estaAperturadoSubsistema(LogisticaGlobal::SUBSISTEMA_INV);
        $talleres = LogisticaGlobal::__init()
            ->estaAperturadoSubsistema(LogisticaGlobal::SUBSISTEMA_TALLERES);
        $activosfijos = LogisticaGlobal::__init()
            ->estaAperturadoSubsistema(LogisticaGlobal::SUBSISTEMA_AFT);
        if ($inventario) {
            $result[] = array('idsubsistema' => LogisticaGlobal::SUBSISTEMA_INV, 'denominacion' => 'Inventario');
        }
        if ($talleres) {
            $result[] = array('idsubsistema' => LogisticaGlobal::SUBSISTEMA_TALLERES, 'denominacion' => 'Talleres');
        }
        if ($activosfijos) {
            $result[] = array('idsubsistema' => LogisticaGlobal::SUBSISTEMA_AFT, 'denominacion' => 'Activos fijos');
        }
        if ($parametros['idsubsistema']) {
            foreach ($result as $r) {
                if ($r['idsubsistema'] == $parametros['idsubsistema']) {
                    return $r;
                }
            }
        }
        return $result;
    }*/
	
	public function getSubsistemasFacturan($parametros = false)
	{
		$result[] = array('idsubsistema' => -2, 'denominacion' => 'S/D');
		$result[] = array('idsubsistema' => -1, 'denominacion' => "Facturaci&oacute;n");
		$inventario = LogisticaGlobal::__init()
			->estaAperturadoSubsistema(LogisticaGlobal::SUBSISTEMA_INV);
		$talleres = LogisticaGlobal::__init()
			->estaAperturadoSubsistema(LogisticaGlobal::SUBSISTEMA_TALLERES);
		$activosfijos = LogisticaGlobal::__init()
			->estaAperturadoSubsistema(LogisticaGlobal::SUBSISTEMA_AFT);
		if ($inventario) {
			$result[] = array('idsubsistema' => LogisticaGlobal::SUBSISTEMA_INV, 'denominacion' => 'Inventario');
		}
		if ($talleres) {
			$result[] = array('idsubsistema' => LogisticaGlobal::SUBSISTEMA_TALLERES, 'denominacion' => 'Talleres');
		}
		if ($activosfijos) {
			$result[] = array('idsubsistema' => LogisticaGlobal::SUBSISTEMA_AFT, 'denominacion' => 'Activos fijos');
		}
		if ($parametros['idsubsistema']) {
			foreach ($result as $r) {
				if ($r['idsubsistema'] == $parametros['idsubsistema']) {
					return $r;
				}
			}
		}
		return $result;
	}

    public function getFacturasCliente($parametros, $dql)
    {
        return $this->docfatura->getFacturasCliente($parametros, $dql);
    }

    public function getDatosProdConfirmar($iddocumento, $subsistema)
    {
        return $this->productoModel->getDatosProdConfirmar($iddocumento, $subsistema);
    }

    public function getDatosServConfirmar($iddocumento, $subsistema)
    {
        return $this->servicioModel->getDatosServConfirmar($iddocumento, $subsistema);
    }

    /*
     * Trabajo con los numeros de control
     * */

    private function formatNumber($number)
    {
        if (is_string($number)) {
            $numbersPieces = explode("-", $number);
            $formattedNumber = "";
            $formattedNumber = implode($formattedNumber, $numbersPieces);
            return (int) $formattedNumber;
        } elseif (is_numeric($number)) {
            return (int) $number;
        }
        return false;
    }

    public function buildNumbers($numbers)
    {
        $formattedNumbers = Array();
        $arrNumbers = Array();
        if (is_string($numbers)) {
            $arrNumbers = explode(",", $numbers);
        } elseif (is_array($numbers)) {
            $arrNumbers = $numbers;
        }
        foreach ($arrNumbers as $number) {
            if (strpos($number, ":") != false) {
                $intervalPieces = explode(":", $number);
                $start = $this->formatNumber($intervalPieces[0]);
                $limit = $this->formatNumber($intervalPieces[1]);
                if ($limit < $start) {
                    $aux = $start;
                    $start = $limit;
                    $limit = $aux;
                }
                $formattedInterval = range($start, $limit);
                foreach ($formattedInterval as $interval) {
                    if (!in_array($interval, $formattedNumbers)) {
                        $formattedNumbers[] = $interval;
                    }
                }
            } else {
                $formattedNumber = $this->formatNumber($number);
                if (!in_array($formattedNumber, $formattedNumbers)) {
                    $formattedNumbers[] = $formattedNumber;
                }
            }
        }
        return $formattedNumbers;
    }

    private function buildControlNumbers($numbers)
    {
        if (is_array($numbers) && count($numbers)) {
            $controlNumbers = Array();
            foreach ($numbers as $number) {
                $number = $this->formatControlNumber($number);
                if (!in_array($number, $controlNumbers)) {
                    $controlNumbers[] = $number;
                }
            }
            return $controlNumbers;
        }
        return array();
    }

    private function formatControlNumber($number, $start = false)
    {
        $completion = array(0 => "", 1 => "0", 2 => "00", 3 => "000", 4 => "0000", 5 => "00000", 6 => "000000", 7 => "0000000",
                    8 => "00000000", 9 => "000000000", 10 => "0000000000");
        if (is_numeric($number)) {
            $number = (string) $number;
        }
        if (is_string($number)) {
            $length = strlen($number);
            $difference = 10 - $length;
            $auxNumber = $completion[$difference] . $number;
            $startAuxNumber = (!$start) ? substr($auxNumber, 0, 2) : $start;
            $endAuxNumber = substr($auxNumber, 2, 8);
            $controlNumber = $startAuxNumber . "-" . $endAuxNumber;
            return $controlNumber;
        }
        return false;
    }

    public function verificarNumerosControl($numbers)
    {
        $array = $this->dovolverArregloNumeros($numbers);
        $array['comprobante'] = 1;
        $array['idestructuracomun'] = $this->global->Estructura->idestructura;
        $array['asignado'] = 1;
        $array['anulado'] = 0;
        $array['pdo'] = array(PDO::FETCH_COLUMN, 1);
        $arrayNrosComp = $this->numeroCtl->devolverNumcontrol($array);
        if (count($arrayNrosComp) > 0) {
            $array['excluir'] = "'" . implode("','", $arrayNrosComp) . "'";
        }
        $array['comprobante'] = 0;
        $array['pdo'] = array(PDO::FETCH_BOTH, 1);
        $arrayNrosAsigSinComp = $this->numeroCtl->devolverNumcontrol($array);
        /* unset($array['asignado']) ;
          $array['anulado'] = 1;
          $arrayNrosAnulados = $this->numeroCtl->devolverNumcontrol($array); */
        $array['pdo'] = array(PDO::FETCH_COLUMN);
        $idfacturas = $this->numeroCtl->devolverIdfacturas($array);
        unset($array['asignado'], $array['pdo']);
        //$array['anulado'] = 0;
        $array['fecha'] = $this->fechacontable;
        $cantNumerosAnulados = $this->numeroCtl->anularNumeros($array);
        if (count($idfacturas) > 0) {
            DatDocFactura::actualizarNrosControlAnulados($idfacturas);
        }
        $respuesta = Array("nrosconcomprob" => $arrayNrosComp, "nroscasigsincomp" => $arrayNrosAsigSinComp,
            "cantnumanulados" => ($cantNumerosAnulados > 0) ? $cantNumerosAnulados : 0);
        return $respuesta;
        /* if(count($searchAutomatico['notDb'])>0)
          $respuesta['noexisten'] = $searchAutomatico['notDb'];
          if(count($respuesta['anular']) == count($formattedNumbers)){
          return $this->anularNumerosControl($respuesta['anular']);

          }else{
          return $respuesta;
          } */
        //$collection->save();
    }

    public function dovolverArregloNumeros($numbers)
    {
        $arrNumbersResult = Array();
        if (is_string($numbers)) {
            $arrNumbers = explode(",", $numbers);
        } elseif (is_array($numbers)) {
            $arrNumbers = $numbers;
        }
        foreach ($arrNumbers as $number) {
            if (strpos($number, ":") != false) {
                $intervalPieces = explode(":", $number);
                $arrNumbersResult ['rangos'][] = array('inicio' => $intervalPieces[0], 'fin' => $intervalPieces[1]);
            } else {
                $arrNumbersResult ['nros'] .= ($arrNumbersResult ['nros']) ? ",'" . $number . "'" : "'" . $number . "'";
            }
        }
        return $arrNumbersResult;
    }

    function buscarNumerosControl($numbers)
    {
        
    }

    private function procesarNumeroControl($number, &$respuesta)
    {
        $anulado = $this->searchControlNumber($number);
        if (!$anulado) {
            $asignado = $this->buscarEnFacturas($number);
            if (!$asignado) {
                $respuesta['anular'][] = array('nrocontrol' => $number);
            } else {
                if ($asignado[0]['tienecomprobante'] == 1) {
                    $respuesta['comprobante'][] = $number;
                } else {
                    $respuesta['usados']['nrocontrol'][] = $number;
                    $respuesta['usados']['idfactura'][] = $asignado[0]['idfactura'];
                }
            }
        } else {
            $respuesta['anulados'][] = $number;
        }
    }

    public function buscarEnFacturas($number)
    {
        $query = new Doctrine_Query();
        $facturas = $query->select('df.idfactura, df.nrocontrol, df.nrofactura, dd.tienecomprobante')
                ->from('DatDocfactura df')
                ->innerJoin('df.DatDocumento dd')
                ->where('df.nrocontrol = ? and dd.idestructuracomun = ?', array($number, $this->idestructura))
                ->fetchArray();
        return (count($facturas) > 0) ? $facturas : false;
    }

    public function searchControlNumber($number)
    {
        $query = Doctrine_Query::create();
        $control = $query->select('n.nrocontrol')
                ->from(
                        'DatNrocontrolanulados n'
                )
                ->where('n.nrocontrol = ? and n.idestructura = ?', array($number, $this->idestructura))
                ->fetchArray();
        if (count($control) > 0) {
            return true;
        }
        return false;
    }

    public function getPuntosImprecion($parametros = false)
    {
        $params['idestructuracomun'] = $this->idestructura;
        $objPTrabajo = new NomPuestotrabajo();
        $datos = $objPTrabajo->loadPuestoTrabajo($params);
        return $datos['datos'];
    }

    public function asignarNumerosControl($parametros)
    {
        $parametros['iddoc'] = $this->iddoc;
        $numeros = $this->GetNrosControlSinAsignar($parametros);
        if ($numeros['0'] != '') {
            if ($parametros['cantnucontrol'] > 1) {
                $arrayIntervalos = array('inicio' => $numeros['0'], 'fin' => $numeros[$parametros['cantnucontrol'] - 1]);
            } else {
                $arrayIntervalos = array('inicio' => $numeros['0']);
            }
        } else {
            $arrayIntervalos = array('inicio' => null, 'fin' => null);
        }
        return $arrayIntervalos;
    }

    private function getNroControlToAsig($arrValores, $nrocontrol)
    {
        foreach ($arrValores as $valor) {
            if ($valor == $nrocontrol) {
                $nrocontrol++;
            } else {
                return $nrocontrol;
            }
        }
        return $nrocontrol;
    }

    function GetNumerosDocumentosAsignar($iddocumentos)
    {
        $iddocumentos = (is_array($iddocumentos)) ? implode(',', $iddocumentos) : $iddocumentos;
        $conn = Doctrine_Manager::connection();
        $query = "select d.idseriedocentidad, d.idfactura, (
                    select max((CASE WHEN d1.nrofactura IS NULL THEN 0 ELSE
                      cast(d1.nrofactura as NUMERIC) END)) from mod_logfacturacion.dat_docfactura d1
                      inner join mod_logistica.dat_documento dd1 on dd1.iddocumento = d1.idfactura
                      where d1.idseriedocentidad = d.idseriedocentidad and dd1.iddoc = dd.iddoc 
                      and dd1.idejercicio = {$this->_idejercicio}
                    ) as numedocumeno, sd.nrodocumentoinicial
                  from mod_logfacturacion.dat_docfactura d
                  inner join mod_logistica.dat_documento dd on dd.iddocumento = d.idfactura
                  inner join mod_logfacturacion.dat_seriedocentidad se on
                    se.idseriedocentidad = d.idseriedocentidad
                  inner join mod_logfacturacion.nom_seriedocumento sd on
                    se.idseriedocumento = sd.idseriedocumento
                  left join mod_logfacturacion.dat_numerocontrol nc on
                    nc.idseriedocentidad = se.idseriedocentidad
                  where d.idfactura in ($iddocumentos)
                  group by d.idseriedocentidad, d.idfactura, sd.nrodocumentoinicial, dd.iddoc";
        $result = $conn->execute($query)
                ->fetchAll(PDO::FETCH_GROUP);
        return $result;
    }

    function GetNumerosDocumentosSinSerie($iddocumentos)
    {
        $iddocumentos = (is_array($iddocumentos)) ? implode(',', $iddocumentos) : $iddocumentos;
        $conn = Doctrine_Manager::connection();
        $query = "select dd.iddoc,d.idfactura,(
                    select max((CASE WHEN d1.nrofactura IS NULL THEN 0 ELSE
                      cast(d1.nrofactura as NUMERIC) END)) from mod_logfacturacion.dat_docfactura d1
                      inner join mod_logistica.dat_documento dd1 on dd1.iddocumento = d1.idfactura
                      where dd1.iddoc = dd.iddoc and dd1.idejercicio = {$this->_idejercicio}
                    ) as numedocumeno, cast(1 as NUMERIC) as nrodocumentoinicial
                  from mod_logfacturacion.dat_docfactura d
                  inner join mod_logistica.dat_documento dd on dd.iddocumento = d.idfactura
                  where d.idfactura in ($iddocumentos)
                  group by d.idfactura, dd.iddoc";
        $result = $conn->execute($query)
                ->fetchAll(PDO::FETCH_GROUP);
        return $result;
    }

    private function GetNrosControlSinAsignar($parametros, $variante = false)
    {
        /* $query = "SELECT d.idsecuenciapuestotrabajo, d.nroinicio as originicio, d.nrofin  as origfin,
          COALESCE((SELECT max(cast(replace(f.nrocontrol, '-', '') as int))
          FROM mod_logfacturacion.dat_docfactura f
          inner join mod_logistica.dat_documento dd on dd.iddocumento = f.idfactura
          where dd.iddoc in (".implode(',', $parametros['iddoc']).")
          and (cast(replace(f.nrocontrol, '-', '') as int)
          BETWEEN cast(replace(d.nroinicio, '-', '') as int)
          and cast(replace(d.nrofin, '-', '') as int))
          and f.nrocontrol <> ''),0) AS nroinicio,
          d.idpuestotrabajo, d.actual, cast(replace(d.nrofin, '-', '') as int) as nrofin
          FROM mod_logfacturacion.dat_secnrocontrolpuestotrabajo d
          inner join mod_logfacturacion.nom_puestotrabajo p on p.idpuestotrabajo = d.idpuestotrabajo
          WHERE d.idpuestotrabajo = {$parametros['idpuestotrabajo']}
          order by cast(replace(d.nroinicio, '-', '') as int) ASC"; */
        $select = ($variante) ? "nc.idnumerocontrol" : "nc.nrocontrol";
        $conn = Doctrine_Manager::connection();
        $query = "select $select from mod_logfacturacion.dat_numerocontrol nc
                inner join mod_logfacturacion.dat_rangonumerocontrol rn on rn.idrango = nc.idrango
                inner join mod_logfacturacion.dat_puestotrabajorango pt on pt.idrango = rn.idrango
                where pt.idpuestotrabajo = {$parametros['idpuestotrabajo']} and nc.asignado <> 1
                and nc.anulado <> 1 and nc.nrodocumento is null
                group by nc.idnumerocontrol
                order by cast(replace(nc.nrocontrol, '-', '') as int) ASC
                limit {$parametros['cantnucontrol']}";
        $result = $conn->execute($query)
                ->fetchAll(PDO::FETCH_COLUMN);
        return $result;
        /* $result = $conn->execute($query)->fetchAll(PDO::FETCH_ASSOC);
          return $result; */
    }

    public function addNumerosControl($iddocumentos, $numeroControl, $puestoimpresion, $numeroAnular = false)
    {
        $collecttion = new Doctrine_Collection("DatNumerocontrol");
        $collecDoc = new Doctrine_Collection("DatDocfactura");
        $idnumeroscontrol = $this->GetNrosControlSinAsignar(
                array('idpuestotrabajo' => $puestoimpresion, 'cantnucontrol' => count($iddocumentos)), 1
        );
        $pos = 0;
        foreach ($iddocumentos as $documento) {
            $datdocfactura = Doctrine::getTable("DatDocfactura")
                    ->find($documento);
            $datdocfactura->idnumerocontrol = $idnumeroscontrol[$pos];
            $collecDoc->add($datdocfactura);
            $datnumerocontrol = Doctrine::getTable("DatNumerocontrol")
                    ->find($idnumeroscontrol[$pos]);
            $datnumerocontrol->nrodocumento = $datdocfactura->nrofactura;
            $nroCont = $datnumerocontrol->nrocontrol;
            $datnumerocontrol->asignado = 1;
            $datnumerocontrol->idseriedocentidad = $datdocfactura->idseriedocentidad;
            $collecttion->add($datnumerocontrol);
            $pos++;
        }
        $collecDoc->save();
        $collecttion->save();
        return array('success' => true, 'nrocontrol' => $nroCont);
    }

    //series
    public function getSeries($parametros)
    {
        //$confFactModel = new ConfFacturacionModel();
        if ($parametros['iddoc']) {
            $iddocumentos = $parametros['iddoc'];
        } else {
            $iddocumentos = $this->objIddocFac->iddoc;
            if ($parametros['tipoDoc'] == 'conduce') {
                $iddocumentos = $this->objIddocNota->iddoc;
            }
        }
        $params = array('idestructuracomun' => $this->idestructura, 'estado' => 1, 'iddoc' => $iddocumentos);
        return $this->confFactModel->cargarSerieDocumento($params);
        /* $objNomService = new NomencladoresLogService(); */
        //return $objNomService->getSeriesDocumento($params);
    }

    /*
     * fin numeros de control
     * * */

    public function cargarActividadesExistentes($parametros)
    {
        $start = ($parametros['start']) ? $parametros['start'] : 0;
        $limit = ($parametros['limit']) ? $parametros['limit'] : 30;
        $denominacion = ($parametros['criterio']) ? $parametros['criterio'] : null;
        $filtro = ($denominacion) ? array(array('valor' => $denominacion)) : array();
        //if($parametros['idseleccionados']){
        $conn = Zend_Registry::get('conexion');
        if ($parametros['iddocumento']) {
            $idseleccionados = implode(
                    ',', $conn->execute(
                                    "SELECT distinct(da.idactividad)
             FROM mod_logfacturacion.dat_actividadesfactura da
             inner join mod_logfacturacion.dat_elementosfactura def on def.idelementofactura = da.idelementofactura
             WHERE def.idfactura = {$parametros['iddocumento']}"
                            )
                            ->fetchAll(PDO::FETCH_COLUMN)
            );
            if (count($idseleccionados) > 0) {
                $filtro[] = array('notIn' => $idseleccionados);
            }
        }
        //}
        $result = $this->serviciosPlanificacion->obtenerActividadyNorma(
                $parametros['nivel'], null, $filtro, $start, $limit, 0
        );
        return $result;
    }

    public function cargarCategoriaPrecio($parametros)
    {
        $objNomenclador = new NomencladoresLogService();
        $categorias = $objNomenclador->getQueryCategoriaPrecio();
        $categorias->addSelect('m.codigo');
        $dcp = $dcp1 = $dcp2 = $dcp3 = $dcp4 = $dcp5 = $dcp6 = '';
        if ($parametros['iddocumento']) {
            $dcp = " and dcp.idfactura = {$parametros['iddocumento']}";
            $dcp1 = " and dcp1.idfactura = {$parametros['iddocumento']}";
            $dcp2 = " and dcp2.idfactura = {$parametros['iddocumento']}";
            $dcp3 = " and dcp3.idfactura = {$parametros['iddocumento']}";
            $dcp4 = " and dcp4.idfactura = {$parametros['iddocumento']}";
            $dcp5 = " and dcp5.idfactura = {$parametros['iddocumento']}";
            $dcp6 = " and dcp6.idfactura = {$parametros['iddocumento']}";
        }
        $categorias->addSelect(
                "(
                CASE WHEN m.aplicartodos = 1 THEN m.valor ELSE (SELECT dcp.valor FROM DatCategoriaPrecioFactura dcp
                WHERE dcp.idcategoriaprecio = m.idcategoriaprecio {$dcp}) END
            ) as valor"
        );
        $categorias->addSelect(
                "(
                SELECT dcp1.idcategoriafactura FROM DatCategoriaPrecioFactura dcp1
                WHERE dcp1.idcategoriaprecio = m.idcategoriaprecio {$dcp1}
            ) as idcategoriafactura"
        );
        $categorias->addSelect(
                "(
                SELECT dcp2.idcuenta FROM DatCategoriaPrecioFactura dcp2
                WHERE dcp2.idcategoriaprecio = m.idcategoriaprecio {$dcp2}
            ) as idcuenta"
        );
        $categorias->addSelect(
            "(
                SELECT dcp3.bi FROM DatCategoriaPrecioFactura dcp3
                WHERE dcp3.idcategoriaprecio = m.idcategoriaprecio {$dcp3}
            ) as bi"
        );
        $categorias->addSelect(
            "(
                SELECT dcp4.aplicar FROM DatCategoriaPrecioFactura dcp4
                WHERE dcp4.idcategoriaprecio = m.idcategoriaprecio {$dcp4}
            ) as aplicar"
        );
        $categorias->addSelect(
            "COALESCE((
                SELECT dcp5.condicionpago FROM DatCategoriaPrecioFactura dcp5
                WHERE dcp5.idcategoriaprecio = m.idcategoriaprecio {$dcp5}
            ), 'S/D') as condicionpago"
        );
        $categorias->addSelect(
            "COALESCE((
                SELECT dcp6.noexterior FROM DatCategoriaPrecioFactura dcp6
                WHERE dcp6.idcategoriaprecio = m.idcategoriaprecio {$dcp6}
            ), m.exentoexterior) as noexterior"
        );
        //$categorias->addWhere('m.aplicartodos = 0 or m.aplicartodos is null');
        $categorias->addWhere('m.conformaprecio = ?', array(0));
        $todas = $categorias->fetchArray(); //sin limite ni inicio
        //$datosMoneda = $this->getMonedaContableAlternativa();
        $arrayIndix = array();
        /*foreach ($datosMoneda as $mo) {

        }*/
        $arrayIndix[$this->_dualidadMonedas->idmoneda] = strtolower('valor' . $this->_dualidadMonedas->codigoiso);
        if($this->_dualidadMonedas->idmonedaalternativa){
            $arrayIndix[$this->_dualidadMonedas->idmonedaalternativa] = strtolower('valor' . $this->_dualidadMonedas->codigoisoalt);
        }

        if($parametros['idmoneda']){
            $factura = Doctrine::getTable('DatDocfactura')->find($parametros['iddocumento']);
        }
        $conceptosResult = array();
        foreach ($todas as &$cat) {
            $query = new Doctrine_Query();
            $desg = $query->select('ddc.valor, ddc.idmoneda, ddc.idmonedacategoria')
                    ->from('DatDesglosecategoriapreciofactura ddc')
                    ->where('ddc.idcategoriafactura = ?', array($cat['idcategoriafactura']))
                    ->fetchArray();
            if (!count($desg)) {
                $cat[$arrayIndix[$this->_dualidadMonedas->idmoneda]] = $cat['valor'];
            }
            foreach ($desg as $d) {
                if($parametros['idmoneda'] && $cat['porciento'] != 1){
                    if ($this->_dualidadMonedas->idmonedaalternativa) {
                        if($this->_dualidadMonedas->idmonedaalternativa == $d['idmoneda']){
                            if ($parametros['idmoneda'] == $factura->idmoneda) {
                                $d['valor'] = $this->convertirPrecio(
                                    $factura->tasacambio, $factura->factorconvercion, $d['valor']
                                );
                            } else {
                                if ($factura->idtipotasa) {
                                    $parametros['tipotasa'] = $factura->idtipotasa;
                                }
                                $d['valor'] = $this->configuracionHelper->convertirImporte(
                                    $d['idmoneda'], $parametros['idmoneda'], $parametros['tipotasa'], $d['valor'], 1
                                );
                            }
                            if (is_array($d['valor'])) {
                                throw new ZendExt_Exception('LOG_LB_FAC_001');
                            }
                        }
                    } else {

                        /*if ($parametros['idmoneda'] == $factura->idmoneda) {
                            $d['valor'] = $this->convertirPrecio(
                                $factura->tasacambio, $factura->factorconvercion, $d['valor']
                            );
                        } else {
                            $d['valor'] = $this->configuracionHelper->convertirImporte(
                                $d['idmoneda'], $parametros['idmoneda'], $parametros['tipotasa'], $d['valor'], 1
                            );
                        }
                        if (is_array($d['valor'])) {
                            throw new ZendExt_Exception('LOG_LB_FAC_001');
                        }*/
                        if ($parametros['idmoneda'] == $factura->idmoneda) {
                            if ($d['idmonedacategoria'] && $d['idmonedacategoria'] != $this->_dualidadMonedas->idmoneda) {
                                /*$d['valor'] = $this->convertirPrecio(
                                    $factura->tasacambio, $factura->factorconvercion, $d['valor']
                                );*/
                            }
                        } else {
                            if ($d['idmonedacategoria'] && $d['idmonedacategoria'] != $this->_dualidadMonedas->idmoneda) {
                                if ($factura->idtipotasa) {
                                    $parametros['tipotasa'] = $factura->idtipotasa;
                                }
                                $d['valor'] = $this->configuracionHelper->convertirImporte(
                                    $d['idmoneda'], $parametros['idmoneda'], $parametros['tipotasa'], $d['valor'], 1
                                );
                            }
                        }
                        if (is_array($d['valor'])) {
                            throw new ZendExt_Exception('LOG_LB_FAC_001');
                        }
                    }
                }
                $cat[$arrayIndix[$d['idmoneda']]] = $d['valor'];
            }
            if (($cat['estado'] == 1 && ($cat['idtipo'] == 2 || $cat['idtipo'] == 0)) || $cat['valorcup'] > 0) {
                $conceptosResult[] = $cat;
            }
        }
        return array('total' => count($conceptosResult), 'datos' => $conceptosResult, 'datosAux' => $conceptosResult);
    }

    public function getNumerosControlEnF($parametros)
    {
        return $this->docfatura->getNumerosControlEnF($parametros);
    }

    public function estaEnUsoSerie($idseriedocentidad)
    {
        return $this->docfatura->estaEnUsoSerie($idseriedocentidad);
    }

    public function getOperaciones($parametros)
    {
        $query = new Doctrine_Query();
        $query->select(
                        'os.idsubsistema,
             os.idnomoperaciones,
             os.idoperacionsubsistema,
             op.denominacion as denominacion,
             os.vm as vm,
             os.idcondicionpago as idcondiciondefecto,
             op.denominacion as nombreoperacion'
                )
                ->from('DatOperacionsubsistema os');
        $query->addWhere('os.idsubsistema <> ?', array(-2));
        $query->addWhere('os.idestructura = ?', array($this->idestructura));
        if ($parametros['oferta']) {
            $query->addWhere('os.idsubsistema not in ('.implode(',', array(LogisticaGlobal::SUBSISTEMA_TALLERES,
                    LogisticaGlobal::SUBSISTEMA_AFT))
                .')');
        }
        if($parametros['mayorista']){
            $query->addWhere('os.vm = ?', array(1));
        }
        if ($parametros['idsubsistema']) {
            $query->addWhere('os.idsubsistema = ?', array($parametros['idsubsistema']));
        }
        if ($parametros['idoperacion']) {
            $query->addWhere('os.idnomoperaciones = ?', array($parametros['idoperacion']));
        }
        $operaciones = $this->configuracionHelper->addQueryJoinOperacion(
                        $query, 'os', 'op', 1
                )
                ->fetchArray();
                //print_r($operaciones);die;
        return $operaciones;
    }

    public function getTransportadoras($parametros)
    {
        $start = ($parametros['start']) ? $parametros['start'] : 0;
        $limit = ($parametros['limit']) ? $parametros['limit'] : 30;
        if ($parametros['tipo'] == 1) {
            $arrayCompleto = $this->estructuraHelper->getEntidadesByDominio($this->global->perfil->iddominio);
            $datos = array();
            if ($parametros['criterio']) {
                foreach ($arrayCompleto as $dato) {
                    if (substr_count(strtoupper($dato['text']), strtoupper($parametros['criterio'])) > 0) {
                        $datos[] = $dato;
                    }
                }
            } else {
                $datos = $arrayCompleto;
            }
            $proveedores['cantidad'] = count($datos);
            $proveedores['datos'] = array_slice(
                    $datos, $start, $limit
            );
        } else {
            if ($parametros['criterio']) {
                $filtro['nombre'] = $parametros['criterio'];
            }
            $proveedores = $this->configuracionHelper->getClientesProveedorByParams(
                    null, $this->global->Estructura->idestructura, true, true, true, $filtro, $start, $limit
            );
        }
        return $proveedores;
    }

    public function getDesgloseByIdCliente($params)
    {
        $conn = Doctrine_Manager:: connection();
        $sql = "Select dcp.* from mod_logfacturacion.dat_clientedesgloseprecio dcp
                inner join mod_logfacturacion.dat_tipoprecioentidad dpe
                on dpe.idtipoprecioentidad = dcp.idtipoprecioentidad
                where dpe.idestructuracomun = {$params['idestructuracomun']} " .
            "and dcp.idcliente = {$params['idcliente']} and dpe.idtipoprecio = {$params['idtipoprecio']}";
        $datos = $conn->execute($sql)
            ->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }

    public function setTipoPrecio($producto)
    {
        $factura = Doctrine::getTable('DatDocfactura')->find(
            (($producto->iddocumento) ? $producto->iddocumento : $producto->idfactura)
        );
        $fconv = ($factura->factorconvercion) ? $factura->factorconvercion : 1;
        $idmonedafactura = (($producto->servicio)
            ? ($factura->idmonedaserv ? $factura->idmonedaserv : $factura->idmoneda)
            : ($factura->idmonedaprod ? $factura->idmonedaprod : $factura->idmoneda) );
        $producto->idcliente = $factura->idcliente;
        $producto->idestructuracomun = $this->idestructura;
        $producto->idfactura = $factura->idfactura;
        $umSql = "select count(nv.nombre) from mod_logistica.nom_variableglobal nv 
                          where nv.nombre = 'USAR_UM_MATRIZ' and nv.valor = 'true'";
        $um = LogisticaDoctrineHelper::__init()->getConnection()->execute($umSql)->fetchAll(PDO::FETCH_COLUMN);
        $usarUm = ($um[0] > 0) ? true : false;
        $clienteMoneda = $this->isUnicaMoneda(
            array('idtipoprecio'=>$producto->idtipoprecio, 'idcliente'=>$factura->idcliente, 'idestructura'=>$this->idestructura)
        );
        if(count($clienteMoneda) > 0){
            $precioDato = $this->getPrecio($producto, $clienteMoneda[0]['idmoneda'], $idmonedafactura, $usarUm, $fconv);
        }else{
            $precioDato = $this->getPrecio($producto, false, $idmonedafactura, $usarUm, $fconv);
        }

        $arrayResult = array();
        $monedas = $this->_dualidadMonedas;
        if (isset($precioDato['datos'][$idmonedafactura])) {
            $precio = $precioDato['datos'][$idmonedafactura]['precioventa'];
        } else {
            $precio =
                ($precioDato['datos'][$monedas->idmoneda]) ? $precioDato['datos'][$monedas->idmoneda]['precioventa']
                    : number_format(0, 6, '.', '');
        }
        $precioAlt = number_format(0, 6, '.', '');
        if($monedas->idmonedaalternativa){
            $precioAlt = ($precioDato['datos'][$monedas->idmonedaalternativa])
                ? $precioDato['datos'][$monedas->idmonedaalternativa]['precioventa'] : number_format(0, 6, '.', '');
            /*if($factura->idmoneda){
                $precioAlt = $this->convertirPrecio($factura->tasacambio, $factura->factorconvercion, $precioAlt);
            }*/
        } else {
            /*if ($factura->idmoneda) {
                $arrayResult['preciocontable'] = $this->convertirPrecio($factura->tasacambio,
                    $factura->factorconvercion, $arrayResult['preciocontable']);
            }*/
        }
        $arrayResult[] = array('preciocontable' => $precio);
        $arrayResult[] = array('precioalternativo' => $precioAlt);
        return $arrayResult;
    }

    public function precioUnicaMoneda(&$datos, $idmoneda, $redondear5 = false){
        if($this->_dualidadMonedas->idmonedaalternativa){
            $tasa = $this->configuracionHelper->getTasaByMonedas(
                $this->_dualidadMonedas->idmoneda, $this->_dualidadMonedas->idmonedaalternativa, $this->_tipotasa
            );
            if ($idmoneda == $this->_dualidadMonedas->idmoneda) {
                /*$datos['datos'][$idmoneda]['precio'] += $this->convertirPrecio(
                    $tasa[0]['compra'],
                    $tasa[0]['factordeconversion'],
                    $datos['datos'][$this->_dualidadMonedas->idmonedaalternativa]['precio']
                );*/
                $datos['datos'][$idmoneda]['precioventa'] += $this->convertirPrecio(
                    $tasa[0]['compra'],
                    $tasa[0]['factordeconversion'],
                    $datos['datos'][$this->_dualidadMonedas->idmonedaalternativa]['precioventa']
                );
                //$datos['datos'][$this->_dualidadMonedas->idmonedaalternativa]['precio'] = 0;
                $datos['datos'][$this->_dualidadMonedas->idmonedaalternativa]['precioventa'] = 0;
            } else {
                /*$datos['datos'][$idmoneda]['precio'] += $this->convertirPrecio(
                    $tasa[0]['venta'],
                    $tasa[0]['factordeconversion'],
                    $datos['datos'][$this->_dualidadMonedas->idmoneda]['precio']
                );
                $datos['datos'][$this->_dualidadMonedas->idmoneda]['precio'] = 0;*/
                $datos['datos'][$idmoneda]['precioventa'] += $this->convertirPrecio(
                    $tasa[0]['venta'],
                    $tasa[0]['factordeconversion'],
                    $datos['datos'][$this->_dualidadMonedas->idmoneda]['precioventa']
                );
                $datos['datos'][$this->_dualidadMonedas->idmoneda]['precioventa'] = 0;
            }
            if ($redondear5) { //redondear 5
                $datos['datos'][$idmoneda]['precioventa'] = LogisticaObjectHelper::__init()->_roundDecimaSuperior($datos['datos'][$idmoneda]['precioventa']);
            }
        }
        $datos['precioventa'] = $datos['datos'][$this->_dualidadMonedas->idmoneda]['precioventa'];
        return $datos;
    }

    public function isUnicaMoneda($params){
        if ($this->_dualidadMonedas->idmonedaalternativa) {
            $clienteMoneda = Doctrine::getTable('DatClientemoneda')->findByDql(
                'idtipoprecio = ? and idcliente = ?',
                array($params['idtipoprecio'], $params['idcliente']/*, $params['idestructura']*/)
            );
        } else {
            $clienteMoneda = array();
        }
        return $clienteMoneda;
    }

    public function isRedondear($params){
        $clienteRedondeo = Doctrine::getTable('DatClienteredondeo')->findByDql(
            'idtipoprecio = ? and idcliente = ? and redondear = 1',
            array($params['idtipoprecio'], $params['idcliente']/*, $params['idestructura']*/)
        );
        return $clienteRedondeo;
    }

    public function getMedia($params){
        $clienteMedia = Doctrine::getTable('DatClientemedia')->findByDql(
            'idtipoprecio = ? and idcliente = ?',
            array($params['idtipoprecio'], $params['idcliente']/*, $params['idestructura']*/)
        );
        return $clienteMedia;
    }

    public function getCuentasBancarias()
    {
        $cuentas = $this->sContabilidadFinanzas->getCuentasBancarias($this->idestructura);
        foreach ($cuentas as &$cuenta) {
            $cuenta['nrocuenta'] = $cuenta['nrocuenta'] . ' - ' . $cuenta['NomMoneda']['codigoiso'];
        }
        return $cuentas;
    }

    public function formarArrayMonedas()
    {
        /*$result = array();
        foreach ($this->monedas as $moneda) {
            $result[$moneda['idmoneda']] = $moneda;
        }
        return $result;*/
    }

    public function getMonedas($params)
    {
        $result = array(array('idmoneda' => $this->_dualidadMonedas->idmoneda, 'codigoiso' => $this->_dualidadMonedas->codigoiso, 'tasa' =>
            array(array('compra' => 1, 'venta' => 1, 'factordeconversion' => '1'))
        ));
        $monedas = $this->getMonedasEntidad();
        foreach ($monedas as $moneda) {
            if (!$moneda['contable'] && !$moneda['alternativa']) {
                if ($this->dualidad == 1) {
                    $tasa = $this->configuracionHelper->getTasaByMonedas(
                        $this->_dualidadMonedas->idmonedaalternativa, $moneda['idmoneda'], $params['tipotasa']
                    );
                    if (empty($tasa)) {
                        $moneda['tasa'] = 0;
                    } else {
                        $moneda['tasa'] = $tasa;
                    }
                } else {
                    $tasa = $this->configuracionHelper->getTasaByMonedas(
                        $this->_dualidadMonedas->idmoneda, $moneda['idmoneda'], $params['tipotasa']
                    );
                    if (empty($tasa)) {
                        $moneda['tasa'] = 0;
                    } else {
                        $moneda['tasa'] = $tasa;
                    }
                }
                $result[] = $moneda;
            }
        }
        return $result;
    }

    public function convertirPrecio($tasaCambio, $factorConv, $importe, $inverso = false)
    {
        if(!$inverso)
            $calc = ($importe / $factorConv) * $tasaCambio;
        else
            $calc = ($importe / $tasaCambio) * $factorConv;
        return $calc;
    }

    public function eliminarLote($parametros, $afecta)
    {
        $serviceLote = new LoteService();
        $cantidad = 0;
        $lotesMod = array();
        foreach ($parametros as &$movLote) {
            $movLote = (array) $movLote;
            $cantidad += $movLote['cantidad'];
            $lotesMod[] = $movLote['idmovlote'];
        }
        $dml = Doctrine::getTable('DatMovlote')
                ->find($parametros[0]['idmovlote']);
        $mov = Doctrine::getTable('DatMovimientos')
                ->find($dml->idmovimiento);
        $prod = Doctrine::getTable('DatProductoLogistica')
                ->find($mov->idproducto);
        $documento = Doctrine::getTable('DatDocfactura')
                ->find($mov->iddocumento);
        $cantidadRestante = $this->getCantidadLotes($dml->idmovimiento, $lotesMod);
        $cantidad += $cantidadRestante;
        $docsOrigen = $this->getDocOrigen($mov->iddocumento);
        $arrayDocsOrigen = array();
        foreach ($docsOrigen as $doc) {
            $arrayDocsOrigen[] = $doc['idpadre'];
        }

        $arrayProductos = array(
            'idproducto' => $parametros[0]['idproducto'], 'idindicador' => $prod->idindicador,
            'iddocorigen' => $arrayDocsOrigen, 'enprocesonuevo' => $cantidadRestante, 'enprocesoviejo' => $cantidad,
            'entregado' => 0
        );
        $datosCmpto['productos'][0] = $arrayProductos;
        $datosCmpto['idcliente'] = $documento->idcliente;
        $serviceLote->eliminarLote($parametros, (array) $afecta);
        $prodOrdenModel = new ProdordenModel();
        $prodOrdenModel->actualizarCumplimientoByParams($datosCmpto);
        return true;
    }

    public function getImporteDocumento($iddocumento, $moneda)
    {
        new DatProdFactura();
        $importeParcial = 0;
        /*$importe = $this->doctrineHelper->query(
            "SELECT COALESCE(SUM(
                          CASE WHEN dpf.importe > 0 THEN dpf.importe ELSE
                          (dmm.precio * abs(coalesce(dpf.cantidadfactura,0) - m.cantidad))
                          END
                ),0) as importe FROM DatMovimientos m
                INNER JOIN m.DatMovmoneda dmm
                INNER JOIN m.DatProdFactura dpf
                 WHERE m.iddocumento = {$iddocumento} and dmm.idmoneda = {$moneda}"
        )
            ->getFirst()
            ->toArray();*/
        $importe = $this->doctrineHelper->query(
                        "SELECT COALESCE(SUM(
                          CASE WHEN dpf.importe > 0 THEN dpf.importe ELSE 
                          (CASE WHEN (dmm.precio > 0 OR m.cantidad > 0) THEN
                           (CASE WHEN dmm.precio <> COALESCE(dpf.preciofactura,0) THEN abs(dmm.precio-COALESCE(dpf.preciofactura,0) )
                            ELSE dpf.preciofactura END)*(CASE WHEN m.cantidad > 0 THEN m.cantidad ELSE 
                            CASE WHEN dmm.precio <> dpf.preciofactura THEN dpf.cantidadfactura ELSE 0 END                           
                           END) END)
                          END      
                ),0) as importe FROM DatMovimientos m
                INNER JOIN m.DatMovmoneda dmm
                INNER JOIN m.DatProdFactura dpf
                 WHERE m.iddocumento = {$iddocumento} and dmm.idmoneda = {$moneda}"
                )
                ->getFirst()
                ->toArray();
        $importe2 = $this->doctrineHelper->query(
                        "SELECT COALESCE(SUM(dde.preciotarifa * def.cantidad),0) as importe FROM DatElementosFactura def
                INNER JOIN def.DatProdServNomenclador dps
                INNER JOIN def.DatDesgloselemento dde
                WHERE def.idfactura = {$iddocumento} and dde.idmoneda = {$moneda} and dps.tipo = 1"
                )
                ->getFirst()
                ->toArray();

        $importe3 = $this->doctrineHelper->query(
            "SELECT COALESCE(SUM(dde.preciotarifa * def.cantidad),0) as importe FROM DatElementosFactura def
                INNER JOIN def.DatProdServNomenclador dps
                INNER JOIN def.DatDesgloselemento dde
                WHERE def.idfactura = {$iddocumento} and dde.idmoneda = {$moneda} and dps.tipo = 2"
        )
            ->getFirst()
            ->toArray();
        $importeParcial += $importe['importe'] + $importe2['importe'];
        $importes = array('productos' => ((is_numeric($importeParcial)) ? $importeParcial : 0),
                          'servicios' => ($importe3['importe']) ? $importe3['importe'] : 0);
        return $importes;
    }

    /*public function getImporteTotalDocumento($iddocumento)
    {
        $importemov = $this->doctrineHelper->query(
                        "SELECT SUM(dmm.precio * m.cantidad) as importe FROM DatMovimientos m
                INNER JOIN m.DatMovmoneda dmm
                 WHERE m.iddocumento = {$iddocumento} and dmm.idmoneda = {$this->_dualidadMonedas->idmoneda}"
                )
                ->getFirst()
                ->toArray();
        $importeelem = $this->doctrineHelper->query(
                        "SELECT SUM(dde.preciotarifa * def.cantidad) as importe FROM DatElementosFactura def
                INNER JOIN def.DatDesgloselemento dde
                WHERE def.idfactura = {$iddocumento} and dde.idmoneda = {$this->_dualidadMonedas->idmoneda}"
                )
                ->getFirst()
                ->toArray();
        $arrayConceptoCont = $this->doctrineHelper->query(
                        "SELECT ddcp.concepto,ddcp.porciento,ddcp.valorcalculo FROM DatDesglosecategoriapreciofactura ddcp
                INNER JOIN ddcp.DatCategoriaPrecioFactura dcpf
                WHERE dcpf.idfactura = {$iddocumento} and ddcp.idmoneda = {$this->_dualidadMonedas->idmoneda}"
                )
                ->toArray();
        $conceptoCont = 0;
        foreach ($arrayConceptoCont as $c) {
            if ($c['concepto'] == '+') {
                $conceptoCont += $c['valorcalculo'];
            } else {
                $conceptoCont -= $c['valorcalculo'];
            }
        }
        $return = array('importecontable' => number_format(
                    $importemov['importe'] + $importeelem['importe'] + $conceptoCont, 2, '.', ''
        ));
        if ($this->_dualidadMonedas->idmonedaalternativa) {
            $importemovalt = $this->doctrineHelper->query(
                            "SELECT SUM(dmm.precio * m.cantidad) as importe FROM DatMovimientos m
                INNER JOIN m.DatMovmoneda dmm
                 WHERE m.iddocumento = {$iddocumento} and dmm.idmoneda = {$this->_dualidadMonedas->idmonedaalternativa}"
                    )
                    ->getFirst()
                    ->toArray();
            $importeelemalt = $this->doctrineHelper->query(
                            "SELECT SUM(dde.preciotarifa * def.cantidad) as importe FROM DatElementosFactura def
                INNER JOIN def.DatDesgloselemento dde
                WHERE def.idfactura = {$iddocumento} and dde.idmoneda = {$this->_dualidadMonedas->idmonedaalternativa}"
                    )
                    ->getFirst()
                    ->toArray();
            $conceptoAlt = 0;
            $arrayConceptoAlt = $this->doctrineHelper->query(
                            "SELECT ddcp.concepto,ddcp.porciento,ddcp.valorcalculo FROM DatDesglosecategoriapreciofactura ddcp
                INNER JOIN ddcp.DatCategoriaPrecioFactura dcpf
                WHERE dcpf.idfactura = {$iddocumento} and ddcp.idmoneda = {$this->_dualidadMonedas->idmonedaalternativa}"
                    )
                    ->toArray();
            foreach ($arrayConceptoAlt as $c) {
                if ($c['concepto'] == '+') {
                    $conceptoAlt += $c['valorcalculo'];
                } else {
                    $conceptoAlt -= $c['valorcalculo'];
                }
            }
            $return['importealternativo'] = number_format(
                    $importemovalt['importe'] + $importeelemalt['importe'] + $conceptoAlt, 2, '.', ''
            );
        }
        return $return;
    }*/
	
	public function getImporteTotalDocumento($iddocumento, $comprobante = 0)
	{
	    new DatProdFactura();
         $doc = Doctrine::getTable('DatDocumento')->find($iddocumento);
         $docFac = Doctrine::getTable('DatDocfactura')->find($iddocumento);
     if (($this->objIddocVenta->iddoc && $doc->iddoc == $this->objIddocVenta->iddoc) || ($this->objIddocDev->iddoc && $doc->iddoc == $this->objIddocDev->iddoc)) {
          $importe = $this->doctrineHelper->query(
                        "SELECT COALESCE(SUM(ROUND(dmm.precio * m.cantidad,2)),0) as importe FROM DatMovimientos m
                INNER JOIN m.DatMovmoneda dmm
                 WHERE m.iddocumento = {$iddocumento} and dmm.idmoneda = {$this->_dualidadMonedas->idmoneda}"
                )->getFirst()->toArray();
         $importeServ = $this->doctrineHelper->getConnection()->execute("
            select sum(coalesce(dvs.importetotal,0)) as importe from mod_logpuntoventa.dat_ventaservicio dvs where dvs.idventas = {$iddocumento}
         ")->fetchAll(PDO::FETCH_ASSOC);
         $servicios = 0;
         if (count($importeServ)) {
             $servicios = $importeServ[0]['importe'];
         }
          $return['importecontable'] = number_format(
				$importe['importe']+$servicios, 2, '.', ''
			);
      $importe = $this->doctrineHelper->query(
                        "SELECT COALESCE(SUM(ROUND(dmm.precio * m.cantidad,2)),0) as importe FROM DatMovimientos m
                INNER JOIN m.DatMovmoneda dmm
                 WHERE m.iddocumento = {$iddocumento} and dmm.idmoneda <> {$this->_dualidadMonedas->idmoneda}"
                )->getFirst()->toArray();
          $return['importealternativo'] = number_format(
				$importe['importe'], 2, '.', ''
			);
          if ($comprobante && !$this->_dualidadMonedas->idmonedaalternativa) {
              $return['importecontable'] = $return['importecontable'] + $return['importealternativo'];
              $sqlMoneda = "Select mm.idmoneda from mod_logistica.dat_movmoneda mm inner join mod_logistica.dat_movimiento dm 
                  on dm.idmovimiento = mm.idmovimiento
                  where dm.iddocumento = {$iddocumento} limit 1";
              $arrayMoneda = $this->doctrineHelper->getConnection()->execute($sqlMoneda)->fetchAll(PDO::FETCH_ASSOC);
              $tasa = $this->configuracionHelper->getTasaByMonedas(
                  $this->_dualidadMonedas->idmoneda, $arrayMoneda[0]['idmoneda'], $this->_tipotasa
              );
              if (count($tasa)) {
                  $return['importecontable'] *= $tasa[0]['factordeconversion'];
              }
          }
      } else {
        $importemov = $this->doctrineHelper->query(
			"SELECT SUM(COALESCE(dpf.importe,
              abs(ROUND(dmm.precio * (CASE WHEN dpf.cantidadfactura > 0 
              THEN dpf.cantidadfactura - m.cantidad ELSE m.cantidad END),2) - 
              ROUND(COALESCE (dpf.importefactmn,0),2))
              )) as importe FROM DatMovimientos m
			INNER JOIN m.DatMovmoneda dmm
			INNER JOIN m.DatProdFactura dpf
			WHERE m.iddocumento = {$iddocumento} and dmm.idmoneda = {$this->_dualidadMonedas->idmoneda}"
		)
		->getFirst()
		->toArray();
		$importeelemprod = $this->doctrineHelper->query(
			"SELECT sum(COALESCE(dde.importe, 
            abs(ROUND(dde.preciotarifa * (CASE WHEN def.cantidadfactura > 0 
            THEN def.cantidadfactura - def.cantidad 
            ELSE def.cantidad END),2) - 
            ROUND(COALESCE(dde.preciotarifafactura,0) * COALESCE(def.cantidadfactura,0),2))
            )) as importe
            FROM DatElementosFactura def
            INNER JOIN def.DatProdServNomenclador dps
			INNER JOIN def.DatDesgloselemento dde
			WHERE def.idfactura = {$iddocumento} and dps.tipo = 1 and dde.idmoneda = {$this->_dualidadMonedas->idmoneda}"
		)
		->getFirst()
		->toArray();
         $importeelemserv = $this->doctrineHelper->query(
             "SELECT sum(COALESCE(dde.importe, 
            abs(ROUND(dde.preciotarifa * (CASE WHEN def.cantidadfactura > 0 
            THEN def.cantidadfactura - def.cantidad 
            ELSE def.cantidad END),2) - 
            ROUND(COALESCE(dde.preciotarifafactura,0) * COALESCE(def.cantidadfactura,0),2))
            )) as importe
            FROM DatElementosFactura def
            INNER JOIN def.DatProdServNomenclador dps
			INNER JOIN def.DatDesgloselemento dde
			WHERE def.idfactura = {$iddocumento} and dps.tipo = 2 and dde.idmoneda = {$this->_dualidadMonedas->idmoneda}"
         )
             ->getFirst()
             ->toArray();
         $importeelemaft = $this->doctrineHelper->query(
             "SELECT sum(COALESCE(dde.importe, 
            abs(ROUND(dde.preciotarifa * (CASE WHEN def.cantidadfactura > 0 
            THEN def.cantidadfactura - def.cantidad 
            ELSE def.cantidad END),2) - 
            ROUND(COALESCE(dde.preciotarifafactura,0) * COALESCE(def.cantidadfactura,0),2))
            )) as importe
            FROM DatElementosFactura def
            INNER JOIN def.DatActivosfactura afct
			INNER JOIN def.DatDesgloselemento dde
			WHERE def.idfactura = {$iddocumento} and dde.idmoneda = {$this->_dualidadMonedas->idmoneda}"
         )
             ->getFirst()
             ->toArray();
		$arrayConceptoCont = $this->doctrineHelper->query(
			"SELECT ddcp.concepto,ddcp.idmonedacategoria,dcpf.noexterior as noexterior,ddcp.porciento,
            ROUND(abs(ddcp.valorcalculo - COALESCE(ddcp.valorcalculofact,0)),2) as valorcalculo FROM DatDesglosecategoriapreciofactura ddcp
			INNER JOIN ddcp.DatCategoriaPrecioFactura dcpf
			WHERE dcpf.idfactura = {$iddocumento} and ddcp.idmoneda = {$this->_dualidadMonedas->idmoneda}"
		)
		->toArray();
		$arrayConceptoAlt = array();
		$conceptoCont = 0;
		$conceptoMN = 0;
		$conceptoNoExterior = 0;
		foreach ($arrayConceptoCont as $c) {
			if ($c['concepto'] == '+') {
			    if ($c['porciento'] == 1 && $docFac->idmonedaprod) {
                    if ($c['idmonedacategoria'] && $c['idmonedacategoria'] != $this->_dualidadMonedas->idmoneda) {
                        $conceptoCont += $c['valorcalculo']/$docFac->factorconvercion;
                    } else {
                        $conceptoCont += $c['valorcalculo'];
                    }
                } else if ($docFac->idmoneda && $c['porciento'] == 1) {
                    if ($c['idmonedacategoria'] && $c['idmonedacategoria'] == $this->_dualidadMonedas->idmoneda) {
                        $conceptoCont += $c['valorcalculo']*$docFac->factorconvercion;
                    } else {
                        $conceptoCont += $c['valorcalculo'];
                    }
                } else {
                    $conceptoCont += $c['valorcalculo'];
                }
				if ($c['idmonedacategoria'] && $c['idmonedacategoria'] == $this->_dualidadMonedas->idmoneda){
                    $conceptoMN += ($docFac->idmoneda && $c['porciento'] == 1) ? $c['valorcalculo']*$docFac->factorconvercion : $c['valorcalculo'];
                } else if (!$c['idmonedacategoria'] && !$docFac->idmoneda && $docFac->idmonedaprod){
                    $conceptoMN += $c['valorcalculo'];
                }
                if ($c['noexterior'] == 1) {
                    if (($c['idmonedacategoria'] && $c['idmonedacategoria'] == $docFac->idmoneda) ||
                        (is_null($c['idmonedacategoria']) && is_numeric($docFac->idmoneda))){
                            $conceptoNoExterior += $c['valorcalculo']*$docFac->factorconvercion;
                    } else {
                        $conceptoNoExterior += $c['valorcalculo'];//falta factor de conversion si la moneda es distinta a la factura
                    }
                }
			} else if ($c['concepto'] == '-') {
				$conceptoCont -= $c['valorcalculo'];
                if ($c['idmonedacategoria'] && $c['idmonedacategoria'] == $this->_dualidadMonedas->idmoneda){
                    $conceptoMN -= $c['valorcalculo'];
                }
                if ($c['noexterior'] == 1) {
                    if (($c['idmonedacategoria'] && $c['idmonedacategoria'] == $docFac->idmoneda) ||
                        (is_null($c['idmonedacategoria']) && is_numeric($docFac->idmoneda))){
                        $conceptoNoExterior -= $c['valorcalculo']*$docFac->factorconvercion;
                    } else {
                        $conceptoNoExterior -= $c['valorcalculo'];//falta factor de conversion si la moneda es distinta a la factura
                    }
                }
			}
		}
		$importeMovAlt = 0;
		$conceptoAlt = 0;
        $conceptoMNAux = 0;
        $importeelem['importe'] = $importeelemserv['importe'] + $importeelemprod['importe'] + $importeelemaft['importe'];
        if ($docFac->idmonedaprod && !$docFac->idmoneda) {

            $arrayConceptoAlt = $this->doctrineHelper->query(
                "SELECT ddcp.concepto,ddcp.idmonedacategoria,dcpf.noexterior as noexterior,ddcp.porciento,
            ROUND(abs(ddcp.valorcalculo - COALESCE(ddcp.valorcalculofact,0)),2) as valorcalculo FROM DatDesglosecategoriapreciofactura ddcp
			INNER JOIN ddcp.DatCategoriaPrecioFactura dcpf
			WHERE dcpf.idfactura = {$iddocumento} and ddcp.idmoneda = {$docFac->idmonedaprod}"
            )
                ->toArray();
            foreach ($arrayConceptoAlt as $c) {
                if ($c['concepto'] == '+') {
                    if ($c['idmonedacategoria'] && $c['idmonedacategoria'] != $this->_dualidadMonedas->idmoneda){
                        $conceptoAlt += $c['valorcalculo'];
                    } else if ($c['idmonedacategoria'] && $c['idmonedacategoria'] == $this->_dualidadMonedas->idmoneda){
                        $conceptoMNAux += $c['valorcalculo']*$docFac->factorconvercion;
                    } else if (!$c['idmonedacategoria']) {
                        $conceptoAlt += $c['valorcalculo'];
                    }
                } else if ($c['concepto'] == '-') {
                    if ($c['idmonedacategoria'] && $c['idmonedacategoria'] != $this->_dualidadMonedas->idmoneda){
                        $conceptoAlt -= $c['valorcalculo'];
                    } else if ($c['idmonedacategoria'] && $c['idmonedacategoria'] == $this->_dualidadMonedas->idmoneda){
                        $conceptoMNAux -= $c['valorcalculo']*$docFac->factorconvercion;
                    } else if (!$c['idmonedacategoria']) {
                        $conceptoAlt -= $c['valorcalculo'];
                    }
                }
            }

            $importeMovAlt = $importemov['importe'] + $importeelemprod['importe'] + $importeelemaft['importe'] + $conceptoAlt;
            $importeelem['importe'] -= $importeelemprod['importe'];
            $importemov['importe'] = 0;
            $return = array('importecontable' => number_format(
                $importeMovAlt + $conceptoCont - $conceptoMN, 2, '.', ''
            ));//Alternativo
            $return['importeconceptocup'] = number_format(
                $conceptoMN + $conceptoMNAux + $importeelem['importe'], 2, '.', ''
            );
            if ($conceptoNoExterior > 0) {
                $return['importenoexterior'] = number_format(
                    $conceptoNoExterior, 2, '.', ''
                );
            }
        } else {
            $return = array('importecontable' => number_format(
                $importemov['importe'] + $importeelem['importe'] + $conceptoCont - ($docFac->idmoneda ? $conceptoMN : 0), 2, '.', ''
            ));
            if (($docFac->idmoneda || $docFac->idmonedaprod) && ($conceptoMN > 0 || $importeMovAlt > 0)) {
                $return['importeconceptocup'] = number_format(
                    $conceptoMN, 2, '.', ''
                );
            }
            if ($conceptoNoExterior > 0) {
                $return['importenoexterior'] = number_format(
                    $conceptoNoExterior, 2, '.', ''
                );
            }
        }
		if ($this->_dualidadMonedas->idmonedaalternativa) {
			$importemovalt = $this->doctrineHelper->query(
			"SELECT abs(SUM(ROUND(dmm.precio * (CASE WHEN dpf.cantidadfactura > 0 THEN dpf.cantidadfactura - m.cantidad ELSE m.cantidad END),2)) - ROUND(SUM(COALESCE (dpf.importefactalt,0)),2)) as importe FROM DatMovimientos m
			INNER JOIN m.DatMovmoneda dmm
			INNER JOIN m.DatProdFactura dpf
			WHERE m.iddocumento = {$iddocumento} and dmm.idmoneda = {$this->_dualidadMonedas->idmonedaalternativa}"
			)
			->getFirst()
			->toArray();
			$importeelemalt = $this->doctrineHelper->query(
				"SELECT abs(SUM(ROUND(dde.preciotarifa * def.cantidad,2)) - SUM(ROUND(COALESCE(dde.preciotarifafactura,0) * def.cantidad),2)) as importe FROM DatElementosFactura def
				INNER JOIN def.DatDesgloselemento dde
				WHERE def.idfactura = {$iddocumento} and dde.idmoneda = {$this->_dualidadMonedas->idmonedaalternativa}"
			)
			->getFirst()
			->toArray();
			$conceptoAlt = 0;
			$arrayConceptoAlt = $this->doctrineHelper->query(
				"SELECT ddcp.concepto,ddcp.porciento,ROUND(abs(ddcp.valorcalculo - COALESCE(ddcp.valorcalculofact,0)),2) as valorcalculo FROM DatDesglosecategoriapreciofactura ddcp
				INNER JOIN ddcp.DatCategoriaPrecioFactura dcpf
				WHERE dcpf.idfactura = {$iddocumento} and ddcp.idmoneda = {$this->_dualidadMonedas->idmonedaalternativa}"
			)
			->toArray();
			foreach ($arrayConceptoAlt as $c) {
				if ($c['concepto'] == '+') {
					$conceptoAlt += $c['valorcalculo'];
				} else {
					$conceptoAlt -= $c['valorcalculo'];
				}
			}
			$return['importealternativo'] = number_format(
				$importemovalt['importe'] + $importeelemalt['importe'] + $conceptoAlt, 2, '.', ''
			);
		}
      }

		return $return;
	}

    public function getImporteVentas($parametros)
    {
        $idmoneda = ($parametros['alternativo'])
                    ? (
                        $this->_dualidadMonedas->idmonedaalternativa
                            ? $this->_dualidadMonedas->idmonedaalternativa
                            : -1
                      )
                    : $this->_dualidadMonedas->idmoneda;
        if($parametros['idperiodo']){
            $importemov = $this->doctrineHelper->query(
                "SELECT SUM(dmm.precio * m.cantidad) as importe FROM DatMovimientos m
                INNER JOIN m.DatMovmoneda dmm
                INNER JOIN m.DatDocumento d
                 WHERE d.idestructuracomun = {$this->idestructura} and dmm.idmoneda =
                 {$idmoneda} and d.estado = 4 and d.idperiodo = {$parametros['idperiodo']}"
            )
                ->getFirst()
                ->toArray();
            $importeelem = $this->doctrineHelper->query(
                "SELECT SUM(dde.preciotarifa * def.cantidad) as importe FROM DatElementosFactura def
                INNER JOIN def.DatDesgloselemento dde
                INNER JOIN def.DatDocfactura df
                INNER JOIN df.DatDocumento d
                WHERE d.idestructuracomun = {$this->idestructura} and dde.idmoneda = {$idmoneda}
                 and d.estado = 4 and d.idperiodo = {$parametros['idperiodo']}"
            )
                ->getFirst()
                ->toArray();
            $arrayConceptoCont = $this->doctrineHelper->query(
                "SELECT ddcp.concepto,ddcp.porciento,ddcp.valorcalculo FROM DatDesglosecategoriapreciofactura ddcp
                INNER JOIN ddcp.DatCategoriaPrecioFactura dcpf
                INNER JOIN dcpf.DatDocfactura df
                INNER JOIN df.DatDocumento d
                WHERE d.idestructuracomun = {$this->idestructura} and ddcp.idmoneda = {$idmoneda}
                 and d.estado = 4 and d.idperiodo = {$parametros['idperiodo']}"
            )
                ->toArray();
            $conceptoCont = 0;
            foreach ($arrayConceptoCont as $c) {
                if ($c['concepto'] == '+') {
                    $conceptoCont += $c['valorcalculo'];
                } else {
                    $conceptoCont -= $c['valorcalculo'];
                }
            }
            $return = array('importecontable' => number_format(
                $importemov['importe'] + $importeelem['importe'] + $conceptoCont, 2, '.', ''
            ));
            return $return;
        }
        if($parametros['idestructuraop']){
            $sql = "(round((SELECT SUM(dmm.precio * m.cantidad) FROM mod_logistica.dat_movimiento m " .
                "INNER JOIN mod_logistica.dat_movmoneda dmm on dmm.idmovimiento = m.idmovimiento ".
                "INNER JOIN mod_logistica.dat_documento dd on dd.iddocumento = m.iddocumento " .
                "INNER JOIN mod_logfacturacion.dat_docfactura df on df.idfactura = dd.iddocumento " .
                "WHERE dmm.idmoneda= ".
                "{$idmoneda} AND df.iddeposito = {$parametros['idestructuraop']} ".
                "AND dd.estado = 4)".
                "+(SELECT COALESCE(SUM(ddcp.valorcalculo),0) FROM mod_logfacturacion.dat_desglosecategoriapreciofactura ddcp
                INNER JOIN mod_logfacturacion.dat_categoriapreciofactura dcpf on dcpf. idcategoriafactura = ddcp.idcategoriafactura
                INNER JOIN mod_logfacturacion.dat_docfactura df on df.idfactura = dcpf.idfactura
                INNER JOIN mod_logistica.dat_documento d on d.iddocumento = df.idfactura
                WHERE ddcp.idmoneda = {$idmoneda} ".
                " and ddcp.concepto = '+' AND df.iddeposito = {$parametros['idestructuraop']})".
                "-(SELECT COALESCE(SUM(ddcp.valorcalculo),0) FROM mod_logfacturacion.dat_desglosecategoriapreciofactura ddcp
                INNER JOIN mod_logfacturacion.dat_categoriapreciofactura dcpf on dcpf. idcategoriafactura = ddcp.idcategoriafactura
                INNER JOIN mod_logfacturacion.dat_docfactura df on df.idfactura = dcpf.idfactura
                INNER JOIN mod_logistica.dat_documento d on d.iddocumento = df.idfactura
                WHERE ddcp.idmoneda = {$idmoneda} " .
                " and ddcp.concepto = '-' AND df.iddeposito = {$parametros['idestructuraop']}),2)".
                ")";
        }else{
            $sql = "(round((SELECT SUM(dmm.precio * m.cantidad) FROM mod_logistica.dat_movimiento m " .
                "INNER JOIN mod_logistica.dat_movmoneda dmm on dmm.idmovimiento = m.idmovimiento " .
                "INNER JOIN mod_logistica.dat_documento dd on dd.iddocumento = m.iddocumento " .
                "INNER JOIN mod_logfacturacion.dat_docfactura df on df.idfactura = dd.iddocumento " .
                "WHERE dd.idestructuracomun = {$this->idestructura} AND dmm.idmoneda= " .
                "{$idmoneda} AND dd.estado = 4)" .
                "+(SELECT COALESCE(SUM(ddcp.valorcalculo),0) FROM mod_logfacturacion.dat_desglosecategoriapreciofactura ddcp
                INNER JOIN mod_logfacturacion.dat_categoriapreciofactura dcpf on dcpf. idcategoriafactura = ddcp.idcategoriafactura
                INNER JOIN mod_logfacturacion.dat_docfactura df on df.idfactura = dcpf.idfactura
                INNER JOIN mod_logistica.dat_documento d on d.iddocumento = df.idfactura
                WHERE d.idestructuracomun = {$this->idestructura} and ddcp.idmoneda = {$idmoneda} " .
                " and ddcp.concepto = '+')" .
                "-(SELECT COALESCE(SUM(ddcp.valorcalculo),0) FROM mod_logfacturacion.dat_desglosecategoriapreciofactura ddcp
                INNER JOIN mod_logfacturacion.dat_categoriapreciofactura dcpf on dcpf. idcategoriafactura = ddcp.idcategoriafactura
                INNER JOIN mod_logfacturacion.dat_docfactura df on df.idfactura = dcpf.idfactura
                INNER JOIN mod_logistica.dat_documento d on d.iddocumento = df.idfactura
                WHERE d.idestructuracomun = {$this->idestructura} and ddcp.idmoneda = {$idmoneda} " .
                " and ddcp.concepto = '-'),2))";

        }
        return $sql;
    }

    public function actualizarImpuestosFactura($iddocumento)
    {
        /*$monedas = $this->getMonedaContableAlternativa();
        foreach ($monedas as $m) {

        }*/
        $factura = Doctrine::getTable('DatDocfactura')->find($iddocumento);
        $importes = $this->getImporteDocumento($iddocumento, $this->_dualidadMonedas->idmoneda);
        /***categorias padres*/
        $strPadres = -1;
        $hijas = array();
        $categPadresSql = "SELECT distinct dcp.idcategoriafactura
                FROM mod_logfacturacion.dat_desglosecategoriapreciofactura ddcf
                INNER JOIN mod_logfacturacion.dat_categoriapreciofactura dcp on dcp.idcategoriafactura = ddcf.idcategoriafactura
                INNER JOIN mod_logfacturacion.nom_categoriaprecio ncp on ncp.idcategoriaprecio = dcp.idcategoriaprecio
                INNER JOIN mod_logfacturacion.nom_subcategoriaprecio nsc on nsc.idcategoriapadre = ncp.idcategoriaprecio
                 WHERE dcp.idfactura = {$iddocumento} and ncp.idnommonedatotal is Null";
        $categPadres = LogisticaDoctrineHelper::__init()->getConnection()->execute($categPadresSql)->fetchAll(PDO::FETCH_COLUMN);
        if (count($categPadres)) {
            $strPadres = implode(',',$categPadres);
        }
        /********************/
        if ($factura->idmonedaprod && !$factura->idmoneda) {
            $collDesg = new Doctrine_Collection('DatDesglosecategoriapreciofactura');

            $categ = $this->doctrineHelper->query(
                "SELECT dcp.idcategoriafactura, ddcf.iddesglosecategoria, ncp.idcategoriaprecio as idcategoriaprecio, ncp.aplicartodos as aplicartodos, dcp.aplicar as aplicar, COALESCE(ncp.base,0) as base 
                FROM DatDesglosecategoriapreciofactura ddcf
                INNER JOIN ddcf.DatCategoriaPrecioFactura dcp
                INNER JOIN dcp.NomCategoriaprecio ncp
                 WHERE dcp.idfactura = {$iddocumento} and ddcf.idmoneda = {$this->_dualidadMonedas->idmoneda} and ncp.idnommonedatotal is Null 
                 and dcp.idcategoriafactura not in ({$strPadres})"
            )
                ->toArray();
            $importeProd = $importes['productos'];
            $importeServ = $importes['servicios'];
            foreach ($categ as $c) {
                $importe = $importeServ;
                if ($importe > 0 || $c['porciento'] != 1) {
                    if ($c['aplicartodos'] == 1) {
                        if($c['aplicar'] == 1) {
                            if ($c['porciento'] == 1) {
                                $valorCalc = $importe * $c['valor'] / 100;
                            } else {
                                $valorCalc = $c['valor'];
                            }
                        } else {
                            $valorCalc = 0;
                        }
                    } else {
                        if ($c['porciento'] == 1) {
                            $valorCalc = $importe * $c['valor'] / 100;
                        } else {
                            $valorCalc = $c['valor'];
                        }
                    }
                    Doctrine_Query::create()
                        ->update('DatDesglosecategoriapreciofactura')
                        ->set(
                            'valorcalculo', "'" . $valorCalc . "'"
                        )
                        ->where("iddesglosecategoria = ?", array($c['iddesglosecategoria']))
                        ->execute();
                } else {
                    Doctrine_Query::create()
                        ->update('DatDesglosecategoriapreciofactura')
                        ->set(
                            'valorcalculo', "'" . 0 . "'"
                        )
                        ->where("iddesglosecategoria = ?", array($c['iddesglosecategoria']))
                        ->execute();
                }
                $hijas[$this->_dualidadMonedas->idmoneda][$c['idcategoriaprecio']] = $valorCalc;
                $categMonedaProd = $this->doctrineHelper->query(
                    "SELECT dcp.idcategoriafactura, ddcf.iddesglosecategoria, ncp.idcategoriaprecio as idcategoriaprecio, ncp.aplicartodos as aplicartodos, dcp.aplicar as aplicar, COALESCE(ncp.base,0) as base 
                FROM DatDesglosecategoriapreciofactura ddcf
                INNER JOIN ddcf.DatCategoriaPrecioFactura dcp
                INNER JOIN dcp.NomCategoriaprecio ncp
                 WHERE dcp.idfactura = {$iddocumento} and ddcf.idmoneda = {$factura->idmonedaprod} and dcp.idcategoriafactura = {$c['idcategoriafactura']} "
                )
                    ->toArray();
                if (count($categMonedaProd) && $categMonedaProd[0]['porciento'] == 1) {
                    $importe = $importeProd;
                    if ($categMonedaProd[0]['aplicartodos'] == 1) {
                        if($categMonedaProd[0]['aplicar'] == 1) {
                            if ($categMonedaProd[0]['porciento'] == 1) {
                                $valorCalc = $importe * $categMonedaProd[0]['valor'] / 100;
                            } else {
                                $valorCalc = $categMonedaProd[0]['valor'];
                            }
                        } else {
                            $valorCalc = 0;
                        }
                    } else {
                        if ($categMonedaProd[0]['porciento'] == 1) {
                            $valorCalc = $importe * $categMonedaProd[0]['valor'] / 100;
                        } else {
                            $valorCalc = $categMonedaProd[0]['valor'];
                        }
                    }
                    Doctrine_Query::create()
                        ->update('DatDesglosecategoriapreciofactura')
                        ->set(
                            'valorcalculo', "'" . $valorCalc . "'"
                        )
                        ->where("iddesglosecategoria = ?", array($categMonedaProd[0]['iddesglosecategoria']))
                        ->execute();
                } else if ($c['porciento'] == 1) {
                    $categNew = new DatDesglosecategoriapreciofactura();
                    unset($c['iddesglosecategoria']);
                    unset($c['idmoneda']);
                    unset($c['valorcalculo']);
                    unset($c['DatCategoriaPrecioFactura']);
                    if (!$c['valorcalculofact']) {
                        unset($c['valorcalculofact']);
                    }
                    if (!$c['idmonedacategoria']) {
                        unset($c['idmonedacategoria']);
                    }
                    $categNew->synchronizeWithArray($c);
                    $categNew->idmoneda = $factura->idmonedaprod;
                    if ($c['aplicartodos'] == 1) {
                        if($c['aplicar'] == 1) {
                            if ($c['porciento'] == 1) {
                                $valorCalc = $importeProd * $c['valor'] / 100;
                            } else {
                                $valorCalc = $c['valor'];
                            }
                        } else {
                            $valorCalc = 0;
                        }
                    } else {
                        if ($c['porciento'] == 1) {
                            $valorCalc = $importeProd * $c['valor'] / 100;
                        } else {
                            $valorCalc = $c['valor'];
                        }
                    }
                    $categNew->valorcalculo = $valorCalc;
                    $collDesg->add($categNew);
                }
                $hijas[$factura->idmonedaprod][$c['idcategoriaprecio']] = $valorCalc;
            }
            /*Calculo de las categorias padres incluyendo las hijas*/

            $categP = $this->doctrineHelper->query(
                "SELECT dcp.idcategoriafactura, ddcf.iddesglosecategoria, ncp.idcategoriaprecio as idcategoriaprecio, ncp.aplicartodos as aplicartodos, dcp.aplicar as aplicar, COALESCE(ncp.base,0) as base 
                FROM DatDesglosecategoriapreciofactura ddcf
                INNER JOIN ddcf.DatCategoriaPrecioFactura dcp
                INNER JOIN dcp.NomCategoriaprecio ncp
                 WHERE dcp.idfactura = {$iddocumento} and ddcf.idmoneda = {$this->_dualidadMonedas->idmoneda} and ncp.idnommonedatotal is Null 
                 and dcp.idcategoriafactura in ({$strPadres})"
            )
                ->toArray();

            foreach ($categP as $c) {
                $importe = $importeServ;
                /*Retornar las hijas de la categoria actual*/
                $categHijasSql = "SELECT ncp.idcategoriaprecio
                FROM mod_logfacturacion.dat_desglosecategoriapreciofactura ddcf
                INNER JOIN mod_logfacturacion.dat_categoriapreciofactura dcp on dcp.idcategoriafactura = ddcf.idcategoriafactura
                INNER JOIN mod_logfacturacion.nom_categoriaprecio ncp on ncp.idcategoriaprecio = dcp.idcategoriaprecio
                INNER JOIN mod_logfacturacion.nom_subcategoriaprecio nsc on nsc.idcategoria = ncp.idcategoriaprecio
                 WHERE dcp.idfactura = {$iddocumento} and ddcf.idmoneda = {$this->_dualidadMonedas->idmoneda} and ncp.idnommonedatotal is Null
                 and nsc.idcategoriapadre = {$c['idcategoriaprecio']}";
                $categHijas = LogisticaDoctrineHelper::__init()->getConnection()->execute($categHijasSql)->fetchAll(PDO::FETCH_COLUMN);
                foreach ($categHijas as $id) {
                    if (isset($hijas[$this->_dualidadMonedas->idmoneda][$id]))
                        $importe += $hijas[$this->_dualidadMonedas->idmoneda][$id];
                }
                if ($importe > 0 || $c['porciento'] != 1) {
                    if ($c['aplicartodos'] == 1) {
                        if($c['aplicar'] == 1) {
                            if ($c['porciento'] == 1) {
                                $valorCalc = $importe * $c['valor'] / 100;
                            } else {
                                $valorCalc = $c['valor'];
                            }
                        } else {
                            $valorCalc = 0;
                        }
                    } else {
                        if ($c['porciento'] == 1) {
                            $valorCalc = $importe * $c['valor'] / 100;
                        } else {
                            $valorCalc = $c['valor'];
                        }
                    }
                    Doctrine_Query::create()
                        ->update('DatDesglosecategoriapreciofactura')
                        ->set(
                            'valorcalculo', "'" . $valorCalc . "'"
                        )
                        ->where("iddesglosecategoria = ?", array($c['iddesglosecategoria']))
                        ->execute();
                } else {
                    Doctrine_Query::create()
                        ->update('DatDesglosecategoriapreciofactura')
                        ->set(
                            'valorcalculo', "'" . 0 . "'"
                        )
                        ->where("iddesglosecategoria = ?", array($c['iddesglosecategoria']))
                        ->execute();
                }

                $categMonedaProd = $this->doctrineHelper->query(
                    "SELECT dcp.idcategoriafactura, ddcf.iddesglosecategoria, ncp.idcategoriaprecio as idcategoriaprecio, ncp.aplicartodos as aplicartodos, dcp.aplicar as aplicar, COALESCE(ncp.base,0) as base 
                FROM DatDesglosecategoriapreciofactura ddcf
                INNER JOIN ddcf.DatCategoriaPrecioFactura dcp
                INNER JOIN dcp.NomCategoriaprecio ncp
                 WHERE dcp.idfactura = {$iddocumento} and ddcf.idmoneda = {$factura->idmonedaprod} and dcp.idcategoriafactura = {$c['idcategoriafactura']} 
                 and dcp.idcategoriafactura in ({$strPadres})"
                )
                    ->toArray();
                if (count($categMonedaProd) && $categMonedaProd[0]['porciento'] == 1) {
                    $importe = $importeProd;
                    foreach ($categHijas as $id) {
                        if (isset($hijas[$factura->idmonedaprod][$id]))
                            $importe += $hijas[$factura->idmonedaprod][$id];
                    }
                    if ($categMonedaProd[0]['aplicartodos'] == 1) {
                        if($categMonedaProd[0]['aplicar'] == 1) {
                            if ($categMonedaProd[0]['porciento'] == 1) {
                                $valorCalc = $importe * $categMonedaProd[0]['valor'] / 100;
                            } else {
                                $valorCalc = $categMonedaProd[0]['valor'];
                            }
                        } else {
                            $valorCalc = 0;
                        }
                    } else {
                        if ($categMonedaProd[0]['porciento'] == 1) {
                            $valorCalc = $importe * $categMonedaProd[0]['valor'] / 100;
                        } else {
                            $valorCalc = $categMonedaProd[0]['valor'];
                        }
                    }
                    Doctrine_Query::create()
                        ->update('DatDesglosecategoriapreciofactura')
                        ->set(
                            'valorcalculo', "'" . $valorCalc . "'"
                        )
                        ->where("iddesglosecategoria = ?", array($categMonedaProd[0]['iddesglosecategoria']))
                        ->execute();
                } else if ($c['porciento'] == 1) {
                    $categNew = new DatDesglosecategoriapreciofactura();
                    unset($c['iddesglosecategoria']);
                    unset($c['idmoneda']);
                    unset($c['valorcalculo']);
                    unset($c['DatCategoriaPrecioFactura']);
                    if (!$c['valorcalculofact']) {
                        unset($c['valorcalculofact']);
                    }
                    if (!$c['idmonedacategoria']) {
                        unset($c['idmonedacategoria']);
                    }
                    $categNew->synchronizeWithArray($c);
                    $categNew->idmoneda = $factura->idmonedaprod;
                    if ($c['aplicartodos'] == 1) {
                        if($c['aplicar'] == 1) {
                            if ($c['porciento'] == 1) {
                                $valorCalc = $importeProd * $c['valor'] / 100;
                            } else {
                                $valorCalc = $c['valor'];
                            }
                        } else {
                            $valorCalc = 0;
                        }
                    } else {
                        if ($c['porciento'] == 1) {
                            $valorCalc = $importeProd * $c['valor'] / 100;
                        } else {
                            $valorCalc = $c['valor'];
                        }
                    }
                    $categNew->valorcalculo = $valorCalc;
                    $collDesg->add($categNew);
                }
            }

            if (count($collDesg)) {
                $collDesg->save();
            }
        } else {
            $categ = $this->doctrineHelper->query(
                "SELECT dcp.idcategoriafactura, ddcf.iddesglosecategoria, ncp.aplicartodos as aplicartodos, dcp.aplicar as aplicar, COALESCE(ncp.base,0) as base 
                FROM DatDesglosecategoriapreciofactura ddcf
                INNER JOIN ddcf.DatCategoriaPrecioFactura dcp
                INNER JOIN dcp.NomCategoriaprecio ncp
                 WHERE dcp.idfactura = {$iddocumento} and ddcf.idmoneda = {$this->_dualidadMonedas->idmoneda} and ncp.idnommonedatotal is Null
                 and dcp.idcategoriafactura not in ({$strPadres})"
            )
                ->toArray();
            $importeProd = $importes['productos'];
            $importeServ = $importes['servicios'];
            foreach ($categ as $c) {
                $importe = (!$c['base']) ? $importeProd + $importeServ : (($c['base'] == 1) ? $importeProd : $importeServ);
                if ($c['aplicartodos'] == 1) {
                    if($c['aplicar'] == 1) {
                        if ($c['porciento'] == 1) {
                            $valorCalc = $importe * $c['valor'] / 100;
                        } else {
                            $valorCalc = $c['valor'];
                        }
                    } else {
                        $valorCalc = 0;
                    }
                } else {
                    if ($c['porciento'] == 1) {
                        $valorCalc = $importe * $c['valor'] / 100;
                    } else {
                        $valorCalc = $c['valor'];
                    }
                }
                Doctrine_Query::create()
                    ->update('DatDesglosecategoriapreciofactura')
                    ->set(
                        'valorcalculo', "'" . $valorCalc . "'"
                    )
                    ->where("iddesglosecategoria = ?", array($c['iddesglosecategoria']))
                    ->execute();
                $hijas[$c['idcategoriafactura']] = $valorCalc;
            }
            /*Calculo de las categorias padres incluyendo las hijas*/
            $categP = $this->doctrineHelper->query(
                "SELECT dcp.idcategoriafactura, ddcf.iddesglosecategoria, ncp.idcategoriaprecio as idcategoriaprecio, ncp.aplicartodos as aplicartodos, dcp.aplicar as aplicar, COALESCE(ncp.base,0) as base 
                FROM DatDesglosecategoriapreciofactura ddcf
                INNER JOIN ddcf.DatCategoriaPrecioFactura dcp
                INNER JOIN dcp.NomCategoriaprecio ncp
                 WHERE dcp.idfactura = {$iddocumento} and ddcf.idmoneda = {$this->_dualidadMonedas->idmoneda} and ncp.idnommonedatotal is Null
                 and dcp.idcategoriafactura in ({$strPadres})"
            )
                ->toArray();
            foreach ($categP as $c) {
                $importe = (!$c['base']) ? $importeProd + $importeServ : (($c['base'] == 1) ? $importeProd : $importeServ);

                /*Retornar las hijas de la categoria actual*/
                $categHijasSql = "SELECT dcp.idcategoriafactura
                FROM mod_logfacturacion.dat_desglosecategoriapreciofactura ddcf
                INNER JOIN mod_logfacturacion.dat_categoriapreciofactura dcp on dcp.idcategoriafactura = ddcf.idcategoriafactura
                INNER JOIN mod_logfacturacion.nom_categoriaprecio ncp on ncp.idcategoriaprecio = dcp.idcategoriaprecio
                INNER JOIN mod_logfacturacion.nom_subcategoriaprecio nsc on nsc.idcategoria = ncp.idcategoriaprecio
                 WHERE dcp.idfactura = {$iddocumento} and ddcf.idmoneda = {$this->_dualidadMonedas->idmoneda} and ncp.idnommonedatotal is Null
                 and nsc.idcategoriapadre = {$c['idcategoriaprecio']}";
                $categHijas = LogisticaDoctrineHelper::__init()->getConnection()->execute($categHijasSql)->fetchAll(PDO::FETCH_COLUMN);
                foreach ($categHijas as $id) {
                    if (isset($hijas[$id]))
                        $importe += $hijas[$id];
                }
                if ($c['aplicartodos'] == 1) {
                    if($c['aplicar'] == 1) {
                        if ($c['porciento'] == 1) {
                            $valorCalc = $importe * $c['valor'] / 100;
                        } else {
                            $valorCalc = $c['valor'];
                        }
                    } else {
                        $valorCalc = 0;
                    }
                } else {
                    if ($c['porciento'] == 1) {
                        $valorCalc = $importe * $c['valor'] / 100;
                    } else {
                        $valorCalc = $c['valor'];
                    }
                }
                Doctrine_Query::create()
                    ->update('DatDesglosecategoriapreciofactura')
                    ->set(
                        'valorcalculo', "'" . $valorCalc . "'"
                    )
                    ->where("iddesglosecategoria = ?", array($c['iddesglosecategoria']))
                    ->execute();
                $hijas[$c['idcategoriafactura']] = $valorCalc;
            }
        }
        if ($this->_dualidadMonedas->idmonedaalternativa) {
            $importe = $this->getImporteDocumento($iddocumento, $this->_dualidadMonedas->idmonedaalternativa);
            $categ = $this->doctrineHelper->query(
                "SELECT dcp.idcategoriafactura, ddcf.iddesglosecategoria, ncp.aplicartodos as aplicartodos, dcp.aplicar as aplicar FROM DatDesglosecategoriapreciofactura ddcf
                INNER JOIN ddcf.DatCategoriaPrecioFactura dcp
                INNER JOIN dcp.NomCategoriaprecio ncp
                 WHERE dcp.idfactura = {$iddocumento} and ddcf.idmoneda = {$this->_dualidadMonedas->idmonedaalternativa} and ncp.idnommonedatotal is Null"
            )
                ->toArray();
            foreach ($categ as $c) {
                if ($c['aplicartodos'] == 1) {
                    if($c['aplicar'] == 1) {
                        if ($c['porciento'] == 1) {
                            $valorCalc = $importe * $c['valor'] / 100;
                        } else {
                            $valorCalc = $c['valor'];
                        }
                    } else {
                        $valorCalc = 0;
                    }
                } else {
                    if ($c['porciento'] == 1) {
                        $valorCalc = $importe * $c['valor'] / 100;
                    } else {
                        $valorCalc = $c['valor'];
                    }
                }
                Doctrine_Query::create()
                    ->update('DatDesglosecategoriapreciofactura')
                    ->set(
                        'valorcalculo', "'" . $valorCalc . "'"
                    )
                    ->where("iddesglosecategoria = ?", array($c['iddesglosecategoria']))
                    ->execute();
            }
        }

        $this->actualizarImpuestosUnaMoneda($iddocumento);
        return true;
    }

    public function actualizarImpuestosUnaMoneda($iddocumento){
        $arrayAux = [];
        $arrayAuxAlt = [];
        $importe = $this->getImporteDocumento($iddocumento, $this->_dualidadMonedas->idmoneda);
        $categ = $this->doctrineHelper->query(
            "SELECT dcp.idcategoriafactura, dcp.idcategoriaprecio as idcategoriaprecio, ddcf.iddesglosecategoria, ncp.idnommonedatotal as idnommonedatotal, ncp.aplicartodos as aplicartodos, dcp.aplicar as aplicar FROM DatDesglosecategoriapreciofactura ddcf
                INNER JOIN ddcf.DatCategoriaPrecioFactura dcp
                INNER JOIN dcp.NomCategoriaprecio ncp
                 WHERE dcp.idfactura = {$iddocumento} and ddcf.idmoneda = {$this->_dualidadMonedas->idmoneda} and ncp.idnommonedatotal is not Null"
        )
            ->toArray();
        if ($this->_dualidadMonedas->idmonedaalternativa) {
            $importeAlt = $this->getImporteDocumento($iddocumento, $this->_dualidadMonedas->idmonedaalternativa);
            $categAlt = $this->doctrineHelper->query(
                "SELECT dcp.idcategoriafactura, dcp.idcategoriaprecio as idcategoriaprecio, ddcf.iddesglosecategoria, ncp.idnommonedatotal as idnommonedatotal, ncp.aplicartodos as aplicartodos, dcp.aplicar as aplicar FROM DatDesglosecategoriapreciofactura ddcf
                INNER JOIN ddcf.DatCategoriaPrecioFactura dcp
                INNER JOIN dcp.NomCategoriaprecio ncp
                 WHERE dcp.idfactura = {$iddocumento} and ddcf.idmoneda = {$this->_dualidadMonedas->idmonedaalternativa} and ncp.idnommonedatotal is not Null"
            )
                ->toArray();
            foreach ($categ as &$c) {
                if ($c['aplicartodos'] == 1) {
                    if($c['aplicar'] == 1) {
                        if ($c['porciento'] == 1) {
                            $valorCalc = $importe * $c['valor'] / 100;
                        } else {
                            $valorCalc = $c['valor'];
                        }
                    } else {
                        $valorCalc = 0;
                    }
                } else {
                    if ($c['porciento'] == 1) {
                        $valorCalc = $importe * $c['valor'] / 100;
                    } else {
                        $valorCalc = $c['valor'];
                    }
                }
                $c['valorcalculoaux'] = $valorCalc;
                $arrayAux[$c['idcategoriaprecio']] = $c;
                /*Doctrine_Query::create()
                    ->update('DatDesglosecategoriapreciofactura')
                    ->set(
                        'valorcalculo', "'" . $valorCalc . "'"
                    )
                    ->where("iddesglosecategoria = ?", array($c['iddesglosecategoria']))
                    ->execute();*/
            }
            foreach ($categAlt as &$c) {
                if ($c['aplicartodos'] == 1) {
                    if($c['aplicar'] == 1) {
                        if ($c['porciento'] == 1) {
                            $valorCalc = $importeAlt * $c['valor'] / 100;
                        } else {
                            $valorCalc = $c['valor'];
                        }
                    } else {
                        $valorCalc = 0;
                    }
                } else {
                    if ($c['porciento'] == 1) {
                        $valorCalc = $importeAlt * $c['valor'] / 100;
                    } else {
                        $valorCalc = $c['valor'];
                    }
                }
                $c['valorcalculoaux'] = $valorCalc;
                $arrayAuxAlt[$c['idcategoriaprecio']] = $c;
                /*Doctrine_Query::create()
                    ->update('DatDesglosecategoriapreciofactura')
                    ->set(
                        'valorcalculo', "'" . $valorCalc . "'"
                    )
                    ->where("iddesglosecategoria = ?", array($c['iddesglosecategoria']))
                    ->execute();*/
            }
        }else {
            //sin dualidad monetaria
        }
        //print_r($arrayAux);die;
        //print_r($arrayAuxAlt);die;
        foreach ($arrayAux as $index => &$a) {
            if ($a['idnommonedatotal'] == $this->_dualidadMonedas->idmoneda) {
                $a['valorcalculo'] =  $a['valorcalculoaux'] + $arrayAuxAlt[$index]['valorcalculoaux'];
            } else {
                $a['valorcalculo'] = 0;
            }
            Doctrine_Query::create()
                ->update('DatDesglosecategoriapreciofactura')
                ->set(
                    'valorcalculo', "'" . $a['valorcalculo'] . "'"
                )
                ->where("iddesglosecategoria = ?", array($a['iddesglosecategoria']))
                ->execute();
        }

        foreach ($arrayAuxAlt as $index => &$a) {
            if ($a['idnommonedatotal'] == $this->_dualidadMonedas->idmonedaalternativa) {
                $a['valorcalculo'] =  $a['valorcalculoaux'] + $arrayAux[$index]['valorcalculoaux'];
            } else {
                $a['valorcalculo'] = 0;
            }
            Doctrine_Query::create()
                ->update('DatDesglosecategoriapreciofactura')
                ->set(
                    'valorcalculo', "'" . $a['valorcalculo'] . "'"
                )
                ->where("iddesglosecategoria = ?", array($a['iddesglosecategoria']))
                ->execute();
        }


        return true;
    }

    public function getIddocNota(){
        return ($this->objIddocNota->iddoc) ? $this->objIddocNota->iddoc : -1;
    }

    public function getOperacionesActivo($codigo = false){
        $service = new DocumentoActivoService();
        if ($codigo) {
            $oper = $service->getOperVentaAlquiler();
            foreach ($oper as $op) {
                if ($op['codigo'] == $codigo) {
                    return $op['denominacion'];
                }
            }
        } else {
            return $service->getOperVentaAlquiler();
        }
    }

    public function getNumeroFactura($iddocumento){
        $doc = Doctrine::getTable('DatDocumento')->find($iddocumento);
        if (($this->objIddocVenta->iddoc && $doc->iddoc == $this->objIddocVenta->iddoc) || ($this->objIddocDev->iddoc && $doc->iddoc == $this->objIddocDev->iddoc))
        {
            $venta = Doctrine::getTable('DatVenta')->find($iddocumento);
          return ($venta->nrofactura) ? $venta->nrofactura : $doc->nrodoc;
        } else {
          $ddf = new DatDocfactura();
          return $ddf->getNumeroFactura($iddocumento);
        }
    }

    public function delCategoriaIndExt($idexterno, $idindicador = false, $idactividad = false) {
        $query = Doctrine_Query::create()
            ->delete()
            ->from('DatIndicadorext')
            ->whereIn('idelementoexterno', $idexterno);
        if($idactividad){
            $query->andWhereIn('idactividad', $idactividad);
        }
        if(is_array($idindicador)){
            if($idindicador[0]['idindicador']) {//si el arr es asociativo  [ ['idindicador']=>#,'idactividad'=>#],.. ]
                $query->andWhere("( 0 = 1");   // para poner los OR entre ()
                foreach ($idindicador as $ind) {
                    if ($ind['idindicador'] && $ind['idactividad']) {
                        $query->orWhere(
                            'idindicador = ? and idactividad = ?', array($ind['idindicador'], $ind['idactividad'])
                        );
                    }
                }
                $query->orWhere(" 0 = 1 )"); //cerrar parentesis de los OR
            }
            else
                $query->andWhereIn('idindicador', $idindicador);
        }
        $query->execute();
    }

    public function addCategoriaIndExt($arraydatos) {
        $idexterno = $arraydatos['idexterno'];
        $indicadores = $arraydatos['indicador'];
        $coll = new Doctrine_Collection('DatIndicadorext');
        foreach ($indicadores as $dat) {
            $obj = new DatIndicadorext();
            $obj->idindicador = $dat['idindicador'];
            $obj->idactividad = $dat['idactividad'];
            $obj->idmoneda = $this->_dualidadMonedas->idmoneda;
            $obj->idelementoexterno = $idexterno;
            $obj->precio = $dat['datos'][$this->_dualidadMonedas->idmoneda]['precio'];
            $obj->idtipoprecio = $dat['idtipoprecio'];
            foreach ($dat['datos'][$this->_dualidadMonedas->idmoneda]['DatPrecio'] as $datPrecio) {
                $objCategoria = new DatIndicadorextcategoria();
                $objCategoria->synchronizeWithArray($datPrecio);
                $obj->DatIndicadorextcategoria->add($objCategoria);
            }

            $coll->add($obj);
            if (
                $this->_dualidadMonedas->idmonedaalternativa &&
                $dat['datos'][$this->_dualidadMonedas->idmonedaalternativa]
            ) {
                $objA = new DatIndicadorext();
                $objA->idindicador = $dat['idindicador'];
                $objA->idactividad = $dat['idactividad'];
                $objA->idmoneda = $this->_dualidadMonedas->idmonedaalternativa;
                $objA->idelementoexterno = $idexterno;
                $objA->precio = $dat['datos'][$this->_dualidadMonedas->idmonedaalternativa]['precio'];
                $objA->idtipoprecio = $dat['idtipoprecio'];
                foreach ($dat['datos'][$this->_dualidadMonedas->idmonedaalternativa]['DatPrecio'] as $datPrecioA) {
                    $objCategoriaA = new DatIndicadorextcategoria();
                    $objCategoriaA->synchronizeWithArray($datPrecioA);
                    $objA->DatIndicadorextcategoria->add($objCategoriaA);
                }
                $coll->add($objA);
            }

        }
        $coll->save();
    }

    /**
     *Integracion con contratacion
     *
     */
    public function addIndicadorContrato($parametros){
        $coll = new Doctrine_Collection('DatIndcontrato');
        foreach($parametros['indicadores'] as $p){
            $params = new stdClass();
            $params->idindicador = $p;
            $params->idtipoprecio = $parametros['idtipoprecio'];
            $datPrecio = $this->getPrecio($params);
            //print_r($datPrecio);die;
            $obj = new DatIndcontrato();
            $obj->idindicador = $p;
            //$obj->idactividad = $dat['idactividad'];
            $obj->idmoneda = $this->_dualidadMonedas->idmoneda;
            $obj->idcontrato = $parametros['idcontrato'];
            $obj->precio = $datPrecio['datos'][$this->_dualidadMonedas->idmoneda]['precio'];
            $obj->precioventa = $datPrecio['datos'][$this->_dualidadMonedas->idmoneda]['precioventa'];
            $obj->idtipoprecio = $parametros['idtipoprecio'];
            foreach ($datPrecio['datos'][$this->_dualidadMonedas->idmoneda]['DatPrecio'] as $data) {
                $objCategoria = new DatIndicadorcontcategoria();
                $objCategoria->synchronizeWithArray($data);
                $obj->DatIndicadorcontcategoria->add($objCategoria);
            }
            $coll->add($obj);

            if (
                $this->_dualidadMonedas->idmonedaalternativa &&
                $datPrecio['datos'][$this->_dualidadMonedas->idmonedaalternativa]
            ) {
                $objA = new DatIndcontrato();
                $objA->idindicador = $p;
                //$obj->idactividad = $dat['idactividad'];
                $objA->idmoneda = $this->_dualidadMonedas->idmonedaalternativa;
                $objA->idcontrato = $parametros['idcontrato'];
                $objA->precio = $datPrecio['datos'][$this->_dualidadMonedas->idmonedaalternativa]['precio'];
                $objA->precioventa = $datPrecio['datos'][$this->_dualidadMonedas->idmonedaalternativa]['precioventa'];
                $objA->idtipoprecio = $parametros['idtipoprecio'];
                foreach ($datPrecio['datos'][$this->_dualidadMonedas->idmonedaalternativa]['DatPrecio'] as $dataA) {
                    $objCategoriaA = new DatIndicadorcontcategoria();
                    $objCategoriaA->synchronizeWithArray($dataA);
                    $objA->DatIndicadorcontcategoria->add($objCategoriaA);
                }
                $coll->add($objA);

            }
        }
        $coll->save();
        return true;
    }

    public function delIndicadorContrato($idcontrto, $idindicador){
        $query = Doctrine_Query::create()
            ->delete()
            ->from('DatIndcontrato')
            ->whereIn('idcontrato', $idcontrto);
        if(count($idindicador) > 0){
            $query->andWhereIn('idindicador', $idindicador);
        }
        $query->execute();
    }

    /**
     * Verifica que todos los conteos fisico (ajuste de inventario) esten contabilizados.
     * @param numeric $iddocumento
     * @return boolean
     */
    public function conteoFisico($iddocumento)
    {
        $relations[] = array(
            'cardinalidad' => 'one', 'relation' => 'DatMovimientos',
            'properties' => array('local' => 'idproducto', 'foreign' => 'idproducto')
        );
        $this->doctrineHelper->tryInyectRelactions(new DatMovimientos(), $relations);
        $objDocPrim = LogisticaDocumentosHelper::__init()->devuelveIddocByIdEstructura(
            'inventariogLog', $this->global->Estructura->idestructura, LogisticaGlobal::SUBSISTEMA_INV
        );
        $inventario = new InventarioModel();
        $query = $inventario->devolverDocumentos(null, true);
        $query->innerJoin('d.DatMovimientos _m')
            ->innerJoin('_m.DatMovimientos _m2 ON _m2.idproducto = _m.idproducto')
            ->innerJoin('_m2.DatDocumento _d2')
            ->addWhere(
                '_m2.iddocumento = ? AND d.idestructuracomun = _d2.idestructuracomun AND d.estado IN (1, 2) '
                . 'AND d.iddoc = ?', array($iddocumento, $objDocPrim->iddoc)
            )
            ->orderBy('d.iddocumento');
        if ($query->count() > 0) {
            return false;
        }
        return true;
    }

    /**
     * Devuelve los contratos listos para generar factura
     * @param array
     * @return array
     */
    public function getContratos($params)
    {
        if ($params['criterio']) {
            $params['numerocontrato'] = $params['criterio'];
        }
        if (!$params['idclienteproveedor']) {
            unset($params['idclienteproveedor']);
        }
        $params['vigente'] = 1;
        $params['cliente'] = 1;
        //print_r($params);die;
        $arrayContrato = $this->crmHelper->getContratos($params);
        return array('datos' => $arrayContrato['data'], 'cantidad' => $arrayContrato['cant']);
    }

    /**
     * Devuelve los servicios por facturar de un contrato
     * @param array
     * @return array
     */
    public function getServContrato($params)
    {
        $datos = [];
        if ($params['criterio']) {
            //$params['numerocontrato'] = $params['criterio'];
        }
        $params['listofactura'] = 1;
        $arrayServicios = $this->crmHelper->getServiciosByContrato($params);
        //print_r($arrayServicios);die;
        if(count($arrayServicios['hitos']) > 0){
            foreach($arrayServicios['hitos'] as &$hito){
                $hito['denominacion'] = $hito['descripcion'];
                foreach ($hito['pago'] as $mon){
                    if ($mon['idmoneda'] == $this->_dualidadMonedas->idmoneda){
                        $hito['precio'.strtolower($this->_dualidadMonedas->codigoiso)] += $mon['monto'];
                    }
                    if ($mon['idmoneda'] == $this->_dualidadMonedas->idmonedaalternativa){
                        $hito['precio'.strtolower($this->_dualidadMonedas->codigoisoalt)] += $mon['monto'];
                    }
                }
                if(count($hito['indicadoresservicios']) > 0){
                    $hito['prodserv'] .= '<p><table style="color: #006400"><tr><td width="80"></td><td width="300"><p><b>Servicios</b></p></td>';
                    $hito['prodserv'] .= '</td><td width="80" align="right"><p><b>Cantidad</b></p></td>';
                    $hito['prodserv'] .= '</td><td width="80" align="right"><p><b>Tarifa '.$this->_dualidadMonedas->codigoiso.'</b></p></td>';
                    $hito['prodserv'] .= '</td><td width="80" align="right"><p><b>Tarifa '.$this->_dualidadMonedas->codigoisoalt.'</b></p></td></tr>';
                    foreach($hito['indicadoresservicios'] as &$p){
                        $hito['prodserv'] .= '<tr><td width="80"></td><td width="300"><p><li>'.$p['denominacion'].'</li></p></td>';
                        $hito['prodserv'] .= '<td width="80" align="right"><p>'.$p['cantidad'].'</p></td>';
                        $hito['prodserv'] .= '<td width="80" align="right"><p>'.$p['precio'].'</p></td>';
                        $hito['prodserv'] .= '<td width="80" align="right"><p>'.$p['preciodivisa'].'</p></td></tr>';
                        //$hito['servicioslist'] .= '<li>'.$p['denominacion'].'</li>';
                        //$p['idhito'] = $hito['idhito'];
                    }
                    $hito['prodserv'] .= '</table></p>';
                }
                if(count($hito['indicadoresproductos']) > 0){
                    $cantidad = (count($hito['indicadoresservicios']) > 0) ? '' : 'Cantidad';
                    $hito['prodserv'] .= '<p><table style="color: #00008b"><tr><td width="80"></td><td width="200"><p><b>Productos</b></p></td>';
                    $hito['prodserv'] .= '</td><td width="80" align="right"><p><b>'.$cantidad.'</b></p></td></tr>';
                    foreach($hito['indicadoresproductos'] as &$p){
                        $hito['prodserv'] .= '<tr><td width="80"></td><td width="200"><p><li>'.$p['denominacion'].'</li></p></td>';
                        $hito['prodserv'] .= '<td width="80" align="right"><p>'.$p['cantidad'].'</p></td></tr>';
                        //$hito['prodserv'] .= '<li>'.$p['denominacion'].'</li>';
                        //$hito['productoslist'] .= '<li>'.$p['denominacion'].'</li>';
                        //$p['idhito'] = $hito['idhito'];
                    }
                    $hito['prodserv'] .= '</table></p>';
                }
                /*$datos = array_merge($datos, $hito['indicadoresproductos']);
                $datos = array_merge($datos, $hito['indicadoresservicios']);*/
            }
            $datos = array_merge($datos, $arrayServicios['hitos']);
        }
        else {
            if(count($arrayServicios['indicadoresservicios']) > 0){
                $datos = array_merge($datos, $arrayServicios['indicadoresservicios']);
            }
        }
        return array('datos' => $datos, 'cantidad' => count($datos));
    }

    /**
     * Devuelve los productos por facturar de un contrato
     * @param array
     * @return array
     */
    public function getProdContrato($params)
    {
        $datos = [];
        if ($params['criterio']) {
            //$params['numerocontrato'] = $params['criterio'];
        }
        //print_r($params);die;
        $params['listofactura'] = 1;
        $arrayServicios = $this->crmHelper->getServiciosByContrato($params);
        //print_r($arrayServicios);die;
        if(count($arrayServicios['hitos']) > 0){
            foreach($arrayServicios['hitos'] as &$hito){
                $hito['denominacion'] = $hito['descripcion'];
                //$hito['prodserv'] = '<p><table>';
                if(count($hito['indicadoresproductos']) > 0){
                    $hito['prodserv'] .= '<p><table style="color: #00008b"><tr><td width="80"></td><td width="200"><p><b>Productos</b></p></td>';
                    $hito['prodserv'] .= '</td><td width="80" align="right"><p><b>Cantidad</b></p></td></tr>';
                    foreach($hito['indicadoresproductos'] as &$p){
                        $hito['prodserv'] .= '<tr><td width="80"></td><td width="200"><p><li>'.$p['denominacion'].'</li></p></td>';
                        $hito['prodserv'] .= '<td width="80" align="right"><p>'.$p['cantidad'].'</p></td></tr>';
                        //$hito['prodserv'] .= '<li>'.$p['denominacion'].'</li>';
                        //$hito['productoslist'] .= '<li>'.$p['denominacion'].'</li>';
                        //$p['idhito'] = $hito['idhito'];
                    }
                    $hito['prodserv'] .= '</table></p>';
                }
                if(count($hito['indicadoresservicios']) > 0){
                    $cantidad = (count($hito['indicadoresproductos']) > 0) ? '' : 'Cantidad';
                    $hito['prodserv'] .= '<p><table style="color: #006400"><tr><td width="80"></td><td width="200"><p><b>Servicios</b></p></td>';
                    $hito['prodserv'] .= '</td><td width="80" align="right"><p><b>'.$cantidad.'</b></p></td></tr>';
                    foreach($hito['indicadoresservicios'] as &$p){
                        $hito['prodserv'] .= '<tr><td width="80"></td><td width="200"><p><li>'.$p['denominacion'].'</li></p></td>';
                        $hito['prodserv'] .= '<td width="80" align="right"><p>'.$p['cantidad'].'</p></td></tr>';
                        //$hito['servicioslist'] .= '<li>'.$p['denominacion'].'</li>';
                        //$p['idhito'] = $hito['idhito'];
                    }
                    $hito['prodserv'] .= '</table></p>';
                }
                /*$datos = array_merge($datos, $hito['indicadoresproductos']);
                $datos = array_merge($datos, $hito['indicadoresservicios']);*/
            }
            $datos = array_merge($datos, $arrayServicios['hitos']);
        }
        else {
            if(count($arrayServicios['indicadoresproductos']) > 0){
                $datos = array_merge($datos, $arrayServicios['indicadoresproductos']);
            }
        }
        return array('datos' => $datos, 'cantidad' => count($datos));
    }

    public function guardarFactorMatriz($params){
        $documentoFactura = Doctrine::getTable('DatDocFactura')->find($params->productos[0]->iddocumento);
        $prodFactor = Doctrine::getTable('DatProdFactura')->findByDql("idmovimiento IN (".implode(',', $params->idmovimiento).")");
        foreach ($prodFactor as $index => $p) {
            $params->productos[$index]->cambioTipoPrecio = 1;
            $p->factorconvercion =  $params->referencia / $params->factura;
            $p->save();
        }
        $this->modificarProductos(array('productos'=>$params->productos), $documentoFactura);
        return true;
    }
    
    public function getDepositosEntidad()
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
        return $datosDepositos;
    }

    public function getVendedores($params) {
        //$confFactModel = new ConfFacturacionModel();
        return $this->confFactModel->getVendedores($params);
    }

    public function cargarFormaPago($params) {
        $query = new Doctrine_Query();
        $query->select(
            'nf.idmodopago as idnomformapago,
             nf.denominacion,
             nf.recargodescuento,
             nf.valor,
             nf.porcentual'
        )
            ->from('NomModopago nf');

        $formasPago = $query->fetchArray();
        //print_r($operaciones);die;
        return array('datos'=>$formasPago, 'total'=>count($formasPago));
    }
    
    public function getIdNaturalezaExtra(){
        $conn = Zend_Registry::get('conexion');
        $q = $conn->execute("
                Select nat.idnaturaleza from mod_datosmaestros.nom_naturaleza nat where nat.idnaturaleza = -10 or nat.codigo = 'CST' 
                ")
            ->fetchAll(PDO::FETCH_COLUMN);
        if(count($q))
          return $q;
        else
          return false;
    }
    
    public function aplicarTipoPrecio($params) {
      $doc = $this->findDocumento($params['iddocumento']);
      if ($doc->estado == EstadoDocumentoModel::ESTADO_ELABORACION) {
          $documento = Doctrine::getTable("DatDocfactura")->find($params['iddocumento']);
          if ($params['idmonedaprod'] || $params['idmonedaserv']) {
              if (!$params['idmonedaprod']) {
                  unset($params['idmonedaprod']);
              }
              if (!$params['idmonedaserv']) {
                  unset($params['idmonedaserv']);
              }
              $documento->synchronizeWithArray($params);
              $documento->save();
          }
          if($params['tipo'] == 1) {
            $productos = $this->getProductosDb(
                array(
                    'iddocumento' => $params['iddocumento'],
                    'idsubsistema' => $documento->idsubsistema,
                    'dql' => 1,
                    'tipoDoc' => ($documento->oferta != 0 && $documento->oferta != null) ? 1 : false
                )
            )->fetchArray();
            foreach ($productos as &$p) {
                $p['cambioTipoPrecio'] = 1;
                if (!$params['idtipoprecio']){
                    unset($params['idtipoprecio']);
                } else {
                    $p['idtipoprecio'] = $params['idtipoprecio'];
                }

                if ($documento->idsubsistema == LogisticaGlobal::SUBSISTEMA_INV) {
                    unset($p['DatProductoLogistica']);
                    unset($p['DatProdFactura']);
                    unset($p['DatMovmoneda']);
                }
            }
            $this->modificarProductos(array('productos'=>$productos), $documento);
          } else {
            $elemtModel = new ElementosFacturaModel();
            $servicios = $this->getServiciosDb(
                array(
                    'iddocumento' => $params['iddocumento'],
                    'idsubsistema' => $documento->idsubsistema,
                    'dql' => 1
                )
            )->fetchArray();
            foreach ($servicios as &$s) {
                $s['cambioTipoTarifa'] = 1;
                $s['idtipoprecio'] = $params['idtipoprecio'];
            }
            //$elemtModel->modificarElementos($params, $documentoFactura, 0);
            $elemtModel->modificarElementos(array('servicios'=>$servicios), $documento, 0);
          }
          $this->actualizarImporte($params['iddocumento']);
          return true;
      }
    }

    public function calcularPrecioVentaPromedioCentral(&$precio, $params){
        $indicador = Doctrine::getTable('NomIndicador')->find($params->idindicador);
        $media = 0;
        if ($params->formula == 1) {
            $media = round(($indicador->precio*$params->mediaproductos) - $indicador->precio,2);
            $dp = array(array('preciocontable' => $indicador->precio*$params->mediaproductos, 'precioalternativo' => $indicador->precioalternativo));
        } else {
            $dp = array(array('preciocontable' => $indicador->precio, 'precioalternativo' => $indicador->precioalternativo));
        }
        foreach($precio['datos'][0]['DatMatrizpreciodualmonetaria'] as &$dat){
            $sumas = 0;
            $restas = 0;
            //if($dat['idmoneda'] == $this->_dualidadMonedas->idmoneda){
                $valorRef = $dp[0]['preciocontable'];

            /*}else{
                $valorRef = $dp[0]['precioalternativo'];
            }*/
            foreach ($dat['DatPrecio'] as $datosPrecio) {
                if ($datosPrecio['porciento'] != 1) {
                    if ($datosPrecio['concepto'] == '+') {
                        $sumas += $datosPrecio['valor'];
                    } else {
                        $restas += $datosPrecio['valor'];
                    }
                } else {
                    $calculo = $valorRef * $datosPrecio['valor'] / 100;
                    if ($datosPrecio['concepto'] == '+') {
                        $sumas += $calculo;
                    } else {
                        $restas += $calculo;
                    }
                }
            }
            if ($params->formula != 1) {
                $media = (($valorRef + $sumas - $restas)*$params->mediaproductos) - ($valorRef + $sumas - $restas);
            }
            $dat['precioventa'] = $this->formulaPVenta($valorRef, $params->mediaproductos, $sumas ,$restas, $params->formula);
            $dat['precio'] = $valorRef;
            $dat['media'] = $media;
        }
    }

    public function formulaPVenta($ref, $media, $suma, $resta, $formula) {
        return ($formula == 1) ? $ref + $suma - $resta : ($ref + $suma - $resta)*$media;
    }

    public function getTipoTasa() {
        return $this->_tipotasa;
    }
	
	public function verificarNroOrden($params) {
      if ($params['nrorden']) {
        $conn = Zend_Registry::get('conexion');
        $q = $conn->execute("
                Select df.nrofactura from mod_logfacturacion.dat_docfactura df 
                inner join mod_logistica.dat_documento dd on dd.iddocumento = df.idfactura 
                where dd.iddocumento <> {$params['iddocumento']} and dd.estado in (1,2,4) and df.nrorden = '{$params['nrorden']}' 
                and dd.idestructuracomun = {$this->idestructura} 
                ")
            ->fetchAll(PDO::FETCH_ASSOC);
        if(count($q) > 0) {
          throw new LogisticaException('LOG_LB_FAC_008', null, null, $q[0]['nrofactura']);
        }
      }
    }

    public function getNaturalezaIndicador($idindicador) {
        if ($idindicador) {
            $conn = Zend_Registry::get('conexion');
            $q = $conn->execute("
                Select coalesce(i.idnaturaleza,-1) from mod_datosmaestros.nom_indicador i  
                where i.idindicador = {$idindicador} 
                ")
                ->fetchAll(PDO::FETCH_COLUMN);
            return $q[0];
        } else {
            -1;
        }
    }

    public function getMediaNaturaleza($params) {
        $conn = Zend_Registry::get('conexion');
        $q = $conn->execute("
                Select nm.media from mod_logfacturacion.dat_naturalezamedia nm  
                where nm.idtipoprecio = {$params['idtipoprecio']} and nm.idnaturaleza = {$params['idnaturaleza']} 
                ")
            ->fetchAll(PDO::FETCH_COLUMN);
        return $q;
    }

    public function getMediaSector($params) {
        $conn = Zend_Registry::get('conexion');
        $q = $conn->execute("
                Select sm.media from mod_logfacturacion.dat_sectormedia sm  
                where sm.idtipoprecio = {$params['idtipoprecio']} and sm.idnaturaleza = {$params['idnaturaleza']} 
                and sm.idsector = {$params['idsector']}
                ")
            ->fetchAll(PDO::FETCH_COLUMN);
        return $q;
    }

    public function getSectorCliente($idcliente) {
        $conn = Zend_Registry::get('conexion');
        $q = $conn->execute("
                select coalesce(nc.idsector,-1) from mod_datosmaestros.nom_clientesproveedor nc where nc.idclientesproveedores = {$idcliente}
                ")
            ->fetchAll(PDO::FETCH_COLUMN);
        return $q[0];
    }

    public function getOperacionComprobante($idoperacion) {
        $aux = Doctrine::getTable('DatOperacionsubsistema')->findBySql(
            'idnomoperaciones = ? and idestructura = ?', array($idoperacion, $this->idestructura)
        );
        return $aux[0]['comprobante'];
    }

    public function getOperacionObligaciones($idoperacion) {
        $aux = Doctrine::getTable('DatOperacionsubsistema')->findBySql(
            'idnomoperaciones = ? and idestructura = ?', array($idoperacion, $this->idestructura)
        );
        return (is_null($aux[0]['cobropago'])) ? 1 : $aux[0]['cobropago'];
    }

    /**
     * $params = [
     * 'start'?: numeric,
     * 'limit'?: numeric
     * 'idcentrocosto'?: numeric,
     * 'denominacion'?: string,
     * 'idestructura'?: string,
     * 'indicativo'?': string
     * 'nromatricula'?': string
     * ]
     */
    public function cargarAft($params) {
        $aftTranspService = new RegNumActivoService();
        $activos = $aftTranspService->getMediosTransportes($params);
        $activos['cantidad'] = $activos['total'];
        return $activos;
    }

    public function getDatosFacturaXml($iddocumento)
    {
        $sql = "SELECT df.nrofactura, dd.fechacontable, 
                des.codigonit as nitproveedor, '' as nircproveedor, 
                (select array_to_string(array_agg(ncb.nrocuenta),', ') from mod_banco.nom_cuentabancaria ncb
                  inner join mod_datosmaestros.nom_banco nb on nb.idbanco = ncb.idbanco  
                  inner join mod_datosmaestros.nom_sucursal ns on ns.idsucursal = ncb.idsucursal
                  where ncb.idcuentabancaria in (select dcf1.idcuenta from mod_logfacturacion.conf_cuentafactura dcf1
                where dcf1.idestructuracomun = des.idestructura and ncb.idmoneda = 9900000000)) as cuentaproveedor,
                (select array_to_string(array_agg(ns.numero),', ') from mod_banco.nom_cuentabancaria ncb
                  inner join mod_datosmaestros.nom_banco nb on nb.idbanco = ncb.idbanco  
                  inner join mod_datosmaestros.nom_sucursal ns on ns.idsucursal = ncb.idsucursal
                  where ncb.idcuentabancaria in (select dcf1.idcuenta from mod_logfacturacion.conf_cuentafactura dcf1
                where dcf1.idestructuracomun = des.idestructura) 
                and ncb.idestructuracomun = des.idestructura and ncb.idmoneda = 9900000000) as sucursalproveedor,
                coalesce((select per.nombre from mod_persona.dat_persona per where per.idpersona = df.idvendedor),'') as nombrevendedor,
                COALESCE((select per.papel from mod_persona.dat_persona per where per.idpersona = df.idvendedor),'') as papellidovendedor,
                coalesce((select per.sapel from mod_persona.dat_persona per where per.idpersona = df.idvendedor),'') as sapellidovendedor,
                coalesce((select per.idsuin from mod_persona.dat_persona per where per.idpersona = df.idvendedor),'') as civendedor,
                des.direccion as direccionproveedor,
                (select dpt.denominacion from mod_datosmaestros.nom_dpt dpt where dpt.iddpt = deo.iddpt) as municipio,
                (select dpt.denominacion from mod_datosmaestros.nom_dpt dpt where dpt.iddpt = (
                    select dpt1.idpadre from mod_datosmaestros.nom_dpt dpt1 where dpt1.iddpt = deo.iddpt
                )) as provincia,
                ncp.codigo as codreupcliente,
                ncp.codigonit as nitcliente,
                '' as nirccliente,
                (select array_to_string(array_agg(dcb.numerocuenta),', ') from mod_datosmaestros.dat_cuentabanccliente dcb
                  inner join mod_datosmaestros.nom_banco nb on nb.idbanco = dcb.idbanco
                  left join mod_datosmaestros.nom_sucursal ns on ns.idsucursal = dcb.idsucursal
                  where dcb.idcuentabancliente in (select dcc1.idcuentacliente from mod_logfacturacion.dat_cuentafacturacliente dcc1
                where dcc1.idfactura = dd.iddocumento)) as cuentacliente,
                (select array_to_string(array_agg(distinct ns.numero),', ') from mod_datosmaestros.dat_cuentabanccliente dcb
                  inner join mod_datosmaestros.nom_banco nb on nb.idbanco = dcb.idbanco
                  inner join mod_datosmaestros.nom_sucursal ns on ns.idsucursal = dcb.idsucursal
                  where dcb.idcuentabancliente in (select dcc.idcuentacliente from mod_logfacturacion.dat_cuentafacturacliente dcc
                where dcc.idfactura = dd.iddocumento)) as sucursalcliente,
                ncp.nombre as nombrecomercial,
                ncp.direccion as direccioncliente,
                (select dpt.denominacion from mod_datosmaestros.nom_dpt dpt where dpt.iddpt = ncp.dpa) as municipiocliente,
                (select dpt.denominacion from mod_datosmaestros.nom_dpt dpt where dpt.iddpt = (
                    select dpt1.idpadre from mod_datosmaestros.nom_dpt dpt1 where dpt1.iddpt = ncp.dpa
                )) as provinciacliente,
                (case when df.idmoneda is null then (
                    select nm.codigoiso from mod_datosmaestros.nom_moneda nm where nm.idmoneda = {$this->_dualidadMonedas->idmoneda}
                ) else (
                    select nm.codigoiso from mod_datosmaestros.nom_moneda nm where nm.idmoneda = df.idmoneda
                ) end) as moneda,
                nop.denominacion as operacion,
                tr.nombrechofer as nombretransportador,
                tr.identidadchofer as citransportador,
                tr.matriculavehiculo as matricula,
                tr.cartaporte
                 from mod_logfacturacion.dat_docfactura df
                inner join mod_logistica.dat_documento dd on dd.iddocumento = df.idfactura
                inner join mod_estructuracomp.v_dametodasestructuras des on des.idestructura = dd.idestructuracomun
                left join mod_estructuracomp.dat_estructuraop deo on deo.idestructuraop = des.idestructura
                inner join mod_logistica.dat_documentocliente dc on dc.iddocumento = dd.iddocumento
                inner join mod_datosmaestros.nom_clientesproveedor ncp on ncp.idclientesproveedores = dc.idcliente
                inner join mod_datosmaestros.nom_operacion nop on nop.idnomoperaciones = dd.idoperacion
                left join mod_logfacturacion.dat_docfacturatransportacion tr on tr.idfactura = dd.iddocumento
                where dd.iddocumento = {$iddocumento}";
        $datos = Doctrine_Manager::connection()->fetchAll($sql);
        return $datos;
    }

    public function getFacturaXml($iddocumento)
    {
        $datos = $this->getDatosFacturaXml($iddocumento);
        $id = $datos[0]['nrofactura'];
        $fecha = $datos[0]['fechacontable'];
        $xml = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>";
        $xml .= "<e-FACTURA xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xsi:noNamespaceSchemaLocation=\"e-Factura%20Schema.xsd\">";
        $xmlCabecera = "<Cabecera><IdFactura>$id</IdFactura><Estados>";
        $xmlCabecera .= "<Estado nombre=\"Emitida\" fecha=\"0000-01-01T00:00:00.000Z\"/>";
        $xmlCabecera .= "<Estado nombre=\"Firmada\" fecha=\"0000-01-01T00:00:00.000Z\"/>";
        $xmlCabecera .= "<Estado nombre=\"Pagada\" fecha=\"0000-01-01T00:00:00.000Z\"/>";
        $xmlCabecera .= "</Estados><FechaEmision>$fecha</FechaEmision></Cabecera>";
        $xml .= $xmlCabecera;
        $xml .= "<Cuerpo>";
        $xmlPartes = "<Partes>";
        $xmlPartes .= "<Proveedor TipoPersona=\"Natural\">";
        $xmlPartes .= "<IdentificacionFiscal>";
        $xmlPartes .= "<NIT>{$datos[0]['nitproveedor']}</NIT>";
        $xmlPartes .= "<NoInscipcionRegistroComercial></NoInscipcionRegistroComercial>";
        $xmlPartes .= "<CuentaBancaria>{$datos[0]['cuentaproveedor']}</CuentaBancaria>";
        $xmlPartes .= "<SucursalBancaria>{$datos[0]['sucursalproveedor']}</SucursalBancaria>";
        $xmlPartes .= "</IdentificacionFiscal>";
        $xmlPartes .= "<DatosPersonales>";
        $xmlPartes .= "<Uuid></Uuid>";
        $xmlPartes .= "<CI>{$datos[0]['civendedor']}</CI><PrimerNombre>{$datos[0]['nombrevendedor']}</PrimerNombre>";
        $xmlPartes .= "<PrimerApellido>{$datos[0]['papellidovendedor']}</PrimerApellido><SegundoApellido>{$datos[0]['sapellidovendedor']}</SegundoApellido>";
        $xmlPartes .= "<FirmaDigital/></DatosPersonales>";
        $xmlPartes .= "<Direccion>";
        $xmlPartes .= "<PrimeraLinea>{$datos[0]['direccionproveedor']}</PrimeraLinea>";
        $xmlPartes .= "<Municipio>{$datos[0]['municipio']}</Municipio>";
        $xmlPartes .= "<Provincia>{$datos[0]['provincia']}</Provincia>";
        $xmlPartes .= "</Direccion></Proveedor>";
        $xmlPartes .= $this->getCompradorXml($iddocumento, $datos);
        $xmlPartes .= "</Partes>";
        $xmlDetalles = $this->getDetallesXml($iddocumento, $datos);
        $xmlMovimiento = $this->getMovimientoXml($iddocumento, $datos);
        $xml .= $xmlPartes.$xmlDetalles.$xmlMovimiento;
        /*foreach ($datos as $index => $d) {
            $i = $index+1;
            $xml .= "<prod-exp Product-ID=\"{$i}\" Prod-recno=\"{$d['numeropieza']}\" Description=\"{$d['denominacion']}\" synonym=\"{$d['numeropieza']}\" status-code=\"a\" unit-price=\"{$d['precio']}\" afs=\"{$d['cantidad']}\" unit-id=\"{$d['um']}\" log-action=\"c\" />";
        }*/
        $xml .= "</Cuerpo>";
        $xml .= "</e-FACTURA>";
        return $xml;
    }

    public function getDatosProductos($iddocumento) {
        $sqlProductos = "select * from mod_logfacturacion.f_modelofacturaprod({$iddocumento}, {$this->_dualidadMonedas->idmoneda}, -1)";
        $productos = Doctrine_Manager::connection()->fetchAll($sqlProductos);
        return $productos;
    }

    public function getRefProducto($idindicador) {
        $sqlRef = "select nih.referencia from mod_datosmaestros.nom_indicadorhoja nih where nih.idindicador = {$idindicador}";
        $ref = Doctrine_Manager::connection()->fetchAll($sqlRef);
        return $ref;
    }

    public function getCompradorXml($iddocumento, $datos) {
        $xml = "<Comprador TipoPersona=\"Juridica\">";
        $xml .= "<IdentificacionFiscal><CodigoREEUP>{$datos[0]['codreupcliente']}</CodigoREEUP>";
        $xml .= "<NIT>{$datos[0]['nitcliente']}</NIT>";
        $xml .= "<NoInscipcionRegistroComercial>{$datos[0]['nirccliente']}</NoInscipcionRegistroComercial>";
        $xml .= "<CuentaBancaria>{$datos[0]['cuentacliente']}</CuentaBancaria>";
        $xml .= "<SucursalBancaria>{$datos[0]['sucursalcliente']}</SucursalBancaria></IdentificacionFiscal>";
        $xml .= "<DatosPersonales><Uuid>-</Uuid>
					<PrimerNombre></PrimerNombre>
					<SegundoNombre></SegundoNombre>
					<PrimerApellido></PrimerApellido>
					<SegundoApellido></SegundoApellido>
					<FirmaDigital/></DatosPersonales>";
        $xml .= "<NombreComercial>{$datos[0]['nombrecomercial']}</NombreComercial>";
        $xml .= "<Direccion><PrimeraLinea>{$datos[0]['direccioncliente']}</PrimeraLinea>";
        $xml .= "<Municipio>{$datos[0]['municipiocliente']}</Municipio>";
        $xml .= "<Provincia>{$datos[0]['provinciacliente']}</Provincia>";
        $xml .= "</Direccion></Comprador>";
        return $xml;
    }

    public function getDetallesXml($iddocumento, $datos) {
        $importes = $this->getImporteTotalDocumento($iddocumento);
        $xml = "<DetallesFactura>";
        $xml .= "<InfoGeneral><TipoMoneda>{$datos[0]['moneda']}</TipoMoneda>";
        $xml .= "<Operaciones>{$datos[0]['operacion']}</Operaciones>";
        $xml .= "<ImporteTotal>{$importes['importecontable']}</ImporteTotal>";
        $xml .= "<SubTotal>0</SubTotal></InfoGeneral>";
        $xml .= "<Impuesto><BaseImponible>0</BaseImponible>";
        $xml .= "<TipoImpositivo>0</TipoImpositivo>";
        $xml .= "<Porciento>0</Porciento></Impuesto>";

        $sqlProductos = "select * from mod_logfacturacion.f_modelofacturaprod({$iddocumento}, {$this->_dualidadMonedas->idmoneda}, -1)";
        $productos = Doctrine_Manager::connection()->fetchAll($sqlProductos);

        foreach ($productos as $p) {
            $xml .= "<Productos><Codigo>{$p['codigo']}</Codigo>";
            $xml .= "<Descripcion>{$p['denom']}</Descripcion>";
            $xml .= "<UM>{$p['um']}</UM>";
            $xml .= "<Cantidad>{$p['cantidad']}</Cantidad>";
            $xml .= "<PrecioUnitarioTotal>{$p['precio']}</PrecioUnitarioTotal>";
            $xml .= "<SaldoEnExistencia>{$p['existencia']}</SaldoEnExistencia>";
            $xml .= "<Importe>{$p['importe']}</Importe></Productos>";
        }

        $xml .= "</DetallesFactura>";
        return $xml;
    }

    public function getMovimientoXml($iddocumento, $datos) {
        $xml = "<Movimiento><Transportista><DatosPersonales>";
        $xml .= "<Uuid>-</Uuid>";
        $xml .= "<CI>{$datos[0]['citransportador']}</CI>";
        $xml .= "<PrimerNombre>{$datos[0]['nombretransportador']}</PrimerNombre>";
        $xml .= "<PrimerApellido>-</PrimerApellido>";
        $xml .= "<SegundoApellido>-</SegundoApellido></DatosPersonales>";
        $xml .= "<Transporte><Matricula>{$datos[0]['matricula']}</Matricula>";
        $xml .= "<NoCartaPorte>{$datos[0]['cartaporte']}</NoCartaPorte></Transporte>";
        $xml .= "</Transportista></Movimiento>";
        return $xml;
    }

    public function getIdFile($iddocumento)
    {
        $sql = "select df.idfilexml from mod_logfacturacion.dat_docfactura df where df.idfactura = {$iddocumento}";
        $data = $this->doctrineHelper->getConnection()->fetchAssoc($sql);
        $idGenerado = null;
        if (count($data) && $data[0]['idfilexml']) {
            $idGenerado = $data[0]['idfilexml'];
        } else {
            $idGenerado = $this->objectHelper->guidv4();
            $this->doctrineHelper->getConnection()->execute(
                "update mod_logfacturacion.dat_docfactura set idfilexml = '{$idGenerado}' 
                 where idfactura = {$iddocumento} and idfilexml is null"
            );
        }
        return $idGenerado;
    }

    public function cargarContactos($params)
    {
        $conn = Doctrine_Manager:: connection();
        $result = $conn->fetchAll(
            "SELECT distinct c.idcontacto,(c.nombre || ' ' ||c.numeroidentidad) as nombre
                      FROM mod_datosmaestros.nom_contacto c 
                      inner join mod_crmclienteproveedor.dat_facultad f on f.idcontacto = c.idcontacto
                      inner join mod_logfacturacion.dat_facultadcomprador dfc on dfc.idfacultad = f.idtipofacultad
                      WHERE c.idclientesproveedores={$params['idcliente']} ORDER BY c.idcontacto;"
        );

        return array('datos' => $result);
    }

    public function cargarNomCilindros($params)
    {
        $conn = Doctrine_Manager:: connection();
        $result = $conn->fetchAll(
            "SELECT c.idnomcilindro, c.denominacion, c.capacidad, um.abreviaturaunidadmedida as umedida, c.idumedida
                      FROM mod_logfacturacion.nom_cilindro c 
                      inner join mod_datosmaestros.nom_unidadmedida um on um.idunidadmedida = c.idumedida
                      WHERE c.idnomcilindro not in (
                        select dcf.idnomcilindro from mod_logfacturacion.dat_cilindrofactura dcf
                        where dcf.iddocumento = {$params['iddocumento']} and dcf.idindicador = {$params['idindicador']}
                      )
                      ORDER BY c.capacidad;"
        );

        return array('datos' => $result);
    }

    public function adicionarCilindroFactura($params)
    {
        $documento = Doctrine::getTable('DatDocumento')->find($params['util']->iddocumento);
        if ($documento->estado == EstadoDocumentoModel::ESTADO_ELABORACION) {
            $coll = new Doctrine_Collection('DatCilindroFactura');
            $u = (array) $params['util'];
            foreach ($params['cilindros'] as $c) {
                $c = (array) $c;
                $obj = new DatCilindroFactura();
                $obj->synchronizeWithArray(array_merge($c,$u));
                $coll->add($obj);
            }
            $coll->save();
        }
    }

    public function eliminarCilindro($params) {
        if (count($params['datos'])) {
            $obj = Doctrine::getTable('DatCilindroFactura')->find($params['datos'][0]);
            $iddocumento  = $obj->iddocumento;
            Doctrine_Query::create()
                ->delete()
                ->from('DatCilindroFactura')
                ->whereIn(
                    'idcilindrofactura', $params['datos']
                )
                ->execute();
            $params['notIn'] = implode(',', $params['datos']);
            $params['idindicador'] = $obj->idindicador;
            $params['iddocumento'] = $iddocumento;
            $cantidadSinMod = $this->sumCantidad($params);

            $documentoFactura = Doctrine::getTable('DatDocfactura')->find($params['iddocumento']);
            $producto = $this->getProductosDb(array(
                'idsubsistema' => $documentoFactura->idsubsistema,
                'iddocumento' => $params['iddocumento'],
                'dql' => true
            ));
            if ($obj->idmovimiento) {
                $producto->addWhere('mov.idmovimiento = ?', array($obj->idmovimiento));
            } else {
                $producto->addWhere('def.idelementofactura = ?', array($obj->idelementofactura));
            }
            $prod = $producto->fetchArray();
            foreach ($prod as &$p) {
                $p['cantidad'] = $cantidadSinMod[0]['cantidad'];
                unset($p['DatProductoLogistica']);
                unset($p['DatProdFactura']);
                unset($p['DatMovmoneda']);
            }
            $this->modificarProductos(array('productos'=>$prod), $documentoFactura);

            $this->actualizarImporte($iddocumento);
            $result = $this->getImporteTotalDocumento($iddocumento);
            return $result;
        }
    }

    public function modificarCilindro($params)
    {
        $documento = Doctrine::getTable('DatDocumento')->find($params['iddocumento']);
        if ($documento->estado == 1) {
            $coll = new Doctrine_Collection('DatCilindroFactura');
            $cantidadMod = 0;
            $notIn = array();
            foreach ($params['cilindros'] as $c) {
                $c = (array) $c;

                $qfactoraux = $this->maestroP->cargarFactorConversion(
                    array('idindicador'=>$c['idindicador'], 'idunidadmedida'=>$c['idumedida']),true
                );
                $factoraux = $qfactoraux->fetchArray();
                if (count($factoraux)) {
                    $c['factorconversion'] = $factoraux[0]['factorconversion'];
                } else {
                    $c['factorconversion'] = 1;
                }
                $params['idindicador'] = $c['idindicador'];
                $c['calculo'] = $c['cantidad'] * $c['capacidad'] / $c['factorconversion'];
                $obj = new DatCilindroFactura();
                $obj->assignIdentifier($c['idcilindrofactura']);
                $obj->synchronizeWithArray($c);
                $coll->add($obj);
                $cantidadMod += $c['calculo'];
                array_push($notIn, $c['idcilindrofactura']);
            }
            $params['notIn'] = implode(',', $notIn);
            $cantidadSinMod = $this->sumCantidad($params);
            $documentoFactura = Doctrine::getTable('DatDocfactura')->find($params['iddocumento']);
            $producto = $this->getProductosDb(array(
                'idsubsistema' => $documentoFactura->idsubsistema,
                'iddocumento' => $params['iddocumento'],
                'dql' => true
            ));
            if ($params['idmovimiento']) {
                $producto->addWhere('mov.idmovimiento = ?', array($params['idmovimiento']));
            } else {
                $producto->addWhere('def.idelementofactura = ?', array($params['idelementofactura']));
            }
            $prod = $producto->fetchArray();
            foreach ($prod as &$p) {
                $p['cantidad'] = $cantidadSinMod[0]['cantidad'] + $cantidadMod;
                unset($p['DatProductoLogistica']);
                unset($p['DatProdFactura']);
                unset($p['DatMovmoneda']);
            }
            $this->modificarProductos(array('productos'=>$prod), $documentoFactura);
            $coll->save();
            $result = $this->getImporteTotalDocumento($params['iddocumento']);
            return $result;
        }
    }

    public function cargarCilindros($params)
    {
        $conn = Doctrine_Manager:: connection();
        $and = ($params['idmovimiento'])
            ? " and c.idmovimiento = {$params['idmovimiento']}"
            : " and c.idelementofactura = {$params['idelementofactura']}";
        if ($params['notIn']) {
            $and .= " and c.idcilindrofactura not in ({$params['notIn']})";
        }
        $result = $conn->fetchAll(
            "SELECT c.idcilindrofactura, c.idindicador, c.idnomcilindro, c.denominacion, c.capacidad, um.abreviaturaunidadmedida as umedida, c.idumedida, c.cantidad
                      FROM mod_logfacturacion.dat_cilindrofactura c 
                      inner join mod_datosmaestros.nom_unidadmedida um on um.idunidadmedida = c.idumedida
                      WHERE c.iddocumento = {$params['iddocumento']} and c.idindicador = {$params['idindicador']} {$and}
                      ORDER BY c.capacidad;"
        );

        return array('datos' => $result);
    }

    public function sumCantidad($params)
    {
        $conn = Doctrine_Manager:: connection();
        if ($params['idmovimiento']) {
            $and = " and c.idmovimiento = {$params['idmovimiento']}";
        } else if ($params['idelementofactura']) {
            $and = " and c.idelementofactura = {$params['idelementofactura']}";
        }
        if ($params['notIn']) {
            $and .= " and c.idcilindrofactura not in ({$params['notIn']})";
        }
        $result = $conn->fetchAll(
            "SELECT COALESCE(sum(coalesce(c.calculo,0)),0) as cantidad
                      FROM mod_logfacturacion.dat_cilindrofactura c 
                      inner join mod_datosmaestros.nom_unidadmedida um on um.idunidadmedida = c.idumedida
                      WHERE c.iddocumento = {$params['iddocumento']} and c.idindicador = {$params['idindicador']} {$and};"
        );

        return $result;
    }

    public function getNameFile($iddocumento)
    {
        $sql = "select df.idfilecsv, df.nrofactura, d.anno, des.codigo from mod_logfacturacion.dat_docfactura df 
                inner join mod_logistica.dat_documento d on d.iddocumento = df.idfactura 
                inner join mod_estructuracomp.v_dametodasestructuras des on des.idestructura = d.idestructuracomun
                where df.idfactura = {$iddocumento}";
        $data = $this->doctrineHelper->getConnection()->fetchAssoc($sql);
        $idGenerado = null;
        if (count($data) && $data[0]['idfilecsv']) {
            $idGenerado = $data[0]['idfilecsv'];
        } else {
            $idGenerado = $data[0]['codigo'].'_'.$data[0]['anno'].'_'.$data[0]['nrofactura'];
            $this->doctrineHelper->getConnection()->execute(
                "update mod_logfacturacion.dat_docfactura set idfilecsv = '{$idGenerado}' 
                 where idfactura = {$iddocumento} and idfilecsv is null"
            );
        }
        return $idGenerado;
    }

    public function verificarEliminarTaller() {
        $delete = "select count(nv.nombre) from mod_logistica.nom_variableglobal nv 
                          where nv.nombre = 'DELETE_NO_TALL' and nv.valor = 'true'";
        $activa = LogisticaDoctrineHelper::__init()->getConnection()->execute($delete)->fetchAll(PDO::FETCH_COLUMN);
        if ($activa[0] > 0) {
            throw new ZendExt_Exception('LOG_LB_FAC_011');
            return false;
        }
        return true;
    }
    
    public function cambiarEstadoHitos($hitos, $estado){
        if(count($hitos) > 0){
            $this->crmHelper->cambiarEstadoHito(
                array('idhito' => $hitos, 'estado' => $estado)
            );
        }
        return true;
    }

    public function getHitosFactura($iddocumento){
        $query = "select distinct d.idhito from mod_logfacturacion.dat_elementosfactura d
                  where d.idfactura in ({$iddocumento}) and d.idhito is not null";
        $idHitos = LogisticaDoctrineHelper::__init()->getConnection()->execute($query)
            ->fetchAll(PDO::FETCH_COLUMN);
        return $idHitos;
    }

}
