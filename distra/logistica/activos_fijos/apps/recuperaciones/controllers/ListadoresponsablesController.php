<?php
/**
 * Created by PhpStorm.
 * User: yoendy
 * Date: 05/02/2018
 * Time: 9:47
 */
if (!class_exists('BaseModel')) {
    $dir = Zend_Registry::getInstance()->get('config')->dir_aplication . '/logistica/utiles/comun/config.php';
    include_once $dir;
    set_include_path(get_include_path() . PATH_SEPARATOR . $config['include_path']);
}
class ListadoresponsablesController extends BaseController
{

    public function init($dir = 'log.aft.listadoresponsables')
    {
        parent::init($dir);
        $this->serviciosAyuda = ServiciosAyudaHelper::__init();
//        $this->movimientoLento = new MovimientoLentoModel();
//        $this->serviciosDepositos = LogisticaEstructuraUbicHelper::__init();


    }

    public function listadoresponsablesAction()
    {
        $this->autoShow = false;
        $this->controllerConfig = 'log';
        $this->prepareView();
        $this->initComponent('log.aft.listadoresponsables');
        $this->rendertemplate();
    }
    public function getListadoOperacionesAction()
    {
        $model = new RecuperacionesModel();
        $parametros = $this->uiParams;
        $respuesta = $model->getOperaciones($parametros);
        $datos = array();
        foreach ($respuesta as $dat)
        {
            if ($dat['tipo'] === 'entrada'){
                $datos[]=$dat;
            }
        }

        $this->datos = $datos;
    }

    public function getArbolUbicacionesAction(){
        $this->autoShow = false;
        $nivel = ($this->uiParams['nivel']) ? $this->uiParams['nivel'] : -1;
        $ultimoNivel = ($this->uiParams['ultimo_nivel']) ? $this->uiParams['ultimo_nivel'] : -1;
        $model = new DatEstructuraubicacionModel();
        $datos = $model->ObtenerEstructurasUbicacion($this->uiParams['node'], $nivel, $ultimoNivel);
        $arreglo = array_map(function(&$dat){
            $dat['checked'] = false;
            return $dat;
        }, $datos);

        echo json_encode($arreglo);
    }
}