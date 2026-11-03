<?php

class PatronrotacionturnosController extends ZendExt_Controller_Secure
{

    function init()
    {
        parent::init();
    }

    function patronrotacionturnosAction()
    {   
        $this->render('patronrotacionturnos');
    }

    function getPatronRotacionTurnosAction()
    {
        $limit = $this->_request->getPost('limit');
        $start = $this->_request->getPost('start');
        echo(json_encode($r));
    }

    public function listarTurnosTrabajoAction() {
        $modelTurnos = new NomTurnotrabajoModel();

        //Obteniendo el listado
        $arrTurnos = $modelTurnos->GetAll();

        //Imprimiendo el listado
        echo Zend_Json::encode(array('datos' => $arrTurnos));
    }

    public function listarRotacionAction() {
        //Creando el modelo de negocio de gestion
        $modeloNegocioRotacion= new NomRotacionModel();

        //Obteniendo el listado
        $arrRotacion = $modeloNegocioRotacion->obtenerListadoRotacion(
            $this->_getParam('start', 0),
            $this->_getParam('limit', 15),
            $this->_getParam('denominacion'),
            $this->_getParam('fdesde'),
            $this->_getParam('fhasta')
        );
        //Obteniendo la cantidad total
        $cantTotalRotacion = $modeloNegocioRotacion->obtenerCantidadTotalRotacion();

        //Imprimiendo el listado
        echo Zend_Json::encode(array('datos' => $arrRotacion, 'cantidad' => $cantTotalRotacion));
    }
	
	/**
     * Accion utilizada para listar los datos
     */
    public function listarRotacionTurnosAction() {
       $modelo = new DatRotacionturnosModel();
       $arreglo = $modelo->obtenerListadoRotacionTurnos(
           $this->_getParam('start', 0),
           $this->_getParam('limit', 15),
           $this->_getParam('idrotacion')
       );
       $result = array();
       foreach($arreglo as $valor)
       {
           $aux = new stdClass();
           $aux->idrotacionturno = $valor['idrotacionturno'];
           $aux->idrotacion = $valor['idrotacion'];
           $aux->idturnotrabajo = $valor['idturnotrabajo'];
           $aux->denominacion = $valor['NomTurnotrabajo']['denominacion'];
           $aux->cantdias = $valor['cantdias'];
           $result[] = $aux;
       }
       //Imprimiendo el listado
       echo Zend_Json::encode(array('datos' => $result, 'cantidad' => count($result)));

    }

    function addRotacionTurnosAction()
    {
        $arreglo = json_decode(stripslashes($this->_request->getPost('array')));
        //Creando el modelo de negocio
        $modeloNegocioRotacion = new NomRotacionModel();
		
		if($modeloNegocioRotacion->existeRotacion($this->_getParam('denominacion')) == null){

			//Insertando los datos
			$modeloNegocioRotacion->InsertarRotacion(
				$this->_getParam('denominacion'),
				$this->_getParam('descripcion'),
				$this->_getParam('fdesde'),
				$this->_getParam('fhasta'),
                $arreglo
			);			
			//Devolviendo una notificación de que todo ocurrió correctamente
			$this->_enviarNotificacionCorrecta();
		}
		else			
			echo "{success: 'true',existe:'3'}"; //Error 3, Denominacion ya existe
    }

    function modRotacionTurnosAction()
    {
        $arreglo = json_decode(stripslashes($this->_request->getPost('array')));
		//Creando el modelo de negocio
        $modeloNegocioRotacion = new NomRotacionModel();
			//Insertando los datos
			$modeloNegocioRotacion->ModificarRotacion(
				$this->_getParam('idrotacion'),
				$this->_getParam('denominacion'),
				$this->_getParam('descripcion'),
				$this->_getParam('fdesde'),
				$this->_getParam('fhasta'),
                $arreglo
			);		
			//Devolviendo una notificación de que todo ocurrió correctamente
			$this->_enviarNotificacionCorrecta();
    }
    
    function delRotacionTurnosAction()
    {
        $modeloNegocioRotacion = new NomRotacionModel();
        $resp =  $modeloNegocioRotacion->EliminarRotacion($this->_getParam('idrotacion'));
        if ($resp == false) {
            $m->codMsg = 3;
            echo json_encode($m);
        } else {
            $m->codMsg = 1;
            echo json_encode($m);
        }
    }
	
	private function _enviarNotificacionCorrecta() {
        echo "{success: 'true'}";
    }

}