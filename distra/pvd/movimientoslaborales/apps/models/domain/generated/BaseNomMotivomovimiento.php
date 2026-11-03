<?php 
abstract class BaseNomMotivomovimiento extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_fuerzatrabajo.nom_motivomovimiento');
        $this->hasColumn(
            'idmotivomovimiento',
            'numeric',
            null,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_fuerzatrabajo.sec_motivomovimiento')
        );
        $this->hasColumn('idpadre', 'numeric', 255, array('notnull' => true, 'primary' => false));
        $this->hasColumn('denominacion', 'character varying', 255, array('notnull' => true, 'primary' => false));
        $this->hasColumn('descripcion', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('fhasta', 'date', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('fdesde', 'date', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('gestion', 'numeric', array('notnull' => true, 'primary' => false));
    }
}