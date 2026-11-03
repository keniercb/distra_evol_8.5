<?php

class DatNomenclador extends BaseDatNomenclador
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
     * @params $idnomenclador
     *
     * @return Doctrine_Record
     */
    public function getById($idnomenclador)
    {
        return Doctrine::getTable('DatNomenclador')->find($idnomenclador);
    }

    public function getAllNomencladores(array $id, $filtro)
    {
        try {
            $query = Doctrine_Query::create()->select(
                'nom.idnomenclador as id,nom.denominacion as text,
                    nom.nombre as name,nom.icono as iconCls, false as checked,
                    true as leaf,nom.descripcion as qtip,nom.imagen, nom.agrupador, nom.agrupador as idpadre'
            )->from('DatNomenclador nom')->where('nom.visibilidad = 0')->orderBy('nom.denominacion');
            if (count($id) > 0) {
                $query->andWhereIn('nom.idnomenclador', $id);
            }
            if (!empty($filtro)) {
                $query->andWhere("nom.denominacion ilike '%$filtro%'");
            }

            return $query->execute()->toArray();
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    public function getNomencladores(array $id, $filtro, $limit, $start = 0)
    {
        try {
            $query = Doctrine_Query::create()->from('DatNomenclador nom')->orderBy('nom.denominacion');
            if (count($id) > 0) {
                $query->andWhereIn('nom.idnomenclador', $id);
            }
            if (!empty($filtro)) {
                $query->andWhere("nom.denominacion ilike '%$filtro%'");
            }
            if ($limit > 0) {
                $query->limit($limit)->offset($start);
            }

            return $query->execute()->toArray();
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    public function getCantNomencladores(array $id, $filtro)
    {
        try {
            $query = Doctrine_Query::create()->from('DatNomenclador nom')->orderBy('nom.denominacion');
            if (count($id) > 0) {
                $query->andWhereIn('nom.idnomenclador', $id);
            }
            if (!empty($filtro)) {
                $query->andWhere("nom.denominacion ilike '%$filtro%'");
            }

            return $query->count();
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }
}

