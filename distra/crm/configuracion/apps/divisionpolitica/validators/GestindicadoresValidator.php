
<?php
class GestindicadoresValidator
{
	public $post = array();

	public function IndicadorValidator()
	{
		$this->post = $_POST;
	}

	
	public function validarConfiguracion()
	{   
		die('zxcc'); 		
		$integrator = ZendExt_IoC::getInstance();
        $idestructura = $this->global->Estructura->idestructura;
        $idsubsistema = $this->global->Subsistema->idsubsistema;
        // 0=>Si Carga Inicial , 1=>Si Aperturado
        $aperturado = $integrator->parametros->subsistemaAperturado($idestructura, $idsubsistema);
  
        if(!$aperturado)
        return true;
        else
        return false;		
	}	
	
}
