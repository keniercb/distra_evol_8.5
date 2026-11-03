<?php

require_once __DIR__ . '/../../planmeta/controllers/ConfigurarejercicioController.php';

class Gestpersonadel711Controller extends ZendExt_Controller_Secure
{
    private $auxgridsalva = array();
    private $cont = 0;


    public function init()
    {
        parent::init();
        $this->_meta = ZendExt_Metadata::getInstance();
    }

    public function gestpersonadel711Action()
    {
        $jsestructura = $this->integrator->metadatos->obtenerIUEstructura();
        $this->view->jsestructura = $jsestructura;
        $this->render();
    }

    public function listarPersonas711Action()
    {
        $parametros['start'] = ($this->_request->getPost('start') != null) ? $this->_request->getPost('start') : 0;
        $parametros['limit'] = ($this->_request->getPost('limit') != null) ? $this->_request->getPost('limit') : 20;
        $parametros['idestructura'] = $this->global->Estructura->idestructura;
        $parametros['filtros'] = $this->_request->getPost('filtros');
        $parametros['dominio'] = $this->_request->getPost('dominio');
        if($parametros['dominio']==1) {
            $parametros['idestructura'] = null;
        }
        $modeloplan = new DatPersonadel711Model();
        $data = $modeloplan->listarPersonas711($parametros);
        echo json_encode(array("data" => $data, "total" => $data[0]['total']));
    }

    public function adicionarModificarPersonaAction()
    {

        $paramestros['tp'] = $this->_request->getPost('tp');
        $paramestros['idempimp'] = $this->_request->getPost('idempimp');
        $paramestros['uc'] = $this->_request->getPost('uc');
        $paramestros['cp'] = $this->_request->getPost('cp');
        $paramestros['nombre'] = $this->_request->getPost('nombre');
        $paramestros['apell'] = $this->_request->getPost('apell');
        $paramestros['correo'] = $this->_request->getPost('correo');
        $paramestros['telf'] = $this->_request->getPost('telf');
        $paramestros['idempdest'] = $this->_request->getPost('idempdest');
        $paramestros['empvalue'] = $this->_request->getPost('empvalue');
        $paramestros['accion'] = $this->_request->getPost('accion');
        
        //este param viene si es modificicacion        
        $paramestros['idpersonadel711'] = $this->_request->getPost('idpersonadel711');
        
        $modelproducto = new DatPersonadel711Model();
        $modelproducto->adicionarModificarPersona($paramestros);        
        echo json_encode(array('mensaje' => 1));
        
    }
    
    public function EliminarPersonaAction()
    {        
        $paramestros['idpersonadel711'] = $this->_request->getPost('idpersonadel711');
        
        $modelproducto = new DatPersonadel711Model();
        $modelproducto->EliminarPersona($paramestros);        
        echo json_encode(array('mensaje' => 1));
        
    }  
    
    public function InhabilitarPersonaAction()
    {        
        $paramestros['idpersonadel711'] = $this->_request->getPost('idpersonadel711');
        
        $modelproducto = new DatPersonadel711Model();
        $modelproducto->InhabilitarPersona($paramestros);        
        echo json_encode(array('mensaje' => 1));
        
    }  
    public function HabilitarPersonaAction()
    {        
        $paramestros['idpersonadel711'] = $this->_request->getPost('idpersonadel711');
        
        $modelproducto = new DatPersonadel711Model();
        $modelproducto->HabilitarPersona($paramestros);        
        echo json_encode(array('mensaje' => 1));
        
    }  
        
    public function listarDatosAction(){
        $uri= $this->_request->getPost('uri');
        
        $modelPlan = new DatPlan711Model();
        $data=$modelPlan->listarDatos($uri);
        echo json_encode(array("data" => $data)); 
    }
    
    public function listarConfEntidadesDestinoAction() {
        $idEstructura = ($this->_request->getPost('node')) ? $this->_request->getPost('node') : 0;
        $idcategoria = $this->_request->getPost('idcategoria');
        $dominios = $this->integrator->metadatos->DameHijosEstructura($idEstructura);
        echo json_encode($dominios);
    }
    
    public function listarConfEntidadesDestino2Action() {
        $idEstructura = $this->_request->getPost('node');
        $dominios = $this->integrator->metadatos->DameEstructura($idEstructura);
        echo json_encode($dominios);
    }

}
