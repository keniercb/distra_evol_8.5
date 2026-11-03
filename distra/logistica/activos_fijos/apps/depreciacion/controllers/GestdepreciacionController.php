<?php

/**
 * @author Jorge Luis Cuellar Mondeja
 * @date   : 23/11/2012
 */
if (!class_exists('BaseModel')) {
    $dir = Zend_Registry::getInstance()->get('config')->dir_aplication . '/logistica/utiles/comun/config.php';
    include_once $dir;
    set_include_path(get_include_path() . PATH_SEPARATOR . $config['include_path']);
}

class GestdepreciacionController extends BaseController
{

    private $_fechaContable, $_mComunAFT, $_mDepEntidad, $_sConfGeneral;

    public function init()
    {
        parent:: init('log.aft.registrodepresiacion');
        parent::init();

        $this->_mComunAFT = ComunAFTModel::getInstance();
        $this->_mDepEntidad = new DepreciarEntidadModel();

      /*  $cFechaContable = 'FechaContable';
        $this->fechaContable = $this->global->$cFechaContable->fecha;*/
        $this->_sConfGeneral = ServiciosConfiguracionGeneralHelper::__init();
        $this->_fechaContable = $this->_sConfGeneral->getFechaContableSubsistemaObj(
            $this->global->Estructura->idestructura, 11
        )->fecha;
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
        $this->view->uiVariables = array_merge(
            array(
                'alternativa' => $alternativa,
                'monedacontable' => "'" . "{$moneda['monedacontable']}" . "'",
                'nommonedacontable' => "'" . "{$moneda['nombremonedacontable']}" . "'",
                'monedaalternativa' => "'" . "{$moneda['monedaalternativa']}" . "'",
                'idestructura' => "'" . "{$this->global->Estructura->idestructura}" . "'",
                'nommonedaalternativa' => "'" . "{$moneda['nombremonedaalternativa']}" . "'"
            ), $this->view->uiVariables
        );
    }

    public function gestdepreciacionAction()
    {
        $this->autoShow = false;
        $this->controllerConfig = 'log';
        $this->prepareView();
        $this->initComponent('log.aft.gestdepreciacion');
        $this->renderTemplate();
    }

    /**
     * Carga la configuración inicial del componente
     */
    public function cargarconfiguracionAction()
    {

        $sConfActivos = new ConfiguracionActivosService();
        $confEntidad = $sConfActivos->getConfiguracionPG($this->global->Estructura->idestructura);
        if ($confEntidad[0]['depreciacion']) {
            $this->periodo = $this->_fechaContable;
			
			$this->metodos = $this->_mDepEntidad->getMetodosDepreciacion(
                $this->_fechaContable, $this->global->Estructura->idestructura, $confEntidad
            );
            $this->fechamostrar = $this->_fechaContable;
            $this->data = $this->_mDepEntidad->getVerificarExistenciaDoc($this->_fechaContable);
        } else {
            $this->entidadnodeprecia = true;
        }
        

    }

    /**
     * Funcionalidad para saber cuales son los métodos que están siendo usados por registros numéricos asociados
     * a la entidad
     */
    // Este metodo ya no se esta usando desde la vista (Adrian)
    public function getmetodosentidadAction()
    {
        $this->datos = $this->_mDepEntidad->getMetodosDepreciacion(
            $this->_fechaContable, $this->global->Estructura->idestructura
        );
    }

    /**
     * Función que verifica si se ha creado un documento de depreciación para la fecha contable actual de la entidad,
     * en caso de que exista carga los datos sino, lo crea e igual carga los datos correspondientes a la fecha.
     */
    public function getdatosAction()
    {
        if (!$this->uiParams['idmetodo']) {
            throw new ZendExt_Exception('LOG_AFT_DEP_001');
        }

        $docCreado = $this->_mDepEntidad->getVerificarExistenciaDoc($this->_fechaContable);
        
        if ($this->uiParams['name'] == '' && $this->uiParams['buscar'] != 'buscar') {
            $this->estado = $docCreado[0]['estado'];
        }

        $modelo = DepreciacionModelFactory::getInstance($this->uiParams['idmetodo']);
		
        $params = $this->uiParams;
        if ($this->uiParams['denominacion']) {
            $params['denominacionInd'] = $this->uiParams['denominacion'];
            unset($params['denominacion']);
        }
        if ($this->_request->getPost('filter')) {
            $params = $this->_request->getPost();
            $params['filter'] = json_decode($this->_request->getPost('filter'));
            $params['start'] = ($params['start']) ? $params['start'] : 0;
            $params['limit'] = ($params['limit']) ? $params['limit'] : 30;
        } else {
            $params = $this->uiParams;
        }

        $identifMedio = Array();
        $modelConfInd = new ConfiguracionidentificadormedioModel();
		
        $datos = $modelo->getRegNumericosDepreciar($this->_fechaContable, $params);
        
        if($datos['error'] == true){
            $this->error = $datos['errMsg'];
            return;
        }

        $conf = new ConfiguracionActivosService();
        $cEstructura = 'Estructura';
        $idestructura = ZendExt_GlobalConcept::getInstance()->$cEstructura->idestructura;
        $cfg = $conf->getConfiguracionPG($idestructura);
		
		$totalDepreciacion = 0;
		$totalDepreciacionAlt = 0;
		
        foreach ($datos['datos'] as &$dat) {

            if (!$identifMedio[$dat['id']]) {
                $atri = $modelConfInd->devolverIndicadoresIdCampo($dat['id'])[0];
                $identifMedio[$atri['idindicador']] = $atri;
            } else {
                $atri = $identifMedio[$dat['id']];
            }
            if ($this->uiParams['idmetodo'] == 1) {
                $dat['cantidadrecursoconsumido'] = $dat['cantidadrecursoconsumido'] +
                    $dat['cantidadrecursoconsumidoLectura'];
            } else {
                $dat['cantidadrecursoconsumido'] = $dat['cantidadrecursoconsumido'] + $dat['recursoconsumido'];
            }

            $dat['denomidmedio'] = ($dat[$atri['identificador']]) ? "<b>".$atri['denominacion'] . ":</b> "
                . $dat[$atri['identificador']] : null;
            $dat['nroinventario'] = $cfg[0]['prefijo'] . $dat['nroinventario'];
			$totalDepreciacion = $totalDepreciacion + $dat['depreciacion'];
			$totalDepreciacionAlt = $totalDepreciacionAlt + $dat['depreciacioncuc'];
        }
		if(count($datos['datos']) > 0){
			$datos['datos'][0]['totaldepreciacion'] = $totalDepreciacion;
			$datos['datos'][0]['totaldepreciacionalt'] = $totalDepreciacionAlt;
		}
		
        $this->objectHelper->synchronize(
            $this, $datos
        );
    }

    /**
     * Depreciar según el tipo de método de depreciación
     */
    public function getdepreciarmedioAction()
    {
        try {

            ini_set('memory_limit', '1024M');
            
            // Si hay documentos en elaboracion o preparado aborto la depreciacion
            $classEstructura = 'Estructura';
            $idEstructuraGlobal = ZendExt_GlobalConcept::getInstance()->$classEstructura->idestructura;
            $sql = "select count(d.iddocumento) as cantidad
                    from mod_logistica.dat_documento d
                    inner join mod_logactivofijotangible.dat_documentoactivo da on da.iddocumentoactivo = d.iddocumento
                    inner join mod_datosmaestros.dat_documentoprim docprim on d.iddoc = docprim.iddoc
                    inner join mod_datosmaestros.dat_estructurasubsist subsist on subsist.idestructurasubsist = docprim.idestructurasubsist
                    where 
                        subsist.idestructuracomun = {$idEstructuraGlobal}
                        and subsist.idsubsistema = 11
                        and d.estado in (1,2)";
                $conn = Zend_Registry::get('conexion');
                $cant = $conn->execute($sql)->fetchAll(PDO::FETCH_COLUMN);
            
            if($cant[0] > 0) {
                throw new ZendExt_Exception('LOG_AFT_DOCS_SIN_APROBAR');
            }

			if ($this->uiParams['todos']) {
                $modelo = DepreciacionModelFactory::getInstance($this->uiParams['idmetodo']);
                unset($this->uiParams['limit']);
                unset($this->uiParams['start']);
                unset($this->uiParams['todos']);

                $modeloreturn = $modelo->depreciarRegNumByDataNew(false, $this->_fechaContable);
                //$modelo->auxDepreciarRegistros(LogisticaObjectHelper::__init()->extractValueFromArrayColumn($arrIdeRegNumericos['datos'], 'idregnumerico'));
            } else { 
                $modelo = DepreciacionModelFactory::getInstance($this->uiParams['idmetodo']);

                $arrIdeRegNumericos = json_decode(stripslashes($this->uiParams['arrData']));
                $modeloreturn = $modelo->depreciarRegNumByArrIdes($arrIdeRegNumericos, $this->_fechaContable);
                $modelo->auxDepreciarRegistros($arrIdeRegNumericos);
            }
            if ($modeloreturn == 4) {
                $this->msg = 4;
            } else {
                $this->msg = 1;
            }
        } 
		/*catch (Exception $e){
				print_r($e->getMessage());die;
        }*/
        
		catch (ZendExt_Exeption $e) {
            $this->msg = 3;
            $this->error = $e->getMessage();
        }
    }

    public function depreciartodosAction()
    {
        try {
            ini_set('memory_limit', '1024M');
            
            // Si hay documentos en elaboracion o preparado aborto la depreciacion
            $classEstructura = 'Estructura';
            $idEstructura = ZendExt_GlobalConcept::getInstance()->$classEstructura->idestructura;
            $this->_mDepEntidad->validarExistenciaDocsSinAprobar($idEstructura);
            
            // Validar activos pendientes a recepcionar
            if(!$this->_mDepEntidad->validarActivosPendientesRecepcionar($idEstructura)){
                $this->errorCode = 'VAL_AFT_PENDIENTES';
                return;
            }
            // Solo se puede depreciar el ultimo dia del mes
            $idPeriodoActual = $this->_sConfGeneral->getPeriodoActualSubsistema($idEstructura, 11, null);
            if(!$this->_mDepEntidad->validarDepreciacionUltimoDia($this->_fechaContable, $idPeriodoActual)){
                $this->errorCode = 'VAL_ULTIMO_DIA';
                return;
            }
            // Validar para depreciar una solva vez al mes
            if(!$this->_mDepEntidad->validarExistenciaDepreciacion($idEstructura, $idPeriodoActual)){
                $this->errorCode = 'VAL_DEP_EXIST';
                return;
            }

            $sConfActivos = new ConfiguracionActivosService();
            $confEntidad = $sConfActivos->getConfiguracionPG($idEstructura);
            if(!$confEntidad[0]['depreciacion']){
                $this->errorCode = 'VAL_NO_CONF';
                return;
            }
            $metodos = $this->_mDepEntidad->getMetodosDepreciacion(
                $this->_fechaContable, $this->global->Estructura->idestructura, $confEntidad
            );
            if(count($metodos) > 0){
                $depEntidadModel = new DepreciarEntidadModel();
                $documento = $depEntidadModel->getDocDepreciacion($this->_fechaContable);
                $mDocDepreciacion = new DocDepreciacionModel();
                $mDocDepreciacion->aprobarDocDepreciacion($documento->iddocumento);

                foreach ($metodos as $key => $value) {
                    $depModelo = DepreciacionModelFactory::getInstance($value['idmetodo']);
                    $this->codMsg = $modeloreturn = $depModelo->depreciar($documento->iddocumento);
                }
                $mDocDepreciacion->establecerCronologia($documento->iddocumento, true);

            }
        } 
		catch (ZendExt_Exeption $e) {
            $this->codMsg = 3;
            $this->error = $e->getMessage();
        }
    }
}
