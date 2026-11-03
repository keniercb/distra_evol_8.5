<?php

/* @utor:Pedro Enrique Rojas
 */
class GestnomencladoresValidator
{

    public $post = array();

    public function GestnomencladoresValidator()
    {
        $this->post = $_POST;
    }

    public function validarAdModifNom()
    {
        $denominacion = $this->post['denominacion'];
        $node = $this->post['aformnode'];
        $id = ($this->post['id']) ? $this->post['id'] : -1;
        if (NomNomencladoresModel::validarDenominacion(
            $node, $denominacion, $id
        )
        ) {
            return false;
        }
        return true;
    }

}


