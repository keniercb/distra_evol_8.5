<?php

/**
 * @package        ERP-PCRM
 * @subpackage     CRM/contratacion/Controller
 * @author         Ing. Lisvany Alonso Martinez
 * @copyright (c)  2015, XETID
 * @version        1.0
 */
//$dir_www = str_ireplace('web', 'apps', $_SERVER['DOCUMENT_ROOT']);
//include_once($dir_www . '/crm/contratacion/models/bussines/SolicitudOfertaEstadoDService.php');
//include_once($dir_www . '/crm/contratacion/models/bussines/SolicitudOfertaEstadoDService.php');
class DemandaController extends ZendExt_Controller_Secure
{

    function init()
    {
        parent::init();
        $this->_responeInfo = new ResponseInfo();
        $this->_demandaDService = new DemandaDService();
        $this->_solicitudestadoDService = new SolicitudOfertaEstadoDService();
        $this->confcontratacion = new ConfContratacionModel();
        $this->confsolicitud = new ConfSolicitudNegocio();
        $this->_ofertaDService = new OfertaNegocioDService();
//        $this->_clientesproveedores = new NomClienteproveedorModel();
    }

    function demandaAction()
    {
        //$this->render();
    }

    public function getDemandasAction()
    {
//        $a=new ImportacionService();
//        $listSolicitudes=$a->guardarDemanda(array());
//        echo json_encode($listSolicitudes);
        $listSolicitudes = $this->_demandaDService->getDemandas(
            array(
                'limit'   => $this->_getParam('limit', 20),
                'start'   => $this->_getParam('start', 0),
                'filters' =>
                    array_merge(
                        $this->_getParam('filter', array()),
                        $this->_getParam('filtrogeneral', array())
                    ),
                'sorters' => $this->_getParam('sort')
            )
        );
        echo json_encode($listSolicitudes);
    }

    public function historialAction()
    {
        $params = $this->_request->getParams();
        $params['iddominio'] = $this->global->Perfil->iddominio;
        echo json_encode($this->_demandaDService->historial($params));
    }

    public function adicionarDemandaAction()
    {
        $this->crudProxy(
            '_demandaDService', 'adicionarDemanda',
            array('documento' => $_FILES,
                  'params'    => $this->_request->getParams())
        );
    }

    public function modificarDemandaAction()
    {
        $this->crudProxy(
            '_demandaDService', 'modificarDemanda',
            array('documento' => $_FILES,
                  'params'    => $this->_request->getParams())
        );
    }

    public function eliminarDemandaAction()
    {
        $this->crudProxy('_demandaDService', 'eliminarDemanda');
    }

    public function getConfiguracionPermisosAction()
    {
//        $this->_responeInfo->datos = array(
//            'gestordoc' =>$this->confsolicitud->getConfig(),
//        );
        $result = array(
            'gestordoc' => $this->confsolicitud->getConfig(),
            'notificarinicial'=>NomProceso::getNotificacionInicial('solicituddemanda')
        );
        echo json_encode($result);
//        echo $this->_responeInfo->getJson();
    }

    public function getDemandaEstadoTrazasAction()
    {
        $listEstTraz = $this->_solicitudestadoDService->getEstadoTrazas(
            $this->_getParam('idsolicitud', 20)
        );
        $this->_responeInfo->datos = $listEstTraz;
        $this->_responeInfo->cantidad = count($listEstTraz);

        echo $this->_responeInfo->getJson();
    }

    public function getConfiguracionEstadosAction()
    {
        $this->_responeInfo->datos = array(
            'conf' => $this->confsolicitud->getConfig(),
            'transitions' => $this->confcontratacion->loadtransitions(),
            'naturaleza'=>$this->_demandaDService->cargarNaturaleza(),
            'monedasconfig'=> $this->_ofertaDService->getMonedasEstructura(),
        );
        echo $this->_responeInfo->getJson();
//        echo $this->_responeInfo->getJson();
    }

    public function getEstadosDemandaAction()
    {
        $estadoas_aux
            = $this->_solicitudestadoDService->getConfiguracionEstados();
        $estados = array_values($estadoas_aux);
        echo json_encode($estados);
    }

    public function cambiarDemandaEstadoAction()
    {
        $this->crudProxy('_solicitudestadoDService', 'cambiarSolicitudEstado');
    }

    public function cargarProveedoresDemandaAction()
    {
        $resp = $this->_demandaDService->cargarProveedoresSolicitud(
            $this->_getParam('idsolicitud')
        );
//        print_r($resp);
        echo json_encode($resp);
    }

    public function cargarProveedoresAction()
    {
//        $params['idestructuracomun'] = $this->global->Estructura->idestructura;
//        $params['filter']=array('field'=>'idtipo', 'data'=>array('type'=>'list', 'value'=>'[2]'));
//        $filter = array('padres'=>true);
        $filter = null;
//        if($this->_getParam('idsolicitud')!=-1){
//            $objDoctrine = Doctrine_Manager::getInstance();
//            $conexionActual = $objDoctrine->getCurrentConnection();
//            $datos = $conexionActual->fetchAll(
//                'SELECT snp.idproveedor
//                FROM mod_crmcontratacion.dat_solicitudnegocioproveedor snp
//                WHERE snp.idsolicitudnegocio='.$this->_getParam('idsolicitud')
//            );
//            if(count($datos)>0){
//                $ids=array();
//                foreach($datos as $d){
//                    $ids[]=$d['idproveedor'];
//                }
//                $filter=array('idclientesproveedores'=>array('notin'=>1, 'ids'=>array_values($ids)));
//            }
//        }
        if ($this->_getParam('nombre') && $this->_getParam('nombre') != '') {
            $filter = array('filter' => array(array('field' => 'nombre',
                                                    'data'  => array('type'  => 'string',
                                                                     'value' => $this->_getParam(
                                                                         'nombre'
                                                                     )))) );
//            $filter=array('nombre'=>$this->_getParam('nombre'));
        }
        if($this->_getParam('idlinea') && $this->_getParam('idlinea')!=''){
            $objDoctrine = Doctrine_Manager::getInstance();
            $conexionActual = $objDoctrine->getCurrentConnection();
            $datosconlinea=$conexionActual->fetchAll("
                    SELECT idclienteproveedor FROM mod_datosmaestros.dat_clienteproveedorlinea 
                    WHERE idlinea=".$this->_getParam('idlinea')
            );
            $conlinea=array();
            foreach($datosconlinea as $linea){
                $conlinea[]=$linea['idclienteproveedor'];
            }
            $filter['idclientesproveedores']=$conlinea;
        }
        $result
            = $this->integrator->datosmaestros->getClientesProveedorByParams(
            null, $this->global->Estructura->idestructura, false, true, $filter,
            $this->_getParam('start'), $this->_getParam('limit')
        );


//        $result = NomClienteproveedorModel::obtenerClientesproveedores($params, true);
//        $result = $this->_clientesproveedores->cargarClientesproveedores($params, true);
//        $resp=$this->_demandaDService->cargarProveedoresSolicitud($this->_getParam('idsolicitud'));
//        print_r($resp);
        echo json_encode($result);
    }

    public function obtenerProductoServicioAction()
    {
        $resp = $this->_demandaDService->obtenerProductoServicio(
            $this->_request->getParams()
        );
        echo json_encode($resp);
    }

//    private function crudProxy($objectName, $methodName, $extraParams = array())
//    {
//        try {
//            $this->$objectName->$methodName(
//                array_merge(
//                    Zend_Json::decode($this->_getParam('values')), $extraParams
//                )
//            );
//        } catch (Exception $e) {
//            $this->managerException($e);
//        }
//
//        echo $this->_responeInfo->getJson();
//    }

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
        $businessExceptions = ['DuplicationValuesException',
                               'ElementInUseException',
                               'InvalidArgumentsException'];

        if (in_array($exceptionClassName, $businessExceptions)) {
            $this->_responeInfo->success = false;
            $this->_responeInfo->codigoMsg = $exception->getCode();
            $this->_responeInfo->mensaje = $exception->getMessage();
        } else {
            throw $exception;
        }
    }

    public function getAreasImplicadasAction()
    {
        $result = $this->_demandaDService->getAreasImplicadas(
            $this->_request->getParams()['idsolicitud']
        );
        echo json_encode($result);
    }

    public function getDemandaDocsAction()
    {
        $result = $this->_demandaDService->getSolicitudDocs(
            $this->_request->getParams()['idespaciotrabajo']
        );
        echo json_encode($result);
    }

    public function getNomencladoresDinamicosAction()
    {
        $result = $this->_demandaDService->cargarLineas(
            $this->_request->getParams()
        );
        echo json_encode($result);
    }

    public function cargarLineasAction()
    {
        $result = $this->_demandaDService->cargarLineas(
            $this->_request->getParams()
        );
        echo json_encode($result);
    }

    public function obtenerTiposLineasAction()
    {
        $result = $this->_demandaDService->obtenerTiposLineas(
            $this->_request->getParams()
        );
        echo json_encode($result);
    }

    public function getLineasClientesAction()
    {
        $result = $this->_demandaDService->getLineasClientes(
            $this->_request->getParams()
        );
        echo json_encode($result);
    }

    public function obtenerConsecutivoAction()
    {
        $result = $this->_demandaDService->generarConsecutivoAño(
            $this->_request->getParams()['tipo']
        );
        echo json_encode($result);
    }

    public function comprobarMarcoAction(){
        $result = $this->_demandaDService->comprobarMarco(
            $this->_request->getParams()
        );
        echo json_encode($result);
    }

    public function montosContratoAction(){
        $result = $this->_demandaDService->comprobarMarco(
            $this->_request->getParams()
        );
        echo json_encode($result);
    }

    public function guardarMarcoContractualAction(){
        $result = $this->_demandaDService->guardarMarcoContractual(
            $this->_request->getParams()
        );
        echo json_encode($result);
    }

    public function guardarEstadoMarcoContractualAction(){
        $estado = new NomEstado();
        $idestado=$estado->getEstadoByAction('pliego');
        if($idestado) {
            $params=$this->_request->getParams();
            $params['idestado']=$idestado;
//            $this->crudProxy('_solicitudestadoDService', 'cambiarSolicitudEstado', array('idestado'=>$idestado));
            $this->_solicitudestadoDService->cambiarSolicitudEstado($params);
            echo $this->_responeInfo->getJson();
        }else{
            echo json_encode(array('success' => false,
                'msg' => 'No se encuentra ningún estado configurado para pliego.'));
        }
    }

}