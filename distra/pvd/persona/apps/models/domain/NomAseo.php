  <?php

class NomAseo extends BaseNomAseo
{

    /**
     * Constructor
     */
    public function setUp()
    {
        parent:: setUp();
        $this->hasMany('DatAseop', array('local' => 'idaseo', 'foreign' => 'idaseo'));
    }

    /**
     * Devuelve un objeto de la clase
     * @params $idaseo
     *
     * @return Doctrine_Record
     */
    public function getById($idaseo)
    {
        return Doctrine::getTable('NomAseo')->find($idaseo);
    }

    public function getAseo($filtro = null, $limit = null, $start = 0,$value)
    {
        try {
            $query = Doctrine_Query::create()->select(
                'idaseo, idaseo as idnomenclador, denominacion, fdesde, fhasta, descripcion'
            )->from('NomAseo')->where('fdesde <= now() and (now() <= fhasta or fhasta is null)')
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
    public function getCantAseoActivos($filtro = null)
    {
        try {
            $query = Doctrine_Query::create()->from('NomAseo')->where(
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
    public function findByIdOrDenom($denom, $idaseo)
    {
        try {
            $query = Doctrine_Query::create();
            $query->from('NomAseo')->where('fdesde <= now() and (fhasta is null or fhasta > now())')->andWhere(
                "denominacion ilike '$denom'"
            );
            if (!empty($idaseo)) {
                $query->andWhere("idaseo <> ?", $idaseo);
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

    public function findByIdOrDenomadd($denom, $idaseo = null)
    {
        try {
            $query = Doctrine_Query::create();
            $query->from('NomAseo')->where('fdesde <= now() and (fhasta is null or fhasta > now())')->andWhere(
                "denominacion ilike '$denom'"
            );
            if (!empty($idaseo)) {
                $query->andWhere("idaseo <> ?", $idaseo);
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
     * @param $idaseo
     * @param $denominacion
     * @param $descripcion
     * @param $fdesde
     * @param $fhasta
     *
     * @return bool
     * @throws Exception
     */
    public function modAseo($idaseo, $denominacion, $abreviatura, $descripcion, $fdesde, $fhasta)
    {
        try {
            $query = Doctrine_Query::create()->update('NomAseo')
                ->where('idaseo = ? ', $idaseo);
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
        } catch (Exception $e) {
            throw $e;
        }
    }
}

