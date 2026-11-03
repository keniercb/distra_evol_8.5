<?php

/**
 *
 */
class DatCasaClasificadoraEntidad extends BaseDatCasaClasificadoraEntidad
{

    /**
     *
     */
    public function setUp()
    {
        parent::setUp();
        $this->hasMany('NomCasaClasificadora', array('local' => 'idcasaclasifc', 'foreign' => 'idcasaclasifc'));
    }

}
