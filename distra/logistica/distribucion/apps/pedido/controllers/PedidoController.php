<?php

/**
 * @autor Antonio
 */
if (!class_exists('BaseModel')) {
    $dir = Zend_Registry::getInstance()->get('config')->dir_aplication . '/logistica/utiles/comun/config.php';
    include_once $dir;
    set_include_path(get_include_path() . PATH_SEPARATOR . $config['include_path']);
}

class PedidoController extends BaseController
{
    private $serviciosAyuda, $model, $serviciosConfiguracionGeneral, $arrayData, $configuracionService;

    public function init()
    {
        $this->arrayData = array(
            'isPrincipal' => true, 'alias' => 'pedido', 'subsistema' => LogisticaGlobal::SUBSISTEMA_INV
        );
        parent::init('log.dist.pedido');
		$this->model = new PedidoModel($this->arrayData);
        /*$this->serviciosAyuda = ServiciosAyudaHelper::__init();
        $this->serviciosConfiguracionGeneral = ServiciosConfiguracionGeneralHelper::__init();*/
        $cfgUsuarioEsp = new CfgUsuarioespecialidad();
        if ($this->jsonComponent->getComponent('log.inv.municiones', true)) {
            $configEspecialidad = $cfgUsuarioEsp->devolverConfiguracionEspecialidad(
                $this->global->Perfil->idusuario, $this->view->uiVariables['espArmamento']
            );
        }
        if ($this->existComponent('log.inv.configuracion'))
        {	
            $this->configuracionService = new ConfiguracioninventarioService();
            $config = $this->configuracionService->devolverConfiguracion($this->global->Estructura->idestructura);			
            $data = $this->configuracionHelper->ObtenerDocumentoPrimPorId($this->model->getIddoc());
            $this->view->uiVariables = array_merge(
                array(
                'useSign' => $this->objectHelper->getBooleanStr($config['firmadigital']),
                'usarCategoria' => $this->objectHelper->getBooleanStr(true),
                'alias' => "'{$this->arrayData['alias']}'",
                'idespaciotrabajo' => empty($data->idespaciotrabajo) ? 'false' : "'$data->idespaciotrabajo'",
                    'reportSpace' => empty($data->dirreporte) ? 'false' : "'$data->dirreporte'",
                'confArmamento' => empty($configEspecialidad->idespecialidad) ? 'false' : 'true'
                ), $this->view->uiVariables
            );
        }
    }

    public function pedidoAction()
    {
        $this->autoShow = false;
        $this->controllerConfig = 'log';
        $this->prepareView();
        $this->view->arrayJs = array(
            /*$this->serviciosConfiguracionGeneral->mostrarNomencladoresGenerales(),
            $this->serviciosConfiguracionGeneral->ObtenerJSArbolNaturaleza()*/
			$this->configuracionHelper->mostrarNomencladoresGenerales(),
            $this->configuracionHelper->ObtenerJSArbolNaturaleza()
        );
        $this->initComponent('log.dist.pedido');
        $this->renderTemplate();
    }

    public function eliminarDocumentoAction()
    {
        $this->uiParams['iddocumento'] = implode(',', Zend_Json::decode($this->uiParams['id']));
        $this->success = $this->model->eliminarDocumento($this->uiParams['iddocumento']);
    }

    public function adicionarDocumentoAction()
    {
        $this->uiParams['data'] = (array) Zend_Json::decode($this->uiParams['data']);
        $this->uiParams['productosExtras'] = Zend_Json::decode($this->uiParams['productosExtras']);
        $this->uiParams['serviciosExtras'] = Zend_Json::decode($this->uiParams['serviciosExtras']);
        $this->uiParams = array_merge($this->uiParams, $this->uiParams['data']);
        unset($this->uiParams['data']);
        $datos = $this->model->adicionarDocumento($this->uiParams);
        $this->iddocumento = $datos['iddocumento'];

    }

    public function addProductoAction()
    {
        $this->uiParams['productos'] = Zend_Json::decode($this->uiParams['productos']);
        $this->success = $this->model->adicionarProducto($this->uiParams);
    }

    public function anularEstadoDocumentoAction()
    {
        $this->uiParams['iddocumento'] = implode(',', Zend_Json::decode($this->uiParams['id']));
        $this->success = $this->model->anularEstadoDocumento($this->uiParams['iddocumento']);
    }

    public function eliminarProductoAction()
    {
        $this->success = $this->model->eliminarProducto(Zend_Json::decode($this->uiParams['idproducto']));
    }

    public function cerrarPedidoAction()
    {
        $this->success = $this->model->cerrarPedido($this->uiParams['iddocumento']);
    }

    public function cargarDocumentosAction()
    {
        $this->setDefaultParam('limit', 30);
        $this->setDefaultParam('start', 0);
        $datosBusqueda = $this->model->devolverDocumentos($this->uiParams);
        if ($datosBusqueda == 1) {
            $this->datos = array(array('docnoconfigurado' => true));
        } else {
            $this->datos = $datosBusqueda['datos'];
            $this->cantidad = $datosBusqueda['cantidad'];
        }
    }

    public function confirmarDocumentoAction()
    {
        $this->uiParams['iddocumento'] = implode(',', Zend_Json::decode($this->uiParams['id']));
        $result = $this->model->confirmarDocumento($this->uiParams['iddocumento']);
        if ($result == 1) {
            $this->success = true;
        } else {
            $this->codigoMsg = $result;
            $this->success = null;
        }
    }

    public function reclamarPedidoAction()
    {
        $this->success = $this->model->reclamarPedido($this->uiParams);
    }

    public function eliminarReclamoAction()
    {
        $this->success = $this->model->eliminarReclamo(Zend_Json::decode($this->uiParams['idreclamopedido']));
    }

    public function copiarDocumentoAction()
    {
        $this->uiParams['iddocumento'] = implode(',', Zend_Json::decode($this->uiParams['id']));
        $this->success = $this->model->copiarDocumento($this->uiParams['iddocumento']);
    }

    public function cargarServiciosExtrasAction()
    {
        $respuesta = $this->model->cargarServiciosExtras($this->uiParams);
        $this->datos = $respuesta['datos'];
        $this->cantidad = $respuesta['cantidad'];
    }

    public function cargarProductosExtrasAction()
    {
        $respuesta = $this->model->cargarProductosExtras($this->uiParams);
        $this->datos = $respuesta['datos'];
        $this->cantidad = $respuesta['cantidad'];
    }

    public function cargarClientesAction()
    {
        $respuesta = $this->model->cargarClientes($this->uiParams);
        $this->datos = $respuesta['datos'];
        $this->total = $respuesta['cantidad'];
    }

    public function cargarNomtipopedidoAction()
    {
        $respuesta = $this->model->getTipoPedido();
        $this->datos = $respuesta;
        $this->cantidad = count($respuesta);
    }

    public function cargarReclamosAction()
    {
        $respuesta = $this->model->cargarReclamos($this->uiParams);
        $this->datos = $respuesta['datos'];
        $this->cantidad = $respuesta['cantidad'];
    }

    public function getEntidadesAction()
    {
        $this->datos = $this->model->getEntidades($this->uiParams);
    }

    public function getTipopedidoAction()
    {
        $servicioConfiguracionPedido = new ConfiguraciondistribucionService();
        $this->datos = $servicioConfiguracionPedido->devolverConfiguracion();
    }

    public function aprobarEstadoDocumentoAction()
    {
        $this->uiParams['iddocumento'] = implode(
            ',', Zend_Json::decode($this->uiParams['id'])
        );
        $this->success = $this->model->aprobarDocumento(
            $this->uiParams['iddocumento']
        );
    }

    public function cargarProductosEstadoEjecucionAction()
    {
        $this->setDefaultParam('limit', 30);
        $this->setDefaultParam('start', 0);
        $this->unsetNullValues();
        $this->objectHelper->synchronize($this, $this->model->cargarProductosEstadoEjecucion($this->uiParams));
    }

    public function cargarProductoErrorAction()
    {
        $this->setDefaultParam('start', 0);
        $this->setDefaultParam('limit', 30);
        $this->objectHelper->synchronize($this, $this->model->cargarProductoError($this->uiParams));
    }
    
    public function eliminarImportarAction()
    {
        $this->objectHelper->synchronize($this, $this->model->eliminarImportar($this->uiParams['iddocumento']));
    }

    public function cargarCancelacionesAction()
    {
        //$this->objectHelper->synchronize($this, $this->_distribucionModel->cargarCancelaciones($this->uiParams['idprodorden']), $this->uiParams);
    }

    public function cargarTrazabilidadAction()
    {
        if ($this->uiParams['node'] != 0) {
            $docorigen = 0;
            $fechaini = null;
            $fechafin = null;
            /*DOCUMENTO DE ORIGEN (CITA, ABC, OFERTA, ORDEN DE TRABAJO)*/
            $data = $this->model->datosDocumento($this->uiParams['node']);
            $documentoorigen = $this->model->datosDocumentoOrigen($this->uiParams['node']);
            $arbol = array();
            if ($data[0]['abreviaturatipodoc'] == 'ordenServicioLOG'){
                $info = 'OT - #'.$documentoorigen[0]['nrodoc'].'<br/>';
                $docorigen = 1;
            }elseif ($data[0]['abreviaturatipodoc'] == 'citasLog'){
                $info = 'C - #'.$documentoorigen[0]['nrodoc'].'<br/>';
                $docorigen = 1;
            }elseif ($data[0]['abreviaturatipodoc'] == 'ofertaLog'){
                $info = 'OF - #'.$documentoorigen[0]['nrodoc'].'<br/>';
                $docorigen = 1;
            }
            if($docorigen == 1){
                $info .= 'FCR: '.$documentoorigen[0]['fechacreacion'].'<br/>';
                $info .= 'FC: '.$documentoorigen[0]['fechaconfirmado'].'-'.$this->model->restFechas($documentoorigen[0]['fechaconfirmado'], $documentoorigen[0]['fechacreacion'])->days.'<br/>';
                $info .= 'FCI: '.$documentoorigen[0]['fechaaprobado'].'-'.$this->model->restFechas($documentoorigen[0]['fechaaprobado'], $documentoorigen[0]['fechaconfirmado'])->days.'<br/>';
                $fechafin = $documentoorigen[0]['fechaaprobado'];
                $agencia = ZendExt_IoC::getInstance()->metadatos->DameEstructura($documentoorigen[0]['idestructuracomun']);
                $info .= 'A: '.$agencia[0]->denominacion.'<br/>';
                $estadodoc = $documentoorigen[0]['estado'];

                $objdoc = new stdClass();
                $objdoc->id = 1;
                $objdoc->text = $info;
                $objdoc->estado = $estadodoc;
                $objdoc->iddoc = -1;
                $objdoc->hijos = array();
            }

            /*DATOS DEL PEDIDO*/
            $pedido = $this->model->datosPedido($this->uiParams['node']);
            $infoped = 'P - #' . $pedido[0]['nrodoc'] . '<br/>';
            if($docorigen == 1){
                $infoped .= 'FCR: '.$pedido[0]['fechacreacion'].'-'.$this->model->restFechas($pedido[0]['fechacreacion'], $documentoorigen[0]['fechaaprobado'])->days.'<br/>';
                $fechaini = $documentoorigen[0]['fechacreacion'];
            }else{
                $infoped .= 'FCR: '.$pedido[0]['fechacreacion'].'<br/>';
                $fechaini = $pedido[0]['fechacreacion'];
            }
            $infoped .= 'FC: '.$pedido[0]['fechaconfirmado'].'-'.$this->model->restFechas($pedido[0]['fechaconfirmado'], $pedido[0]['fechacreacion'])->days.'<br/>';
            $infoped .= 'FA: '.$pedido[0]['fechaaprobado'].'-'.$this->model->restFechas($pedido[0]['fechaaprobado'], $pedido[0]['fechaconfirmado'])->days.'<br/>';
            $fechafin = $pedido[0]['fechaaprobado'];
            $agenciaped = ZendExt_IoC::getInstance()->metadatos->DameEstructura($pedido[0]['idestructuracomun']);
            $infoped .= 'A: '.$agenciaped[0]->denominacion.'<br/>';
            $estadoped = $pedido[0]['estado'];
            
            $objped = new stdClass();
            $objped->id = 2;
            $objped->text = $infoped;
            $objped->estado = $estadoped;
            $objped->iddoc = $this->uiParams['node'];
            $objped->hijos = array();
            if($docorigen == 1)
                $objdoc->hijos[0] = $objped;

            /*DATOS DEL BALANCEO DE PEDIDO*/
            $balanceo = $this->model->datosBalanceo($this->uiParams['node']);
            if(!empty($balanceo)) {
                $infobal = 'BP - #' . $balanceo[0]['nrodoc'] . '<br/>';
                $infobal .= 'FCR: ' . $balanceo[0]['fechacreacion'] . '-' . $this->model->restFechas($balanceo[0]['fechacreacion'], $pedido[0]['fechaaprobado'])->days . '<br/>';
                $infobal .= 'FC: ' . $balanceo[0]['fechaconfirmado'] . '-' . $this->model->restFechas($balanceo[0]['fechaconfirmado'], $balanceo[0]['fechacreacion'])->days . '<br/>';
                $infobal .= 'FA: ' . $balanceo[0]['fechaaprobado'] . '-' . $this->model->restFechas($balanceo[0]['fechaaprobado'], $balanceo[0]['fechaconfirmado'])->days . '<br/>';
                $fechafin = $balanceo[0]['fechaaprobado'];
                $agenciabal = ZendExt_IoC::getInstance()->metadatos->DameEstructura($balanceo[0]['idestructuracomun']);
                $infobal .= 'A: ' . $agenciabal[0]->denominacion . '<br/>';
                $estadobal = $balanceo[0]['estado'];

                $objbal = new stdClass();
                $objbal->id = 3;
                $objbal->text = $infobal;
                $objbal->estado = $estadobal;
                $objbal->iddoc = -1;
                $objbal->hijos = array();
                if(!empty($objbal))
                    $objped->hijos[0] = $objbal;
            }
                /*DATOS DE LA DISTRIBUCION DEL PEDIDO*/
            if(!empty($balanceo)) {
                $distribucion = $this->model->datosDistribucionPorBalanceo($balanceo[0]['iddocumento']);
                $fechaprobado = $balanceo[0]['fechaaprobado'];
            }else{
                $distribucion = $this->model->datosDistribucionPorPerdido($pedido[0]['iddocumento']);
                $fechaprobado = $pedido[0]['fechaaprobado'];
            }
                if(!empty($distribucion)){
                        foreach ($distribucion as $i => $dist){
                            if(!empty($dist['iddocumento'])){
                                $infodist = 'D - #' . $dist['nrodoc'] . '<br/>';
                                $infodist .= 'FCR: '.$dist['fechaconfirmado'].'-'.$this->model->restFechas($dist['fechaconfirmado'], $fechaprobado)->days.'<br/>';
                                $infodist .= 'FC: '.$dist['fechaconfirmado'].'-'.$this->model->restFechas($dist['fechaconfirmado'], $dist['fechaconfirmado'])->days.'<br/>';
                                $infodist .= 'FA: '.$dist['fechaaprobado'].'-'.$this->model->restFechas($dist['fechaaprobado'], $dist['fechaconfirmado'])->days.'<br/>';
                                $fechafin = $dist['fechaaprobado'];
                                $agenciadist = ZendExt_IoC::getInstance()->metadatos->DameEstructura($dist['idestructuracomun']);
                                $infodist .= 'A: '.$agenciadist[0]->denominacion.'<br/>';
                                $estadodist = $dist['estado'];

                                $objdist = new stdClass();
                                $objdist->id = 5;
                                $objdist->text = $infodist;
                                $objdist->estado = $estadodist;
                                $objdist->iddoc = $dist['iddocumento'];
                                $objdist->hijos = array();
                                if(!empty($objbal))
                                    array_push($objbal->hijos, $objdist);
                                else
                                    array_push($objped->hijos, $objdist);

                                /*DATOS DE LA TRANSFERENCIA DEL PEDIDO*/
                                $transferencia = $this->model->datosTransferenciaRecepcion($dist['iddocumento']);
                                if(!empty($transferencia)){
                                    foreach ($transferencia as $i => $transf){
                                        if(!empty($transf['iddocumento'])){
                                            $infotransf = 'T - #' . $transf['nrodoc'] . '<br/>';
                                            $infotransf .= 'FCR: '.$transf['fechaconfirmado'].'-'.$this->model->restFechas($transf['fechaconfirmado'], $dist['fechaaprobado'])->days.'<br/>';
                                            $infotransf .= 'FC: '.$transf['fechaconfirmado'].'-'.$this->model->restFechas($transf['fechaconfirmado'], $transf['fechaconfirmado'])->days.'<br/>';
                                            $infotransf .= 'FCO: '.$transf['fechacontabilizado'].'-'.$this->model->restFechas($transf['fechacontabilizado'], $transf['fechaconfirmado'])->days.'<br/>';
                                            $fechafin = $transf['fechacontabilizado'];
                                            $agenciadist = ZendExt_IoC::getInstance()->metadatos->DameEstructura($transf['idestructuracomun']);
                                            $infotransf .= 'A: '.$agenciadist[0]->denominacion.'<br/>';
                                            $estadotransf = $transf['estado'];

                                            $objtransf = new stdClass();
                                            $objtransf->id = 6;
                                            $objtransf->text = $infotransf;
                                            $objtransf->estado = $estadotransf;
                                            $objtransf->iddoc = -1;
                                            $objtransf->hijos = array();
                                            array_push($objdist->hijos, $objtransf);

                                            /*DATOS DE LA RECEPCION DEL PEDIDO*/
                                            $recepcion = $this->model->datosTransferenciaRecepcion($transf['iddocumento']);
                                            if(!empty($recepcion)){
                                                foreach ($recepcion as $i => $recep){
                                                    if(!empty($recep['iddocumento'])){
                                                        $inforecep = 'IR - #' . $recep['nrodoc'] . '<br/>';
                                                        $inforecep .= 'FCR: '.$recep['fechaconfirmado'].'-'.$this->model->restFechas($recep['fechaconfirmado'], $transf['fechacontabilizado'])->days.'<br/>';
                                                        $inforecep .= 'FC: '.$recep['fechaconfirmado'].'-'.$this->model->restFechas($recep['fechaconfirmado'], $recep['fechaconfirmado'])->days.'<br/>';
                                                        $inforecep .= 'FCO: '.$recep['fechacontabilizado'].'-'.$this->model->restFechas($recep['fechacontabilizado'], $recep['fechaconfirmado'])->days.'<br/>';
                                                        $fechafin = $recep['fechacontabilizado'];
                                                        $agenciarecep = ZendExt_IoC::getInstance()->metadatos->DameEstructura($recep['idestructuracomun']);
                                                        $inforecep .= 'A: '.$agenciarecep[0]->denominacion.'<br/>';
                                                        $estadorecep = $recep['estado'];

                                                        $objrecep = new stdClass();
                                                        $objrecep->id = 7;
                                                        $objrecep->text = $inforecep;
                                                        $objrecep->estado = $estadorecep;
                                                        $objrecep->iddoc = -1;
                                                        $objrecep->hijos = array();
                                                        array_push($objtransf->hijos, $objrecep);
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }

                        }
                }

            /*DATOS DE LA DEMANDA*/
            if(!empty($balanceo)) {
                $demanda = $this->model->datosDemanda($balanceo[0]['iddocumento']);
                if(!empty($demanda)){
                    foreach ($demanda as $i => $dem){
                        $infodem = 'DEM - #' . $dem['numero'] . '<br/>';
                        $infodem .= 'FCR: ' . $dem['fechacreada'] . '-' . $this->model->restFechas($dem['fechacreada'], $balanceo[0]['fechaaprobado'])->days . '<br/>';
                        $infodem .= 'EST: ' . $dem['nombre'].'-'. $dem['fechestado']. '-' . $this->model->restFechas($dem['fechestado'], $dem['fechacreada'])->days . '<br/>';
                        $fechafin = $dem['fechestado'];
                        $agenciadem = ZendExt_IoC::getInstance()->metadatos->DameEstructura($dem['idestructuracomun']);
                        $infodem .= 'A: ' . $agenciadem[0]->denominacion . '<br/>';

                        $objdem = new stdClass();
                        $objdem->id = 3;
                        $objdem->text = $infodem;
                        $objdem->iddoc = -1;
                        $objdem->hijos = array();
                        if(!empty($objbal))
                            array_push($objbal->hijos, $objdem);

                        /*DATOS DE LA SOLICITUD DE OFERTA*/
                        $solicitudoferta = $this->model->datosSolicitudOferta($dem['idsolicitud']);
                        if(!empty($solicitudoferta)){
                            foreach ($solicitudoferta as $i => $soloferta){
                                $infosoloferta = 'SOL-OF - #' . $soloferta['numero'] . '<br/>';
                                $infosoloferta .= 'FCR: ' . $soloferta['fechacreada'] . '-' . $this->model->restFechas($soloferta['fechacreada'], $dem['fechestado'])->days . '<br/>';
                                $infosoloferta .= 'EST: ' . $soloferta['nombre'].'-'. $soloferta['fechestado'] . '-' . $this->model->restFechas($soloferta['fechestado'], $soloferta['fechacreada'])->days . '<br/>';
                                $fechafin = $soloferta['fechestado'];
                                $agenciasoloferta = ZendExt_IoC::getInstance()->metadatos->DameEstructura($soloferta['idestructuracomun']);
                                $infosoloferta .= 'A: ' . $agenciasoloferta[0]->denominacion . '<br/>';

                                $objsoloferta = new stdClass();
                                $objsoloferta->id = 3;
                                $objsoloferta->text = $infosoloferta;
                                $objsoloferta->iddoc = -1;
                                $objsoloferta->hijos = array();
                                if(!empty($objdem))
                                    array_push($objdem->hijos, $objsoloferta);

                                /*DATOS DE LA OFERTA DE COMPRA*/
                                $ofertacompra = $this->model->datosOfertaCompra($soloferta['idsolicitud']);
                                if(!empty($ofertacompra)){
                                    foreach ($ofertacompra as $i => $ofertacomp){
                                        $infoofertacompra = 'OF-COMPRA - #' . $ofertacomp['numero'] . '<br/>';
                                        $infoofertacompra .= 'FCR: ' . $ofertacomp['fechainicio'] . '-' . $this->model->restFechas($ofertacomp['fechainicio'], $soloferta['fechestado'])->days . '<br/>';
                                        $infoofertacompra .= 'EST: ' . $ofertacomp['nombre'].'-'. $ofertacomp['fechestado'] . '-' . $this->model->restFechas($ofertacomp['fechestado'], $ofertacomp['fechainicio'])->days . '<br/>';
                                        $fechafin = $ofertacomp['fechestado'];
                                        $agenciaofertacompra = ZendExt_IoC::getInstance()->metadatos->DameEstructura($ofertacomp['idestructuracomun']);
                                        $infoofertacompra .= 'A: ' . $agenciaofertacompra[0]->denominacion . '<br/>';

                                        $objofertacompra = new stdClass();
                                        $objofertacompra->id = 3;
                                        $objofertacompra->text = $infoofertacompra;
                                        $objofertacompra->iddoc = -1;
                                        $objofertacompra->hijos = array();
                                        if(!empty($objsoloferta))
                                            array_push($objsoloferta->hijos, $objofertacompra);

                                        if(!empty($ofertacomp['idcontrato'])){
                                            $contrato = $this->model->datosContrato($ofertacomp['idoferta']);
                                            if(!empty($contrato)){
                                                foreach ($contrato as $i => $cont){
                                                    $infocontrato = 'CONTRATO - #' . $cont['numero'] . '<br/>';
                                                    $infocontrato .= 'FCR: ' . $cont['fechainicio'] . '-' . $this->model->restFechas($cont['fechainicio'], $ofertacomp['fechestado'])->days . '<br/>';
                                                    $infocontrato .= 'EST: ' . $cont['nombre'].'-'. $cont['fechestado'] . '-' . $this->model->restFechas($cont['fechestado'], $cont['fechainicio'])->days . '<br/>';
                                                    $fechafin = $cont['fechestado'];
                                                    $agenciacontrato = ZendExt_IoC::getInstance()->metadatos->DameEstructura($cont['idestructuracomun']);
                                                    $infocontrato .= 'A: ' . $agenciacontrato[0]->denominacion . '<br/>';

                                                    $objcontrato = new stdClass();
                                                    $objcontrato->id = 3;
                                                    $objcontrato->text = $infocontrato;
                                                    $objcontrato->iddoc = -1;
                                                    $objcontrato->hijos = array();
                                                    if(!empty($objofertacompra))
                                                        array_push($objofertacompra->hijos, $objcontrato);
                                                }
                                            }
                                        }

                                    }
                                }

                            }

                        }
                    }
                }
            }

            if($docorigen == 1)
                $arbol[0] = $objdoc;
            else
                $arbol[0] = $objped;

            $this->datos = $arbol;
            $this->cantdias = $this->model->restFechas($fechafin, $fechaini)->days;
            $this->objectHelper->synchronize($this, $arbol);
        }
    }

    public function cargarProductosAction()
    {
        $result = array();
        $result = $this->model->getProductosPedido($this->uiParams['iddoc']);
        if(!empty($result)){
            $this->datos = $result;
        }else{
            $result = $this->model->getProductosADistribuirPorBalanceo($this->uiParams['iddoc']);
            if(!empty($result)){
                $this->datos = $result;
            }else{
                $result = $this->model->getProductosADistribuirPorPedido($this->uiParams['iddoc']);
                if(!empty($result))
                    $this->datos = $result;
            }
        }
        $this->objectHelper->synchronize($this, $result);
    }

    public function exportarTrazabilidadAction()
    {
        $this->uiParams['iddocumentos'] = json_decode(stripcslashes($this->uiParams['iddocumentos']));
        $this->model->exportarTrazabilidad($this->uiParams['iddocumentos']);
    }

}
