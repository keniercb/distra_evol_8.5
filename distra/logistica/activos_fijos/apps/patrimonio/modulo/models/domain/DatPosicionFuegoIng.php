<?php

class DatPosicionFuegoIng extends BaseDatPosicionFuegoIng{
    public function setUp() {
        parent::setUp();
        $this->hasOne('DatRegnumericoActivo', array('local' => 'idregnumerico', 'foreign' => 'idregnumericoactivo'));
        $this->hasOne('NomTipoPosicionFuego', array('local' => 'idposicionfuego', 'foreign' => 'idposicionfuego'));
        $this->hasOne('NomTipoPuntoFuego', array('local' => 'idtipopuntofuego', 'foreign' => 'idpuntofuego'));
    }
}