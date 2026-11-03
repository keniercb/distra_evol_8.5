<?php

abstract class BaseDatProyectocampo extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_personaproyecto.dat_proyectocampo');
        $this->hasColumn('idcampo', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idproyectoconcepto', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('historico', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('expregular', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('activo', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('obligatorio', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('orden', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn(
            'idproyectocampo', 'numeric', null, array(
                'notnull' => false, 'primary' => true, 'sequence' => 'mod_personaproyecto.sec_proyectocampo')
        );
    }

}

