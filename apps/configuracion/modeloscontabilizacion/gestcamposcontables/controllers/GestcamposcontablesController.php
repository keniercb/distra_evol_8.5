<?php
  
/**
 * @package       ERP-Modelos de contabilizacion
 * @category      Controller
 * @author        Ing. Rodain Terrer Molina <rterrer@xetid.cu>
 * @author        Ing. Alejandro Megana <amengana@xetid.cu>
 * @author        Ing. Alberto Mesa Martínez <amartinez@xetid.cu>
 * @copyright (c) 2014, XETID
 */
class GestcamposcontablesController extends ZendExt_Controller_Secure
{

    private $model;

    function init()
    {
        $this->model = new CamposModel();
        parent::init();
    }

    function gestcamposcontablesAction()
    {
        /*$this->view->jsayuda = $this->integrator->ayuda->devolverJS();*/
        $this->render();
    }

    /**
     * Carga los Campos contables de la entidad.
     */
    public function loadAction()
    {
        $post = $this->_request->getPost();
        $data = $this->model->load($post);
        echo json_encode($data);
    }

    /**
     * Registra un Campo contable.
     */
    public function addAction()
    {
        $post = $this->_request->getPost();
        $data = $this->model->add($post, $post['idclasificador']);
        echo json_encode($data);
    }

    /**
     * Eliminar uno o varios Campos contables.
     */
    public function delAction()
    {
        $post = $this->_request->getPost();
        $data = $this->model->delete($post);
        echo json_encode($data);
    }

    /**
     * Cargar los subsistemas que contabilizan
     */
    public function cargarsubsistemasAction()
    {
        echo json_encode(
                $this->model->cargarsubsistemas($this->_request->getPost())
        );
    }

    /**
     * Carga los clasificadores por subsistema
     */
    public function cargarClasificadoresAction()
    {
        $result = $this->model->cargarClasificadores(
                $this->_request->getPost()
        );
        echo json_encode($result);
    }

    /**
     * Carga los campos de una determinada clase base
     */
    public function cargarCamposAction()
    {
        $result = $this->model->cargarCampos($this->_request->getPost());
        echo json_encode(array('datos' => $result));
    }

    /**
     * Carga los directorios y archivos del árbol para elegir una clase
     */
    public function cargarDirAction()
    {
        $data = $this->model->cargarDir($this->_request->getPost());
        echo json_encode($data);
    }

    /**
     * Carga las funcionalidades de una determinada clase
     */
    public function cargarFuncionalidadesAction()
    {
        $result = $this->model->cargarFuncionalidades(
                $this->_request->getPost()
        );
        echo json_encode(array('datos' => $result));
    }

    /**
     * Carga los campos y los datos necesarios para crear un grid de forma dinánica.
     */
    public function cargarConfiguracionGridAction()
    {
        $result = $this->model->cargarConfiguracionGrid(
            $this->_request->getPost()
        );
        echo json_encode($result);
    }

    /**
     * Carga los campos y los datos necesarios para crear un grid de forma dinánica.
     */
    public function getRangeAction()
    {
        $result = $this->model->getRange(
            $this->_request->getPost()
        );
        echo json_encode($result);
    }
}
?>
