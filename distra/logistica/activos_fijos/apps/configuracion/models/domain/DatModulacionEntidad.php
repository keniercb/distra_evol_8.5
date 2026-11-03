<?php

/**
 *
 */
class DatModulacionEntidad extends BaseDatModulacionEntidad
{

    /**
     *
     */
    public function setUp()
    {
        parent::setUp();
        $this->hasMany('NomModulacion', array('local' => 'idmodulacion', 'foreign' => 'idmodulacion'));
    }

}
