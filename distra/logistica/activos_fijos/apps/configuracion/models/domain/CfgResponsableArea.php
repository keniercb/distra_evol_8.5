<?php

/**
 *
 */
class CfgResponsableArea extends BaseCfgResponsableArea
{

    /**
     *
     */
    public function setUp()
    {
        parent:: setUp();
        $this->hasOne('DatResponsable', array('local' => 'idresponsable', 'foreign' => 'idresponsable'));
    }

}
