<?php

/**
 * Description of MaestroproductosController
 * @author        Kenier Cumba Bueno
 * @copyright (c) 2014, XETID
 * @version       1.0
 */
if (!class_exists('BaseModel')) {
    $dir = Zend_Registry::getInstance()->get('config')->dir_aplication . '/logistica/utiles/comun/config.php';
    include_once $dir;
    set_include_path(get_include_path() . PATH_SEPARATOR . $config['include_path']);
}

class MaestroproductosController extends BaseController
{

    private $maestroProductoModel;
    /**
     * @var TrazasMaestroProductosModel
     */
    private $trazasMpModel;

    public function init()
    {
        parent::init('log.lb.maestroproductos');
        LogisticaGlobal::__reset();
        $flagCentros = LogisticaGlobal::__init()->getConfig('compartimentar_centro_balance') == 1 ? true : false;
        $this->maestroProductoModel = new MaestroProductoModel();
        $this->setDefaultParam('limit', 30);
        $this->setDefaultParam('start', 0);
        $this->maestroProductoModel->setfiltrarCentros($flagCentros);
        $this->trazasMpModel = new TrazasMaestroProductosModel();
    }

    public function maestroProductosAction()
    {
        $this->autoShow = false;
        $this->controllerConfig = 'log';
        $this->prepareView();
        $this->view->arrayJs = array(
            $this->configuracionHelper->mostrarNomencladoresGenerales(),
            $this->configuracionHelper->getJSAtributosDinamicos(),
            $this->configuracionHelper->getSJArbolAgrupaciones()
        );
        $this->initComponent('log.lb.maestroproductos');
        $planificacion = true;
        $cfgUsuarioEsp = new CfgUsuarioespecialidad();
        if ($this->jsonComponent->getComponent('log.inv.municiones', true)) {
            $configEspecialidad = $cfgUsuarioEsp->devolverConfiguracionEspecialidad(
                $this->global->Perfil->idusuario, $this->view->uiVariables['espArmamento']
            );
        }
        $this->view->uiVariables = array_merge(
            array(
                'planificacion' => json_encode($planificacion),
                'generarcodigo' => $this->maestroProductoModel->getConfigCodigo()[0]['gencodigo'] == 1 ? 'true' : 'false',
                'confArmamento' => empty($configEspecialidad->idespecialidad) ? 'false' : 'true'
            ), $this->view->uiVariables
        );
        //print_r($this->view->uiVariables);die;
        $this->renderTemplate();
    }

    public function adicionarClasificadorAction()
    {
        $nivelSurtido = $this->uiParams['nivelsurtido'];
        $this->uiParams['data'] = $this->objectHelper->stdClassToArray(Zend_Json::decode($this->uiParams['data']));
        $this->uiParams['datosvisualizacion'] = $this->objectHelper->stdClassToArray(Zend_Json::decode($this->uiParams['datosvisualizacion']));
        $this->uiParams = array_merge($this->uiParams, $this->uiParams['data']);
        if ($this->uiParams['fechainicio']) {
            $this->setDefaultParam('fechainicio', date('Y-m-d'));
        }

        $this->unsetParam('data');
        $this->unsetParam('nivel');
        $this->uiParams['nivelsurtido'] = $nivelSurtido;

        if (($this->uiParams['idespecialidad'] == -1 || is_null($this->uiParams['idespecialidad'])) &&
            is_null($this->uiParams['idindicador'])
        ) {
            $this->uiParams['idespecialidad'] = null;
            $this->setDefaultParam('idespecialidad', $this->global->Estructura->idespecialidad);
        } else {
            if (!is_null($this->uiParams['idindicador'])) {
                $this->unsetParam('idespecialidad');
            }
        }
        if ($this->uiParams['codigo'] != '') {
            $this->uiParams['codigo'] = $this->uiParams['codigoPadre'] . '' . $this->uiParams['codigo'];
        }
        $this->unsetParam('codigoPadre');
        /*$this->unsetParam('idpadre'); esto para que lo pusieron*/
        $this->uiParams['idpadre'] = $this->uiParams['idpadreOK'];
        $this->objectHelper->unsetNullValues($this->uiParams);
        $this->setDefaultParam('balanceable', 0);
        $saveResult = $this->maestroProductoModel->adicionarNodoClasificador($this->uiParams);
        $this->objectHelper->synchronize($this, $saveResult);
        if ($saveResult['idindicador']) {
            $this->trazasMpModel->addTraza(is_null($this->uiParams['idindicador']) ? 1 : 2, $saveResult['idindicador'], $this->global->Perfil->idusuario);
        }
    }

    public function eliminarClasificadorAction()
    {
        $this->uiParams['id'] = (array)Zend_Json::decode($this->uiParams['id']);
        $this->success = $this->maestroProductoModel->eliminarNodoClasificador($this->uiParams['id']);
        foreach ($this->uiParams['id'] as $objectId){
            $this->trazasMpModel->addTraza(3, $objectId, $this->global->Perfil->idusuario);
        }
    }

    public function cargarArbolClasificadorAction()
    {
        $this->uiParams['actual'] = true;
        $this->jsonResponse($this->maestroProductoModel->cargarArbolNomenclador($this->uiParams));
    }

    public function cargarFormatosAction()
    {
        $formatos = $this->maestroProductoModel->getFormatosConfigurados();
        if (count($formatos) == 0) {
            $formatos = $this->configuracionHelper->buscarFormatosPorSubsist(
                $this->global->Estructura->idestructura, LogisticaGlobal::SUBSISTEMA_MAESTRO
            );
        }

        $this->datos = $this->partesFormato($formatos);
    }

    public function cargarCentrosBalanceAction()
    {
        $this->datos = $this->maestroProductoModel->cargarCentrosBalance();
    }

    public function cargarPlanesAction()
    {
        $this->datos = $this->maestroProductoModel->cargarPlanes();
    }

    public function cargarPartesFormatoAction()
    {
        $this->datos = $this->configuracionHelper->buscarParteFormato($this->uiParams['idformato']);
    }

    public function cargarGridClasificadorAction()
    {
        $this->setDefaultParam('restringir', 1);
        $this->uiParams['actual'] = true;
        if ($this->uiParams['idnaturalezaexcluir']) {
            $this->uiParams['idnaturalezaexcluir'] = json_decode(stripcslashes($this->uiParams['idnaturalezaexcluir']));
        }
        $this->objectHelper->synchronize($this, $this->maestroProductoModel->cargarGridNomenclador($this->uiParams));
    }

    public function habilitarClasificadorAction()
    {
        $this->uiParams['id'] = (array)Zend_Json::decode($this->uiParams['id']);
        $this->success = $this->maestroProductoModel->habilitarNomencladores(
            $this->uiParams['id'], (bool)$this->uiParams['deshabilitar']
        );
        foreach ($this->uiParams['id'] as $objectId){
            $this->trazasMpModel->addTraza(4, $objectId, $this->global->Perfil->idusuario);
        }
    }

    public function aprobarClasificadorAction()
    {
        $this->uiParams['id'] = (array)Zend_Json::decode($this->uiParams['id']);
        $this->success = $this->maestroProductoModel->aprobarNomencladores($this->uiParams);
        foreach ($this->uiParams['id'] as $objectId){
            $this->trazasMpModel->addTraza(5, $objectId, $this->global->Perfil->idusuario);
        }
    }

    public function setNivelPlanificacionAction()
    {
        $this->uiParams['id'] = (array)Zend_Json::decode($this->uiParams['id']);
        $this->datos = array(
            'cambio' => $this->maestroProductoModel->establecerNivelPlanificacion($this->uiParams['id'])
        );
        foreach ($this->uiParams['id'] as $objectId){
            $this->trazasMpModel->addTraza(6, $objectId, $this->global->Perfil->idusuario);
        }
    }

    public function cargarPaisesAction()
    {
        $this->datos = $this->configuracionHelper->obtenerPaisesEntidad($this->global->Estructura->idestructura);
    }

    public function getImagenesIndicadorAction()
    {
    }

    public function cargarItemsServicioAction()
    {
        $this->setDefaultParam('idservicio', -1);
        $this->objectHelper->synchronize(
            $this, $this->maestroProductoModel->devolverProductosServicio($this->uiParams)
        );
    }

    public function cargarTreeGridIndiacadoresAction()
    {
//        $this->autoShow = false;
        if ($this->uiParams['idEspecialidad'] == -1) {
            $this->unsetParam('idEspecialidad');
        }
        $this->uiParams['actual'] = true;
        $this->setDefaultParam('node', $this->uiParams['anode']);
        $this->uiParams['treeSearch'] = $this->uiParams['criterio'];
        $this->unsetParam('anode');
        $this->unsetParam('criterio');
        $this->objectHelper->synchronize(
            $this, $this->maestroProductoModel->cargarGridNomenclador($this->uiParams, false, true)
        );
    }

    public function cargarGridIndicadoresVistaUnaColumnaAction()
    {

        if ($this->uiParams['idEspecialidad'] == 990000000332) {
            $treegrid = false;
        } else {
            $treegrid = true;
        }
        //print_r($this->uiParams);die;
        $this->uiParams['actual'] = true;
        $this->uiParams['GridVistaUnaColumn'] = true;
        $this->unsetParam('anode');
        $this->setDefaultParam('limit', 30);
        $this->setDefaultParam('start', 0);
        $this->objectHelper->synchronize(
            $this, $this->maestroProductoModel->cargarGridNomencladorVistaUnaColumna($this->uiParams, false, $treegrid)
        );
        return false;
    }


    public function getModelosAction()
    {
        $parametros = $this->uiParams;
        $parametros['denominacion'] = $parametros['query'];
        $datos = $this->configuracionHelper->obtenerModelos($parametros);
        $this->datos = $datos['datos'];
        $this->cantidad = $datos['cantidad'];
    }

    public function getMarcasAction()
    {
        // print_r($this->uiParams);die;
        $parametros = $this->uiParams;
        $parametros['denominacion'] = $parametros['query'];
        $parametros['idmarca'] = null;
        $datos = $this->configuracionHelper->obtenerMarcas($parametros);
        $this->datos = $datos['datos'];
        $this->cantidad = $datos['cantidad'];
    }

    public function devolverIndicadorAction()
    {
        $this->uiParams['id'] = (array)Zend_Json::decode($this->uiParams['id']);
        $this->datos = $this->maestroProductoModel->devolverIndicadorById($this->uiParams['id']);
    }

    public function partesFormato($formatos)
    {
        foreach ($formatos as &$f) {
            $f->partes = $this->configuracionHelper->buscarParteFormato($f->idformato);
        }
        return $formatos;
    }

    /**
     * Devuelve las unidades de medidas configuradas para el indicador
     */
    public function cargarComboUMAction()
    {
        $this->jsonResponse($this->maestroProductoModel->cargarComboUM($this->uiParams));
    }

    /**
     * Devuelve los factores de conversion de las unidades de medida.
     */
    public function cargarFactorConversionAction()
    {
        $this->objectHelper->synchronize($this, $this->maestroProductoModel->cargarFactorConversion($this->uiParams));
    }

    /**
     * Devuelve los factores de conversion de las unidades de medida.
     */
    public function adicionarFactorConversionAction()
    {
        $this->uiParams['data'] = $this->objectHelper->stdClassToArray(Zend_Json::decode($this->uiParams['data']));
        $this->success = $this->maestroProductoModel->adicionarFactorConversion($this->uiParams['data']);
    }

    /**
     * Devuelve los factores de conversion de las unidades de medida.
     */
    public function eliminarFactorConversionAction()
    {
        $this->uiParams['id'] = $this->objectHelper->stdClassToArray(Zend_Json::decode($this->uiParams['id']));
        $this->success = $this->maestroProductoModel->eliminarFactorConversion($this->uiParams['id']);
    }

    /**
     * Devuelve los nodos del arbol elementos de planificacion
     */
    public function cargarArbolPlanificacionAction()
    {
        $this->autoShow = false;
        echo json_encode($this->maestroProductoModel->cargarArbolPlanificacion($this->uiParams['id']));
    }

    /**
     * envia la asociacion entre viaadquisicion y organos
     */
    public function asociarPlanificacionAction()
    {
        $this->objectHelper->synchronize(
            $this, $this->maestroProductoModel->asociarPlanificacion($this->uiParams));

        //  $this->success=$this->maestroProductoModel->asociarPlanificacion($this->uiParams);
    }

    /**
     * desocia la viaadquisicion y el organos
     */
    public function desasociarPlanificacionAction()
    {

        $this->maestroProductoModel->desasociarPlanificacion($this->uiParams);
        //  $this->success=$this->maestroProductoModel->asociarPlanificacion($this->uiParams);
    }

    /**
     * Funcionalidad dia cero
     */
    public function DayCeroAction()
    {
        $this->maestroProductoModel->DayCero($this->uiParams);
    }

    public function obtenerElementosAction()
    {
        $datos = ServiciosContabilidadFinanzasHelper::__init()->
        obtenerElementosHoja(200530666);
        foreach ($datos as &$d) {
            $d->descripcion = $d->codigoelementoobjeto . ' ' . $d->descripcionelementoobjeto;
        }
        $this->datos = $datos;
    }

    public function cargarCodigosAction()
    {
        $this->setDefaultParam('limit', 30);
        $this->setDefaultParam('start', 0);
        $this->objectHelper->synchronize($this, $this->maestroProductoModel->getDatosByIndicador($this->uiParams));
    }

    public function cargarClientesAction()
    {
        $this->unsetNullValues($this->uiParams);
        $this->setDefaultParam('limit', 30);
        $this->setDefaultParam('start', 0);
        $this->objectHelper->synchronize($this, $this->maestroProductoModel->getDatosByCodigoIndicador($this->uiParams));
    }

    public function cargarClientesServiceAction()
    {
        $this->setDefaultParam('limit', 30);
        $this->setDefaultParam('start', 0);
        $this->objectHelper->synchronize($this, $this->maestroProductoModel->getClientesService($this->uiParams));
    }

    public function adicionarCodigoAction()
    {
        $this->uiParams['data'] = $this->objectHelper->stdClassToArray(Zend_Json::decode($this->uiParams['data']));
        $this->objectHelper->synchronize(
            $this, $this->maestroProductoModel->adicionarCodigo($this->uiParams)
        );
    }

    public function adicionarClientesAction()
    {
        $this->uiParams['data'] = $this->objectHelper->stdClassToArray(Zend_Json::decode($this->uiParams['data']));
        $this->objectHelper->synchronize(
            $this, $this->maestroProductoModel->adicionarClientes($this->uiParams)
        );
    }

    public function eliminarElementosAction()
    {
        $this->uiParams['arrayAuxiliar'] = (array)Zend_Json::decode($this->uiParams['arrayAuxiliar']);
        $this->success = $this->maestroProductoModel->eliminarElementos($this->uiParams);
    }

    public function getConjuntoIndicadorAction()
    {
        $this->objectHelper->synchronize(
            $this, $this->maestroProductoModel->getConjuntoIndicador($this->uiParams)
        );
    }

    public function eliminarConjuntoAction()
    {
        $this->success = $this->maestroProductoModel->eliminarConjunto($this->uiParams);
    }

    public function eliminarImportarAction()
    {
        $this->objectHelper->synchronize($this, $this->maestroProductoModel->eliminarImportar($this->uiParams));
    }

    public function cargarProductoErrorAction()
    {
        $this->setDefaultParam('start', 0);
        $this->setDefaultParam('limit', 30);
        $this->objectHelper->synchronize($this, $this->maestroProductoModel->cargarProductoError($this->uiParams));
    }

    public function getTipoEnvaseAction()
    {
        $this->objectHelper->synchronize($this, $this->maestroProductoModel->getTipoEnvase());
    }

    public function exportarErrorAction()
    {
        $this->objectHelper->synchronize($this, $this->maestroProductoModel->exportarError($this->uiParams));
    }

    public function generarCodigoBarrasProductoErrorAction()
    {
        $this->objectHelper->synchronize($this, $this->maestroProductoModel->generarCodigoBarrasProductoError($this->uiParams));
    }
	
	public function generarCodigoBarrasGeneralAction()
    {
        $this->objectHelper->synchronize($this, $this->maestroProductoModel->generarCodigoBarrasGeneral($this->uiParams));
    }
}
