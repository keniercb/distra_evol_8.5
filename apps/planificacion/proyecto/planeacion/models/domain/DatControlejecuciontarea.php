<?php

class DatControlejecuciontarea extends BaseDatControlejecuciontarea {

    public function setUp() {
        parent::setUp();
        $this->hasOne(
                'DatTarea', array('local' => 'idtarea', 'foreign' => 'idtarea')
        );
    }
}

//fin clase



