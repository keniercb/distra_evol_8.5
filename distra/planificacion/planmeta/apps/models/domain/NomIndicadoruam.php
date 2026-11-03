<?php

class NomIndicadoruam extends BaseNomIndicadoruam {

    public function setUp() {
        parent::setUp();
    }

    public function listarIndicadoresUAM($start, $limit, $params) {
        $query = new Doctrine_Query();
        $queryTotal = new Doctrine_Query();
        if (is_array($params)) {
            foreach ($params as $key => $value) {
                if ($value != null) {
                    if ($key == 'naturaleza') {
                        $query->addWhere("niu.idnaturalezauam = ?", $value);
                        $queryTotal->addWhere(
                                "niu.idnaturalezauam = ?", $value
                        );
                    } elseif ($key == 'nivel') {
                        $query->addWhere("indpla.nivel = ?", $value);
                        $queryTotal->addWhere("indpla.nivel = ?", $value);
                    } elseif ($key == 'codigo') {
                        $query->addWhere("indpla.codigo  LIKE ? ", ("$value%"));
                        $queryTotal->addWhere(
                                "indpla.codigo  LIKE ? ", ("$value%")
                        );
                    } elseif ($key == 'denominacion') {
                        $query->addWhere(
                                "upper(indpla.denominacion)  LIKE ? ", ("%" . strtoupper($value) . "%")
                        );
                        $queryTotal->addWhere(
                                "upper(indpla.denominacion)  LIKE ? ", ("%" . strtoupper($value) . "%")
                        );
                    } elseif ($key == 'idumedida') {
                        $query->addWhere("indpla.idumedida = ?", $value);
                        $queryTotal->addWhere("indpla.idumedida = ?", $value);
                    } elseif ($key == 'iddepreciacion') {
                        $query->addWhere("idtp.idtipodepreciacion = ?", $value);
                        $queryTotal->addWhere(
                                "idtp.idtipodepreciacion = ?", $value
                        );
                    } elseif ($key == 'precio_condicion1' || $key == 'precio_condicion2' || $key == 'precio_condicion3'
                    ) {
                        $query->addWhere(
                                " nipf.precio" . $value['condicion'] . " ? ", $value['precio']
                        );
                        $queryTotal->addWhere(
                                " nipf.precio" . $value['condicion'] . " ? ", $value['precio']
                        );
                    } elseif ($key == 'idnaturalezauam') {
                        $query->addWhere("niu.idnaturalezauam = ?", $value);
                        $queryTotal->addWhere(
                                "niu.idnaturalezauam = ?", $value
                        );
                    } elseif ($key == 'idfuenteenergia') {
                        $query->addWhere("niu.idfuenteenergia = ?", $value);
                        $queryTotal->addWhere(
                                "niu.idfuenteenergia = ?", $value
                        );
                    } elseif ($key == 'consumoenergia_condicion1' || $key == 'consumoenergia_condicion2' || $key == 'consumoenergia_condicion3'
                    ) {
                        $query->addWhere(
                                " niu.consumoenergia" . $value['condicion'] . " ? ", $value['consumoenergia']
                        );
                        $queryTotal->addWhere(
                                " niu.consumoenergia" . $value['condicion'] . " ? ", $value['consumoenergia']
                        );
                    } elseif ($key == 'depreciacion_condicion1' || $key == 'depreciacion_condicion2' || $key == 'depreciacion_condicion3'
                    ) {
                        $query->addWhere(
                                " niu.depreciacion" . $value['condicion'] . " ? ", $value['depreciacion']
                        );
                        $queryTotal->addWhere(
                                " niu.depreciacion" . $value['condicion'] . " ? ", $value['depreciacion']
                        );
                    } elseif ($key == 'capacidad_condicion1' || $key == 'capacidad_condicion2' || $key == 'capacidad_condicion3'
                    ) {
                        $query->addWhere(
                                " niu.capacidad" . $value['condicion'] . " ? ", $value['capacidad']
                        );
                        $queryTotal->addWhere(
                                " niu.capacidad" . $value['condicion'] . " ? ", $value['capacidad']
                        );
                    } elseif ($key == 'seguro_condicion1' || $key == 'seguro_condicion2' || $key == 'seguro_condicion3'
                    ) {
                        $query->addWhere(
                                " niu.seguro" . $value['condicion'] . " ? ", $value['seguro']
                        );
                        $queryTotal->addWhere(
                                " niu.seguro" . $value['condicion'] . " ? ", $value['seguro']
                        );
                    }
                }
            }
        }
        $result->data = $query->select(
                        "niu.*,
                                                indpla.idumedida,
                                                indpla.denominacion,
                                                indpla.codigo,
                                                indpla.numeropieza,
                                                nipf.precio,
                                                idtp.idtipodepreciacion"
                )
                ->from(
                        "NomIndicadoruam niu,niu.NomIndicador indpla,
                indpla.NomIndicadorplanif nipf,
                niu.DatIndicadoruamtipodepreciacion idtp"
                )
                ->offset($start)
                ->limit($limit)
                //  $r=$query->getSqlQuery();
                ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
                ->execute();

        $result->total = $queryTotal->select("COUNT(niu.idindicador)")
                ->from(
                        "NomIndicadoruam niu,niu.NomIndicador indpla,niu.DatIndicadoruamtipodepreciacion idtp"
                )
                ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
                ->execute();

        return $result;
    }

    public function getObjectIndicadorUam($idindicador) {
        $query = new Doctrine_Query();
        $res = $query
                ->from('DatAjustedemanda dad')
                ->where('dad.idindicador =? ', $idindicador)
                ->execute()
                ->getFirst();
        return $res;
    }

    public function getIndicadorUam($idindicador) {
        $query = new Doctrine_Query();
        $res = $query
                ->from('NomIndicadoruam inu')
                ->where('inu.idindicador =? ', $idindicador)
                ->execute()
                ->getFirst();
        return $res;
    }

}
