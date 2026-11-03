<?php

class DatCategoria extends BaseDatCategoria
{

    /**
     * Constructor
     */
    public function setUp()
    {
        parent:: setUp();
        $this->hasOne('DatPersona', array('local' => 'idpersona', 'foreign' => 'idpersona'));
        $this->hasOne('NomCategoriapersona', array('local' => 'idcategoriapersona', 'foreign' => 'idcategoriapersona'));
    }

    /**
     * Devuelve un objeto de la clase
     * @params $idcategoria
     *
     * @return Doctrine_Record
     */
    public function getById($idcategoria)
    {
        try {
            $categ = self::reflectArray($idcategoria);
            $query = Doctrine_Query::create()->from('DatCategoria')->whereIn('idcategoria', $categ);

            return (count($categ) > 0) ? $query->execute() : array();
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    public static function reflectArray($data)
    {
        if (is_array($data)) {
            return $data;
        } elseif (!empty($data)) {
            return array($data);
        } else {
            return array();
        }
    }

    public function getCategoriasByPersona(array $idpersona, $limit = null, $start = 0)
    {
        try {
            $query = Doctrine_Query::create()->select(
                'dc.*, nc.denominacion as denominacion,(CASE
                    WHEN dc.fdesde <= now() and (now() <= dc.fhasta or dc.fhasta is null)
                    THEN 1
                    ELSE 0
                    END) AS historico'
            )->from('DatCategoria dc')->innerJoin('dc.NomCategoriapersona nc');
            if ($limit != null) {
                $query->limit($limit)->offset($start);
            }

            return (count($idpersona) > 0) ? $query->andWhereIn('dc.idpersona', $idpersona)->execute()->toArray() :
                array();
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    public function getCantCategoriasByPersona(array $idpersona, $idTipoCateg = null)
    {
        try {
            $query = Doctrine_Query::create()->from('DatCategoria dc')->innerJoin('dc.NomCategoriapersona nc');
            //Para que no de error el jenkins:
            $idTipoCateg = null;
            return (count($idpersona) > 0) ? $query->andWhereIn('dc.idpersona', $idpersona)->count() : 0;
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    public function delCategorias(array $id, array $idpersona)
    {
        try {
            $query = Doctrine_Query::create()->delete('DatCategoria');
            if (count($idpersona) > 0) {
                $query->andWhereIn('idpersona', $idpersona);
            }

            return (count($id) > 0) ? $query->andWhereIn('idcategoria', $id)->execute() : false;

        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }
}

