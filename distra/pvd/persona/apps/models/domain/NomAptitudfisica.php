  <?php

class NomAptitudfisica extends BaseNomAptitudfisica
{
    /**
     * Constructor
     */
    public function setUp()
    {
        parent:: setUp();
        $this->hasMany('DatEstadosalud', array('local' => 'idaptitudfisica', 'foreign' => 'idaptitudfisica'));
    }

    /**
     * Devuelve un objeto de la clase
     * @params $idaptitudfisica
     *
     * @return Doctrine_Record
     */
    public function getById($idaptitudfisica)
    {
        return Doctrine::getTable('NomAptitudfisica')->find($idaptitudfisica);
    }

    public function getAptitudesFisicasActivos($filtro = null, $limit = null, $start = 0,$value)
    {
        try {
            $query = Doctrine_Query::create()->select(
                'idaptitudfisica, idaptitudfisica as idnomenclador, denominacion, abreviatura, fdesde, fhasta, descripcion'
            )->from('NomAptitudfisica')->where('fdesde <= now() and (now() <= fhasta or fhasta is null)')
                ->orderBy('denominacion');
            if($value){
                $query->limit(500)->offset($start);
            }else{
                if ($limit) {
                    $query->limit($limit)->offset($start);
                } else {
                    $query->limit(15)->offset(0);
                }
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
     * @param null $filtro
     *
     * @return int
     * @throws Doctrine_Exception
     * @throws Exception
     */
    public function getCantAptitudesFisicasActivos($filtro = null)
    {
        try {
            $query = Doctrine_Query::create()->from('NomAptitudfisica')->where(
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
     * @param      $denom
     * @param null $idtipomision
     *
     * @return bool
     * @throws Doctrine_Exception
     * @throws Exception
     */
    public function findByIdOrDenom($denom, $idaptitudfisica)
    {
        try {
            $query = Doctrine_Query::create();
            $query->from('NomAptitudfisica')->where('fdesde <= now() and (fhasta is null or fhasta > now())')->andWhere(
                "denominacion ilike '$denom'"
            );
            if (!empty($idaptitudfisica)) {
                $query->andWhere("idaptitudfisica <> ?", $idaptitudfisica);
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

    public function findByIdOrDenomadd($denom, $idaptitudfisica = null)
    {
        try {
            $query = Doctrine_Query::create();
            $query->from('NomAptitudfisica')->where('fdesde <= now() and (fhasta is null or fhasta > now())')->andWhere(
                "denominacion ilike '$denom'"
            );
            if (!empty($idaptitudfisica)) {
                $query->andWhere("idaptitudfisica <> ?", $idaptitudfisica);
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
     * @param $idaptitudfisica
     * @param $denominacion
     * @param $descripcion
     * @param $fdesde
     * @param $fhasta
     *
     * @return bool
     * @throws Exception
     */
    public function modAptitudesFisicas($idaptitudfisica, $denominacion, $abreviatura, $descripcion, $fdesde, $fhasta)
    {
        try {
            $query = Doctrine_Query::create()->update('NomAptitudfisica')
                ->where('idaptitudfisica = ? ', $idaptitudfisica);
            if ($denominacion != '') {
                $query->set('denominacion', '?', $denominacion);
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
            if ($abreviatura != '') {
                $query->set('abreviatura', '?', $abreviatura);
            } else {
                $query->set('abreviatura', 'null');
            }
            $result = $query->execute();
            if ($result) {
                return true;
            } else {
                return false;
            }
        } catch (Exception $e) {
            throw $e;
        }
    }
}