<?php

/**
 *
 */
class CfgMedioSistemaMedio extends BaseCfgMedioSistemaMedio
{

    /**
     *
     */
    public function setUp()
    {
        parent::setUp();
        $this->hasMany('NomIndicador', array('local' => 'idindicador', 'foreign' => 'idindicador'));
        $this->hasMany('NomSistemaMedio', array('local' => 'idnomsistemamedio', 'foreign' => 'idnomsistemamedio'));
    }

}
