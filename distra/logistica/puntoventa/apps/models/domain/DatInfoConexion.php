<?php

class DatInfoConexion extends BaseDatInfoConexion
{

    public function setUp()
    {
        parent::setUp();
        $this->hasOne('DatAreaventa', array('local' => 'idinfoconexion', 'foreign' => 'idinfoconexion'));

    }
}
