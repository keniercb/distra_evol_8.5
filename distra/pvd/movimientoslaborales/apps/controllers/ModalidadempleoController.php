<?php
/**
 * Created by PhpStorm.
 * User: yari
 * Date: 26/01/20
 * Time: 11:45
 */
class ModalidadempleoController extends ZendExt_Controller_Secure
{

    /**
     * Constructor
     */
    function init()
    {
        parent::init();
    }

    function modalidadempleoAction()
    {
        $this->render();
    }

    /**
     * Obtiene el listado de las modalidades
     * @return Arreglo con todos las modalidades
     * @author Yaricel Guerra Velázquez
     */
    function getModalidadesAction()
    {
        $modeloNegocio = new NomModalidadempleoModel();
        $arr = $modeloNegocio->getModalidades(
            $this->_getParam('denominacion'),
            $this->_getParam('start'),
            $this->_getParam('limit')
        );
        echo Zend_Json::encode($arr);
    }

    /**
     * Adicionar las modalidades
     * @return Mensaje informando el resultado de la operación
     * @author Yaricel Guerra Velázquez
     */
    public function addModalidadempleoAction()
    {
        $obj = new NomModalidadempleoModel();
        if (!$obj->existeDenom($this->_getParam('denominacion'))) {
            $obj->addModalidadempleo(
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
     * Modificar las modalidades
     * @return Mensaje informando el resultado de la operación
     * @author Yaricel Guerra Velázquez
     */
    public function updateModalidadempleoAction()
    {
        $obj = new NomModalidadempleoModel();
        $r = $obj->updateModalidadempleo(
            $this->_getParam('idmodalidadempleo'),
            $this->_getParam('denominacion'),
            $this->_getParam('descripcion'),
            $this->_getParam('fdesde'),
            $this->_getParam('fhasta')
        );
        echo Zend_Json::encode($r);
    }

    /**
     * Eliminar las modalidades
     * @return Mensaje informando el resultado de la operación
     * @author Yaricel Guerra Velázquez
     */
    public function deleteModalidadempleoAction()
    {
        $sp = stripslashes($this->_request->getPost('modalidades'));
        $modalidadempleos = json_decode($sp);
        $respuesta = true;
        $obj = new NomModalidadempleoModel();
        foreach ($modalidadempleos as $p) {
            $r = $obj->deleteModalidadempleo($p);
            if ($r == false) {
                $respuesta = false;
            }
        }
        echo json_encode($respuesta);
    }
}