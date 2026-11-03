<?php
/**
 * @name NomtipoaccionController
 * @package   capacitacion.configuracion
 * @copyright XETID.
 * @author    Centro RRHH. División Gestión de Entidades. XETID.
 * @version   1.0
 */
class NomtipoaccionController extends ZendExt_Controller_Secure
{
    function init()
    {
        parent::init();
    }

    function nomtipoaccionAction()
    {
        //$this->render();
    }
    
    /**
     * Obtiene el listado de los tipos de accion
     * @return Arreglo con todas los tipos de accion
     * @author Yaricel Guerra Velazquez
     */
    function getTiposaccionAction()
    {
        $modeloNegocio = new NomtipoaccionModel();
        $arr = $modeloNegocio->getTiposAccion(
            $this->_getParam('denominacion'), $this->_getParam('start'), $this->_getParam('limit')
        );
        echo Zend_Json::encode($arr);
    }

    /**
     * Adicionar tipo accion
     * @return Mensaje informando el resultado de la operación
     * @author Yaricel Guerra Velazquez
     */
    public function addTipoAccionAction()
    {
        $obj = new NomtipoaccionModel();
        if (!$obj->existeDenom($this->_getParam('denominacion'))) {
            $obj->addtipoaccion(
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
     * Modificar tipo accion
     * @return Mensaje informando el resultado de la operación
     * @author Yaricel Guerra Velazquez
     */
    public function updateTipoAccionAction()
    {
        $obj = new NomtipoaccionModel();
        $r = $obj->updatetipoaccion(
            $this->_getParam('idtipoaccion'),
            $this->_getParam('denominacion'),
            $this->_getParam('descripcion'),
            $this->_getParam('fdesde'),
            $this->_getParam('fhasta')
        );
        echo Zend_Json::encode($r);
    }

    /**
     * Eliminar tipo accion
     * @return Mensaje informando el resultado de la operación
     * @author Yaricel Guerra Velazquez
     */
    public function deleteTipoAccionAction()
    {
        $idstipoaccion = json_decode(stripslashes($this->_request->getPost('idstiposaccion')));
        $respuesta = true;
        $obj = new NomtipoaccionModel();
        foreach ($idstipoaccion as $p) {
            $r = $obj->deleteTipoAccion($p);
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