<?php

class NomAreatematicaempresa extends BaseNomAreatematicaempresa
{

    /**
     * Constructor
     */
    public function setUp()
    {
        parent:: setUp();
        
    }

    public function getById($idareatematicaempresa)
    {
        return Doctrine::getTable('NomAreatematicaempresa')->find($idareatematicaempresa);
    }


}

