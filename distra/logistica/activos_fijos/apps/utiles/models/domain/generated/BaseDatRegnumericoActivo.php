<?php

/**
 *    Jorge Luis Cuellar Mondeja 28/10/2011
 */
class BaseDatRegnumericoActivo extends Doctrine_Record
{

    /**
     *
     */
    public function setTableDefinition()
    {
        $this->setTableName('mod_logactivofijotangible.dat_regnumericoactivo');
        $this->hasColumn('idregnumerico', 'numeric', null, array('notnull' => true, 'primary' => true));
        $this->hasColumn('nroinventario', 'character varying', 255, array('notnull' => false, 'primary' => false));
        $this->hasColumn('depreciacionacumulada', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('depreciacionacumuladaalternativo', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('vidautil', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('tasafiscal', 'numeric', null, array('notnull' => false, 'primary' => false));
        //$this->hasColumn('tasafiscalalternativo', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('porcientorecuperacion', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('valorcontable', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('valorcontablealternativo', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('valoradquisicion', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('valoradquisicionalternativo', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('fechaexpini', 'date', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('fechaexpfin', 'date', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('fechaadq', 'date', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idtabla', 'numeric', null, array('notnull' => false, 'primary' => false));
        // $this->hasColumn('garantia', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idarearesp', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('annofabricacion', 'numeric', 4, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idcolorprim', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idcolorsec', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idcentrocosto', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idestatustecnico', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idubicacion', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('asignado', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('esmodulo', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idpadre', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('ordender', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('ordenizq', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idarbol', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idactividad', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idcategoria', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('esbaja', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('estaentidad', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idresponsable', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('plantilla', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('valormodulo', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('valormoduloalternativo', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('recursoconsumido', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('cantidadrecursoconsumido', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idestadoperacion', 'numeric', null, array('notnull' => false, 'primary' => false));
        /* campos para la garantia */
        $this->hasColumn('recursoconsumidomax', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('fechainicialgarantia', 'date', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('fechafingarantia', 'date', null, array('notnull' => false, 'primary' => false));
       // $this->hasColumn('registro', 'character varying', 20, array('notnull' => false, 'primary' => false));
        $this->hasColumn('importe', 'numeric', null, array('notnull' => false, 'primary' => false));
      // no $this->hasColumn('usufructo', 'character varying', 100, array('notnull' => false, 'primary' => false));
        $this->hasColumn('arrendado', 'numeric', 1, array('notnull' => false, 'primary' => false));
        $this->hasColumn('parentpath', 'string', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('datos', 'json', null, array('notnull' => false, 'primary' => false));
         $this->hasColumn('idgruposubgrupo', 'numeric', null, array('notnull' => false, 'primary' => false));
         $this->hasColumn('idnaturaleza', 'numeric', null, array('notnull' => false, 'primary' => false));
         $this->hasColumn('denominacion', 'character varying', 255, array('notnull' => false, 'primary' => false));
         $this->hasColumn('idgruposubgrupoold', 'numeric', null, array('notnull' => false, 'primary' => false));
         $this->hasColumn('actividad', 'character varying', 255, array('notnull' => false, 'primary' => false));
         $this->hasColumn('colorprim', 'character varying', 255, array('notnull' => false, 'primary' => false));
         $this->hasColumn('colorsec', 'character varying', 255, array('notnull' => false, 'primary' => false));
         $this->hasColumn('denomestadotecnico', 'character varying', 255, array('notnull' => false, 'primary' => false));
         $this->hasColumn('vidautil', 'numeric', null, array('notnull' => false, 'primary' => false));
         $this->hasColumn('tasafiscal', 'numeric', null, array('notnull' => false, 'primary' => false));
         $this->hasColumn('porcientorecuperacion', 'numeric', null, array('notnull' => false, 'primary' => false));
         $this->hasColumn('categoria', 'character varying', 255, array('notnull' => false, 'primary' => false));
         $this->hasColumn('denomarearesp', 'character varying', 255, array('notnull' => false, 'primary' => false));
         $this->hasColumn('valorresidual', 'numeric', null, array('notnull' => false, 'primary' => false));
    }

    public function setUp()
    {
        parent::setUp();
    }

}
