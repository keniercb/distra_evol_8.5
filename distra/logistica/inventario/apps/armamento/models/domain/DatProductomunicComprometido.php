<?php

class DatProductomunicComprometido extends BaseDatProductomunicComprometido
{
    public function setUp()
    {
        parent::setUp();
        $this->hasOne('DatProductomunic', array('local' => 'idproductomunic', 'foreign' => 'idproductomunic'));
        $this->hasOne('DatDocumento', array('local' => 'iddocumento', 'foreign' => 'iddocumento'));
    }

}
