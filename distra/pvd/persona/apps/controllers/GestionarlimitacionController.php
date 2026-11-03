<?php

class GestionarlimitacionController extends ZendExt_Controller_Secure
{

    function init()
    {
        parent::init();
    }

    function gestionarlimitacionAction()
    {
        $this->render();
    }

    //Obtener Limitaciones
    function getLimitacionesAction()
    {
        $limit = $this->_request->getParam('limit');
        $start = $this->_request->getParam('start');
        $filtro = $this->_request->getParam('query');
        $datLimitacion = new DatLimitacionModel();
        $r = array();
        $r= $datLimitacion->getLimitacion($filtro, $limit, $start);
        echo(json_encode($r));
    }

    //Obtener causas de limitaci�n
    function getcausasAction()
    {
        $nomCausalimitacion = new NomCausalimitacion();
        $r = array();
        $r['causas'] = $nomCausalimitacion->getcausas();
        echo(json_encode($r));
    }

    //Obtener personas
    function getPersonasAction()
    {
        $limit = $this->_request->getParam('limit');
        $start = $this->_request->getParam('start');
        $filtro = $this->_request->getParam('query');
        $limitacion = new DatLimitacionModel();
        $r = array();
        $r = $limitacion->getPersonas($filtro, $start, $limit);
        echo(json_encode($r));
    }

    //Adicionar limitaci�n
    function addLimitacionAction()
    {
        $idpersona = $this->_request->getParam('idpersona');
        $idcausa = $this->_request->getParam('idcausa');
        $fdesde = $this->_request->getParam('fdesde');
        $fhasta = $this->_request->getParam('fhasta');
        $idsituacionlaboralp = $this->_request->getParam('idsituacionlaboralp');
        $limitacion = new DatLimitacionModel();
        $r = $limitacion->addLimitacion($idpersona, $idcausa, $fdesde, $fhasta, $idsituacionlaboralp);
        echo(json_encode($r));
    }

    //Modificar limitaci�n
    function updateLimitacionAction()
    {
        $idlimitacion = $this->_request->getParam('idlimitacion');
        $idpersona = $this->_request->getParam('idpersona');
        $idcausa = $this->_request->getParam('idcausa');
        $fdesde = $this->_request->getParam('fdesde');
        $fhasta = $this->_request->getParam('fhasta');
        $idsituacionlaboralp = $this->_request->getParam('idsituacionlaboralp');
        $limitacion = new DatLimitacionModel();
        $r = $limitacion->updateLimitacion($idlimitacion, $idpersona, $idcausa, $fdesde, $fhasta, $idsituacionlaboralp);
        echo(json_encode($r));
    }

    //Eliminar limitaci�n
    function deleteLimitacionAction()
    {
        $idlimitaciones = json_decode($this->_request->getPost('limitaciones'));
        $limitacion = new DatLimitacionModel();
        foreach ($idlimitaciones as $idlimitacion)
         $result = $limitacion->deleteLimitacion($idlimitacion);
        echo(json_encode($result));
    }
    function exportarLimitacionesAction()
    {
        $idestructura = $this->_request->getParam('idestructura');
        $obj = new ReporteLimitacionModel($idestructura);
        $obj->exportarLimitaciones();
    }
}
