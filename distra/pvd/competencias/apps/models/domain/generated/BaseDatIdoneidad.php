<?php 
abstract class BaseDatIdoneidad extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_idoneidad.dat_idoneidad');
        $this->hasColumn(
            'ididoneidad', 'numeric', null,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_idoneidad.sec_idoneidad')
        );
        $this->hasColumn('idpersona', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idoneo', 'numeric', null, array('notnull' => true, 'primary' => false));
    }
}