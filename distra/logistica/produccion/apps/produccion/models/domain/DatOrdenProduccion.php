<?php

class DatOrdenProduccion extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_logproduccion.dat_ordenproduccion');
        $this->hasColumn('idordenproduccion', 'numeric', 19, array('notnull' => true, 'primary' => true));
        $this->hasColumn('idcliente', 'numeric', 19, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idcontrato', 'numeric', 19, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idcentrogrupo', 'numeric', 19, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idnomconcepto', 'numeric', 19, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idcartatecnologica', 'numeric', 19, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idalmacendestino', 'numeric', 19, array('notnull' => false, 'primary' => false));
        $this->hasColumn('nrolote', 'string', 255, array('notnull' => false, 'primary' => false));
        $this->hasColumn('cantidad', 'numeric', 25, array('notnull' => false, 'primary' => false));
        $this->hasColumn('cerradopor', 'date', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('fechacierre', 'date', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('fechainicio', 'date', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('fechafin', 'date', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('desagregado', 'numeric', 19, array('notnull' => false, 'primary' => false));
    }

    public function setUp()
    {
        $this->hasOne('NomCentroGrupo', array('local' => 'idcentrogrupo', 'foreign' => 'idcentrogrupo'));
        $this->hasMany('DatValeProduccion', array('local' => 'idordenproduccion', 'foreign' => 'idordenproduccion'));
        $this->hasMany('DatOrdenMateriaPrima', array('local' => 'idordenproduccion', 'foreign' => 'idordenproduccion'));
        $this->hasOne('NomConcepto', array('local' => 'idnomconcepto', 'foreign' => 'idnomconcepto'));
        $this->hasOne('DatDocumento', array('local' => 'iddocumento', 'foreign' => 'idordenproduccion'));
        

    }
}
//