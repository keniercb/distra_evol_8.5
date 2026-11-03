<?php

class DatElementofuerzamotriz extends BaseDatElementofuerzamotriz
{

    public function setUp()
    {
        parent :: setUp ();
        $this->hasOne ('NomElementopeir', array ('local' => 'idelementopeir', 'foreign' => 'idelementopeir'));
        $this->hasOne ('NomFuerzamotriz', array ('local' => 'idfuerzamotriz', 'foreign' => 'idfuerzamotriz'));
        $this->hasOne ('DatIndicadorfmpeir', array ('local' => 'idindicadorfmpeir', 'foreign' => 'idindicadorfmpeir'));
    }

    public function getByid($idelementofuerzamotriz)
    {
        return Doctrine::getTable('DatElementofuerzamotriz')->find($idelementofuerzamotriz)->toArray();
    }


}

