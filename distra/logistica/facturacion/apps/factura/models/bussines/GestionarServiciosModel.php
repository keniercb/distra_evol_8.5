<?php

/**
 * Esta clase gestiona los servicios de la factura
 *
 * @package    Facturacion
 * @author     Division de Gestion de Entidades
 * @copyright  XETID
 * @version    5.0
 */
class GestionarServiciosModel extends ZendExt_Model
{

    private $elementosFactura;
    private $configuracionHelper;
    private $idestructura;
    private $_monedas;

    public function __construct()
    {
        parent::__construct();
        $this->elementosFactura = new ElementosFacturaModel();
        $this->configuracionHelper = ServiciosConfiguracionGeneralHelper::__init();
        $this->idestructura = $this->global->Estructura->idestructura;
        $this->_monedas = LogisticaGlobal::__init()->getMonedaEntidad();
    }

    public function adicionarServicios($documento, $parametros)
    {
        $servicios = $parametros['servicios'];
        $iddocumento = (is_object($documento)) ? $documento->iddocumento : $documento;
        $documentoFactura = Doctrine::getTable('DatDocfactura')->find($iddocumento);
        $idmonedafactura = ($parametros['idmoneda']) ? $parametros['idmoneda'] : $documentoFactura->idmoneda;
        $collection = new Doctrine_Collection('DatElementosFactura');
        $modelFactura = new GestionarFacturaModel(
            array('alias' => 'facturaLog', 'subsistema' => LogisticaGlobal::SUBSISTEMA_FAC)
        );
        /*if (count($parametros['docorigen']) > 0) {
            $iddocOrigen = Doctrine::getTable('DatDocumento')
                ->find($parametros['docorigen'][0])->iddoc;
        }*/
        $noNota = (!$parametros['deconduce'] && $parametros['tipoDoc'] != 'nd' && $parametros['tipoDoc'] != 'nc') ? true : false;
        $monedas = $modelFactura->getMonedaContableAlternativa();//esto hay q remplazarlo por lo nuevo
        $dualidad = $modelFactura->getDualidadMonedas();
        $idmonedacontable = $modelFactura->getDualidadMonedas()->idmoneda;
        if(count($parametros['docorigen']) > 0)
            $iddocOrigen = Doctrine::getTable('DatDocumento')->find($parametros['docorigen'][0])->iddoc;
        if($iddocOrigen && $iddocOrigen == $modelFactura->getIddocOrden()) {
            $orden = true;
        }
        foreach ($servicios as $k => &$serv) {
            $serv = (array)$serv;
            if ($orden) {
                $datosCmptoOrden['actividades'][$k] =
                    array('idindicador' => $serv['idindicador'], 'enprocesonuevo' => $serv['cantidad'],
                        'iddocorigen' => $parametros['docorigen'], 'enprocesoviejo' => 0);
            }
            unset($serv['idfactura']);
            if (!is_numeric($serv['idhito'])) {
                unset($serv['idhito']);
            }
            $objDatElemento = new DatElementosFactura();
            $objDatElemento->idfactura = $iddocumento;
            //if (!isset($serv['idactividad'])) {
                if($parametros['idcontrato']){
                    /*$dqlServ = Doctrine::getTable('DatIndcontrato')->findByDql(
                        'idcontrato = ? and idindicador = ? and idmoneda = ?',
                        array($parametros['idcontrato'], $serv['idindicador'], $idmonedacontable)
                    );
                    if (count($dqlServ)) {
                        $serv['idtipoprecio'] = $dqlServ[0]['idtipoprecio'];
                        $serv['preciotarifabase'] = $dqlServ[0]['precioventa'];
                        $serv['preciotarifaoriginal'] = $dqlServ[0]['precioventa'];
                    } else {*/
                        $serv['idtipoprecio'] = -2;
                        //$serv['preciotarifabase'] = 0;
                        $serv['preciotarifaoriginal'] = $serv['preciotarifabase'];
                    //}
                    $serv['preciopromedio'] = 0;
                } else {
                    if ($orden && $serv['modificado']) {
                        $serv['preciotarifabase'] = $serv['precio'];
                        $serv['preciotarifaoriginal'] = $serv['precio'];
                        $serv['idtipoprecio'] = -2;
                    } else if ($serv['idtipoprecio'] && $serv['idtipoprecio']!= -1) {
                        $idmonedaunica = false;
                        $clienteMoneda = $modelFactura->isUnicaMoneda(
                            array('idtipoprecio'=>$serv['idtipoprecio'], 'idcliente'=>$documentoFactura->idcliente, 'idestructura'=>$this->idestructura)
                        );
                        $value = new stdClass();
                        $value->idindicador = $serv['idindicador'];
                        $value->idtipoprecio = $serv['idtipoprecio'];
                        $value->idestructura = $this->idestructura;
                        $value->servicio = 1;
                        $value->idcliente = $documentoFactura->idcliente;
                        if(count($clienteMoneda) > 0){
                            $idmonedaunica = $clienteMoneda[0]['idmoneda'];
                            $prec = $modelFactura->getPrecio($value, $idmonedaunica, $idmonedafactura,false, $documentoFactura->factorconvercion);
                        }else{
                            $prec = $modelFactura->getPrecio($value, false, $idmonedafactura, false, $documentoFactura->factorconvercion);
                        }
                        if (is_array($prec)) {
                            $serv['preciotarifabase'] = $prec['precioventa'];
                            $serv['preciotarifaoriginal'] = $prec['precioventa'];
                            $serv['preciopromedio'] = $prec['preciopromedio'];
                        } else {
                            $serv['preciotarifabase'] = $prec;
                        }
                    }else{
						$serv['preciotarifabase'] = $serv['precio'];
						$serv['preciotarifaoriginal'] = $serv['precio'];
					}
                }
            /*} else {
                //trabajar con la tarifa de las actividades
            }*/
            $idElementoConduce = $serv['idelementofactura'];
            unset($serv['idelementofactura']);
            $this->elementosFactura->addElemento($objDatElemento, $serv);

            if ($parametros['idcontrato'] && $noNota) {
                $this->guardarPrecioContrato($parametros, $objDatElemento, $serv);
            } else {
                if($idmonedaunica && $noNota){
                    $cElementoCateg = new Doctrine_Collection('DatElementocategoria');
                    $cDesgloseElementos = new Doctrine_Collection('DatDesgloselemento');
                    $serv['orden'] = ($parametros['tipoDoc'] == 8) ? 1 : 0;
                    $modelFactura->precioUnicaMonedaDesgloseServicio(
                        $dualidad,
                        $serv,
                        $prec,
                        $cDesgloseElementos,$cElementoCateg,$idmonedaunica
                    );
                    foreach ($cDesgloseElementos as $de){
                        $objDatElemento->DatDesgloselemento->add($de);
                    }
                    foreach ($cElementoCateg as $dec){
                        $objDatElemento->DatElementocategoria->add($dec);
                    }
                }else{
                    foreach ($monedas as $index => $moneda) {
                        $obj = new DatDesgloselemento();
                        if ($noNota) {
                            if (isset($prec)) {
                                foreach ($prec['datos'][$moneda]['DatPrecio'] as $i => &$d) {
                                    if ($d['porciento'] == 1) {
                                        $d['valor'] = $prec['datos'][$moneda]['precio'] * $d['valor'] / 100;
                                    } else {
                                        if(!$monedas->idmonedaalternativa && $idmonedafactura) {
                                            $d['valor'] = $this->configuracionHelper->convertirImporte(
                                                $monedas->idmoneda, $idmonedafactura, $this->_tipotasa, $d['valor'], 1
                                            );
                                        }
                                    }
                                    $elementoCategoria = new DatElementocategoria();
                                    $elementoCategoria->synchronizeWithArray($d);
                                    $elementoCategoria->idindicador = $serv['idindicador'];
                                    $elementoCategoria->idmoneda = $moneda;
                                    $objDatElemento->DatElementocategoria->add($elementoCategoria);
                                }
                                $obj->preciotarifa = $prec['datos'][$moneda]['precioventa'];
                                $obj->preciotarifaoriginal = $prec['datos'][$moneda]['precioventa'];
                            } else {
                                $obj->preciotarifa = $serv['preciotarifa'];
                                $obj->preciotarifaoriginal = $serv['preciotarifa'];
                            }
                            $obj->idmoneda = $moneda;
                            /*if($parametros['tipoDoc'] == 8){
                                $obj->preciotarifa = ($moneda == $idmonedacontable)?$serv['precio']:$serv['precioalternativo'];
                                $obj->preciotarifaoriginal = ($moneda == $idmonedacontable)?$serv['precio']:$serv['precioalternativo'];
                                $elementoCategoria = new DatElementocategoria();
                                $elementoCategoria->valor = ($moneda == $idmonedacontable)?$serv['precio']:$serv['precioalternativo'];
                                $elementoCategoria->idindicador = $serv['idindicador'];
                                $elementoCategoria->idmoneda = $moneda;
                                $objDatElemento->DatElementocategoria->add($elementoCategoria);
                            }*/
                            $objDatElemento->DatDesgloselemento->add($obj);
                        } else {
                            $desgElCond = Doctrine::getTable('DatDesgloselemento')
                                ->findByDql(
                                    'idelementofactura = ? and idmoneda = ?', array($idElementoConduce, $moneda)
                                );
                            $obj->idmoneda = $moneda;
                            $obj->preciotarifa = $desgElCond[0]['preciotarifa'];
                            $obj->preciotarifaoriginal = $desgElCond[0]['preciotarifaoriginal'];
                            $obj->preciotarifafactura = $desgElCond[0]['preciotarifa'];
                            $objDatElemento->DatDesgloselemento->add($obj);
                            $elementosCatg = Doctrine::getTable('DatElementocategoria')
                                ->findByDql(
                                    'idelementofactura = ? and idmoneda = ?', array($idElementoConduce, $moneda)
                                );
                            foreach ($elementosCatg as $d) {
                                $elementoCategoria = new DatElementocategoria();
                                $elementoCategoria->idindicador = $serv['idindicador'];
                                $elementoCategoria->idmoneda = $moneda;
                                $elementoCategoria->concepto = $d->concepto;
                                $elementoCategoria->valor = $d->valor;
                                $elementoCategoria->idcuentadesgloseprecio = $d->idcuentadesgloseprecio;
                                $objDatElemento->DatElementocategoria->add($elementoCategoria);
                            }
                        }
                    }
                }

            }
            unset($prec);
            $collection->add($objDatElemento);
        }
        $collection->save();
        if (isset($datosCmptoOrden)) {
            $datosCmptoOrden['iddocumento'] = $iddocumento;
            $ordenService = new OrdenTrabajoTalleresService();
            $ordenService->actualizarCumplimiento($datosCmptoOrden);
        }
    }

    public function guardarPrecioContrato($params, &$objDatElemento, $servicio){
        /*$query = new Doctrine_Query();
        $query->select()->from('DatIndcontrato dc')->where(
            'dc.idcontrato = ? and dc.idindicador = ?', array($params['idcontrato'], $servicio['idindicador'])
        )->leftJoin('dc.DatIndicadorcontcategoria dic');
        $datos = $query->fetchArray();
        foreach($datos as $data){
            $obj = new DatDesgloselemento();
            foreach($data['DatIndicadorcontcategoria'] as &$d){
                if ($d['porciento'] == 1) {
                    $d['valor'] = $data['precio'] * $d['valor'] / 100;
                }
                $elementoCategoria = new DatElementocategoria();
                $elementoCategoria->synchronizeWithArray($d);
                $elementoCategoria->idindicador = $servicio['idindicador'];
                $elementoCategoria->idmoneda = $data['idmoneda'];
                $objDatElemento->DatElementocategoria->add($elementoCategoria);
            }
            $obj->idmoneda = $data['idmoneda'];
            $obj->preciotarifa = $data['precioventa'];
            $obj->preciotarifaoriginal = $data['precioventa'];
            $objDatElemento->DatDesgloselemento->add($obj);
        }*/
        $obj = new DatDesgloselemento();
        $obj->idmoneda = $this->_monedas->idmoneda;
        $obj->preciotarifa = $servicio['preciotarifa'];
        $obj->preciotarifaoriginal = $servicio['preciotarifaoriginal'];
        $objDatElemento->DatDesgloselemento->add($obj);
        if($this->_monedas->idmonedaalternativa){
            $objAlt = new DatDesgloselemento();
            $objAlt->idmoneda = $this->_monedas->idmonedaalternativa;
            $objAlt->preciotarifa = $servicio['preciodivisa'];
            $objAlt->preciotarifaoriginal = $servicio['preciodivisa'];
            $objDatElemento->DatDesgloselemento->add($objAlt);
        }
    }

    public function getServicios($iddocumento, $parametros = array())
    {
        $arrayServ = array('iddocumento' => $iddocumento, 'tipo' => 2, 'criterio' => $parametros['criterio'], 'dql' => $parametros['dql']);
        $arrayAct = array('iddocumento' => $iddocumento, 'actividad' => 1, 'criterio' => $parametros['criterio']);
        if($parametros['idmoneda']){
           $arrayServ['moneda'] = $parametros['idmoneda'];
           $arrayAct['moneda'] = $parametros['idmoneda'];
        }
        if($parametros['tipotasa']){
            $arrayServ['tipotasa'] = $parametros['tipotasa'];
            $arrayAct['tipotasa'] = $parametros['tipotasa'];
        }
        $nomenclador = $this->elementosFactura->getElementos(
            $arrayServ
        );
        if ($parametros['dql']) {
            return $nomenclador;
        }
        $actividades = array();/*$this->elementosFactura->getElementos(
            $arrayAct
        );*/
        $array = array_merge($nomenclador, $actividades);
        return $array;
    }

    public function getProductosServicio($parametros)
    {
        $datosMaestros = new MaestroProductoModel();
        return $datosMaestros->devolverProductosServicio($parametros, false);
    }

    public function eliminarServFactura($servicios, $documento = false)
    {
        if ($documento) {
            $aux = Doctrine::getTable('DatDocfactura')->find($documento);
            if ($aux->idsubsistema == LogisticaGlobal::SUBSISTEMA_TALLERES) {
                $modelFactura = new GestionarFacturaModel(
                    array('alias' => 'facturaLog', 'subsistema' => LogisticaGlobal::SUBSISTEMA_FAC)
                );
                $docsOrigen = $modelFactura->getDocOrigen($documento);
                $ids = implode(',', $servicios);
                $sql = "select dps.idindicador, elf.cantidad
                         from mod_logfacturacion.dat_elementosfactura elf
                        inner join mod_logfacturacion.dat_prodservnomenclador dps on dps.idelementofactura = elf.idelementofactura
                        where elf.idelementofactura in ({$ids})";
                $actividades = LogisticaDoctrineHelper::__init()->getConnection()->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
                $datosCmptoOrden = array();
                foreach ($actividades as $i => $serv) {
                    $arrayServ = array(
                        'idindicador' => $serv['idindicador'],
                        'iddocorigen' => array($docsOrigen[0]['idpadre']), 'enprocesonuevo' => 0, 'enprocesoviejo' => $serv['cantidad'],
                        'entregado' => 0
                    );
                    $datosCmptoOrden['actividades'][$i] = $arrayServ;
                }
                $datosCmptoOrden['iddocumento'] = $documento;
                $ordenService = new OrdenTrabajoTalleresService();
                $ordenService->actualizarCumplimiento($datosCmptoOrden);
            }
        }
        $this->elementosFactura->deleteElementos($servicios);
    }

    public function getCantServicios($iddocumento)
    {
        $cantidad = 0;
        $cantidad += $this->elementosFactura->getSelectQuery(
            array('iddocumento' => $iddocumento, 'tipo' => 2)
        )
            ->count();
        $cantidad += $this->elementosFactura->getSelectQuery(
            array('iddocumento' => $iddocumento, 'actividad' => 1)
        )
            ->count();
        return $cantidad;
    }

    public function getDatosServConfirmar($iddocumento, $subsistema)
    {
        $respuesta = array();
        foreach ($iddocumento as $id) {
            $respuestaS = $this->elementosFactura->getElementos(
                array('iddocumento' => array($id), 'tipo' => 2)
            );
            $respuestaA = $this->elementosFactura->getElementos(
                array('iddocumento' => array($id), 'actividad' => 1)
            );
            $respuesta[$id] = array_merge($respuestaS, $respuestaA);
        }
        return $respuesta;
    }
}
