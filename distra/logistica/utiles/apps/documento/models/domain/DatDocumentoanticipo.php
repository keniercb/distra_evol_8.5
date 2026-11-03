<?php

class DatDocumentoanticipo extends BaseDatDocumentoanticipo
{

    public function setUp()
    {
        parent::setUp();
        $this->hasOne('DatDocumento', array('local' => 'iddocumento', 'foreign' => 'iddocumento'));
    }

}
