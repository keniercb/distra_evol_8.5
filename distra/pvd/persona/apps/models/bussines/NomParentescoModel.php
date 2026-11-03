<?php
/**
 * Created by PhpStorm.
 * User: olorenzo
 * Date: 3/06/16
 * Time: 14:54
 */
class NomParentescoModel extends ZendExt_Model
{
    protected $_objParentesco;
    protected $_response;

    function __construct()
    {
        $this->_objParentesco = new NomParentesco();
    }

    public function setUp()
    {
        parent::ZendExt_Model();
    }

    /**
     * Devuelve los parentescos activos
     * @param $filtro Filtro para la busqueda de los parentescos
     * @param $limit Limite de elementos a obtener
     * @param $start Numero del elemento a partir del cual se obtendran
     * @return mixed
     * @throws Exception
     */
    public function getParentescoActivo($filtro = null, $limit = null, $start = 0)
    {
        try {
            $this->_response->data = $this->_objParentesco->getParentescoActivo($filtro, $limit, $start);
            $this->_response->quantity = $this->_objParentesco->getCantParentescoActivo($filtro);
            return $this->_response;
        } catch (Exception $e) {
            throw $e;
        }
    }

    /**
     * Adiciona un parentesco
     * @param $objParentesco
     * @return bool
     * @throws Exception
     */
    public function addParentesco($objParentesco)
    {
        try {
            if (!$this->_objParentesco->findByIdOrDenom($objParentesco->denominacion)) {
                $obj = new NomParentesco();
                foreach ($objParentesco as $k => $v) {
                    $obj->$k = $v;
                }
                $obj->save();
                return $obj->idparentesco;
            } else {
                return false;
            }
        } catch (Exception $e) {
            throw $e;
        }
    }

    /**
     * Modifica un parentesco
     * @param $idparentesco Identificador del parentesco
     * @param $denominacion Denominacion del parentesco
     * @param $descripcion Descripcion del paremntesco
     * @param $fdesde Fecha en que inicia la vigencia del parentesco
     * @param $fhasta Fecha en que concluye la vigencia del parentesco
     * @return bool
     * @throws Exception
     */
    public function modParentesco($idparentesco, $denominacion, $abreviatura, $descripcion, $fdesde, $fhasta)
    {
        try {
            if (!$this->_objParentesco->findByIdOrDenom($denominacion, $idparentesco)) {
                $this->_objParentesco = new NomParentesco();
                $result = $this->_objParentesco->modParentesco(
                    $idparentesco, $denominacion, $abreviatura, $descripcion, $fdesde, $fhasta
                );
                return $result;
            } else {
                throw new Exception('EL Parentesco ya existe', 3);
            }
        } catch (Exception $e) {
            throw $e;
        }
    }

    /**
     * Elimina un parentesco
     * @param $arrids Arreglo de identificadores de parentescos para eliminar
     * @return bool
     * @throws Doctrine_Exception
     */
    public function delParentesco($arrids)
    {
        try {
            $data = Utiles::reflectArray($arrids);
            if (count($data) > 0) {
                $query = Doctrine_Query::create()
                    ->delete('NomParentesco')
                    ->whereIn('idparentesco', $data)
                    ->execute();
            } else {
                return false;
            }
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }
}