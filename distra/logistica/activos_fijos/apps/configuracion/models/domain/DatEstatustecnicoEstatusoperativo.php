<?php

/**
 *
 */
class DatEstatustecnicoEstatusoperativo extends BaseDatEstatustecnicoEstatusoperativo
{

    /**
     *
     */
    public function setUp()
    {
        parent::setUp();
        $this->hasOne('NomEstatustecnico', array('local' => 'idestatustecnico', 'foreign' => 'idestatustecnico'));
        $this->hasOne('NomEstatusoperativo', array('local' => 'idestatusoperativo', 'foreign' => 'idestatusoperativo'));
    }

}
