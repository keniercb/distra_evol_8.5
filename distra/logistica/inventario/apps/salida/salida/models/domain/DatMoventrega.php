<?php

class DatMoventrega extends BaseDatMoventrega
{
    public function setUp()
    {
        $this->hasOne('DatMovimientos', array('local' => 'idmovimiento', 'foreign' => 'idmovimiento'));
        $this->hasOne('DatMoventrega', array('local' => 'iddocorige', 'foreign' => 'iddocorige'));
        parent::setUp();
    }

}
