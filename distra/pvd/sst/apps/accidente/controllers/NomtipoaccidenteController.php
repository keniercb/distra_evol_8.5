<?php
/**
 * @name NomtipoaccidenteController
 * @package   accidente.configuracion
 * @copyright XETID.
 * @author    Centro RRHH. División Gestión de Entidades. XETID.
 * @version   1.0
 */
class NomtipoaccidenteController extends ZendExt_Controller_Secure
{
    function init()
    {
        parent::init();
    }

    function nomtipoaccidenteAction()
    {
        //$this->render();
    }
    
    /**
     * Obtiene el listado de los tipos de accidente
     * @return Arreglo con todos los tipos de accidente
     * @author Eddy Santana Navarro
     */
    function getTipoAccidenteAction()
    {
        $modeloNegocio = new NomTipoaccidenteModel();
        $arr = $modeloNegocio->getTipos(
            $this->_getParam('denominacion'), $this->_getParam('start'), $this->_getParam('limit')
        );
        echo Zend_Json::encode($arr);
    }

    /**
     * Adicionar tipo de accidente
     * @return Mensaje informando el resultado de la operación
     * @author Eddy Santana Navarro
     */
    public function addTipoAccidenteAction()
    {
        $obj = new NomTipoaccidenteModel();
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
     * Modificar tipo de accidente
     * @return Mensaje informando el resultado de la operación
     * @author Eddy Santana Navarro
     */
    public function updateTipoAccidenteAction()
    {
        $obj = new NomTipoaccidenteModel();
        $r = $obj->updateTipo(
            $this->_getParam('idtipoaccidente'),
            $this->_getParam('denominacion'),
            $this->_getParam('descripcion'),
            $this->_getParam('fdesde'),
            $this->_getParam('fhasta')
        );
        echo Zend_Json::encode($r);
    }

    /**
     * Eliminar tipo de accidente
     * @return Mensaje informando el resultado de la operación
     * @author Eddy Santana Navarro
     */
    public function deleteTipoAccidenteAction()
    {
        $tipos = json_decode(stripslashes($this->_request->getPost('tipos')));
        $respuesta = true;
        $obj = new NomTipoaccidenteModel();
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