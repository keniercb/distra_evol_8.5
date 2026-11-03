<?php

class DatProyectorol extends BaseDatProyectorol
{

    /**
     * Constructor
     */
    public function setUp()
    {
        parent:: setUp();
        $this->hasOne('DatProyectoconcepto', array('local' => 'idproyectoconcepto', 'foreign' => 'idproyectoconcepto'));
    }

    /**
     * Devuelve un objeto de la clase
     * @params $idproyectorol
     *
     * @return Doctrine_Record
     */
    public function getById(array $idproyectorol)
    {
        try {
            if (count($idproyectorol) > 0) {
                $query = Doctrine_Query::create()->from('DatProyectorol')->whereIn('idproyectorol', $idproyectorol);

                return $query->execute();
            }
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }
}

