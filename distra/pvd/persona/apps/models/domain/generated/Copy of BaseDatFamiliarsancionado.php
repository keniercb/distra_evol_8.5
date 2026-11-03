<?php

/******************************************************************************
 * Copyright (c) 2016. Todos los derechos reservados. RRHH-XETID              *
 ******************************************************************************/
abstract class BaseDatFamiliarsancionado extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_personaext.dat_familiarsancionado');
        $this->hasColumn('idfamiliarsancionado', 'numeric', null, array('notnull' => false, 'primary' => true,
            'sequence' => 'mod_personaext.sec_familiarsancionado'));
        $this->hasColumn('idsancion', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idpersona', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idfamiliar', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idmotivosancion', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('fdesde', 'date', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('fhasta', 'date', null, array('notnull' => true, 'primary' => false));
    }


}

