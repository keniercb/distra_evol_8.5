<?php
/**
 * @name NomtipoinvalidezController
 * @package   accidente.configuracion
 * @copyright XETID.
 * @author    Centro RRHH. División Gestión de Entidades. XETID.
 * @version   1.0
 */
class NomtipoinvalidezController extends ZendExt_Controller_Secure
{
    function init()
    {
        parent::init();
    }

    function nomtipoinvalidezAction()
    {
        //$this->render();
    }
    
    /**
     * Obtiene el listado de los tipos de invalidez
     * @return Arreglo con todos los tipos de invalidez
     * @author Eddy Santana Navarro
     */
    function getTipoInvalidezAction()
    {
        $modeloNegocio = new NomTipoinvalidezModel();
        $arr = $modeloNegocio->getTipos(
            $this->_getParam('denominacion'), $this->_getParam('start'), $this->_getParam('limit')
        );
        echo Zend_Json::encode($arr);
    }

    /**
     * Adicionar tipo de invalidez
     * @return Mensaje informando el resultado de la operación
     * @author Eddy Santana Navarro
     */
    public function addTipoInvalidezAction()
    {
        $obj = new NomTipoinvalidezModel();
        if (!$obj->existeDenom($this->_getParam('denominacion'))) {
            $obj->addTipo(
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
     * Modificar tipo de invalidez
     * @return Mensaje informando el resultado de la operación
     * @author Eddy Santana Navarro
     */
    public function updateTipoInvalidezAction()
    {
        $obj = new NomTipoinvalidezModel();
        $r = $obj->updateTipo(
            $this->_getParam('idtipoinvalidez'),
            $this->_getParam('denominacion'),
            $this->_getParam('descripcion'),
            $this->_getParam('fdesde'),
            $this->_getParam('fhasta')
        );
        echo Zend_Json::encode($r);
    }

    /**
     * Eliminar tipo de invalidez
     * @return Mensaje informando el resultado de la operación
     * @author Eddy Santana Navarro
     */
    public function deleteTipoInvalidezAction()
    {
        $tipos = json_decode(stripslashes($this->_request->getPost('tipos')));
        $respuesta = true;
        $obj = new NomTipoinvalidezModel();
        foreach ($tipos as $p) {
            $r = $obj->deleteTipo($p);
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