<?php

abstract class BaseSegCompartimentacionCargoPorTipoNomina extends Doctrine_Record{

    public function setTableDefinition(){

        $this->setTableName('mod_nomina.seg_compartimentacioncargoportiponomina');

        $this->hasColumn('idcompartimentacioncargoportiponomina', 'numeric', 19, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => true,
            'primary' => true,
            'sequence'=>'mod_nomina.sec_seg_compartimentacioncargoportiponomina_seq'
        ));
        
        $this->hasColumn('idcompartimentacionnomina', 'numeric', 19, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => true,
            'primary' => false
        ));

		$this->hasColumn('idtiponomina', 'numeric', 19, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => true,
            'primary' => false
        ));
        
		$this->hasColumn('permiso', 'numeric', 19, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => true,
            'primary' => false
        ));
    }
}
