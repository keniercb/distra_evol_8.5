<?php
/**
 * Created by PhpStorm.
 * User: yari
 * Date: 09/10/17
 * Time: 17:25
 */
class ResumenindividualController extends ZendExt_Controller_Secure
{
    public function init()
    {
        parent::init();
    }

    function resumenindividualAction()
    {
        $this->view->estructura = $this->integrator->metadatos->obtenerIUEstructura();
        $this->render();
    }

    /**
     * Obtiene el listado de personas
     * @return Arreglo con las personas
     * @author Yaricel Guerra Velázquez
     */
    function getPersonasAction()
    {
        $filtro = $this->_getParam('query');
        $idestructura = $this->_getParam('idestructura');
        $start = $this->_getParam('start');
        $limit = $this->_getParam('limit');
        $datos = DatAccionparticipanteModel::getParticipantesByEstructura($idestructura, $filtro, $start, $limit);
        echo Zend_Json::encode($datos);
    }

    /**
     * Obtiene el listado de acciones
     * @return Arreglo con las acciones dada una persona
     * @author Yaricel Guerra Velázquez
     */
    function getAccionesAction()
    {
        $modeloNegocio = new DatAccionparticipanteModel();
        $arr = $modeloNegocio->getAccionesByPersona(
            $this->_getParam('activo'),
            $this->_getParam('idpersona'),
            $this->_getParam('fdesde'),
            $this->_getParam('fhasta'),
            $this->_getParam('limit'),
            $this->_getParam('start')
        );
        echo Zend_Json::encode($arr);
    }

    function generarPdfReportesAction()
    {
        set_time_limit(30000);
        $idpersona = $this->_getParam('idpersona');
        $fdesde = $this->_getParam('fdesde');
        $fhasta = $this->_getParam('fhasta');
        $objReportePDF = new ReportepdfplanindivModel();
        $objReportePDF->CrearReportePDF($idpersona, $fdesde, $fhasta);
        return true;
    }
}