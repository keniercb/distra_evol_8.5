<?php

class NomTipoanteproyecto extends BaseNomTipoanteproyecto
{

    public function setUp()
    {
        parent::setUp();
    }

    public function listarTodos()
    {
        $query = Doctrine_Query::create();
        $query->select('ap.idtipoanteproyecto, ap.denominacion')
            ->from('NomTipoanteproyecto ap')
            ->orderBy('ap.denominacion')
            ->setHydrationMode(Doctrine::HYDRATE_ARRAY);
        $result = $query->execute();
        return $result;
    }

}
