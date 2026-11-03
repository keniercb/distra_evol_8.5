<?php

/**
 *
 */
class DatEstatustecnicoEntidad extends BaseDatEstatustecnicoEntidad
{

    /**
     *
     */
    public function setUp()
    {
        parent::setUp();
        $this->hasMany('NomEstatustecnico', array('local' => 'idestatustecnico', 'foreign' => 'idestatustecnico'));
    }

}
