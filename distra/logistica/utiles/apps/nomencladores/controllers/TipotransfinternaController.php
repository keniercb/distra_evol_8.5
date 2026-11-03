<?php

/*
  /**
 * Description of Nomencladores
 * Clase para el manejo de los nomencladores generales del subsistema logistica
 * @author Kenier Cumba Bueno
 */

class TipotransfinternaController extends BaseController
{

    /**
     * Instancia del modelo de negocio para la gestion de los nomencladores
     *
     * @var type
     */
    private $nomencladoresModel;

    public function init()
    {
        parent::init();
        $this->nomencladoresModel = new NomencladoresModel();
        $params = $this->_request->getParams();
        $this->nomencladoresModel = ($params['bussines']) ? new $params['bussines']() : new NomencladoresModel();
    }

    /**
     * Metodo para renderizar la interfaz general de los nomencladores de
     * logistica
     *
     * @return void
     */
    public function tipotransfinternaAction()
    {
        $this->autoShow = false;
        $this->render();
    }

    public function insertarnomencladorAction()
    {

        $params = $this->_request->getParams();
        $res = $this->nomencladoresModel->insertarNomenclador($params);
        if ($res == 1) {
            echo "{success: 'true'}";
        } elseif ($res == -1) {
            echo("{'etiqueta':'msjAddCodDescexist'}");
        } elseif ($res == -2) {
            echo("{'etiqueta':'msjAddDescexist'}");
        } else {
            echo("{'etiqueta':'msjAddCodexist'}");
        }
    }

    public function eliminarnomencladorAction()
    {
        $params = $this->_request->getParams();
        $res = $this->nomencladoresModel->eliminarNomenclador($params);
        if ($res) {
            echo "{success: 'true'}";
        } else {
            echo("{'codMsg':3,'mensaje':'No se puede eliminar.'}");
        }
    }

    public function cargarnomencladorAction()
    {
        $params = $this->_request->getParams();
        $cEstructura = 'Estructura';
        $cEstructura = $this->global->$cEstructura->idestructura;
        $objmodelj = new NomTipotransfinternaModel();
        $filtro = Zend_Json::decode($this->uiParams['filtro']);
        $params['idtipotransfinterna'] = $filtro[0]['idtipotransfinterna'];
        $datos = $objmodelj->buscarDatos($params, $cEstructura);
        $this->datos = $datos[0];
        $this->cantidad = $datos[1];

    }


}
