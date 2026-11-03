<?php

class NomDesignacion extends BaseNomDesignacion {

    public function setUp() {
        parent::setUp();
        $this->hasOne('DatDesignacionEntidad', array('local' => 'iddesignacion', 'foreign' => 'iddesignacion'));
    }

   

}
