<?php

class DatClienteOportunidad extends BaseDatClienteOportunidad
{

    public function setUp()
    {
        $this->hasOne(
            'DatOportunidad',
            array('local' => 'idoportunidad', 'foreign' => 'idoportunidad')
        );
        parent::setUp();
    }

    public function getClienteOportunidad($params){
        $query = new Doctrine_Query();
        $query->select('dco.*')
            ->from('DatClienteOportunidad dco')
            ->orderby('idclienteoportunidad DESC')
            ->setHydrationMode(Doctrine::HYDRATE_ARRAY);

        if($params['idoportunidad']){
            $query->addWhere('idoportunidad=?',$params['idoportunidad']);
        }
        $result = $query->execute();
        return array('data' => $result, 'total' => $query->count());
    }
}
