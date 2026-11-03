<?php
/**
 * @name NomnivelriesgoController
 * @package   riesgo.configuracion
 * @copyright XETID.
 * @author    Centro RRHH. División Gestión de Entidades. XETID.
 * @version   1.0
 */
class NomnivelriesgoController extends ZendExt_Controller_Secure
{
    function init()
    {
        parent::init();
    }

    function nomnivelriesgoAction()
    {
        //$this->render();
    }
    
    /**
     * Obtiene el listado de los niveles de riesgo
     * @return Arreglo con todos los niveles de riesgo
     * @author Eddy Santana Navarro
     */
    function getNivelesAction()
    {
        $modeloNegocio = new NomNivelriesgoModel();
        $arr = $modeloNegocio->getNiveles(
            $this->_getParam('denominacion'), $this->_getParam('start'), $this->_getParam('limit')
        );
        echo Zend_Json::encode($arr);
    }

    /**
     * Adicionar nivel de riesgo
     * @return Mensaje informando el resultado de la operación
     * @author Eddy Santana Navarro
     */
    public function addNivelAction()
    {
        $obj = new NomNivelriesgoModel();
        if (!$obj->existeDenom($this->_getParam('denominacion'))) {
            $obj->addNivel(
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
     * Modificar nivel de riesgo
     * @return Mensaje informando el resultado de la operación
     * @author Eddy Santana Navarro
     */
    public function updateNivelAction()
    {
        $obj = new NomNivelriesgoModel();
        $r = $obj->updateNivel(
            $this->_getParam('idnivelriesgo'),
            $this->_getParam('denominacion'),
            $this->_getParam('descripcion'),
            $this->_getParam('fdesde'),
            $this->_getParam('fhasta')
        );
        echo Zend_Json::encode($r);
    }

    /**
     * Eliminar nivel de riesgo
     * @return Mensaje informando el resultado de la operación
     * @author Eddy Santana Navarro
     */
    public function deleteNivelAction()
    {
        $niveles = json_decode(stripslashes($this->_request->getPost('niveles')));
        $respuesta = true;
        $obj = new NomNivelriesgoModel();
        foreach ($niveles as $p) {
            $r = $obj->deleteNivel($p);
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