<?php
$dir_www = str_ireplace('web', 'apps', $_SERVER['DOCUMENT_ROOT']);
require($dir_www . '/pvd/comun/recursos/fpdf/fpdf.php');
/**
 * Controlador para visualizar el listado de cuotas del PCC y UJC.
 *
 * @author Ing. Dainier Velazquez Labrada
 * @package Pvd.
 * @subpackage Nomina - Configuración.
 * @category Clase controladora.
 * @uses
 * @copyright UCID
 * @version 1.0
 */
class ReclistadocuotasController extends ZendExt_Controller_Secure
{
    public function init ()
    {
        parent::init();
    }

    public function reclistadocuotasAction ()
    {
        $this->view->idioma = $this->global->Perfil->idioma;
        $this->render();
    }

    public function obtenerAfiliacionesAction ()
    {
        //$identidad = $this->_getParam('identidad');
        $datos = ConfAfiliaciones::obtenerListadoAfiliaciones();
        $cant = ConfAfiliaciones::obtenerCantidadAfiliaciones();
        echo json_encode(array('datos' => $datos, 'cantidad' => $cant));
    }

    public function obtenerPersonasAfiliadasAction ()
    {
        $identidad = $this->_getParam('identidad');
        $arridfechascierre = Zend_Json::decode(stripslashes($this->_getParam('arrfechas')));
        $idconfafiliacion = Zend_Json::decode(stripslashes($this->_getParam('idconfafiliacion')));
        $idorganizacion = Zend_Json::decode(stripslashes($this->_getParam('idorganizacion')));
        $objModel = new ReclistadocuotasModel();
        $datos = $objModel->obtenerPersonasAfiliadas($identidad, $arridfechascierre, $idconfafiliacion, $idorganizacion);

        $r = new stdClass();
        $r->personas = $datos['personas'];
        $r->columnas = $datos['columnas'];

        echo json_encode(array('datos' => $r, 'cantidad' => count($datos['personas'])));
    }

    public function obtenerFechasCierreAction ()
    {
        $arraydatos = DatFechasCierrePeriodo::obtenerListadoDatFechasCierrePeriodo($this->_getParam('identidad'));
        foreach($arraydatos as $i => $v) {
            $rexplodefecha = explode('/', $v['fechacierre']);
            $arraydatos[$i]['anno'] = $rexplodefecha[2];
        }
        echo json_encode(array('datos' => $arraydatos, 'cantidad' => count($arraydatos)));
    }

    public function exportarListadoAfiliadosAction ()
    {
        $identidad = $this->_getParam('identidad');
        $arridfechascierre = Zend_Json::decode(stripslashes($this->_getParam('arrfechas')));
        $idconfafiliacion = $this->_getParam('idconfafiliacion');
        $idorganizacion = $this->_getParam('idorganizacion');
        $denominacion = $this->_getParam('denominacion');
        $objModel = new ReclistadocuotasModel();
        $objReporte = new ReporteListadoAfiliadosModel();
        //Obteniendo las personas afiliadas a la organizacion especificada
        $datos = $objModel->obtenerPersonasAfiliadas($identidad, $arridfechascierre, $idconfafiliacion, $idorganizacion);
        //Creando el reporte
        $objReporte->exportarReporte($identidad, $arridfechascierre, $denominacion, $datos['personas'], $datos['columnas']);
    }
}