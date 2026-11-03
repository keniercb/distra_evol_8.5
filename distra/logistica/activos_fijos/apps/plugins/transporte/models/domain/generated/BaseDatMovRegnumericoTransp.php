<?php

/**
 *    Jorge Luis Cuellar Mondeja 20/04/2014
 * */
class BaseDatMovRegnumericoTransp extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName(
            'mod_logactivofijotangible.dat_movregnumericoactivotransp'
        );
        $this->hasColumn(
            'idmovregnumerico', 'numeric', null, array('notnull' => true, 'primary' => true)
        );
        $this->hasColumn(
            'nromatricula', 'character varying', 50, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'nromotor1', 'character varying', 100, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'nromotor2', 'character varying', 100, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'indicativo', 'character varying', 100, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'indiceconsumo', 'character varying', 100, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'nollaveencendido', 'character varying', 100, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'lot', 'character varying', 100, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'vin', 'character varying', 30, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'ficav', 'character varying', 100, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'idtipocombustible', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'nrocirculacion', 'numeric', 255, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'capacidad', 'numeric', null, array('notnull' => false, 'primary' => false)
        );$this->hasColumn(
            'endeposito', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'vencimientolot', 'character varying', 100, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'vencimientoficav', 'character varying', 100, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'vencimientocirculacion', 'character varying', 100, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'expedicioncirculacion', 'character varying', 100, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'cantpersonapie', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'cantpersonasentado', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'normacombustible', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'kmasignado', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
         $this->hasColumn(
            'idgps', 'character varying', 255, array('notnull' => false, 'primary' => false)
        );
          $this->hasColumn(
            'idcategoriatransp', 'numeric', null, array('notnull' => false, 'primary' => false)
        );
    }

    public function Setup()
    {
        parent::setUp();
    }

}
