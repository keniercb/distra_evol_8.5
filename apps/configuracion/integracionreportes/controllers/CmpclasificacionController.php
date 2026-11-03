<?php

/**
 * @copyright UCID, ERP-CUBA
 */
class CmpclasificacionController extends ZendExt_Controller_Secure
{

    /**
     * Inicializar los atributos de la clase
     */
    private $model;

    public function __construct(Zend_Controller_Request_Abstract $request, Zend_Controller_Response_Abstract $response, array $invokeArgs = array())
    {
        parent::__construct($request, $response, $invokeArgs);
        $this->model = new NomClasificacionReporteModel();
    }

    function init()
    {
        parent::init();
    }
    /**
     * Accion para mostrar la vista
     */
    function cmpclasificacionAction()
    {
        $this->render();
    }

    function listarClasificacionAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $idusuario = $this->global->Perfil->idusuario;
        $parametros['sort'] = $this->_request->getPost('sort');
        $parametros['dir'] = $this->_request->getPost('dir');
        $start = $this->_request->getPost('start');
        $parametros['start'] = (empty($start) || !is_numeric($start)) ? 0 : $start;
        $limit = $this->_request->getPost('limit');
        $parametros['limit'] = empty($limit) ? 100 : $limit;

        $result = $this->model->listarClasificacion($parametros);
        if (isset($result['data'][0])) echo json_encode($result);
        else echo json_encode(array('total' => 0, 'data' => array()));
    }


    function adicionarClasificacionAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $parametros['idusuario'] = $this->global->Perfil->idusuario;
        $denelemento = $this->_request->getPost('tfdenominacion');
        $parametros['denominacion'] = str_ireplace('"', "'", $denelemento);
        $result = $this->model->adicionarClasificacion($parametros);
        echo json_encode(array('mensaje' => $result));
    }

    function modificarClasificacionAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $parametros['idusuario'] = $this->global->Perfil->idusuario;
        $parametros['idclasificacion'] = $this->_request->getPost('idclasificacion');
        $denelemento = $this->_request->getPost('tfdenominacion');
        $parametros['denominacion'] = str_ireplace('"', "'", $denelemento);
        $result = $this->model->modificarClasificacion($parametros);
        echo json_encode(array('mensaje' => $result));
    }

    function eliminarClasificacionAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $idusuariocrea = $this->global->Perfil->idusuario;
        $arrayidclasificacion = json_decode(
            stripslashes($this->_request->getPost('arrayidclasificacion'))
        );
        $result = $this->model->eliminarClasificacion($arrayidclasificacion);
        echo json_encode(array('mensaje' => $result));
    }

    function cargarFormularioClasificacionAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $idclasificacion = $this->_request->getPost('idclasificacion');
        $result = $this->model->obtenerClasificacionDadoId($idclasificacion);
        if (is_array($result)) {
            $dat [] = array(
                'idclasificacion' => $result['idclasificacion'],
                'denominacion' => $result['denominacion']
            );
            echo json_encode(array('data' => $dat, 'mensaje' => 1));
        } else {
            echo json_encode(array('mensaje' => $result));
        }
    }

}
