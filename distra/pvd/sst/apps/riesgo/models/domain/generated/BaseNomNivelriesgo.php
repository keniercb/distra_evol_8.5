<?php 
abstract class BaseNomNivelriesgo extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_sstriesgo.nom_nivelriesgo');
        $this->hasColumn(
            'idnivelriesgo',
            'numeric',
            null,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_sstriesgo.sec_nivelriesgo')
        );
        $this->hasColumn('denominacion', 'character varying', array('notnull' => true, 'primary' => false));
        $this->hasColumn('descripcion', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('fdesde', 'date', array('notnull' => true, 'primary' => false));
        $this->hasColumn('fhasta', 'date', array('notnull' => false, 'primary' => false));
        $this->hasColumn('gestion', 'numeric', array('notnull' => true, 'primary' => false));
    }
}