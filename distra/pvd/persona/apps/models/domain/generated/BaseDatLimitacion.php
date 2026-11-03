<?php

abstract class BaseDatLimitacion extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_personaext.dat_limitacion');
        $this->hasColumn(
            'idlimitacion', 'numeric', null, array(
                'notnull' => true, 'primary' => true, 'sequence' => 'mod_personaext.sec_limitacion')
        );
        $this->hasColumn('idpersona', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idcausa', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('fdesde', 'date', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('fhasta', 'date', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('fregistro', 'date', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idsituacionlaboral', 'numeric', null, array('notnull' => true, 'primary' => false));
    }

}
