<?php

class NomTipoPosicionFuego extends BaseNomTipoPosicionFuego {

    public function setUp() {
        parent::setUp();
        $this->hasOne('DatTipoPosicionFuegoEntidad', array('local' => 'idposicionfuego', 'foreign' => 'idposicionfuego'));
    }

   

}
