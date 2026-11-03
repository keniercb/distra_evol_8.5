<?php

class NomTipoarea extends BaseNomTipoarea
{
    public function setUp()
    {
        parent::setUp();

        $this->hasOne('NomCampostipoarea',array('local' => 'idnomtipoarea', 'foreign' => 'idnomtipoarea'));
        $this->hasMany('DatAreainventario',array('local' => 'idnomtipoarea', 'foreign' => 'idnomtipoarea'));
        $this->hasMany('DatTipoareaEntidad',array('local' => 'idnomtipoarea', 'foreign' => 'idnomtipoarea'));
        $this->hasMany('DatArea',array('local' => 'idnomtipoarea', 'foreign' => 'idtipoarea'));
        $this->hasMany('NomTipotransferenciaarea',array('local' => 'idnomtipoarea', 'foreign' => 'idnomtipoarea'));
    }

}


