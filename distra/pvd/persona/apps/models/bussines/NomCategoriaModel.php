<?php

class NomCategoriaModel extends ZendExt_Model
{
    protected $objCategoria;

    protected $response;

    function __construct()
    {
        $this->objCategoria = new NomCategoria();
    }

    public function setUp()
    {
        parent::ZendExt_Model();
    }

    /**
     * @param null $idtipocategoria
     * @param null $filtro
     * @param null $limit
     * @param int $start
     *
     * @throws Exception
     */
    public function getCategoriaActivo($idtipocategoria,$filtro, $limit, $start, $todos)
    {
        try {
            $this->response->data = $this->objCategoria->getCategoriaActivo($idtipocategoria,$filtro, $limit, $start, $todos);
            $this->response->quantity = $this->objCategoria->getCantCategoriaActivo($idtipocategoria,$filtro);
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

    /**
     * @param $objCategoria
     *
     * @throws Exception
     */
    public function addCategoria($objCategoria)
    {
        try {
            if (!$this->objCategoria->findByIdOrDenom($objCategoria->denominacion, $objCategoria->idtipocategoria)) {
                $obj = new NomCategoria();
                foreach ($objCategoria as $k => $v) {
                    $obj->$k = $v;
                }
                $obj->save();

                return $obj->idcategoria;
            } else {
                return false;
            }
        } catch (Exception $e) {
            throw $e;
        }
    }

    /**
     * @param $idcategoria
     * @param $denominacion
     * @param $descripcion
     * @param $fdesde
     * @param $fhasta
     * @param $idtipocategoria
     *
     * @throws Exception
     */
    public function modCategoria($idcategoria, $denominacion, $abreviatura, $descripcion, $fdesde, $fhasta,
        $idtipocategoria)
    {
        try {
            $this->objCategoria = new NomCategoria();
            $result = $this->objCategoria->modCategoria(
                $idcategoria, $denominacion, $abreviatura, $descripcion, $fdesde, $fhasta, $idtipocategoria
            );
            if ($result) {
                return $result;
            } else {
                throw new Exception('La categoria ya existe', 3);
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
    public function delCategoria($arrids)
    {
        try {
            $query = Doctrine_Query::create();
            $query->from('NomCategoria');
            if (is_array($ids)) {
                $query->whereIn('idcategoria', $arrids);
            } elseif (is_numeric($arrids)) {
                $query->where('idcategoria = ?', $arrids);
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
        /* try {
             $query = Doctrine_Query::create();
             $query->from('NomCategoria');
             if (is_array($arrids)) {
                 $query->whereIn('idcategoria', $arrids);
             } elseif (is_numeric($arrids)) {
                 $query->where('idcategoria = ?', $arrids);
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

    public function getNomCategoriaById($idcategoria)
    {
        try {
            return $this->objCategoria->getNomCategoriaById($idcategoria);
        } catch (Exception $e) {
            throw $e;
        }
    }
}

