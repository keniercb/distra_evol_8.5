<?php

/*@utor:Osvaldo Diaz Verdecia
*/

class GesttipomodeloValidator
{
    public $post = array();

    public function GesttipomodeloValidator()
    {
        $this->post = $_POST;
    }


    public function validarExistenciaCodigo()
    {
        $idtipomodelo = $this->post['idtipomodelo'];
        $codigo = $this->post['codigo'];
        if (NomTipomodelo::validarCodigo($codigo, $idtipomodelo) != null) {
            return false;
        } else {
            return true;
        }
    }


}

