<?php

class DatFoto extends BaseDatFoto
{

    /**
     * Constructor
     */
    public function setUp()
    {
        parent:: setUp();
        $this->hasOne('DatPersona', array('local' => 'idpersona', 'foreign' => 'idpersona'));
    }

    /**
     * Devuelve un objeto de la clase
     * @params $idfoto
     *
     * @return Doctrine_Record
     */
    public function getById($idfoto)
    {
        if (is_array($idfoto)) {
            $query = Doctrine_Query::create()->from('DatFoto')->whereIn('idfoto', $idfoto);

            return $query->execute();
        } else {
            return Doctrine::getTable('DatFoto')->find($idfoto);
        }
    }

    public function getFotosByPersona($idpersona, $filtro, $limit, $start = 0, array $arrImgs, $in = true)
    {
        try {
            $query = Doctrine_Query::create()->select(
                "df.*, (encode(df.foto,'escape')) as imgbase64, " .
                "('data:image/jpg;base64,'||(encode(df.foto,'escape'))) as foto"
            )->from('DatFoto df')->where('df.idpersona = ?', $idpersona)->orderBy('df.principal DESC');
            if ($limit) {
                $query->limit($limit)->offset($start);
            }
            if ($filtro) {
                $query->andWhere("df.descripcion ilike '$filtro'");
            }
            if (count($arrImgs) > 0) {
                if ($in) {
                    $query->andWhereIn('df.idfoto', $arrImgs);
                } else {
                    $query->andWhereNotIn('df.idfoto', $arrImgs);
                }
            }

            return $query->execute()->toArray();
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    public function getCantFotosByPersona($idpersona, $filtro, array $arrImgs, $in = true)
    {
        try {
            $query = Doctrine_Query::create()->from('DatFoto df')->where('df.idpersona = ?', $idpersona);
            if ($filtro) {
                $query->andWhere("df.descripcion ilike '$filtro'");
            }
            if (count($arrImgs) > 0) {
                if ($in) {
                    $query->andWhereIn('df.idfoto', $arrImgs);
                } else {
                    $query->andWhereNotIn('df.idfoto', $arrImgs);
                }
            }

            return $query->count();
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    public function getFotoPrincipalByPersona(array $idpersona, $limit, $start = 0)
    {
        try {
            $query = Doctrine_Query::create()->select(
                "df.*, (encode(df.foto,'escape')) as imgbase64, " .
                "('data:image/jpg;base64,'||(encode(df.foto,'escape'))) as foto"
            )->from('DatFoto df')->whereIn('df.idpersona', $idpersona)->andWhere('df.principal = ?', 1);
            if ($limit) {
                $query->limit($limit)->offset($start);
            }
            return $query->execute()->toArray();
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    public function delFotos(array $idfotos, array $idpersona)
    {
        try {
            if (count($idfotos) > 0) {
                $query = Doctrine_Query::create()->delete('DatFoto')->whereIn('idfoto', $idfotos);
                if ($idpersona) {
                    $query->andWhereIn('idpersona', $idpersona);
                }
                $query->execute();
            }
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    public function updatePrincipalFoto(array $idfoto, $campo, $valor)
    {
        try {
            $query = Doctrine_Query::create()->update('DatFoto')
                ->set($campo, $valor)->whereIn('idfoto', $idfoto)->execute();
            //$query->execute();
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }
}