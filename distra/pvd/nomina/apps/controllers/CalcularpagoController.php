<?php
$dir_www = str_ireplace('web', 'apps', $_SERVER['DOCUMENT_ROOT']);
require($dir_www . '/pvd/comun/recursos/fpdf/fpdf.php');

include_once($dir_www . '/pvd/comun/recursos/PHPExcel.php');
include_once($dir_www . '/pvd/comun/recursos/PHPExcel/Writer/Excel2007.php');
include_once($dir_www . '/pvd/comun/recursos/PHPExcel/Reader/Excel2007.php');
include_once($dir_www . '/pvd/comun/recursos/PHPExcel/Writer/PDF.php');
include_once($dir_www . '/pvd/comun/recursos/PHPExcel/Writer/Excel5.php');
include_once($dir_www . '/pvd/comun/recursos/PHPExcel/IOFactory.php');

class CalcularpagoController extends ZendExt_Controller_Secure
{
    public $objModel;
    public $arrayPago;

    public function init()
    {
        $this->objModel = new CalcularPagoModel();
        parent::init();
    }

    public function calcularpagoAction()
    {
        $this->arrayPago = 'Prueba';
        $this->view->dirScriptsCmpReccomplejas = $this->integrator->reccomplejas->obtenerScriptsReccomplejas(null);
        $this->render();
    }

    function obtenerpagosAction()
    {
        $identidad = $this->_request->getPost('identidad');
        $tipo = $this->_request->getPost('tipo');
        $idpagoporresultado = $this->_request->getPost('idpagoporresultado');
        $datos = $this->objModel->listarPagosPorResultado($identidad, $tipo, $idpagoporresultado);
        //print_r($datos);die;
        echo Zend_Json::encode(array('datos' => $datos, 'cantidad' => 20));
    }

    function guardarpagosareasAction()
    {
        $areas = json_decode($this->_request->getPost('areas'));
        $objAreas = array();
        foreach ($areas as $area) {
            $objAreas[$area->idarea] = $area;
        }

        $pagos = $this->_request->getPost('pagos');
        $fechainicio = $this->_request->getPost('fechainicio');
        $fechafin = $this->_request->getPost('fechafin');
        $identidad = $this->_request->getPost('identidad');
        $idpagoResultado = $this->_request->getPost('idpagoresultado');
        $pagoxresultadosdestajo = $this->_request->getPost('pagoxresultadosdestajo');
        $r = new stdClass();
        if (!$fechainicio || !$fechafin) {
            $r->codMsg = -1;
        } else {
            $result = $this->objModel->guardarAreasyPeriodosDePagos($idpagoResultado, ($pagos)?explode(',', $pagos):array(), $objAreas, $fechainicio, $fechafin, $identidad, $pagoxresultadosdestajo);
            $r->codMsg = 100;
        }

        echo Zend_Json::encode($r);
    }

    function calcularpagosAction()
    {
        $objAreas = json_decode($this->_request->getPost('areas'));
        $objPagos = json_decode($this->_request->getPost('pagos'));
        $idpagoResultado = $this->_request->getPost('idpagoresultado');
        $composicion = $this->_request->getPost('composicion');
        $finicio = $this->_request->getPost('finicio');
        $ffin = $this->_request->getPost('ffin');
        $identidad = $this->_request->getPost('identidad');
        $tipocalculo = $this->_request->getPost('tipocalculo');
        $areasmontos = json_decode($this->_request->getPost('areasmontos'));
        $datosfechadestajo = Zend_Json::decode(stripslashes($this->_request->getPost('datosfechadestajo')));
        $pagoxresultadosdestajo = $this->_request->getPost('pagoxresultadosdestajo');
        //$objConfPagoResultados = new ConfPagosporresultado();
        //$arrayconfpagor = $objConfPagoResultados->obtenerConfpagosporresultadosXId($idpagoResultado);

        $result = $this->objModel->realizarCalculoPago($idpagoResultado, $objPagos, $objAreas, $identidad, $finicio, $ffin, $composicion, $tipocalculo,$areasmontos, $datosfechadestajo, $pagoxresultadosdestajo);

        echo json_encode($result);
    }

    function guardarpagosAction()
    {
        $idpagoResultado = $this->_request->getPost('idpagoresultado');
        $identidad = $this->_request->getPost('identidad');
        $referencia = $this->_request->getPost('referencia');
        $finicio = $this->_request->getPost('finicio');
        $ffin = $this->_request->getPost('ffin');
        $idusuario = (!empty($this->global->Perfil->idusuario)) ? $this->global->Perfil->idusuario : null;
        $composicion = $this->_request->getPost('composicion');
        $pagoxresultadosdestajo = $this->_request->getPost('pagoxresultadosdestajo');
        $objPagos = json_decode($this->_request->getPost('pagos'));
        $result = $this->objModel->almacenarValoresReporte(
            $idpagoResultado,
            $referencia,
            $identidad,


            $idusuario,
            $finicio,
            $ffin,
            $composicion,
            $objPagos);
        $r->codMsg = ($result) ? 100 : 200;
        echo Zend_Json::encode($r);
    }

    function limpiarmontosareasAction()
    {
        $identidad = $this->_request->getPost('identidad');
        $idpagoporresultado = json_decode($this->_request->getPost('idpagoporresultado'));
        $r = $this->objModel->borraTodosMontosAreas($identidad, $idpagoporresultado);
        echo Zend_Json::encode($r);
    }

    public function calcularMontosDistribuirAreasAction()
    {
        $identidad = $this->_request->getPost('identidad');
        $idpagoporresultado = json_decode($this->_request->getPost('idpagoresultado'));
        $monto = json_decode($this->_request->getPost('monto'));
        $confAgrupadorArea = new ConfAgrupadorAreas();
        $confFormulasAreasMonto = new ConfFormulasAreasMontos();
        $obj = new stdClass();
        $flag = 0;
        //Verificar que el pago por resultados tenga configurados los agrupadores
        $cantidadagrupadores = $confAgrupadorArea->obtenerCantidadAgrupadoresXIdPagoPorResultado($identidad, $idpagoporresultado);
        if ($cantidadagrupadores == 0) {
            $flag = 1;
            $obj->failed = 'NO-AGRUP-AREAS';
            echo json_encode($obj);
            return;
        }
        //Areas de la entidad configuradas para un pago por resultados con configuraciones de formulas para los montos
        $areasformulasmonto = $confAgrupadorArea->obtenerAreasConfiguradasEntidadFormulas($identidad, $idpagoporresultado);
        //Si no hay areas configuradas
        if (count($areasformulasmonto) == 0) {
            $flag = 1;
            $obj->failed = 'NO-AREAS-CONFIG';
            echo json_encode($obj);
            return;
        }
        $arrayareas = array();
        foreach ($areasformulasmonto as $areamonto) {
            $arrayareas[] = $areamonto['idarea'];
        }
        $areassinformulasmonto = $confAgrupadorArea->obtenerAreasNoConfiguradasEntidadFormulas($identidad, $idpagoporresultado, $arrayareas);
        //Si existen areas configuradas para el pago por resultados sin formula en el monto
        /*if (count($areassinformulasmonto) > 0) {
            $flag = 1;
            $arraydenomareas = array();
            foreach ($areassinformulasmonto as $areasmonto) {
                $arraydenomareas[] = $areasmonto['denominacion'];
            }
            $areassinformulamonto = implode(',', $arraydenomareas);
            $obj->areassinformulamonto = $arraydenomareas;
            $obj->failed = 'NO-AREAS-FORMULAS-CONFIGURADAS';
            echo json_encode($obj);
            return;
        }*/
        if ($flag == 0) {
            //Calcular montos
            $calcularpagoModel = new CalcularPagoModel();
            $val = $calcularpagoModel->calcularMontosAreas($identidad, $idpagoporresultado, $monto, $arrayareas);
            if ($val->failed == 'NO-EXPRESION-MATEMATICA-AGRUPADOR') {
                echo json_encode($val);
                return;
            } else {
                echo json_encode($val);
                return;
            }

        }
    }


    public function exportarMontosAreasAction()
    {
        $identidad = $this->_getParam('identidad');
        $idpagoporresultado = $this->_getParam('idpagoporresultado');
        $monto =$this->_getParam('monto');
        $objCalcularPago = new CalcularPagoModel();
        $r = $objCalcularPago->exportarMontosAreas($identidad, $idpagoporresultado, $monto);
        echo json_encode($r);
    }

    public  function exportarResultadoCalculoAction(){
        $identidad = $this->_getParam('identidad');
        $idpagoporresultado = $this->_getParam('idpagoporresultado');
        $referencia = $this->_getParam('referencia');
        $objCalcularPago = new CalcularPagoModel();
        $r = $objCalcularPago->exportarResultadoCalculo($identidad, $idpagoporresultado, $referencia);
        echo json_encode($r);

    }

    //Funcion para obtener los periodos en los q se va a calcular en el destajo
    public function obtenerperiodosdestajoAction(){
        $identidad = $this->_request->getPost('identidad');
        $idpagoresultado = $this->_request->getPost('idpagoresultado');
        $arrperiodopagodestajo = DatPeriodoDestajo::obtenerPeriodoDestajoxIdentidadPagoResultado($identidad, $idpagoresultado);
        echo json_encode(array('datos'=>$arrperiodopagodestajo, 'cantidad'=>count($arrperiodopagodestajo)));
    }

    //Funcion para adicionar los periodos en los q se va a calcular en el destajo
    public function adicionarperiodosdestajoAction(){
        $identidad = $this->_request->getPost('identidad');
        $idpagoresultado = $this->_request->getPost('idpagoresultado');
        $fechainicio = $this->_request->getPost('fechainicio');
        $fechafin = $this->_request->getPost('fechafin');
        $tipofecha = $this->_request->getPost('tipofecha');
        $objDatPeriodoDestajo = new DatPeriodoDestajo();
        //Si es in rango de dias
        if($tipofecha == 1){
            //Se guarda el rango
            $objDatPeriodoDestajo->identidad = $identidad;
            $objDatPeriodoDestajo->idpagoresultado = $idpagoresultado;
            $objDatPeriodoDestajo->fechainicio = $fechainicio;
            $objDatPeriodoDestajo->fechafin = $fechafin;
            $objDatPeriodoDestajo->save();
        //Si es dia a dia
        }else{
            $fixeplode = explode('/', $fechainicio);
            $ffxeplode = explode('/', $fechafin);
            $fechaInicio=strtotime($fixeplode[0].'-'.$fixeplode[1].'-'.$fixeplode[2]);
            $fechaFin=strtotime($ffxeplode[0].'-'.$ffxeplode[1].'-'.$ffxeplode[2]);
            //Guardando los dias
            for($i=$fechaInicio; $i<=$fechaFin; $i+=86400){
                $objDatPeriodoDestajo = new DatPeriodoDestajo();
                $objDatPeriodoDestajo->identidad = $identidad;
                $objDatPeriodoDestajo->idpagoresultado = $idpagoresultado;
                $objDatPeriodoDestajo->fechainicio = date("d-m-Y", $i);
                $objDatPeriodoDestajo->fechafin = date("d-m-Y", $i);
                $objDatPeriodoDestajo->save();
            }
        }
        echo json_encode('COD1');
    }

    //Funcion para adicionar los periodos en los q se va a calcular en el destajo
    public function eliminardestajoAction(){
        $arridfechadestajo = Zend_Json::decode(stripslashes($this->_request->getPost('arridfechadestajo')));
        foreach ($arridfechadestajo as $rfdest){
            $objFechaDestajoDelete = Doctrine::getTable('DatPeriodoDestajo')->find($rfdest);
            $objFechaDestajoDelete->delete();
        }
        echo json_encode('COD1');
    }
}
