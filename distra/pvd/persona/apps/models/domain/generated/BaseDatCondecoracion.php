<?php

abstract class BaseDatCondecoracion extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_personaext.dat_condecoracion');
        $this->hasColumn('observacion', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('fecha', 'date', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idmotivocondecoracion', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idcondecoracion', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idpersona', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn(
            'idcondecoracionp', 'numeric', null, array(
                'notnull' => true, 'primary' => true, 'sequence' => 'mod_personaext.sec_condecoracionp')
        );
    }

}

