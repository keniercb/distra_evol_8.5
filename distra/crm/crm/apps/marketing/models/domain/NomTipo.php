<?php

class NomTipo extends BaseNomTipo
{

    public function setUp()
    {
        parent::setUp();

        $this->hasMany(
            'DatOportunidad',
            array('local' => 'idprioridad', 'foreign' => 'idprioridad')
        );

    }

    public function getTipo($params)
    {
        $query = new Doctrine_Query();
        $result = $query->select('tp.*')
            ->from('NomTipo tp')
            ->offset($params['start'])
            ->limit($params['limit'])
            ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
            ->execute();

        return array('data' => $result, 'count' => $query->count());
    }
}