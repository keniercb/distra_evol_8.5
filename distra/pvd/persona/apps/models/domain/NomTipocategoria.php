<?php

class NomTipocategoria extends BaseNomTipocategoria
{

    /**
     * @param null $filtro
     * @param null $limit
     * @param int $start
     *
     * @throws Doctrine_Exception
     * @throws Exception
     */
    public static function getTipoCategoriaActive($filtro = null, $limit = null, $start = 0, $todos = false)
    {
        try {
            $query = Doctrine_Query::create()->select(
                'idtipocategoria,idtipocategoria as idnomenclador, denominacion, fdesde, fhasta, 
                descripcion, abreviatura'
            )->from('NomTipocategoria')->where('fdesde <= now() and (now() <= fhasta or fhasta is null)')
                ->orderBy('denominacion');

                if ($limit) {
                    $query->limit($limit)->offset($start);
                } else {
                    $query->limit(15)->offset(0);
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
        $this->hasMany('NomCategoriapersona', array('local' => 'idtipocategoria', 'foreign' => 'idtipocategoria'));
    }

    /**
     * Devuelve un objeto de la clase
     * @params $idtipocategoria
     *
     * @return Doctrine_Record
     */
    public function getById($idtipocategoria)
    {
        return Doctrine::getTable('NomTipocategoria')->find($idtipocategoria);
    }

    /**
     * @param null $filtro
     *
     * @throws Doctrine_Exception
     * @throws Exception
     */
    public function getCantTipoCategoriaActive($filtro = null)
    {
        try {
            $query = Doctrine_Query::create()->from('NomTipocategoria')->where(
                'fdesde <= now() and (now() <= fhasta or fhasta is null)'
            );
            if ($filtro != null) {
                $query->andWhere("denominacion ilike '%$filtro%'");
            }
            //print_r($query->getSqlQuery());die;
            return $query->count();
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    /**
     * @param $idtipocategoria
     * @param $denominacion
     * @param $descripcion
     * @param $fdesde
     * @param $fhasta
     */
    public function modTipoCategoria($idtipocategoria, $denominacion, $abreviatura, $descripcion, $fdesde, $fhasta)
    {
        try {
            $query = Doctrine_Query::create()
                ->update('NomTipocategoria')
                ->where('idtipocategoria= ? ', $idtipocategoria);
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
     * @param null $idtipocategoria
     *
     * @throws Doctrine_Exception
     * @throws Exception
     */
    public function findByIdOrDenom($denom, $idtipocategoria = null)
    {
        try {
            $query = Doctrine_Query::create();
            $query->from('NomTipocategoria')->where('fdesde <= now() and (fhasta is null or fhasta > now())')->andWhere(
                "denominacion ilike '$denom'"
            );
            if (!empty($idtipocategoria)) {
                $query->andWhere("idtipocategoria <> ?", $idtipocategoria);
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

    /**
     * Funcion para obteners los tipos de categorias dado un array de identificadores
     *
     * @param array $ids
     * @param bool $in True para buscar solo por el array de ids y false para buscar todos los que no esten en el array
     * @param null $limit
     * @param int $start
     *
     * @throws Doctrine_Exception
     * @return array
     */
    public function getTipoCategoriaActivaByParams(array $ids, $in = true, $limit = null, $start = 0)
    {
        try {
            $query = Doctrine_Query::create()->select(
                'idtipocategoria,idtipocategoria as idnomenclador, denominacion, fdesde, fhasta, descripcion'
            )->from('NomTipocategoria')->where('fdesde <= now() and (now() <= fhasta or fhasta is null)')
                ->orderBy('denominacion');
            if ($limit) {
                $query->limit($limit)->offset($start);
            }
            if (count($ids) > 0) {
                if ($in) {
                    $query->andWhereIn('idtipocategoria', $ids);
                } else {
                    $query->andWhereNotIn('idtipocategoria', $ids);
                }

                return $query->execute()->toArray();
            }

            return array();
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    /**
     * Funcion para obtener la cantidad de tipos de categorias dado un array de identificadores
     *
     * @param array $ids
     * @param bool $in True para buscar solo por el array de ids y false para buscar todos los que no esten en el array
     *
     * @throws Doctrine_Exception
     * @return int
     */
    public function getCantTipoCategoriaActivaByParams(array $ids, $in = true)
    {
        try {
            $query = Doctrine_Query::create()->from('NomTipocategoria')->where(
                'fdesde <= now() and (now() <= fhasta or fhasta is null)'
            );
            if (count($ids) > 0) {
                if ($in) {
                    $query->andWhereIn('idtipocategoria', $ids);
                } else {
                    $query->andWhereNotIn('idtipocategoria', $ids);
                }

                return $query->count();
            }

            return 0;
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }
}

