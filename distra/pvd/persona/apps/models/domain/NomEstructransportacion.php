<?php

class NomEstructransportacion extends BaseNomEstructransportacion
{

    /**
     * Devuelve un objeto de la clase
     * @params $fhasta
     *
     * @return Doctrine_Record
     */
    public function getById($idestructuratransportacion)
    {
        $modo = Utiles::reflectArray($idestructuratransportacion);
        if (count($modo) > 0) {
            $query = Doctrine_Query::create()->from('NomEstructransportacion')->whereIn('idestructuratransportacion', $modo);

            return $query->fetchArray();
        }
    }

   public function modEst($idestructuratransportacion, $denominacion, $fdesde, $fhasta)
    {
        $query = Doctrine_Query::create()->update('NomEstructransportacion')->where(
            'idestructuratransportacion= ? ', $idestructuratransportacion
        );
        if ($denominacion != '') {
            $query->set('denominacion', '?', $denominacion);
        }
        if ($fdesde != '') {
            $query->set('fdesde', '?', $fdesde);
        }
        if ($fhasta != '') {
            $query->set('fhasta', '?', $fhasta);
        } else {
            $query->set('fhasta', 'null');
        }
        $query->execute();

    }

    /**
     * Funcion para verificar si existe el color
     *
     * @param $denom
     * @param $idcategoriapersona
     */
public function findByIdOrDenom($denom, $idestructuratransportacion = null, $idpadre)
    {
        try {
            $query = Doctrine_Query::create();
            $query->from('NomEstructransportacion')->where('fdesde <= now() and (fhasta is null or fhasta > now())')->andWhere(
                "denominacion ilike '$denom'"
            );
            if (!empty($idtipoformacion)) {
                $query->andWhere("idestructuratransportacion <> ?", $idestructuratransportacion);
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
        $query = Doctrine_Query::create()->from('NomEstructransportacion')->where("denominacion ILIKE '$denom'");
        if ($id) {
            $query->andWhere('idestructuratransportacion <> ?', $id);
        }

        return ($query->count() > 0) ? true : false;
    }

    public function getEstrucTransportacion($activo = true)
    {
        try {
            $queryObj = Doctrine_Query::create();
            $queryObj->select(
                'ne.idestructuratransportacion as id, ne.denominacion as text,ne.*'
            )->from('NomEstructransportacion as ne')->orderBy('idestructuratransportacion ASC');
            if ($activo === true) {
                $queryObj->andWhere('ne.fdesde <= now() AND (ne.fhasta >= now() OR ne.fhasta IS NULL)');
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
                'idestructuratransportacion as id, denominacion as text, *'
            )->from('NomEstructransportacion')->where('idestructuratransportacion = idpadre')->orderBy('idpadre ASC');
            if ($activo === true) {
                $queryObj->andWhere('fdesde <= now() AND (fhasta >= now() OR fhasta IS NULL)');
            }

            return $queryObj->fetchArray();
        } catch (Doctrine_Exception $e) {
            return $e;
        }
    }


}

