<?php

class ControldivisaValidator
{
    public $post = array();

    public function ControldivisaValidator()
    {
        $this->post = $_POST;
    }

    public function validarUso()
    {
        $arrayIdtiposnomenclador = json_decode(
            stripslashes($this->post['todelete'])
        );
        $result = NomControldivisa::VerificarUso($arrayIdtiposnomenclador);
        return $result;
    }

}


