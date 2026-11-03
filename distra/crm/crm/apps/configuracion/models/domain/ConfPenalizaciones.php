<?php

class ConfPenalizaciones extends ConfPenalizacionesMapper
{

    public function setUp()
    {
        parent::setUp();
    }

    public function getConfig()
    {
        return Doctrine_Query::create()
            ->from('ConfPenalizaciones')
            ->fetchOne(array(), Doctrine_Core::HYDRATE_ARRAY);
    }

    public function updateConfig($idespaciotrabajo, $espaciotrabajo, $activo)
    {
        $config = Doctrine::getTable('ConfPenalizaciones')->find(1);

        if(empty($config)){
            $config = new ConfPenalizaciones();
            $config->idconfpenalizacion = 1;
        }

        $config->idespaciotrabajo = $idespaciotrabajo;
        $config->espaciotrabajo = $espaciotrabajo;
        $config->activo =$activo=='true'?1:0;

        try{
            $config->save();
        } catch (Exception $e){
            print_r($e->getMessage());die;
        }

    }
}
