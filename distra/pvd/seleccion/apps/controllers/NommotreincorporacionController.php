<?php

class NommotreincorporacionController extends ZendExt_Controller_Secure
{

    function init()
    {
        parent::init();
    }

    function nommotreincorporacionAction()
    {
        $this->view->idioma = $this->global->Perfil->idioma;
        //Mostrando la vista 
        $this->render();
    }
	
	 /**
	* Obtiene el listado de vías de reclutamiento
	* @return Arreglo con todas las vías de reclutamiento
	* @author Beatriz Selema Alvarez
	*/	
    public function getMotReincorporacionAction()
    {
		$modeloNegocio = new NomMotreincorporacionModel();
        $arr = $modeloNegocio->getMotReincorporacion(
				$this->_getParam('denominacion'),
				$this->_getParam('fdesde'),
				$this->_getParam('fhasta'),
                $this->_getParam('start'),
                $this->_getParam('limit')
        );
		echo Zend_Json::encode($arr);
    }
	
    /**
	* Adicionar vías de reclutamiento
	* @return Mensaje informando el resultado de la operación
	* @author Yaricel Guerra Velázquez
	*/
    public function addMotReincorporacionAction()
	{				
		$obj = new NomMotreincorporacionModel();
        if (!$obj->existeDenom($this->_getParam('denominacion'))) {
            $obj->addMotReincorporacion(
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
	* Modifica vías de reclutamiento
	* @return Mensaje informando el resultado de la operación
	* @author Yaricel Guerra Velázquez
	*/
    public function updateMotReincorporacionAction()
    { 
	  $obj = new NomMotreincorporacionModel();
		$r = $obj->updateMotReincorporacion(
				$this->_getParam('idmotivoreicorporacion'),
                $this->_getParam('denominacion'),
				$this->_getParam('fdesde'),
                $this->_getParam('fhasta'),
                $this->_getParam('descripcion')
        );

        echo Zend_Json::encode($r);
    }

    /**
     * Elimina vías de reclutamiento
     * @return Mensaje informando el resultado de la operación
     * @author Yaricel Guerra Velázquez
     */
	public function deleteMotReincorporacionAction()
    {  
		$vias = json_decode(stripslashes($this->_request->getPost('vias')));
		$respuesta = true;
		foreach ($vias as $p) {
			$r = NomMotreincorporacionModel::deleteMotReincorporacion($p);
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