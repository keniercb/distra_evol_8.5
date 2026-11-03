<?php

/**
 * @class ReplicardatosController
 * (Descripcion de la clase, objetivo) *
 * @package Inventario
 * @subpackage ExistenciaUnidades
 * @author Maricet Estevez
 * @copyright XETID
 * @version 1.0
 */
if (!class_exists('BaseModel')) {
    $dir = Zend_Registry::getInstance()->get('config')->dir_aplication . '/logistica/utiles/comun/config.php';
    include_once $dir;
    set_include_path(get_include_path() . PATH_SEPARATOR . $config['include_path']);
}

class ReplicardatosController extends BaseController
{
    /**
     * @var ExistenciaUnidadesModel
     */
    private $model;

    function init()
    {
        parent::init('log.inv.replicar');
        $this->model = new ExistenciaUnidadesModel();
        $this->openConectionBD();
    }

    public function gesreplicadatosAction()
    {
        $this->autoShow = false;
        $this->controllerConfig = 'log';
        $this->prepareView();
        try {
            $gis = $this->integrator->gis->DevolverJS();
        } catch (Exception $ex) {
            
        }

        $this->view->arrayJs = array($gis, $this->integrator->metadatos->obtenerIUEstructura());
        $this->view->uiVariables = array_merge($this->view->uiVariables,
            array(
            'existeGenesig' => 'true'
        ));
        $this->initComponent('log.inv.replicar');
        $this->rendertemplate();
    }

    /**
     * Metodo para abrir la conexion al data werehouse
     */
    public function openConectionBD()
    {
        $this->model->getConexion();
    }

    /**
     * Metodo para cargar el arbol de estuctura
     */
    public function cargarEstructurasAction()
    {
        $this->autoShow = false;
        $estructura = array();
        if ($this->uiParams['node'] == 0) {
            $estructura[] = $this->global->Estructura->idestructura;
        } else {
            $estructura[] = $this->uiParams['node'];
        }
        if ($this->uiParams['tipo'] == 1) {
            $hijos = $this->estructuraHelper->buscarHijoPorSubordinacion(
                $estructura, array($this->uiParams['tiposubordinacion'])
            );
            foreach ($hijos as $pos => $value) {
                if ($value->codigo) {
                    $hijos[$pos]->text = $value->codigo;
                }
                $hijos[$pos]->checked = false; //$this->uiParams['checked'] == 'true';
            }
            $this->jsonResponse($hijos);
        } else {
            $this->jsonResponse($this->model->cargarEstructurasInternas($this->uiParams));
        }
    }

    /**
     * Metodo para cargar los movimientos por cada producto
     */
    public function cargarMovimientoAction()
    {
        $this->objectHelper->synchronize($this, $this->model->cargarMovimiento($this->uiParams));
    }

    public function cargarPartidasAction()
    {
        $this->objectHelper->synchronize($this, $this->model->cargarPartidas($this->uiParams));
    }

    /**
     * Metodo para cargar la existencia por unidades de cada indicador
     */
    public function cargarExistenciasxUnidadAction()
    {
        $this->uiParams['idestructuras'] = $this->objectHelper->stdClassToArray(
            Zend_Json::decode($this->uiParams['idestructuras'])
        );
        $this->uiParams['idareas'] = $this->objectHelper->stdClassToArray(
            Zend_Json::decode($this->uiParams['idareas'])
        );
        $this->uiParams['idindicadores'] = $this->objectHelper->stdClassToArray(
            Zend_Json::decode($this->uiParams['idindicadores'])
        );
        if ($this->uiParams['reporte'] == 1) {
            $this->objectHelper->synchronize($this, $this->model->cargarExistenciasxUnidad($this->uiParams));
        } else {
            $this->objectHelper->synchronize($this, $this->model->existenciasEntidad($this->uiParams));
        }
    }

    public function cargarComboDespositosAction()
    {
        $this->datos = $this->model->cargarDepositos($this->uiParams);
    }

    public function obtenerEstructurasAction()
    {
        $this->uiParams['idestructuras'] = $this->objectHelper->stdClassToArray(
            Zend_Json::decode($this->uiParams['idestructuras'])
        );
        $this->uiParams['idareas'] = $this->objectHelper->stdClassToArray(
            Zend_Json::decode($this->uiParams['idareas'])
        );
        $this->uiParams['idindicadores'] = $this->objectHelper->stdClassToArray(
            Zend_Json::decode($this->uiParams['idindicadores'])
        );
        if ($this->uiParams['reporte'] == 1) {
            $this->jsonResponse($this->model->getEstructuras($this->uiParams));
        } else {
            $this->jsonResponse($this->model->getEstructurasInternas($this->uiParams));
        }
    }

    public function obtenerSubordinacionesAction()
    {
        $this->datos = $this->estructuraHelper->obtenerSubordinaciones(false, 500, 0);
    }

    public function getIdIndicadoresAction()
    {
        $this->uiParams['identidades'] = json_decode($this->uiParams['identidades']);
        $this->datos = $this->model->obtenerIndicadores($this->uiParams);
    }

    public function cargarNroSerieAction()
    {
        $this->objectHelper->synchronize($this, $this->model->cargarNroSerie($this->uiParams));
    }

    public function cargarNroSerieActivoAction()
    {
        $this->objectHelper->synchronize($this, $this->model->cargarNroSerieActivo($this->uiParams));
    }

    public function exportarNroSerieAction()
    {
        $this->dirFichero = $this->model->exportarNroSerie($this->uiParams);
    }

    public function exportarPartidasAction()
    {
        $this->dirFichero = $this->model->exportarPartidas($this->uiParams);
    }

    public function exportarExistenciaAction()
    {
        $filtro['start'] = isset($filtro['start'])? $filtro['start'] : 0 ;
        $filtro['limit'] = isset($filtro['limit'])? $filtro['limit'] : 30 ;
        $this->uiParams['idestructuras'] = $this->objectHelper->stdClassToArray(
            Zend_Json::decode($this->uiParams['idestructuras'])
        );
        $this->uiParams['idareas'] = $this->objectHelper->stdClassToArray(
            Zend_Json::decode($this->uiParams['idareas'])
        );
        $this->uiParams['idindicadores'] = $this->objectHelper->stdClassToArray(
            Zend_Json::decode($this->uiParams['idindicadores'])
        );
        $this->dirFichero = $this->model->exportarExistencia($this->uiParams);
    }

    public function exportarNroSerieActivoAction()
    {
        $this->dirFichero = $this->model->exportarNroSerieActivo($this->uiParams);
    }

}
