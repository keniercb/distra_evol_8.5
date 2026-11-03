<?php

/**
 * Controlador del modulo configuracion general (CRM).
 *
 * @package        ERP-PCRM
 * @subpackage     CRM/application/Controller
 * @author         Ing. Rodain Terrer Molina <rterrer@xetid.cu>
 * @copyright (c)  2015, XETID
 * @version        1.0
 */
class ModulemanageController extends ZendExt_Controller_Secure
{

    function init()
    {
        $this->model = new ModulesModel();
        parent::init();
    }

    /**
     * Funcionalidad que renderiza la vista principal del subsistema CRM
     *
     */
    public function modulemanageAction()
    {
        $this->render();
    }

    /**
     * Funcionalidad que habilita y desabilita los modulos del subsistema CRM
     *
     */
    public function saveAction()
    {
        $post = $this->_request->getPost();
        echo json_encode($this->model->save($post));
    }
    /**
     * Funcionalidad que habilita y desabilita los modulos del subsistema CRM
     *
     */
    public function loadAction()
    {
        echo json_encode($this->model->load());
    }

}
