<?php

/**
 * Class DatContactoModel
 */
class DatPersonaareatematicaempresaModel extends ZendExt_Model implements IConceptoExport
{
    /**
     * @var DatContacto
     */
    protected $objContacto;
    /**
     *
     */
    function __construct()
    {
        $this->objContacto = new DatPersonaareatematicaempresa();
    }

    /**
     *
     */
    public function setUp()
    {
        parent::ZendExt_Model();
    }
   
}

