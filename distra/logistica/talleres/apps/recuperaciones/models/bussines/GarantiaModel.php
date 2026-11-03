<?php

class GarantiaModel extends ZendExt_Model
{
    private $_ordenTrabajoService;

    public function __construct()
    {
        parent::__construct();
        $this->_ordenTrabajoService = new OrdenTrabajoTalleresService();
        $this->activoservice = new RegNumActivoService();
    }

    public function devolverOrdenesGarantia($params)
    {
        $params['garantia'] = 1;
        $dql = $this->_ordenTrabajoService->devolverOrdenesTrabajo($params, true);
        $result = $dql->fetchArray();

        foreach ($result as $index => $row) {
            $data = $this->activoservice->getObtenerDatRegNumAFT(array($row['idproducto']))[0]['DatRegnumericoActivo'];
            $tiempo = $this->calcularVigencia($data['fechainicialgarantia'], $data['fechafingarantia']);
            $result[$index]['vigenciagarantia'] = $tiempo;
            $result[$index]['iniciogarantia'] = $data['fechainicialgarantia'];
            $result[$index]['fingarantia'] = $data['fechafingarantia'];
        }
        return array('cantidad' => count($result), 'datos' => $result);
    }

    public function calcularVigencia($finicio, $ffin)
    {
        $actual = Date('Y-m-d');
        $tinicio = str_replace('/', '-', $finicio);
        $inicio = (new DateTime($tinicio))->format('Y-m-d');
        $tfin = str_replace('/', '-', $ffin);
        $fin = (new DateTime($tfin))->format('Y-m-d');
        $dias = (strtotime($inicio) - strtotime($fin)) / 86400;
        $dias = abs($dias);
        $dias = floor($dias);
        if ($dias > 0) {
            if ($fin < $actual) {
                $dias = '<span style="color:#bf0200">' . $dias . ' d&iacute;as</span>';
            } else {
                $dias = $dias . ' d&iacute;as';
            }
        } else {
            $dias = null;
        }

        return $dias;
    }

}