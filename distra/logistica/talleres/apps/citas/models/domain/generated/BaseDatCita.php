<?php

abstract class BaseDatCita extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_logtaller.dat_cita');
        $this->hasColumn(
            'idcita', 'numeric', 19,
            array('notnull' => true, 'primary' => true/*, 'sequence' => false*/)
        );
        $this->hasColumn('idcliente', 'numeric', 19, array('notnull' => false, 'primary' => false));
        $this->hasColumn('dinamicos', 'text', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('fechacita', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('fechaextimada', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idindicador', 'numeric', 19, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idplanificacionmantenimiento ', 'numeric', 19, array('notnull' => false, 'primary' => false));
        $this->hasColumn('cerradopor', 'numeric', 19, array('notnull' => false, 'primary' => false));
        $this->hasColumn('fechadocumento', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idtipoprecioactividad', 'numeric', 19, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idtipopreciopiezas', 'numeric', 19, array('notnull' => false, 'primary' => false));
        $this->hasColumn('horaentrada', 'time', 6, array('notnull' => false, 'primary' => false));
        $this->hasColumn('correo', 'character varying', 255, array('notnull' => false, 'primary' => false));
        $this->hasColumn('documentoorigen', 'numeric', 1, array('notnull' => false, 'primary' => false));
        $this->hasColumn('iddocumentoorigen', 'numeric', 19, array('notnull' => false, 'primary' => false));
        $this->hasColumn('telefono', 'character varying', 50, array('notnull' => false, 'primary' => false));
        $this->hasColumn('observacion', 'character varying', 255, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idpadreindicador', 'numeric', 19, array('notnull' => true, 'primary' => false));
        $this->hasColumn('nombreresponsable', 'character varying', 255, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idcarnetresponsable', 'numeric', 11, array('notnull' => true, 'primary' => false));
        $this->hasColumn('telefonoresponsable', 'numeric', 19, array('notnull' => false, 'primary' => false));
        $this->hasColumn('textocorreoresponsable', 'character varying', 255, array('notnull' => false, 'primary' => false));
    }


    public function Setup()
    {
        parent::setUp();
    }


}

//fin clase 

