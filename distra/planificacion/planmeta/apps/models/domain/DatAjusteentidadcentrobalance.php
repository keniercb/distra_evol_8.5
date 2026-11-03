<?php

class DatAjusteentidadcentrobalance extends BaseDatAjusteentidadcentrobalance
{

    public function setUp()
    {
        parent::setUp();
        $this->hasOne(
            'DatAjusteentidad',
            array('local' => 'idajusteentidad', 'foreign' => 'idajusteentidad')
        );
    }

    public function ListarIndEntDatNom1()
    {
        $query = new Doctrine_Query();
        $result = $query->select(
            'd.idajusteentidad, d.cantidadreservaministro, d.cantidadeconomia'
        )->from('DatAjusteentidadcentrobalance d')->where('idajusteentidad =?', 1)
            ->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();
        return $result;
    }

    public function BuscarId($idajusteentidad)
    {
        $query = new Doctrine_Query();
        $result = $query->select('d.idajusteentidad')
            ->from('DatAjusteentidadcentrobalance d')
            ->where('idajusteentidad =?', $idajusteentidad)
            ->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();
        return $result;
    }

}