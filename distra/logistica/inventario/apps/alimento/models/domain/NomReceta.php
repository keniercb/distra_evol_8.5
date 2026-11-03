<?php

class NomReceta extends BaseNomReceta
{

    public function setUp()
    {
        parent::setUp();
        $this->hasMany('NomNorma', array('local' => 'idnorma', 'foreign' => 'idnorma'));
        $this->hasMany('DatProductoReceta', array('local' => 'idreceta', 'foreign' => 'idreceta'));
        $this->hasOne('DatRecetaEntidad', array('local' => 'idreceta', 'foreign' => 'idreceta'));
        $this->hasOne('NomUnidadmedida', array('local' => 'idunidadmedida', 'foreign' => 'idunidadmedida'));
        $this->hasOne('DatRecetaActividad', array('local' => 'idreceta', 'foreign' => 'idreceta'));
    }

    public function Buscar($idreceta)
    {
        return Doctrine::getTable('NomReceta')->find($idreceta);
    }

}
