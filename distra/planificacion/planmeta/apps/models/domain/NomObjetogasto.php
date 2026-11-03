<?php

class NomObjetogasto extends BaseNomObjetogasto {

    public function setUp() {
        parent::setUp();
    }

    public function obtenerOGLocal($idobjetogasto, $start = 0, $limit = 10, $filters = array()
    ) {
        $query = new Doctrine_Query();
        if (!empty($filters)) {
            foreach ($filters as $filter) {
                if ($filter ['data'] ['type'] == 'string') {
                    if ($filter ['field'] == 'denominacion') {
                        $query->addWhere(
                                "upper(og.denominacion) LIKE '%" . strtoupper(
                                        $filter ['data'] ['value']
                                ) . "%'"
                        );
                    } else {
                        if ($filter ['data'] ['type'] == 'string') {
                            if ($filter ['field'] == 'codigo') {
                                $query->addWhere(
                                        "upper(og.codigo) LIKE '%" . strtoupper(
                                                $filter ['data'] ['value']
                                        ) . "%'"
                                );
                            }
                        }
                    }
                }
            }
        }

        if ($idobjetogasto) {
            return $query->select('og.idobjetogasto,og.codigo,og.denominacion')
                            ->from('NomObjetogasto og')
                            ->where('og.idobjetogasto=?', $idobjetogasto)
                            ->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();
        } else {
            return $query->select('og.idobjetogasto,og.codigo,og.denominacion')
                            ->from('NomObjetogasto og')
                            ->limit($limit)
                            ->offset($start)
                            ->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();
        }
    }

    public function obtenerOGtotalLocal($idobjetogasto, $start = 0, $limit = 10, $filters = array()
    ) {
        $query = new Doctrine_Query();
        if (!empty($filters)) {
            foreach ($filters as $filter) {
                if ($filter ['data'] ['type'] == 'string') {
                    if ($filter ['field'] == 'denominacion') {
                        $query->addWhere(
                                "upper(og.denominacion) LIKE '%" . strtoupper(
                                        $filter ['data'] ['value']
                                ) . "%'"
                        );
                    } else {
                        if ($filter ['data'] ['type'] == 'string') {
                            if ($filter ['field'] == 'codigo') {
                                $query->addWhere(
                                        "upper(og.codigo) LIKE '%" . strtoupper(
                                                $filter ['data'] ['value']
                                        ) . "%'"
                                );
                            }
                        }
                    }
                }
            }
        }

        if ($idobjetogasto) {
            return $query->select('og.idobjetogasto,og.codigo,og.denominacion')
                            ->from('NomObjetogasto og')
                            ->where('og.idobjetogasto=?', $idobjetogasto)
                            ->count();
        } else {
            return $query->select('og.idobjetogasto,og.codigo,og.denominacion')
                            ->from('NomObjetogasto og')
                            ->limit($limit)
                            ->offset($start)
                            ->count();
        }
    }

    public function obtenerTodosObjetosGastosLocal($idtipogasto) {
        $query = new Doctrine_Query();
        if ($idtipogasto) {
            return $query->select('og.idobjetogasto,og.codigo,og.denominacion')
                            ->from('NomObjetogasto og')
                            ->whereIn('og.idobjetogasto', $idtipogasto)
                            ->orderBy('og.idobjetogasto')
                            ->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();
        } else {
            return $query->select('og.idobjetogasto,og.codigo,og.denominacion')
                            ->from('NomObjetogasto og')
                            ->orderBy('og.idobjetogasto')
                            ->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();
        }
    }

    public function obtenerObjetosGastosPadresLocal($long) {
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT objgasto.idobjetogasto, objgasto.denominacion,
  objgasto.codigo
  FROM mod_planificacion.nom_objetogasto objgasto
  where length(objgasto.codigo) = $long;";
        $array_result = $conn->fetchAssoc($sql); /* $conn->execute($sql)->fetchAll(PDO::FETCH_COLUMN) */;
        return $array_result;
    }

    public function obtenerObjetosGastosPadres() {
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT objgasto.idelementoobjeto as idobjetogasto, objgasto.descripcionelementoobjeto as denominacion,
  objgasto.codigoelementoobjeto as codigo
  FROM mod_contabilidadcosto.nom_elementogasto objgasto
  where objgasto.nivel = 1";
        $array_result = $conn->fetchAssoc($sql);
        return $array_result;
    }

    public function obtenerObjetosDeGastos() {
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT idelementoobjeto as idobjetogasto,codigoelementoobjeto,descripcionelementoobjeto as denominacion,idformato,
  nivel,replace(concat,'.','') as codigo,idtipo,concatpadre
FROM mod_contabilidadcosto.nom_elementogasto WHERE nivel = 3
ORDER BY codigo";
        $array_result = $conn->fetchAssoc($sql);
        return $array_result;
    }

    public function obtenerObjetosDeGastosTotal() {
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT count(idelementoobjeto) FROM mod_contabilidadcosto.nom_elementogasto";
        $array_result = $conn->fetchAssoc($sql);
        return $array_result;
    }

    public function obtenerObjetosGastosDadoPadreLocal($idobjetopadre) {
        $conn = Doctrine_Manager::connection();
        $sql = "WITH consulta AS
(SELECT objgasto.codigo
FROM mod_planificacion.nom_objetogasto objgasto
WHERE
objgasto.idobjetogasto IN ($idobjetopadre))
SELECT objgasto.codigo, objgasto.denominacion,objgasto.idobjetogasto
FROM mod_planificacion.nom_objetogasto objgasto
INNER JOIN consulta c ON substring(cast(objgasto.codigo as varchar(10)),1,2) = c.codigo
WHERE objgasto.codigo <> c.codigo";
        $result = $conn->fetchAssoc($sql);
        return $result;
    }

    public function obtenerObjetosGastosDadoPadre($idobjetopadre) {
        $conn = Doctrine_Manager::connection();
        $sql = "WITH consulta AS
(SELECT objgasto.idelementoobjeto
FROM mod_contabilidadcosto.nom_elementogasto objgasto
WHERE objgasto.idpadre IN ($idobjetopadre) AND nivel = 2)

SELECT replace(objgasto.concat,'.','') as codigo,objgasto.descripcionelementoobjeto as denominacion,
objgasto.idelementoobjeto as idobjetogasto
FROM mod_contabilidadcosto.nom_elementogasto objgasto
INNER JOIN consulta c ON objgasto.idpadre = c.idelementoobjeto
WHERE objgasto.nivel = 3 ORDER BY codigo";
        $result = $conn->fetchAssoc($sql);
        return $result;
    }

    public function obtenerObjGastoPadreLocal($codigoobjetopadre) {
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT objgasto.codigo,objgasto.denominacion
FROM mod_planificacion.nom_objetogasto objgasto
WHERE objgasto.codigo = cast($codigoobjetopadre as varchar(10))";
        $result = $conn->fetchAssoc($sql);
        return $result;
    }

    public function obtenerObjGastoPadre($codigoobjetopadre) {
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT objgato.codigoelementoobjeto as codigo, objgato.descripcionelementoobjeto as denominacion
FROM mod_contabilidadcosto.nom_elementogasto objgato
WHERE objgato.nivel = 1 AND objgato.codigoelementoobjeto = substring(cast($codigoobjetopadre as varchar(10)),1,2)";
        $result = $conn->fetchAssoc($sql);
        return $result;
    }

    public function obtenerOG($idobjetogasto) {
        $conn = Doctrine_Manager::connection();
        if ($idobjetogasto) {
            $sql = "SELECT objgato.codigoelementoobjeto as codigo, objgato.descripcionelementoobjeto as denominacion,COUNT(*) OVER() as total
                    FROM mod_contabilidadcosto.nom_elementogasto objgato
                            WHERE objgato.idelementoobjeto = $idobjetogasto";
        } else {
            $sql = "SELECT objgato.codigoelementoobjeto as codigo, objgato.descripcionelementoobjeto as denominacion,COUNT(*) OVER() as total
                    FROM mod_contabilidadcosto.nom_elementogasto objgato";
        }
        $result = $conn->fetchAssoc($sql);
        return $result;
    }

    public function obtenerOGPlanif($idobjetogasto) {
        $conn = Doctrine_Manager::connection();
        $sql = "SELECT objgato.codigo as codigo, objgato.denominacion as denominacion
FROM mod_planificacion.nom_objetogasto objgato
WHERE objgato.idobjetogasto = $idobjetogasto";
        $result = $conn->fetchAssoc($sql);
        return $result;
    }

}
