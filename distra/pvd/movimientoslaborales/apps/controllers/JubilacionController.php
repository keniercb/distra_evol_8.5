<?php

/**
 * User: yari
 * Date: 29/03/22
 */
class JubilacionController extends ZendExt_Controller_Secure
{
    protected $_objSitLabModel, $_objSitLab;
    public function init()
    {
        $this->_objSitLabModel = new DatSituacionlaboralModel();
        $this->_objSitLab = new DatSituacionlaboral();
        parent::init();
    }

    function jubilacionAction()
    {
        $this->view->estructura = $this->integrator->metadatos->obtenerIUEstructura();
        $this->render();
    }

    function getPersonasAction()
    {
        $datos = new stdClass();
        $datos = $this->_objSitLabModel->getSituacionLaboral(
            $this->_getParam('query'), $this->_getParam('idestructura'),
            $this->_getParam('idcargo'), $this->_getParam('start'),
            $this->_getParam('limit'), 1, $this->_getParam('idconcepto')
        );
        echo json_encode($datos);
    }

    function getTrayectoriaLaboralAction()
    {
        $datos = new stdClass();
        $datos = DatosJubilacionModel::getTrayectoriaLaboral($this->_getParam('idpersona'));
        echo json_encode($datos);
    }

    function getSalariosAction()
    {
        $objpe = new DatosJubilacionModel();
        $datos = $objpe->getRegistroSalario($this->_getParam('idpersona'));
        echo json_encode($datos);
    }

    function realizarJubilacionAction()
    {

    }
}