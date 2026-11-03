<?php

class Nomestructalojamiento extends BaseNomestructalojamiento
{

    /**
     * Devuelve un objeto de la clase
     * @params $fhasta
     *
     * @return Doctrine_Record
     */
    public function getById($idestructuraalojamiento)
    {
        $modo = Utiles::reflectArray($idestructuraalojamiento);
        if (count($modo) > 0) {
            $query = Doctrine_Query::create()->from('Nomestructalojamiento')->whereIn('idestructuraalojamiento', $modo);

            return $query->fetchArray();
        }
    }

    public function modEst($idestructuraalojamiento, $denominacion, $fdesde, $fhasta)
    {
        $query = Doctrine_Query::create()
            ->update('Nomestructalojamiento')
            ->where(
                'idestructuraalojamiento= ? ', $idestructuraalojamiento
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
    public function findByIdOrDenom($denom, $idestructuraalojamiento = null, $idpadre)
    {
        try {
            $query = Doctrine_Query::create();
            $query->from('Nomestructalojamiento')->where('fdesde <= now() and (fhasta is null or fhasta > now())')->andWhere(
                "denominacion ilike '$denom'"
            );
            if (!empty($idtipoformacion)) {
                $query->andWhere("idestructuraalojamiento <> ?", $idestructuraalojamiento);
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
        $query = Doctrine_Query::create()->from('Nomestructalojamiento')->where("denominacion ILIKE '$denom'");
        if ($id) {
            $query->andWhere('idestructuraalojamiento <> ?', $id);
        }

        return ($query->count() > 0) ? true : false;
    }

    public function getEstructAlojamiento($activo = true)
    {
        try {
            //$queryObj = Doctrine_Query::create();
            $queryObj = "SELECT m.fhasta AS fhasta, m.fdesde AS fdesde, m.denominacion  as text, m.idpadre AS idpadre, m.idestructuraalojamiento  as id,m.*,
                         (select a.denominacion as denompadre from mod_personaext.nom_estructuraalojamiento as a where m.idpadre = a.idestructuraalojamiento)
                         FROM mod_personaext.nom_estructuraalojamiento m
                          WHERE (m.fdesde <= LOCALTIMESTAMP
                        (0) AND (m.fhasta >= LOCALTIMESTAMP(0) OR m.fhasta IS NULL)) ORDER BY m.idestructuraalojamiento ASC";
            /* $queryObj->select(
                 'ne.idestructuraalojamiento as id, ne.denominacion as text,ne.*,'
             )->from('Nomestructalojamiento as ne')->orderBy('idestructuraalojamiento ASC');
             if ($activo === true) {
                 $queryObj->andWhere('ne.fdesde <= now() AND (ne.fhasta >= now() OR ne.fhasta IS NULL)');
             }*/
            // print_r($queryObj->getSqlQuery());die;
            // return $queryObj->fetchArray();
            $dm = Doctrine_Manager::getInstance();
            $conn = $dm->getCurrentConnection();
            return $conn->fetchAll($queryObj);
        } catch (Doctrine_Exception $e) {
            return $e;
        }
    }

    public function getCategoriasPadre($activo = true)
    {
        try {
            $queryObj = Doctrine_Query::create();
            $queryObj->select(
                'idestructuraalojamiento as id, denominacion as text, *'
            )->from('Nomestructalojamiento')->where('idestructuratransportacion = idpadre')->orderBy('idpadre ASC');
            if ($activo === true) {
                $queryObj->andWhere('fdesde <= now() AND (fhasta >= now() OR fhasta IS NULL)');
            }

            return $queryObj->fetchArray();
        } catch (Doctrine_Exception $e) {
            return $e;
        }
    }

}

