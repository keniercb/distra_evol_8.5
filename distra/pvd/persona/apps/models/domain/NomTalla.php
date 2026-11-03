<?php

class NomTalla extends BaseNomTalla
{

    /**
     * Constructor
     */
    public function setUp()
    {
        parent:: setUp();
        $this->hasMany('DatTallaje', array('local' => 'idtalla', 'foreign' => 'idtalla'));
        $this->hasMany('Confprendanorma', array('local' => 'idtalla', 'foreign' => 'idtalla'));
    }

    /**
     * Devuelve un objeto de la clase
     * @params $idtalla
     *
     * @return Doctrine_Record
     */
    public function getById($idtalla)
    {
        return Doctrine::getTable('NomTalla')->find($idtalla);
    }

    /**
     * Funcion para obtener las tallas activos
     *
     * @param null $filtro
     * @param null $limit
     * @param int $start
     *
     * @return array
     * @throws Doctrine_Exception
     * @throws Exception
     */
    public function getActiveSize($filtro = null, $limit = null, $start = 0, $value = 0)
    {
        try {
            $query = Doctrine_Query::create()->select(
                't.idtalla,t.abreviatura, t.denominacion, t.fdesde, t.fhasta, t.descripcion,
                cf.idconftallaje,np.idprenda, abreviatura'
            )->from('NomTalla t')
                ->leftJoin('t.Confprendanorma cf')
                ->leftJoin('cf.NomPrenda np')
                ->where('fdesde <= now() and (now() <= fhasta or fhasta is null)')
                ->orderBy('t.denominacion');

            if($value){
                $query->limit(500)->offset(0);

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
     * Funcion para obtener la cantidad de Sizea activos
     *
     * @param null $filtro
     *
     * @return int
     * @throws Doctrine_Exception
     * @throws Exception
     */
    public function getCantActiveSize($filtro = null)
    {
        try {
            $query = Doctrine_Query::create()->from('NomTalla')->where(
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
     * Funcion para modifcar el tipo de Sizea
     *
     * @param type $idtalla
     * @param type $denominacion
     * @param type $descripcion
     * @param type $fdesde
     * @param type $fhasta
     *
     * @return boolean
     */
    public function modSize($idtalla, $denominacion, $abreviatura, $descripcion, $fdesde, $fhasta)
    {
        try {
            $query = Doctrine_Query::create()->update('NomTalla')->where('idtalla= ? ', $idtalla);
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
     * Funcion para verificar si existe el color
     *
     * @param $denom
     * @param $idtalla
     */
    public function findByIdOrDenom($denom, $idtalla)
    {
        try {
            $query = Doctrine_Query::create();
            $query->from('NomTalla')->where('fdesde <= now() and (fhasta is null or fhasta > now())')->andWhere(
                "denominacion ilike '$denom'"
            );
            if (!empty($idtalla)) {
                $query->andWhere("idtalla <> ?", $idtalla);
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

    public function findByIdOrDenomadd($denom, $idtalla = null)
    {
        try {
            $query = Doctrine_Query::create();
            $query->from('NomTalla')->where('fdesde <= now() and (fhasta is null or fhasta > now())')->andWhere(
                "denominacion ilike '$denom'"
            );
            if (!empty($idtalla)) {
                $query->andWhere("idtalla <> ?", $idtalla);
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

}

