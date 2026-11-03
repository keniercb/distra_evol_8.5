<?php

class DatTipoareaEntidad extends BaseDatTipoareaentidad
{

    public function setUp()
    {
        parent::setUp();
        $this->hasOne(
            'NomTipoarea', array('local' => 'idnomtipoarea', 'foreign' => 'idnomtipoarea')
        );
        $this->hasMany(
            'NomTipoareaoperaciones', array('local'   => 'idtipoareaentidad',
                                            'foreign' => 'idnomtipoareaentidad')
        );
        $this->hasMany(
            'NomTipoareatipoproducto', array('local'   => 'idtipoareaentidad',
                                             'foreign' => 'idtipoareaentidad')
        );
    }

}


