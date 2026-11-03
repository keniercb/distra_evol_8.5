<?php
/**
 * @name NomformaaccidenteController
 * @package   accidente.configuracion
 * @copyright XETID.
 * @author    Centro RRHH. División Gestión de Entidades. XETID.
 * @version   1.0
 */
class NomformaaccidenteController extends ZendExt_Controller_Secure
{
    function init()
    {
        parent::init();
    }

    function nomformaaccidenteAction()
    {
        //$this->render();
    }
    
    /**
     * Obtiene el listado de las formas de accidente
     * @return Arreglo con todos las formas de accidente
     * @author Eddy Santana Navarro
     */
    function getFormaAccidenteAction()
    {
        $modeloNegocio = new NomFormaaccidenteModel();
        $arr = $modeloNegocio->getFormas(
            $this->_getParam('denominacion'), $this->_getParam('start'), $this->_getParam('limit')
        );
        echo Zend_Json::encode($arr);
    }

    /**
     * Adicionar forma de accidente
     * @return Mensaje informando el resultado de la operación
     * @author Eddy Santana Navarro
     */
    public function addFormaAccidenteAction()
    {
        $obj = new NomFormaaccidenteModel();
        if (!$obj->existeDenom($this->_getParam('denominacion'))) {
            $obj->addForma(
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
     * Modificar forma de accidente
     * @return Mensaje informando el resultado de la operación
     * @author Eddy Santana Navarro
     */
    public function updateFormaAccidenteAction()
    {
        $obj = new NomFormaaccidenteModel();
        $r = $obj->updateForma(
            $this->_getParam('idformaaccidente'),
            $this->_getParam('denominacion'),
            $this->_getParam('descripcion'),
            $this->_getParam('fdesde'),
            $this->_getParam('fhasta')
        );
        echo Zend_Json::encode($r);
    }

    /**
     * Eliminar forma de accidente
     * @return Mensaje informando el resultado de la operación
     * @author Eddy Santana Navarro
     */
    public function deleteFormaAccidenteAction()
    {
        $formas = json_decode(stripslashes($this->_request->getPost('formas')));
        $respuesta = true;
        $obj = new NomFormaaccidenteModel();
        foreach ($formas as $p) {
            $r = $obj->deleteForma($p);
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