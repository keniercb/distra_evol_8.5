<?php

/**
 *
 * @package        ERP-PCRM
 * @subpackage     CRM/clienteproveedor/Controller
 * @author         Ing. Lisvany Alonso Martinez <lisvany@xetid.cu>
 * @copyright (c)  2015, XETID
 * @version        1.0
 */
class PerfilesclientesController extends ZendExt_Controller_Secure
{

    function init()
    {
        $this->model = new PerfilesClientesModel();
        $this->dat = new DatPerfilesClientes();
        parent::init();
    }

    function perfilesclientesAction()
    {
        //$this->render();
    }

    function cargarperfilesAction()
    {
        $params = $this->_request->getPost();
//        $this->dat->cargarperfiles($this->global->Estructura->idestructura, $params['limit'], $params['start'], array());
        echo json_encode(
            $this->dat->cargarperfiles($this->global->Estructura->idestructura, $params['limit'], $params['start'], array())
        );
    }

    function cargarpreguntasAction()
    {
        echo json_encode($this->dat->cargarpreguntas($this->_request->getPost()['idcuestionario']));
    }

    function addperfilAction()
    {
        echo json_encode($this->model->addPerfil($this->_request->getPost()));
    }

    function modperfilAction()
    {
        echo json_encode($this->model->upPerfil($this->_request->getPost()));
    }

    function delperfilAction()
    {
        echo json_encode($this->model->delPerfil(json_decode($this->_request->getPost()['arrayDel'], true)));
    }
}
