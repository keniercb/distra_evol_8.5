<?php
/**
 * @name NomclasificacionequipoController
 * @package   riesgo.configuracion
 * @copyright XETID.
 * @author    Centro RRHH. División Gestión de Entidades. XETID.
 * @version   1.0
 */
class NomclasificacionequipoController extends ZendExt_Controller_Secure
{
    function init()
    {
        parent::init();
    }

    function nomclasificacionequipoAction()
    {
        $this->render();
    }
    
    /**
     * Obtiene el listado de las clasificaciones de equipos
     * @return Arreglo con todas las clasificaciones
     * @author Yaricel Guerra Velazquez
     */
    function getClasificacionAction()
    {
        $modeloNegocio = new NomClasifequipoModel();
        $arr = $modeloNegocio->getClasificaciones(
            $this->_getParam('denominacion'), $this->_getParam('start'), $this->_getParam('limit')
        );
        echo Zend_Json::encode($arr);
    }

    /**
     * Adicionar clasificacion
     *
     * @return Mensaje informando el resultado de la operación
     * @author Yaricel Guerra Velazquez
     */
    public function addClasificacionAction()
    {
        $obj = new NomClasifequipoModel();
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
     * Modificar clasificacion
     *
     * @return Mensaje informando el resultado de la operación
     * @author Yaricel Guerra Velazquez
     */
    public function updateClasificacionAction()
    {
        $obj = new NomClasifequipoModel();
        $r = $obj->update(
            $this->_getParam('idclasifequipo'),
            $this->_getParam('denominacion'),
            $this->_getParam('descripcion'),
            $this->_getParam('fdesde'),
            $this->_getParam('fhasta')
        );
        echo Zend_Json::encode($r);
    }

    /**
     * Eliminar clasificacion
     *
     * @return Mensaje informando el resultado de la operación
     * @author Yaricel Guerra Velazquez
     */
    public function deleteClasificacionAction()
    {
        $clasif = json_decode(stripslashes($this->_request->getPost('clasificaciones')));
        $respuesta = true;
        $obj = new NomClasifequipoModel();
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