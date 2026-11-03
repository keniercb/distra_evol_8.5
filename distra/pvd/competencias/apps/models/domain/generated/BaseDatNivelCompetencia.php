<?php 
abstract class BaseDatNivelCompetencia extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_competencia.dat_nivelcompetencia');
        $this->hasColumn(
            'idnivelcompetencia', 'numeric', null,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_competencia.sec_nivelcompetencia')
        );
        $this->hasColumn('iddcompetencia', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idescala', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idvalorescala', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('descripcion', 'character varying', null, array('notnull' => false, 'primary' => false));
    }
}