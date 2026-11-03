<?php

class CmpestructuraController extends ZendExt_Controller_Secure {

    public function init() {
        parent::init();
    }
    
    /**
     * Acción utilizada para mostrar la vista de gestión de modelos.
     */
    public function cmpestructuraAction() {	
        //Agregando a la vista los ficheros js de la ayuda.
        //$this->view->jsayuda = $this->integrator->ayuda->devolverJS(); 
        $this->view->idioma = $this->global->Perfil->idioma;
		$this->view->estructura = $this->integrator->metadatos->obtenerIUEstructura();
        //Mostrando la vista.
        $this->render();
    }
	
	 public function getEstructuraAction()
    {
        try {
            $objOcupacion = new DatEstructuraModel();
            if ($this->_getParam('node') === 'root') {
			   
                $r = $objOcupacion->getRoot($this->global->Estructura->idestructura);
            } else {
                $r = $objOcupacion->getEstructura($this->_getParam('node'));
            }
            echo json_encode($r);  
        } catch (Exception $e) {

            return;
        }

    }
	
	public function getEstructuraRegistroAction()
    {

        try {
            $objOcupacion = new DatEstructuraModel();
            if ($this->_getParam('node') === 'root') {
			   
                $r = $objOcupacion->getRoot($this->global->Estructura->idestructura);
            } else {
                $r = $objOcupacion->getEstructuraRegistro($this->_getParam('node'));
            }
            echo json_encode($r);  
        } catch (Exception $e) {

            return;
        }

    }
	
	
	
		
    
}