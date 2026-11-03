<?php

/**
 *
 */
class CfgEstadosReportes extends BaseCfgEstadosReportes
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
        return $query->from('CfgEstadosReportes r')->fetchArray();
    }

}
