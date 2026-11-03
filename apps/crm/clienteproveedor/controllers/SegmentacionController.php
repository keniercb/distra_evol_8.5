<?php

/**
 *
 * @package        ERP-PCRM
 * @subpackage     CRM/clienteproveedor/Controller
 * @author         Ing. Lisvany Alonso Martinez <lisvany@xetid.cu>
 * @copyright (c)  2015, XETID
 * @version        1.0
 */
class SegmentacionController extends ZendExt_Controller_Secure
{

    function init()
    {
        $this->model = new SegmentacionModel();
        $this->dat = new DatSegmentacion();
        parent::init();
    }

    function segmentacionAction()
    {
        //$this->render();
    }

    function cargarsegmentacionAction()
    {
        $params = $this->_request->getPost();
        echo json_encode(
            $this->dat->cargarsegmentacion(/*$this->global->Estructura->idestructura,*/ $params['limit'], $params['start'], array())
        );
    }

    function datatypeAction()
    {
        $idTipoRespuesta = $this->_request->getPost()['idtiporespuesta'];
        $type = $this->_request->getPost()['type'];
        echo json_encode([type => ($this->dat->dataType($idTipoRespuesta, $type) ? true : false)]);
    }

    function addsegmentacionAction()
    {
//        echo json_encode($this->model->addPerfil($this->_request->getPost()));
    }

    function modsegmentacionAction()
    {
//        echo json_encode($this->model->upPerfil($this->_request->getPost()));
    }

    function delsegmentacionAction()
    {
//        echo json_encode($this->model->delPerfil(json_decode($this->_request->getPost()['arrayDel'], true)));
    }
}
