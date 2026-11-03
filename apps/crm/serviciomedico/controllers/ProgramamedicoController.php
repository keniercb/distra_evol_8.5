<?php

class ProgramamedicoController extends ZendExt_Controller_Secure
{

    function init()
    {
        parent::init();
        $this->model = new ProgramamedicoModel();
    }

    function programamedicoAction()
    {
        //$this->render();
    }

    function getConfiguracionAction(){
        echo json_encode($this->model->getConfiguracion());
    }

    function getProgramasMedicosAction(){
        $result=$this->model->getProgramasMedicos($this->_request->getParams());
        echo json_encode($result);
    }

    function guardarProgramaMedicoAction(){
        $result=$this->model->guardarProgramaMedico($this->_request->getParams());
        echo json_encode($result);
    }

    function eliminarProgramasMedicosAction(){
        $result=$this->model->eliminarProgramasMedicos($this->_request->getParams());
        echo json_encode(array('succes'=>true));
    }

    function cambiarEstadoProgramaMedicoAction(){
        $result=$this->model->cambiarEstadoProgramaMedico($this->_request->getParams());
        echo json_encode($result);
    }

    public function getListadoPersonasAction(){
        $result = $this->model->getListadoPersonas($this->_request->getParams());
        echo json_encode(array('data' => $result->data, 'cant' => $result->quantity));
    }

    public function getTipoContactoAction(){
        $result = $this->model->getTipoContacto($this->_request->getParams());
        echo json_encode($result);
    }

    public function getEspecialidadesAction(){
        $result = $this->model->getEspecialidades($this->_request->getParams());
        echo json_encode($result);
    }

    public function getTiposProgramasAction(){
        $result = $this->model->getTiposProgramas($this->_request->getParams());
        echo json_encode($result);
    }

    public function getCondicionesPagoAction(){
        $result = $this->model->getCondicionesPago($this->_request->getParams());
        echo json_encode($result);
    }

    public function getAreasAction(){
        $result = $this->model->getAreas($this->_request->getParams());
        echo json_encode($result);
    }

    public function getDatosAdicionalesAction(){
        $result = $this->model->getDatosAdicionales($this->_request->getParams());
        echo json_encode($result);
    }

    public function exportarProgramaMedicoAction(){
        $result = $this->model->exportarProgramaMedico($this->_request->getParams());
        echo json_encode($result);
    }

    public function facturarProgramaMedicoAction(){
        $result = $this->model->facturarProgramaMedico($this->_request->getParams()['idprogramamedico']);
        echo json_encode($result);
    }

}
