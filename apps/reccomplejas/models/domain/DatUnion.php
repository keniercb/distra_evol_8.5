<?php

class DatUnion extends BaseDatUnion
{

    public function setUp()
    {
        parent :: setUp();
        $this->hasOne('DatMapeo', array('local' => 'idmapeo', 'foreign' => 'idmapeo'));
    }

    public function getUnion($idmapeo)
    {
        $query = Doctrine_Query::CREATE();
        $result = $query->from('DatUnion')
            ->where('idmapeo = ?', $idmapeo)
            ->execute();
        return $result->toArray();
    }

}