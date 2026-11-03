<?php

/**
 * Controlador encargado de manejar lo referente a la gestion
 * de los contratos del modulo Contratacion de PCRM.
 *
 * @package        ERP-PCRM
 * @subpackage     CRM/contratacion/Controller
 * @author         Ing. Rodain Terrer Molina <rterrer@xetid.cu>
 * @copyright (c)  2015, XETID
 * @version        1.0
 */
class GestioncontratoController extends ZendExt_Controller_Secure
{

    function init()
    {
        $this->model = new GestioncontratoModel();
        $this->confcontratacion = new ConfContratacionModel();
        $this->dat = new DatContrato();
        $this->_gestordocumental = new GestorDocumentalComunicationInterface();
        parent::init();
    }

    function gestioncontratoAction()
    {
//        $this->render();
    }

    function cargarconfigdbAction()
    {
        $url = (string)Zend_Registry::getInstance()->config->xml->modulesconfig;
        if (file_exists($url)) {
            $simpleXml = simplexml_load_file($url);
            echo json_encode($simpleXml->conn);
        }
    }

    function cargarcontratoAction()
    {
        $params = $this->_request->getParams();
//        $params = $this->_request->getPost();
        $params['ultimocontrato'] = true;
//        print_r($params);die;
        $result = $this->model->getContratos($params);
        echo json_encode($result);
    }

    function filterliststoreAction()
    {
        echo json_encode(
            $this->model->filterListStore(
                $this->_request->getParams()['columnlist']
            )
        );
//        echo json_encode(
//            $this->dat->filterListStore(
//                $this->_request->getParams()['columnlist'],
//                $this->global->Estructura->idestructura
//            )
//        );
    }

    /**
     * Funcionalidad que obtiene la relacion de estados iniciales y las transiciones
     * a estados finales a las cuales el usuario autenticado tiene permiso.
     */
    public function getTransitionsAction()
    {
        $post = $this->_request->getPost();
        echo json_encode($this->model->getTransitions($post));
    }

    /**
     * Funcionalidad que obtiene los tipos de contratos.
     */
    public function getTiposContratosAction()
    {
        echo json_encode(
            array('data' => $this->model->getTiposContratos(
                $this->_request->getParams()
            ))
        );
    }

    /**
     * Funcionalidad que obtiene los elementos de un tipo de contrato.
     */
    public function getElementoContratoAction()
    {
        $result = $this->model->getElementoContrato(
            $this->_request->getParams()
        );
        echo json_encode(array('data' => $result));
    }

    public function addcontratoAction()
    {
//        print_r($this->_request->getParams());die;
        $result = $this->model->saveContrato($this->_request->getParams());
        if ($result) {
            echo json_encode($result);
        }
    }

    public function updatecontratoAction()
    {
        //$result = $this->model->upContrato($this->_request->getParams());
        $result = $this->model->saveContrato($this->_request->getParams());
        if ($result) {
            echo json_encode($result);
        }
    }

    public function delcontratoAction()
    {
        echo json_encode(
            $this->model->delContrato(
                json_decode($this->_request->getParams()['arrayDel'])
            )
        );
    }

   public function desactivarcontratoAction()
    {
        echo json_encode(
            $this->model->desactivarcontrato(
                json_decode($this->_request->getParams()['arrayDel'])
            )
        );
    }

    public function activarcontratoAction()
    {
        echo json_encode(
            $this->model->activarcontrato(
                json_decode($this->_request->getParams()['arrayDel'])
            )
        );
    }
    public function cambiarestadoAction()
    {
        echo json_encode(
            $this->model->upEstadoContrato($this->_request->getPost())
        );
    }

    public function cargardatoselementoAction()
    {
        echo json_encode(
            $this->dat->cargarDatosElemento($this->_request->getPost())
        );
    }

    public function cargarmonedasAction()
    {
        echo json_encode($this->dat->cargarMonedas($this->_request->getPost()));
    }

    public function cargartasasAction()
    {
        echo json_encode($this->dat->cargarTasas($this->_request->getParams()));
    }

    public function historialAction()
    {
        $params = $this->_request->getParams();
        $params['iddominio'] = $this->global->Perfil->iddominio;
        echo json_encode($this->model->historial($params));
    }

    public function generarNumeroAction()
    {
        echo json_encode(
            $this->model->generarNumero($this->_request->getParams())
        );
    }

    public function modificarNumeroAction()
    {
        $params = $this->_request->getParams();
        $result = $this->model->modificarNumero($params);
        echo json_encode($result);
    }

    public function getListadoPersonasAction()
    {
        $result = $this->model->getListadoPersonas(
            $this->_request->getParams()
        );
        echo json_encode(
            array('data' => $result->data, 'count' => $result->quantity)
        );
    }

    public function getPersonaPerfilAction()
    {
        $result = $this->model->getPersonaByPerfil();
        echo json_encode(array('data' => $result));
    }

    public function getCondicionesPagoAction()
    {
        $condic = $this->model->getCodicionesPago($this->_request->getParams());
        echo json_encode(
            array('data' => $condic['data'], 'count' => $condic['total'])
        );
    }

    public function getFileAction()
    {
        $result = $this->model->getFile($this->_request->getParams());
        if ($result) {
            echo json_encode($result);
        }
    }

    public function getProductoAction()
    {
        $params = $this->_request->getParams();
//        print_r(json_decode($params['filter'])[0]->value);

//        print_r($params);
        $result = $this->model->getProducto($params);
        echo json_encode(
            array('data'    => $result['datos'], 'total' => $result['cantidad'],
                  'success' => true)
        );
    }

    public function getServiciosAction()
    {
        $params = $this->_request->getParams();
        $result = $this->model->getServicios($params);
        echo json_encode(
            array('data'    => $result['datos'], 'total' => $result['total'],
                  'success' => true)
        );
    }

    public function getDatosAdicionalesAction()
    {
        $params = $this->_request->getParams();
        $result = $this->model->getDatosAdicionales($params);
        echo json_encode(array('data' => $result, 'success' => true));
    }

    public function getAreasAction()
    {
        $params = $this->_request->getParams();
        $result = $this->model->getAreas($params);
        echo json_encode(array('data' => $result, 'success' => true));
    }

    public function getConfiguracionesAction()
    {
        $result = array();
        $result['transitions'] = $this->confcontratacion->loadtransitions();
        $result['contractdoc'] = $this->confcontratacion->loadContractdoc();
        $result['estructura'] = $this->model->getEstructuraActual();
        $result['planificacion']
            = array('activo' => $this->confcontratacion->loadConfContratoPlanif(
        )[0] ?
            $this->confcontratacion->loadConfContratoPlanif()[0]['activo']
            == '1' : false);
        $result['contabilidad'] = $this->model->getContabilidad();
        $result['configuracion']=$this->confcontratacion->loadConfContratoGeneral()['config'];
        $result['filtros'] = $this->model->obtenerConfiguracionPorDefecto();
        $modulesmodel = new ModulesModel();
        $modules=(array)json_decode($modulesmodel->load()['data']['valores']);
        $result['modulos'] = $modules;
        // $file = APP_HOME . '../../../comun/recursos/server_config.ini';
        // if (file_exists($file)) {
        //     $config = parse_ini_file($file, true);
        //     $result['config_file1'] = $config['contratos'];
        // }
        $instance = (new ConfContratoGeneral())->getConfig();           
        $result['config_file'] = (array)json_decode($instance['confgcontrato']);
        $result['notificarinicial']=NomProceso::getNotificacionInicial(array('mdContrato', 'mdcontratoproveedor'));
        echo json_encode($result);
    }

    public function getPlantillasProyectosAction()
    {
        $params = $this->_request->getParams();
        $result = $this->model->getPlantillasProyectos($params);
        echo json_encode($result);
    }

    public function cargarhitoscontratoAction()
    {
        $params = $this->_request->getParams();
//        print_r(json_decode($params));die;
        $result = $this->model->cargarhitoscontrato($params);
        echo json_encode($result);
    }

    public function obtenerConfiguracionVigenciaAction()
    {
//        $params = $this->_request->getParams();
//        print_r($params['filter']);die;
        $result = $this->model->obtenerConfiguracionVigencia();
        echo json_encode($result);
    }

    public function guardarConfiguracionVigenciaAction()
    {
        $params = $this->_request->getParams();
        $result = $this->model->guardarConfiguracionVigencia($params);
        echo json_encode($result);

    }

    public function getElementosNumeroContratoAction()
    {
        $params = $this->_request->getParams();
        $result = $this->model->getElementosNumeroContrato($params);
        echo json_encode($result);
    }

    public function getTipoPrecioAction()
    {
        $params = $this->_request->getParams();
        echo json_encode($this->model->getTipoPrecio($params));
    }

    public function getAreaResponsableAction()
    {
        echo json_encode(
            $this->model->getAreaResponsable($this->_request->getParams())
        );
    }

    public function guardarConfValoresPorDefectoAction()
    {
        echo json_encode(
            $this->model->guardarConfValoresPorDefecto(
                $this->_request->getParams()
            )
        );
    }

    public function obtenerConfiguracionPorDefectoAction()
    {
        echo json_encode(
            $this->model->obtenerConfiguracionPorDefecto(
//                $this->_request->getParams()
            )
        );
    }

    public function getCategoriasAction()
    {
        echo json_encode(
            $this->model->getCategorias($this->_request->getParams())
        );
    }

    public function obtenerAtributosVehiculosAction()
    {
        echo json_encode(
            $this->model->obtenerAtributosVehiculos(
                $this->_request->getParams()
            )
        );
    }

    public function getVehiculosAction()
    {
        echo json_encode(
            $this->model->getVehiculos(
                $this->_request->getParams()['idclienteproveedor']
            )
        );
    }

    public function getVehiculosContratoAction(){
        echo json_encode($this->model->getVehiculosContrato($this->_request->getParams()['idcontrato']));
    }
    public function descargarAnexoLocalAction()
    {
        $this->model->descargarAnexoLocal($this->_request->getParams());
    }

    public function comprobarDeudaClienteProveedorAction()
    {
        echo json_encode(
            $this->model->comprobarDeudaClienteProveedor(
                $this->_request->getParams()['idclienteproveedor']
            )
        );
    }

    public function guardardocumentoAction()
    {
        echo json_encode(
            $this->model->guardardocumento($this->_request->getPost())
        );
    }

    public function guardarDocumentosAction()
    {
        echo json_encode(
            $this->model->guardarDocumentos($this->_request->getPost())
        );
    }

    public function getContratoEstadoTrazasAction()
    {
        $listEstTraz = $this->model->getContratoEstadoTrazas(
            $this->_request->getParams()['idcontrato']
        );
        //print_r($listEstTraz);die;
        //$_responeInfo=stdClass();
        $_responeInfo->datos = $listEstTraz;
        $_responeInfo->cantidad = count($listEstTraz);
        echo json_encode($_responeInfo);
    }

    public function obtenerParametrosClasesAction()
    {
        echo json_encode($this->model->obtenerParametrosClases($this->_request->getParams()));
    }

    public function getAreasImplicadasAction()
    {
        $result = $this->model->getAreasImplicadas(
            $this->_request->getParams()['idcontrato']
        );
        echo json_encode($result);
    }

	public function guardarCambioAreaAction()
    {
        $params = $this->_request->getParams();
        $result = $this->model->guardarCambioArea($params);
        echo json_encode($result);
    }
    
     public function getTodasAreasAction()
    {
        $params = $this->_request->getParams();
        $result = $this->model->getTodasAreas($params);
        echo json_encode($result);
    }
    
     public function cargarElementosNumeroContratoAction()
    {
        $params = $this->_request->getParams();
        echo json_encode($this->model->cargarElementosNumeroContrato($params));
    }

    public function modificarNumeroContratoAction()
    {
        $params = $this->_request->getParams();
        echo json_encode($this->model->modificarNumeroContrato($params));
    }

    public function getArchivoAction()
    {
        $params = $this->_request->getParams();
//        print('/*nombre::'.$params['idnodo'].'*/');
        echo json_encode($this->model->getArchivo($params['idnodo']));

////        echo json_encode($this->model->getArchivo($this->_request->getParams()));
//        $params = $this->_request->getParams();
////        print('/*nombre::'.$params['nombre'].'*/');
////        print('/*func::'.$params['idnodo'].'*/');die;
////        if (file_exists($idnodo)) {
//        print_r($params);die;
//        $params['iddocument'] = $params['idnodo'];
//        $result = $this->_gestordocumental->getFile($params);
//        $nombre = $params['idnodo'];
//        $result = $result . '.jpg';
////            print_r($result);die;
//        if ($result && file_exists($result)) {
//            $path = '';
//            $path = $path . '' . $result;
////            $path=$path.''.str_replace('/', '\\',$result);
////            $path=$path.''.str_replace('\\','/', $result);
////            $path=$path.''.'.jpg';
////            header($_SERVER["SERVER_PROTOCOL"] . " 200 OK");
//            header("Cache-Control: public"); // needed for internet explorer
////            header("Content-Length:" . filesize($path));
//            header("Content-Description: File Transfer");
//            header("Content-Disposition: attachment; filename=\"aaaasd.jpg\"");
////            header("Content-Type: image/jpeg");
//            header("Content-type: octet/stream");
//            header("Content-Transfer-Encoding: Binary");
//            header('Expires: 0');
//            header('Cache-Control: must-revalidate');
//            header('Pragma: public');
////            header("Content-Type: application/zip");
////            $file = fopen($path, 'r');
//            ob_clean();
//            flush();
//            readfile($path);
//            exit;
////            unlink($path);
////            echo $file;
////            return true;

//        } else {
////            print('nooooooo');die;
//            echo 'Hubo un error cargando el archivo.';
////            echo 'No existe buajajaja. Este mensaje se autodestruira en 10 segundos.';
//        }
    }
    public function getDocumentosAction()
    {
       $parametros = $this->_request->getParams();
       
         $resultado=$this->model->getDocumentosreales($parametros['idnodo']);
       //  print_r($resultado);die;
        /* if($resultado)
         {
          echo json_encode(array('success' => true, 'valor' => 'asdssad','codMsg' =>'asdssad'));
            //return true;
         }else
         {
         echo json_encode(
            array('success' => false, valor => '',
                  'codMsg'     => 'El modelo pedido para mostrar los datos, no existe o no se encuentra generado en el modelo de doctrine.')
        );
         }*/
     echo json_encode(
            array('success' => false, valor => '',
                  'codMsg'     => 'El modelo pedido para mostrar los datos, no existe o no se encuentra generado en el modelo de doctrine.'));
    }
	
	 public function guardarCambioArea($params)
    {
        try {
            if ($this->global->Perfil->idestructuracomun
                != $params['idestructura']
            ) {
                $idscontratos = json_decode($params['idscontratos']);
                $objDoctrine = Doctrine_Manager::getInstance();
                $conexionActual = $objDoctrine->getCurrentConnection();
                if ($params['idscontratos']) {
                    if (count($idscontratos) > 0) {
                        foreach ($idscontratos as $actual) {
                            $contrato = Doctrine::getTable('DatContrato')->find(
                                $actual
                            );
                            $contrato->idarea = $params['idestructura'];
                            $contrato->save();
//                            print($actual);die;
                            $hitos = $conexionActual->fetchAll("
                                    SELECT h.idcontrato,h.idhito,h.idarea
                                    FROM mod_crmcontratacion.dat_hito h
                                    WHERE h.idcontrato = $actual");
                            foreach ($hitos as $h) {
//                                print_r('kkkkk');die;
                                $hito=Doctrine::getTable('DatHitoContrato')->find(
                                    $h['idhito']
                                );
                                $hito->idarea = $params['idestructura'];
                                $hito->save();

                            }

                        }

                        return array('success' => true, 'code' => 1);
                    }
                }
            } else {
                return array('success' => true, 'code' => 3);
            }
        } catch (Exception $e) {
            if ($e->getCode() == 335) {
                return;
            }
            return array('code'    => $e->getCode(), 'msg' => $e->getMessage(),
                         'success' => false);
        }
    }
	
	  public function getAreaConPermisoAction()
    {    
	    
        $result = $this->model->getAreaConPermiso($this->_request->getParams()['idcontrato']);
        echo json_encode($result);
    }

    public function realizarAjusteMonetarioAction(){
        $result = $this->model->realizarAjusteMonetario($this->_request->getParams());
        echo json_encode($result);
    }

    public function limpiarEspacioTrabajoAction(){
        $result = $this->model->limpiarEspacioTrabajo($this->_request->getParams());
        echo json_encode($result);
    }

    public function arreglarEstadoAction(){
        $result = $this->model->arreglarEstado($this->_request->getParams());
        echo json_encode($result);
    }

    public function cargarNaturalezasAction(){
        $result = $this->model->cargarNaturalezas($this->_request->getParams());
        echo json_encode($result);
    }

    public function exportarExcelAction(){
        $result = $this->model->exportarExcel($this->_request->getParams());
        echo json_encode($result);
    }

    public function reportecomplejoAction(){
        try {
            $this->view->reccompleja = $this->integrator->reccomplejas->obtenerScriptsReccomplejas();
            $this->render('reportecomplejo');
        }catch(Exception $r){
            echo $r->getMessage();
        }
//        $this->view->reccompleja = $this->integrator->reccomplejas->obtenerScriptsReccomplejas();
//        $this->render('reportecomplejo');
    }

    public function generarPDFAction(){
        echo $this->model->generarPDF($this->_request->getParams());
    }

    public function exportarDetallesAction(){
        echo $this->model->exportarDetalles($this->_request->getParams());
    }

    public function getHitosFacturadosAction(){
        $result = $this->model->getHitosFacturados($this->_request->getParams());
        echo json_encode($result);
    }

    public function getFacturasContratosAction(){
        $result = $this->model->getFacturasContratos($this->_request->getParams());
        echo json_encode($result);
    }


}
