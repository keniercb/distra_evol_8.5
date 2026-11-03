<?php
/*@utor:Osvaldo Diaz Verdecia
*/
class GestcolumnasValidator
{
    public $post = array();

    public function GestcolumnasValidator()
    {
        $this->post = $_POST;
    }


    public function validarExistenciaDenominacion()
    {
        $denominacion = $this->post['denominacion'];
        $idcolumna = $this->post['idcolumna'];

        $colslike = NomColumna::getPorDenominacion($denominacion)->getFirst();

        if (!NomColumnaModel::existencia($denominacion, $idcolumna)) {
            return true;
        }
        return false;
    }


}

?>