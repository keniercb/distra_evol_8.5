<?php

class NomVinculacionLaboral extends BaseNomVinculacionLaboral {

    public function setUp() {
        parent::setUp();
        $this->hasOne('DatVinculacionLaboralEntidad', array('local' => 'idvinculacionlaboral', 'foreign' => 'idvinculacionlaboral'));
    }

   

}
