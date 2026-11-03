<?php

/**
 * Esta clase gestiona los productos de la factura
 *
 * @package    Facturacion
 * @author     Division de Gestion de Entidades
 * @copyright  XETID
 * @version    5.0
 */
class GestionarProductosModel extends ZendExt_Model
{

    private $prodLogModel;
    private $elementosFactura;
    private $idestructura;
    private $configuracionHelper;

    public function __construct()
    {
        parent::__construct();
        $this->prodLogModel = new LogisticaProductoModel();
        $this->elementosFactura = new ElementosFacturaModel();
        $this->idestructura = $this->global->Estructura->idestructura;
        $this->configuracionHelper = ServiciosConfiguracionGeneralHelper::__init();
    }

    public function adicionarProductos(
        $documento, $parametros, $ubicarProductos = array(), $afectaDisponible = true
    )
    {
        $parametros = (array)$parametros;
        $modelFactura = new GestionarFacturaModel(
            array('alias' => 'facturaLog', 'subsistema' => LogisticaGlobal::SUBSISTEMA_FAC)
        );
        $monedas = $modelFactura->getDualidadMonedas();
        $prodsFactura = new Doctrine_Collection('DatProdFactura');
        $movnumserie = new Doctrine_Collection('DatMovnroserie');
        $numserie = new Doctrine_Collection('DatNroserie');
        $arrayProd = array();
        $serviceLote = new LoteService();
        $serviceNroSerie = new NoSerieService();
        if ($ubicarProductos && $ubicarProductos['tipoDoc'] == 4) {
            $datosCmpto = array();
        }
        $iddocumento = (is_object($documento)) ? $documento->iddocumento : $documento;
        $documentoFactura = Doctrine::getTable('DatDocfactura')->find($iddocumento);
        //$iddocOrigen = Doctrine::getTable('DatDocumento')->find($parametros['docorigen'][0])->iddoc;
        $noNota = (!$parametros['deconduce'] && $parametros['tipoDoc'] != 'nd' && $parametros['tipoDoc'] != 'nc') ? true : false;
        $umSql = "select count(nv.nombre) from mod_logistica.nom_variableglobal nv 
                          where nv.nombre = 'USAR_UM_MATRIZ' and nv.valor = 'true'";
        $um = LogisticaDoctrineHelper::__init()->getConnection()->execute($umSql)->fetchAll(PDO::FETCH_COLUMN);
        $usarUm = ($um[0] > 0) ? true : false;
        foreach ($parametros['productos'] as $i => &$prod) {
            $idmonedaunica = false;
            $prod = (Array)$prod;
            $clienteMoneda = $modelFactura->isUnicaMoneda(
                array('idtipoprecio'=>$prod['idtipoprecio'], 'idcliente'=>$documentoFactura->idcliente, 'idestructura'=>$this->idestructura)
            );

            if($prod['equipo'] == 1){
                if($noNota){
                    /*$nros = $serviceNroSerie->getNumerosSeriesDisponibles($prod);
                    if (count($nros) < $prod['cantidad']) {
                        $prod['cantidad'] = count($nros);
                    }
                    $prod['series'] = $nros;*/
                    $prod['cantidad'] = 0;
                }else{
                    $nros = $serviceNroSerie->getNumerosEnDoc($parametros['docorigen']);
                    $prod['series'] = $nros;
                }
            }
            if($prod['cilindro'] != 0){
                if($noNota){
                    /*$nros = $serviceNroSerie->getNumerosSeriesDisponibles($prod);
                    if (count($nros) < $prod['cantidad']) {
                        $prod['cantidad'] = count($nros);
                    }
                    $prod['series'] = $nros;*/
                    $prod['cantidad'] = 0;
                }else{
                    //Copiar cilindros del documento origen
                }
            }
            $prod['cantidad'] = ($prod['cantidad']) ? $prod['cantidad'] : 0;
            if ($parametros['deoferta']) {
                $datosCmptoPf[$i] = array('idproducto' => $prod['idproducto'], 'enprocesonuevo' => $prod['cantidad'],
                    'iddocorigen' => $parametros['docorigen'], 'enprocesoviejo' => 0,);
            }
            $value = new stdClass();
            $value->idindicador = $prod['idindicador'];
            $value->idproducto = $prod['idproducto'];
            $value->idtipoprecio = $prod['idtipoprecio'];
            $value->idestructura = $this->idestructura;
            $value->idumedidacrc = $prod['idumedidacrc'];
            $value->idcliente = $documentoFactura->idcliente;
            $value->idfactura = $documentoFactura->idfactura;
            if ($parametros['reservaprecio'] && $parametros['reservaprecio'] == 1) {
                //$value->preciocontable = $prod['preciocontable'];
                $prod['precio'] = $prod['preciobase'];
            } else {
                //$value->preciocontable = $prod['precio'];
                if($prod['idregnumerico'])
                    $value->idregnumerico = $prod['idregnumerico'];
                if ($parametros['tipoDoc'] != 'nc') {
                    if(count($clienteMoneda) > 0){
                        $idmonedaunica = $clienteMoneda[0]['idmoneda'];
                        $prod['idmonedaunica'] = $idmonedaunica;
                        $prec = $modelFactura->getPrecio($value, $idmonedaunica, false, $usarUm, $documentoFactura->factorconvercion);
                    }else{
                        $prec = $modelFactura->getPrecio($value, false, false, $usarUm, $documentoFactura->factorconvercion);
                    }
                    if (is_array($prec)) {
                        $prod['precio'] = $prec['precioventa'];
                        $prod['referencia'] = $prec['datos'][$monedas->idmoneda]['precio'];
                        if($monedas->idmonedaalternativa)
                            $prod['referenciaalt'] = $prec['datos'][$monedas->idmonedaalternativa]['precio'];
                        $prod['matriz'] = $prec['datos'];
                    } else {
                        $prod['precio'] = $prec;
                    }
                    $datosAuxProd = $this->prodLogModel->getDatosProducto($prod['idproducto']);
                    $prod['preciocontable'] = $datosAuxProd['precio'];
                    $prod['precioalternativo'] = $datosAuxProd['precioalternativo'];
                } else {
                    $prod['entrada'] = true;
                    $prod['precio'] = $prod['preciocontablecup'];
                }
            }
            $arrayProd[$prod['idproducto']] = $prod;
            if (isset($datosCmpto)) {
                $arrayProductos = array('idproducto' => $prod['idproducto'], 'iddocorigen' => $parametros['docorigen'],
                    'enprocesonuevo' => $prod['cantidad'], 'pendiente' => $prod['cantidad'], 'enprocesoviejo' => 0);
                $datosCmpto['productos'][$i] = $arrayProductos;
            }
            //unset($prod['preciocontable']);
            if($parametros['tipoDoc'] == 'nc') {
                $prod['cantidad'] = 0;
            }
        }
        $signo = ($parametros['tipoDoc'] == 'nd' || $parametros['tipoDoc'] == 'nc') ? ($parametros['tipoDoc'] == 'nd' ? LogisticaMovimientoModel::SIGNO_NINGUNO : LogisticaMovimientoModel::SIGNO_MOV_SUMA) : LogisticaMovimientoModel::SIGNO_MOV_RESTA;
        $movimientos = $this->prodLogModel->adicionarMovimientos(
            $iddocumento, $parametros['productos'], $signo, $afectaDisponible
        );
        $movimientosAdd = array();
        if ($parametros['oferta'] == 1) {
            $cmptoPref = new Doctrine_Collection('DatPrefacturacmpto');
        }
        $cElementoCateg = new Doctrine_Collection('DatElementocategoria');
        $monedaMovimiento = new Doctrine_Collection('DatMovmoneda');
        foreach ($movimientos['movimientos'] as $i => $mov) {
            if ($arrayProd[$mov['idproducto']]) {
                $prodsFactura[$i]->idtipoprecio = $arrayProd[$mov['idproducto']]['idtipoprecio'];
                $prodsFactura[$i]->idmovimiento = $mov['idmovimiento'];
                $prodsFactura[$i]->preciobase = $arrayProd[$mov['idproducto']]['precio'];
                if ($arrayProd[$mov['idproducto']]['referencia']) {
                    $prodsFactura[$i]->referencia = $arrayProd[$mov['idproducto']]['referencia'];
                }
                if ($arrayProd[$mov['idproducto']]['referenciaalt']) {
                    $prodsFactura[$i]->referenciaalt = $arrayProd[$mov['idproducto']]['referenciaalt'];
                }
                if ($parametros['rotacion']) {
                    $mov['iddistribucion'] = $parametros['docorigen'];
                }
                if($parametros['rotacion']){
                    unset($mov['cronologia']);
                }
                $movimientosAdd[] = $mov;
                if($noNota){
                    if($mov['idmonedaunica']){
                        $modelFactura->precioUnicaMonedaDesglose(
                            $monedas,
                            $mov,
                            array('datos'=>$arrayProd[$mov['idproducto']]['matriz']),
                            $monedaMovimiento,$cElementoCateg,$mov['idmonedaunica']
                        );
                    }else{
                        $this->guardarDatosPrecio($arrayProd, $mov, $monedaMovimiento, $cElementoCateg, $modelFactura);
                    }
                }
                else{
                    if($parametros['tipoDoc'] == 'nc') {
                        $prodsFactura[$i]->cantidadfactura = $arrayProd[$mov['idproducto']]['cantidad'];
                        $prodsFactura[$i]->preciofactura = $arrayProd[$mov['idproducto']]['precio'];;
                    } else if($parametros['tipoDoc'] == 'nd') {
                        $prodsFactura[$i]->preciofactura = $arrayProd[$mov['idproducto']]['precio'];;
                    }
                    $mov['cantidad'] = $arrayProd[$mov['idproducto']]['cantidad'];
                    $this->guardarDatosPrecioConduce($arrayProd, $mov, $monedaMovimiento, $cElementoCateg, $modelFactura, $prodsFactura[$i]);
                }
                /*$prodsFactura[$i]->precio = $this->configuracionHelper->calcularImporteDadoMonedas(
                    $parametros['idmoneda'], $prodsFactura[$i]->preciobase, $this->idestructura, false
                );*/
                if (isset($cmptoPref)) {
                    $cmptoPref[$i]->idmovimiento = $mov['idmovimiento'];
                    $cmptoPref[$i]->pendiente = $mov['cantidad'];
                }
                if($arrayProd[$mov['idproducto']]['series']){
                    $nrs = $arrayProd[$mov['idproducto']]['series'];
                    foreach($nrs as $n){
                        $objMS = new DatMovnroserie();
                        $objMS->idnroserie = $n['idnroserie'];
                        $objMS->idmovimiento = $mov['idmovimiento'];
                        $movnumserie->add($objMS);
                        if($noNota){
                            $nroSerie = Doctrine::getTable('DatNroserie')
                                ->find($n['idnroserie']);
                            $nroSerie->estado = 3;
                            $numserie->add($nroSerie);
                        }
                    }
                }
            }
        }
        if ($parametros['oferta'] != 1) {
            if ($parametros['rotacion']){
                $serviceLote->extraerCantidades($movimientosAdd, true, true);
            }else{
                $serviceLote->extraerCantidades($movimientosAdd, true);
            }
        }
        $prodsFactura->save();
        if ($cmptoPref) {
            $cmptoPref->save();
        }
        if ($cElementoCateg) {
            $cElementoCateg->save();
        }
        if (count($monedaMovimiento) > 0) {
            $monedaMovimiento->save();
        }
        if (count($movnumserie) > 0) {
            $movnumserie->save();
            $numserie->save();
        }
        if (isset($datosCmpto) && count($datosCmpto) > 0) {
            $datosCmpto['idcliente'] = $documento['DatDocfactura']['idcliente'];
            $prodOrdenModel = new ProdordenModel();
            $prodOrdenModel->actualizarCumplimientoByParams($datosCmpto);
        }
        if (isset($datosCmptoPf) && count($datosCmptoPf) > 0) {
            $this->actualizarCumpPrefByParams($datosCmptoPf);
        }
    }

    public function guardarDatosPrecio(
        $arrayProd, $mov, Doctrine_Collection &$monedaMovimiento, Doctrine_Collection &$cElementoCateg, $modelo
    ) {
        $monedas = $modelo->getMonedaContableAlternativa();
        foreach ($monedas as $moneda) {
            $movMoneda = new DatMovmoneda();
            $movMoneda->idmoneda = $moneda;
            $movMoneda->idmovimiento = $mov['idmovimiento'];
            $movMoneda->precio = $arrayProd[$mov['idproducto']]['matriz'][$moneda]['precioventa'];
            $movMoneda->importe = round($movMoneda->precio * $mov['cantidad'],2);
            $monedaMovimiento->add($movMoneda);
            foreach ($arrayProd[$mov['idproducto']]['matriz'][$moneda]['DatPrecio'] as $k => &$d) {
                if ($d['porciento'] == 1) {
                    $d['valor'] =
                        $arrayProd[$mov['idproducto']]['matriz'][$moneda]['precio'] * $d['valor'] / 100;
                }
                $elementoCategoria = new DatElementocategoria();
                $elementoCategoria->synchronizeWithArray($d);
                $elementoCategoria->idindicador = $arrayProd[$mov['idproducto']]['idindicador'];
                $elementoCategoria->idmovimiento = $mov['idmovimiento'];
                $elementoCategoria->idmoneda = $moneda;
                $cElementoCateg->add($elementoCategoria);
            }
        }
    }

    public function guardarDatosPrecioConduce(
        $arrayProd, $mov, Doctrine_Collection &$monedaMovimiento, Doctrine_Collection &$cElementoCateg, $modelo, Doctrine_Collection &$prodsFactura
    )
    {
        $monedas = $arrayProd[$mov['idproducto']]['DatMovimientos'][0]['DatMovmoneda'];
        $idmovimientoConduce = $arrayProd[$mov['idproducto']]['DatMovimientos'][0]['idmovimiento'];
        foreach ($monedas as $moneda) {
            $movMoneda = new DatMovmoneda();
            $movMoneda->idmoneda = $moneda['idmoneda'];
            $movMoneda->idmovimiento = $mov['idmovimiento'];
            $movMoneda->precio = $moneda['precio'];
            $movMoneda->importe = round($movMoneda->precio * $mov['cantidad'],2);
            if ($moneda['idmoneda'] == $modelo->getDualidadMonedas()->idmoneda) {
                $prodsFactura->importefactmn = $movMoneda->importe;
            } else {
                $prodsFactura->importefactalt = $movMoneda->importe;
            }
                $monedaMovimiento->add($movMoneda);
            $elementosCatg = Doctrine::getTable('DatElementocategoria')->findByDql(
                'idmovimiento = ? and idmoneda = ?', array($idmovimientoConduce, $moneda['idmoneda'])
            );
            foreach ($elementosCatg as $d) {
                $elementoCategoria = new DatElementocategoria();
                $elementoCategoria->synchronizeWithArray($d);
                $elementoCategoria->idmovimiento = $mov['idmovimiento'];
                $cElementoCateg->add($elementoCategoria);
            }
        }
    }

    public function actualizarCumpPrefByParams($parametros)
    {
        if (!count($parametros)) {
            return false;
        }
        $collectionCumplimiento = new Doctrine_Collection('DatPrefacturacmpto');
        foreach ($parametros as $datosMovimiento) {
            $query = $this->getCantidadPendiente($datosMovimiento);
            $cumplimiento = new DatPrefacturacmpto();
            $cumplimiento->assignIdentifier($query[0]['idcumplimiento']);
            $enproceso = $datosMovimiento['enprocesoviejo'] - $datosMovimiento['enprocesonuevo'];
            $cumplimiento->enproceso -= ($datosMovimiento['entregado'] + $enproceso);
            $cumplimiento->entregado += $datosMovimiento['entregado'];
            $cumplimiento->pendiente += $enproceso;
            //print_r($cumplimiento->toArray());die;
            $collectionCumplimiento->add($cumplimiento);
        }
        if ($collectionCumplimiento->count()) {
            $collectionCumplimiento->save();
        }
        return true;
    }

    public function getCantidadPendiente($datos)
    {
        $query = new Doctrine_Query();
        $query->select()
            ->from('DatPrefacturacmpto dpf');
        if ($datos['idproducto']) {
            $query->innerJoin('dpf.DatMovimientos dm')
                ->where('dm.idproducto = ?', array($datos['idproducto']))
                ->andWhereIn('dm.iddocumento', $datos['iddocorigen']);
        } else {
            $query->innerJoin('dpf.DatElementosFactura def')
                ->innerJoin('def.DatProdServNomenclador dpsn')
                ->where('dpsn.idindicador = ? and dpsn.tipo = ?', array($datos['idindicador'], 1))
                ->andWhereIn('def.idfactura', $datos['iddocorigen']);
        }
        return $query->fetchArray();
    }

    public function adicionarProductosNom($documento, $parametros)
    {
        $deOferta = ($parametros['deoferta']) ? true : false;
        $modelFactura = new GestionarFacturaModel(
            array('alias' => 'facturaLog', 'subsistema' => LogisticaGlobal::SUBSISTEMA_FAC)
        );
        $monedas = $modelFactura->getDualidadMonedas();
        $iddocumento = (is_object($documento)) ? $documento->iddocumento : $documento;
        $documentoFactura = Doctrine::getTable('DatDocfactura')->find($iddocumento);
        $fconv = is_numeric($documentoFactura->factorconvercion) ? $documentoFactura->factorconvercion : 1;
        $collection = new Doctrine_Collection('DatElementosFactura');
        if ($parametros['oferta'] == 1) {
            $cmptoPref = new Doctrine_Collection('DatPrefacturacmpto');
        }
        if(count($parametros['docorigen']) > 0)
            $iddocOrigen = Doctrine::getTable('DatDocumento')->find($parametros['docorigen'][0])->iddoc;
        if($iddocOrigen && $iddocOrigen == $modelFactura->getIddocOrden()) {
            $orden = true;
        }
        $noNota = ($iddocOrigen != $modelFactura->getIddocNota() && $parametros['tipoDoc'] != 'nd' && $parametros['tipoDoc'] != 'nc') ? true : false;
        //$monedas = $modelFactura->getDualidadMonedas();//$modelFactura->getMonedaContableAlternativa();

        foreach ($parametros['productos'] as $k => &$prod) {
            $prod = (array)$prod;
            if ($prod['idfactura']) {
                unset($prod['idfactura']);
            }
            if ($parametros['deoferta']) {
                $datosCmptoPf[$k] =
                    array('idindicador' => $prod['idindicador'], 'enprocesonuevo' => $prod['cantidad'],
                        'iddocorigen' => $parametros['docorigen'], 'enprocesoviejo' => 0,);
            }
            if (!isset($prod['idtipoprecio'])) {
                $tipoPrecio = $modelFactura->getTipoPrecios($parametros);
                $prod['idtipoprecio'] = (count($tipoPrecio) > 0) ? $tipoPrecio[0]['idtipoprecio'] : -2;
            }
            $idmonedaunica = false;
            $clienteMoneda = $modelFactura->isUnicaMoneda(
                array('idtipoprecio'=>$prod['idtipoprecio'], 'idcliente'=>$documentoFactura->idcliente, 'idestructura'=>$this->idestructura)
            );
            $objDatElemento = new DatElementosFactura();
            $objDatElemento->idfactura = $iddocumento;
            if($prod['idproducto']) {
              $prod['idprod'] = $prod['idproducto'];
            }
            if($parametros['tipoDoc'] == 'nc') {
                $prod['cantidadfactura'] = $prod['cantidad'];
                $prod['cantidad'] = 0;
            }
            if ($parametros['idcontrato']) {
                $dqlProd = Doctrine::getTable('DatIndcontrato')->findByDql(
                    'idcontrato = ? and idindicador = ? and idmoneda = ?',
                    array($parametros['idcontrato'], $prod['idindicador'], $monedas->idmoneda)
                );
                $prod['idtipoprecio'] = $dqlProd[0]['idtipoprecio'];
                $prod['preciotarifabase'] = $dqlProd[0]['precioventa'];
                $prod['preciotarifaoriginal'] = $dqlProd[0]['precioventa'];
                $prod['precio'] = $dqlProd[0]['precioventa'];
                $prod['preciopromedio'] = 0;
            } else {
                //if ($prod['idtipoprecio'] != -1) {
                    $value = new stdClass();
                    $value->idindicador = $prod['idindicador'];
                    $value->idtipoprecio = $prod['idtipoprecio'];
                    $value->idfactura = $documentoFactura->idfactura;
                    //$value->idestructura = $this->idestructura;
                    $value->idmonedaanterior = $parametros['idmoneda'];
                    $value->idcliente = $documentoFactura->idcliente;
                    if ($orden) {
                        $value->precioref = $prod['preciocontable'];
                        $value->preciorefalt = $prod['precioalt'];
			$datosCmptoOrden['productos'][$k] =
                            array('idproducto' => $prod['idproducto'],'idindicador' => $prod['idindicador'], 'enprocesonuevo' => $prod['cantidad'],
                                'iddocorigen' => $prod['docorigen'], 'enprocesoviejo' => 0, 'idactividad'=>($prod['idactividadmaterial'] ? $prod['idactividadmaterial'] : null));
                    }
                    if($prod['idregnumerico'])
                        $value->idregnumerico = $prod['idregnumerico'];
                    if (($parametros['reservaprecio'] && $parametros['reservaprecio'] == 1) || !$noNota) {
                        $value->preciocontable = $prod['preciocontable'];
                        $prod['precio'] = $prod['preciobase'];
                    } else {
                        $value->preciocontable = $prod['precio'];
                        if($prod['idproducto']){
                            $value->idproducto = $prod['idproducto'];
                        }
                        if ($orden && $prod['modificado']) {
                            $prod['precio'] = $prod['precio'];
                            $prod['referencia'] = $prod['preciomat'];
                            $prod['preciotarifabase'] = $prod['preciomat'];
                            $prod['idtipoprecio'] = -2;
                        } else {
                            if(count($clienteMoneda) > 0){
                                $idmonedaunica = $clienteMoneda[0]['idmoneda'];
                                $prec = $modelFactura->getPrecio($value, $idmonedaunica);
                            }else{
                                $prec = $modelFactura->getPrecio($value);
                            }
                            if (is_array($prec)) {
                                $prod['precio'] = $prec['precioventa'];
                                $prod['referencia'] = $prec['datos'][$monedas->idmoneda]['precio'];
                                if($monedas->idmonedaalternativa)
                                    $prod['referenciaalt'] = $prec['datos'][$monedas->idmonedaalternativa]['precio'];
                            } else {
                                $prod['precio'] = ($prec > 0) ? $prec : 0;
                            }
                        }
                    }
                //}
                if ($parametros['reservaprecio'] && $parametros['reservaprecio'] == 1) {
                    $prod['preciotarifabase'] = $prod['preciobase'];
                } else {
                    $prod['preciotarifabase'] = ($prod['importecup']) ? $prod['importecup'] : $prod['precio'];
                }
            }
            $idElementoConduce = ($noNota && !$deOferta) ? false : $prod['idelementofactura'];
            unset($prod['idelementofactura']);
            $this->elementosFactura->addElemento($objDatElemento, $prod);
            if($parametros['idcontrato'] && $noNota) {
                $this->guardarPrecioContrato($parametros, $objDatElemento, $prod);
            } else {
                if($idmonedaunica && $noNota && !$deOferta){
                    $cElementoCateg = new Doctrine_Collection('DatElementocategoria');
                    $cDesgloseElementos = new Doctrine_Collection('DatDesgloselemento');
                    $modelFactura->precioUnicaMonedaDesglose(
                        $monedas,
                        $prod,
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
                    $this->adicionarDatosPrecio($objDatElemento, $prod, $prec, $idElementoConduce, $monedas, $modelFactura, $fconv);
                }
            }
            $collection->add($objDatElemento);
            unset($prec);
        }
        $collection->save();
        if (isset($cmptoPref)) {
            foreach ($collection as $i => $coll) {
                $cmptoPref[$i]->idelementofactura = $coll['idelementofactura'];
                $cmptoPref[$i]->pendiente = $coll['cantidad'];
            }
            $cmptoPref->save();
        }
        if (isset($datosCmptoPf) && count($datosCmptoPf) > 0) {
            $this->actualizarCumpPrefByParams($datosCmptoPf);
        }
        if (isset($datosCmptoOrden)) {
            $datosCmptoOrden['iddocumento'] = $iddocumento;
            $ordenService = new OrdenTrabajoTalleresService();
            $ordenService->actualizarCumplimiento($datosCmptoOrden);
        }
    }

    public function guardarPrecioContrato($params, &$objDatElemento, $producto){
        $query = new Doctrine_Query();
        $query->select()->from('DatIndcontrato dc')->where(
            'dc.idcontrato = ? and dc.idindicador = ?', array($params['idcontrato'], $producto['idindicador'])
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
                $elementoCategoria->idindicador = $producto['idindicador'];
                $elementoCategoria->idmoneda = $data['idmoneda'];
                $objDatElemento->DatElementocategoria->add($elementoCategoria);
            }
            $obj->idmoneda = $data['idmoneda'];
            $obj->preciotarifa = $data['precioventa'];
            $obj->preciotarifaoriginal = $data['precioventa'];
            $objDatElemento->DatDesgloselemento->add($obj);
        }
    }

    public function adicionarDatosPrecio($objDatElemento, $prod, $prec, $idElementoConduce = false, $monedas, $model, $factor = 1){
        $obj = new DatDesgloselemento();
        $obj->idmoneda = $monedas->idmoneda;
        if (!$idElementoConduce) {
            //$obj->preciotarifa = $prec['datos'][$monedas->idmoneda]['precioventa'];
            $obj->preciotarifa = $model->convertirPrecio(1, $factor, $prec['datos'][$monedas->idmoneda]['precioventa']);
            $objDatElemento->DatDesgloselemento->add($obj);
            foreach ($prec['datos'][$monedas->idmoneda]['DatPrecio'] as $i => &$d) {
                if ($d['porciento'] == 1) {
                    $d['valor'] = $prec['datos'][$monedas->idmoneda]['precio'] * $d['valor'] / 100;
                }
                $elementoCategoria = new DatElementocategoria();
                $elementoCategoria->synchronizeWithArray($d);
                $elementoCategoria->idindicador = $prod['idindicador'];
                $elementoCategoria->idmoneda = $monedas->idmoneda;
                $objDatElemento->DatElementocategoria->add($elementoCategoria);
            }
        } else {
            $desgElCond = Doctrine::getTable('DatDesgloselemento')
                ->findByDql(
                    'idelementofactura = ? and idmoneda = ?', array($idElementoConduce, $monedas->idmoneda)
                );
            $obj->preciotarifa = $desgElCond[0]['preciotarifa'];
            $obj->preciotarifaoriginal = $desgElCond[0]['preciotarifaoriginal'];
            $obj->preciotarifafactura = $desgElCond[0]['preciotarifa'];
            $objDatElemento->DatDesgloselemento->add($obj);
            $elementosCatg = Doctrine::getTable('DatElementocategoria')
                ->findByDql(
                    'idelementofactura = ? and idmoneda = ?', array($idElementoConduce, $monedas->idmoneda)
                );
            foreach ($elementosCatg as $d) {
                $elementoCategoria = new DatElementocategoria();
                $elementoCategoria->idindicador = $prod['idindicador'];
                $elementoCategoria->idmoneda = $monedas->idmoneda;
                $elementoCategoria->concepto = $d->concepto;
                $elementoCategoria->valor = $d->valor;
                $elementoCategoria->idcuentadesgloseprecio = $d->idcuentadesgloseprecio;
                $objDatElemento->DatElementocategoria->add($elementoCategoria);
            }
        }
        if ($monedas->idmonedaalternativa) {
            $obj = new DatDesgloselemento();
            $obj->idmoneda = $monedas->idmonedaalternativa;
            if (!$idElementoConduce) {
                $obj->preciotarifa = $prec['datos'][$monedas->idmonedaalternativa]['precioventa'];
                $objDatElemento->DatDesgloselemento->add($obj);
                foreach ($prec['datos'][$monedas->idmonedaalternativa]['DatPrecio'] as $i => &$d) {
                    if ($d['porciento'] == 1) {
                        $d['valor'] = $prec['datos'][$monedas->idmonedaalternativa]['precio'] * $d['valor'] / 100;
                    }
                    $elementoCategoria = new DatElementocategoria();
                    $elementoCategoria->synchronizeWithArray($d);
                    $elementoCategoria->idindicador = $prod['idindicador'];
                    $elementoCategoria->idmoneda = $monedas->idmonedaalternativa;
                    $objDatElemento->DatElementocategoria->add($elementoCategoria);
                }
            } else {
                $desgElCond = Doctrine::getTable('DatDesgloselemento')
                    ->findByDql(
                        'idelementofactura = ? and idmoneda = ?',
                        array($idElementoConduce, $monedas->idmonedaalternativa)
                    );
                $obj->preciotarifa = $desgElCond[0]['preciotarifa'];
                $obj->preciotarifaoriginal = $desgElCond[0]['preciotarifaoriginal'];
                $obj->preciotarifafactura = $desgElCond[0]['preciotarifa'];
                $objDatElemento->DatDesgloselemento->add($obj);
                $elementosCatg = Doctrine::getTable('DatElementocategoria')
                    ->findByDql(
                        'idelementofactura = ? and idmoneda = ?',
                        array($idElementoConduce, $monedas->idmonedaalternativa)
                    );
                foreach ($elementosCatg as $d) {
                    $elementoCategoria = new DatElementocategoria();
                    $elementoCategoria->idindicador = $prod['idindicador'];
                    $elementoCategoria->idmoneda = $monedas->idmonedaalternativa;
                    $elementoCategoria->concepto = $d->concepto;
                    $elementoCategoria->valor = $d->valor;
                    $elementoCategoria->idcuentadesgloseprecio = $d->idcuentadesgloseprecio;
                    $objDatElemento->DatElementocategoria->add($elementoCategoria);
                }
            }
        }
    }

    public function getOrdenByConfig(&$query, $campo)
    {
        //Configuracion inventario para el orden de los productos
        $config = new ConfiguracioninventarioService();
        $result = $config->devolverConfiguracion($this->idestructura);
        switch ($result['ordenproducto']) {
            case 1:
                $query = $query->orderBy("i.codigo",'ASC');
                return $query;
            case 2:
                $query = $query->orderBy("i.denominacion",'ASC');
                return $query;
            case 3:
                $query = $query->orderBy("{$campo}",'ASC');
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

    public function getProductos(
        $iddocumento, $subsistema, $criterio = false, $moneda = false, $oferta = false, $tasa = false, $dql = false
    )
    {
        $paisArray = array();
        $datosMaestros = new MaestroProductoModel();
        if (is_array($iddocumento)) {
            $modelFactura = new GestionarFacturaModel(
                array('alias' => 'facturaLog', 'subsistema' => LogisticaGlobal::SUBSISTEMA_FAC)
            );
            $monedas = $modelFactura->getDualidadMonedas();
            $arrayIndix = array();
            $arrayIndix[$monedas->idmoneda] = array('precio' => strtolower('preciocontable' . $monedas->codigoiso),
                'importe' => strtolower('importe' . $monedas->codigoiso));
            if($monedas->idmonedaalternativa) {
                $arrayIndix[$monedas->idmonedaalternativa] = array('precio' => strtolower('preciocontable' . $monedas->codigoisoalt),
                    'importe' => strtolower('importe' . $monedas->codigoisoalt));
            }

            if ($subsistema == LogisticaGlobal::SUBSISTEMA_INV) {
                $query = new Doctrine_Query();

                new DatProdFactura();
                $query->addSelect("p.idproducto,p.idestructura");
                $query->andWhereIn("dm.iddocumento", $iddocumento);
                $query->from("DatProductoLogistica p")
                    ->innerJoin("p.DatMovimientos dm")
                    ->leftJoin("dm.DatMovmoneda dmm");
                $query->innerJoin('dm.DatProdFactura dpf');
                $query->addSelect("dpf.idtipoprecio as idtipoprecio");
                $query->addSelect("dm.idmovimiento, dmm.idmoneda, dmm.precio, dmm.importe");
                $query->addSelect("dm.preciocontable as preciocontable");
                $query->addSelect("dm.precioalternativo as precioalternativo");
                $datosMaestros->addQueryNomIndicador($query, 'p', 'i', 'ih');
                $query->addSelect("(SELECT COUNT(ncil.idindicador) FROM NomIndicadorcilindro ncil WHERE ncil.idindicador = i.idindicador) as cilindro");
                $query = $this->getOrdenByConfig($query, 'dm.idmovimiento');
                if ($dql) {
                  return $query;
                }
                $array = $query->fetchArray();
            } else {
                $elementos = $this->elementosFactura->getElementos(
                    array('iddocumento' => $iddocumento, 'tipo' => 1, 'criterio' => $criterio, 'dql' => $dql)
                );
                if ($dql) {
                  return $elementos;
                }
                $array = $this->arrayUnico($elementos, 'idindicador');
            }
            foreach ($array as &$value) {
                $value['cantidad'] = $this->getCantidad($iddocumento, $value);
                $value['um'] = $value['umedida'];
                $value['denominacionPrecio'] = $modelFactura->getTipoPrecios(
                    null, $value['idtipoprecio']
                );
                $datosMonedas = $value['DatMovimientos'][0]['DatMovmoneda'];
                foreach ($datosMonedas as $d) {
                    $value[$arrayIndix[$d['idmoneda']]['precio']] = $d['precio'];
                    $value[$arrayIndix[$d['idmoneda']]['importe']] = $d['importe'];
                }
                $this->addNacionalidad($value, $paisArray);
            }
        } else {
            if ($subsistema == LogisticaGlobal::SUBSISTEMA_INV && !$oferta) {
                $query = new Doctrine_Query();
                new DatProdFactura();
                $query->addSelect("p.idproducto, p.idestructura");
                $query->andWhereIn("dm.iddocumento", $iddocumento);
                if ($oferta) {
                    $query->addWhere(
                        "
                        (SELECT dcp.pendiente FROM DatPrefacturacmpto dcp WHERE dcp.idmovimiento = dm.idmovimiento) > 0
                    "
                    );
                }
                $query->from("DatProductoLogistica p")
                    ->innerJoin("p.DatMovimientos dm");
                $datosMaestros->addQueryNomIndicador($query, 'p', 'i', 'ih');
                $query->addSelect(
                    "dm.idmovimiento as idmovimiento,
                     dm.iddocumento as iddocumento,
                     dm.preciocontable as preciocontable,
                     dm.precioalternativo as precioalternativo,
                     dm.cantidad as cantidad,
                     p.idindicador as idindicador"
                );
                $query = $this->getOrdenByConfig($query, 'dm.idmovimiento');
                if ($dql) {
                  return $query;
                }
                $array = $query->fetchArray();
            } else if ($subsistema == LogisticaGlobal::SUBSISTEMA_AFT) {
                $elementos = $this->elementosFactura->getElementos(
                    array('iddocumento' => array($iddocumento), 'activosfijos' => 1, 'criterio' => $criterio,
                        'moneda' => $moneda, 'tipotasa' => $tasa, 'dql' => $dql)
                );
                if ($dql) {
                  return $elementos;
                }
                $array = $elementos;
            } else {
                $elementos = $this->elementosFactura->getElementos(
                    array('iddocumento' => array($iddocumento), 'tipo' => 1, 'criterio' => $criterio,
                        'moneda' => $moneda, 'tipotasa' => $tasa, 'dql' => $dql)
                );
                if ($dql) {
                  return $elementos;
                }
                $array = $elementos;
            }
            foreach($array as &$value){
                $this->addNacionalidad($value, $paisArray);
            }
        }
        //$datosMaestros->addSelectionData($array);
        return $array;
    }

    public function addNacionalidad(&$nomenclador, &$paisArray){
        if (!$paisArray[$nomenclador['idpais']]) {
            $paisArray[$nomenclador['idpais']] = $this->configuracionHelper->obtenerPaisXID($nomenclador['idpais']);
        }
        $nomenclador['nacionalidad'] = $paisArray[$nomenclador['idpais']]['siglas'];
        $nomenclador['naturaleza'] = $nomenclador['NomNaturaleza']['denominacion'];
        unset($nomenclador['NomNaturaleza']);
    }

    public function arrayUnico($array, $campo)
    {
        foreach ($array as $sub) {
            $cmp[] = $sub[$campo];
        }
        $unique = array_unique($cmp);
        foreach ($unique as $k => $campo) {
            $resultado[] = $array[$k];
        }
        return $resultado;
    }

    public function getDatosProdConfirmar($iddocumento, $subsistema)
    {
        $respuesta = array();
        if ($subsistema == LogisticaGlobal::SUBSISTEMA_INV) {
            foreach ($iddocumento as $id) {
                $fact = Doctrine::getTable('DatDocfactura')
                    ->find(
                        $id
                    );
                if ($fact->oferta == 0) {
                    $respuesta[$id] = Doctrine::getTable('DatMovimientos')
                        ->findByDql(
                            'iddocumento = ?', array($id)
                        )
                        ->toArray();
                } else {
                    $respuesta[$id] = $this->elementosFactura->getElementos(
                        array('iddocumento' => array($id)/*,
                              'tipo'        => 1*/)
                    );
                }
            }
        } else {
            foreach ($iddocumento as $id) {
                $respuestaP = $this->elementosFactura->getElementos(
                    array('iddocumento' => array($id),
                          'tipo'        => 1)
                );
                $respuestaA = $this->elementosFactura->getElementos(
                    array('iddocumento' => array($id), 'activosfijos' => 1)
                );
                $respuesta[$id] = array_merge($respuestaP, $respuestaA);
            }
        }
        return $respuesta;
    }

    public function getCantidadProductos($iddocumento, $subsistema, $oferta)
    {
        $cantidad = 0;
        if ($subsistema == LogisticaGlobal::SUBSISTEMA_INV && $oferta == 0) {
            $cantidad += count(
                Doctrine::getTable('DatMovimientos')
                    ->findByDql(
                        'iddocumento = ?', array($iddocumento)
                    )
            );
        } else {
            $cantidad += $this->elementosFactura->getSelectQuery(
                array('iddocumento' => $iddocumento, 'tipo' => 1)
            )
                ->count();
            $cantidad += $this->elementosFactura->getSelectQuery(
                array('iddocumento' => $iddocumento, 'activosfijos' => 1)
            )
                ->count();
        }
        return $cantidad;
    }

    public function eliminarProdFactura($movimientos, $idsubsistema, $documento)
    {
        $ubicacionServ = new UtilesubicacionService();
        $documentoFactura = Doctrine::getTable('DatDocfactura')
            ->find($documento);
        if ($idsubsistema == LogisticaGlobal::SUBSISTEMA_INV && $documentoFactura->oferta == 0) {
            $afectaDisponible = true;
            $modelFactura = new GestionarFacturaModel(
                array('alias' => 'facturaLog', 'subsistema' => LogisticaGlobal::SUBSISTEMA_FAC)
            );
            $docsOrigen = $modelFactura->getDocOrigen($documento);
            if (count($docsOrigen) > 0) {
                $afectaDisponible = false;
                $arrayDocsOrigen = array();
                foreach ($docsOrigen as $doc) {
                    $arrayDocsOrigen[] = $doc['idpadre'];
                }
            }
            if ($documento) {
                $datPrefactura = Doctrine::getTable('DatFacturaPrefactura')
                    ->find($documento);
                if ($datPrefactura->reservadisponible != 1) {
                    $afectaDisponible = false;
                }
            }
            $datosLotes = $datosCmpto = array();
            $numSerie = new NoSerieService();
            foreach ($movimientos as $mov) {
                $movimiento = Doctrine::getTable('DatMovimientos')
                    ->find($mov);
                $numSerie->cambiaEstadoFacturacion($mov);
                $arrayProductos = array('idproducto' => $movimiento->idproducto, 'iddocorigen' => $arrayDocsOrigen,
                    'enprocesonuevo' => 0, 'entregado' => 0, 'enprocesoviejo' => $movimiento->cantidad);
                $datosCmpto['productos'][] = $arrayProductos;
                $lotes = Doctrine::getTable('DatMovlote')
                    ->findByDql('idmovimiento = ?', array($mov));
                $idproductos[] = $movimiento->idproducto;
                /*foreach ($lotes as $lote) {
                    $datosLotes[] =
                        array('cantidad' => 0, 'cantidadVieja' => $lote['cantidad'], 'idlote' => $lote['idlote']);
                }*/
            }
            $datosCmpto['idcliente'] = $documentoFactura->idcliente;
            if (count($datosCmpto) > 0) {
                $prodOrdenModel = new ProdordenModel();
                $prodOrdenModel->actualizarCumplimientoByParams($datosCmpto);
            }
            if (count($lotes) > 0) {
                $serviceLote = new LoteService();
                $serviceLote->eliminarLotesDocumento(null, $movimientos);
            }
            $this->prodLogModel->eliminarMovimientos(
                false, $movimientos, $afectaDisponible, false
            );
            $ubicacionServ->eliminarUbicacionComprometida($documento, $idproductos);

        } else {
            if ($idsubsistema == LogisticaGlobal::SUBSISTEMA_TALLERES) {
                $modelFactura = new GestionarFacturaModel(
                    array('alias' => 'facturaLog', 'subsistema' => LogisticaGlobal::SUBSISTEMA_FAC)
                );
                $docsOrigen = $modelFactura->getDocOrigen($documento);
                $ids = implode(',', $movimientos);
                $sql = "select elf.idprod as idproducto, dps.idindicador, elf.cantidad, elf.idactividadmaterial
                         from mod_logfacturacion.dat_elementosfactura elf
                        inner join mod_logfacturacion.dat_prodservnomenclador dps on dps.idelementofactura = elf.idelementofactura
                        where elf.idelementofactura in ({$ids})";
                $productos = LogisticaDoctrineHelper::__init()->getConnection()->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
                $datosCmptoOrden = array();
                foreach ($productos as $prod) {
                    $arrayProductos = array(
                        'idproducto' => $prod['idproducto'], 'idindicador' => $prod['idindicador'],
                        'iddocorigen' => array($docsOrigen[0]['idpadre']), 'enprocesonuevo' => 0, 'enprocesoviejo' => $prod['cantidad'],
                        'entregado' => 0, 'idactividad'=>($prod['idactividadmaterial'] ? $prod['idactividadmaterial'] : null)
                    );
                    $datosCmptoOrden['productos'][] = $arrayProductos;
                }
                $datosCmptoOrden['iddocumento'] = $documento;
                $ordenService = new OrdenTrabajoTalleresService();
                $ordenService->actualizarCumplimiento($datosCmptoOrden);
            }
            $this->elementosFactura->deleteElementos($movimientos);
        }
    }

    public function getCantidad($documentos, $idproducto)
    {
        $query = new Doctrine_Query();
        if ($idproducto['idproducto']) {
            $result = $query->select("SUM(dm.cantidad) as cantidad")
                ->from("DatMovimientos dm")
                ->addWhere(
                    "dm.idproducto = ?", array($idproducto['idproducto'])
                )
                ->andWhereIn("dm.iddocumento", $documentos)
                ->fetchArray();
        } else {
            if ($idproducto['idindicador']) {
                $result = $query->select("SUM(de.cantidad) as cantidad")
                    ->from("DatElementosFactura de")
                    ->innerJoin("de.DatProdServNomenclador dpn")
                    ->addWhere(
                        "dpn.idindicador = ?", array($idproducto['idindicador'])
                    )
                    ->andWhereIn("de.idfactura", $documentos)
                    ->fetchArray();
            }
        }
        return $result[0]['cantidad'];
    }
}
