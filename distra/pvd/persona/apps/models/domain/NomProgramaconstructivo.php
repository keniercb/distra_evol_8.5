<?php

class NomProgramaconstructivo extends BaseNomProgramaconstructivo
{

    /**
     * Constructor
     */
    public function setUp()    {
        parent:: setUp();
        $this->hasOne('DatSituacionlaboral', array('local' => 'idprogramalaboral', 'foreign' => 'idprogramalaboral'));
    }

    /**
     * Devuelve un objeto de la clase
     * @params $idtalla
     *
     * @return Doctrine_Record
     */
    public function getById($idprogramalaboral)
    {
        return Doctrine::getTable('NomProgramaconstructivo')->find($idprogramalaboral);
    }
    public function getProgramaconstructivo(){
        $query = new Doctrine_Query ();
        $result = $query->select('idprogramalaboral,denominacion ')
            ->from('NomProgramaconstructivo ');
        return $result->fetchArray();
    }

    public function getProgramaconstructivoxidsituacion($idsituacionlaboral){

        $query = new Doctrine_Query ();
        $result = $query->select('d.idprogramalaboral,d.denominacion,s.idsituacionlaboralp as idsituacionlaboralp ')
            ->from('NomProgramaconstructivo d')
             ->leftJoin('d.DatSituacionlaboral s')
            ->where("s.idsituacionlaboralp = $idsituacionlaboral");
        return $result->fetchArray();
    }


}

