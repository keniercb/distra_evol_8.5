<?php

abstract class BaseDatBusquedausuario extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_reccomplejas2.dat_busquedausuario');
        $this->hasColumn(
            'idbusquedausuario', 'numeric', null,
            array('notnull' => false, 'primary' => true, 'sequence' => 'mod_reccomplejas2.sec_busquedausuario')
        );
        $this->hasColumn('idbusqueda', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idusuario', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('pordefecto', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('propietario', 'numeric', null, array('notnull' => false, 'primary' => false));
    }


}

