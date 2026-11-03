<?php

class ConfReclamaciones extends ConfReclamacionesMapper
{

    public function setUp()
    {
        parent::setUp();
    }

    public function getConfig()
    {
        return Doctrine_Query::create()
            ->from('ConfReclamaciones')
            ->fetchOne(array(), Doctrine_Core::HYDRATE_ARRAY);
    }

    public function updateConfig($idespaciotrabajo, $espaciotrabajo, $activo, $reclamacionlista)
    {
        $config = Doctrine::getTable('ConfReclamaciones')->find(1);

      //  print_r('dasdasdas');die;
        
        if(empty($config)){
            $config = new ConfReclamaciones();
            $config->idconfreclamacion = 1;
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
