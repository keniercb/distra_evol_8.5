<?php

/**
 * @author    Liermes Ferriol Mena
 * @version   1.0.0
 * @copyright UCID, ERP-CUBA
 */
abstract class BaseDatArc extends Doctrine_Record {

    public function setTableDefinition() {
        $this->setTableName('mod_objetivos.dat_arc');
        $this->hasColumn(
                'idarc', 'numeric', null, array('notnull' => true, 'primary' => true
            , 'sequence' => 'mod_objetivos.sec_datarc')
        );
        $this->hasColumn(
                'activo', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
                'caduca', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
                'denarc', 'character varying', null, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
                'descrip', 'character varying', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
                'fechacreacion', 'date', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
                'fechafin', 'date', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
                'fechainicio', 'date', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
                'idarcp', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
                'idusuariocrea', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
                'ordender', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
                'ordenizq', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
                'uriidarc', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
                'orden', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
                'escapitulo', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
    }

    public function Setup() {
        parent::setUp();
    }

}

//fin clase


