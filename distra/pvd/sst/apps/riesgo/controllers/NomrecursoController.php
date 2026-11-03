<?php
/**
 * @name NomrecursoController
 * @package   riesgo.configuracion
 * @copyright XETID.
 * @author    Centro RRHH. División Gestión de Entidades. XETID.
 * @version   1.0
 */
class NomrecursoController extends ZendExt_Controller_Secure
{
    function init()
    {
        parent::init();
    }

    function nomrecursoAction()
    {
        //$this->render();
    }
    
    /**
     * Obtiene el listado de los recursos
     * @return Arreglo con todos de los recursos
     * @author Eddy Santana Navarro
     */
    function getRecursoAction()
    {
        $modeloNegocio = new NomRecursoModel();
        $arr = $modeloNegocio->getRecursos(
            $this->_getParam('denominacion'), $this->_getParam('start'), $this->_getParam('limit')
        );
        echo Zend_Json::encode($arr);
    }

    /**
     * Adicionar recurso
     * @return Mensaje informando el resultado de la operación
     * @author Eddy Santana Navarro
     */
    public function addRecursoAction()
    {
        $obj = new NomRecursoModel();
        if (!$obj->existeDenom($this->_getParam('denominacion'))) {
            $obj->addRecurso(
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
     * Modificar recurso
     * @return Mensaje informando el resultado de la operación
     * @author Eddy Santana Navarro
     */
    public function updateRecursoAction()
    {
        $obj = new NomRecursoModel();
        $r = $obj->updateRecurso(
            $this->_getParam('idrecurso'),
            $this->_getParam('denominacion'),
            $this->_getParam('descripcion'),
            $this->_getParam('fdesde'),
            $this->_getParam('fhasta')
        );
        echo Zend_Json::encode($r);
    }

    /**
     * Eliminar recurso
     * @return Mensaje informando el resultado de la operación
     * @author Eddy Santana Navarro
     */
    public function deleteRecursoAction()
    {
        $recursos = json_decode(stripslashes($this->_request->getPost('recursos')));
        $respuesta = true;
        $obj = new NomRecursoModel();
        foreach ($recursos as $p) {
            $r = $obj->deleteRecurso($p);
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