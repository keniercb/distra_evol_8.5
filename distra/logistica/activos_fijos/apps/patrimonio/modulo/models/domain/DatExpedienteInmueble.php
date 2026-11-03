<?php

class DatExpedienteInmueble extends BaseDatExpedienteInmueble {
    public function setUp() {
        parent::setUp();
        $this->hasOne('NomRegimenPatrimonio', array('local' => 'idregimen', 'foreign' => 'idregimen'));
        $this->hasOne('DatRegnumerico', array('local' => 'idexpinmueble', 'foreign' => 'idregnumerico'));

        $array[] = array('cardinalidad' => 'one', 'relation' => 'DatExpedienteInmueble',
            'properties' => array('local' => 'idregnumerico', 'foreign' => 'idexpinmueble'));
        $obj = new DatRegnumerico();

        UtilesDoctrineModel::tryInyectRelactions($obj, $array);
    }
}