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
        $array_idtiposnomenclador = json_decode(stripslashes($this->post['todelete']));
        print_r($array_idtiposnomenclador);
        die;
        $result = NomControldivisa::VerificarUso($array_idtiposnomenclador);
        return $result;
    }

}

?>
