<?php 
abstract class BaseDatRiesgo extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_sstriesgo.dat_riesgo');
        $this->hasColumn(
            'idriesgo',
            'numeric',
            null,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_sstriesgo.sec_riesgo')
        );
        $this->hasColumn('idnriesgo', 'numeric', array('notnull' => true, 'primary' => false));
        $this->hasColumn('idestructura', 'numeric', array('notnull' => true, 'primary' => false));
        $this->hasColumn('descripcion', 'character varying', array('notnull' => false, 'primary' => false));
        $this->hasColumn('fdeteccion', 'date', array('notnull' => true, 'primary' => false));
        $this->hasColumn('idfrecuencia', 'numeric', array('notnull' => true, 'primary' => false));
        $this->hasColumn('idprobabilidad', 'numeric', array('notnull' => true, 'primary' => false));
        $this->hasColumn('idnivelriesgo', 'numeric', array('notnull' => true, 'primary' => false));
        $this->hasColumn('idsistema', 'numeric', array('notnull' => false, 'primary' => false));
        $this->hasColumn('idpartesistema', 'numeric', array('notnull' => false, 'primary' => false));
    }
}