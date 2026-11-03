<?php

class NomDedo extends BaseNomDedo
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
     * @params $numdedo
     *
     * @return Doctrine_Record
     */
    public function getById($numdedo)
    {
        return Doctrine::getTable('NomDedo')->find($numdedo);
    }

    public function getCmbFingres()
    {
        try {
            $query = Doctrine_Query::create()->select(
                "iddedo,denominacion,descripcion,activo,numdedo,encode(imagen,'escape') as imagen "
            )->from('NomDedo');

            //->where('fdesde <= now() and (now() <= fhasta or fhasta is null)');
            return $query->execute()->toArray();
        } catch (Doctrine_Exception $e) {
            throw $e;
        }

    }

}

