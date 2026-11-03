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
        parent::init('log.aft.modulo');
        $this->mRegNumModulo = new RegNumericoModuloModel();
        $this->mProdModLogico = new ProdModuloLogicoModel();

        $this->sAyuda = ServiciosAyudaHelper::__init();
        $this->sEstrucComp = ServiciosEstructuraComposicionHelper::__init();
        $this->sConfGeneral = ServiciosConfiguracionGeneralHelper::__init();

        $this->view->jsArbolMarcaModelo = NomgeneralesProxyService::getJSNomMarcaModelo();
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
                'alternativa' => $alternativa == 1 ? 'true' : 'false',
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
        $this->initComponent('log.aft.modulo');
        $this->renderTemplate();
    }

    /**
     *  Mostrar la entidad por la cual el usuario está autentificado
     */
    public function getentidadAction()
    {
        $cEstructura = 'Estructura';
        //$entidad = $this->sEstrucComp->getEstructura($this->global->$cEstructura->idestructura);
        $entidad = $this->integrator->metadatos->DameEstructura($this->global->$cEstructura->idestructura);

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
        /*Para que los datos de patrimonio no salgan en AFT*/
        $idnatObjObra = IntegracionNomencladoresModel::NATURALEZA_OBJETODEOBRA;
        $idnatInmueble = IntegracionNomencladoresModel::NATURALEZA_INMUEBLE;
       // $idnatActivos = IntegracionNomencladoresModel::NATURALEZA_ACTIVOS;
        $parametros['idnaturalezaexcluir'] = array($idnatObjObra ,$idnatInmueble/*, $idnatActivos*/);       
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
        $sRegNumActivo = new RegNumActivoService();

        ComunAFTModel::getInstance()->configStartAndLimitInParams(
            $this->uiParams, $this->uiParams['start'], $this->uiParams['limit']
        );

        $this->uiParams['asignado'] = 1;
        $this->uiParams['idestructuraop'] = $this->uiParams['idarea'];

        if ($this->uiParams['idnodoPadre']) {
            //$estructura = $this->sEstrucComp->getEstructura($this->uiParams['idnodoPadre']);
            $estructura = $this->integrator->metadatos->DameEstructura($this->uiParams['idnodoPadre']);
            $this->uiParams['idespecialidad'] = $estructura[0]->idespecialidad;
        }
        $idnatObjObra = IntegracionNomencladoresModel::NATURALEZA_OBJETODEOBRA;
        $idnatINMUEBLE = IntegracionNomencladoresModel::NATURALEZA_INMUEBLE;
        //$idnatActivos = IntegracionNomencladoresModel::NATURALEZA_ACTIVOS;
        $this->uiParams['idnaturalezaexcluir'] = array($idnatObjObra, $idnatINMUEBLE/*, $idnatActivos*/);
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
        ComunAFTModel::getInstance()->configStartAndLimitInParams(
            $this->uiParams, $this->uiParams['start'], $this->uiParams['limit']
        );

        $this->objectHelper->synchronize(
            $this,
            ComunAFTModel::getInstance()->getPaises(
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
        $parametros->idarbol = $this->uiParams['idarbol'];

        try {
            $this->mRegNumModulo->adicionarModulo($parametros);
            $this->msg = 1;
        } catch (Exception $e) {
            $this->msg = 3;
            $this->error = $e->getMessage();
        }
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

        ComunAFTModel::getInstance()->configStartAndLimitInParams(
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

}
