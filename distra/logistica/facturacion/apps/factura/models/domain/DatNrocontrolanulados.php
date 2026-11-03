<?php

/**
 * Created by JetBrains PhpStorm.
 * User: yaisel
 * Date: 11/1/13
 * Time: 10:04 a.m.
 * To change this template use File | Settings | File Templates.
 */
class DatNrocontrolanulados extends BaseDatNrocontrolanulados
{

    public function setUp()
    {
        parent::setUp();
    }

    /**
     * @uthor       Jose Joel Perez Quevedo
     * @created     31/03/2014
     * @description Obtener todas los numeros de control anulados
     */
    public function getNrocontrolAnuladosEntreRangos($rango, $idestructura)
    {
        $conn = Doctrine_Manager::connection();
        $query = "SELECT cast(replace(d.nrocontrol, '-', '') as int) AS d
                FROM mod_logfacturacion.dat_nrocontrolanulados d
                where cast(replace(d.nrocontrol, '-', '') as int) >= :nroinicio 
                    and cast(replace(d.nrocontrol, '-', '') as int) <= :nrofin
                    and d.idestructura = {$idestructura}
                     order by d asc";
        $result = $conn->execute($query, $rango)
            ->fetchAll(PDO::FETCH_COLUMN);
        return array("total" => count($result), "anulados" => $result);
    }

    public function getNroControlAnulados($idestructura)
    {
        $query = Doctrine_Query::create()
            ->from("DatNrocontrolanulados")
            ->where("idestructura = ?", $idestructura)
            ->orderBy("cast(replace(nrocontrol, '-', '') as int) ASC")
            ->fetchArray();
        return $query;
    }
}
