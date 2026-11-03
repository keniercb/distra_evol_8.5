<?php

class DatRegistObjObraCamp extends BaseDatRegistObjObraCamp {
    public function setUp() {
        parent::setUp();
        $this->hasOne('NomSistemaConstructivo', array('local' => 'idsistema', 'foreign' => 'idsistemaconstructivo'));
        $this->hasOne('DatRegnumerico', array('local' => 'idobjetoobracomp', 'foreign' => 'idregnumerico'));

       /* $array[] = array('cardinalidad' => 'one', 'relation' => 'DatExpedienteInmueble',
            'properties' => array('local' => 'idregnumerico', 'foreign' => 'idexpinmueble'));
        $obj = new DatRegnumerico();

        UtilesDoctrineModel::tryInyectRelactions($obj, $array);*/
    }
}