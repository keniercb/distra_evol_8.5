<?php

/**
 * @package       ERP-Modelos de contabilizacion
 * @category      Controller
 * @author        Ing. Rodain Terrer Molina <rterrer@xetid.cu>
 * @author        Ing. Alejandro Mengana <amengana@xetid.cu>
 * @author        Ing. Alberto Mesa Martínez <amartinez@xetid.cu>
 * @copyright (c) 2014, XETID
 */
class GestionarmodelosController extends ZendExt_Controller_Secure
{

    private $model;
    private $confmodelo;

    function init()
    {
        $this->model = new ModelosModel();
        $this->confmodelo = new ConfModeloModel();
        parent::init();
    }

    function gestionarmodelosAction()
    {
        $this->render();
    }

    /**
     * Carga los subsistemas de la entidad.
     */
    function cargarsubsistemasAction()
    {
        $subsistemas = $this->model->cargarsubsistemas($this->_request->getPost());
        echo json_encode($subsistemas);
    }

    /**
     * Obtiene los niveles de las cuentas de la entidad comun.
     */
    public function cargarNivelesCuentasAction()
    {
        $data = $this->model->cargarNivelesCuentas();
        echo json_encode($data);
    }

    /**
     * Obtiene los cuentas del nomenclador de la estructura comun.
     */
    public function cargarCuentasAction()
    {
        $post = $this->_request->getPost();
        if ($post['tipocta'] == '2') {
            $data = $this->model->cargarCuentas($post);
        } else {
            $data = $this->model->cargarCampos($post);
        }
        echo json_encode($data);
    }

    /**
     * Obtiene los valores contables para un subsistema de la estructura comun.
     */
    public function cargarValoresAction()
    {
        $post = $this->_request->getPost();
        $data = $this->model->cargarValores($post);
        echo json_encode($data);
    }

    /**
     * Obtiene los nomencladores para aperturar una cuenta dada la estructura comun.
     */
    public function cargarOrigenAction()
    {
        $post = $this->_request->getPost();
        $data = $this->model->cargarOrigen($post);
        echo json_encode($data);
    }

    /**
     * Obtiene los asientos de un modelo.
     */
    public function cargarAsientosAction()
    {
        $post = $this->_request->getPost();
        $data = $this->model->loadAccountingEntries($post['idmodelo']);
        echo json_encode($data);
    }

    /**
     * Obtiene las sustituciones de un asiento.
     */
    public function cargarSustitucionesAction()
    {
        $post = $this->_request->getPost();
        $data = $this->model->loadSustitutions($post['idasiento']);
        echo json_encode($data);
    }

    /**
     * Carga los Modelos de contabilizacion de la entidad.
     */
    public function loadAction()
    {
        $post = $this->_request->getPost();
        $data = $this->model->load($post);
        echo json_encode($data);
    }

    /**
     * Registra un Modelo de contabilizacion.
     */
    public function addAction()
    {
        $post = $this->_request->getPost();
        $data = $this->model->add($post);
        echo json_encode($data);
    }

    /**
     * Eliminar uno o varios Modelos de contabilizacion.
     */
    public function delAction()
    {
        $post = $this->_request->getPost();
        $data = $this->model->delete($post);
        echo json_encode($data);
    }

    /**
     * Eliminar uno o varios Modelos de contabilizacion.
     */
    public function cambiarEstadoAction()
    {
        $post = $this->_request->getPost();
        $data = $this->model->cambiarEstado($post);
        echo json_encode($data);
    }

    public function exportarModelosAction()
    {
        $subsistemas = Zend_Json::decode($this->_getParam('subsistemas'));
        $idestructura = Zend_Json::decode($this->_getParam('idestructura'));
        $otherorgan = Zend_Json::decode($this->_getParam('otherorgan'));

        ob_end_clean();
        header('Content-Type: application/json');
        header('Content-Disposition: attachment; filename="modelos.json"');
        ob_end_clean();

        echo json_encode($this->model->exportModelos($subsistemas,$idestructura, $otherorgan));
    }

    public function importarModelosAction()
    {
        $fileDir = $_FILES["modelos"]["tmp_name"];
        $this->model->importModelos($fileDir);

        echo Zend_Json::encode(array('success' => true, 'codigoMsg' => 1));
    }

    /**
     * Guarda las operaciones configuradas para la entidad actual como una plantilla
     * para ser usadas posteriormente por otra entidad
     */
    public function crearPlantillaAction()
    {
        $result = $this->confmodelo->crearPlantilla($this->_request->getPost());
        echo(json_encode($result));
    }

    /**
     * Obtiene la información de una platilla determinada y la inserta para la entidad
     * actual
     */
    public function usarPlantillaAction()
    {
        $result = $this->confmodelo->usarPlantilla($this->_request->getPost());
        echo(json_encode($result));
    }

    /**
     * Lista las plantillas creadas para este componente
     */
    public function listarPlantillaAction(){
        $result = $this->confmodelo->listarPlantillas($this->_request->getPost());
        echo(json_encode($result));
    }

    public function replicarDatosAction(){
        $result = $this->confmodelo->replicarDatos($this->_request->getPost());
        echo(json_encode($result));
    }

    public function cargarEntidadesEconomicasAction(){
        $result = $this->confmodelo->cargarEntidadesEconomicas($this->_request->getPost());
        echo(json_encode($result));
    }

}
