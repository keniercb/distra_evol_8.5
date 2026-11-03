<?php

class DatCampannaProducto extends BaseDatCampannaProducto
{

    public function setUp()
    {
        $this->hasOne(
            'DatCampanna',
            array('local' => 'idcampanna', 'foreign' => 'idcampanna')
        );

        parent::setUp();
    }

    public function getProducto($params)
    {
        $query = new Doctrine_Query();
        $query->select('dcp.*')
            ->from('DatCampannaProducto dcp')
            ->orderby('dcp.idcampannaproducto DESC')
            ->offset($params['start'])
            ->limit($params['limit'])
            ->setHydrationMode(Doctrine::HYDRATE_ARRAY);

        if($params['idcampanna']){
            $query->addWhere('idcampanna=?',$params['idcampanna']);
        }
        $result = $query->execute();

        return array('data' => $result, 'count' => $query->count());
    }
}