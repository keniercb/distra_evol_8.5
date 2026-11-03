<?php

class NommotivoseguimientoController extends ZendExt_Controller_Secure
{

    function init()
    {
        parent::init();
    }

    function nommotivoseguimientoAction()
    {
	    //Agregando a la vista los ficheros js de la ayuda.
        $this->view->jsayuda = $this->integrator->ayuda->devolverJS();
        $this->view->idioma = $this->global->Perfil->idioma;
        //Mostrando la vista 
        $this->render();
    }
	
	 /**
	* Obtiene el listado de los motivos de seguimiento
	* @return Arreglo con todos los motivos de seguimiento
	* @author Yaricel Guerra Velázquez
	*/	
    public function getMotivosSeguimientoAction()
    {
		$modeloNegocio = new  NomMotivoseguimientoModel();
        $arr = $modeloNegocio->getMotivosSeguimiento(
				$this->_getParam('denominacion'),
				$this->_getParam('fdesde'),
				$this->_getParam('fhasta'),
                $this->_getParam('start'),
                $this->_getParam('limit')
        );
		echo Zend_Json::encode($arr);
    }
	
    /**
	* Adicionar motivo de seguimiento
	* @return Mensaje informando el resultado de la operación
	* @author Yaricel Guerra Velázquez
	*/
    public function addMotivoAction()
	{				
		$obj = new  NomMotivoseguimientoModel();
        if (!$obj->existeDenom($this->_getParam('denominacion'))) {
            $obj->addMotivo(
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
	* Modifica motivos de seguimiento
	* @return Mensaje informando el resultado de la operación
	* @author Yaricel Guerra Velázquez
	*/
    public function updateMotivoAction()
    { 
	    $obj = new  NomMotivoseguimientoModel();
		$r = $obj->modMotivo(
				$this->_getParam('idmotivoseguimiento'),
                $this->_getParam('denominacion'),
				$this->_getParam('fdesde'),
                $this->_getParam('fhasta'),
                $this->_getParam('descripcion')
        );
        echo Zend_Json::encode($r);
    }

    /**
     * Elimina motivos seguimiento
     * @return Mensaje informando el resultado de la operación
     * @author Yaricel Guerra Velázquez
     */
	public function deleteMotivoAction()
    {
        $motivos = json_decode(stripslashes($this->_request->getPost('motivos')));
        $respuesta = true;
        foreach ($motivos as $p) {
            $r = NomMotivoseguimientoModel::deleteMotivo($p);
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
