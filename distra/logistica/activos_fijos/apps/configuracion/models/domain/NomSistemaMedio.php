<?php

/**
 *
 */
class NomSistemaMedio extends BaseNomSistemaMedio
{

    /**
     *
     */
    public function setUp()
    {
        parent::setUp();
        $this->hasMany(
            'DatSistemaMedioEntidad', array('local' => 'idnomsistemamedio', 'foreign' => 'idnomsistemamedio')
        );
        $this->hasOne(
            'CfgActividadSistemaMedio', array('local' => 'idnomsistemamedio', 'foreign' => 'idnomsistemamedio')
        );
        $this->hasOne(
            'CfgMedioSistemaMedio', array('local' => 'idnomsistemamedio', 'foreign' => 'idnomsistemamedio')
        );
    }

}
