<?php

abstract class BaseDatEstadovivienda extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_personaext.dat_estadovivienda');
        $this->hasColumn('idpersona', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idestadovivienda', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idconvivencia', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn(
            'idestadoviviendap', 'numeric', null, array(
                'notnull' => true, 'primary' => true, 'sequence' => 'mod_personaext.sec_estadoviviendap')
        );
    }
}