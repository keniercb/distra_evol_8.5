<?php

class valorescualitativosValidator
{
    private $post;
    private $valores;

    public function valorescualitativosValidator()
    {
        $this->post = $_POST;
        $this->valores = new NomEvalvalorescualitativosModel();
    }

    public function existeValorC()
    {
        $existe = $this->valores->existeValorC($this->post['denom']);
        if ($existe) {
            return false;
        }
        return true;
    }

    public function valorcualitativoenUso()
    {
        $uso = $this->valores->valorEnUso($this->post['idvc']);
        if ($uso) {
            return false;
        }
        return true;
    }
}