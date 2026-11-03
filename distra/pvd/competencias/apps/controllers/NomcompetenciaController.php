<?php
/**
 * @name NomcompetenciaController
 * @package   competencia.configuracion
 * @copyright XETID.
 * @author    Centro RRHH. División Gestión de Entidades. XETID.
 * @version   1.0
 */
class NomcompetenciaController extends ZendExt_Controller_Secure
{
    function init()
    {
        parent::init();
    }

    function nomcompetenciaAction()
    {
        //$this->render();
    }
    
    /**
     * Obtiene el listado de las competencias
     * @return Arreglo con todas las competencias
     * @author Eddy Santana Navarro
     */
    function getCompetenciasAction()
    {
        $modeloNegocio = new NomCompetenciaModel();
        $arr = $modeloNegocio->getCompetencias(
            $this->_getParam('denominacion'), $this->_getParam('start'), $this->_getParam('limit')
        );
        echo Zend_Json::encode($arr);
    }

    /**
     * Adicionar competencia
     * @return Mensaje informando el resultado de la operación
     * @author Eddy Santana Navarro
     */
    public function addCompetenciaAction()
    {
        $obj = new NomCompetenciaModel();
        if (!$obj->existeDenom($this->_getParam('denominacion'))) {
            $obj->addCompetencia(
                $this->_getParam('denominacion'),
                $this->_getParam('descripcion'),
                $this->_getParam('fdesde'),
                $this->_getParam('fhasta'),
                $this->_getParam('idescala')
            );
            $this->_enviarNotificacionCorrecta();
        } else {
            echo Zend_Json::encode(false);
        }            
    }

    /**
     * Modificar competencia
     * @return Mensaje informando el resultado de la operación
     * @author Eddy Santana Navarro
     */
    public function updateCompetenciaAction()
    {
        $obj = new NomCompetenciaModel();
        $r = $obj->updateCompetencia(
            $this->_getParam('idcompetencia'),
            $this->_getParam('denominacion'),
            $this->_getParam('descripcion'),
            $this->_getParam('fdesde'),
            $this->_getParam('fhasta'),
            $this->_getParam('idescala')
        );
        echo Zend_Json::encode($r);
    }

    /**
     * Eliminar competencia
     * @return Mensaje informando el resultado de la operación
     * @author Eddy Santana Navarro
     */
    public function deleteCompetenciaAction()
    {
        $competencias = json_decode(stripslashes($this->_request->getPost('competencias')));
        $respuesta = true;
        $obj = new NomCompetenciaModel();
        foreach ($competencias as $p) {
            $r = $obj->deleteCompetencia($p);
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

    function mostrarEscalaAction()
    {
        $escalas = ZendExt_IoC_Inter::getInstance()->maestro->obtenerEscalas();
        echo Zend_Json::encode($escalas);
    }

}