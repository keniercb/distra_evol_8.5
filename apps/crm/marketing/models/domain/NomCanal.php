<?php

class NomCanal extends BaseNomCanal
{

    public function setUp()
    {
        parent::setUp();

        $this->hasMany(
            'DatActividad',
            array('local' => 'idactividad', 'foreign' => 'idactividad')
        );
        $this->hasMany(
            'DatOportunidad',
            array('local' => 'idprioridad', 'foreign' => 'idprioridad')
        );
    }

    public function getCanal($params)
    {
        $query = new Doctrine_Query();
        $result = $query->select('nc.*')
            ->from('NomCanal nc')
            ->offset($params['start'])
            ->limit($params['limit'])
            ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
            ->execute();

        return array('data' => $result, 'count' => $query->count());
    }

}
