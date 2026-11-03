<?php

abstract class BaseConfGeneralFarm extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_logfarmacia.conf_generalfm');

        $this->hasColumn(
            'idgeneralfm', 'numeric', null,
            array('notnull' => true, 'primary' => true, 'sequence' => "mod_logfarmacia.sec_confgeneralfm")
        );

        $this->hasColumn('minimo', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('fondofijo', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('reserva', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('normabast', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('minarea', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('ptoreposicion', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('diaconsignado', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('diaminvencido', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('diamintarjeta', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('diaproxvencer', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('lotevencido', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idalmacen', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idareaventa', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idreserva', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idretenido', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idalmacenusuf', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('iddispensario', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idreservmob', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idestructura', 'numeric', null, array('notnull' => false, 'primary' => false));
    }

    public function Setup()
    {
        parent::setUp();
    }

}
