<?php

class BaseDatLocalObrasIng extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_logpatrimonio.dat_localesobrasing');
        $this->hasColumn('idlocalesobrasing', 'numeric', 19, array('notnull' => true, 'primary' => true));
        $this->hasColumn('idregnumerico', 'numeric',19, array('notnull' => false, 'primary' => false));


        $this->hasColumn('idlocal', 'numeric',19, array('notnull' => false, 'primary' => false));
        $this->hasColumn('volumen', 'numeric',19, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idseccion','numeric',19, array('notnull' => true, 'primary' => false));
        $this->hasColumn('excavacion', 'numeric',19, array('notnull' => false, 'primary' => false));
        $this->hasColumn('revestida', 'character varying', 255, array('notnull' => false, 'primary' => false));
        $this->hasColumn('terminacion', 'character varying', 255, array('notnull' => false, 'primary' => false));
        $this->hasColumn('techo','numeric',19,array('notnull' => false, 'primary' => false));
        $this->hasColumn('fkp', 'character varying', 255, array('notnull' => false, 'primary' => false));
    }
}
