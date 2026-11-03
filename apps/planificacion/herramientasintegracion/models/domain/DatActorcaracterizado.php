<?php

class DatActorcaracterizado extends BaseDatActorcaracterizado
{

    public function setUp()
    {
        parent :: setUp ();
        $this->hasMany ('DatIndicadorfmpeir', array ('local' => 'idactor', 'foreign' => 'idfuente'));
    }

    public function getByid($idactor)
    {
        return Doctrine::getTable('DatActorcaracterizado')->find($idactor)->toArray();
    }


}

