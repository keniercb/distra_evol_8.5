<?php

class NomJefefacultado extends BaseNomJefefacultado
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
     * @params $descripcion
     *
     * @return Doctrine_Record
     */
    public function getById($descripcion)
    {
        return Doctrine::getTable('NomJefefacultado')->find($descripcion);
    }

    /**
     * Funcion para obtener jefes facultados
     *
     * @param null $filtro
     * @param null $limit
     * @param int $start
     *
     * @return array
     * @throws Doctrine_Exception
     * @throws Exception
     */
    public function getFormEnteringFarActive($filtro = null, $limit = null, $start = 0)
    {
        try {
            $query = Doctrine_Query::create()->select(
                'idjefesfacultado,idjefesfacultado as idnomenclador, idcargopropuesto,fdesde,fhasta,
                descripcion, abreviatura'
            )->from('NomJefefacultado')->where('fdesde <= now() and (now() <= fhasta or fhasta is null)');
            if ($limit) {
                $query->limit($limit)->offset($start);
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
     * Funcion para obtener la cantidad de jefes facultados
     *
     * @param null $filtro
     *
     * @return int
     * @throws Doctrine_Exception
     * @throws Exception
     */
   public function getCantFormEnteringFarActive($filtro = null)
    {
        try {
            $query = Doctrine_Query::create()->from('NomJefefacultado')->where(
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


    public function modFormEnteringFar($idjefesfacultado, $idcargopropuesto, $abreviatura, $descripcion, $fdesde,
        $fhasta)
    {
        try {
            $query = Doctrine_Query::create()->update('NomJefefacultado')->where(
                'idjefesfacultado= ? ', $idjefesfacultado
            );
            if ($idcargopropuesto != '') {
                $query->set('idcargopropuesto', '?', $idcargopropuesto);
            }
            if ($abreviatura != '') {
                $query->set('abreviatura', '?', $abreviatura);
            }
            if ($descripcion != '') {
                $query->set('descripcion', '?', $descripcion);
            }
            if ($fdesde != '') {
                $query->set('fdesde', '?', $fdesde);
            }
            if ($fhasta != '') {
                $query->set('fhasta', '?', $fhasta);
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
     * @param $idviaingresofar
     */
    public function findByIdOrDenom($idcargopropuesto)
    {
        try {
            $query = Doctrine_Query::create();
            $query->from('NomJefefacultado')
                    ->where('fdesde <= now() and (fhasta is null or fhasta > now())')
                    ->andWhere("idcargopropuesto = ?", $idcargopropuesto);
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
    public function findById($idjefesfacultado)
    {
        try {
            $query = Doctrine_Query::create();
            $query->from('NomJefefacultado')->where('fdesde <= now() and (fhasta is null or fhasta > now())')
                  ->andWhere("idjefesfacultado = $idjefesfacultado");
            return $query->execute();
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

}

