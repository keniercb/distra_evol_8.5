<?php

/**
 *
 */
class CfgEstadosReportesPatr extends BaseCfgEstadosReportesPatr
{

    /**
     *
     */
    public function setUp()
    {
        parent:: setUp();
    }

    /**
     *
     */
    public function getConfig()
    {
        $query = new Doctrine_Query();
        return $query->from('CfgEstadosReportesPatr r')->fetchArray();
    }

}
