<?php

abstract class BaseDatPersonaareatematicaempresa extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_personaext.dat_personaareatematicaempresa');
        $this->hasColumn('idpersona', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idareatematicaempresa', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('fdesde', 'date', null, array('notnull' => true, 'primary' => false));       
        $this->hasColumn('lugarprocedencia', 'character varying', null, array('notnull' => true, 'primary' => false));       
        $this->hasColumn(
            'idpersonaareatematicaempresa', 'numeric', null, array(
                'notnull' => true, 'primary' => true, 'sequence' => 'mod_personaext.sec_personaareatematicaempresa')
        );
    }

}

