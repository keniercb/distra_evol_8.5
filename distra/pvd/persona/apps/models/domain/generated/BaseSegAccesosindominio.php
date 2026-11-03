<?php

abstract class BaseSegAccesosindominio extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_persona.seg_accesosindominio');
        $this->hasColumn('idusuario', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idpersona', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn(
            'idaccesosindominio', 'numeric', null, array(
                'notnull' => true, 'primary' => true, 'sequence' => 'mod_persona.sec_accesosindominio')
        );
    }

}

