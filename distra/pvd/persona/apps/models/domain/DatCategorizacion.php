<?php

class DatCategorizacion extends BaseDatCategorizacion
{

    /**
     * Constructor
     */
    public function setUp()
    {
        parent:: setUp();
        $this->hasOne('DatPersona', array('local' => 'idpersona', 'foreign' => 'idpersona'));
        $this->hasOne('NomCategoria', array('local' => 'idcategoria', 'foreign' => 'idcategoria'));
    }

    /**
     * Devuelve un objeto de la clase
     * @params $idcategorizacion
     *
     * @return Doctrine_Record
     */
    public function getById($idcategorizacion)
    {
        try {
            $categ = self::reflectArray($idcategorizacion);
            $query = Doctrine_Query::create()->from('DatCategorizacion')->whereIn('idcategorizacion', $categ);

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
                'dc.*, nc.denominacion as denomcategoria, ntc.denominacion as denomtipocategoria,' .
                ' ntc.idtipocategoria as idtipocategoria'
            )->from('DatCategorizacion dc')->innerJoin('dc.NomCategoria nc')->innerJoin('nc.NomTipocategoria ntc');
            if (count($idpersona) > 0) {
                $query->andWhereIn('dc.idpersona', $idpersona);
            }
            if ($limit != null) {
                $query->limit($limit)->offset($start);
            }
            return (count($idpersona) > 0) ? $query->andWhereIn('dc.idpersona', $idpersona)->execute()->toArray() :
                array();
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    public function getCantCategoriasByPersona(array $idpersona)
    {
        try {
            $query = Doctrine_Query::create()->from('DatCategorizacion dc')->innerJoin('dc.NomCategoria nc')->innerJoin(
                'nc.NomTipocategoria ntc'
            );
            return (count($idpersona) > 0) ? $query->andWhereIn('dc.idpersona', $idpersona)->count() : 0;
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    public function delCategorias(array $id, array $idpersona)
    {
        try {
            $query = Doctrine_Query::create()->delete('DatCategorizacion');
            if (count($idpersona) > 0) {
                $query->andWhereIn('idpersona', $idpersona);
            }

            return (count($id) > 0) ? $query->andWhereIn('idcategorizacion', $id)->execute() : false;

        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }


    public function getCategoriasByPersonayTipo($idpersona, $idTipoCateg)
    {
        try {
            $sql
                = "SELECT nc.denominacion, dc.*
				 FROM mod_personaext.dat_categorizacion AS dc
				 INNER JOIN mod_personaext.nom_categoria AS nc ON (dc.idcategoria = nc.idcategoria)
				 WHERE dc.idpersona = $idpersona AND nc.idtipocategoria = $idTipoCateg";
            $mg = Doctrine_Manager::getInstance();
            $conn = $mg->getCurrentConnection();
            $result = $conn->fetchAll($sql);

            return $result;
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }
}