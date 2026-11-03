<?php

/**
 * @class     SubmayorController
 * Clase que se encarga de manejar las acciones
 * para las recuperaciones del submayor de activos.
 * @namespace Logistica\Activos fijos\Recuperaciones\Controllers
 * @author    Divisiçon de Gestiçon de Entidades
 * @copyright XETID
 * @version   2.0
 */
if (!class_exists('BaseModel')) {
    $dir = Zend_Registry::getInstance()->get('config')->dir_aplication . '/logistica/utiles/comun/config.php';
    include_once $dir;
    set_include_path(get_include_path() . PATH_SEPARATOR . $config['include_path']);
}

class Submayorv2Controller extends BaseController
{

    private $mSubMayor, $serviciosCfg, $idnatObjObra, $idnatINMUEBLE, $idnatUTIHERR, $serviciosEyC;

    public function init($dir = 'log.aft.submayor_v2')
    {
        parent::init($dir);

        /* parent::init();
          $dirApps = Zend_Registry::getInstance()->config->dir_aplication;
          $dirPhtml = $dirApps . '/logistica/utiles/reporte/views/script/reporte/reporte.phtml';
          $js = file_get_contents($dirPhtml);
          $this->serviciosAyuda = ServiciosAyudaHelper::__init();
          $this->view->arrayJs = array($this->serviciosAyuda->getJSAyuda(),
          $this->serviciosCfg->getJSAtributosDinamicos(),
          $js);
          $this->areaSeleccionada = $this->global->Estructura->idestructura; */

        $this->serviciosCfg = ServiciosConfiguracionGeneralHelper::__init();
        $this->serviciosEyC = ServiciosEstructuraComposicionHelper::__init();
        $monedas = $this->configuracionHelper->monedaContableEntidad($this->global->Estructura->idestructura);
        $recupModel = new RecuperacionesModel();
        $this->mSubMayor = new Submayorv2Model();

        $this->idnatObjObra = IntegracionNomencladoresModel::NATURALEZA_OBJETODEOBRA;
        $this->idnatINMUEBLE = IntegracionNomencladoresModel::NATURALEZA_INMUEBLE;
        $this->idnatUTIHERR = IntegracionNomencladoresModel::NATURALEZA_HERRAMIENTA;
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
        $estructura = $this->serviciosEyC->getEstructura($this->global->Estructura->idestructura);

        $this->view->uiVariables = array_merge(
            array(
                'naturalezaPPA' => IntegracionNomencladoresModel::NATURALEZA_PPA,
                'alternativa' => $alternativa,
                'monedacontable' => "'" . "{$moneda['monedacontable']}" . "'",
                'nommonedacontable' => "'" . "{$moneda['nombremonedacontable']}" . "'",
                'monedaalternativa' => "'" . "{$moneda['monedaalternativa']}" . "'",
                'idNatObjObra' => "'" . "{$this->idnatObjObra}" . "'",
                'idNatInmueble' => "'" . "{$this->idnatINMUEBLE}" . "'",
                'idnatUTIHERR' => "'" . "{$this->idnatUTIHERR}" . "'",
                'idEntiadPadre' => $recupModel->getEstructuraPadre(),
                'denomestructuracomun' => "'" . "{$estructura[0]->text}" . "'",
                'nommonedaalternativa' => "'" . "{$moneda['nombremonedaalternativa']}" . "'"
            ), $this->view->uiVariables
        );

        $this->view->arrayJs = array(
            $this->serviciosCfg->getJSAtributosDinamicos(),
            '</script><script type="text/javascript"
            src="/pvd/comun/views/js/buscarpersonacomp/buscarpersonacomp.js"></script>'
        );


        //$this->idnatActivos = IntegracionNomencladoresModel::NATURALEZA_ACTIVOS;
    }

    public function submayorv2Action()
    {
        $this->autoShow = false;
        $this->controllerConfig = 'log';
        $this->prepareView();
        $this->initComponent('log.aft.submayor_v2');
        $this->renderTemplate();

    }

    /**
     * Cargar los datos de la entidad en la cual se encuentra el usuario
     */
    public function getentidadAction()
    {
        $estructura = 'Estructura';
        $ent = $this->integrator->metadatos->DameEstructura($this->global->$estructura->idestructura);
        $this->entidad = $ent[0]->denominacion;
        $this->identidad = $ent[0]->idestructura;
    }

    /*
     * Muesta los medios en explotacion con las existencias
     */

    public function getconteoAction()
    {
        $arrIdesAreas = json_decode(stripslashes($this->_request->getPost('arrIdEstructuras')));
        ini_set('memory_limit', '2048M');
        if ($this->uiParams['filtroespecialidad']) {
            $this->uiParams['idespecialidad'] = $this->global->Estructura->idespecialidad;
        }
        $this->uiParams['tipo'] = 0;
        $this->uiParams['idnaturalezaNotIn'] = array(
            $this->idnatObjObra, $this->idnatINMUEBLE/*, $this->idnatActivos*/
        );
        $estructura = 'Estructura';
        if (!is_array($arrIdesAreas)) {
            $arrIdesAreas = ZendExt_GlobalConcept::getInstance()->$estructura->idestructura;
        }

        $parametros = json_decode($this->_request->getPost('filter'));

        $this->uiParams = $this->mSubMayor->configureParams($parametros, $this->uiParams);
        if (!$this->uiParams['salidas'] || $this->uiParams['salidas'] != 2) {            // OK
            $datos = $this->mSubMayor->getConteoEntidad(
                $this->uiParams['start'], $this->uiParams['limit'], $this->uiParams, $arrIdesAreas
            );


        } else {
            // Falta
            $datos = $this->mSubMayor->GetConteoEntidadSalidas(
                $this->uiParams['start'], $this->uiParams['limit'], $this->uiParams, $arrIdesAreas
            );


        }

        $datosEnviar = $datos['datos'];
        $this->datos = $datosEnviar;
        $this->cantidad = $datos['cantidad'];
        $this->cantidadTotal = $datos['cantidadTotal'];
    }

    /**
     * Mostrar los números de serie de una nomenclatura determinada
     */
    public function getregistronumericoAction()
    {
        $parametros = $this->_request->getPost();
        /*$parametros['idnaturaleza'] = array($this->idnatObjObra,
            $this->idnatINMUEBLE, $this->idnatActivos
        );*/
        $params = json_decode($parametros['filter']);
        //print_r($params);
        unset($parametros['filter']);
        $parametros = $this->mSubMayor->configureParams($params, $parametros);
        //print_r($parametros);//die;
        if ($parametros['data']) {
            $parametros = json_decode($parametros['data'], true);
        }
        if ($parametros['denomarearesp']) {
            $parametros['idarearesp'] = $parametros['denomarearesp'];
            unset($parametros['denomarearesp']);
        }
        if ($parametros['marca']) {
            $parametros['idmarca'] = $parametros['marca'];
            unset($parametros['marca']);
        }
        if ($parametros['modelo']) {
            $parametros['idmodelo'] = $parametros['modelo'];
            unset($parametros['modelo']);
        }
		if($parametros['descripciongrupo']){
            if(!is_array($parametros['descripciongrupo']))
                $parametros['descripciongrupo'] = array($parametros['descripciongrupo']);
			$parametros['idgruposubgrupo'] = $parametros['descripciongrupo'];
            unset($parametros['descripciongrupo']);
		}

        if ($parametros['colorprim']) {
            $parametros['idcolorprim'] = $parametros['colorprim'];
            unset($parametros['colorprim']);
        }
        if ($parametros['denomcentrocosto']) {
            $parametros['idcentrocosto'] = $parametros['denomcentrocosto'];
            unset($parametros['denomcentrocosto']);
        }
        if ($parametros['colorsec']) {
            $parametros['idcolorsec'] = $parametros['colorsec'];
            unset($parametros['colorsec']);
        }
        if ($parametros['actividad']) {
            $parametros['idactividad'] = $parametros['actividad'];
            unset($parametros['actividad']);
        }
        if ($parametros['categoria']) {
            $parametros['idcategoria'] = $parametros['categoria'];
            unset($parametros['categoria']);
        }
        if ($parametros['denomestadotecnico']) {
            $parametros['idestatustecnico'] = $parametros['denomestadotecnico'];
            unset($parametros['denomestadotecnico']);
        }
		if ($parametros['denomentidad']) {
            $parametros['idestructuracomun'] = $parametros['denomentidad'];
            unset($parametros['denomentidad']);
        }
        if ($parametros['naturaleza']) {
		    if(!is_array($parametros['naturaleza']))
                $parametros['naturaleza'] = array($parametros['naturaleza']);
            $parametros['idnaturaleza'] = $parametros['naturaleza'];
            unset($parametros['naturaleza']);
        }
		
        $start = $this->uiParams['start'];//$this->_request->getPost('start');
        $limit = $this->uiParams['limit'];
        ComunAFTModel::getInstance()->configStartAndLimitInParams($parametros, $start, $limit);
        $parametros['arrayIdarearesp'] = json_decode($parametros['arrIdEstructuras']);


        if ($parametros['salidas'] != 2) {//Para los disponibles    
            
            $respuesta = $this->mSubMayor->GetConteoRegNumericosEntidad($parametros['arrayIdarearesp'], $parametros);

            $this->datos = $respuesta['datos'];
            $this->cantidad = $respuesta['cantidad'];
            $this->cantidadBajas = $respuesta['bajas'];
        } else {
            //Para los que han salido de la entidad
            $respuesta = $this->mSubMayor
                ->GetConteoRegNumericosEntidadSalidas($parametros, $parametros['arrayIdarearesp']);
            $centrocosto = ServiciosContabilidadFinanzasHelper::__init();
            foreach ($respuesta['datos'] as $key => $registro) {
                if (!is_null($registro['idcentrocosto'])) {
                    $dat = $centrocosto->obtenerCentroNivelPorId($registro['idcentrocosto']);
                    $respuesta['datos'][$key]['denomcentrocosto'] = $dat['descripcioncentrogrupo'];
                }
            }
            $this->datos = $respuesta['datos'];
            $this->cantidad = $respuesta['cantidad'];
        }
    }

    public function getregistronumericoImprimirAction()
    {
        $parametros = $this->_request->getPost();
        $parametros['arrayIdarearesp'] = json_decode($parametros['arrayIdarearesp']);
        if ($parametros['salidas'] != 2) { //Para los disponibles
            $respuesta = $this->mSubMayor
                ->GetConteoRegNumericosEntidad($parametros['arrayIdarearesp'], $parametros, true);
            $this->datos = $respuesta['datos'];
            $this->cantidad = $respuesta['cantidad'];
        } else {
            //Para los que han salido de la entidad
            $respuesta = $this->mSubMayor
                ->GetConteoRegNumericosEntidadSalidas($parametros, $parametros['arrayIdarearesp'], true);
            $this->datos = $respuesta['datos'];
            $this->cantidad = $respuesta['cantidad'];
        }
    }


    public function getmovimientosregistroAction()
    {
        $parametros = $this->_request->getPost();
        $parametros['arrayIdarearesp'] = json_decode(stripslashes($this->_request->getPost('arrayIdarearesp')));
        $respuesta = $this->mSubMayor->cargarDatosListadoDocRegNum($parametros);
        $respuesta['cantidad'] = $respuesta['total'];
        $this->objectHelper->synchronize($this, $respuesta);
    }

    public function getDatosMovimientoAction()
    {
        $parametros = $this->_request->getPost();
        $respuesta = $this->mSubMayor->getDatosMovimiento($parametros);
        /*$centrocosto = ServiciosContabilidadFinanzasHelper::__init();
           foreach ($respuesta['datos'] as $key => $registro) {
               if (!is_null($registro['idcentrocosto'])) {
                   $dat = $centrocosto->obtenerCentroNivelPorId($registro['idcentrocosto']);
                   $respuesta['datos'][$key]['denomcentrocostomov'] = $dat['descripcioncentrogrupo'];
               }
           }*/
        $respuesta['cantidad'] = $respuesta['total'];
        $this->objectHelper->synchronize($this, $respuesta);
    }

    public function cargarComboEjercicioAction()
    {
        $this->autoShow = false;
        $identidad = $this->_request->getPost('idestructura');
        $obj = new SubmayorModel();
        $arrDatos = $obj->cargarComboEjercicios($identidad);
        echo json_encode($arrDatos);
    }

    public function cargarComboPeriodoAction()
    {
        $periodos = ServiciosConfiguracionGeneralHelper::__init()
            ->ObtenerPeriodos($this->_request->getPost('idejercicio'));
        $this->datos = $periodos;
    }

    public function getEstadosOperacionAction()
    {
        $this->datos = $this->mSubMayor->getEstadosOperacion();
    }

    public function imprimirExcelAction()
    {
        $this->dirFichero = $this->mSubMayor->crearExcel($this->uiParams);
    }

    public function getmarcasmodelosAction()
    {
        $data = ($this->uiParams['tipo'] == 2) ?
            $this->serviciosCfg->obtenerModelos(array('estado' => 1)) :
            $this->serviciosCfg->obtenerMarcas(array('estado' => 1));
        $this->datos = $data['datos'];
    }
	
	public function getgrupossubgruposAction(){
		$maestro = new MaestroProductoService();
		$data = $maestro->obtenerGruposHojas();
		//print_r($data);die;
        $this->datos = $data['data'];
	}

    public function getnomencladorfiltroAction()
    {

        switch ($this->uiParams['tipo']) {
            case 1:
                $nomencladoresActivo = new NomencladoresActivosService();
                $coloresSis = $nomencladoresActivo->getColoresHabilitadosEntidad(
                    $this->global->Estructura->idestructura
                );
                $this->datos = $coloresSis;

                break;
            case 2:
                $nomencladoresActivo = new NomencladoresActivosService();
                $actividadesSis = $nomencladoresActivo->getActividades();
                $this->datos = $actividadesSis;

                break;
            case 3:
                $nomencladoresActivo = new ConfiguracionActivosService();
                $categoriaSis = $nomencladoresActivo->getCategorias($this->global->Estructura->idestructura);
                $this->datos = $categoriaSis['datos'];

                break;
            case 4:
                $nomencladoresActivo = new NomencladoresActivosService();
                $estadosSis = $nomencladoresActivo->getEstatusTecnicos(
                    array('estado' => 1, 'idestructura' => $this->global->Estructura->idestructura)
                );
                $this->datos = $estadosSis;

                break;

            default:
                //# code...
                break;
        }

    }

    public function getcentroscostosAction()
    {
        $centrocosto = ServiciosContabilidadFinanzasHelper::__init();
        $this->datos = $centrocosto->obtenerCentrosCosto($this->global->Estructura->idestructura);

    }

    public function updateConfigReporteAction()
    {
        $dir_index = $_SERVER['SCRIPT_FILENAME'];
        $json_file = substr($dir_index, 0, strrpos($dir_index, 'web')) . 'apps/logistica/activos_fijos/comun/recursos/json/config_reportes.json';

        if (!file_exists($json_file))
            $this->codigoMsg = 3;
        else {
            $jsonString = file_get_contents($json_file);
            $data = json_decode($jsonString, true);
            if ($data[$this->global->Estructura->idestructura]) {
                $data[''][$this->global->Estructura->idestructura]++;
            } else {
                $data[$this->global->Estructura->idestructura] = 1;
            }
            $newJsonString = json_encode($data);
            file_put_contents($json_file, $newJsonString);
            $this->numero = $data[$this->global->Estructura->idestructura];
            $this->codigoMsg = 1;
        }
    }
    
    public function getResponsablesAction()
    {
        $this->datos = SubmayorModel::getResponsables();
        //echo json_encode($respDatos);
    }
	
	public function getEntidadesAction(){
		
		$datos = ComunAFTModel::cargarEstructuras($this->uiParams);
		$datos = $datos['datos'];
		foreach($datos as $key => $dat){
			$datos[$key]->denomentidad = $datos[$key]->denominacion;
		}
		
        $this->datos = $datos;
	}

    public function cargarGrupoExplotacionAction()
    {
        $estructura = 'Estructura';
        $result = $this->mSubMayor->cargarGrupoExplotacion($this->global->$estructura->idestructura);
        $this->datos = $result;
    }

    public function getConteoEntidadTransportesAction(){
        $idnaturalezaTransporte = '-6';
        $idNaturalezasTransporte = $this->mSubMayor->getNaturalezas($idnaturalezaTransporte);
        $this->uiParams['idnaturaleza'] = $idNaturalezasTransporte;
        $parametros = json_decode($this->_request->getPost('filter'));
        $this->uiParams = $this->mSubMayor->configureParams($parametros, $this->uiParams);

        $datos = $this->mSubMayor->getConteoEntidad(
            $this->uiParams['start'], 
            $this->uiParams['limit'], 
            $this->uiParams
        );
        
        $datosEnviar = $datos['datos'];
        $this->datos = $datosEnviar;
        $this->cantidad = $datos['cantidad'];
        $this->cantidadTotal = $datos['cantidadTotal'];
    }

    public function getConteoEntidadUtilesAction(){
        
        $parametros = json_decode($this->_request->getPost('filter'));
        $this->uiParams['solo_uh'] = 1;
        $this->uiParams = $this->mSubMayor->configureParams($parametros, $this->uiParams);

        $datos = $this->mSubMayor->getConteoEntidad(
            $this->uiParams['start'], 
            $this->uiParams['limit'], 
            $this->uiParams
        );
        
        $datosEnviar = $datos['datos'];
        $this->datos = $datosEnviar;
        $this->cantidad = $datos['cantidad'];
        $this->cantidadTotal = $datos['cantidadTotal'];

    }
}
