<?php

class NomTipoDestinatario extends BaseNomTipoDestinatario
{

    public function setUp()
    {
        parent::setUp();
        $this->HasMany(
            'DatDestinatario',
            array('local' => 'idtipodest', 'foreign' => 'idtipodest')
        );
    }

    public static function cargarTipoDestinatario()
    {
        $query = Doctrine_Query::create();
        $denominacion = 'Grupo';
        $result = $query->select('idtipodest')
            ->from('NomTipoDestinatario')
            ->where("denominacion = ?", $denominacion)
            ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
            ->execute();

        return $result[0]['idtipodest'];
    }

    public static function getType($idTipoDest)
    {
        return Doctrine::getTable('NomTipoDestinatario')
            ->find($idTipoDest)
            ->denominacion;
    }

}

