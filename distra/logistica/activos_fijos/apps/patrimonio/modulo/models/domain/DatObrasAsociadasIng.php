<?php

class DatObrasAsociadasIng extends BaseDatObrasAsociadasIng{
    public function setUp() {
        parent::setUp();
        $this->hasOne('DatRegnumerico', array('local' => 'idregnumerico', 'foreign' => 'idregnumerico'));
    }
}