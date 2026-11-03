<?php

class ConfmontosareasController extends ZendExt_Controller_Secure
{

    public function init()
    {
        parent::init();
    }

    public function confmontosareasAction()
    {
        // $this->view->jsayuda = $this->integrator->ayuda->devolverJS();
        $this->render();
    }

    public function obtenerTiposPagosAction()
    {
        //Arreglo de tipos de pago.
        $arrayTipoP = NomTipoPagoModel::obtenerTodosTiposPago();
        //Imprimiendo los tipos de pago
        echo Zend_Json::encode(array('datos' => $arrayTipoP, 'cantidad' => count($arrayTipoP)));
    }

    public function obtenerPeriodosAction()
    {
        //Obteniendo el listado de periodos de pago.
        $arrPeriodos = NomPeriodoPagoModel::obtenerListadoPeriodosPago($this->_getParam('start', 0),
            $this->_getParam('limit', 10));
        //Imprimiendo el listado de periodos de pago.
        echo Zend_Json::encode(array('datos' => $arrPeriodos, 'cantidad' => count($arrPeriodos)));
    }

    public function obtenerFechasInicioFinAction()
    {
        $identidad = $this->_request->getPost('identidad');
        $idtipopago = $this->_request->getPost('idtipopago');
        $idperiodopago = $this->_request->getPost('idperiodopago');
        //Obteniendo el listado de las fechas de los periodos de pagos.
        $arrayFechas = ConfPeriodosTiposPagoModel::obtenerListadoFechas($identidad, $idtipopago, $idperiodopago);
        $r = array();
        foreach ($arrayFechas[0]['ConfDesglosePeriodos'] as $i => $fechas) {
            $r[$i]['iddesgloseperiodos'] = $fechas['iddesgloseperiodos'];
            $r[$i]['idperiodostipospago'] = $arrayFechas[0]['idperiodostipospago'];
            $r[$i]['idestructura'] = $arrayFechas[0]['idestructura'];
            $r[$i]['idtipopago'] = $arrayFechas[0]['idtipopago'];
            $r[$i]['idperiodopago'] = $arrayFechas[0]['idperiodopago'];
            $r[$i]['fechainicio'] = $fechas['fdesde'];
            $r[$i]['fechafin'] = $fechas['fhasta'];
            $r[$i]['anno'] = explode('/', $fechas['fdesde'])[2];
        }
        //Imprimiendo el listado de las fechas de los periodos de pagos.
        echo Zend_Json::encode(array('datos' => $r, 'cantidad' => count($r)));
    }

    public function adicionarPeriodosPagosAction()
    {
        $obj = new ConfPeriodosTiposPagoModel();
        $identidad = $this->_request->getPost('identidad');
        $idtipopago = $this->_request->getPost('idtipopago');
        $idperiodopago = $this->_request->getPost('idperiodopago');
        $fechainicio = $this->_request->getPost('fechainicio');
        $fechafin = $this->_request->getPost('fechafin');
        $respuesta = $obj->adicionarPeriodosPagos($identidad, $idtipopago, $idperiodopago, $fechainicio, $fechafin);
        $r = '';
        if (!empty($respuesta)) {
            $r = 'ADD-' . $respuesta;
        }
        echo json_encode(array('respuesta' => $r));
    }

    public function modificarPeriodosPagosAction()
    {
        $idperiodostipospago = $this->_request->getPost('idperiodostipospago');
        $iddesgloseperiodos = $this->_request->getPost('iddesgloseperiodos');
        $fechainicio = $this->_request->getPost('fechainicio');
        $fechafin = $this->_request->getPost('fechafin');
        $respuesta = ConfPeriodosTiposPagoModel::modificarPeriodosPagos($idperiodostipospago, $iddesgloseperiodos, $fechainicio, $fechafin);
        echo json_encode(array('respuesta' => $respuesta));
    }

    public function eliminarPeriodosPagosAction()
    {
        $idperiodostipospago = $this->_request->getPost('idperiodostipospago');
        $arrayiddesgloseperiodos = Zend_Json::decode(stripslashes($this->_getParam('arrayiddesgloseperiodos')));
        $respuesta = ConfPeriodosTiposPagoModel::eliminarPeriodosPagos($idperiodostipospago, $arrayiddesgloseperiodos);
        echo json_encode(array('respuesta' => $respuesta));
    }
}
