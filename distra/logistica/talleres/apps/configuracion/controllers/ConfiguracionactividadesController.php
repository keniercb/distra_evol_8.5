<?php
/**
 * @class   ConfiguracionActividadesController
 * @author  Daniel Arias Espinosa
 * @version 1.1
 */
if (!class_exists('BaseModel')) {
    $dir = Zend_Registry::getInstance()->get('config')->dir_aplication . '/logistica/utiles/comun/config.php';
    include_once $dir;
    set_include_path(
        get_include_path() . PATH_SEPARATOR . $config['include_path']
    );
}

class ConfiguracionactividadesController extends BaseController
{
    private $_modelo;

    function init()
    {
        parent::init('log.tall.configuracion');
        $this->_modelo = new ConfiguracionActividadesModel();
    }

    public function configuracionactividadesAction()
    {
        $this->autoShow = false;
        $this->render();
    }

    public function adicionarActividadAction()
    {

        $params = Zend_Json::decode($this->uiParams['data']);

        $this->_modelo->adicionarActividad($params);
    }

    public function duplicarActividadAction()
    {
        $params = Zend_Json::decode($this->uiParams['data']);
        $this->_modelo->duplicarActividad($params);
    }

    public function eliminarActividadAction()
    {
        $this->_modelo->eliminarActividad($this->uiParams);
    }

    public function adicionarNormaAction()
    {
        $this->_modelo->adicionarNorma($this->uiParams);
    }

    public function eliminarNormaAction()
    {
        $this->_modelo->eliminarNorma($this->uiParams);
    }

    /**
     * @descripcion:Devuelve los servicios y actividades ya configuraqados.
     */
    public function cargarActividadesAction()
    {
        $result = $this->_modelo->cargarActividades($this->uiParams);
        $this->datos = $result['datos'];
        $this->cantidad = $result['cantidad'];
    }

    /**
     * @descripcion: devuelve todos los servicios del maestro de productos.
     */
    public function cargarServiciosAction()
    {

        $result = $this->_modelo->cargarServiciosDelMaestro($this->uiParams);
        $this->datos = $result['datos'];
        $this->cantidad = $result['cantidad'];
    }

    /**
     * @descripcion: Devuelve los indicadores asociados a una actividad.
     */
    public function cargarNormasAction()
    {
        $result = $this->_modelo->cargarNormas($this->uiParams);
        $this->datos = $result['datos'];
        $this->cantidad = $result['cantidad'];

    }

    /**
     * @descripcion: Devuelve los indicadores del maestro y productos q son productos.
     */
    public function cargarIndicadoresAction()
    {
        $result = $this->_modelo->cargarIndicadores($this->uiParams);
        $this->datos = $result['datos'];
        $this->cantidad = $result['cantidad'];
    }

    /**
     * @descripcion: Devuelve los indicadores del maestro y productos q son productos.
     */
    public function usaEnLaEntidadAction()
    {
        $this->success = $this->_modelo->usaEnLaEntidad($this->uiParams);
    }

    public function adicionarNormasAction()
    {
        $idactividad = $this->uiParams['idactividad'];
//       $idIndicadores = json_decode($this->uiParams['idIndicadores']);
        $listaindicadores = Zend_Json::decode($this->uiParams['listaindicadores']);
        $this->success = $this->_modelo->adicionarNormas($idactividad, $listaindicadores);
    }

    public function guardarNormasAction()
    {
        $normas = json_decode($this->uiParams['normas']);
        $this->success = $this->_modelo->guardarNormas($normas);
    }

    public function eliminarNormasAction()
    {
        $listaidnormas = Zend_Json::decode($this->uiParams['listaidnormas']);
        $this->success = $this->_modelo->eliminarNormas($listaidnormas);
    }

}