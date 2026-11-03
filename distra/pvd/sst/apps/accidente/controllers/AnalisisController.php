<?php

/**
 * @name AnalisisftController - Clase controladora de análisis de información.
 * @package   movimientoslaborales.
 * @copyright XETID.
 * @author    Centro RRHH. División Gestión de Entidades. XETID.
 * @version   1.0
 */
class AnalisisController extends ZendExt_Controller_Secure
{
    public function init()
    {
        parent::init();
    }

    function analisisAction()
    {
        $this->render();
    }


    public function obtenerEstructuraAction()
    {
        try {
            $result = Array();
            $vioc = ZendExt_IoC::getInstance();
            $idestruc = $this->_getParam('idestructura');
            if ($this->_getParam('node') == 0 && $idestruc != 0) {
                $id = $idestruc;
                $estr = $vioc->metadatos->DameEstructura($id);
                array_push($result, $estr[0]);
            } else {
                $id = $this->_getParam('node');
                $result = $vioc->metadatos->DameHijosEstructura($id);
            }
            echo json_encode($result);
        } catch (Exception $e) {
            echo json_encode(Array());
        }
    }

    public function getPrincipalesIndicadoresAction()
    {
        $idestructura = $this->_getParam('idestructura');
        $trimestre = $this->_getParam('trimestre');
        $obj = new DatAnalisisModel();
        $r = $obj->getPrincipalesIndicadores($idestructura, $trimestre);
        echo Zend_Json::encode($r);
    }

    public function obtenerReporteAction()
    {
        $idestructura = $this->_getParam('idestructura');
        $trimestre = $this->_getParam('trimestre');
        $obj = new ReportepdfPrincipalesIndicadoresModel();
        $obj->CrearReportePDF($idestructura, $trimestre);
        return true;
    }

    public function getDatosAccidentesAction()
    {
        $idestructura = $this->_getParam('idestructura');
        $obj = new DatAnalisisModel();
        $r = $obj->getDatosAccidentes($idestructura);
        echo Zend_Json::encode($r);
    }

    public function obtenerReporteAccidentesAction()
    {
        $idestructura = $this->_getParam('idestructura');
        $obj = new ReportepdfAccidentesdeTrabajoModel();
        $obj->CrearReportePDF($idestructura);
        return true;
    }

    public function getDatosPartesAfectadasAction()
    {
        $idestructura = $this->_getParam('idestructura');
        $partes = $this->_getParam('partes');
        $annoini = $this->_getParam('annoini');
        $annofin = $this->_getParam('annofin');
        $obj = new DatAnalisisModel();
        $datos = $obj->getDatosPartesAfectadas($idestructura, $partes, $annoini, $annofin);
        $array = array('data' => $datos, 'cant' => count($datos));
        echo json_encode($array);
    }

    public function obtenerReporteParteAfectadasAction()
    {
        $idestructura = $this->_getParam('idestructura');
        $partes = $this->_getParam('partes');
        $annoini = $this->_getParam('annoini');
        $annofin = $this->_getParam('annofin');
        $obj = new ReportepdfPartesCuerpoModel();
        $obj->CrearReportePDF($idestructura, $partes, $annoini, $annofin);
        return true;
    }


    function getDatosGraficaAction()
    {
        $id = $this->_request->getPost('idestructura');
        $objModel = new AnalisisEstadisticoModel();
        $resumen = $objModel->getDatosDashboard($id);
        echo json_encode($resumen);
    }

    function getPartesActivasAction()
    {
        $obj = new NomPartecuerpo();
        $r = $obj->getPartesActivos();
        echo Zend_Json::encode($r);
    }

    public function getDatosComportamientoAction()
    {
        $idestructura = $this->_getParam('idestructura');
        $annoini = $this->_getParam('annoini');
        $annofin = $this->_getParam('annofin');
        $obj = new DatAnalisisModel();
        $r = $obj->getDatosComportamientoVista($idestructura, $annoini, $annofin);
        $array = array('data' => $r, 'cant' => count($r));
        echo Zend_Json::encode($array);
    }

    public function obtenerReporteComportamientoAction()
    {
        $idestructura = $this->_getParam('idestructura');
        $annoini = $this->_getParam('annoini');
        $annofin = $this->_getParam('annofin');
        $obj = new ReportepdfComportamientoModel();
        $obj->CrearReportePDF($idestructura, $annoini, $annofin);
        return true;
    }

    function getIncapacidadesActivasAction()
    {
        $obj = new NomTipoinvalidez();
        $r = $obj->getInvalidezActivos();
        echo Zend_Json::encode($r);
    }

    public function getDatosIncapacidadAction()
    {
        $idestructura = $this->_getParam('idestructura');
        $annoini = $this->_getParam('annoini');
        $annofin = $this->_getParam('annofin');
        $incapacidad = $this->_getParam('incapacidad');
        $obj = new DatAnalisisModel();
        $r = $obj->getDatosIncapacidadVista($idestructura, $incapacidad, $annoini, $annofin);
        $array = array('data' => $r, 'cant' => count($r));
        echo Zend_Json::encode($array);
    }

    public function obtenerReporteClaseIncapacidadAction()
    {
        $idestructura = $this->_getParam('idestructura');
        $annoini = $this->_getParam('annoini');
        $annofin = $this->_getParam('annofin');
        $incapacidad = $this->_getParam('incapacidad');
        $obj = new ReportepdfiCapacidadModel();
        $obj->CrearReportePDF($idestructura, $incapacidad, $annoini, $annofin);
        return true;
    }

    function getTipoAccidenteAction()
    {
        $obj = new NomTipoaccidente();
        $r = $obj->getTiposActivos();
        echo Zend_Json::encode($r);
    }

    public function getDatosCantFallecidosAction()
    {
        $idestructura = $this->_getParam('idestructura');
        $annoini = $this->_getParam('annoini');
        $annofin = $this->_getParam('annofin');
        $accidentes= $this->_getParam('accidentes');
        $obj = new DatAnalisisModel();
        $r = $obj->getDatosCantFallecidosVista($idestructura, $accidentes, $annoini, $annofin);
        $array = array('data' => $r, 'cant' => count($r));
        echo Zend_Json::encode($array);
    }

    public function obtenerReporteCantFallecidosAction()
    {
        $idestructura = $this->_getParam('idestructura');
        $annoini = $this->_getParam('annoini');
        $annofin = $this->_getParam('annofin');
        $accidentes= $this->_getParam('accidentes');
        $obj = new ReportepdfiCantFallecidosModel();
        $obj->CrearReportePDF($idestructura, $accidentes, $annoini, $annofin);
        return true;

    }

    public function getCategoriasActivasAction(){
        $obj = new DatAnalisisModel();
        $r = $obj->getCategoriasActivas();
        echo Zend_Json::encode($r);
    }

    public function getDatosCategoriaAction(){

        $idestructura = $this->_getParam('idestructura');
        $annoini = $this->_getParam('annoini');
        $annofin = $this->_getParam('annofin');
        $categoria = $this->_getParam('categoria');
        $obj = new DatAnalisisModel();
        $r = $obj->getDatosCategoria($idestructura, $categoria, $annoini, $annofin);
        $array = array('data' => $r, 'cant' => count($r));
        echo Zend_Json::encode($array);
    }

    public function obtenerReporteCategoriaAction(){
        $idestructura = $this->_getParam('idestructura');
        $annoini = $this->_getParam('annoini');
        $annofin = $this->_getParam('annofin');
        $categoria = $this->_getParam('categoria');
        $obj = new ReportepdfiCategoriaModel();
        $obj->CrearReportePDF($idestructura, $categoria, $annoini, $annofin);
        return true;


    }



}