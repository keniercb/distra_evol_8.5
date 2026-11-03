<?php

class periodosValidator {

    public $post;
    public $periodo;

    public function PeriodosValidator() {
        $this->post = $_POST;
        $this->periodo = new NomEvalperiodoevaluativoModel();
    }

    public function existePeriodo() {
        $result = $this->periodo->existePeriodo($this->post['periodo'], $this->post['medidatiempo']);
        if (empty($result))
            return true; //Continuo proceso
        return false; //Ejecuta excepcion
    }

    public function PeriodoEnUso() {
        $uso = $this->periodo->PeriodoEnUso($this->post['idperiodo']);
        if ($uso)
            return false;
        return true;
    }

}

?>