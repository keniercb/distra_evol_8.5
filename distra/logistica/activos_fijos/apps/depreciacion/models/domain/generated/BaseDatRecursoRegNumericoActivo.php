<?php

class BaseDatRecursoRegNumericoActivo extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_logactivofijotangible.dat_recursoregnumericoactivo');
        $this->hasColumn('idrecursoregnumericoactivo', 'numeric', null, array('notnull' => true, 'primary' => true));
        $this->hasColumn('idregnumericoactivo', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('cantidad', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('cantentregadacomb', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('endeposito', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('consumo', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('lecturarecurso', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('fecha', 'date', null, array('notnull' => true, 'primary' => false));
       // $this->hasColumn('odometro', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('manual', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('depreciar', 'numeric', null, array('notnull' => true, 'primary' => false));
    }

    public function setUp()
    {
        parent::setUp();
    }

}
