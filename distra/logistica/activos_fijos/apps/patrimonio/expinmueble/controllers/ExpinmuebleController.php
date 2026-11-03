<?php
class ExpinmuebleController extends ZendExt_Controller_Secure
{
	private $model;
	private $comunAFTModel;

	function init ()
	{
        parent::init();
        $this->model = new DatDocumentoinmuebleModel( );
        $this->comunAFTModel = new ComunAFTModel();
	}

	function expinmuebleAction()
	{
		$this->render();
	}

	function cargarexpedienteAction()
	{
		$idinmueble = $this->_request->getPost('idinmueble');
		$start = $this->_request->getPost('start');
		$limite = $this->_request->getPost('limit');
		$quitar = $this->model->DocumentosAQuitar($idinmueble);
		//coger los id de los documentos que no deben salir y guardarlos en un array
		$arreglodocumentos = $this->pIntegrator->nomencladoresaft->dameDocumentosConExcepcionDe($quitar, $start, $limite);
		$cantidaddocumentos = $this->pIntegrator->nomencladoresaft->dameCantidadTotalDocumentos();
		$datos = array ('total' => $cantidaddocumentos, 'datos' => $arreglodocumentos );
		echo (json_encode ( $datos ));
	}

	function cargardocumentosAction()
	{
		$idinmueble = $this->_request->getPost('idinmueble');
		$start = $this->_request->getPost('start');
		$limite = $this->_request->getPost('limit');
		$docsExpedienteInmueble = $this->model->ArregloExpedienteAsociados($idinmueble, $start, $limite);
		$cantidad = $this->model->CantidadExpedienteAsociados($idinmueble);
		$datos = array();
		foreach($docsExpedienteInmueble as $obj){
			//$this->comunAFTModel->alinearMatriz($obj, &$datos[]);
		}
		$datos = array ('total' => $cantidad, 'datos' => $datos );
		echo (json_encode ( $datos ));
	}

	function adicionarAction()
	{
		$arreglo = json_decode(str_replace('\\','',$this->_request->getPost('arreglo')));
		$idinmueble = $arreglo->idinmueble;//este es el id del numero de serie activo
		$respuesta = $this->model->Adicionar($idinmueble,$arreglo->arreglo);
		if($respuesta){
			$datos = array ('codmsg' => 1, 'msg' => 'Los documentos han sido insertado satisfactoriamente en el expediente.' );
		}
		else{
			$datos = array ('codmsg' => 3, 'msg' => 'Los documentos no se han podido insertar.' );
		}
		echo (json_encode ( $datos ));
	}

	function adicionartodosAction(){
		$idinmueble = $this->_request->getPost('idinmueble');
		$respuesta = $this->model->AdicionarTodos($idinmueble);
		if($respuesta){
			$datos = array ('codmsg' => 1, 'msg' => 'Los documentos han sido insertado satisfactoriamente en el expediente.' );
		}
		else{
			$datos = array ('codmsg' => 3, 'msg' => 'Los documentos no se han podido insertar.' );
		}
		echo (json_encode ( $datos ));
	}

	function eliminarAction()
	{
		$arreglo = json_decode(str_replace('\\','',$this->_request->getPost('arreglo')));
		$idinmueble = $arreglo->idinmueble;

		$this->model->Eliminar($idinmueble, $arreglo->arreglo);

		$datos = array ('codmsg' => 1, 'msg' => 'Todo ok' );

		echo (json_encode ( $datos ));
	}

	function eliminartodosAction(){
		$idinmueble = $this->_request->getPost('idinmueble');
		$this->model->EliminarTodos($idinmueble);
		$datos = array ('codmsg' => 1, 'msg' => 'Todo ok' );
		echo (json_encode ( $datos ));
	}

}
?>
