<?php
/*@utor:Pedro Enrique Rojas
*/
class GestcartatecnologicaValidator
{
    public $post = array();

    public function GestcartatecnologicaValidator()
    {
        $this->post = $_POST;
    }


    public function validarEspecialidadProductoTecnicas()
    {
        //$actividades = json_decode(stripslashes( $this->post['actividades'] ));
        $params['idcartatecnologica'] = $this->post['idcartatecnologica'];
        $params['idespecialidad'] = $this->post['idespecialidad'];
        $params['idindicador'] = $this->post['idindicador'];
        $params['tecnicas'] = json_decode(stripslashes($this->post['tecnicas']));


        return true;
    }
}

?>