<?php

class DatTipoMaterialConstruccion extends BaseNomTipoMaterialConstruccion
{
    public function setUp()
    {
        parent::setUp();

       $this->hasOne('NomTipoConstruccion', array('local' => 'idtipoconstruccion', 'foreign' => 'idtipoconstruccion'));
       $this->hasOne('NomMaterialConstruccion', array('local' => 'idmaterialesconstruccion', 'foreign' => 'idmaterialesconstruccion'));

    }
}

