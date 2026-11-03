
<?php

class DatObrasProtectorasInmuebleIng extends BaseDatObrasProtectorasInmuebleIng{
    public function setUp() {
        parent::setUp();
        $this->hasOne('DatRegnumerico', array('local' => 'idobrasing', 'foreign' => 'idregnumerico'));
        $this->hasOne('NomDesignacion', array('local' => 'iddesignacion', 'foreign' => 'iddesignacion'));
        $this->hasOne('NomTipoVentilacion', array('local' => 'idventilacion', 'foreign' => 'idventilacion'));
        $this->hasOne('NomSistemaEnergetico', array('local' => 'idsistemaenergetico', 'foreign' => 'idenergetico'));
        $this->hasOne('NomConstructiva', array('local' => 'idcaracteristicaconstructiva', 'foreign' => 'idconstructiva'));
       // $this->hasOne('NomTipoComunicacion', array('local' => 'idcomunicacion', 'foreign' => 'idtipocomunicacion'));
        $this->hasOne('DatObrasProtectorasInmTipoComunicacion', array('local' => 'idobrasing', 'foreign' => 'idobrasing'));






    }
}