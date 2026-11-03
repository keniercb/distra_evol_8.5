<?php
abstract class BaseDatCaracteristicasocial extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_personaext.dat_caracteristicasocial');
        $this->hasColumn(
            'idcaracteristicasocial', 'numeric', null, array(
                'notnull' => true, 'primary' => true,
                'sequence' => 'mod_personaext.sec_caracteristicasocial')
        );
        $this->hasColumn('idpersona', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idestadocivil', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idestratificacionsocial', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('alia', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('jubilado', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('iddisposicion', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('observaciones', 'character varying', null, array('notnull' => false, 'primary' => false));
    }
}