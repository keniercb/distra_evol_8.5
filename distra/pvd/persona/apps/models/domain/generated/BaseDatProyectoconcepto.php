<?php

abstract class BaseDatProyectoconcepto extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_personaproyecto.dat_proyectoconcepto');
        $this->hasColumn(
            'idproyectoconcepto', 'numeric', null, array(
                'notnull' => true, 'primary' => true,
                'sequence' => 'mod_personaproyecto.sec_proyectoconcepto')
        );
        $this->hasColumn('denominacion', 'character varying', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idpadre', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idproyecto', 'character varying', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('descripcion', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('tipo', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('propiedades', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('iconcls', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('orden', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('codigo', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('cmpempleado', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('getdata', 'character varying', null, array('notnull' => false, 'primary' => false));
    }

}