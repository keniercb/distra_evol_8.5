<?php

/******************************************************************************
 * Copyright (c) 2016. Todos los derechos reservados. RRHH-XETID              *
 ******************************************************************************/
abstract class BaseDatFamiliarviaje extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_personaext.dat_familiarviaje');
        $this->hasColumn('idfamiliarviaje', 'numeric', null, array('notnull' => false, 'primary' => true,
            'sequence' => 'mod_personaext.sec_familiarviaje'));
        $this->hasColumn('fdesde', 'date', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('fhasta', 'date', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idpais', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idfamiliar', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idpersona', 'numeric', null, array('notnull' => true, 'primary' => false));
    }


}

