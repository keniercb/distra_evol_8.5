<?php

class Datconfigubicacion extends BaseDatconfigubicacion
{
    public function setUp()
    {
        parent::setUp();
    }

    public function cargarDatos($estructura = null)
    {
        $datosCfg = Doctrine_Query::create()
            ->select(
                'da.capacidad AS capacidad, da.producto AS producto, da.operaciones AS operaciones, '
                . 'da.estructura AS estructura, da.volumen AS volumen, da.peso AS peso, '
                . 'da.estrategiasalida AS estrategiasalida'
            )
            ->from('Datconfigubicacion da')
            ->where("da.idconfigubicacion = ?", array($estructura))
            ->fetchArray();
        return $datosCfg[0] ? $datosCfg[0] : array();
    }

    public function existeConfiguracion($idestructuracomun)
    {
        $res = Doctrine::getTable('Datconfigubicacion')->find($idestructuracomun);
        if ($res->idconfigubicacion) {
            return true;
        } else {
            return false;
        }
    }

}



