<?php

/*@utor:Yeliem Gutierrez Martinez
*/

class GestplanesValidator
{
    public $post = array();

    public function GestplanesValidator()
    {
        $this->post = $_POST;
    }

    /**
     * GestplanesValidator constructor.
     * @param array $post
     */
    public function __construct(array $post)
    {
        $this->post = $post;
    }


    /*public function validarExistenciaCodigo()
    {
        $idplan= $this->post['idplanm'];
        $codigo = $this->post['codigoplan'];
        if(DatPlan::validarCodigo($codigo,$idplan)!=null)
              return false;
            else
              return true;
    }*/


}

