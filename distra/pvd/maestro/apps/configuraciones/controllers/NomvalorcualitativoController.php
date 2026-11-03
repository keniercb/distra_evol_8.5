<?php
/**
 * @name NomvalorcualitativoController
 * @package   maestro.configuracion
 * @copyright XETID.
 * @author    Centro RRHH. División Gestión de Entidades. XETID.
 * @version   1.0
 */
class NomvalorcualitativoController extends ZendExt_Controller_Secure
{
    function init()
    {
        parent::init();
    }

    function nomvalorcualitativoAction()
    {
        //$this->render();
    }
    
    /**
     * Obtiene el listado de los valores cualitativos
     * @return Arreglo con todas los valores cualitativos
     * @author Yaricel Guerra Velazquez
     */
    function getValoresCualitativosAction()
    {
        $modeloNegocio = new NomValorcualitativoModel();
        $arr = $modeloNegocio->getValoresCualitativos(
            $this->_getParam('denominacion'), $this->_getParam('start'), $this->_getParam('limit')
        );
        echo Zend_Json::encode($arr);
    }

    /**
     * Adicionar valor cualitativo
     * @return Mensaje informando el resultado de la operación
     * @author Yaricel Guerra Velazquez
     */
    public function addValorCualitativoAction()
    {
        $obj = new NomValorcualitativoModel();
        if (!$obj->existeDenom($this->_getParam('denominacion'))) {
            $obj->addValor(
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
     * Modificar valor cualitativo
     * @return Mensaje informando el resultado de la operación
     * @author Yaricel Guerra Velazquez
     */
    public function updateValorCualitativoAction()
    {
        $obj = new NomValorcualitativoModel();
        $r = $obj->updateValor(
            $this->_getParam('idvalorcualitativo'),
            $this->_getParam('denominacion'),
            $this->_getParam('descripcion'),
            $this->_getParam('fdesde'),
            $this->_getParam('fhasta')
        );
        echo Zend_Json::encode($r);
    }

    /**
     * Eliminar valor cualitativo
     * @return Mensaje informando el resultado de la operación
     * @author Yaricel Guerra Velazquez
     */
    public function deleteValorAction()
    {
        $valores = json_decode(stripslashes($this->_request->getPost('valores')));
        $respuesta = true;
        $obj = new NomValorcualitativoModel();
        foreach ($valores as $p) {
            $r = $obj->deleteValor($p);
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