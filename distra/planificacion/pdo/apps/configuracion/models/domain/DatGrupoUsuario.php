<?php

/**
 * @author    Liermes Ferriol Mena
 * @version   1.0.0
 * @copyright UCID, ERP-CUBA
 */
class DatGrupoUsuario extends BaseDatGrupoUsuario
{
    public function setUp()
    {
        parent::setUp();
        $this->hasMany(
            'DatGrupo', array('local' => 'idgrupo', 'foreign' => 'idgrupo')
        );
    }

    public function BuscarUsuariosPorGrupo($idgrupo)
    {
        $query = Doctrine_Query::create();
        $resultado = $query->select('gu.idgrupo, gu.idusuario ')
        ->from('DatGrupoUsuario gu')
        ->where("gu.idgrupo = ?", $idgrupo)
        ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
        ->execute();
        return $resultado;
    }

    public function EliminarUsuariosDelGrupo($idgrupo)
    {
        $query = Doctrine_Query::create();
        $query->delete('DatGrupoUsuario')
            ->from('DatGrupoUsuario')
            ->addWhere('idgrupo = ?', $idgrupo)
            ->execute();

    }

    public function BuscarDatosPorIdUsuario($arrayidusuarios)
    {
        $query = Doctrine_Query::create();
        $result = $query->select('gu.*')
            ->from('DatGrupoUsuario gu')
            ->whereIn("gu.idusuario ", $arrayidusuarios)
            ->execute();
        return $result->toArray();
    }

    public function ObtenerArrayIdGruposPorIdUsuarios($arrayidusuarios)
    {
        $query = Doctrine_Query::create();
        $result = $query->select('gu.idgrupo')
            ->from('DatGrupoUsuario gu')
            ->whereIn("gu.idusuario ", $arrayidusuarios)
            ->execute();
        return $result->toArray();
    }

    public function ObtenerArrayIdGruposPorIdUsuario($idusuario)
    {
        $cadena = " SELECT gu.idgrupo
                    FROM mod_objetivos.dat_grupousuario gu
                    WHERE gu.idusuario = " . $idusuario;
        $conn = Doctrine_Manager:: connection();
        $res = $conn->execute($cadena);
        $result = $res->fetchAll(PDO::FETCH_COLUMN);
        return $result;
    }


}//fin clase 
