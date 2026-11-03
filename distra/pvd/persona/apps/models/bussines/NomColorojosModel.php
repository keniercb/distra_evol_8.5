<?php

/**
 * Clase del negocio del nomenclador color de ojos
 * Class NomColorojosModel
 */
class NomColorojosModel extends ZendExt_Model
{

    protected $_objeyescolor;

    function __construct()
    {
        $this->_objeyescolor = new NomColorojos();
    }

    public function setUp()
    {
        parent::ZendExt_Model();
    }

    /**
     * Funcion para obtener los colores de ojos activos
     *
     * @param string $filtro
     * @param int $limit
     * @param int $start
     *
     * @return objectArray
     * @throws Exception
     */
    public function getColorActiveEyes($filtro, $limit, $start)
    {
        try {
            $tmp->data = $this->_objeyescolor->getColorActiveEyes($filtro, $limit, $start);
            $tmp->quantity = $this->_objeyescolor->getCantColorActiveEyes($filtro);

            return $tmp;
        } catch (Exception $e) {
            throw $e;
        }
    }

    /**
     * Funcion para adicionar un tipo de color de ojo
     *
     * @param object $objeyescolor
     *
     * @return numeric
     */
    public function addEyecolor($objeyescolor)
    {
        try {
            $objDomain = new NomColorojos();
            if (!$objDomain->findByIdOrDenomadd($objeyescolor->denominacion)) {
                $obj = new NomColorojos();
                foreach ($objeyescolor as $k => $v) {
                    $obj->$k = $v;
                }
                $obj->save();

                return $obj->idcolorojos;
            } else {
                return false;
            }
        } catch (Exception $e) {
            echo $e->getTraceAsString();
        }
    }

    /**
     * Funcion para modificar el tipo de color de ojos
     *
     * @param numeric $idcolorojos
     * @param string $denominacion
     * @param string $descripcion
     * @param date $fdesde
     * @param date $fhasta
     *
     * @return boolean
     */
    public function modEyecolor($idcolorojos, $denominacion, $abr, $descripcion, $fdesde, $fhasta)
    {
        try {
            if (!NomColorojos::findByIdOrDenom($denominacion, $idcolorojos)) {
                $objDomain = new NomColorojos();
                $result = $objDomain->modEyecolor($idcolorojos, $denominacion, $abr, $descripcion, $fdesde, $fhasta);
                if ($result) {
                    return $result;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        } catch (Exception $exc) {
            echo $exc->getTraceAsString();
        }
    }

    /**
     * Funcion para elieminar el tipo de color de ojos
     *
     * @param array $arrids
     *
     * @return type
     */
    public function delEyecolor($arrids)
    {
        try {
            $query = Doctrine_Query::create();
            $query->from('NomColorojos');
//            if (is_array($ids)) {
//                $query->whereIn('idcolorojos', $arrids);
//            } else
            if (is_numeric($arrids)) {
                $query->where('idcolorojos = ?', $arrids);
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
              $query->from('NomColorojos');
              if (is_array($ids)) {
                  $query->whereIn('idcolorojos', $arrids);
              } elseif (is_numeric($arrids)) {
                  $query->where('idcolorojos = ?', $arrids);
              }
              $result = $query->execute();
              return $result->delete();
          } catch (Doctrine_Exception $e) {
              if ($e->getCode() == 23503) { //Code for foreignKeyViolation
                  $r->exception = 1;
                  return $r;
              } else {
                  return (json_encode($e->getMessage()));
              }
          }*/
    }
}
