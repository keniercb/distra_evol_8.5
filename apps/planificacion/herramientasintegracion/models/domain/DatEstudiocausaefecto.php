<?php

class DatEstudiocausaefecto extends BaseDatEstudiocausaefecto
{

    public function setUp() {
        parent:: setUp();
        $this->hasOne('DatProyecto', array('local' => 'idproyecto', 'foreign' => 'idproyecto'));
        $this->hasMany('DatEfecto', array('local' => 'idestudiocausaefecto', 'foreign' => 'idestudiocausaefecto'));
    }

    public function getByid($idestudiocausaefecto) {
        return Doctrine::getTable('DatEstudiocausaefecto')->find($idestudiocausaefecto)->toArray();
    }

    public static function obtenerEstudioByProyecto($idproyecto) {
        return Doctrine::getTable('DatEstudiocausaefecto')->findBy('idproyecto', $idproyecto)->getFirst();
    }

    public static function getByProyecto($idProyecto) {
        return Doctrine::getTable('DatEstudiocausaefecto')->findBy('idproyecto', $idProyecto)->toArray();
    }
}
