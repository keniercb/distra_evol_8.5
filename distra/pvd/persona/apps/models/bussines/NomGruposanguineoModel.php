<?php

class NomGruposanguineoModel extends ZendExt_Model
{
    //$_objblodgroup=> objeto grupo sanguíneos
    protected $_objblodgroup = null;

    function __construct()
    {
        $this->_objblodgroup = new NomGruposanguineo();
    }

    public function setUp()
    {
        parent::ZendExt_Model();
    }

    /**
     * Funcion para obtener los grupo sanguíneo activos
     *
     * @param string $filtro
     * @param int $limit
     * @param int $start
     *
     * @return objectArray
     * @throws Exception
     */
    public function getBloodActiveGroup($filtro, $limit, $start)
    {
        try {
            $tmp->data = $this->_objblodgroup->getBloodActiveGroup($filtro, $limit, $start);
            $tmp->quantity = $this->_objblodgroup->getCantBloodActiveGroup($filtro);

            return $tmp;
        } catch (Exception $e) {
            throw $e;
        }
    }

    /**
     * Funcion para adicionar un tipo de grupo sanguíneo
     *
     * @param object $$objblodgroup
     *
     * @return numeric
     */
    public function addBloodgroup($objblodgroup)
    {
        try {
            $objDomain = new NomGruposanguineo();
            if (!$objDomain->findByIdOrDenom($objblodgroup->denominacion)) {
                $obj = new NomGruposanguineo();
                foreach ($objblodgroup as $k => $v) {
                    $obj->$k = $v;
                }
                $obj->save();

                return $obj->idgruposanguineo;
            } else {
                return false;
            }
        } catch (Exception $e) {
            echo $e->getTraceAsString();
        }
    }

    /**
     * Funcion para modificar el tipo de grupo sanguíneos
     *
     * @param numeric $idgruposanguineo
     * @param string $denominacion
     * @param string $descripcion
     * @param date $fdesde
     * @param date $fhasta
     *
     * @return boolean
     */
    public function modBloodgroup($idgruposanguineo, $denominacion, $abr, $descripcion, $fdesde, $fhasta)
    {
        try {
            $objDomain = new NomGruposanguineo();
            $result = $objDomain->modBloodgroup($idgruposanguineo, $denominacion, $abr, $descripcion, $fdesde,
                $fhasta);
            if ($result) {
                return $result;
            } else {
                return false;
            }

        } catch (Exception $exc) {
            echo $exc->getTraceAsString();
        }
    }

    /**
     * Funcion para elieminar el tipo de grupo sanguíneos
     *
     * @param array $arrids
     *
     * @return type
     */
    public function delBloodgroup($arrids)
    {
        try {
            $query = Doctrine_Query::create();
            $query->from('NomGruposanguineo');
//            if (is_array($ids)) {
//                $query->whereIn('idgruposanguineo', $arrids);
//            } else
            if (is_numeric($arrids)) {
                $query->where('idgruposanguineo = ?', $arrids);
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
        /*  try {
              $query = Doctrine_Query::create();
              $query->from('NomGruposanguineo');
              if (is_array($ids)) {
                  $query->whereIn('idgruposanguineo', $arrids);
              } elseif (is_numeric($arrids)) {
                  $query->where('idgruposanguineo = ?', $arrids);
              }
              $result = $query->execute();
              return $result->delete();
          } catch (Doctrine_Exception $e) {
              if ($e->getCode() == 23503) {//Code for foreignKeyViolation
                  $r->exception = 1;
                  return $r;
              } else {
                  return (json_encode($e->getMessage()));
              }
          }*/
    }
}

