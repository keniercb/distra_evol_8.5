<?php

abstract class BaseDatDatosautorficha extends Doctrine_Record {

    public function setTableDefinition() {
        $this->setTableName('mod_spouam.dat_datosautorficha');
        $this->hasColumn(
                'iddatosautorficha', 'numeric', null, array('notnull' => true, 'primary' => true,
            'sequence' => 'mod_spouam.sec_datosautorficha')
        );
        $this->hasColumn(
                'empresasubordinada', 'character varying', 100, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
                'confeccionada', 'character varying', 100, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
                'aprobada', 'character varying', 100, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
                'cargoconf', 'character varying', 100, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
                'cargoaprob', 'character varying', 100, array('notnull' => true, 'primary' => false)
        );

        $this->hasColumn(
                'telefonoaprob', 'character varying', 100, array('notnull' => true, 'primary' => false)
        );

        $this->hasColumn(
                'telefonoconf', 'character varying', 100, array('notnull' => true, 'primary' => false)
        );
    }

    public function Setup() {
        parent::setUp();
    }

}

//fin clase
