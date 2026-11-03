<?php

/**
 * @class AtributosdinamicosValidator
 */
class AgrupacionesValidator extends BaseValidator
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
        $this->model = new AgrupacionesModel();
    }

    /**
     * Verifica si la agrupacion existe.
     * @return boolean
     */
    public function adicionarAgrupacion()
    {
        $datos = Zend_Json::decode($this->params['data']);
        return !$this->model->existeAgrupacion($datos);
    }

}
