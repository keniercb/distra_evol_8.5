<?php

class NomTiposancion extends BaseNomTiposancion
{

    /**
     * Constructor
     */
    public function setUp()
    {
        parent:: setUp();
        $this->hasMany('NomSancion', array('local' => 'idtiposancion', 'foreign' => 'idtiposancion'));
    }

    /**
     * Devuelve un objeto de la clase
     * @params $fhasta
     *
     * @return Doctrine_Record
     */
    public function getById($fhasta)
    {
        return Doctrine::getTable('NomTiposancion')->find($fhasta);
    }

    /**
     * Funcion para obtener los Sancion
     *
     * @param null $filtro
     * @param null $limit
     * @param int $start
     *
     * @return array
     * @throws Doctrine_Exception
     * @throws Exception
     */
    public function getTypeOfSanctionActive($filtro = null, $limit = null, $start = 0)
    {
        try {
            $query = Doctrine_Query::create()->select(
                'idtiposancion,idtiposancion as idnomenclador, codigo, denominacion, fdesde, abreviatura,
                fhasta, descripcion'
            )->from('NomTiposancion')->where('fdesde <= now() and (now() <= fhasta or fhasta is null)')
                ->orderBy('denominacion');
            if ($limit) {
                $query->limit($limit)->offset($start);
            }
            else {
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
     * Funcion para obtener la cantidad de Sancion
     *
     * @param null $filtro
     *
     * @return int
     * @throws Doctrine_Exception
     * @throws Exception
     */
    public function getCantTypeOfSanctionActive($filtro = null)
    {
        try {
            $query = Doctrine_Query::create()->from('NomTiposancion')->where(
                'fdesde <= now() and (now() <= fhasta or fhasta is null)'
            );
            if ($filtro != null) {
                $query->andWhere("denominacion ilike '%$filtro%'");
            }

            return $query->count();
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    /**
     * Funcion para maodificar Sancion
     *
     * @param numeric $idtiposancion
     * @param string $denominacion
     * @param string $descripcion
     * @param date $fdesde
     * @param date $fhasta
     *
     * @return boolean
     */
    public function modTypeOfSanction($idtiposancion, $denominacion, $abreviatura, $descripcion, $fdesde, $fhasta)
    {
        try {
            $query = Doctrine_Query::create()->update('NomTiposancion')->where('idtiposancion= ? ', $idtiposancion);
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
     * @param $denom
     * @param null $idtiposancion
     * @return bool
     * @throws Doctrine_Exception
     */
    public function findByIdOrDenom($denom, $idtiposancion = null)
    {
        try {
            $query = Doctrine_Query::create();
            $query->from('NomTiposancion')->where('fdesde <= now() and (fhasta is null or fhasta > now())')->andWhere(
                "denominacion ilike '$denom'"
            );
            if (!empty($idtiposancion)) {
                $query->andWhere("idtiposancion <> ?", $idtiposancion);
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


    public function getTipoSanctionByCodigo($codigo)
    {
        try {
            $query = Doctrine_Query::create()->select(
                'idtiposancion,idtiposancion as idnomenclador, codigo, denominacion, fdesde, fhasta, descripcion'
            )->from('NomTiposancion')->where('fdesde <= now() and (now() <= fhasta or fhasta is null)');

            if (!empty($codigo)) {
                $query->addWhere('codigo = ?', $codigo);
            }

            return $query->execute()->toArray()[0];
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

}

