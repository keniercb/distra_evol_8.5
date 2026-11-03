<?php 
abstract class BaseDatPlantillatipocontrato extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_fuerzatrabajo.dat_plantillatipocontrato');
        $this->hasColumn(
            'idplantillatipocontrato',
            'numeric',
            null,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_fuerzatrabajo.sec_plantillatipocontrato')
        );
        $this->hasColumn(
            'idplantilla',
            'numeric',
            19,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'idtipocontrato',
            'numeric',
            19,
            array('notnull' => true, 'primary' => false)
        );
    }
}