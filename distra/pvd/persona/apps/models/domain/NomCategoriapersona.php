<?php

class NomCategoriapersona extends BaseNomCategoriapersona
{

    /**
     * Devuelve un objeto de la clase
     * @params $fhasta
     *
     * @return Doctrine_Record
     */
    public function getById($idcategoriapersona)
    {
        $modo = Utiles::reflectArray($idcategoriapersona);
        if (count($modo) > 0) {
            $query = Doctrine_Query::create()->from('NomCategoriapersona')->whereIn('idcategoriapersona', $modo);

            return $query->execute();
        }
    }

    public function modCategorias($idcategoriapersona, $denominacion, $alia, $descripcion, $fdesde, $fhasta)
    {
        try {
            $query = Doctrine_Query::create()->update('NomCategoriapersona')->where(
                'idcategoriapersona= ? ', $idcategoriapersona
            );
            if ($denominacion != '') {
                $query->set('denominacion', '?', $denominacion);
            }
            if ($alia != '') {
                $query->set('alia', '?', $alia);
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
     * @param $idcategoriapersona
     */
    public function findByIdOrDenom($denom, $idcategoriapersona = null, $idpadre)
    {
        try {
            $query = Doctrine_Query::create();
            $query->from('NomCategoriapersona')->where('fdesde <= now() and (fhasta is null or fhasta > now())')->andWhere(
                "denominacion ilike '$denom'"
            );
            if (!empty($idtipoformacion)) {
                $query->andWhere("idcategoriapersona <> ?", $idcategoriapersona);
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

    public function verifExiste($denom, $id = null)
    {
        $query = Doctrine_Query::create()->from('NomCategoriapersona')->where("denominacion ILIKE '$denom'");
        if ($id) {
            $query->andWhere('idcategoriapersona <> ?', $id);
        }

        return ($query->count() > 0) ? true : false;
    }

    public function getCategorias($activo = true)
    {
        try {
            $queryObj = Doctrine_Query::create();
            $queryObj->select(
                'idcategoriapersona as id, denominacion as text, *'
            )->from('NomCategoriapersona')->orderBy('idcategoriapersona ASC');
            if ($activo === true) {
                $queryObj->andWhere('fdesde <= now() AND (fhasta >= now() OR fhasta IS NULL)');
            }

            return $queryObj->fetchArray();
        } catch (Doctrine_Exception $e) {
            return $e;
        }
    }

    public function getCategoriasPadre($activo = true)
    {
        try {
            $queryObj = Doctrine_Query::create();
            $queryObj->select(
                'idcategoriapersona as id, denominacion as text, *'
            )->from('NomCategoriapersona')->where('idcategoriapersona = idpadre')->orderBy('idpadre ASC');
            if ($activo === true) {
                $queryObj->andWhere('fdesde <= now() AND (fhasta >= now() OR fhasta IS NULL)');
            }

            return $queryObj->fetchArray();
        } catch (Doctrine_Exception $e) {
            return $e;
        }
    }

    public function delCategorias($id)
    {
        try {
            Doctrine_Query::create()->delete('NomCategoriapersona')->whereIn(
                'idcategoriapersona', Utiles::reflectArray($id)
            )->execute();
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

}

