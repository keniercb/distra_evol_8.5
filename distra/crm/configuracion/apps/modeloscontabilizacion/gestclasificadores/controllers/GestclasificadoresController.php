<?php

/**
 * @package ERP-Modelos de contabilizacion
 * @category Controller
 * @author Ing. Rodain Terrer Molina <rterrer@xetid.cu>
 * @author Ing. Alejandro Mengana <amengana@xetid.cu>
 * @copyright (c) 2014, XETID
 */
class GestclasificadoresController extends ZendExt_Controller_Secure
{

    private $model;

    function init()
    {
        $this->model = new ClasificadoresModel();
        parent::init();
    }

    function gestclasificadoresAction()
    {
        /*$this->view->jsayuda = $this->integrator->ayuda->devolverJS();*/
        $this->render();
    }

    /**
     * Carga los subsistemas de la entidad.
     */
    public function cargarsubsistemasAction()
    {
        $subsistemas = $this->model->cargarsubsistemas($this->_request->getPost());
        echo json_encode($subsistemas);
    }

    /**
     * Carga los Clasificadores de la entidad.
     */
    public function loadAction()
    {
        $post = $this->_request->getPost();
        $data = $this->model->load($post);
        echo json_encode($data);
    }

    /**
     * Registra un Clasificador.
     */
    public function addAction()
    {
        $post = $this->_request->getPost();
        $data = $this->model->add($post);
        echo json_encode($data);
    }

    /**
     * Eliminar uno o varios Clasificadorres.
     */
    public function delAction()
    {
        $post = $this->_request->getPost();
        $data = $this->model->delete($post);
        echo json_encode($data);
    }

    /**
     * Carga los directorios y archivos del árbol para elegir la clase que mapea
     */
    public function cargardirAction()
    {
        $data = $this->model->cargardir($this->_request->getPost());
        echo json_encode($data);
    }

    /**
     * Carga las columnas de la tabla correspondiente a una modelo seleccionada
     */
    public function loadTableColumnsAction()
    {
        $data = $this->model->loadTableColumns($this->_request->getPost());
        echo json_encode($data);
    }

    /**
     * Carga los campos contables según el id del clasificador
     */
    public function cargarcamposAction()
    {
        $data = $this->model->cargarcampos($this->_request->getPost());
        echo json_encode($data);
    }

}
