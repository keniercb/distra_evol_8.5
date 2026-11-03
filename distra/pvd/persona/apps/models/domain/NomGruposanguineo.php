<?php

class NomGruposanguineo extends BaseNomGruposanguineo
{

    /**
     * Constructor
     */
    public function setUp()
    {
        parent:: setUp();
    }

    /**
     * Devuelve un objeto de la clase
     * @params $idgruposanguineo
     *
     * @return Doctrine_Record
     */
    public function getById($idgruposanguineo)
    {
        return Doctrine::getTable('NomGruposanguineo')->find($idgruposanguineo);
    }

    /**
     * Funcion para obtener los grupo sanguíneoo activos
     *
     * @param null $filtro
     * @param null $limit
     * @param int $start
     *
     * @return array
     * @throws Doctrine_Exception
     * @throws Exception
     */
    public function getBloodActiveGroup($filtro = null, $limit = null, $start = 0)
    {
        try {
            $query = Doctrine_Query::create()->select(
                'idgruposanguineo,idgruposanguineo as idnomenclador,denominacion,fdesde,fhasta, abreviatura,
                descripcion'
            )->from('NomGruposanguineo')->where('fdesde <= now() and (now() <= fhasta or fhasta is null)')
                ->orderBy('denominacion');
            if ($limit) {
                $query->limit($limit)->offset($start);
            }  else {
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
     * Funcion para obtener la cantidad de grupo sanguíneoo activos
     *
     * @param null $filtro
     *
     * @return int
     * @throws Doctrine_Exception
     * @throws Exception
     */
    public function getCantBloodActiveGroup($filtro = null)
    {
        try {
            $query = Doctrine_Query::create()->from('NomGruposanguineo')->where(
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
     * Funcion para maodificar color de piel
     *
     * @param numeric $idcolorpiel
     * @param string $denominacion
     * @param string $descripcion
     * @param date $fdesde
     * @param date $fhasta
     *
     * @return boolean
     */
    public function modBloodgroup($idgruposanguineo, $denominacion, $abreviatura, $descripcion, $fdesde, $fhasta)
    {
        try {
            $query = Doctrine_Query::create()->update('NomGruposanguineo')->where(
                'idgruposanguineo= ? ', $idgruposanguineo
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
     * Funcion para verificar si existe el color
     *
     * @param $denom
     * @param $idgruposanguineo
     */
    public function findByIdOrDenom($denom, $idgruposanguineo = null)
    {
        try {
            $query = Doctrine_Query::create();
            $query->from('NomGruposanguineo')->where('fdesde <= now() and (fhasta is null or fhasta > now())')
                ->andWhere(
                    "denominacion ilike '$denom'"
                );
            if (!empty($idgruposanguineo)) {
                $query->andWhere("idgruposanguineo <> ?", $idgruposanguineo);
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

