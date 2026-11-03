<?php

abstract class BaseDatCuentabancaria extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_personaext.dat_cuentabancaria');
        $this->hasColumn('idtipocuentabancaria', 'numeric', 19, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idpersona', 'numeric', 19, array('notnull' => true, 'primary' => false));
        $this->hasColumn('fhasta', 'date', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('fdesde', 'date', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idbanco', 'numeric', 19, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idmoneda', 'numeric', 19, array('notnull' => true, 'primary' => false));
        $this->hasColumn('descripcion', 'character varying', 255, array('notnull' => false, 'primary' => false));
        $this->hasColumn('numerocuenta', 'numeric', 34, array('notnull' => true, 'primary' => false));
        $this->hasColumn('codtipoid', 'numeric', 34, array('notnull' => true, 'primary' => false));
        $this->hasColumn(
            'idcuentabancaria', 'numeric', null, array(
                'notnull' => true, 'primary' => true, 'sequence' => 'mod_personaext.sec_cuentabancaria')
        );
    }

}

