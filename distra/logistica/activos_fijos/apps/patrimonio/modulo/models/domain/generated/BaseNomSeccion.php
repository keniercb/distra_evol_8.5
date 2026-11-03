<?php

class BaseNomSeccion extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_logpatrimonio.nom_seccion');
        $this->hasColumn('idseccion', 'numeric', 19, array('notnull' => true, 'primary' => true));       
        $this->hasColumn('denominacion', 'character varying',19, array('notnull' => false, 'primary' => false));        

    }
}
