<?php

class NomConstructiva extends BaseNomConstructiva {

    public function setUp() {
        parent::setUp();
        $this->hasOne('DatConstructivaEntidad', array('local' => 'idconstructiva', 'foreign' => 'idconstructiva'));
    }

   

}
