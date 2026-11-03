<?php

abstract class BaseDatEducacion extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_personaext.dat_educacion');
        $this->hasColumn('idcurso', 'numeric', null, array('notnull' => true, 'primary' => false));
        /*$this->hasColumn('evaluacion', 'character varying', null, array('notnull' => false, 'primary' => false));*/
        $this->hasColumn('observacion', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('resultado', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('fhasta', 'date', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('fdesde', 'date', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idcentroestudio', 'numeric', null, array('notnull' => true, 'primary' => false));
        //$this->hasColumn('idtipocentroestudio', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idmodoformacion', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idtipoformacion', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idpersona', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn(
            'ideducacion', 'numeric', null, array(
                'notnull' => true, 'primary' => true, 'sequence' => 'mod_personaext.sec_educacion')
        );
    }

}

