<?php

/**
 *
 */
class DatColorEntidad extends BaseDatColorEntidad
{

    /**
     *
     */
    public function setUp()
    {
        parent::setUp();
        $this->hasMany('NomColor', array('local' => 'idcolor', 'foreign' => 'idcolor'));
    }

}
