<?php
/**
 * @name NomnaturalezalesionController
 * @package   accidente.configuracion
 * @copyright XETID.
 * @author    Centro RRHH. División Gestión de Entidades. XETID.
 * @version   1.0
 */
class NomnaturalezalesionController extends ZendExt_Controller_Secure
{
    function init()
    {
        parent::init();
    }

    function nomnaturalezalesionAction()
    {
        //$this->render();
    }
    
    /**
     * Obtiene el listado de las naturalezas de la lesiones
     * @return Arreglo con todas las naturalezas de la lesiones
     * @author Eddy Santana Navarro
     */
    function getNaturalezaLesionAction()
    {
        $modeloNegocio = new NomNaturalezalesionModel();
        $arr = $modeloNegocio->getNaturalezas(
            $this->_getParam('denominacion'), $this->_getParam('start'), $this->_getParam('limit')
        );
        echo Zend_Json::encode($arr);
    }

    /**
     * Adicionar naturaleza de la lesion
     * @return Mensaje informando el resultado de la operación
     * @author Eddy Santana Navarro
     */
    public function addNaturalezaLesionAction()
    {
        $obj = new NomNaturalezalesionModel();
        if (!$obj->existeDenom($this->_getParam('denominacion'))) {
            $obj->addNaturaleza(
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
     * Modificar naturaleza de la lesion
     * @return Mensaje informando el resultado de la operación
     * @author Eddy Santana Navarro
     */
    public function updateNaturalezaLesionAction()
    {
        $obj = new NomNaturalezalesionModel();
        $r = $obj->updateNaturaleza(
            $this->_getParam('idnaturalezalesion'),
            $this->_getParam('denominacion'),
            $this->_getParam('descripcion'),
            $this->_getParam('fdesde'),
            $this->_getParam('fhasta')
        );
        echo Zend_Json::encode($r);
    }

    /**
     * Eliminar naturaleza de la lesion
     * @return Mensaje informando el resultado de la operación
     * @author Eddy Santana Navarro
     */
    public function deleteNaturalezaLesionAction()
    {
        $naturalezas = json_decode(stripslashes($this->_request->getPost('naturalezas')));
        $respuesta = true;
        $obj = new NomNaturalezalesionModel();
        foreach ($naturalezas as $p) {
            $r = $obj->deleteNaturaleza($p);
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