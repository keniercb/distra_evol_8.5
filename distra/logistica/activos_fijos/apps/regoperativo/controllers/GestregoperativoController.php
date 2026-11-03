 <?php

if (!class_exists('BaseModel')) {
    $dir = Zend_Registry::getInstance()->get('config')->dir_aplication . '/logistica/utiles/comun/config.php';
    include_once $dir;
    set_include_path(get_include_path() . PATH_SEPARATOR . $config['include_path']);
}

class GestregoperativoController extends BaseController
{

    private $sConfGeneral;
    private $sEstruComp;
    private $registroModel;
    protected $_mComunAFT;
   
    public function init()
    {
        parent:: init('log.aft.regoperativo');
        $this->registroModel = new RegistroActivoModel();
        $this->registroModel->loadPluginsFromFile('listaplugins')->buildRelations();
        $this->sConfGeneral = ServiciosConfiguracionGeneralHelper::__init();
        $this->sEstruComp = ServiciosEstructuraComposicionHelper::__init();
        $this->_mComunAFT = ComunAFTModel::getInstance();
        /*$this->view->arrayJs = array(
            '</script><script type="text/javascript"
            src="/pvd/comun/views/js/buscarpersonacomp/buscarpersonacomp.js"></script>'
            . '<script type="text/javascript" src="/pvd/comun/views/js/utiles/treeComboBox.js"></script>'
        );*/
        $this->view->arrayJs = array(
           // $this->configuracionHelper->getJSAtributosDinamicos(),
            $this->rrhhHelper->mostrarIUBuscarPersona()
            
        );
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

        $integradoCont = $this->_mComunAFT->integradoContabiliadConf($this->global->Estructura->idestructura);
        $this->view->uiVariables = array_merge(
            array(
            'alternativa' => $alternativa,
            'integradoCont' => $integradoCont,
            'monedacontable' => "'"."{$moneda['monedacontable']}"."'",
            'nommonedacontable' => "'"."{$moneda['nombremonedacontable']}"."'",
            'monedaalternativa' => "'"."{$moneda['monedaalternativa']}"."'",
            'nommonedaalternativa' => "'"."{$moneda['nombremonedaalternativa']}"."'",
            'procesorevaluacion' => $this->_mComunAFT->getProcesoRevaluacion()
            ), $this->view->uiVariables
        );
    }

    public function gestregoperativoAction()
    {
        $this->autoShow = false;
        $this->controllerConfig = 'log';
        $this->prepareView();
        $this->initComponent('log.aft.regoperativo');
        $this->renderTemplate();
        // $this->render();
    }

    /**
     * Método que retorna las entidades
     */
    public function getentidadAction()
    {
        //$ent = $this->sEstruComp->getEstructura($this->global->Estructura->idestructura);
        $ent = $this->integrator->metadatos->DameEstructura($this->global->Estructura->idestructura);
        $this->entidad = $ent[0]->denominacion;
        $this->identidad = $ent[0]->idestructura;
    }

    /*     * *****************
     * metodos auxiliares
     * *********** */

    /**
     * Método para cargar el nomenclador de modelos
     * para el combo de la busqueda avanzada
     */
    public function getModelosAction()
    {
        $parametros = $this->_request->getPost();
        $estructura = 'Estructura';
        $parametros['idestructura'] = ($this->_request->getPost('idestructura')) ?
            $this->_request->getPost('idestructura') : $this->global->$estructura->idestructura;
        $datos = $this->sConfGeneral->obtenerModelos($parametros);
        $this->datos = $datos['datos'];
        $this->cantidad = $datos['cantidad'];
    }

    /**
     * Método para cargar el nomenclador de marca
     * para el combo de la busqueda avanzada
     */
    public function getMarcasAction()
    {
        $parametros = $this->_request->getPost();
        $estructura = 'Estructura';
        $parametros['idestructura'] = ($this->_request->getPost('idestructura')) ?
            $this->_request->getPost('idestructura') : $this->global->$estructura->idestructura;
        $datos = $this->sConfGeneral->obtenerMarcas($parametros);
        $this->datos = $datos['datos'];
        $this->cantidad = $datos['cantidad'];
    }

    /**
     * Método para cargar el nomenclador de colores
     *
     */
    public function getColoresAction()
    {
        $color = ($this->_request->getPost('colorPrimario')) ? $this->_request->getPost('colorPrimario') : -1;
        if ($color != -1) {
            $denom = "idcolorprim";
        } else {
            $denom = "idcolorsec";
        }
        $this->datos = NomencladoresActivosService::getColoresHabilitados($denom);
        $this->cantidad = count($this->datos);
    }
    
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
     * Método para cargar el nomenclador de actividad
     *
     */
    public function getActividadAction()
    {
        $this->datos = NomencladoresActivosService::getActividades();
        $this->cantidad = count($this->datos);
    }

    /**
     * Método para cargar el nomenclador de categoria
     *
     */
    public function getCategoriaAction()
    {
        $idEstructura = $this->global->Estructura->idestructura;
        $obj = new ConfiguracionActivosService();
        $datos = $obj->getCategorias($idEstructura);
        $this->datos = $datos['datos'];
        $this->cantidad = $datos['cantidad'];
    }

    /**
     * Método para cargar el nomenclador de nacionalidad
     * para el combo de la busqueda avanzada
     */
    public function getNacionalidadesAction()
    {
        ComunAFTModel::getInstance()->configStartAndLimitInParams(
            $this->uiParams, $this->uiParams['start'], $this->uiParams['limit']
        );

        $paises = ComunAFTModel::getInstance()->getPaises(
            $this->uiParams['query'], $this->uiParams['start'], $this->uiParams['limit']
        );

        $this->datos = $paises['data'];
        $this->cantidad = $paises['total'];
    }

    /**
     * Método para cargar el nomenclador Estatus tecnico
     * para el campo de la busqueda avanzada
     */
    public function getEstatusTecnicoAction()
    {
        $obj = new NomencladoresActivosService();
        $parametros['estado'] = 1;
        ComunAFTModel::getInstance()->configStartAndLimitInParams(
            $parametros, $this->uiParams['start'], $this->uiParams['limit']
        );
        $estructura = 'Estructura';
        $parametros['idestructura'] = $this->global->$estructura->idestructura;
        $parametros['criterio'] = $this->uiParams['criterio'];
        $estatus = $obj->getEstatusTecUsanEntidad($parametros);
        $this->datos = $estatus;
        $this->cantidad = count($estatus);
    }

    /*     * ************
     * aqui terminan los metodos auxiliares
     * *********** */

    public function clonarAction()
    {
        try {
            $idpadre = ($this->_request->getpost('idpadre')) ? $this->_request->getpost('idpadre') : null;
            $idregnumerico = ($this->_request->getpost('idregnumerico')) ?
                $this->_request->getpost('idregnumerico') : null;
            $cantidad = ($this->_request->getpost('cantidad')) ? $this->_request->getpost('cantidad') : 1;
            $denominacionPlantilla = ($this->_request->getpost('denominacionplantilla') ?
                $this->_request->getpost('denominacionplantilla') : null);
            $color = ($this->_request->getpost('color'))? $this->_request->getpost('color'):null;
            $conn = Zend_Registry::get('conexion');

            if (!$denominacionPlantilla) {
                if ($idpadre) {
                    if ($color) {
                        $regOldAndNew = $conn->fetchAll(
                            "select * from \"mod_logactivofijotangible\".\"f_duplicaarbol\"($idregnumerico,"
                            . "$cantidad,null,$idpadre,$color)"
                        );
                    }else{
                        $regOldAndNew = $conn->fetchAll(
                            "select * from \"mod_logactivofijotangible\".\"f_duplicaarbol\"($idregnumerico,"
                            . "$cantidad,null,$idpadre,null)"
                        );
                    }
                } else {
                    if ($color) {
                        $regOldAndNew = $conn->fetchAll(
                            "select * from \"mod_logactivofijotangible\".\"f_duplicaarbol\"($idregnumerico,"
                            . "$cantidad,null,null,$color)"
                        );
                    } else {
                        $regOldAndNew = $conn->fetchAll(
                            "select * from \"mod_logactivofijotangible\".\"f_duplicaarbol\"($idregnumerico,"
                            . "$cantidad,null,null,null)"
                        );
                    }
                }
            } else {
                if ($idpadre) {
                    if ($color) {
                        $regOldAndNew = $conn->fetchAll(
                            "select * from \"mod_logactivofijotangible\".\"f_duplicaarbol\"($idregnumerico,"
                            . "$cantidad,'$denominacionPlantilla',$idpadre,$color)"
                        );
                    } else {
                        $regOldAndNew = $conn->fetchAll(
                            "select * from \"mod_logactivofijotangible\".\"f_duplicaarbol\"($idregnumerico,"
                            . "$cantidad,'$denominacionPlantilla',$idpadre,null)"
                        );
                    }
                } else {
                    if ($color) {
                        $regOldAndNew = $conn->fetchAll(
                            "select * from \"mod_logactivofijotangible\".\"f_duplicaarbol\"($idregnumerico,"
                            . "$cantidad,'$denominacionPlantilla',null,$color)"
                        );
                    } else {
                        $regOldAndNew = $conn->fetchAll(
                            "select * from \"mod_logactivofijotangible\".\"f_duplicaarbol\"($idregnumerico,"
                            . "$cantidad,'$denominacionPlantilla',null,null)"
                        );
                    }
                }
            }
            $regNumOld = array();
            $regNumNew = array();
            foreach ($regOldAndNew as $key => $value) {
                $regNumOld[] = $value['idregnumerico'];
                $regNumNew[] = $value['newidregnumerico'];
            }
            $regNumOld = implode(',', $regNumOld);
            $regNumNew = implode(',', $regNumNew);

            $this->registroModel->clonePluginsData($regNumOld, $regNumNew);
            $this->codigoMsg = 1;
        } catch (Exception $e) {
            print_r($e->getMessage());
            $this->codigoMsg = 3;
        }
    }

    /**
     * Método para adicionar los registros numericos operativos
     */
    public function adicionarRegistroNumericoOperativoAction()
    {
        try {
            $parametros = new stdClass();
            $estructura = 'Estructura';
            if($this->_request->getPost('idarearesp')){
                $parametros->idarearesp = $this->_request->getPost('idarearesp');
            }else if($this->_request->getPost('id_entidad_seleccionada')){
                $parametros->idarearesp = $this->_request->getPost('id_entidad_seleccionada');
            }else{
                $parametros->idarearesp = $this->global->$estructura->idestructura;
            }
            /*$parametros->idarearesp = ($this->_request->getPost('idarearesp')) ?
            $this->_request->getPost('idarearesp') : $this->global->$estructura->idestructura;*/
            $parametros->primaryKeyField = $this->_request->getPost('primaryKeyField');
            $parametros->idpadreModulo = $this->_request->getPost('idpadreModulo');
            $parametros->plantilla = $this->_request->getPost('plantilla');
            $parametros->modificar = $this->_request->getPost('modificar');
            $parametros->idarbol = $this->_request->getPost('idarbol');
            $parametros->importar = $this->_request->getPost('importar');
            $parametros->activos = json_decode($this->_request->getPost('datos'));
            $parametros->activos = ($parametros->importar)? $this->registroModel->validarFechaImportar(
                $parametros->activos
            ): $parametros->activos;

            $this->registroModel->adicionarActivo($parametros);
            $this->codigoMsg = 1;
        } catch (Exception $e) {
            if ($e->getCode() == 23505) {
                $this->codigoMsg = 4;
            } else {
                $this->codigoMsg = 3;
            }
        }
    }

    /**
     * Método para cargar los registros numericos operativos
     */
    public function cargarRegNumOperativoAction()
    {
        $parametros = $this->uiParams;

        if ($parametros['idsRegNumNoMostrar']) {
            $parametros['idsRegNumNoMostrar'] = json_decode(
                stripcslashes($parametros['idsRegNumNoMostrar'])
            );
        }
        if ($parametros['idsRegNumMostrarRO']) {
            $parametros['idsRegNumMostrarRO'] = json_decode(stripcslashes($parametros['idsRegNumMostrarRO']));
        }

        if(!$parametros['idarearesp']){
            $parametros['idarearesp'] = ComunAFTModel::getInstance()->getIdsAreasHijas();
            $parametros['idarearesp'][]= $this->global->Estructura->idestructura;
        }
        if ($parametros['paginado'] != 1) {
            unset($parametros['start']);
            unset($parametros['limit']);
        }

        if ($parametros['busqAvanzada'] == 2) {
            unset($parametros['anode']);
            $parametros['datos'] = json_decode(stripcslashes($parametros['datos']));
            $datos = $this->registroModel->cargarActivobusqAvanzada($parametros);
        } else {
            $datos = $this->registroModel->cargarRegistroOperativos($parametros);
        }

        foreach ($datos['datos'] as $index=>&$dat)
        {
            $pais = $this->sConfGeneral->obtenerPaisXID($dat['idpais']);
            $dat['descripcionnacionalidad'] = $pais['nombrepais'];
            if($parametros['descripcionnacionalidad'])
            {
                $posPais = stripos($dat['descripcionnacionalidad'], $parametros['descripcionnacionalidad']);
                if(!is_numeric($posPais))
                    unset($datos['datos'][$index]);

            }
        }
        $this->datos = $datos['datos'];
        $this->cantidad = $datos['total'];
    }
    
    

    /**
     * Método para eliminar los registros numericos operativos
     */
    public function eliminarRegNumOperativoAction()
    {
        $parametros = new stdClass();
        $parametros->datosModulo = json_decode(stripcslashes($this->_request->getPost('datosModulos')));
        try {
            $this->registroModel->elimiarActivo($parametros->datosModulo);
            $this->codigoMsg = 1;
        } catch (Exception $e) {

            $this->codigoMsg = 3;
            $this->msg = $e->getMessage();
        }
    }

    public function mandarElementosAction()
    {
        $idnaturaleza = $this->_request->getPost('idnaturaleza');
        $identidad = $this->_request->getPost('identidad');
        $estructura = 'Estructura';
        $identidad = ($this->_request->getPost('identidad')) ?
            $this->_request->getPost('identidad') : $this->global->$estructura->idestructura;
        if ($idnaturaleza != null) {
            $confTipomedio = new ConfiguracionActivosService();
            $result = $confTipomedio->getConfDatPorNaturaleza($idnaturaleza, $identidad);
            // Esto se comentario para que no saliera el combo de areas de responsabilidad en el formulario de adicionar
            /*$obj = new stdClass();
            $obj->label = '\xc1rea de responsabilidad';
            $obj->name = 'idarearesp';
            array_push($result, $obj);*/
            $this->datos = $result;
        } else {
            $this->datos = array();
        }
    }

    /*
     * Metodo para cargar la configuracion de datos por agrupaciones segun 
     * el indicador.
     */
    public function cargarconfiguracionDatosAction()
    {
        $parametros = $this->_request->getPost();
        $this->datos = $this->registroModel->getConfigDatosDinamicos($parametros);
        $this->cantidad = count($this->datos);
    }

    public function insertarRegNumDocumentoAction()
    {
        $parametros = $this->_request->getPost();
        $parametros['regnumericos'] = json_decode($parametros['regnumericos']);
        try {
            $resp = $this->registroModel->insertRegDoc($parametros);
            if ($resp) {
                $this->success = true;
            }else{
                $this->success = false;
                $this->usados = true;
            }
        } catch (Exception $e) {
            $this->success = false;
            $this->msg = $e->getMessage();
        }
    }

    public function crearModuloDrgDropAction()
    {
        try {
            $idsOrigenes = json_decode(stripcslashes($this->_request->getPost('ids_origen')));
            $idsOrigenesPadres = json_decode(stripcslashes($this->_request->getPost('ids_origenes_padres')));
            $idRndestino = $this->_request->getPost('id_destino');

            $moduloService = new ModuloService();
            $moduloService->crearModuloDragDrop($idsOrigenes, $idRndestino);
            $this->codigoMsg = true;
        } catch (Exception $e) {
            $this->success = false;
        }
    }

    /**
     * Funcion para cargar los depositos de una entidad
     */
    public function cargardepositosAction()
    {
        $this->setDefaultParam('idtipo', 0);
        $idestructura = $this->_request->getPost('idarearesp');
        $depositos = $this->registroModel->cargardepositos(
            null, null, null, null, null, $this->uiParams['idtipo'],
            $idestructura
        );
        $this->datos = $depositos['depositos'];
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
            $this->message = 'No se encuentra el fichero ha importar.';
        }
    }

    /**
     * Funcion para cargar los datos del fichero excel
     */
    public function validarExcelAction()
    {
        $mImportar = new ImportMovActivoFijoModel();
        $this->uiParams['datos'] = json_decode($this->uiParams['datos']);
        $this->uiParams['idestructura'] = $this->global->Estructura->idestructura;
        ini_set('memory_limit', '512M');//Extender la memoria por la complejidad de las operaciones
        $datos = $mImportar->concatenarDatosExcel($this->uiParams);

        //Retornar los nomencladores y los datos por separados para el precesado en la vista
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
    public function cargarProductosPorMarcamodeloAction()
    {
        $respuesta = array();
        $mMovActivoFijo= new MovimientoActivoFijoModel();
        $datos = $mMovActivoFijo->getIndicadorByMarcaModelo(
            $this->uiParams['idmarca'], $this->uiParams['idmodelo']
        );

        if (count($datos)) {
            $respuesta = $datos[0];
            $respuesta['tipomedio'] = ($respuesta['denominacion'])
                ?
                $respuesta['denominacion'] . " " . $respuesta['descripcionmarcamodelo']
                :
                $respuesta['descripcionmarcamodelo'];
        }

        $this->datos = $respuesta;
    }

    /**
     *
     */
    public function cargarModelosAction()
    {
        $parametros['idpadre'] = $this->uiParams['idpadre'];

        if ($parametros['idpadre']) {

            $datos = $this->sConfGeneral->obtenerModelos($parametros);
            $this->objectHelper->synchronize($this, $datos);
        }
    }

}
