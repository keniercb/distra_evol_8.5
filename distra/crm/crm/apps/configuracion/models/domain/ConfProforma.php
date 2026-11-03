<?php

class ConfProforma extends ConfProformaMapper
{

    public function setUp()
    {
        parent::setUp();
    }

    public function getConfig()
    {
        return Doctrine_Query::create()
            ->from('ConfProforma')
            ->fetchOne(array(), Doctrine_Core::HYDRATE_ARRAY);
    }

    public function updateConfig($idespaciotrabajo, $espaciotrabajo, $activo)
    {
        $config = Doctrine::getTable('ConfProforma')->find(1);
        
        if(empty($config)){
            $config = new ConfProforma();
            $config->idconfproforma = 1;
        }

        $config->idespaciotrabajo = $idespaciotrabajo;
        $config->espaciotrabajo = $espaciotrabajo;
        $config->activo =$activo=='true'?1:0;

        $config->save();
    }
}
