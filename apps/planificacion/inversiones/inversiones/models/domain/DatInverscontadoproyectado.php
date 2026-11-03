<?php

class DatInverscontadoproyectado extends BaseDatInverscontadoproyectado {

    public function setUp() {
        parent :: setUp();
    }
 
    public function getByid($idinverscontadoproyectado) {
        return Doctrine::getTable('DatInverscontadoproyectado')->find($idinverscontadoproyectado)->toArray();
    }

    public function EliminarDadoIdinv( $idinversion, $moneEnt) {
        $query = new Doctrine_Query();
        return $query->delete()
                        ->from('DatInverscontadoproyectado n')
                        ->addwhere(' n.idinversion=?  AND n.idmonedaentidad=?', array( $idinversion, $moneEnt))
                        // ->getSqlQuery();
                        ->execute();
    }

}

