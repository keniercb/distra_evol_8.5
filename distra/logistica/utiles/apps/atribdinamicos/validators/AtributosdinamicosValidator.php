<?php

/**
 * @class AtributosdinamicosValidator
 */
class AtributosdinamicosValidator extends BaseValidator
{
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Inicializa la modelo.
     */
    public function initModel()
    {
        $this->model = new AtributosdinamicosModel();
    }

    /**
     * Verifica si el atributo dinámico existe.
     * @return boolean
     */
    public function adicionarAtributo()
    {
        $datos = Zend_Json::decode($this->params['data']);
        return !$this->model->existeAtributo($datos);
    }

    /**
     * Verifica si los atributos estan en uso.
     * @return boolean
     */
    public function atributosEnUso()
    {
        $idatributos = Zend_Json::decode($this->params['id'] ? $this->params['id'] : $this->params['idatributos']);
        return !$this->model->atributosEnUso($idatributos);
    }

}
