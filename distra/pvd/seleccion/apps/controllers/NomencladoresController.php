<?php 
class NomencladoresController extends ZendExt_Controller_Secure
{   
    function init()
	{	
		parent::init();	
	}

	function nomencladoresAction()
	{
        $this->view->reccompleja = $this->integrator->reccomplejas->obtenerScriptsReccomplejas();
		$this->render();
	}
}
?>
