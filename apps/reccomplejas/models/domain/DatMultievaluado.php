<?php

class DatMultievaluado extends BaseDatMultievaluado
{

    public function setUp()
    {
        parent :: setUp();
        $this->hasOne('DatCampo', array('local' => 'idcampo', 'foreign' => 'idcampo'));
    }

    public function getValores($idcampo)
    {
        $query = new Doctrine_Query ();
        $result = $query->select('idcampo, valor, denominacion')
            ->from('DatMultievaluado')
            ->where('idcampo = ?', $idcampo)
            ->orderBy('valor ASC')
            ->execute();
        return $result->toArray();
    }

}