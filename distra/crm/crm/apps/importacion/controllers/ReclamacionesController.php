<?php

/**
 * @package        ERP-PCRM
 * @subpackage     CRM/contratacion/Controller
 * @author         Ing. Lisvany Alonso Martinez
 * @copyright (c)  2015, XETID
 * @version        1.0
 */

class ReclamacionesController extends ZendExt_Controller_Secure
{

    private $_model;

    function init()
    {
        parent::init();
        $this->_responeInfo = new ResponseInfo();
        $this->_reclamacionesDService = new ReclamacionesDService();
        $this->_model = new ComiteAprobacionModel();
        $this->_contratomodel = new GestioncontratoModel();
        $this->_reclamacionesestadoDService = new ReclamacionesEstadoDService();

    }

    function reclamacionesAction()
    {
        //$this->render();
    }

    public function cargarProductosAction()
    {
        $params = $this->_request->getPost();
        echo json_encode($this->_reclamacionesDService->cargarProductos($params));

    }

    public function cargarProductosReclamacionesAction()
    {
        $params = $this->_request->getPost();
        echo json_encode(
            $this->_reclamacionesDService->cargarProductosReclamaciones($params)
        );

    }

    public function getReclamacionesAction()
    {
        $listReclamaciones = $this->_reclamacionesDService->getReclamaciones(
            array(
                'limit'   => $this->_getParam('limit', 20),
                'start'   => $this->_getParam('start', 0),
                'filters' =>
                    array_merge(
                        $this->_getParam('filter', array())
                        ,
                        $this->_getParam('filtrogeneral', array())
                    ),
                'sorters' => $this->_getParam('sort')
            )
        );
        echo json_encode($listReclamaciones);
    }

    public function getReclamacionDocsAction()
    {
        $result = $this->_reclamacionesDService->getReclamacionesDocs(
            $this->_request->getParams()['idespaciotrabajo']
        );
        echo json_encode($result);
    }

    public function adicionarReclamacionAction()
    {
        $params = $this->_request->getParams();
        echo json_encode(
            $this->_reclamacionesDService->adicionarReclamacion($params)
        );
    }

    public function getConfiguracionesAction()
    {
        $reclamaciones = new ConfReclamaciones();
        echo json_encode($reclamaciones->getConfig());
    }

    public function modificarReclamacionAction()
    {
        $params = $this->_request->getParams();
        echo json_encode(
            $this->_reclamacionesDService->modificarReclamacion($params)
        );
    }

    function eliminarReclamacionAction()
    {
        echo json_encode(
            $this->_reclamacionesDService->eliminarReclamacion(
                json_decode($this->_request->getParams()['values'])
            )
        );
    }

    public function obtenerConsecutivoAction()
    {
        $result = $this->_reclamacionesDService->generarConsecutivoAño(
            $this->_request->getParams()
        );
        echo json_encode($result);
    }

    public function obtenerTipoReclamacionesAction()
    {
        $result = $this->_reclamacionesDService->obtenerTipoReclamaciones(
            $this->_request->getParams()
        );
        echo json_encode($result);
    }

    public function cargarLineasAction()
    {
        $result = $this->_reclamacionesDService->cargarLineas(
            $this->_request->getParams()
        );
        echo json_encode($result);
    }

    public function obtenerTiposLineasAction()
    {
        $result = $this->_reclamacionesDService->obtenerTiposLineas(
            $this->_request->getParams()
        );
        echo json_encode($result);
    }

    function cargarContratosAction()
    {
        $params = $this->_request->getPost();
        $result = $this->_reclamacionesDService->cargarContratos($params);
        echo json_encode($result);
    }

    public function getEstadosReclamacionAction()
    {
        $estadoas_aux
            = $this->_reclamacionesestadoDService->getConfiguracionEstados();
        $estados = array_values($estadoas_aux);
        echo json_encode($estados);
    }

    public function cambiarEstadoReclamacionAction()
    {
        echo json_encode(
            $this->_reclamacionesestadoDService->upEstadoReclamacion(
                $this->_request->getPost()
            )
        );
    }

    public function getreclamacionEstadoTrazasAction(){
        $listEstTraz=$this->_reclamacionesestadoDService->getreclamacionEstadoTrazas($this->_request->getParams()['idreclamacion']);
        $_responeInfo=new stdClass();
        $_responeInfo->datos = $listEstTraz;
        $_responeInfo->cantidad = count($listEstTraz);
        echo json_encode($_responeInfo);
    }
}