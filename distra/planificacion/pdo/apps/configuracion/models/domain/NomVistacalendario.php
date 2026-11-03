<?php

class NomVistacalendario extends BaseNomVistacalendario
{

    public function setUp()
    {
        parent:: setUp();
        $this->hasMany(
            'ConfPerfilcalendario',
            array('local'   => 'idvistacalendario',
                  'foreign' => 'idvistaxdefecto')
        );
    }

    public function getByid($descripcion)
    {
        return Doctrine::getTable('NomVistacalendario')->find($descripcion)
            ->toArray();
    }

    public function obtenerVistaCalendario()
    {
        $query = new Doctrine_Query();
        $result = $query->select('d.*')
            ->from('NomVistacalendario d')->execute();
        return $result->toArray();
    }

    public function getDenoVistaCalendaById($id)
    {
        $query = new Doctrine_Query();
        $result = $query->select('d.denominacion')
            ->from('NomVistacalendario d')
            ->where('d.idvistacalendario = ?', $id)
            ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
            ->execute();
        return $result;
    }

}

