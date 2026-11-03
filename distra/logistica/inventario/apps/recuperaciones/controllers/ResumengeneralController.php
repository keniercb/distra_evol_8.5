<?php

/**
 *  Esta clase
 * * @copyright XETID
 * @author DIvicion de Gestion de Entidades
 * @version 1.0
 */
if (!class_exists('BaseModel')) {
    $dir = Zend_Registry::getInstance()->get('config')->dir_aplication . '/logistica/utiles/comun/config.php';
    include_once $dir;
    set_include_path(get_include_path() . PATH_SEPARATOR . $config['include_path']);
}
class ResumengeneralController extends BaseController
{
    private $serviciosAyuda;
    private $serviciosDepositos;
    private $model;

    function init()
    {
        parent::init('log.inv.resumengeneral');
        $this->serviciosAyuda = ServiciosAyudaHelper::__init();
        $this->serviciosDepositos = LogisticaEstructuraUbicHelper::__init();
        $this->model = new ValordepositosModel();
    }

    public function resumengeneralAction()
    {
        $this->autoShow = false;
        $this->controllerConfig = 'log';
        $this->prepareView();

        $this->initComponent('log.inv.resumengeneral');
        $this->rendertemplate();
    }


    public function obtenerDatosAction()
    {
        $sumaventas = 0;
        $sumacompras = 0;
        $arrDepositos = array();
        $comprasXdepositos = array();
        $ventasXdepositos = array();
        $datos = $this->model->devolverValorDepositos();

        foreach ($datos['datos'] as $key => $value) {
            $sumaventas += $value['ventas'];
            $sumacompras += $value['compras'];
            $depositos = $value['deposito'];
            $arrDepositos[$key] = $depositos;
            $comprasXdepositos[$key] = $value['compras'];
            $ventasXdepositos[$key] = $value['ventas'];
            if ($sumaventas[$key] == null) {
                $ventasXdepositos[$key] = 0;
            }
            if ($ventasXdepositos[$key] == null) {
                $ventasXdepositos[$key] = 0;
            }
        }

        $this->datos = $datos['datos'];
        $this->idsubsistema = LogisticaGlobal::SUBSISTEMA_INV;
        $this->cantidad = count($datos['datos']);
        $this->sumaventas = $sumaventas;
        $this->sumacompras = $sumacompras;
        $this->arrDepositos = $arrDepositos;
        $this->comprasXdepositos = $comprasXdepositos;
        $this->ventasXdepositos = $ventasXdepositos;

    }

    public function cargarGraficaAction()
    {
        $result = [];
        $datos = $this->model->devolverValorDepositos();
        foreach ($datos['datos'] as $key => $value) {
            $result['ventas'] += $result['ventasXdepositos'][$key] = $value['ventas'];
            $result['ventasalt'] += $result['ventasXdepositosAlt'][$key] = $value['ventasalt'];
            $result['compras'] += $result['comprasXdepositos'][$key] = $value['compras'];
            $result['comprasalt'] += $result['comprasXdepositosAlt'][$key] = $value['comprasalt'];
            $depositos = $value['deposito'];
            $result['depositos'][$key] = $depositos;
            if ($result['ventas'][$key] == null) {
                $result['ventas'][$key] = 0;
            }
            if ($result['ventasalt'][$key] == null) {
                $result['ventasalt'][$key] = 0;
            }
            if ($result['ventasXdepositos'][$key] == null) {
                $result['ventasXdepositos'][$key] = 0;
            }
            if ($result['ventasXdepositosAlt'][$key] == null) {
                $result['ventasXdepositosAlt'][$key] = 0;
            }
        }
        $this->datos = $result;
        $this->cantidad = count($result);
        $this->idsubsistema = LogisticaGlobal::SUBSISTEMA_INV;
    }
}
