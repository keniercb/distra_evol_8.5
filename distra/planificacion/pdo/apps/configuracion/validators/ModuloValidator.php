<?php

class ModuloValidator
{
    public $post = array();

    public function ModuloValidator()
    {
        $this->post = $_POST;
    }

    public function validarInsetarOAT()
    {
        return true;
    }
}


