<?php

class NomTipocategoriaModel extends ZendExt_Model
{
    protected $objTipoCategoria;

    protected $response;

    function __construct()
    {
        $this->objTipoCategoria = new NomTipocategoria();
    }

    public function setUp()
    {
        parent::ZendExt_Model();
    }

    /**
     * @param $filtro
     * @param $limit
     * @param $start
     *
     * @throws Exception
     */
    public function getTipoCategoriaActive($filtro, $limit, $start, $todos)
    {
        try {
            $this->response->data = $this->objTipoCategoria->getTipoCategoriaActive($filtro, $limit, $start, $todos);
            $this->response->quantity = $this->objTipoCategoria->getCantTipoCategoriaActive($filtro);
            return $this->response;
        } catch (Exception $e) {
            throw $e;
        }
    }

    /**
     * @param $objTipoCategoria
     *
     * @throws Exception
     */
    public function addTipoCategoria($objTipoCategoria)
    {
        try {
            if (!$this->objTipoCategoria->findByIdOrDenom($objTipoCategoria->denominacion)) {
                $obj = new NomTipocategoria();
                foreach ($objTipoCategoria as $k => $v) {
                    $obj->$k = $v;
                }
                $obj->save();

                return $obj->idtipocategoria;
            } else {
                return false;
            }
        } catch (Exception $e) {
            throw $e;
        }
    }

    /**
     * @param $idtipocategoria
     * @param $denominacion
     * @param $descripcion
     * @param $fdesde
     * @param $fhasta
     *
     * @throws Exception
     */
    public function modTipoCategoria($idtipocategoria, $denominacion, $abreviatura, $descripcion, $fdesde, $fhasta)
    {
        try {
            if (!$this->objTipoCategoria->findByIdOrDenom($denominacion, $idtipocategoria)) {
                $this->objTipoCategoria = new NomTipocategoria();
                $result = $this->objTipoCategoria->modTipoCategoria(
                    $idtipocategoria, $denominacion, $abreviatura, $descripcion, $fdesde, $fhasta
                );

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
    public function delTipoCategoria($arrids)
    {
        try {
            $query = Doctrine_Query::create();
            $query->from('NomTipocategoria');
            if (is_array($arrids)) {
                $query->whereIn('idtipocategoria', $arrids);
            } elseif (is_numeric($arrids)) {
                $query->where('idtipocategoria = ?', $arrids);
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
        }
    }

    public function getTipoCategoriaActivaByParams($ids, $in = true, $limit = null, $start = 0)
    {
        try {
            $this->response->data = $this->objTipoCategoria->getTipoCategoriaActivaByParams(
                self::reflectArray($ids), $in, $limit, $start
            );
            $this->response->quantity = ($limit > 0) ? $this->objTipoCategoria->getCantTipoCategoriaActivaByParams(
                self::reflectArray($ids), $in
            ) : count($this->response->data);

            return $this->response;
        } catch (Exception $e) {
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
}