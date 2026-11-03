<?php

class DatAnteproyecto extends BaseDatAnteproyecto {

    public function setUp() {
        parent::setUp();
    }

    public function listarTodos($parametros, $identidad = false, $start = 0, $limit = 20, $filters = array()
    ) {
        $query = Doctrine_Query::create();
        $query->from('DatAnteproyecto ap')->leftJoin(
                        'ap.DatConceptoespecialidad ce'
                )->leftJoin('ce.NomConcepto c')
                ->innerJoin('ap.DatAnteproyectonae apn')
                ->innerJoin(
                        'ap.NomTipoanteproyecto tap'
                )->setHydrationMode(
                Doctrine::HYDRATE_ARRAY
        );

        if (isset($parametros->idejercicio)) {
            $query->addWhere(
                    'ap.idejercicio = ?', array($parametros->idejercicio)
            );
        }
        if ($identidad) {
            $query->addWhere('ap.identidad = ?', array($identidad));
        }
        if ($start) {
            $query->offset($start);
        }
        if ($limit) {
            $query->limit($limit);
        }
        if (!empty($filters)) {
            foreach ($filters as $filter) {
                if ($filter['field'] == 'denentidad') {
                    $query->addWhere('ap.identidad =' . $filter['data']['value']);
                } else {
                    if ($filter ['data'] ['type'] == 'numeric') {
                        if ($filter ['data'] ['comparison'] == 'gt') {
                            $query->addWhere(
                                    'ap.' . $filter ['field'] . ' > ?', $filter ['data'] ['value']
                            );
                        } else {
                            if ($filter ['data'] ['comparison'] == 'lt') {
                                $query->addWhere(
                                        'ap.' . $filter ['field'] . ' < ?', $filter ['data'] ['value']
                                );
                            } else {
                                if ($filter ['data'] ['comparison'] == 'eq') {
                                    $query->addWhere(
                                            'ap.' . $filter ['field'] . ' = ?', $filter ['data'] ['value']
                                    );
                                }
                            }
                        }
                    } else {
                        if ($filter ['data'] ['type'] == 'string') {
                            if ($filter ['field'] == 'idnae') {
                                $query->addWhere(
                                        'apn.idnae = ?', $filter ['data'] ['value']
                                );
                            } else {
                                if ($filter ['field'] == 'idconcepto') {
                                    $query->addWhere(
                                            'c.idconcepto = ?', $filter ['data'] ['value']
                                    );
                                } else {
                                    $query->addWhere(
                                            'ap.' . $filter ['field'] . ' = ?', $filter ['data'] ['value']
                                    );
                                }
                            }
                        } else {
                            if ($filter ['data'] ['type'] == 'date') {
                                $value = split('/', $filter ['data'] ['value']);
                                $value = $value [1] . '/' . $value [0] . '/'
                                        . $value [2];
                                if ($filter ['data'] ['comparison'] == 'gt') {
                                    $query->addWhere(
                                            "ap." . $filter ['field'] . " > DATE '"
                                            . $value . "'"
                                    );
                                } else {
                                    if ($filter ['data'] ['comparison'] == 'lt') {
                                        $query->addWhere(
                                                "ap." . $filter ['field'] . " < DATE '"
                                                . $value . "'"
                                        );
                                    } else {
                                        if ($filter ['data'] ['comparison'] == 'eq'
                                        ) {
                                            $query->addWhere(
                                                    "ap." . $filter ['field']
                                                    . " = DATE '" . $value . "'"
                                            );
                                        }
                                    }
                                }
                            } else {
                                if ($filter ['data'] ['type'] == 'boolean') {
                                    if ($filter ['data'] ['value'] == 'true') {
                                        $query->addWhere(
                                                "ap." . $filter ['field'] . " >= ?", 3
                                        );
                                    } else {
                                        $query->addWhere(
                                                "ap." . $filter ['field'] . " < ?", 3
                                        );
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        $result = $query->execute();

        foreach ($result as $key => $value) {
            $estructura = $parametros->integrator->metadatos->DameEstructura(
                    $value['identidad']
            );
            $result[$key]['denentidad'] = $estructura[0]->denominacion;

            $user = $parametros->integrator->seguridad->nombreUsuario(
                    $value['idusuario']
            );
            $result[$key]['idusuario'] = $user;
        }
        return $result;
    }

    public function obtenerTotal($parametros, $identidad = false) {
        $query = Doctrine_Query::create();
        $query->from('DatAnteproyecto ap');
        if ($identidad) {
            $query->addWhere(
                    'ap.identidad = ? AND ap.idejercicio=?', array($identidad, $parametros->idejercicio)
            );
        }
        $result = $query->count();
        return $result;
    }

    public function obtenerIdUsuaios() {
        $query = Doctrine_Query::create();
        $query->select('distinct(ap.idusuario) as idusuario')->from(
                'DatAnteproyecto ap'
        )->setHydrationMode(
                Doctrine::HYDRATE_ARRAY
        );
        $result = $query->execute();
        return $result;
    }

    public function obtenerConceptos() {
        $query = Doctrine_Query::create();
        $query->from('NomConcepto c')->setHydrationMode(
                Doctrine::HYDRATE_ARRAY
        );
        $result = $query->execute();
        return $result;
    }

    public function buscarAnteproyectoEntidad($identidad, $idnaes) {
        if (empty($idnaes)) {
            $idnaes = '-1';
        }
        $conn = Doctrine_Manager::connection();
        $query = "SELECT COUNT(DISTINCT apn.idnae) as cantidad FROM mod_planificacion.dat_anteproyectonae apn
            INNER JOIN mod_planificacion.dat_anteproyecto ap ON apn.idanteproyecto = ap.idanteproyecto
            WHERE apn.idnae IN(" . $idnaes . ") AND ap.identidad = $identidad";
        $result = $conn->fetchAssoc($query);
        return $result [0] ['cantidad'];
    }

    public function obtenerAnteproyectoDadoId($idanteproyecto) {
        return Doctrine::getTable('DatAnteproyecto')->find($idanteproyecto);
    }

    public function buscarAnteproyectoDadoIdEntidad($identidad, $idtipoanteproyecto, $idejecicio
    ) {
        $conn = Doctrine_Manager::connection();
        $query = "SELECT ant.idanteproyecto
FROM mod_planificacion.dat_anteproyecto ant
WHERE ant.identidad = $identidad AND
      ant.idejercicio = $idejecicio AND
      ant.idtipoanteproyecto = $idtipoanteproyecto";
        $result = $conn->fetchAssoc($query);
        return $result;
    }

    public function obtenerObjGastoParaPintar($parametros) {

        if ($parametros->gastos != null) {
            $AND = "AND objgasto.idobjetogasto IN ($parametros->gastos)";
        } else {
            $AND = "";
        }

        if ($parametros->idgasto != null) {
            $ANDId = " AND objgasto.idelementoobjeto IN ($parametros->idgasto)";
        } else {
            $ANDId = "";
        }

        $conn = Doctrine_Manager::connection();
        $query = "SELECT antgasto.idobjetogasto, antgasto.presupuestoactual,  replace(objgasto.concat,'.','') as codigogasto,
       objgasto.descripcionelementoobjeto as denominacion,ant.identidad, ant.idtipoanteproyecto,objnae.codigo,objnae.denominacion as denominacionnae, objnae.idnae,
       split_part(objgasto.concatpadre,'.',1) as codigogastodividido
FROM mod_planificacion.dat_anteproyecto ant
INNER JOIN mod_planificacion.dat_anteproyectonae antnae ON (ant.idanteproyecto = antnae.idanteproyecto)
INNER JOIN mod_planificacion.dat_anteproyectonaeobjetogasto antgasto ON (antnae.idanteproyectonae = antgasto.idanteproyectonae)
INNER JOIN mod_contabilidadcosto.nom_elementogasto objgasto ON (antgasto.idobjetogasto = objgasto.idelementoobjeto)
INNER JOIN mod_planificacion.nom_nae objnae ON(antnae.idnae = objnae.idnae)
WHERE antnae.idnae IN($parametros->idnae) AND ant.idejercicio = $parametros->idejercicio
AND ant.identidad IN($parametros->entidadesSeparadas) AND antgasto.presupuestoactual > 0  AND ant.idtipoanteproyecto = 1 $AND $ANDId

ORDER By antnae.idnae";
        $result = $conn->fetchAssoc($query);
        return $result;
    }

    public function obtenerObjRecursoParaPintar($parametros) {
        $conn = Doctrine_Manager::connection();
        $query = "SELECT antrecurso.idanteproyectonaeingreso, antrecurso.presupuestoactual, objrecurso.codigo as codigorecurso, objrecurso.denominacion, ant.identidad, ant.idtipoanteproyecto
                  ,objnae.codigo,objnae.denominacion as denominacionnae, objnae.idnae,
CAST(substring(cast(objrecurso.codigo as varchar(10)),1,4) as int) as codigorecursodividido
FROM mod_planificacion.dat_anteproyecto ant
INNER JOIN mod_planificacion.dat_anteproyectonae antnae ON (ant.idanteproyecto = antnae.idanteproyecto)
INNER JOIN mod_planificacion.dat_anteproyectonaeingreso antrecurso ON (antnae.idanteproyectonae = antrecurso.idanteproyectonae)
INNER JOIN mod_planificacion.nom_recursofinanciero objrecurso ON(antrecurso.idingreso = objrecurso.idrecursofinanciero)
INNER JOIN mod_planificacion.nom_nae objnae ON(antnae.idnae = objnae.idnae)
WHERE antnae.idnae IN($parametros->idnae) AND ant.idejercicio = $parametros->idejercicio AND ant.identidad IN($parametros->entidadesSeparadas)
AND objrecurso.idrecursofinanciero IN ($parametros->idrecurso) AND antrecurso.presupuestoactual > 0 AND ant.idtipoanteproyecto = 1
 ORDER By  antnae.idnae";
        $result = $conn->fetchAssoc($query);
        return $result;
    }

}
