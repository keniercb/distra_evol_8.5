<?php

class FirmaDigitalService extends ZendExt_Model
{

    private $model;

    public function __construct()
    {
        parent::ZendExt_Model();
        $this->model = FirmaDigitalModel::getInstance();
    }

    public function mostrarCaso($caseId)
    {
        return $this->model->mostrarCaso($caseId);
    }

    public function firmaDigital($nombreTema,$proceso,$docs)
    {
        return $this->model->FirmaDigital($nombreTema,$proceso,$docs);

    }

    public function listarDocumentosPorCaso($caseId)
    {
        return $this->model->listarDocumentosPorCaso($caseId);
    }

}
