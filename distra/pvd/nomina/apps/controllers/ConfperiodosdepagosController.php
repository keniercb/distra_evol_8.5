<?php

class ConfperiodosdepagosController extends ZendExt_Controller_Secure
{

    public function init()
    {
        parent::init();
    }

    public function confperiodosdepagosAction()
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
        $idtipopago = Zend_Json::decode(stripslashes($this->_getParam('idtipopago')));
        $idperiodopago = $this->_request->getPost('idperiodopago');
        //Obteniendo el listado de las fechas de los periodos de pagos.
        $arrayFechas = ConfPeriodosTiposPagoModel::obtenerListadoFechasArrayTipoPago($identidad, $idtipopago, $idperiodopago);

        $r = array();
        $cont = 0;
        $orden = 0;
        foreach ($arrayFechas as $idtipopago => $arrfechas) {
            $denomtipopago = NomTipoPago::obtenerDenominacion($idtipopago);
            foreach ($arrfechas[0]['ConfDesglosePeriodos'] as $fecha) {
                $r[$cont]['iddesgloseperiodos'] = $fecha['iddesgloseperiodos'];
                $r[$cont]['idperiodostipospago'] = $arrfechas[0]['idperiodostipospago'];
                $r[$cont]['idestructura'] = $arrfechas[0]['idestructura'];
                $r[$cont]['idtipopago'] = $arrfechas[0]['idtipopago'];
                $r[$cont]['denomtipopago'] = $denomtipopago;
                $r[$cont]['idperiodopago'] = $arrfechas[0]['idperiodopago'];
                $r[$cont]['fechainicio'] = $fecha['fdesde'];
                $r[$cont]['fechafin'] = $fecha['fhasta'];
                $r[$cont]['anno'] = explode('/', $fecha['fdesde'])[2];
                //Ordenando los a�os descendentes
                $r[$cont]['anno'] = (1 / $r[$cont]['anno']) . '-' . $r[$cont]['anno'] /*. '-' . $denomtipopago*/
                ;
                $r[$cont]['orden'] = ++$orden;
                $cont++;
            }
        }

        //print_r($r);die;
        //Imprimiendo el listado de las fechas de los periodos de pagos.
        echo Zend_Json::encode(array('datos' => $r, 'cantidad' => count($r)));
    }

    public function adicionarPeriodosPagosAction()
    {
        $obj = new ConfPeriodosTiposPagoModel();
        $identidad = $this->_request->getPost('identidad');
        $idtipopago = Zend_Json::decode(stripslashes($this->_getParam('idtipopago')));
        $idperiodopago = $this->_request->getPost('idperiodopago');
        $fechainicio = $this->_request->getPost('fechainicio');
        $fechafin = $this->_request->getPost('fechafin');
        $respuesta = $obj->adicionarPeriodosPagos($identidad, $idtipopago, $idperiodopago, $fechainicio, $fechafin);
        if ($respuesta == 'NO-CONFIG-PERIODO')
            echo json_encode(array('respuesta' => $respuesta));
        else
            echo json_encode(array('respuesta' => "ADD", 'cantperiodos' => $respuesta));
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
