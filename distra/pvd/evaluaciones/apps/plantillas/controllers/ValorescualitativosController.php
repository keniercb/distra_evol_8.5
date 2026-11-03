<?php
class ValorescualitativosController extends ZendExt_Controller_Secure
{
   private $model;
	function init()
	{
	    $this->model = new NomEvalvalorescualitativosModel();
		parent::init();
	}

	function valorescualitativosAction()
	{
        //$this->view->jsayuda = $this->integrator->ayuda->devolverJS();
		$this->render();
	}

	function devolvervalorescualitativosAction()
	{
		try {
			$limit = $this->_request->getPost('limit');
			$start = $this->_request->getPost('start');
			$denom = $this->_request->getPost('denom');
			$valorescualitativos = $this->model->DevolverValoresCualitativos($limit, $start, $denom);
			$cantidad = NomEvalvalorescualitativos :: GetCantidad($denom);
			$doc = array();
			$i=0;
			if($valorescualitativos) {
				foreach ($valorescualitativos as $index => $result) {
					//print_r($result['hasta']);die;
					$doc[$i]['idvalorescualitativos']= $result['idvalorescualitativos'];
					$doc[$i]['denom']= $result['denom'];
					$doc[$i]['descripcion']= $result['descripcion'];
					$doc[$i]['desde']= $result['desde'];
					$doc[$i]['hasta']= $result['hasta'];
					$i++;

				}
			}
			$doc =  array ('datos' => $doc, 'cant'=> $cantidad);
			echo json_encode($doc);
		}
		catch (Exception $e){
			echo ("{'cdgMsg':'3'".$e->getMessage()."}");
		}
	}

	function adicionarvalorescualitativosAction()
	{
		try
		{
			$denom = $this->_request->getPost('denom');
			$descripcion = $this->_request->getPost('descripcion');
			$desde = $this->_request->getPost('desde');
			$hasta = $this->_request->getPost('hasta');
			if($hasta == ""){
				$hasta = null;
			}else{
				$hasta = str_replace('/','-',$hasta);
			}
			if($desde == ""){
				$desde = null;
			} else {
				$desde = str_replace('/','-',$desde);
			}
			$fecha = Date("y-m-d");
			$val = NomEvalvalorescualitativos::existeValorC($denom);
			if (!$val) {
				$adicionado = $this->model->AdicionarValorCualitativo($denom, $descripcion, $desde, $hasta);
				if($adicionado){
					// $this->showMessage('El valor cualitativo ha sido adicionado satisfactoriamente.');
					$r->codMsg = 1;
					$r->mensaje = "El valor cualitativo ha sido adicionado satisfactoriamente.";
				}
			} else {
				$r->codMsg = 3;
				$r->mensaje = "El valor cualitativo que quiere adicionar ya existe.";
			}
			echo json_encode($r);
		}
		catch (Exception $e){
             echo ("{'cdgMsg':'3'".$e->getMessage()."}");
        }
	}

	function modificarvalorescualitativosAction()
	{
		try
		{
			$idvalorescualitativos = $this->_request->getPost('idvalorescualitativos');
			$denom		   = $this->_request->getPost('denom');
			$descripcion = $this->_request->getPost('descripcion');
			$desde = $this->_request->getPost('desde');
			$hasta = $this->_request->getPost('hasta');
			if($hasta == ""){
				$hasta = null;
			}else{
				$hasta = str_replace('/','-',$hasta);
			}
			if($desde == ""){
				$desde = null;
			} else {
				$desde = str_replace('/','-',$desde);
			}

			$val = NomEvalvalorescualitativos::verifvaloresMod($idvalorescualitativos,$denom);
			if (!$val) {
		   		$modificado = $this->model->ModificarValorCualitativo($idvalorescualitativos, $denom, $descripcion, $desde, $hasta);
		   		if($modificado){
					// $this->showMessage('El valor cualitativo ha sido modificado satisfactoriamente.');
		   			$r->codMsg = 1;
		   			$r->mensaje = "El valor cualitativo ha sido modificado satisfactoriamente.";
				}else {
					$r->codMsg = 3;
	   				$r->mensaje = "El valor cualitativo no pudo ser modificado satisfactoriamente.";
				}
		   	} else {
		   		$r->codMsg = 3;
	   			$r->mensaje = "El valor cualitativo ya existe.";
		   	}
			echo json_encode($r);
		}

		catch (Exception $e){
             echo ("{'cdgMsg':'3'".$e->getMessage()."}");
        }
	}

	function buscarvalorescualitativosAction()
	{
	   $limit = $this->_request->getPost('limit');
	   $start = $this->_request->getPost('start');

	   $denom = $this->_request->getPost('denom');
	   $busqueda = $this->model->BuscarValores($denom);


		$cantidad = NomEvalvalorescualitativos :: BuscarValoresbyDenomCantidad($denom);

			  $doc = array();
			  $i=0;
			  if($busqueda)
			  {
               foreach ($busqueda as $index => $result)
                {
  				  //print_r($result['hasta']);die;
				  $doc[$i]['nro'] = $i+1;
                  $doc[$i]['idvalorescualitativos']= $result['idvalorescualitativos'];
				  $doc[$i]['denom']= $result['denom'];
				  $doc[$i]['descripcion']= $result['descripcion'];
				  $doc[$i]['desde']= $result['desde'];
				  $doc[$i]['hasta']= $result['hasta'];
				  $i++;

			    }
              }


		      $doc =  array ('datos' => $doc, 'cant'=> $cantidad);
                        echo json_encode($doc);




	}

	function eliminarvalorescualitativosAction()
	{
		try{
			$idvc = $this->_request->getPost('idvc');
			$fecha = Date("y-m-d");
			$eliminado = $this->model->EliminarVC($idvc, $fecha);
				$r->codMsg = 1;
				$r->exception = 0;
				$r->mensaje = "El valor cualitativo ha sido eliminado satisfactoriamente.";
				echo json_encode($r);			
		}catch (Exception $e) {
            if($e->getCode() == 23503) {//Code for foreignKeyViolation
                $r->exception = 1;
                echo (json_encode($r));
            }else{
                echo (json_encode($e->getMessage()));
            }
        }
	}
}
