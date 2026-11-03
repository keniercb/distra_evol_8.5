<?php
abstract class BaseConfConceptosalarialnomina extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_fuerzatrabajo.conf_conceptosalarialnomina');
        $this->hasColumn(
            'idconceptosalarialnomina',
            'numeric',
            null,
            array ('notnull' => true,'primary' => true)
        );
        $this->hasColumn(
            'idconceptosalarial',
            'numeric',
            null,
            array ('notnull' => true,'primary' => false)
        );
    }
}