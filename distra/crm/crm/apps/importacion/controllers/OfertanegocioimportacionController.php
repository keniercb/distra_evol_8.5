<?php

/**
 * @package        ERP-PCRM
 * @subpackage     CRM/contratacion/Controller
 * @author         Ing. Lisvany Alonso Martinez
 * @copyright (c)  2015, XETID
 * @version        1.0
 */

class OfertanegocioimportacionController extends ZendExt_Controller_Secure
{

    function init()
    {
        parent::init();
        $this->_responeInfo = new ResponseInfo();
        $this->_ofertaDService = new OfertaNegocioDService();
        $this->_ofertaestadoDService = new OfertaNegocioEstadoDService();
        $this->confcontratacion = new ConfContratacionModel();
        $this->confoferta = new ConfOfertaNegocio();
        $this->_solicitudnegocio = new SolicitudNegocioDService();
        $this->_ofertacontenedor = new DatOfertaContenedor();

    }

    function ofertanegocioimportacionAction()
    {
        //$this->render();
    }

    public function getOfertasNegocioAction()
    {
         $listOfertas = $this->_ofertaDService->getOfertas(
             array(
                 'limit'=> $this->_getParam('limit', 20),
                 'start'=> $this->_getParam('start', 0),
                 'filters'=> array_merge($this->_getParam('filter', array()),
                     $this->_getParam('filtrogeneral', array())),
                 'filtrofijo'=> $this->_getParam('idsolicitud'),
                 'sorters'=>$this->_getParam('sort')
             )
         );
        echo json_encode($listOfertas);
    }

    public function adicionarOfertaNegocioAction()
    {
        $result=$this->_ofertaDService->adicionarOferta(
            array_merge(Zend_Json::decode($this->_getParam('values')), array('documento'=> $_FILES, 'params' => $this->_request->getParams())));
        echo json_encode($result);
    }

    public function modificarOfertaNegocioAction()
    {
        $result=$this->_ofertaDService->modificarOferta(
            array_merge(Zend_Json::decode($this->_getParam('values')), array('documento'=> $_FILES, 'params' => $this->_request->getParams())));
        echo json_encode($result);
    }

    public function adicionarOfertaAction()
    {
        $result=$this->_ofertaDService->adicionarOferta(
            array_merge(Zend_Json::decode($this->_getParam('values')), array('documento'=> $_FILES, 'params' => $this->_request->getParams())));
        echo json_encode($result);
    }

    public function modificarOfertaAction()
    {
        $result=$this->_ofertaDService->modificarOferta(
            array_merge(Zend_Json::decode($this->_getParam('values')), array('documento'=> $_FILES, 'params' => $this->_request->getParams())));
        echo json_encode($result);
    }

    public function eliminarOfertaNegocioAction()
    {
         $this->crudProxy('_ofertaDService', 'eliminarOferta');
    }

    public function getOfertaEstadoTrazasAction()
    {
        $listEstTraz = $this->_ofertaestadoDService->getEstadoTrazas(
            $this->_getParam('idoferta', 20)
        );
        $this->_responeInfo->datos = $listEstTraz;
        $this->_responeInfo->cantidad = count($listEstTraz);

        echo $this->_responeInfo->getJson();
    }

    public function getConfiguracionPermisosAction()
    {
        $this->_responeInfo->datos = array(
            'transitions' => $this->confcontratacion->loadtransitions(),
            'config' => $this->_ofertaDService->getConfigOfertaNegocio(),
            'gestordoc' =>$this->confoferta->getConfig(),
            'monedasconfig'=> $this->_ofertaDService->getMonedasEstructura(),
//            'planificacion'=> array('activo'=>false),
            'planificacion'=> array('activo'=>$this->confcontratacion->loadConfContratoPlanif()[0]?
                $this->confcontratacion->loadConfContratoPlanif()[0]['activo']=='1':false),
            'estadosolicitud'=> $this->_ofertaDService->getEstadoSolicitud(),
            'notificarinicial'=>NomProceso::getNotificacionInicial()
        );
        echo $this->_responeInfo->getJson();
    }

    public function cambiarOfertaEstadoAction()
    {
        $this->crudProxy('_ofertaestadoDService', 'cambiarOfertaEstado');
    }

    public function getSolicitudesNegocioAction(){
        echo json_encode($this->_ofertaDService->getSolicitudesNegocio($this->_request->getParams()));
    }

    public function getDatosAdicionalesAction(){
        $result=array(
            'anexos'=>$this->_ofertaDService->getAnexos($this->_request->getParams()),
            'hitos'=>$this->_ofertaDService->getHitosOferta($this->_request->getParams()),
            'indicadores'=>$this->_ofertaDService->getProductosServicios($this->_request->getParams()),
            'datoscontenedores'=>$this->_ofertacontenedor->getOfertasContenedores($this->_request->getParams())
        );
        echo json_encode($result);
    }

    public function getEstadosOfertaAction(){
        $estadoas_aux=$this->_ofertaestadoDService->getConfiguracionEstados();
        $estados=array_values($estadoas_aux);
        echo json_encode($estados);
    }

    public function obtenerDatosSolicitudAction(){
        $result=$this->_solicitudnegocio->getSolicitudes(
            array('filters'=>array(array('field'=>'idsolicitud',
                'data'=>array('type'=>'list', 'value'=>$this->_request->getParams()['idsolicitud']))))
        );
        echo json_encode($result);
    }

    public function getNumeroOfertaAutomaticoAction(){
        $params=$this->_request->getParams();
        echo json_encode($this->_ofertaDService->getNumeroOfertaAutomatico($params['tipo'], $params['codigolinea']));
    }

    public function getNumeroReofertaAutomaticoAction(){
        $params=$this->_request->getParams();
        echo json_encode($this->_ofertaDService->getNumeroReofertaAutomatico($params));
    }

    public function getMonedasAction(){
        $params=$this->_request->getParams();
        echo json_encode($this->_ofertaDService->getMonedas($params));
    }

    public function getTasasMonedaAction(){
        $params=$this->_request->getParams();
        echo json_encode($this->_ofertaDService->getTasasMoneda($params));
    }

    private function crudProxy($objectName, $methodName, $extraParams = array())
    {
        try{
            $result=$this->$objectName->$methodName(array_merge(Zend_Json::decode($this->_getParam('values')), $extraParams));
            $this->_responeInfo->success = true;
            if($result['datos'])$this->_responeInfo->datos = $result['datos'];
        }catch (Exception $e){
            $this->managerException($e);
        }

        echo $this->_responeInfo->getJson();
    }

    private function managerException($exception)
    {
        $exceptionClassName = get_class($exception);
        $businessExceptions = ['DuplicationValuesException', 'ElementInUseException', 'InvalidArgumentsException'];

        if(in_array($exceptionClassName, $businessExceptions))
        {
            $this->_responeInfo->success = false;
            $this->_responeInfo->codigoMsg = $exception->getCode();
            $this->_responeInfo->mensaje = $exception->getMessage();
        }else
            throw $exception;
    }

}