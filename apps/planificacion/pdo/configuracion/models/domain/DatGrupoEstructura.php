<?php

/**
 * @author    Liermes Ferriol Mena
 * @version   1.0.0
 * @copyright UCID, ERP-CUBA
 */
class DatGrupoEstructura extends BaseDatGrupoEstructura
{
    public function setUp()
    {
        parent::setUp();
        $this->hasMany(
            'DatGrupo', array('local' => 'idgrupo', 'foreign' => 'idgrupo')
        );
    }

    public function BuscarEstructuraPorGrupo($idgrupo)
    {
        $query = Doctrine_Query::create();
        $resultado = $query->select('ge.idgrupo, ge.idestructura ')
            ->from('DatGrupoEstructura ge')
            ->where("ge.idgrupo = ?", $idgrupo)
            ->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
            ->execute();
        return $resultado;
    }

    public function EliminarEstructuraDelGrupo($idgrupo)
    {
        $query = Doctrine_Query::create();
        $query->delete('DatGrupoEstructura')
            ->from('DatGrupoEstructura')
            ->addWhere('idgrupo = ?', $idgrupo)
            ->execute();

    }

    public function BuscarDatosPoridestructura($arrayidestructuras)
    {
        $query = Doctrine_Query::create();
        $result = $query->select('ge.*')
            ->from('DatGrupoEstructura ge')
            ->whereIn("ge.idestructura ", $arrayidestructuras)
            ->execute();
        return $result->toArray();
    }

    public function ObtenerArrayIdGruposPoridestructuras($arrayidestructuras)
    {
        $query = Doctrine_Query::create();
        $result = $query->select('ge.idgrupo')
            ->from('DatGrupoEstructura ge')
            ->whereIn("ge.idestructura ", $arrayidestructuras)
            ->execute();
        return $result->toArray();
    }

    public function ObtenerArrayIdGruposPoridestructura($idestructura)
    {
        $cadena
            =
            "SELECT ge.idgrupo FROM mod_objetivos.dat_grupo_estructura ge WHERE ge.idestructura = "
            . $idestructura;

        $conn = Doctrine_Manager:: connection();
        $res = $conn->execute($cadena);
        $result = $res->fetchAll(PDO::FETCH_COLUMN);
        return $result;
    }


}//fin clase 
