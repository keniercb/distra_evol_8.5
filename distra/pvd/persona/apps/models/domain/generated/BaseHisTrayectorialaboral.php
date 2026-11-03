<?php
abstract class BaseHisTrayectorialaboral extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_personaext.his_trayectorialaboral');
        $this->hasColumn('idtrayectorialaboral', 'numeric', null, array('notnull' => true, 'primary' => true, 'sequence' => 'mod_personaext.sec_trayectorialaboral'));
        $this->hasColumn('idpersona', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('orgentidad', 'character varying', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('cargo', 'character varying', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('fhasta', 'date', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('fdesde', 'date', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('motivobaja', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('noalta', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('observacion', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('falta', 'date', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('fbaja', 'date', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('categocup', 'character varying', null, array('notnull' => false, 'primary' => false));
    }
}