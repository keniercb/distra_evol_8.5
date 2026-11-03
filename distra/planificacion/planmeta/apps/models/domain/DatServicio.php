<?php

class DatServicio extends BaseDatServicio
{

    public function setUp()
    {
        parent::setUp();
    }

    public function buscarServicio($idaplicacioncartatec, $idactividad,
                                   $formatoredultadocomoarray = false
    )
    {
        $query = Doctrine_Query::create();
        if ($formatoredultadocomoarray) {
            return $query->from('DatServicio ser')
                ->where(
                    'ser.idaplicacioncartatec = ? AND ser.idactividad = ?',
                    array($idaplicacioncartatec, $idactividad)
                )
                ->execute()->toArray(true);
        } else {
            return $query->from('DatServicio ser')
                ->where(
                    'ser.idaplicacioncartatec = ? AND ser.idactividad = ?',
                    array($idaplicacioncartatec, $idactividad)
                )
                ->execute();
        }
    }

    public function listarServicioDadoIdAplicAartaTecn($params)
    {
        $idapliccarta = $params['idaplicacioncartatec'];
        $start = $params['start'];
        $limit = $params['limit'];

        $query = "SELECT idaplicacioncartatec,idactividad,gasto FROM mod_spouam.dat_servicio ser WHERE ser.idaplicacioncartatec = $idapliccarta
                  OFFSET $start LIMIT $limit";

        $conn = Doctrine_Manager::connection();
        $res = $conn->execute($query);
        $result = $res->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    public function listarServicioDadoIdAplicAartaTecnTotal($params)
    {
        $idapliccarta = $params['idaplicacioncartatec'];

        $query = "SELECT COUNT(idaplicacioncartatec) as total FROM mod_spouam.dat_servicio ser WHERE ser.idaplicacioncartatec = $idapliccarta ";

        $conn = Doctrine_Manager::connection();
        $res = $conn->execute($query);
        $result = $res->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

}
