<?php

abstract class BaseNomEventoalimentacion extends Doctrine_Record
{
    public function setTableDefinition()
    {
        //Especificando la tabla
        $this->setTableName('mod_personaext.nom_eventoalimentacion');
        $this->hasColumn(
            'idevento', 'numeric', null,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_personaext.sec_eventoalimentacion')
        );
        $this->hasColumn(
            'denominacion', 'character varying', null, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'abreviatura', 'character varying', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'descripcion', 'character varying', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'fdesde', 'date', null, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'fhasta', 'date', null, array('notnull' => false, 'primary' => false)
        );
    }
}