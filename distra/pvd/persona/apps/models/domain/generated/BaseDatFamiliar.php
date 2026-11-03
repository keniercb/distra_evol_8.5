<?php

/**
 * Created by PhpStorm.
 * User: olorenzo
 * Date: 3/06/16
 * Time: 17:37
 */
abstract class BaseDatFamiliar extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_personaext.dat_familiar');
        $this->hasColumn(
            'idfamiliar',
            'numeric',
            null,
            array('notnull' => false, 'primary' => true, 'sequence' => 'mod_personaext.sec_familiar')
        );
        $this->hasColumn('numid', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('nombre', 'character varying', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('centrotrabajo', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('fnacimineto', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idsiun', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idparentesco', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('allegado', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('conviven', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idpersona', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idorganizacion', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('observaciones', 'character varying', null, array('notnull' => false, 'primary' => false));
    }
}