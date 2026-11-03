<?php

class NomTipoPuntoFuego extends BaseNomTipoPuntoFuego {

    public function setUp() {
        parent::setUp();
        $this->hasOne('DatTipoPuntoFuegoEntidad', array('local' => 'idpuntofuego', 'foreign' => 'idpuntofuego'));
    }

   

}
