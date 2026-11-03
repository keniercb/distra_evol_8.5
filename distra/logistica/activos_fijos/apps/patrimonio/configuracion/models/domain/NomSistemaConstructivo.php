<?php

class NomSistemaConstructivo extends BaseNomSistemaConstructivo {

    public function setUp() {
        parent::setUp();
        $this->hasOne('DatSistemaConstructivoEntidad', array('local' => 'idsistemaconstructivo', 'foreign' => 'idsistemaconstructivo'));
    }

   

}
