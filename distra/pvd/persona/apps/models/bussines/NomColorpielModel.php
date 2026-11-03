<?php

/**
 * Clase del negocio del nomenclador color de piel
 * Class NomColorpielModel
 */
class NomColorpielModel extends ZendExt_Model
{

    //$_objskincolor=> objeto color de piel
    protected $_objskincolor = null;

    function __construct()
    {
        $this->_objskincolor = new NomColorpiel();
    }

    public function setUp()
    {
        parent::ZendExt_Model();
    }

    /**
     * Funcion para obtener los colores de piel activos
     *
     * @param type $filtro
     * @param type $limit
     * @param type $start
     *
     * @return type
     * @throws Exception
     */
    public function getColorActiveSkin($filtro, $limit, $start)
    {
        try {
            $tmp->data = $this->_objskincolor->getColorActiveSkin($filtro, $limit, $start);
            $tmp->quantity = $this->_objskincolor->getCantColorActiveSkin($filtro);

            return $tmp;
        } catch (Exception $e) {
            throw $e;
        }
    }

    /**
     * Funcion para adicionar color de piel
     *
     * @param object $objskincolor
     *
     * @return numeric
     */
    public function addSkincolor($objskincolor)
    {
        try {
            $objDomain = new NomColorpiel();
            if (!$objDomain->findByIdOrDenomadd($objskincolor->denominacion)) {
                $obj = new NomColorpiel();
                foreach ($objskincolor as $k => $v) {
                    $obj->$k = $v;
                }
                $obj->save();

                return $obj->idcolorpiel;
            } else {
                return false;
            }
        } catch (Exception $e) {
            throw $e;
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
    public function modSkincolor($idcolorpiel, $denominacion, $abr, $descripcion, $fdesde, $fhasta)
    {
        try {
            if (!NomColorpiel::findByIdOrDenom($denominacion, $idcolorpiel)) {
                $objDomain = new NomColorpiel();
                $result = $objDomain->modSkincolor($idcolorpiel, $denominacion, $abr, $descripcion, $fdesde, $fhasta);
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
     * Funcion para eliminar color de piel
     *
     * @param type $arrids
     *
     * @return type
     */
    public function delSkincolor($arrids)
    {
        try {
            $query = Doctrine_Query::create();
            $query->from('NomColorpiel');
//            if (is_array($ids)) {
//                $query->whereIn('idcolorpiel', $arrids);
//            } else
            if (is_numeric($arrids)) {
                $query->where('idcolorpiel = ?', $arrids);
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
            $query->from('NomColorpiel');
            if (is_array($ids)) {
                $query->whereIn('idcolorpiel', $arrids);
            } elseif (is_numeric($arrids)) {
                $query->where('idcolorpiel = ?', $arrids);
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
