<?php

class DatEstructuraIncidencia extends BaseDatEstructuraIncidencia
{

    public function setUp()
    {
        parent:: setUp();
    }

    public function getByid($idincidencia)
    {
        $cadena
            = "SELECT *
        FROM mod_objetivos.dat_estructura_incidencia
        WHERE  dat_estructura_incidencia.idincidencia = '$idincidencia'";
        $connA = Doctrine_Manager:: connection();
        $res = $connA->execute($cadena);
        $result = $res->fetchAll();
        return $result;
    }

    public function EliminarEstructuraIncidencia($idincidencia)
    {
        $query = new Doctrine_Query();
        $result = $query->delete('DatEstructuraIncidencia')
            ->where("idincidencia = ?", $idincidencia)
            ->execute();
        return $result;
    }

    public function DameEstructuraConIdIncidencia($idincidencia)
    {
        $cadena
            = "SELECT dat_estructura_incidencia.idestructura
            FROM mod_objetivos.dat_estructura_incidencia
            WHERE dat_estructura_incidencia.idincidencia =  '$idincidencia'";
        $connA = Doctrine_Manager:: connection();
        $res = $connA->execute($cadena);
        $result = $res->fetchAll();
        return $result;

    }

    public function publicos($idincidencia, $idgrupo)
    {
        $cadena
            = "SELECT dat_estructura_incidencia.idincidencia
            FROM mod_objetivos.dat_estructura_incidencia
            WHERE dat_estructura_incidencia.idestructura = '$idgrupo' 
            AND dat_estructura_incidencia.idincidencia =  '$idincidencia'";
        $connA = Doctrine_Manager:: connection();
        $res = $connA->execute($cadena);
        $result = $res->fetchAll();
        return $result;
    }
}

