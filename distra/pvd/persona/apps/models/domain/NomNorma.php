<?php

class NomNorma extends BaseNomNorma
{

    /**
     * Constructor
     */
    public function setUp()
    {
        parent:: setUp();
        $this->hasMany('Confprendanorma', array('local' => 'idnorma', 'foreign' => 'idnorma'));
    }

    /**
     * Devuelve un objeto de la clase
     * @params $idnorma
     *
     * @return Doctrine_Record
     */
    public function getById($idnorma)
    {
        return Doctrine::getTable('NomNorma')->find($idnorma);
    }

    /**
     * Funcion para obtener los norma activos
     *
     * @param null $filtro
     * @param null $limit
     * @param int $start
     *
     * @return array
     * @throws Doctrine_Exception
     * @throws Exception
     */
    public function getActiveNorm($filtro = null, $limit = null, $start = 0, $value)
    {
        try {
            $query = Doctrine_Query::create()->select(
                'nn.idnorma, nn.denominacion, nn.fdesde, nn.fhasta, nn.descripcion, abreviatura,
                cf.idconftallaje,np.idprenda, nn.abreviatura as abreviatura')
                ->from('NomNorma nn')
                  ->leftJoin('nn.Confprendanorma cf')
                  ->leftJoin('cf.NomPrenda np')
                ->where('nn.fdesde <= now() and (now() <= nn.fhasta or nn.fhasta is null)')
                ->orderBy('nn.denominacion');

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
                $query->andWhere("nn.denominacion ilike '%$filtro%' or nn.descripcion ilike '%$filtro%'");
            }

            return $query->execute()->toArray();
        } catch (Doctrine_Exception $e){
            throw $e;
        }
    }

    /**
     * Funcion para obtener la cantidad de norma activos
     *
     * @param null $filtro
     *
     * @return int
     * @throws Doctrine_Exception
     * @throws Exception
     */
    public function getCantActiveNorm($filtro = null)
    {
        try {
            $query = Doctrine_Query::create()->from('NomNorma')->where(
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
     * Funcion para modifcar el tipo de norma
     *
     * @param type $idnorma
     * @param type $denominacion
     * @param type $descripcion
     * @param type $fdesde
     * @param type $fhasta
     *
     * @return boolean
     */
    public function modNorm($idnorma, $denominacion, $abreviatura, $descripcion, $fdesde, $fhasta)
    {
        try {
            $query = Doctrine_Query::create()->update('NomNorma')->where('idnorma= ? ', $idnorma);
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
     * @param $idnorma
     */
    public function findByIdOrDenom($denom, $idnorma)
    {
        try {
            $query = Doctrine_Query::create();
            $query->from('NomNorma')->where('fdesde <= now() and (fhasta is null or fhasta > now())')->andWhere(
                "denominacion ilike '$denom'"
            );
            if (!empty($idnorma)) {
                $query->andWhere("idnorma <> ?", $idnorma);
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

    public function findByIdOrDenomadd($denom, $idnorma = null)
    {
        try {
            $query = Doctrine_Query::create();
            $query->from('NomNorma')->where('fdesde <= now() and (fhasta is null or fhasta > now())')->andWhere(
                "denominacion ilike '$denom'"
            );
            if (!empty($idnorma)) {
                $query->andWhere("idnorma <> ?", $idnorma);
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

