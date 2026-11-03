<?php

    abstract class BaseNomFirma extends Doctrine_Record {
        public function setTableDefinition() {
            $this->setTableName('mod_estructuracomp.nom_firma');
            $this->hasColumn('idfirma', 'numeric', NULL, array('notnull' => TRUE, 'primary' => TRUE, 'sequence'=>'mod_estructuracomp.sec_firma'));
            $this->hasColumn('persona', 'character varying', 255, array('notnull' => TRUE, 'primary' => FALSE));
            $this->hasColumn('idnomcargo', 'numeric', NULL, array('notnull' => FALSE, 'primary' => FALSE));
            $this->hasColumn('iddominio', 'numeric', NULL, array('notnull' => FALSE, 'primary' => FALSE));
            $this->hasColumn('actual', 'numeric', NULL, array('notnull' => FALSE, 'primary' => FALSE));
            $this->hasColumn('visible', 'numeric', NULL, array('notnull' => FALSE, 'primary' => FALSE));
            $this->hasColumn('fechainicio', 'date', null, array('notnull' => false, 'primary' => false));
            $this->hasColumn('fechafin', 'date', null, array('notnull' => false, 'primary' => false));
        }

        public function Setup() {
            parent::setUp();
        }
    }