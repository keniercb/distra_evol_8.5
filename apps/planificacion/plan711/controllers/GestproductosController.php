<?php

class GestproductosController extends ZendExt_Controller_Secure
{

    public function init()
    {
        parent::init();
        $this->_meta = ZendExt_Metadata::getInstance();
    }

    public function gestproductosAction()
    {
        $jsestructura = $this->integrator->metadatos->obtenerIUEstructura();
        $this->view->jsestructura = $jsestructura;
        $this->render(); 
    }
    
    public function getEjerciciosAction() 
    {
        $data = null;
//        $data->data = $this->pIntegrator->planmeta->obtenerEjercicios();
//        $data->idejercicioactual = $this->pIntegrator->planmeta->obtenerEjercicioActual();
        
        $parametros['tipoplan'] = 1255;

        ini_set("max_execution_time", 3600); //1hora
        //Creando el modelo de negocio de gestion de usuarios.
        $modeloplan = new DatPlan711Model();
        $data->data = $modeloplan->listarPlanes711($parametros);
        echo json_encode($data);
    }

    public function listarProductos711Action()
    {
        $parametros['start'] = ($this->_request->getPost('start') != null) ? $this->_request->getPost('start') : 0;
        $parametros['limit'] = ($this->_request->getPost('limit') != null) ? $this->_request->getPost('limit') : 20;
        $parametros['filtros'] = $this->_request->getPost('filtros');
        $parametros['tipo'] = $this->_request->getPost('tipo');
        $modeloplan = new DatProducto711Model();
        $data = $modeloplan->listarProductos711($parametros);
        echo json_encode(array("data" => $data, "total" => $data[0]['total']));
    }

    public function adicionarModificarProductosAction()
    {   
        $paramestros['tipo'] = $this->_request->getPost('tipo');
        $paramestros['accion'] = $this->_request->getPost('accion');
        $paramestros['denom'] = $this->_request->getPost('denom');
        
        if($paramestros['tipo']==0){
            $paramestros['um'] = $this->_request->getPost('um');
            $paramestros['idempimp'] = $this->_request->getPost('idempimp');
            $paramestros['precio'] = $this->_request->getPost('precio');
            $paramestros['codigocup'] = $this->_request->getPost('codigocup');
            $paramestros['numeropieza'] = $this->_request->getPost('numeropieza');
        }
        if($paramestros['tipo']==1){
            $paramestros['iddatostipocodigo'] = $this->_request->getPost('iddatostipocodigo');
            $paramestros['iddatoscodigo'] = 1247;
        }
        if($paramestros['tipo']==2){
            $paramestros['idplan711'] = $this->_request->getPost('idplan711');
        }
              
        $paramestros['idproducto711'] = $this->_request->getPost('idproducto711');
        $paramestros['filtros']['field'] = 'codigocup';
        $paramestros['filtros']['data']['value'] = $this->_request->getPost('codigocup');
        
        $modeloplan = new DatProducto711Model();
        $data = $modeloplan->ExisteProductos711($paramestros);
        $mensage=1;
        if($data!=null){
            $mensage="El producto que intenta adicionar ya existe su codigocup";
        }
        if($mensage==1){
            $modelproducto = new DatProducto711Model();
            $modelproducto->adicionarModificarProductos($paramestros);  
        }
        echo json_encode(array('mensaje' => $mensage));
        
    }
    
    public function EliminarProductosAction()
    {        
        $paramestros['idproducto711'] = $this->_request->getPost('idproducto711');
        
        $modelproducto = new DatProducto711Model();
        $modelproducto->EliminarProductos($paramestros);        
        echo json_encode(array('mensaje' => 1));
        
    }   
    
    public function cambiarEstadoAction() {
        $paramestros['idejercicio'] = $this->_request->getParam('idejercicio');
        $paramestros['estado'] = $this->_request->getParam('estado');
        $modelosplan = new DatPlan711Model();
        $result = $modelosplan->cambiarEstado($paramestros);
        echo json_encode(array('mensaje' => $result));
    }
    
    public function cargarUsuariosAction() {
        $users = $this->integrator->seguridad->getAllUsers();
        echo json_encode(array("data" => $users));
    }
    
    public function listarDatosAction(){
        $uri= $this->_request->getPost('uri');
        $tipoplan= $this->_request->getPost('tipoplan');
        $modelPlan = new DatPlan711Model();
        $data=$modelPlan->listarDatos($uri);
        echo json_encode(array("data" => $data)); 
    }

}
