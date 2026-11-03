<?php
/**
 * @name NomediosController
 * @package   riesgo.configuracion
 * @copyright XETID.
 * @author    Centro RRHH. División Gestión de Entidades. XETID.
 * @version   1.0
 */
class NomediosController extends ZendExt_Controller_Secure
{
    function init()
    {
        parent::init();
    }

    function nomediosAction()
    {
        //$this->render();
    }
    
    /**
     * Obtiene el listado de los medios
     * @return Arreglo con todos los medios
     * @author Beatriz Selema Alvarez
     */
    function getMediosAction()
    {
        $modeloNegocio = new NomMediosModel();
        $arr = $modeloNegocio->getMedios(
            $this->_getParam('denominacion'), $this->_getParam('start'), $this->_getParam('limit')
        );
        echo Zend_Json::encode($arr);
    }

    /**
     * Adicionar medios
     * @return Mensaje informando el resultado de la operación
     * @author Beatriz Selema Alvarez
     */
    public function addMediosAction()
    {
        $obj = new NomMediosModel();
        if (!$obj->existeDenom($this->_getParam('denominacion'))) {
            $obj->addMedios(
                $this->_getParam('denominacion'),
                $this->_getParam('descripcion'),
                $this->_getParam('fdesde'),
                $this->_getParam('fhasta')
            );
            $this->_enviarNotificacionCorrecta();
        } else {
            echo Zend_Json::encode(false);
        }
    }

    /**
     * Modificar medios
     * @return Mensaje informando el resultado de la operación
     * @author Beatriz Selema Alvarez
     */
    public function updateMediosAction()
    {
        $obj = new NomMediosModel();
        $r = $obj->updateMedios(
            $this->_getParam('idmedio'),
            $this->_getParam('denominacion'),
            $this->_getParam('descripcion'),
            $this->_getParam('fdesde'),
            $this->_getParam('fhasta')
        );
        echo Zend_Json::encode($r);
    }

    /**
     * Eliminar riesgo
     * @return Mensaje informando el resultado de la operación
     * @author Beatriz Selema Alvarez
     */
    public function deleteMediosAction()
    {
        $medios = json_decode(stripslashes($this->_request->getPost('medios')));
        $respuesta = true;
        $obj = new NomMediosModel();
        foreach ($medios as $p) {
            $r = $obj->deleteMedios($p);
            if ($r == false) {
                $respuesta = false;
            }
        }
        echo json_encode($respuesta);
    }
    
    private function _enviarNotificacionCorrecta()
    {
        echo "{success: 'true'}";
    }
}