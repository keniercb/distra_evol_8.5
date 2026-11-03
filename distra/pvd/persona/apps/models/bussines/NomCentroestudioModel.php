<?php

class NomCentroestudioModel extends ZendExt_Model
{
    protected $objCentroEstudio;

    protected $response;

    function __construct()
    {
        $this->objCentroEstudio = new NomCentroestudio();
    }

    public function setUp()
    {
        parent::ZendExt_Model();
    }

    /**
     * @param null $idtipocentroestudio
     * @param null $filtro
     * @param null $limit
     * @param int $start
     *
     * @throws Exception
     */
    public function getCentroEstudioActivo($idtipocentroestudio = null, $filtro = null, $limit = null, $start = 0,$value)
    {

        try {
            $this->response->data = $this->objCentroEstudio->getCentroEstudioActivo(
                $this->reflectArray($idtipocentroestudio), $filtro, $limit, $start,$value
            );
            $this->response->quantity = $this->objCentroEstudio->getCantCentroEstudioActivo(
                $this->reflectArray($idtipocentroestudio), $filtro
            ) ;

            return $this->response;
        } catch (Exception $e) {
            throw $e;
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
     * @param $objCentroEstudio
     *
     * @throws Exception
     */
    public function addCentroEstudio($objCentroEstudio)
    {
        try {
            if (!$this->objCentroEstudio->findByIdOrDenom(
                $objCentroEstudio->denominacion, $objCentroEstudio->idtipocentroestudio
            )
            ) {
                $obj = new NomCentroestudio();
                foreach ($objCentroEstudio as $k => $v) {
                    $obj->$k = $v;
                }
                $obj->save();

                return $obj->idcentroestudio;
            } else {
                return false;
            }
        } catch (Exception $e) {
            throw $e;
        }
    }

    /**
     * @param $idcentroestudio
     * @param $denominacion
     * @param $descripcion
     * @param $fdesde
     * @param $fhasta
     * @param $idtipocentroestudio
     *
     * @throws Exception
     */
    public function modCentroEstudio(
        $idcentroestudio, $denominacion, $abreviatura, $descripcion, $fdesde, $fhasta, $idtipocentroestudio
    )
    {
        try {
            $this->objCentroEstudio = new NomCentroestudio();
            $result = $this->objCentroEstudio->modCentroEstudio(
                $idcentroestudio, $denominacion, $abreviatura, $descripcion, $fdesde, $fhasta, $idtipocentroestudio
            );
            if ($result) {
                return $result;
            } else {
                return false;
            }
        } catch (Exception $e) {
            throw $e;
        }
    }

    /**
     * @param $arrids
     *
     * @return Doctrine_Collection
     * @throws Doctrine_Exception
     * @throws Exception
     */
    public function delCentroEstudio($arrids)
    {
        try {
            $query = Doctrine_Query::create();
            $query->from('NomCentroestudio');
            if (is_array($ids)) {
                $query->whereIn('idcentroestudio', $arrids);
            } elseif (is_numeric($arrids)) {
                $query->where('idcentroestudio = ?', $arrids);
            }
            $result = $query->execute();
            if ($result->delete()) {
                $r['exception'] = 0;
            }

            return $r;
        } catch (Doctrine_Exception $e) {
            if ($e->getCode() == 23503) { //Code for foreignKeyViolation
                $r['exception'] = 1;

                return $r;
            } else {
                return (json_encode($e->getMessage()));
            }
        }
        /*try {
            $query = Doctrine_Query::create();
            $query->from('NomCentroestudio');
            if (is_array($arrids)) {
                $query->whereIn('idcentroestudio', $arrids);
            } elseif (is_numeric($arrids)) {
                $query->where('idcentroestudio = ?', $arrids);
            }
            $result = $query->execute();
            return $result->delete();
        } catch (Doctrine_Exception $e) {
            if ($e->getCode() == 23503) { //Code for foreignKeyViolation
                $r->exception = 1;
                return $r;
            } else {
                throw $e;
            }
        }*/
    }
}

