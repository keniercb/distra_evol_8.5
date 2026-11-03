<?php

class ConfPersonaArea extends BaseConfPersonaArea
{

    public function setUp()
    {
        $this->hasOne('ConfActividad', array('local' => 'idservicio', 'foreign' => 'idactividad'));
    }
}
