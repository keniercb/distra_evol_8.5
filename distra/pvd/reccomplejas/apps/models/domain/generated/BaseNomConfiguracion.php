<?php

abstract class BaseNomConfiguracion extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_reccomplejas2.nom_configuracion');
        $this->hasColumn('idconfiguracion', 'character varying', null, array('notnull' => false, 'primary' => true));
        $this->hasColumn('denominacion', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('servidor', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('puerto', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('basedato', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('usuario', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('contrasena', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('claveproteccion', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('esquema', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('tabla', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idtablabase', 'character varying', null, array('notnull' => false, 'primary' => false));
    }
}