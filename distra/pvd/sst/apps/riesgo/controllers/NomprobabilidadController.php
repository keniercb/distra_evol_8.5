<?php
/**
 * @name NomprobabilidadController
 * @package   riesgo.configuracion
 * @copyright XETID.
 * @author    Centro RRHH. División Gestión de Entidades. XETID.
 * @version   1.0
 */
class NomprobabilidadController extends ZendExt_Controller_Secure
{
    function init()
    {
        parent::init();
    }

    function nomprobabilidadAction()
    {
        //$this->render();
    }
    
    /**
     * Obtiene el listado de las probabilidades
     * @return Arreglo con todas de las probabilidades
     * @author Eddy Santana Navarro
     */
    function getProbabilidadAction()
    {
        $modeloNegocio = new NomProbabilidadModel();
        $arr = $modeloNegocio->getProbabilidades(
            $this->_getParam('denominacion'), $this->_getParam('start'), $this->_getParam('limit')
        );
        echo Zend_Json::encode($arr);
    }

    /**
     * Adicionar probabilidad
     * @return Mensaje informando el resultado de la operación
     * @author Eddy Santana Navarro
     */
    public function addProbabilidadAction()
    {
        $obj = new NomProbabilidadModel();
        if (!$obj->existeDenom($this->_getParam('denominacion'))) {
            $obj->addProbabilidad(
                $this->_getParam('denominacion'),
                $this->_getParam('descripcion'),
                $this->_getParam('fdesde'),
                $this->_getParam('fhasta'),
                $this->_getParam('valor')
            );
            $this->_enviarNotificacionCorrecta();
        } else {
            echo Zend_Json::encode(false);
        }            
    }

    /**
     * Modificar probabilidad
     * @return Mensaje informando el resultado de la operación
     * @author Eddy Santana Navarro
     */
    public function updateProbabilidadAction()
    {
        $obj = new NomProbabilidadModel();
        $r = $obj->updateProbabilidad(
            $this->_getParam('idprobabilidad'),
            $this->_getParam('denominacion'),
            $this->_getParam('descripcion'),
            $this->_getParam('fdesde'),
            $this->_getParam('fhasta'),
            $this->_getParam('valor')
        );
        echo Zend_Json::encode($r);
    }

    /**
     * Eliminar probabilidad
     * @return Mensaje informando el resultado de la operación
     * @author Eddy Santana Navarro
     */
    public function deleteProbabilidadAction()
    {
        $probabilidades = json_decode(stripslashes($this->_request->getPost('probabilidades')));
        $respuesta = true;
        $obj = new NomProbabilidadModel();
        foreach ($probabilidades as $p) {
            $r = $obj->deleteProbabilidad($p);
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