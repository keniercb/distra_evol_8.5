<?php

class DatTarea extends BaseDatTarea
{
    public function setUp()
    {
        parent::setUp();
        $this->hasOne('NomTarea', array('local' => 'idnomtarea', 'foreign' => 'idnomtarea'));
    }

}
