<?php

abstract class BaseDatOrdenTrabajo extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_logtaller.dat_ordentrabajo');
        $this->hasColumn('idordentrabajo', 'numeric', 19, array('notnull' => true, 'primary' => true));
        $this->hasColumn('fechainicio', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('fechafin', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('dictamentecnico', 'character varying', 255, array('notnull' => false, 'primary' => false));
        $this->hasColumn('garantia', 'numeric', 1, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idagencia', 'numeric', 19, array('notnull' => false, 'primary' => false));
        $this->hasColumn('fallascliente', 'character varying', 255, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idtecnico', 'numeric', 19, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idcliente', 'numeric', 19, array('notnull' => false, 'primary' => false));
        $this->hasColumn('importe', 'numeric', 19, 6, array('notnull' => false, 'primary' => false));
        $this->hasColumn('cantidadreclamaciones', 'numeric', 19, 6, array('notnull' => false, 'primary' => false));
        $this->hasColumn('estadoorden', 'numeric', 1, array('notnull' => false, 'primary' => false));
        $this->hasColumn('iddocumentoorigen', 'numeric', 19, array('notnull' => false, 'primary' => false));
        $this->hasColumn('documentoorigen', 'numeric', 1, array('notnull' => false, 'primary' => false));
        $this->hasColumn('tipo', 'numeric', 1, array('notnull' => false, 'primary' => false));
        $this->hasColumn(
            'atributoidentificador', 'character varying', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn('fechacierre', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idplanificacionmantenimiento', 'numeric', 19, array('notnull' => false, 'primary' => false));
        $this->hasColumn('importealternativo', 'numeric', 19, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idtipoprecio', 'numeric', 19, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idtipopreciomat', 'numeric', 19, array('notnull' => false, 'primary' => false));
        $this->hasColumn('cerradopor', 'numeric', 19, array('notnull' => false, 'primary' => false));
        $this->hasColumn('fechacomienzo', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('fechaterminacion', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('correocliente', 'character varying', 255, array('notnull' => false, 'primary' => false));
        $this->hasColumn('telefono', 'character varying', 50, array('notnull' => false, 'primary' => false));
        $this->hasColumn('cicliente', 'numeric', 11, array('notnull' => false, 'primary' => false));
        $this->hasColumn('movil', 'character varying', 50, array('notnull' => false, 'primary' => false));
        $this->hasColumn('nombrecliente', 'character varying', 255, array('notnull' => false, 'primary' => false));
        $this->hasColumn('nombreresponsable', 'character varying', 255, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idcarnetresponsable', 'character varying', 11, array('notnull' => true, 'primary' => false));
        $this->hasColumn('telefonoresponsable', 'character varying', 19, array('notnull' => false, 'primary' => false));
        $this->hasColumn('textocorreoresponsable', 'character varying', 255, array('notnull' => false, 'primary' => false));
        $this->hasColumn('ubicacionactual', 'numeric', 19, array('notnull' => false, 'primary' => false));

        $this->hasColumn('nrodoc', 'numeric', 19, array('notnull' => false, 'primary' => false));
        $this->hasColumn('iddoc', 'numeric', 19, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idestructuracomun', 'numeric', 19, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idejercicio', 'numeric', 19, array('notnull' => false, 'primary' => false));
        $this->hasColumn('flag', 'numeric', 19, array('notnull' => false, 'primary' => false));

        }

    public function Setup()
    {
        parent::setUp();
    }


}

//fin clase 

