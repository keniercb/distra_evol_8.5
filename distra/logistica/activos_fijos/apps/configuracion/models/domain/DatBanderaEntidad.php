<?php

/**
 *
 */
class DatBanderaEntidad extends BaseDatBanderaEntidad
{

    /**
     *
     */
    public function setUp()
    {
        parent::setUp();
        $this->hasMany('NomBandera', array('local' => 'idbandera', 'foreign' => 'idbandera'));
    }

}
