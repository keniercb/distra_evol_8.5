<?php

class DatDocumentoComprobantes extends BaseDatDocumentoComprobantes
{

    public function setUp()
    {
        parent::setUp();
        $this->hasOne('DatDocumento', array('local' => 'iddocumento', 'foreign' => 'iddocumento'));
    }

}
