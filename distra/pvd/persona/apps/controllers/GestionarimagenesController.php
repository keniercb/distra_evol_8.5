<?php

class GestionarimagenesController extends ZendExt_Controller_Secure
{
    function init()
    {
        parent::init();
    }

    public function gestionarImagenesAction()
    {
    }

    public function getImagenesByPersonaAction()
    {
        $arrDatos = $this->_getAllParams();
        print_r($arrDatos);
        die;
    }
}