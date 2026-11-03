<?php
/**
 * Created by PhpStorm.
 * User: yari
 * Date: 28/02/19
 * Time: 17:25
 */
class GestionargradoController extends ZendExt_Controller_Secure
{
    public function init()
    {
        parent::init();
    }

    function gestionargradoAction()
    {
        $this->render();
    }

    /**
     * Obtiene el listado de las configuraciones
     *
     * @return Arreglo con las configuraciones
     * @author Yaricel Guerra Velazquez
     */
    function getGradoAction()
    {
        $start = $this->_getParam('start');
        $limit = $this->_getParam('limit');
        $datos = ConfGradopeligrosidadModel::getGrado($limit, $start);
        echo Zend_Json::encode($datos);
    }

    /**
     * Adiciona configuracion
     * @return Variable entera informando el resultado de la operaci�n
     * @author Yaricel Guerra Velazquez
     */
    function addGradoAction()
    {
        $modeloNegocio = new ConfGradopeligrosidadModel();
        $arr = $modeloNegocio->addGrado(
            $this->_getParam('idexpresionmatematica')
        );
        echo Zend_Json::encode($arr);
    }
}