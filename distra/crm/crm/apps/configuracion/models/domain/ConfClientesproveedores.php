<?php

class ConfClientesproveedores extends ConfClientesproveedoresMapper
{

    public function setUp()
    {
        parent::setUp();
    }

    public function
    getConfig()
    {
        return Doctrine_Query::create()
            ->from('ConfClientesproveedores')
            ->fetchOne(array(), Doctrine_Core::HYDRATE_ARRAY);
    }

    public function updateConfig($data)
    {
        $config = Doctrine::getTable('ConfClientesproveedores')->find(1);
        
        if(empty($config)){
            $config = new ConfClientesproveedores();
            $config->idconfclientesproveedores = 1;
        }
        $config->activo = $data['activo']=='true'?1:0;
        if($data['config'])
            $config->config = json_encode($data['config']);

        $config->save();
    }
}
