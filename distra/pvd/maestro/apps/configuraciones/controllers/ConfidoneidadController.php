<?php
/**
 * @name ConfidoneidadController
 * @package   maestro.configuracion
 * @copyright XETID.
 * @author    Centro RRHH. División Gestión de Entidades. XETID.
 * @version   1.0
 */
class ConfidoneidadController extends ZendExt_Controller_Secure
{
    function init()
    {
        parent::init();
    }

    function confidoneidadAction()
    {
        $this->view->estructura = $this->integrator->metadatos->obtenerIUEstructura();
        $this->render();
    }
    
    /**
     * Obtiene el listado de las entidades conconfiguradas
     * @return Arreglo con todas las entidades configuradas
     * @author Yaricel Guerra Velazquez
     */
    function getConfigIdoneidadAction()
    {
        $modeloNegocio = new ConfIdoneidadModel();
        $arr = $modeloNegocio->getConfig();
        echo Zend_Json::encode($arr);
    }

    /**
     * Adicionar configuracion
     * @return Mensaje informando el resultado de la operación
     * @author Yaricel Guerra Velazquez
     */
    public function addAction()
    {
        $configuraciones = json_decode(stripslashes($this->_request->getPost('arrayidestructuras')));
        $respuesta = true;
        $obj = new ConfIdoneidadModel();
        foreach ($configuraciones as $p) {
            $r = $obj->add($this->_getParam('tipo'), $p);
            if ($r == false) {
                $respuesta = false;
            }
        }
        echo Zend_Json::encode($respuesta);
    }

    /**
     * Eliminar conf
     * @return Mensaje informando el resultado de la operación
     * @author Yaricel Guerra Velazquez
     */
    public function deleteAction()
    {
        $configuraciones = json_decode(stripslashes($this->_request->getPost('arrayids')));
        $respuesta = true;
        $obj = new ConfIdoneidadModel();
        foreach ($configuraciones as $p) {
            $r = $obj->delete($p);
            if ($r == false) {
                $respuesta = false;
            }
        }
        echo json_encode($respuesta);
    }


}