<?php

class RecuperacionController extends ZendExt_Controller_Secure
{
    function init()
    {
        parent::init();
    }

    function recuperacionAction()
    {
        $this->view->idioma = $this->global->Perfil->idioma;
        $this->render();
    }

    function getRecCandidatoAction()
    {
        $r = DatCandidatoModel::getRecCandidato($this->_request->getPost('start'),
            $this->_request->getPost('limit'),
            $this->_request->getPost('query'),
            $this->_request->getPost('idproceso'),
            $this->_request->getPost('idestado'));
        echo(json_encode($r));
    }

    function getDatosRecByIdAction()
    {
        $r = DatCandidatoModel::getDatosRecById($this->_request->getPost('idcandidato'));
        echo(json_encode($r));
    }

    function getDatosGraficaAction()
    {
        $r = DatProcesoModel::getDatosGrafica();
        echo(json_encode($r));
    }

    function getProcesoSeleccionAction()
    {
        $r = DatProcesoModel::getProcesoActivo();
        echo(json_encode($r));
    }


}