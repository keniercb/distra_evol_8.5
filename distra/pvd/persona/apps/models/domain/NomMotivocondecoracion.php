<?php

class NomMotivocondecoracion extends BaseNomMotivocondecoracion
{

    /**
     * Constructor
     */
    public function setUp()
    {
        parent:: setUp();
        $this->hasMany(
            'DatCondecoracion', array('local' => 'idmotivocondecoracion', 'foreign' => 'idmotivocondecoracion')
        );
    }

    /**
     * Devuelve un objeto de la clase
     * @params $idmotivocondecoracion
     *
     * @return Doctrine_Record
     */
    public function getById($idmotivocondecoracion)
    {
        return Doctrine::getTable('NomMotivocondecoracion')->find($idmotivocondecoracion);
    }

    /**
     * Funcion para obtener los condecoracion
     *
     * @param null $filtro
     * @param null $limit
     * @param int $start
     *
     * @return array
     * @throws Doctrine_Exception
     * @throws Exception
     */
    public function getMotiveOfDecorationActive($filtro = null, $limit = null, $start = 0)
    {
        try {
            $query = Doctrine_Query::create()->select(
                'idmotivocondecoracion,idmotivocondecoracion as idnomenclador,'
                . ' denominacion, fdesde, fhasta, descripcion, abreviatura'
            )->from('NomMotivocondecoracion')->where('fdesde <= now() and (now() <= fhasta or fhasta is null)')
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
     * Funcion para obtener la cantidad de condecoracion
     *
     * @param null $filtro
     *
     * @return int
     * @throws Doctrine_Exception
     * @throws Exception
     */
    public function getCantMotiveOfDecorationActive($filtro = null)
    {
        try {
            $query = Doctrine_Query::create()->from('NomMotivocondecoracion')->where(
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
     * Funcion para maodificar condecoracion
     *
     * @param numeric $idcolorpiel
     * @param string $denominacion
     * @param string $descripcion
     * @param date $fdesde
     * @param date $fhasta
     *
     * @return boolean
     */
    public function modMotiveOfDecoration($idmotivocondecoracion, $denominacion, $abreviatura, $descripcion, $fdesde, $fhasta)
    {
        try {
            $query = Doctrine_Query::create()->update('NomMotivocondecoracion')->where(
                'idmotivocondecoracion= ? ', $idmotivocondecoracion
            );
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
     * Funcion para verificar si existe condecoracion
     *
     * @param $denom
     * @param $idmotivocondecoracion
     */
    public function findByIdOrDenom($denom, $idmotivocondecoracion = null)
    {
        try {
            $query = Doctrine_Query::create();
            $query->from('NomMotivocondecoracion')->where('fdesde <= now() and (fhasta is null or fhasta > now())')
                ->andWhere("denominacion ilike '$denom'");
            if (!empty($idmotivocondecoracion)) {
                $query->andWhere("idmotivocondecoracion <> ?", $idmotivocondecoracion);
            }
            $idmotivocondecoracion = null;
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

    public function findByIdOrDenomadd($denom, $idmotivocondecoracion = null)
    {
        try {
            $query = Doctrine_Query::create();
            $query->from('NomMotivocondecoracion')->where('fdesde <= now() and (fhasta is null or fhasta > now())')
                ->andWhere("denominacion ilike '$denom'");
//            if (!empty($idcolorojos)) {
//                $query->andWhere("idmotivocondecoracion <> ?", $idmotivocondecoracion);
//            }
            $idmotivocondecoracion = null;
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
}

