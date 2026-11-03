<?php

class NomEspecificacionnivel extends BaseNomEspecificacionnivel
{

    /**
     * Constructor
     */
    public function setUp()
    {
        parent:: setUp();
    }

    /**
     * Devuelve un objeto de la clase
     * @params $fhasta
     *
     * @return Doctrine_Record
     */
    public function getById($fhasta)
    {
        return Doctrine::getTable('NomEspecificacionnivel')->find($fhasta);
    }

}

