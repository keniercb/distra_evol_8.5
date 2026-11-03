<?php

abstract class BaseDatGradomilitar extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_personaext.dat_gradomilitar');
        $this->hasColumn('anexo', 'numeric', 4, array('notnull' => false, 'primary' => false));
        $this->hasColumn('parrafo', 'numeric', 4, array('notnull' => false, 'primary' => false));
        $this->hasColumn('numorden', 'character varying', 255, array('notnull' => false, 'primary' => false));
        $this->hasColumn('dequien', 'character varying', 255, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idorden', 'numeric', 19, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idgrado', 'numeric', 19, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idpersona', 'numeric', 19, array('notnull' => true, 'primary' => false));
        $this->hasColumn('fhasta', 'date', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('fdesde', 'date', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn(
            'idgradomilitar', 'numeric', 19, array(
                'notnull' => true, 'primary' => true, 'sequence' => 'mod_personaext.sec_gradomilitar')
        );
    }

}

