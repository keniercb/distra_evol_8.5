<?php

class NomCategoria extends BaseNomCategoria
{

    /**
     * @param array $idtipocategoria
     * @param null $filtro
     * @param null $limit
     * @param int $start
     *
     * @throws Doctrine_Exception
     * @throws Exception
     */
    public static function getCategoriaActivo($idtipocategoria,$filtro = null, $limit = null, $start = 0, $todos = false)
    {
        try {
            $query = Doctrine_Query::create()->select(
                'nc.*, nc.idcategoria as idnomenclador, ntc.denominacion as denomtipocategoria, abreviatura'
            )->from('NomCategoria nc')->innerJoin('nc.NomTipocategoria ntc')->where(
                'nc.fdesde <= now() and (now() <= nc.fhasta or nc.fhasta is null)'
            )  ->orderBy('nc.idcategoria');

                if ($limit) {
                    $query->limit($limit)->offset($start);
                } else {
                    $query->limit(15)->offset(0);
                }
            if (count($idtipocategoria) > 0) {
                $query->andWhere("nc.idtipocategoria=$idtipocategoria");
            }
            if ($filtro != null) {
                $query->andWhere("denominacion ilike '%$filtro%' or descripcion ilike '%$filtro%'");
            }
            return $query->execute()->toArray();
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    /**
     * Constructor
     */
    public function setUp()
    {
        parent:: setUp();
        $this->hasOne('NomTipocategoria', array('local' => 'idtipocategoria', 'foreign' => 'idtipocategoria'));
        $this->hasMany('DatCategorizacion', array('local' => 'idcategoria', 'foreign' => 'idcategoria'));
    }

    /**
     * Devuelve un objeto de la clase
     * @params $idcategoria
     *
     * @return Doctrine_Record
     */
    public function getById($idcategoria)
    {
        return Doctrine::getTable('NomCategoria')->find($idcategoria);
    }

    /**
     * @param array $idtipocategoria
     * @param null $filtro
     *
     * @throws Doctrine_Exception
     * @throws Exception
     */
    public function getCantCategoriaActivo($idtipocategoria,$filtro = null)
    {
        try {
            $query = Doctrine_Query::create()->from('NomCategoria nc')->innerJoin('nc.NomTipocategoria ntc')->where(
                'nc.fdesde <= now() and (now() <= nc.fhasta or nc.fhasta is null)'
            );

            if (count($idtipocategoria) > 0) {
                $query->andWhere("nc.idtipocategoria=$idtipocategoria");
            }
            if ($filtro != null) {
                $query->andWhere("denominacion ilike '%$filtro%' or descripcion ilike '%$filtro%'");
            }

            return $query->count();
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    /**
     * @param $idcategoria
     * @param $denominacion
     * @param $descripcion
     * @param $fdesde
     * @param $fhasta
     * @param $idtipocategoria
     */
    public function modCategoria($idcategoria, $denominacion, $abreviatura, $descripcion, $fdesde, $fhasta, $idtipocategoria)
    {
        try {
            $query = Doctrine_Query::create()->update('NomCategoria')->where('idcategoria = ? ', $idcategoria);
            if ($denominacion != '') {
                $query->set('denominacion', '?', $denominacion);
            }
            if ($abreviatura != '') {
                $query->set('abreviatura', '?', $abreviatura);
            } else {
                $query->set('abreviatura', 'null');
            }
            if ($descripcion != '') {
                $query->set('descripcion', '?', $descripcion);
            } else {
                $query->set('descripcion', 'null');
            }
            if ($fdesde != '') {
                $query->set('fdesde', '?', $fdesde);
            }
            if ($fhasta != '') {
                $query->set('fhasta', '?', $fhasta);
            } else {
                $query->set('fhasta', 'null');
            }
            if ($idtipocategoria != '') {
                $query->set('idtipocategoria', '?', $idtipocategoria);
            }
            $result = $query->execute();
            if ($result) {
                return true;
            } else {
                return false;
            }
        } catch (Exception $exc) {
            echo $exc->getTraceAsString();
        }
    }

    /**
     * @param      $denom
     * @param      $idtipocategoria
     * @param null $idcategoria
     *
     * @throws Doctrine_Exception
     * @throws Exception
     */
    public function findByIdOrDenom($denom, $idtipocategoria, $idcategoria = null)
    {
        try {
            $query = Doctrine_Query::create();
            $query->from('NomCategoria')->where('fdesde <= now() and (fhasta is null or fhasta > now())')->andWhere(
                'idtipocategoria = ?', $idtipocategoria
            )->andWhere("denominacion ilike '$denom'");
            if (!empty($idcategoria)) {
                $query->andWhere("idcategoria <> ?", $idcategoria);
            }
            $result = $query->count();
            if ($result > 0) {
                return true;
            } else {
                return false;
            }
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    public function getNomCategoriaById($idcategoria)
    {
        try {
            $query = Doctrine_Query::create()->select(
                'cat.idcategoria, cat.denominacion as categoria, cat.descripcion, cat.fdesde, cat.fhasta,
                    tp.idtipocategoria,tp.denominacion as tipocategoria'
            )->from('NomCategoria cat')->leftJoin('cat.NomTipocategoria tp')->where('cat.idcategoria = ?', $idcategoria)
                ->addWhere('cat.fdesde <= now() and (now() <= cat.fhasta or cat.fhasta is null)');

            return $query->execute()->toArray();
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

}

