<?php

class NomOtrasInstalaciones extends BaseNomOtrasInstalaciones {

    public function setUp() {
        parent::setUp();
        $this->hasOne('DatOtrasInstalacionesEntidad', array('local' => 'idotrasinstalacionesviv', 'foreign' => 'idotrasinstalacionesviv'));
    }

   

}
