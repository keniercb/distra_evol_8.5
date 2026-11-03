<?php

/**
 *
 */
class DatDestinoFinalEntidad extends BaseDatDestinoFinalEntidad
{

    /**
     *
     */
    public function setUp()
    {
        parent::setUp();
        $this->hasMany('NomDestinoFinal', array('local' => 'iddestinofinal', 'foreign' => 'iddestinofinal'));
    }

}
