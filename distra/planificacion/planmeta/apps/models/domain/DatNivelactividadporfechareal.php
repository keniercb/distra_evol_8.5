<?php

class DatNivelactividadporfechareal extends BaseDatNivelactividadporfechareal
{

    public function setUp()
    {
        parent::setUp();
    }

    public function finalizada($params)
    {
        $query = new Doctrine_Query();
        $data = $query->from('DatNivelactividadporfechareal dnafr')
            ->addWhere(
                'dnafr.idactividadentidad=?', $params['idactividadentidad']
            )
            ->addWhere('dnafr.fin = ?', 1)
            ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
            ->execute();
        return $data;
    }

}
