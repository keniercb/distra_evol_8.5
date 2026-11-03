<?php

class PeriodocontrolController extends ZendExt_Controller_Secure
{

    function init()
    {
        parent::init();
    }

    function periodocontrolAction()
    {        
        $this->render('periodocontrol');
    }

    function getPeriodoControlAction()
    {
        $limit = $this->_request->getPost('limit');
        $start = $this->_request->getPost('start');

        echo(json_encode($r));
    }
	
	/**
     * Accion utilizada para listar los datos
     */
   public function listarPeriodoControlAction() {
        //Creando el modelo de negocio de gestion
        $modeloNegocioPeriodoControl = new ConfPeriodocontrolModel();
        
        //Obteniendo el listado
       $arrPeriodoControl = $modeloNegocioPeriodoControl->obtenerListadoPeriodoControl(
            $this->_getParam('start', 0),
            $this->_getParam('limit', 15),
			$this->_getParam('fdesde'),
			$this->_getParam('fhasta')
        );
        //Obteniendo la cantidad total
        $cantTotalPeriodoControl = $modeloNegocioPeriodoControl->obtenerCantidadTotalPeriodoControl();

        //Imprimiendo el listado
        echo Zend_Json::encode(array('datos' => $arrPeriodoControl, 'cantidad' => $cantTotalPeriodoControl));
    }

    function addPeriodoControlAction()
    {
        $fdesde = $this->_getParam('fdesde');
        $fhasta = $this->_getParam('fhasta');
        $descripcion = $this->_getParam('descripcion');

		//Creando el modelo de negocio
        $modeloNegocioPeriodoControl = new ConfPeriodocontrolModel();
        if($modeloNegocioPeriodoControl->Getrangofechasdesde($fdesde, $fhasta)== null && $modeloNegocioPeriodoControl->Getrangofechashasta($fdesde, $fhasta)== null && $modeloNegocioPeriodoControl->Getrangofechasdesde1($fdesde)== null && $modeloNegocioPeriodoControl->Getrangofechashasta1($fhasta) == null){
		//Insertando los datos
			$modeloNegocioPeriodoControl->InsertarPeriodoControl($descripcion, $fdesde, $fhasta);
			//Devolviendo una notificación de que todo ocurrió correctamente
			$this->_enviarNotificacionCorrecta();
        }
        else
            echo "{success: 'true',existe:'3'}"; //Error 3, Denominacion ya existe

    }

    function modPeriodoControlAction()
    {
		//Creando el modelo de negocio
        $modeloNegocioPeriodoControl = new ConfPeriodocontrolModel();

			//Insertando los datos
			$modeloNegocioPeriodoControl->ModificarPeriodoControl(
				$this->_getParam('idperiodocontrol'),
				$this->_getParam('descripcion'),
				$this->_getParam('fdesde'),
				$this->_getParam('fhasta')
			);		
			//Devolviendo una notificación de que todo ocurrió correctamente
			$this->_enviarNotificacionCorrecta();
    }
    
    function delPeriodoControlAction()
    {
		//Creando el modelo de negocio.
        $modeloNegocioPeriodoControl = new ConfPeriodocontrolModel();

        //Eliminando
        $modeloNegocioPeriodoControl->EliminarPeriodoControl(
            $this->_getParam('idperiodocontrol')
        );

        //Devolviendo una notificación de que todo ocurrió correctamente
        $this->_enviarNotificacionCorrecta();
    }
	
	private function _enviarNotificacionCorrecta() {
        echo "{success: 'true'}";
    }

}