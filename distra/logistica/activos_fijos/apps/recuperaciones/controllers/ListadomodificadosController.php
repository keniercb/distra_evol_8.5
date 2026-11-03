<?php

/**
 * Created by PhpStorm.
 * User: yoendy
 * Date: 7/13/2016
 * Time: 4:18 PM
 */
if (!class_exists('BaseModel')) {
    $dir = Zend_Registry::getInstance()->get('config')->dir_aplication . '/logistica/utiles/comun/config.php';
    include_once $dir;
    set_include_path(get_include_path() . PATH_SEPARATOR . $config['include_path']);
}
class ListadomodificadosController extends BaseController
{
    function init()
    {
        parent::init('log.aft.listadomodificados');
        $this->serviciosAyuda = ServiciosAyudaHelper::__init();
//        $this->movimientoLento = new MovimientoLentoModel();
//        $this->serviciosDepositos = LogisticaEstructuraUbicHelper::__init();
    }

    public function gestListadomodificadosAction()
    {
        $this->autoShow = false;
        $this->controllerConfig = 'log';
        $this->prepareView();
        $this->initComponent('log.aft.listadomodificados');
        $this->rendertemplate();
    }


    public function getModificadosAction()
    {
        $params = ($this->uiParams);
        $conn = Zend_Registry::get('conexion');
       // print_r($params);die;
       $result = "Select * from  mod_logactivofijotangible.f_camposmodificados ('{$params['arraytablas']}','{$params['arrayCampos']}','{{$params['id']}}')";
      $this->datos = array_column(
        $conn->execute($result)
      ->fetchAll(PDO::FETCH_ASSOC), 'cadena')
;
    }


}