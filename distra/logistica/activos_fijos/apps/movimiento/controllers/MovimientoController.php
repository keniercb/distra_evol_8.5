<?php

/**
 *
 */
if (!class_exists('BaseModel')) {
    $dir = Zend_Registry::getInstance()->get('config')->dir_aplication.'/logistica/utiles/comun/config.php';
    include_once $dir;
    set_include_path(get_include_path().PATH_SEPARATOR.$config['include_path']);
}

class MovimientoController extends BaseController
{
    protected $_mMovActivoFijo;
    protected $_sEstrComposicion;
    protected $_sDatMaestros;
    protected $_sConfGeneral;
    private $mComunAFT;

    /**
     *
     */
    function init()
    {

        parent:: init('log.aft.movimiento');
        $this->_mMovActivoFijo = new MovimientoActivoFijoModel();
        $this->_sEstrComposicion = ServiciosEstructuraComposicionHelper::__init();
        $this->_sDatMaestros = DatosMaestrosHelper::__init();
        $this->_sConfGeneral = ServiciosConfiguracionGeneralHelper::__init();
        $this->mComunAFT = ComunAFTModel::getInstance();
        /*$configServ = new ConfiguracionActivosService();
        $result = $configServ->getConfiguracionPG($this->global->Estructura->idestructura);
        if ($this->objectHelper->getBooleanStr($result[0]['contabilidad']) &&
            $this->configuracionHelper->subsistemaAperturado(
                $this->global->Estructura->idestructura, LogisticaGlobal::SUBSISTEMA_AFT
            ) == 0
        ) {
            $cargaInicial = 1;
        } else {
            $cargaInicial = 0;
        }

        $this->view->uiVariables = array_merge(
            array('cargaInicial' => $cargaInicial), $this->view->uiVariables
        );*/
    }

    /**
     *
     */
    public function movimientoAction()
    {
        $this->autoShow = false;
        $this->controllerConfig = 'log';
        $this->prepareView();

        $this->initComponent('log.aft.movimiento');
        $this->renderTemplate();
    }

    public function cargardatosmovimientosAction(){
        $monedas = $this->configuracionHelper->monedaContableEntidad($this->global->Estructura->idestructura);
        $alternativa = 0;
        $moneda = array();
        foreach ($monedas['datos'] as $value) {
            if ($value['dualidad'] == 1) {
                $alternativa = 1;
                $moneda['monedaalternativa'] = $value['idmoneda'];
                $moneda['nombremonedaalternativa'] = $value['codigoiso'];
            } else {
                $moneda['monedacontable'] = $value['idmoneda'];
                $moneda['nombremonedacontable'] = $value['codigoiso'];
            }
        }

        $cEstructura = 'Estructura';
        $idestructura = $this->global->$cEstructura->idestructura;        
        if($this->uiParams['tipo'] == 1){
            $cfgparametroG = Doctrine::getTable('CfgParametrosGeneralesPatr')->find($idestructura);
        }else{
            $cfgparametroG = Doctrine::getTable('CfgParametrosGenerales')->find($idestructura);
        }
        $autogenerado = ($cfgparametroG->autogenerado) ? $cfgparametroG->autogenerado : 0;
        $this->datos = array(
            'alternativa' => $alternativa,
            'monedacontable' => "'"."{$moneda['monedacontable']}"."'",
            'nommonedacontable' => "'"."{$moneda['nombremonedacontable']}"."'",
            'monedaalternativa' => "'"."{$moneda['monedaalternativa']}"."'",
            'nommonedaalternativa' => "'"."{$moneda['nombremonedaalternativa']}"."'",
            'autogenerado' => $autogenerado
        );
    }

    /**
     *
     */
    public function cargargruposAction()
    {
        ComunAFTModel::getInstance()->configStartAndLimitInParams(
            $this->uiParams, $this->uiParams['start'], $this->uiParams['limit']
        );
        $maestroProd = new MaestroProductoService();
        $datos = $maestroProd->obtenerGruposHojas($this->uiParams);        
        $this->datos = $datos['data'];
        $this->total = $datos['total'];
    }

    /**
     *
     */
    public function cargarproductosAction()
    {
        if (($this->uiParams['inventarioParcialMensual'] ||
            $this->uiParams['inventarioTotal'] ) && $this->uiParams['elaboracion']) {
            $productos = self::getRegInventarioParcial($this->uiParams);
            $verificarProd = 2;
            $this->uiParams['productos'] = $productos;
            $this->uiParams['idestructura'] = json_decode($this->uiParams['idestructura']);
        }

        if (!$this->uiParams['start']) {
            $this->uiParams['start'] = 0;
        }

        if (!$this->uiParams['limit']) {
            $this->uiParams['limit'] = 30;
        }
        
       // print_r($productos);die;
        
        $datos = ($verificarProd == 2 && !$productos)? array(): $this->_mMovActivoFijo->getDatos($this->uiParams);



        $guardado = $this->_mMovActivoFijo->verificarguardado($this->uiParams);
        $datos['guardados'] = $guardado;

        if ($this->uiParams['inventarioTotal'] || $this->uiParams['inventarioParcial']) {

            foreach ($datos['datos'] as &$value) {
                $estructura = $this->_sEstrComposicion->getAreasPorId($value['idestructura']);
                $value['area'] = ($estructura[0]['denominacion']) ?
                    $estructura[0]['denominacion'] : $estructura[0]['text'];
                unset($value['id']);
            }
        }

        if ($this->uiParams['iddocumento']) {
            $activosEnDocumento = $this->_mMovActivoFijo->getArrActivosEnDoc(
                $this->uiParams['iddocumento']
            );
        }

        $this->indicadoresNoMostrar = $activosEnDocumento;
        $this->objectHelper->synchronize($this, $datos);
    }

    /**
     *
     */
    public function getRegInventarioParcial($parametros)
    {
        if ($parametros['idareasInventario']) {
            $idsAreas = preg_split("/[,]+/", $parametros['idareasInventario']);
        } else {
            $idsAreas = array();
        }

        // Si el inventario es para utiles y herramientas, se pone $parametros['utiles'] = true
        $documento = $this->_mMovActivoFijo->getDocumento($parametros['iddocumento']);
        $tipoOp = ComunAFTModel::getInstance()->getOperacionSobreMediosById($documento->idoperacion);
        $codigoOp = $tipoOp->codigooperacion;
        $parametros['utiles'] = false;
        if(strpos($codigoOp, '_UH')){
            $parametros['utiles'] = true;
        }
        //$parametros['inventarioTotal'] = $codigoOp;
        $parametros['codigoOperInv'] = $codigoOp;

        $parametros['SInventario'] = $idsAreas;

        if ($parametros['inventarioParcialMensual']) {

            $idEjercActual = $documento->idejercicio;
            $parametros['idejercicio'] = $idEjercActual;
            $arrRegNumericos = $this->_mMovActivoFijo->getMediosNaturalezasInventario(
                $parametros
            );
            $idest = ($codigoOp == 'OPER_INV_TOTAL' || $codigoOp == 'OPER_INV_TOTAL_UH') ?
                $this->global->Estructura->idestructura : json_decode($parametros['idestructura'])[0];


            $arrFechaContable = preg_split("/[\/\-]+/", $documento->fechacontable);

            $objDatPlanConteoMes = new DatPlanconteom();
            $planPeriodo = $objDatPlanConteoMes->obtenerPorCientoMes(
                $idEjercActual, $idest,  $arrFechaContable[1]
            );

            if (!$planPeriodo[0]) {
                throw new ZendExt_Exception('LOG_AFT_DOC_011');
            }

            $porciento = $planPeriodo[0]['porciento'];

            $totalReg = count($arrRegNumericos);
            $indicePorciento = round(($totalReg * $porciento) / 100);

            ($indicePorciento == 0) ? $indicePorciento = 1 : '';
            $enviar = Array();

            foreach ($arrRegNumericos as $value) {
                if(!$value['enuso'] && count($enviar) < $indicePorciento){
                    if (!in_array($value['idproducto'], $enviar)) {
                        $enviar[] = $value['idproducto'];
                        $imprime["entra_eviar"] = "SI";
                    }
                }
            }

            return $enviar;
        } else {

            $arrRegNumericos = $this->_mMovActivoFijo->getMediosNaturalezasInventario(
                $parametros
            );
            $enviar = LogisticaObjectHelper::__init()
                ->extractValueFromArrayColumn($arrRegNumericos, 'idproducto');
            return $enviar;
        }
    }

    /**
     *
     */
    public function salvarproductosAction()
    {
        if ($this->uiParams['inventario']) {

            $this->uiParams['medios'] = json_decode(stripcslashes($this->uiParams['medios']));
            

            $documento = $this->_mMovActivoFijo->getDocumento($this->uiParams['iddocumento']);
            $tipoOp = ComunAFTModel::getInstance()->getOperacionSobreMediosById($documento->idoperacion);
            
            if($tipoOp->codigooperacion == 'OPER_INV_TOTAL' || $tipoOp->codigooperacion == 'OPER_INV_TOTAL_UH'){
            
                $productos = self::getRegInventarioParcial($this->uiParams);
                $medios = array_unique($productos);
                
                $newmedios = [];
                foreach ($medios as $key => $value) {
                    //$aux = (object)["idproducto" => $value, "cantidad" => 0];
                    $aux = array("idproducto" => $value, "cantidad" => 0);
                    $aux = (object)$aux;
                    array_push($newmedios, $aux);
                }

                $this->uiParams['medios'] = $newmedios;
            }
            

//            $this->uiParams['confirmar'] = true;
            $params = $this->uiParams;
//             $params['productosContar'] = self::getRegInventarioParcial($this->uiParams);

            $vcar = $this->_mMovActivoFijo->adicionarProductosConfirmar($params);
            $this->success = true;
            $this->idestado = 2;
            $this->estado = 'Preparado';
//            echo json_encode(array('succes'=>true, 'idestado'=>2, 'estado'=>'Preparado'));
        } else {
            $arrIdesProductos = json_decode(stripcslashes($this->uiParams['datos']));

            $this->_mMovActivoFijo->adicionarProductos(
                $this->uiParams['idarearesp'], $arrIdesProductos, $this->uiParams['iddocumento'],
                $this->uiParams['idoperacion']
            );

            $this->success = true;
        }
    }
    public function BalanceContableAction()
    {
        $parametros = $this->uiParams;
        $this->_mMovActivoFijo->getDatosBalanceContable($parametros);
    }

    public function modificarProductosAction() 
    {
        $this->uiParams['datos'] = (array)Zend_Json::decode($this->uiParams['datos']);
        $this->_mMovActivoFijo->modificarProducto($this->uiParams['datos']);
        $this->success = true;
    }

    /**
     *
     */
    public function eliminarproductosAction()
    {
        //try {
            $this->uiParams['idmovimiento'] = json_decode(stripcslashes($this->uiParams['idmovimiento']));
            $this->_mMovActivoFijo->eliminarProductoDoc($this->uiParams['idmovimiento']);
            $this->success = true;
        /*} catch (Doctrine_Exception $e) {
            $this->success = false;
            $this->failure = true;
            $this->error = $e->getMessage();
        }*/
    }

    /**
     *
     */
    public function modificarcantidadAction()
    {
        try {
            $parametros = json_decode($this->uiParams['datos']);
            $response = $this->_mMovActivoFijo->modificarCantidad($parametros);

            if ($response) {
                $this->success = true;
            } else {
                $this->failure = true;
            }
        } catch (Exception $e) {

            $this->failure = true;
            $this->error = $e->getMessage();
        }
    }

    /**
     * Método para cargar los datos desde un fichero excel
     *
     * return array
     */
    public function importarDatosAction()
    {
        $mImportar = new ImportMovActivoFijoModel();
        $dirFile = $_FILES['fichero']['tmp_name'];

        if (file_exists($dirFile)) {

            $datos = $mImportar->importarExcel($dirFile);

            $this->success = true;
            $this->total = count($datos);
            $this->datos = $datos;
        } else {
            $this->message = 'No se encuentra el fichero a importar.';
        }
    }

    /**
     *
     */
    public function validarExcelAction()
    {
        $mImportar = new ImportMovActivoFijoModel();

        $this->uiParams['datos'] = json_decode($this->uiParams['datos']);
        $this->uiParams['idestructura'] = $this->global->Estructura->idestructura;
		ini_set('memory_limit', '512M');
        $datos = $mImportar->concatenarDatosExcel($this->uiParams);


        $this->success = true;
        $this->total = count($datos);
        $this->datos = $datos[0];
        $this->marcas = $datos[1]['datos'];
        $this->modelos = $datos[2]['datos'];
        $this->colores = $datos[3];
        $this->actividades = $datos[4];
        $this->categorias = $datos[5];
        $this->estados = $datos[6];
        $this->categorias = $datos[7]['datos'];
        $this->combustible = $datos[8];
        $this->indicadores = $datos[9]['datos'];
    }

    /**
     *
     */
    public function insertarDatosAction()
    {
        //try {
        $datos['datos'] = json_decode($this->uiParams['datos']);

        $mImportar = new ImportMovActivoFijoModel();
        $respuesta = $mImportar->insertFromExelData(
            $datos, $this->uiParams['idarearesp'], $this->uiParams['iddocumento'], $this->uiParams['idcentrocosto']
        );

        if (is_array($respuesta)) {
            $this->objectHelper->synchronize($this, $respuesta);
        } else {

            $this->cod = $respuesta;
        }
        /* } catch (Exception $e) {

          if ($e->getCode() == 23505) {
          try {
          $mImportar->clearTempImport();

          echo json_encode(array("cod" => 7, "info" => $e->getMessage()));
          } catch (Exception $e) {
          echo json_encode(array("cod" => 7, "info" => $e->getMessage()));
          }
          } else {
          try {
          $mImportar->clearTempImport();
          $this->cod = 3;
          $this->info = $e->getMessage();

          } catch (Exception $e) {
          $this->cod = 3;
          $this->info = $e->getMessage();
          }
          }
          } */
    }

    /**
     *
     */
    public function cargarModelosAction()
    {
        $parametros['idpadre'] = $this->uiParams['idpadre'];

        if ($parametros['idpadre']) {

            $datos = $this->_sConfGeneral->obtenerModelos($parametros);
            $this->objectHelper->synchronize($this, $datos);
        }
    }

    /**
     *
     */
    public function cargarProductosPorMarcamodeloAction()
    {
        $respuesta = array();
        $datos = $this->_mMovActivoFijo->getIndicadorByMarcaModelo(
            $this->uiParams['idmarca'], $this->uiParams['idmodelo']
        );


        if (count($datos)) {
            $respuesta = $datos[0];
            $respuesta['tipomedio'] = ($respuesta['denominacion']) ?
                $respuesta['denominacion']." ".$respuesta['descripcionmarcamodelo'] :
                $respuesta['descripcionmarcamodelo'];
        }

        $this->datos = $respuesta;
    }

    public function validarCamposIntegracionInvAction()
    {
        $arrDatMovGrid = json_decode(stripcslashes($this->uiParams['arrDatMovGrid']));
        foreach ($arrDatMovGrid as &$value)
            settype($value, 'Array');
        $parametros['idestructurapadre'] = $this->uiParams['idestructurapadre'];
        $parametros['idoperacion'] = $this->uiParams['idoperacion'];
        $parametros['tipo_interfaz'] = $this->uiParams['tipo_interfaz'];
        $datosColumnas = $this->_mMovActivoFijo->obtenerColumnasEditables($arrDatMovGrid, $parametros);
        $this->datos = $datosColumnas;
    }

    public function cargarGridClasificadorAction()
    {
        $parametros = $this->uiParams;
        $parametros['idnaturalezaexcluir']= json_decode(
            stripslashes($this->_request->getPost('idnaturalezaexcluir'))
        );
        $datos = $this->_mMovActivoFijo->cargarGridClasificador($parametros);
        $this->datos = $datos[0];
        $this->cantidad = $datos[1];
    }

    public function cargarProductosSqlAction(){
        $mImportar = new ImportMovActivoFijoModel();
        $resp = $mImportar->obtenerIndicadoresSql($this->uiParams);
        $this->datos = $resp['datos'];
        $this->total = $resp['total'];
    }
    
    public function cargadisponiblesAction()
    {
        $parametros = $this->uiParams;
        $parametros['idnaturalezaexcluir']= json_decode(
            stripslashes($this->_request->getPost('idnaturalezaexcluir'))
        );
        $mRegNumActivo = new RegNumericoActivoModel();        
        $this->objectHelper->synchronize($this, $mRegNumActivo->getRegistrosDisponibles($parametros));
    }
    
    public function getNaturalezaAction()
    {
        $parametros = new stdClass();

        ComunAFTModel::getInstance()->configStartAndLimitInParams(
            $parametros,
            $this->_request->getPost('start'),
            $this->_request->getPost('limit')
        );
        
        
        $integrator = ZendExt_IoC::getInstance();
        $naturalezas = $integrator->datosmaestros->getNaturalezas(new Doctrine_Query());
        
        $this->datos = $naturalezas;
        $this->cantidad = count($naturalezas);
        $this->total = count($naturalezas);
        //echo json_encode($datos);
    }
    
    public function addRegistrosMovimientosAction(){
        try{
            $params = $this->uiParams;
            if (!isset($params['addAll'])) {
                $params['idregistros'] = json_decode(stripcslashes($params['idregistros']));

                $this->_mMovActivoFijo->addRegistrosMovimientos($params['idregistros'], $params['iddocumento'], $params['idoperacion']);
            } else {
                $this->_mMovActivoFijo->addAllRegistrosMovimientos($params['iddocumento'], $params['idoperacion'], $params);
            }
            $this->success = true;
        }catch (Exception $exc){
            throw $exc;
        }

    }

    public function ContarTodosSinDiferenciasAction() {
      try{

        $iddocumento = $this->uiParams['iddocumento'];

        $rnService = new RegNumActivoService();
        $rnService->ContarTodosSinDiferencias($iddocumento);
        $this->success = true;
      } catch(Exception $exc){
        $this->success = false;
        //print_r($exc);
      }
    }
}
