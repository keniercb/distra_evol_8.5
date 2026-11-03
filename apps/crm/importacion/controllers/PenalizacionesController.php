<?php

/**
 * @package        ERP-PCRM
 * @subpackage     CRM/contratacion/Controller
 * @author         Ing. Lisvany Alonso Martinez
 * @copyright (c)  2015, XETID
 * @version        1.0
 */

class PenalizacionesController extends ZendExt_Controller_Secure
{

    private $_model;

    function init()
    {
        parent::init();
        $this->_responeInfo = new ResponseInfo();
        $this->_penalizacionesDService = new PenalizacionesDService();
        $this->_model = new ComiteAprobacionModel();
        $this->_contratomodel = new GestioncontratoModel();
        $this->_penalizacionestadoDService = new PenalizacionEstadoDService();

    }

    function penalizacionesAction()
    {
        //$this->render();
    }

    public function cargarProductosAction()
    {
        $params = $this->_request->getPost();
        echo json_encode($this->_penalizacionesDService->cargarProductos($params));

    }

    public function cargarProductosPenalizacionesAction()
    {
        $params = $this->_request->getPost();
        echo json_encode(
            $this->_penalizacionesDService->cargarProductosPenalizaciones($params)
        );

    }

    public function getPenalizacionesAction()
    {
        $listPenalizaciones = $this->_penalizacionesDService->getPenalizaciones(
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
        echo json_encode($listPenalizaciones);
    }
//
    public function getPenalizacionesDocsAction()
    {
        $result = $this->_penalizacionesDService->getPenalizacionesDocs(
            $this->_request->getParams()['idespaciotrabajo']
        );
        echo json_encode($result);
    }

    public function adicionarPenalizacionAction()
    {
        $params = $this->_request->getParams();
        echo json_encode(
            $this->_penalizacionesDService->adicionarPenalizacion($params)
        );
    }

    public function getConfiguracionesAction()
    {
        $penalizaciones = new ConfPenalizaciones();
        echo json_encode($penalizaciones->getConfig());
    }

    public function modificarPenalizacionAction()
    {
        $params = $this->_request->getParams();
        echo json_encode(
            $this->_penalizacionesDService->modificarPenalizacion($params)
        );
    }

    function eliminarPenalizacionAction()
    {
        echo json_encode(
            $this->_penalizacionesDService->eliminarPenalizacion(
                json_decode($this->_request->getParams()['values'])
            )
        );
    }

    public function obtenerConsecutivoAction()
    {
        $result = $this->_penalizacionesDService->generarConsecutivoAño(
            $this->_request->getParams()
        );
        echo json_encode($result);
    }

    function cargarContratosAction()
    {
        $params = $this->_request->getPost();
        $result = $this->_penalizacionesDService->cargarContratos($params);
        echo json_encode($result);
    }
    function cargarArribosAction()
    {
        $params = $this->_request->getPost();
        $result = $this->_penalizacionesDService->cargarArribos($params);
        echo json_encode($result);
    }
    function cargarPorcientoPenalidadAction()
    {
        $params = $this->_request->getPost();
        $result = $this->_penalizacionesDService->cargarPorcientoPenalidad($params);
        echo json_encode($result);
    }
    function cargarFechaContratoAction()
    {
        $params = $this->_request->getPost();
        $result = $this->_penalizacionesDService->cargarFechaContrato($params);
        echo json_encode($result);
    }

    public function getEstadosPenalizacionAction()
    {
        $estadoas_aux= $this->_penalizacionestadoDService->getConfiguracionEstados();
        $estados = array_values($estadoas_aux);
        echo json_encode($estados);
    }

    public function obtenerTiposPenalidadesAction()
    {
        $result = $this->_penalizacionesDService->obtenerTiposPenalidades(
            $this->_request->getParams()
        );
        echo json_encode($result);
    }

    public function cambiarEstadoPenalizacionAction()
    {
        echo json_encode(
            $this->_penalizacionestadoDService->upEstadoPenalizacion(
                $this->_request->getPost()
            )
        );
    }

    public function getpenalizacionEstadoTrazasAction(){
        $listEstTraz=$this->_penalizacionestadoDService->getpenalizacionEstadoTrazas($this->_request->getParams()['idpenalidad']);
        $_responeInfo=new stdClass();
        $_responeInfo->datos = $listEstTraz;
        $_responeInfo->cantidad = count($listEstTraz);
        echo json_encode($_responeInfo);
    }
    public function historicoAction(){
        $params = $this->_request->getParams();
        $params['iddominio'] = $this->global->Perfil->iddominio;
        echo json_encode($this->_penalizacionesDService->historico($params));
    }
}