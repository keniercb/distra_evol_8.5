<?php

class NomTitulo extends BaseNomTitulo
{

    /**
     * Constructor
     */
    public function setUp()
    {
        parent:: setUp();
        $this->hasOne('NomNiveleducacional', array('local' => 'idniveleducacional', 'foreign' => 'idniveleducacional'));
        //$this->hasMany('DatEducacion', array('local' => 'idtitulo', 'foreign' => 'idtitulo'));
    }

    /**
     * Devuelve un objeto de la clase
     * @params $idtitulo
     *
     * @return Doctrine_Record
     */
    public function getById($idtitulo)
    {
        return Doctrine::getTable('NomTitulo')->find($idtitulo);
    }

    /**
     * @param null $filtro
     * @param null $limit
     * @param int $start
     *
     * @throws Doctrine_Exception
     * @throws Exception
     */
    public function getTitleActive($filtro = null, $limit = null, $start = 0,$idtitulo,$value)
    {
        try {
            $query = Doctrine_Query::create()->select('*, idtitulo as idnomenclador')->from('NomTitulo')->where(
                'fdesde <= now() and (now() <= fhasta or fhasta is null)'
            );
            if($value){
                //$query->limit(500)->offset(0);

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
     * @throws Doctrine_Exception
     * @throws Exception
     */
    public function getCantTitleActive($filtro = null)
    {
        try {
            $query = Doctrine_Query::create()->from('NomTitulo')->where(
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
     * @param $idtitulo
     * @param $denominacion
     * @param $descripcion
     * @param $fdesde
     * @param $fhasta
     */
    public function modTitle(
        $idtitulo, $denominacion, $abr, $descripcion, $fdesde, $fhasta, $idniveleducacional, $idespecialidad, $codigo
    )
    {
        try {
            $query = Doctrine_Query::create()->update('NomTitulo')->where('idtitulo= ? ', $idtitulo);
            if ($denominacion != '') {
                $query->set('denominacion', '?', $denominacion);
            }
            if ($idniveleducacional != '') {
                $query->set('idniveleducacional', '?', $idniveleducacional);
            } else {
                $query->set('idniveleducacional', 'null');
            }
            if ($codigo != '') {
                $query->set('codigo', '?', $codigo);
            } else {
                $query->set('codigo', 'null');
            }
            if ($abr != '') {
                $query->set('abreviatura', '?', $abr);
            } else {
                $query->set('abreviatura', 'null');
            }
            if ($descripcion != '') {
                $query->set('descripcion', '?', $descripcion);
            } else {
                $query->set('descripcion', 'null');
            }
            if ($idespecialidad != '') {
                $query->set('idespecialidad', '?', $idespecialidad);
            } else {
                $query->set('idespecialidad', 'null');
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
     * @param null $idtitulo
     *
     * @throws Doctrine_Exception
     * @throws Exception
     */
    public function findByIdOrDenom($denom, $idtitulo = null)
    {
        try {
            $query = Doctrine_Query::create();
            $query->from('NomTitulo')->where('fdesde <= now() and (fhasta is null or fhasta > now())')->andWhere(
                "denominacion ilike '$denom'"
            );
//            if (!empty($idcolorojos)) {
//                $query->andWhere("idtitulo <> ?", $idtitulo);
//            }
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

