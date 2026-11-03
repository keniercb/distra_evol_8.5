<?php

/*
  /**
 * Description of Nomencladores
 * Clase para el manejo de los nomencladores generales del subsistema logistica
 * @author Kenier Cumba Bueno
 */

class RelacionarDatosController extends ZendExt_Controller_Secure
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
    public function relacionardatosAction()
    {
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

}
