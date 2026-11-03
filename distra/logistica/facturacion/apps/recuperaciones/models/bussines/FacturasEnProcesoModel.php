<?php

class FacturasEnProcesoModel extends ZendExt_Model
{

    private $service;

    public function __construct()
    {
        parent::__construct();
        $this->service = new FacturacionService();
    }

    public function cargarFacturasenproceso($params)
    {
        return $this->service->getDocumentos($params);
    }

    public function getSubsistemas()
    {
        return $this->service->getSubsistemas();
    }

}