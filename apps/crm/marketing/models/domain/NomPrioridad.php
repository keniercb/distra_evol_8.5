<?php

class NomPrioridad extends BaseNomPrioridad
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
        $this->hasMany(
            'DatCampanna',
            array('local' => 'idcampanna', 'foreign' => 'idcampanna')
        );
    }

    public function getPrioridad($params)
    {
        $query = new Doctrine_Query();
        $result = $query->select('np.*')
            ->from('NomPrioridad np')
            ->offset($params['start'])
            ->limit($params['limit'])
            ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
            ->execute();

        return array('data' => $result, 'count' => $query->count());
    }
}