<?php
class InformacionpersonacompController extends ZendExt_Controller_Secure
{
	function init ()
	{
		parent::init();
	}

	function informacionpersonacompAction()
	{
		$this->render();
	}
	//buscando los datos de la persona seleccionada
	public function getdatpersonaAction(){
		$idpersona = $this->_request->getPost ( 'idpersona' );
		$objOA = new DatOcupacionActual();
		$arrPersona = $objOA->obtenerDatosCargoEntidadyPersonalesXIdpersona($idpersona);
		echo json_encode ($arrPersona);
		return;
	}

}
?>