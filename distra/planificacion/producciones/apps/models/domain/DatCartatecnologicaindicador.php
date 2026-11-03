<?php

class DatCartatecnologicaindicador extends BaseDatCartatecnologicaindicador {

    public function setUp() {
        parent::setUp();
    }

    public function getCartaTecIndicador($idcartatecnologica) {
        $query = new Doctrine_Query();
        return $query
                        ->from("DatCartatecnologicaindicador cti")
                        ->where('cti.idcartatecnologica = ? ', array($idcartatecnologica))
                        ->execute()->getFirst();
    }

}
