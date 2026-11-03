<?php

/**
 * Clase base para la gestion de los productos
 *
 * @package    Logistica
 * @subpackage Utiles
 * @author     Kenier Cumba Bueno
 */

if (!class_exists('BaseModel')) {
    $dir = Zend_Registry::getInstance()->get('config')->dir_aplication . '/logistica/utiles/comun/config.php';
    include_once $dir;
    set_include_path(get_include_path() . PATH_SEPARATOR . $config['include_path']);
}

class ProductoController extends BaseController
{

    /**
     * Modelo de logica de negocio de productos
     *
     * @var LogisticaProductoModel
     */
    private $productoModel;

    /**
     * Funcion que inicializa el controlador frontal
     */
    public function init()
    {
        parent::init('log.lb.producto');
        $this->productoModel = new LogisticaProductoModel();
    }

    /**
     * Accion que devuelve los productos
     */
    public function cargarproductosAction()
    {
        $this->uiParams['asentado'] = true;
        $this->unsetParam('idEspecialidad');
        $this->unsetNullValues($this->uiParams['codigoauxiliar']);
        $this->uiParams['tipoproducto'] = $this->objectHelper->stdClassToArray(
            Zend_Json::decode($this->uiParams['tipoproducto'])
        );
        if ($this->uiParams['idnaturalezaexcluir']) {
            $this->uiParams['idnaturalezaexcluir'] = json_decode(
                stripcslashes($this->uiParams['idnaturalezaexcluir'])
            );
        }
        $result = $this->productoModel->cargarProductos($this->uiParams);
        $this->datos = $result['datos'];
        $this->cantidad = $result['cantidad'];
    }

    public function adicionarProductoAction()
    {
        $this->uiParams['data'] = (array)Zend_Json::decode($this->uiParams['data']);
        $this->uiParams = array_merge($this->uiParams, $this->uiParams['data']);
        $this->uiParams['arridindicador'] = (array)Zend_Json::decode($this->uiParams['arridindicador']);
        $dataProdcuto = count($this->uiParams['arridindicador']) ?
            $this->uiParams['arridindicador'] : array($this->uiParams);
        $this->success = $this->productoModel->adicionarProductoEstructuras($dataProdcuto);
    }

    public function cargarNomencladorAction()
    {
        $result = $this->productoModel->devolverNomenclador($this->uiParams);
        $this->datos = $result['datos'];
        $this->cantidad = $result['cantidad'];
    }

    public function cargarUMedidaAction()
    {
        /*$this->uiParams['bandera'] = true;
        $this->datos = $this->configuracionHelper->obtenerUMedidasConfIndicador($this->uiParams);*/
    }

    public function cargarAreasXDepositoAction()
    {
        $objUbicService = new UtilesubicacionService();
        $this->datos = $objUbicService->devolverAreasPorDeposito($this->uiParams['idestructura']);
    }

}
