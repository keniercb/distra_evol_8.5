<?php

class NomImpactoflujos extends BaseNomImpactoflujos
{

    public function setUp() {
        parent:: setUp();
        $this->hasMany('DatMatrizimpactocruzado', array('local' => 'idimpacto', 'foreign' => 'idimpacto'));
    }

    public static function getByid($idimpacto) {
        return Doctrine::getTable('NomImpactoflujos')->find($idimpacto)->toArray();
    }

    public static function getAll() {
        $q = Doctrine_Query::create();
        $q->select('v.*')->from('NomImpactoflujos v')->orderBy('v.peso DESC')->setHydrationMode(Doctrine::HYDRATE_ARRAY);
        return $q->execute();
    }
}