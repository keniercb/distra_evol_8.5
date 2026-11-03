<?php
/*@utor:Pedro Enrique Rojas
*/
class BpdesgloseValidator
{
    public $post = array();

    public function BpdesgloseValidator()
    {
        $this->post = $_POST;
    }

    public function validarUsoDeTodosNomencladores()
    {
        $array_idtiposnomenclador = json_decode(stripslashes($this->post['tiponomencladores_orden']));
        return DatDesglosetiponomenclador::validarOcurrenciaDeTodosNomencladores($array_idtiposnomenclador);
    }

}

?>