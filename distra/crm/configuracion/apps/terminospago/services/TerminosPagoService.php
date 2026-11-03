<?php

class TerminosPagoService extends ZendExt_Model
{

    public function __construct()
    {
        parent::ZendExt_Model();
    }

    public function obtenerCondicionesPago($params)
    {
        $idestructura = $this->global->Estructura->idestructura;
        $idestructura = $params['idestructura'] ? $params['idestructura'] : $idestructura;
        $params['enuso'] = isset($params['enuso'])?$params['enuso']:true;
        $result = DatTerminopago::GetCondiciones($params, $idestructura);
        return $result;
    }

    public function obtenerCondicionPago($idcondicion)
    {
        $result = DatTerminopago::GetTerminoPagoPorId($idcondicion);
        return $result;
    }
}
