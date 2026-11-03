<?php

class NomOperacion extends BaseNomOperacion
{

    public function setUp()
    {
        parent::setUp();

        $this->HasMany(
            'DatDocumentoaprobacion',
            array('local' => 'idoperacion', 'foreign' => 'idoperacion')
        );
    }

    public function listar($start, $limit)
    {
        $query = Doctrine_Query::create();
        $query->from('NomOperacion o')
            ->offset($start)
            ->limit($limit)
            ->setHydrationMode(Doctrine::HYDRATE_ARRAY);
        $result = $query->execute();
        return $result;
    }

}
