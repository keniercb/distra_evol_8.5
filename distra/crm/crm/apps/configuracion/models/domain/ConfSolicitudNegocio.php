<?php

class ConfSolicitudNegocio extends ConfSolicitudNegocioMapper
{

    public function setUp()
    {
        parent::setUp();
    }

    public function getConfig()
    {
        return Doctrine_Query::create()
            ->from('ConfSolicitudNegocio')
            ->fetchOne(array(), Doctrine_Core::HYDRATE_ARRAY);
    }

    public function updateConfig($idespaciotrabajo, $espaciotrabajo, $activo, $solicituddemandalista, $repositorioclientes)
    {
        $config = Doctrine::getTable('ConfSolicitudNegocio')->find(1);
        
        if(empty($config)){
            $config = new ConfSolicitudNegocio();
            $config->idconfsolicitud = 1;
        }

        $config->idespaciotrabajo = $idespaciotrabajo;
        $config->espaciotrabajo = $espaciotrabajo;
        $config->activo =$activo=='true'?1:0;
        $config->solicituddemandalista = $solicituddemandalista==''?null:$solicituddemandalista;
        $config->repositorioclientes = $repositorioclientes=='true'?1:0;

        $config->save();
    }
}
