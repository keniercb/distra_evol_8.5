<?php

/**
 * Class DatEducacion
 */
class DatEducacion extends BaseDatEducacion
{

    /**
     * Constructor
     */
    public function setUp()
    {
        parent:: setUp();
        $this->hasOne('NomCentroestudio', array('local' => 'idcentroestudio', 'foreign' => 'idcentroestudio'));
        $this->hasOne('NomNiveleducacional', array('local' => 'idniveleducacional', 'foreign' => 'idniveleducacional'));
        $this->hasOne('NomTipoformacion', array('local' => 'idtipoformacion', 'foreign' => 'idtipoformacion'));
        $this->hasOne('NomModoformacion', array('local' => 'idmodoformacion', 'foreign' => 'idmodoformacion'));
        $this->hasOne('NomCurso', array('local' => 'idcurso', 'foreign' => 'idcurso'));
        $this->hasOne('DatPersona', array('local' => 'idpersona', 'foreign' => 'idpersona'));
    }

    /**
     * Devuelve un objeto de la clase
     * @params $ideducacion
     *
     * @return Doctrine_Record
     */
    public function getById($ideducacion)
    {
        $educ = $this->reflectArray($ideducacion);
        if (count($educ) > 0) {
            $query = Doctrine_Query::create()->from('DatEducacion')->whereIn('ideducacion', $educ);

            return $query->execute();
        }
    }

    /**
     * @param $data
     *
     * @return array
     */
    public function reflectArray($data)
    {
        if (is_array($data)) {
            return $data;
        } elseif (!empty($data)) {
            return array($data);
        } else {
            return array();
        }
    }

    /**
     * @param array $idpersona
     * @param       $filtro
     * @param       $limit
     * @param int $start
     *
     * @return array
     * @throws Doctrine_Exception
     * @throws Exception
     */
    public function getEducacionByPersona(array $idpersona, $limit, $start = 0)
    {
        try {
            $select
                = "de.*, nce.denominacion as denomcentroestudio, ntf.denominacion as denomtipoformacion,
            nmf.denominacion as denommodoformacion,cur.denominacion as curso, ntce.denominacion as tipocentroestudio,
            nce.idtipocentroestudio as idtipocentroestudio";
            $query = Doctrine_Query::create()
                ->select($select)
                ->from('DatEducacion de')
                ->leftJoin('de.NomCentroestudio nce')
                ->leftJoin('nce.NomTipocentroestudio ntce')
                ->leftJoin('de.NomTipoformacion ntf')
                ->leftJoin('de.NomCurso cur')
                ->leftJoin('de.NomModoformacion nmf');
            if (!empty($limit)) {
                $query->limit($limit)->offset($start);
            }

            return (count($idpersona) > 0) ? $query->andWhereIn('de.idpersona', $idpersona)->execute()->toArray() :
                array();
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    /**
     * @param array $idpersona
     * @param       $filtro
     *
     * @return int
     * @throws Doctrine_Exception
     * @throws Exception
     */
    public function getCantEducacionByPersona(array $idpersona)
    {
        try {
            $query = Doctrine_Query::create()->from('DatEducacion de')->leftJoin('de.NomCentroestudio nce')->leftJoin(
                'de.NomTipoformacion ntf'
            )->leftJoin('de.NomCurso cur')->leftJoin('de.NomModoformacion nmf');

            return (count($idpersona) > 0) ? $query->andWhereIn('de.idpersona', $idpersona)->count() : 0;
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    /**
     * @param array $id
     * @param array $idpersona
     *
     * @throws Doctrine_Exception
     * @throws Exception
     */
    public function delEducacion(array $id, array $idpersona)
    {
        try {
            $query = Doctrine_Query::create()->delete('DatEducacion');
            if (count($idpersona) > 0) {
                $query->andWhereIn('idpersona', $idpersona);
            }

            return (count($id) > 0) ? $query->andWhereIn('ideducacion', $id)->execute() : false;

        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    public function getPreparacionByPersona($idpersona, $idtipoformacion)
    {
        try {
            $query = Doctrine_Query::create()->select(
                "de.*"
            )->from('DatEducacion de')->leftJoin('de.NomCentroestudio nce')->leftJoin('de.NomTipoformacion tf')->leftJoin(
                'de.NomModoformacion mod'
            )->leftJoin('de.NomNiveleducacional nne')->where(
                "de.idpersona = '$idpersona' AND tf.idpadre = $idtipoformacion"
            );

             print_r($query->getSqlQuery());die;
            return $query->execute()->toArray();
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }


}