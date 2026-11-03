<?php

/**
 * @package ERP-Operaciones contables
 * @category Controller
 * @author Ing. Alejandro Mengana <amengana@xetid.cu>
 * @copyright (c) 2014, XETID
 */
class GestoperacionesController extends ZendExt_Controller_Secure
{

    private $model;

    function init()
    {
        $this->model = new GestoperacionesModel();
        parent::init();
    }

    function gestoperacionesAction()
    {
        $this->render();
    }

    /**
     * Carga las operaciones contables de la entidad.
     */
    function cargaroperacionesAction()
    {
        $data = $this->model->load($this->_request->getPost());
        echo json_encode($data);
    }

    /**
     * Adiciona las operación contable por entidad.
     * Modifica las operación contable por entidad.
     */
    function adicionaroperacionAction()
    {
        $data = $this->model->addmodOperacion($this->_request->getPost());
        echo json_encode($data);
    }

    /**
     * Elimina las operación contable.
     */
    public function eliminaroperacionAction()
    {
        $response = $this->model->delete($this->_request->getPost());
        echo json_encode($response);
    }

    /**
     * Obtiene todos los subsistemas que contabilizan
     */
    public function cargarsubsistemasAction()
    {
        $result = $this->model->cargarsubsistemas($this->_request->getPost());
        echo json_encode($result);
    }

    /**
     * Obtiene los modelos de contabilización y los documentos primarios
     */
    public function cargarModelsAndDocAction()
    {
        $data = $this->model->cargarModelsAndDoc($this->_request->getPost());
        echo json_encode($data);
    }
    
    /**
     * Carga los signos para las operaciones.
     */
    public function loadSignsAction()
    {
        $response = $this->model->loadSigns($this->_request->getPost());
        echo json_encode($response);
    }

    /**
     * Guarda las operaciones configuradas para la entidad actual como una plantilla
     * para ser usadas posteriormente por otra entidad
     */
    public function crearPlantillaAction()
    {
        $result = $this->model->crearPlantilla($this->_request->getPost());
        echo(json_encode($result));
    }

    /**
     * Obtiene la información de una platilla determinada y la inserta para la entidad
     * actual
     */
    public function usarPlantillaAction()
    {
        $result = $this->model->usarPlantilla($this->_request->getPost());
        echo(json_encode($result));
    }

    /**
     * Lista las plantillas creadas para este componente
     */
    public function listarPlantillaAction(){
        $result = $this->model->listarPlantillas($this->_request->getPost());
        echo(json_encode($result));
    }

}

?>
