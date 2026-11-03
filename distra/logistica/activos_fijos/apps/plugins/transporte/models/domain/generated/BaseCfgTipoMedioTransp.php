<?php

abstract class BaseCfgTipoMedioTransp extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_logactivofijotangible.conf_tipomediotransp');
        $this->hasColumn(
            'idtipomediotransp', 'numeric', null, array('notnull' => true, 'primary' => true)
        );

        $this->hasColumn(
            'numchasis', 'numeric', null, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'nummatricula', 'numeric', null, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'numcirculacion', 'numeric', null, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'kmasignado', 'numeric', null, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'motor1', 'numeric', null, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'motor2', 'numeric', null, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'tipocombustible', 'numeric', null, array('notnull' => true, 'primary' => false)
        );
//        $this->hasColumn(
//            'capcarga', 'numeric', null,
//            array('notnull' => true, 'primary' => false)
//        );
        $this->hasColumn(
            'indicativo', 'numeric', null, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'indiceconsumo', 'numeric', null, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'nrollaveencendido', 'numeric', null, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'ficav', 'numeric', null, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'lot', 'numeric', null, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'capacidad', 'numeric', null, array('notnull' => true, 'primary' => false)
        ); $this->hasColumn(
            'endeposito', 'numeric', null, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'vin', 'numeric', null, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'vencimientoficav', 'numeric', null, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'vencimientolot', 'numeric', null, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'vencimientocirculacion', 'numeric', null, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'expedicioncirculacion', 'numeric', null, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'idcategoriatransp', 'numeric', null, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'cantpersonapie', 'numeric', null, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'cantpersonasentado', 'numeric', null, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'normacombustible', 'numeric', null, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'idgps', 'numeric', null, array('notnull' => true, 'primary' => false)
        );
    }

    public function Setup()
    {
        parent::setUp();
    }

}
