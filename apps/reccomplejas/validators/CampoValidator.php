<?php

class CampoValidator
{

    private $post;

    function CampoValidator()
    {
        $this->post = $_POST;
    }

    /**
     * Verifica si existe el valor del campo alias dado  el idconfiguracion.
     *
     * @param type $idconfiguracion
     * @param type $alias
     *
     * @return bool
     */
    public function verificarCampo()
    {
        $idconfiguracion = $this->post['idconfiguracion'];
        $p = Json_decode(stripslashes($this->post['sourceMostrar']));
        $idcampo = $this->post['idcampo'];
        $a = new DatCampoModel();
        $existe = $a->verificarCampo($idconfiguracion, $p->alias, $idcampo);
        return $existe;
    }

}