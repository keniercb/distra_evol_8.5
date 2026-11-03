<?php

/**
 * Clase del negocio del nomenclador color de ojos
 * Class NomCursoModel
 */
class NomCursoModel extends ZendExt_Model
{

    protected $_objcurso;

    function __construct()
    {
        $this->_objcurso = new NomCurso();
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
    public function getCursoActivo($filtro, $limit, $start,$value)
    {
        try {
            $tmp->data = $this->_objcurso->getCursoActive($filtro, $limit, $start,$value);
            $tmp->quantity = $this->_objcurso->getCantCursoActive($filtro);

            return $tmp;
        } catch (Exception $e) {
            throw $e;
        }
    }

    /**
     * Funcion para adicionar un tipo de color de ojo
     *
     * @param object $objcurso
     *
     * @return numeric
     */
    public function addCurso($objcurso)
    {
        try {
            $objDomain = new NomCurso();
            if (!$objDomain->findByIdOrDenomadd($objcurso->denominacion)) {
                $obj = new NomCurso();
                foreach ($objcurso as $k => $v) {
                    $obj->$k = $v;
                }
                $obj->save();

                return $obj->idcurso;
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
     * @param numeric $idcurso
     * @param string $denominacion
     * @param string $descripcion
     * @param date $fdesde
     * @param date $fhasta
     *
     * @return boolean
     */
    public function modCurso($idcurso, $denominacion, $abreviatura, $descripcion, $fdesde, $fhasta)
    {
        try {
            if (!NomCurso::findByIdOrDenom($denominacion, $idcurso)) {
                $objDomain = new NomCurso();
                $result = $objDomain->modCurso($idcurso, $denominacion, $abreviatura, $descripcion, $fdesde, $fhasta);
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
    public function delCurso($arrids)
    {
        try {
            $query = Doctrine_Query::create();
            $query->from('NomCurso');
//            if (is_array($ids)) {
//                $query->whereIn('idcurso', $arrids);
//            } else
            if (is_numeric($arrids)) {
                $query->where('idcurso = ?', $arrids);
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
             $query->from('NomCurso');
             if (is_array($ids)) {
                 $query->whereIn('idcurso', $arrids);
             } elseif (is_numeric($arrids)) {
                 $query->where('idcurso = ?', $arrids);
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
