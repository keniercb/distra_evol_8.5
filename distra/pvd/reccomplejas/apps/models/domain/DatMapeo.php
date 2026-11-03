<?php

class DatMapeo extends BaseDatMapeo
{

    public function setUp()
    {
        parent :: setUp();
        $this->hasOne('DatCampo', array('local' => 'idcampo', 'foreign' => 'idcampo'));
        $this->hasMany('DatUnion', array('local' => 'idmapeo', 'foreign' => 'idmapeo'));
    }

    public function getMapeo($idcampo)
    {
        $query = Doctrine_Query::CREATE();
        $result = $query->from('DatMapeo')
            ->where('idcampo = ?', $idcampo)
            ->orderBy('idmapeo')
            ->execute();
        return $result->toArray();
    }

}