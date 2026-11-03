<?php

/**
 * Controlador encargado de manejar lo referente a la gestion
 * de los clientes y proveedores del modulo Clientes y Proveedores de CRM.
 *
 * @package        ERP-PCRM
 * @subpackage     CRM/clienteproveedor/Controller
 * @author         Ing. Alberto Mesa Martinez <amartinez@xetid.cu>
 * @copyright (c)  2015, XETID
 * @version        1.0
 */
define('APP_HOME', realpath(dirname(__FILE__)) . '/');

include_once(APP_HOME . '../../comun/controllers/NomencladorCmpController.php');

class GestionclienteproveedorController extends NomencladorCmpController
{
    private $_model;

    function init()
    {
        $this->_model = new GestionClienteProveedorModel();
        parent::init();
    }

    function gestionclienteproveedorAction()
    {
//        $this->render();
    }

    function obtenerIdfuncionalidadAction(){
        $params = $this->_request->getPost();
        $resultado = $this->_model->obtenerIdFuncionalidad($params);
        echo json_encode($resultado);
    }
}
