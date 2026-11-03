<?php

abstract class BaseDatCaracterizacion extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_personaext.dat_caracterizacion');
        $this->hasColumn('coeficiente', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('expresion', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('apariencia', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('motivacion', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('resumen', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idpersona', 'numeric', 19, array('notnull' => true, 'primary' => false));
        $this->hasColumn('perfil', 'numeric', 19, array('notnull' => false, 'primary' => false));
        $this->hasColumn('aptoperfil', 'numeric', 19, array('notnull' => false, 'primary' => false));
        $this->hasColumn('explaboral', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('expactividad', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn(
            'idcaracterizacion', 'numeric', 19, array(
                'notnull' => true, 'primary' => true, 'sequence' => 'mod_personaext.sec_caracterizacion')
        );
    }

}