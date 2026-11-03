<?php

/**
 * @package        ERP-PCRM
 * @subpackage     CRM/contratacion/Controller
 * @author         Ing. Lisvany Alonso Martinez
 * @copyright (c)  2015, XETID
 * @version        1.0
 */

class SolicitudnegocioimportacionController extends ZendExt_Controller_Secure
{

    function init()
    {
        parent::init();
        $this->_responeInfo = new ResponseInfo();
        $this->_solicitudDService = new SolicitudNegocioDService();
        $this->_solicitudestadoDService = new SolicitudOfertaEstadoDService();
        $this->confcontratacion = new ConfContratacionModel();
        $this->confsolicitud = new ConfSolicitudNegocio();
        $this->_ofertaDService = new OfertaNegocioDService();
//        $this->_clientesproveedores = new NomClienteproveedorModel();
    }

    function solicitudnegocioimportacionAction()
    {
        //$this->render();
    }

    public function getSolicitudesNegocioAction()
    {
//        print_r($this->_request->getPost());
//        print_r($this->_getParam('filter'));die;
        $listSolicitudes = $this->_solicitudDService->getSolicitudes(
            array(
                'limit'   => $this->_getParam('limit', 20),
                'start'   => $this->_getParam('start', 0),
                'filters' => array_merge(
                    $this->_getParam('filter', array()),
                    $this->_getParam('filtrogeneral', array())
                ),
                'sorters' => $this->_getParam('sort')
            )
        );
//        $this->_responeInfo->datos = $listSolicitudes['datos'];
//        $this->_responeInfo->cantidad = $listSolicitudes['cant'];

        echo json_encode($listSolicitudes);
//        echo $this->_responeInfo->getJson();
    }

    public function adicionarSolicitudNegocioAction()
    {
//        $this->crudProxy(
//            '_solicitudDService', 'adicionarSolicitud',
//            array('documento' => $_FILES,
//                  'params'    => $this->_request->getParams())
//        );
        $result=$this->_solicitudDService->adicionarSolicitud(
            array_merge(Zend_Json::decode($this->_getParam('values')), array('documento'=> $_FILES, 'params' => $this->_request->getParams())));
        echo json_encode($result);
    }

    public function modificarSolicitudNegocioAction()
    {
//        $this->crudProxy(
//            '_solicitudDService', 'modificarSolicitud',
//            array('documento' => $_FILES,
//                  'params'    => $this->_request->getParams())
//        );
        $result=$this->_solicitudDService->modificarSolicitud(
            array_merge(Zend_Json::decode($this->_getParam('values')), array('documento'=> $_FILES, 'params' => $this->_request->getParams())));
        echo json_encode($result);
    }

    public function eliminarSolicitudNegocioAction()
    {
        $this->crudProxy('_solicitudDService', 'eliminarSolicitud');
    }

    public function getConfiguracionPermisosAction()
    {
//        $this->_responeInfo->datos = array(
//            'gestordoc' =>$this->confsolicitud->getConfig(),
//        );
        $result = array(
            'gestordoc' => $this->confsolicitud->getConfig(),
            'notificarinicial'=>NomProceso::getNotificacionInicial('solicitudofertaimportacion')
        );
        echo json_encode($result);
//        echo $this->_responeInfo->getJson();
    }

    public function getSolicitudEstadoTrazasAction()
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
            'naturaleza'=>$this->_solicitudDService->cargarNaturaleza(),
            'monedasconfig'=> $this->_ofertaDService->getMonedasEstructura(),
            'estadolistodemanda'=>NomEstado::getEstadoByAction('listodemanda')
        );
        echo $this->_responeInfo->getJson();
//        echo $this->_responeInfo->getJson();
    }

    public function getEstadosSolicitudAction()
    {
        $estadoas_aux
            = $this->_solicitudestadoDService->getConfiguracionEstados();
        $estados = array_values($estadoas_aux);
        echo json_encode($estados);
    }

    public function cambiarSolicitudEstadoAction()
    {
        $this->crudProxy('_solicitudestadoDService', 'cambiarSolicitudEstado');
    }

    public function cargarProveedoresSolicitudAction()
    {
        $resp = $this->_solicitudDService->cargarProveedoresSolicitud(
            $this->_getParam('idsolicitud')
        );
//        print_r($resp);
        echo json_encode($resp);
    }

    public function cargarProveedoresAction()
    {
//        try {
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
                    'data' => array('type' => 'string',
                        'value' => $this->_getParam(
                            'nombre'
                        )))));
//            $filter=array('nombre'=>$this->_getParam('nombre'));
            }
//        print($this->_getParam('idlinea'));die;
            if ($this->_getParam('idlinea') && $this->_getParam('idlinea') != '') {
                $objDoctrine = Doctrine_Manager::getInstance();
                $conexionActual = $objDoctrine->getCurrentConnection();
//            print_r("
//                    SELECT idclienteproveedor FROM mod_datosmaestros.dat_clienteproveedorlinea
//                    WHERE idlinea=".$this->_getParam('idlinea'));
//            die;
                $datosconlinea = $conexionActual->fetchAll("
                    SELECT idclienteproveedor FROM mod_datosmaestros.dat_clienteproveedorlinea 
                    WHERE idlinea::varchar=" . $this->_getParam('idlinea') . "::varchar"
                );
                if (count($datosconlinea) > 0) {
                    $conlinea = array();
                    foreach ($datosconlinea as $linea) {
                        $conlinea[] = $linea['idclienteproveedor'];
                    }
                    $filter['idclientesproveedores'] = $conlinea;
                } else {
                    $filter['idclientesproveedores'] = array(-1);
                }

            }
            $result
                = $this->integrator->datosmaestros->getClientesProveedorByParams(
                null, $this->global->Estructura->idestructura, false, true, $filter,
                $this->_getParam('start'), $this->_getParam('limit')
            );


//        $result = NomClienteproveedorModel::obtenerClientesproveedores($params, true);
//        $result = $this->_clientesproveedores->cargarClientesproveedores($params, true);
//        $resp=$this->_solicitudDService->cargarProveedoresSolicitud($this->_getParam('idsolicitud'));
            echo json_encode($result);
//        }catch(Exception $e){
//            print('Controller');
//            print_r($e);
//        }
    }

    public function obtenerProductoServicioAction()
    {
        $resp = $this->_solicitudDService->obtenerProductoServicio(
            $this->_getParam('idsolicitud')
        );
        echo json_encode($resp);
    }

    private function crudProxy($objectName, $methodName, $extraParams = array())
    {
        try {
            $result=$this->$objectName->$methodName(
                array_merge(
                    Zend_Json::decode($this->_getParam('values')), $extraParams
                )
            );
            $this->_responeInfo->success = true;
            if($result['datos'])$this->_responeInfo->datos = $result['datos'];
        } catch (Exception $e) {
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
        $result = $this->_solicitudDService->getAreasImplicadas(
            $this->_request->getParams()['idsolicitud']
        );
        echo json_encode($result);
    }

    public function getSolicitudDocsAction()
    {
        $result = $this->_solicitudDService->getSolicitudDocs(
            $this->_request->getParams()['idespaciotrabajo']
        );
        echo json_encode($result);
    }

    public function getNomencladoresDinamicosAction()
    {
        $result = $this->_solicitudDService->cargarLineas(
            $this->_request->getParams()
        );
        echo json_encode($result);
    }

    public function cargarLineasAction()
    {
        $result = $this->_solicitudDService->cargarLineas(
            $this->_request->getParams()
        );
        echo json_encode($result);
    }

    public function obtenerTiposLineasAction()
    {
        $result = $this->_solicitudDService->obtenerTiposLineas(
            $this->_request->getParams()
        );
        echo json_encode($result);
    }

    public function getLineasClientesAction()
    {
        $result = $this->_solicitudDService->getLineasClientes(
            $this->_request->getParams()
        );
        echo json_encode($result);
    }

    public function obtenerConsecutivoAction()
    {
        $result = $this->_solicitudDService->generarConsecutivoAño(
            $this->_request->getParams()['tipo']
        );
        echo json_encode($result);
    }

    public function obtenerDemandasSeleccionadasAction()
    {
        $result = $this->_solicitudDService->obtenerDemandasSeleccionadas(
            $this->_request->getParams()
        );
        echo json_encode($result);
    }

    public function exportarWordSolicitudImpAction(){
        $result = $this->_solicitudestadoDService->exportarWordSolicitudImp($this->_request->getParams());
        echo json_encode($result);
    }

    public function exportarExcelSolicitudImpAction(){
        $result = $this->_solicitudestadoDService->exportarExcelSolicitudImp($this->_request->getParams());
        echo json_encode($result);
    }
}
