<?php

class NomIndicadorhoja extends BaseNomIndicadorhoja
{

    public function setUp()
    {
        parent::setUp();
        $this->hasOne('NomIndicador', array('local' => 'idindicador', 'foreign' => 'idindicador'));
        $this->hasOne('NomMarca', array('local' => 'idmarca', 'foreign' => 'idmarca'));
        $this->hasOne('NomModelo', array('local' => 'idmodelo', 'foreign' => 'idmodelo'));
        $this->hasOne('NomUnidadmedida', array('local' => 'idumedidaoperativa', 'foreign' => 'idunidadmedida'));
        $this->hasOne('NomGruposubgrupo', array('local' => 'idgruposubgrupo', 'foreign' => 'idgruposubgrupo'));
    }

}
