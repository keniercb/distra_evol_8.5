<?php

/**
 *
 */
class DatApertura extends BaseDatApertura
{

    /**
     *
     */
    public function setUp()
    {
        parent:: setUp();
        $this->hasMany('DatAperturaRegNum', array('local' => 'iddocapertura', 'foreign' => 'iddocapertura'));
    }

}
