<?php

class DatAreainventario extends BaseDatAreainventario
{
    public function setUp()
    {
        parent::setUp();
        $this->hasOne('DatArea', array('local' => 'idarea', 'foreign' => 'idarea'));
        $this->hasOne('NomTipoarea', array('local' => 'idnomtipoarea', 'foreign' => 'idnomtipoarea'));
    }

    public function verificarArea($idarea)
    {
        $query = Doctrine_Query::create()
            ->select('da.ubicacionarea as ubicacionarea')
            ->from('DatAreainventario da')
            ->where('da.idarea = ?', $idarea);
        return $query->fetchArray();
    }

}




