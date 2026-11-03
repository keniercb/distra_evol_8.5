<?php

class DatInverscontadoestimado extends BaseDatInverscontadoestimado {

    public function setUp() {
        parent :: setUp();
    }

    public function getByid($idinverscontadoestimado) {
        return Doctrine::getTable('DatInverscontadoestimado')->find($idinverscontadoestimado)->toArray();
    }
    public function EliminarDadoIdinv($idinversion, $moneEnt) {
        $query = new Doctrine_Query();
        return $query->delete()
                        ->from('DatInverscontadoestimado n')
                        ->addwhere('n.idinversion=?  AND n.idmonedaentidad=?', array($idinversion, $moneEnt))
                        // ->getSqlQuery();
                        ->execute();
    }

}

