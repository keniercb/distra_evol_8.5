<?php

class ConfigurarnotificacionesController extends ZendExt_Controller_Secure
{
    
    public function init()
    {
        parent::init();
        $this->_meta = ZendExt_Metadata::getInstance();
    }

    public function configurarnotificacionesAction()
    {
        $jsestructura = $this->integrator->metadatos->obtenerIUEstructura();
        $this->view->jsestructura = $jsestructura;
        $this->render();
    }

    public function listarConfiguracionesAction()
    {
        $parametros['start'] = ($this->_request->getPost('start') != null) ? $this->_request->getPost('start') : 0;
        $parametros['limit'] = ($this->_request->getPost('limit') != null) ? $this->_request->getPost('limit') : 20;
        $parametros['tiponotificacion'] = $this->_request->getPost('notificacion');
        $parametros['idtipoplan'] = $this->_request->getPost('idtipoplan');
        $parametros['idcc'] = $this->_request->getPost('idcc');
        $notificacion = new Notificaciones711Model();
        $data = $notificacion->listarNotificacion($parametros);
        echo json_encode(array("data" => $data));
    }

    public function adicionarModificarAction()
    {
        $parametros['tiponotificacion'] = $this->_request->getPost('tiponotificacion');
        $parametros['idnomenclador'] = $this->_request->getPost('idnomenclador');
        $parametros['listaidrol'] = json_decode($this->_request->getPost('listaidrol'));
        $parametros['listaroles'] = json_decode($this->_request->getPost('listaroles'));
//        $parametros['listaidrol'] = $this->_request->getPost('listaidrol');
        $parametros['idrol'] = $this->_request->getPost('idrol');
        $parametros['textonotificacion'] = $this->_request->getPost('textonotificacion');
        $parametros['idtipoplan'] = $this->_request->getPost('idtipoplan');
        $parametros['idcc'] = ($this->_request->getPost('idcc') != null) ? $this->_request->getPost('idcc') : 'NULL';
        $parametros['accion'] = $this->_request->getPost('accion');
        $parametros['paraconsolidacion'] = $this->_request->getPost('paraconsolidacion');
//        print_r('sdd'); die;
        $notificacion = new Notificaciones711Model();
        if($parametros['accion']==2){
            $parametros['idnotificaciones711'] = $this->_request->getPost('idnotificaciones711');
            $notificacion->modificarNotificacion($parametros);
            echo json_encode(array("mensaje" => 1));
        }else{
            $result = $notificacion->adicionarNotificacion($parametros);
            echo json_encode(array("mensaje" => $result));
        }
    }
    
    public function EliminarConfiguracionAction(){
        $paramestros['idnotificaciones711'] = $this->_request->getParam('idnotificaciones711');
        $notificacion = new Notificaciones711Model();
        $result = $notificacion->EliminarNotificacion($paramestros);
        echo json_encode(array('mensaje' => $result));
    }
    
    public function cargarRolesAction() {
        //integrator = ZendExt_IoC::getInstance();
        $notificacion = new Notificaciones711Model();
        $rolesresult = $notificacion->cargarRoles();
        echo json_encode(array("data" => $rolesresult));
    }
    
    public function listarDatosAction(){
        $uri= $this->_request->getPost('uri');
        $tipoplan= $this->_request->getPost('tipoplan');
        $modelPlan = new DatPlan711Model();
        $data=$modelPlan->listarDatos($uri);
        
        echo json_encode(array("data" => $data)); 
    }
    
    public function ActualizarListaDeUsuariosAction(){
        ini_set("max_execution_time", 3600); //1hora        
        $notificacion = new Notificaciones711Model();
        $data=$notificacion->ActualizarListaDeUsuarios();   
        
        echo json_encode(array("mensaje" => 1)); 
    }
    
    public function listarUserNotificarAction(){
        $parametros['filtros'] = $this->_request->getPost('filtros');
        $notificacion = new Notificaciones711Model();
        $data=$notificacion->listarUserNotificar($parametros);   
        
        echo json_encode(array("data" => $data)); 
    }
    
    public function GuardarCorreosAction(){
        $parametros['listausuarios'] = json_decode($this->_request->getPost('listausuarios'));
//        var_dump($parametros);die;
        $notificacion = new Notificaciones711Model();
        $data=$notificacion->GuardarCorreos($parametros);   
        
        echo json_encode(array("mensaje" => $data)); 
    }
}
