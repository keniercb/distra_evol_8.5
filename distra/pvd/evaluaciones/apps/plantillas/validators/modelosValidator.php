<?php

class modelosValidator {

    public $post;
    public $modelo;

    function modelosValidator() {
        $this->post = $_POST;
        $this->modelo = new DatEvalmodeloModel( );
        $this->hecho = new DatEvalhechoModel( );
    }

    public function ExisteModelo() {
        $existe = $this->modelo->existeModelo($this->post['denom'], $this->post['idplanilla']);
        if ($existe)
            return false;
        return true;
    }

    public function ModeloEnUso() {
        $uso = $this->modelo->modeloEnUso($this->post['idmodelo']);
        if ($uso)
            return false;
        return true;
    }

    public function ExisteHecho() {
        $idmodelo = $this->post['idmodelo'];
        $idvalorcualitativo = $this->post['idvalorescualitativos'];
        $idexpresionmatematica = $this->post['idexpresionmatematica'];
        $existe = $this->hecho->existeHecho($idmodelo, $idvalorcualitativo, $idexpresionmatematica);
        if ($existe)
            return false;
        return true;
    }

}

?>