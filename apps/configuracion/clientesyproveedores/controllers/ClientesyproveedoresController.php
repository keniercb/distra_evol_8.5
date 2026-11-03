<?php

/**
 * Clase controladora para gestionar los clientes y/o proveedores.
 *
 * @author     Ing. Maikel Garcia Valdes.
 * @package    Configuración
 * @subpackage clientesyproveedores/Controllers
 * @copyright  XETID.
 * @version    1.0-0
 */
class ClientesyproveedoresController extends ZendExt_Controller_Secure
{

    /**
     * Inicializa la vista
     */
    function init()
    {
        parent::init();
        $this->model = new NomClienteproveedorModel();
    }

    /**
     * Inicializa la vista
     */
    function clientesyproveedoresAction()
    {
        /*$params = array(
            'cliente'=>1,
            'vigente'=>1,
            'idclienteproveedor'=>990000000215
        );
        echo json_encode($this->integrator->crm->obtenerContratos($params));*/
        /*$params = array(
            'idcontrato'=>904
        );
        echo json_encode($this->integrator->crm->obtenerDatosAdicionales($params));*/
        $this->view->jsrepresentacion = $this->model->devolverJS();
        //verificacion si existe el modulo de contabilidad
        $existe = $this->model->existeContabilidad();
        $this->view->existecont
            = '<script type="text/javascript"> var existe_cont=' . json_encode($existe) . '</script>';
        $this->render();
    }

    function cargarclientesproveedorAction()
    {
        try {
            $post = $this->_request->getPost();
            $idestructura = $this->global->Estructura->idestructura;
            if ($post['idestructura']) {
                $idestructura = $post['idestructura'];
            }
            $cond['idestructuracomun'] = $idestructura;
            $idtipo = $this->_request->getPost('idtipo');
            $filtro = $this->_request->getPost('filtro');
            $filters = $this->_request->getPost('filter');
            $condicion = $this->_request->getPost('condicion');
            $nombre = $this->_request->getPost('nombre');
            $enuso = $this->_request->getPost('enuso');
            $filtronomb = $this->_request->getPost('filtronomb');
            $idclasificacion = $this->_request->getPost('idclasificacion');
//            print('/*'.json_decode($enuso).'*/');
            if (!empty($filtro) || $filtro == 0 ) {
                $cond['filtro'] = $filtro;
            }
            if (!empty($idtipo)) {
                $cond['idtipo'] = $idtipo;
            }
            if (!empty($condicion)) {
                $cond['condicion'] = json_decode($condicion);
            }
            if (!empty($idclasificacion)) {
                $cond['idclasificacion'] = json_decode($idclasificacion);
            }
            if (!empty($enuso)) {
                $cond['enuso'] = $enuso;
            }
            if (!empty($filtronomb)) {
                $cond['filtronomb'] = $filtronomb;
            }
            if(!empty($nombre)){
//                $cond['nombre'] = strval($nombre);
                $cond['filtrocombo']=$nombre;
//                print('/*eeeeee*/');
//                $filters[]=array('field'=>'nombre',
//                    'data'=>array('type'=>'string', 'value'=>$nombre));
//                $filters[]=array('field'=>'abreviatura',
//                    'data'=>array('type'=>'string', 'value'=>$nombre));
            }
            if($filters){
                $cond['filter'] = $filters;
            }

            $limit = $this->_request->getPost('limit');
            $start = $this->_request->getPost('start');
//			print_r($cond);die;
            $result = $this->model->cargarClientesproveedores($cond, true, $start, $limit);
            echo json_encode($result);
        } catch (Exception $exception) {
            throw $exception;
        }
    }

    function cargarclasificacioncontAction()
    {
        try {
            $result = NomClasificacioncontable::cargarclasificacioncont();
            echo(json_encode($result));
        } catch (Exception $exception) {
            throw $exception;
        }
    }

    function adicionarAction()
    {
        try {
            $datos = json_decode($this->_request->getPost('datos'));
            $datos['idestructura'] = $this->_request->getPost('idestructura');
            $result = $this->model->gestionar($datos, true);
            echo(json_encode($result));
        } catch (Exception $exception) {
            throw $exception;
        }
    }

    function modificarAction(){
        try {
            $datos = json_decode($this->_request->getPost('datos'));
            $datos['idestructura'] = $this->_request->getPost('idestructura');
            $result = $this->model->gestionar($datos, false);
            echo(json_encode($result));
        } catch (Exception $exception) {
            throw $exception;
        }
    }

    function eliminarAction()
    {
        try {
            $arrayId = json_decode($this->_request->getPost('arrayId'));
            $result = $this->model->eliminar($arrayId);
            echo json_encode(array('codMsgg' => $result));
        } catch (Exception $exception) {
            throw $exception;
        }
    }

    function hijosestructuraAction()
    {
        $idEstructura = $this->_request->getPost('node');
        $arrayEstructuras = $this->integrator->metadatos->DameHijosEstructura(
            $idEstructura
        );
        echo json_encode($arrayEstructuras);
        return;
    }

    function obtenerDatosAuxCltProvdAction()
    {
        $post = $this->_request->getPost();
        $idestructura = $this->global->Estructura->idestructura;
        if ($post['idestructura']) {
            $idestructura = $post['idestructura'];
        }
        $idpersona = $this->_request->getPost('idpersona');
        $result = $this->model->gestEstructuraPersona(
            $idestructura, $idpersona
        );
        echo json_encode($result);
        return;
    }

    function obtenerDatosAdicionalesAction()
    {
        $idcliente = $this->_request->getPost('idcliente');
        $contactos = json_decode($this->_request->getPost('contactos'));
        $contratos = json_decode($this->_request->getPost('contratos'));
        $vehiculo = json_decode($this->_request->getPost('vehiculo'));
        $post = $this->_request->getPost();
        $idestructura = $this->global->Estructura->idestructura;
        if ($post['idestructura']) {
            $idestructura = $post['idestructura'];
        }
        $result = $this->model->obtenerDatosAdicionales(
            $idcliente, $contactos, $idestructura, null, null, null, $contratos, $vehiculo);
        echo json_encode($result);
    }

    function obtenerDatosImprimirReporteAction()
    {
        list($dia, $mes, $year) = explode("/", date('d/m/Y'));
        $entidad = $this->global->Estructura;
        $cond['idestructuracomun'] = $entidad->idestructura;
        $datos = $this->model->cargarClientesproveedores($cond, false, null, null, false);

        $result = array('datoGeneral' => array('titulo'  => 'mod_datosmaestros.nom_clientesproveedor',
                                               'Entidad' => $entidad->denominacion, 'dia' => $dia, 'mes' => $mes,
                                               'year'    => $year, 'fechaactual' => date('d/m/Y')),
                        'datoCuerpo' => $datos['datos'], 'reporte' => '20005');
        echo json_encode($result);
    }

    function cargarBancosAction()
    {
        $result = $this->model->cargarBancos();
        echo json_encode($result);
    }
	
	function obtenerOrganismosAction(){
        $post = $this->_request->getPost();
        $result = $this->model->getOrganismos($post);
        echo json_encode($result);
    }
	
	function obtenerSectorAction(){
        $post = $this->_request->getPost();
        $result = $this->model->getSector($post);
        echo json_encode($result);
    }

    function obtenerPaisesAction(){
        $post = $this->_request->getPost();
        $result = $this->model->obtenerPaises($post);
        echo json_encode($result);
    }

    function cargarSucursalesAction()
    {
        $idbanco = json_decode($this->_request->getPost('idbanco'));
        $result = $this->model->cargarSucursales($idbanco);
        echo json_encode($result);
    }

    function cargarMonedasAction()
    {
        $post = $this->_request->getPost();
        $idestructura = $this->global->Estructura->idestructura;
        $idestructura = $post['idestructura'] ? $post['idestructura'] : $idestructura;
        $result = $this->model->cargarMonedas($idestructura);
        echo json_encode($result);
    }

    function cargarUsuariosAction()
    {
        $start = $this->_request->getPost('start');
        $limit = $this->_request->getPost('limit');
        $filtro = $this->_request->getPost('filtro');
        $result = $this->model->cargarUsuarios($start, $limit, $filtro);
        echo json_encode($result);
    }

    function existeUsuarioAction()
    {
        $post = $this->_request->getPost();
        $result = $this->model->existUser($post);
        echo json_encode($result);
    }

    function cargarDatosEspacialesAction()
    {
        $post = $this->_request->getPost();
        $result = $this->model->cargarDatosEspaciales($post);
        echo json_encode(array('datos' => $result));
    }

    function addPtoMapaAction()
    {
        $post = $this->_request->getPost();
        $result = $this->model->addPtoMapa($post);
        echo json_encode($result);
    }

    function usarEntidadAction()
    {
        $post = $this->_request->getPost();
        $result = $this->model->usarEntidad($post);
        echo json_encode($result);
    }

    function noUsarEntidadAction()
    {
        $post = $this->_request->getPost();
        $result = $this->model->noUsarEntidad($post);
        echo json_encode($result);
    }

    function obtenerCondicionesPagoAction()
    {
        $post = $this->_request->getPost();
        $result = $this->model->obtenerCondicionesPago($post);
        echo json_encode($result);
    }

    function obtenerEspaciosTrabajoAction(){
        $post = $this->_request->getPost();
        $result = $this->model->obtenerEspaciosTrabajo($post);
        echo json_encode($result);
    }

    function salvarEspacioTrabajoAction(){
        $post = $this->_request->getPost();
        $result = $this->model->salvarEspacioTrabajoCertifico($post);
        echo json_encode($result);
    }

    function obtenerIdCodigosAction()
    {
        $post = $this->_request->getPost();
        $result = $this->model->obtenerIdCodigos($post);
        echo json_encode($result);
    }

    function cargarCodigosAction()
    {
        $post = $this->_request->getPost();
        $result = $this->model->cargarCodigos($post);
        echo json_encode(array('data'=>$result));
    }

    function obtenerTiposFacultadesAction()
    {
        $post = $this->_request->getPost();
        $result = $this->model->obtenerTiposFacultades($post);
        echo json_encode($result);
    }

    function obtenerContratosAction(){
        $post = $this->_request->getPost();
        $result = $this->model->obtenerContratos($post);
        echo json_encode($result);
    }

    function cargarproductosAction(){
//        print_r($this->model->cargarproductos($this->_request->getPost()));die;
        echo json_encode($this->model->cargarproductos($this->_request->getPost()));
    }

    function obtenerAtributosVehiculosAction(){
//        print_r($this->model->cargarproductos($this->_request->getPost()));die;
        echo json_encode($this->model->obtenerAtributosVehiculos($this->_request->getPost()));
    }

    function habilitarClienteProveedorAction(){
//        print_r($this->model->cargarproductos($this->_request->getPost()));die;
        echo json_encode($this->model->habilitarClienteProveedor($this->_request->getPost()));
    }

    function obtenerOperacionesAction(){
        $post = $this->_request->getPost();
        $result = $this->model->obtenerOperaciones($post);
        echo json_encode($result);
    }

    function getLineasAction(){
        $post = $this->_request->getPost();
        $result = $this->model->getLineas($post);
        echo json_encode($result);
    }

    function obtenerTiposLineasAction(){
        $post = $this->_request->getPost();
        $result = $this->model->obtenerTiposLineas($post);
        echo json_encode($result);
    }

    function obtenerLineasClientesAction(){
        $post = $this->_request->getPost();
        $result = $this->model->obtenerLineasClientes($post);
        echo json_encode($result);
    }
    
     function checkearDeudasAction(){
//        print_r($this->model->cargarproductos($this->_request->getPost()));die;
//        $result=$this->model->checkearDeudas();
        echo json_encode($this->model->checkearDeudas());
    }
    
    function exportarExcelAction(){
        $post = $this->_request->getPost();
        $result = $this->model->exportarExcel($post);
        echo json_encode($result);
    }

    function cargardeudasAction(){
//        print_r($this->model->cargarproductos($this->_request->getPost()));die;
//        $result=$this->model->checkearDeudas();
        echo json_encode($this->model->cargardeudas($this->_request->getPost('idclienteproveedor')));
    }
    
    function importarVehiculosAction()
    {
        try {
            $datos = json_decode($this->_request->getPost());
            $result = $this->model->importarVehiculos($datos);
            echo(json_encode($result));
        } catch (Exception $exception) {
            throw $exception;
        }
    }

    function getMarcasVehiculoAction(){
        $result = $this->model->getMarcasVehiculo($this->_request->getPost());
        echo json_encode($result);
    }

    function getModelosVehiculoAction(){
        $result = $this->model->getModelosVehiculo($this->_request->getPost());
        echo json_encode($result);
    }

    function getTiposVehiculosAction(){
        $result = $this->model->getTiposVehiculos($this->_request->getPost());
        echo json_encode($result);
    }

    function comprobarPeriodoVencimientoAction(){
        $result = $this->model->comprobarPeriodoVencimiento($this->_request->getParams());
        echo json_encode($result);
    }

    function marcarCorreoEnviadoAction(){
        $result = $this->model->marcarCorreoEnviado($this->_request->getParams());
        echo json_encode($result);
    }

    function obtenerDocumentosAction(){
        $result = $this->model->obtenerDocumentos($this->_request->getParams());
        echo json_encode($result);
    }
    
}
