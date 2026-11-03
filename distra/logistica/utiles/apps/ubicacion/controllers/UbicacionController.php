<?php

/* Esta clase controla todas las ubicaciones
 * @copyright Xetid
 * @author División Gestión de Entidades
 * @versión 1.0
 */

if (!class_exists('BaseModel')) {
    $dir = Zend_Registry::getInstance()->get('config')->dir_aplication . '/logistica/utiles/comun/config.php';
    include_once $dir;
    set_include_path(get_include_path() . PATH_SEPARATOR . $config['include_path']);
}

class UbicacionController extends BaseController
{
    /**
     * @var UbicacionModel
     */
    private $ubicacion,
        /**
         * @var DatEstructuraubicacionModel
         */
        $estructuraubic,
        $serviciosUbicacion;

    public function init()
    {
        parent::init('log.lb.ubicacion');
        $this->serviciosUbicacion = LogisticaEstructuraUbicHelper::__init();
        $configuracionService = new ConfiguracioninventarioService();
        $config = $configuracionService->devolverConfiguracion($this->global->Estructura->idestructura);
        $this->ubicacion = new UbicacionModel();
        $this->estructuraubic = new DatEstructuraubicacionModel();

        $this->view->uiVariables = array_merge(
            array('usarCategoria' => $this->objectHelper->getBooleanStr($config['usarcategoria'])),
            $this->view->uiVariables
        );
    }

    function ubicacionAction()
    {
        $this->autoShow = false;
        $this->controllerConfig = 'log';
        $this->prepareView();
        $this->initComponent('log.lb.ubicacion');
        $this->renderTemplate();
    }

    /**
     * Devuelve las ubicaciones para el treecombo.
     */
    public function cargarComboUbicacionAction()
    {
        $this->autoShow = false;
        $params = $this->uiParams;
        if (!$this->uiParams['node'] && isset($this->uiParams['_node'])) {
            $params['node'] = $this->uiParams['_node'];
        }
        if (!$params['simple']) {
            $nivel = ($params['nivel']) ? $params['nivel'] : -1;
            $ultimoNivel = ($params['ultimo_nivel']) ? $params['ultimo_nivel'] : -1;
            if ($params['node'] == 0) {
                $arrayDepositos = $this->serviciosUbicacion->cargardepositos();
                $cont = 0;
                foreach ($arrayDepositos['depositos'] as $deposito) {
                    $cont = $cont + 1;
                    $obj = new stdClass();
                    $obj->id = $deposito['iddeposito'];
                    $obj->text = $deposito['deposito'];
                    $dat = $this->ubicacion->calcularEstado($params['node']);
                    $obj->capacidad = $dat['capacidad'];
                    $obj->volumen = $dat['volumen'];
                    $obj->peso = $dat['peso'];
                    $arbolDepositos[] = $obj;
                }
                echo json_encode($arbolDepositos);
            } else {
                $arreglo = $this->estructuraubic->ObtenerEstructurasUbicacion($params['node'], $nivel, $ultimoNivel);
                foreach ($arreglo as $pos => $value) {
                    $estado = $this->ubicacion->calcularEstado($value['idestructuraubicacion']);
                    $arreglo[$pos]['capacidad'] = ($estado['capacidad']) ? $estado['capacidad'] : -1;
                    $arreglo[$pos]['peso'] = ($estado['peso']) ? $estado['peso'] : -1;
                    $arreglo[$pos]['volumen'] = ($estado['volumen']) ? $estado['volumen'] : -1;
                }
                echo json_encode($arreglo);
            }
        } else {
            $valores = $this->estructuraubic->obtenerUltimoNivelDeposito($params['iddeposito']);
            foreach ($valores as $pos => $value) {
                $estado = $this->ubicacion->calcularEstado($value['idestructuraubicacion']);
                $valores[$pos]['capacidad'] = ($estado['capacidad']) ? $estado['capacidad'] : -1;
                $valores[$pos]['peso'] = ($estado['peso']) ? $estado['peso'] : -1;
                $valores[$pos]['volumen'] = ($estado['volumen']) ? $estado['volumen'] : -1;
            }
            echo json_encode(array('datos' => $valores));
        }
    }

    /**
     * Devuelve los productos del grid principal.
     */
    public function cargarProductosUbicarAction()
    {
        $this->objectHelper->synchronize($this, $this->ubicacion->cargarProductosUbicar($this->uiParams));
    }

    /**
     * Ubica los productos.
     */
    public function ubicarProductoAction()
    {
        $this->uiParams['data'] = $this->objectHelper->stdClassToArray(Zend_Json::decode($this->uiParams['data']));
        $this->uiParams = array_merge($this->uiParams, $this->uiParams['data']);
        unset($this->uiParams['data']);
        $this->datos = $this->ubicacion->ubicarProducto($this->uiParams);
    }

    /**
     * Devuelve las ubicaciones del producto.
     */
    public function cargarUbicacionesProductoAction()
    {
        $this->objectHelper->synchronize($this, $this->ubicacion->cargarUbicacionesProducto($this->uiParams));
    }

    /**
     * Cambia las ubicaciones del producto.
     */
    public function desubicarProductoAction()
    {
        $this->uiParams['data'] = (array)Zend_Json::decode($this->uiParams['data']);
        $this->success = $this->ubicacion->desubicarProducto($this->uiParams['data']);
    }

    /**
     * Cambia las ubicaciones del producto.
     */
    public function eliminarUbicacionAction()
    {
        //$this->success = $this->ubicaModel->desubicarProductoLote($this->uiParams);
        $this->success = $this->ubicacion->eliminarUbicacion($this->uiParams);
    }

    /**
     * Devuelve los productos por ubicacion.
     */
    public function cargarProductosUbicacionAction()
    {
        $this->objectHelper->synchronize($this, $this->ubicacion->cargarProductosUbicacion($this->uiParams));
    }

    /**
     * Devuelve los productos por ubicacion.
     */
    public function cargarPubicacioneProductoAction()
    {
        $this->objectHelper->synchronize($this, $this->ubicacion->cargarPubicacioneProducto($this->uiParams));
    }

    /**
     * Devuelve los lotes del producto.
     */
    public function cargarlotesAction()
    {
        $this->objectHelper->synchronize($this, $this->ubicacion->cargarLotesUbic($this->uiParams));
    }

    public function redistribuirUbicacionAction()
    {
        $this->uiParams['data'] = (array)Zend_Json::decode($this->uiParams['data']);
        $this->ubicacion->redistribuirUbicacion($this->uiParams['data']);
    }

}
