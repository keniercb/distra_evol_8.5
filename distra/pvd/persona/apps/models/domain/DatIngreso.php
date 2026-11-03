<?php
/**
 * Created by PhpStorm.
 * User: olorenzo
 * Date: 17/06/16
 * Time: 16:13
 */
class DatIngreso extends BaseDatIngreso
{
    public function setUp()
    {
        parent:: setUp();
        $this->hasOne('NomTipoingreso', array('local' => 'idtipoingreso', 'foreign' => 'idtipoingreso'));
        $this->hasOne('DatFamiliar', array('local' => 'idfamiliar', 'foreign' => 'idfamiliar'));
    }
    
    public function obtenerPorId($idingreso)
    {
        return Doctrine::getTable('DatIngreso')->find($idingreso);
    }
    
    public function obtenerIngresoPorPersona($idpersona)
    {

        $query = Doctrine_Query::create()
            ->select('di.*, ntp.denominacion as tipoingreso')
            ->from('DatIngreso di')
            ->innerJoin('di.NomTipoingreso ntp')
            ->whereIn('di.idpersona', $idpersona);
        return $query->execute()->toArray();
    }

    public function getIngresosByNumid($numid)
    {
        //Buscar persona con numid como oficial
        $idpersona = $this->getPersonByNumid($numid);
        if (!empty($idpersona)) {
            $query = Doctrine_Query::create()
                ->select('di.*, ntp.denominacion as tipoingreso')
                ->from('DatIngreso di')
                ->innerJoin('di.NomTipoingreso ntp')
                ->whereIn('di.idpersona', $idpersona);
            $resp = $query->execute()->toArray();
        } else {
            $resp = [];
        }
        return $resp;
    }

    private function getPersonByNumid($numid)
    {
        $sql = "SELECT idpersona
        FROM mod_persona.dat_docidentidad 
        WHERE numero = '$numid' AND principal = 1 AND fdesde <= now() AND (fhasta >= now() OR fhasta IS NULL)";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        $per = $conn->fetchAll($sql);
        return $per[0]['idpersona'];
    }
}