<?php 
abstract class BaseNomTipoaccion extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_capacitacion.nom_tipoaccion');
        $this->hasColumn(
            'idtipoaccion',
            'numeric',
            null,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_capacitacion.sec_tipoaccion')
        );
        $this->hasColumn('denominacion', 'character varying', array('notnull' => true, 'primary' => false));
        $this->hasColumn('descripcion', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('fdesde', 'date', array('notnull' => true, 'primary' => false));
        $this->hasColumn('fhasta', 'date', array('notnull' => false, 'primary' => false));
        $this->hasColumn('gestion', 'numeric', array('notnull' => true, 'primary' => false));
    }
}