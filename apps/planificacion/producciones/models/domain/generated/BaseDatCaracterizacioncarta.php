<?php

abstract class BaseDatCaracterizacioncarta extends Doctrine_Record {

    public function setTableDefinition() {
        $this->setTableName('mod_spouam.dat_caracterizacioncarta');
        $this->hasColumn('idtipocartatiponomenclador', numeric, 19, array(
            'notnull' => true,
            'primary' => true,
            'sequence' => 'mod_spouam.sec_tipocartatiponomenclador_seq'
                )
        );
        $this->hasColumn('idcartatecnologica', 'numeric', 19, array(
            'notnull' => true,
            'primary' => true
                )
        );
        $this->hasColumn('iddatosnomenclador', 'numeric', 19, array(
            'notnull' => true
                )
        );
    }

    public function setUp() {
        parent::setUp();
    }

}

?>
