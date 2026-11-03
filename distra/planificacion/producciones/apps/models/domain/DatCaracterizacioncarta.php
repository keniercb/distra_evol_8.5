<?php

class DatCaracterizacioncarta extends BaseDatCaracterizacioncarta {

    public function setUp() {
        parent::setUp();
        $this->hasOne('DatTipocartatiponomenclador', array(
            'local' => 'idtipocartatiponomenclador',
            'foreign' => 'idtipocartatiponomenclador'
                )
        );
        $this->hasOne('DatCartatecnologica', array(
            'local' => 'idcartatecnologica',
            'foreign' => 'idcartatecnologica'
                )
        );
    }

}

?>
