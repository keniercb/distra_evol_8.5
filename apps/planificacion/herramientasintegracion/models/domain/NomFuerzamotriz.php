<?php

class NomFuerzamotriz extends BaseNomFuerzamotriz
{

    public function setUp()
    {
        parent :: setUp ();
    }

    public function getByid($idfuerzamotriz)
    {
        return Doctrine::getTable('NomFuerzamotriz')->find($idfuerzamotriz)->toArray();
    }


}

