<?php

class DatCausasreporteausenciaModel extends ZendExt_Model
{
    protected $DatCausasreporteausencia;

    function __construct()
    {
        $this->DatCausasreporteausencia = new DatCausasreporteausencia();
    }

    public function setUp()
    {
        parent::ZendExt_Model();
        $this->DatCausasreporteausencia = new DatCausasreporteausencia();
    }

    public function getCausasReporteAusencia()
    {
        $causasReporteAusencia = new DatCausasreporteausencia();
        return $causasReporteAusencia->getCausasReporteAusencia();
    }


}

