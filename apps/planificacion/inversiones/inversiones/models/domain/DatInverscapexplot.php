<?php

class DatInverscapexplot extends BaseDatInverscapexplot {

    //***Domain**
    public function setUp() {
        parent :: setUp();
        $this->hasOne('DatEtapainversionactespcomportamiento', array('local' => 'idetapainversionactespcomportamiento', 'foreign' => 'idetapainversionactespcomportamiento'));

    }

}

