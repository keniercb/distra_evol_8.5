<?php

class NomCondecoracion extends BaseNomCondecoracion
{

    /**
     * Constructor
     */
    public function setUp()
    {
        parent:: setUp();
        $arr = array('local' => 'idtipocondecoracion', 'foreign' => 'idtipocondecoracion');
        $this->hasOne('NomTipocondecoracion', $arr);
        $this->hasMany('DatCondecoracion', array('local' => 'idcondecoracion', 'foreign' => 'idcondecoracion'));
    }

    /**
     * Devuelve un objeto de la clase
     * @params $idtipocondecoracion
     *
     * @return Doctrine_Record
     */
    public function getById($idtipocondecoracion)
    {
        return Doctrine::getTable('NomCondecoracion')->find($idtipocondecoracion);
    }

    /**
     * @param null $filtro
     * @param null $limit
     * @param int $start
     * @param      $idtipocondecoracion
     *
     * @return array
     * @throws Doctrine_Exception
     * @throws Exception
     */
    public function getCondecorationActive($filtro = null, $limit = null, $start = 0, $idtipocondecoracion,$value)
    {

        try {
            $select
                = 'nc.idcondecoracion, nc.idcondecoracion as idnomenclador, nc.denominacion, nc.fdesde,
                nc.fhasta, nc.descripcion, ntc.idtipocondecoracion as idtipocondecoracion, abreviatura,
                ntc.denominacion as denomtipocondecoracion';
            $query = Doctrine_Query::create()->select($select)->from('NomCondecoracion nc')->innerJoin(
                'nc.NomTipocondecoracion ntc'
            )->where('nc.fdesde <= now() and (now() <= nc.fhasta or nc.fhasta is null)')
                ->orderBy('denominacion');
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
                $query->andWhere("nc.denominacion ilike '%$filtro%' or nc.descripcion ilike '%$filtro%'");
            }
            if (!empty($idtipocondecoracion)) {
                $query->andWhere("nc.idtipocondecoracion = ?", $idtipocondecoracion);
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
    public function getCantCondecorationActive($filtro = null,$idtipocondecoracion)
    {
        try {
            $query = Doctrine_Query::create()->from('NomCondecoracion nc')
                ->innerJoin('nc.NomTipocondecoracion ntc')
                ->where('fdesde <= now() and (now() <= fhasta or fhasta is null)');
            if($idtipocondecoracion){

                $query->addWhere("ntc.idtipocondecoracion=$idtipocondecoracion");

            }

            if ($filtro != null) {
                $query->andWhere("nc.denominacion ilike '%$filtro%' or nc.descripcion ilike '%$filtro%'");
            }

            return $query->count();
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    /**
     * @param $idcondecoracion
     * @param $denominacion
     * @param $descripcion
     * @param $fdesde
     * @param $fhasta
     * @param $idtipocondecoracion
     *
     * @return bool
     */
    public function modCondecoration(
        $idcondecoracion, $denominacion, $abreviatura, $descripcion, $fdesde, $fhasta, $idtipocondecoracion
    )
    {
        try {
            $query = Doctrine_Query::create()->update('NomCondecoracion')->where('idcondecoracion= ? ', $idcondecoracion);
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
            if ($idtipocondecoracion != '') {
                $query->set('idtipocondecoracion', '?', $idtipocondecoracion);
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
     * @param null $idcondecoracion
     *
     * @return bool
     * @throws Doctrine_Exception
     * @throws Exception
     */
    public function findByIdOrDenom($denom, $idcondecoracion = null, $idtipocondecoracion)
    {
        try {
            $query = Doctrine_Query::create()->from('NomCondecoracion nc')->innerJoin('nc.NomTipocondecoracion ntc')->where(
                'nc.fdesde <= now() and (nc.fhasta is null or nc.fhasta > now())'
            )->andWhere("nc.denominacion ilike '$denom'");
            if (!empty($idcondecoracion)) {
                $query->andWhere("idcondecoracion <> ?", $idcondecoracion);
            }
            if (!empty($idtipocondecoracion)) {
                $query->andWhere("ntc.idtipocondecoracion = ?", $idtipocondecoracion);
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

