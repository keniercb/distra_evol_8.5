<?php

/**
 *
 */
class CfgReporte extends BaseCfgReporte
{

    /**
     *
     */
    public function setUp()
    {
        parent:: setUp();
        $this->hasOne('CfgReporteEntidad', array('local' => 'idconfreporteaft', 'foreign' => 'idconfreporteaft'));
    }

}
