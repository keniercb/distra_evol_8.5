<?php

class DatClienteActividad extends BaseDatClienteActividad
{

    public function setUp()
    {
        $this->hasOne(
            'DatActividad',
            array('local' => 'idactividad', 'foreign' => 'idactividad')
        );

        parent::setUp();
    }

    public function getClienteActividad($params)
    {
        $query = new Doctrine_Query();
        $query->select('dca.*')
            ->from('DatClienteActividad dca')
            ->setHydrationMode(Doctrine::HYDRATE_ARRAY);

        if($params['idactividad']){
            $query->addWhere('idactividad=?',$params['idactividad']);
        }

        $eliminados = json_decode($params['eliminados']);
        if($eliminados){
            $query->whereNotIn('idclienteactividad',$eliminados);
        }

        $result = $query->execute();

        return array('data' => $result, 'count' => $query->count());
    }
}
