<?php

class DatDocumentocl extends BaseDatDocumentocl
{

    public function setUp()
    {
        $this->hasOne(
            'DatDocumento', array('local' => 'iddocumento', 'foreign' => 'iddocumento')
        );
        $this->hasOne(
            'DatProductopedido', array('local' => 'idproducto', 'foreign' => 'idproducto')
        );
        parent::setUp();
    }


}
