<?php

/**
 *  Para que se muestre en el sistema de seguridad las acciones de la controladora
 */
if (!class_exists('BaseModel')) {
    $dir = Zend_Registry::getInstance()->get('config')->dir_aplication.'/logistica/utiles/comun/config.php';
    include_once $dir;
    set_include_path(get_include_path().PATH_SEPARATOR.$config['include_path']);
}

/**
 *
 */
class GestModulosController extends BaseController
{
    private $mProdModLogico, $mRegNumModulo;
    protected $sAyuda, $sEstrucComp, $sConfGeneral;

    /**
     *
     */
    public function init()
    {       
        parent::init('log.aft.modulopatrimonio');
        $this->mRegNumModulo = new RegNumericoModuloPatrimonioModel();
        $this->mProdModLogico = new ProdModuloLogicoPatrimonioModel();

        $this->sAyuda = ServiciosAyudaHelper::__init();
        $this->sEstrucComp = ServiciosEstructuraComposicionHelper::__init();
        $this->sConfGeneral = ServiciosConfiguracionGeneralHelper::__init();
        $this->sConfGeneral = LogisticaGlobal::__init();
        $idnatObjObra = IntegracionNomencladoresModel::NATURALEZA_OBJETODEOBRA;
        $idnatINMUEBLE = IntegracionNomencladoresModel::NATURALEZA_INMUEBLE;
       // $idnatActivos = IntegracionNomencladoresModel::NATURALEZA_ACTIVOS;
        $this->view->uiVariables = array_merge(
            array(
                'natobjobraP'     => $idnatObjObra,
                'natinmuebleP' => $idnatINMUEBLE//,
               // 'natactivosP' => $idnatActivos
            ), $this->view->uiVariables
        );
        $this->view->jsArbolMarcaModelo = NomgeneralesProxyService::getJSNomMarcaModelo();
        $this->view->arrayJs = array(
            $this->rrhhHelper->mostrarIUBuscarPersona(), $this->sConfGeneral->getJSAtributosDinamicos()[0]
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
        $this->view->uiVariables = array_merge(
            array(
                'alternativa' => ($alternativa == 1) ? 'true' : 'false',
                'monedacontable' => "'"."{$moneda['monedacontable']}"."'",
                'nommonedacontable' => "'"."{$moneda['nombremonedacontable']}"."'",
                'monedaalternativa' => "'"."{$moneda['monedaalternativa']}"."'",
                'nommonedaalternativa' => "'"."{$moneda['nombremonedaalternativa']}"."'"
            ), $this->view->uiVariables
        );
    }

    /**
     *
     */
    public function gestModulosAction()
    {
        $this->autoShow = false;
        $this->controllerConfig = 'log';
        $this->prepareView(); 
       // $this->initComponent('log.aft.modulo');
        $this->initComponent('log.aft.modulopatrimonio'); 
        
        $this->renderTemplate();
    }

    /**
     *  Mostrar la entidad por la cual el usuario está autentificado
     */
    public function getentidadAction()
    {
        $cEstructura = 'Estructura';
        $entidad = $this->sEstrucComp->getEstructura($this->global->$cEstructura->idestructura);

        $this->entidad = $entidad[0]->denominacion;
        $this->identidad = $entidad[0]->idestructura;
    }

    /**
     *  Listado de módulos conformados en la entidad
     */
    public function getModulosAction()
    {       
        $parametros = $this->uiParams;
//        ini_set('memory_limit', '1024M');
        $parametros['idestructuraop'] = $this->uiParams['idarea'];
        $parametros['moduloCmp'] = 1;
        $parametros['tree'] = 1;
        /*Para que solo carge los datos de patrimonio */
        $idnatObjObra = IntegracionNomencladoresModel::NATURALEZA_OBJETODEOBRA;
        $idnatInmueble = IntegracionNomencladoresModel::NATURALEZA_INMUEBLE;
        //$idnatActivos = IntegracionNomencladoresModel::NATURALEZA_ACTIVOS;
        $parametros['idnaturaleza'] = array($idnatObjObra ,$idnatInmueble/*, $idnatActivos*/);     
        if (!$this->uiParams['_id']) {
            $parametros['asignado'] = 2;
        }
        $this->objectHelper->synchronize($this, $this->mRegNumModulo->obtenerModulos($parametros));
    }

    /**
     * Listado de registros numéricos que no estan asignados a ningún módulo
     */
    public function getNumerosSerieAction()
    {
        //$parametros['idnaturaleza'] = ($this->_request->getPost('objetoobra')) ? -4 : -5;
        $sRegNumActivo = new RegNumActivoService(LogisticaGlobal::SUBSISTEMA_PATRIMONIO);

        ComunAFTModel::getInstance(LogisticaGlobal::SUBSISTEMA_PATRIMONIO)->configStartAndLimitInParams(
            $this->uiParams, $this->uiParams['start'], $this->uiParams['limit']
        );

        $this->uiParams['asignado'] = 1;
        $this->uiParams['idestructuraop'] = $this->uiParams['idarea'];

        if ($this->uiParams['idnodoPadre']) {
            $estructura = $this->sEstrucComp->getEstructura($this->uiParams['idnodoPadre']);
            $this->uiParams['idespecialidad'] = $estructura[0]->idespecialidad;
        }
        $this->objectHelper->synchronize($this, $sRegNumActivo->getMediosDisponibles($this->uiParams, false));
    }

    /**
     * Listado de subgrupos para la búsqueda avanzada
     */
    public function getGruposAction()
    {
        $sMaestroProd = new MaestroProductoService();

        $parametros = new stdClass();
        $parametros->query = $this->uiParams['query'];

        $this->datos = $sMaestroProd->getInstanceModeloGrupoHoja()->getDatos($parametros);
        $this->total = $sMaestroProd->getInstanceModeloGrupoHoja()->getCantDatos($parametros);
    }

    /**
     * Listado de países para la búsqueda avanzada
     */
    public function getNacionalidadesAction()
    {
        ComunAFTModel::getInstance(LogisticaGlobal::SUBSISTEMA_PATRIMONIO)->configStartAndLimitInParams(
            $this->uiParams, $this->uiParams['start'], $this->uiParams['limit']
        );

        $this->objectHelper->synchronize(
            $this,
            ComunAFTModel::getInstance(LogisticaGlobal::SUBSISTEMA_PATRIMONIO)->getPaises(
                $this->uiParams['query'], $this->uiParams['start'], $this->uiParams['limit']
            )
        );
    }

    /**
     * Listado de estatus técnicos para la búsqueda avanzada
     */
    public function getEstatusTecnicoAction()
    {
        $mEstaus = new EstatusModel();
        $this->objectHelper->synchronize($this, $mEstaus->getEstatusTecnicos($this->uiParams));
    }

    /**
     * Carga árbol de marcas y modelos para la búsqueda avanzada
     */
    public function getMarcaModeloAction()
    {
        $this->sConfGeneral->obtenerDatosArbolMarcaModelo($this->uiParams);
    }

    /**
     * Adicionar módulos
     */
    public function adicionarModuloAction()
    {
        $parametros = new stdClass();
        $parametros->medios = json_decode(stripcslashes($this->uiParams['medios']));
        $parametros->idmodulo = $this->uiParams['idmodulo'];
        $parametros->idarea = $this->uiParams['idarea'];

        //  try {
        $this->mRegNumModulo->adicionarModulo($parametros);
        $this->msg = 1;
        // } catch (Exception $e) {
       // $this->msg = 3;
        //$this->error = $e->getMessage();
        // }
    }

    /**
     * Eliminar módulos
     */
    public function eliminarModuloAction()
    {
        $parametros = new stdClass();
        $parametros->datosModulo = json_decode(stripcslashes($this->uiParams['datosModulos']));
        try {
            $this->mRegNumModulo->eliminarModulos($parametros->datosModulo);
            $this->msg = 1;
        } catch (Exception $e) {
            $this->msg = 3;
            $this->error = $e->getMessage();
        }
    }

    /**
     * Adicionar módulo lógico
     */
    public function adicionarNomenlcaturaModuloAction()
    {
        $datos = json_decode(stripcslashes($this->uiParams['datos']));
        $idAreaResp = json_decode(stripcslashes($this->uiParams['idarea']));

        try {
            $resultado = $this->mProdModLogico->adicionarModuloLogico($datos, $idAreaResp);
            $this->msg = ($resultado == 1) ? 1 : 2;
        } catch (Exception $e) {
            $this->msg = 3;
            $this->error = $e->getMessage();
        }
    }

    /**
     * Modificar módulo lógico
     */
    public function modificandoNomenlcaturaModuloAction()
    {
        $datos = json_decode(stripcslashes($this->uiParams['datos']));
        $idAreaResp = $this->uiParams['idarea'];

        try {
            $this->msg = $this->mProdModLogico->modificarModuloLogico($datos, $idAreaResp);
        } catch (Exception $e) {
            $this->msg = 3;
            $this->error = $e->getMessage();
        }
    }

    /**
     * Eliminar un módulo lógico
     */
    public function eliminarNomenclaturaModuloAction()
    {
        $datos = json_decode(stripcslashes($this->uiParams['datos']));

        try {
            $this->mProdModLogico->eliminarModuloLogico($datos);
            $this->msg = 1;
        } catch (Exception $e) {
            $this->msg = 3;
            $this->error = $e->getMessage();
        }
    }

    /**
     * Obtener los módulos lógicos
     */
    public function getModuloLogicoAction()
    {
        $parametros = new stdClass();

        if ($this->uiParams['idsRegNumNoMostrar']) {
            $parametros->idsRegNumNoMostrar = json_decode(stripcslashes($this->uiParams['idsRegNumNoMostrar']));
        }

        ComunAFTModel::getInstance(LogisticaGlobal::SUBSISTEMA_PATRIMONIO)->configStartAndLimitInParams(
            $parametros, $this->uiParams['start'], $this->uiParams['limit']
        );

        $parametros->interfazNroInventario = $this->uiParams['interfazNrodinventario'];
        $parametros->idarea = $this->uiParams['idarea'];
        $parametros->accion = $this->_request->getPost('accion');

        if ($this->uiParams['denominacion']) {
            $parametros->denominacion = $this->uiParams['denominacion'];
        }
        if ($this->uiParams['criterio']) {
            $parametros->criterio = $this->uiParams['criterio'];
        }
        if ($this->uiParams['nroinventario']) {
            $parametros->nroinventario = $this->uiParams['nroinventario'];
        }
        $this->objectHelper->synchronize($this, $this->mProdModLogico->getModuloLogico($parametros));
    }

    /**
     * Asociarle un número de inventario al módulo
     */
    public function asociarNomenclaturaNroInventarioAction()
    {
        $parametros = json_decode(stripcslashes($this->uiParams['datos']));

        $parametros[0] = trim($parametros[0]);
        $idAreaResp = $this->uiParams['idarea'];

        if ($parametros[3] == "mod" && $parametros[4] == true) {
            $nroInvRepetidos = 0;
        } else {
            $nroInvRepetidos = $this->mRegNumModulo->getBuscarNroInvRepetidos($parametros[1], $idAreaResp);
        }

        if ($nroInvRepetidos >= 1) {
            $this->msg = 3;
        } else {
            $existe = $this->mRegNumModulo->asociarNomenclaturaNroInventario($parametros, $idAreaResp);
            $this->msg = ($existe == 3) ? 2 : 1;
        }
    }

    /**
     * Eliminar las nomenclaturas de módulos que tienen número de inventario asociado
     */
    public function eliminarModuloAsociadoNroinventarioAction()
    {
        $modulos = json_decode(stripcslashes($this->uiParams['datos']));
        try {
            $this->mRegNumModulo->eliminarModuloAsociadoNroinventario($modulos);
            $this->msg = 1;
        } catch (Exception $e) {
            $this->msg = 3;
            $this->error = $e->getMessage();
        }
    }

    /**
     * Cargar un módulo con sus hijos (organigrama)
     */
    public function getHijosModuloAction()
    {
        $this->uiParams['moduloCmp'] = true;
        $this->uiParams['tree'] = 1;
        $respuesta = $this->mRegNumModulo->getDatosHijosModulo($this->uiParams);
        $this->datos = $respuesta['datos'];
    }

    /**
     * Cargar arreglo de imágenes asociadas a un producto
     */
    public function getArrayIdsImagenesIndicadorAction()
    {
        $this->imagenes = ($this->uiParams['idindicador']) ?
            $this->mRegNumModulo->getIdImagenIndicador($this->uiParams['idindicador']) : array();
    }

    /**
     *  Mostrar imagen dado su identificador
     */
    public function getImagenesAction()
    {
        LogisticaImagenHelper::__init()->obtenerImagenDb($_GET['idimagen'], 'mod_datosmaestros.nom_imagenindicador');
    }

    /**
     * Habilitar las agrupaciones
     */
    public function habilitarAction()
    {
        try {
            $this->mProdModLogico
                ->habilitarModuloLogico(json_decode(stripcslashes($this->_request->getPost('idproducto'))), false);
            $this->msg = 1;
        } catch (Exception $e) {
            $this->msg = 3;
            $this->error = $e->getMessage();
        }
    }

    /**
     * Listado de especialidades
     */
    public function getEspecialidadesAction()
    {
        $this->datos = $this->sConfGeneral->obtenerEspecialidadesHojas();
    }

    /**
     * Crear módulos desde la funcionalidad de arrastrar y soltar
     */
    public function crearModuloDrgDropAction()
    {
        try {
            $idsOrigenes = json_decode(stripcslashes($this->uiParam['ids_origen']));
            $idRegNumDestino = $this->uiParam['id_destino'];

            $this->mRegNumModulo->crearModuloDragDrop($idsOrigenes, $idRegNumDestino);
            $this->codigoMsg = true;
        } catch (Exception $e) {
            $this->success = false;
        }
    }

    public function getContorValorInmuebleAction()
    {
        $ordendermodulo = $this->_request->getPost('ordendermodulo');
        $ordenizqmodulo = $this->_request->getPost('ordenizqmodulo');
        $idarea = $this->_request->getPost('idarea');
        $datos = $this->mRegNumModulo->getContorValorInmueble($ordendermodulo, $ordenizqmodulo, $idarea);
        $this->datos = $datos;
        //echo json_encode($datos);
    }

    public function getCargarRegimenAction()
    {
        $datos = $this->mRegNumModulo->getCargarRegimen($this->uiParams);
        $this->datos = $datos;
        $this->total = count($datos);
    }

    public function cargardocumentosAction()
    {

        $docExp = $this->_request->getPost('docexpediente');
        $idexpinmueble = $this->_request->getPost('idexpinmueble');
        $idexpedienteactivo = json_decode(stripcslashes($this->_request->getPost('idexpedienteactivo')));
        $idexpedienteactivoAp = json_decode(stripcslashes($this->_request->getPost('idexpedienteactivoAplicar')));
        $accion = $this->_request->getPost('accion');
        $parametros['start'] = $this->_request->getPost('start');
        $parametros['limit'] = $this->_request->getPost('limit');
        $cEstructura = 'Estructura';
        $entidad = $this->sEstrucComp->getEstructura($this->global->$cEstructura->idestructura);
        $parametros['idestructuracomun'] = $entidad[0]->idestructura;
        $parametros['idexpedienteactivo'] = ($idexpedienteactivoAp) ? $idexpedienteactivoAp : $idexpedienteactivo;

        if ($docExp == "docExp" && !$accion == "aplicar") {
            $datos = $this->mRegNumModulo->getDocexpedienteNorte($parametros);

            $this->datos = $datos['datos'];
            $this->total = $datos['total'];
        } elseif ($docExp == "docExp" && $accion == "aplicar") {
            $datos = $this->mRegNumModulo->getDocexpedienteNorte($parametros);
            $this->datos = $datos['datos'];
            $this->total = $datos['total'];
        } else {
            $datos = $this->mRegNumModulo->getExpedienteInmueble($idexpinmueble, $parametros);
            $this->datos = $datos['datos'];
            $this->total = $datos['total'];
        }
    }

    public function getAddDocExpedinteAction()
    {
        try {
            $parametros['idregnumerico'] = $this->_request->getPost('idregnumerico');
            $parametros['datidexpediente'] = json_decode(stripcslashes($this->_request->getPost('datidexpediente')));
            $datos = $this->mRegNumModulo->getAddDocExpedinte($parametros);
            $this->msg = 1;
        } catch (Exception $e) {
            $this->msg = 3;
            $this->error = $e->getMessage();
        }
    }

    public function getEliminarDocExpedinteAction()
    {
        try {
            $parametros['idregnumerico'] = $this->_request->getPost('idregnumerico');
            $parametros['datidexpediente'] = json_decode(stripcslashes($this->_request->getPost('datidexpediente')));
            $datos = $this->mRegNumModulo->getEliminarDocExpedinte($parametros);
            $this->msg = 1;
        } catch (Exception $exc) {
            $this->msg = 3;
            $this->error = $exc->getMessage();
            // echo json_encode(array('Msg' => 3, 'error' => $exc->getMessage()));
        }
    }

    public function getCargarProvinciasAction()
    {
        $accion = $this->_request->getPost('accion');
        $idpadre = $this->_request->getPost('idpadre');
        $provincias = $this->mRegNumModulo->getCargarProvincias();
        if ($accion) {
            $municipios = $this->mRegNumModulo->getCargarMunicipios($idpadre);
            $this->total = count($municipios);
            $this->datos = $municipios;
            // echo json_encode(array('total' => count($municipios), 'data' => $municipios));
        } else {
            $this->total = count($provincias);
            $this->datos = $provincias;
            // echo json_encode(array('total' => count($provincias), 'data' => $provincias));
        }
    }

    public function getCargarSeccionAction()
    {
        $datos = $this->mRegNumModulo->getCargarSeccion(/* $this->_request->getPost('idregnumerico') */);
        $this->total = count($datos);
        $this->datos = $datos;
        //echo json_encode(array('data' => $datos, 'total' => count($datos)));
    }

    public function getAddInscripcionAction()
    {
        try {
            $parametros = json_decode(stripcslashes($this->_request->getPost('params')));
            $datos = $this->mRegNumModulo->getAddInscripcion($parametros);
            $this->msg = 1;
            //echo json_encode(array('Msg' => 1));
        } catch (Exception $exc) {
            $this->msg = 3;
            $this->error = $exc->getMessage();
            // echo json_encode(array('Msg' => 3, 'error' => $exc->getMessage()));
        }
    }

    public function getCargarInscripcionAction()
    {
        $idregnumerico = $this->_request->getPost('idregnumerico');
        $modregimen = $this->_request->getPost('modregimen');
        $datos = $this->mRegNumModulo->getCargarInscripcion($idregnumerico, $modregimen);
        $this->datos = $datos;
        //echo json_encode($datos);
    }

    public function getConformarDocExpedienteAction()
    {
        try {
            $parametros['idregnumerico'] = $this->_request->getPost('idregnumerico');
            $parametros['areaatencion'] = $this->_request->getPost('areaatencion');
            $parametros['cmbregimen'] = $this->_request->getPost('cmbregimen');
            $parametros['regcontable'] = $this->_request->getPost('regcontable');
            $parametros['addfecha'] = $this->_request->getPost('addfecha');
            $cEstructura = 'Estructura';
            $entidad = $this->sEstrucComp->getEstructura($this->global->$cEstructura->idestructura);
            $parametros['identidad'] = $entidad[0]->idestructura;
            $datos = $this->mRegNumModulo->getConformarDocExpediente($parametros);
            $this->msg = 1;
            // echo json_encode(array('Msg' => 1));
        } catch (Exception $exc) {
            $this->msg = 3;
            $this->error = $exc->getMessage();
            // echo json_encode(array('Msg' => 3, 'error' => $exc->getMessage()));
        }
    }

    public function getCargarCheckBoxAction()
    {
        $idregnumerico = $this->_request->getPost('idregnumerico');
        $datos = $this->mRegNumModulo->getCargarCheckBox($idregnumerico);
        $this->datos = $datos;
        // echo json_encode($datos);
    }

    public function getIdespecialidadRegimenAction()
    {
        $idespecialidad = $this->_request->getPost('idespecialidad');
        $datos = $this->mRegNumModulo->idespecialidadRegimen($idespecialidad);
        $this->datos = $datos;
    }

    public function getSistemaConstrutivoAction()
    {
        $idestructura = $this->_request->getPost('idestructura');
        $datos = $this->mRegNumModulo->getSistemaConstrutivo($idestructura);
        $this->datos = $datos;
        $this->total = count($datos);
        // echo json_encode(array('datos' => $datos, 'total' => count($datos)));
    }

    public function gestEstatusTecnicoAction()
    {

        $idestructura = $this->_request->getPost('idestructura');
        $datos = $this->mRegNumModulo->gestEstatusTecnic($idestructura);
        $this->datos = $datos;
        $this->total = count($datos);
        //echo json_encode(array('datos' => $datos, 'total' => count($datos)));
    }

    public function getGestionarTechosParedesAction()
    {
        $idestructura = $this->_request->getPost('idestructura');
        $idtechosParedes = $this->_request->getPost('idtechosParedes');
        $datos = $this->mRegNumModulo->getGestionarTechosParedes($idestructura, $idtechosParedes);
        $this->datos = $datos;
        $this->total = count($datos);
    }

    public function gesTipologiaAction()
    {
        $idestructura = $this->_request->getPost('idestructura');
        $datos = $this->mRegNumModulo->gesTipologia($idestructura);
        $this->datos = $datos;
        $this->total = count($datos);
    }

    public function getCargarGridConstruccionAction()
    {
        $parametros['idregnumerico'] = $this->_request->getPost('idregnumerico');
        $parametros['limit'] = $this->_request->getPost('limit');
        $parametros['start'] = $this->_request->getPost('start');
        $datos = $this->mRegNumModulo->getCargarGridConstruccion($parametros);
        $this->datos = $datos;
        $this->total = count($datos);
    }

    public function cargarGridNomCompartimientoAction()
    {
        $parametros['idregnumerico'] = $this->_request->getPost('idregnumerico');
        $parametros['idestructuracomun'] = $this->_request->getPost('idestructuracomun');
        if ($this->_request->getPost('otrasinstalaciones')) {
            $parametros['idotrasinstalacionesviv'] = json_decode(stripcslashes($this->_request->getPost('idotrasinstlaciones')));
            $datos = $this->mRegNumModulo->cargarGridNomOtrasIntslaciones($parametros);
        } else {
            $parametros['idcompartimiento'] = json_decode(stripcslashes($this->_request->getPost('idcompartimiento')));
            $datos = $this->mRegNumModulo->cargarGridNomCompartimiento($parametros);
        }
        $this->datos = $datos;
        $this->total = count($datos);
    }

    public function eliminarCompartimentoViviendaAction()
    {
        try {
            $parametros['idregnumerico'] = $this->_request->getPost('idregnumerico');
            $parametros['ids'] = json_decode(stripcslashes($this->_request->getPost('ids')));
            if ($this->_request->getPost('otrosdatos') == 'true') {
                $this->mRegNumModulo->eliminarOtrasInstalaciones($parametros);
            } else {
                $this->mRegNumModulo->eliminarCompartimentoVivienda($parametros);
            }
            $this->msg = 1;
            // echo json_encode(array('Msg' => 1));
        } catch (Exception $e) {
            $this->msg = 3;
            $this->error = $e->Message();
        }
    }

    public function gestOcupacionVivAction()
    {
        $idestructura = $this->_request->getPost('idestructura');
        $datos = $this->mRegNumModulo->gestOcupacionViv($idestructura);
        $this->datos = $datos;
        $this->total = count($datos);
    }

    public function gestVinculacionLaboralAction()
    {
        $idestructura = $this->_request->getPost('idestructura');
        $datos = $this->mRegNumModulo->gestVinculacionLaboral($idestructura);
        $this->datos = $datos;
        $this->total = count($datos);
    }

    public function getCargarGridOtrasInstalacionesAction()
    {
        $parametros['idregnumerico'] = $this->_request->getPost('idregnumerico');
        $parametros['limit'] = $this->_request->getPost('limit');
        $parametros['start'] = $this->_request->getPost('start');
        $datos = $this->mRegNumModulo->getCargarGridOtrasInstalaciones($parametros);
        $this->datos = $datos;
        $this->total = count($datos);
        // echo json_encode($datos);
    }

    public function getCargarGridEquiposMediosAction()
    {
        $parametros['idregnumerico'] = $this->_request->getPost('idregnumerico');
        $parametros['limit'] = $this->_request->getPost('limit');
        $parametros['start'] = $this->_request->getPost('start');
        $datos = $this->mRegNumModulo->getCargarGridEquiposMedios($parametros);
        $this->datos = $datos;
        $this->total = count($datos);
        //  echo json_encode($datos);
    }

    public function getcargarregnummediosAction()
    {
        $parametros = $this->uiParams;
        $parametros['arrRNnomostrar'] = json_decode(stripcslashes($this->_request->getPost('arrRNnomostrar')));
        $parametros['limit'] = ($this->uiParams['limit']) ? $this->uiParams['limit'] : 20;
        $parametros['start'] = ($this->uiParams['start']) ? $this->uiParams['start'] : 0;
        $parametros['idnaturaleza'] = ($this->uiParams['idnaturaleza']) ? $this->uiParams['idnaturaleza'] : null;
        if(is_null($parametros['idnaturaleza'])){
            unset($parametros['idnaturaleza']);
        }
        $idnatObjObra = IntegracionNomencladoresModel::NATURALEZA_OBJETODEOBRA;
        $idnatINMUEBLE = IntegracionNomencladoresModel::NATURALEZA_INMUEBLE;
        $parametros['idnaturalezaexcluir'] = array($idnatObjObra,$idnatINMUEBLE);
        $datos = $this->mRegNumModulo->cargarGridCentralRegNum($parametros);
        /* $datos[0]['denominacion'] = "prueba";
          $datos[0]['marca'] = "Geely";
          $datos[0]['modelo'] = "GT-122";
          $datos[0]['nroinventario'] = "OCF"; */
        $this->datos = $datos[0];
        $this->cantidad = $datos[1];
        /* $this->datos = $datos[0];
          $this->total = $datos[1]; */
        // echo (json_encode(array('datos' => $result[0], 'total' => $result[1])));
    }

    public function eliminarEquiposMediosViviendaAction()
    {
        try {
            $parametros['idregnumerico'] = $this->_request->getPost('idregnumerico');
            $parametros['ids'] = json_decode(stripcslashes($this->_request->getPost('ids')));
            $this->mRegNumModulo->eliminarEquiposMediosVivienda($parametros);
            $this->msg = 1;
            //echo json_encode(array('Msg' => 1));
        } catch (Exception $e) {
            $this->msg = 3;
            $this->error = $exc->getMessage();
        }
    }

    public function getCargarTipoObraAction()
    {
        $idestructura = $this->_request->getPost('idestructura');
        $datos = $this->mRegNumModulo->getCargarTipoObra($idestructura);
        $this->datos = $datos;
        $this->total = count($datos);
    }

    public function gestSelladaPorAction()
    {
        $parametros['idpadre'] = $this->_request->getPost('idpadre');
        $datos = $this->mRegNumModulo->gestSelladaPor($parametros);
        $this->datos = $datos;
        $this->total = count($datos);
    }

    public function getNomDesignacionAction()
    {
        $idestructura = $this->_request->getPost('idestructura');
        $datos = $this->mRegNumModulo->getNomDesignacion($idestructura);
        $this->datos = $datos;
        $this->total = count($datos);
    }

    public function getNomCaractConstructivaAction()
    {
        $idestructura = $this->_request->getPost('idestructura');
        $result = $this->mRegNumModulo->getNomCaractConstructiva($idestructura);
        $this->datos = $result;
        $this->total = count($result);
    }

    public function getNomVentilacionAction()
    {
        $idestructura = $this->_request->getPost('idestructura');
        $result = $this->mRegNumModulo->getNomVentilacion($idestructura);
        $this->datos = $result;
        $this->total = count($result);
    }

    public function getNomComunicacionAction()
    {
        $idestructura = $this->_request->getPost('idestructura');
        $result = $this->mRegNumModulo->getNomComunicacion($idestructura);
        $this->datos = $result;
        $this->total = count($result);
    }

    public function getNomSistElectricoAction()
    {
        $idestructura = $this->_request->getPost('idestructura');
        $result = $this->mRegNumModulo->getNomSistEnergetico($idestructura);
        $this->datos = $result;
        $this->total = count($result);
    }

    public function getNomSeccionAction()
    {
        $idestructura = $this->_request->getPost('idestructura');
        $result = $this->mRegNumModulo->getNomSeccion($idestructura);
        $this->datos = $result;
        $this->total = count($result);
    }

    public function getLocalesObrasIngAction()
    {

        $parametros['start'] = $this->_request->getPost('start');
        $parametros['limit'] = $this->_request->getPost('limit');
        $parametros['idregnumerico'] = $this->_request->getPost('idregnumerico');

        $datos = $this->mRegNumModulo->getLocalesObrasIng($parametros);
        foreach ($datos['datos'] as $index => $value) {
            $datos['datos'][$index]['estadobd'] = 'guardado';
        }
        $this->datos = $datos;
        $this->total = count($datos);
    }

    public function cargarnomencladorlocalAction()
    {
        $parametros['start'] = $this->_request->getPost('start');
        $parametros['limit'] = $this->_request->getPost('limit');
        $parametros['identidad'] = $this->_request->getPost('idestructura');
        $parametros['idlocal'] = json_decode(stripcslashes($this->_request->getPost('arrRNnomostrar')));

        $datos = $this->mRegNumModulo->getNomLocal($parametros);
        $this->datos = $datos;
        $this->total = count($datos);
    }

    public function eliminarLocalesObrasIngAction()
    {
        try {
            $parametros['idregnumericoactivo'] = $this->_request->getPost('idregnumericoactivo');
            $parametros['ids'] = json_deliminarDatosContablesecode(stripcslashes($this->_request->getPost('ids')));

            $this->mRegNumModulo->eliminarLocalesObrasIng($parametros);
            $this->msg = 1;
        } catch (Exception $exc) {
            $this->msg = 3;
            $this->error = $exc->getMessage();
        }
    }

    public function getDatosObrasAsocAction()
    {
        $parametros['idregnumerico'] = $this->_request->getPost('idregnumerico');
        $datos = $this->mRegNumModulo->getDatosObrasAsoc($parametros);
        $this->datos = $datos;
        $this->total = count($datos);
    }

    public function eliminarDatosContablesAction()
    {

        try {
            $parametros['idregnumerico'] = $this->_request->getPost('idregnumericoactivo');
            $parametros['ids'] = json_decode(stripcslashes($this->_request->getPost('ids')));

            $this->mRegNumModulo->eliminarDatosContables($parametros);
            $this->msg = 1;
        } catch (Exception $exc) {
            $this->msg = 3;
            $this->error = $exc->getMessage();
        }
    }

    public function getDatosContablesAction()
    {

        $parametros['start'] = $this->_request->getPost('start');
        $parametros['limit'] = $this->_request->getPost('limit');
        $parametros['idregnumerico'] = $this->_request->getPost('idregnumerico');

        $datos = $this->mRegNumModulo->getDatosContables($parametros);
        foreach ($datos['datos'] as $index => $value) {
            $datos['datos'][$index]['estadobd'] = 'guardado';
            $datos['datos'][$index]['contabilidad'] = $value['nombre'].' '.$value['papel'].' '.$value['sapel'];
            $datos['datos'][$index]['resptecnico'] = $value['nombrert'].' '.$value['papelrt'].' '.$value['sapelrt'];
        }
        $this->datos = $datos;
        $this->total = count($datos);
        // echo json_encode($datos);
    }

    public function getObjetosObraCampAction()
    {

        $parametros['idarea'] = $this->_request->getPost('idarea');
        $parametros['id'] = json_decode(stripcslashes($this->_request->getPost('id')));
        $parametros['start'] = ($this->_request->getPost('start')) ? $this->_request->getPost('start') : 0;
        $parametros['limit'] = ($this->_request->getPost('limit')) ? $this->_request->getPost('limit') : 10;

        $datos = $this->mRegNumModulo->getObjetosObraCamp($parametros);
        $this->datos = $datos;
        $this->total = count($datos);
        // echo json_encode($datos);
    }

    public function getCaracTecnicasEstadoAction()
    {

        //$idregnumerico = $this->_request->getPost('idregnumerico');
        $datos = $this->mRegNumModulo->getCaracTecnicasEstado($this->uiParams);       
        foreach ($datos as $index => $value) {
            $datos[$index]['estadobd'] = 'guardado';
            $cantidad = count($value['DatMatConsInmuCamp']) - 1;           
            foreach ($value['DatMatConsInmuCamp'] as $indexdos => $value) {
                if ($indexdos == $cantidad)
                    $coma = "";
                else
                    $coma = ",";
                $datos[$index]['caracteristicas'].=$value['NomMaterialConstruccion'][0]['denominacion'].$coma;
                $datos[$index]['idmaterialesconstruccion'].=$value['NomMaterialConstruccion'][0]['idmaterialesconstruccion'].$coma;
                //$datos[$index]['idmaterialesconstruccionOrig'].=$value['NomMaterialConstruccion'][0]['idmaterialesconstruccion'].$coma;
            }
        }
        $this->datos = $datos;
        $this->total = count($datos);
    }

    public function getDestinoLocalesAction()
    {

        $parametros['start'] = $this->_request->getPost('start');
        $parametros['limit'] = $this->_request->getPost('limit');
        $parametros['idregnumerico'] = $this->_request->getPost('idregnumerico');

        $datos = $this->mRegNumModulo->getDestinoLocales($parametros);
        foreach ($datos['datos'] as $index => $value) {
            $datos['datos'][$index]['estadobd'] = 'guardado';
        }
        $this->datos = $datos;
        $this->total = count($datos);
        //echo json_encode($datos);
    }

    public function guardarRegistrosAction()
    {

        $parametros = $this->uiParams;
        $this->mRegNumModulo->guardarRegistroEspecialiadad($parametros);
        
        if ($parametros['cod_entidad'] == 'vivienda') {
            $resultado = $this->mRegNumModulo->guardarRegistroVivienda($parametros);
        }
        if ($parametros['cod_entidad'] == 'ingenieria') {
            $resultado = $this->mRegNumModulo->guardarRegistroIng($parametros);
        }
        if ($parametros['cod_entidad'] == 'constAloj') {
            $resultado = $this->mRegNumModulo->guardarRegistroCamp($parametros);
        }
        if($parametros['cod_entidad'] == 'sistemaEmp'){
            $resultado = $this->mRegNumModulo->guardarRegistroCamp($parametros);
        }


        if ($resultado == 1) {
            $this->msg = 1;
            // echo json_encode(array('Msg' => 1));
        } else {
            $this->msg = 2;
            //echo json_encode(array('Msg' => 2));
            //  }
            //  } catch (Exception $e) {
            //      echo json_encode(
            //              array('Msg' => 3, 'error' => $e->Message())
            //      );
        }
    }

    public function cargarnomencladorTipoMaterialAction()
    {
        $parametros = $this->uiParams;
        $parametros['idtipocontruccion'] = json_decode(stripcslashes($this->_request->getPost('arrRNnomostrar')));

        $datos = $this->mRegNumModulo->getNomTipoConstruccion($parametros);
        $this->datos = $datos;
        $this->total = count($datos);
        // echo json_encode(array('datos' => $datos));
    }

    public function cargarnomencladorMaterialConstAction()
    {
        $parametros['start'] = $this->_request->getPost('start');
        $parametros['limit'] = $this->_request->getPost('limit');
        $parametros['idpadre'] = $this->_request->getPost('id');
        $datos = $this->mRegNumModulo->getNomMaterialConstruccion($parametros);
        $this->datos = $datos;
        $this->total = count($datos);
        // echo json_encode(array('datos' => $datos));
    }

    public function cargarnomencladorSistemaConstructivoAction()
    {
        $datos = $this->mRegNumModulo->getNomSistemaConst($this->uiParams);
        $this->datos = $datos;
        $this->total = count($datos);
    }

    public function cargarRegistrosAction()
    {
        $parametros = $this->uiParams;
        if ($parametros['cod_entidad'] == 'constAloj' || $parametros['cod_entidad'] == 'sistemaEmp') {
            $dat = $this->mRegNumModulo->cargarRegistrosConstAloj($parametros);
        }
      /*  if ($parametros['cod_entidad'] == 'sistemaEmp') {
            $dat = $this->mRegNumModulo->cargarRegistrosSistemaEmp($parametros);
        }*/
        if ($parametros['cod_entidad'] == 'ingenieria') {
            $dat = $this->mRegNumModulo->cargarRegistrosIngenieria($parametros);
        }
        if ($parametros['cod_entidad'] == 'vivienda') {
            $dat = $this->mRegNumModulo->cargarRegistrosVivienda($parametros);
        }
       
        $this->datos = $dat;
    }
    
    public function eliminarDestinoLocalAction()
    {
        try {
            $parametros['idregnumerico'] = $this->_request->getPost('idregnumerico');
            $parametros['ids'] = json_decode(stripcslashes($this->_request->getPost('ids')));

            $this->mRegNumModulo->eliminarDestinoLocal($parametros);
            $this->msg = 1;
           // echo json_encode(array('Msg' => 1));
        } catch (Exception $exc) {
            $this->msg = 3;
            $this->error = $exc->getMessage();
           // echo json_encode(array('Msg' => 3, 'error' => $exc->getMessage()));
        }
    }
    
    public function eliminarCaracTecAction()
    {
        try {
            $parametros['idregnumerico'] = $this->_request->getPost('idregnumerico');
            $parametros['ids'] = json_decode(stripcslashes($this->_request->getPost('ids')));
            $this->mRegNumModulo->eliminarCaracTec($parametros);
            $this->msg = 1;
            //echo json_encode(array('Msg' => 1));
        } catch (Exception $exc) {
            $this->msg = 3;
            $this->error = $exc->getMessage();
            //echo json_encode(array('Msg' => 3, 'error' => $exc->getMessage()));
        }
    }

}
