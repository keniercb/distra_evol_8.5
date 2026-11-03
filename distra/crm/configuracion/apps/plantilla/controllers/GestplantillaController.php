<?php

/**
 * @package       Configuracion
 * @category      Controller
 * @author        Ing. Alberto Mesa Martínez <amartinez@xetid.cu>
 * @copyright (c) 2014, XETID
 */
class GestplantillaController extends ZendExt_Controller_Secure
{
    private $_model;

    function init()
    {
        $this->_model = new PlantillaModel();
        parent::init();
    }

    /**
     * Gestionar plantillas
     *
     */
    public function gestplantillaAction()
    {
        $this->render();
    }

    public function listarPlantillasAction(){
        $result = $this->_model->listarPlantillas($this->_request->getPost());
        echo json_encode($result);
    }



}
