<?php

/**
 * @package       ERP-Operaciones contables
 * @category      Nomenclador
 * @author        Ing. Alejandro Mengana Pérez<amengana@xetid.cu>
 * @copyright (c) 2014, XETID
 */
class NomOperaciones extends BaseNomOperaciones
{

    public function setUp()
    {
        $this->hasMany(
            'DatOperacionesentidad', array('local'   => 'idnomoperaciones',
                                           'foreign' => 'idnomoperaciones')
        );
        $this->hasMany(
            'DatDocumentoprim', array('local'   => 'idnomoperaciones',
                                      'foreign' => 'idnomoperaciones')
        );
        parent::setUp();
    }

    public function persist()
    {
        try {
            $a = Doctrine_Manager::getInstance();
            $va = $a->getCurrentConnection();
            $this->save();

            $va->commit();
            $va->beginTransaction();

            return $this;
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    static public function GetAll()
    {
        try {
            $query = Doctrine_Query::create();
            $result = $query->from('NomOperaciones')->execute();
            return $result->toArray();
        } catch (Doctrine_Exception $e) {
            return $e;
        }
    }

    static public function GetById($idoperacion, $toArray = false)
    {
        try {
            $query = Doctrine_Query::create();
            $result = $query->from('NomOperaciones')
                ->where("idnomoperaciones=?", array(0 => $idoperacion))
                ->execute();
            return $toArray ? $result->toArray() : $result;
        } catch (Doctrine_Exception $e) {
            return $e;
        }
    }

    static public function TotalByField($field, $value)
    {
        try {
            $data = Doctrine_Core::getTable('NomOperaciones')->findBy(
                $field, $value, Doctrine_Core::HYDRATE_RECORD
            );
            $total = $data->count();
            return $total;
        } catch (Doctrine_Exception $e) {
            return $e;
        }
    }

    static public function GetOperacionesEntidadSubsistema(
        $condition, $estructura
    ) {
        try {
            $filter = isset($condition['filter']) ? $condition['filter'] : '';

            $dm = Doctrine_Manager::getInstance();
            $conn = $dm->getCurrentConnection();
            $query = "select a.* from (select v2.denominacion, v2.idestructuracomun as estructurapropietaria,1 as asociadoentidad,
                        v2.idsubsistema,v2.idnomoperaciones,$estructura as idestructuracomun,vv.idoperacionesentidad,
                        vv.idmodelo,vv.iddoc,vv.signo,true as valid
                    from mod_datosmaestros.nom_operacion v2
                    inner join mod_datosmaestros.dat_operacionesentidad vv on (vv.idnomoperaciones = v2.idnomoperaciones)
                    where vv.idestructuracomun = $estructura
                    union
                    select v3.denominacion,v3.idestructuracomun,0,v3.idsubsistema,v3.idnomoperaciones,$estructura as idestructuracomun,null,null,null,null,true as valid 
                    from mod_datosmaestros.nom_operacion v3
                    where v3.idnomoperaciones not in (select v2.idnomoperaciones 
                                        from mod_datosmaestros.nom_operacion v2
                                        inner join mod_datosmaestros.dat_operacionesentidad vv on (vv.idnomoperaciones = v2.idnomoperaciones) 
                                        where vv.idestructuracomun = $estructura)) a where a.idsubsistema = {$condition['idsubsistema']}$filter ORDER BY a.asociadoentidad DESC,a.denominacion";
            return $conn->fetchAll($query);
        } catch (Doctrine_Exception $e) {
            return $e;
        }
    }

    static public function GetByCondition(
        $condition, $params, $toArray = false, $start = null, $limit = null
    ) {
        try {
            $query = Doctrine_Query::create();

            if ($start === null && $limit === null) {
                $result = $query->select('*')
                    ->from('NomOperaciones o')
                    ->where("$condition", $params)
                    ->orderBy('o.denominacion ASC')
                    ->execute();
            } else {
                $result = $query->select('*')
                    ->from('NomOperaciones o')
                    ->where("$condition", $params)
                    ->orderBy('o.denominacion ASC')
                    ->offset($start)
                    ->limit($limit)
                    ->execute();
            }
            return $toArray ? $result->toArray() : $result;
        } catch (Doctrine_Exception $e) {
            return $e;
        }
    }

    static public function Erase($idoperacion)
    {
        try {
            $query = Doctrine_Query::create();
            $rows_afected = $query->delete('NomOperaciones')
                ->where("idnomoperaciones=?", array($idoperacion))
                ->execute();
            return $rows_afected > 0;
        } catch (Doctrine_Exception $e) {
            return false;
        }
    }

    static public function EraseByCondition($conditions, $params)
    {
        try {
            $query = Doctrine_Query::create();
            $rows_afected = $query->delete('NomOperaciones')
                ->where("$conditions", $params)
                ->execute();
            return $rows_afected > 0;
        } catch (Doctrine_Exception $e) {
            return $e;
        }
    }

    static public function GetBySqlQuery(
        $idestructura, $idsubsistema = null, $iddocumento = null,
        $idoperacion = null, $start = null, $limit = null, $filtros = array()
    ) {
        try {
            $conditions = array();
            $params = array();

            $idestructura = is_array($idestructura) ? $idestructura
                : array($idestructura);

            if (!is_null($idsubsistema) && $idsubsistema) {
                $conditions[] = 'no.idsubsistema = ?';
                $params[] = $idsubsistema;
            }

            if (!is_null($iddocumento) && $iddocumento) {
                $conditions[] = '(dat.iddoc = ? OR datdoc.iddocumentos = ?)';
//                $conditions[] = 'datdoc.iddocumentos = ?';
                $params[] = $iddocumento;
                $params[] = $iddocumento;
            }

            if (!is_null($idoperacion) && $idoperacion) {
                $conditions = array('no.idnomoperaciones = ?');
                $params = array($idoperacion);
            }

            $select
                = 'no.idnomoperaciones, no.denominacion, no.idsubsistema, no.codigooperacion,'
                . ' dat.idestructuracomun as idestructuracomun, dat.idoperacionesentidad as idoperacionesentidad,'
                . ' dat.idmodelo as idmodelo, dat.iddoc as iddocentidad, datdoc.iddocumentos as iddocumento,'
                . ' dat.signo as signo, nomdoc.codigo as codigodocumento';

            $query = Doctrine_Query::create();
            $query->select($select)
                ->from('NomOperaciones no')
                ->innerJoin('no.DatOperacionesentidad dat')
                ->innerJoin('dat.DatDocumentoprim datdoc')
                ->innerJoin('datdoc.NomDocprim nomdoc')
                ->whereIn('dat.idestructuracomun', $idestructura)
                ->orderBy('no.denominacion ASC')
                ->setHydrationMode(Doctrine_Core::HYDRATE_ARRAY);

            if (!empty($conditions)) {
                $query->addWhere(implode(' AND ', $conditions), $params);
            }

            if (is_array($filtros) && count($filtros) != 0) {
                $conditions = array();
                $params = array();
                $no_columns = Doctrine::getTable('NomOperaciones')->getColumnNames();
                $dat_columns = Doctrine::getTable('DatOperacionesentidad')->getColumnNames();
                foreach ($filtros as $clave => $filtro) {
                    if (in_array($clave, $no_columns)) {
                        if (!is_array($filtro)) {
                            $conditions[]
                                = "lower(no." . $clave . ") ILIKE lower('%$filtro%')";
                        } else {
                            $conditions[] = "no." . $clave . " in " . "(" . implode(',', $filtro) . ")";
                        }

                    }
                    if (in_array($clave, $dat_columns)) {
                        if (!is_array($filtro)) {
                            $conditions[] = "dat." . $clave . "=" . $filtro;
                        } else {
                            $conditions[] = "dat." . $clave . " in " . "(" . implode(',', $filtro) . ")";
                        }
                    }
                }
                if($filtros['solomodelos']){
                    $query->innerJoin('dat.NomModelosContabilizacion nmc');
                }
                if (count($conditions) > 0) {
                    $query->addWhere(implode(' AND ', $conditions));
                }
            }
            if ($start && $limit || $limit != 0) {
                $query->offset($start)
                    ->limit($limit);
            }

            $result = $query->execute();
            return $result;
        } catch (Doctrine_Exception $e) {
            throw $e;
            return -1;
        }
    }

    static public function CountBySqlQuery(
        $idestructura, $idsubsistema = null, $iddocumento = null,
        $idoperacion = null, $start = null, $limit = null, $filtros = array()
    ) {
        try {
            $conditions = array();
            $params = array();

            $idestructura = is_array($idestructura) ? $idestructura
                : array($idestructura);

            if (!is_null($idsubsistema) && $idsubsistema) {
                $conditions[] = 'no.idsubsistema = ?';
                $params[] = $idsubsistema;
            }

            if (!is_null($iddocumento) && $iddocumento) {
                $conditions[] = '(dat.iddoc = ? OR datdoc.iddocumentos = ?)';
//                $conditions[] = 'datdoc.iddocumentos = ?';
                $params[] = $iddocumento;
                $params[] = $iddocumento;
            }

            if (!is_null($idoperacion) && $idoperacion) {
                $conditions = array('no.idnomoperaciones = ?');
                $params = array($idoperacion);
            }

            $select = 'count(no.idnomoperaciones) as cant';

            $query = Doctrine_Query::create();
            $query->select($select)
                ->from('NomOperaciones no')
                ->innerJoin('no.DatOperacionesentidad dat')
                ->innerJoin('dat.DatDocumentoprim datdoc')
                ->innerJoin('datdoc.NomDocprim nomdoc')
                ->whereIn('dat.idestructuracomun', $idestructura)
                ->setHydrationMode(Doctrine_Core::HYDRATE_ARRAY);

            if (!empty($conditions)) {
                $query->addWhere(implode(' AND ', $conditions), $params);
            }

            if (is_array($filtros) && count($filtros) != 0) {
                $conditions = array();
                $params = array();
                $columns = Doctrine::getTable('NomOperaciones')->getColumnNames();
                foreach ($filtros as $clave => $filtro) {
                    if (in_array($clave, $columns)) {
                        $conditions[]
                            = "lower(" . $clave . ") ILIKE lower('%$filtro%')";
                    }
                }
                $query->addWhere(implode(' AND ', $conditions));
            }

            $result = $query->execute();
            return $result[0]['cant'];
        } catch (Doctrine_Exception $e) {
            throw $e;
            return -1;
        }
    }

}
