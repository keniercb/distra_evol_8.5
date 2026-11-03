<?php
/**
 * Created by PhpStorm.
 * User: olorenzo
 * Date: 26/06/16
 * Time: 14:39
 */
abstract class BaseDatAseop extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_personaext.dat_aseo');
        $this->hasColumn(
            'idaseop',
            'numeric',
            null,
            array ('notnull' => true,'primary' => true, 'sequence' => 'mod_personaext.sec_dataseo')
        );
        $this->hasColumn('idpersona', 'numeric', null, array ('notnull' => true,'primary' => false));
        $this->hasColumn('idaseo', 'numeric', null, array ('notnull' => true,'primary' => false));
        $this->hasColumn('fdesde', 'date', null, array ('notnull' => true,'primary' => false));
        $this->hasColumn('fhasta', 'date', null, array ('notnull' => false,'primary' => false));
    }
}