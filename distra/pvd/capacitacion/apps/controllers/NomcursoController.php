<?php
/**
 * @name NomcursoController
 * @package   capacitacion.configuracion
 * @copyright XETID.
 * @author    Centro RRHH. División Gestión de Entidades. XETID.
 * @version   1.0
 */
class NomcursoController extends ZendExt_Controller_Secure
{
    function init()
    {
        parent::init();
    }

    function nomcursoAction()
    {
        //$this->render();
    }
    
    /**
     * Obtiene el listado de los cursos
     * @return Arreglo con todas los cursos
     * @author Eddy Santana Navarro
     */
    function getCursosAction()
    {
        $modeloNegocio = new NomCursoModel();
        $arr = $modeloNegocio->getCursos(
            $this->_getParam('denominacion'), $this->_getParam('start'), $this->_getParam('limit')
        );
        echo Zend_Json::encode($arr);
    }

    /**
     * Adicionar curso
     * @return Mensaje informando el resultado de la operación
     * @author Eddy Santana Navarro
     */
    public function addCursoAction()
    {
        $obj = new NomCursoModel();
        if (!$obj->existeDenom($this->_getParam('denominacion'))) {
            $obj->addCurso(
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
     * Modificar curso
     * @return Mensaje informando el resultado de la operación
     * @author Eddy Santana Navarro
     */
    public function updateCursoAction()
    {
        $obj = new NomCursoModel();
        $r = $obj->updateCurso(
            $this->_getParam('idcurso'),
            $this->_getParam('denominacion'),
            $this->_getParam('descripcion'),
            $this->_getParam('fdesde'),
            $this->_getParam('fhasta')
        );
        echo Zend_Json::encode($r);
    }

    /**
     * Eliminar curso
     * @return Mensaje informando el resultado de la operación
     * @author Eddy Santana Navarro
     */
    public function deleteCursoAction()
    {
        $cursos = json_decode(stripslashes($this->_request->getPost('cursos')));
        $respuesta = true;
        $obj = new NomCursoModel();
        foreach ($cursos as $p) {
            $r = $obj->deleteCurso($p);
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