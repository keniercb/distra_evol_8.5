<?php

class NomTipoorganizacion extends BaseNomTipoorganizacion
{

    /**
     * Constructor
     */
    public function setUp()
    {
        parent:: setUp();
        $this->hasMany('NomOrganizacion', array('local' => 'idtipoorganizacion', 'foreign' => 'idtipoorganizacion'));
    }

    /**
     * Devuelve un objeto de la clase
     * @params $fhasta
     *
     * @return Doctrine_Record
     */
    public function getById($idtipoorganizacion)
    {
        return Doctrine::getTable('NomTipoorganizacion')->find($idtipoorganizacion);
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
    public function getTypeOfOrganizationActive($filtro = null, $limit = null, $start = 0)
    {
        try {
            $query = Doctrine_Query::create()->select(
                'idtipoorganizacion,idtipoorganizacion as idnomenclador, denominacion, fdesde, fhasta, 
                descripcion, abreviatura'
            )->from('NomTipoorganizacion')->where('fdesde <= now() and (now() <= fhasta or fhasta is null)')
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
    public function getCantTypeOfOrganizationActive($filtro = null)
    {
        try {
            $query = Doctrine_Query::create()->from('NomTipoorganizacion')->where(
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
     * @param numeric $idcolorpiel
     * @param string $denominacion
     * @param string $descripcion
     * @param date $fdesde
     * @param date $fhasta
     *
     * @return boolean
     */
    public function modTypeOfOrganization($idtipoorganizacion, $denominacion, $abreviatura, $descripcion, $fdesde, $fhasta)
    {
        try {
            $query = Doctrine_Query::create()->update('NomTipoorganizacion')->where(
                'idtipoorganizacion= ? ', $idtipoorganizacion
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
     * Funcion para verificar si existe Sancion
     *
     * @param $denom
     * @param $idtipoorganizacion
     */
    public function findByIdOrDenom($denom, $idtipoorganizacion = null)
    {
        try {
            $query = Doctrine_Query::create();
            $query->from('NomTipoorganizacion')
                ->where('fdesde <= now() and (fhasta is null or fhasta > now())')
                ->andWhere(
                    "denominacion ilike '$denom'"
                );
            if (!empty($idtipoorganizacion)) {
                $query->andWhere("idtipoorganizacion <> ?", $idtipoorganizacion);
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

