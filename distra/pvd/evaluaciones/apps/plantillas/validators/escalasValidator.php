<?php

class escalasValidator {

    public $post;
    public $escala;

    public function escalasValidator() {
        $this->post = $_POST;
        $this->escala = new DatEvalescalaModel( );
    }

    public function existeEscala() {
        $existe = $this->escala->existeEscala($this->post['denom']);
        if ($existe)
            return false;
        return true;
    }

}
?>