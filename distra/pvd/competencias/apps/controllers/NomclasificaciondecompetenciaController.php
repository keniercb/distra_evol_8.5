<?php
/**
 * @name NomclasificaciondecompetenciaController
 * @package   competencia.configuracion
 * @copyright XETID.
 * @author    Centro RRHH. División Gestión de Entidades. XETID.
 * @version   1.0
 */
class NomclasificaciondecompetenciaController extends ZendExt_Controller_Secure
{
    function init()
    {
        parent::init();
    }

    function nomclasificaciondecompetenciaAction()
    {
        //$this->render();
    }
    
    /**
     * Obtiene el listado de las clasificaciones de competencia
     * @return Arreglo con todas las clasificaciones de competencia
     * @author Eddy Santana Navarro
     */
    function getClasificacionesDeCompetenciaAction()
    {
        $modeloNegocio = new NomClasificaciondecompetenciaModel();
        $arr = $modeloNegocio->getClasificaciones(
            $this->_getParam('denominacion'), $this->_getParam('start'), $this->_getParam('limit')
        );
        echo Zend_Json::encode($arr);
    }

    /**
     * Adicionar clasificacion de competencia
     * @return Mensaje informando el resultado de la operación
     * @author Eddy Santana Navarro
     */
    public function addClasificacionDeCompetenciaAction()
    {
        $obj = new NomClasificaciondecompetenciaModel();
        if (!$obj->existeDenom($this->_getParam('denominacion'))) {
            $obj->addClasificacion(
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
     * Modificar clasificacion de competencia
     * @return Mensaje informando el resultado de la operación
     * @author Eddy Santana Navarro
     */
    public function updateClasificacionDeCompetenciaAction()
    {
        $obj = new NomClasificaciondecompetenciaModel();
        $r = $obj->updateClasificacion(
            $this->_getParam('idclasifcompetencia'),
            $this->_getParam('denominacion'),
            $this->_getParam('descripcion'),
            $this->_getParam('fdesde'),
            $this->_getParam('fhasta')
        );
        echo Zend_Json::encode($r);
    }

    /**
     * Eliminar clasificacion de competencia
     * @return Mensaje informando el resultado de la operación
     * @author Eddy Santana Navarro
     */
    public function deleteClasificacionDeCompetenciaAction()
    {
        $clasificaciones = json_decode(stripslashes($this->_request->getPost('clasificaciones')));
        $respuesta = true;
        $obj = new NomClasificaciondecompetenciaModel();
        foreach ($clasificaciones as $p) {
            $r = $obj->deleteClasificacion($p);
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