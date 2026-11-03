<?php

class NommotivoexclusionController extends ZendExt_Controller_Secure
{

    function init()
    {
        parent::init();
    }

    function nommotivoexclusionAction()
    {
        $this->view->idioma = $this->global->Perfil->idioma;
        //Mostrando la vista 
        $this->render();
    }
	
	 /**
	* Obtiene el listado de motivo exclusion
	* @return Arreglo con todas las vías de reclutamiento
	* @author Yaricel Guerra Velázquez
	*/	
    public function getMotivoExclusionAction()
    {
		$modeloNegocio = new NomMotivoexclusionModel();
        $arr = $modeloNegocio->getMotivoExclusion(
				$this->_getParam('denominacion'),
				$this->_getParam('fdesde'),
				$this->_getParam('fhasta'),
                $this->_getParam('start'),
                $this->_getParam('limit')
        );
		echo Zend_Json::encode($arr);
    }
	
    /**
	* Adicionar motivo exclusion
	* @return Mensaje informando el resultado de la operación
	* @author Yaricel Guerra Velázquez
	*/
    public function addMotivoExclusionAction()
	{				
		$obj = new NomMotivoexclusionModel();
        if (!$obj->existeDenom($this->_getParam('denominacion'))) {
            $obj->addMotivoExclusion(
                $this->_getParam('denominacion'),
                $this->_getParam('fdesde'),
                $this->_getParam('fhasta'),
                $this->_getParam('descripcion')
            );
            $this->_enviarNotificacionCorrecta();
        } else
            echo Zend_Json::encode(false);
	}
   
	/**
	* Modifica motivo exclusion
	* @return Mensaje informando el resultado de la operación
	* @author Yaricel Guerra Velázquez
	*/
    public function updateMotivoExclusionAction()
    { 
	    $obj = new NomMotivoexclusionModel();
		$r = $obj->updateMotivoExclusion(
				$this->_getParam('idmotivoexclusion'),
                $this->_getParam('denominacion'),
				$this->_getParam('fdesde'),
                $this->_getParam('fhasta'),
                $this->_getParam('descripcion')
        );

        echo Zend_Json::encode($r);
    }

    /**
     * Elimina motivo exclusion
     * @return Mensaje informando el resultado de la operación
     * @author Yaricel Guerra Velázquez
     */
	public function deleteMotivoExclusionAction()
    {  
		$motivos = json_decode(stripslashes($this->_request->getPost('motivos')));
		$respuesta = true;
		foreach ($motivos as $p) {
			$r = NomMotivoexclusionModel::deleteMotivoExclusion($p);
			if ($r == false) {
				$respuesta = false;
			}		
		}
		echo json_encode($respuesta);
    }
	
    private function _enviarNotificacionCorrecta() 
    {
        echo "{success: 'true'}";
    }
}