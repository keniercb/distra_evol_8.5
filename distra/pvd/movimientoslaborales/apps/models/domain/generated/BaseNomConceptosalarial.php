<?php
abstract class BaseNomConceptosalarial extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_fuerzatrabajo.nom_conceptosalarial');
        $this->hasColumn(
            'idconceptosalarial',
            'numeric',
            null,
            array ('notnull' => true,'primary' => true)
        );
        $this->hasColumn(
            'denominacion',
            'character varying',
            null,
            array ('notnull' => true,'primary' => false)
        );
        $this->hasColumn(
            'reporte_registro_trabajadores', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
    }
}