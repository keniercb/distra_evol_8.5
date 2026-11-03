<?php
/**
 * Created by Netbeans.
 * User: eddy
 * Date: 01/12/17
 * Time: 10:15
 */
class MediosController extends ZendExt_Controller_Secure
{
    public function init()
    {
        parent::init();
    }

    function mediosAction()
    {
        $this->view->estructura = $this->integrator->metadatos->obtenerIUEstructura();
        $this->render();
    }

    /**
     * Obtiene el listado de los riesgos
     * @return Arreglo con los riesgos
     * @author Beatriz Selema Alvarez
     */
    function getMediosAction()
    {
        $filtro = $this->_getParam('query');
        $idestructura = $this->_getParam('idestructura');
        $start = $this->_getParam('start');
        $limit = $this->_getParam('limit');
        $datos = DatMediosModel::getMedios($filtro, $idestructura, $limit, $start);
        echo Zend_Json::encode($datos);
    }

    /**
     * Adiciona riesgo
     * @return Variable entera informando el resultado de la operacion
     * @author Beatriz Selema Alvarez
     */
    function addMedioAction()
    {
        $modeloNegocio = new DatMediosModel();
        $arr = $modeloNegocio->addMedio(
            $this->_getParam('idmedio'),
            $this->_getParam('idestructura'),
            $this->_getParam('cantidad')
        );
        echo Zend_Json::encode($arr);
    }

    /**
     * Modifica riesgo
     * @return Variable entera informando el resultado de la operacion
     * @author Beatriz Selema Alvarez
     */
    function updateMedioAction()
    {
        $modeloNegocio = new DatMediosModel();
        $arr = $modeloNegocio->updateMedio(
            $this->_getParam('iddmedio'),
            $this->_getParam('idmedio'),
            $this->_getParam('idestructura'),
            $this->_getParam('cantidad')
        );
        echo Zend_Json::encode($arr);
    }

    /**
     * Elimina riesgo
     * @return Variable entera informando el resultado de la operacion
     * @author Beatriz Selema Alvarez
     */
    function deleteMedioAction()
    {
        $arrayids = json_decode(stripslashes($this->_request->getPost('idsmedios')));
        $respuesta = true;
        foreach ($arrayids as $p) {
            $r = DatMediosModel::deleteMedio($p);
            if ($r == false) {
                $respuesta = false;
            }
        }
        echo json_encode($respuesta);
    }
    
    /**
     * Obtiene los valores del nomenclador de riesgo
     * @return Arreglo con todos los valores del nomenclador de riesgo
     * @author Beatriz Selema Alvarez
     */
    function getNomMedioAction()
    {
        $modeloNegocio = new NomMediosModel();
        $arr = $modeloNegocio->getMediosActivos();
        echo Zend_Json::encode($arr);
    }

}