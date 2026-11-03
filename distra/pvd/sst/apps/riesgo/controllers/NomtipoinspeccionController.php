<?php
/**
 * @name NomtipoinspeccionController
 * @package   riesgo.configuracion
 * @copyright XETID.
 * @author    Centro RRHH. División Gestión de Entidades. XETID.
 * @version   1.0
 */
class NomtipoinspeccionController extends ZendExt_Controller_Secure
{
    function init()
    {
        parent::init();
    }

    function nomtipoinspeccionAction()
    {
        $this->render();
    }
    
    /**
     * Obtiene el listado de las tipoinspecciones de equipos
     * @return Arreglo con todas las tipoinspecciones
     * @author Yaricel Guerra Velazquez
     */
    function getTipoinspeccionAction()
    {
        $modeloNegocio = new NomTipoinspeccionModel();
        $arr = $modeloNegocio->getTipoinspeccion(
            $this->_getParam('denominacion'), $this->_getParam('start'), $this->_getParam('limit')
        );
        echo Zend_Json::encode($arr);
    }

    /**
     * Adicionar tipoinspeccion
     *
     * @return Mensaje informando el resultado de la operación
     * @author Yaricel Guerra Velazquez
     */
    public function addTipoinspeccionAction()
    {
        $obj = new NomTipoinspeccionModel();
        if (!$obj->existeDenom($this->_getParam('denominacion'))) {
            $obj->add(
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
     * Modificar tipoinspeccion
     *
     * @return Mensaje informando el resultado de la operación
     * @author Yaricel Guerra Velazquez
     */
    public function updateTipoinspeccionAction()
    {
        $obj = new NomTipoinspeccionModel();
        $r = $obj->update(
            $this->_getParam('idtipoinspeccion'),
            $this->_getParam('denominacion'),
            $this->_getParam('descripcion'),
            $this->_getParam('fdesde'),
            $this->_getParam('fhasta')
        );
        echo Zend_Json::encode($r);
    }

    /**
     * Eliminar tipoinspeccion
     *
     * @return Mensaje informando el resultado de la operación
     * @author Yaricel Guerra Velazquez
     */
    public function deleteTipoinspeccionAction()
    {
        $clasif = json_decode(stripslashes($this->_request->getPost('tipoinspeccion')));
        $respuesta = true;
        $obj = new NomTipoinspeccionModel();
        foreach ($clasif as $p) {
            $r = $obj->delete($p);
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