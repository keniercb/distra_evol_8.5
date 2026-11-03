<?php

class PriorizarentidadController extends ZendExt_Controller_Secure
{

    /**
     * init
     * Inicializar el componente
     * */
    function init()
    {
        parent::init();
    }

    /**
     * actividadentidadnae
     * Renderizar la vista
     * */
    public function priorizarentidadAction()
    {
        $this->render();
    }

    public function listarCentrosbalanceAction()
    {
        $params['start'] = $this->_request->getParam('start');
        $params['limit'] = $this->_request->getParam('limit');
        $params['filtros'] = $this->_request->getParam('valor');
        $params['filtrosgrid'] = $this->_request->getParam('filtros');
        $cbmodel = new DatPriorizarEntidadesModel();
        echo json_encode($cbmodel->ListarCentrosBalance($params));
    }

    public function listarEspecialidadAction()
    {
        $params['start'] = $this->_request->getParam('start');
        $params['limit'] = $this->_request->getParam('limit');
        $params['filtros'] = $this->_request->getParam('filtros');
        $params['idcb'] = $this->_request->getParam('idcb');
        $cbmodel = new DatPriorizarEntidadesModel();
        echo json_encode($cbmodel->listarEspecialidades($params));
    }

    public function asignarPrioridadPorDefectoAction()
    {
        $params['idcb'] = $this->_request->getParam('idcb');
        $cbmodel = new DatPriorizarEntidadesModel();
        echo json_encode($cbmodel->asignarPrioridadPorDefecto($params));
    }

    public function actualizarPrioridadAction()
    {
        $arrayprioridad = json_decode(
            stripslashes($this->_request->getPost('planes_prioridad'))
        );
        $cbmodel = new DatPriorizarEntidadesModel();
        $data = $cbmodel->actualizarPrioridad($arrayprioridad);
        if ($data == 1) {
            $dat->codMsg = 21;
        } elseif ($data == 2) {
            $dat->codMsg = 22;
        } else {
            $dat->codMsg = 3;
        }
        echo json_encode($dat);
    }

}