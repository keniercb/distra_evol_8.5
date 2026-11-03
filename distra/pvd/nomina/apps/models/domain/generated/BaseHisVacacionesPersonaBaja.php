<?php


abstract class BaseHisVacacionesPersonaBaja extends Doctrine_Record
{

    public function setTableDefinition ()
    {

        $this->setTableName('mod_nomina.his_vacacionespersonabaja');

        $this->hasColumn('idhisvacacionespersonabaja', 'numeric', 19, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => true,
            'primary' => true,
            'sequence' => 'mod_nomina.sec_vacacionespersonabaja'
        ));

        $this->hasColumn('idpersonabaja', 'numeric', 19, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => true,
            'primary' => false
        ));

        $this->hasColumn('idnomina', 'numeric', 19, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => true,
            'primary' => false
        ));

        $this->hasColumn('tipooperacion', 'numeric', 19, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => true,
            'primary' => false
        ));

        $this->hasColumn('fechaoperacion', 'date', null, array(
            'type' => 'date',
            'length' => null,
            'notnull' => true,
            'primary' => false,
        ));

        $this->hasColumn('tiempoacumulado', 'numeric', 19, 2, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => true,
            'primary' => false
        ));

        $this->hasColumn('importeacumulado', 'numeric', 19, 2, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => true,
            'primary' => false
        ));

        $this->hasColumn('saldoentiempo', 'numeric', 19, 2, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => true,
            'primary' => false
        ));

        $this->hasColumn('saldoenimporte', 'numeric', 19, 2, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => true,
            'primary' => false
        ));
        $this->hasColumn('ajusteimporte', 'numeric', 19, 2, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => false,
            'primary' => false
        ));
        $this->hasColumn('ajustetiempo', 'numeric', 19, 2, array(
            'type' => 'numeric',
            'length' => 19,
            'notnull' => false,
            'primary' => false
        ));
        $this->hasColumn('tipoajuste', 'numeric', 1, 0, array(
            'type' => 'numeric',
            'length' => 1,
            'notnull' => false,
            'primary' => false
        ));
        $this->hasColumn('observaciones', 'character varying', 255, array(
            'type' => 'character varying',
            'length' => 255,
            'notnull' => false,
            'primary' => false,
        ));

        $this->hasColumn('periodo', 'character varying', 20, array(
            'type' => 'character varying',
            'length' => 20,
            'notnull' => false,
            'primary' => false,
        ));


    }

    public function setUp ()
    {

        parent::setUp();

    }
}
