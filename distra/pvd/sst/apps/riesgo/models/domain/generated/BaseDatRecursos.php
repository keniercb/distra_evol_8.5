<?php 
abstract class BaseDatRecursos extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_sstriesgo.dat_recurso');
        $this->hasColumn(
            'iddrecurso',
            'numeric',
            null,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_sstriesgo.sec_drecurso')
        );
        $this->hasColumn('idriesgo', 'numeric', array('notnull' => true, 'primary' => false));
        $this->hasColumn('idrecurso', 'numeric', array('notnull' => true, 'primary' => false));
        $this->hasColumn('descripcion', 'character varying', array('notnull' => false, 'primary' => false));
        $this->hasColumn('fdesde', 'date', array('notnull' => true, 'primary' => false));
        $this->hasColumn('fhasta', 'date', array('notnull' => false, 'primary' => false));
    }
}