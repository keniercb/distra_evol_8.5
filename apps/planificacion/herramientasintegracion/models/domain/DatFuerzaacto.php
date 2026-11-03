<?php

class DatFuerzaacto extends BaseDatFuerzaacto
{

    public function setUp() {
        parent:: setUp();
        $this->hasOne('DatFuerza', array('local' => 'idfuerza', 'foreign' => 'idfuerza'));
    }

    public function getByid($idfuerzaacto) {
        return Doctrine::getTable('DatFuerzaacto')->find($idfuerzaacto);
    }
    
    public function guardarFuerzaActo($obj) {
        $obj->save();
        return $obj->idfuerzaacto;
    }
    
    public function obtenerFuerzaActo($idfuerza, $idacto){
        $q = Doctrine_Query::create();
        $q->from('DatFuerzaacto fa')->where('fa.idfuerza = ? and fa.idacto = ?', array($idfuerza, $idacto));
        $res = $q->fetchArray();
        return $res;
    }
}