<?php

/**
 * Controlador encargado de gestionar las solicitudes del comite de aprobacion
 *
 * @package        ERP-PCRM
 * @subpackage     CRM/contratacion/Controller
 * @author         Ing. Alberto Mesa Martinez <amartinez@xetid.cu>
 * @copyright (c)  2016, XETID
 * @version        1.0
 */
class OfertaController extends ZendExt_Controller_Secure
{
    private $_model;

    function init()
    {
        $this->_model = new OfertaModel();
        parent::init();
    }

    function ofertaControllerAction()
    {

    }
}
