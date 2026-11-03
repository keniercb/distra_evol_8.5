<?php

class DatIndicadorfmpeir extends BaseDatIndicadorfmpeir
{

    public function setUp()
    {
        parent :: setUp ();
        $this->hasOne ('DatActorcaracterizado', array ('local' => 'idfuente', 'foreign' => 'idactor'));
    }

    public function getByid($idindicadorfmpeir)
    {
        return Doctrine::getTable('DatIndicadorfmpeir')->find($idindicadorfmpeir)->toArray();
    }


}
