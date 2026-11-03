<?php

/**
 * @author
 *
 * @version
 * @copyright
 */
class CmpflujotrabajoController extends ZendExt_Controller_Secure
{

    function init()
    {
        parent::init();
    }

    function cmpflujotrabajoAction()
    {
        try {
            $this->view->jsEstados = $this->pIntegrator->workflow->getJSEstado();
            $this->view->jsTransicion = $this->pIntegrator->workflow->getJSTransicion();
        } catch (Exception $e) {
            $this->view->jsEstados = null;
            $this->view->jsTransicion = null;
        }
        $this->render();
    }

}

?>

