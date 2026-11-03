<?php

class DatEfecto extends BaseDatEfecto {

    public function setUp() {
        parent :: setUp();
        $this->hasOne('DatEstudiocausaefecto', array('local' => 'idcausaefecto', 'foreign' => 'idestudiocausaefecto'));
        $this->hasMany('DatCategoria', array('local' => 'idefecto', 'foreign' => 'idefecto'));
    } 

    public static function getByid($idefecto) {
        return Doctrine::getTable('DatEfecto')->findBy('idefecto', $idefecto)->getFirst();
    }
    
    public static function getByProyecto($idproyecto) {        
        $query = Doctrine_Query::create();
        $query->select('efecto.idefecto, estudio.idestudiocausaefecto, efecto.denominacion, efecto.descripcion');
        $query->from('DatEstudiocausaefecto estudio');
        $query->innerJoin('estudio.DatEfecto efecto');
        $query->where('estudio.idproyecto = ?', array($idproyecto));
        $array = $query->execute()->toArray();
        return $array[0];
    }

}
