<?php

abstract class BaseDatNominaAprobacionCertificacion extends Doctrine_Record{

    public function setTableDefinition(){

        $this->setTableName('mod_nomina.dat_nominaaprobacioncertificacion');

        $this->hasColumn('idnominaaprobacioncertificacion', 'numeric', 19, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => true,
            'primary' => true,
            'sequence'=>'mod_nomina.sec_dat_nominaaprobacioncertificacion'
        ));
        
        $this->hasColumn('idnomina', 'numeric', 19, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => true,
            'primary' => false
        ));
        
        $this->hasColumn('idcompartimentacionnomina', 'numeric', 19, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => true,
            'primary' => false
        ));
        
        $this->hasColumn('operacionpermiso', 'numeric', 19, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => true,
            'primary' => false
        ));
        
       
        $this->hasColumn('fechaoperacion', 'date', null, array(
            'type' => 'date',
            'length' => null,
            'notnull' => true,
            'primary' => false
        ));
        
    }
}
