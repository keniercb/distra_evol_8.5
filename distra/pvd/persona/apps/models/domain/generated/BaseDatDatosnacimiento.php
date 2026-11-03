<?php

abstract class BaseDatDatosnacimiento extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_persona.dat_datosnacimiento');
        $this->hasColumn('idpersona', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('localidad', 'varchar', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idmunicipio', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idprovincia', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idpais', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('folio', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('tomo', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('registrocivil', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('nombrepadre', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('nombremadre', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('fechanacimiento', 'date', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn(
            'iddatosnacimiento', 'numeric', null, array(
                'notnull' => true, 'primary' => true, 'sequence' => 'mod_persona.sec_datosnacimiento')
        );
    }

}

