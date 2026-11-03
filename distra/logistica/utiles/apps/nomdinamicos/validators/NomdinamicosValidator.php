<?php

/**
 * @class      NomdinamicosValidator
 * @author Osleidy Quiala
 */
class NomdinamicosValidator extends BaseValidator
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
        $this->model = new NomdinamicosModel();
    }
    
    /**
     * Verifica si existe el nomenclador dinamico.
     * @return boolean
     */
    public function adicionarNomDinamico()
    {
        $datos = Zend_Json::decode($this->params['data']);
        return !$this->model->existeNomenclador($datos);
    }
    
    /**
     * Verifica si el nomenclador dinamico esta en uso.
     * @return boolean
     */
    public function eliminarNomDinamicos()
    {
        $idnomecladores = Zend_Json::decode($this->params['id']);
        return !$this->model->nomencladoresEnUso($idnomecladores);
    }

}
