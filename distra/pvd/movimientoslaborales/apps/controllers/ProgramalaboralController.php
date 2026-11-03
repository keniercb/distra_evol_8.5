<?php
/**
 * Created by PhpStorm.
 * User: yari
 * Date: 26/05/16
 * Time: 11:45
 */
class ProgramalaboralController extends ZendExt_Controller_Secure
{

    /**
     * Constructor
     */
    function init()
    {
        parent::init();
    }

    function programalaboralAction()
    {
        $this->render();
    }

    /**
     * Obtiene el listado de los programas laborales
     * @return Arreglo con todos los programas laborales
     * @author Yaricel Guerra Velázquez
     */
    function getProgramasLaboralesAction()
    {
        $modeloNegocio = new NomProgramalaboralModel();
        $arr = $modeloNegocio->getProgramas(
            $this->_getParam('denominacion'),
            $this->_getParam('start'),
            $this->_getParam('limit')
        );
        echo Zend_Json::encode($arr);
    }

    /**
     * Adicionar programa laboral
     * @return Mensaje informando el resultado de la operación
     * @author Yaricel Guerra Velázquez
     */
    public function addProgramaLaboralAction()
    {
        $obj = new NomProgramalaboralModel();
        if (!$obj->existeDenom($this->_getParam('denominacion'))) {
            $obj->addPrograma(
                $this->_getParam('denominacion'),
                $this->_getParam('descripcion'),
                $this->_getParam('fdesde'),
                $this->_getParam('fhasta')
            );
            echo Zend_Json::encode(true);
        } else
            echo Zend_Json::encode(false);
    }

    /**
     * Modificar programa laboral
     * @return Mensaje informando el resultado de la operación
     * @author Yaricel Guerra Velázquez
     */
    public function updateProgramaLaboralAction()
    {
        $obj = new NomProgramalaboralModel();
        $r = $obj->updatePrograma(
            $this->_getParam('idprogramalaboral'),
            $this->_getParam('denominacion'),
            $this->_getParam('descripcion'),
            $this->_getParam('fdesde'),
            $this->_getParam('fhasta')
        );
        echo Zend_Json::encode($r);
    }

    /**
     * Eliminar programa laboral
     * @return Mensaje informando el resultado de la operación
     * @author Yaricel Guerra Velázquez
     */
    public function deleteProgramaLaboralAction()
    {
        $sp = stripslashes($this->_request->getPost('programas'));
        $programas = json_decode($sp);
        $respuesta = true;
        $obj = new NomProgramalaboralModel();
        foreach ($programas as $p) {
            $r = $obj->deletePrograma($p);
            if ($r == false) {
                $respuesta = false;
            }
        }
        echo json_encode($respuesta);
    }
}