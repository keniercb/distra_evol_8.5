<?php

class DatUsuarioIncidencia extends BaseDatUsuarioIncidencia
{

    public function setUp()
    {
        parent:: setUp();
    }

    public function getByid($idincidencia)
    {
        $cadena
            = "SELECT *
            FROM mod_objetivos.dat_usuario_incidencia
            WHERE dat_usuario_incidencia.idincidencia = '$idincidencia'";
        $connA = Doctrine_Manager:: connection();
        $res = $connA->execute($cadena);
        $result = $res->fetchAll();
        return $result;
    }

    public function getByusuario($idusuario)
    {
        $cadena
            = "SELECT dat_usuario_incidencia.idincidencia
            FROM mod_objetivos.dat_usuario_incidencia
            WHERE dat_usuario_incidencia.idusuario = '$idusuario'";
        $connA = Doctrine_Manager:: connection();
        $res = $connA->execute($cadena);
        $result = $res->fetchAll();
        return $result;
    }

    public function EliminarUsuarioIncidencia($idincidencia)
    {
        $query = new Doctrine_Query();
        $result = $query->delete('DatUsuarioIncidencia')
            ->where("idincidencia = ?", $idincidencia)
            ->execute();
        return $result;
    }

    public function DameUsuarioConIdIncidencia($idincidencia)
    {
        $cadena
            = "SELECT dat_usuario_incidencia.idusuario
            FROM mod_objetivos.dat_usuario_incidencia
            WHERE dat_usuario_incidencia.idincidencia = '$idincidencia'";
        $connA = Doctrine_Manager:: connection();
        $res = $connA->execute($cadena);
        $result = $res->fetchAll();

        return $result;

    }

    public function publicos($idincidencia, $idgrupo)
    {
        $cadena
            = "SELECT dat_usuario_incidencia.idincidencia
            FROM mod_objetivos.dat_usuario_incidencia
            WHERE dat_usuario_incidencia.idusuario ='$idgrupo'  
            AND dat_usuario_incidencia.idincidencia = '$idincidencia'";
        $connA = Doctrine_Manager:: connection();
        $res = $connA->execute($cadena);
        $result = $res->fetchAll();
        return $result;

    }
}

