<?php

class NomRegimenPatrimonio extends BaseNomRegimenPatrimonio {

    public function setUp() {
        parent::setUp();
        $this->hasOne('DatRegimenPatrimonioEntidad', array('local' => 'idregimen', 'foreign' => 'idregimen'));
    }

   

}
