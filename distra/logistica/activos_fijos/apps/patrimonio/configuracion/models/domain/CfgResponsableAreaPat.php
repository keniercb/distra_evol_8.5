<?php

/**
 *
 */
class CfgResponsableAreaPat extends BaseCfgResponsableAreaPat
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
