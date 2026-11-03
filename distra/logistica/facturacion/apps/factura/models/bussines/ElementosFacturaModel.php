<?php

class ElementosFacturaModel extends AbstractCompositeModel
{

    private $maestoP;
    private $serviciosPlanificacion;
    private $configuracionHelper;
    private $idestructura;

    public function __construct()
    {
        parent::__construct();
        $this->setBaseAlias('def');
        $this->loadPluginsFromFile('pluginsfactura')
            ->buildRelations();
        $this->maestoP = new MaestroProductoModel();
        $this->serviciosPlanificacion = ServiciosPlanificacionHelper::__init();
        $this->configuracionHelper = ServiciosConfiguracionGeneralHelper::__init();
        $this->idestructura = $this->global->Estructura->idestructura;
    }

    public function initBaseModel()
    {
        $this->baseModel = new DatElementosFactura();
    }

    /**
     *
     */
    public function getQuerySelectFields($alias)
    {
        $arrayQueryStrings = array(
            'idelementofactura' => '_p.idelementofactura', 'no_key' => '_p.idfactura',
            'importe' => '_p.importe', 'preciobase' => '_p.preciotarifabase', 'cantidad' => '_p.cantidad',
            'preciopromedio' => '_p.preciopromedio', 'idproducto' => '_p.idprod', 'idactividadmaterial' => '_p.idactividadmaterial'
        );
        return $this->doctrineHelper->getStrSelectString(
            $arrayQueryStrings, $alias, '_p'
        );
    }

    /**
     *
     */
    public function addQueryFilters(Doctrine_Query $query, $aliasTabla, $parametros = array())
    {
        if ($parametros['iddocumento']) {
            $query->andWhereIn(
                "$aliasTabla.idfactura", $parametros['iddocumento']
            );
        }
    }

    public function beforeDelete($identificador)
    {
    }

    public function initBaseRelation(Doctrine_Record $model)
    {
        return;
    }

    public function addJoinModel(
        Doctrine_Query $query, $aliasExterno, $aliasLocal, $includeSelect = true, $parametros = array()
    )
    {
        return;
    }

    public function addElemento($modelo, $parametros)
    {
        $this->beforeSave($modelo, $parametros);
    }

    public function getElementos($parametros)
    {
        if ($parametros['dql']) {
          return $this->getSelectQuery($parametros);
        }
        $query = $this->getSelectQuery($parametros);
        if ($parametros['tipo'] == 1) {
            $query = $this->getOrdenByConfig($query, 'def.idelementofactura');
        }
        $elementos = $query->fetchArray();
        $factura = Doctrine::getTable('DatDocfactura')
            ->find((is_array($parametros['iddocumento'])? $parametros['iddocumento'][0]: $parametros['iddocumento']));
        $parametros['factorconvercion'] = $factura->factorconvercion;
        $parametros['tasacambio'] = $factura->tasacambio;
        $parametros['idmonedaoriginal'] = $factura->idmoneda;
        $parametros['idsubsistema'] = $factura->idsubsistema;
        $modelFactura = new GestionarFacturaModel(
            array('alias' => 'facturaLog', 'subsistema' => LogisticaGlobal::SUBSISTEMA_FAC)
        );
        foreach ($elementos as &$elem) {
            $this->getAddFieldsElemento($elem, $parametros, $modelFactura);
            if (isset($elem['tipo'])){
              $elem['servicio'] = ($elem['tipo'] == 2) ? 1 : 0;
            }
        }
        return $elementos;
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

    public function getSelectQuery($parametros)
    {
        $query = $this->initBaseQuery($parametros);
        $pluginCount = 1;
        foreach ($this->listaPlugins as $pluginModel) {
            $pluginModel->addJoinModel(
                $query, $this->baseAlias, $this->baseAlias . '' . $pluginCount, true, $parametros
            );
            $pluginModel->addQueryFilters($query, $this->baseAlias . '' . $pluginCount, $parametros);
            ++$pluginCount;
        }
        return $query;
    }

    public function getAddFieldsElemento(&$elemento, $parametros, $modelFactura)
    {
        $datosMoneda = LogisticaGlobal::__init()->getMonedaEntidad();
        if ($elemento['tipo'] && ($elemento['tipo'] == 1 || $elemento['tipo'] == 2)) {
            $elemento['um'] = $elemento['umedida'];
            $elemento['denominacionPrecio'] = $modelFactura->getTipoPrecios(
                null, $elemento['idtipoprecio']
            );
            $desgloseElemento = Doctrine::getTable('DatDesgloselemento')
                ->findByDql(
                    'idelementofactura = ?', array($elemento['idelementofactura'])
                );
				
            foreach ($desgloseElemento as $index => $desg) {
                $auxIndex = ($elemento['tipo'] == 1) ? 'p' : 'preciotarifa';
                $indice = $auxIndex . (($desg['idmoneda'] == $datosMoneda->idmoneda)?'contable':'alternativo');
                $indiceImporte = ($desg['idmoneda'] == $datosMoneda->idmoneda) ? 'impcontable' :
                    'impalternativo';
                /*if ($parametros['moneda']) {
                    if ($datosMoneda->idmonedaalternativa) {
                        if ($desg['idmoneda'] == $datosMoneda->idmonedaalternativa) {
                            if ($parametros['idmonedaoriginal'] == $parametros['moneda']) {
                                $calculoPrecio = $modelFactura->convertirPrecio(
                                    $parametros['tasacambio'], $parametros['factorconvercion'], $desg['preciotarifa']
                                );
                            } else {
                                $calculoPrecio = $this->configuracionHelper->convertirImporte(
                                    $desg['idmoneda'], $parametros['moneda'], $parametros['tipotasa'],
                                    $desg['preciotarifa'], 1
                                );
                            }
                            if (is_array($calculoPrecio)) {
                                throw new ZendExt_Exception('LOG_LB_FAC_001');
                            }
                            $elemento[$indice] = number_format(
                                $calculoPrecio, 6, '.', ''
                            );
                            $elemento[$indiceImporte] = round(
                                $calculoPrecio * $elemento['cantidad'], 2
                            );
                        } else {
                            $elemento[$indice] = number_format(
                                $desg['preciotarifa'], 6, '.', ''
                            );
                            $elemento[$indiceImporte] = round(
                                $desg['preciotarifa'] * $elemento['cantidad'], 2
                            );
                        }
                    } else {
                        if ($parametros['idmonedaoriginal'] == $parametros['moneda']) {
                            $calculoPrecio = $modelFactura->convertirPrecio(
                                $parametros['tasacambio'], $parametros['factorconvercion'], $desg['preciotarifa']
                            );
                        } else {
                            $calculoPrecio = $this->configuracionHelper->convertirImporte(
                                $desg['idmoneda'], $parametros['moneda'], $parametros['tipotasa'],
                                $desg['preciotarifa'], 1
                            );
                        }
                        if (is_array($calculoPrecio)) {
                            throw new ZendExt_Exception('LOG_LB_FAC_001');
                        }
                        $elemento[$indice] = number_format(
                            $calculoPrecio, 6, '.', ''
                        );
                        $elemento[$indiceImporte] = round(
                            $calculoPrecio * $elemento['cantidad'], 2
                        );
                    }
                } else {*/
                    $elemento[$indice] = number_format(
                        $desg['preciotarifa'], 6, '.', ''
                    );
                    $elemento[$indiceImporte] = round(
                        ($desg['importe'] > 0) ? $desg['importe'] : $desg['preciotarifa'] * $elemento['cantidad'], 2
                    );
                //}
            }
            if($elemento['tipo'] != 1){
                $objProdServ = new DatProdServicios();
                $elemento['materiales'] = $objProdServ->getProductos(
                    $elemento['idelementofactura']
                );
                if($parametros['idsubsistema'] == LogisticaGlobal::SUBSISTEMA_AFT){
                    $service = new RegNumActivoService();
                }
                foreach ($elemento['materiales'] as &$mat) {
                    /*if($mat['idregnumerico']){
                        $query = $service->getQueryDataVisualizarRegNumActivos(
                            array('idregnumerico' => $mat['idregnumerico']), 'drna'
                        );
                        $datosAf = $query->fetchArray();
                        $mat['nroserie'] = $datosAf[0]['nroserie'];
                    }*/
                    $ind = $this->maestoP->cargarGridNomenclador(
                        array('idindicador' => $mat['idindicador'])
                    )['datos'];
                    $mat = array_merge($mat, $ind[0]);
                    if($mat['DatDesglosemonedaprodserv']){
                        foreach ($mat['DatDesglosemonedaprodserv'] as $desg) {
                            if($parametros['moneda']){
                                $desg['precio'] = $this->calcularDesgPrecioMoneda(
                                    $datosMoneda, $desg, $parametros, $modelFactura
                                );
                            }
                            if($desg['idmoneda'] == $datosMoneda->idmoneda){
                                $mat['preciocontable'] = $desg['precio'];
                                $mat['importecontable'] = round($desg['precio'] * $mat['cantidad'],2);
                                $mat['descuento'] = $desg['descuento'];
                            }else{
                                $mat['precioalternativo'] = $desg['precio'];
                                $mat['importealternativo'] = $desg['precio'] * $mat['cantidad'];
                            }
                        }
                    }
                }
                $elemento['productos'] = count($elemento['materiales']);
            }
        } else if ($elemento['idregnumerico'] && $elemento['idregnumerico'] != null) {
            $this->getDatosActivos($elemento, $modelFactura, $datosMoneda, $parametros);
        } else {
            if ($elemento['idactividad'] && $elemento['idactividad'] != null) {
                //servicio que me de los datos de las actividades
                $objProdServ = new DatProdServicios();
                $result = $this->serviciosPlanificacion->obtenerActividadyNorma(
                    4, $elemento['idactividad'], array(), 0, 1, 0
                )['datos'];
                $elemento['denominacionPrecio'] = '-';
                $elemento['denominacion'] = $result[0]['denominacion'];
                $elemento['codigo'] = $result[0]['codigo'];
                $this->getPrecios($elemento, $parametros, $modelFactura, $datosMoneda);
                $elemento['materiales'] = $objProdServ->getProductos(
                    $elemento['idelementofactura']
                );
                foreach ($elemento['materiales'] as &$mat) {
                    /*if($mat['idprodservicio']){
                        unset($mat['idprodservicio']);
                    }*/
                    $ind = $this->maestoP->cargarGridNomenclador(
                        array('idindicador' => $mat['idindicador'])
                    )['datos'];
                    //$mat = array_merge($mat, $ind[0]);
                    $mat['denominacion'] = $ind[0]['denominacion'];
                    $mat['codigo'] = $ind[0]['codigo'];
                    $mat['umedida'] = $ind[0]['umedida'];
                    if ($parametros['moneda']) {
                        $calcPrec = $this->configuracionHelper->calcularImporteDadoMonedas(
                            $parametros['moneda'], $mat['preciobase'], $this->idestructura, false
                        );
                        $mat['precio'] = number_format((($calcPrec) ? $calcPrec : 0), 6, '.', '');
                        $mat['importetotal'] = $mat['precio'] * $mat['cantidad'];
                    }
                }
                $elemento['productos'] = count($elemento['materiales']);
            }
        }
    }

    public function calcularDesgPrecioMoneda($datosMoneda, $desg, $parametros, $modelFactura){
        if ($datosMoneda->idmonedaalternativa) {
            if ($desg['idmoneda'] == $datosMoneda->idmonedaalternativa) {
                if ($parametros['idmonedaoriginal'] == $parametros['moneda']) {
                    $desg['precio'] = $modelFactura->convertirPrecio(
                        $parametros['tasacambio'], $parametros['factorconvercion'], $desg['precio']
                    );
                } else {
                    $desg['precio'] = $this->configuracionHelper->convertirImporte(
                        $desg['idmoneda'], $parametros['moneda'], $parametros['tipotasa'], $desg['precio'], 1
                    );
                }
            }
        } else {
            if ($desg['idmoneda'] == $datosMoneda->idmoneda) {
                /*if ($parametros['idmonedaoriginal'] == $parametros['moneda']) {
                    $desg['precio'] = $modelFactura->convertirPrecio(
                        $parametros['tasacambio'], $parametros['factorconvercion'], $desg['precio']
                    );
                } else {
                    $desg['precio'] = $this->configuracionHelper->convertirImporte(
                        $desg['idmoneda'], $parametros['moneda'], $parametros['tipotasa'], $desg['precio'], 1
                    );
                }*/
            }
        }
        return $desg['precio'];
    }

    public function getDatosActivos(&$activo, $modelFactura, $datosMoneda, $parametros){
        $service = new RegNumActivoService();
        $query = $service->getQueryDataVisualizarRegNumActivos(array('idregnumerico'=> $activo['idregnumerico']), 'drna');
        $datos = $query->fetchArray();
        $activo['nroserie'] = $datos[0]['nroserie'];
        $activo['denominacionPrecio'] = $modelFactura->getTipoPrecios(
            array('idsubsistema' => LogisticaGlobal::SUBSISTEMA_AFT, 'promedio' => 1), $activo['idtipoprecio']
        );
        $desgloseElemento = Doctrine::getTable('DatDesgloselemento')
            ->findByDql(
                'idelementofactura = ?', array($activo['idelementofactura'])
            );
        foreach ($desgloseElemento as $index => $desg) {
            $indice = (($desg['idmoneda'] == $datosMoneda->idmoneda) ? 'pcontable' : 'palternativo');
            $indiceImporte = ($desg['idmoneda'] == $datosMoneda->idmoneda) ? 'impcontable' : 'impalternativo';
            if ($parametros['moneda']) {
                if ($datosMoneda->idmonedaalternativa) {
                    if ($desg['idmoneda'] == $datosMoneda->idmonedaalternativa) {
                        if ($parametros['idmonedaoriginal'] == $parametros['moneda']) {
                            $calculoPrecio = $modelFactura->convertirPrecio(
                                $parametros['tasacambio'], $parametros['factorconvercion'], $desg['preciotarifa']
                            );
                        } else {
                            $calculoPrecio = $this->configuracionHelper->convertirImporte(
                                $desg['idmoneda'], $parametros['moneda'], $parametros['tipotasa'],
                                $desg['preciotarifa'], 1
                            );
                        }
                        if (is_array($calculoPrecio)) {
                            throw new ZendExt_Exception('LOG_LB_FAC_001');
                        }
                        $activo[$indice] = number_format(
                            $calculoPrecio, 6, '.', ''
                        );
                        $activo[$indiceImporte] = round(
                            $calculoPrecio * $activo['cantidad'], 2
                        );
                    } else {
                        $activo[$indice] = number_format(
                            $desg['preciotarifa'], 6, '.', ''
                        );
                        $activo[$indiceImporte] = round(
                            $desg['preciotarifa'] * $activo['cantidad'], 2
                        );
                    }
                } else {
                    if ($parametros['idmonedaoriginal'] == $parametros['moneda']) {
                        $calculoPrecio = $modelFactura->convertirPrecio(
                            $parametros['tasacambio'], $parametros['factorconvercion'], $desg['preciotarifa']
                        );
                    } else {
                        $calculoPrecio = $this->configuracionHelper->convertirImporte(
                            $desg['idmoneda'], $parametros['moneda'], $parametros['tipotasa'], $desg['preciotarifa'],
                            1
                        );
                    }
                    if (is_array($calculoPrecio)) {
                        throw new ZendExt_Exception('LOG_LB_FAC_001');
                    }
                    $activo[$indice] = number_format(
                        $calculoPrecio, 6, '.', ''
                    );
                    $activo[$indiceImporte] = round(
                        $calculoPrecio * $activo['cantidad'], 2
                    );
                }
            } else {
                $activo[$indice] = number_format(
                    $desg['preciotarifa'], 6, '.', ''
                );
                $activo[$indiceImporte] = round(
                    $desg['preciotarifa'] * $activo['cantidad'], 2
                );
            }
        }
    }

    public function getPrecios(&$elemento, $parametros, $modelFactura, $datosMoneda)
    {
        $desgloseElemento = Doctrine::getTable('DatDesgloselemento')
            ->findByDql(
                'idelementofactura = ?', array($elemento['idelementofactura'])
            );
        foreach ($desgloseElemento as $desg) {
            $auxIndex = ($elemento['tipo'] == 1) ? 'p' : 'preciotarifa';
            $indice = $auxIndex . (($desg['idmoneda'] == $datosMoneda->idmoneda) ? 'contable' : 'alternativo');
            $indiceImporte = ($desg['idmoneda'] == $datosMoneda->idmoneda) ? 'impcontable' : 'impalternativo';
            if ($parametros['moneda']) {
                if ($datosMoneda->idmonedaalternativa) {
                    if ($desg['idmoneda'] == $datosMoneda->idmonedaalternativa) {
                        if ($parametros['idmonedaoriginal'] == $parametros['moneda']) {
                            $calculoPrecio = $modelFactura->convertirPrecio(
                                $parametros['tasacambio'], $parametros['factorconvercion'], $desg['preciotarifa']
                            );
                        } else {
                            $calculoPrecio = $this->configuracionHelper->convertirImporte(
                                $desg['idmoneda'], $parametros['moneda'], $parametros['tipotasa'],
                                $desg['preciotarifa'], 1
                            );
                        }
                        if (is_array($calculoPrecio)) {
                            throw new ZendExt_Exception('LOG_LB_FAC_001');
                        }
                        $elemento[$indice] = number_format(
                            $calculoPrecio, 6, '.', ''
                        );
                        $elemento[$indiceImporte] = round(
                            $calculoPrecio * $elemento['cantidad'], 2
                        );
                    } else {
                        $elemento[$indice] = number_format(
                            $desg['preciotarifa'], 6, '.', ''
                        );
                        $elemento[$indiceImporte] = round(
                            $desg['preciotarifa'] * $elemento['cantidad'], 2
                        );
                    }
                } else {
                    if ($parametros['idmonedaoriginal'] == $parametros['moneda']) {
                        $calculoPrecio = $modelFactura->convertirPrecio(
                            $parametros['tasacambio'], $parametros['factorconvercion'], $desg['preciotarifa']
                        );
                    } else {
                        $calculoPrecio = $this->configuracionHelper->convertirImporte(
                            $desg['idmoneda'], $parametros['moneda'], $parametros['tipotasa'], $desg['preciotarifa'],
                            1
                        );
                    }
                    if (is_array($calculoPrecio)) {
                        throw new ZendExt_Exception('LOG_LB_FAC_001');
                    }
                    $elemento[$indice] = number_format(
                        $calculoPrecio, 6, '.', ''
                    );
                    $elemento[$indiceImporte] = round(
                        $calculoPrecio * $elemento['cantidad'], 2
                    );
                }
            } else {
                $elemento[$indice] = number_format(
                    $desg['preciotarifa'], 6, '.', ''
                );
                $elemento[$indiceImporte] = round(
                    $desg['preciotarifa'] * $elemento['cantidad'], 2
                );
            }
        }
    }

    public function modificarElementos($parametros, $documento, $producto = 1)
    {
        $idmonedafactura = ($parametros['idmoneda']) ? $parametros['idmoneda'] : $documento->idmoneda;
        $factordoc = ($parametros['factorconvercion']) ? $parametros['factorconvercion'] : $documento->factorconvercion;
        $factorant = ($parametros['factoranterior']) ? $parametros['factoranterior'] : false;
        $cElementos = new Doctrine_Collection('DatElementosFactura');
        $cDesgloseElementos = new Doctrine_Collection('DatDesgloselemento');
        $cElementoCateg = new Doctrine_Collection('DatElementocategoria');
        $elementos = ($producto == 1) ? $parametros['productos'] : $parametros['servicios'];
        $model = new GestionarFacturaModel(
            array('alias' => 'facturaLog', 'subsistema' => LogisticaGlobal::SUBSISTEMA_FAC)
        );
        $prodServObj = new DatProdServNomenclador();
        $monedas = $model->getMonedaContableAlternativa();//quitar esto y ajustarlo al nuevo
        $dualidad = $model->getDualidadMonedas();
        foreach ($elementos as $element) {
            $element = (array)$element;
            $elemento = Doctrine::getTable('DatElementosFactura')
                ->find(
                    $element['idelementofactura']
                );
            if ($element['cambioTipoTarifa']) {
                $servFact = $prodServObj->getProdServicio(
                    $element['idelementofactura']
                );
                if(count($servFact) > 0){
                    $servFact[0]->idtipoprecio = $element['idtipoprecio'];
                    $servFact[0]->save();
                }
                $value = new stdClass();
                $value->idindicador = $element['idindicador'];
                $value->idtipoprecio = $element['idtipoprecio'];
                $value->idestructura = $this->idestructura;
                $value->servicio = 1;
                $value->idcliente = $documento->idcliente;
                Doctrine_Query::create()
                    ->delete()
                    ->from('DatElementocategoria')
                    ->where(
                        'idelementofactura = ?', array($element['idelementofactura'])
                    )
                    ->execute();
                $clienteMoneda = $model->isUnicaMoneda(
                    array('idtipoprecio'=>$element['idtipoprecio'], 'idcliente'=>$documento->idcliente, 'idestructura'=>$this->idestructura)
                );
                $idmonedaunica = false;
                if(count($clienteMoneda) > 0){
                    $idmonedaunica = $clienteMoneda[0]['idmoneda'];
                    $prec = $model->getPrecio($value, $idmonedaunica, $idmonedafactura);
                }else{
                    $prec = $model->getPrecio($value, false, $idmonedafactura, false, $factordoc);
                }
                if ($prec == -2) {
                    $model->modificarPrecioManual($element, $documento->idfactura, $elemento, $cDesgloseElementos, $idmonedaunica, $idmonedafactura, $factorant);
                } else {
                    $sumarMonedas = $this->modificarProdServ($element, $model, $prec['preciopromedio'], $idmonedaunica);
                    if (is_array($prec)) {
                        $elemento->preciotarifabase = $prec['precioventa'];
                        $elemento->preciotarifaoriginal = $prec['precioventa'];
                        if ($elemento->preciopromedio == 1)
                            $elemento->preciotarifabase += $sumarMonedas[$dualidad->idmoneda];
                        $elemento->preciopromedio = (isset($prec['preciopromedio'])) ? $prec['preciopromedio'] : 0;
                        if($idmonedaunica){
                            $model->precioUnicaMonedaDesgloseServicio($dualidad, $element, $prec, $cDesgloseElementos, $cElementoCateg, $idmonedaunica, $sumarMonedas);
                        }else{
                            foreach ($monedas as $m) {
                                $desg = Doctrine::getTable('DatDesgloselemento')
                                    ->findByDql(
                                        'idmoneda = ? and idelementofactura = ?',
                                        array($m, $element['idelementofactura'])
                                    );
                                if (count($desg) > 0) {
                                    $obj = $desg[0];
                                } else {
                                    $obj = new DatDesgloselemento();
                                    $obj->idmoneda = $m;
                                    $obj->idelementofactura = $element['idelementofactura'];
                                }
                                $obj->preciotarifaoriginal = is_array($prec)
                                    ?$prec['datos'][$m]['precioventa']
                                    : 0;
                                $obj->preciotarifa = $obj->preciotarifaoriginal;
                                if($elemento->preciopromedio == 1)
                                    $obj->preciotarifa += $sumarMonedas[$m];
                                $cDesgloseElementos->add($obj);
                                foreach ($prec['datos'][$m]['DatPrecio'] as $i => &$d) {
                                    if($elemento->preciopromedio == 0){
                                        if ($d['porciento'] == 1) {
                                            $d['valor'] = $prec['datos'][$m]['precio'] * $d['valor'] / 100;
                                        } else {
                                            if(!$dualidad->idmonedaalternativa && $idmonedafactura) {
                                                $d['valor'] = $this->configuracionHelper->convertirImporte(
                                                    $dualidad->idmoneda, $idmonedafactura, $model->getTipoTasa(), $d['valor'], 1
                                                );
                                            }
                                        }
                                    }else{
                                        if ($d['porciento'] == 1) {
                                            $d['valor'] = ($prec['datos'][$m]['precio'] + $sumarMonedas[$m]) *
                                                $d['valor'] / 100;
                                        }/*else{
                                            $d['valor'] += $sumarMonedas[$m];
                                        }*/
                                    }
                                    $elementoCategoria = new DatElementocategoria();
                                    $elementoCategoria->synchronizeWithArray($d);
                                    $elementoCategoria->idindicador = $element['idindicador'];
                                    $elementoCategoria->idelementofactura = $element['idelementofactura'];
                                    $elementoCategoria->idmoneda = $m;
                                    $cElementoCateg->add($elementoCategoria);
                                }
                            }
                        }
                    } else {
                        $elemento->preciotarifabase = $prec;
                    }

                }
            }
            $elemento->synchronizeWithArray($element);
            $cElementos->add($elemento);
        }
        if ($cDesgloseElementos->count()) {
            $cDesgloseElementos->save();
        }
        if ($cElementoCateg->count()) {
            $cElementoCateg->save();
        }
        if ($cElementos->count()) {
            $cElementos->save();
        }
        return true;
    }

    public function deleteElementos($elementos)
    {
        $strIds = implode(',', $elementos);
        $dqlWHERE = "idelementofactura IN ({$strIds})";
        Doctrine_Query::create()
            ->delete('DatElementosFactura')
            ->where($dqlWHERE)
            ->execute();
        return true;
    }

    public function getAllElementos($parametros)
    {
        $query = Doctrine_Query::create()
            ->select(
                'def.*,
                psn.tipo as tipo,
                psn.idindicador as idindicador'
            )
            ->from('DatElementosFactura def')
            ->leftJoin('def.DatProdServNomenclador psn')
            ->where('def.idfactura = ?', array($parametros['iddocumento']));
        return $query->fetchArray();
    }

    public function modificarProdServ(&$elemento, $modelo, $cobrarmateriales = false, $idmonedaunica = false){
        $retorno = array();
        $materiales = Doctrine::getTable('DatProdServicios')
            ->findByDql('idelementofactura = ?', array($elemento['idelementofactura']));
        $collM = new Doctrine_Collection('DatProdServicios');
        $collD = new Doctrine_Collection('DatDesglosemonedaprodserv');
        foreach($materiales as &$m){
            $value = new stdClass();
            $value->idindicador = $m->idindicador;
            $value->idtipoprecio = $elemento['idtipoprecio'];
            $value->idestructura = $this->idestructura;
            //Falta dessarrollar el redondeo multiplo de 5 aqui
            if ($idmonedaunica) {
                $prec = $modelo->getPrecio($value, $idmonedaunica);
            } else {
                $prec = $modelo->getPrecio($value);
            }
            $m->preciobase = $prec['precioventa'];
            $m->importetotal = $m->preciobase * $m->cantidad;
            $collM->add($m);
            $desglose = Doctrine::getTable('DatDesglosemonedaprodserv')
                ->findByDql('idprodservicio = ?', array($m->idprodservicio));
            foreach($desglose as $d){
                $d->precio = ($prec['datos'][$d->idmoneda]['precioventa']) ?
                $prec['datos'][$d->idmoneda]['precioventa'] : 0;
                if($cobrarmateriales == 1){
                    $retorno[$d->idmoneda] += $d->precio* $m->cantidad;
                }
                $collD->add($d);
            }
        }
        $collD->save();
        $collM->save();
        return $retorno;
    }
}
