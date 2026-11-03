<?php

/**
 *    Jorge Luis Cuellar Mondeja 24/04/2014
 * */
class DatRegistroespecialidad extends BaseDatRegistroespecialidad
{

    public function setUp()
    {
        parent:: setUp();
       $this->hasOne('DatRegnumerico', array('local' => 'idregnumerico', 'foreign' => 'idregnumerico'));
    }

}
