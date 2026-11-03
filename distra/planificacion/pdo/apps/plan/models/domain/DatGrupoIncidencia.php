<?php

class DatGrupoIncidencia extends BaseDatGrupoIncidencia
{

    public function setUp()
    {
        parent:: setUp();
    }

    public function getByid($idincidencia)
    {
        $cadena
            = "SELECT *
        FROM mod_objetivos.dat_grupo_incidencia
        WHERE dat_grupo_incidencia.idincidencia = '$idincidencia'";
        $connA = Doctrine_Manager:: connection();
        $res = $connA->execute($cadena);
        $result = $res->fetchAll();
        return $result;
    }

    public function getBygrupo($idgrupo)
    {
        $cadena
            = "SELECT dat_grupo_incidencia.idincidencia
        FROM mod_objetivos.dat_grupo_incidencia
        WHERE dat_grupo_incidencia.idgrupo = '$idgrupo'";
        $connA = Doctrine_Manager:: connection();
        $res = $connA->execute($cadena);
        $result = $res->fetchAll();
        return $result;
    }

    public function EliminarGrupoIncidencia($idincidencia)
    {
        $query = new Doctrine_Query();
        $result = $query->delete('DatGrupoIncidencia')
            ->where("idincidencia = ?", $idincidencia)
            ->execute();
        return $result;
    }

    public function DameGrupoConIdIncidencia($idincidencia)
    {
        $cadena
            = "SELECT dat_grupo.dengrupo,dat_grupo.idgrupo
        FROM mod_objetivos.dat_grupo_incidencia, mod_objetivos.dat_grupo
        WHERE dat_grupo.idgrupo = dat_grupo_incidencia.idgrupo 
        AND dat_grupo_incidencia.idincidencia = '$idincidencia'";
        $connA = Doctrine_Manager:: connection();
        $res = $connA->execute($cadena);
        $result = $res->fetchAll();
        return $result;

    }

    public function publicos($idincidencia, $idgrupo)
    {
        $cadena
            = "SELECT dat_grupo_incidencia.idincidencia
        FROM mod_objetivos.dat_grupo_incidencia
        WHERE dat_grupo_incidencia.idgrupo = '$idgrupo' 
        AND dat_grupo_incidencia.idincidencia =  '$idincidencia'";
        $connA = Doctrine_Manager:: connection();
        $res = $connA->execute($cadena);
        $result = $res->fetchAll();
        return $result;
    }

}

