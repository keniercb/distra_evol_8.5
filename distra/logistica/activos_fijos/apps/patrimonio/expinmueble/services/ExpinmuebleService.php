<?php
 class ExpinmuebleService extends ZendExt_Model  
 {
	  protected  $model = NULL; 
	  
	 public function ExpinmuebleService(){
        $this->model = new DatDocumentoinmuebleModel();                 
    }
	 
	public function mostrarExpInmueble()
	{
		$dir_controller = '/logistica/activos_fijos/expinmueble/index.php/expinmueble/expinmueble';    
		header("Location: $dir_controller");
	}

	public function CantidadDocumentos($idinmueble,$idexpediente){
		return DatDocumentoInmuebles::CantidadDocumentos($idinmueble,$idexpediente);
	}
	
	public function CantInmueblesQueTieneDocumentoX($iddocumento)
	{
		//echo('llega al servicio');die;
		return $this->model->CantInmueblesQueTieneDocumentoX($iddocumento);
	}
 }
?>
