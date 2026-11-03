<?php

/**
 *
 * @package        ERP-PCRM
 * @subpackage     CRM/clienteproveedor/Controller
 * @author         Ing. Lisvany Alonso Martinez <lisvany@xetid.cu>
 * @copyright (c)  2015, XETID
 * @version        1.0
 */
define('APP_HOME', realpath(dirname(__FILE__)) . '/');

include_once(APP_HOME. '../../comun/controllers/NomencladorCmpController.php');

class NomclienteproveedorController extends NomencladorCmpController
{

    function init()
    {
        parent::init();
        $this->setFileConfig(APP_HOME . '../../comun/recursos/nomclienteproveedorperfil.ini');
    }
    
    function nomclienteproveedorAction()
    {
        //$this->render();
    }
}
