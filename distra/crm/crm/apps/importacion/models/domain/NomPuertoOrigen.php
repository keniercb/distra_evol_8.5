<?php

class NomPuertoOrigen extends BaseNomPuertoOrigen
{

    public function setUp()
    {
//        include '../../../../configuracion/divisionpolitica/models/domain/NomPais.php';
//        $this->hasMany('NomPais', array('local' => 'idpais', 'foreign' => 'idpais'));
        parent::setUp();
    }

    public function getPuertosOrigen()
    {
        return Doctrine_Query::create()
            ->from('NomPuertoOrigen')
            ->fetchArray();
    }

    public function getModelData($params)
    {
        return array();
    }
}
