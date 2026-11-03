<?php


class BaseDatPiefirmadocumento extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_logistica.dat_piefirmadocumento');

        $this->hasColumn(
            'iddocumento', 'numeric', null,
            array
            (
                'notnull'  => true, 'primary' => true
            )
        );
        $this->hasColumn('nombrecreadopor', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('cargocreadopor', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('cicreadopor', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('nombreaprobadopor', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('cargoaprobadopor', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('ciaprobadopor', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('nombrecontabilizadopor', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('cargocontabilizadopor', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('cicontabilizadopor', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('nombretransportadopor', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('cargotransportadopor', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('citransportadopor', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('nombreentregadopor', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('cargoentregadopor', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('cientregadopor', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('nombrerecibido', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('cargorecibido', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('cirecibido', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('nombreautorizadopor', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('cargoautorizadopor', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('ciautorizadopor', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('nombreconciliadopor', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('cargoconciliadopor', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('ciconciliadopor', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('nombrefacturadopor', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('cargofacturadopor', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('cifacturadopor', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('nombresolicitadopor', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('cargosolicitadopor', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('cisolicitadopor', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('nombrerevisadopor', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('cargorevisadopor', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('cirevisadopor', 'character varying', null, array('notnull' => false, 'primary' => false));
    }

    public function Setup()
    {
        parent::setUp();
    }
}