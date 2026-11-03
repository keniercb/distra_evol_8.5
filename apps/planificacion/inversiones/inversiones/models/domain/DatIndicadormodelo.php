<?php

class DatIndicadormodelo extends BaseDatIndicadormodelo {

    public function setUp() {
        parent::setUp();

        $this->hasOne('DatModelo', array('local' => 'idmodelo', 'foreign' => 'idmodelo'));
        $this->hasOne('NomIndicador', array('local' => 'idindicador', 'foreign' => 'idindicador'));
    }

    public function getModelo($idind) {
        $query = new Doctrine_Query ();
        return $query->from('DatIndicadormodelo im')
                        ->where('im.idindicador =?', $idind)
                        ->execute()->getFirst();
    }

}
?> 
