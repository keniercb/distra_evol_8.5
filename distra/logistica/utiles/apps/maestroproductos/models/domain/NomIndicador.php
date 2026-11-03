<?php

class NomIndicador extends BaseNomIndicador
{

    public function setUp()
    {
        parent::setUp();
        $this->hasOne('NomIndicador', array('local' => 'idpadre', 'foreign' => 'idindicador'));
        $this->hasOne('NomIndicadormedicamento', array('local' => 'idindicador', 'foreign' => 'idindicador'));
        $this->hasOne('NomIndicadorhoja', array('local' => 'idindicador', 'foreign' => 'idindicador'));
        $this->hasMany('NomProductoservicio', array('foreign' => 'idnomproducto', 'local' => 'idindicador'));
        $this->hasMany('NomProductoservicio', array('foreign' => 'idservicio', 'local' => 'idindicador'));
        $this->hasOne('NomIndicadorplanif', array('local' => 'idindicador', 'foreign' => 'idindicador'));
        $this->hasMany('DatImagenindicador', array('local' => 'idindicador', 'foreign' => 'idindicador'));
        $this->hasMany('DatIndicadorconjunto', array('local' => 'idindicador', 'foreign' => 'idindicador'));
		$this->hasMany('DatIndicadorcliente', array('local' => 'idindicador', 'foreign' => 'idindicador'));
    }
}
