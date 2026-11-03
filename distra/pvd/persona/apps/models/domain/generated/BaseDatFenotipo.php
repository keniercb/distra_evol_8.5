<?php

abstract class BaseDatFenotipo extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_persona.dat_fenotipo');
        $this->hasColumn('idgruposanguineo', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('observaciones', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('estatura', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('pesocorporal', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idcolorpelo', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idcolorpiel', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idcolorojos', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idpersona', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn(
            'idfenotipo', 'numeric', null, array(
                'notnull' => true, 'primary' => true, 'sequence' => 'mod_persona.sec_fenotipo')
        );
    }

}

