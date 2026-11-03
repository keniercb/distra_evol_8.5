<?php

class DatPostconacceso extends BaseDatPostconacceso
{
    public function setUp()
    {
        parent::setUp();
        $this->HasMany(
            'NomCondicion',
            array('local' => 'idcondicion', 'foreign' => 'idcondicion')
        );
        $this->HasMany(
            'DatEstado', array('local' => 'idestado', 'foreign' => 'idestado')
        );
        /*$this->HasMany('DatRestricciones', array('local'=>'idtipodoc',
          'foreign'=>'idtipodoc'));
        $this->HasMany('ConfUsuarioConfDocDatEstado', array('local'=>'idestado',
          'foreign'=>'idestado'));
        $this->hasOne('ConfDoc', array('local'=>'idtipodoc',
         'foreign'=>'idtipodoc')); 
        $this->hasOne('DatEstado', array('local'=>'idestado',
          'foreign'=>'idestado'));*/
    }


}//fin clase



