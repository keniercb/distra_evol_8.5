<?php

class NomTarea extends BaseNomTarea
{
    public function setUp()
    {
        parent::setUp();
        $this->hasMany('DatTarea', array('local' => 'idnomtarea', 'foreign' => 'idnomtarea'));
    }

}
