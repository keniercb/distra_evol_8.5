<?php

class Nomcriteriovaloracion extends BaseNomcriteriovaloracion
{

    public function setUp()
    {
        parent::setUp();
        $this->hasOne('Confdefinicionpeso', array('local' => 'idcriteriovaloracion', 'foreign' => 'idcriteriovaloracion'));

    }

    public function obtenerCriteriosValoracion()
    {
        $q = new Doctrine_Query();
        return $q->from('Nomcriteriovaloracion')->orderBy('idcriteriovaloracion')->execute()->toArray();
    }


}
