<?php

class ConfRangoedades extends BaseConfRangoedades
{
    public function setUp()
    {
        parent:: setUp();
    }

    public function getById($idrangoedades)
    {
        return Doctrine::getTable('ConfRangoedades')->find($idrangoedades);
    }

    public function getRangos($idestructura, $edad)
    {
        $query = new Doctrine_Query();
        $result = $query ->from('ConfRangoedades r')
            ->where("r.idestructura = $idestructura")
            ->orderBy('r.orden ASC');
        if (isset($edad)) {
            $query->addWhere("'$edad' >= r.valorinicial AND '$edad' <= r.valorfinal");
        }
        return $result->fetchArray();
    }


}