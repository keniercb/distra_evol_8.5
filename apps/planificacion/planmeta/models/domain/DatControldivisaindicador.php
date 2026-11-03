<?php

class DatControldivisaindicador extends BaseDatControldivisaindicador
{

    public function listarindicadoresCD($parametros, $start, $limit)
    {
        $query = new Doctrine_Query();
        $queryTotal = new Doctrine_Query();
        foreach ($parametros as $p => $s) {
            if ($s != '') {
                if ($p == 'denominacion') {
                    $query->addWhere(
                        "upper(n.denominacion) LIKE '%" . strtoupper($s) . "%'"
                    );
                    $queryTotal->addWhere(
                        "upper(n.denominacion) LIKE '%" . strtoupper($s) . "%'"
                    );
                } else {
                    if ($p == 'codigo') {
                        $query->addWhere("n.codigo LIKE ? ", ("$s%"));
                        $queryTotal->addWhere("n.codigo LIKE ? ", ("$s%"));
                    } else {
                        if ($p == 'descripcion') {
                            $query->addWhere(
                                "upper(n.descripcion) LIKE '%" . strtoupper($s)
                                . "%'"
                            );
                            $queryTotal->addWhere(
                                "upper(n.descripcion) LIKE '%" . strtoupper($s)
                                . "%'"
                            );
                        } else {
                            if ($p == 'color') {
                                $query->addWhere("r.$p=?", $s);
                                $queryTotal->addWhere("r.$p=?", $s);
                            }
                        }
                    }
                }
            }
        }
        $data->data = $query->select(
            "n.idcontroldivisa,n.codigo,n.denominacion,n.descripcion"
        )->from("DatControldivisaindicador n")->orderby("n.codigo")
            ->offset($start)->limit($limit)
            ->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();
        $data->total = $queryTotal->select("COUNT(DISTINCT n.idcontroldivisa)")
            ->from("DatControldivisaindicador n")
            ->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();
        return $data;
    }

    public function GetIndByID($id)
    {
        $query = new Doctrine_Query();
        $data = $query->select(
            "n.idcontroldivisaindicadormodelo,n.idcontroldivisa"
        )->from("DatControldivisaindicadormodelo n")
            ->where("n.idindicador=?", $id)
            ->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();
        return $data;
    }

    public function listarUM()
    {
        $cadenaSELECT = " SELECT um.nombreum,um.idumedida ";
        $cadenaJOIN = " FROM mod_datosmaestros.dat_unidadmedida um ";
        $cadenaQUERY = $cadenaSELECT . $cadenaJOIN;
        $conex = Doctrine_Manager:: connection();
        $result = $conex->execute($cadenaQUERY)->fetchAll();
        return $result;
    }

    public function eliminarAsociaciones($arrayToDelete)
    {
        $query = new Doctrine_Query();
        $data = $query->delete("DatControldivisaindicador n")
            ->whereIn("n.idcontroldivisa", $arrayToDelete)->execute();
        return $data;
    }

    public function setUp()
    {
        parent::setUp();
    }

}
