<?php

/*@utor:Osvaldo Diaz Verdecia
*/

class GestindicadoresValidator
{
    public $post = array();

    public function GestindicadoresValidator()
    {
        $this->post = $_POST;
    }


    public function validarExistenciaCodigo()
    {
        $idindicador = $this->post['idindicador'];
        $codigo = $this->post['codigo'];
        $padre = $this->post['padre'];
        $codigoreal = $padre . $codigo;
        if (NomIndicador::validarCodigo($codigoreal, $idindicador) != null) {
            return false;
        } else {
            return true;
        }
    }


}

