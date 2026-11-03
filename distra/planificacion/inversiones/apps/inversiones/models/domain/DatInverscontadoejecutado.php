<?php

class DatInverscontadoejecutado extends BaseDatInverscontadoejecutado {

    public function setUp() {
        parent :: setUp();
    }

    public function getByid($idinverscontadoejecutado) {
        return Doctrine::getTable('DatInverscontadoejecutado')->find($idinverscontadoejecutado)->toArray();
    }

    public function EliminarDadoIdinv( $idinversion, $moneEnt) {
        $query = new Doctrine_Query();
        return $query->delete()
                        ->from('DatInverscontadoejecutado n')
                        ->addwhere('  n.idinversion=?  AND n.idmonedaentidad=?', array( $idinversion, $moneEnt))
                        // ->getSqlQuery();
                        ->execute();
    }

}

