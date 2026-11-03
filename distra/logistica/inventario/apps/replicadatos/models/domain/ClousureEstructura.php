<?php

class ClousureEstructura extends BaseClousureEstructura
{

    public function setUp()
    {
        parent::setUp();
        $this->hasOne('DimEstructura', array('local' => 'idhijo', 'foreign' => 'idestructura'));
    }

}
