<?php

/**
 * Clase del negocio del nomenclador color de pelo
 * Class NomColorpeloModel
 */
class NomColorpeloModel extends ZendExt_Model
{

    //$_objhaircolor=> objeto color de pelo
    protected $_objhaircolor = null;

    function __construct()
    {
        $this->_objhaircolor = new NomColorpelo();
    }

    public function setUp()
    {
        parent::ZendExt_Model();
    }

    /**
     * Funcion para obtener los colores de pelo activos
     *
     * @param string $filtro
     * @param int $limit
     * @param int $start
     *
     * @return abjectArray
     * @throws Exception
     */
    public function getColorActiveHair($filtro, $limit, $start)
    {
        try {
            $tmp->data = $this->_objhaircolor->getColorActiveHair($filtro, $limit, $start);
            $tmp->quantity = $this->_objhaircolor->getCantColorActiveHair($filtro);

            return $tmp;
        } catch (Exception $e) {
            throw $e;
        }
    }

    /**
     * Funcion para adicionar color de pelo
     *
     * @param object $objskincolor
     *
     * @return numeric
     */
    public function addHaircolor($objhaircolor)
    {
        try {
            $objDomain = new NomColorpelo();
            if (!$objDomain->findByIdOrDenomadd($objhaircolor->denominacion)) {
                $obj = new NomColorpelo();
                foreach ($objhaircolor as $k => $v) {
                    $obj->$k = $v;
                }
                $obj->save();

                return $obj->idcolorpelo;
            } else {
                return false;
            }
        } catch (Exception $e) {
            echo $e->getTraceAsString();
        }
    }

    /**
     * Funcion para maodificar color de piel
     *
     * @param numeric $idcolorpiel
     * @param string $denominacion
     * @param string $descripcion
     * @param date $fdesde
     * @param date $fhasta
     *
     * @return boolean
     */
    public function modHaircolor($idcolorpelo, $denominacion, $abr, $descripcion, $fdesde, $fhasta)
    {
        try {
            if (!NomColorpelo::findByIdOrDenom($denominacion, $idcolorpelo)) {
                $objDomain = new NomColorpelo();
                $result = $objDomain->modHaircolor($idcolorpelo, $denominacion, $abr, $descripcion, $fdesde, $fhasta);
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
     * Funcion para eliminar color de pelo
     *
     * @param array $arrids
     *
     * @return value
     */
    public function delHaircolor($arrids)
    {
        try {
            $query = Doctrine_Query::create();
            $query->from('NomColorpelo');
//            if (is_array($ids)) {
//                $query->whereIn('idcolorpelo', $arrids);
//            } else
            if (is_numeric($arrids)) {
                $query->where('idcolorpelo = ?', $arrids);
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
            $query->from('NomColorpelo');
            if (is_array($ids)) {
                $query->whereIn('idcolorpelo', $arrids);
            } elseif (is_numeric($arrids)) {
                $query->where('idcolorpelo = ?', $arrids);
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
