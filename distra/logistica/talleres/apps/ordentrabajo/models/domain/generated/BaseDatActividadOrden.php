<?php

abstract class BaseDatActividadOrden extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_logtaller.dat_ordenactividad');
        $this->hasColumn(
            'idordenactividad', 'numeric', 19,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_logtaller.sec_datactividad')
        );
        $this->hasColumn('idactividad', 'numeric', 19, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idordentrabajo', 'numeric', 19, array('notnull' => false, 'primary' => false));
        $this->hasColumn('denominacion', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('fechainicio', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('fechafin', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('tiempoplanificado', 'numeric', 19, array('notnull' => false, 'primary' => false));
        $this->hasColumn('tiemporeal', 'numeric', 25, array('notnull' => false, 'primary' => false));
        $this->hasColumn('costo', 'numeric', 19, array('notnull' => false, 'primary' => false));
        $this->hasColumn('tarifahora', 'numeric', 19, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idresponsable', 'numeric', 19, array('notnull' => false, 'primary' => false));
        $this->hasColumn('observacion', 'character varying', 255, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idarea', 'numeric', 19, array('notnull' => false, 'primary' => false));
        $this->hasColumn('prioridad', 'numeric', 10, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idpadre', 'numeric', 19, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idindicador', 'numeric', 19, array('notnull' => false, 'primary' => false));
        $this->hasColumn('importealternativo', 'numeric', 25, array('notnull' => false, 'primary' => false));
        $this->hasColumn('precio', 'numeric', 25, array('notnull' => false, 'primary' => false));
        $this->hasColumn('precioalternativo', 'numeric', 25, array('notnull' => false, 'primary' => false));
        $this->hasColumn('pendiente', 'numeric', 25, array('notnull' => false, 'primary' => false));
        $this->hasColumn('enproceso', 'numeric', 25, array('notnull' => false, 'primary' => false));
        $this->hasColumn('facturado', 'numeric', 25, array('notnull' => false, 'primary' => false));
        $this->hasColumn('um', 'varchar', 150, array('notnull' => false, 'primary' => false));
        $this->hasColumn('modificado', 'numeric', 1, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idcentrodecosto', 'numeric', 19, array('notnull' => false, 'primary' => false));
        $this->hasColumn('minutosactividad', 'numeric', 19, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idunidadmedida', 'numeric', 19, array('notnull' => false, 'primary' => false));
        $this->hasColumn('tempario', 'numeric', 19, array('notnull' => false, 'primary' => false));
    }

    public function Setup()
    {
        parent::setUp();
    }


}

//fin clase 

