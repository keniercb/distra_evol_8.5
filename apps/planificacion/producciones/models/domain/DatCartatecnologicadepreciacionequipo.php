<?php

class DatCartatecnologicadepreciacionequipo extends BaseDatCartatecnologicadepreciacionequipo {

    public function setUp() {
        parent::setUp();
        $this->hasOne(
                'DatCartatecnologica', array('local' => 'idcartatecnologica',
            'foreign' => 'idcartatecnologica')
        );
        $this->hasOne(
                'DatDepreciacionequipo', array('local' => 'iddepreciacionequipo',
            'foreign' => 'iddepreciacionequipo')
        );
    }

}

//fin clase 