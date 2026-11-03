<?php

abstract class BaseDatHuella extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_personaext.dat_huella');
        $this->hasColumn('calidad', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('fdesde', 'date', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('minutia', 'bytea', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('imagen', 'bytea', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idpersona', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('iddedo', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idhuella', 'numeric', null, array('notnull' => true, 'primary' => true));
    }

}

