<?php

class ConfOfertaNegocio extends ConfOfertaNegocioMapper
{

    public function setUp()
    {
        parent::setUp();
    }

    public function getConfig()
    {
        return Doctrine_Query::create()
            ->from('ConfOfertaNegocio')
            ->fetchOne(array(), Doctrine_Core::HYDRATE_ARRAY);
    }

    public function updateConfig($idestadooferta, $idestado, $idespaciotrabajo, $espaciotrabajo,$activo)
    {
        $config = Doctrine::getTable('ConfOfertaNegocio')->find(1);
        if(empty($config)){
            $config = new ConfOfertaNegocio();
            $config->idconfoferta = 1;
        }

        $config->idestadosolicitudofertainsertar = $idestadooferta;
        $config->idestadosolicitudinsertar = $idestado;
        $config->idespaciotrabajo = $idespaciotrabajo;
        $config->espaciotrabajo = $espaciotrabajo;
        $config->activo =$activo=='true'?1:0;

        $config->save();
    }
}
