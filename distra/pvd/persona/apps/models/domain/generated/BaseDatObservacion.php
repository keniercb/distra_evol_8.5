<?php
/**
 * Created by PhpStorm.
 * User: olorenzo
 * Date: 26/06/16
 * Time: 11:54
 */
abstract class BaseDatObservacion extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_personaext.dat_observacion');
        $this->hasColumn(
            'idobservacion',
            'numeric',
            null,
            array('notnull' => false, 'primary' => true, 'sequence' => 'mod_personaext.sec_observacion')
        );
        $this->hasColumn('idpersona', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('fregistro', 'date', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('observacion', 'varchar', null, array('notnull' => true, 'primary' => false));
    }
}