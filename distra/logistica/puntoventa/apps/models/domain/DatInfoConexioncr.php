<?php

class DatInfoConexioncr extends BaseDatInfoConexioncr
{

    public function setUp()
    {
        parent::setUp();
        $this->hasOne('DatAreaventa', array('local' => 'idinfoconexioncr', 'foreign' => 'idinfoconexioncr'));

    }
}
