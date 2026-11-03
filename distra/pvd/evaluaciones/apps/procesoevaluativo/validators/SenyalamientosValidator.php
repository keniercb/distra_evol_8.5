<?php

class SenyalamientosValidator {

    public $post;
    public $senyalamiento;
    public $tiposenyalamiento;

    public function SenyalamientosValidator() {
        $this->post = $_POST;
        $this->senyalamiento = new NomEvalsenyalamientoModel();
        $this->tiposenyalamiento = new NomEvaltiposenyalamientoModel();
    }

    public function ExisteSenyalamiento() {
        $result = $this->senyalamiento->existeDenominacion($this->post['idtiposenyalamiento'], $this->post['denom']);
        if ($result)
            return false;
        return true;
    }

    public function ExisteTipoSenyalamiento() {
        //print_r($this->post['denominacion']);die;
        $result = $this->tiposenyalamiento->existeDenominacion($this->post['denominacion']);
        if ($result)
            return false;
        return true;
    }

    public function SenyalamientoEnUso() {
        $uso = $this->senyalamiento->SenyalamientoEnUso($this->post['idsenyalamiento']);
        if ($uso)
            return false;
        return true;
    }

    public function TipoSenyalamientoEnUso() {
        $uso = $this->tiposenyalamiento->TipoSenyaEnUso($this->post['idtiposenyalamiento']);
        if ($uso)
            return false;
        return true;
    }

}

?>