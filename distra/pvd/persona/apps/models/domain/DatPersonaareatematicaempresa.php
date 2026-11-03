<?php

/**
 * Class DatContacto
 */
class DatPersonaareatematicaempresa extends BaseDatPersonaareatematicaempresa
{

    /**
     * Constructor
     */
    public function setUp()
    {
        parent:: setUp();
        $this->hasOne('DatPersona', array('local' => 'idpersona', 'foreign' => 'idpersona'));
        $this->hasOne('NomAreatematicaempresa', array('local' => 'idareatematicaempresa', 'foreign' => 'idareatematicaempresa'));        
    }

    /**
     * Devuelve un objeto de la clase
     * @params $idcontacto
     *
     * @return Doctrine_Record
     */
    public function getById(array $idcontacto)
    {
        if (count($idcontacto) > 0) {
            $query = Doctrine_Query::create()->from('DatPersonaareatematicaempresa')->whereIn('idpersonaareatematicaempresa', $idcontacto);

            return $query->execute();
        }
    }

   
}

