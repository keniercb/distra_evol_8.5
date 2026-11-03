<?php 
abstract class BaseDatPersonaproceso extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_idoneidad.dat_personaproceso');
        $this->hasColumn(
            'idpersonaproceso', 'numeric', null,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_idoneidad.sec_personaproceso')
        );
        $this->hasColumn('idproceso', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idpersona', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idoneo', 'numeric', null, array('notnull' => false, 'primary' => false));
    }
}