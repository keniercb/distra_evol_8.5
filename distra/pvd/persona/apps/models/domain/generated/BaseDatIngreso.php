<?php
/**
 * Created by PhpStorm.
 * User: olorenzo
 * Date: 17/06/16
 * Time: 14:59
 */
abstract class BaseDatIngreso extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_personaext.dat_ingreso');
        $this->hasColumn(
            'idingreso',
            'numeric',
            null,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_personaext.sec_ingreso')
        );
        $this->hasColumn('idpersona', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idfamiliar', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idtipoingreso', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idmoneda', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('cuantia', 'numeric', null, array('notnull' => true, 'primary' => false));
    }
}