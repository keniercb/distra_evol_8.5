<?php

class DatInverscontadoplan extends BaseDatInverscontadoplan {

    public function setUp() {
        parent :: setUp();
    }

    public function getByid($idinverscontadoplan) {
        return Doctrine::getTable('DatInverscontadoplan')->find($idinverscontadoplan)->toArray();
    }
    public function EliminarDadoIdinv($idinversion, $moneEnt) {
        $query = new Doctrine_Query();
        return $query->delete()
                        ->from('DatInverscontadoplan n')
                        ->addwhere(' n.idinversion=?  AND n.idmonedaentidad=?', array($idinversion, $moneEnt))
                        // ->getSqlQuery();
                        ->execute();
    }

}

