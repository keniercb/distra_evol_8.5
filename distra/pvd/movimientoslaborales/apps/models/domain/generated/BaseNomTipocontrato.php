<?php 
abstract class BaseNomTipocontrato extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_fuerzatrabajo.nom_tipocontrato');
        $this->hasColumn(
            'idtipocontrato',
            'numeric',
            null,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_fuerzatrabajo.sec_tipocontrato')
        );
        $this->hasColumn(
            'plantilla',
            'numeric',
            2,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'denominacion',
            'character varying',
            255,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'descripcion',
            'character varying',
            null,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'determinado',
            'numeric',
            19,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'gestion',
            'numeric',
            array('notnull' => true, 'primary' => false)
        );
    }
}