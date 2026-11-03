<?php

class DatBloqueo extends BaseDatBloqueo
{

    public function setUp()
    {
        parent::setUp();

        $this->hasOne('DatDocumento', array('local' => 'iddocumento', 'foreign' => 'iddocumento'));
    }

}
